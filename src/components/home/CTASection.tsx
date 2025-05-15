
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';
const CTASection: React.FC = () => {
  return <section className="py-16 bg-gradient-to-r from-quickfix-blue to-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
            Ready to experience hassle-free vehicle repairs?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100">Book your service today and be part of the growing community in Hyderabad that's discovering the smarter, faster way to fix their vehicles — with QuickFix.


We've just started, but every service we complete is a step toward building India's most trusted doorstep repair network.
Your ride deserves better. We're here to deliver it</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-quickfix-blue hover:bg-gray-100">
              <Link to="/booking" className="flex items-center">
                Book a Service <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <a href="tel:+917337243180" className="flex items-center">
                <Phone className="h-5 w-5 text-quickfix-blue" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default CTASection;
