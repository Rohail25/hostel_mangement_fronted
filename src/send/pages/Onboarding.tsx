import Footer from '../components/Footer'
import Header from '../components/Header'
import AutomationHighlights from '../components/onboarding/AutomationHighlights'
import CoreFacilities from '../components/onboarding/CoreFacilities'
import DashboardModules from '../components/onboarding/DashboardModules'
import FinalCta from '../components/onboarding/FinalCta'
import GuidedTour from '../components/onboarding/GuidedTour'
import Hero from '../components/onboarding/Hero'
import SupportAssurances from '../components/onboarding/SupportAssurances'
import WhyChooseHotling from '../components/onboarding/WhyChooseHotling'
import {
    automationHighlights,
    coreFacilities,
    dashboardModules,
    onboardingJourney,
    ownerCapabilities,
    ownerDeliverables,
    supportAssurances,
    whyChooseHotling,
} from '../data/onboarding'

const Onboarding = () => {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1">
                <Hero deliverables={ownerDeliverables} capabilities={ownerCapabilities} />
                <CoreFacilities facilities={coreFacilities} />
                <WhyChooseHotling reasons={whyChooseHotling} />
                <DashboardModules modules={dashboardModules} />
                <GuidedTour />
                <AutomationHighlights highlights={automationHighlights} />
                <SupportAssurances assurances={supportAssurances} journey={onboardingJourney} />
                <FinalCta />
            </main>
            <Footer />
        </div>
    )
}

export default Onboarding

