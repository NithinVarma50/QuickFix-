import React, { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HowItWorks from '@/components/home/HowItWorks';
import ServiceAreas from '@/components/home/ServiceAreas';
import CTASection from '@/components/home/CTASection';
import MechanicRepairSection from '@/components/home/MechanicRepairSection';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '919381904726';

function getReferralMessage(name: string, phone: string, code: string) {
  return `Hey QuicFix team, I want to register as a referrer!%0A%0AName: ${name}%0APhone: ${phone}%0APreferred Referral Code: ${code}%0A%0ALet me know once it's active!`;
}

const Index: React.FC = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [refName, setRefName] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showAnnouncement) return;
    const timer = setTimeout(() => setShowAnnouncement(false), 12000);
    return () => clearTimeout(timer);
  }, [showAnnouncement]);

  const handleReferralClick = () => setShowReferralDialog(true);
  const handleSendReferral = () => {
    const code = refName ? `QFX${refName.replace(/\s+/g, '')}` : '';
    const msg = `Hey QuicFix team, I want to register as a referrer!%0A%0AName: ${refName}%0APhone: ${refPhone}%0APreferred Referral Code: ${code}%0A%0ALet me know once it's active!`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    window.open(url, '_blank');
    setShowReferralDialog(false);
    setRefName(''); setRefPhone('');
  };

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
        {/* Referral Button */}
        <div className="flex justify-center mt-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow" onClick={() => setShowReferralDialog(true)}>
            Refer & Earn ₹100 – Register Now
          </Button>
        </div>
        {/* Referral Dialog */}
        <AlertDialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
          <AlertDialogContent className="max-w-md mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Register as a Referrer</AlertDialogTitle>
              <AlertDialogDescription>
                Enter your details to register as a referrer. We’ll contact you on WhatsApp!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                window.open(getReferralLink(), '_blank');
                setShowReferralDialog(false);
              }}
              className="space-y-3"
            >
              <input
                ref={nameInputRef}
                type="text"
                required
                placeholder="Full Name"
                className="w-full border rounded px-3 py-2"
                value={refName}
                onChange={e => setRefName(e.target.value)}
                autoFocus
              />
              <input
                type="tel"
                required
                placeholder="WhatsApp Number"
                className="w-full border rounded px-3 py-2"
                value={refPhone}
                onChange={e => setRefPhone(e.target.value)}
              />
              <AlertDialogAction asChild>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded">Register via WhatsApp</button>
              </AlertDialogAction>
            </form>
          </AlertDialogContent>
        </AlertDialog>
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
