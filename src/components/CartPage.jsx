import { useState } from 'react';
import { Minus, Plus, ShoppingBag, ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И КОМПОНЕНТЫ (ВЫНЕСЕНЫ ИЗ ОСНОВНОГО ЦИКЛА) ---

const getCartItemImage = (item) => {
  if (!item.image || item.image.includes('market-telecom.kz')) {
    return `/images/${item.articul}.jpg`;
  }
  return item.image;
};

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₸';
}

const PLACEHOLDER = (
  <div className="w-full h-full flex items-center justify-center bg-slate-50">
    <ShoppingBag size={24} className="text-slate-200" />
  </div>
);

// Компонент секции
const Section = ({ title, children }) => (
  <div className="bg-white border-0 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
    <h2 className="text-[18px] md:text-[20px] font-bold text-slate-900 mb-5">{title}</h2>
    {children}
  </div>
);

// Компонент выбора (Radio)
function RadioOption({ name, value, checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl border border-transparent hover:bg-slate-50 transition-colors">
      <div className="mt-0.5 flex-shrink-0">
        <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="hidden" />
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${checked ? 'border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
        </div>
      </div>
      <div>
        <p className={`text-[14px] font-semibold transition-colors ${checked ? 'text-indigo-600' : 'text-slate-700'}`}>{label}</p>
        {description && <p className="text-[12px] text-slate-400 mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

// Компонент поля ввода (ТЕПЕРЬ НЕ ТЕРЯЕТ ФОКУС)
const Field = ({ name, placeholder, type = 'text', half = false, required = false, form, errors, onChange }) => (
  <div className={half ? 'flex-1 min-w-0' : 'w-full'}>
    <input
      name={name}
      type={type}
      value={form[name] || ''}
      onChange={onChange}
      placeholder={placeholder + (required ? ' *' : '')}
      maxLength={name === 'phone' ? 18 : undefined}
      className={`w-full border rounded-xl px-4 py-3 text-[14px] focus:outline-none transition-all placeholder-slate-400
        ${errors[name] 
          ? 'border-red-300 focus:border-red-500 bg-red-50' 
          : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white hover:border-slate-300'}`}
    />
    {errors[name] && <p className="text-[12px] text-red-500 mt-1">{errors[name]}</p>}
  </div>
);

// --- ОСНОВНОЙ КОМПОНЕНТ КОРЗИНЫ ---

export default function CartPage({ cartItems, onUpdateQty, onRemove, onClear, onBack }) {
  const [step, setStep] = useState('cart'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    comment: ''
  });

  const [errors, setErrors] = useState({});
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('kaspi');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryCost = deliveryMethod === 'courier' ? (subtotal > 50000 ? 0 : 2000) : 0;
  const total = subtotal + deliveryCost;

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const formatPhone = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('7')) val = val.substring(1);
    if (val.length > 10) val = val.substring(0, 10);
    
    let formatted = '+7 ';
    if (val.length > 0) formatted += `(${val.substring(0, 3)}`;
    if (val.length > 3) formatted += `) ${val.substring(3, 6)}`;
    if (val.length > 6) formatted += `-${val.substring(6, 8)}`;
    if (val.length > 8) formatted += `-${val.substring(8, 10)}`;
    
    setForm(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Введите имя';
    if (form.phone.length < 18) newErrors.phone = 'Введите полный номер';
    if (deliveryMethod === 'courier' && !form.address.trim()) newErrors.address = 'Укажите адрес доставки';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: cartItems,
          paymentMethod,
          deliveryMethod,
          subtotal,
          deliveryCost,
          total
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderSuccess(data.orderNumber);
        onClear();
      } else {
        alert('Ошибка при оформлении заказа. Попробуйте еще раз.');
      }
    } catch (err) {
      alert('Сетевая ошибка. Проверьте соединение.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Заказ оформлен!</h1>
          <p className="text-slate-500 mb-6">Номер вашего заказа: <span className="font-bold text-indigo-600">{orderSuccess}</span>. Менеджер свяжется с вами в ближайшее время.</p>
          <button onClick={onBack} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            Вернуться в магазин
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-slate-200" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Корзина пуста</h2>
          <p className="text-slate-500 mb-8 text-[14px]">Кажется, вы еще ничего не выбрали</p>
          <button onClick={onBack} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-[16px] font-bold text-slate-900 uppercase tracking-wider">
            {step === 'cart' ? 'Корзина' : 'Оформление'}
          </h1>
          <div className="w-9" /> 
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {step === 'cart' ? (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-3 sm:p-4 md:p-6 border-b border-slate-50 last:border-0 flex gap-3 md:gap-6 min-w-0">
                    <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 md:w-28 md:h-28 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                      <img src={getCartItemImage(item)} alt={item.title} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <h3 className="text-[13px] md:text-[16px] font-semibold text-slate-900 line-clamp-3 sm:line-clamp-2 mb-1 break-words">{item.title}</h3>
                      <p className="text-[11px] sm:text-[12px] text-slate-400 mb-3 truncate">Арт. {item.articul}</p>
                      <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-100">
                          <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600 disabled:opacity-30" disabled={item.qty <= 1}>
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-[14px] font-bold text-slate-900">{item.qty}</span>
                          <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600">
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-[15px] sm:text-[16px] font-bold text-slate-900">{formatPrice(item.price * item.qty)}</p>
                          <button onClick={() => onRemove(item.id)} className="text-[12px] text-red-400 hover:text-red-500 font-medium mt-1">Удалить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <Section title="1. Контактные данные">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field name="firstName" placeholder="Имя" required form={form} errors={errors} onChange={handleField} />
                    <Field name="lastName" placeholder="Фамилия" form={form} errors={errors} onChange={handleField} />
                    <Field name="phone" placeholder="Телефон" type="tel" required form={form} errors={errors} onChange={formatPhone} />
                    <Field name="email" placeholder="E-mail" type="email" form={form} errors={errors} onChange={handleField} />
                  </div>
                </Section>

                <Section title="2. Способ доставки">
                  <div className="space-y-3">
                    <RadioOption 
                      name="delivery" value="courier" checked={deliveryMethod === 'courier'} onChange={setDeliveryMethod}
                      label="Доставка курьером" description={subtotal > 50000 ? 'Бесплатно' : '2 000 ₸'}
                    />
                    <RadioOption 
                      name="delivery" value="pickup" checked={deliveryMethod === 'pickup'} onChange={setDeliveryMethod}
                      label="Самовывоз" description="Петропавловск, ул. Примерная 10"
                    />
                  </div>
                  {deliveryMethod === 'courier' && (
                    <div className="mt-5 pt-5 border-t border-slate-50 space-y-4 animate-in fade-in slide-in-from-top-2">
                      <Field name="city" placeholder="Город" form={form} errors={errors} onChange={handleField} />
                      <Field name="address" placeholder="Адрес (Улица, дом, квартира)" required form={form} errors={errors} onChange={handleField} />
                    </div>
                  )}
                </Section>

                <Section title="3. Способ оплаты">
                  <div className="space-y-3">
                    <RadioOption name="payment" value="kaspi" checked={paymentMethod === 'kaspi'} onChange={setPaymentMethod} label="Kaspi QR / Перевод" />
                    <RadioOption name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={setPaymentMethod} label="Наличными при получении" />
                    <RadioOption name="payment" value="invoice" checked={paymentMethod === 'invoice'} onChange={setPaymentMethod} label="Счет на оплату (для юр. лиц)" />
                  </div>
                </Section>
                
                <Section title="Комментарий к заказу">
                   <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleField}
                    placeholder="Напишите пожелания к заказу..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white min-h-[100px] resize-none transition-all"
                  />
                </Section>
              </div>
            )}
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 lg:sticky lg:top-24">
              <h2 className="text-[18px] font-bold text-slate-900 mb-6">Ваш заказ</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-500">Товары ({cartItems.length})</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-500">Доставка</span>
                  <span className={`font-semibold ${deliveryCost === 0 ? 'text-green-500' : 'text-slate-900'}`}>
                    {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center gap-3 mb-8">
                <span className="text-[16px] font-bold text-slate-900">Итого</span>
                <span className="text-[22px] sm:text-[24px] font-bold text-indigo-600 text-right">{formatPrice(total)}</span>
              </div>

              {step === 'cart' ? (
                <button onClick={() => setStep('checkout')} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100">
                  К оформлению <ChevronRight size={18} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Оформляем...' : 'Подтвердить заказ'}
                </button>
              )}
              
              <button onClick={onBack} className="w-full mt-4 text-[13px] text-slate-400 hover:text-slate-600 transition-colors py-2">
                Продолжить покупки
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
