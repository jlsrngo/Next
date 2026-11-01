# Julio Siringoringo — Systems Engineering & Portfolio Workstation

Sebuah personal portfolio dan technical workstation yang dirancang dengan estetika **Swiss Brutalist** dan arsitektur hybrid modern berkinerja tinggi, menggabungkan antarmuka React 18 SPA yang cepat dan responsif dengan backend Rust Axum 0.7 native daemon serta database Neon Serverless PostgreSQL.

---

## 🏛️ Arsitektur Sistem

Arsitektur aplikasi ini dibangun di atas pemisahan peran yang tegas antara presentation layer dan data runtime engine:

- **Frontend Client**: Single Page Application (SPA) berbasis React 18, TypeScript, dan Vite dengan bundling super cepat, desain tipografi brutalist, dan transisi fluid tanpa reload penuh.
- **Backend API Daemon**: Layanan backend native ditulis dalam bahasa Rust menggunakan framework Axum 0.7 dan Tokio asynchronous runtime engine, menyediakan REST API berlatensi ultra-rendah (sub-millisecond) untuk seluruh data aplikasi.
- **Database Layer**: Neon Serverless PostgreSQL yang terhubung langsung ke connection pool backend untuk persistensi data profil, keahlian teknis, pengalaman, proyek, dan kontak.
- **Background Telemetry Worker**: Daemon asynchronous Tokio yang berjalan periodik untuk sinkronisasi kontribusi GitHub dan crawler berita/repo teknologi viral dari internet.

---

## 📑 Struktur Halaman & Modul

Aplikasi terbagi menjadi enam modul halaman utama yang masing-masing dilengkapi strip telemetri kontekstual unik:

### 1. `[ 01 // CORE ARCHITECTURE ]` — Home & Arsenal
- Kartu ringkasan bio dan spesifikasi teknis dari database profil.
- Matrix keahlian teknis (Tech Arsenal) terstruktur berdasarkan kategori (Languages, Frontend, Backend, Database, Cloud & Tools).
- Strip telemetri dilengkapi jam digital real-time berdetik dan koordinat geografis.

### 2. `[ 02 // DOSSIER & BACKGROUND ]` — About
- Quick Specs HUD (Focus, Runtime, Location, dan Work Status dinamis dari database).
- Riwayat karier dan pengalaman kerja terverifikasi.
- Riwayat pendidikan dan latar belakang akademik.
- Live Tech Wire baris atas yang merayapi headline berita teknologi terkini dari internet.

### 3. `[ 03 // CREDENTIALS & AWARDS ]` — Achievements
- Katalog sertifikasi, lisensi, dan penghargaan profesional yang terindeks dinamis dari PostgreSQL.
- Modal pratinjau detail akreditasi dengan verifikasi credential ID dan tautan sertifikat eksternal.
- Strip telemetri menampilkan live auto-rotating trending/viral repositories di GitHub.

### 4. `[ 04 // PORTFOLIO WORKS ]` — Projects
- Showcase proyek deployment produksi, aplikasi enterprise, dan pustaka open-source.
- Tag stack teknologi, statistik bintang GitHub, live demo link, dan repository code link.
- Penghitung indeks repositori dinamis dan sinkronisasi komit GitHub live.

### 5. `[ 05 // SYSTEM & GITHUB TELEMETRY ]` — Dashboard
- Kartu metrik kuantitatif proyek, portofolio unggulan, dan penghargaan.
- GitHub Contribution Heatmap interaktif dan visualisasi top language breakdown.
- Metrik status native Tokio daemon, memory footprint, dan health check server Rust.

### 6. `[ 06 // TRANSMISSION & NETWORK ]` — Contact
- Saluran transmisi komunikasi langsung (Email, GitHub, LinkedIn, dsb.) dari tabel database `social_links`.
- Status routing jaringan terenkripsi dan verifikasi identitas pengembang.

---

## ⚡ Fitur & Kapabilitas Utama

- **100% Dynamic Database-Driven**: Seluruh konten esensial (spesifikasi profil, portfolio, skills, pengalaman, riwayat penghargaan, dan kontak) bersumber langsung dari database Neon PostgreSQL tanpa data mock atau teks statis tersembunyi.
- **Live Internet Tech & Repo Crawler**: Background worker otomatis yang secara berkala menelusuri repositori viral terkini di GitHub API beserta jumlah bintangnya, serta berita teknologi terhangat via HackerNews API.
- **Swiss Brutalist Typography & Flat Geometry**: Desain bersih terinspirasi gaya Swiss International Style dengan grid monospaced, crosshair corner accent, border bergaris presisi, dan nihil efek gradien berlebihan.
- **Adaptive Theme System**: Dukungan mode gelap (*Dark Mode*), mode terang (*Light Mode*), dan gaya estetika monokrom murni (*Monochrome Black & White*).
- **Bilingual Internationalization (i18n)**: Dukungan multi-bahasa instan antara Bahasa Inggris (EN) dan Bahasa Indonesia (ID) dengan locale switching yang mulus.
- **Responsive Mobile Layout**: Desain adaptif penuh untuk berbagai ukuran viewport (smartphone, tablet, desktop) dengan safe-area clearance di bawah mobile navigation bar.
- **Technical Coordinate Ruler**: Skala pengukur koordinat gulir interaktif di sisi kanan layar desktop yang melacak persentase posisi scroll pengguna secara presisi.

---

## 🛠️ Ringkasan Teknologi yang Digunakan

| Kategori | Teknologi |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design System**| Tailwind CSS, Lucide Icons, Custom Swiss Brutalist Grid |
| **Backend Framework** | Rust, Axum 0.7, Tokio Async Engine, Tower HTTP, Serde |
| **Database** | PostgreSQL (Neon Serverless), SQLx Connection Pool |
| **Internationalization** | next-intl, React Router DOM |
| **External Live Feeds** | GitHub REST API, HackerNews API, Real-time Clock Engine |
