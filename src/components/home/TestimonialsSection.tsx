
import React from 'react';
import { Star } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Hitech City',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    stars: 5,
    text: 'QuickFix saved my day! My car wouldn\'t start before an important meeting. Their mechanic arrived within 20 minutes and fixed the battery issue on the spot. Excellent service!'
  },
  {
    name: 'Rahul Verma',
    location: 'Gachibowli',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    stars: 5,
    text: 'I was impressed with how professional and knowledgeable the mechanic was. He explained everything clearly and fixed my car\'s oil leak right in my office parking lot. Highly recommend!'
  },
  {
    name: 'Sneha Reddy',
    location: 'Kukatpally',
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    stars: 4,
    text: 'As a woman who knows little about cars, I\'ve often felt uncomfortable at auto shops. QuickFix\'s service was refreshingly transparent and fair. They didn\'t try to upsell me on unnecessary services.'
  },
  {
    name: 'Arun Kumar',
    location: 'Madhapur',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    stars: 5,
    text: 'The convenience of having my car serviced at home is unmatched. The mechanic was punctual, thorough and cleaned up after the job. Will definitely use QuickFix again!'
  },
  {
    name: 'Divya Patel',
    location: 'Begumpet',
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    stars: 5,
    text: 'My tire blew out on a busy highway and I was stranded. QuickFix sent someone quickly who changed my tire efficiently. The pricing was transparent with no hidden charges.'
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-quickfix-light-blue">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about QuickFix.
          </p>
        </div>
        
        <div className="py-4">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-3">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <Star key={i} fill="#ff6b35" className="h-4 w-4 text-quickfix-orange" />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 flex-grow">"{testimonial.text}"</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="relative" />
              <CarouselNext className="relative" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
