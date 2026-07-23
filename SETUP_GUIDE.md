# 📘 Panduan Setup Lengkap - Website Reward Point

## 🎯 Overview

Panduan ini akan membantu Anda menyelesaikan setup Website Reward Point dari awal hingga siap production.

## ✅ Checklist Setup

- [ ] 1. Setup Supabase Project
- [ ] 2. Konfigurasi Database
- [ ] 3. Setup Storage Buckets
- [ ] 4. Konfigurasi Authentication
- [ ] 5. Setup Admin Account
- [ ] 6. Konfigurasi Frontend
- [ ] 7. Testing
- [ ] 8. Deploy

---

## 📝 Step 1: Setup Supabase Project

### 1.1 Buat Project Baru

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Sign in / Sign up
3. Klik "New Project"
4. Isi detail:
   - **Name**: reward-point-website
   - **Database Password**: (simpan password ini!)
   - **Region**: pilih terdekat dengan lokasi Anda
   - **Pricing Plan**: Free tier (cukup untuk development)
5. Klik "Create new project"
6. Tunggu ~2 menit hingga project siap

### 1.2 Dapatkan API Credentials

1. Buka project > Settings > API
2. Copy dan simpan:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`

---

## 📝 Step 2: Konfigurasi Database

### 2.1 Jalankan SQL Schema

1. Buka SQL Editor di Supabase Dashboard
2. Klik "New Query"
3. Copy seluruh isi file `DATABASE_SCHEMA.sql`
4. Paste ke SQL Editor
5. Klik "Run" atau tekan `Ctrl+Enter`
6. Pastikan semua query berhasil (no errors)

### 2.2 Verifikasi Tables

1. Buka "Table Editor"
2. Pastikan tables berikut ada:
   - admins
   - members
   - categories
   - rewards
   - point_history
   - redeem_history
   - banners
   - settings

---

## 📝 Step 3: Setup Storage Buckets

### 3.1 Buat Buckets

1. Buka "Storage" di sidebar
2. Klik "Create a new bucket"
3. Buat 4 buckets berikut:

**Bucket 1: members**
- Name: `members`
- Public: ✅ Yes
- Klik "Create bucket"

**Bucket 2: rewards**
- Name: `rewards`
- Public: ✅ Yes
- Klik "Create bucket"

**Bucket 3: banners**
- Name: `banners`
- Public: ✅ Yes
- Klik "Create bucket"

**Bucket 4: settings**
- Name: `settings`
- Public: ✅ Yes
- Klik "Create bucket"

### 3.2 Setup Storage Policies

Untuk setiap bucket, set policies berikut:

**Policy: Public Access**
```sql
-- Di Storage > [bucket-name] > Policies > New Policy

-- Allow public to SELECT (read)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'members'); -- ganti 'members' sesuai bucket

-- Allow authenticated to INSERT
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'members' AND auth.role() = 'authenticated');

-- Allow authenticated to DELETE
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'members' AND auth.role() = 'authenticated');
```

Ulangi untuk semua buckets (members, rewards, banners, settings).

---

## 📝 Step 4: Konfigurasi Authentication

### 4.1 Enable Email Auth

1. Buka "Authentication" > "Providers"
2. Pastikan "Email" sudah enabled
3. Scroll ke bawah ke "Email Auth Settings"
4. **Untuk Development**: Nonaktifkan "Enable email confirmations"
5. **Untuk Production**: Aktifkan dan setup email template
6. Klik "Save"

### 4.2 Disable Sign-ups (Optional)

Karena hanya admin yang bisa login:

1. Buka "Authentication" > "Policies"
2. Atau atur di Settings > Auth > "Enable signup": OFF

---

## 📝 Step 5: Setup Admin Account

### 5.1 Buat User di Supabase Auth

1. Buka "Authentication" > "Users"
2. Klik "Add user" > "Create new user"
3. Isi form:
   - **Email**: admin@rewardpoint.com (atau email Anda)
   - **Password**: (buat password yang kuat)
   - **Auto Confirm User**: ✅ Yes
4. Klik "Create user"
5. **PENTING**: Copy **User ID** (format: uuid)

### 5.2 Insert Admin ke Database

1. Buka "SQL Editor"
2. Jalankan query berikut (ganti `USER_ID` dengan ID dari step 5.1):

```sql
INSERT INTO admins (id, fullname, email, password)
VALUES (
    'USER_ID_DARI_STEP_5.1',  -- Ganti dengan User ID
    'Administrator',           -- Nama admin
    'admin@rewardpoint.com',   -- Email admin
    ''                         -- Password di-handle oleh Supabase Auth
);
```

3. Klik "Run"

### 5.3 Verifikasi Admin

```sql
SELECT * FROM admins;
```

Pastikan data admin muncul.

---

## 📝 Step 6: Konfigurasi Frontend

### 6.1 Update Supabase Config

Edit file `js/config/supabase.js`:

```javascript
const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co'; // Ganti dengan URL Anda
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // Ganti dengan anon key Anda
```

### 6.2 Struktur Folder Assets

Pastikan folder berikut ada:

```
assets/
├── css/
│   ├── main.css
│   ├── components.css
│   └── responsive.css
├── js/
└── images/
    ├── logo.png
    ├── favicon.png
    ├── default-avatar.png
    └── default-reward.png
```

### 6.3 Upload Default Images

Upload gambar default ke `assets/images/`:
- `logo.png` - Logo website (recommended: 200x50px)
- `favicon.png` - Favicon (recommended: 32x32px)
- `default-avatar.png` - Avatar default untuk member (recommended: 300x300px)
- `default-reward.png` - Gambar default untuk reward (recommended: 400x300px)

---

## 📝 Step 7: Testing

### 7.1 Jalankan Development Server

**Menggunakan VS Code Live Server:**
```bash
1. Install extension "Live Server"
2. Right-click index.html
3. "Open with Live Server"
```

**Menggunakan Python:**
```bash
python -m http.server 8000
# Buka http://localhost:8000
```

**Menggunakan Node.js:**
```bash
npx http-server -p 8000
# Buka http://localhost:8000
```

### 7.2 Test Halaman Publik

- [ ] Buka `http://localhost:8000`
- [ ] Check navbar dan navigation
- [ ] Check dark mode toggle
- [ ] Check responsive (mobile, tablet, desktop)
- [ ] Check stats section (harus tampil 0 jika belum ada data)
- [ ] Check leaderboard section
- [ ] Check rewards section

### 7.3 Test Admin Login

1. Buka `http://localhost:8000/pages/admin/login.html`
2. Login dengan:
   - Email: `admin@rewardpoint.com`
   - Password: (password yang dibuat di Step 5.1)
3. Harus redirect ke dashboard

### 7.4 Test CRUD Member

1. Login sebagai admin
2. Buka "Kelola Anggota"
3. Test:
   - [ ] Create member baru
   - [ ] Upload foto member
   - [ ] Edit member
   - [ ] Tambah/kurangi points
   - [ ] Delete member

### 7.5 Test CRUD Reward

1. Buka "Kelola Hadiah"
2. Test:
   - [ ] Create reward baru
   - [ ] Upload foto reward
   - [ ] Edit reward
   - [ ] Update stock
   - [ ] Delete reward

### 7.6 Test Redeem Process

1. Pastikan ada member dengan points > 0
2. Pastikan ada reward dengan stock > 0
3. Buka "Proses Redeem"
4. Test:
   - [ ] Pilih member
   - [ ] Pilih reward
   - [ ] Check validasi points
   - [ ] Process redeem
   - [ ] Verify points berkurang
   - [ ] Verify stock berkurang
   - [ ] Check redeem history

---

## 📝 Step 8: Deploy ke Production

### Option 1: Deploy ke Netlify

1. Push code ke GitHub
2. Connect repository ke Netlify
3. Build settings:
   - Build command: (kosongkan)
   - Publish directory: `/`
4. Deploy!

### Option 2: Deploy ke Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Deploy!

### Option 3: Deploy ke GitHub Pages

1. Push code ke GitHub repository
2. Settings > Pages
3. Source: Deploy from branch `main`
4. Folder: `/ (root)`
5. Save

---

## 🎨 Customization

### Mengubah Warna Theme

Edit `assets/css/main.css`:

```css
:root {
    --color-primary: #2563EB;     /* Biru */
    --color-secondary: #F59E0B;   /* Orange */
    --color-success: #10B981;     /* Hijau */
    --color-danger: #EF4444;      /* Merah */
}
```

### Mengubah Logo

1. Upload logo baru ke `assets/images/logo.png`
2. Atau update melalui Admin Panel > Pengaturan

### Mengubah Konten Footer

1. Login admin
2. Pengaturan > Website Settings
3. Edit "Footer Text", "Contact", dll.

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Penyebab**: Supabase config salah atau network issue

**Solusi**:
1. Check `js/config/supabase.js`
2. Pastikan URL dan anon key benar
3. Check koneksi internet

### Error: "Row Level Security policy violation"

**Penyebab**: RLS policies belum di-setup

**Solusi**:
1. Buka SQL Editor
2. Check apakah policies sudah dibuat
3. Re-run `DATABASE_SCHEMA.sql`

### Error: "Invalid login credentials"

**Penyebab**: Email/password salah atau user belum di-insert ke table `admins`

**Solusi**:
1. Verify user di Authentication > Users
2. Check data di table `admins`
3. Pastikan User ID di auth matches dengan ID di table admins

### Dark Mode tidak berfungsi

**Penyebab**: JavaScript belum load atau error

**Solusi**:
1. Open DevTools (F12)
2. Check Console untuk errors
3. Pastikan semua JS files ter-load

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)

---

## ✅ Checklist Sebelum Production

- [ ] All pages load without errors
- [ ] All CRUD operations working
- [ ] Authentication working
- [ ] File uploads working
- [ ] Responsive on all devices
- [ ] Dark mode working
- [ ] No console errors
- [ ] Images optimized
- [ ] SEO meta tags added
- [ ] Favicon added
- [ ] Performance tested
- [ ] Security reviewed

---

## 🎉 Selesai!

Website Reward Point Anda sudah siap digunakan!

**Next Steps**:
1. Populate data sample (members, rewards, categories)
2. Upload banner images
3. Customize branding
4. Share dengan users!

---

**Happy Coding! 🚀**
