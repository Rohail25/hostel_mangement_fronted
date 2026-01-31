import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroBanner from '../components/home/HeroBanner';
import WhatsNew from '../components/home/WhatsNew';
import Services from '../components/home/Services';
import Destinations from '../components/home/Destinations';
import MountainExperiences from '../components/home/MountainExperiences';
import LongStays from '../components/home/LongStays';
import DiscoverWorld from '../components/home/DiscoverWorld';
import LimitedTimeOffers from '../components/home/LimitedTimeOffers';
import ZostelHomes from '../components/home/ZostelHomes';
import TripsSellingOutFast from '../components/home/TripsSellingOutFast';
import DestinationCarousel from '../components/home/DestinationCarousel';
import PartyEscapes from '../components/home/PartyEscapes';
import TopTripsForYou from '../components/home/TopTripsForYou';
import BudgetFriendly from '../components/home/BudgetFriendly';
import TravelReads from '../components/home/TravelReads';
import PartnerWithZoWorld from '../components/home/PartnerWithZoWorld';
import {
  hotelImages,
  hotelCards,
  pakistanDestinations,
  filterCategories,
  mountainExperiences,
  longStayProperties,
  discoverProperties,
  propertyTypes,
  limitedTimeOffers,
  zostelHomes,
  tripsSellingOutFast,
  winterWanderlist,
  trendingNow,
  exploreOffbeat,
  partyEscapes,
  topTripsForYou,
  weekendEscapes,
  budgetFriendly,
  lastMinuteEscapes,
  travelReads,
} from '../components/home/homeData';

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <HeroBanner images={hotelImages} />
      <Services />
      <WhatsNew hotelCards={hotelCards} />
      <Destinations destinations={pakistanDestinations} filterCategories={filterCategories} />
      <MountainExperiences experiences={mountainExperiences} />
      <LongStays properties={longStayProperties} />
      <DiscoverWorld properties={discoverProperties} propertyTypes={propertyTypes} />
      <LimitedTimeOffers mainOffer={limitedTimeOffers.mainOffer} destinations={limitedTimeOffers.destinations} />
      <ZostelHomes homes={zostelHomes} />
      <TripsSellingOutFast trips={tripsSellingOutFast} />
      <DestinationCarousel title="Winter Wanderlist" destinations={winterWanderlist} />
      <DestinationCarousel title="Trending Now" destinations={trendingNow} />
      <DestinationCarousel title="Explore Offbeat" destinations={exploreOffbeat} />
      <PartyEscapes escapes={partyEscapes as Array<{ id: number; name: string; location: string; price: string; image: string; badgeType: 'snowflake' | 'shopping' }>} />
      <TopTripsForYou trips={topTripsForYou} />
      <DestinationCarousel title="Weekend Escapes" destinations={weekendEscapes} />
      <BudgetFriendly properties={budgetFriendly} />
      <DestinationCarousel title="Last Minute Escapes" destinations={lastMinuteEscapes} />
      <TravelReads reads={travelReads} />
      <PartnerWithZoWorld />
      <Footer />
    </div>
  );
};

export default Home;
