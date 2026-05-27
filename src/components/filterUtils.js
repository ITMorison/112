export const VIDEO_BRANDS = ['Hikvision', 'HiWatch', 'HiLook', 'Dahua', 'Imou', 'Tiandy'];

const COMMON_BRANDS = [
  ...VIDEO_BRANDS,
  'Grandstream', 'Yealink', 'Fanvil', 'Cisco', 'Polycom', 'Snom',
  'Jabra', 'Plantronics', 'Sennheiser', 'Huawei', 'Ubiquiti', 'MikroTik',
  'TP-Link', 'ASUS', 'D-Link', 'SHIP', 'A&P', 'Legrand', 'SVC', 'APC',
  'Eaton', 'Powercom', 'Ippon', 'Motorola', 'Kenwood', 'Baofeng', 'Hytera'
];

const FILTER_DEFINITIONS = {
  cameras: [
    { key: 'brand', title: 'Бренд', options: VIDEO_BRANDS },
    { key: 'cameraType', title: 'Тип камеры', options: ['Купольная', 'Цилиндрическая', 'Поворотная (PTZ)', 'Wi-Fi'] },
    { key: 'resolution', title: 'Разрешение', options: ['2 Мп', '3 Мп', '4 Мп', '5 Мп', '6 Мп', '8 Мп'] }
  ],
  recorders: [
    { key: 'brand', title: 'Бренд', options: ['Hikvision', 'Dahua'] },
    { key: 'channels', title: 'Количество каналов', options: ['4', '8', '16', '32', '64'] }
  ],
  intercom: [
    { key: 'brand', title: 'Бренд', options: ['Dahua', 'Hikvision'] },
    { key: 'signalType', title: 'Тип', options: ['Аналоговая', 'IP'] }
  ],
  ipPhones: [
    { key: 'brand', title: 'Бренд' },
    { key: 'poe', title: 'PoE', options: ['Да', 'Нет'] },
    { key: 'lanSpeed', title: 'Скорость LAN', options: ['10/100', 'Gigabit', '2.5G', '10G'] },
    { key: 'headsetSupport', title: 'Подключение гарнитуры', options: ['Да', 'Нет'] },
    { key: 'blf', title: 'Функция BLF', options: ['Да', 'Нет'] },
    { key: 'accounts', title: 'Аккаунты' },
    { key: 'wifi', title: 'Wi-Fi', options: ['Да', 'Нет'] }
  ],
  ats: [
    { key: 'brand', title: 'Бренд' },
    { key: 'users', title: 'Количество пользователей' }
  ],
  headsets: [
    { key: 'connector', title: 'Разъем', options: ['USB', 'USB-C', 'RJ9', 'RJ9/QD', '3.5 мм jack', 'Bluetooth'] },
    { key: 'headsetEar', title: 'Наушник', options: ['Моно', 'Стерео'] },
    { key: 'noiseCancel', title: 'Шумоподавление', options: ['Да', 'Нет'] }
  ],
  activeNetwork: [
    { key: 'brand', title: 'Бренд' },
    { key: 'uplinkSpeed', title: 'Скорость Uplink', options: ['10/100', 'Gigabit', '2.5G', '10G'] },
    { key: 'management', title: 'Управление', options: ['Управляемый', 'Неуправляемый'] },
    { key: 'rackMount', title: 'Монтаж в стойку', options: ['Да', 'Нет'] }
  ],
  twistedPair: [
    { key: 'conductor', title: 'Проводник', options: ['Медь', 'Биметалл', 'CCA', 'CCS'] },
    { key: 'cableCat', title: 'Cat.', options: ['Cat.3', 'Cat.5e', 'Cat.6', 'Cat.6A', 'Cat.7'] },
    { key: 'shielding', title: 'Маркировка', options: ['UTP', 'FTP', 'SFTP'] },
    { key: 'diameter', title: 'Диаметр' }
  ],
  patchCords: [
    { key: 'cableCat', title: 'Cat.', options: ['Cat.5e', 'Cat.6', 'Cat.6A', 'Cat.7'] },
    { key: 'shielding', title: 'Маркировка', options: ['UTP', 'FTP', 'SFTP'] },
    { key: 'length', title: 'Длина' }
  ],
  outlets: [
    { key: 'modulesCount', title: 'Кол-во модулей' },
    { key: 'outletType', title: 'Тип', options: ['Внутренняя', 'Накладная', 'Keystone'] }
  ],
  cabinets: [
    { key: 'brand', title: 'Бренд' },
    { key: 'cabinetU', title: 'Количество U' },
    { key: 'perforation', title: 'Перфорация', options: ['Да', 'Нет'] },
    { key: 'cabinetSize', title: 'Размеры' }
  ],
  radio: [
    { key: 'brand', title: 'Бренд' },
    { key: 'frequency', title: 'Частота' },
    { key: 'power', title: 'Мощность, Ватт' }
  ],
  ups: [
    { key: 'powerRange', title: 'Мощность, Вт', options: ['до 1000 Вт', '1000-3000 Вт', '3000+ Вт'] },
    { key: 'usb', title: 'USB-port', options: ['Да', 'Нет'] },
    { key: 'upsExecution', title: 'Исполнение', options: ['On-Line', 'Line-Interactive', 'Резервный'] },
    { key: 'batteryIncluded', title: 'Батареи в комплекте', options: ['Да', 'Нет'] },
    { key: 'upsType', title: 'Тип', options: ['Однофазный', 'Трехфазный'] }
  ]
};

const FILTERS_BY_SUBCATEGORY = {
  'analogovye-videokamery': FILTER_DEFINITIONS.cameras,
  'ip-videokamery': FILTER_DEFINITIONS.cameras,
  'gibridnye-videoregistratory': FILTER_DEFINITIONS.recorders,
  'ip-videoregistratory': FILTER_DEFINITIONS.recorders,
  komplekty: FILTER_DEFINITIONS.intercom,
  'vyzyvnye-paneli': FILTER_DEFINITIONS.intercom,
  monitory: FILTER_DEFINITIONS.intercom,
  'nastolnye-telefony': FILTER_DEFINITIONS.ipPhones,
  'besprovodnye-telefony': FILTER_DEFINITIONS.ipPhones,
  'otelnye-telefony': FILTER_DEFINITIONS.ipPhones,
  'videotelefonы': FILTER_DEFINITIONS.ipPhones,
  konferenciya: FILTER_DEFINITIONS.ipPhones,
  'mini-ats': FILTER_DEFINITIONS.ats,
  'fxo-shpuli': FILTER_DEFINITIONS.ats,
  'fxs-shpuli': FILTER_DEFINITIONS.ats,
  'gsm-shpuli': FILTER_DEFINITIONS.ats,
  provodnaya: FILTER_DEFINITIONS.headsets,
  besprovodnaya: FILTER_DEFINITIONS.headsets,
  marshrutizatory: FILTER_DEFINITIONS.activeNetwork,
  'kommutatory-lan': FILTER_DEFINITIONS.activeNetwork,
  'kommutatory-poe': FILTER_DEFINITIONS.activeNetwork,
  mediakonvertory: FILTER_DEFINITIONS.activeNetwork,
  'sfp-moduli': FILTER_DEFINITIONS.activeNetwork,
  'inzhektory-poe': FILTER_DEFINITIONS.activeNetwork,
  'vitaya-para': FILTER_DEFINITIONS.twistedPair,
  patchkordy: FILTER_DEFINITIONS.patchCords,
  rozetki: FILTER_DEFINITIONS.outlets,
  'nastolnye-shkafi': FILTER_DEFINITIONS.cabinets,
  'napolnye-shkafi': FILTER_DEFINITIONS.cabinets,
  'komplektuyushchie-k-shkafam': FILTER_DEFINITIONS.cabinets,
  'klimaticheskie-shkafi': FILTER_DEFINITIONS.cabinets,
  'smart-ups': FILTER_DEFINITIONS.ups,
  'online-ups': FILTER_DEFINITIONS.ups,
  'trekhfaznye-ups': FILTER_DEFINITIONS.ups,
  'batareynye-bloki': FILTER_DEFINITIONS.ups,
  'akkumulyatory-dlya-ibp': FILTER_DEFINITIONS.ups,
  'shkafi-dlya-akkumulyatorov': FILTER_DEFINITIONS.ups,
  radiostancii: FILTER_DEFINITIONS.radio,
  antenny: FILTER_DEFINITIONS.radio,
  'povtoriteli-svyazi': FILTER_DEFINITIONS.radio,
  matchi: FILTER_DEFINITIONS.radio
};

const FILTERS_BY_CATEGORY = {
  videonablyudenie: [...FILTER_DEFINITIONS.cameras, ...FILTER_DEFINITIONS.recorders],
  domofoniya: FILTER_DEFINITIONS.intercom,
  'ip-telefony': [...FILTER_DEFINITIONS.ipPhones, ...FILTER_DEFINITIONS.ats],
  'setevoe-oborudovanie': FILTER_DEFINITIONS.activeNetwork,
  'passivnoe-setevoe': [...FILTER_DEFINITIONS.twistedPair, ...FILTER_DEFINITIONS.patchCords, ...FILTER_DEFINITIONS.outlets],
  'servernye-shkafi': FILTER_DEFINITIONS.cabinets,
  garnitura: FILTER_DEFINITIONS.headsets,
  radiooborudovanie: FILTER_DEFINITIONS.radio,
  'istochniki-besperebojnogo-pitaniya': FILTER_DEFINITIONS.ups
};

export const CAMERA_TYPE_OPTIONS = [
  { label: 'Купольная', value: 'Купольная' },
  { label: 'Цилиндрическая', value: 'Цилиндрическая' },
  { label: 'Поворотная (PTZ)', value: 'Поворотная (PTZ)' },
  { label: 'Wi-Fi', value: 'Wi-Fi' }
];

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function getProductText(product = {}) {
  return [product.title, product.description, product.brand, product.brand_name, product.name, product.fullName]
    .filter(Boolean)
    .join(' ');
}

function uniqueDefinitions(definitions = []) {
  const seen = new Set();
  return definitions.filter((definition) => {
    if (seen.has(definition.key)) return false;
    seen.add(definition.key);
    return true;
  });
}

export function getFilterDefinitions(activeCategory = '', activeSubcategory = 'all') {
  if (activeSubcategory && activeSubcategory !== 'all' && FILTERS_BY_SUBCATEGORY[activeSubcategory]) {
    return FILTERS_BY_SUBCATEGORY[activeSubcategory];
  }

  if (activeCategory && FILTERS_BY_SUBCATEGORY[activeCategory]) {
    return FILTERS_BY_SUBCATEGORY[activeCategory];
  }

  return uniqueDefinitions(FILTERS_BY_CATEGORY[activeCategory] || []);
}

function knownBrand(product = {}) {
  const directBrand = product.brand || product.brand_name;
  if (directBrand && String(directBrand).trim()) return String(directBrand).trim();

  const fullText = getProductText(product);
  const normalized = normalizeText(fullText);
  for (const brand of COMMON_BRANDS) {
    if (normalized.includes(normalizeText(brand))) return brand;
  }

  const commaParts = String(product.description || product.fullName || '').split(',').map((part) => part.trim());
  const candidate = commaParts.find((part, index) => index > 0 && /^[A-Za-z0-9& -]{2,24}$/.test(part));
  return candidate || 'Другие';
}

export function getProductBrand(product = {}) {
  return knownBrand(product);
}

function hasPositive(text, positive, negative = []) {
  if (negative.some((pattern) => pattern.test(text))) return false;
  return positive.some((pattern) => pattern.test(text));
}

export function getProductResolution(product = {}) {
  const text = normalizeText(getProductText(product));
  const explicitMatch = text.match(/(\d+)\s*мп|(\d+)\s*мегапикс|([0-9]+)\s*mp/);

  if (explicitMatch) {
    const val = explicitMatch[1] || explicitMatch[2] || explicitMatch[3];
    const normalized = `${val} Мп`;
    if (['2 Мп', '3 Мп', '4 Мп', '5 Мп', '6 Мп', '8 Мп'].includes(normalized)) return normalized;
  }

  if (/4k|4к/.test(text)) return '4 Мп';
  if (/5k|5к/.test(text)) return '5 Мп';
  if (/6k|6к/.test(text)) return '6 Мп';
  if (/8k|8к/.test(text)) return '8 Мп';
  return '';
}

export function matchesCameraType(product = {}, cameraType = '') {
  const text = normalizeText(getProductText(product));

  switch (cameraType) {
    case 'Купольная':
      return text.includes('купол') || /\bdome\b/.test(text);
    case 'Цилиндрическая':
      return text.includes('цилиндр') || text.includes('bullet');
    case 'Поворотная (PTZ)':
      return text.includes('поворот') || text.includes('ptz') || text.includes('птз');
    case 'Wi-Fi':
      return text.includes('wi-fi') || text.includes('wifi') || text.includes('беспроводн');
    default:
      return false;
  }
}

export function extractChannelFromTitle(title = '') {
  const normalizedTitle = String(title || '').toLowerCase();
  if (!normalizedTitle) return null;

  const channelCandidates = [
    /ds[-\s]*(\d{4})/i,
    /nvr[-\s]*(\d{3,4})/i,
    /dhi[-\s]*nvr(\d{4})/i,
    /(\d{1,2})(?:\s*канал|\s*channel)s?/i
  ];

  for (const pattern of channelCandidates) {
    const match = normalizedTitle.match(pattern);
    if (!match) continue;

    const code = String(match[1] || '').replace(/\D/g, '');
    if (!code) continue;

    const tail = code.slice(-2);
    if (['04', '08', '16', '32', '64'].includes(tail)) return tail.startsWith('0') ? tail.slice(1) : tail;

    const raw = code.replace(/^0+/, '');
    if (['4', '8', '16', '32', '64'].includes(raw)) return raw;
  }

  return null;
}

export function hasChannelCount(title = '', channel = '') {
  const extracted = extractChannelFromTitle(title);
  if (extracted) return extracted === String(channel);
  return String(title || '').toLowerCase().includes(String(channel).toLowerCase());
}

export function getProductFilterValues(product = {}, key = '') {
  const text = normalizeText(getProductText(product));
  const originalText = getProductText(product);
  const values = [];

  switch (key) {
    case 'brand':
      return [knownBrand(product)].filter(Boolean);
    case 'cameraType':
      return ['Купольная', 'Цилиндрическая', 'Поворотная (PTZ)', 'Wi-Fi'].filter((value) => matchesCameraType(product, value));
    case 'resolution':
      return [getProductResolution(product)].filter(Boolean);
    case 'channels':
      return ['4', '8', '16', '32', '64'].filter((value) => {
        const hasInSpecs = product.specs?.channels && String(product.specs.channels).includes(value);
        return hasInSpecs || hasChannelCount(product.title, value);
      });
    case 'signalType':
      if (/\bip\b|ip[-\s]/i.test(originalText)) values.push('IP');
      if (/аналог|analog|ahd|tvi|cvi|cvbs/i.test(originalText)) values.push('Аналоговая');
      return values;
    case 'poe':
      return [hasPositive(text, [/poe/], [/без\s*poe/, /non[-\s]?poe/]) ? 'Да' : 'Нет'];
    case 'wifi':
      return [hasPositive(text, [/wi-?fi/, /wifi/, /беспроводн/], [/без\s*wi-?fi/, /no\s*wi-?fi/]) ? 'Да' : 'Нет'];
    case 'lanSpeed':
    case 'uplinkSpeed':
      if (/10\s*g|10g|10000/.test(text)) values.push('10G');
      if (/2[.,]?5\s*g|2500/.test(text)) values.push('2.5G');
      if (/1000|gigabit|gbe|гигабит/.test(text)) values.push('Gigabit');
      if (/10\/100|100\s*мбит|100m\b/.test(text)) values.push('10/100');
      return values;
    case 'headsetSupport':
      return [hasPositive(text, [/гарнитур|headset|rj9|3[.,]5\s*мм/], [/без\s*гарнитур/]) ? 'Да' : 'Нет'];
    case 'blf':
      return [text.includes('blf') ? 'Да' : 'Нет'];
    case 'accounts': {
      const match = text.match(/(\d+)\s*(sip[-\s]*)?(аккаунт|профил|линий|линии|линия)/);
      return match ? [match[1]] : [];
    }
    case 'users': {
      const match = text.match(/(\d+)\s*(пользовател|абонент|user|users)/);
      return match ? [match[1]] : [];
    }
    case 'connector':
      if (/usb-c|type-c|type c/.test(text)) values.push('USB-C');
      if (/\busb\b/.test(text)) values.push('USB');
      if (/rj9\/qd/.test(text)) values.push('RJ9/QD');
      else if (/rj9/.test(text)) values.push('RJ9');
      if (/3[.,]5\s*мм|jack/.test(text)) values.push('3.5 мм jack');
      if (/bluetooth|блютуз/.test(text)) values.push('Bluetooth');
      return values;
    case 'headsetEar':
      if (/стерео|stereo|binaural/.test(text)) values.push('Стерео');
      if (/моно|mono|monaural/.test(text)) values.push('Моно');
      return values;
    case 'noiseCancel':
      return [hasPositive(text, [/шумоподав|noise cancel|nc\b/], [/без\s*шумоподав/]) ? 'Да' : 'Нет'];
    case 'management':
      if (/неуправляем/.test(text)) return ['Неуправляемый'];
      if (/управляем/.test(text)) return ['Управляемый'];
      return [];
    case 'rackMount':
      return [hasPositive(text, [/стоечн|в\s*стойк|rack/], [/настольн/]) ? 'Да' : 'Нет'];
    case 'conductor':
      if (/биметалл/.test(text)) values.push('Биметалл');
      if (/\bcca\b|омедн/.test(text)) values.push('CCA');
      if (/\bccs\b/.test(text)) values.push('CCS');
      if (/\bcu\b|медь|медн|чистой меди/.test(text)) values.push('Медь');
      return values;
    case 'cableCat': {
      const matches = originalText.match(/cat\.?\s*(3|5e|6a|6|7)/ig) || [];
      return [...new Set(matches.map((item) => `Cat.${item.toLowerCase().replace(/cat\.?\s*/i, '').toUpperCase().replace('5E', '5e')}`))];
    }
    case 'shielding':
      return ['SFTP', 'FTP', 'UTP'].filter((value) => text.includes(value.toLowerCase()));
    case 'diameter': {
      const matches = originalText.match(/0[.,]\d{2,3}\s*мм/ig) || [];
      return [...new Set(matches.map((item) => item.replace(/\s*мм/i, '').replace(',', '.')))];
    }
    case 'length': {
      const matches = originalText.match(/\b\d+[.,]?\d*\s*м\b/ig) || [];
      return [...new Set(matches.map((item) => item.replace(/\s*м/i, ' м').replace(',', '.')))].slice(0, 4);
    }
    case 'modulesCount': {
      const match = text.match(/(\d+)\s*(модул|порт|гнезд)/);
      return match ? [match[1]] : [];
    }
    case 'outletType':
      if (/внутрен|скрыт/.test(text)) values.push('Внутренняя');
      if (/наклад|настенн/.test(text)) values.push('Накладная');
      if (/keystone/.test(text)) values.push('Keystone');
      return values;
    case 'cabinetU': {
      const match = originalText.match(/(\d{1,2})\s*u\b/i) || originalText.match(/(\d{1,2})\s*юнит/i);
      return match ? [`${match[1]}U`] : [];
    }
    case 'perforation':
      return [hasPositive(text, [/перфор/], [/не\s*перфор/]) ? 'Да' : 'Нет'];
    case 'cabinetSize': {
      const match = originalText.match(/\b\d{3,4}\s*[xх*]\s*\d{3,4}(?:\s*[xх*]\s*\d{3,4})?\b/i);
      return match ? [match[0].replace(/\s+/g, '')] : [];
    }
    case 'frequency': {
      const matches = originalText.match(/\d{2,4}(?:[.,]\d+)?\s*(?:мгц|mhz|ггц|ghz)/ig) || [];
      return [...new Set(matches.map((item) => item.replace(/\s+/g, ' ')))];
    }
    case 'power': {
      const matches = originalText.match(/\d+(?:[.,]\d+)?\s*(?:вт|w|ватт)/ig) || [];
      return [...new Set(matches.map((item) => item.replace(/\s+/g, ' ')))];
    }
    case 'powerRange': {
      const match = text.match(/(\d+(?:[.,]\d+)?)\s*(квт|kw|вт|w)/);
      if (!match) return [];
      const raw = Number(match[1].replace(',', '.'));
      const watts = /квт|kw/.test(match[2]) ? raw * 1000 : raw;
      if (watts < 1000) return ['до 1000 Вт'];
      if (watts <= 3000) return ['1000-3000 Вт'];
      return ['3000+ Вт'];
    }
    case 'usb':
      return [/\busb\b/.test(text) ? 'Да' : 'Нет'];
    case 'upsExecution':
      if (/on[-\s]?line|онлайн/.test(text)) return ['On-Line'];
      if (/line[-\s]?interactive|avr|линейно/.test(text)) return ['Line-Interactive'];
      return ['Резервный'];
    case 'batteryIncluded':
      return [/(бат\.?|батаре)/.test(text) && !/без\s*бат/.test(text) ? 'Да' : 'Нет'];
    case 'upsType':
      if (/тр[её]хфаз|3\s*фаз/.test(text)) return ['Трехфазный'];
      if (/однофаз|1\s*фаз/.test(text)) return ['Однофазный'];
      return [];
    default:
      return [];
  }
}

export function productMatchesFilter(product, key, selectedValues = []) {
  if (!selectedValues.length) return true;
  const values = getProductFilterValues(product, key);
  return selectedValues.some((value) => values.includes(value));
}
