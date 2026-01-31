const PromoBanner = () => {
  return (
    <div className="bg-yellow-300 border-b border-yellow-400 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)`
      }}></div>

      <div className="container mx-auto px-4 py-2 relative z-10">
        <div className="flex flex-row items-center justify-center gap-3 whitespace-nowrap">
          <p className="text-gray-900 font-semibold text-sm">
            Lowest Price for a week - Don't Miss Out!
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-all shadow-md">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;

