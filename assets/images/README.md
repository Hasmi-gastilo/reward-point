# 🖼️ Assets Images Folder

Folder ini untuk menyimpan gambar-gambar yang digunakan di website.

---

## 📋 Required Images

### 1. **logo.png**
- **Ukuran**: 200px × 50px (recommended)
- **Format**: PNG dengan transparent background
- **Digunakan di**: Navbar, Footer
- **Tips**: Logo horizontal, simple, readable

### 2. **favicon.png**
- **Ukuran**: 32px × 32px atau 64px × 64px
- **Format**: PNG atau ICO
- **Digunakan di**: Browser tab
- **Tips**: Icon sederhana, recognizable dalam ukuran kecil

### 3. **default-avatar.png**
- **Ukuran**: 300px × 300px (minimum)
- **Format**: PNG atau JPG
- **Digunakan untuk**: Member tanpa foto profil
- **Tips**: Icon user generic atau placeholder avatar

### 4. **default-reward.png**
- **Ukuran**: 400px × 300px (minimum)
- **Format**: PNG atau JPG
- **Digunakan untuk**: Hadiah tanpa gambar
- **Tips**: Icon gift box atau placeholder reward

---

## 🎨 Cara Membuat Images

### Opsi 1: Canva (Recommended untuk pemula)
1. Buka https://canva.com
2. Pilih "Custom dimensions"
3. Masukkan ukuran sesuai kebutuhan
4. Design logo/icon Anda
5. Download sebagai PNG

### Opsi 2: Figma (Untuk designer)
1. Buka https://figma.com
2. Buat new file
3. Design images
4. Export sebagai PNG

### Opsi 3: Photoshop/GIMP
Gunakan software image editing favorit Anda

### Opsi 4: Online Tools
- **Logo**: https://logo.com
- **Favicon**: https://favicon.io
- **Icons**: https://flaticon.com

---

## 📏 Spesifikasi Detail

### Logo (logo.png)
```
Dimensions: 200×50px (or similar ratio)
Format: PNG with transparency
Color: Primary color (#2563EB) atau custom
Background: Transparent
File size: < 50KB
```

### Favicon (favicon.png)
```
Dimensions: 32×32px or 64×64px
Format: PNG or ICO
Color: Simple, 1-2 colors
Background: Transparent or solid
File size: < 10KB
```

### Default Avatar (default-avatar.png)
```
Dimensions: 300×300px minimum
Format: PNG or JPG
Style: Flat, simple user icon
Background: Light gray or transparent
File size: < 100KB
Example: 👤 silhouette icon
```

### Default Reward (default-reward.png)
```
Dimensions: 400×300px minimum
Format: PNG or JPG
Style: Gift box or generic reward icon
Background: Light or gradient
File size: < 150KB
Example: 🎁 gift box illustration
```

---

## 🚀 Quick Start (Placeholder Images)

Jika Anda ingin langsung testing, gunakan placeholder ini:

### Temporary Placeholder URLs:
```javascript
// Default Avatar
https://ui-avatars.com/api/?name=User&size=300&background=2563EB&color=fff

// Default Reward
https://via.placeholder.com/400x300/2563EB/fff?text=Reward

// Logo (temporary)
https://via.placeholder.com/200x50/2563EB/fff?text=RewardPoint

// Favicon (temporary)
https://via.placeholder.com/32/2563EB/fff?text=R
```

### Cara pakai temporary:
Edit file HTML dan ganti path dengan URL di atas (sementara)

---

## 📦 Struktur Folder

```
assets/images/
├── logo.png                    # Logo website
├── favicon.png                 # Favicon
├── default-avatar.png          # Default member photo
├── default-reward.png          # Default reward image
└── README.md                   # File ini
```

---

## 🎯 Best Practices

### Optimization
- **Compress images**: Gunakan https://tinypng.com
- **Use WebP**: Untuk better performance (optional)
- **Lazy loading**: Sudah implemented di code

### Naming Convention
- Gunakan lowercase
- Gunakan dash (-) bukan underscore
- Descriptive names
- Examples:
  - ✅ `logo.png`
  - ✅ `default-avatar.png`
  - ❌ `Logo_Final_v2.PNG`

### Image Quality
- **Logo**: High quality, scalable
- **Favicon**: Sharp, clear
- **Avatars**: Medium quality (web optimized)
- **Rewards**: Good quality, attractive

---

## 🔄 Update Images

### Untuk mengganti logo:
1. Upload `logo.png` baru ke folder ini
2. Clear browser cache (Ctrl+Shift+R)
3. Refresh website

### Untuk mengganti via Admin Panel:
1. Login sebagai admin
2. Pergi ke "Pengaturan"
3. Upload logo baru
4. Logo tersimpan di Supabase Storage

---

## 📐 Contoh Logo Simple (Text-based)

Jika belum punya logo, bisa pakai text-based dulu:

**HTML Version (Temporary):**
```html
<!-- Di navbar, ganti img dengan: -->
<div class="nav-logo" style="
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #2563EB, #F59E0B);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.25rem;
">RP</div>
```

---

## 🆘 Troubleshooting

### Image tidak muncul?
1. ✅ Check file name benar (case-sensitive)
2. ✅ Check file extension (.png, bukan .PNG)
3. ✅ Check file ada di folder yang benar
4. ✅ Clear browser cache
5. ✅ Check path di HTML benar

### Image terlalu besar?
1. Compress di https://tinypng.com
2. Atau gunakan online resizer
3. Target: < 200KB per image

### Image pecah/blur?
1. Gunakan ukuran yang lebih besar
2. Export dengan quality 90%+
3. Gunakan PNG untuk transparency

---

## 💡 Resources

### Free Icons & Images:
- **Unsplash**: https://unsplash.com
- **Pexels**: https://pexels.com
- **Flaticon**: https://flaticon.com
- **Font Awesome**: https://fontawesome.com (already included)

### Design Tools:
- **Canva**: https://canva.com (easiest)
- **Figma**: https://figma.com (professional)
- **Remove.bg**: https://remove.bg (remove background)

### Optimization Tools:
- **TinyPNG**: https://tinypng.com (compress)
- **Squoosh**: https://squoosh.app (compress & convert)
- **SVGOMG**: https://jakearchibald.github.io/svgomg/ (SVG optimization)

---

## ✅ Checklist

Sebelum website go-live:
- [ ] logo.png uploaded & looks good
- [ ] favicon.png uploaded & visible in tab
- [ ] default-avatar.png uploaded
- [ ] default-reward.png uploaded
- [ ] All images optimized (< 200KB each)
- [ ] Images tested on all pages
- [ ] No broken image links

---

## 🎨 Color Palette Reference

Untuk consistency dengan website theme:

```
Primary: #2563EB (Blue)
Secondary: #F59E0B (Orange/Yellow)
Success: #10B981 (Green)
Danger: #EF4444 (Red)
```

Gunakan warna-warna ini dalam logo/images Anda.

---

**Happy Designing! 🎨**

Need help? Check documentation atau contact developer.
