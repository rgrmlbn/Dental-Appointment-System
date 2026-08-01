import HeroSection from '../components/HeroSection.jsx';
import ServicesSection from '../components/ServicesSection.jsx';
import DoctorsPreview from '../components/DoctorsPreview.jsx';
import CTASection from '../components/CTASection.jsx';
import Footer from '../components/Footer.jsx';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <HeroSection />
      <ServicesSection />
      <DoctorsPreview />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;