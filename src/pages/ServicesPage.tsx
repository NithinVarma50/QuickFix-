
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Car, 
  Battery, 
  Oil, 
  Wrench, 
  Gauge, 
  Sparkles, 
  AirVent, 
  ChevronRight
} from 'lucide-react';

const servicesData = [
  {
    id: "battery",
    icon: <Battery className="h-10 w-10" />,
    title: "Battery Services",
    description: "Our battery services include jump starts, battery testing, and replacement. We use high-quality batteries and ensure proper installation.",
    includes: [
      "Battery jump start",
      "Battery testing and diagnosis",
      "Battery replacement",
      "Alternator testing",
      "Electrical system diagnosis"
    ],
    pricing: "From ₹800",
    timeEstimate: "30-60 minutes"
  },
  {
    id: "oil",
    icon: <Oil className="h-10 w-10" />,
    title: "Oil Change Service",
    description: "Regular oil changes are essential for your engine's health. We offer comprehensive oil change services using premium quality oils.",
    includes: [
      "Engine oil change",
      "Oil filter replacement",
      "Fluid level check and top-up",
      "Basic vehicle inspection",
      "Proper disposal of old oil"
    ],
    pricing: "From ₹1,500",
    timeEstimate: "30-45 minutes"
  },
  {
    id: "tire",
    icon: <Car className="h-10 w-10" />,
    title: "Tire Services",
    description: "From flat tire repair to complete tire replacement, our technicians provide efficient and reliable tire services at your location.",
    includes: [
      "Flat tire repair",
      "Tire replacement",
      "Tire rotation",
      "Tire pressure check and adjustment",
      "Wheel balancing"
    ],
    pricing: "From ₹500",
    timeEstimate: "30-60 minutes"
  },
  {
    id: "brake",
    icon: <Gauge className="h-10 w-10" />,
    title: "Brake Services",
    description: "We offer complete brake system inspection and repair services to ensure your vehicle stops safely and efficiently.",
    includes: [
      "Brake pad replacement",
      "Brake fluid check and top-up",
      "Brake disc/rotor inspection",
      "Brake line inspection",
      "Complete brake system diagnosis"
    ],
    pricing: "From ₹2,000",
    timeEstimate: "1-2 hours"
  },
  {
    id: "ac",
    icon: <AirVent className="h-10 w-10" />,
    title: "AC Services",
    description: "Keep your vehicle cool with our comprehensive AC repair and maintenance services, including refrigerant recharge and system diagnosis.",
    includes: [
      "AC performance check",
      "Refrigerant recharge",
      "AC compressor inspection",
      "Leak detection and repair",
      "Filter cleaning/replacement"
    ],
    pricing: "From ₹1,800",
    timeEstimate: "1-2 hours"
  },
  {
    id: "general",
    icon: <Wrench className="h-10 w-10" />,
    title: "General Repairs",
    description: "Our certified mechanics can handle a wide range of general repairs and maintenance tasks to keep your vehicle in optimal condition.",
    includes: [
      "Engine diagnostics",
      "Filter replacements",
      "Fluid checks and top-ups",
      "Belt and hose inspection",
      "Minor repairs and adjustments"
    ],
    pricing: "From ₹1,000",
    timeEstimate: "Varies based on service"
  },
  {
    id: "emergency",
    icon: <Sparkles className="h-10 w-10" />,
    title: "Emergency Services",
    description: "Stranded on the road? Our emergency roadside assistance team is available to help you get back on the road quickly.",
    includes: [
      "24/7 roadside assistance",
      "Vehicle jump start",
      "Flat tire change",
      "Fuel delivery",
      "Lockout assistance"
    ],
    pricing: "From ₹1,000",
    timeEstimate: "30-60 minutes response time"
  }
];

const faqs = [
  {
    question: "How quickly can you get to my location?",
    answer: "We aim to reach your location within 30-60 minutes in most areas of Hyderabad. For emergency services, we prioritize dispatch and try to reach you as quickly as possible."
  },
  {
    question: "Do you provide warranties on your services?",
    answer: "Yes, all our repair services come with a 90-day warranty. If you experience any issues related to our service within this period, we'll fix it at no additional cost."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, major credit/debit cards, UPI payments, and online bank transfers. Payment is generally collected after the service is completed to your satisfaction."
  },
  {
    question: "How are your prices compared to traditional repair shops?",
    answer: "Our prices are competitive with traditional repair shops. While there may be a small convenience fee for the doorstep service, you save time and the hassle of taking your vehicle to a repair shop."
  },
  {
    question: "Do I need to provide any tools or parts?",
    answer: "No, our mechanics come fully equipped with all necessary tools and common replacement parts. For specialized parts, we may need to order them or source them locally, which we'll discuss with you before proceeding."
  }
];

const ServicesPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-quickfix-blue text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Our Vehicle Repair Services</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              QuickFix offers a comprehensive range of vehicle repair and maintenance services, all delivered right at your doorstep by our certified mechanics.
            </p>
          </div>
        </div>
        
        {/* Services List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesData.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-quickfix-orange mr-4">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold">{service.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Service includes:</h4>
                      <ul className="space-y-1">
                        {service.includes.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-quickfix-orange mr-2" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center border-t pt-4 mt-4">
                      <div>
                        <span className="block text-sm text-gray-500">Starting price</span>
                        <span className="font-bold text-quickfix-blue">{service.pricing}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm text-gray-500">Est. time</span>
                        <span className="font-medium">{service.timeEstimate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-4">
                    <Button asChild className="w-full bg-quickfix-blue hover:bg-quickfix-blue/90">
                      <Link to="/booking">Book This Service</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Process Section */}
        <section className="py-16 bg-quickfix-light-blue">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-heading">Our Service Process</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We've made vehicle repair convenient and hassle-free with our simple process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-quickfix-blue">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Online</h3>
                <p className="text-gray-600">Schedule a service through our online booking form or by calling us directly.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-quickfix-blue">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mechanic Arrives</h3>
                <p className="text-gray-600">Our certified mechanic comes to your location at the scheduled time.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-quickfix-blue">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Inspection & Repair</h3>
                <p className="text-gray-600">The mechanic diagnoses the issue and performs the necessary repairs or service.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-quickfix-blue">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Payment & Warranty</h3>
                <p className="text-gray-600">Pay only after the service is complete. All repairs come with our service warranty.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-heading">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our doorstep vehicle repair services
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-gray-600 mb-4">Don't see your question here?</p>
              <Button asChild variant="outline" className="border-quickfix-blue text-quickfix-blue hover:bg-quickfix-light-blue">
                <Link to="/about">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="bg-quickfix-blue py-12 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Ready to experience hassle-free vehicle repair?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Book a service today and join thousands of satisfied customers in Hyderabad who've made the smart switch to QuickFix.
            </p>
            <Button asChild size="lg" className="bg-white text-quickfix-blue hover:bg-gray-100">
              <Link to="/booking">Book a Service Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
