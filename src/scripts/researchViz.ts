/** Interactive figures for the Research section. */
import { normCdf } from './ifrs9';
import { C, el, svgBox, type Labels } from './workViz';

type Renderer = (stage: HTMLElement, L: Labels, lang: string) => void;

function rng(seed: number) {
  let s = seed;
  const u = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const n = () => Math.sqrt(-2 * Math.log(1 - u())) * Math.cos(2 * Math.PI * u());
  return { u, n };
}

const normPdf = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
const logistic = (x: number) => 1 / (1 + Math.exp(-x));

function seg(stage: HTMLElement, options: [string, string][], active: string) {
  stage.insertAdjacentHTML(
    'beforeend',
    `<div class="viz-seg two" role="group">${options.map(([v, n]) => `<button type="button" data-v="${v}" aria-pressed="${v === active}">${n}</button>`).join('')}</div>`,
  );
  return stage.lastElementChild as HTMLElement;
}

// ---------------------------------------------------------------------------
// Thesis: 12-month credit-card utilization paths, inflated at 0 and 1, in two clusters
const thesis: Renderer = (stage, L, lang) => {
  const pct = (x: number) => new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 0 }).format(x);
  const { u, n } = rng(29);
  const clusters = [
    // intercept, slope per month (logit scale), P(y=0), P(y=1), default probability
    { a: -0.2, b: -0.07, d0: 0.035, d1: 0.01, pd: 0.25, color: C.blue },
    { a: 0.35, b: 0.17, d0: 0.01, d1: 0.08, pd: 0.72, color: C.amber },
  ];
  const clients = Array.from({ length: 44 }, (_, i) => {
    const k = i % 2;
    const c = clusters[k];
    const re = 0.55 * n(); // client random effect
    const path = Array.from({ length: 12 }, (_, t) => {
      const r = u();
      if (r < c.d0) return 0;
      if (r < c.d0 + c.d1 * (0.5 + t / 12)) return 1;
      return logistic(c.a + c.b * t + re + 0.15 * n());
    });
    return { k, path, defaulted: u() < c.pd };
  });
  const rates = clusters.map((_, k) => {
    const g = clients.filter((c) => c.k === k);
    return g.filter((c) => c.defaulted).length / g.length;
  });

  const toggle = seg(stage, [['raw', L.raw], ['clustered', L.clustered]], 'clustered');
  const s = svgBox(stage, 560, 240, L.title);
  const W = 560, H = 240, m = { l: 40, r: 16, t: 10, b: 26 };
  const X = (t: number) => m.l + (t / 11) * (W - m.l - m.r);
  const Y = (y: number) => H - m.b - y * (H - m.t - m.b);
  for (const y of [0, 0.5, 1]) {
    el(s, 'line', { x1: m.l, x2: W - m.r, y1: Y(y), y2: Y(y), class: 'grid' });
    el(s, 'text', { x: m.l - 6, y: Y(y) + 4, class: 'tick', 'text-anchor': 'end' }, y.toFixed(1));
  }
  for (const t of [0, 3, 6, 9, 11]) el(s, 'text', { x: X(t), y: H - 8, class: 'tick', 'text-anchor': 'middle' }, `${L.month} ${t + 1}`);
  const lines = clients.map((c) =>
    el(s, 'path', { d: 'M' + c.path.map((y, t) => `${X(t).toFixed(1)},${Y(y).toFixed(1)}`).join('L'), class: 'spaghetti' }),
  );
  const means = clusters.map((_, k) => {
    const g = clients.filter((c) => c.k === k);
    const avg = Array.from({ length: 12 }, (_, t) => g.reduce((acc, c) => acc + c.path[t], 0) / g.length);
    return el(s, 'path', { d: 'M' + avg.map((y, t) => `${X(t).toFixed(1)},${Y(y).toFixed(1)}`).join('L'), class: 'mean', stroke: clusters[k].color });
  });
  stage.insertAdjacentHTML(
    'beforeend',
    `<p class="viz-legend" data-legend>${clusters
      .map((c, k) => `<span><i style="background:${c.color}"></i>${L.cluster} ${k + 1} · ${L.defaultRate} ${pct(rates[k])}</span>`)
      .join('')}</p>`,
  );
  const legend = stage.querySelector<HTMLElement>('[data-legend]')!;

  function draw(mode: string) {
    const on = mode === 'clustered';
    lines.forEach((p, i) => {
      p.setAttribute('stroke', on ? clusters[clients[i].k].color : '#6b717b');
      p.setAttribute('stroke-opacity', on ? '0.32' : '0.3');
    });
    means.forEach((p) => p.setAttribute('visibility', on ? 'visible' : 'hidden'));
    legend.style.visibility = on ? 'visible' : 'hidden';
    toggle.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === mode)));
  }
  toggle.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b) draw(b.dataset.v!);
  });
  draw('clustered');
};

// ---------------------------------------------------------------------------
// Tobit paper: the three proposed models, parameterized by the marginal mean.
// You set E[Y]; the latent location μ has no closed form, so it is solved
// numerically (bisection), exactly as in the paper.
export type ModelKey = 'tobit' | 'itn' | 'itsn';

interface Params {
  mean: number;
  sigma: number;
  d0: number;
  d1: number;
  lambda: number;
}

/** log Φ(t), accurate far into the lower tail (Mills-ratio asymptotic below −8). */
function logNormCdf(t: number) {
  if (t > -8) return Math.log(normCdf(t));
  return -0.5 * t * t - Math.log(-t) - 0.5 * Math.log(2 * Math.PI) + Math.log(1 - 1 / (t * t));
}

/**
 * Continuous part on (0,1) for location mu: the (skew-)normal truncated to (0,1).
 * Weights are computed in log space so far-off locations do not underflow.
 */
function continuous(model: ModelKey, mu: number, p: Params) {
  const lam = model === 'itsn' ? p.lambda : 0;
  const logf = (x: number) => {
    const z = (x - mu) / p.sigma;
    return -0.5 * z * z + (lam === 0 ? Math.log(0.5) : logNormCdf(lam * z));
  };
  const K = 400;
  const lw = Array.from({ length: K }, (_, k) => logf((k + 0.5) / K));
  const M = Math.max(...lw);
  let mass = 0, first = 0;
  lw.forEach((l, k) => {
    const w = Math.exp(l - M);
    mass += w / K;
    first += ((k + 0.5) / K) * (w / K);
  });
  return {
    /** truncated density on (0,1), integrates to 1 */
    shape: (x: number) => Math.exp(logf(x) - M) / mass,
    condMean: first / mass,
  };
}

/** Distribution implied by location mu: point masses at 0 and 1, plus a density on (0,1). */
export function implied(model: ModelKey, mu: number, p: Params) {
  const c = continuous(model, mu, p);
  if (model === 'tobit') {
    // censored normal: the tails beyond the bounds pile up at 0 and 1
    const p0 = normCdf((0 - mu) / p.sigma);
    const p1 = 1 - normCdf((1 - mu) / p.sigma);
    const w = 1 - p0 - p1;
    return { p0, p1, density: (x: number) => w * c.shape(x), mean: p1 + w * c.condMean };
  }
  // inflated: fixed masses d0, d1; the continuous part is a truncated (skew-)normal
  const w = 1 - p.d0 - p.d1;
  return { p0: p.d0, p1: p.d1, density: (x: number) => w * c.shape(x), mean: p.d1 + w * c.condMean };
}

export function solveMu(model: ModelKey, p: Params) {
  let lo = -6, hi = 7;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (implied(model, mid, p).mean < p.mean) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const tobit: Renderer = (stage, L) => {
  const models: [ModelKey, string, number][] = [
    ['tobit', 'Tobit-m', 2],
    ['itn', 'ITNm', 4],
    ['itsn', 'ITSNm', 5],
  ];
  stage.insertAdjacentHTML(
    'beforeend',
    `<div class="viz-seg three" role="group">${models.map(([k, n]) => `<button type="button" data-v="${k}" aria-pressed="${k === 'itsn'}">${n}</button>`).join('')}</div>
     <div class="viz-form two-col">
       <label class="viz-slider"><span>${L.mean} <b class="mono" data-v="mean"></b></span><input name="mean" type="range" min="0.1" max="0.9" step="0.01" value="0.62"></label>
       <label class="viz-slider"><span>σ <b class="mono" data-v="sigma"></b></span><input name="sigma" type="range" min="0.08" max="0.6" step="0.01" value="0.2"></label>
       <label class="viz-slider" data-only="itn itsn"><span>δ₀ = P(Y = 0) <b class="mono" data-v="d0"></b></span><input name="d0" type="range" min="0" max="0.3" step="0.01" value="0.08"></label>
       <label class="viz-slider" data-only="itn itsn"><span>δ₁ = P(Y = 1) <b class="mono" data-v="d1"></b></span><input name="d1" type="range" min="0" max="0.3" step="0.01" value="0.12"></label>
       <label class="viz-slider" data-only="itsn"><span>${L.skew} λ <b class="mono" data-v="lambda"></b></span><input name="lambda" type="range" min="-8" max="8" step="0.5" value="-4"></label>
     </div>`,
  );
  const s = svgBox(stage, 560, 230, L.title);
  stage.insertAdjacentHTML(
    'beforeend',
    `<p class="viz-legend"><span><i style="background:${C.amber}"></i>${L.density}</span><span><i style="background:${C.blue}"></i>${L.masses}</span><span><i class="dash" style="border-color:var(--text)"></i>E[Y]</span></p><p class="viz-read mono" data-out></p>`,
  );
  const out = stage.querySelector<HTMLElement>('[data-out]')!;
  let model: ModelKey = 'itsn';
  const val = (n: string) => +stage.querySelector<HTMLInputElement>(`input[name=${n}]`)!.value;

  function draw() {
    const p: Params = { mean: val('mean'), sigma: val('sigma'), d0: val('d0'), d1: val('d1'), lambda: val('lambda') };
    stage.querySelectorAll<HTMLElement>('[data-only]').forEach((n) => (n.hidden = !n.dataset.only!.split(' ').includes(model)));
    for (const k of ['mean', 'sigma', 'd0', 'd1'] as const) stage.querySelector(`[data-v=${k}]`)!.textContent = p[k].toFixed(2);
    stage.querySelector('[data-v=lambda]')!.textContent = p.lambda.toFixed(1);
    stage.querySelectorAll<HTMLButtonElement>('.viz-seg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === model)));

    // an inflated model can only reach means between d1 and 1 - d0
    let note = '';
    if (model !== 'tobit') {
      const lo = p.d1 + 0.01, hi = 1 - p.d0 - 0.01;
      if (p.mean < lo || p.mean > hi) {
        p.mean = Math.min(hi, Math.max(lo, p.mean));
        note = ` · ${L.clamped} ${p.mean.toFixed(2)}`;
      }
    }
    const mu = solveMu(model, p);
    const d = implied(model, mu, p);

    s.replaceChildren();
    const W = 560, H = 230, m = { l: 34, r: 34, t: 30, b: 26 };
    const X = (x: number) => m.l + x * (W - m.l - m.r);
    const grid = Array.from({ length: 199 }, (_, k) => (k + 1) / 200);
    const dens = grid.map((x) => d.density(x));
    const yMax = Math.max(2.2, ...dens) * 1.1;
    const Y = (v: number) => H - m.b - (Math.min(v, yMax) / yMax) * (H - m.t - m.b);
    // spikes share the axis: probability mass p is drawn as if it were density p * 10
    const spikeScale = (H - m.t - m.b) / 1.0;
    el(s, 'line', { x1: m.l, x2: W - m.r, y1: Y(0), y2: Y(0), class: 'axis' });
    el(s, 'path', { d: 'M' + [`${X(0)},${Y(0)}`, ...grid.map((x, k) => `${X(x).toFixed(1)},${Y(dens[k]).toFixed(1)}`), `${X(1)},${Y(0)}`].join('L') + 'Z', fill: C.amber, 'fill-opacity': 0.25, stroke: C.amber, 'stroke-width': 2.5 });
    for (const [x, pm] of [
      [0, d.p0],
      [1, d.p1],
    ] as const) {
      const h = Math.min(1, pm / 0.5) * spikeScale * 0.9; // spike height ∝ probability, full height at 50%
      el(s, 'line', { x1: X(x), x2: X(x), y1: Y(0), y2: Y(0) - h, stroke: C.blue, 'stroke-width': 6, 'stroke-linecap': 'round' });
      el(s, 'circle', { cx: X(x), cy: Y(0) - h, r: 5, fill: C.blue, class: 'ring' });
      el(s, 'text', { x: X(x), y: Y(0) - h - 10, class: 'lbl strong', 'text-anchor': 'middle' }, `${(pm * 100).toFixed(1)}%`);
    }
    el(s, 'line', { x1: X(p.mean), x2: X(p.mean), y1: m.t - 8, y2: Y(0), class: 'ref' });
    el(s, 'text', { x: X(p.mean), y: m.t - 14, class: 'lbl strong', 'text-anchor': 'middle' }, `E[Y] = ${p.mean.toFixed(2)}`);
    for (const x of [0, 0.25, 0.5, 0.75, 1]) el(s, 'text', { x: X(x), y: H - 8, class: 'tick', 'text-anchor': 'middle' }, x.toFixed(2));

    const params = models.find(([k]) => k === model)![2];
    out.textContent = `${L.solved}: μ = ${mu.toFixed(3)} · ${params} ${L.params}${note}`;
  }

  stage.addEventListener('input', draw);
  stage.querySelector('.viz-seg')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!b) return;
    model = b.dataset.v as ModelKey;
    draw();
  });
  draw();
};

export const RESEARCH_VIZ: Record<string, Renderer> = { thesis, tobit };
