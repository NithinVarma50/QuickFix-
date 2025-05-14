
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  ShieldCheck, 
  Trophy, 
  Map, 
  Phone, 
  Mail, 
  MapPin 
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-quickfix-blue text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading">About QuickFix</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Learn more about our mission to revolutionize vehicle maintenance with convenient doorstep repair services.
            </p>
          </div>
        </div>
        
        {/* Company Overview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 font-heading">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  QuickFix was founded in 2021 with a simple mission: to make vehicle maintenance and repair as convenient as possible for busy car owners in Hyderabad.
                </p>
                <p className="text-gray-600 mb-4">
                  Our founders, who had extensive experience in the automotive industry, recognized that traditional repair shops often meant long waits, inconvenient hours, and sometimes unclear pricing. They envisioned a service that would bring expert mechanics directly to customers, saving them time and hassle.
                </p>
                <p className="text-gray-600 mb-4">
                  Starting with a small team of certified mechanics and a focus on excellent customer service, QuickFix quickly gained popularity. Today, we're proud to serve thousands of customers across Hyderabad, with plans to expand to other major cities in India.
                </p>
                <p className="text-gray-600">
                  Our commitment to quality service, transparent pricing, and customer convenience remains at the heart of everything we do.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1581093458791-9d15482441a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="QuickFix team of mechanics"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-quickfix-orange rounded-full flex items-center justify-center text-white font-bold shadow-lg p-2 text-center">
                  Since 2021
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission & Values */}
        <section className="py-16 bg-quickfix-light-blue">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Our Mission & Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're driven by our commitment to excellence and customer satisfaction
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-quickfix-orange mb-4">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Convenience</h3>
                <p className="text-gray-600">
                  We prioritize your time and convenience by bringing expert vehicle repair services directly to you, fitting seamlessly into your busy schedule.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-quickfix-orange mb-4">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality & Expertise</h3>
                <p className="text-gray-600">
                  We employ only certified mechanics and use high-quality parts to ensure reliable, long-lasting repairs for all types of vehicles.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-quickfix-orange mb-4">
                  <Trophy className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-gray-600">
                  We believe in clear communication and fair pricing. You'll always know exactly what services you're getting and how much they cost.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Future Plans */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Looking Ahead</h2>
                <p className="text-lg text-gray-600">
                  We're committed to continuous improvement and expansion
                </p>
              </div>
              
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Map className="h-6 w-6 text-quickfix-orange mr-2" />
                  Expansion Plans
                </h3>
                <p className="text-gray-600 mb-3">
                  After establishing a strong presence in Hyderabad, we're preparing to roll out operations in other major cities across India. Our goal is to make doorstep vehicle repair services accessible to car owners nationwide.
                </p>
              </div>
              
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <ShieldCheck className="h-6 w-6 text-quickfix-orange mr-2" />
                  Service Enhancement
                </h3>
                <p className="text-gray-600 mb-3">
                  We're constantly working to enhance our service offerings, invest in advanced diagnostic tools, and develop specialized expertise to handle even the most complex vehicle issues right at your doorstep.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Users className="h-6 w-6 text-quickfix-orange mr-2" />
                  Customer Experience
                </h3>
                <p className="text-gray-600">
                  We're developing a mobile app to make booking and tracking services even easier, as well as implementing a loyalty program to reward our regular customers. Our focus remains on making vehicle maintenance as convenient and hassle-free as possible.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 bg-quickfix-gray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Contact Us</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions or need assistance? We're here to help!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-quickfix-orange mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">Customer Service: +91 9381904726</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-quickfix-orange mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">General Inquiries: info@quickfix.in</p>
                      <p className="text-gray-600">Customer Support: support@quickfix.in</p>
                      <p className="text-gray-600">Business Opportunities: business@quickfix.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-quickfix-orange mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Office Address</h3>
                      <p className="text-gray-600">Street No. 01, Kranti Colony, Telephone Colony, Chengicherla, Secunderabad, Telangana 500098</p>
                      <p className="text-gray-600 mt-2">
                        <span className="font-medium">Hours:</span> Monday-Saturday: 9 AM - 6 PM
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button asChild className="w-full bg-quickfix-blue hover:bg-quickfix-blue/90">
                    <Link to="/booking">Book a Service</Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative h-full min-h-[300px]">
                <iframe
                  title="QuickFix Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.455422781893!2d78.5761613!3d17.441797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9f12e00f36e5%3A0x7b525649014e2dd4!2sTelephone%20Colony%2C%20Chengicherla%2C%20Secunderabad%2C%20Telangana%20500098!5e0!3m2!1sen!2sin!4v1651649165317!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full rounded-lg shadow-md"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  aria-hidden="false"
                  tabIndex={0}
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
