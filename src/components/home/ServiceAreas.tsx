import React, { useState } from 'react';
import { MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Textarea } from '@/components/ui/textarea';
const locations = ["Hitech City", "Gachibowli", "Kukatpally", "Madhapur", "Jubilee Hills", "Banjara Hills", "Secunderabad", "Begumpet", "Ameerpet", "KPHB", "Shamshabad", "Kondapur"];
const ServiceAreas: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format the WhatsApp message
    const whatsappMessage = `*New Service Booking*%0A
*Name:* ${name}%0A
*Phone:* ${phone}%0A
*Service:* ${service}%0A
*Location:* ${location}%0A
*Message:* ${message}`;

    // Create WhatsApp URL with formatted message
    const whatsappURL = `https://wa.me/919381904726?text=${whatsappMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');

    // Show success message
    toast.success("Booking request sent via WhatsApp");

    // Reset form
    setName('');
    setPhone('');
    setService('');
    setLocation('');
    setMessage('');
  };
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4">Service Areas in Hyderabad</h2>
              <p className="text-lg text-gray-600 mb-6">
                QuickFix currently serves the vibrant city of Hyderabad. Our mobile mechanics cover all major areas to ensure you get prompt service no matter where you are.
              </p>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {locations.map((locationName, index) => <div key={index} className="flex items-center">
                    <MapPin className="h-5 w-5 text-quickfix-orange mr-2" />
                    <span>{locationName}</span>
                  </div>)}
              </div>
              
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <Phone className="h-5 w-5 text-quickfix-orange mr-2" />
                  <span className="font-medium">Call us at: +91 7337243180</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-quickfix-light-blue p-6 rounded-lg shadow-md\\nform ">
                <h3 className="text-xl font-bold mb-4">Book via WhatsApp</h3>
                <p className="text-gray-600 mb-4">Fill in the details below to quickly book a service through WhatsApp</p>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your Phone Number" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="service">Service Required</Label>
                      <Input id="service" value={service} onChange={e => setService(e.target.value)} placeholder="What service do you need?" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Your Location</Label>
                      <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Your Area in Hyderabad" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Additional Details (Optional)</Label>
                      <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Any specific issues or requirements" className="resize-none" rows={3} />
                    </div>
                    
                    <Button type="submit" className="w-full bg-quickfix-blue hover:bg-quickfix-blue/90 flex items-center justify-center">
                      <Send className="mr-2 h-4 w-4" />
                      Book via WhatsApp
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Hyderabad Service Areas Map */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Our Service Coverage in Hyderabad</h3>
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <img src="/lovable-uploads/c9d4e9bb-b3ea-4595-9b75-1108b5f42367.png" alt="QuickFix Service Areas in Hyderabad" className="object-cover w-full h-full" />
              </AspectRatio>
            </div>
            <p className="text-center text-gray-500 mt-4">
              We provide service across all highlighted areas in Hyderabad
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default ServiceAreas;
