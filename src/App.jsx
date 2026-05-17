import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import { CONTACT_INFO as DEFAULT_CONTACT_INFO, CATEGORIES, HEADER_CATEGORIES } from './data';

// Lazy-loaded pages (code splitting)
const HomePage = lazy(() => import('./components/HomePage'));
const CatalogPage = lazy(() => import('./components/CatalogPage'));
const CartPage = lazy(() => import('./components/CartPage'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const Contacts = lazy(() => import('./components/Contacts'));
const Delivery = lazy(() => import('./components/Delivery'));
const Payment = lazy(() => import('./components/Payment'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

export default function App() {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
   const [contactInfo, setContactInfo] = useState(() => {
     const saved = localStorage.getItem('contact_info');
     return saved ? JSON.parse(saved) : DEFAULT_CONTACT_INFO;
   });
   const [isRoutesReady, setIsRoutesReady] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Load cart from localStorage on mount
    useEffect(() => {
      const saved = localStorage.getItem('cartItems');
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }

      const auth = localStorage.getItem('admin_auth');
      if (auth === 'true') {
        setIsAdminAuthenticated(true);
      }
    }, []);

    // Mark routes as ready after initial load
    useEffect(() => {
      setIsRoutesReady(true);
    }, []);

    // Auto-save cart to localStorage on changes
    useEffect(() => {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Save contact info to localStorage when it changes
    useEffect(() => {
      localStorage.setItem('contact_info', JSON.stringify(contactInfo));
    }, [contactInfo]);

   const handleAdminLogin = () => {
     localStorage.setItem('admin_auth', 'true');
     setIsAdminAuthenticated(true);
   };

   const handleAdminLogout = () => {
     localStorage.removeItem('admin_auth');
     setIsAdminAuthenticated(false);
     navigate('/admin-login');
   };

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setNotification(`«${product.title}» добавлен в корзину`);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleUpdateQty = (id, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
    }
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCategoryFilter = (slug) => {
    setActiveCategory(slug);
    if (location.pathname !== '/catalog') {
      navigate('/catalog');
    }
  };

  const handleHomeClick = () => {
    setActiveCategory(null);
    setSearchQuery('');
    navigate('/');
  };

  const handleCatalogClick = () => {
    setActiveCategory(null);
    setSearchQuery('');
    navigate('/catalog');
  };

  const openCart = () => {
    setCartOpen(true);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  if (location.pathname === '/admin-login' || location.pathname === '/admin') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
        <Routes>
          <Route 
            path="/admin-login" 
            element={<AdminLogin onLogin={handleAdminLogin} />} 
          />
          <Route 
            path="/admin" 
            element={isAdminAuthenticated ? <AdminDashboard onLogout={handleAdminLogout} /> : <AdminLogin onLogin={handleAdminLogin} />} 
          />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <Header
         cartCount={cartCount}
         searchQuery={searchQuery}
         onSearchChange={(v) => { setSearchQuery(v); if (v) navigate('/catalog'); }}
         categories={HEADER_CATEGORIES}
         contactInfo={contactInfo}
         activeCategory={activeCategory}
         onCategoryFilter={handleCategoryFilter}
         onCartClick={openCart}
         onHomeClick={handleHomeClick}
         onCatalogClick={handleCatalogClick}
       />

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white text-[13px] font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {notification}
        </div>
      )}

      {cartOpen && (
        <CartPage
          cartItems={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          onGoBack={closeCart}
        />
      )}

      <div className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Загрузка страницы...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  activeCategory={activeCategory}
                  onCategoryFilter={handleCategoryFilter}
                  onCatalogClick={handleCatalogClick}
                  onCategoryClick={(slug) => handleCategoryFilter(slug)}
                />
              }
            />
            <Route
              path="/catalog"
              element={
                <CatalogPage
                  searchQuery={searchQuery}
                  activeCategory={activeCategory}
                  onCategoryFilter={handleCategoryFilter}
                  onAddToCart={handleAddToCart}
                  categories={CATEGORIES}
                  cartCount={cartCount}
                  onCartClick={openCart}
                />
              }
            />
            <Route
              path="/product/:articul"
              element={
                <ProductDetails onAddToCart={handleAddToCart} />
              }
            />
            <Route
              path="/contacts"
              element={<Contacts />}
            />
            <Route
              path="/delivery"
              element={<Delivery />}
            />
            <Route
              path="/payment"
              element={<Payment />}
            />
          </Routes>
        </Suspense>
      </div>

      <Footer
        categories={CATEGORIES}
        contactInfo={contactInfo}
        onCategoryFilter={handleCategoryFilter}
        activeCategory={activeCategory}
      />
    </div>
  );
}
