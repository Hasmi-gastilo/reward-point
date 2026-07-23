# 📖 Website Reward Point - Cheat Sheet

Referensi cepat untuk development dan troubleshooting.

---

## 🚀 Quick Commands

### Development Server
```bash
# VS Code Live Server
Right-click index.html > Open with Live Server

# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

### Git Commands
```bash
git add .
git commit -m "message"
git push origin main
```

---

## 🔑 Supabase Config

### File: `js/config/supabase.js`
```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### Get Credentials:
1. Supabase Dashboard
2. Settings > API
3. Copy Project URL & anon key

---

## 📊 Database Quick Reference

### Tables
```sql
admins          -- Admin users
members         -- Anggota
categories      -- Kategori hadiah
rewards         -- Hadiah
point_history   -- Riwayat bintang
redeem_history  -- Riwayat redeem
banners         -- Banner slider
settings        -- Pengaturan website
```

### Storage Buckets
```
members   -- Foto profil anggota
rewards   -- Foto hadiah
banners   -- Gambar banner
settings  -- Logo website
```

---

## 🎨 CSS Variables

### Colors
```css
--color-primary: #2563EB
--color-secondary: #F59E0B
--color-success: #10B981
--color-danger: #EF4444
--color-warning: #F59E0B
```

### Spacing
```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
```

---

## 💻 JavaScript Services

### Import Services
```javascript
import authService from './services/auth.service.js';
import memberService from './services/member.service.js';
import rewardService from './services/reward.service.js';
import categoryService from './services/category.service.js';
import bannerService from './services/banner.service.js';
import redeemService from './services/redeem.service.js';
import pointService from './services/point.service.js';
import statsService from './services/stats.service.js';
```

### Auth Service
```javascript
// Login
await authService.login(email, password);

// Logout
await authService.logout();

// Check auth
await authService.isAuthenticated();

// Protect page
await authService.protectAdminPage();
```

### Member Service
```javascript
// Get all
await memberService.getAll({ search, limit, offset });

// Get by ID
await memberService.getById(id);

// Create
await memberService.create(memberData);

// Update
await memberService.update(id, memberData);

// Delete
await memberService.delete(id);

// Upload photo
await memberService.uploadPhoto(file, memberId);

// Leaderboard
await memberService.getLeaderboard(limit);
```

### Reward Service
```javascript
// Get all
await rewardService.getAll({ search, category_id, status, limit, offset });

// Get by ID
await rewardService.getById(id);

// Create
await rewardService.create(rewardData);

// Update
await rewardService.update(id, rewardData);

// Delete
await rewardService.delete(id);

// Upload image
await rewardService.uploadImage(file, rewardId);
```

### Point Service
```javascript
// Add points
await pointService.addPoints(memberId, point, description);

// Subtract points
await pointService.subtractPoints(memberId, point, description);

// Get history
await pointService.getHistory(memberId, options);
```

### Redeem Service
```javascript
// Process redeem
await redeemService.processRedeem(memberId, rewardId);

// Get history
await redeemService.getHistory(options);

// Get recent
await redeemService.getRecent(limit);
```

---

## 🛠️ Helper Functions

### Import Helpers
```javascript
import { 
    formatNumber,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    truncateText,
    debounce,
    showToast,
    showLoading,
    hideLoading,
    showConfirm,
    validateFile,
    getImagePreview,
    copyToClipboard,
    exportToCSV
} from './utils/helpers.js';
```

### Common Usage
```javascript
// Format number
formatNumber(1000); // "1.000"

// Show toast
showToast('Success!', 'success');
showToast('Error!', 'error');

// Show confirm
if (await showConfirm('Are you sure?')) {
    // Do something
}

// Validate file
const validation = validateFile(file, {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png']
});

// Image preview
const preview = await getImagePreview(file);

// Debounce
const debouncedSearch = debounce(() => {
    performSearch();
}, 500);
```

---

## 🎯 Component Classes

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-lg">Large</button>
<button class="btn btn-sm">Small</button>
<button class="btn-icon"><i class="fas fa-edit"></i></button>
```

### Cards
```html
<div class="card">Content</div>
<div class="member-card">Member card</div>
<div class="reward-card">Reward card</div>
```

### Forms
```html
<div class="form-group">
    <label class="form-label">Label</label>
    <input type="text" class="form-control" />
</div>
```

### Badges
```html
<span class="badge badge-success">Success</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-primary">Primary</span>
```

### Alerts
```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-danger">Error message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-info">Info message</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

---

## 🐛 Common Errors & Solutions

### "Failed to fetch"
```javascript
// Check Supabase config
console.log(SUPABASE_URL);
console.log(SUPABASE_ANON_KEY);
```

### "Invalid login credentials"
```sql
-- Check admin user
SELECT * FROM admins WHERE email = 'admin@rewardpoint.com';
```

### Image not uploading
```javascript
// Check bucket exists and is public
// Check RLS policies
// Check file validation
```

### Dark mode not working
```javascript
// Check localStorage
console.log(localStorage.getItem('theme'));

// Toggle manually
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 📁 File Structure Quick Ref

```
📁 Project Root
├── 📄 index.html
├── 📄 DATABASE_SCHEMA.sql
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── main.css
│   │   ├── components.css
│   │   └── responsive.css
│   └── 📁 images/
├── 📁 js/
│   ├── 📁 config/
│   │   └── supabase.js
│   ├── 📁 services/
│   │   └── *.service.js
│   ├── 📁 utils/
│   │   └── helpers.js
│   └── main.js
└── 📁 pages/
    ├── rewards.html
    ├── leaderboard.html
    └── 📁 admin/
        ├── login.html
        ├── dashboard.html
        └── *.html
```

---

## 🔐 Admin Credentials

### Default Setup
```
Email: admin@rewardpoint.com
Password: (yang Anda buat di Supabase)
```

### Create Admin
```sql
-- 1. Buat user di Supabase Auth
-- 2. Insert ke table admins
INSERT INTO admins (id, fullname, email, password)
VALUES ('user-id-from-auth', 'Admin Name', 'email@example.com', '');
```

---

## 🎨 Theme Toggle

```javascript
// Get current theme
const theme = document.documentElement.getAttribute('data-theme');

// Set theme
document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('theme', 'dark');

// Toggle
const newTheme = theme === 'light' ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', newTheme);
localStorage.setItem('theme', newTheme);
```

---

## 📊 SQL Quick Queries

### Get stats
```sql
-- Total members
SELECT COUNT(*) FROM members;

-- Total rewards
SELECT COUNT(*) FROM rewards WHERE status = 'active';

-- Total redeems
SELECT COUNT(*) FROM redeem_history;

-- Total points
SELECT SUM(total_point) FROM members;
```

### Leaderboard
```sql
SELECT * FROM members 
WHERE status = 'active'
ORDER BY total_point DESC
LIMIT 10;
```

### Recent redeems
```sql
SELECT 
    rh.*,
    m.fullname as member_name,
    r.title as reward_title
FROM redeem_history rh
LEFT JOIN members m ON rh.member_id = m.id
LEFT JOIN rewards r ON rh.reward_id = r.id
ORDER BY rh.created_at DESC
LIMIT 10;
```

---

## 🚨 Emergency Commands

### Reset Database
```sql
-- ⚠️ DANGER: Hapus semua data!
TRUNCATE TABLE redeem_history CASCADE;
TRUNCATE TABLE point_history CASCADE;
TRUNCATE TABLE members CASCADE;
TRUNCATE TABLE rewards CASCADE;
```

### Reset Member Points
```sql
UPDATE members SET total_point = 0;
DELETE FROM point_history;
```

### Backup Data
```sql
-- Export via Supabase Dashboard
-- Table Editor > Select All > Download as CSV
```

---

## 📞 Quick Links

- Supabase: https://supabase.com
- Font Awesome: https://fontawesome.com/icons
- Google Fonts: https://fonts.google.com
- CSS Reference: https://developer.mozilla.org/en-US/docs/Web/CSS

---

## 💡 Pro Tips

1. **Always test in console first**
```javascript
console.log(await memberService.getAll());
```

2. **Use browser DevTools** (F12)
   - Console for errors
   - Network for API calls
   - Application for localStorage

3. **Enable auto-save** in editor

4. **Use Git branches** for features
```bash
git checkout -b feature-name
```

5. **Commit often**
```bash
git commit -m "descriptive message"
```

---

**Quick Reference Complete! 🎯**

Bookmark this page untuk referensi cepat saat development!
