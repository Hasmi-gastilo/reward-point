# 🚀 Panduan Deploy Website Reward Point ke Production

## 📋 Pre-Deployment Checklist

### ✅ Sebelum Deploy, Pastikan:
- [ ] Supabase sudah di-setup dengan benar
- [ ] Database schema sudah dijalankan
- [ ] Storage buckets sudah dibuat
- [ ] Admin user sudah dibuat
- [ ] Website berjalan dengan baik di local
- [ ] Semua fitur sudah ditest
- [ ] Tidak ada console errors
- [ ] Images sudah di-optimize

---

## 🌐 Option 1: Deploy ke Netlify (Recommended)

### Keuntungan:
- ✅ Free tier generous
- ✅ Auto SSL/HTTPS
- ✅ Global CDN
- ✅ Easy setup
- ✅ Auto deploy dari Git

### Langkah-langkah:

#### 1. Persiapan
```bash
# Pastikan project sudah di Git repository
git init
git add .
git commit -m "Initial commit"
```

#### 2. Push ke GitHub
```bash
# Buat repository baru di GitHub
# Kemudian:
git remote add origin https://github.com/username/reward-point.git
git branch -M main
git push -u origin main
```

#### 3. Deploy ke Netlify
1. Buka https://netlify.com
2. Login dengan GitHub
3. Klik "New site from Git"
4. Pilih repository Anda
5. Build settings:
   - **Build command**: (kosongkan)
   - **Publish directory**: `/` atau `.`
6. Klik "Deploy site"

#### 4. Configure Domain (Optional)
1. Setelah deploy, klik "Domain settings"
2. Tambahkan custom domain jika punya
3. SSL otomatis aktif

### Update Website:
```bash
# Setiap kali ada perubahan:
git add .
git commit -m "Update features"
git push origin main
# Netlify otomatis deploy!
```

---

## 🔷 Option 2: Deploy ke Vercel

### Keuntungan:
- ✅ Free tier
- ✅ Sangat cepat
- ✅ Auto SSL
- ✅ Edge network

### Langkah-langkah:

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
# Di folder project:
vercel

# Follow prompts:
# - Setup and deploy? Yes
# - Which scope? (pilih account Anda)
# - Link to existing project? No
# - Project name? reward-point
# - In which directory is your code? ./
# - Override settings? No
```

#### 3. Production Deploy
```bash
vercel --prod
```

---

## 📄 Option 3: Deploy ke GitHub Pages

### Keuntungan:
- ✅ Free
- ✅ Simple
- ✅ Terintegrasi dengan GitHub

### Langkah-langkah:

#### 1. Push ke GitHub (jika belum)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/reward-point.git
git push -u origin main
```

#### 2. Enable GitHub Pages
1. Buka repository di GitHub
2. Settings > Pages
3. Source: Deploy from branch
4. Branch: `main` / `root`
5. Save

#### 3. Akses Website
Website akan tersedia di:
```
https://username.github.io/reward-point/
```

---

## 🐳 Option 4: Deploy ke VPS (Advanced)

### Untuk VPS (DigitalOcean, AWS, etc):

#### 1. Setup Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/reward-point;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

#### 2. Upload Files
```bash
# Via SCP:
scp -r * user@yourserver:/var/www/reward-point/

# Atau via Git:
ssh user@yourserver
cd /var/www
git clone https://github.com/username/reward-point.git
```

#### 3. Setup SSL (Let's Encrypt)
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## ⚙️ Environment Configuration

### Update Supabase Config untuk Production

Edit `js/config/supabase.js`:

```javascript
// DEVELOPMENT
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// PRODUCTION (gunakan environment variables jika memungkinkan)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
```

### Untuk Platform yang Support Environment Variables:

**Netlify:**
1. Site settings > Environment variables
2. Add: `SUPABASE_URL` dan `SUPABASE_ANON_KEY`

**Vercel:**
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

---

## 🔒 Security Checklist

### Before Production:
- [ ] Update CORS settings di Supabase
- [ ] Set production URL di Supabase
- [ ] Enable RLS policies
- [ ] Limit API access
- [ ] Use environment variables
- [ ] Tidak ada credentials di code
- [ ] Gunakan HTTPS
- [ ] Validate all inputs
- [ ] Rate limiting (optional)

### Supabase CORS Settings:
1. Buka Supabase Dashboard
2. Settings > API
3. Tambahkan production domain ke allowed origins

---

## 📊 Post-Deployment Testing

### Test Checklist:
- [ ] Website dapat diakses
- [ ] Admin login berfungsi
- [ ] CRUD operations working
- [ ] Upload gambar working
- [ ] Dark mode berfungsi
- [ ] Mobile responsive
- [ ] SSL/HTTPS aktif
- [ ] No console errors
- [ ] Fast loading time

### Testing Tools:
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **SSL Test**: https://www.ssllabs.com/ssltest/

---

## 🚀 Performance Optimization

### 1. Optimize Images
```bash
# Install imagemin (optional)
npm install -g imagemin-cli

# Optimize
imagemin assets/images/* --out-dir=assets/images/
```

### 2. Enable Caching
Tambahkan headers di hosting:
```
# Netlify (_headers file)
/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

### 3. Minify (Optional)
```bash
# CSS
npx cssnano assets/css/main.css assets/css/main.min.css

# JavaScript
npx terser js/main.js -o js/main.min.js
```

---

## 📈 Monitoring

### Google Analytics (Optional)
Tambahkan di `<head>` semua HTML:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Supabase Analytics
- Monitor database usage di Supabase Dashboard
- Check API requests
- Monitor storage usage

---

## 🔄 Update & Maintenance

### Rollback Process:
```bash
# Git rollback
git revert HEAD
git push origin main

# Atau
git reset --hard commit-hash
git push -f origin main
```

### Regular Maintenance:
- [ ] Backup database weekly
- [ ] Monitor error logs
- [ ] Update dependencies
- [ ] Check performance
- [ ] Review security

---

## 🆘 Troubleshooting

### Issue: "Failed to fetch"
**Solution**: Check CORS settings di Supabase

### Issue: Images tidak muncul
**Solution**: 
1. Check storage bucket public
2. Check image URLs correct
3. Check RLS policies

### Issue: Slow loading
**Solution**:
1. Optimize images
2. Enable caching
3. Use CDN
4. Minify files

---

## 📝 Custom Domain Setup

### Netlify:
1. Domain settings > Add custom domain
2. Update DNS records:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

### Vercel:
1. Settings > Domains
2. Add domain
3. Update DNS:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## ✅ Final Checklist

Before Going Live:
- [ ] All pages tested
- [ ] Mobile responsive verified
- [ ] SSL certificate active
- [ ] Supabase configured correctly
- [ ] Custom domain setup (if applicable)
- [ ] Analytics installed (if needed)
- [ ] Backup taken
- [ ] Documentation complete
- [ ] Admin credentials secure
- [ ] Performance optimized

---

## 🎉 Congratulations!

Website Reward Point Anda sudah **LIVE** dan siap digunakan!

### Next Steps:
1. Share URL dengan users
2. Train admin menggunakan system
3. Monitor usage & performance
4. Gather feedback
5. Iterate & improve

---

## 📞 Support Resources

- Netlify Docs: https://docs.netlify.com/
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Pages: https://pages.github.com/

---

**Happy Deploying! 🚀**

Website Reward Point - Production Ready
