export interface CategoryFilters {
  category: string;
  subcategories: {
    name: string;
    filters: string[];
  }[];
}

export const catalogStructure: CategoryFilters[] = [
  {
    category: "Видеонаблюдение",
    subcategories: [
      { name: "Видеокамеры", slug: "ip-videokamery", filters: ["Бренд", "Тип камеры", "Разрешение"] },
      { name: "Видеокамеры", slug: "analogovye-videokamery", filters: ["Бренд", "Тип камеры", "Разрешение"] },
      { name: "Видеорегистраторы", slug: "ip-videoregistratory", filters: ["Бренд", "Количество каналов"] },
      { name: "Видеорегистраторы", slug: "gibridnye-videoregistratory", filters: ["Бренд", "Количество каналов"] }
    ]
  },
  {
    category: "Системы контроля доступа",
    subcategories: [
      { name: "Домофония", filters: ["Бренд", "Тип (Аналоговая/IP)", "Комплектация"] },
      { name: "Контроллеры", filters: ["Тип (со считывателем/без)"] },
      { name: "Считыватели", filters: ["Бренд", "Протокол"] },
      { name: "Турникеты и металлоискатели", filters: ["Тип установки", "Пропускная способность"] },
      { name: "Кнопки выхода, замки и доводчики", filters: ["Тип замка", "Сила удержания"] }
    ]
  },
  {
    category: "IP-телефония",
    subcategories: [
      { name: "IP телефоны", filters: ["Бренд", "PoE", "Скорость LAN", "Поддержка гарнитуры", "Функция BLF", "Wi-Fi"] },
      { name: "АТС", filters: ["Количество пользователей", "Количество линий"] }
    ]
  },
  {
    category: "Гарнитура",
    subcategories: [
      { name: "Проводные", filters: ["Разъем (USB/RJ9/Jack)", "Тип (моно/стерео)", "Шумоподавление"] },
      { name: "Беспроводные", filters: ["Тип подключения", "Время работы"] }
    ]
  },
  {
    category: "Сетевое оборудование",
    subcategories: [
      { name: "Маршрутизаторы", filters: ["Бренд", "Скорость Uplink", "Управление", "Монтаж в стойку"] },
      { name: "Коммутаторы", filters: ["Количество портов", "PoE бюджет", "Уровень (L2/L3)"] },
      { name: "Инжекторы", filters: ["Стандарт PoE", "Мощность"] },
      { name: "Медиаконвертеры", filters: ["Тип волокна", "Дальность"] },
      { name: "Витая пара", filters: ["Проводник (Медь/Биметалл)", "Категория (Cat)", "Экранирование (UTP/FTP/SFTP)", "Диаметр"] },
      { name: "Патчкорды", filters: ["Длина", "Категория", "Маркировка"] },
      { name: "Розетки", filters: ["Количество модулей", "Тип"] }
    ]
  },
  {
    category: "Серверные шкафы",
    subcategories: [
      { name: "Шкафы настенные", filters: ["Бренд", "Высота (U)", "Глубина", "Тип двери"] },
      { name: "Шкафы напольные", filters: ["Бренд", "Высота (U)", "Размеры (ШхГ)", "Перфорация"] },
      { name: "Комплектующие", filters: ["Тип (Полки/Вентиляторы/Органайзеры)"] }
    ]
  },
  {
    category: "Рации",
    subcategories: [
      { name: "Портативные", filters: ["Бренд", "Частота", "Мощность (Ватт)"] },
      { name: "Автомобильные", filters: ["Диапазон", "Питание (12/24V)"] },
      { name: "Гарнитуры и антенны", filters: ["Разъем", "Коэффициент усиления"] }
    ]
  },
  {
    category: "Источники бесперебойного питания",
    subcategories: [
      { name: "Smart UPS", filters: ["Мощность (Вт)", "USB-port", "Исполнение", "Батареи в комплекте"] },
      { name: "Online UPS", filters: ["Мощность", "Время автономной работы"] },
      { name: "Аккумуляторы для ИБП", filters: ["Емкость (Ah)", "Напряжение (V)"] }
    ]
  },
  {
    category: "Офисная техника",
    subcategories: [
      { name: "Мониторы", filters: ["Диагональ", "Матрица", "Разъемы"] },
      { name: "Ноутбуки", filters: ["Процессор", "ОЗУ", "Накопитель"] },
      { name: "МФУ и принтеры", filters: ["Технология печати", "Цветность", "Формат"] }
    ]
  }
];

export const categoryLabelMap: Record<string, string> = {
  videonablyudenie: "Видеонаблюдение",
  domofoniya: "Домофония",
  'sistemy-kontrolya-dostupa': "Системы контроля доступа",
  'ip-telefony': "IP-телефония",
  'pozharnaya-signalizaciya': "Пожарная сигнализация",
  'setevoe-oborudovanie': "Сетевое оборудование",
  'passivnoe-setevoe': "Пассивное сетевое",
  'istochniki-besperebojnogo-pitaniya': "Источники бесперебойного питания",
  'servernye-shkafi': "Серверные шкафы",
  garnitura: "Гарнитура",
  'wifi-oborudovanie': "WiFi оборудование",
  radiooborudovanie: "Радиооборудование",
  'optovolokonaya-produkciya': "Оптоволоконная продукция",
  'ofisnaya-tekhnika': "Офисная техника",
  'racii': "Рации"
};