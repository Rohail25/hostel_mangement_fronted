import Header from '../components/Header'
import Footer from '../components/Footer'

const ZostelPlus = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="container mx-auto px-6 py-16 flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Zostel Plus</h1>
                <p className="text-gray-600">Premium stays with extra comfort. Details coming soon.</p>
            </main>
            <Footer />
        </div>
    )
}

export default ZostelPlus


