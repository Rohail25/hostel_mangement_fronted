const PromoBanner = () => {
  return (
    <div className="bg-linear-to-r from-primary-50 to-secondary-50 border-b border-primary-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-2xl">🎉</span>
          <p className="text-gray-800 font-medium text-center">
            Special Offer: Book Now and Save up to 30% - Limited Time Only!
          </p>
          <button className="px-6 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-full font-medium hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-blue-md">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;

