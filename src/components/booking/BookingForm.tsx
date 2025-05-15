
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  serviceType: z.string().min(1, "Please select a service type"),
  vehicleMake: z.string().min(1, "Please enter your vehicle make"),
  vehicleModel: z.string().min(1, "Please enter your vehicle model"),
  vehicleYear: z.coerce.number().min(1900, "Please enter a valid year").max(2100, "Please enter a valid year"),
  date: z.date({
    required_error: "Please select a date",
  }),
  address: z.string().min(5, "Please enter your full address"),
  area: z.string().min(1, "Please select your area"),
  serviceOption: z.enum(["onsite", "pickup"], {
    required_error: "Please select a service option",
  }),
  description: z.string().optional(),
});

const serviceTypes = [
  "Battery Jump Start",
  "Oil Change",
  "Tire Replacement",
  "Brake Repair",
  "Engine Diagnostics",
  "General Maintenance",
  "Emergency Roadside Assistance",
  "Other"
];

const areas = [
  "Hitech City",
  "Gachibowli",
  "Kukatpally",
  "Madhapur",
  "Jubilee Hills",
  "Banjara Hills",
  "Secunderabad",
  "Begumpet",
  "Ameerpet",
  "KPHB",
  "Kondapur",
  "Other"
];

const BookingForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceOption: "onsite",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please login to book a service",
      });
      navigate('/auth');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        vehicle_make: values.vehicleMake,
        vehicle_model: values.vehicleModel,
        vehicle_year: values.vehicleYear,
        service_type: values.serviceType,
        booking_date: values.date.toISOString(),
        address: values.address,
        description: values.description || null,
        status: 'pending'
      });
      
      if (error) {
        throw error;
      }
      
      // Also update user profile if needed
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        first_name: user.user_metadata?.first_name || values.name.split(' ')[0],
        last_name: user.user_metadata?.last_name || values.name.split(' ').slice(1).join(' '),
        phone_number: values.phone
      });
      
      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
      
      toast.success("Booking Successful", {
        description: "We've received your booking request. Our team will contact you shortly.",
      });
      form.reset();
      
    } catch (error: any) {
      toast.error("Booking failed", {
        description: error.message || "There was an error processing your request",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {!user && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please <Link to="/auth" className="underline font-medium">login or register</Link> to book a service.
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicleMake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Make</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Honda, Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Model</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Civic, Corolla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicleYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Year</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Service Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 1))
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your complete address for service"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="serviceOption"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Service Option</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="onsite" id="onsite" />
                          <label
                            htmlFor="onsite"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Onsite Repair (mechanic comes to your location)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <label
                            htmlFor="pickup"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Vehicle Pickup (we pick up your vehicle for service)
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please describe the issue you're experiencing with your vehicle"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              By submitting this form, you agree to our{" "}
              <Link to="/" className="text-quickfix-blue hover:underline">
                Terms of Service
              </Link>
            </p>
            <Button 
              type="submit" 
              className="bg-quickfix-blue hover:bg-quickfix-blue/90 w-full sm:w-auto"
              disabled={submitting || !user}
            >
              {submitting ? "Processing..." : "Book Service"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default BookingForm;
