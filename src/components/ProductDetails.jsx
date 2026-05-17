import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { PRODUCTS } from '../data';

export default function ProductDetails({ onAddToCart }) {
  const { articul } = useParams();
  const navigate = useNavigate();

  const product = PRODUCTS.find((p) => p.articul === articul);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articul]);

  if (!product) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-16">
        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Назад в каталог</span>
        </button>
        <div className="text-center py-20">
          <h2 className="text-[24px] font-bold text-slate-800 mb-4">Товар не найден</h2>
          <p className="text-slate-500">Товар с артикулом {articul} не существует.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return price.toLocaleString('ru-RU');
  };

  const specs = product.specs || {};

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-8 md:py-10">
      <button
        onClick={() => navigate('/catalog')}
        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 md:mb-8 cursor-pointer transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="font-medium text-[14px]">Назад в каталог</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
<div className="aspect-square flex items-center justify-center bg-slate-50 p-8">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-[12px] text-slate-400 font-medium tracking-wide">
              Арт. {product.articul}
            </span>
          </div>

          <h1 className="text-[22px] md:text-[26px] font-bold text-slate-900 leading-tight mb-4">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-6">
            {product.is_available ? (
              <span className="flex items-center gap-1.5 text-emerald-600 text-[13px] font-medium">
                <CheckCircle size={16} />
                В наличии(необходимо уточнять)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-red-500 text-[13px] font-medium">
                <XCircle size={16} />
                Нет в наличии(необходимо уточнять)
              </span>
            )}
          </div>

          <div className="text-[32px] md:text-[38px] font-bold text-slate-900 mb-6 tracking-tight">
            {formatPrice(product.price)} ₸
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.is_available}
            className={`
              flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-semibold text-[14px] md:text-[15px] transition-all duration-200 cursor-pointer w-full md:w-auto whitespace-nowrap
              ${product.is_available 
                ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white shadow-lg shadow-indigo-600/25' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
          >
            <ShoppingCart size={20} />
            {product.is_available ? 'Добавить в корзину' : 'Товар недоступен'}
          </button>

          {Object.keys(specs).length > 0 && (
            <div className="mt-10">
              <h3 className="text-[16px] font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                Характеристики
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-[13px] text-slate-500 font-medium">
                      {key === 'accounts' ? 'Аккаунты' :
                       key === 'poe' ? 'PoE' :
                       key === 'display' ? 'Дисплей' :
                       key === 'ports' ? 'Порты' :
                       key === 'speed' ? 'Скорость' :
                       key === 'wifi' ? 'Wi-Fi' :
                       key === 'poeOut' ? 'PoE out' :
                       key === 'resolution' ? 'Разрешение' :
                       key === 'nightVision' ? 'Ночное видение' :
                       key === 'colorVu' ? 'ColorVu' :
                       key === 'channels' ? 'Каналы' :
                       key === 'maxRes' ? 'Макс. разрешение' :
                       key === 'power' ? 'Мощность' :
                       key === 'outlets' ? 'Розетки' :
                       key === 'type' ? 'Тип' :
                       key}
                    </span>
                    <span className="text-[13px] text-slate-800 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.category_raw && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-[13px] text-slate-400">
                Категория: <span className="text-slate-600 font-medium">{product.category_raw}</span>
              </span>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-[18px] font-bold text-slate-900 mb-4">
              Описание
            </h3>
            <p className="text-[14px] text-slate-600 leading-relaxed">
              {product.description || `Телекоммуникационный товар ${product.title} (арт. ${product.articul}) из категории "${product.category_raw}". Качественное оборудование для построения и обслуживания сетевой инфраструктуры.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
