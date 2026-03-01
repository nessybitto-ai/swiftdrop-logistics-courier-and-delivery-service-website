import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

export default function FAQSection() {
  const faqs = [
    {
      question: 'What are your delivery times?',
      answer:
        'We offer same-day delivery for orders placed before 12 PM in major cities. Interstate deliveries typically take 2-5 business days depending on the destination. Express options are available for urgent shipments.',
    },
    {
      question: 'How is pricing calculated?',
      answer:
        'Pricing is based on package weight, dimensions, delivery distance, and service type. Same-day and express deliveries have premium rates. Contact us for a detailed quote or use our online calculator.',
    },
    {
      question: 'What items cannot be shipped?',
      answer:
        'We cannot ship hazardous materials, illegal substances, perishable food items without proper packaging, live animals, or items prohibited by law. Contact us if you\'re unsure about your item.',
    },
    {
      question: 'How do I track my package?',
      answer:
        'You\'ll receive a tracking number when your package is picked up. Enter this number on our Track Parcel page to see real-time updates on your delivery status.',
    },
    {
      question: 'What if my package is damaged or lost?',
      answer:
        'All packages are insured up to a certain value. If your package is damaged or lost, contact our customer support immediately with your tracking number. We\'ll investigate and process your claim within 48 hours.',
    },
    {
      question: 'Do you offer corporate accounts?',
      answer:
        'Yes! We offer dedicated corporate accounts with volume discounts, scheduled pickups, invoice billing, and a dedicated account manager. Contact our sales team to set up your business account.',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
