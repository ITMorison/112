import React from 'react';
import { Truck, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Delivery = () => {
  return (
    <div className="bg-white min-h-screen py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="mb-16">
          <h1 className="text-4xl font-light tracking-widest text-gray-900 uppercase mb-4">
            Доставка
          </h1>
          <div className="w-12 h-0.5 bg-blue-600"></div>
        </div>

        <div className="space-y-12">
          {/* Описание */}
          <p className="text-[16px] text-gray-600 leading-relaxed">
            Мы сотрудничаем с проверенными транспортными компаниями, чтобы обеспечить быструю и надёжную доставку товаров по всей Казахстану. Стоимость и сроки рассчитываются индивидуально в зависимости от вашего местоположения и объёма заказа.
          </p>

          {/* Компании */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-sm">
              <div className="flex items-center gap-4 mb-4">
                <Truck size={32} className="text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Avis</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Международная транспортная компания с широкой сетью доставки. Обеспечивает быструю доставку в крупные города и регионы. Точные сроки и стоимость уточняйте у менеджера.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-sm">
              <div className="flex items-center gap-4 mb-4">
                <Truck size={32} className="text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Jet Logistic</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Национальный перевозчик с высоким качеством сервиса. Специализируется на доставке технического оборудования. Предоставляет отслеживание груза в режиме реального времени.
              </p>
            </div>
          </div>

          {/* Процесс */}
          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Как происходит доставка</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="font-semibold text-gray-800">Оформление заказа</p>
                  <p className="text-gray-600">После оформления заказа наш менеджер свяжется с вами для уточнения деталей.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="font-semibold text-gray-800">Подготовка к отправке</p>
                  <p className="text-gray-600">Мы упаковываем товар и передаём его выбранной транспортной компании.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="font-semibold text-gray-800">Доставка</p>
                  <p className="text-gray-600">Вы получаете уведомление о прибытии заказа и принимаете его.</p>
                </div>
              </li>
            </ol>
          </div>

{/* Контакты для уточнения */}
            <div className="bg-blue-50 p-6 rounded-sm flex items-start gap-4">
              <Clock size={24} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Уточните детали у менеджера</p>
                <p className="text-gray-600">Точные сроки, стоимость и доступные способы доставки могут меняться. Наши менеджеры всегда готовы ответить на ваши вопросы.</p>
                <div className="flex flex-col gap-1 mt-3">
                  <a href="tel:+77766300044" className="text-blue-600 font-semibold hover:underline">+7 (776) 630-00-44</a>
                  <a href="mailto:info@servernet.kz" className="text-blue-600 font-semibold hover:underline">info@servernet.kz</a>
                </div>
              </div>
            </div>
           
            {/* Навигация */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="space-y-4">
                <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Навигация</p>
                <div className="flex flex-col space-y-2">
                  <Link to="/contacts" className="block text-gray-600 hover:text-blue-600 transition-colors">
                    Контакты
                  </Link>
                  <Link to="/payment" className="block text-gray-600 hover:text-blue-600 transition-colors">
                    Оплата
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
