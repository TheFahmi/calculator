# Calculator Next

Aplikasi kalkulator modern yang dibangun dengan Next.js 14 dan teknologi web terkini.

[![Deployed on Netlify](https://img.shields.io/badge/Netlify-Deployed-success)](https://calculator-fahmi.windsurf.build)
[![GitHub](https://img.shields.io/github/license/TheFahmi/calculator)](https://github.com/TheFahmi/calculator)

![Calculator Preview](public/calculator-preview.png)

## Fitur

- 🧮 Mode kalkulator standar
- 📊 Mode kalkulator ilmiah dengan fungsi trigonometri dan logaritma
- 🔄 Konverter unit untuk panjang, berat, suhu, dan lainnya
- 🌙 Mode gelap/terang dengan next-themes
- ✨ Animasi halus dengan Framer Motion
- 📱 Responsif untuk semua ukuran layar
- 🔊 Dukungan input suara (coming soon)

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) dengan App Router
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)
- **Tema**: [Next-themes](https://github.com/pacocoursey/next-themes)
- **Matematika**: [Math.js](https://mathjs.org/)

## Getting Started

### Prasyarat

- Node.js 18.0.0 atau yang lebih baru
- npm, yarn, atau pnpm

### Instalasi

```bash
# Clone repository
git clone https://github.com/TheFahmi/calculator.git
cd calculator

# Install dependencies
npm install
# atau
yarn install
# atau
pnpm install
```

### Menjalankan Aplikasi

```bash
# Development server
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi.

## Deployment

Aplikasi ini telah di-deploy menggunakan Netlify dan dapat diakses di:

[https://calculator-fahmi.windsurf.build](https://calculator-fahmi.windsurf.build)

### Deploy Sendiri

Untuk men-deploy aplikasi ini ke Netlify:

1. Fork repository ini
2. Buat akun Netlify jika belum memilikinya
3. Hubungkan repository GitHub Anda dengan Netlify
4. Atur konfigurasi build:
   - Build command: `npm run build`
   - Publish directory: `.next`

## Kontribusi

Kontribusi selalu diterima! Silakan buat issue atau pull request jika Anda ingin berkontribusi.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontak

Muhammad Fahmi Hassan - [GitHub](https://github.com/TheFahmi)

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
