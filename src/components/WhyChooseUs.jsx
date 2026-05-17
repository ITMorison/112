import { CheckCircle, Truck, Headphones, Shield, RefreshCw, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: Truck,
    title: 'Быстрая доставка',
    description: 'Доставка по Казахстану от 1 дня',
    link: '/delivery'
  },
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: 'Официальная гарантия на все товары от производителей',
  },
  {
    icon: Headphones,
    title: 'Техническая поддержка',
    description: 'Консультации по подбору и настройке оборудования',
  },
  {
    icon: Shield,
    title: 'Услуги монтажа',
    description: 'Профессиональный монтаж оборудования любой сложности с гарантией качества и соблюдением сроков'
  },
  {
    icon: CreditCard,
    title: 'Удобная оплата',
    description: 'Наличный и безналичный расчёт, оплата картой',
    link: '/payment'
  },
  {
    icon: CheckCircle,
    title: 'Сертифицированные товары',
    description: 'Все товары сертифицированы для продажи в РК',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-[22px] md:text-[26px] font-bold text-gray-900 mb-3">
            Почему выбирают нас
          </h2>
          <p className="text-[14px] md:text-[15px] text-gray-500 max-w-xl mx-auto">
            Мы предлагаем комплексные решения для построения современной телекоммуникационной инфраструктуры
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {benefits.map((benefit) => {
            const BenefitLink = benefit.link ? Link : 'div';
            const linkProps = benefit.link ? { to: benefit.link } : {};
            
            return (
              <BenefitLink
                key={benefit.title}
                {...linkProps}
                className="block p-5 md:p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <benefit.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-[16px] md:text-[17px] font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-gray-500 leading-relaxed">
                  {benefit.description}
                </p>
              </BenefitLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
