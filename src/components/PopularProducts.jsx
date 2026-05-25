import { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import SidebarFilter from './SidebarFilter';
import { PRODUCTS, MENU_SLUG_TO_PRODUCT_MAP } from '../data';
import { SlidersHorizontal, X } from 'lucide-react';
import { getProductBrand, getProductResolution, matchesCameraType } from './filterUtils';

export default function PopularProducts({
  onAddToCart,
  searchQuery = '',
  activeCategory = null,
  activeSubcategory = 'all',
  products = [],
  selectedChannels, // <--- Добавь это
  toggleChannel,       // <--- Добавь это
  categories = []
}) {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [poeOnly, setPoeOnly] = useState(false);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    // Resolution filter for video surveillance
    const [selectedResolutions, setSelectedResolutions] = useState([]);
    // Camera type filter for video surveillance
    const [selectedCameraTypes, setSelectedCameraTypes] = useState([]);

   const allProducts = products.length > 0 ? products : PRODUCTS;

   const hasPoeProducts = useMemo(() => {
     return allProducts.some((p) => p.specs?.poe === 'Да' || p.specs?.poeOut === 'Да' || p.specs?.poe === true);
   }, [allProducts]);

   // Reset PoE filter when current category/subcategory has no PoE items
   useEffect(() => {
     if (!hasPoeProducts && poeOnly) {
       setPoeOnly(false);
     }
   }, [hasPoeProducts, poeOnly]);

   // Reset video-specific filters when active category changes to non-video
   useEffect(() => {
     if (activeCategory !== 'videonablyudenie') {
       setSelectedResolutions([]);
       setSelectedCameraTypes([]);
     }
   }, [activeCategory]);

   // Filter state - resolve menu slug to actual product category/subcategory
   const resolvedCategoryFilters = useMemo(() => {
     if (!activeCategory) return [];
     const map = MENU_SLUG_TO_PRODUCT_MAP[activeCategory];
     if (map) {
       const vals = [map.category, map.subcategory].filter(Boolean);
       return [...new Set(vals)];
     }
     return [activeCategory];
   }, [activeCategory]);

   const resolvedSubcategory = useMemo(() => {
     if (!activeSubcategory || activeSubcategory === 'all') return 'all';
     const map = MENU_SLUG_TO_PRODUCT_MAP[activeSubcategory];
     return map?.subcategory || activeSubcategory;
   }, [activeSubcategory]);

   const [selectedCategories, setSelectedCategories] = useState(() => 
     resolvedCategoryFilters
   );

   // Sync with activeCategory from header
   useEffect(() => {
     setSelectedCategories(resolvedCategoryFilters);
   }, [resolvedCategoryFilters]);

     // Основная логика фильтрации
     const filtered = useMemo(() => {
       // Если нет активных фильтров и нет поиска, показываем все товары
       const noCategoryOrSearch = !activeCategory && !searchQuery.trim();
       const noSubcategory = !activeSubcategory || activeSubcategory === 'all';
       const noBrands = selectedBrands.length === 0;
       const noPoe = !poeOnly;
       const noAvailable = !availableOnly;
       const noPrice = priceRange[0] <= 0 && priceRange[1] >= 1000000;
       const noResolutions = selectedResolutions.length === 0;

       if (noCategoryOrSearch && noSubcategory && noBrands && noPoe && noAvailable && noPrice && noResolutions) {
         return allProducts;
       }

       let result = allProducts;

       // 1. Поиск по названию
       if (searchQuery.trim()) {
         result = result.filter((p) =>
           p.title.toLowerCase().includes(searchQuery.toLowerCase())
         );
       }

       // 2. Фильтр по основным категориям (Видам) и подкатегориям (через selectedCategories)
       // Если selectedCategories пуст, но activeCategory установлен, используем resolvedCategoryFilters
       const categoriesToFilter = selectedCategories.length > 0 ? selectedCategories : resolvedCategoryFilters;
       if (categoriesToFilter.length > 0) {
         result = result.filter((p) => 
           categoriesToFilter.includes(p.category) || 
           categoriesToFilter.includes(p.subcategory)
         );
       }

       // 3. Фильтр по подкатегориям (Подразделам)
       // Если выбрана конкретная подкатегория (не 'all'), фильтруем по полю subcategory в товаре
       if (resolvedSubcategory && resolvedSubcategory !== 'all') {
         result = result.filter((p) => p.subcategory === resolvedSubcategory);
       }

       // 4. Фильтр по брендам
       if (selectedBrands.length > 0) {
         result = result.filter((p) => selectedBrands.includes(getProductBrand(p)));
       }

       // 5. Фильтр по цене
       if (!(priceRange[0] <= 0 && priceRange[1] >= 1000000)) {
         result = result.filter((p) => {
           const price = p.price || 0;
           return price >= priceRange[0] && price <= priceRange[1];
         });
       }

       // 6. PoE фильтр
       if (poeOnly) {
         result = result.filter((p) => {
           if (p.specs?.poe === 'Да' || p.specs?.poeOut === 'Да' || p.specs?.poe === true) return true;
           return false;
         });
       }

       // 7. Фильтр доступности
       if (availableOnly) {
         result = result.filter((p) => p.is_available === true);
       }

        // 8. Фильтр по разрешению (только для видеонаблюдения)
        if (selectedResolutions.length > 0 && activeCategory === 'videonablyudenie') {
          result = result.filter((p) => selectedResolutions.includes(getProductResolution(p)));
        }

        // 9. Фильтр по типу камеры (только для видеонаблюдения)
        if (selectedCameraTypes.length > 0 && activeCategory === 'videonablyudenie') {
          result = result.filter((p) => selectedCameraTypes.some(type => matchesCameraType(p, type)));
        }

        return result;
     }, [allProducts, searchQuery, selectedCategories, resolvedSubcategory, selectedBrands, poeOnly, availableOnly, priceRange, activeCategory, resolvedCategoryFilters, selectedResolutions, selectedCameraTypes, activeSubcategory]);

  // Heading logic
  const getHeading = () => {
    if (searchQuery.trim()) {
      return `Результаты поиска: «${searchQuery}»`;
    }

    if (selectedCategories.length === 1) {
      const slug = selectedCategories[0];
      const category = categories.find((c) => c.slug === slug);
      if (category) return category.title;

      for (const cat of categories) {
        const sub = cat.subcategories?.find((s) => s.slug === slug);
        if (sub) return sub.name || sub.title || 'Каталог';
      }

      return 'Каталог';
    }

    return 'Каталог товаров';
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-6 mt-8 md:mt-10 mb-10 md:mb-16">
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <h2 className="text-[22px] md:text-[26px] font-bold text-slate-900 tracking-tight">{getHeading()}</h2>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden flex items-center gap-2 text-[14px] text-indigo-600 hover:text-indigo-700 cursor-pointer min-h-[44px] px-4 font-medium"
        >
          <SlidersHorizontal size={16} /> Фильтры
        </button>
      </div>

       {/* Мобильные фильтры */}
       {showMobileFilters && (
         <div className="fixed inset-0 z-50 lg:hidden">
           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
           <div className="absolute right-0 top-0 bottom-0 w-[85%] sm:w-80 max-w-full bg-white overflow-y-auto shadow-2xl">
             <div className="p-5">
               <div className="flex items-center justify-between mb-5">
                 <h3 className="text-[18px] font-bold text-slate-900">Фильтры</h3>
                 <button onClick={() => setShowMobileFilters(false)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                   <X size={20} />
                 </button>
               </div>
               <SidebarFilter
                 selectedCategories={selectedCategories}
                 onCategoryChange={setSelectedCategories}
                 selectedBrands={selectedBrands}
                 onBrandChange={setSelectedBrands}
                 selectedResolutions={selectedResolutions}
                 onResolutionChange={setSelectedResolutions}
                 selectedCameraTypes={selectedCameraTypes}
                 onCameraTypeChange={setSelectedCameraTypes}
                 minPrice={0}
                 maxPrice={1000000}
                 priceRange={priceRange}
                 onPriceChange={(min, max) => setPriceRange([min, max])}
                 poeOnly={poeOnly}
                 onPoeChange={setPoeOnly}
                 availableOnly={availableOnly}
                 onAvailableChange={setAvailableOnly}
                 products={allProducts}
                 categories={categories}
                 category={activeCategory}
                 selectedChannels={selectedChannels}
                 toggleChannel={toggleChannel}
                 onClose={() => setShowMobileFilters(false)}
               />
             </div>
           </div>
         </div>
       )}

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <SidebarFilter
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            selectedBrands={selectedBrands}
            onBrandChange={setSelectedBrands}
            selectedResolutions={selectedResolutions}
            onResolutionChange={setSelectedResolutions}
            selectedCameraTypes={selectedCameraTypes}
            onCameraTypeChange={setSelectedCameraTypes}
            minPrice={0}
            maxPrice={1000000}
            priceRange={priceRange}
            onPriceChange={(min, max) => setPriceRange([min, max])}
            poeOnly={poeOnly}
            onPoeChange={setPoeOnly}
            availableOnly={availableOnly}
            onAvailableChange={setAvailableOnly}
            products={allProducts}
            categories={categories}
            category={activeCategory}
            selectedChannels={selectedChannels}
            toggleChannel={toggleChannel}
          />
        </aside>

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-500 text-[15px] mb-4">Товары не найдены.</p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setSelectedResolutions([]);
                  setSelectedCameraTypes([]);
                  setPriceRange([0, 1000000]);
                  setPoeOnly(false);
                  setAvailableOnly(false);
                }}
                className="text-[14px] text-indigo-600 hover:underline cursor-pointer font-medium"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-slate-400 mb-5 font-medium">
                Найдено товаров: {filtered.length}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {filtered.map((product, idx) => (
                  <ProductCard
                    key={`${product.id}-${idx}`}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}