export const VIDEO_BRANDS = ['Hikvision', 'HiWatch', 'HiLook', 'Dahua', 'Imou', 'Tiandy'];

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

export function getProductBrand(product = {}) {
  const text = normalizeText(getProductText(product));

  for (const brand of VIDEO_BRANDS) {
    if (text.includes(normalizeText(brand))) {
      return brand;
    }
  }

  const directBrand = product.brand || product.brand_name;
  if (directBrand && String(directBrand).trim()) {
    return String(directBrand).trim();
  }

  return '';
}

export function getProductResolution(product = {}) {
  const text = normalizeText(getProductText(product));
  const explicitMatch = text.match(/(\d+)\s*мп|([0-9]+)\s*mp/);

  if (explicitMatch) {
    const val = explicitMatch[1] || explicitMatch[2];
    const normalized = `${val}МП`;
    if (['2МП', '3МП', '4МП', '5МП', '6МП', '8МП'].includes(normalized)) {
      return normalized;
    }
  }

  if (/4k|4к/.test(text)) {
    return '4МП';
  }

  if (/5k|5к/.test(text)) {
    return '5МП';
  }

  if (/6k|6к/.test(text)) {
    return '6МП';
  }

  if (/8k|8к/.test(text)) {
    return '8МП';
  }

  return '';
}

export function matchesCameraType(product = {}, cameraType = '') {
  const text = normalizeText(getProductText(product));

  switch (cameraType) {
    case 'Купольная':
      return text.includes('куполь') || text.includes('купольная');
    case 'Цилиндрическая':
      return text.includes('цилиндр');
    case 'Поворотная (PTZ)':
      return text.includes('поворот') || text.includes('ptz') || text.includes('птз');
    case 'Wi-Fi':
      return text.includes('wi-fi') || text.includes('wifi') || text.includes(' беспроводн') || text.includes(' беспроводная');
    default:
      return false;
  }
}
