import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import HeroSection from '../components/HeroSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PromoBanner />
      <HeroSection />
    </div>
  );
};

export default Home;

