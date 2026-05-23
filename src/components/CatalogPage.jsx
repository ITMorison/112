import { ShoppingCart } from 'lucide-react';
import PopularProducts from './PopularProducts';
import { useState, useMemo, useEffect } from 'react';
import { MEGA_MENU_DATA, PRODUCTS } from '../data';

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
  
  // --- НОВОЕ: Состояние для каналов ---
  const [selectedChannels, setSelectedChannels] = useState([]);

  // Функция переключения каналов
  const toggleChannel = (num) => {
    setSelectedChannels(prev =>
      prev.includes(num) ? prev.filter(c => c !== num) : [...prev, num]
    );
  };

  // Сброс фильтров при смене основной категории
  useEffect(() => {
    setActiveSubcategory('all');
    setSelectedChannels([]); // Сбрасываем каналы при переходе в другой раздел
  }, [activeCategory]);

  const categoryContext = useMemo(() => {
    if (!MEGA_MENU_DATA || activeCategory === 'all' || !activeCategory) {
      return { parentCategory: null, effectiveSubcategory: 'all' };
    }

    const topCat = MEGA_MENU_DATA.find(c => c.slug === activeCategory);
    if (topCat) {
      return { parentCategory: topCat, effectiveSubcategory: 'all' };
    }

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

  // --- ГЛАВНАЯ ЛОГИКА ФИЛЬТРАЦИИ ---
  const isVideoCategory = activeCategory === 'videonablyudenie' || categoryContext.parentCategory?.slug === 'videonablyudenie';

  const currentProducts = useMemo(() => {
    let filtered = [...PRODUCTS];

    // 1. Фильтр по поисковому запросу
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.articul && String(p.articul).toLowerCase().includes(q))
      );
    }

    // 2. Фильтр по категориям и подкатегориям
    if (activeCategory !== 'all') {
      if (categoryContext.parentCategory && activeSubcategory === 'all' && categoryContext.effectiveSubcategory === 'all') {
        const subSlugs = categoryContext.parentCategory.subcategories.map(s => s.slug);
        filtered = filtered.filter(p => subSlugs.includes(p.subcategory) || p.category === activeCategory);
      } else {
        const targetSub = activeSubcategory !== 'all' ? activeSubcategory : categoryContext.effectiveSubcategory;
        if (targetSub !== 'all') {
          filtered = filtered.filter(p => p.subcategory === targetSub);
        }
      }
    }

    // 3. Фильтр по количеству каналов только в разделе видеонаблюдения
    if (isVideoCategory && selectedChannels.length > 0) {
      filtered = filtered.filter(p => {
        return selectedChannels.some(num => {
          const hasInSpecs = p.specs?.channels && String(p.specs.channels).includes(num);
          const hasInTitle = new RegExp(`(\\s|\\b)${num}(\\s?)(кана|CH|port)`, 'i').test(p.title);
          return hasInSpecs || hasInTitle;
        });
      });
    }

    return filtered;
  }, [searchQuery, activeCategory, activeSubcategory, categoryContext, isVideoCategory, selectedChannels]);

  const categoriesForFilters = useMemo(() => {
    return categoryContext.parentCategory ? [categoryContext.parentCategory] : MEGA_MENU_DATA;
  }, [categoryContext.parentCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Subcategories Navigation */}
      {categoryContext.parentCategory && categoryContext.parentCategory.subcategories && (
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-2 border-b border-slate-50">
          <button
            onClick={() => setActiveSubcategory('all')}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
              activeSubcategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Все товары
          </button>
          {categoryContext.parentCategory.subcategories.map((sub) => (
            <button
              key={sub.slug}
              onClick={() => setActiveSubcategory(sub.slug)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
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

      {/* Main Content Area */}
      <PopularProducts
        onAddToCart={onAddToCart}
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategoryFilter={onCategoryFilter}
        showFilters={true}
        products={currentProducts} // Отправляем уже отфильтрованные товары
        categories={categoriesForFilters}
        // Передаем новые пропсы для SidebarFilter
        selectedChannels={selectedChannels}
        toggleChannel={toggleChannel}
      />

      {/* Floating Cart Button */}
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
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-bold">
          Корзина
        </span>
      </button>
    </div>
  );
}