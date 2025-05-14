
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HowItWorks from '@/components/home/HowItWorks';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ServiceAreas from '@/components/home/ServiceAreas';
import CTASection from '@/components/home/CTASection';
import MechanicSection from '@/components/home/MechanicSection';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ServicesSection />
        <HowItWorks />
        <MechanicSection />
        <TestimonialsSection />
        <ServiceAreas />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
