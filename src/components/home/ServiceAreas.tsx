
import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const locations = ["Hitech City", "Gachibowli", "Kukatpally", "Madhapur", "Jubilee Hills", "Banjara Hills", "Secunderabad", "Begumpet", "Ameerpet", "KPHB", "Shamshabad", "Kondapur"];

const ServiceAreas: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4">Service Areas in Hyderabad</h2>
              <p className="text-lg text-gray-600 mb-6">
                QuickFix currently serves the vibrant city of Hyderabad. Our mobile mechanics cover all major areas to ensure you get prompt service no matter where you are.
              </p>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {locations.map((locationName, index) => (
                  <div key={index} className="flex items-center">
                    <MapPin className="h-5 w-5 text-quickfix-orange mr-2" />
                    <span>{locationName}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 text-quickfix-orange mr-2" />
                  <span className="font-medium">Call us at: +91 7337243180</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">24/7 Service Available</h3>
                <p className="text-gray-600 mb-6">
                  Our mobile mechanics are ready to help you anytime, anywhere in Hyderabad.
                </p>
                <div className="bg-quickfix-light-blue p-6 rounded-lg shadow-md">
                  <div className="text-4xl font-bold text-quickfix-blue mb-2">12+</div>
                  <div className="text-sm text-gray-600">Service Areas Covered</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hyderabad Service Areas Map */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Our Service Coverage in Hyderabad</h3>
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <img 
                  src="/lovable-uploads/c9d4e9bb-b3ea-4595-9b75-1108b5f42367.png" 
                  alt="QuickFix Service Areas in Hyderabad" 
                  className="object-cover w-full h-full" 
                />
              </AspectRatio>
            </div>
            <p className="text-center text-gray-500 mt-4">
              We provide service across all highlighted areas in Hyderabad
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
