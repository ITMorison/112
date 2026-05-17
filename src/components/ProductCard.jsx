import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const { title, price, articul, specs, category, image } = product;
  const navigate = useNavigate();

  const handleProductClick = (e) => {
    if (e.target.closest('button')) return;
    navigate(`/product/${articul}`);
  };

  return (
    <div className="bg-white border-0 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 group">
      {/* Image area */}
<div
         className="relative bg-slate-50 flex items-center justify-center h-40 md:h-56 p-3 md:p-4 cursor-pointer overflow-hidden"
         onClick={handleProductClick}
       >
         <img
           src={image}
           alt={title}
           loading="lazy"
           className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
         />
       </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Articul */}
        <p className="text-[11px] text-slate-400 font-medium mb-1.5 tracking-wide">Арт. {articul}</p>

        {/* Title */}
        <h3 
          className="text-[13px] md:text-[14px] font-medium text-slate-800 leading-relaxed line-clamp-2 flex-1 cursor-pointer hover:text-indigo-600 transition-colors mb-3"
          onClick={handleProductClick}
        >
          {title}
        </h3>

        {/* Specs grid */}
        {specs && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-4">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">
                  {key === 'accounts' ? 'Аккаунты' :
                   key === 'poe' ? 'PoE' :
                   key === 'display' ? 'Дисплей' :
                   key === 'ports' ? 'Порты' :
                   key === 'speed' ? 'Скорость' :
                   key === 'wifi' ? 'Wi-Fi' :
                   key === 'poeOut' ? 'PoE out' :
                   key === 'resolution' ? 'Разрешение' :
                   key === 'nightVision' ? 'Ночь' :
                   key === 'colorVu' ? 'ColorVu' :
                   key === 'channels' ? 'Каналы' :
                   key === 'maxRes' ? 'Макс.разр.' :
                   key === 'power' ? 'Мощность' :
                   key === 'outlets' ? 'Розетки' :
                   key === 'type' ? 'Тип' :
                   key === 'power' ? 'Мощность' :
                   key}:
                </span>
                <span className="text-[10px] text-slate-600 font-semibold">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="mt-auto flex items-end justify-between pt-2 border-t border-slate-100">
          <div>
            <p className="text-[16px] md:text-[18px] font-bold text-slate-900 tracking-tight">
              {(price ?? 0).toLocaleString('ru-RU')} ₸
            </p>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl p-2.5 md:p-3 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px] hover:scale-105"
            title="Добавить в корзину"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
