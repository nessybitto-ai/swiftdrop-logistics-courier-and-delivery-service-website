import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageCircle, X } from 'lucide-react';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Chat with Us</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-semibold">SwiftDrop Support</p>
                <p className="text-muted-foreground">
                  Hello! How can we help you today?
                </p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>For immediate assistance:</p>
                <p className="mt-2 font-semibold text-foreground">
                  Call: +1 (555) 123-4567
                </p>
                <p className="font-semibold text-foreground">
                  Email: support@swiftdrop.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
