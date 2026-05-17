import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Phone, Mail, X, ChevronDown, Home } from 'lucide-react';
import MegaMenu from './MegaMenu';

export default function Header({
  cartCount = 0,
  searchQuery = '',
  onSearchChange,
  categories = [],
  contactInfo = {},
  activeCategory = null,
  onCategoryFilter,
  onCartClick,
}) {
  const [catalogOpen, setCatalogOpen] = useState(false);

  const handleSearchChange = (e) => {
    onSearchChange && onSearchChange(e.target.value);
    onCategoryFilter && onCategoryFilter(null);
  };

  const clearSearch = () => onSearchChange && onSearchChange('');

  const handleCategoryClick = (slug) => {
    onCategoryFilter && onCategoryFilter(slug);
    onSearchChange && onSearchChange('');
    setCatalogOpen(false);
  };

  return (
    <header className="w-full relative">
      {/* ── Top utilities bar ── */}
      <div className="bg-slate-50 border-b border-slate-200 hidden md:block">
        <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between h-10">
          <div className="flex items-center gap-6 text-[13px] text-slate-500">
            <a href={`tel:${contactInfo.phone1}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <Phone size={13} />{contactInfo.phone1}
            </a>
            <a href={`tel:${contactInfo.phone2}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <Phone size={13} />{contactInfo.phone2}
            </a>
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
              <Mail size={13} />{contactInfo.email}
            </a>
          </div>
            <div className="flex items-center gap-5 text-[13px] text-slate-500">
              <Link to="/delivery" className="hover:text-indigo-600 transition-colors">Доставка</Link>
              <Link to="/payment" className="hover:text-indigo-600 transition-colors">Оплата</Link>
              <Link to="/contacts" className="hover:text-indigo-600 transition-colors">Контакты</Link>
             <div className="flex items-center gap-2 ml-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"
                className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition-colors">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 transition-colors">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 flex items-center gap-2 md:gap-4 h-16 md:h-[72px]">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => { onCategoryFilter && onCategoryFilter(null); onSearchChange && onSearchChange(''); }}
            className="flex-shrink-0 flex items-center gap-1 mr-2 md:mr-4 cursor-pointer"
          >
            <span className="text-base md:text-2xl font-bold text-slate-900 tracking-tight">Server</span>
            <span className="text-base md:text-2xl font-bold text-indigo-600">Net</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 mr-4">
            <Link
              to="/"
              onClick={() => { onCategoryFilter && onCategoryFilter(null); onSearchChange && onSearchChange(''); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
            >
              <Home size={16} />
              Главная
            </Link>
          </nav>
          {/* Catalog button - hidden on mobile, replaced by hamburger */}
          <button
            onClick={() => setCatalogOpen((prev) => !prev)}
            className={`hidden md:flex flex-shrink-0 items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-[14px] transition-all duration-200 cursor-pointer
              ${catalogOpen
                ? 'bg-indigo-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            Каталог
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${catalogOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Mobile: Hamburger menu */}
          <button
            onClick={() => setCatalogOpen((prev) => !prev)}
            className="md:hidden flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 flex">
            <div className="relative flex-1">
               <input
                 type="text"
                 value={searchQuery}
                 onChange={handleSearchChange}
                 placeholder="Поиск товаров..."
                 className="w-full border border-slate-200 rounded-l-xl px-3 py-2 pr-9 text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all md:px-4 md:py-2.5 md:pr-10 md:text-[14px]"
               />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-r-xl flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0 hover:scale-[1.02] md:px-5 md:py-2.5">
              <Search size={18} />
            </button>
          </div>

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="flex-shrink-0 flex flex-col items-center text-slate-600 hover:text-indigo-600 transition-colors ml-2 cursor-pointer group"
          >
             <div className="relative">
               <ShoppingCart size={18} className="group-hover:scale-110 transition-transform duration-200 md:size-8" />
               <span className={`absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center transition-transform
                 ${cartCount > 0 ? 'scale-100' : 'scale-75 opacity-70'} md:w-5 md:h-5 md:text-[10px]`}>
                 {cartCount}
               </span>
             </div>
            <span className="text-[11px] mt-1 hidden sm:block">Корзина</span>
          </button>
        </div>
      </div>

      {/* ── Mega Menu (absolutely positioned below the header) ── */}
      <MegaMenu
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onCategoryFilter={handleCategoryClick}
      />

        {/* ── Service navigation ── */}
        <div className="bg-white border-t border-slate-100">
          <div className="max-w-[1240px] mx-auto px-4">
            <nav className="flex items-center">
              {[ 
                { label: 'Видеонаблюдение', slug: 'sistemy-videonablyudeniya' },
                { label: 'Контроль доступа', slug: 'sistemy-kontrolya-dostupa' },
                { label: 'АТС и телефония', slug: 'ip-telefony' },
                { label: 'Пожарная сигнализация', slug: 'ohrannye-i-pozharnye-sistemy' }
              ].map(({ label, slug }) => (
                <Link
                  to="/catalog"
                  key={label}
                  onClick={() => { 
                    onCategoryFilter && onCategoryFilter(slug); 
                    onSearchChange && onSearchChange(''); 
                  }}
                  className="flex-1 text-center text-[14px] md:text-[15px] font-bold text-slate-800 hover:text-indigo-600 transition-colors py-3"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
    </header>
  );
}
