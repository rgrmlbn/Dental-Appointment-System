import HeroSection from '../components/HeroSection.jsx';
import ServicesSection from '../components/ServicesSection.jsx';
import DoctorsPreview from '../components/DoctorsPreview.jsx';
import CTASection from '../components/CTASection.jsx';
import Footer from '../components/Footer.jsx';
const LandingPage = () => {
  return (
    <div className="landing-page [font-family:var(--font-body)] [color:#1A2F4E] [background:#fff] [overflow-x:hidden]">
      <HeroSection />
      <ServicesSection />
      <DoctorsPreview />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;