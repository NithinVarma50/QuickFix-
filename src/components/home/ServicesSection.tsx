
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Battery, 
  Droplet, 
  Timer, 
  Car, 
  Wrench, 
  Gauge, 
  ArrowRight 
} from 'lucide-react';

const services = [
  {
    icon: <Battery className="h-8 w-8" />,
    title: 'Battery Services',
    description: 'Jump starts, battery replacement, and electrical system diagnosis right at your location.'
  },
  {
    icon: <Droplet className="h-8 w-8" />,
    title: 'Oil Change',
    description: 'Quick and clean oil changes with premium quality oil options for all vehicle types.'
  },
  {
    icon: <Timer className="h-8 w-8" />,
    title: 'Emergency Assistance',
    description: '24/7 emergency roadside assistance for breakdowns, flat tires, and more.'
  },
  {
    icon: <Car className="h-8 w-8" />,
    title: 'General Repairs',
    description: 'From minor fixes to major repairs, our certified mechanics handle it all at your doorstep.'
  },
  {
    icon: <Wrench className="h-8 w-8" />,
    title: 'Maintenance Service',
    description: 'Regular maintenance services to keep your vehicle running smoothly and prevent future issues.'
  },
  {
    icon: <Gauge className="h-8 w-8" />,
    title: 'Diagnostics',
    description: 'Advanced diagnostic tools to quickly identify and resolve complex vehicle problems.'
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 bg-quickfix-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of vehicle repair and maintenance services, all delivered right to your doorstep by our team of certified mechanics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-quickfix-orange mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link to="/services" className="text-quickfix-blue hover:text-quickfix-orange font-medium inline-flex items-center">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild className="bg-quickfix-blue hover:bg-quickfix-blue/90">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
