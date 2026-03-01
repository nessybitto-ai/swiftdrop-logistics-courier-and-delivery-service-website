import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function ServicesPage() {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Same-Day Delivery',
      description:
        'Need it there today? Our same-day delivery service ensures your urgent packages reach their destination within hours. Perfect for time-sensitive documents and parcels.',
      icon: '/assets/generated/same-day-icon.dim_200x200.png',
      features: ['Pickup within 2 hours', 'Delivery same business day', 'Real-time tracking', 'Priority handling'],
    },
    {
      title: 'Interstate Delivery',
      description:
        'Shipping across state lines? Our interstate delivery service connects major cities and regions nationwide with reliable, scheduled deliveries.',
      icon: '/assets/generated/interstate-icon.dim_200x200.png',
      features: ['Nationwide coverage', '2-5 day delivery', 'Secure packaging', 'Insurance options'],
    },
    {
      title: 'Corporate Delivery',
      description:
        'Tailored solutions for businesses of all sizes. From regular document runs to bulk shipments, we provide dedicated corporate delivery services.',
      icon: '/assets/generated/corporate-icon.dim_200x200.png',
      features: ['Dedicated account manager', 'Volume discounts', 'Scheduled pickups', 'Invoice billing'],
    },
    {
      title: 'E-commerce Fulfillment',
      description:
        'Seamlessly integrate with your online store. We handle order fulfillment, packaging, and delivery so you can focus on growing your business.',
      icon: '/assets/generated/ecommerce-icon.dim_200x200.png',
      features: ['API integration', 'Automated tracking', 'Returns management', 'Scalable solutions'],
    },
    {
      title: 'Document Dispatch',
      description:
        'Fast and secure document delivery service for legal papers, contracts, and important correspondence. Chain of custody maintained throughout.',
      icon: '/assets/generated/document-icon.dim_200x200.png',
      features: ['Signature confirmation', 'Secure handling', 'Express options', 'Proof of delivery'],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Services</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Comprehensive delivery solutions tailored to meet your needs. From same-day express to nationwide
            shipping, we've got you covered.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-start gap-4 pb-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <img src={service.icon} alt={service.title} className="h-12 w-12 object-contain" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>
                  <div>
                    <h4 className="mb-2 font-semibold">Key Features:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-lg opacity-90">
            Contact us today for a custom quote or to schedule your first delivery
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate({ to: '/contact' })}
              className="text-primary"
            >
              Request a Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/track' })}
              className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              Track Your Package
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
