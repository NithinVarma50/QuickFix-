import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HowItWorks from '@/components/home/HowItWorks';
import ServiceAreas from '@/components/home/ServiceAreas';
import CTASection from '@/components/home/CTASection';
import MechanicRepairSection from '@/components/home/MechanicRepairSection';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog';

const Index: React.FC = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    if (!showAnnouncement) return;
    const timer = setTimeout(() => setShowAnnouncement(false), 12000);
    return () => clearTimeout(timer);
  }, [showAnnouncement]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {showAnnouncement && (
          <AlertDialog open={showAnnouncement}>
            <AlertDialogContent className="max-w-md mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>🎉 New Offer!</AlertDialogTitle>
                <AlertDialogDescription>
                  Refer a friend & get <span className="font-bold text-green-600">₹100</span> when they book a repair!<br/>
                  <span className="text-xs text-gray-500">Limited time only. Both you and your friend must complete a booking.</span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogAction onClick={() => setShowAnnouncement(false)} className="w-full mt-2">Got it!</AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <HeroSection />
        <ServicesSection />
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
