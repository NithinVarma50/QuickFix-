
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { CheckCircle } from 'lucide-react';

const MechanicRepairSection: React.FC = () => {
  const benefits = [
    "Certified Professional Mechanics",
    "Doorstep Service at Your Convenience",
    "Same-Day Repair Options Available",
    "Latest Tools and Technology",
    "Genuine Spare Parts Used",
    "Service Warranty Provided"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 font-heading">Professional Mechanics at Your Doorstep</h2>
            <p className="text-lg text-gray-600 mb-6">
              Our team of experienced mechanics brings the repair shop to your location. 
              We provide quality service with minimum disruption to your schedule.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-quickfix-orange mt-1 mr-2 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl">
            <AspectRatio ratio={4/3}>
              <img 
                src="/lovable-uploads/1d19154c-570e-48fa-ace9-24d37740faf0.png"
                alt="Quickfix mechanic providing doorstep repair service" 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MechanicRepairSection;
