# 🐛 Bug Report & Testing Documentation

## Tested On: Windows, Chrome 120+, React 19, React Router 7

---

## 🔴 Critical Issues

### CR-1: Missing Product Images
**Severity:** High
**Status:** Open
**Description:** ~200 products have `image: ""` and `NOT_FOUND` entries in `image_cache.json`. They display placeholder or broken images.

**Steps to reproduce:**
1. Go to `/catalog`
2. Filter to categories: "Мини АТС", "VoIP-шлюзы", "SIP-телефоны"
3. Many products show no image

**Root cause:**
- Original source URLs in `image_cache.json` point to `market-telecom.kz` which no longer hosts these images
- `new-products.json` products lack associated image files in `/public/photo/{category}/`

**Fix options:**
1. **Download from archive.org** (preferred): Use Wayback Machine to recover original images
2. **Generate placeholders**: Create generic "no image" icons with product category label overlay
3. **Manual sourcing**: Request image assets from client
4. **External placeholder service**: Use `https://placehold.co/400x300?text=No+Image`

**Recommended:** Implement option 2 (auto-generated SVG placeholders) as temporary, option 1 as permanent if available.

---

### CR-2: Category Header Images Missing
**Severity:** High
**Location:** `src/data.js:16-123` (HEADER_CATEGORIES)
**Description:** Categories have `image` fields like `"/kompyutery-i-komplektuyushchie.jpg"` but these files don't exist in `public/`. Used in MegaMenu (future implementation) and potentially Header.

**Impact:** MegaMenu category images won't display

**Fix:** Either add images to `public/` or remove/replace image logic in MegaMenu component.

---

## 🟡 Medium Issues

### MD-1: PopularCategories Hardcoded Image Paths
**Severity:** Medium
**File:** `src/components/PopularCategories.jsx:3-12`
**Description:** References images like `/polki.png`, `/Wi-Fi Router.jpg` etc. that don't exist.

**Current behavior:** Broken image icons displayed

**Fix:** Replace with actual files in `public/` or use category-based dynamic images from `data.js`.

---

### MD-2: PopularCategories Data Duplication
**Severity:** Medium
**File:** `src/components/PopularCategories.jsx`
**Description:** Has its own hardcoded categories array instead of using `CATEGORIES` or `HEADER_CATEGORIES` from `data.js`.

**Impact:** Data duplication, maintenance burden

**Fix:** Refactor to accept categories as prop from parent (HomePage) or derive from `CATEGORIES`.

---

### MD-3: Header Top Bar Contact Links Not Clickable
**Severity:** Medium
**File:** `src/components/Header.jsx:37-45`
**Description:** Phone numbers and email are displayed as `<span>` with `cursor-pointer` but no `href` attribute.

**Fix:** Already addressed — changed to `<a href="tel:...">` and `<a href="mailto:...">` (line 37-45).

**Status:** ✅ Fixed

---

### MD-4: Missing Error Boundaries
**Severity:** Medium
**Files:** All route components
**Description:** No error boundaries; runtime errors crash entire app

**Fix:** Wrap `<Routes>` in error boundary component

**Example:**
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <h1>Something went wrong</h1>;
    return this.props.children;
  }
}
```

---

### MD-5: No Loading States for Lazy Routes
**Severity:** Medium
**File:** `src/App.jsx` (after changes)
**Description:** After implementing `React.lazy()`, fallback is a simple text "Загрузка..." which is fine but could be improved with spinner.

**Recommendation:** Add a spinner/skeleton component for better UX.

---

## 🟢 Low Issues

### LW-1: No Favicon Beyond SVG
**Severity:** Low
**File:** `index.html`
**Description:** Uses Vite default SVG. Should provide `.ico` and PNG variants for browser compatibility.

**Fix:** Add `favicon.ico`, `apple-touch-icon.png` to `public/` and reference in `index.html`.

---

### LW-2: Missing Sitemap.xml
**Severity:** Low (SEO)
**Description:** Search engines benefit from sitemap. Can be generated from `PRODUCTS` array.

**Fix:** Create `sitemap.xml` in `public/` or generate at build time via script.

---

### LW-3: No Analytics
**Severity:** Low
**Description:** No traffic tracking configured

**Fix:** Add Google Analytics 4 or Yandex.Metrica script to `index.html` or via React component.

---

### LW-4: Admin Order Delete — No Undo
**Severity:** Low
**File:** `src/components/AdminDashboard.jsx:99-103`
**Description:** Deleting an order is permanent. No confirmation toast with undo.

**Fix:** Acceptable for admin panel, but could add toast notification with "Undo" button for 5 seconds.

---

### LW-5: Mobile Touch Targets May Be Small
**Severity:** Low
**Files:** Multiple
**Description:** Some buttons (e.g., CategoryCard, ProductCard "add to cart") may be close to 44×44px minimum recommended.

**Fix:** Audit in DevTools device mode; increase padding if needed.

---

## ✅ Already Fixed

| ID | Issue | Fix |
|----|-------|-----|
| HD-1 | Slider on homepage | Removed; now static hero banner |
| HD-2 | Header phone/email not clickable | Changed spans to `<a href="tel:...">` and `<a href="mailto:...">` |
| HD-3 | Contact info not editable in admin | Added "Контакты" tab with live editing + localStorage persistence |

---

## 📋 Responsive Checklist

### Mobile (320–767px)
- [x] Header hamburger menu visible
- [x] Footer stacks in single column
- [x] ProductCard grid: 2 cols
- [x] CatalogPage sidebar hidden behind hamburger
- [ ] MegaMenu touch targets ≥44px (verify)
- [ ] No horizontal scroll on any page

### Tablet (768–1023px)
- [x] ProductCard grid: 3–4 cols
- [x] Hero banner height adjusted
- [x] Header shows full nav with category dropdown

### Desktop (≥1024px)
- [x] All grids show full columns
- [x] MegaMenu displays 5-column layout

---

## ⚡ Performance Checklist

- [x] Code splitting implemented via `React.lazy()` + `Suspense`
- [x] Images have `loading="lazy"` (ProductCard)
- [ ] Images optimized to WebP (optional)
- [ ] Unused dependencies removed (check bundle analyzer)
- [ ] Service worker/PWA (optional)

---

## 🔧 Build & Deployment

### Production Build Test
```bash
npm run build
npm run preview
```

### Expected Output
- `dist/` folder with static assets
- All routes should work with client-side routing
- Assets should be cached with hashed filenames

### Environment Variables (if any)
None currently used. All data in `data.js` or localStorage.

---

## 📦 Post-Deployment Verification

After deploying to production:

1. **Smoke test:**
   - Homepage loads
   - Catalog filtering works
   - Product page loads
   - Cart works
   - Admin login works

2. **Image audit:**
   - Check browser console for 404s
   - Verify most product images appear
   - Identify remaining broken images

3. **Performance audit:**
   - Run Lighthouse (Chrome DevTools)
   - Aim for >85 score across categories

4. **Mobile test:**
   - Test on actual device if possible
   - Check touch interactions, scrolling

---

## 🗺️ Roadmap

### Phase 1 — Critical Fixes (Pre-launch)
- [ ] Download/restore missing product images
- [ ] Add category header images to `public/`
- [ ] Test responsive on real devices
- [ ] Run production build and fix any errors
- [ ] Add favicon (PNG/ICO)

### Phase 2 — Polish (Launch week)
- [ ] Add sitemap.xml
- [ ] Add analytics
- [ ] Implement error boundaries
- [ ] Add loading spinners for Suspense
- [ ] Accessibility audit (ARIA labels, keyboard nav)

### Phase 3 — Post-launch
- [ ] Convert category images to WebP
- [ ] Implement image CDN
- [ ] Add service worker for offline cache
- [ ] Consider SSR/SSG with Vite SSR if SEO critical

---

**Last updated:** 2026-05-07
**Prepared by:** Kilo (AI Assistant)
