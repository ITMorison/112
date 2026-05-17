import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MEGA_MENU_DATA as _MEGA_MENU_DATA } from '../data';

const MEGA_MENU_DATA = Array.isArray(_MEGA_MENU_DATA) ? _MEGA_MENU_DATA : [];

export default function MegaMenu({ isOpen, onClose, onCategoryFilter }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSubcategoryClick = (slug) => {
    onCategoryFilter && onCategoryFilter(slug);
    onClose();
  };

  return (
    <>
      {/* Dark backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Mega Menu panel */}
      <div
        ref={menuRef}
        className={`absolute left-0 right-0 bg-white z-50 shadow-2xl border-t border-slate-100
          transition-all duration-300 origin-top
          ${isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-3 pointer-events-none'}`}
      >
        <div className="max-w-[1240px] mx-auto px-8 py-8">
          {/* Grid: 5 columns for categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-8">
            {MEGA_MENU_DATA.map((category) => (
            <div key={category.id} className="min-w-0">
{/* Category header - bold */}
                  <Link
                    to="/catalog"
                    onClick={() => { 
                      handleSubcategoryClick(category.slug); 
                    }}
                    className="group flex items-center gap-3 mb-3 text-left w-full"
                  >
                   <span className="text-[15px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                     {category.title}
                   </span>
                   {category.subcategories && category.subcategories.length > 0 && (
                     <span className="text-[11px] text-slate-400 group-hover:text-indigo-500 transition-colors ml-auto">
                       Все →
                     </span>
                   )}
                 </Link>

                {/* Divider & Subcategory list - only if subcategories exist */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <>
                    <div className="h-px bg-slate-100 mb-3" />
<ul className="space-y-1.5">
                        {(category.subcategories || []).map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to="/catalog"
                              onClick={() => { 
                                handleSubcategoryClick(sub.slug);
                              }}
                              className="text-[13px] text-slate-500 hover:text-indigo-600 transition-colors text-left w-full py-0.5 hover:translate-x-1 transform duration-150"
                            >
                              {sub.name || sub.title}
                            </Link>
                          </li>
                        ))}
                     </ul>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Bottom promo strip */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-indigo-100 transition-colors group"
              onClick={onClose}>
              <span className="text-2xl">🚀</span>
              <div>
                <p className="text-[13px] font-semibold text-indigo-800">Новинки</p>
                <p className="text-[11px] text-indigo-500">Свежие поступления</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-rose-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-rose-100 transition-colors group"
              onClick={onClose}>
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-[13px] font-semibold text-rose-700">Акции и скидки</p>
                <p className="text-[11px] text-rose-400">До −40% на популярное</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-emerald-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-emerald-100 transition-colors group"
              onClick={onClose}>
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-[13px] font-semibold text-emerald-800">Хиты продаж</p>
                <p className="text-[11px] text-emerald-500">Самые популярные товары</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
