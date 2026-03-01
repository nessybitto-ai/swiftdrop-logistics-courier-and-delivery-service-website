import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Search, Package, Truck, Building2, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { useGetTrackingInfo } from '../hooks/useQueries';
import { TrackingStatus } from '../backend';

export default function TrackingPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { tracking?: string };
  const [trackingNumber, setTrackingNumber] = useState(search.tracking || '');
  const [searchQuery, setSearchQuery] = useState(search.tracking || '');

  const { data: trackingInfo, isLoading, error } = useGetTrackingInfo(searchQuery, searchQuery.length > 0);

  useEffect(() => {
    if (search.tracking) {
      setTrackingNumber(search.tracking);
      setSearchQuery(search.tracking);
    }
  }, [search.tracking]);

  const handleSearch = () => {
    if (trackingNumber.trim()) {
      setSearchQuery(trackingNumber.trim());
      navigate({ to: '/track', search: { tracking: trackingNumber.trim() } });
    }
  };

  const getStatusIcon = (status: TrackingStatus) => {
    switch (status) {
      case TrackingStatus.accepted:
        return Package;
      case TrackingStatus.inTransit:
        return Truck;
      case TrackingStatus.arrivedAtFacility:
        return Building2;
      case TrackingStatus.outForDelivery:
        return MapPin;
      case TrackingStatus.delivered:
        return CheckCircle2;
      default:
        return Package;
    }
  };

  const getStatusLabel = (status: TrackingStatus) => {
    switch (status) {
      case TrackingStatus.accepted:
        return 'Accepted';
      case TrackingStatus.inTransit:
        return 'In Transit';
      case TrackingStatus.arrivedAtFacility:
        return 'Arrived at Facility';
      case TrackingStatus.outForDelivery:
        return 'Out for Delivery';
      case TrackingStatus.delivered:
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const allStatuses = [
    TrackingStatus.accepted,
    TrackingStatus.inTransit,
    TrackingStatus.arrivedAtFacility,
    TrackingStatus.outForDelivery,
    TrackingStatus.delivered,
  ];

  const getCurrentStatusIndex = (status: TrackingStatus) => {
    return allStatuses.indexOf(status);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Track Your Package</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Enter your tracking number to see real-time updates on your delivery
            </p>

            <Card className="bg-card shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    placeholder="Enter tracking number (e.g., SD-1234567890)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} className="gap-2" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  Package not found. Please check your tracking number and try again.
                </AlertDescription>
              </Alert>
            )}

            {trackingInfo && (
              <div className="space-y-8">
                {/* Package Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Package Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Tracking Number</div>
                      <div className="font-semibold">{trackingInfo.trackingNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Current Status</div>
                      <div className="font-semibold text-primary">
                        {getStatusLabel(trackingInfo.currentStatus)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Sender</div>
                      <div className="font-semibold">{trackingInfo.senderName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Receiver</div>
                      <div className="font-semibold">{trackingInfo.receiverName}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {allStatuses.map((status, index) => {
                        const StatusIcon = getStatusIcon(status);
                        const currentIndex = getCurrentStatusIndex(trackingInfo.currentStatus);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        const historyEntry = trackingInfo.statusHistory.find(([s]) => s === status);

                        return (
                          <div key={status} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                  isCompleted
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                <StatusIcon className="h-6 w-6" />
                              </div>
                              {index < allStatuses.length - 1 && (
                                <div
                                  className={`h-12 w-0.5 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}
                                />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <div className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>
                                {getStatusLabel(status)}
                              </div>
                              {historyEntry && (
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(historyEntry[1])}
                                </div>
                              )}
                              {!historyEntry && !isCompleted && (
                                <div className="text-sm text-muted-foreground">Pending</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Status History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {trackingInfo.statusHistory
                        .slice()
                        .reverse()
                        .map(([status, timestamp], index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between border-b border-border/40 pb-3 last:border-0"
                          >
                            <div>
                              <div className="font-medium">{getStatusLabel(status)}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(timestamp)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!trackingInfo && !error && searchQuery && !isLoading && (
              <div className="text-center text-muted-foreground">
                Enter a tracking number to view package details
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
