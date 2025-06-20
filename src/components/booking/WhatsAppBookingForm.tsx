import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '917337243180'; // Business WhatsApp number

const WhatsAppBookingForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState('');
  const [referral, setReferral] = useState('');

  const getWhatsAppLink = () => {
    const msg =
      `Hi QuickFix, I want to book a service!%0A` +
      `Name: ${name}%0A` +
      `Phone: ${phone}%0A` +
      `Vehicle Type: ${vehicleType}%0A` +
      `Issue: ${issue}%0A` +
      `Location: ${location}%0A` +
      (referral ? `Referral Code: ${referral}%0A` : '') +
      `%0AThank you!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  };

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        window.open(getWhatsAppLink(), '_blank');
      }}
    >
      <input
        type="text"
        required
        placeholder="Full Name"
        className="w-full border rounded px-3 py-2"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="tel"
        required
        placeholder="Phone Number"
        className="w-full border rounded px-3 py-2"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <select
        className="w-full border rounded px-3 py-2"
        value={vehicleType}
        onChange={e => setVehicleType(e.target.value)}
      >
        <option value="Car">Car</option>
        <option value="Bike">Bike</option>
      </select>
      <textarea
        required
        placeholder="Describe the issue"
        className="w-full border rounded px-3 py-2"
        value={issue}
        onChange={e => setIssue(e.target.value)}
      />
      <input
        type="text"
        required
        placeholder="Location (Area, Landmark, etc.)"
        className="w-full border rounded px-3 py-2"
        value={location}
        onChange={e => setLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Referral Code (optional)"
        className="w-full border rounded px-3 py-2"
        value={referral}
        onChange={e => setReferral(e.target.value)}
      />
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded">
        Book Now via WhatsApp
      </Button>
    </form>
  );
};

export default WhatsAppBookingForm;
