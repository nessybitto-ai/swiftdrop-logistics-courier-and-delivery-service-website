import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { 
  useIsCallerAdmin, 
  useGetAllDeliveryRequests, 
  useGetAllTestimonials, 
  useUpdateTrackingStatus,
  useGenerateTrackingNumber,
  useGetTrackingInfo,
  useCreateTrackingNumberRequest,
  useGetAllTrackingNumberRequests
} from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Loader2, Package, MessageSquare, TruckIcon, AlertCircle, Plus, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { TrackingStatus, DeliveryRequest } from '../backend';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: deliveryRequests, isLoading: requestsLoading } = useGetAllDeliveryRequests();
  const { data: testimonials, isLoading: testimonialsLoading } = useGetAllTestimonials();
  const { data: trackingNumberRequests, isLoading: trackingRequestsLoading } = useGetAllTrackingNumberRequests();
  const updateStatusMutation = useUpdateTrackingStatus();
  const generateTrackingMutation = useGenerateTrackingNumber();
  const createTrackingRequestMutation = useCreateTrackingNumberRequest();

  const [selectedStatus, setSelectedStatus] = useState<Record<string, TrackingStatus>>({});
  const [trackingCache, setTrackingCache] = useState<Record<string, TrackingStatus>>({});
  
  const [trackingRequestForm, setTrackingRequestForm] = useState({
    senderName: '',
    receiverName: '',
    parcelDescription: '',
  });

  useEffect(() => {
    if (!isInitializing && !identity) {
      toast.error('Please log in to access the admin dashboard');
      navigate({ to: '/' });
    }
  }, [isInitializing, identity, navigate]);

  useEffect(() => {
    if (!isAdminLoading && isAdmin === false) {
      toast.error('Unauthorized: Admin access required');
      navigate({ to: '/' });
    }
  }, [isAdmin, isAdminLoading, navigate]);

  const handleGenerateTracking = async (requestId: bigint) => {
    try {
      const trackingNumber = await generateTrackingMutation.mutateAsync(requestId);
      toast.success(`Tracking number generated: ${trackingNumber}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate tracking number');
    }
  };

  const handleStatusUpdate = async (trackingNumber: string) => {
    const newStatus = selectedStatus[trackingNumber];
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({ trackingNumber, newStatus });
      toast.success('Tracking status updated successfully');
      setSelectedStatus((prev) => {
        const updated = { ...prev };
        delete updated[trackingNumber];
        return updated;
      });
      setTrackingCache((prev) => ({
        ...prev,
        [trackingNumber]: newStatus,
      }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleCreateTrackingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingRequestForm.senderName || !trackingRequestForm.receiverName || !trackingRequestForm.parcelDescription) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createTrackingRequestMutation.mutateAsync(trackingRequestForm);
      toast.success('Tracking number request created successfully');
      setTrackingRequestForm({
        senderName: '',
        receiverName: '',
        parcelDescription: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create tracking number request');
    }
  };

  const getStatusBadge = (status: TrackingStatus) => {
    const statusMap = {
      accepted: { label: 'Accepted', variant: 'secondary' as const },
      inTransit: { label: 'In Transit', variant: 'default' as const },
      arrivedAtFacility: { label: 'At Facility', variant: 'default' as const },
      outForDelivery: { label: 'Out for Delivery', variant: 'default' as const },
      delivered: { label: 'Delivered', variant: 'default' as const },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  if (isInitializing || isAdminLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity || isAdmin === false) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage delivery requests, tracking statuses, and testimonials</p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="requests" className="gap-2">
            <Package className="h-4 w-4" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <TruckIcon className="h-4 w-4" />
            Manage Deliveries
          </TabsTrigger>
          <TabsTrigger value="tracking-requests" className="gap-2">
            <FileText className="h-4 w-4" />
            Tracking Number Requests
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Testimonials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Delivery Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : deliveryRequests && deliveryRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking #</TableHead>
                        <TableHead>Sender</TableHead>
                        <TableHead>Receiver</TableHead>
                        <TableHead>Pickup Address</TableHead>
                        <TableHead>Delivery Address</TableHead>
                        <TableHead>Parcel</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveryRequests.map((request) => (
                        <TableRow key={Number(request.requestId)}>
                          <TableCell className="font-mono text-sm">
                            {request.trackingNumber || (
                              <span className="text-muted-foreground italic">Not generated</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{request.senderName}</div>
                              <div className="text-muted-foreground">{request.senderPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{request.receiverName}</div>
                              <div className="text-muted-foreground">{request.receiverPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm">{request.pickupAddress}</TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm">{request.deliveryAddress}</TableCell>
                          <TableCell className="text-sm">{request.parcelDescription}</TableCell>
                          <TableCell className="text-sm">{request.parcelWeight}</TableCell>
                          <TableCell className="text-sm">{formatDate(request.createdAt)}</TableCell>
                          <TableCell>
                            {!request.trackingNumber && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGenerateTracking(request.requestId)}
                                disabled={generateTrackingMutation.isPending}
                                className="gap-2"
                              >
                                {generateTrackingMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Plus className="h-4 w-4" />
                                    Generate
                                  </>
                                )}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>No delivery requests found</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : deliveryRequests && deliveryRequests.filter(r => r.trackingNumber).length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking #</TableHead>
                        <TableHead>Sender</TableHead>
                        <TableHead>Receiver</TableHead>
                        <TableHead>Current Status</TableHead>
                        <TableHead>Update Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveryRequests
                        .filter(request => request.trackingNumber)
                        .map((request) => (
                          <TrackingRow
                            key={request.trackingNumber}
                            request={request}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                            handleStatusUpdate={handleStatusUpdate}
                            updateStatusMutation={updateStatusMutation}
                            getStatusBadge={getStatusBadge}
                            trackingCache={trackingCache}
                          />
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>No packages with tracking numbers found. Generate tracking numbers in the Requests tab first.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Tracking Number Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTrackingRequest} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input
                      id="senderName"
                      placeholder="Enter sender name"
                      value={trackingRequestForm.senderName}
                      onChange={(e) =>
                        setTrackingRequestForm((prev) => ({
                          ...prev,
                          senderName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiverName">Receiver Name</Label>
                    <Input
                      id="receiverName"
                      placeholder="Enter receiver name"
                      value={trackingRequestForm.receiverName}
                      onChange={(e) =>
                        setTrackingRequestForm((prev) => ({
                          ...prev,
                          receiverName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parcelDescription">Parcel Description</Label>
                  <Textarea
                    id="parcelDescription"
                    placeholder="Enter parcel description"
                    value={trackingRequestForm.parcelDescription}
                    onChange={(e) =>
                      setTrackingRequestForm((prev) => ({
                        ...prev,
                        parcelDescription: e.target.value,
                      }))
                    }
                    rows={3}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createTrackingRequestMutation.isPending}
                  className="gap-2"
                >
                  {createTrackingRequestMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Tracking Number Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {trackingRequestsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : trackingNumberRequests && trackingNumberRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Sender Name</TableHead>
                        <TableHead>Receiver Name</TableHead>
                        <TableHead>Parcel Description</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trackingNumberRequests.map((request) => (
                        <TableRow key={Number(request.requestId)}>
                          <TableCell className="font-mono text-sm">
                            #{Number(request.requestId)}
                          </TableCell>
                          <TableCell className="text-sm">{request.senderName}</TableCell>
                          <TableCell className="text-sm">{request.receiverName}</TableCell>
                          <TableCell className="max-w-[300px] text-sm">
                            {request.parcelDescription}
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(request.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>No tracking number requests found. Create your first request above.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              {testimonialsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : testimonials && testimonials.length > 0 ? (
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <Card key={index} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={testimonial.authorImage}
                            alt={testimonial.authorName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="mb-2 flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{testimonial.authorName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(testimonial.createdAt)}
                                </div>
                              </div>
                              <Badge variant="secondary">
                                {testimonial.rating} ⭐
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>No testimonials found</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TrackingRowProps {
  request: DeliveryRequest;
  selectedStatus: Record<string, TrackingStatus>;
  setSelectedStatus: React.Dispatch<React.SetStateAction<Record<string, TrackingStatus>>>;
  handleStatusUpdate: (trackingNumber: string) => Promise<void>;
  updateStatusMutation: any;
  getStatusBadge: (status: TrackingStatus) => React.ReactElement;
  trackingCache: Record<string, TrackingStatus>;
}

function TrackingRow({
  request,
  selectedStatus,
  setSelectedStatus,
  handleStatusUpdate,
  updateStatusMutation,
  getStatusBadge,
  trackingCache,
}: TrackingRowProps) {
  const { data: trackingInfo, isLoading } = useGetTrackingInfo(request.trackingNumber, true);

  const currentStatus = trackingCache[request.trackingNumber] || trackingInfo?.currentStatus;

  return (
    <TableRow>
      <TableCell className="font-mono text-sm">{request.trackingNumber}</TableCell>
      <TableCell className="text-sm">{request.senderName}</TableCell>
      <TableCell className="text-sm">{request.receiverName}</TableCell>
      <TableCell>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : currentStatus ? (
          getStatusBadge(currentStatus)
        ) : (
          <span className="text-sm text-muted-foreground">Unknown</span>
        )}
      </TableCell>
      <TableCell>
        <Select
          value={selectedStatus[request.trackingNumber] || ''}
          onValueChange={(value) =>
            setSelectedStatus((prev) => ({
              ...prev,
              [request.trackingNumber]: value as TrackingStatus,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TrackingStatus.accepted}>Accepted</SelectItem>
            <SelectItem value={TrackingStatus.inTransit}>In Transit</SelectItem>
            <SelectItem value={TrackingStatus.arrivedAtFacility}>At Facility</SelectItem>
            <SelectItem value={TrackingStatus.outForDelivery}>Out for Delivery</SelectItem>
            <SelectItem value={TrackingStatus.delivered}>Delivered</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          onClick={() => handleStatusUpdate(request.trackingNumber)}
          disabled={
            !selectedStatus[request.trackingNumber] ||
            updateStatusMutation.isPending
          }
        >
          {updateStatusMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Update'
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}
