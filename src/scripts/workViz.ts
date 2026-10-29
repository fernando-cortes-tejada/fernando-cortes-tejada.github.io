/**
 * One small interactive visual per project in the Work explorer.
 * Every renderer draws into `stage` and returns a cleanup function.
 * All numbers are synthetic and labelled as such on the page.
 */
import { evaluate, normCdf } from './ifrs9';

export type Labels = Record<string, string>;
type Renderer = (stage: HTMLElement, L: Labels, lang: string) => () => void;

const NS = 'http://www.w3.org/2000/svg';
export const C = { blue: '#3987e5', amber: '#c98500', light: '#9ec5f4', dark: '#184f95', good: '#7fcf9a' };

export function el<K extends keyof SVGElementTagNameMap>(parent: Element, tag: K, attrs: Record<string, string | number> = {}, text?: string) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  if (text !== undefined) node.textContent = text;
  parent.appendChild(node);
  return node;
}

export function svgBox(parent: HTMLElement, w: number, h: number, label: string) {
  const s = el(parent as unknown as Element, 'svg', { viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': label, class: 'viz-svg' });
  return s as SVGSVGElement;
}

function html(parent: HTMLElement, markup: string) {
  parent.insertAdjacentHTML('beforeend', markup);
  return parent.lastElementChild as HTMLElement;
}

const fmtPct = (lang: string, d = 1) => (x: number) =>
  new Intl.NumberFormat(lang, { style: 'percent', minimumFractionDigits: d, maximumFractionDigits: d }).format(x);

const normPdf = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

/** Pointer position in an SVG's own coordinates. */
export function local(svg: SVGSVGElement, e: PointerEvent) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}

// ---------------------------------------------------------------------------
// Interbank: IFRS 9 scenarios bend the PD term structure
const ifrs9: Renderer = (stage, L, lang) => {
  const pct = fmtPct(lang);
  const scen: [string, number][] = [
    [L.benign, -1],
    [L.base, 0],
    [L.adverse, 1.5],
    [L.severe, 3],
  ];
  const bar = html(stage, `<div class="viz-seg" role="group">${scen.map(([n, z]) => `<button type="button" data-z="${z}" aria-pressed="${z === 1.5}">${n}</button>`).join('')}</div>`);
  const s = svgBox(stage, 560, 230, L.pdTitle);
  const read = html(stage, `<p class="viz-read mono"></p>`);
  const base = evaluate(0, 0.6);
  const W = 560, H = 230, m = { l: 40, r: 70, t: 12, b: 26 }, T = 60;
  const X = (t: number) => m.l + (t / T) * (W - m.l - m.r);
  const Y = (p: number) => H - m.b - (p / 0.6) * (H - m.t - m.b);
  for (const p of [0, 0.2, 0.4, 0.6]) {
    el(s, 'line', { x1: m.l, x2: W - m.r, y1: Y(p), y2: Y(p), class: 'grid' });
    el(s, 'text', { x: m.l - 6, y: Y(p) + 4, class: 'tick', 'text-anchor': 'end' }, pct(p).replace(/[.,]0/, ''));
  }
  for (const t of [0, 12, 24, 36, 48, 60]) el(s, 'text', { x: X(t), y: H - 8, class: 'tick', 'text-anchor': 'middle' }, `${t}m`);
  const path = (pd: number[][]) => 'M' + [[0, 0], ...pd.map((r, k) => [k + 1, r[0]])].map(([t, p]) => `${X(t).toFixed(1)},${Y(p).toFixed(1)}`).join('L');
  el(s, 'path', { d: path(base.pd), class: 'line', stroke: C.blue });
  el(s, 'text', { x: W - m.r + 6, y: Y(base.pdLife) + 4, class: 'lbl' }, L.base);
  const live = el(s, 'path', { class: 'line', stroke: C.amber });
  const liveLbl = el(s, 'text', { class: 'lbl strong' });

  function draw(z: number) {
    const r = evaluate(z, 0.6);
    live.setAttribute('d', path(r.pd));
    liveLbl.setAttribute('x', String(W - m.r + 6));
    liveLbl.setAttribute('y', String(Math.min(Y(r.pdLife) + 4, Y(base.pdLife) - 10)));
    liveLbl.textContent = pct(r.pdLife).replace(/[.,]0/, '');
    read.innerHTML = `<span>${L.pd12} <b>${pct(r.pd12)}</b></span><span>${L.ecl} <b>${pct(r.ecl)}</b></span>`;
    bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.z! === z)));
  }
  bar.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b) draw(+b.dataset.z!);
  });
  draw(1.5);
  return () => {};
};

// ---------------------------------------------------------------------------
// RappiBank origination: same risk appetite, more approvals with app data
const origination: Renderer = (stage, L, lang) => {
  const pct = fmtPct(lang);
  const PI = 0.12; // share of bad applicants
  const D = { bureau: 1.3, app: 1.45 }; // separation of bad vs good risk scores
  const approval = (c: number, d: number) => (1 - PI) * normCdf(c) + PI * normCdf(c - d);
  const badRate = (c: number, d: number) => (PI * normCdf(c - d)) / approval(c, d);
  const cutFor = (target: number, d: number) => {
    let lo = -6, hi = 6;
    for (let k = 0; k < 60; k++) {
      const mid = (lo + hi) / 2;
      if (badRate(mid, d) < target) lo = mid;
      else hi = mid;
    }
    return lo;
  };

  const ctl = html(stage, `<label class="viz-slider"><span>${L.appetite} <b class="mono" data-v></b></span><input type="range" min="2" max="9" step="0.5" value="5"></label>`);
  const input = ctl.querySelector('input')!;
  const s = svgBox(stage, 560, 210, L.title);
  const W = 560, H = 210, m = { l: 44, r: 16, t: 14, b: 28 };
  const X = (b: number) => m.l + ((b - 0.01) / 0.1) * (W - m.l - m.r); // bad rate 1%..11%
  const Y = (a: number) => H - m.b - a * (H - m.t - m.b);
  for (const a of [0, 0.25, 0.5, 0.75, 1]) {
    el(s, 'line', { x1: m.l, x2: W - m.r, y1: Y(a), y2: Y(a), class: 'grid' });
    el(s, 'text', { x: m.l - 6, y: Y(a) + 4, class: 'tick', 'text-anchor': 'end' }, `${a * 100}%`);
  }
  for (const b of [0.02, 0.04, 0.06, 0.08, 0.1]) el(s, 'text', { x: X(b), y: H - 8, class: 'tick', 'text-anchor': 'middle' }, `${Math.round(b * 100)}%`);
  el(s, 'text', { x: W - m.r, y: H - m.b - 6, class: 'tick', 'text-anchor': 'end' }, L.xAxis);
  const curve = (d: number) => {
    const pts: string[] = [];
    for (let c = -2.5; c <= 3; c += 0.05) {
      const b = badRate(c, d);
      if (b >= 0.01 && b <= 0.11) pts.push(`${X(b).toFixed(1)},${Y(approval(c, d)).toFixed(1)}`);
    }
    return 'M' + pts.join('L');
  };
  el(s, 'path', { d: curve(D.bureau), class: 'line', stroke: C.blue });
  el(s, 'path', { d: curve(D.app), class: 'line', stroke: C.amber });
  const vline = el(s, 'line', { y1: m.t, y2: H - m.b, class: 'cross' });
  const d1 = el(s, 'circle', { r: 5, fill: C.blue, class: 'ring' });
  const d2 = el(s, 'circle', { r: 5, fill: C.amber, class: 'ring' });
  const gap = el(s, 'line', { class: 'gap' });
  const gapLbl = el(s, 'text', { class: 'lbl strong' });
  html(stage, `<p class="viz-legend"><span><i style="background:${C.blue}"></i>${L.bureau}</span><span><i style="background:${C.amber}"></i>${L.withApp}</span></p>`);

  function draw() {
    const t = +input.value / 100;
    ctl.querySelector('[data-v]')!.textContent = pct(t);
    const a1 = approval(cutFor(t, D.bureau), D.bureau);
    const a2 = approval(cutFor(t, D.app), D.app);
    vline.setAttribute('x1', String(X(t)));
    vline.setAttribute('x2', String(X(t)));
    d1.setAttribute('cx', String(X(t)));
    d1.setAttribute('cy', String(Y(a1)));
    d2.setAttribute('cx', String(X(t)));
    d2.setAttribute('cy', String(Y(a2)));
    for (const [k, v] of Object.entries({ x1: X(t), x2: X(t), y1: Y(a1) - 6, y2: Y(a2) + 6 })) gap.setAttribute(k, String(v));
    const right = X(t) < W * 0.7;
    gapLbl.setAttribute('x', String(X(t) + (right ? 10 : -10)));
    gapLbl.setAttribute('text-anchor', right ? 'start' : 'end');
    gapLbl.setAttribute('y', String(Y(a2) - 12));
    gapLbl.textContent = `+${((a2 - a1) * 100).toFixed(1)} pp ${L.approved}`;
  }
  input.addEventListener('input', draw);
  draw();
  return () => {};
};

// ---------------------------------------------------------------------------
// RappiBank fraud: move the threshold, trade fraud caught against false alarms
const fraud: Renderer = (stage, L, lang) => {
  const pct = fmtPct(lang, 1);
  const legit = { mu: -2.2, sd: 1 };
  const bad = { mu: 1.3, sd: 1.1 };
  const PREV = 0.004; // fraud share of transactions
  const ctl = html(stage, `<label class="viz-slider"><span>${L.threshold} <b class="mono" data-v></b></span><input type="range" min="-3" max="3" step="0.1" value="0"></label>`);
  const input = ctl.querySelector('input')!;
  const s = svgBox(stage, 560, 190, L.title);
  const W = 560, H = 190, m = { l: 16, r: 16, t: 10, b: 26 };
  const lo = -5.5, hi = 5;
  const X = (v: number) => m.l + ((v - lo) / (hi - lo)) * (W - m.l - m.r);
  const Y = (d: number) => H - m.b - (d / 0.42) * (H - m.t - m.b);
  const area = (g: { mu: number; sd: number }) => {
    const pts: string[] = [`${X(lo)},${Y(0)}`];
    for (let v = lo; v <= hi; v += 0.05) pts.push(`${X(v).toFixed(1)},${Y(normPdf((v - g.mu) / g.sd) / g.sd).toFixed(1)}`);
    pts.push(`${X(hi)},${Y(0)}`);
    return 'M' + pts.join('L') + 'Z';
  };
  el(s, 'line', { x1: m.l, x2: W - m.r, y1: Y(0), y2: Y(0), class: 'axis' });
  el(s, 'path', { d: area(legit), fill: C.blue, 'fill-opacity': 0.55, stroke: C.blue, 'stroke-width': 2 });
  el(s, 'path', { d: area(bad), fill: C.amber, 'fill-opacity': 0.55, stroke: C.amber, 'stroke-width': 2 });
  el(s, 'text', { x: X(legit.mu), y: Y(0.4) - 2, class: 'lbl', 'text-anchor': 'middle' }, L.legit);
  el(s, 'text', { x: X(bad.mu), y: Y(0.36) - 2, class: 'lbl', 'text-anchor': 'middle' }, L.fraud);
  el(s, 'text', { x: m.l, y: H - 8, class: 'tick' }, L.lowRisk);
  el(s, 'text', { x: W - m.r, y: H - 8, class: 'tick', 'text-anchor': 'end' }, L.highRisk);
  const shade = el(s, 'rect', { y: m.t, height: H - m.t - m.b, class: 'shade' });
  const vline = el(s, 'line', { y1: m.t, y2: H - m.b, class: 'you' });
  const out = html(stage, `<dl class="viz-kpis mono"><div><dt>${L.caught}</dt><dd data-k="tpr"></dd></div><div><dt>${L.fpr}</dt><dd data-k="fpr"></dd></div><div><dt>${L.alerts}</dt><dd data-k="alerts"></dd></div></dl>`);

  function draw() {
    const t = +input.value;
    ctl.querySelector('[data-v]')!.textContent = t.toFixed(1);
    const tpr = 1 - normCdf((t - bad.mu) / bad.sd);
    const fpr = 1 - normCdf((t - legit.mu) / legit.sd);
    const alerts = 10000 * (PREV * tpr + (1 - PREV) * fpr);
    shade.setAttribute('x', String(X(t)));
    shade.setAttribute('width', String(Math.max(0, W - m.r - X(t))));
    vline.setAttribute('x1', String(X(t)));
    vline.setAttribute('x2', String(X(t)));
    out.querySelector('[data-k=tpr]')!.textContent = pct(tpr);
    out.querySelector('[data-k=fpr]')!.textContent = pct(fpr);
    out.querySelector('[data-k=alerts]')!.textContent = Math.round(alerts).toLocaleString(lang);
  }
  input.addEventListener('input', draw);
  draw();
  return () => {};
};

// ---------------------------------------------------------------------------
// Duppla: two gradient-boosting models, averaged
const valuation: Renderer = (stage, L, lang) => {
  // illustrative price per m² (COP millions) by locality; not market data
  const AREAS: [string, number][] = [
    ['Chapinero', 10.2],
    ['Usaquén', 8.9],
    ['Teusaquillo', 7.4],
    ['Suba', 6.1],
    ['Kennedy', 4.3],
  ];
  const form = html(
    stage,
    `<div class="viz-form">
      <label><span>${L.locality}</span><select>${AREAS.map(([n], i) => `<option value="${i}"${i === 2 ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="viz-slider"><span>${L.area} <b class="mono" data-v="m2"></b></span><input name="m2" type="range" min="35" max="180" step="5" value="75"></label>
      <label class="viz-slider"><span>${L.rooms} <b class="mono" data-v="rooms"></b></span><input name="rooms" type="range" min="1" max="4" step="1" value="3"></label>
    </div>`,
  );
  const s = svgBox(stage, 560, 150, L.title);
  const total = html(stage, `<p class="viz-big"><span class="mono" data-total></span><span>${L.estimate}</span></p>`);
  const cop = (v: number) => new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(v);

  function draw() {
    const i = +form.querySelector('select')!.value;
    const m2 = +form.querySelector<HTMLInputElement>('[name=m2]')!.value;
    const rooms = +form.querySelector<HTMLInputElement>('[name=rooms]')!.value;
    form.querySelector('[data-v=m2]')!.textContent = `${m2} m²`;
    form.querySelector('[data-v=rooms]')!.textContent = String(rooms);
    const base = AREAS[i][1];
    // small homes price higher per m²; extra rooms on a small footprint price lower
    const size = Math.pow(75 / m2, 0.12);
    const crowd = 1 - 0.04 * Math.max(0, rooms - m2 / 30);
    const xgb = base * size * crowd * 1.03;
    const lgbm = base * size * crowd * 0.975 * (1 + 0.01 * (rooms - 2));
    const ens = (xgb + lgbm) / 2;
    s.replaceChildren();
    const W = 560, l = 120, r = 70, rowH = 34, max = 14;
    const X = (v: number) => l + (v / max) * (W - l - r);
    ([
      ['XGBoost', xgb, C.blue],
      ['LightGBM', lgbm, C.light],
      [L.ensemble, ens, C.amber],
    ] as const).forEach(([name, v, color], k) => {
      const y = 10 + k * (rowH + 12);
      el(s, 'text', { x: l - 10, y: y + rowH / 2 + 5, class: k === 2 ? 'lbl strong' : 'lbl', 'text-anchor': 'end' }, name);
      el(s, 'rect', { x: l, y, width: X(v) - l, height: rowH, rx: 4, fill: color });
      el(s, 'text', { x: X(v) + 8, y: y + rowH / 2 + 5, class: 'lbl' }, `${cop(v)}M/m²`);
    });
    total.querySelector('[data-total]')!.textContent = `COP ${Math.round(ens * m2).toLocaleString(lang)}M`;
  }
  form.addEventListener('input', draw);
  draw();
  return () => {};
};

// ---------------------------------------------------------------------------
// Duppla document AI: before / after
const docAi: Renderer = (stage, L) => {
  const bar = html(stage, `<div class="viz-seg two" role="group"><button type="button" data-s="0" aria-pressed="false">${L.before}</button><button type="button" data-s="1" aria-pressed="true">${L.after}</button></div>`);
  const s = svgBox(stage, 560, 210, L.title);
  const rows = [
    { name: L.review, before: 40, after: 3, max: 40, unit: 'h' },
    { name: L.homes, before: 5, after: 20, max: 20, unit: '' },
  ];
  const W = 560, l = 16, r = 70;
  const bars = rows.map((row, k) => {
    const y = 26 + k * 96;
    el(s, 'text', { x: l, y, class: 'lbl' }, row.name);
    el(s, 'rect', { x: l, y: y + 12, width: W - l - r, height: 36, rx: 4, class: 'track' });
    const rect = el(s, 'rect', { x: l, y: y + 12, height: 36, rx: 4, fill: C.blue, class: 'grow' });
    const val = el(s, 'text', { y: y + 36, class: 'big-num' });
    return { row, rect, val };
  });
  function draw(after: boolean) {
    for (const { row, rect, val } of bars) {
      const v = after ? row.after : row.before;
      const w = (v / row.max) * (W - l - r);
      rect.setAttribute('width', String(Math.max(6, w)));
      rect.setAttribute('fill', after ? C.amber : C.blue);
      val.setAttribute('x', String(l + Math.max(6, w) + 10));
      val.textContent = `${v}${row.unit}`;
    }
    bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.s === (after ? '1' : '0'))));
  }
  bar.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b) draw(b.dataset.s === '1');
  });
  draw(true);
  return () => {};
};

// ---------------------------------------------------------------------------
// Surebets: two books' prices drift; an arbitrage opens when 1/o1 + 1/o2 < 1
const surebets: Renderer = (stage, L, lang) => {
  const head = html(
    stage,
    `<div class="ticker mono">
      <div><span>${L.bookA} · ${L.over} 27.5</span><b data-o="a"></b></div>
      <div><span>${L.bookB} · ${L.under} 27.5</span><b data-o="b"></b></div>
      <div class="sum"><span>1/o₁ + 1/o₂</span><b data-o="s"></b></div>
    </div>`,
  );
  const s = svgBox(stage, 560, 150, L.title);
  const flag = html(stage, `<p class="arb-flag mono" aria-live="polite"></p>`);
  const pause = html(stage, `<button type="button" class="link-btn small">${L.pause}</button>`) as HTMLButtonElement;
  const W = 560, H = 150, m = { l: 40, r: 10, t: 10, b: 10 }, N = 80;
  const TOP = 1.17, BOT = 0.96;
  const Y = (v: number) => m.t + ((TOP - Math.max(BOT, Math.min(TOP, v))) / (TOP - BOT)) * (H - m.t - m.b);
  const X = (k: number) => m.l + (k / (N - 1)) * (W - m.l - m.r);
  el(s, 'rect', { x: m.l, y: Y(1), width: W - m.l - m.r, height: Y(BOT) - Y(1), class: 'arb-zone' });
  el(s, 'line', { x1: m.l, x2: W - m.r, y1: Y(1), y2: Y(1), class: 'ref' });
  el(s, 'text', { x: m.l - 6, y: Y(1) + 4, class: 'tick', 'text-anchor': 'end' }, '1.00');
  el(s, 'text', { x: m.l + 6, y: Y(BOT) - 6, class: 'tick' }, L.zone);
  const line = el(s, 'path', { class: 'line', stroke: C.blue });
  const dot = el(s, 'circle', { r: 4, fill: C.amber, class: 'ring' });

  // mean-reverting log-odds; books disagree briefly, then correct
  const MID = Math.log(1.93); // each book's margin: 2/1.93 ≈ 1.036
  let la = Math.log(1.87), lb = Math.log(1.95), seed = 3;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
  const hist: number[] = [];
  const step = () => {
    la += 0.18 * (MID - la) + 0.03 * gauss();
    lb += 0.18 * (MID - lb) + 0.03 * gauss();
    const oa = Math.exp(la), ob = Math.exp(lb);
    const S = 1 / oa + 1 / ob;
    hist.push(S);
    if (hist.length > N) hist.shift();
    return { oa, ob, S };
  };
  for (let k = 0; k < N; k++) step();

  const money = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });
  function draw({ oa, ob, S }: { oa: number; ob: number; S: number }) {
    head.querySelector('[data-o=a]')!.textContent = oa.toFixed(2);
    head.querySelector('[data-o=b]')!.textContent = ob.toFixed(2);
    head.querySelector('[data-o=s]')!.textContent = S.toFixed(3);
    const pts = hist.map((v, k) => `${X(k + N - hist.length).toFixed(1)},${Y(v).toFixed(1)}`);
    line.setAttribute('d', 'M' + pts.join('L'));
    dot.setAttribute('cx', String(X(N - 1)));
    dot.setAttribute('cy', String(Y(S)));
    const arb = S < 1;
    stage.classList.toggle('is-arb', arb);
    flag.textContent = arb
      ? `ARB +${((1 / S - 1) * 100).toFixed(2)}% · ${L.stake} ${money.format((100 * (1 / oa)) / S)} / ${money.format((100 * (1 / ob)) / S)}`
      : L.waiting;
  }

  let running = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(stage);
  draw(step());
  const timer = setInterval(() => {
    if (running && visible && !document.hidden) draw(step());
  }, 700);
  pause.textContent = running ? L.pause : L.play;
  pause.addEventListener('click', () => {
    running = !running;
    pause.textContent = running ? L.pause : L.play;
  });
  return () => {
    clearInterval(timer);
    io.disconnect();
  };
};

export const RENDERERS: Record<string, Renderer> = { ifrs9, origination, fraud, valuation, docAi, surebets };
