
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-quickfix-blue">
            Quick<span className="text-quickfix-orange">Fix</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/booking">Book Now</NavLink>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button variant="link" size="icon" onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Phone Number - Desktop */}
        <div className="hidden md:flex items-center">
          <Button variant="outline" className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-quickfix-orange" />
            <span>+91 9381904726</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-4">
          <nav className="flex flex-col space-y-3">
            <MobileNavLink to="/" onClick={toggleMenu}>Home</MobileNavLink>
            <MobileNavLink to="/services" onClick={toggleMenu}>Services</MobileNavLink>
            <MobileNavLink to="/about" onClick={toggleMenu}>About Us</MobileNavLink>
            <MobileNavLink to="/booking" onClick={toggleMenu}>Book Now</MobileNavLink>
            <div className="pt-3 border-t border-gray-200">
              <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                <PhoneCall className="h-4 w-4 text-quickfix-orange" />
                <span>+91 9381904726</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "px-3 py-2 text-base font-medium text-gray-700 hover:text-quickfix-blue hover:bg-quickfix-light-blue rounded-md transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children, onClick }) => {
  return (
    <Link 
      to={to} 
      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-quickfix-blue hover:bg-quickfix-light-blue rounded-md"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;
