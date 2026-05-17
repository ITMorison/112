import React from 'react';
import { CreditCard, AlertCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../data';

const Payment = () => {
  return (
    <div className="bg-white min-h-screen py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="mb-16">
          <h1 className="text-4xl font-light tracking-widest text-gray-900 uppercase mb-4">
            Оплата
          </h1>
          <div className="w-12 h-0.5 bg-blue-600"></div>
        </div>

        <div className="space-y-12">
          {/* Внимание */}
          <div className="bg-amber-50 p-6 rounded-sm flex items-start gap-4">
            <AlertCircle size={24} className="text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">Способы оплаты уточняйте у менеджера</p>
              <p className="text-gray-600">Перечень доступных способов оплаты может меняться в зависимости от товара, акций и текущих условий работы. Наши менеджеры предоставят актуальную информацию при оформлении заказа.</p>
            </div>
          </div>

          {/* Описание */}
          <p className="text-[16px] text-gray-600 leading-relaxed">
            Мы стремимся сделать процесс покупки максимально удобным. Для этого мы предлагаем несколько вариантов оплаты, которые согласовываются с менеджером индивидуально для каждого заказа.
          </p>

          {/* Способы (примерные) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 p-6 rounded-sm hover:border-blue-600 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard size={24} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Безналичный расчёт</h3>
              </div>
              <p className="text-gray-600 text-sm">Перечисление на расчётный счёт. Подходит для юридических лиц.</p>
            </div>

            <div className="border border-slate-200 p-6 rounded-sm hover:border-blue-600 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard size={24} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Онлайн-оплата</h3>
              </div>
              <p className="text-gray-600 text-sm">Оплата через сайт с помощью банковской карты.</p>
            </div>

            <div className="border border-slate-200 p-6 rounded-sm hover:border-blue-600 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard size={24} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Наличный расчёт</h3>
              </div>
              <p className="text-gray-600 text-sm">Оплата наличными при получении в нашем офисе или курьеру.</p>
            </div>

            <div className="border border-slate-200 p-6 rounded-sm hover:border-blue-600 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard size={24} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Удаленная опалата</h3>
              </div>
              <p className="text-gray-600 text-sm">Есть возможность выставить опалату через Kaspi удаленно.</p>
            </div>
          </div>

           {/* Связь */}
           <div className="text-center text-gray-600">
             <p className="mb-2">Для уточнения деталей и выбора удобного способа свяжитесь с нами:</p>
             <div className="flex justify-center gap-6 text-blue-600 font-semibold">
               <a href={`tel:${CONTACT_INFO.phone1}`} className="hover:underline">{CONTACT_INFO.phone1}</a>
               <a href={`mailto:${CONTACT_INFO.email}`} className="hover:underline">{CONTACT_INFO.email}</a>
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
                  <Link to="/delivery" className="block text-gray-600 hover:text-blue-600 transition-colors">
                    Доставка
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
