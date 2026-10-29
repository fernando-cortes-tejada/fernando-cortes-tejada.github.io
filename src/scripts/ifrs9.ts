/**
 * Toy IFRS 9 engine: Markov delinquency migration, a one-factor stress that
 * shifts each row of the transition matrix, staging, ECL and a Monte Carlo
 * distribution of 12-month credit losses. Synthetic numbers throughout.
 */

export const STATES = ['Current', '1–30', '31–60', '61–90', 'Default'] as const;
export const N = STATES.length;
export const DEFAULT = N - 1;
export type Matrix = number[][];

/** Monthly migration matrix in the base scenario (rows sum to 1). */
export const BASE: Matrix = [
  [0.976, 0.0225, 0, 0, 0.0015],
  [0.64, 0.19, 0.14, 0, 0.03],
  [0.28, 0.1, 0.19, 0.38, 0.05],
  [0.09, 0.03, 0.07, 0.26, 0.55],
  [0, 0, 0, 0, 1],
];

/** Share of exposure in each bucket at the reporting date. */
export const PORTFOLIO = [0.9, 0.05, 0.018, 0.012, 0.02];
/** Sensitivity of the migration thresholds to the credit-cycle factor. */
export const BETA = 0.1; // calibrated: 12m PD ≈ 3.9% base, 7.2% at z = 1.5, 12.4% at z = 3
export const LIFETIME_MONTHS = 60;

// ---------- normal distribution ----------

export function normCdf(x: number): number {
  // Abramowitz & Stegun 7.1.26 via erf, |error| < 1.5e-7
  const t = 1 / (1 + 0.3275911 * Math.abs(x / Math.SQRT2));
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-(x * x) / 2);
  return x >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

export function normInv(p: number): number {
  // Acklam's rational approximation, relative error < 1.2e-9
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  if (p < lo) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - lo) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

// ---------- matrices ----------

/**
 * Stress the matrix by z (z > 0 = downturn). For each row, G_j = P(move to
 * bucket j or worse); its normal threshold shifts: G'_j = Φ(Φ⁻¹(G_j) + β z).
 * z = 0 returns the base matrix; probability mass slides toward worse buckets
 * as z rises, and toward better ones (cures) as z falls.
 */
export function stress(P: Matrix, z: number, beta = BETA): Matrix {
  return P.map((row, i) => {
    if (i === DEFAULT) return [...row];
    const G = row.map((_, j) => row.slice(j).reduce((s, x) => s + x, 0));
    const shifted = G.map((g, j) => (j === 0 ? 1 : g <= 0 ? 0 : g >= 1 ? 1 : normCdf(normInv(g) + beta * z)));
    return shifted.map((g, j) => g - (j + 1 < N ? shifted[j + 1] : 0));
  });
}

export function mul(A: Matrix, B: Matrix): Matrix {
  return A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
}

export function vecMul(v: number[], P: Matrix): number[] {
  return P[0].map((_, j) => v.reduce((s, x, k) => s + x * P[k][j], 0));
}

/** Cumulative PD from every bucket for horizons 1..T: pd[t-1][i]. */
export function pdCurves(P: Matrix, T: number): number[][] {
  const out: number[][] = [];
  let Pt = P;
  for (let t = 1; t <= T; t++) {
    out.push(Pt.map((row) => row[DEFAULT]));
    Pt = mul(Pt, P);
  }
  return out;
}

// ---------- IFRS 9 ----------

/** Stage by bucket: 0–30 dpd → 1, >30 dpd → 2 (backstop), default → 3. */
export const STAGE_OF = [1, 1, 2, 2, 3];

export interface Result {
  matrix: Matrix;
  pd: number[][]; // pd[t-1][bucket]
  pd12: number; // from Current
  pdLife: number;
  ecl: number; // as a share of exposure
  eclByStage: [number, number, number];
  stagesToday: [number, number, number];
  stages12m: [number, number, number];
}

function byStage(v: number[]): [number, number, number] {
  const s: [number, number, number] = [0, 0, 0];
  v.forEach((x, i) => (s[STAGE_OF[i] - 1] += x));
  return s;
}

export function evaluate(z: number, lgd: number): Result {
  const matrix = stress(BASE, z);
  const pd = pdCurves(matrix, LIFETIME_MONTHS);
  const eclByStage: [number, number, number] = [0, 0, 0];
  PORTFOLIO.forEach((ead, i) => {
    const stage = STAGE_OF[i];
    const p = stage === 3 ? 1 : stage === 1 ? pd[11][i] : pd[LIFETIME_MONTHS - 1][i];
    eclByStage[stage - 1] += ead * p * lgd;
  });
  return {
    matrix,
    pd,
    pd12: pd[11][0],
    pdLife: pd[LIFETIME_MONTHS - 1][0],
    ecl: eclByStage[0] + eclByStage[1] + eclByStage[2],
    eclByStage,
    stagesToday: byStage(PORTFOLIO),
    stages12m: byStage(vecMul(PORTFOLIO, pdPower(matrix, 12))),
  };
}

function pdPower(P: Matrix, n: number): Matrix {
  let R = P;
  for (let k = 1; k < n; k++) R = mul(R, P);
  return R;
}

/** 12-month default rate of the performing book given credit-cycle draw z. */
export function newDefaultRate(z: number): number {
  const P12 = pdPower(stress(BASE, z), 12);
  const performing = PORTFOLIO.slice(0, DEFAULT);
  return performing.reduce((s, x, i) => s + x * P12[i][DEFAULT], 0);
}

/** Monte Carlo over the credit-cycle factor z ~ N(0,1); returns sorted default rates. */
export function simulate(draws: number, seed = 11): number[] {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const out = new Array<number>(draws);
  for (let k = 0; k < draws; k++) out[k] = newDefaultRate(normInv(rand()));
  return out.sort((a, b) => a - b);
}

export function quantile(sorted: number[], q: number): number {
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
}
