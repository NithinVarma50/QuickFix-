import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Shield, Star } from 'lucide-react';
const HeroSection: React.FC = () => {
  return <div className="relative bg-gradient-to-br from-white to-quickfix-light-blue overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="z-10 animate-slide-right">
            <h1 className="text-4xl md:text-5xl font-bold text-quickfix-dark mb-4 font-heading">
              Vehicle Repairs at Your <span className="text-quickfix-orange">Doorstep</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              QuickFix revolutionizes vehicle maintenance with certified mechanics who come to you. Same-day service available throughout Hyderabad.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="bg-quickfix-blue hover:bg-quickfix-blue/90 text-white">
                <Link to="/booking">
                  Book a Service <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-quickfix-blue text-quickfix-blue hover:bg-quickfix-light-blue">
                <Link to="/services">
                  Our Services
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full shadow-md mr-3">
                  <Clock className="h-5 w-5 text-quickfix-orange" />
                </div>
                <span className="font-medium">Same-Day Service</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full shadow-md mr-3">
                  <Shield className="h-5 w-5 text-quickfix-orange" />
                </div>
                <span className="font-medium">Certified Mechanics</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full shadow-md mr-3">
                  <Star className="h-5 w-5 text-quickfix-orange" />
                </div>
                <span className="font-medium">5-Star Service</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 rounded-lg shadow-xl overflow-hidden max-w-md mx-auto">
              <img alt="Mechanic repairing a car" className="w-full h-auto" src="/lovable-uploads/466290a8-6fb0-4d58-9e30-6a1de3da28b0.jpg" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-quickfix-orange/20 rounded-full blur-xl"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-quickfix-blue/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Booking banner */}
      <div className="bg-quickfix-blue py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-5 md:mb-0 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Need emergency vehicle repair?</h2>
              <p className="text-blue-100">Our mechanics can be at your location within minutes</p>
            </div>
            <Button asChild className="bg-white text-quickfix-blue hover:bg-gray-100" size="lg">
              <Link to="/booking">Book Emergency Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;