
import React from 'react';
import { CheckCircle } from 'lucide-react';

const mechanics = [
  {
    name: 'Rajesh Kumar',
    position: 'Head Technician',
    image: 'https://randomuser.me/api/portraits/men/34.jpg',
    experience: '10+ years',
    certification: 'ASE Certified Master Technician',
    specialization: 'Engine Diagnostics & Repairs'
  },
  {
    name: 'Sanjay Patel',
    position: 'Senior Mechanic',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    experience: '8 years',
    certification: 'Automotive Service Excellence (ASE)',
    specialization: 'Electrical Systems'
  },
  {
    name: 'Vikram Singh',
    position: 'Mechanic',
    image: 'https://randomuser.me/api/portraits/men/62.jpg',
    experience: '5 years',
    certification: 'Certified Automotive Technician',
    specialization: 'Brake Systems & Suspension'
  }
];

const MechanicSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">Meet Our Certified Mechanics</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our team of skilled professionals is dedicated to providing quality vehicle repair services right at your doorstep.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mechanics.map((mechanic, index) => (
            <div key={index} className="bg-quickfix-light-blue rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <img 
                src={mechanic.image} 
                alt={mechanic.name}
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{mechanic.name}</h3>
                <p className="text-quickfix-blue mb-4">{mechanic.position}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-quickfix-orange mt-0.5 mr-2 flex-shrink-0" />
                    <span><span className="font-medium">Experience:</span> {mechanic.experience}</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-quickfix-orange mt-0.5 mr-2 flex-shrink-0" />
                    <span><span className="font-medium">Certification:</span> {mechanic.certification}</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-quickfix-orange mt-0.5 mr-2 flex-shrink-0" />
                    <span><span className="font-medium">Specialization:</span> {mechanic.specialization}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MechanicSection;
