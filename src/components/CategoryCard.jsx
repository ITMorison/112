export default function CategoryCard({ image, title, count, slug, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick(slug);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center bg-white border-0 rounded-2xl p-4 gap-2.5 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group cursor-pointer overflow-hidden"
    >
      <div className="w-full h-16 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <p className="text-[12px] md:text-[13px] font-medium text-slate-700 text-center leading-tight mt-1 group-hover:text-indigo-600 transition-colors">{title}</p>
      {count && <p className="text-[11px] text-indigo-500 font-medium">{count} товаров</p>}
    </button>
  );
}
