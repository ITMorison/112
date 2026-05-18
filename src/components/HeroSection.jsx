import CategoryCard from './CategoryCard';

const slides = [
  {
    title: 'Сетевое оборудование для бизнеса',
    subtitle: 'Коммутаторы, маршрутизаторы, точки доступа от ведущих брендов',
    badge: 'ХИТ',
    bgColor: 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950',
  },
];

const serviceCategories = [
  { image: '/polki.png', title: 'Оптические полки и кроссы', slug: 'opticheskie-polki-i-krossy', count: 18 },
  { image: '/vital.jpeg', title: 'Кабели витая пара', slug: 'kabeli-vitaya-para', count: 87 },
  { image: '/conek.png', title: 'Коннекторы', slug: 'konnektory', count: 34 },
  { image: '/modyl.png', title: 'Модули', slug: 'moduli', count: 22 },
  { image: '/ferty.png', title: 'Аксессуары для шкафов', slug: 'aksessuary-dlya-shkafov-i-stoek', count: 65 },
  { image: '/setinstrym.png', title: 'Сетевые инструменты', slug: 'setevye-instrumenty', count: 12 },
];

export default function HeroSection({ onCatalogClick, onCategoryClick, onCategoryFilter }) {
  const handleCatalogClick = () => {
    if (onCatalogClick) {
      onCatalogClick();
    } else {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (slug) => {
    if (onCategoryClick) {
      onCategoryClick(slug);
    }
  };

  const slide = slides[0];

  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-6 mt-4 md:mt-6">
      <div className="w-full flex flex-col gap-5 md:gap-6">
        
        {/* Main Hero Banner - Static */}
        <div className="relative rounded-2xl overflow-hidden h-60 md:h-80 cursor-pointer shadow-lg">
          <div className={`h-full ${slide.bgColor} relative flex flex-col justify-end p-8 md:p-12`}>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
            <div className="absolute top-12 right-40 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/3 translate-y-1/3 -translate-x-1/4" />
            
            {slide.badge && (
              <span className="absolute top-6 left-6 bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide">
                {slide.badge}
              </span>
            )}
            
            <div className="relative z-10 text-white">
              <h1 className="text-[22px] md:text-[32px] lg:text-[38px] font-bold leading-tight max-w-2xl tracking-tight">
                {slide.title}
              </h1>
              <p className="text-[14px] md:text-[16px] opacity-80 mt-3 max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <button 
                onClick={handleCatalogClick} 
                className="mt-6 md:mt-8 bg-white text-slate-900 font-semibold text-[13px] md:text-[14px] px-8 py-3 rounded-full hover:bg-white/90 transition-all duration-200 hover:scale-105"
              >
                Перейти в каталог →
              </button>
            </div>
          </div>
        </div>
        
        {/* Service categories grid (3x2 or 6x1) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {serviceCategories.map((cat) => (
            <CategoryCard key={cat.title} {...cat} onClick={() => handleCategoryClick(cat.slug)} />
          ))}
        </div>
        
      </div>
    </section>
  );
}