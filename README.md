# Stockify - Modern Inventory Management System

**Stockify** adalah aplikasi manajemen stok barang yang dirancang untuk efisiensi dan kemudahan penggunaan. Sistem ini mengintegrasikan backend berbasis Express.js dengan frontend modern menggunakan Next.js, serta memanfaatkan fleksibilitas dari ekosistem Supabase untuk manajemen database dan media storage.

## 🛠️ Stack Teknologi

Proyek ini dibangun menggunakan stack teknologi modern untuk memastikan performa yang cepat dan kemudahan pemeliharaan:

### **Backend**
- **Runtime:** Node.js v24.13.0
- **Framework:** [Express.js](https://expressjs.com/)
- **Database Architecture:** PostgreSQL (Managed by Supabase)
- **Authentication:** JWT & Supabase Auth
- **File & Media Storage:** Supabase Storage
- **Automation:** Node-cron untuk penjadwalan tugas
- **Keamanan:** Express-rate-limit, bcryptjs, dan middleware otentikasi kustom.

### **Frontend**
- **Framework:** [Next.js](https://nextjs.org/) (React Framework)
- **Deployment & Rendering:** SSR (Server-Side Rendering) & SSG (Static Site Generation)
- **Client Library:** Next.js fetch & Supabase Client

### **Infrastruktur & OS**
- **Operating System:** Ubuntu 24.04 LTS (Noble Numbat)


## 📂 Struktur Proyek (Backend)

Backend diatur secara modular untuk memudahkan pengembangan dan skalabilitas:

```text
backend/
├── src/
│   ├── app.js             # Konfigurasi Express
│   ├── server.js          # Entry point aplikasi
│   ├── config/            # Konfigurasi database & environment
│   ├── controllers/       # Logika bisnis (Auth, Business, Dashboard, dll)
│   ├── middleware/        # Validasi, Error Handling, & Auth check
│   ├── routes/            # Definisi endpoint API
│   ├── services/          # Logika bisnis kompleks (Cron jobs, dll)
│   └── utils/             # Helper functions (API Response, CatchAsync, dll)
├── .env                   # Environment variables
└── package.json           # Dependensi & scripts
```


## 🚀 Memulai (Getting Started)

### **Prasyarat**
Pastikan lingkungan Anda memenuhi spesifikasi berikut:
- **Node.js:** `v24.13.0` atau yang terbaru.
- **OS:** Ubuntu 24 LTS atau distribusi Linux lainnya.
- **Package Manager:** `npm` (disertakan dengan Node.js).

### **Instalasi**

1. **Clone repositori:**
   ```bash
   git clone <repository-url>
   cd express-js-sample
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Konfigurasi Environment:**
   Salin file `.env.example` menjadi `.env` dan lengkapi kredensial Supabase Anda:
   ```bash
   cp .env.example .env
   ```

4. **Menjalankan Aplikasi (Development):**
   ```bash
   npm run dev
   ```


## ⚙️ Variabel Lingkungan (.env)

Aplikasi membutuhkan variabel-variabel berikut di sisi backend agar dapat berfungsi:

| Variable | Deskripsi |
|----------|-----------|
| `PORT` | Port server (default: 5000) |
| `supabaseUrl` | URL proyek Supabase Anda |
| `supabaseKey` | API Key (Anon / Service Role) Supabase |
| `supabaseAnonKey` | Key publik Supabase |
| `supabaseServiceKey` | Service key Supabase untuk admin tasks |
| `JWT_SECRET` | Secret key untuk enkripsi token JWT |
| `WHATSAPP_MESSAGE_URL` | URL untuk integrasi pesan WhatsApp |
| `WHATSAPP_AUTH_USER` | Username untuk otentikasi API WhatsApp |
| `WHATSAPP_AUTH_PASS` | Password untuk otentikasi API WhatsApp |


## 🛡️ Fitur Utama

- **Otentikasi Berlapis:** Mendukung sistem login aman bagi pengguna.
- **Manajemen Inventaris:** Kontrol penuh atas suku cadang (*parts*), stok, lokasi, dan supplier.
- **Media Storage Terintegrasi:** Unggah dokumen atau foto barang langsung ke Supabase Storage.
- **Dashboard Analytics:** Visualisasi data stok secara real-time.
- **WhatsApp Integration:** Notifikasi atau integrasi data stok melalui layanan WhatsApp.
- **Modular Routes:** Struktur routing yang bersih dan mudah diperluas (Suppliers, Stocks, Locations, dll).
- **Professional Error Handling:** Penanganan error yang konsisten menggunakan helper `apiResponse` dan `errorHandler`.


## 🤝 Kontribusi

Aplikasi ini dikembangkan untuk kebutuhan internal. Jika Anda menemukan bug atau ingin menambahkan fitur, silakan buat *Pull Request* atau ajukan *Issue*.


## 📄 Lisensi

© 2026 Stockify Project. All Rights Reserved. Distributed under MIT License.
