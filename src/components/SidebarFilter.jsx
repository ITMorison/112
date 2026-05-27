import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getFilterDefinitions, getProductFilterValues } from './filterUtils';

function FilterSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 pb-2 transition-all duration-200 hover:border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-left transition-all duration-200 hover:bg-slate-50"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {isOpen && <div className="pb-3 space-y-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">{children}</div>}
    </div>
  );
}

export default function SidebarFilter({
  products = [],
  categories = [],
  category = '',
  activeSubcategory = 'all',
  selectedCategories = [],
  onCategoryChange,
  selectedFilters = {},
  onFilterToggle,
  onClose
}) {
  const dynamicFilterGroups = useMemo(() => {
    const definitions = getFilterDefinitions(category, activeSubcategory);

    return definitions
      .map((definition) => {
        const counts = new Map();

        products.forEach((product) => {
          getProductFilterValues(product, definition.key).forEach((value) => {
            counts.set(value, (counts.get(value) || 0) + 1);
          });
        });

        const values = definition.options || [...counts.keys()].sort((a, b) => {
          const countDiff = (counts.get(b) || 0) - (counts.get(a) || 0);
          return countDiff || String(a).localeCompare(String(b), 'ru');
        });

        const options = values
          .map((value) => ({ label: value, value, count: counts.get(value) || 0 }))
          .filter((option) => option.count > 0)
          .slice(0, definition.options ? undefined : 24);

        return options.length > 0 ? { ...definition, options } : null;
      })
      .filter(Boolean);
  }, [activeSubcategory, category, products]);

  const toggleCategory = (slug) => {
    if (!onCategoryChange) return;

    const parentBySubcategory = new Map();
    const childrenByCategory = new Map();

    categories.forEach((cat) => {
      const children = cat.subcategories?.map((sub) => sub.slug) || [];
      childrenByCategory.set(cat.slug, children);
      children.forEach((child) => parentBySubcategory.set(child, cat.slug));
    });

    onCategoryChange((current = []) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }

      if (childrenByCategory.has(slug)) {
        const children = childrenByCategory.get(slug);
        return [...current.filter((item) => !children.includes(item)), slug];
      }

      const parent = parentBySubcategory.get(slug);
      return [...current.filter((item) => item !== parent), slug];
    });
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b border-slate-100 md:hidden">
          <span className="font-bold text-slate-900">Фильтры</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-0 custom-scrollbar">
        {categories.length > 0 && (
          <FilterSection title="Категории" defaultOpen={true}>
            <div className="space-y-1">
              {categories.map((cat) => (
                <div key={cat.slug} className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer py-1.5 px-2 hover:bg-indigo-50 rounded-lg transition-colors group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={() => toggleCategory(cat.slug)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[13px] font-medium text-slate-700 group-hover:text-indigo-600 transition-colors flex-1">
                      {cat.title}
                    </span>
                  </label>

                  {cat.subcategories?.map((sub) => (
                    <label key={sub.slug} className="flex items-center gap-2 cursor-pointer py-1 ml-6 px-2 hover:bg-slate-50 rounded-lg transition-colors group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(sub.slug)}
                        onChange={() => toggleCategory(sub.slug)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
                      />
                      <span className="text-[12px] text-slate-500 group-hover:text-slate-900 flex-1">
                        - {sub.name || sub.title}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                        {products.filter((product) => product.subcategory === sub.slug).length}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {dynamicFilterGroups.map((group) => (
          <FilterSection key={group.key} title={group.title} defaultOpen={group.key === 'channels'}>
            <div className="space-y-1">
              {group.options.map((option) => {
                const checked = (selectedFilters[group.key] || []).includes(option.value);

                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer py-1.5 px-2 hover:bg-slate-50 rounded-lg transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onFilterToggle?.(group.key, option.value)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                    />
                    <span className="text-[13px] text-slate-600 group-hover:text-slate-900 flex-1">
                      {group.key === 'channels' ? `${option.label} ${option.label === '4' ? 'канала' : 'каналов'}` : option.label}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                      {option.count}
                    </span>
                  </label>
                );
              })}
            </div>
          </FilterSection>
        ))}
      </div>

      {onClose && (
        <div className="p-4 border-t border-slate-100 md:hidden">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-all"
          >
            Применить
          </button>
        </div>
      )}
    </div>
  );
}
