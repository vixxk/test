import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import PartnersBar from '../components/home/PartnersBar';
import ExplorePandals from '../components/home/ExplorePandals';
import ExperienceFeatures from '../components/home/ExperienceFeatures';
import MembershipPlans from '../components/home/MembershipPlans';
import VRStoreSection from '../components/home/VRStoreSection';
import Testimonials from '../components/home/Testimonials';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-rudhvi-dark text-white">
      <Navbar variant="dark" />
      <HeroSection />
      <PartnersBar />
      <ExplorePandals />
      <ExperienceFeatures />
      <MembershipPlans />
      <VRStoreSection />
      <Testimonials />
      <Footer variant="dark" />
    </div>
  );
}
