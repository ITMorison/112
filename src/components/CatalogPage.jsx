import { ShoppingCart } from 'lucide-react';
import PopularProducts from './PopularProducts';
import { useState, useMemo, useEffect } from 'react';
import { MEGA_MENU_DATA } from '../data';

export default function CatalogPage({
  searchQuery,
  activeCategory,
  onCategoryFilter,
  onAddToCart,
  categories,
  cartCount,
  onCartClick,
  products = [],
  productsLoading = false,
  loadedChunks = 0
}) {
  const [activeSubcategory, setActiveSubcategory] = useState('all');

  // Determine parent category and effective subcategory from activeCategory
  const categoryContext = useMemo(() => {
    if (!MEGA_MENU_DATA || activeCategory === 'all' || !activeCategory) {
      return { parentCategory: null, effectiveSubcategory: 'all' };
    }

    // Check if activeCategory is a top-level category slug in MEGA_MENU_DATA
    const topCat = MEGA_MENU_DATA.find(c => c.slug === activeCategory);
    if (topCat) {
      return { parentCategory: topCat, effectiveSubcategory: 'all' };
    }

    // Check if activeCategory is a subcategory slug - find its parent
    for (const cat of MEGA_MENU_DATA) {
      if (cat.subcategories) {
        const sub = cat.subcategories.find(s => s.slug === activeCategory);
        if (sub) {
          return { parentCategory: cat, effectiveSubcategory: activeCategory };
        }
      }
    }

    return { parentCategory: null, effectiveSubcategory: 'all' };
  }, [activeCategory]);

  // Sync activeSubcategory when categoryContext changes
  useEffect(() => {
    setActiveSubcategory(categoryContext.effectiveSubcategory);
  }, [categoryContext.effectiveSubcategory]);

  // Get subcategories from parent category (from MEGA_MENU_DATA)
  const currentSubcategories = categoryContext.parentCategory ? categoryContext.parentCategory.subcategories : [];

  // Loading state
  if (productsLoading) {
    return (
      <main className="max-w-[1240px] mx-auto px-4 py-6 md:py-8 pb-24">
        <div className="mb-6 md:mb-8">
          <h1 className="text-[22px] md:text-[26px] font-bold text-gray-900">
            Каталог товаров
          </h1>
          <p className="text-[13px] md:text-[14px] text-gray-500 mt-1">
            Загрузка склада... {loadedChunks > 0 && `(загружено ${(loadedChunks * 2000).toLocaleString()} товаров)`}
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
            <p className="text-slate-500 text-[15px]">Загрузка товаров...</p>
          </div>
        </div>
      </main>
    );
  }

  // Subcategory panel (shown when category is selected)
  return (
    <main className="max-w-[1240px] mx-auto px-4 py-6 md:py-8 pb-24">
      <div className="mb-6 md:mb-8">
        <h1 className="text-[22px] md:text-[26px] font-bold text-gray-900">
          Каталог товаров
        </h1>
        <p className="text-[13px] md:text-[14px] text-gray-500 mt-1">
          {categories?.length || 0} разделов оборудования
        </p>
      </div>

      {/* Subcategory filters */}
      {currentSubcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <button
            onClick={() => setActiveSubcategory('all')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
              activeSubcategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Все
          </button>
          {currentSubcategories.map((sub) => (
            <button
              key={sub.slug}
              onClick={() => setActiveSubcategory(sub.slug)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                activeSubcategory === sub.slug
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {sub.name || sub.title}
            </button>
          ))}
        </div>
      )}

      <PopularProducts
        onAddToCart={onAddToCart}
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategoryFilter={onCategoryFilter}
        showFilters={true}
        products={products}
        categories={categories}
      />

      {/* Cart button */}
      <button
        onClick={onCartClick}
        className="fixed bottom-4 right-4 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group md:bottom-6 md:right-6 md:p-4"
      >
        <ShoppingCart size={18} className="md:size-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center md:w-5 md:h-5 md:text-xs">
            {cartCount}
          </span>
        )}
        <span className="hidden lg:inline text-sm font-medium group-hover:translate-x-1 transition-transform">
          Корзина
        </span>
      </button>
    </main>
  );
}
