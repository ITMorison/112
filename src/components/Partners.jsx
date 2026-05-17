import { ChevronRight } from 'lucide-react';

const brands = [
  { name: 'SHIP', logo: '/brands/ship.svg' },
  { name: 'Cablofil', logo: '/brands/cablofil.svg' },
  { name: 'DKC', logo: '/brands/dkc.svg' },
  { name: 'IEK', logo: '/brands/iek.svg' },
  { name: 'Schneider Electric', logo: '/brands/schneider.svg' },
  { name: 'Legrand', logo: '/brands/legrand.svg' },
  { name: 'ABB', logo: '/brands/abb.svg' },
  { name: 'Panduit', logo: '/brands/panduit.svg' },
];

const cities = [
  { name: 'Алматы', x: 35, y: 55 },
  { name: 'Астана', x: 55, y: 25 },
  { name: 'Петропавловск', x: 65, y: 18 },
  { name: 'Шымкент', x: 25, y: 65 },
  { name: 'Караганда', x: 50, y: 40 },
  { name: 'Актобе', x: 35, y: 28 },
];

export default function Partners() {
  return (
    <>
      <section className="py-10 md:py-12 bg-gray-50">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 mb-2">
              Бренды-партнёры
            </h2>
            <p className="text-[13px] md:text-[14px] text-gray-500">
              Мы являемся официальными дистрибьюторами ведущих мировых производителей
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="w-28 h-16 md:w-36 md:h-20 bg-white rounded-xl border border-gray-200 flex items-center justify-center p-3 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <span className="text-[11px] md:text-[12px] font-bold text-gray-400 text-center">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 text-[13px] md:text-[14px] text-blue-700 font-semibold hover:underline">
              Все бренды <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-white border-t border-gray-100">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 mb-2">
              Доставка по Казахстану
            </h2>
            <p className="text-[13px] md:text-[14px] text-gray-500">
              Мы осуществляем доставку во все регионы Казахстана
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <svg viewBox="0 0 100 60" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="kzGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d="M10,15 L25,8 L45,5 L70,8 L85,15 L90,25 L88,35 L80,45 L65,50 L45,52 L25,50 L10,45 L5,35 L8,25 Z"
                fill="url(#kzGradient)"
                stroke="#3b82f6"
                strokeWidth="0.5"
                className="opacity-80"
              />
              {cities.map((city) => (
                <g key={city.name}>
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="1.5"
                    fill="#3b82f6"
                    className="animate-pulse"
                  />
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="3"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="0.3"
                    className="opacity-50"
                  />
                </g>
              ))}
            </svg>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-4">
              {cities.map((city) => (
                <span
                  key={city.name}
                  className="text-[11px] md:text-[12px] text-gray-600 bg-gray-100 px-2 py-1 rounded"
                >
                  {city.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
