export type Lang = 'en' | 'es';

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  org: string;
  headline: string;
  viz: Record<string, string>;
  years: string;
  title: string;
  summary: string;
  methods: string[];
  metrics: Metric[];
  links?: { label: string; href: string }[];
}

export interface Publication {
  /** key into RESEARCH_VIZ for an interactive figure */
  viz?: string;
  vizLabels?: Record<string, string>;
  kind: string;
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
    nav: { work: 'Work', research: 'Research', lab: 'Lab', path: 'Path', contact: 'Contact', switchLabel: 'ES', switchAria: 'Leer en español' },
    hero: {
      location: 'Boston, MA',
      credentials: ['Harvard MS/MBA candidate, 2028', 'MS Statistics, summa cum laude', 'BS Physics'],
      role: 'Credit risk, quantitative modeling & ML in production',
      pitch:
        'I put prices on risk with statistics: probability of default, expected credit loss, home values, mispriced odds. Then I take the models to production and build the systems that run them.',
      cv: 'Download CV',
      stats: [
        { value: '100+', label: 'citations, Expert Systems with Applications' },
        { value: '3M', label: 'credit cards under IFRS 9 models' },
        { value: '1M', label: 'Bogotá homes priced' },
        { value: '40h → 3h', label: 'legal review per deal, AI engine' },
      ],
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
      kicker: 'Selected work',
      title: 'Models that went to production',
      intro: 'Pick a project and play with a small version of it. The models in the visuals are illustrative; the results listed under each one are real.',
      illustrative: 'Illustrative model, synthetic data',
      projects: [
        {
          id: 'surebets',
          org: 'Side project',
          years: '2023–2024',
          title: 'Real-time sports-betting arbitrage',
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
          headline: '3M cards',
          summary: 'Expected credit loss for ~3M credit cards and a S/ 60B loan book: Markov migration between delinquency buckets, stressed under macro scenarios, with a Monte Carlo loss distribution.',
          methods: ['Markov chains', 'Monte Carlo', 'IFRS 9'],
          metrics: [
            { value: '~3M', label: 'credit cards' },
            { value: 'S/ 60B', label: 'loan book' },
          ],
          links: [{ label: 'Full stress test in the Lab', href: '#lab' }],
          viz: { benign: 'Benign', base: 'Base', adverse: 'Adverse', severe: 'Severe', pdTitle: 'Cumulative PD of a current account', pd12: '12-month PD', ecl: 'ECL coverage' },
        },
        {
          id: 'origination',
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Credit-card origination with super-app data',
          headline: '+5% approvals',
          summary: 'Adding Rappi app behavior to bureau data separates good and bad applicants better, so the bank approves more people at the same risk. Published in Expert Systems with Applications.',
          methods: ['Gradient boosting', 'TreeSHAP', 'Alternative data'],
          metrics: [
            { value: '+5%', label: 'approvals for underserved customers' },
            { value: '6TB', label: 'data platform' },
          ],
          viz: { title: 'Approval rate vs bad rate', appetite: 'Risk appetite (bad rate)', xAxis: 'bad rate →', bureau: 'Bureau only', withApp: 'Bureau + app data', approved: 'approved' },
        },
        {
          id: 'fraud',
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Real-time transaction fraud detection',
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
      items: [
        {
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
          kind: 'MS thesis · LACSC 2021 talk',
          title: 'Jointly modelling cluster-dependent profiles of fractional and binary variables from a Bayesian point of view',
          authors: authorsBayes,
          venue: 'MS Statistics, PUCP (2020), summa cum laude',
          summary:
            'A Bayesian model that follows how 12 months of credit-card utilization evolve (a ratio that often sits exactly at 0 or 1), groups clients with similar paths, and predicts default from the group. Estimated by MCMC in JAGS. It beat logistic regression out of sample.',
          links: [
            { label: 'Thesis', href: links.thesis },
            { label: 'Slides', href: links.lacsc },
          ],
        },
        {
          viz: 'tobit',
          vizLabels: { title: 'Distribution implied by the chosen marginal mean', mean: 'Marginal mean E[Y]', skew: 'Skewness', density: 'density on (0,1)', masses: 'mass at 0 and 1', solved: 'latent location solved numerically', params: 'parameters', clamped: 'mean outside the reachable range, clamped to', note: 'Pick E[Y] directly; the model finds the latent location that produces it' },
          kind: 'Working paper',
          title: 'A new normal-like inflated mean regression for bounded responses',
          authors: authorsBayes,
          venue: 'Working paper',
          summary:
            'Three models (Tobit-m, ITNm, ITSNm) for bounded data with mass at the boundaries and high density near them, where beta regression fails. They model the marginal mean directly. Fitted with Bayesian MCMC and applied to a medical dataset.',
          links: [{ label: 'PDF', href: links.tobit }, { label: 'Stan code', href: links.tobitCode }],
        },
      ] satisfies Publication[],
    },
    lab: {
      kicker: 'Lab',
      title: 'Try the math',
      intro: 'Small interactive versions of models I have built. Everything runs in your browser on synthetic numbers.',
      arb: {
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
      intro: 'Click any bar for the details.',
      lanes: { edu: 'Education', work: 'Work', teach: 'Teaching', side: 'Side projects' },
      now: 'today',
      inProgress: 'in progress',
      seeModel: 'See the model',
      items: [
        { lane: 'edu', from: 2012, to: 2016.99, label: 'BS Physics', org: 'PUCP', place: 'Lima', role: 'BS in Physics, magna cum laude', note: 'Quantum Optics Research Group; Jorge André Swieca School on Nonlinear and Quantum Optics (Brazil, 2016); PAIN-PUCP research grant. Founder and first president of the Physics Student Association.' },
        { lane: 'work', from: 2017, to: 2020, label: 'Interbank', org: 'Interbank', place: 'Lima', role: 'Data Scientist, credit risk', note: 'IFRS 9 expected credit loss for ~3M cards and a S/ 60B loan book; Monte Carlo loss simulation; origination models.', goto: 'ifrs9' },
        { lane: 'edu', from: 2018, to: 2019.99, label: 'MS Stats', org: 'PUCP', place: 'Lima', role: 'MS in Statistics, summa cum laude', note: 'Full-tuition scholarship. Bayesian thesis on credit-card utilization, presented at LACSC 2021.' },
        { lane: 'work', from: 2020, to: 2022, label: 'RappiBank', org: 'RappiBank', place: 'Lima', role: 'Machine Learning Engineer, founding team', note: 'Digital bank of Rappi and Interbank. The bank’s first origination model (published) and real-time fraud detection.', goto: 'origination' },
        { lane: 'work', from: 2022, to: 2026.4, label: 'Duppla', org: 'Duppla', place: 'Bogotá', role: 'Founding Engineer, first employee', note: 'LatAm Series A fintech. Built the home valuation ensemble over ~1M Bogotá homes, the core Python platform on GCP and AWS, and an AI document engine that cut legal review from 40 to 3 hours per deal. Subject of an HBS case study.', goto: 'docAi' },
        { lane: 'teach', from: 2022, to: 2024, label: 'Professor', org: 'PUCP', place: 'Lima', role: 'Adjunct Professor (part-time), Computational Statistics', note: 'Designed the course in R and Python for 200+ students; sections averaged 15.45/20 vs a 13.41 course average, and a student Net Promoter Score of 98, highest in the faculty.' },
        { lane: 'side', from: 2023, to: 2024.5, label: 'Surebets', org: 'Side project', place: 'Lima', role: 'Real-time sports-betting arbitrage', note: 'Scraped NBA odds across sportsbooks and executed arbitrages automatically in under 30 seconds; run with real money.', goto: 'surebets' },
        { lane: 'edu', from: 2026.6, to: 2028.4, label: 'Harvard', org: 'Harvard SEAS & Harvard Business School', place: 'Boston', role: 'MS in Engineering Sciences, joint with the MBA', note: 'Graduate engineering at Harvard SEAS, building on the physics and statistics degrees; the MBA at HBS runs alongside. Dupré and Nunnelly Fellowship. Graduating May 2028.', current: true },
      ] satisfies PathItem[],
      certs: 'Certifications',
      certList: ['Anthropic: Claude Certified Architect', 'Snowflake: SnowPro Core'],
      stack: 'Tools',
      stackList: ['Python', 'NumPy / Pandas', 'SciPy', 'statsmodels', 'scikit-learn', 'PyTorch', 'XGBoost', 'R', 'JAGS / MCMC', 'SQL', 'PostgreSQL', 'FastAPI', 'GCP', 'AWS'],
    },
    beyond: {
      kicker: 'Beyond work',
      title: 'Mountains',
      body: 'I climb (up to 5.10c, in seven parks across Peru, Colombia and Yosemite) and trek: the Inca Trail, Huayhuash and Santa Cruz in Peru, and Torres del Paine in Patagonia.',
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
      body: 'I’m looking for roles in quantitative research, credit risk and ML in finance. The quickest way to reach me is email.',
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
    nav: { work: 'Trabajo', research: 'Investigación', lab: 'Lab', path: 'Trayectoria', contact: 'Contacto', switchLabel: 'EN', switchAria: 'Read in English' },
    hero: {
      location: 'Boston, MA',
      credentials: ['Candidato MS/MBA en Harvard, 2028', 'Maestría en Estadística, summa cum laude', 'Bachiller en Física'],
      role: 'Riesgo de crédito, modelación cuantitativa y ML en producción',
      pitch:
        'Le pongo precio al riesgo con estadística: probabilidad de default, pérdida crediticia esperada, valor de viviendas, cuotas mal valoradas. Luego llevo los modelos a producción y construyo los sistemas que los operan.',
      cv: 'Descargar CV',
      stats: [
        { value: '100+', label: 'citas, Expert Systems with Applications' },
        { value: '3M', label: 'tarjetas de crédito bajo modelos IFRS 9' },
        { value: '1M', label: 'viviendas valoradas en Bogotá' },
        { value: '40h → 3h', label: 'revisión legal por operación, motor de IA' },
      ],
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
      kicker: 'Trabajo seleccionado',
      title: 'Modelos que llegaron a producción',
      intro: 'Elige un proyecto y juega con una versión pequeña. Los modelos de los gráficos son ilustrativos; los resultados listados debajo de cada uno son reales.',
      illustrative: 'Modelo ilustrativo, datos sintéticos',
      projects: [
        {
          id: 'surebets',
          org: 'Proyecto personal',
          years: '2023–2024',
          title: 'Arbitraje de apuestas deportivas en tiempo real',
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
          headline: '3M tarjetas',
          summary: 'Pérdida crediticia esperada para ~3M tarjetas y una cartera de S/ 60 mil M: migración de Markov entre buckets de morosidad, estresada con escenarios macro, y una distribución de pérdidas por Monte Carlo.',
          methods: ['Cadenas de Markov', 'Monte Carlo', 'IFRS 9'],
          metrics: [
            { value: '~3M', label: 'tarjetas de crédito' },
            { value: 'S/ 60 mil M', label: 'cartera de créditos' },
          ],
          links: [{ label: 'Stress test completo en el Lab', href: '#lab' }],
          viz: { benign: 'Benigno', base: 'Base', adverse: 'Adverso', severe: 'Severo', pdTitle: 'PD acumulada de una cuenta al día', pd12: 'PD a 12 meses', ecl: 'Cobertura ECL' },
        },
        {
          id: 'origination',
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Originación de tarjetas con datos de la super-app',
          headline: '+5% aprobaciones',
          summary: 'Sumar el comportamiento en la app de Rappi a los datos del buró separa mejor a buenos y malos solicitantes, así el banco aprueba a más personas con el mismo riesgo. Publicado en Expert Systems with Applications.',
          methods: ['Gradient boosting', 'TreeSHAP', 'Datos alternativos'],
          metrics: [
            { value: '+5%', label: 'aprobaciones a clientes desatendidos' },
            { value: '6TB', label: 'plataforma de datos' },
          ],
          viz: { title: 'Tasa de aprobación vs tasa de malos', appetite: 'Apetito de riesgo (tasa de malos)', xAxis: 'tasa de malos →', bureau: 'Solo buró', withApp: 'Buró + datos de la app', approved: 'aprobados' },
        },
        {
          id: 'fraud',
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Detección de fraude transaccional en tiempo real',
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
      items: [
        {
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
          kind: 'Tesis de maestría · Charla LACSC 2021',
          title: 'Jointly modelling cluster-dependent profiles of fractional and binary variables from a Bayesian point of view',
          authors: authorsBayes,
          venue: 'Maestría en Estadística, PUCP (2020), summa cum laude',
          summary:
            'Un modelo bayesiano que sigue cómo evoluciona durante 12 meses el uso de la tarjeta de crédito (un ratio que suele caer exactamente en 0 o 1), agrupa a clientes con trayectorias similares y predice el default según el grupo. Estimado por MCMC en JAGS. Superó a la regresión logística fuera de muestra.',
          links: [
            { label: 'Tesis', href: links.thesis },
            { label: 'Diapositivas', href: links.lacsc },
          ],
        },
        {
          viz: 'tobit',
          vizLabels: { title: 'Distribución implicada por la media marginal elegida', mean: 'Media marginal E[Y]', skew: 'Asimetría', density: 'densidad en (0,1)', masses: 'masa en 0 y 1', solved: 'ubicación latente resuelta numéricamente', params: 'parámetros', clamped: 'media fuera del rango alcanzable, ajustada a', note: 'Eliges E[Y] directamente; el modelo encuentra la ubicación latente que la produce' },
          kind: 'Documento de trabajo',
          title: 'A new normal-like inflated mean regression for bounded responses',
          authors: authorsBayes,
          venue: 'Documento de trabajo',
          summary:
            'Tres modelos (Tobit-m, ITNm, ITSNm) para datos acotados con masa en los extremos y alta densidad cerca de ellos, donde la regresión beta falla. Modelan directamente la media marginal. Estimados con MCMC bayesiano y aplicados a datos médicos.',
          links: [{ label: 'PDF', href: links.tobit }, { label: 'Stan code', href: links.tobitCode }],
        },
      ] satisfies Publication[],
    },
    lab: {
      kicker: 'Lab',
      title: 'Prueba la matemática',
      intro: 'Versiones interactivas pequeñas de modelos que he construido. Todo corre en tu navegador con números sintéticos.',
      arb: {
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
      intro: 'Haz clic en cualquier barra para ver el detalle.',
      lanes: { edu: 'Educación', work: 'Trabajo', teach: 'Docencia', side: 'Proyectos' },
      now: 'hoy',
      inProgress: 'en curso',
      seeModel: 'Ver el modelo',
      items: [
        { lane: 'edu', from: 2012, to: 2016.99, label: 'Física', org: 'PUCP', place: 'Lima', role: 'Bachiller en Física, magna cum laude', note: 'Grupo de Investigación en Óptica Cuántica; Escuela Jorge André Swieca de Óptica No Lineal y Cuántica (Brasil, 2016); beca de investigación PAIN-PUCP. Fundador y primer presidente de la Asociación de Estudiantes de Física.' },
        { lane: 'work', from: 2017, to: 2020, label: 'Interbank', org: 'Interbank', place: 'Lima', role: 'Data Scientist, riesgo de crédito', note: 'Pérdida crediticia esperada IFRS 9 para ~3M tarjetas y una cartera de S/ 60 mil M; simulación Monte Carlo de pérdidas; modelos de originación.', goto: 'ifrs9' },
        { lane: 'edu', from: 2018, to: 2019.99, label: 'Maestría', org: 'PUCP', place: 'Lima', role: 'Maestría en Estadística, summa cum laude', note: 'Beca completa. Tesis bayesiana sobre uso de tarjetas de crédito, presentada en LACSC 2021.' },
        { lane: 'work', from: 2020, to: 2022, label: 'RappiBank', org: 'RappiBank', place: 'Lima', role: 'Machine Learning Engineer, equipo fundador', note: 'Banco digital de Rappi e Interbank. Primer modelo de originación del banco (publicado) y detección de fraude en tiempo real.', goto: 'origination' },
        { lane: 'work', from: 2022, to: 2026.4, label: 'Duppla', org: 'Duppla', place: 'Bogotá', role: 'Founding Engineer, primer empleado', note: 'Fintech latinoamericana en Serie A. Construí el ensamble de valoración sobre ~1M viviendas en Bogotá, la plataforma central en Python sobre GCP y AWS, y un motor de documentos con IA que redujo la revisión legal de 40 a 3 horas por operación. Caso de estudio de HBS.', goto: 'docAi' },
        { lane: 'teach', from: 2022, to: 2024, label: 'Profesor', org: 'PUCP', place: 'Lima', role: 'Profesor adjunto (tiempo parcial), Estadística Computacional', note: 'Diseñé el curso en R y Python para más de 200 estudiantes; mis horarios promediaron 15.45/20 frente a un promedio del curso de 13.41, y un Net Promoter Score estudiantil de 98, el más alto de la facultad.' },
        { lane: 'side', from: 2023, to: 2024.5, label: 'Surebets', org: 'Proyecto personal', place: 'Lima', role: 'Arbitraje de apuestas deportivas en tiempo real', note: 'Extraía cuotas de la NBA de varias casas y ejecutaba los arbitrajes automáticamente en menos de 30 segundos; operado con dinero real.', goto: 'surebets' },
        { lane: 'edu', from: 2026.6, to: 2028.4, label: 'Harvard', org: 'Harvard SEAS & Harvard Business School', place: 'Boston', role: 'MS en Engineering Sciences, conjunto con el MBA', note: 'Posgrado en ingeniería en Harvard SEAS, sobre la base de la física y la estadística; el MBA en HBS va en paralelo. Beca Dupré and Nunnelly. Egreso en mayo de 2028.', current: true },
      ] satisfies PathItem[],
      certs: 'Certificaciones',
      certList: ['Anthropic: Claude Certified Architect', 'Snowflake: SnowPro Core'],
      stack: 'Herramientas',
      stackList: ['Python', 'NumPy / Pandas', 'SciPy', 'statsmodels', 'scikit-learn', 'PyTorch', 'XGBoost', 'R', 'JAGS / MCMC', 'SQL', 'PostgreSQL', 'FastAPI', 'GCP', 'AWS'],
    },
    beyond: {
      kicker: 'Fuera del trabajo',
      title: 'Montañas',
      body: 'Escalo (hasta 5.10c, en siete parques de Perú, Colombia y Yosemite) y hago trekking: el Camino Inca, Huayhuash y Santa Cruz en Perú, y Torres del Paine en la Patagonia.',
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
      body: 'Busco roles en investigación cuantitativa, riesgo de crédito y ML en finanzas. La forma más rápida de contactarme es por correo.',
      copy: 'Copiar',
      copied: 'Copiado',
    },
    footer: { built: 'Hecho con Astro. Retrato dibujado con puentes brownianos.' },
  },
};

export type Content = (typeof content)['en'];
