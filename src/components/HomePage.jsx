import HeroSection from './HeroSection';
import WhyChooseUs from './WhyChooseUs';

export default function HomePage({
  activeCategory,
  onCategoryFilter,
  onCatalogClick,
  onCategoryClick
}) {
  const handleViewCatalog = () => {
    if (onCatalogClick) {
      onCatalogClick();
    }
  };

  return (
    <main>
      <HeroSection 
        onCatalogClick={handleViewCatalog}
        onCategoryClick={onCategoryClick}
        onCategoryFilter={onCategoryFilter}
      />
      <WhyChooseUs />
    </main>
  );
}
