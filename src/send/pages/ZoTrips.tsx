import Header from '../components/Header'
import Footer from '../components/Footer'

const ZoTrips = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="container mx-auto px-6 py-16 flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Zo Trips</h1>
                <p className="text-gray-600">Curated itineraries and experiences. Trips coming soon.</p>
            </main>
            <Footer />
        </div>
    )
}

export default ZoTrips


