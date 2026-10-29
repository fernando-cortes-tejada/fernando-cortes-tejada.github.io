export type Lang = 'en' | 'es';

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  org: string;
  years: string;
  title: string;
  summary: string;
  methods: string[];
  metrics: Metric[];
  links?: { label: string; href: string }[];
}

export interface Publication {
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
  years: string;
  org: string;
  place: string;
  role: string;
  note?: string;
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
  surebets: 'https://github.com/fernando-cortes-tejada/nba-surebets',
};

const authorsPaper = 'L. Roa, A. Correa-Bahnsen, G. Suarez, F. Cortés-Tejada, M. A. Luque, C. Bravo';
const authorsBayes = 'F. Cortés-Tejada, C. L. Bayes, L. Valdivieso';

export const content = {
  en: {
    meta: {
      title: 'Fernando Cortés Tejada | Credit Risk, Quant & ML',
      description:
        'Statistician and physicist working on credit risk, quantitative modeling and machine learning in production. MS/MBA candidate at Harvard; former fintech CTO.',
    },
    nav: { work: 'Work', research: 'Research', lab: 'Lab', path: 'Path', contact: 'Contact', switchLabel: 'ES', switchAria: 'Leer en español' },
    hero: {
      location: 'Boston, MA',
      role: 'Credit risk, quantitative modeling & ML in production',
      pitch:
        'I put prices on risk with statistics: probability of default, expected credit loss, home values, mispriced odds. Then I take the models to production and build the teams that run them.',
      cv: 'Download CV',
      stats: [
        { value: '100+', label: 'citations, Expert Systems with Applications' },
        { value: '3M', label: 'credit cards under IFRS 9 models' },
        { value: '1M', label: 'Bogotá homes priced' },
        { value: '$14.5M', label: 'raised as CTO (seed + Series A)' },
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
        alt: 'Portrait of Fernando Cortés Tejada',
      },
    },
    work: {
      kicker: 'Selected work',
      title: 'Models that went to production',
      intro: 'Credit, fraud, valuation and arbitrage: each one shipped and used to make real decisions with real money.',
      projects: [
        {
          org: 'Interbank',
          years: '2017–2020',
          title: 'IFRS 9 expected credit loss under stressed macro scenarios',
          summary:
            'Provisioning models for credit cards, mortgages and consumer loans: ECL = PD × LGD × EAD (with a credit conversion factor for card limits), 12-month and lifetime, by stage. PD came from Markov transition matrices between delinquency buckets, stressed by shifting the matrices under macroeconomic scenarios. A Monte Carlo simulator produced the full loss distribution, not just its mean.',
          methods: ['Markov chains', 'Monte Carlo', 'IFRS 9', 'Logistic regression'],
          metrics: [
            { value: '~3M', label: 'credit cards' },
            { value: 'S/ 60B', label: 'loan book' },
          ],
        },
        {
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Credit-card origination with super-app data',
          summary:
            "RappiBank's first credit-card origination model, adding behavioral data from the Rappi app to credit-bureau data. This work became the peer-reviewed paper below. It ran on a 6TB data platform shared with Rappi and Interbank.",
          methods: ['Gradient boosting', 'TreeSHAP', 'Alternative data'],
          metrics: [
            { value: '+5%', label: 'approvals for underserved customers' },
            { value: '6TB', label: 'data platform' },
          ],
        },
        {
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Real-time transaction fraud detection',
          summary: 'Transaction fraud models in XGBoost and PyTorch, scoring card payments as they happen.',
          methods: ['XGBoost', 'PyTorch', 'Real-time inference'],
          metrics: [
            { value: '100ms', label: 'inference latency (halved)' },
            { value: '−8%', label: 'fraud losses' },
            { value: '−25%', label: 'false positives' },
          ],
        },
        {
          org: 'Duppla',
          years: '2022–2026',
          title: 'Home valuation model for a rent-to-own lender',
          summary:
            'An ensemble of XGBoost and LightGBM predicts price per m² from location, size, comparable sales, rooms and features, then scales it to a sale price. Together with real-time asset pricing and investor reporting, it supported the portfolio as it grew past $25M.',
          methods: ['XGBoost', 'LightGBM', 'Ensembles', 'GCP'],
          metrics: [
            { value: '~1M', label: 'homes in Bogotá' },
            { value: '3 days → live', label: 'investor reporting' },
            { value: '$1M+', label: 'new funding attracted' },
          ],
        },
        {
          org: 'Duppla',
          years: '2023–2026',
          title: 'AI document validation for mortgage underwriting',
          summary:
            'Built with the legal team: an AI engine that checks property and borrower documents, the bottleneck in every deal. As CTO I also led technical due diligence for both funding rounds and grew engineering from 1 to 7.',
          methods: ['LLMs', 'Document AI', 'Workflow automation'],
          metrics: [
            { value: '40h → 3h', label: 'review per deal' },
            { value: '10×', label: 'deal throughput' },
            { value: '5 → 20', label: 'homes financed per month' },
          ],
        },
        {
          org: 'Side project',
          years: '2023–2024',
          title: 'Real-time sports-betting arbitrage',
          summary:
            'Scraped NBA odds from several sportsbooks every five minutes, found prices across books where backing every outcome locks in a profit, and sent the stakes to Telegram. Run with real money, with stakes kept modest so the accounts would not get limited.',
          methods: ['Selenium', 'Airflow', 'Python'],
          metrics: [
            { value: '~2%', label: 'typical edge per arbitrage' },
            { value: '<30s', label: 'before books corrected the price' },
          ],
          links: [{ label: 'Code on GitHub', href: links.surebets }],
        },
      ] satisfies Project[],
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
          kind: 'Working paper',
          title: 'A new normal-like inflated mean regression for bounded responses',
          authors: authorsBayes,
          venue: 'Working paper',
          summary:
            'Three models (Tobit-m, ITNm, ITSNm) for bounded data with mass at the boundaries and high density near them, where beta regression fails. They model the marginal mean directly. Fitted with Bayesian MCMC and applied to a medical dataset.',
          links: [{ label: 'PDF', href: links.tobit }],
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
      soon: 'Coming next: an IFRS 9 stress test where you shift a transition matrix and watch lifetime ECL respond, and the thesis clustering model running live.',
    },
    teaching: {
      kicker: 'Teaching',
      title: 'Computational Statistics, PUCP',
      body: 'I designed and taught a course in R and Python for 200+ industrial engineering students, teaching statistical modeling through credit cards, loans and mortgages.',
      metrics: [
        { value: '15.45 / 20', label: 'my sections’ average (course: 13.41)' },
        { value: '98', label: 'faculty-top student NPS' },
      ],
    },
    path: {
      kicker: 'Path',
      title: 'From physics to credit risk to building a fintech',
      items: [
        { years: '2026–2028', org: 'Harvard Business School & SEAS', place: 'Boston', role: 'MS/MBA candidate, Engineering Sciences', note: 'Dupré and Nunnelly Fellowship. Tech, Fintech and Latin America clubs.' },
        { years: '2022–2026', org: 'Duppla', place: 'Bogotá', role: 'CTO (2023–26) · Lead Data Engineer (2022–23)', note: 'First employee at a Series A rent-to-own fintech; subject of an HBS case study.' },
        { years: '2022–2024', org: 'PUCP', place: 'Lima', role: 'Adjunct Professor, Computational Statistics' },
        { years: '2020–2022', org: 'RappiBank', place: 'Lima', role: 'Lead Data Engineer, founding team', note: 'Digital bank of Rappi and Interbank.' },
        { years: '2017–2020', org: 'Interbank', place: 'Lima', role: 'Data Scientist, credit risk' },
        { years: '2018–2019', org: 'PUCP', place: 'Lima', role: 'MS in Statistics, summa cum laude', note: 'Full-tuition scholarship.' },
        { years: '2012–2016', org: 'PUCP', place: 'Lima', role: 'BS in Physics, magna cum laude', note: 'Founder and first president of the Physics Student Association; PAIN-PUCP research grant.' },
      ] satisfies PathItem[],
      certs: 'Certifications',
      certList: ['Anthropic: Claude Certified Architect', 'Snowflake: SnowPro Core'],
      stack: 'Tools',
      stackList: ['Python', 'R', 'SQL', 'PyTorch', 'XGBoost', 'JAGS / MCMC', 'Snowflake', 'Databricks', 'Airflow', 'dbt', 'GCP', 'AWS', 'TypeScript'],
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
        { src: '/beyond/canchacalla.webp', alt: 'Fernando carrying a rope and climbing pack in a dry valley', caption: 'Walking in to the crag, Canchacalla, Lima', focus: 'center 38%' },
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
        'Estadístico y físico que trabaja en riesgo de crédito, modelación cuantitativa y machine learning en producción. Candidato MS/MBA en Harvard; ex-CTO de una fintech.',
    },
    nav: { work: 'Trabajo', research: 'Investigación', lab: 'Lab', path: 'Trayectoria', contact: 'Contacto', switchLabel: 'EN', switchAria: 'Read in English' },
    hero: {
      location: 'Boston, MA',
      role: 'Riesgo de crédito, modelación cuantitativa y ML en producción',
      pitch:
        'Le pongo precio al riesgo con estadística: probabilidad de default, pérdida crediticia esperada, valor de viviendas, cuotas mal valoradas. Luego llevo los modelos a producción y armo los equipos que los operan.',
      cv: 'Descargar CV',
      stats: [
        { value: '100+', label: 'citas, Expert Systems with Applications' },
        { value: '3M', label: 'tarjetas de crédito bajo modelos IFRS 9' },
        { value: '1M', label: 'viviendas valoradas en Bogotá' },
        { value: 'US$14.5M', label: 'levantados como CTO (semilla + Serie A)' },
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
        alt: 'Retrato de Fernando Cortés Tejada',
      },
    },
    work: {
      kicker: 'Trabajo seleccionado',
      title: 'Modelos que llegaron a producción',
      intro: 'Crédito, fraude, valoración y arbitraje: todos se pusieron en producción y se usaron para tomar decisiones reales con dinero real.',
      projects: [
        {
          org: 'Interbank',
          years: '2017–2020',
          title: 'Pérdida crediticia esperada IFRS 9 bajo escenarios macro estresados',
          summary:
            'Modelos de provisiones para tarjetas de crédito, hipotecas y créditos de consumo: ECL = PD × LGD × EAD (con factor de conversión crediticia para las líneas de tarjeta), a 12 meses y de por vida, por etapa. La PD salía de matrices de transición de Markov entre buckets de morosidad, estresadas desplazando las matrices según escenarios macroeconómicos. Un simulador Monte Carlo daba la distribución completa de pérdidas, no solo su media.',
          methods: ['Cadenas de Markov', 'Monte Carlo', 'IFRS 9', 'Regresión logística'],
          metrics: [
            { value: '~3M', label: 'tarjetas de crédito' },
            { value: 'S/ 60 mil M', label: 'cartera de créditos' },
          ],
        },
        {
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Originación de tarjetas con datos de la super-app',
          summary:
            'El primer modelo de originación de tarjetas de RappiBank, que sumaba datos de comportamiento de la app de Rappi a los datos del buró de crédito. Este trabajo se convirtió en el artículo arbitrado de abajo. Corría sobre una plataforma de datos de 6TB compartida con Rappi e Interbank.',
          methods: ['Gradient boosting', 'TreeSHAP', 'Datos alternativos'],
          metrics: [
            { value: '+5%', label: 'aprobaciones a clientes desatendidos' },
            { value: '6TB', label: 'plataforma de datos' },
          ],
        },
        {
          org: 'RappiBank',
          years: '2020–2022',
          title: 'Detección de fraude transaccional en tiempo real',
          summary: 'Modelos de fraude transaccional en XGBoost y PyTorch que califican cada pago con tarjeta en el momento.',
          methods: ['XGBoost', 'PyTorch', 'Inferencia en tiempo real'],
          metrics: [
            { value: '100ms', label: 'latencia de inferencia (a la mitad)' },
            { value: '−8%', label: 'pérdidas por fraude' },
            { value: '−25%', label: 'falsos positivos' },
          ],
        },
        {
          org: 'Duppla',
          years: '2022–2026',
          title: 'Modelo de valoración de viviendas para un financiador rent-to-own',
          summary:
            'Un ensamble de XGBoost y LightGBM predice el precio por m² a partir de ubicación, área, ventas comparables, habitaciones y características, y luego lo escala al precio de venta. Junto con la valoración de activos y los reportes a inversionistas en tiempo real, sostuvo el crecimiento del portafolio por encima de US$25M.',
          methods: ['XGBoost', 'LightGBM', 'Ensambles', 'GCP'],
          metrics: [
            { value: '~1M', label: 'viviendas en Bogotá' },
            { value: '3 días → en vivo', label: 'reportes a inversionistas' },
            { value: 'US$1M+', label: 'nuevo financiamiento atraído' },
          ],
        },
        {
          org: 'Duppla',
          years: '2023–2026',
          title: 'Validación de documentos con IA para la evaluación hipotecaria',
          summary:
            'Construido con el equipo legal: un motor de IA que revisa los documentos del inmueble y del cliente, el cuello de botella de cada operación. Como CTO también lideré la due diligence técnica de ambas rondas y crecí el equipo de ingeniería de 1 a 7.',
          methods: ['LLMs', 'IA documental', 'Automatización'],
          metrics: [
            { value: '40h → 3h', label: 'revisión por operación' },
            { value: '10×', label: 'operaciones procesadas' },
            { value: '5 → 20', label: 'viviendas financiadas al mes' },
          ],
        },
        {
          org: 'Proyecto personal',
          years: '2023–2024',
          title: 'Arbitraje de apuestas deportivas en tiempo real',
          summary:
            'Extraía cuotas de la NBA de varias casas de apuestas cada cinco minutos, encontraba precios entre casas donde apostar a todos los resultados asegura una ganancia, y enviaba los montos a Telegram. Lo operé con dinero real, con montos modestos para que no limitaran las cuentas.',
          methods: ['Selenium', 'Airflow', 'Python'],
          metrics: [
            { value: '~2%', label: 'margen típico por arbitraje' },
            { value: '<30s', label: 'antes de que la casa corrija la cuota' },
          ],
          links: [{ label: 'Código en GitHub', href: links.surebets }],
        },
      ] satisfies Project[],
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
          kind: 'Documento de trabajo',
          title: 'A new normal-like inflated mean regression for bounded responses',
          authors: authorsBayes,
          venue: 'Documento de trabajo',
          summary:
            'Tres modelos (Tobit-m, ITNm, ITSNm) para datos acotados con masa en los extremos y alta densidad cerca de ellos, donde la regresión beta falla. Modelan directamente la media marginal. Estimados con MCMC bayesiano y aplicados a datos médicos.',
          links: [{ label: 'PDF', href: links.tobit }],
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
      soon: 'Lo próximo: un stress test IFRS 9 donde desplazas una matriz de transición y ves cómo responde la ECL de por vida, y el modelo de clústeres de la tesis corriendo en vivo.',
    },
    teaching: {
      kicker: 'Docencia',
      title: 'Estadística Computacional, PUCP',
      body: 'Diseñé y dicté un curso en R y Python para más de 200 estudiantes de ingeniería industrial, enseñando modelación estadística con tarjetas de crédito, préstamos e hipotecas.',
      metrics: [
        { value: '15.45 / 20', label: 'promedio de mis horarios (curso: 13.41)' },
        { value: '98', label: 'NPS estudiantil, el más alto de la facultad' },
      ],
    },
    path: {
      kicker: 'Trayectoria',
      title: 'De la física al riesgo de crédito y a construir una fintech',
      items: [
        { years: '2026–2028', org: 'Harvard Business School & SEAS', place: 'Boston', role: 'Candidato MS/MBA, Engineering Sciences', note: 'Beca Dupré and Nunnelly. Clubs de Tech, Fintech y Latinoamérica.' },
        { years: '2022–2026', org: 'Duppla', place: 'Bogotá', role: 'CTO (2023–26) · Lead Data Engineer (2022–23)', note: 'Primer empleado de una fintech rent-to-own con Serie A; caso de estudio de HBS.' },
        { years: '2022–2024', org: 'PUCP', place: 'Lima', role: 'Profesor, Estadística Computacional' },
        { years: '2020–2022', org: 'RappiBank', place: 'Lima', role: 'Lead Data Engineer, equipo fundador', note: 'Banco digital de Rappi e Interbank.' },
        { years: '2017–2020', org: 'Interbank', place: 'Lima', role: 'Data Scientist, riesgo de crédito' },
        { years: '2018–2019', org: 'PUCP', place: 'Lima', role: 'Maestría en Estadística, summa cum laude', note: 'Beca completa.' },
        { years: '2012–2016', org: 'PUCP', place: 'Lima', role: 'Bachiller en Física, magna cum laude', note: 'Fundador y primer presidente de la Asociación de Estudiantes de Física; beca de investigación PAIN-PUCP.' },
      ] satisfies PathItem[],
      certs: 'Certificaciones',
      certList: ['Anthropic: Claude Certified Architect', 'Snowflake: SnowPro Core'],
      stack: 'Herramientas',
      stackList: ['Python', 'R', 'SQL', 'PyTorch', 'XGBoost', 'JAGS / MCMC', 'Snowflake', 'Databricks', 'Airflow', 'dbt', 'GCP', 'AWS', 'TypeScript'],
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
