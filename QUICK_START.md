# ⚡ Quick Start Guide - Reward Point Website

Panduan cepat untuk menjalankan project ini dalam 10 menit!

## 🎯 Langkah Cepat

### 1. Setup Supabase (5 menit)

```bash
1. Buka https://supabase.com dan login
2. Klik "New Project"
3. Isi nama: "reward-point"
4. Tunggu project selesai dibuat
```

### 2. Jalankan SQL (2 menit)

```sql
1. Buka SQL Editor di Supabase
2. Copy semua isi file DATABASE_SCHEMA.sql
3. Paste dan Run
4. ✅ Database siap!
```

### 3. Buat Storage Buckets (2 menit)

```bash
Buka Storage > Create bucket:
✅ members (public)
✅ rewards (public)
✅ banners (public)
✅ settings (public)
```

### 4. Buat Admin User (1 menit)

```bash
1. Buka Authentication > Users
2. Add User:
   - Email: admin@rewardpoint.com
   - Password: (pilih password Anda)
   - Auto Confirm: YES
3. Copy User ID
4. Run SQL:
```

```sql
INSERT INTO admins (id, fullname, email, password)
VALUES (
    'USER_ID_YANG_DICOPY',
    'Administrator',
    'admin@rewardpoint.com',
    ''
);
```

### 5. Update Config (30 detik)

Edit file `js/config/supabase.js`:

```javascript
const SUPABASE_URL = 'PASTE_URL_ANDA_DISINI';
const SUPABASE_ANON_KEY = 'PASTE_ANON_KEY_DISINI';
```

Dapatkan dari: Supabase > Settings > API

### 6. Jalankan Project (30 detik)

**Option A: VS Code Live Server**
```bash
1. Install extension "Live Server"
2. Right-click index.html
3. "Open with Live Server"
```

**Option B: Python**
```bash
python -m http.server 8000
# Buka http://localhost:8000
```

**Option C: Node.js**
```bash
npx http-server -p 8000
# Buka http://localhost:8000
```

## ✅ Testing

### Test Halaman Publik
1. Buka `http://localhost:8000`
2. ✅ Halaman utama muncul
3. ✅ Toggle dark mode berfungsi
4. ✅ Stats menampilkan angka 0

### Test Admin Login
1. Buka `http://localhost:8000/pages/admin/login.html`
2. Login dengan:
   - Email: `admin@rewardpoint.com`
   - Password: (password yang Anda buat)
3. ✅ Berhasil login (akan redirect ke dashboard - belum dibuat)

## 🎨 Customization (Optional)

### Ubah Warna
Edit `assets/css/main.css` baris 14-18:
```css
--color-primary: #2563EB;     /* Ganti warna primary */
--color-secondary: #F59E0B;   /* Ganti warna secondary */
```

### Ubah Logo
1. Simpan logo Anda sebagai `assets/images/logo.png`
2. Refresh halaman

## 📊 Status Project Saat Ini

✅ **Yang Sudah Jalan:**
- Database complete
- Landing page
- Admin login
- Dark mode
- Responsive design
- All services (backend logic)

⏳ **Yang Belum:**
- Admin dashboard & pages
- Halaman rewards, leaderboard lengkap
- CRUD interfaces

## 🚀 Next Development

Untuk melanjutkan development:

1. **Lihat struktur yang sudah ada**:
   - `index.html` - contoh halaman publik
   - `pages/admin/login.html` - contoh halaman admin
   - `js/main.js` - contoh JavaScript logic

2. **Gunakan services yang sudah ada**:
   ```javascript
   import memberService from './services/member.service.js';
   import rewardService from './services/reward.service.js';
   // dst...
   ```

3. **Gunakan helper functions**:
   ```javascript
   import { showToast, formatNumber, showConfirm } from './utils/helpers.js';
   ```

4. **Copy pattern dari file yang ada** untuk membuat halaman baru

## 📖 Dokumentasi Lengkap

- `README.md` - Overview project
- `SETUP_GUIDE.md` - Setup detail
- `PROGRESS.md` - Progress pembangunan
- `DATABASE_SCHEMA.sql` - Database structure

## 🐛 Troubleshooting Cepat

**Error: "Failed to fetch"**
- ✅ Check `js/config/supabase.js` sudah diisi dengan benar
- ✅ Check internet connection

**Error: "Invalid login credentials"**
- ✅ Pastikan user sudah dibuat di Authentication
- ✅ Pastikan user sudah di-insert ke table admins
- ✅ Pastikan User ID di admins sama dengan User ID di Authentication

**Dark mode tidak berfungsi**
- ✅ Check JavaScript console untuk errors
- ✅ Pastikan semua file CSS ter-load

**Halaman tidak muncul**
- ✅ Check browser console
- ✅ Pastikan development server running
- ✅ Check path file benar

## ⚡ Tips Development

1. **Gunakan Browser DevTools** (F12) untuk debugging
2. **Check Console** untuk error messages
3. **Check Network tab** untuk request/response
4. **Gunakan console.log()** untuk debugging
5. **Test di multiple browsers** (Chrome, Firefox, Edge)

## 💡 Contoh Workflow Development

Untuk membuat halaman admin dashboard:

```javascript
// 1. Buat file: pages/admin/dashboard.html
// 2. Copy structure dari login.html
// 3. Import services yang dibutuhkan
import statsService from '../../js/services/stats.service.js';
import memberService from '../../js/services/member.service.js';

// 4. Load data
async function loadDashboard() {
    const stats = await statsService.getDashboardStats();
    // Render ke UI
}

// 5. Initialize
loadDashboard();
```

## 🎉 Selesai!

Project Anda sekarang sudah running! 🚀

Untuk development selanjutnya, refer ke `PROGRESS.md` untuk melihat apa yang masih perlu dibuat.

---

**Happy Coding!** ✨
