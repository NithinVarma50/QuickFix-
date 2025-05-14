
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-quickfix-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick<span className="text-quickfix-orange">Fix</span></h3>
            <p className="text-gray-300 mb-4">
              Your one-stop solution for vehicle repairs right at your doorstep. We make vehicle maintenance convenient and efficient.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-quickfix-orange" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-quickfix-orange" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-quickfix-orange" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-quickfix-orange">Home</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-quickfix-orange">Services</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-quickfix-orange">About Us</Link></li>
              <li><Link to="/booking" className="text-gray-300 hover:text-quickfix-orange">Book a Service</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-300 hover:text-quickfix-orange">Battery Jump Start</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-quickfix-orange">Oil Change</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-quickfix-orange">Tire Replacement</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-quickfix-orange">Emergency Roadside Assistance</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-quickfix-orange">General Repairs</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-quickfix-orange flex-shrink-0 mt-1" />
                <span>123 High-tech City, Hyderabad, Telangana, India - 500081</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-quickfix-orange flex-shrink-0" />
                <span>+91 7337243180</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-quickfix-orange flex-shrink-0" />
                <span>info@quickfix.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} QuickFix. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-400 text-sm hover:text-quickfix-orange">Privacy Policy</Link>
            <Link to="/" className="text-gray-400 text-sm hover:text-quickfix-orange">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
