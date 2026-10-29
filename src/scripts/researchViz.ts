/** Interactive figures for the Research section. */
import { normCdf } from './ifrs9';
import { C, el, local, svgBox, type Labels } from './workViz';

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

  const toggle = seg(stage, [['raw', L.raw], ['clustered', L.clustered]], 'raw');
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
  draw('raw');
};

// ---------------------------------------------------------------------------
// Tobit paper, Figure 1: beta regression misfits bounded data dense near 1
function lgamma(x: number): number {
  // Lanczos approximation (g = 7, n = 9)
  const g = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1;
  let a = g[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += g[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
const betaPdf = (x: number, a: number, b: number) =>
  Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - (lgamma(a) + lgamma(b) - lgamma(a + b)));

const tobit: Renderer = (stage, L) => {
  // parameters exactly as reported in Figure 1 of the paper
  const cases = {
    tn: {
      label: L.normal,
      caption: L.captionNormal,
      sample: (r: ReturnType<typeof rng>) => {
        for (;;) {
          const x = 0.85 + 0.2 * r.n();
          if (x > 0 && x < 1) return x;
        }
      },
      pdf: (x: number) => normPdf((x - 0.85) / 0.2) / 0.2 / (normCdf((1 - 0.85) / 0.2) - normCdf(-0.85 / 0.2)),
      beta: [4.823, 1.409] as const,
    },
    tsn: {
      label: L.skew,
      caption: L.captionSkew,
      sample: (r: ReturnType<typeof rng>) => {
        const d = 6 / Math.sqrt(37);
        for (;;) {
          const z = d * Math.abs(r.n()) + Math.sqrt(1 - d * d) * r.n();
          const x = 0.338 + 0.2 * z;
          if (x > 0 && x < 1) return x;
        }
      },
      pdf: (() => {
        const raw = (x: number) => {
          const z = (x - 0.338) / 0.2;
          return (2 / 0.2) * normPdf(z) * normCdf(6 * z);
        };
        let Z = 0;
        for (let k = 0; k < 2000; k++) Z += raw((k + 0.5) / 2000) / 2000;
        return (x: number) => raw(x) / Z;
      })(),
      beta: [7.333, 7.333] as const,
    },
  };

  const toggle = seg(stage, [['tn', cases.tn.label], ['tsn', cases.tsn.label]], 'tn');
  const s = svgBox(stage, 560, 240, L.title);
  stage.insertAdjacentHTML(
    'beforeend',
    `<p class="viz-legend"><span><i style="background:#3a4250"></i>${L.data}</span><span><i style="background:${C.amber}"></i>${L.truth}</span><span><i class="dash" style="border-color:${C.blue}"></i>${L.betaFit}</span></p><p class="viz-read mono" data-cap></p>`,
  );
  const cap = stage.querySelector<HTMLElement>('[data-cap]')!;
  const W = 560, H = 240, m = { l: 16, r: 16, t: 10, b: 26 };
  const X = (x: number) => m.l + x * (W - m.l - m.r);

  function draw(key: 'tn' | 'tsn') {
    const c = cases[key];
    s.replaceChildren();
    const r = rng(key === 'tn' ? 5 : 8);
    const bins = 40;
    const counts = new Array(bins).fill(0);
    const N = 10000;
    for (let k = 0; k < N; k++) counts[Math.min(bins - 1, Math.floor(c.sample(r) * bins))]++;
    const dens = counts.map((cnt) => (cnt / N) * bins);
    const grid = Array.from({ length: 199 }, (_, k) => (k + 1) / 200);
    const yMax = Math.max(...dens, ...grid.map((x) => c.pdf(x)), ...grid.map((x) => betaPdf(x, c.beta[0], c.beta[1]))) * 1.08;
    const Y = (d: number) => H - m.b - (d / yMax) * (H - m.t - m.b);
    el(s, 'line', { x1: m.l, x2: W - m.r, y1: Y(0), y2: Y(0), class: 'axis' });
    dens.forEach((d, i) => {
      const x0 = X(i / bins);
      el(s, 'rect', { x: x0 + 1, y: Y(d), width: Math.max(0, X(1 / bins) - m.l - 2), height: Y(0) - Y(d), rx: 1.5, fill: '#3a4250' });
    });
    const curve = (f: (x: number) => number) => 'M' + grid.map((x) => `${X(x).toFixed(1)},${Y(Math.min(f(x), yMax)).toFixed(1)}`).join('L');
    el(s, 'path', { d: curve(c.pdf), class: 'line', stroke: C.amber });
    el(s, 'path', { d: curve((x) => betaPdf(x, c.beta[0], c.beta[1])), class: 'line dashed', stroke: C.blue });
    for (const x of [0, 0.25, 0.5, 0.75, 1]) el(s, 'text', { x: X(x), y: H - 8, class: 'tick', 'text-anchor': x === 0 ? 'start' : x === 1 ? 'end' : 'middle' }, x.toFixed(2));

    // hover: compare the two densities at x
    const cross = el(s, 'line', { y1: m.t, y2: H - m.b, class: 'cross', visibility: 'hidden' });
    const hit = el(s, 'rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' });
    const tip = el(s, 'text', { y: m.t + 14, class: 'lbl strong' });
    hit.addEventListener('pointermove', (e) => {
      const p = local(s, e as PointerEvent);
      const x = Math.min(0.995, Math.max(0.005, (p.x - m.l) / (W - m.l - m.r)));
      cross.setAttribute('x1', String(X(x)));
      cross.setAttribute('x2', String(X(x)));
      cross.setAttribute('visibility', 'visible');
      const right = x < 0.6;
      tip.setAttribute('x', String(X(x) + (right ? 8 : -8)));
      tip.setAttribute('text-anchor', right ? 'start' : 'end');
      tip.textContent = `y = ${x.toFixed(2)} · ${L.truth} ${c.pdf(x).toFixed(2)} · beta ${betaPdf(x, c.beta[0], c.beta[1]).toFixed(2)}`;
    });
    hit.addEventListener('pointerleave', () => {
      cross.setAttribute('visibility', 'hidden');
      tip.textContent = '';
    });
    cap.textContent = c.caption;
    toggle.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === key)));
  }
  toggle.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b) draw(b.dataset.v as 'tn' | 'tsn');
  });
  draw('tn');
};

export const RESEARCH_VIZ: Record<string, Renderer> = { thesis, tobit };
