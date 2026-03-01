import { SiFacebook, SiInstagram, SiWhatsapp } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-primary">SwiftDrop Logistics</h3>
            <p className="text-sm text-muted-foreground">
              Fast, reliable, and nationwide courier delivery service. Move your parcels anywhere with confidence.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="/track" className="hover:text-primary transition-colors">Track Parcel</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect With Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="WhatsApp"
              >
                <SiWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2025. Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
