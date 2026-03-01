import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Package, Truck, Clock, Shield, Search } from 'lucide-react';
import { useGetPublicTestimonials } from '../hooks/useQueries';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import LiveChatWidget from '../components/LiveChatWidget';

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();
  const { data: testimonials } = useGetPublicTestimonials();

  const handleTrackPackage = () => {
    if (trackingNumber.trim()) {
      navigate({ to: '/track', search: { tracking: trackingNumber } });
    }
  };

  const features = [
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Same-day and express delivery options available nationwide',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your parcels are insured and handled with utmost care',
    },
    {
      icon: Truck,
      title: 'Real-time Tracking',
      description: 'Track your package every step of the way',
    },
    {
      icon: Package,
      title: 'Nationwide Coverage',
      description: 'We deliver to every corner of the country',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-courier-delivery.dim_1200x800.jpg"
            alt="Courier delivering package"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>

        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Fast, Reliable & Nationwide Courier Delivery
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Move your parcels anywhere with confidence
            </p>

            {/* Track Package Box */}
            <Card className="bg-card/95 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Track Your Package</h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    placeholder="Enter tracking number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrackPackage()}
                    className="flex-1"
                  />
                  <Button onClick={handleTrackPackage} className="gap-2">
                    <Search className="h-4 w-4" />
                    Track Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-none bg-card shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Services in Action</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg shadow-md">
              <img
                src="/assets/generated/courier-handover.dim_800x600.jpg"
                alt="Courier handing over parcel"
                className="h-64 w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-md">
              <img
                src="/assets/generated/delivery-vans-fleet.dim_800x600.jpg"
                alt="Delivery vans fleet"
                className="h-64 w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-md">
              <img
                src="/assets/generated/warehouse-logistics.dim_800x600.jpg"
                alt="Warehouse logistics"
                className="h-64 w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-md">
              <img
                src="/assets/generated/city-routes.dim_800x600.jpg"
                alt="City to city routes"
                className="h-64 w-full object-cover transition-transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}

      {/* FAQ Section */}
      <FAQSection />

      {/* Live Chat Widget */}
      <LiveChatWidget />
    </div>
  );
}
