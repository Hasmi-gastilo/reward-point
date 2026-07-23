# 📸 Panduan Upload Gambar - Website Reward Point

## 🎯 Ukuran Gambar yang Ideal

### 1. **Foto Produk/Hadiah**

#### **Rekomendasi:**
```
Ukuran: 800px × 600px (ratio 4:3)
atau: 1000px × 750px (ratio 4:3)
Format: JPG atau PNG
Ukuran file: < 500KB
Orientasi: Landscape (horizontal) atau Square
```

#### **Alternatif yang Bagus:**
- **Square**: 800×800px (untuk produk yang ingin tampil penuh)
- **Landscape**: 1200×800px (untuk produk horizontal seperti laptop)
- **Portrait**: 600×800px (untuk produk vertikal seperti HP)

---

## ✅ **TIPS AGAR GAMBAR TIDAK KEPOTONG:**

### **1. Gunakan Background Putih/Terang**
Produk dengan background putih akan terlihat lebih profesional

### **2. Beri Padding/Space**
Jangan isi penuh frame dengan produk, beri sedikit space di sekitar produk

### **3. Center Product**
Pastikan produk berada di tengah gambar

### **4. Aspect Ratio Konsisten**
Gunakan ratio yang sama untuk semua produk (misal: semua 4:3)

---

## 🖼️ **Contoh Gambar yang Baik:**

```
✅ BAIK:
┌─────────────────┐
│                 │
│    [PRODUK]     │  ← Produk di tengah
│                 │     dengan space di sekitar
└─────────────────┘

❌ JELEK:
┌─────────────────┐
│[PRODUK MEMENUHI]│  ← Produk terlalu besar
│[SELURUH FRAME] │     akan kepotong
└─────────────────┘
```

---

## 🛠️ **Cara Edit Gambar Sebelum Upload:**

### **Opsi 1: Canva (Online - Gratis)**
1. Buka https://canva.com
2. Pilih "Custom size" → 800 × 600px
3. Upload foto produk
4. Resize dan posisikan di tengah
5. Tambah background putih
6. Download sebagai JPG

### **Opsi 2: Remove.bg + Canva**
1. Buka https://remove.bg (hapus background)
2. Upload foto produk
3. Download hasil (background transparan)
4. Import ke Canva
5. Tambah background putih/warna
6. Download

### **Opsi 3: Microsoft Paint (Windows)**
1. Buka Paint
2. Resize canvas ke 800×600px
3. Paste gambar produk
4. Resize dan posisikan
5. Save as JPG

### **Opsi 4: Online Image Resizer**
- https://www.iloveimg.com/resize-image
- https://www.resizepixel.com/
- https://bulkresizephotos.com/

---

## 📐 **Ukuran untuk Berbagai Jenis Gambar:**

### **Foto Profil Anggota:**
```
Ukuran: 400px × 400px (square)
Format: JPG atau PNG
Ukuran file: < 300KB
```

### **Banner Slider:**
```
Ukuran: 1200px × 400px (ratio 3:1)
Format: JPG atau PNG
Ukuran file: < 800KB
```

### **Logo Website:**
```
Ukuran: 200px × 50px (horizontal)
Format: PNG dengan background transparan
Ukuran file: < 50KB
```

---

## 🎨 **Template Produk (untuk konsistensi):**

### **Buat Template di Canva:**
1. Buat design 800×600px
2. Background: Putih atau gradient lembut
3. Area produk: 600×450px di tengah
4. Save sebagai template

### **Untuk Setiap Produk Baru:**
1. Gunakan template yang sama
2. Replace foto produk
3. Pastikan posisi konsisten
4. Download

---

## 💡 **SOLUSI CEPAT - CSS yang Sudah Diperbaiki:**

Saya sudah update CSS dengan opsi:

### **1. `object-fit: contain`** (Default - Tidak kepotong)
- Gambar tampil utuh
- Ada space di sekitar jika ratio berbeda
- Cocok untuk: Produk elektronik, barang dengan bentuk unik

### **2. `object-fit: cover`** (Alternatif - Mengisi penuh)
- Gambar mengisi penuh container
- Bisa kepotong jika ratio berbeda
- Cocok untuk: Background, banner

---

## 🖼️ **Contoh Gambar Produk yang Ideal:**

### **iPad/Tablet:**
```
┌───────────────────────┐
│                       │ ← Space atas
│      ┌─────────┐      │
│      │  iPad   │      │ ← Produk di tengah
│      └─────────┘      │    dengan space
│                       │ ← Space bawah
└───────────────────────┘
Background: Putih/Gradient
```

### **HP/Smartphone:**
```
┌─────────────────┐
│                 │
│     ┌─────┐     │
│     │ HP  │     │ ← Portrait
│     │     │     │    di tengah
│     └─────┘     │
│                 │
└─────────────────┘
```

---

## 📊 **Compress Gambar (Kurangi Ukuran File):**

### **Tanpa Mengurangi Kualitas:**
1. **TinyPNG**: https://tinypng.com
2. **Squoosh**: https://squoosh.app
3. **Compressor.io**: https://compressor.io

### **Target:**
- Foto produk: < 500KB
- Foto profil: < 300KB
- Logo: < 50KB
- Banner: < 800KB

---

## ✅ **Checklist Sebelum Upload:**

```
☐ Ukuran gambar sesuai (800×600px untuk produk)
☐ Produk berada di tengah
☐ Ada space/padding di sekitar produk
☐ Background bersih (putih/terang)
☐ File size < 500KB
☐ Format JPG atau PNG
☐ Nama file descriptive (contoh: ipad-pro-2024.jpg)
```

---

## 🎯 **Hasil Akhir:**

Setelah mengikuti panduan ini:
- ✅ Gambar tidak kepotong
- ✅ Konsisten di semua produk
- ✅ Loading cepat (file kecil)
- ✅ Terlihat profesional
- ✅ Responsive di mobile

---

## 🆘 **Troubleshooting:**

### **Gambar masih kepotong?**
1. Check ratio gambar (gunakan 4:3 atau 1:1)
2. Beri padding lebih banyak
3. Pastikan CSS `object-fit: contain`

### **Gambar blur/pecah?**
1. Upload gambar dengan resolusi lebih tinggi
2. Minimum 800px width
3. Jangan over-compress

### **File terlalu besar?**
1. Compress di TinyPNG
2. Atau resize ke ukuran yang lebih kecil
3. Convert ke JPG (lebih kecil dari PNG)

---

## 📝 **Quick Reference:**

| Jenis | Ukuran | Format | Max Size |
|-------|--------|--------|----------|
| Produk | 800×600px | JPG/PNG | 500KB |
| Profil | 400×400px | JPG/PNG | 300KB |
| Banner | 1200×400px | JPG/PNG | 800KB |
| Logo | 200×50px | PNG | 50KB |

---

**Happy Uploading! 📸**

Dengan panduan ini, semua gambar akan tampil sempurna dan tidak kepotong!
