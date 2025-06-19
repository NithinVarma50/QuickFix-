import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, PhoneCall, User } from 'lucide-react'; // Import the User icon
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dock, DockItemData } from "@/components/ui/dock";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Dock navigation items
  const dockItems: DockItemData[] = [
    {
      icon: <VscHome size={20} color="#2563eb" />, label: 'Home', onClick: () => window.location.pathname = "/"
    },
    {
      icon: <VscArchive size={20} color="#2563eb" />, label: 'Services', onClick: () => window.location.pathname = "/services"
    },
    {
      icon: <VscAccount size={20} color="#2563eb" />, label: 'About Us', onClick: () => window.location.pathname = "/about"
    },
    {
      icon: <VscSettingsGear size={20} color="#2563eb" />, label: 'Book Now', onClick: () => window.location.pathname = "/booking"
    },
    {
      icon: <VscSettingsGear size={20} color="#f59e42" />, label: 'Emergency', onClick: () => window.open("https://wa.me/917337243180?text=I%20need%20emergency%20vehicle%20service", "_blank")
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Profile */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-quickfix-blue">
              Quick<span className="text-quickfix-orange">Fix</span>
            </span>
          </Link>
          <Link to="/profile" className="flex items-center">
            <User className="h-6 w-6 text-quickfix-blue" aria-label="Profile" />
          </Link>
        </div>

        {/* Desktop Navigation - replaced with Dock */}
        <div className="hidden md:flex flex-1 justify-center">
          <Dock
            items={dockItems}
            panelHeight={60}
            baseItemSize={44}
            magnification={62}
            className="border-neutral-200 bg-white/80 dark:bg-black/70"
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button variant="link" size="icon" onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Phone Number - Desktop */}
        <div className="hidden md:flex items-center">
          <Button asChild variant="outline" className="flex items-center p-2" aria-label="Call Us">
            <a href="tel:+917337243180">
              <PhoneCall className="h-5 w-5 text-quickfix-orange" />
            </a>
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
            <MobileNavLink as="a" to={undefined} href="https://wa.me/917337243180?text=I%20need%20emergency%20vehicle%20service" target="_blank" rel="noopener noreferrer">
              Book Emergency Service
            </MobileNavLink>
            <div className="pt-3 border-t border-gray-200">
              <Button asChild className="w-full flex items-center justify-center" variant="outline" aria-label="Call Us">
                <a href="tel:+917337243180">
                  <PhoneCall className="h-5 w-5 text-quickfix-orange" />
                </a>
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
  as?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  className,
  as,
  href,
  target,
  rel
}) => {
  if (as === 'a') {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={cn("px-3 py-2 text-base font-medium text-gray-700 hover:text-quickfix-blue hover:bg-quickfix-light-blue rounded-md transition-colors", className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cn("px-3 py-2 text-base font-medium text-gray-700 hover:text-quickfix-blue hover:bg-quickfix-light-blue rounded-md transition-colors", className)}>
      {children}
    </Link>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  children,
  onClick,
  as,
  href,
  target,
  rel
}) => {
  if (as === 'a') {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-quickfix-blue hover:bg-quickfix-light-blue rounded-md"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-quickfix-blue hover:bg-quickfix-light-blue rounded-md" onClick={onClick}>
      {children}
    </Link>
  );
};

export default Navbar;