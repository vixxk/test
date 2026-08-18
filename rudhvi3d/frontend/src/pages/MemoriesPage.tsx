import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MemoriesHero from '../components/memories/MemoriesHero';
import HowItWorks from '../components/memories/HowItWorks';
import MemoryPricing from '../components/memories/MemoryPricing';
import DemoGallery from '../components/memories/DemoGallery';
import TrustBadges from '../components/memories/TrustBadges';

export default function MemoriesPage() {
  return (
    <div className="min-h-screen bg-rudhvi-cream text-gray-900">
      <Navbar variant="light" />
      <MemoriesHero />
      <HowItWorks />
      <MemoryPricing />
      <DemoGallery />
      <TrustBadges />
      <Footer variant="light" />
    </div>
  );
}
