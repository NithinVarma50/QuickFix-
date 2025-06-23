
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Zap, Clock, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const locations = ["Hitech City", "Gachibowli", "Kukatpally", "Madhapur", "Jubilee Hills", "Banjara Hills", "Secunderabad", "Begumpet", "Ameerpet", "KPHB", "Shamshabad", "Kondapur"];

const serviceStats = [
  { icon: Zap, label: "Services Completed", value: "1,247", color: "text-green-500" },
  { icon: Clock, label: "Avg Response Time", value: "23 min", color: "text-blue-500" },
  { icon: Star, label: "Customer Rating", value: "4.8/5", color: "text-yellow-500" },
  { icon: TrendingUp, label: "Growth Rate", value: "+34%", color: "text-purple-500" }
];

const ServiceAreas: React.FC = () => {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [animatingStats, setAnimatingStats] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatingStats(true);
      setTimeout(() => setAnimatingStats(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
                  <div 
                    key={index} 
                    className={`flex items-center cursor-pointer transition-all duration-300 p-2 rounded-lg hover:bg-quickfix-light-blue ${
                      activeLocation === locationName ? 'bg-quickfix-light-blue scale-105' : ''
                    }`}
                    onMouseEnter={() => setActiveLocation(locationName)}
                    onMouseLeave={() => setActiveLocation(null)}
                  >
                    <MapPin className={`h-5 w-5 mr-2 transition-all duration-300 ${
                      activeLocation === locationName ? 'text-quickfix-blue animate-bounce' : 'text-quickfix-orange'
                    }`} />
                    <span className={`transition-all duration-300 ${
                      activeLocation === locationName ? 'font-semibold text-quickfix-blue' : ''
                    }`}>
                      {locationName}
                    </span>
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
            
            <div>
              <div className="bg-gradient-to-br from-quickfix-light-blue to-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-center text-quickfix-blue">Live Service Stats</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {serviceStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div 
                        key={index}
                        className={`text-center p-4 bg-white rounded-lg shadow-sm transition-all duration-500 hover:shadow-md hover:scale-105 ${
                          animatingStats ? 'animate-pulse' : ''
                        }`}
                      >
                        <IconComponent className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 text-center">Coverage Heat Map</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 16 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-8 rounded transition-all duration-1000 ${
                          Math.random() > 0.3 
                            ? 'bg-gradient-to-r from-quickfix-orange to-quickfix-blue opacity-70 hover:opacity-100' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        style={{
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Real-time service density across Hyderabad
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Button className="bg-quickfix-blue hover:bg-quickfix-blue/90 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Book Service Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hyderabad Service Areas Map */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Our Service Coverage in Hyderabad</h3>
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <div className="relative bg-muted aspect-video">
                <img 
                  src="/lovable-uploads/c9d4e9bb-b3ea-4595-9b75-1108b5f42367.png" 
                  alt="QuickFix Service Areas in Hyderabad" 
                  className="object-cover w-full h-full" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
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
