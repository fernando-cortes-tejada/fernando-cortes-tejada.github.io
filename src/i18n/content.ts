export type Lang = 'en' | 'es';

export interface Metric {
  value: string;
  label: string;
}

/** the longer write-up shown in the dialog: a few paragraphs and page previews that open the source document */
export interface Deep {
  story: string[];
  docs: { img: string; caption: string; href: string }[];
}

export interface Project {
  id: string;
  deep?: Deep;
  org: string;
  headline: string;
  /** one line for the card; the full story opens in the dialog */
  teaser: string;
  viz: Record<string, string>;
  years: string;
  title: string;
  summary: string;
  methods: string[];
  metrics: Metric[];
  links?: { label: string; href: string }[];
}

export interface Publication {
  deep?: Deep;
  /** key into RESEARCH_VIZ for an interactive figure */
  viz?: string;
  vizLabels?: Record<string, string>;
  kind: string;
  /** card copy: a headline result and a two-line summary; the full text opens in the dialog */
  headline: string;
  short: string;
  title: string;
  authors: string;
  venue: string;
  summary: string;
  badge?: string;
  links: { label: string; href: string }[];
}

export interface Photo {
  src: string;
  alt: string;
  caption: string;
  tall?: boolean;
  /** CSS object-position, for portrait photos shown in landscape tiles */
  focus?: string;
}

export interface Place {
  name: string;
  lon: number;
  lat: number;
  years: string;
  note: string;
  now?: boolean;
}

export interface PathItem {
  lane: 'edu' | 'work' | 'teach' | 'side';
  /** decimal years, e.g. 2026.6 ≈ August 2026 */
  from: number;
  to: number;
  /** short text drawn on the bar */
  label: string;
  org: string;
  place: string;
  role: string;
  note?: string;
  /** Work-explorer tab to open from the details panel */
  goto?: string;
  /** file in /logos (with extension) shown in the details panel */
  logo?: string;
  current?: boolean;
}

export const links = {
  email: 'fcortes@g.harvard.edu',
  linkedin: 'https://www.linkedin.com/in/fernando-cortes-tejada/',
  github: 'https://github.com/fernando-cortes-tejada',
  scholar: 'https://scholar.google.com/citations?user=ULZFAX0AAAAJ',
  cv: '/docs/Fernando_Cortes_Tejada_CV.pdf',
  paperDoi: 'https://doi.org/10.1016/j.eswa.2020.114486',
  paperArxiv: 'https://arxiv.org/abs/2005.14658',
  thesis: 'https://tesis.pucp.edu.pe/items/5a27ae63-1011-45bc-9b7f-36c755306b12',
  lacsc: '/docs/LACSC_2021_slides.pdf',
  tobit: '/docs/Tobit_mean_regression_working_paper.pdf',
  tobitCode: 'https://github.com/fernando-cortes-tejada/tobit_mean_regression',
  surebets: 'https://github.com/fernando-cortes-tejada/nba-surebets',
};

const authorsPaper = 'L. Roa, A. Correa-Bahnsen, G. Suarez, F. Cortés-Tejada, M. A. Luque, C. Bravo';
const authorsBayes = 'F. Cortés-Tejada, C. L. Bayes, L. Valdivieso';

export const content = {
  en: {
    meta: {
      title: 'Fernando Cortés Tejada | Credit Risk, Quant & ML',
      description:
        'Harvard MS/MBA candidate with an MS in Statistics (summa cum laude) and a BS in Physics. Credit risk, quantitative modeling and machine learning in production; founding engineer at a Series A fintech.',
    },
    nav: { work: 'Work & research', research: 'Research', lab: 'Lab', path: 'Path', contact: 'Contact', switchLabel: 'ES', switchAria: 'Leer en español' },
    hero: {
      location: 'Boston, MA',
      credentials: ['Harvard MS/MBA candidate, 2028', 'MS Statistics, summa cum laude', 'BS Physics, magna cum laude'],
      role: 'Credit risk, quantitative modeling & ML',
      pitch:
        'I put prices on risk with statistics: probability of default, expected credit loss, home values, mispriced odds. Then I take the models to production and build the systems that run them.',
      seeking: 'Seeking quantitative finance internships for summer 2027',
      cv: 'Download CV',
      viz: {
        paths: 'Paths',
        photo: 'Photo',
        resimulate: 'Resimulate',
        simulating: 'Simulating',
        converged: 'paths converged',
        caption:
          'Each dot is the end of a Brownian bridge: random-walk paths that start from one point and are conditioned to land on my portrait. Hover to trace a path.',
        pathLabel: 'path',
        density: 'Density',
        densityNote: 'Where the endpoints are drawn from: bright skin and edges are dense, and the face is weighted about 4.5× over the sweater so it stays recognizable.',
        low: 'low',
        high: 'high',
        alt: 'Portrait of Fernando Cortés Tejada',
      },
    },
    work: {
      kicker: 'Work & research',
      title: 'Models in production, and the research behind them',
      illustrative: 'Illustrative model, synthetic data',
      open: 'Explore',
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
      projects: [
        {
          id: 'surebets',
          org: 'Side project',
          years: '2023–2024',
          title: 'Real-time sports-betting arbitrage',
          teaser: 'Odds scraper and execution bot for cross-book NBA arbitrage, run with real money.',
          headline: '~2% per arb',
          summary: 'Scraped NBA odds from several sportsbooks, caught the moments when their prices disagreed enough to lock in a profit, and an execution bot placed both legs within seconds. Run with real money.',
          methods: ['Selenium', 'Airflow', 'Python'],
          metrics: [
            { value: '~2%', label: 'typical edge' },
            { value: '<30s', label: 'to execute, before books corrected' },
          ],
          links: [{ label: 'Code on GitHub', href: links.surebets }],
          viz: { title: 'Sum of implied probabilities over time', bookA: 'Book A', bookB: 'Book B', over: 'over', under: 'under', zone: 'arbitrage zone', stake: 'stakes', waiting: 'watching for an arbitrage…', pause: 'Pause', play: 'Play' },
        },
        {
          id: 'ifrs9',
          org: 'Interbank',
          years: '2017–2020',
          title: 'IFRS 9 credit loss under stress',
          teaser: 'Expected credit loss for ~3M cards: Markov migration, stressed under macro scenarios.',
          headline: '3M cards',
          summary: 'Expected credit loss for ~3M credit cards and a S/ 60B loan book: Markov migration between delinquency buckets, stressed under macro scenarios, with a Monte Carlo loss distribution.',
          methods: ['Markov chains', 'Monte Carlo', 'IFRS 9'],
          metrics: [
            { value: '~3M', label: 'credit cards' },
            { value: 'S/ 60B', label: 'loan book' },
          ],
          viz: { benign: 'Benign', base: 'Base', adverse: 'Adverse', severe: 'Severe', pdTitle: 'Cumulative PD of a current account', pd12: '12-month PD', ecl: 'ECL coverage' },
        },
        {
          id: 'origination',
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Credit-card origination with super-app data',
          teaser: 'Super-app behavior plus bureau data approves more people at the same risk. Published in Expert Systems with Applications, 100+ citations.',
          headline: '+5% approvals',
          summary: 'Adding Rappi app behavior to bureau data separates good and bad applicants better, so the bank approves more people at the same risk. Published in Expert Systems with Applications (100+ citations), validated on 80,000 users in two countries.',
          methods: ['Gradient boosting', 'TreeSHAP', 'Alternative data'],
          deep: {
            story: [
              'At RappiBank we had data a bank never sees: how people use the super-app, from deliveries and discounts to payment errors and rides. The question was whether that behavior says something about credit risk that the bureau score misses.',
              'We trained gradient-boosting models on bureau data only, app data only, and both combined, on about 80,000 users in two Latin American countries, and compared them on AUC, KS and the expected profit of the lending decision. TreeSHAP showed which app behaviors carried the signal.',
              'Adding app data beat the bureau-only model in every segment in both countries on KS, by about ten points on average in one of them, and helped most with young and low-wealth applicants, the people banks find hardest to score. In production it let the bank approve about 5% more customers at the same risk.',
            ],
            docs: [
              { img: '/docs/pages/paper-p1.webp', caption: 'The paper · Expert Systems with Applications', href: 'https://arxiv.org/pdf/2005.14658#page=1' },
              { img: '/docs/pages/paper-p12.webp', caption: 'AUC by model and segment, both countries', href: 'https://arxiv.org/pdf/2005.14658#page=12' },
              { img: '/docs/pages/paper-p20.webp', caption: 'What drives the score (SHAP)', href: 'https://arxiv.org/pdf/2005.14658#page=20' },
            ],
          },
          links: [{ label: 'DOI', href: links.paperDoi }, { label: 'arXiv', href: links.paperArxiv }],
          metrics: [
            { value: '+5%', label: 'approvals for underserved customers' },
            { value: '100+', label: 'citations' },
            { value: '6TB', label: 'data platform' },
          ],
          viz: { title: 'Approval rate vs bad rate', appetite: 'Risk appetite (bad rate)', xAxis: 'bad rate →', bureau: 'Bureau only', withApp: 'Bureau + app data', approved: 'approved' },
        },
        {
          id: 'fraud',
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Real-time transaction fraud detection',
          teaser: 'XGBoost and PyTorch scoring every card payment in 100ms.',
          headline: '−8% fraud losses',
          summary: 'XGBoost and PyTorch models scoring card payments as they happen. Every threshold trades fraud caught against customers wrongly blocked.',
          methods: ['XGBoost', 'PyTorch', 'Real-time inference'],
          metrics: [
            { value: '100ms', label: 'latency (halved)' },
            { value: '−8%', label: 'fraud losses' },
            { value: '−25%+', label: 'false positives' },
          ],
          viz: { title: 'Fraud score distributions', threshold: 'Block above score', legit: 'Legitimate', fraud: 'Fraud', lowRisk: '← low risk', highRisk: 'high risk →', caught: 'Fraud caught', fpr: 'Legit blocked', alerts: 'Alerts / 10k txns' },
        },
        {
          id: 'valuation',
          org: 'Duppla',
          years: '2022–2026',
          title: 'Home valuation for a rent-to-own lender',
          teaser: 'An XGBoost + LightGBM ensemble pricing ~1M Bogotá homes in real time.',
          headline: '~1M homes',
          summary: 'An XGBoost + LightGBM ensemble predicts price per m² from location, size, comparables and rooms, then scales it to a sale price. It moved asset pricing and investor reporting from a 3-day manual process to real time.',
          methods: ['XGBoost', 'LightGBM', 'Ensembles'],
          metrics: [
            { value: '~1M', label: 'homes in Bogotá' },
            { value: '3 days → live', label: 'investor reporting' },
            { value: '$1M+', label: 'new funding attracted' },
          ],
          viz: { title: 'Price per m² by model', locality: 'Locality', area: 'Area', rooms: 'Rooms', ensemble: 'Ensemble', estimate: 'estimated price' },
        },
        {
          id: 'docAi',
          org: 'Duppla',
          years: '2023–2026',
          title: 'AI document validation for underwriting',
          teaser: 'An AI engine that checks property and borrower documents, the bottleneck of every deal.',
          headline: '40h → 3h',
          summary: 'Built with the legal team: an AI engine that checks property and borrower documents, the bottleneck of every deal. I also wrote the core platform in Python (FastAPI, PostgreSQL) and split it into microservices on GCP and AWS.',
          methods: ['LLMs', 'Document AI', 'FastAPI', 'Microservices'],
          metrics: [
            { value: '5 → 20', label: 'homes financed a month' },
            { value: '$70K', label: 'cloud costs saved a year' },
          ],
          viz: { title: 'Before and after the engine', before: 'Before', after: 'With AI', review: 'Review time per deal', homes: 'Homes financed per month' },
        },
      ],
    },
    research: {
      kicker: 'Research',
      title: 'Papers and theses',
      figure: 'Interactive figure',
      explore: 'Explore the model',
      more: 'Read more',
      prev: 'Previous',
      next: 'Next',
      close: 'Close',
      items: [
        {
          headline: 'Validated on 80,000 users in two countries',
          short: 'Super-app behavior predicts default better than bureau data alone, most of all for young and low-wealth borrowers.',
          kind: 'Journal article',
          title: 'Super-App Behavioral Patterns in Credit Risk Models: Financial, Statistical and Regulatory Implications',
          authors: authorsPaper,
          venue: 'Expert Systems with Applications 169 (2021)',
          badge: '100+ citations',
          summary:
            'Behavioral data from a super-app predicts default better than bureau data alone, most of all for young and low-wealth borrowers. Validated on 80,000 users in two Latin American countries.',
          links: [
            { label: 'DOI', href: links.paperDoi },
            { label: 'arXiv', href: links.paperArxiv },
            { label: 'Google Scholar', href: links.scholar },
          ],
        },
        {
          viz: 'thesis',
          vizLabels: { title: 'Credit-card utilization paths', raw: 'Raw paths', clustered: 'Clustered', month: 'm', cluster: 'Cluster', defaultRate: 'default rate', note: 'Synthetic paths with the same structure as the thesis data' },
          headline: 'Beat logit out of sample',
          short: 'A Bayesian model that clusters 12-month credit-card utilization paths and predicts default from the cluster. MCMC in JAGS.',
          kind: 'MS thesis · LACSC 2021 talk',
          title: 'Jointly modelling cluster-dependent profiles of fractional and binary variables from a Bayesian point of view',
          authors: authorsBayes,
          venue: 'MS Statistics, PUCP (2020), summa cum laude',
          summary:
            'A Bayesian model that follows how 12 months of credit-card utilization evolve (a ratio that often sits exactly at 0 or 1), groups clients with similar paths, and predicts default from the group. Estimated by MCMC in JAGS. It beat logistic regression out of sample.',
          deep: {
            story: [
              'Banks usually predict default with a logistic regression on a snapshot of the client. But the credit-card utilization ratio is observed every month, and its trend and shape carry information. It is also awkward to model: it lives in [0, 1] and often sits exactly at 0 (card unused) or 1 (line maxed out).',
              'I proposed a joint Bayesian model. Clients belong to latent clusters; within each cluster, monthly utilization follows a beta-inflated mean regression with a random effect per client, and the probability of default depends on the cluster. A new client is scored by weighting each cluster’s default rate by how well their path fits it. Estimated by MCMC in JAGS.',
              'In simulation it recovered the true parameters, while the usual workaround of squeezing the data into (0, 1) did not, and its out-of-sample AUC was 0.85 against 0.73 for logistic regression. On 12 months of real card data, DIC chose two clusters: one where utilization falls over the year, and one where it climbs toward the limit and defaults more often (58% vs 42%).',
            ],
            docs: [
              { img: '/docs/pages/thesis-slide-1.webp', caption: 'LACSC 2021 talk', href: '/docs/LACSC_2021_slides.pdf#page=1' },
              { img: '/docs/pages/thesis-slide-25.webp', caption: 'Out-of-sample AUC vs logistic regression', href: '/docs/LACSC_2021_slides.pdf#page=25' },
              { img: '/docs/pages/thesis-slide-35.webp', caption: 'The two clusters in real card data', href: '/docs/LACSC_2021_slides.pdf#page=35' },
            ],
          },
          links: [
            { label: 'Thesis', href: links.thesis },
            { label: 'Slides', href: links.lacsc },
          ],
        },
        {
          viz: 'tobit',
          vizLabels: { title: 'Distribution implied by the chosen marginal mean', mean: 'Marginal mean E[Y]', skew: 'Skewness', density: 'density on (0,1)', masses: 'mass at 0 and 1', solved: 'latent location solved numerically', params: 'parameters', clamped: 'mean outside the reachable range, clamped to', note: 'Pick E[Y] directly; the model finds the latent location that produces it' },
          headline: 'Stan code on GitHub',
          short: 'Three regressions for bounded data with mass at 0 and 1, parameterized by the marginal mean, where beta regression fails.',
          kind: 'Working paper',
          title: 'A new normal-like inflated mean regression for bounded responses',
          authors: authorsBayes,
          venue: 'Working paper',
          summary:
            'Three models (Tobit-m, ITNm, ITSNm) for bounded data with mass at the boundaries and high density near them, where beta regression fails. They model the marginal mean directly. Fitted with Bayesian MCMC and applied to a medical dataset.',
          deep: {
            story: [
              'Beta regression is the default for rates and proportions, but it breaks when data piles up at the boundaries or is dense right next to them. Inflated models fix the point masses, yet they usually describe the mean of the interior part, not the overall mean people actually want to explain.',
              'We propose three normal-based models, Tobit-m, ITNm and ITSNm (censored, truncated and skew-normal), parameterized directly by the marginal mean E[Y]. That mean has no closed form in the latent location, so it is solved numerically inside the sampler. Estimation is Bayesian, with MCMC in Stan.',
              'Simulation studies and an application to lung-function data show a better fit than the beta-based alternatives. Working paper with Cristian Bayes and Luis Valdivieso.',
            ],
            docs: [
              { img: '/docs/pages/tobit-p1.webp', caption: 'Working paper · abstract', href: '/docs/Tobit_mean_regression_working_paper.pdf#page=1' },
              { img: '/docs/pages/tobit-p13.webp', caption: 'From the marginal mean to the latent location', href: '/docs/Tobit_mean_regression_working_paper.pdf#page=13' },
            ],
          },
          links: [{ label: 'PDF', href: links.tobit }, { label: 'Stan code', href: links.tobitCode }],
        },
      ] satisfies Publication[],
    },
    lab: {
      kicker: 'Lab',
      title: 'Try the math',
      intro: 'Small interactive versions of models I have built. Everything runs in your browser on synthetic numbers.',
      open: 'Open',
      close: 'Close',
      arb: {
        card: 'Enter two books’ odds and see whether staking both sides locks in a profit.',
        title: 'Arbitrage calculator',
        blurb:
          'Enter the decimal odds two books offer on opposite sides of the same bet. If the implied probabilities add up to less than 1, staking in proportion locks in a profit whichever side wins.',
        bookA: 'Book A, over',
        bookB: 'Book B, under',
        bankroll: 'Total stake',
        implied: 'Sum of implied probabilities',
        verdictYes: 'Arbitrage',
        verdictNo: 'No arbitrage',
        stakeA: 'Stake on A',
        stakeB: 'Stake on B',
        locked: 'Profit either way',
        roi: 'Return',
        note: 'From the engine in nba-surebets.',
      },
      ifrs9: {
        card: 'Move the credit cycle and watch the migration matrix, PD curve, stage mix and loss distribution respond.',
        title: 'IFRS 9 stress test',
        blurb:
          'A credit-card book migrates each month between delinquency buckets. Move the credit cycle and every row of the migration matrix shifts on the normal scale, so probability mass slides toward worse buckets. Stage 1 loans carry 12-month expected loss, Stage 2 lifetime, Stage 3 is already in default.',
        formula: "G′ = Φ(Φ⁻¹(G) + β·z)    ECL = Σ EAD × PD(h) × LGD",
        scenario: 'Credit cycle',
        presets: [
          { label: 'Benign', z: -1 },
          { label: 'Base', z: 0 },
          { label: 'Adverse', z: 1.5 },
          { label: 'Severe', z: 3 },
        ],
        zLabel: 'Systematic factor z',
        lgd: 'Loss given default',
        kpi: { pd12: '12-month PD', pdLife: 'Lifetime PD (5y)', ecl: 'ECL coverage', stage23: 'Stage 2 + 3 in 12 months' },
        matrixTitle: 'Monthly migration matrix',
        matrixFrom: 'from ↓ to →',
        states: ['Current', '1–30', '31–60', '61–90', 'Default'],
        pdTitle: 'Cumulative PD of a current account',
        base: 'Base',
        stressed: 'Scenario',
        month: 'Month',
        stagesTitle: 'Stage mix',
        today: 'Today',
        in12: 'In 12 months',
        stage: 'Stage',
        lossTitle: '12-month credit loss, 3,000 simulated credit cycles',
        el: 'Expected',
        var: '99.9% VaR',
        yours: 'Your scenario',
        percentile: 'percentile',
        lossRate: 'Loss rate',
        probability: 'Probability',
        note: 'Synthetic, calibrated to a credit-card book (base 12-month PD ≈ 4%). The model is the same structure I built at Interbank, at toy scale.',
      },
    },
    teaching: {
      kicker: 'Teaching',
      title: 'Computational Statistics, PUCP',
      body: 'I designed and taught a course in R and Python for 200+ industrial engineering students, teaching statistical modeling through credit cards, loans and mortgages.',
      metrics: [
        { value: '15.45 / 20', label: 'my sections’ average (course: 13.41)' },
        { value: '98', label: 'student Net Promoter Score, highest in the faculty' },
      ],
    },
    path: {
      kicker: 'Path',
      title: 'From physics to credit risk to building a fintech',
      lanes: { edu: 'Education', work: 'Work', teach: 'Teaching', side: 'Research & projects' },
      now: 'today',
      inProgress: 'in progress',
      seeModel: 'See the model',
      items: [
        { lane: 'edu', from: 2012, to: 2016.99, label: 'BS Physics', org: 'PUCP', place: 'Lima', role: 'BS in Physics, magna cum laude', note: 'Quantum Optics Research Group; Jorge André Swieca School on Nonlinear and Quantum Optics (Brazil, 2016); PAIN-PUCP research grant. Founder and first president of the Physics Student Association.', logo: 'pucp.png' },
        { lane: 'work', from: 2017, to: 2020, label: 'Interbank', org: 'Interbank', place: 'Lima', role: 'Data Scientist, credit risk', note: 'IFRS 9 expected credit loss for ~3M cards and a S/ 60B loan book; Monte Carlo loss simulation; origination models.', goto: 'ifrs9', logo: 'interbank.svg' },
        { lane: 'edu', from: 2018, to: 2019.99, label: 'MS Stats', org: 'PUCP', place: 'Lima', role: 'MS in Statistics, summa cum laude', note: 'Full-tuition scholarship. Bayesian thesis on credit-card utilization, presented at LACSC 2021.', logo: 'pucp.png' },
        { lane: 'work', from: 2020, to: 2022, label: 'RappiBank', org: 'RappiBank', place: 'Lima', role: 'Machine Learning Engineer, founding team', note: 'Digital bank of Rappi and Interbank. The bank’s first origination model (published) and real-time fraud detection.', goto: 'origination', logo: 'rappi.png' },
        { lane: 'work', from: 2022, to: 2026.4, label: 'Duppla', org: 'Duppla', place: 'Bogotá', role: 'Founding Engineer, first employee', note: 'LatAm Series A fintech. Built the home valuation ensemble over ~1M Bogotá homes, the core Python platform on GCP and AWS, and an AI document engine that cut legal review from 40 to 3 hours per deal. Subject of an HBS case study.', goto: 'docAi', logo: 'duppla.png' },
        { lane: 'teach', from: 2022, to: 2024, label: 'Professor', org: 'PUCP', place: 'Lima', role: 'Adjunct Professor (part-time), Computational Statistics', note: 'Designed the course in R and Python for 200+ students; sections averaged 15.45/20 vs a 13.41 course average, and a student Net Promoter Score of 98, highest in the faculty.', logo: 'pucp.png' },
        { lane: 'side', from: 2020, to: 2021, label: 'Thesis', org: 'PUCP', place: 'Lima', role: 'MS thesis: Bayesian clusters of credit-card utilization', note: 'Defended in 2020, summa cum laude; presented at the Latin American Conference on Statistical Computing 2021. It beat logistic regression out of sample.', goto: 'thesis', logo: 'pucp.png' },
        { lane: 'side', from: 2021, to: 2022, label: 'Paper', org: 'Expert Systems with Applications', place: 'Elsevier', role: 'Super-App Behavioral Patterns in Credit Risk Models', note: 'Published 2021 from the RappiBank origination work; 100+ citations, validated on 80,000 users in two countries.', goto: 'origination' },
        { lane: 'side', from: 2023, to: 2024.5, label: 'Surebets', org: 'Side project', place: 'Lima', role: 'Real-time sports-betting arbitrage', note: 'Scraped NBA odds across sportsbooks and executed arbitrages automatically in under 30 seconds; run with real money.', goto: 'surebets' },
        { lane: 'edu', from: 2026.6, to: 2028.4, label: 'Harvard', org: 'Harvard School of Engineering and Applied Sciences & Harvard Business School', place: 'Boston', role: 'MS in Engineering Sciences, joint with the MBA', note: 'Graduate engineering at Harvard, building on the physics and statistics degrees; the MBA at HBS runs alongside. Dupré and Nunnelly Fellowship. Graduating May 2028.', current: true, logo: 'harvard.png' },
      ] satisfies PathItem[],
      certs: 'Certifications',
      certList: ['Anthropic: Claude Certified Architect', 'Snowflake: SnowPro Core'],
      stack: 'Tools',
      stackList: ['Python', 'NumPy / Pandas', 'SciPy', 'statsmodels', 'scikit-learn', 'PyTorch', 'XGBoost', 'R', 'JAGS / MCMC', 'SQL', 'PostgreSQL', 'FastAPI', 'GCP', 'AWS'],
    },
    beyond: {
      kicker: 'Beyond work',
      title: 'Background & interests',
      mapTitle: 'Where I’ve studied and worked',
      places: [
        { name: 'Lima', lon: -77.04, lat: -12.05, years: '2012–2022', note: 'BS Physics and MS Statistics at PUCP; credit risk at Interbank, machine learning at RappiBank; taught Computational Statistics.' },
        { name: 'São Paulo', lon: -46.63, lat: -23.55, years: '2016', note: 'Jorge André Swieca School on Nonlinear and Quantum Optics at the University of São Paulo, as a member of PUCP’s Quantum Optics Research Group.' },
        { name: 'Bogotá', lon: -74.07, lat: 4.71, years: '2022–2026', note: 'Founding engineer at Duppla: home valuation, the core platform and the AI document engine.' },
        { name: 'Boston', lon: -71.06, lat: 42.36, years: '2026–', note: 'MS in Engineering Sciences at Harvard, joint with the MBA.', now: true },
      ] satisfies Place[],
      basedHere: 'Based here',
      eduTitle: 'Education',
      education: [
        { logo: 'harvard.png', school: 'Harvard University', detail: 'MS Engineering Sciences + MBA · exp. May 2028', note: 'Dupré and Nunnelly Fellowship' },
        { logo: 'pucp.png', school: 'PUCP', detail: 'MS Statistics, summa cum laude · 2019', note: 'Full-tuition scholarship' },
        { logo: 'pucp.png', school: 'PUCP', detail: 'BS Physics, magna cum laude · 2016', note: 'Quantum Optics Research Group' },
        { logo: 'usp.png', school: 'University of São Paulo', detail: 'Swieca School on Nonlinear and Quantum Optics · 2016' },
      ],
      authTitle: 'Work authorization',
      auth: 'F-1 student · CPT for internships · eligible for STEM OPT',
      langTitle: 'Languages',
      languages: [
        { flag: 'pe', name: 'Spanish', level: 'Native' },
        { flag: 'us', name: 'English', level: 'Fluent' },
        { flag: 'br', name: 'Portuguese', level: 'Basic' },
        { flag: 'fr', name: 'French', level: 'Basic' },
        { flag: 'de', name: 'German', level: 'Basic' },
      ],
      outsideTitle: 'Outside work',
      interests: [
        { icon: '🧗', name: 'Rock climbing', detail: 'up to 5.10c' },
        { icon: '🥾', name: 'Hiking', detail: 'Inca Trail, Huayhuash, Torres del Paine' },
        { icon: '♟️', name: 'Chess', detail: 'casual' },
        { icon: '🎮', name: 'Dota 2', detail: 'casual' },
      ],
      body: 'I climb (up to 5.10c, in seven parks across Peru, Colombia and Yosemite) and hike: the Inca Trail, Huayhuash and Santa Cruz in Peru, and Torres del Paine in Patagonia. Off the mountain, I play chess and Dota 2.',
      photos: [
        { src: '/beyond/climbing.webp', alt: 'Fernando lead climbing a granite slab', caption: 'On the wall', tall: true },
        { src: '/beyond/huayhuash-ridge.webp', alt: 'Two hikers sitting on a rocky ridge above a green valley', caption: 'Cordillera Huayhuash, Peru' },
        { src: '/beyond/huayhuash-pass.webp', alt: 'Two hikers in rain gear at a snowy mountain pass sign', caption: 'A high pass on the Huayhuash circuit', focus: 'center 62%' },
        { src: '/beyond/torres-del-paine.webp', alt: 'Two hikers in front of the snowy peaks of Torres del Paine', caption: 'Torres del Paine, Patagonia' },
        { src: '/beyond/canchacalla.webp', alt: 'Fernando carrying a rope and climbing pack in a dry valley', caption: 'On the approach to the crag, Canchacalla, Lima', focus: 'center 38%' },
      ] satisfies Photo[],
    },
    contact: {
      kicker: 'Contact',
      title: 'Let’s talk',
      body: 'I’m looking for quantitative finance roles: quant research, trading and risk. The quickest way to reach me is email.',
      copy: 'Copy',
      copied: 'Copied',
    },
    footer: { built: 'Built with Astro. Portrait drawn by Brownian bridges.' },
  },

  es: {
    meta: {
      title: 'Fernando Cortés Tejada | Riesgo de crédito, quant y ML',
      description:
        'Candidato MS/MBA en Harvard, con maestría en Estadística (summa cum laude) y bachiller en Física. Riesgo de crédito, modelación cuantitativa y machine learning en producción; ingeniero fundador de una fintech Serie A.',
    },
    nav: { work: 'Trabajo e investigación', research: 'Investigación', lab: 'Lab', path: 'Trayectoria', contact: 'Contacto', switchLabel: 'EN', switchAria: 'Read in English' },
    hero: {
      location: 'Boston, MA',
      credentials: ['Candidato MS/MBA en Harvard, 2028', 'Maestría en Estadística, summa cum laude', 'Bachiller en Física, magna cum laude'],
      role: 'Riesgo de crédito, modelación cuantitativa y ML',
      pitch:
        'Le pongo precio al riesgo con estadística: probabilidad de default, pérdida crediticia esperada, valor de viviendas, cuotas mal valoradas. Luego llevo los modelos a producción y construyo los sistemas que los operan.',
      seeking: 'Busco prácticas en finanzas cuantitativas para el verano de 2027',
      cv: 'Descargar CV',
      viz: {
        paths: 'Trayectorias',
        photo: 'Foto',
        resimulate: 'Re-simular',
        simulating: 'Simulando',
        converged: 'trayectorias convergieron',
        caption:
          'Cada punto es el final de un puente browniano: caminatas aleatorias que parten de un mismo punto y están condicionadas a llegar a mi retrato. Pasa el cursor para seguir una trayectoria.',
        pathLabel: 'trayectoria',
        density: 'Densidad',
        densityNote: 'De dónde se muestrean los puntos finales: la piel clara y los bordes son densos, y el rostro pesa unas 4.5× más que el suéter para que siga siendo reconocible.',
        low: 'baja',
        high: 'alta',
        alt: 'Retrato de Fernando Cortés Tejada',
      },
    },
    work: {
      kicker: 'Trabajo e investigación',
      title: 'Modelos en producción y la investigación detrás',
      illustrative: 'Modelo ilustrativo, datos sintéticos',
      open: 'Explorar',
      close: 'Cerrar',
      prev: 'Anterior',
      next: 'Siguiente',
      projects: [
        {
          id: 'surebets',
          org: 'Proyecto personal',
          years: '2023–2024',
          title: 'Arbitraje de apuestas deportivas en tiempo real',
          teaser: 'Extractor de cuotas y bot de ejecución para arbitraje de la NBA entre casas, con dinero real.',
          headline: '~2% por arbitraje',
          summary: 'Extraía cuotas de la NBA de varias casas de apuestas, detectaba los momentos en que sus precios diferían lo suficiente para asegurar una ganancia, y un bot de ejecución colocaba ambas apuestas en segundos. Operado con dinero real.',
          methods: ['Selenium', 'Airflow', 'Python'],
          metrics: [
            { value: '~2%', label: 'margen típico' },
            { value: '<30s', label: 'para ejecutar, antes de que corrijan' },
          ],
          links: [{ label: 'Código en GitHub', href: links.surebets }],
          viz: { title: 'Suma de probabilidades implícitas en el tiempo', bookA: 'Casa A', bookB: 'Casa B', over: 'más', under: 'menos', zone: 'zona de arbitraje', stake: 'montos', waiting: 'buscando un arbitraje…', pause: 'Pausar', play: 'Reanudar' },
        },
        {
          id: 'ifrs9',
          org: 'Interbank',
          years: '2017–2020',
          title: 'Pérdida crediticia IFRS 9 bajo estrés',
          teaser: 'Pérdida esperada para ~3M tarjetas: migración de Markov estresada con escenarios macro.',
          headline: '3M tarjetas',
          summary: 'Pérdida crediticia esperada para ~3M tarjetas y una cartera de S/ 60 mil M: migración de Markov entre buckets de morosidad, estresada con escenarios macro, y una distribución de pérdidas por Monte Carlo.',
          methods: ['Cadenas de Markov', 'Monte Carlo', 'IFRS 9'],
          metrics: [
            { value: '~3M', label: 'tarjetas de crédito' },
            { value: 'S/ 60 mil M', label: 'cartera de créditos' },
          ],
          viz: { benign: 'Benigno', base: 'Base', adverse: 'Adverso', severe: 'Severo', pdTitle: 'PD acumulada de una cuenta al día', pd12: 'PD a 12 meses', ecl: 'Cobertura ECL' },
        },
        {
          id: 'origination',
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Originación de tarjetas con datos de la super-app',
          teaser: 'El comportamiento en la super-app más el buró aprueba a más personas con el mismo riesgo. Publicado en Expert Systems with Applications, 100+ citas.',
          headline: '+5% aprobaciones',
          summary: 'Sumar el comportamiento en la app de Rappi a los datos del buró separa mejor a buenos y malos solicitantes, así el banco aprueba a más personas con el mismo riesgo. Publicado en Expert Systems with Applications (100+ citas), validado con 80,000 usuarios en dos países.',
          methods: ['Gradient boosting', 'TreeSHAP', 'Datos alternativos'],
          deep: {
            story: [
              'En RappiBank teníamos datos que un banco nunca ve: cómo la gente usa la super-app, desde pedidos y descuentos hasta errores de pago y viajes. La pregunta era si ese comportamiento dice algo sobre el riesgo de crédito que el score del buró no captura.',
              'Entrenamos modelos de gradient boosting solo con buró, solo con datos de la app y con ambos, sobre unos 80,000 usuarios en dos países de Latinoamérica, y los comparamos por AUC, KS y la ganancia esperada de la decisión de crédito. TreeSHAP mostró qué comportamientos de la app aportaban la señal.',
              'Sumar los datos de la app superó al modelo solo con buró en todos los segmentos de ambos países en KS, por unos diez puntos en promedio en uno de ellos, y ayudó sobre todo con solicitantes jóvenes y de bajo patrimonio, los más difíciles de evaluar para un banco. En producción permitió aprobar cerca de 5% más clientes con el mismo riesgo.',
            ],
            docs: [
              { img: '/docs/pages/paper-p1.webp', caption: 'El paper · Expert Systems with Applications', href: 'https://arxiv.org/pdf/2005.14658#page=1' },
              { img: '/docs/pages/paper-p12.webp', caption: 'AUC por modelo y segmento, ambos países', href: 'https://arxiv.org/pdf/2005.14658#page=12' },
              { img: '/docs/pages/paper-p20.webp', caption: 'Qué mueve el score (SHAP)', href: 'https://arxiv.org/pdf/2005.14658#page=20' },
            ],
          },
          links: [{ label: 'DOI', href: links.paperDoi }, { label: 'arXiv', href: links.paperArxiv }],
          metrics: [
            { value: '+5%', label: 'aprobaciones a clientes desatendidos' },
            { value: '100+', label: 'citas' },
            { value: '6TB', label: 'plataforma de datos' },
          ],
          viz: { title: 'Tasa de aprobación vs tasa de malos', appetite: 'Apetito de riesgo (tasa de malos)', xAxis: 'tasa de malos →', bureau: 'Solo buró', withApp: 'Buró + datos de la app', approved: 'aprobados' },
        },
        {
          id: 'fraud',
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Detección de fraude transaccional en tiempo real',
          teaser: 'XGBoost y PyTorch calificando cada pago con tarjeta en 100ms.',
          headline: '−8% pérdidas',
          summary: 'Modelos en XGBoost y PyTorch que califican cada pago con tarjeta en el momento. Cada umbral intercambia fraude detectado por clientes bloqueados por error.',
          methods: ['XGBoost', 'PyTorch', 'Tiempo real'],
          metrics: [
            { value: '100ms', label: 'latencia (a la mitad)' },
            { value: '−8%', label: 'pérdidas por fraude' },
            { value: '−25%+', label: 'falsos positivos' },
          ],
          viz: { title: 'Distribuciones del score de fraude', threshold: 'Bloquear sobre el score', legit: 'Legítimas', fraud: 'Fraude', lowRisk: '← bajo riesgo', highRisk: 'alto riesgo →', caught: 'Fraude detectado', fpr: 'Legítimas bloqueadas', alerts: 'Alertas / 10 mil txns' },
        },
        {
          id: 'valuation',
          org: 'Duppla',
          years: '2022–2026',
          title: 'Valoración de viviendas para un financiador rent-to-own',
          teaser: 'Un ensamble de XGBoost y LightGBM que valora ~1M viviendas en Bogotá en tiempo real.',
          headline: '~1M viviendas',
          summary: 'Un ensamble de XGBoost y LightGBM predice el precio por m² a partir de ubicación, área, comparables y habitaciones, y lo escala al precio de venta. Llevó la valoración de activos y los reportes a inversionistas de un proceso manual de 3 días a tiempo real.',
          methods: ['XGBoost', 'LightGBM', 'Ensambles'],
          metrics: [
            { value: '~1M', label: 'viviendas en Bogotá' },
            { value: '3 días → en vivo', label: 'reportes a inversionistas' },
            { value: 'US$1M+', label: 'nuevo financiamiento' },
          ],
          viz: { title: 'Precio por m² según el modelo', locality: 'Localidad', area: 'Área', rooms: 'Habitaciones', ensemble: 'Ensamble', estimate: 'precio estimado' },
        },
        {
          id: 'docAi',
          org: 'Duppla',
          years: '2023–2026',
          title: 'Validación de documentos con IA',
          teaser: 'Un motor de IA que revisa los documentos del inmueble y del cliente, el cuello de botella de cada operación.',
          headline: '40h → 3h',
          summary: 'Construido con el equipo legal: un motor de IA que revisa los documentos del inmueble y del cliente, el cuello de botella de cada operación. También escribí la plataforma central en Python (FastAPI, PostgreSQL) y la separé en microservicios sobre GCP y AWS.',
          methods: ['LLMs', 'IA documental', 'FastAPI', 'Microservicios'],
          metrics: [
            { value: '5 → 20', label: 'viviendas financiadas al mes' },
            { value: 'US$70K', label: 'ahorro anual en nube' },
          ],
          viz: { title: 'Antes y después del motor', before: 'Antes', after: 'Con IA', review: 'Horas de revisión por operación', homes: 'Viviendas financiadas al mes' },
        },
      ],
    },
    research: {
      kicker: 'Investigación',
      title: 'Artículos y tesis',
      figure: 'Figura interactiva',
      explore: 'Explorar el modelo',
      more: 'Ver más',
      prev: 'Anterior',
      next: 'Siguiente',
      close: 'Cerrar',
      items: [
        {
          headline: 'Validado con 80,000 usuarios en dos países',
          short: 'El comportamiento en una super-app predice el default mejor que el buró solo, sobre todo en jóvenes y personas de bajos ingresos.',
          kind: 'Artículo en revista',
          title: 'Super-App Behavioral Patterns in Credit Risk Models: Financial, Statistical and Regulatory Implications',
          authors: authorsPaper,
          venue: 'Expert Systems with Applications 169 (2021)',
          badge: '100+ citas',
          summary:
            'Los datos de comportamiento de una super-app predicen el default mejor que el buró por sí solo, sobre todo en jóvenes y personas de menores ingresos. Validado con 80,000 usuarios en dos países de Latinoamérica.',
          links: [
            { label: 'DOI', href: links.paperDoi },
            { label: 'arXiv', href: links.paperArxiv },
            { label: 'Google Scholar', href: links.scholar },
          ],
        },
        {
          viz: 'thesis',
          vizLabels: { title: 'Trayectorias de uso de tarjeta', raw: 'Sin agrupar', clustered: 'Agrupadas', month: 'm', cluster: 'Clúster', defaultRate: 'tasa de default', note: 'Trayectorias sintéticas con la misma estructura que los datos de la tesis' },
          headline: 'Superó al logit fuera de muestra',
          short: 'Un modelo bayesiano que agrupa trayectorias de uso de tarjeta a 12 meses y predice el default según el grupo. MCMC en JAGS.',
          kind: 'Tesis de maestría · Charla LACSC 2021',
          title: 'Jointly modelling cluster-dependent profiles of fractional and binary variables from a Bayesian point of view',
          authors: authorsBayes,
          venue: 'Maestría en Estadística, PUCP (2020), summa cum laude',
          summary:
            'Un modelo bayesiano que sigue cómo evoluciona durante 12 meses el uso de la tarjeta de crédito (un ratio que suele caer exactamente en 0 o 1), agrupa a clientes con trayectorias similares y predice el default según el grupo. Estimado por MCMC en JAGS. Superó a la regresión logística fuera de muestra.',
          deep: {
            story: [
              'Los bancos suelen predecir el default con una regresión logística sobre una foto del cliente. Pero el ratio de utilización de la tarjeta se observa cada mes, y su tendencia y forma tienen información. Además es difícil de modelar: vive en [0, 1] y muchas veces vale exactamente 0 (tarjeta sin uso) o 1 (línea copada).',
              'Propuse un modelo bayesiano conjunto. Los clientes pertenecen a clusters latentes; dentro de cada cluster la utilización mensual sigue una regresión beta inflada en la media con un efecto aleatorio por cliente, y la probabilidad de default depende del cluster. Un cliente nuevo se evalúa ponderando la tasa de default de cada cluster según qué tan bien encaja su trayectoria. Estimado por MCMC en JAGS.',
              'En simulación recuperó los parámetros verdaderos, mientras que el truco habitual de comprimir los datos a (0, 1) no lo hizo, y su AUC fuera de muestra fue 0.85 frente a 0.73 de la regresión logística. Con 12 meses de datos reales de tarjetas, el DIC eligió dos clusters: uno donde la utilización baja durante el año y otro donde sube hacia el límite y cae más en default (58% vs 42%).',
            ],
            docs: [
              { img: '/docs/pages/thesis-slide-1.webp', caption: 'Charla en LACSC 2021', href: '/docs/LACSC_2021_slides.pdf#page=1' },
              { img: '/docs/pages/thesis-slide-25.webp', caption: 'AUC fuera de muestra vs regresión logística', href: '/docs/LACSC_2021_slides.pdf#page=25' },
              { img: '/docs/pages/thesis-slide-35.webp', caption: 'Los dos clusters en datos reales', href: '/docs/LACSC_2021_slides.pdf#page=35' },
            ],
          },
          links: [
            { label: 'Tesis', href: links.thesis },
            { label: 'Diapositivas', href: links.lacsc },
          ],
        },
        {
          viz: 'tobit',
          vizLabels: { title: 'Distribución implicada por la media marginal elegida', mean: 'Media marginal E[Y]', skew: 'Asimetría', density: 'densidad en (0,1)', masses: 'masa en 0 y 1', solved: 'ubicación latente resuelta numéricamente', params: 'parámetros', clamped: 'media fuera del rango alcanzable, ajustada a', note: 'Eliges E[Y] directamente; el modelo encuentra la ubicación latente que la produce' },
          headline: 'Código en Stan en GitHub',
          short: 'Tres regresiones para datos acotados con masa en 0 y 1, parametrizadas por la media marginal, donde la regresión beta falla.',
          kind: 'Documento de trabajo',
          title: 'A new normal-like inflated mean regression for bounded responses',
          authors: authorsBayes,
          venue: 'Documento de trabajo',
          summary:
            'Tres modelos (Tobit-m, ITNm, ITSNm) para datos acotados con masa en los extremos y alta densidad cerca de ellos, donde la regresión beta falla. Modelan directamente la media marginal. Estimados con MCMC bayesiano y aplicados a datos médicos.',
          deep: {
            story: [
              'La regresión beta es la opción por defecto para tasas y proporciones, pero falla cuando los datos se acumulan en los bordes o son muy densos cerca de ellos. Los modelos inflados resuelven las masas puntuales, pero suelen describir la media de la parte interior, no la media total que uno quiere explicar.',
              'Proponemos tres modelos basados en la normal, Tobit-m, ITNm e ITSNm (censurada, truncada y skew-normal), parametrizados directamente por la media marginal E[Y]. Esa media no tiene forma cerrada en la localización latente, así que se resuelve numéricamente dentro del muestreador. La estimación es bayesiana, con MCMC en Stan.',
              'Estudios de simulación y una aplicación a datos de función pulmonar muestran mejor ajuste que las alternativas basadas en la beta. Working paper con Cristian Bayes y Luis Valdivieso.',
            ],
            docs: [
              { img: '/docs/pages/tobit-p1.webp', caption: 'Working paper · resumen', href: '/docs/Tobit_mean_regression_working_paper.pdf#page=1' },
              { img: '/docs/pages/tobit-p13.webp', caption: 'De la media marginal a la localización latente', href: '/docs/Tobit_mean_regression_working_paper.pdf#page=13' },
            ],
          },
          links: [{ label: 'PDF', href: links.tobit }, { label: 'Stan code', href: links.tobitCode }],
        },
      ] satisfies Publication[],
    },
    lab: {
      kicker: 'Lab',
      title: 'Prueba la matemática',
      intro: 'Versiones interactivas pequeñas de modelos que he construido. Todo corre en tu navegador con números sintéticos.',
      open: 'Abrir',
      close: 'Cerrar',
      arb: {
        card: 'Ingresa las cuotas de dos casas y mira si apostar a ambos lados asegura una ganancia.',
        title: 'Calculadora de arbitraje',
        blurb:
          'Ingresa las cuotas decimales que dos casas ofrecen en lados opuestos de la misma apuesta. Si las probabilidades implícitas suman menos de 1, repartir el monto en proporción asegura una ganancia gane quien gane.',
        bookA: 'Casa A, más',
        bookB: 'Casa B, menos',
        bankroll: 'Monto total',
        implied: 'Suma de probabilidades implícitas',
        verdictYes: 'Hay arbitraje',
        verdictNo: 'No hay arbitraje',
        stakeA: 'Monto en A',
        stakeB: 'Monto en B',
        locked: 'Ganancia en ambos casos',
        roi: 'Retorno',
        note: 'Del motor de nba-surebets.',
      },
      ifrs9: {
        card: 'Mueve el ciclo crediticio y mira cómo responden la matriz de migración, la curva de PD, las etapas y la distribución de pérdidas.',
        title: 'Stress test IFRS 9',
        blurb:
          'Una cartera de tarjetas migra cada mes entre buckets de morosidad. Mueve el ciclo crediticio y cada fila de la matriz de migración se desplaza en la escala normal, así la probabilidad se corre hacia buckets peores. Los créditos en Etapa 1 provisionan pérdida esperada a 12 meses, los de Etapa 2 de por vida, y la Etapa 3 ya está en default.',
        formula: "G′ = Φ(Φ⁻¹(G) + β·z)    ECL = Σ EAD × PD(h) × LGD",
        scenario: 'Ciclo crediticio',
        presets: [
          { label: 'Benigno', z: -1 },
          { label: 'Base', z: 0 },
          { label: 'Adverso', z: 1.5 },
          { label: 'Severo', z: 3 },
        ],
        zLabel: 'Factor sistemático z',
        lgd: 'Pérdida dado el default',
        kpi: { pd12: 'PD a 12 meses', pdLife: 'PD de por vida (5 años)', ecl: 'Cobertura ECL', stage23: 'Etapa 2 + 3 en 12 meses' },
        matrixTitle: 'Matriz de migración mensual',
        matrixFrom: 'de ↓ a →',
        states: ['Al día', '1–30', '31–60', '61–90', 'Default'],
        pdTitle: 'PD acumulada de una cuenta al día',
        base: 'Base',
        stressed: 'Escenario',
        month: 'Mes',
        stagesTitle: 'Mezcla por etapa',
        today: 'Hoy',
        in12: 'En 12 meses',
        stage: 'Etapa',
        lossTitle: 'Pérdida crediticia a 12 meses, 3,000 ciclos simulados',
        el: 'Esperada',
        var: 'VaR 99.9%',
        yours: 'Tu escenario',
        percentile: 'percentil',
        lossRate: 'Tasa de pérdida',
        probability: 'Probabilidad',
        note: 'Sintético, calibrado a una cartera de tarjetas (PD base a 12 meses ≈ 4%). Es la misma estructura que construí en Interbank, a escala de juguete.',
      },
    },
    teaching: {
      kicker: 'Docencia',
      title: 'Estadística Computacional, PUCP',
      body: 'Diseñé y dicté un curso en R y Python para más de 200 estudiantes de ingeniería industrial, enseñando modelación estadística con tarjetas de crédito, préstamos e hipotecas.',
      metrics: [
        { value: '15.45 / 20', label: 'promedio de mis horarios (curso: 13.41)' },
        { value: '98', label: 'Net Promoter Score estudiantil, el más alto de la facultad' },
      ],
    },
    path: {
      kicker: 'Trayectoria',
      title: 'De la física al riesgo de crédito y a construir una fintech',
      lanes: { edu: 'Educación', work: 'Trabajo', teach: 'Docencia', side: 'Investigación y proyectos' },
      now: 'hoy',
      inProgress: 'en curso',
      seeModel: 'Ver el modelo',
      items: [
        { lane: 'edu', from: 2012, to: 2016.99, label: 'Física', org: 'PUCP', place: 'Lima', role: 'Bachiller en Física, magna cum laude', note: 'Grupo de Investigación en Óptica Cuántica; Escuela Jorge André Swieca de Óptica No Lineal y Cuántica (Brasil, 2016); beca de investigación PAIN-PUCP. Fundador y primer presidente de la Asociación de Estudiantes de Física.', logo: 'pucp.png' },
        { lane: 'work', from: 2017, to: 2020, label: 'Interbank', org: 'Interbank', place: 'Lima', role: 'Data Scientist, riesgo de crédito', note: 'Pérdida crediticia esperada IFRS 9 para ~3M tarjetas y una cartera de S/ 60 mil M; simulación Monte Carlo de pérdidas; modelos de originación.', goto: 'ifrs9', logo: 'interbank.svg' },
        { lane: 'edu', from: 2018, to: 2019.99, label: 'Maestría', org: 'PUCP', place: 'Lima', role: 'Maestría en Estadística, summa cum laude', note: 'Beca completa. Tesis bayesiana sobre uso de tarjetas de crédito, presentada en LACSC 2021.', logo: 'pucp.png' },
        { lane: 'work', from: 2020, to: 2022, label: 'RappiBank', org: 'RappiBank', place: 'Lima', role: 'Machine Learning Engineer, equipo fundador', note: 'Banco digital de Rappi e Interbank. Primer modelo de originación del banco (publicado) y detección de fraude en tiempo real.', goto: 'origination', logo: 'rappi.png' },
        { lane: 'work', from: 2022, to: 2026.4, label: 'Duppla', org: 'Duppla', place: 'Bogotá', role: 'Founding Engineer, primer empleado', note: 'Fintech latinoamericana en Serie A. Construí el ensamble de valoración sobre ~1M viviendas en Bogotá, la plataforma central en Python sobre GCP y AWS, y un motor de documentos con IA que redujo la revisión legal de 40 a 3 horas por operación. Caso de estudio de HBS.', goto: 'docAi', logo: 'duppla.png' },
        { lane: 'teach', from: 2022, to: 2024, label: 'Profesor', org: 'PUCP', place: 'Lima', role: 'Profesor adjunto (tiempo parcial), Estadística Computacional', note: 'Diseñé el curso en R y Python para más de 200 estudiantes; mis horarios promediaron 15.45/20 frente a un promedio del curso de 13.41, y un Net Promoter Score estudiantil de 98, el más alto de la facultad.', logo: 'pucp.png' },
        { lane: 'side', from: 2020, to: 2021, label: 'Tesis', org: 'PUCP', place: 'Lima', role: 'Tesis de maestría: grupos bayesianos de uso de tarjetas', note: 'Sustentada en 2020, summa cum laude; presentada en la Conferencia Latinoamericana de Computación Estadística 2021. Superó a la regresión logística fuera de muestra.', goto: 'thesis', logo: 'pucp.png' },
        { lane: 'side', from: 2021, to: 2022, label: 'Paper', org: 'Expert Systems with Applications', place: 'Elsevier', role: 'Super-App Behavioral Patterns in Credit Risk Models', note: 'Publicado en 2021 a partir del modelo de originación de RappiBank; 100+ citas, validado con 80,000 usuarios en dos países.', goto: 'origination' },
        { lane: 'side', from: 2023, to: 2024.5, label: 'Surebets', org: 'Proyecto personal', place: 'Lima', role: 'Arbitraje de apuestas deportivas en tiempo real', note: 'Extraía cuotas de la NBA de varias casas y ejecutaba los arbitrajes automáticamente en menos de 30 segundos; operado con dinero real.', goto: 'surebets' },
        { lane: 'edu', from: 2026.6, to: 2028.4, label: 'Harvard', org: 'Harvard School of Engineering and Applied Sciences & Harvard Business School', place: 'Boston', role: 'MS en Engineering Sciences, conjunto con el MBA', note: 'Posgrado en ingeniería en Harvard, sobre la base de la física y la estadística; el MBA en HBS va en paralelo. Beca Dupré and Nunnelly. Egreso en mayo de 2028.', current: true, logo: 'harvard.png' },
      ] satisfies PathItem[],
      certs: 'Certificaciones',
      certList: ['Anthropic: Claude Certified Architect', 'Snowflake: SnowPro Core'],
      stack: 'Herramientas',
      stackList: ['Python', 'NumPy / Pandas', 'SciPy', 'statsmodels', 'scikit-learn', 'PyTorch', 'XGBoost', 'R', 'JAGS / MCMC', 'SQL', 'PostgreSQL', 'FastAPI', 'GCP', 'AWS'],
    },
    beyond: {
      kicker: 'Fuera del trabajo',
      title: 'Trayectoria e intereses',
      mapTitle: 'Dónde he estudiado y trabajado',
      places: [
        { name: 'Lima', lon: -77.04, lat: -12.05, years: '2012–2022', note: 'Bachiller en Física y Maestría en Estadística en la PUCP; riesgo de crédito en Interbank, machine learning en RappiBank; dicté Estadística Computacional.' },
        { name: 'São Paulo', lon: -46.63, lat: -23.55, years: '2016', note: 'Escuela Jorge André Swieca de Óptica No Lineal y Cuántica en la Universidad de São Paulo, como miembro del Grupo de Óptica Cuántica de la PUCP.' },
        { name: 'Bogotá', lon: -74.07, lat: 4.71, years: '2022–2026', note: 'Ingeniero fundador en Duppla: valoración de viviendas, la plataforma central y el motor de documentos con IA.' },
        { name: 'Boston', lon: -71.06, lat: 42.36, years: '2026–', note: 'MS en Engineering Sciences en Harvard, conjunto con el MBA.', now: true },
      ] satisfies Place[],
      basedHere: 'Vivo aquí',
      eduTitle: 'Educación',
      education: [
        { logo: 'harvard.png', school: 'Universidad de Harvard', detail: 'MS Engineering Sciences + MBA · egreso mayo 2028', note: 'Beca Dupré and Nunnelly' },
        { logo: 'pucp.png', school: 'PUCP', detail: 'Maestría en Estadística, summa cum laude · 2019', note: 'Beca completa' },
        { logo: 'pucp.png', school: 'PUCP', detail: 'Bachiller en Física, magna cum laude · 2016', note: 'Grupo de Investigación en Óptica Cuántica' },
        { logo: 'usp.png', school: 'Universidad de São Paulo', detail: 'Escuela Swieca de Óptica No Lineal y Cuántica · 2016' },
      ],
      authTitle: 'Autorización de trabajo',
      auth: 'Estudiante F-1 · CPT para prácticas · elegible para STEM OPT',
      langTitle: 'Idiomas',
      languages: [
        { flag: 'pe', name: 'Español', level: 'Nativo' },
        { flag: 'us', name: 'Inglés', level: 'Fluido' },
        { flag: 'br', name: 'Portugués', level: 'Básico' },
        { flag: 'fr', name: 'Francés', level: 'Básico' },
        { flag: 'de', name: 'Alemán', level: 'Básico' },
      ],
      outsideTitle: 'Fuera del trabajo',
      interests: [
        { icon: '🧗', name: 'Escalada en roca', detail: 'hasta 5.10c' },
        { icon: '🥾', name: 'Senderismo', detail: 'Camino Inca, Huayhuash, Torres del Paine' },
        { icon: '♟️', name: 'Ajedrez', detail: 'casual' },
        { icon: '🎮', name: 'Dota 2', detail: 'casual' },
      ],
      body: 'Escalo (hasta 5.10c, en siete parques de Perú, Colombia y Yosemite) y hago senderismo: el Camino Inca, Huayhuash y Santa Cruz en Perú, y Torres del Paine en la Patagonia. Fuera de la montaña, juego ajedrez y Dota 2.',
      photos: [
        { src: '/beyond/climbing.webp', alt: 'Fernando escalando de primero una placa de granito', caption: 'En la pared', tall: true },
        { src: '/beyond/huayhuash-ridge.webp', alt: 'Dos excursionistas sentados en una cresta rocosa sobre un valle verde', caption: 'Cordillera Huayhuash, Perú' },
        { src: '/beyond/huayhuash-pass.webp', alt: 'Dos excursionistas con ropa de lluvia junto al letrero de un paso nevado', caption: 'Un paso alto del circuito Huayhuash', focus: 'center 62%' },
        { src: '/beyond/torres-del-paine.webp', alt: 'Dos excursionistas frente a los picos nevados de Torres del Paine', caption: 'Torres del Paine, Patagonia' },
        { src: '/beyond/canchacalla.webp', alt: 'Fernando cargando una cuerda y una mochila de escalada en un valle seco', caption: 'Camino a la zona de escalada, Canchacalla, Lima', focus: 'center 38%' },
      ] satisfies Photo[],
    },
    contact: {
      kicker: 'Contacto',
      title: 'Conversemos',
      body: 'Busco roles en finanzas cuantitativas: research, trading y riesgo. La forma más rápida de contactarme es por correo.',
      copy: 'Copiar',
      copied: 'Copiado',
    },
    footer: { built: 'Hecho con Astro. Retrato dibujado con puentes brownianos.' },
  },
};

export type Content = (typeof content)['en'];
