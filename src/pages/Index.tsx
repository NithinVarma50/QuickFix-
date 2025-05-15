import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HowItWorks from '@/components/home/HowItWorks';
import ServiceAreas from '@/components/home/ServiceAreas';
import CTASection from '@/components/home/CTASection';
import MechanicRepairSection from '@/components/home/MechanicRepairSection';
import Chatbot from '@/components/ui/chatbot';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <Chatbot />
        git add .        git add .        git add .        git add .        <ServicesSection />
        <HowItWorks />
        <MechanicRepairSection />
        <ServiceAreas />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
