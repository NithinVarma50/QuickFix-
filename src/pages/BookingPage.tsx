import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingForm from '@/components/booking/BookingForm';
import { Phone, Clock, MapPin, ShieldCheck } from 'lucide-react';
const BookingPage: React.FC = () => {
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Booking Header */}
        <div className="bg-quickfix-blue text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Book Your Vehicle Service</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Schedule a convenient doorstep repair service with our team of certified mechanics. We'll be at your location in no time.
            </p>
          </div>
        </div>
        
        {/* Booking Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Fill in your details</h2>
                <BookingForm />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Need help booking?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-quickfix-orange mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Call us directly</p>
                      <p className="text-gray-600">+91 9876543210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-quickfix-orange mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Working Hours</p>
                      <p className="text-gray-600">Mon-Sat: 8:00 AM - 8:00 PM</p>
                      <p className="text-gray-600">Sunday: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-quickfix-orange mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Service Area</p>
                      <p className="text-gray-600">All major areas in Hyderabad</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Why Choose Us */}
              <div className="bg-quickfix-light-blue rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Why Choose QuickFix</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-quickfix-blue mt-1 mr-3" />
                    <span className="text-gray-700">Certified mechanics with years of experience</span>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-quickfix-blue mt-1 mr-3" />
                    <span className="text-gray-700">Transparent pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-quickfix-blue mt-1 mr-3" />
                    <span className="text-gray-700">Same-day service available</span>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-quickfix-blue mt-1 mr-3" />
                    <span className="text-gray-700">Service right at your doorstep</span>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-quickfix-blue mt-1 mr-3" />
                    <span className="text-gray-700">90-day warranty on all repairs</span>
                  </li>
                </ul>
              </div>
              
              {/* Emergency Service */}
              <div className="bg-quickfix-orange/10 border border-quickfix-orange rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Need Emergency Service?</h3>
                <p className="text-gray-700 mb-4">
                  For urgent repairs, call our emergency line and we'll dispatch a mechanic immediately.
                </p>
                <div className="font-bold text-xl text-quickfix-orange flex justify-center">+91 73374380</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default BookingPage;