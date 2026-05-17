import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

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

export default function SidebarFilter({ selectedCategories, onCategoryChange, products, categories = [] }) {
  const toggleCategory = (slug) => {
    const newSelected = selectedCategories.includes(slug)
      ? selectedCategories.filter(c => c !== slug)
      : [...selectedCategories, slug];
    onCategoryChange(newSelected);
  };

  const getAllSubcategories = (cats) => {
    const result = [];
    cats.forEach(cat => {
      if (cat.subcategories) {
        cat.subcategories.forEach(sub => {
          result.push({ ...sub, parentSlug: cat.slug, parentTitle: cat.title });
          if (sub.subcategories) {
            sub.subcategories.forEach(sub2 => {
              result.push({ ...sub2, parentSlug: sub.slug, parentTitle: sub.name });
            });
          }
        });
      }
    });
    return result;
  };

  const allSubcategories = getAllSubcategories(categories);

  return (
    <div className="bg-white rounded-2xl p-5 sticky top-4 shadow-sm border border-slate-50">
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <h2 className="text-[15px] font-bold">Фильтры</h2>
        {selectedCategories.length > 0 && (
          <button onClick={() => onCategoryChange([])} className="text-[11px] text-indigo-500 font-bold">
            <X size={12} className="inline" /> Сбросить
          </button>
        )}
      </div>

      {categories.map((cat) => (
        <FilterSection key={cat.id} title={cat.title} defaultOpen={true}>
          {cat.subcategories && cat.subcategories.map((sub) => (
            <label key={sub.slug} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={selectedCategories.includes(sub.slug)}
                onChange={() => toggleCategory(sub.slug)}
                className="rounded text-indigo-600"
              />
              <span className="text-[12px] text-slate-600">{sub.name}</span>
              <span className="ml-auto text-[10px] text-slate-400">
                ({products.filter(p => p.subcategory === sub.slug || p.category === sub.slug || p.category === cat.slug).length})
              </span>
            </label>
          ))}
        </FilterSection>
      ))}
    </div>
  );
}