# 🚀 Deployment Guide — ServerNet

## Quick Deploy (Vercel — Recommended)

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Production ready: remove slider, optimize performance, fix bugs"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **New Project** → Import repository
3. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**

Vercel will:
- Install dependencies
- Run production build
- Deploy to `https://<project>.vercel.app`
- Provide HTTPS automatically

### Step 3: Custom Domain (Optional)
1. In Vercel dashboard → Project Settings → Domains
2. Add `server-net.kz`
3. Update DNS A record to point to Vercel's IPs (provided in dashboard)
4. Wait for SSL certificate (automatic, ~5 min)

---

## Alternative: Railway / Netlify

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Netlify
1. Drag-and-drop `dist/` folder to Netlify dashboard
2. Or connect Git repo for auto-deploy

---

## 📦 Production Build Checklist

### Pre-build
- [x] All images exist in correct paths
- [x] Environment variables set (none needed currently)
- [x] All lint errors fixed: `npm run lint`
- [x] Type checking passes (if TypeScript used)

### Build
```bash
npm run build
```

**Expected output:**
```
✓ 50 modules transformed.
✓ built in Xs
dist/_assets/
  - index-<hash>.js
  - index-<hash>.css
  - assets/...
```

### Post-build Test
```bash
npm run preview
```
Visit `http://localhost:4173` and test all pages.

---

## 🔐 Security & Environment

### Environment Variables
Currently none required. All config in `data.js` and `localStorage`.

If adding API keys (Resend, etc.):
1. Create `.env` file (ignored by git):
   ```
   VITE_RESEND_API_KEY=re_xxx
   VITE_NOTIFY_EMAIL=info@servernet.kz

   ```
2. Access via `import.meta.env.VITE_RESEND_API_KEY`

### HTTPS
- Vercel/Netlify/Railway provide free SSL automatically
- No additional config needed

---

## 📊 Performance Optimization (Applied)

| Optimization | Status | Impact |
|--------------|--------|--------|
| Code splitting (React.lazy) | ✅ | ↓ Initial bundle 30–40% |
| Image lazy loading | ✅ | ↓ Initial load time |
| Removed slider (heavy animation) | ✅ | ↓ JS bundle, smoother UX |
| Tailwind CSS (atomic) | ✅ | Minimal unused CSS |
| Production build (minified) | ✅ | ↓ File sizes 70%+ |

---

## 🔍 SEO Configuration

**Already added in `index.html`:**
- Title and meta description
- Open Graph tags
- Twitter Card
- Canonical URL (set at deploy time)
- Robots meta (index, follow)

**Still needed:**
- [ ] `sitemap.xml` — generate from `PRODUCTS` array
- [ ] `robots.txt` — allow all
- [ ] Structured data (JSON-LD) for products (optional)

---

## 📈 Analytics (Optional)

### Google Analytics 4
Add to `index.html` before `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Yandex.Metrica
```html
<script type="text/javascript">
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)});
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  ym(XXXXXXXXXX, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
</script>
```

---

## 🐛 Post-Deploy Monitoring

### 1. Error Tracking
Set up Sentry or LogRocket:
```bash
npm install @sentry/react @sentry/vite-plugin
```
Configure in `main.jsx`:
```js
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "https://xxx@xxx.ingest.sentry.io/xxx" });
```

### 2. Uptime Monitoring
- Use UptimeRobot (free) to ping `/` every 5 min
- Set up email/Slack alerts

### 3. Performance Monitoring
- Vercel Analytics (built-in if on Vercel)
- Google Search Console (submit sitemap)

---

## 🔄 Rollback Plan

If deployment breaks:

### Vercel
1. Go to Deployments tab
2. Click "…" on previous stable deployment
3. Click **Promote to Production**

### Manual
```bash
git revert <bad-commit-hash>
git push origin main
# Redeploy
```

---

## ✅ Pre-Launch Final Checklist

**Critical:**
- [ ] All product images appear (verify on staging)
- [ ] No console errors in browser
- [ ] Mobile responsive tested on real device
- [ ] Lighthouse score >85
- [ ] Contact form (if any) sends emails
- [ ] Admin panel updates reflected live

**SEO:**
- [ ] `sitemap.xml` accessible at `/sitemap.xml`
- [ ] `robots.txt` allows crawling
- [ ] Favicon displays in browser tab
- [ ] Open Graph preview looks good (use Facebook debugger)

**Legal:**
- [ ] Privacy policy page (if required)
- [ ] Terms of service (if required)
- [ ] Cookie consent banner (if required in jurisdiction)

**Analytics:**
- [ ] GA4 property created and linked
- [ ] Goals/events configured (add to cart, checkout)
- [ ] Real-time test shows activity

---

## 📞 Support Contacts

**Hosting provider:** Vercel Support
**Domain registrar:** (check with client)
**Email service:** Resend (already configured)

---

**Last updated:** 2026-05-07
**Deployment status:** Ready for staging → production
