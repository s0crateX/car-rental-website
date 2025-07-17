"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Car } from '@/types/car';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface CarDetailsProps {
  car: Car;
  onClose: () => void;
  onVerification: (status: 'verified' | 'rejected', reason?: string) => void;
}

export function CarDetails({ car, onClose, onVerification }: CarDetailsProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  const commonRejectionReasons = [
    'Invalid/unclear documents',
    'Information mismatch',
    'Vehicle not as described',
    'Incomplete information',
  ];
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{`${car.brand} ${car.model} (${car.year})`}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic Info */}
            <div className="space-y-2 md:col-span-1">
              <h3 className="font-semibold">🏷️ Basic Info</h3>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <p><span className="font-medium">Brand:</span> {car.brand}</p>
                <p><span className="font-medium">Model:</span> {car.model}</p>
                <p><span className="font-medium">Year:</span> {car.year}</p>
                <p><span className="font-medium">Type:</span> {car.type}</p>
                <p><span className="font-medium">Transmission:</span> {car.transmissionType}</p>
                <p><span className="font-medium">Fuel:</span> {car.fuelType}</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="space-y-2 md:col-span-1">
              <h3 className="font-semibold">💺 Capacity</h3>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <p><span className="font-medium">Seats:</span> {car.seats}</p>
                <p><span className="font-medium">Luggage:</span> {car.luggage}</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2 md:col-span-1">
              <h3 className="font-semibold">💵 Pricing</h3>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <p><span className="font-medium">Hourly Rate:</span> ₱{car.hourlyRate}</p>
                <p><span className="font-medium">Delivery:</span> ₱{car.deliveryCharge}</p>
              </div>
              {car.extraCharges && car.extraCharges.length > 0 && (
                <div>
                  <h4 className="font-medium">Extra Charges:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {car.extraCharges.map((charge, index) => (
                      <Badge key={index} variant="secondary">{`₱${charge.amount} - ${charge.name}`}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-2 md:col-span-3">
              <h3 className="font-semibold">📦 Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <Badge key={index}>{feature}</Badge>
                ))}
              </div>
            </div>

            {/* Rental Requirements */}
            <div className="space-y-2 md:col-span-3">
              <h3 className="font-semibold">📋 Rental Requirements</h3>
              <ul className="list-disc list-inside text-xs">
                {car.rentalRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Location */}
            <div className="space-y-2 md:col-span-3">
              <h3 className="font-semibold">📍 Location</h3>
              <p className="text-xs">{car.location.address}</p>
              {/* Optional: Map preview can be added here */}
            </div>

            {/* Image Gallery */}
            <div className="space-y-2 md:col-span-3">
              <h3 className="font-semibold">🖼️ Image Gallery</h3>
              <Carousel className="w-full">
                <CarouselContent>
                  {car.carImageGallery.map((img, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <img src={img} alt={`Car image ${index + 1}`} className="rounded-md object-cover w-full h-24 cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogTitle className="sr-only">Car Image</DialogTitle>
                          <img src={img} alt={`Car image ${index + 1}`} className="rounded-lg object-contain w-full h-full" />
                        </DialogContent>
                      </Dialog>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            {/* Documents */}
            <div className="space-y-2 md:col-span-3">
              <h3 className="font-semibold">📄 Documents</h3>
              <div className="flex flex-wrap gap-4">
                {car.crDocuments.map((doc, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Button variant="outline">View Document {index + 1}</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0">
                      <DialogTitle className="sr-only">Document</DialogTitle>
                      <TransformWrapper>
                        {({ zoomIn, zoomOut, resetTransform }) => (
                          <>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                              <Button size="icon" variant="outline" onClick={() => zoomIn()}><ZoomIn className="h-4 w-4" /></Button>
                              <Button size="icon" variant="outline" onClick={() => zoomOut()}><ZoomOut className="h-4 w-4" /></Button>
                              <Button size="icon" variant="outline" onClick={() => resetTransform()}><RotateCcw className="h-4 w-4" /></Button>
                            </div>
                            <TransformComponent wrapperStyle={{ width: '100%', height: '80vh' }}>
                              <img src={doc} alt={`Document ${index + 1}`} className="w-full h-full object-contain" />
                            </TransformComponent>
                          </>
                        )}
                      </TransformWrapper>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </ScrollArea>
      <Separator />
      <div className="p-4 flex justify-end gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Reject</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reason for Rejection</AlertDialogTitle>
              <AlertDialogDescription>
                Please select a reason for rejecting this vehicle or provide a custom reason.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-4">
              <RadioGroup onValueChange={setRejectionReason}>
                {commonRejectionReasons.map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason} id={reason} />
                    <Label htmlFor={reason}>{reason}</Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Other (please specify)</Label>
                </div>
              </RadioGroup>
              {rejectionReason === 'custom' && (
                <Textarea
                  placeholder="Please specify the reason for rejection"
                  value={customRejectionReason}
                  onChange={(e) => setCustomRejectionReason(e.target.value)}
                />
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                const finalReason = rejectionReason === 'custom' ? customRejectionReason : rejectionReason;
                onVerification('rejected', finalReason);
              }}
                disabled={!rejectionReason || (rejectionReason === 'custom' && !customRejectionReason)}
              >
                Confirm Rejection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Verify</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will mark the vehicle as verified and make it available for rent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onVerification('verified')}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}