import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram } from 'lucide-react';
import { CONTACT_INFO } from '../data';

const formatTel = (phone) => phone?.replace(/[^0-9+]/g, '');

const Contacts = ({ contactInfo }) => {
  const info = contactInfo || CONTACT_INFO;

  return (
    <div className="bg-white min-h-screen py-12 md:py-20 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-10 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-light tracking-widest text-gray-900 uppercase mb-4">
            Контакты
          </h1>
          <div className="w-12 h-0.5 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          {/* Левая колонка: Инфо */}
          <div className="space-y-8 md:space-y-12 min-w-0">
            <div>
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-6">Телефоны</p>
              <div className="space-y-4">
                <a href={`tel:${formatTel(info.phone1)}`} className="block text-2xl sm:text-3xl font-normal text-gray-800 hover:text-blue-600 transition-colors">
                  {info.phone1}
                </a>
                {info.phone2 && (
                  <a href={`tel:${formatTel(info.phone2)}`} className="block text-2xl sm:text-3xl font-normal text-gray-800 hover:text-blue-600 transition-colors">
                    {info.phone2}
                  </a>
                )}
              </div>
            </div>

            <div>
               <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Электронная почта</p>
               <a href={`mailto:${info.email}`} className="text-lg sm:text-xl text-gray-600 hover:border-b border-gray-400 break-all">
                 {info.email}
               </a>
             </div>
             
             <div className="mb-8">
               <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Навигация</p>
               <div className="space-y-2">
                 <a href="/delivery" className="block text-gray-600 hover:text-blue-600 transition-colors">
                   Доставка
                 </a>
                 <a href="/payment" className="block text-gray-600 hover:text-blue-600 transition-colors">
                   Оплата
                 </a>
               </div>
             </div>

            <div>
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Адрес</p>
              <p className="text-lg sm:text-xl text-gray-600 flex items-start gap-2 whitespace-nowrap">
                <MapPin size={20} className="text-gray-400" />
                {info.address}
              </p>
            </div>

            <div className="flex gap-6 pt-6">
              <a href="#" className="p-3 border border-gray-100 rounded-full hover:bg-gray-50 transition-all">
                <MessageCircle size={24} className="text-green-500" />
              </a>
              <a href="#" className="p-3 border border-gray-100 rounded-full hover:bg-gray-50 transition-all">
                <Instagram size={24} className="text-pink-500" />
              </a>
            </div>
          </div>

          {/* Правая колонка: Форма */}
          <div className="bg-gray-50 p-5 sm:p-8 md:p-10 rounded-sm shadow-sm">
            <h2 className="text-xl font-light mb-8 italic text-gray-700">Оставить заявку</h2>
            <form className="space-y-6">
              <input 
                type="text" 
                placeholder="Ваше имя" 
                className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-blue-600 transition-colors"
              />
              <input 
                type="email" 
                placeholder="Email или телефон" 
                className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-blue-600 transition-colors"
              />
              <textarea 
                placeholder="Ваш вопрос" 
                rows="4"
                className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-blue-600 transition-colors resize-none"
              ></textarea>
              <button type="submit" className="mt-8 md:mt-10 w-full sm:w-auto px-8 py-3 bg-gray-900 text-white text-xs tracking-widest uppercase hover:bg-blue-600 transition-all">
                Отправить запрос
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
