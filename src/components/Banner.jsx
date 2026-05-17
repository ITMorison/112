export default function Banner({ title, subtitle, badge, bgColor = 'bg-indigo-600', textColor = 'text-white', small = false, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`${bgColor} ${textColor} rounded-2xl overflow-hidden relative flex flex-col justify-end p-5 h-full min-h-[180px] cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300`}
      onClick={handleClick}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-6 right-6 w-28 h-28 rounded-full bg-white/30" />
        <div className="absolute bottom-10 right-16 w-16 h-16 rounded-full bg-white/20" />
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
      </div>

      {badge && (
        <span className="absolute top-5 left-5 bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full z-10 tracking-wide">
          {badge}
        </span>
      )}

      <div className="relative z-10">
        <p className={`font-bold leading-tight ${small ? 'text-[15px]' : 'text-[22px]'}`}>{title}</p>
        {subtitle && <p className={`mt-1.5 opacity-90 ${small ? 'text-[12px]' : 'text-[14px]'}`}>{subtitle}</p>}
        <button 
          className="mt-4 inline-block bg-white text-slate-900 font-semibold text-[12px] px-5 py-2 rounded-full hover:scale-105 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Подробнее →
        </button>
      </div>
    </div>
  );
}
