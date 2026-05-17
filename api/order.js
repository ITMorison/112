// api/order.js — Vercel Serverless Function
// Отправка уведомлений о заказе через Resend (resend.com)
//
// Настройка в Vercel → Settings → Environment Variables:
//   RESEND_API_KEY = re_xxxxxxxxxxxxxxxx  (получить на resend.com)
//   NOTIFY_EMAIL   = info@servernet.kz
   (куда слать заказы)
//   FROM_EMAIL     = orders@resend.dev    (от кого — используй resend.dev пока не подтвердишь домен)

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { customer, items, paymentMethod, deliveryMethod, deliveryPayment, subtotal, deliveryCost, total } = req.body;

    if (!customer?.firstName || !customer?.phone || !items?.length) {
      return res.status(400).json({ error: 'Не заполнены обязательные поля' });
    }

    const orderNumber = `ORD-${Date.now()}`;
    const orderDate = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });
    const deliveryLabel = deliveryMethod === 'express' ? 'Экспресс' : 'Обычная (курьерская)';
    const payDelivLabel = deliveryPayment === 'invoice' ? 'Включить в счёт' : 'Оплатим курьеру';
    const custType = customer.type === 'legal' ? 'Юридическое лицо' : 'Физическое лицо';

    const itemsRows = items.map(i => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${i.title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:13px;">${i.qty} шт.</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;white-space:nowrap;">${Number(i.price * i.qty).toLocaleString('ru-RU')} ₸</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);">

  <div style="background:#1e3a8a;padding:24px 32px;">
    <h1 style="color:#fff;margin:0;font-size:20px;">🛒 Новый заказ ${orderNumber}</h1>
    <p style="color:#93c5fd;margin:4px 0 0;font-size:13px;">${orderDate}</p>
  </div>

  <div style="padding:24px 32px;">

    <h2 style="color:#1e3a8a;font-size:15px;margin:0 0 10px;padding-bottom:6px;border-bottom:2px solid #e5e7eb;">👤 Покупатель</h2>
    <table style="width:100%;margin-bottom:20px;border-collapse:collapse;">
      <tr><td style="padding:3px 0;color:#6b7280;font-size:13px;width:130px;">Тип:</td><td style="padding:3px 0;font-size:13px;font-weight:600;">${custType}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;font-size:13px;">Имя:</td><td style="padding:3px 0;font-size:13px;font-weight:600;">${customer.firstName} ${customer.lastName}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;font-size:13px;">Телефон:</td><td style="padding:3px 0;font-size:13px;font-weight:600;">${customer.phone}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;font-size:13px;">Email:</td><td style="padding:3px 0;font-size:13px;font-weight:600;">${customer.email || '—'}</td></tr>
      ${customer.type === 'legal' ? `
      <tr><td style="padding:3px 0;color:#6b7280;font-size:13px;">Компания:</td><td style="padding:3px 0;font-size:13px;font-weight:600;">${customer.company || '—'}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;font-size:13px;">БИН:</td><td style="padding:3px 0;font-size:13px;font-weight:600;">${customer.bin || '—'}</td></tr>` : ''}
    </table>

    <h2 style="color:#1e3a8a;font-size:15px;margin:0 0 10px;padding-bottom:6px;border-bottom:2px solid #e5e7eb;">🚚 Доставка</h2>
    <table style="width:100%;margin-bottom:20px;border-collapse:collapse;">
      <tr><td style="padding:3px 0;color:#6b7280;font-size:13px;width:130px;">Адрес:</td><td style="padding:3px 0;font-size:13px;font-weight:600;">${customer.index ? customer.index + ', ' : ''}${customer.address || '—'}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;font-size:13px;">Способ:</td><td style="padding:3px 0;font-size:13px;font-weight:600;">${deliveryLabel}</td></tr>
      <tr><td style="padding:3px 0;color:#6b7280;font-size:13px;">Оплата доставки:</td><td style="padding:3px 0;font-size:13px;font-weight:600;">${payDelivLabel}</td></tr>
    </table>

    ${customer.comment ? `
    <h2 style="color:#1e3a8a;font-size:15px;margin:0 0 10px;padding-bottom:6px;border-bottom:2px solid #e5e7eb;">💬 Комментарий</h2>
    <p style="background:#f9fafb;border-radius:8px;padding:12px;margin:0 0 20px;font-size:13px;color:#374151;">${customer.comment}</p>
    ` : ''}

    <h2 style="color:#1e3a8a;font-size:15px;margin:0 0 10px;padding-bottom:6px;border-bottom:2px solid #e5e7eb;">📦 Товары (${items.length} поз.)</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <thead><tr style="background:#f3f4f6;">
        <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;">Наименование</th>
        <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">Кол-во</th>
        <th style="padding:8px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;">Сумма</th>
      </tr></thead>
      <tbody>${itemsRows}</tbody>
    </table>

    <div style="background:#eff6ff;border-radius:8px;padding:16px 20px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#6b7280;font-size:13px;">
        <span>Товары:</span><span>${Number(subtotal).toLocaleString('ru-RU')} ₸</span>
      </div>
      ${deliveryPayment === 'invoice' ? `
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#6b7280;font-size:13px;">
        <span>Доставка:</span><span>${!deliveryCost ? 'Бесплатно' : Number(deliveryCost).toLocaleString('ru-RU') + ' ₸'}</span>
      </div>` : ''}
      <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:#1e3a8a;border-top:1px solid #bfdbfe;padding-top:10px;margin-top:6px;">
        <span>Итого:</span><span>${Number(total).toLocaleString('ru-RU')} ₸</span>
      </div>
    </div>

  </div>
  <div style="background:#f9fafb;padding:14px 32px;text-align:center;color:#9ca3af;font-size:11px;">
    ServerNet — Профессиональные сетевые решения | server-net.kz
  </div>
</div>
</body></html>`;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'ServerNet <admin@servernet.kz>',
        to: [process.env.NOTIFY_EMAIL || 'a.kozlova@servernet.kz'],
        subject: `🛒 Новый заказ ${orderNumber} — ${customer.firstName} ${customer.lastName} — ${Number(total).toLocaleString('ru-RU')} ₸`,
        html,
        reply_to: customer.email || undefined,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Ошибка отправки письма' });
    }

    return res.status(200).json({ success: true, orderNumber });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка' });
  }
}
