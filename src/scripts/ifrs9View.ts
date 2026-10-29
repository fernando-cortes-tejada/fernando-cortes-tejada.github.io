import { BASE, LIFETIME_MONTHS, evaluate, newDefaultRate, quantile, simulate, type Result } from './ifrs9';

interface Labels {
  states: string[];
  base: string;
  stressed: string;
  month: string;
  today: string;
  in12: string;
  stage: string;
  el: string;
  var: string;
  yours: string;
  percentile: string;
  lossRate: string;
  probability: string;
}

const SVG = 'http://www.w3.org/2000/svg';
const COLOR = { base: '#3987e5', stressed: '#c98500', stages: ['#184f95', '#3987e5', '#9ec5f4'] };

export function mountIfrs9(root: HTMLElement, L: Labels) {
  const lang = document.documentElement.lang;
  const pct = (x: number, d = 1) =>
    new Intl.NumberFormat(lang, { style: 'percent', minimumFractionDigits: d, maximumFractionDigits: d }).format(x);
  const zInput = root.querySelector<HTMLInputElement>('[name=z]')!;
  const lgdInput = root.querySelector<HTMLInputElement>('[name=lgd]')!;
  const presets = root.querySelectorAll<HTMLButtonElement>('[data-z]');
  const tip = root.querySelector<HTMLElement>('[data-tip]')!;
  const sims = simulate(3000); // 12-month default rates of the performing book, sorted
  const base = evaluate(0, 0.6);

  function update() {
    const z = parseFloat(zInput.value);
    const lgd = parseFloat(lgdInput.value) / 100;
    root.querySelector('[data-out=z]')!.textContent = (z > 0 ? '+' : '') + z.toFixed(1);
    root.querySelector('[data-out=lgd]')!.textContent = pct(lgd, 0);
    presets.forEach((b) => b.setAttribute('aria-pressed', String(Math.abs(parseFloat(b.dataset.z!) - z) < 0.05)));

    const r = evaluate(z, lgd);
    const baseLgd = evaluate(0, lgd);
    kpi('pd12', r.pd12, base.pd12);
    kpi('pdLife', r.pdLife, base.pdLife);
    kpi('ecl', r.ecl, baseLgd.ecl);
    kpi('stage23', r.stages12m[1] + r.stages12m[2], base.stages12m[1] + base.stages12m[2]);
    drawMatrix(r);
    drawPd(r);
    drawStages(r);
    drawLoss(r, z, lgd);
  }

  function kpi(key: string, value: number, ref: number) {
    const el = root.querySelector<HTMLElement>(`[data-kpi=${key}]`)!;
    el.querySelector('.v')!.textContent = pct(value);
    const d = value - ref;
    const delta = el.querySelector<HTMLElement>('.d')!;
    // differences between rates are percentage points, not percent
    const pp = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(Math.abs(d) * 100);
    delta.textContent = Math.abs(d) < 0.0005 ? '' : `${d > 0 ? '+' : '−'}${pp} pp vs ${L.base.toLowerCase()}`;
  }

  // ---------- matrix heatmap ----------
  function drawMatrix(r: Result) {
    const cells = root.querySelectorAll<HTMLElement>('[data-cell]');
    cells.forEach((cell) => {
      const [i, j] = cell.dataset.cell!.split(',').map(Number);
      const p = r.matrix[i][j];
      const d = p - BASE[i][j];
      cell.textContent = p < 0.0005 ? '·' : (p * 100).toFixed(p < 0.1 ? 1 : 0);
      cell.style.setProperty('--a', String(Math.sqrt(p)));
      cell.classList.toggle('up', d > 0.002 && j > i);
      cell.classList.toggle('dn', d < -0.002 && j > i);
      cell.title = `${L.states[i]} → ${L.states[j]}: ${(p * 100).toFixed(2)}% (${L.base.toLowerCase()} ${(BASE[i][j] * 100).toFixed(2)}%)`;
    });
  }

  // ---------- helpers ----------
  function svg(sel: string) {
    const el = root.querySelector<SVGSVGElement>(sel)!;
    el.replaceChildren();
    return el;
  }
  function add<K extends keyof SVGElementTagNameMap>(parent: Element, tag: K, attrs: Record<string, string | number>, text?: string) {
    const el = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
    if (text) el.textContent = text;
    parent.appendChild(el);
    return el;
  }
  function showTip(e: PointerEvent, html: string) {
    const box = root.getBoundingClientRect();
    tip.innerHTML = html;
    tip.hidden = false;
    const x = e.clientX - box.left + 14;
    tip.style.left = `${Math.min(x, box.width - tip.offsetWidth - 8)}px`;
    tip.style.top = `${e.clientY - box.top + 14}px`;
  }
  const hideTip = () => (tip.hidden = true);

  // ---------- PD term structure ----------
  function drawPd(r: Result) {
    const el = svg('[data-chart=pd]');
    const W = 560, H = 280, m = { l: 44, r: 16, t: 14, b: 32 };
    const T = LIFETIME_MONTHS;
    const yMax = Math.max(0.2, Math.ceil(r.pdLife * 10) / 10);
    const X = (t: number) => m.l + (t / T) * (W - m.l - m.r);
    const Y = (p: number) => H - m.b - (p / yMax) * (H - m.t - m.b);

    for (let k = 0; k <= 4; k++) {
      const p = (yMax * k) / 4;
      add(el, 'line', { x1: m.l, x2: W - m.r, y1: Y(p), y2: Y(p), class: 'grid' });
      add(el, 'text', { x: m.l - 8, y: Y(p) + 4, class: 'tick', 'text-anchor': 'end' }, pct(p, 0));
    }
    for (const t of [0, 12, 24, 36, 48, 60]) add(el, 'text', { x: X(t), y: H - m.b + 18, class: 'tick', 'text-anchor': 'middle' }, String(t));
    // the Stage 1 horizon
    add(el, 'line', { x1: X(12), x2: X(12), y1: m.t, y2: H - m.b, class: 'marker' });
    add(el, 'text', { x: X(12) + 5, y: m.t + 10, class: 'tick' }, '12m');

    const path = (pd: number[][]) => 'M' + [[0, 0], ...pd.map((row, k) => [k + 1, row[0]])].map(([t, p]) => `${X(t).toFixed(1)},${Y(p).toFixed(1)}`).join('L');
    add(el, 'path', { d: path(base.pd), class: 'line', stroke: COLOR.base });
    add(el, 'path', { d: path(r.pd), class: 'line', stroke: COLOR.stressed });
    // direct labels at the line ends
    const endBase = Y(base.pdLife), endS = Y(r.pdLife);
    const sep = Math.abs(endBase - endS) < 14 ? (endS < endBase ? -7 : 7) : 0;
    add(el, 'text', { x: W - m.r - 2, y: endBase - 6 - sep, class: 'lbl', 'text-anchor': 'end' }, L.base);
    if (Math.abs(r.pdLife - base.pdLife) > 0.001) add(el, 'text', { x: W - m.r - 2, y: endS - 6 + sep, class: 'lbl', 'text-anchor': 'end' }, L.stressed);

    // crosshair
    const cross = add(el, 'line', { y1: m.t, y2: H - m.b, class: 'cross', visibility: 'hidden' });
    const dotB = add(el, 'circle', { r: 4, fill: COLOR.base, class: 'ring', visibility: 'hidden' });
    const dotS = add(el, 'circle', { r: 4, fill: COLOR.stressed, class: 'ring', visibility: 'hidden' });
    const hit = add(el, 'rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' });
    hit.addEventListener('pointermove', (e) => {
      const pt = el.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const loc = pt.matrixTransform(el.getScreenCTM()!.inverse());
      const t = Math.max(1, Math.min(T, Math.round(((loc.x - m.l) / (W - m.l - m.r)) * T)));
      const pb = base.pd[t - 1][0], ps = r.pd[t - 1][0];
      for (const [node, attrs] of [
        [cross, { x1: X(t), x2: X(t) }],
        [dotB, { cx: X(t), cy: Y(pb) }],
        [dotS, { cx: X(t), cy: Y(ps) }],
      ] as const) {
        for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
        node.setAttribute('visibility', 'visible');
      }
      showTip(e as PointerEvent, `<b>${L.month} ${t}</b><span><i style="background:${COLOR.base}"></i>${L.base} ${pct(pb)}</span><span><i style="background:${COLOR.stressed}"></i>${L.stressed} ${pct(ps)}</span>`);
    });
    hit.addEventListener('pointerleave', () => {
      [cross, dotB, dotS].forEach((n) => n.setAttribute('visibility', 'hidden'));
      hideTip();
    });
  }

  // ---------- stage mix ----------
  function drawStages(r: Result) {
    const el = svg('[data-chart=stages]');
    const W = 560, H = 128, labelW = 96, barH = 30, gap = 2;
    const rows: [string, number[]][] = [
      [L.today, r.stagesToday],
      [L.in12, r.stages12m],
    ];
    rows.forEach(([name, shares], k) => {
      const y = 14 + k * 52;
      add(el, 'text', { x: 0, y: y + barH / 2 + 4, class: 'lbl' }, name);
      let x = labelW;
      const span = W - labelW;
      shares.forEach((s, i) => {
        const w = Math.max(0, s * span - gap);
        const rect = add(el, 'rect', { x, y, width: w, height: barH, rx: 3, fill: COLOR.stages[i] });
        rect.addEventListener('pointermove', (e) => showTip(e as PointerEvent, `<b>${name}</b><span><i style="background:${COLOR.stages[i]}"></i>${L.stage} ${i + 1}: ${pct(s)}</span>`));
        rect.addEventListener('pointerleave', hideTip);
        if (s > 0.06) add(el, 'text', { x: x + 8, y: y + barH / 2 + 4, class: i === 2 ? 'in in-dark' : 'in' }, `${i + 1}: ${pct(s, 0)}`);
        x += s * span;
      });
    });
  }

  // ---------- loss distribution ----------
  function drawLoss(r: Result, z: number, lgd: number) {
    const el = svg('[data-chart=loss]');
    const W = 560, H = 240, m = { l: 16, r: 16, t: 12, b: 32 };
    const losses = sims.map((x) => x * lgd);
    const yours = newRate(z) * lgd;
    const el99 = quantile(losses, 0.999);
    const mean = losses.reduce((s, x) => s + x, 0) / losses.length;
    const xMax = Math.max(el99, yours) * 1.08;
    const bins = 36;
    const counts = new Array(bins).fill(0);
    for (const x of losses) counts[Math.min(bins - 1, Math.floor((x / xMax) * bins))]++;
    const cMax = Math.max(...counts);
    const X = (v: number) => m.l + (v / xMax) * (W - m.l - m.r);
    const bw = (W - m.l - m.r) / bins;

    add(el, 'line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, class: 'axis' });
    counts.forEach((c, i) => {
      const h = (c / cMax) * (H - m.t - m.b);
      const bar = add(el, 'rect', { x: m.l + i * bw + 1, y: H - m.b - h, width: Math.max(0, bw - 2), height: h, rx: 2, fill: COLOR.base, class: 'bar' });
      const lo = (i / bins) * xMax, hi = ((i + 1) / bins) * xMax;
      const hitbox = add(el, 'rect', { x: m.l + i * bw, y: m.t, width: bw, height: H - m.t - m.b, fill: 'transparent' });
      hitbox.addEventListener('pointermove', (e) => {
        bar.classList.add('on');
        showTip(e as PointerEvent, `<b>${L.lossRate} ${pct(lo)}–${pct(hi)}</b><span>${L.probability} ${pct(c / losses.length)}</span>`);
      });
      hitbox.addEventListener('pointerleave', () => {
        bar.classList.remove('on');
        hideTip();
      });
    });
    for (let k = 0; k <= 4; k++) {
      const v = (xMax * k) / 4;
      add(el, 'text', { x: X(v), y: H - m.b + 18, class: 'tick', 'text-anchor': k === 0 ? 'start' : k === 4 ? 'end' : 'middle' }, pct(v, 0));
    }
    // reference lines: expected loss, tail, and the chosen scenario
    const pctile = losses.findIndex((x) => x >= yours);
    const rank = pctile < 0 ? 1 : pctile / losses.length;
    const marks: [number, string, string][] = [
      [mean, `${L.el} ${pct(mean)}`, 'ref'],
      [el99, `${L.var} ${pct(el99)}`, 'ref tail'],
      [yours, `${L.yours} ${pct(yours)} · ${L.percentile} ${rank >= 0.99 ? (Math.floor(rank * 1000) / 10).toFixed(1) : Math.round(rank * 100)}`, 'you'],
    ];
    // lines in the chart, labels in an HTML key below it (wraps on narrow screens)
    marks.forEach(([v, , cls]) => add(el, 'line', { x1: X(v), x2: X(v), y1: m.t, y2: H - m.b, class: cls }));
    root.querySelector('[data-refs]')!.innerHTML = marks
      .map(([, text, cls]) => `<span class="${cls}"><i></i>${text}</span>`)
      .join('');
  }

  // 12-month default rate of the performing book in the chosen scenario (slider steps are 0.1)
  const cache = new Map<number, number>();
  function newRate(z: number) {
    const key = Math.round(z * 10);
    if (!cache.has(key)) cache.set(key, newDefaultRate(key / 10));
    return cache.get(key)!;
  }

  zInput.addEventListener('input', update);
  lgdInput.addEventListener('input', update);
  presets.forEach((b) =>
    b.addEventListener('click', () => {
      zInput.value = b.dataset.z!;
      update();
    }),
  );
  update();
}
