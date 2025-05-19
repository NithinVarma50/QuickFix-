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
                  QuickFix was born out of a real problem — vehicle repairs in Hyderabad were either too slow, too confusing, or too far away. We knew there had to be a better way.
                </p>
                <p className="text-gray-600 mb-4">
                  So, we started small — just three of us with a dream, a few tools, and one goal:
                  make vehicle repair simple, accessible, and trustworthy.
                </p>
                <p className="text-gray-600 mb-4">
                  With no fancy funding or flashy garage, we began by helping people with quick fixes — a headlight here, a battery jump there — all handled with care and speed. Every customer mattered. Every rupee earned was proof that the idea worked.
                </p>
                <p className="text-gray-600 mb-4">
                  We're still in the early stages, but we've already:
                </p>
                <ul className="list-disc pl-5 text-gray-600 mb-4">
                  <li className="mb-2">Built our own website and booking platform</li>
                  <li className="mb-2">Completed our first few paid orders</li>
                  <li className="mb-2">Laid the foundation for mobile repair vans and franchise expansion</li>
                </ul>
                <p className="text-gray-600">
                  QuickFix is not just about fixing vehicles — it's about rebuilding trust in repair services. Our mission is clear:
                  to bring fast, transparent, doorstep repairs to every vehicle owner in India — starting with Hyderabad.
                </p>
                <p className="text-gray-600 mt-4 italic font-medium">
                  The journey's just begun, and the road ahead is wide open.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="QuickFix mechanics at work"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-quickfix-light-blue">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">QuickFix Founding Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet the visionaries behind our mission
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Saiteja</h3>
                <h4 className="text-quickfix-orange font-medium mb-3">Founder & CEO</h4>
                <p className="text-gray-600 mb-3">
                  The mind behind the mission — leads vision, service innovation, and business development.
                </p>
                <p className="text-gray-600 mb-3">
                  Drives daily operations, partnerships, pricing models, and future expansion (mobile van services incoming!).
                </p>
                <p className="text-gray-600">
                  Focused on building a trusted, scalable brand for doorstep vehicle repair.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Karthik</h3>
                <h4 className="text-quickfix-orange font-medium mb-3">Co-Founder & Operations Lead</h4>
                <p className="text-gray-600 mb-3">
                  Handles all things on-ground — vehicle pickup/drop logistics, customer coordination, and mechanic relations.
                </p>
                <p className="text-gray-600">
                  Ensures smooth service flow and customer satisfaction at every touchpoint. The backbone of execution and day-to-day hustle.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Nithin Varma</h3>
                <h4 className="text-quickfix-orange font-medium mb-3">COO, Tech Lead & Strategy Builder</h4>
                <p className="text-gray-600 mb-3">
                  Oversees product architecture and technical direction.
                </p>
                <p className="text-gray-600">
                  Leads strategic planning and operational efficiency across the company.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission & Values */}
        <section className="py-16">
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
        <section className="py-16 bg-quickfix-light-blue">
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
                      <p className="text-gray-600">Customer Service: +91 7337243180</p>
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
                
                <div className="mt-8 space-y-4">
                  <Button asChild className="w-full bg-quickfix-blue hover:bg-quickfix-blue/90">
                    <Link to="/booking">Book a Service</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-quickfix-orange text-quickfix-orange hover:bg-quickfix-orange/10">
                    <a href="https://wa.me/917337243180" target="_blank" rel="noopener noreferrer">
                      Contact via WhatsApp
                    </a>
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
