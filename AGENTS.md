# Agent Workflow & Automation Instructions

Dokumen instruksi operasional untuk AI Agent saat bekerja di repositori ini:

## 1. Arsitektur Proyek
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Swiss Brutalist aesthetic.
- **Backend API**: Rust Axum 0.7, Tokio Async runtime, SQLx pool.
- **Database**: Neon Serverless PostgreSQL.
- **Port Default**:
  - Frontend: `http://localhost:3000` (proxy `/api` ke `http://127.0.0.1:8080`)
  - Backend: `http://127.0.0.1:8080`

## 2. Aturan Wajib Selesai Tugas (Always Push)
Setiap kali AI Agent selesai mengerjakan perbaikan, fitur, refaktor, atau instruksi dari user:
1. **Verifikasi Build**:
   - Frontend: Jalankan `npm run build` untuk memastikan tidak ada error TypeScript/JSX/Vite.
   - Backend (jika disentuh): Jalankan `cargo check --bin server` untuk memastikan tidak ada error kompilasi Rust.
2. **Auto-Commit**:
   - Stage file yang relevan (`git add <files>`).
   - Jangan pernah menyertakan atau commit file kredensial rahasia seperti `.env` atau token privat.
   - Gunakan format conventional commits (contoh: `feat: ...`, `fix: ...`, `style: ...`).
3. **Auto-Push**:
   - Selalu langsung push commit ke remote GitHub (`git push origin main`).
4. **Laporan Transparan**:
   - Laporkan hasil build, ringkasan perbaikan, dan hash commit di respon akhir kepada user.
