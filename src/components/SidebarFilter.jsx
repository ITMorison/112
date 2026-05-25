import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { catalogStructure, categoryLabelMap } from '../../types';
import { getProductResolution, matchesCameraType } from './filterUtils';

function FilterSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 pb-2 transition-all duration-200 hover:border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-left transition-all duration-200 hover:bg-slate-50"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {isOpen && <div className="pb-3 space-y-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">{children}</div>}
    </div>
  );
}

function parseBrandFromTitle(title = '') {
  const brands = [
    'Hikvision', 'HiWatch', 'HiLook', 'Dahua', 'Imou', 'Tiandy',
    'Grandstream', 'Yealink', 'Fanvil', 'Cisco', 'Polycom', 'Snom',
    'Jabra', 'Plantronics', 'Sennheiser'
  ];

  const found = brands.find((brand) => title.toLowerCase().includes(brand.toLowerCase()));
  return found || 'Другие';
}

function hasChannelInTitle(title = '', channel = '') {
  const normalizedTitle = String(title || '').toLowerCase();
  if (!normalizedTitle) {
    return false;
  }

  if (normalizedTitle.includes(channel.toLowerCase())) {
    return true;
  }

  return false;
}

export default function SidebarFilter({
  products = [],
  categories = [],
  category = '',
  selectedCategories = [],
  onCategoryChange,
  selectedBrands = [],
  onBrandChange,
  selectedChannels = [],
  toggleChannel,
  selectedResolutions = [],
  onResolutionChange,
  selectedCameraTypes = [],
  onCameraTypeChange,
  onClose
}) {
  const channelOptions = ['4', '8', '16', '32', '64'];
  const resolutionOptions = ['2МП', '3МП', '4МП', '5МП', '6МП', '8МП'];
  const cameraTypeOptions = ['Купольная', 'Цилиндрическая', 'Поворотная (PTZ)', 'Wi-Fi'];

  const categoryContext = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return {
        type: 'unknown',
        title: categoryLabelMap[category] || category || 'Категория',
        topCategory: null,
        subcategory: null
      };
    }

    const topCategory = categories.find((item) => item.slug === category);
    if (topCategory) {
      return {
        type: 'category',
        title: topCategory.title,
        topCategory,
        subcategory: null
      };
    }

    for (const top of categories) {
      const subcategory = top.subcategories?.find((item) => item.slug === category);
      if (subcategory) {
        return {
          type: 'subcategory',
          title: subcategory.name || subcategory.title,
          topCategory: top,
          subcategory
        };
      }
    }

    return {
      type: 'unknown',
      title: categoryLabelMap[category] || category || 'Категория',
      topCategory: null,
      subcategory: null
    };
  }, [categories, category]);

  const currentFilterGroups = useMemo(() => {
    const uniqueFilters = new Set();

    if (categoryContext.type === 'subcategory' && categoryContext.topCategory) {
      const matchedCategory = catalogStructure.find((item) => item.category === categoryContext.topCategory.title);
      const matchedSubcategory = matchedCategory?.subcategories.find((sub) => sub.slug === categoryContext.subcategory?.slug);

      if (matchedSubcategory?.filters?.length) {
        matchedSubcategory.filters.forEach((filter) => uniqueFilters.add(filter));
      }
    }

    if (uniqueFilters.size === 0) {
      const matchedCategory = catalogStructure.find((item) => item.category === categoryContext.title);
      matchedCategory?.subcategories.forEach((sub) => {
        sub.filters.forEach((filter) => uniqueFilters.add(filter));
      });
    }

    return [...uniqueFilters];
  }, [categoryContext]);

  const availableBrands = useMemo(() => {
    const brandCounts = {};

    products.forEach((product) => {
      const brand = parseBrandFromTitle(product.title);
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    return Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const channelOptionsWithCounts = useMemo(() => {
    return channelOptions.map((num) => {
      const count = products.filter((product) => {
        const hasInSpecs = product.specs?.channels && String(product.specs.channels).includes(num);
        const hasInTitle = hasChannelInTitle(product.title, num);
        return hasInSpecs || hasInTitle;
      }).length;

      return { num, count };
    }).filter((item) => item.count > 0);
  }, [products]);

  const resolutionOptionsWithCounts = useMemo(() => {
    return resolutionOptions
      .map((value) => ({
        value,
        count: products.filter((product) => getProductResolution(product) === value).length
      }))
      .filter((item) => item.count > 0);
  }, [products]);

  const cameraTypeOptionsWithCounts = useMemo(() => {
    return cameraTypeOptions
      .map((value) => ({
        value,
        count: products.filter((product) => matchesCameraType(product, value)).length
      }))
      .filter((item) => item.count > 0);
  }, [products]);

  const toggleCategory = (slug) => {
    if (!onCategoryChange) return;

    onCategoryChange((current = []) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  };

  const toggleBrand = (brand) => {
    if (!onBrandChange) return;

    onBrandChange((current = []) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand]
    );
  };

  const toggleResolution = (value) => {
    if (!onResolutionChange) return;

    onResolutionChange((current = []) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const toggleCameraType = (value) => {
    if (!onCameraTypeChange) return;

    onCameraTypeChange((current = []) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const dynamicFilterGroups = useMemo(() => {
    const groups = [];

    currentFilterGroups.forEach((label) => {
      if (label === 'Бренд') {
        const options = availableBrands.map(([brand, count]) => ({ label: brand, value: brand, count }));
        if (options.length > 0) {
          groups.push({
            title: 'Бренды',
            options
          });
        }
        return;
      }

      if (label === 'Разрешение') {
        if (resolutionOptionsWithCounts.length > 0) {
          groups.push({
            title: 'Разрешение',
            options: resolutionOptionsWithCounts
          });
        }
        return;
      }

      if (label === 'Тип камеры') {
        if (cameraTypeOptionsWithCounts.length > 0) {
          groups.push({
            title: 'Тип камеры',
            options: cameraTypeOptionsWithCounts
          });
        }
        return;
      }

      if (label === 'Количество каналов' && channelOptionsWithCounts.length > 0) {
        groups.push({
          title: 'Количество каналов',
          options: channelOptionsWithCounts
        });
      }
    });

    return groups;
  }, [availableBrands, cameraTypeOptionsWithCounts, channelOptionsWithCounts, currentFilterGroups, resolutionOptionsWithCounts]);

  return (
    <div className="bg-white h-full flex flex-col">
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b border-slate-100 md:hidden">
          <span className="font-bold text-slate-900">Фильтры</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-0 custom-scrollbar">
        {categories.length > 0 && (
          <FilterSection title="Категории" defaultOpen={true}>
            <div className="space-y-1">
              {categories.map((cat) => (
                <div key={cat.slug} className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer py-1.5 px-2 hover:bg-indigo-50 rounded-lg transition-colors group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={() => toggleCategory(cat.slug)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-[13px] font-medium text-slate-700 group-hover:text-indigo-600 transition-colors flex-1">
                      {cat.title}
                    </span>
                  </label>

                  {cat.subcategories?.map((sub) => (
                    <label key={sub.slug} className="flex items-center gap-2 cursor-pointer py-1 ml-6 px-2 hover:bg-slate-50 rounded-lg transition-colors group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(sub.slug)}
                        onChange={() => toggleCategory(sub.slug)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600"
                      />
                      <span className="text-[12px] text-slate-500 group-hover:text-slate-900 flex-1">
                        — {sub.name || sub.title}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                        {products.filter((product) => product.subcategory === sub.slug).length}
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {dynamicFilterGroups.map((group) => (
          <FilterSection key={group.title} title={group.title} defaultOpen={group.title === 'Количество каналов'}>
            <div className="space-y-1">
              {group.options.map((option) => {
                const optionLabel = option.label ?? option.value ?? option.num;
                const checked =
                  group.title === 'Бренды'
                    ? selectedBrands.includes(optionLabel)
                    : group.title === 'Разрешение'
                      ? selectedResolutions.includes(optionLabel)
                      : group.title === 'Тип камеры'
                        ? selectedCameraTypes.includes(optionLabel)
                        : selectedChannels.includes(optionLabel);

                const onToggle =
                  group.title === 'Бренды'
                    ? () => toggleBrand(optionLabel)
                    : group.title === 'Разрешение'
                      ? () => toggleResolution(optionLabel)
                      : group.title === 'Тип камеры'
                        ? () => toggleCameraType(optionLabel)
                        : () => toggleChannel?.(optionLabel);

                return (
                  <label
                    key={optionLabel}
                    className="flex items-center gap-2 cursor-pointer py-1.5 px-2 hover:bg-slate-50 rounded-lg transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={onToggle}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                    />
                    <span className="text-[13px] text-slate-600 group-hover:text-slate-900 flex-1">
                      {group.title === 'Количество каналов' ? `${optionLabel} ${optionLabel === '4' ? 'канала' : 'каналов'}` : optionLabel}
                    </span>
                    {typeof option.count === 'number' && (
                      <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                        {option.count}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </FilterSection>
        ))}
      </div>

      {onClose && (
        <div className="p-4 border-t border-slate-100 md:hidden">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-all"
          >
            Применить
          </button>
        </div>
      )}
    </div>
  );
}