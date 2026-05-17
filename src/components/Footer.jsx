import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, X } from 'lucide-react';
import { PRODUCTS } from '../data';

export default function Footer({ categories = [], contactInfo = {}, onCategoryFilter, activeCategory }) {
  const handleCatalogClick = (slug) => {
    if (onCategoryFilter) {
      onCategoryFilter(slug);
    }
  };

  // Count products per top-level category (excluding radio-equipment)
  const getCount = (slug) => {
    if (slug === 'radio-equipment') return 0;
    return PRODUCTS.filter(p => p.category === slug).length;
  };

  return (
    <footer className="bg-slate-900 text-white mt-auto">


      {/* Main footer content */}
      <div className="max-w-[1240px] mx-auto px-4 py-8 md:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 border-t border-slate-800">
        <div>
          <Link to="/" className="flex items-center gap-1 mb-4">
            <span className="text-lg md:text-xl font-bold text-white">Server</span>
            <span className="text-lg md:text-xl font-bold text-indigo-400">Net</span>
          </Link>
          <p className="text-[12px] md:text-[13px] text-slate-400 leading-relaxed">
            Профессиональные сетевые решения для бизнеса и дома. Официальный дистрибьютор ведущих брендов в Казахстане.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-[13px] md:text-[14px] mb-4 text-white">Покупателям</h3>
          <div className="space-y-1.5">
            <Link to="/payment" className="block text-[11px] md:text-[13px] text-slate-400 hover:text-white transition-colors">
              Способы оплаты
            </Link>
            <Link to="/delivery" className="block text-[11px] md:text-[13px] text-slate-400 hover:text-white transition-colors">
              Доставка
            </Link>
            <a href="#returns" className="block text-[11px] md:text-[13px] text-slate-400 hover:text-white transition-colors">
              Возврат товара
            </a>
            <a href="#warranty" className="block text-[11px] md:text-[13px] text-slate-400 hover:text-white transition-colors">
              Гарантия
            </a>
            <a href="#faq" className="block text-[11px] md:text-[13px] text-slate-400 hover:text-white transition-colors">
              FAQ
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[13px] md:text-[14px] mb-4 text-white">Контакты</h3>
          <div className="space-y-2">
            <p className="flex items-start gap-2 text-[12px] md:text-[13px] text-slate-400">
              <MapPin size={14} className="flex-shrink-0 mt-0.5 text-indigo-400" />
              {contactInfo.address}
            </p>
            <p className="flex items-center gap-2 text-[12px] md:text-[13px] text-slate-400">
              <Phone size={14} className="flex-shrink-0 text-indigo-400" />
              <a href={`tel:${contactInfo.phone1}`} className="hover:underline text-[12px] md:text-[13px] text-slate-400">
                {contactInfo.phone1}
              </a>
            </p>
            <p className="flex items-center gap-2 text-[12px] md:text-[13px] text-slate-400">
              <Phone size={14} className="flex-shrink-0 text-indigo-400" />
              <a href={`tel:${contactInfo.phone2}`} className="hover:underline text-[12px] md:text-[13px] text-slate-400">
                {contactInfo.phone2}
              </a>
            </p>
            <p className="flex items-center gap-2 text-[12px] md:text-[13px] text-slate-400">
              <Mail size={14} className="flex-shrink-0 text-indigo-400" />
              <a href={`mailto:${contactInfo.email}`} className="hover:underline text-[12px] md:text-[13px] text-slate-400">
                {contactInfo.email}
              </a>
            </p>
            <p className="flex items-center gap-2 text-[11px] md:text-[12px] text-slate-500 mt-2">
              <Clock size={14} className="flex-shrink-0" />
              Пн–Пт: 9:00–18:00
            </p>
          </div>
        </div>

        <div>
          {/* Empty column for 4-col layout */}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1240px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] md:text-[12px] text-slate-500">© 2026 ServerNet. Все права защищены.</p>
          <p className="text-[11px] md:text-[12px] text-slate-500">{contactInfo.address}</p>
        </div>
      </div>
    </footer>
  );
}
