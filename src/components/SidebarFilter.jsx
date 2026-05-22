import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';

function FilterSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 pb-2">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full py-3 text-left">
        <span className="text-[13px] font-bold text-slate-900 uppercase">{title}</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {isOpen && <div className="pb-3 space-y-2.5">{children}</div>}
    </div>
  );
}

export default function SidebarFilter({ 
  selectedCategories, 
  onCategoryChange, 
  selectedBrands = [], 
  onBrandChange,
  minPrice = 0,
  maxPrice = 1000000,
  onPriceChange,
  poeOnly = false,
  onPoeChange,
  availableOnly = false,
  onAvailableChange,
  products = [], 
  categories = [] 
}) {
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const toggleCategory = (slug) => {
    const newSelected = selectedCategories.includes(slug)
      ? selectedCategories.filter(c => c !== slug)
      : [...selectedCategories, slug];
    onCategoryChange(newSelected);
  };

  const toggleBrand = (brand) => {
    const newSelected = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    onBrandChange(newSelected);
  };

  const handlePriceChange = (e, isMax = false) => {
    const val = parseFloat(e.target.value);
    let newRange;
    if (isMax) {
      newRange = [priceRange[0], val];
    } else {
      newRange = [val, priceRange[1]];
    }
    setPriceRange(newRange);
    onPriceChange?.(newRange[0], newRange[1]);
  };

  const handleResetFilters = () => {
    onCategoryChange([]);
    onBrandChange([]);
    setPriceRange([minPrice, maxPrice]);
    onPriceChange?.(minPrice, maxPrice);
    onPoeChange?.(false);
    onAvailableChange?.(false);
  };

  const uniqueBrands = useMemo(() => {
    const brands = new Set();
    products.forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).filter(b => b && b.trim()).sort();
  }, [products]);

  const priceStats = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000000 };
    const prices = products.map(p => p.price || 0).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 1000000 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  const poeCount = useMemo(() => {
    return products.filter(p => p.specs?.poe === 'Да' || p.specs?.poeOut === 'Да' || p.specs?.poe === true).length;
  }, [products]);

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || 
                          poeOnly || availableOnly || priceRange[0] > minPrice || priceRange[1] < maxPrice;

  return (
    <div className="bg-white rounded-2xl p-5 sticky top-4 shadow-sm border border-slate-50">
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <h2 className="text-[15px] font-bold">Фильтры</h2>
        {hasActiveFilters && (
          <button onClick={handleResetFilters} className="text-[11px] text-indigo-500 font-bold hover:text-indigo-600">
            <X size={12} className="inline mr-1" /> Сбросить
          </button>
        )}
      </div>

      {/* Фильтр по цене */}
      {products.length > 0 && (
        <FilterSection title="Цена" defaultOpen={true}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                min={priceStats.min}
                max={priceStats.max}
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, false)}
                placeholder="От"
                className="w-1/2 px-2 py-1.5 border border-slate-200 rounded text-[12px]"
              />
              <input
                type="number"
                min={priceStats.min}
                max={priceStats.max}
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, true)}
                placeholder="До"
                className="w-1/2 px-2 py-1.5 border border-slate-200 rounded text-[12px]"
              />
            </div>
            <input
              type="range"
              min={priceStats.min}
              max={priceStats.max}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, false)}
              className="w-full"
            />
            <input
              type="range"
              min={priceStats.min}
              max={priceStats.max}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, true)}
              className="w-full"
            />
            <p className="text-[11px] text-slate-500 text-center">
              {priceRange[0].toLocaleString()} — {priceRange[1].toLocaleString()} ₸
            </p>
          </div>
        </FilterSection>
      )}

      {/* Фильтр по брендам */}
      {uniqueBrands.length > 0 && (
        <FilterSection title="Бренд" defaultOpen={false}>
          <div className="space-y-2">
            {uniqueBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded text-indigo-600"
                />
                <span className="text-[12px] text-slate-600">{brand}</span>
                <span className="ml-auto text-[10px] text-slate-400">
                  ({products.filter(p => p.brand === brand).length})
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Фильтр PoE */}
      {poeCount > 0 && (
        <FilterSection title="PoE" defaultOpen={false}>
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={poeOnly}
              onChange={() => onPoeChange?.(!poeOnly)}
              className="rounded text-indigo-600"
            />
            <span className="text-[12px] text-slate-600">Только с PoE</span>
            <span className="ml-auto text-[10px] text-slate-400">
              ({poeCount})
            </span>
          </label>
        </FilterSection>
      )}

      {/* Фильтр доступности */}
      <FilterSection title="Доступность" defaultOpen={false}>
        <label className="flex items-center gap-2 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={() => onAvailableChange?.(!availableOnly)}
            className="rounded text-indigo-600"
          />
          <span className="text-[12px] text-slate-600">В наличии</span>
          <span className="ml-auto text-[10px] text-slate-400">
            ({products.filter(p => p.is_available).length})
          </span>
        </label>
      </FilterSection>

      {/* Категории */}
      {categories.length > 0 && (
        <FilterSection title="Категории" defaultOpen={false}>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id}>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-[12px] font-medium text-slate-700">{cat.title}</span>
                </label>
                {cat.subcategories && cat.subcategories.map((sub) => (
                  <label key={sub.slug} className="flex items-center gap-2 cursor-pointer py-1 ml-5">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(sub.slug)}
                      onChange={() => toggleCategory(sub.slug)}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-[12px] text-slate-600">— {sub.name}</span>
                    <span className="ml-auto text-[10px] text-slate-400">
                      ({products.filter(p => p.subcategory === sub.slug).length})
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
}