// Замени функцию handleSubmit в src/components/CartPage.jsx
// Также добавь useState для loading и error вверху компонента:
//   const [loading, setLoading] = useState(false);
//   const [submitError, setSubmitError] = useState(null);

const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length) { setErrors(e); return; }

  setLoading(true);
  setSubmitError(null);

  const order = {
    customer: { ...form, type: customerType },
    items: cartItems.map(({ id, title, price, qty, articul }) => ({ id, title, price, qty, articul })),
    paymentMethod,
    deliveryMethod,
    deliveryPayment,
    subtotal,
    deliveryCost,
    total,
  };

  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Ошибка отправки');
    }

    setSubmitted(true);
  } catch (err) {
    setSubmitError('Не удалось отправить заказ. Пожалуйста, позвоните нам по телефону.');
  } finally {
    setLoading(false);
  }
};

// Кнопку "ОФОРМИТЬ ЗАКАЗ" замени на:
// <button
//   onClick={handleSubmit}
//   disabled={loading}
//   className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 active:scale-[0.99] text-white font-bold text-[15px] tracking-wide uppercase py-4 rounded-xl transition-all cursor-pointer">
//   {loading ? 'Отправляем...' : 'Оформить заказ'}
// </button>
//
// Перед кнопкой добавь блок ошибки:
// {submitError && (
//   <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-xl">
//     {submitError}
//   </div>
// )}
