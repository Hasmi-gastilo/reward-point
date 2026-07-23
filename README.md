# 🌟 Website Reward Point

Website Reward Point modern dan profesional menggunakan **HTML5, CSS3, Vanilla JavaScript**, dan **Supabase** sebagai backend.

## 📋 Deskripsi

Website ini adalah platform reward point yang memungkinkan anggota untuk menukarkan bintang mereka dengan berbagai hadiah menarik. Admin dapat mengelola anggota, hadiah, kategori, dan melakukan proses penukaran.

## ✨ Fitur Utama

### 🌐 Halaman Publik (Tanpa Login)
- ✅ Landing page dengan banner slider
- ✅ Statistik real-time (Total Anggota, Hadiah, Penukaran)
- ✅ Leaderboard bintang dengan ranking
- ✅ Daftar hadiah dengan filter kategori
- ✅ Detail hadiah
- ✅ Pencarian anggota dan hadiah
- ✅ Dark mode & Light mode
- ✅ Fully responsive (Mobile, Tablet, Desktop)

### 👨‍💼 Halaman Admin (Login Required)
- ✅ Dashboard dengan statistik dan grafik
- ✅ CRUD Anggota (Create, Read, Update, Delete)
- ✅ CRUD Hadiah
- ✅ CRUD Kategori
- ✅ CRUD Banner
- ✅ Manajemen bintang (Tambah/Kurangi)
- ✅ Proses redeem hadiah
- ✅ Riwayat penukaran
- ✅ Riwayat perubahan bintang
- ✅ Upload foto (Profil, Hadiah, Banner)
- ✅ Pengaturan website

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Backend**: Supabase
  - Authentication
  - PostgreSQL Database
  - Storage
  - Real-time subscriptions
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Inter)

## 📁 Struktur Project

```
reward-point-website/
├── index.html                 # Landing page
├── DATABASE_SCHEMA.sql        # SQL schema untuk Supabase
├── README.md                  # Dokumentasi
├── assets/
│   ├── css/
│   │   ├── main.css          # Styles utama
│   │   ├── components.css    # Component styles
│   │   └── responsive.css    # Responsive styles
│   ├── js/
│   │   └── (akan dibuat)
│   └── images/
│       └── (upload gambar Anda)
├── js/
│   ├── config/
│   │   └── supabase.js       # Konfigurasi Supabase
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── member.service.js
│   │   ├── reward.service.js
│   │   └── ...
│   ├── components/
│   │   └── (reusable components)
│   └── main.js               # Entry point
└── pages/
    ├── rewards.html          # Halaman daftar hadiah
    ├── leaderboard.html      # Halaman leaderboard
    ├── about.html            # Halaman tentang
    ├── contact.html          # Halaman kontak
    └── admin/
        ├── login.html        # Login admin
        ├── dashboard.html    # Dashboard admin
        ├── members.html      # Kelola anggota
        ├── rewards.html      # Kelola hadiah
        ├── categories.html   # Kelola kategori
        ├── redeem.html       # Proses redeem
        └── settings.html     # Pengaturan
```

## 🚀 Cara Setup

### 1. Setup Supabase

1. **Buat project baru** di [https://supabase.com](https://supabase.com)
2. **Jalankan SQL Schema**:
   - Buka SQL Editor di Supabase Dashboard
   - Copy semua isi file `DATABASE_SCHEMA.sql`
   - Paste dan jalankan di SQL Editor
3. **Setup Storage Buckets**:
   ```
   - Buat bucket: members (public)
   - Buat bucket: rewards (public)
   - Buat bucket: banners (public)
   - Buat bucket: settings (public)
   ```
4. **Setup Authentication**:
   - Enable Email authentication
   - Nonaktifkan "Enable email confirmations" untuk testing
5. **Buat Admin Account**:
   - Buka Authentication > Users
   - Klik "Add User"
   - Masukkan email & password admin
   - Simpan User ID untuk insert ke table admins

6. **Insert Admin ke Database**:
   ```sql
   INSERT INTO admins (id, fullname, email, password)
   VALUES (
       'USER_ID_DARI_SUPABASE_AUTH',
       'Admin Name',
       'admin@rewardpoint.com',
       'hashed_password_from_supabase'
   );
   ```

### 2. Konfigurasi Project

1. **Clone/Download project ini**
2. **Edit `js/config/supabase.js`**:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```
3. **Dapatkan credentials dari**:
   - Supabase Dashboard > Settings > API
   - Copy Project URL dan anon/public key

### 3. Jalankan Project

**Opsi 1: Live Server (Recommended)**
```bash
# Install Live Server extension di VS Code
# Klik kanan index.html > Open with Live Server
```

**Opsi 2: Python HTTP Server**
```bash
python -m http.server 8000
# Buka http://localhost:8000
```

**Opsi 3: Node.js HTTP Server**
```bash
npx http-server -p 8000
# Buka http://localhost:8000
```

## 👤 Login Admin

**Default Admin** (setelah setup):
- Email: `admin@rewardpoint.com`
- Password: (yang Anda buat di Supabase Auth)

## 🎨 Customization

### Mengubah Warna
Edit `assets/css/main.css`:
```css
:root {
    --color-primary: #2563EB;    /* Warna utama */
    --color-secondary: #F59E0B;  /* Warna sekunder */
    --color-success: #10B981;    /* Warna sukses */
    --color-danger: #EF4444;     /* Warna danger */
}
```

### Mengubah Logo & Branding
1. Upload logo ke `assets/images/logo.png`
2. Update di navbar `index.html`
3. Update settings melalui Admin Panel

## 📊 Database Schema

### Tables
- `admins` - Data administrator
- `members` - Data anggota
- `categories` - Kategori hadiah
- `rewards` - Data hadiah
- `point_history` - Riwayat perubahan bintang
- `redeem_history` - Riwayat penukaran
- `banners` - Banner slider
- `settings` - Pengaturan website

### Storage Buckets
- `members` - Foto profil anggota
- `rewards` - Foto hadiah
- `banners` - Gambar banner slider
- `settings` - Logo website

## 🔒 Security

- ✅ Row Level Security (RLS) enabled
- ✅ Public dapat read-only data publik
- ✅ Admin authenticated untuk modify data
- ✅ Password hashing melalui Supabase Auth
- ✅ SQL Injection prevention
- ✅ XSS protection

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Roadmap

- [ ] Export data ke Excel/PDF
- [ ] Email notification untuk redeem
- [ ] Multiple admin roles
- [ ] Gamification features
- [ ] PWA support
- [ ] Multi-language support

## 📝 License

© 2026 Reward Point. All rights reserved.

## 👨‍💻 Developer

Dibuat dengan ❤️ menggunakan Vanilla JavaScript dan Supabase

## 📞 Support

Untuk pertanyaan atau bantuan:
- Email: info@rewardpoint.com
- Phone: +62 812-3456-7890

---

**Happy Coding! 🚀**
