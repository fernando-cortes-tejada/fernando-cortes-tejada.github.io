/**
 * Hero portrait drawn by Brownian bridges.
 *
 * Points are sampled from the cut-out portrait with density proportional to
 * local detail (edges + darkness, inside the alpha mask). Each point is the
 * terminal value of a Brownian bridge that starts from a common origin on
 * the left: x plays the role of time, y(s) = y0 + (y1 - y0)s + σ(W_s - sW_1).
 * Drawn together, the paths read as a Monte Carlo fan chart that resolves
 * into a face.
 */

type Rgb = [number, number, number];

interface Labels {
  simulating: string;
  converged: string;
  pathLabel: string;
}

const STEPS = 48;
const SIGMA = 0.2; // bridge volatility, in units of canvas height
const DURATION = 2800; // ms for the whole simulation
const SPREAD = 0.4; // fraction of DURATION over which path starts are staggered
const ORIGIN = { x: -0.02, y: 0.56 }; // normalized, just off the left edge
const CROP = 1.2; // stage height / width (5:6)

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

interface Sample {
  x: Float32Array; // normalized terminal positions
  y: Float32Array;
  r: Float32Array; // dot radius in css px
  color: string[];
  /** the sampling weights, on the W×H grid */
  density: { w: number; h: number; weight: Float32Array };
}

/** Weighted stippling of the portrait. */
function stipple(img: HTMLImageElement, n: number, rand: () => number): Sample {
  // use the top CROP of the image (head and shoulders), matching the stage's aspect ratio
  const W = 220;
  const srcH = img.naturalWidth * CROP;
  const H = Math.round((W * srcH) / img.naturalWidth);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, img.naturalWidth, srcH, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  const lum = new Float32Array(W * H);
  const alpha = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = data[4 * i], g = data[4 * i + 1], b = data[4 * i + 2];
    lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    alpha[i] = data[4 * i + 3] / 255;
  }

  // stretch contrast between the 5th and 97th percentile of the subject's luminance
  const inside = Array.from(lum).filter((_, i) => alpha[i] > 0.5).sort((a, b) => a - b);
  const lo = inside[Math.floor(inside.length * 0.05)] ?? 0;
  const hi = inside[Math.floor(inside.length * 0.97)] ?? 1;
  for (let i = 0; i < W * H; i++) lum[i] = Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo)));

  // blur before edge detection so the knit of the sweater does not count as detail
  const blurred = boxBlur(boxBlur(lum, W, H), W, H);
  const weight = new Float32Array(W * H);
  let total = 0;
  for (let y = 1; y < H - 1; y++) {
    // spend more points on the face than the sweater, easing from 1 to 0.22 across the shoulders
    const f = Math.min(1, Math.max(0, (y / H - 0.54) / 0.12));
    const head = 1 - 0.78 * f * f * (3 - 2 * f);
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      if (alpha[i] < 0.5) continue;
      const L = (dx: number, dy: number) => blurred[i + dy * W + dx];
      const gx = L(1, -1) + 2 * L(1, 0) + L(1, 1) - L(-1, -1) - 2 * L(-1, 0) - L(-1, 1);
      const gy = L(-1, 1) + 2 * L(0, 1) + L(1, 1) - L(-1, -1) - 2 * L(0, -1) - L(1, -1);
      const edge = Math.min(1, Math.hypot(gx, gy) * 2.2);
      // light-on-dark: bright skin is dense, dark hair and beard are sparse
      const w = alpha[i] * head * (0.015 + lum[i] ** 3.5 + 0.6 * edge);
      weight[i] = w;
      total += w;
    }
  }

  const cdf = new Float64Array(W * H);
  let acc = 0;
  for (let i = 0; i < W * H; i++) {
    acc += weight[i];
    cdf[i] = acc;
  }

  const out: Sample = {
    x: new Float32Array(n),
    y: new Float32Array(n),
    r: new Float32Array(n),
    color: new Array(n),
    density: { w: W, h: H, weight },
  };
  for (let k = 0; k < n; k++) {
    const target = rand() * total;
    let a = 0, b = cdf.length - 1;
    while (a < b) {
      const mid = (a + b) >> 1;
      if (cdf[mid] < target) a = mid + 1;
      else b = mid;
    }
    const px = a % W, py = (a / W) | 0;
    out.x[k] = (px + rand()) / W;
    out.y[k] = (py + rand()) / H;
    out.r[k] = 0.45 + rand() * 0.7;
    out.color[k] = tint([data[4 * a], data[4 * a + 1], data[4 * a + 2]], lum[a], py / H > 0.62 ? 0.62 : 1.25);
  }
  return out;
}

function boxBlur(src: Float32Array, W: number, H: number) {
  const out = new Float32Array(W * H);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) sum += src[(y + dy) * W + x + dx];
      out[y * W + x] = sum / 9;
    }
  }
  return out;
}

/** Paint the sampling density as a heatmap (dark blue → light blue → amber → cream). */
function drawDensity(canvas: HTMLCanvasElement, { w, h, weight }: Sample['density']) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  // scale to the 99th percentile so a few edge pixels do not wash out the rest
  const nz = Array.from(weight).filter((v) => v > 0).sort((a, b) => a - b);
  const top = nz[Math.floor(nz.length * 0.99)] || 1;
  const stops: Rgb[] = [[29, 58, 82], [124, 184, 214], [242, 165, 65], [255, 243, 220]];
  for (let i = 0; i < w * h; i++) {
    if (weight[i] <= 0) continue;
    const t = Math.min(1, Math.sqrt(weight[i] / top));
    const u = t * (stops.length - 1);
    const k = Math.min(stops.length - 2, Math.floor(u));
    const f = u - k;
    for (let c = 0; c < 3; c++) img.data[4 * i + c] = stops[k][c] + (stops[k + 1][c] - stops[k][c]) * f;
    img.data[4 * i + 3] = Math.round(255 * Math.min(1, 0.25 + t));
  }
  ctx.putImageData(img, 0, 0);
}

/** Keep photo colors but lift dark tones toward steel blue so they read on a dark ground;
 * `lift` < 1 dims the sweater so the face carries the image. */
function tint([r, g, b]: Rgb, l: number, lift: number): string {
  const steel: Rgb = [112, 158, 190];
  const t = Math.max(0, 0.42 - l) / 0.42; // 1 for black, 0 above mid-gray
  const mix = (c: number, s: number) => Math.round(Math.min(255, c * lift * (1 - t) + s * t));
  return `rgb(${mix(r, steel[0])},${mix(g, steel[1])},${mix(b, steel[2])})`;
}

export function mountPathPortrait(root: HTMLElement, labels: Labels) {
  const img = root.querySelector<HTMLImageElement>('img.photo')!;
  const trails = root.querySelector<HTMLCanvasElement>('canvas.trails')!;
  const dots = root.querySelector<HTMLCanvasElement>('canvas.dots')!;
  const hl = root.querySelector<HTMLCanvasElement>('canvas.highlight')!;
  const densityCanvas = root.querySelector<HTMLCanvasElement>('canvas.density')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const tip = root.querySelector<HTMLElement>('[data-tip]')!;
  const modeButtons = root.querySelectorAll<HTMLButtonElement>('[data-mode]');
  const resim = root.querySelector<HTMLButtonElement>('[data-resimulate]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let sample: Sample;
  let paths: Float32Array; // y-values per path per step, normalized
  let delays: Float32Array;
  let drawnStep: Int16Array;
  let n = 0;
  let seed = 7;
  let raf = 0;
  let done = false;
  let size = { w: 0, h: 0, dpr: 1 };

  const fmt = new Intl.NumberFormat(document.documentElement.lang);

  function resize() {
    const rect = root.querySelector<HTMLElement>('.stage')!.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = { w: rect.width, h: rect.height, dpr };
    for (const c of [trails, dots, hl]) {
      c.width = Math.round(rect.width * dpr);
      c.height = Math.round(rect.height * dpr);
      c.getContext('2d')!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function simulate() {
    const rand = mulberry32(seed);
    n = size.w < 420 ? 3600 : 6500;
    sample = stipple(img, n, rand);
    drawDensity(densityCanvas, sample.density);
    paths = new Float32Array(n * (STEPS + 1));
    delays = new Float32Array(n);
    drawnStep = new Int16Array(n);
    for (let i = 0; i < n; i++) {
      // random walk W, then pin both ends to get a bridge
      let w = 0;
      const walk = new Float32Array(STEPS + 1);
      for (let k = 1; k <= STEPS; k++) {
        w += gaussian(rand) / Math.sqrt(STEPS);
        walk[k] = w;
      }
      const y1 = sample.y[i];
      for (let k = 0; k <= STEPS; k++) {
        const s = k / STEPS;
        paths[i * (STEPS + 1) + k] = ORIGIN.y + (y1 - ORIGIN.y) * s + SIGMA * (walk[k] - s * walk[STEPS]);
      }
      delays[i] = rand() * SPREAD;
    }
  }

  const X = (i: number, k: number) => (ORIGIN.x + (sample.x[i] - ORIGIN.x) * (k / STEPS)) * size.w;
  const Y = (i: number, k: number) => paths[i * (STEPS + 1) + k] * size.h;

  /** Draw the simulation at time T in [0, 1]; trails accumulate across calls. */
  function draw(T: number) {
    const tctx = trails.getContext('2d')!;
    const dctx = dots.getContext('2d')!;
    dctx.clearRect(0, 0, size.w, size.h);

    tctx.lineWidth = 0.6;
    tctx.strokeStyle = 'rgba(124, 184, 214, 0.022)';
    tctx.beginPath();
    let finished = 0;
    for (let i = 0; i < n; i++) {
      const p = Math.max(0, Math.min(1, (T - delays[i]) / (1 - SPREAD)));
      const eased = 1 - (1 - p) ** 3;
      const step = Math.round(eased * STEPS);
      if (!reduced && step > drawnStep[i]) {
        tctx.moveTo(X(i, drawnStep[i]), Y(i, drawnStep[i]));
        for (let k = drawnStep[i] + 1; k <= step; k++) tctx.lineTo(X(i, k), Y(i, k));
        drawnStep[i] = step;
      }
      if (p <= 0) continue;
      if (step === STEPS) finished++;
      dctx.fillStyle = step === STEPS ? sample.color[i] : 'rgba(170, 210, 230, 0.9)';
      dctx.beginPath();
      dctx.arc(X(i, step), Y(i, step), sample.r[i], 0, Math.PI * 2);
      dctx.fill();
    }
    tctx.stroke();

    const pct = Math.round((finished / n) * 100);
    status.textContent =
      T < 1 ? `${labels.simulating} ${fmt.format(n)} · ${pct}%` : `${fmt.format(n)} ${labels.converged}`;

    if (T >= 1) {
      done = true;
      root.classList.add('is-done');
    }
  }

  function frame(t0: number, now: number) {
    const T = reduced ? 1 : Math.min(1, (now - t0) / DURATION);
    draw(T);
    if (T < 1) raf = requestAnimationFrame((ts) => frame(t0, ts));
  }

  function run() {
    cancelAnimationFrame(raf);
    done = false;
    root.classList.remove('is-done');
    resize();
    simulate();
    trails.getContext('2d')!.clearRect(0, 0, size.w, size.h);
    hl.getContext('2d')!.clearRect(0, 0, size.w, size.h);
    // ?frame=0.5 renders a fixed moment of the simulation (for screenshots and tests)
    const fixed = parseFloat(new URLSearchParams(location.search).get('frame') ?? '');
    if (fixed >= 0 && fixed <= 1) {
      for (let k = 1; k <= 40; k++) draw((fixed * k) / 40);
      return;
    }
    const t0 = performance.now();
    raf = requestAnimationFrame((ts) => frame(t0, ts));
  }

  function redrawStatic() {
    // after a resize, redraw the converged state without animating
    resize();
    const tctx = trails.getContext('2d')!;
    const dctx = dots.getContext('2d')!;
    tctx.lineWidth = 0.6;
    tctx.strokeStyle = 'rgba(124, 184, 214, 0.022)';
    tctx.beginPath();
    for (let i = 0; i < n; i++) {
      tctx.moveTo(X(i, 0), Y(i, 0));
      for (let k = 1; k <= STEPS; k++) tctx.lineTo(X(i, k), Y(i, k));
      dctx.fillStyle = sample.color[i];
      dctx.beginPath();
      dctx.arc(X(i, STEPS), Y(i, STEPS), sample.r[i], 0, Math.PI * 2);
      dctx.fill();
    }
    if (!reduced) tctx.stroke();
  }

  // hover: highlight the nearest path
  function nearest(mx: number, my: number) {
    let best = -1;
    let bestD = 14 * 14;
    for (let i = 0; i < n; i++) {
      const dx = sample.x[i] * size.w - mx;
      const dy = sample.y[i] * size.h - my;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }

  function inspect(e: PointerEvent) {
    if (!done || root.dataset.mode !== 'paths') return;
    const rect = dots.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const i = nearest(mx, my);
    const ctx = hl.getContext('2d')!;
    ctx.clearRect(0, 0, size.w, size.h);
    if (i < 0) {
      tip.hidden = true;
      return;
    }
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(X(i, 0), Y(i, 0));
    for (let k = 1; k <= STEPS; k++) ctx.lineTo(X(i, k), Y(i, k));
    ctx.stroke();
    ctx.fillStyle = '#f2a541';
    ctx.beginPath();
    ctx.arc(X(i, STEPS), Y(i, STEPS), 3, 0, Math.PI * 2);
    ctx.fill();
    tip.hidden = false;
    tip.textContent = `${labels.pathLabel} #${String(i).padStart(4, '0')} · y(1) = ${(1 - sample.y[i]).toFixed(3)}`;
    tip.style.left = `${Math.min(mx + 12, size.w - 190)}px`;
    tip.style.top = `${my + 14}px`;
  }

  dots.addEventListener('pointermove', inspect);
  dots.addEventListener('pointerdown', inspect); // tap on touch screens

  dots.addEventListener('pointerleave', () => {
    hl.getContext('2d')!.clearRect(0, 0, size.w, size.h);
    tip.hidden = true;
  });

  modeButtons.forEach((b) =>
    b.addEventListener('click', () => {
      root.dataset.mode = b.dataset.mode!;
      modeButtons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      hl.getContext('2d')!.clearRect(0, 0, size.w, size.h);
      tip.hidden = true;
    }),
  );

  resim.addEventListener('click', () => {
    seed = (seed * 48271) % 2147483647;
    root.dataset.mode = 'paths';
    modeButtons.forEach((o) => o.setAttribute('aria-pressed', String(o.dataset.mode === 'paths')));
    run();
  });

  let lastW = 0;
  new ResizeObserver(([entry]) => {
    const w = entry.contentRect.width;
    if (!n || Math.abs(w - lastW) < 2) return;
    lastW = w;
    if (done) redrawStatic();
    else run();
  }).observe(root.querySelector('.stage')!);

  const start = () => {
    lastW = root.querySelector<HTMLElement>('.stage')!.getBoundingClientRect().width;
    run();
  };
  if (img.complete && img.naturalWidth) start();
  else img.addEventListener('load', start, { once: true });
}
