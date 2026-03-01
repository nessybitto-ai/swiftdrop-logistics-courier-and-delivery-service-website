import { Card, CardContent } from '../components/ui/card';
import { Target, Zap, Globe, Users } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: 'Speed',
      description: 'We prioritize fast delivery times without compromising on safety and security.',
    },
    {
      icon: Target,
      title: 'Reliability',
      description: 'Our track record speaks for itself - on-time deliveries you can count on.',
    },
    {
      icon: Globe,
      title: 'National Coverage',
      description: 'From major cities to remote areas, we deliver everywhere across the nation.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go the extra mile for every customer.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/team-delivery-vehicles.dim_800x600.jpg"
            alt="Team with delivery vehicles"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>

        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
              About SwiftDrop Logistics
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your trusted partner in courier and delivery services
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
            <p className="mb-4 text-lg text-muted-foreground">
              At SwiftDrop Logistics, we are committed to providing fast, reliable, and secure courier services
              across the nation. Our mission is to connect people and businesses through efficient delivery
              solutions that exceed expectations.
            </p>
            <p className="text-lg text-muted-foreground">
              With years of experience in the logistics industry, we have built a reputation for excellence,
              punctuality, and customer satisfaction. Whether you're sending a document across town or a package
              across the country, we treat every delivery with the same level of care and urgency.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Core Values</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="border-none bg-card shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Deliveries Per Month</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground">On-Time Delivery Rate</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Why Choose SwiftDrop?</h2>
            <div className="space-y-6">
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">Advanced Tracking Technology</h3>
                <p className="text-muted-foreground">
                  Stay informed every step of the way with our real-time tracking system. Know exactly where
                  your package is at any moment.
                </p>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">Professional Team</h3>
                <p className="text-muted-foreground">
                  Our trained and experienced delivery personnel ensure your packages are handled with care
                  and delivered safely.
                </p>
              </div>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">Flexible Solutions</h3>
                <p className="text-muted-foreground">
                  From same-day delivery to scheduled pickups, we offer flexible options to meet your unique
                  delivery needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
