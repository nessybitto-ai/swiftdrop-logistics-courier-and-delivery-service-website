import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useSubmitDeliveryRequest } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    pickupAddress: '',
    receiverName: '',
    receiverPhone: '',
    deliveryAddress: '',
    parcelDescription: '',
    parcelWeight: '',
  });

  const submitRequest = useSubmitDeliveryRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const trackingNumber = await submitRequest.mutateAsync(formData);
      toast.success(`Delivery request submitted! Your tracking number is: ${trackingNumber}`);
      setFormData({
        senderName: '',
        senderPhone: '',
        pickupAddress: '',
        receiverName: '',
        receiverPhone: '',
        deliveryAddress: '',
        parcelDescription: '',
        parcelWeight: '',
      });
    } catch (error) {
      toast.error('Failed to submit delivery request. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get in touch with us for delivery requests, inquiries, or support
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Phone</div>
                      <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <SiWhatsapp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">WhatsApp</div>
                      <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-sm text-muted-foreground">support@swiftdrop.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Office Location</div>
                      <div className="text-sm text-muted-foreground">
                        123 Logistics Avenue, Suite 100
                        <br />
                        New York, NY 10001
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card>
                <CardContent className="p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9476519598093!2d-73.99185368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Delivery Request Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Request a Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sender Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Sender Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="senderName">Full Name *</Label>
                          <Input
                            id="senderName"
                            name="senderName"
                            value={formData.senderName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="senderPhone">Phone Number *</Label>
                          <Input
                            id="senderPhone"
                            name="senderPhone"
                            type="tel"
                            value={formData.senderPhone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupAddress">Pickup Address *</Label>
                        <Textarea
                          id="pickupAddress"
                          name="pickupAddress"
                          value={formData.pickupAddress}
                          onChange={handleChange}
                          required
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Receiver Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Receiver Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="receiverName">Full Name *</Label>
                          <Input
                            id="receiverName"
                            name="receiverName"
                            value={formData.receiverName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="receiverPhone">Phone Number *</Label>
                          <Input
                            id="receiverPhone"
                            name="receiverPhone"
                            type="tel"
                            value={formData.receiverPhone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                        <Textarea
                          id="deliveryAddress"
                          name="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={handleChange}
                          required
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Parcel Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Parcel Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="parcelDescription">Description *</Label>
                          <Input
                            id="parcelDescription"
                            name="parcelDescription"
                            value={formData.parcelDescription}
                            onChange={handleChange}
                            placeholder="e.g., Documents, Electronics"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parcelWeight">Weight *</Label>
                          <Input
                            id="parcelWeight"
                            name="parcelWeight"
                            value={formData.parcelWeight}
                            onChange={handleChange}
                            placeholder="e.g., 2kg, 5lbs"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={submitRequest.isPending}>
                      {submitRequest.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Delivery Request'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
