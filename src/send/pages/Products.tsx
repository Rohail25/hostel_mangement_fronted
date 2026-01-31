import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductsHero from '../components/products/ProductsHero';
import StayCategories from '../components/products/StayCategories';
import RoomOptions from '../components/products/RoomOptions';
import FeaturedHotels from '../components/products/FeaturedHotels';

const Products = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1">
                <ProductsHero />
                <StayCategories />
                <RoomOptions />
                <FeaturedHotels />
            </main>
            <Footer />
        </div>
    );
};

export default Products;

