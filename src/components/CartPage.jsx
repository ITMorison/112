import { useState } from 'react';
import { Minus, Plus, ShoppingBag, ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react';

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

function RadioOption({ name, value, checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="mt-0.5 flex-shrink-0">
        <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="hidden" />
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${checked ? 'border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
        </div>
      </div>
      <div>
        <p className={`text-[14px] transition-colors ${checked ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{label}</p>
        {description && <p className="text-[12px] text-slate-400 mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

export default function CartPage({ cartItems, onUpdateQty, onRemove, onGoBack }) {
  const [customerType, setCustomerType] = useState('physical');
  const [paymentMethod, setPaymentMethod] = useState('invoice');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [deliveryPayment, setDeliveryPayment] = useState('courier');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', bin: '',
    index: '', address: '',
    comment: '',
  });
  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryCost = deliveryMethod === 'express' ? 3000 : (subtotal > 50000 ? 0 : 1500);
  const total = subtotal + (deliveryPayment === 'invoice' ? deliveryCost : 0);
  const totalCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const formatPhone = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (digits.length === 0) { formatted = ''; }
    else {
      formatted = '+7';
      if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
      if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
      if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
      if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);
    }
    setForm(prev => ({ ...prev, phone: formatted }));
    setErrors(prev => ({ ...prev, phone: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Введите имя';
    if (!form.lastName.trim())  e.lastName  = 'Введите фамилию';
    if (!form.email.trim())     e.email     = 'Введите email';
    if (!form.phone.trim())     e.phone     = 'Введите телефон';
    if (!form.address.trim())   e.address   = 'Введите адрес';
    if (customerType === 'legal') {
      if (!form.company.trim()) e.company = 'Введите название компании';
      if (!form.bin.trim())     e.bin     = 'Введите БИН';
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    setSubmitError(null);

    const order = {
      customer: { ...form, type: customerType },
      items: cartItems.map(({ id, title, price, qty, articul }) => ({ id, title, price, qty, articul })),
      paymentMethod, deliveryMethod, deliveryPayment,
      subtotal, deliveryCost, total,
    };

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка отправки');

      setSubmitted(true);
    } catch (err) {
      setSubmitError('Не удалось отправить заказ. Пожалуйста, позвоните нам по телефону +7 (776) 630-00-44 или напишите на info@servernet.kz');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-24 flex flex-col items-center gap-6 text-center">
        <ShoppingBag size={64} className="text-slate-100" />
        <h2 className="text-[24px] font-bold text-slate-700">Корзина пуста</h2>
        <p className="text-[14px] text-slate-400 max-w-sm">Добавьте товары из каталога, чтобы оформить заказ.</p>
        <button onClick={onGoBack}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer">
          <ArrowLeft size={16} /> Перейти в каталог
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-24 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={44} className="text-emerald-600" />
        </div>
        <h2 className="text-[26px] font-bold text-slate-900">Заказ принят!</h2>
        <p className="text-[15px] text-slate-600 max-w-md leading-relaxed">
          Спасибо, <span className="font-semibold text-indigo-600">{form.firstName} {form.lastName}</span>!{' '}
          Ваш заказ принят в обработку. Мы свяжемся с вами по номеру{' '}
          <span className="font-semibold">{form.phone}</span>.
        </p>
        <button onClick={onGoBack}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer">
          <ArrowLeft size={16} /> Продолжить покупки
        </button>
      </div>
    );
  }

  const Section = ({ title, children }) => (
    <div className="bg-white border-0 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h2 className="text-[18px] md:text-[20px] font-bold text-slate-900 mb-5">{title}</h2>
      {children}
    </div>
  );

  const Field = ({ name, placeholder, type = 'text', half = false, required = false }) => (
    <div className={half ? 'flex-1 min-w-0' : 'w-full'}>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={name === 'phone' ? formatPhone : handleField}
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

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4 py-8 md:py-10">

        <div className="flex items-center gap-1.5 text-[13px] text-slate-400 mb-6">
          <button onClick={onGoBack} className="hover:text-indigo-600 transition-colors cursor-pointer">Главная</button>
          <ChevronRight size={13} />
          <span className="text-slate-700">Корзина</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

          {/* LEFT */}
          <div className="flex flex-col gap-5">

            <div className="bg-white border-0 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h1 className="text-[24px] md:text-[28px] font-bold text-slate-900 mb-5 tracking-tight">
                Корзина <sup className="text-[16px] font-semibold text-slate-400">{totalCount}</sup>
              </h1>
              <div className="flex flex-col divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
<img
                          src={getCartItemImage(item)}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-contain p-1"
                        />
                     </div>
                     <p className="flex-1 text-[13px] md:text-[14px] font-medium text-slate-800 leading-snug line-clamp-2">{item.title}</p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all duration-200 hover:scale-105 cursor-pointer">
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-[15px] font-bold text-slate-900 select-none">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all duration-200 hover:scale-105 cursor-pointer">
                        <Plus size={13} />
                      </button>
                    </div>
                    <p className="w-24 text-right text-[15px] font-bold text-slate-900 flex-shrink-0">{formatPrice(item.price * item.qty)}</p>
                    <button onClick={() => onRemove(item.id)}
                      className="flex-shrink-0 w-7 h-7 rounded-full border border-rose-200 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 cursor-pointer ml-1">
                      <span className="text-[13px] font-bold leading-none">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Section title="1. Получатель">
              <div className="flex gap-8 mb-6">
                <RadioOption name="customerType" value="physical" checked={customerType === 'physical'} onChange={setCustomerType} label="Физическое лицо" />
                <RadioOption name="customerType" value="legal" checked={customerType === 'legal'} onChange={setCustomerType} label="Юридическое лицо" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Field name="firstName" placeholder="Ваше имя" half required />
                  <Field name="lastName" placeholder="Ваша фамилия" half required />
                </div>
                <div className="flex gap-3">
                  <Field name="email" placeholder="Email" type="email" half required />
                  <Field name="phone" placeholder="Телефон" type="tel" half required />
                </div>
                {customerType === 'legal' && (
                  <div className="flex gap-3">
                    <Field name="company" placeholder="Название компании" half required />
                    <Field name="bin" placeholder="БИН" half required />
                  </div>
                )}
              </div>
            </Section>

            <Section title="2. Адрес доставки">
              <div className="flex gap-3">
                <div className="w-32 flex-shrink-0">
                  <Field name="index" placeholder="Индекс" />
                </div>
                <Field name="address" placeholder="Адрес для доставки" required />
              </div>
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Section title="3. Оплата заказа">
                <RadioOption name="payment" value="invoice" checked={paymentMethod === 'invoice'} onChange={setPaymentMethod} label="Выставить счёт" />
              </Section>
              <Section title="4. Способ доставки">
                <div className="flex flex-col gap-3">
                  <RadioOption name="delivery" value="standard" checked={deliveryMethod === 'standard'} onChange={setDeliveryMethod} label="Обычная" description="Курьерская доставка" />
                  <RadioOption name="delivery" value="express" checked={deliveryMethod === 'express'} onChange={setDeliveryMethod} label="Экспресс" description="Чуть быстрее, но дороже" />
                </div>
              </Section>
            </div>

            <Section title="5. Оплата за доставку">
              <div className="flex flex-col gap-3">
                <RadioOption name="deliveryPayment" value="courier" checked={deliveryPayment === 'courier'} onChange={setDeliveryPayment} label="Оплатим курьеру" />
                <RadioOption name="deliveryPayment" value="invoice" checked={deliveryPayment === 'invoice'} onChange={setDeliveryPayment} label="Включить в счёт" />
              </div>
            </Section>

            <div className="bg-white border-0 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleField}
                placeholder="Комментарий к заказу (по желанию)"
                rows={4}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white transition-all resize-none placeholder-slate-400 hover:border-slate-300"
              />
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-[13px] px-5 py-4 rounded-xl">
                {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 active:scale-[0.99] text-white font-bold text-[15px] tracking-wide uppercase py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200 cursor-pointer">
              {loading ? 'Отправляем...' : 'Оформить заказ'}
            </button>

          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-4">
            <div className="bg-white border-0 rounded-2xl p-5 md:p-6 shadow-lg">
              <h2 className="text-[20px] font-bold text-slate-900 mb-5">Ваш заказ</h2>
              <div className="space-y-3 text-[14px] text-slate-600 mb-5">
                <div className="flex justify-between">
                  <span>{totalCount} {totalCount === 1 ? 'товар' : totalCount < 5 ? 'товара' : 'товаров'}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {deliveryPayment === 'invoice' && (
                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span className={deliveryCost === 0 ? 'text-emerald-600 font-medium' : ''}>
                      {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
                    </span>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center mb-6">
                <span className="text-[16px] font-bold text-slate-900">Итого</span>
                <span className="text-[24px] font-bold text-slate-900">{formatPrice(total)}</span>
              </div>
              <div className="flex flex-col gap-2">
                {cartItems.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center gap-3 text-[13px] text-slate-600">
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
<img
                          src={getCartItemImage(item)}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-contain p-1"
                        />
                    </div>
                    <span className="flex-1 line-clamp-1">{item.title}</span>
                    <span className="font-medium flex-shrink-0">{item.qty} шт.</span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <p className="text-[12px] text-slate-400 text-center mt-2">и ещё {cartItems.length - 3} товара...</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
