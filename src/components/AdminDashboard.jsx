import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, Search, Phone, ChevronDown, ChevronUp,
  LogOut, Package as PackageIcon, ShoppingBag, CheckCircle, Clock, XCircle,
  Edit2, Save, X, Trash2
} from 'lucide-react';
import { PRODUCTS } from '../data';

const STORAGE_KEYS = {
  PRODUCTS: 'admin_products',
  ORDERS: 'admin_orders',
  CONTACT_INFO: 'contact_info'
};

const DEFAULT_CONTACT_INFO = {
  phone1: "+7 (776)630-00-44",
  phone2: "+7 (747) 000-00-00",
  email: "info@servernet.kz",
  address: "Казахстан, г. Петропавловск, ул. Чкалова, 49"
};

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₸';
}

function generateMockOrders() {
  const statuses = ['new', 'in_progress', 'completed'];
  const names = ['Александр Иванов', 'Мария Петрова', 'Егор Сидоров', 'Анна Козлова', 'Дмитрий Смирнов'];
  const phones = ['+7 707 123-45-67', '+7 747 234-56-78', '+7 775 345-67-89', '+7 701 456-78-90', '+7 778 567-89-01'];
  
  return names.map((name, i) => ({
    id: i + 1,
    name,
    phone: phones[i],
    items: [
      { title: 'Оптический кросс SHIP F-M1', qty: 2, price: 23280 },
      { title: 'Модуль SHIP M245', qty: 5, price: 569 }
    ],
    total: 23280 * 2 + 569 * 5,
    status: statuses[i],
    date: new Date(Date.now() - i * 3600000).toISOString()
  }));
}

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      const initialProducts = PRODUCTS.map(p => ({ ...p, adminPrice: p.price }));
      setProducts(initialProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    }

    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
    }

    const storedContactInfo = localStorage.getItem(STORAGE_KEYS.CONTACT_INFO);
    if (storedContactInfo) {
      setContactInfo(JSON.parse(storedContactInfo));
    } else {
      localStorage.setItem(STORAGE_KEYS.CONTACT_INFO, JSON.stringify(DEFAULT_CONTACT_INFO));
    }
  }, []);

  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
  };

  const saveOrders = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
  };

  const saveContactInfo = (newContactInfo) => {
    setContactInfo(newContactInfo);
    localStorage.setItem(STORAGE_KEYS.CONTACT_INFO, JSON.stringify(newContactInfo));
  };

  const deleteOrder = (orderId) => {
    const newOrders = orders.filter(o => o.id !== orderId);
    saveOrders(newOrders);
    setDeleteConfirm(null);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.articul?.toString().includes(searchQuery) ||
    p.sku?.toString().includes(searchQuery)
  );

  const filteredOrders = orders.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.phone.includes(searchQuery) ||
    o.id.toString().includes(searchQuery)
  );

  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.date);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const startEditPrice = (product) => {
    setEditingProduct(product.id);
    setEditPrice(product.adminPrice?.toString() || product.price.toString());
  };

  const savePrice = (productId) => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) return;
    
    const newProducts = products.map(p => 
      p.id === productId ? { ...p, adminPrice: newPrice } : p
    );
    saveProducts(newProducts);
    setEditingProduct(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditPrice('');
  };

  const updateOrderStatus = (orderId, status) => {
    const newOrders = orders.map(o => 
      o.id === orderId ? { ...o, status } : o
    );
    saveOrders(newOrders);
  };

    const logout = () => {
      if (onLogout) {
        onLogout();
      } else {
        localStorage.removeItem('admin_auth');
        navigate('/admin-login');
      }
    };

  const statusConfig = {
    new: { label: 'Новый', color: 'bg-blue-100 text-blue-700', icon: Clock },
    in_progress: { label: 'В работе', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    completed: { label: 'Завершен', color: 'bg-green-100 text-green-700', icon: CheckCircle }
  };

  const getStatusConfig = (status) => statusConfig[status] || statusConfig.new;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Админ-панель</h1>
            <p className="text-xs text-gray-500">ServerNet</p>
          </div>
          <button
            onClick={logout}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'orders' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Заказы
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'products' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Товары
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'contacts' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Контакты
          </button>
        </div>
      </header>

      <div className="p-4">
        {activeTab === 'orders' && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag size={18} className="text-indigo-600" />
                  <span className="text-xs text-gray-500">Заказы сегодня</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{todayOrders.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <PackageIcon size={18} className="text-green-600" />
                  <span className="text-xs text-gray-500">Выручка сегодня</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{formatPrice(todayRevenue)}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm mb-4">
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по заказам..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    Заказы не найдены
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const status = getStatusConfig(order.status);
                    const StatusIcon = status?.icon || Clock;
                    
                    return (
                      <div key={order.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{order.name}</p>
                            <p className="text-sm text-gray-500">Заказ #{order.id}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status?.color || 'bg-gray-100 text-gray-700'} flex items-center gap-1`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <span>{item.title} x{item.qty}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                          <div className="flex gap-2">
                            <a
                              href={`tel:${order.phone}`}
                              className="p-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-700"
                            >
                              <Phone size={18} />
                            </a>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700"
                              title="Завершить заказ"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(order.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700"
                              title="Удалить заказ"
                            >
                              <Trash2 size={18} />
                            </button>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-xs bg-gray-100 border-0 rounded-lg px-3 py-2 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                              <option value="new">Новый</option>
                              <option value="in_progress">В работе</option>
                              <option value="completed">Завершен</option>
                            </select>
                          </div>
                        </div>
                        {deleteConfirm === order.id && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg flex items-center gap-2">
                            <span className="text-xs text-red-700">Удалить заказ?</span>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              Да
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                            >
                              Нет
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

         {activeTab === 'products' && (
           <>
             <div className="bg-white rounded-xl shadow-sm mb-4">
               <div className="p-3">
                 <div className="relative">
                   <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Поиск по артикулу или названию..."
                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                   />
                 </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">Арт.</th>
                       <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">Товар</th>
                       <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">Цена</th>
                       <th className="text-right text-xs font-medium text-gray-500 px-3 py-2"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {filteredProducts.slice(0, 50).map((product, idx) => (
                       <tr key={`${product.id}-${idx}`} className="hover:bg-gray-50">
                         <td className="px-3 py-3">
                           <span className="text-xs font-medium text-gray-600">{product.articul}</span>
                         </td>
                         <td className="px-3 py-3 max-w-[150px]">
                           <p className="text-xs text-gray-900 truncate">{product.title}</p>
                         </td>
                         <td className="px-3 py-3 text-right">
                           {editingProduct === product.id ? (
                             <div className="flex items-center gap-1 justify-end">
                               <input
                                 type="number"
                                 value={editPrice}
                                 onChange={(e) => setEditPrice(e.target.value)}
                                 className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
                               />
                               <button
                                 onClick={() => savePrice(product.id)}
                                 className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-green-700"
                               >
                                 <Save size={14} />
                               </button>
                               <button
                                 onClick={cancelEdit}
                                 className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-700"
                               >
                                 <X size={14} />
                               </button>
                             </div>
                           ) : (
                             <span className="text-sm font-semibold text-gray-900">
                               {formatPrice(product.adminPrice || product.price)}
                             </span>
                           )}
                         </td>
                         <td className="px-3 py-3 text-right">
                           {editingProduct !== product.id && (
                             <button
                               onClick={() => startEditPrice(product)}
                               className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600"
                             >
                               <Edit2 size={16} />
                             </button>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               
               {filteredProducts.length > 50 && (
                 <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-100">
                   Показано 50 из {filteredProducts.length} товаров
                 </div>
               )}
             </div>
           </>
         )}

         {activeTab === 'contacts' && (
           <div className="bg-white rounded-xl shadow-sm p-4">
             <h2 className="text-lg font-bold text-gray-900 mb-4">Контактная информация</h2>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-medium text-gray-600 mb-1">Телефон 1</label>
                 <input
                   type="text"
                   value={contactInfo.phone1}
                   onChange={(e) => saveContactInfo({ ...contactInfo, phone1: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-gray-600 mb-1">Телефон 2</label>
                 <input
                   type="text"
                   value={contactInfo.phone2}
                   onChange={(e) => saveContactInfo({ ...contactInfo, phone2: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                 <input
                   type="email"
                   value={contactInfo.email}
                   onChange={(e) => saveContactInfo({ ...contactInfo, email: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-gray-600 mb-1">Адрес</label>
                 <textarea
                   value={contactInfo.address}
                   onChange={(e) => saveContactInfo({ ...contactInfo, address: e.target.value })}
                   rows={3}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                 />
               </div>
               <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                 Изменения сохраняются автоматически и применяются на сайте сразу.
               </div>
             </div>
           </div>
         )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
        <Link
          to="/"
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-center text-sm font-medium text-gray-700"
        >
          На сайт
        </Link>
      </div>
    </div>
  );
}
