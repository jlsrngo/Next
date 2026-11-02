export type Locale = 'en' | 'id';

// Base generic localizer for fields with ...En or ...Id
export function localize(obj: Record<string, any>, locale: string, fields: string[]): Record<string, any> {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  if (locale === 'en') {
    for (const field of fields) {
      const enField = `${field}En`;
      if (enField in obj && obj[enField]) {
        result[field] = obj[enField];
      }
    }
  } else if (locale === 'id') {
    for (const field of fields) {
      const idField = `${field}Id`;
      if (idField in obj && obj[idField]) {
        result[field] = obj[idField];
      }
    }
  }
  return result;
}

// Indonesian translations dictionary for text content
const CONTENT_DICTIONARY: Record<string, string> = {
  // Profiles
  'Junior Full-Stack Web Developer': 'Pengembang Web Full-Stack Junior',
  'Lead Full-Stack Web Developer': 'Pengembang Web Full-Stack Utama',
  'Full Stack Developer': 'Pengembang Web Full-Stack',
  'Full-Stack & Systems': 'Full-Stack & Arsitektur Sistem',
  'FULL-STACK & SYSTEMS': 'FULL-STACK & ARSITEKTUR SISTEM',
  'FULLSTACK & SYSTEMS ARCHITECTURE': 'ARSITEKTUR FULLSTACK & SISTEM',
  'Open to Opportunities': 'Terbuka untuk Peluang Kerja',
  'OPEN TO OPPORTUNITIES': 'TERBUKA UNTUK PELUANG KERJA',
  'Remote / Indonesia': 'Jarak Jauh / Indonesia',
  'Indonesia': 'Indonesia',
  'Jakarta, Indonesia': 'Jakarta, Indonesia',
  'I am a web developer with expertise in building fast, scalable applications using modern technologies.':
    'Saya adalah seorang pengembang web dengan keahlian dalam membangun aplikasi cepat, terukur, dan berkinerja tinggi menggunakan teknologi modern.',
  'Passionate developer focused on high-performance web systems, Swiss brutalist aesthetics, and robust software architecture.':
    'Pengembang yang berfokus pada sistem web berkinerja tinggi, estetika Swiss Brutalist, dan arsitektur perangkat lunak yang tangguh. Menggabungkan ketelitian rekayasa dengan desain fungsional.',
  'Passionate developer focused on high-performance web systems, Swiss brutalist aesthetics, and robust software architecture. Dedicated to building reliable, accessible, and elegant software solutions.':
    'Pengembang yang berfokus pada sistem web berkinerja tinggi, estetika Swiss Brutalist, dan arsitektur perangkat lunak yang tangguh. Berdedikasi untuk menciptakan solusi perangkat lunak yang andal, aksesibel, dan elegan.',

  // Types
  'Full-time': 'Purnawaktu',
  'Part-time': 'Paruh Waktu',
  'Contract': 'Kontrak',
  'Freelance': 'Lepas',
  'Internship': 'Magang',
  'Remote': 'Jarak Jauh',
  'Hybrid': 'Hibrida',
  'On-site': 'Di Tempat',

  // Experiences
  'Independent Engineering & Systems': 'Teknik & Sistem Independen',
  'Digital Systems Lab': 'Laboratorium Sistem Digital',
  'Creative Web Studio': 'Studio Web Kreatif',
  'Frontend & Systems Engineer': 'Insinyur Frontend & Sistem',
  'Junior Web Developer': 'Pengembang Web Junior',
  'Senior Full Stack Developer': 'Pengembang Full Stack Senior',

  // Responsibilities
  'Architecting ultra-high-performance web systems using Vite, React 18, and Rust Axum microservices':
    'Merancang arsitektur sistem web berkinerja tinggi menggunakan Vite, React 18, dan layanan mikro Rust Axum',
  'Migrating legacy Next.js runtimes to sub-millisecond asynchronous Rust Tokio web services':
    'Memigrasikan sistem Next.js lawas ke layanan web asinkron Rust Tokio berlatensi sub-milidetik',
  'Designing Swiss Technical Brutalism UI design systems with precision hairline grids and HUD telemetry':
    'Mendesain sistem desain UI Swiss Technical Brutalism dengan grid hairline presisi dan telemetri HUD',
  'Built reactive dashboard systems and data visualizers with TypeScript, React, and Tailwind CSS':
    'Membangun sistem dasbor reaktif dan visualisasi data dengan TypeScript, React, dan Tailwind CSS',
  'Constructed resilient RESTful API endpoints and integrated real-time WebSocket event feeds':
    'Membangun endpoint RESTful API yang tangguh dan mengintegrasikan umpan data WebSocket waktu-nyata',
  'Optimized web vital scores to maintain consistent 100/100 Lighthouse performance metrics':
    'Mengoptimalkan skor web vitals untuk mempertahankan metrik performa Lighthouse 100/100 yang konsisten',
  'Developed client-facing web applications using modern JavaScript and accessible semantic HTML5/CSS3':
    'Mengembangkan aplikasi web sisi klien menggunakan JavaScript modern dan HTML5/CSS3 semantik yang aksesibel',
  'Collaborated closely with UX/UI designers to transform Figma wireframes into responsive code':
    'Berkolaborasi erat dengan desainer UX/UI untuk mengubah desain Figma menjadi kode yang responsif',
  'Lead development of microservices architecture':
    'Memimpin pengembangan arsitektur layanan mikro',
  'Mentor junior developers':
    'Membimbing pengembang junior',
  'Architect scalable systems':
    'Merancang arsitektur sistem yang terukur',
  'Lead developer building scalable web applications and microservices.':
    'Pengembang utama yang membangun aplikasi web terukur dan layanan mikro.',
  'Built responsive web applications and optimized frontend performance.':
    'Membangun aplikasi web responsif dan mengoptimalkan performa frontend.',

  // What I learned
  'Asynchronous concurrency patterns with Tokio, Serde zero-copy deserialization, and Axum routing':
    'Pola konkurensi asinkron dengan Tokio, deserialisasi zero-copy Serde, dan routing Axum',
  'Zero-runtime CSS architecture and technical typography systems':
    'Arsitektur CSS zero-runtime dan sistem tipografi teknis presisi',
  'Design token modularity, state machines, and micro-frontend bundling optimizations':
    'Modularitas token desain, mesin status (state machines), dan optimasi bundling mikro-frontend',
  'Cross-browser compatibility testing, git workflow standards, and responsive layout foundations':
    'Pengujian kompatibilitas lintas peramban, standar alur kerja Git, dan fondasi tata letak responsif',
  'System design patterns':
    'Pola desain sistem',
  'Team leadership':
    'Kepemimpinan tim',
  'Cloud infrastructure':
    'Infrastruktur cloud',

  // Impacts
  'Reduced API response time by 40%': 'Mengurangi waktu respons API hingga 40%',
  'Led migration to Next.js': 'Memimpin migrasi ke Next.js',
  'Onboarded 5 new engineers': 'Membimbing 5 insinyur baru',

  // Education
  'University / Institute of Technology': 'Universitas / Institut Teknologi',
  'Vocational Technical Academy': 'Akademi Kejuruan Teknik Komputer',
  'Bachelor of Computer Science': 'Sarjana Ilmu Komputer (S.Kom)',
  'Vocational Diploma': 'Diploma Kejuruan Teknik',
  'Informatics & Software Engineering': 'Informatika & Rekayasa Perangkat Lunak',
  'Computer Network Engineering & Systems': 'Teknik Komputer Jaringan & Sistem',
  'Rank 1 Honors': 'Lulusan Terbaik Peringkat 1',
  'Software Engineering Club Lead, Open-Source Contributor, Algorithms Study Group':
    'Ketua Klub Rekayasa Perangkat Lunak, Kontributor Sumber Terbuka, Kelompok Studi Algoritma',
  'Network Infrastructure Lab Lead, Cisco Packet Tracer Competition':
    'Koordinator Lab Infrastruktur Jaringan, Peserta Kompetisi Cisco Packet Tracer',
  'Graduated with honors focusing on distributed systems architecture, compiler theory, and modern web application development.':
    'Lulus dengan predikat sangat memuaskan berfokus pada arsitektur sistem terdistribusi, teori kompilator, dan pengembangan aplikasi web modern.',
  'Foundational training in networking protocols (TCP/IP, UDP, DNS), Linux systems administration, and server maintenance.':
    'Pelatihan dasar protokol jaringan (TCP/IP, UDP, DNS), administrasi sistem operasi Linux, dan pemeliharaan server.',

  // Projects
  'Portfolio ArtCraft System': 'Sistem Portofolio ArtCraft',
  'High-performance portfolio built with Swiss wireframe editorial brutalism, accelerated with Rust and Axum.':
    'Portofolio berkinerja tinggi yang dibangun dengan wireframe editorial Swiss Brutalist, dioptimasi dengan Rust dan Axum.',
  'Arunaki Editorial Platform': 'Platform Editorial Arunaki',
  'Monochrome architectural editorial platform inspired by Swiss typographic posters and modernist brutalism.':
    'Platform editorial arsitektur monokrom yang terinspirasi oleh poster tipografi Swiss dan modernisme brutalism.',
  'Portfolio Website': 'Website Portofolio',
  'Personal portfolio built with Next.js': 'Portofolio pribadi yang dibangun dengan Next.js',
  'E-commerce API': 'API E-Commerce',
  'REST API for e-commerce platform': 'REST API untuk platform e-commerce',

  // Categories
  'Languages': 'Bahasa Pemrograman',
  'Database': 'Basis Data',
  'Tools & DevOps': 'Alat & DevOps',
  'Other': 'Lainnya',
  'Certificate': 'Sertifikat',
  'Award': 'Penghargaan',
  'Recognition': 'Pengakuan',
  'Competition': 'Kompetisi',
};

// Translate an arbitrary text string to Indonesian if locale is 'id'
export function translateText(text: string | null | undefined, locale: Locale): string {
  if (!text) return '';
  if (locale !== 'id') return text;
  return CONTENT_DICTIONARY[text.trim()] || text;
}

// Localize an array of strings
export function translateList(items: string[] | null | undefined, locale: Locale): string[] {
  if (!Array.isArray(items)) return [];
  if (locale !== 'id') return items;
  return items.map((item) => CONTENT_DICTIONARY[item.trim()] || item);
}

// Localize Profile
export function localizeProfile(profile: any, locale: Locale): any {
  if (!profile) return profile;
  const p = { ...profile };

  if (locale === 'en') {
    if (p.fullNameEn) p.name = p.fullNameEn;
    if (p.headlineEn) p.headline = p.headlineEn;
    if (p.headlineEn) p.focus = p.headlineEn;
    if (p.bioHomeEn) p.bio_home = p.bioHomeEn;
    if (p.bioAboutEn) p.bio_about = p.bioAboutEn;
    if (p.locationEn) p.location = p.locationEn;
  } else {
    // Indonesian
    p.headline = translateText(p.headline, 'id');
    p.focus = translateText(p.focus || p.headline, 'id');
    p.bio_home = translateText(p.bio_home || p.bioHome, 'id');
    p.bio_about = translateText(p.bio_about || p.bioAbout, 'id');
    p.work_status = translateText(p.work_status || 'Open to Opportunities', 'id');
    p.location = translateText(p.location, 'id');
  }

  return p;
}

// Localize Experience
export function localizeExperience(exp: any, locale: Locale): any {
  if (!exp) return exp;
  const e = { ...exp };

  if (locale === 'en') {
    if (e.companyEn) e.company_name = e.companyEn;
    if (e.positionEn) e.position = e.positionEn;
    if (e.descriptionEn) e.description = e.descriptionEn;
    if (e.responsibilitiesEn) e.responsibilities = e.responsibilitiesEn;
    if (e.whatILearnedEn) e.what_i_learned = e.whatILearnedEn;
    if (e.impactEn) e.impact = e.impactEn;
  } else {
    // Indonesian
    e.company_name = translateText(e.company_name || e.company, 'id');
    e.position = translateText(e.position, 'id');
    e.employment_type = translateText(e.employment_type || e.employmentType, 'id');
    e.work_type = translateText(e.work_type || e.workType, 'id');
    e.location = translateText(e.location, 'id');
    e.description = translateText(e.description, 'id');
    e.responsibilities = translateList(e.responsibilities, 'id');
    e.what_i_learned = translateList(e.what_i_learned || e.whatILearned, 'id');
    e.impact = translateList(e.impact, 'id');
  }

  return e;
}

// Localize Education
export function localizeEducation(edu: any, locale: Locale): any {
  if (!edu) return edu;
  const ed = { ...edu };

  if (locale === 'en') {
    if (ed.institutionEn) ed.institution_name = ed.institutionEn;
    if (ed.degreeEn) ed.degree = ed.degreeEn;
    if (ed.fieldOfStudyEn) ed.field_of_study = ed.fieldOfStudyEn;
    if (ed.descriptionEn) ed.description = ed.descriptionEn;
  } else {
    // Indonesian
    ed.institution_name = translateText(ed.institution_name || ed.institution, 'id');
    ed.degree = translateText(ed.degree, 'id');
    ed.field_of_study = translateText(ed.field_of_study || ed.fieldOfStudy, 'id');
    ed.grade = translateText(ed.grade || ed.gpa, 'id');
    ed.activities = translateText(ed.activities, 'id');
    ed.description = translateText(ed.description, 'id');
  }

  return ed;
}

// Localize Project
export function localizeProject(project: any, locale: Locale): any {
  if (!project) return project;
  const p = { ...project };

  if (locale === 'en') {
    if (p.titleEn) p.title = p.titleEn;
    if (p.descriptionEn) p.description = p.descriptionEn;
  } else {
    p.title = translateText(p.title, 'id');
    p.description = translateText(p.description, 'id');
  }

  return p;
}

// Localize Achievement
export function localizeAchievement(item: any, locale: Locale): any {
  if (!item) return item;
  const a = { ...item };

  if (locale === 'id') {
    a.title = translateText(a.title, 'id');
    a.issuer = translateText(a.issuer, 'id');
    a.category = translateText(a.category, 'id');
    a.description = translateText(a.description, 'id');
  }

  return a;
}

// Format duration string (e.g. "1 yr 2 mos" vs "1 thn 2 bln")
export function formatDuration(
  start: string | null | undefined,
  end: string | null | undefined,
  isCurrent: boolean,
  locale: Locale
): string {
  if (!start) return locale === 'id' ? '1 thn' : '1 yr';
  const startDate = new Date(start);
  if (isNaN(startDate.getTime())) return locale === 'id' ? '1 thn' : '1 yr';
  const now = new Date();
  const endDate = isCurrent ? now : (end ? new Date(end) : now);
  const validEndDate = isNaN(endDate.getTime()) ? now : endDate;
  const diffYears = validEndDate.getFullYear() - startDate.getFullYear();
  const diffMonths = validEndDate.getMonth() - startDate.getMonth();
  const totalMonths = Math.max(diffYears * 12 + diffMonths, 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const yrLabel = locale === 'id' ? 'thn' : 'yr';
  const moLabel = locale === 'id' ? 'bln' : (months === 1 ? 'mo' : 'mos');

  let duration = '';
  if (years > 0) duration += `${years} ${yrLabel} `;
  if (months > 0) duration += `${months} ${moLabel}`;
  return duration.trim() || (locale === 'id' ? '1 bln' : '1 mo');
}

// Format date with appropriate locale string
export function formatDate(dateStr: string | null | undefined, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const loc = locale === 'id' ? 'id-ID' : 'en-US';
  return d.toLocaleDateString(loc, options || { year: 'numeric', month: 'short' });
}
