
import React from 'react';
import { MapPin } from 'lucide-react';

const locations = [
  "Hitech City", 
  "Gachibowli", 
  "Kukatpally", 
  "Madhapur", 
  "Jubilee Hills", 
  "Banjara Hills", 
  "Secunderabad", 
  "Begumpet", 
  "Ameerpet", 
  "KPHB",
  "Shamshabad",
  "Kondapur"
];

const ServiceAreas: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4">Service Areas in Hyderabad</h2>
              <p className="text-lg text-gray-600 mb-6">
                QuickFix currently serves the vibrant city of Hyderabad. Our mobile mechanics cover all major areas to ensure you get prompt service no matter where you are.
              </p>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {locations.map((location, index) => (
                  <div key={index} className="flex items-center">
                    <MapPin className="h-5 w-5 text-quickfix-orange mr-2" />
                    <span>{location}</span>
                  </div>
                ))}
              </div>
              
              <p className="mt-6 text-gray-600">
                Don't see your area? Contact us to check if we can serve your location.
              </p>
            </div>
            
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1599378900671-3a60f30fdcfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Map of Hyderabad showing service areas"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold">Hyderabad Coverage</h3>
                    <p>Serving all major areas in the city</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
