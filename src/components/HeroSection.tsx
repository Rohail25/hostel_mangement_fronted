import SearchBar from './SearchBar';

const HeroSection = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <div className="w-24 h-24 border-4 border-white rounded-full"></div>
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <div className="w-32 h-32 border-4 border-white rounded-full"></div>
      </div>
      <div className="absolute top-1/4 right-1/4 opacity-20">
        <div className="w-16 h-16 border-4 border-white rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 italic tracking-wider drop-shadow-2xl">
            Live it. Now
          </h1>
        </div>

        {/* Search Bar Component */}
        <SearchBar />
      </div>
    </section>
  );
};

export default HeroSection;

