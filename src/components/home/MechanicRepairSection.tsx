
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wrench, Car } from 'lucide-react';

const MechanicRepairSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 font-heading">
              Expert Auto Repairs at Your <span className="text-quickfix-orange">Doorstep</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Our team of certified mechanics brings years of experience and expertise right to your location. From basic maintenance to complex repairs, we handle it all with precision and care.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="mr-4 bg-quickfix-light-blue p-2 rounded-full">
                  <Wrench className="text-quickfix-blue h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Professional Diagnostics</h3>
                  <p className="text-gray-600">Our mechanics use advanced diagnostic tools to accurately identify issues.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-quickfix-light-blue p-2 rounded-full">
                  <Car className="text-quickfix-blue h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Genuine Parts</h3>
                  <p className="text-gray-600">We only use high-quality, manufacturer-approved replacement parts.</p>
                </div>
              </div>
            </div>
            
            <Button asChild className="bg-quickfix-blue hover:bg-quickfix-blue/90 text-white">
              <Link to="/services" className="flex items-center">
                Explore Our Services <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="relative order-first md:order-last">
            <div className="relative z-10 rounded-lg shadow-xl overflow-hidden">
              <img 
                src="/lovable-uploads/7236feb8-e9ef-43d3-9100-9cdf7f9de7b0.png" 
                alt="Mechanic repairing a car"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-quickfix-orange/10 rounded-full"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-quickfix-blue/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MechanicRepairSection;
