
import React from 'react';
import { Calendar, Clock, Wrench, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <Calendar className="h-12 w-12 text-quickfix-orange" />,
    title: 'Book a Service',
    description: 'Schedule an appointment online or call us. Tell us about your vehicle issue and preferred time slot.'
  },
  {
    icon: <Clock className="h-12 w-12 text-quickfix-orange" />,
    title: 'We Come to You',
    description: 'Our certified mechanic arrives at your location with all the necessary tools and parts.'
  },
  {
    icon: <Wrench className="h-12 w-12 text-quickfix-orange" />,
    title: 'Vehicle Repair',
    description: 'The mechanic diagnoses the issue and performs the repair directly at your location.'
  },
  {
    icon: <CheckCircle className="h-12 w-12 text-quickfix-orange" />,
    title: 'Back on the Road',
    description: 'Your vehicle is fixed, tested, and ready to go. Pay only after you're satisfied with the service.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">How QuickFix Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We've simplified the vehicle repair process to save your time and provide maximum convenience.
          </p>
        </div>
        
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-4 border-2 border-quickfix-blue shadow-md mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {/* Step number */}
                <div className="absolute top-0 right-0 bg-quickfix-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm lg:translate-x-1/2 lg:-translate-y-1/2">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
