"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Car } from '@/types/car';
import Image from 'next/image';
import { ImageZoomModal } from '@/components/common/ImageZoomModal';

interface CarDetailsProps {
  car: Car;
  onClose: () => void;
  onVerification: (status: 'verified' | 'rejected', reason?: string) => void;
}

export function CarDetails({ car, onClose, onVerification }: CarDetailsProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const commonRejectionReasons = [
    'Invalid/unclear documents',
    'Information mismatch',
    'Vehicle not as described',
    'Incomplete information',
  ];
  return (
    <Card className="h-[calc(100vh-2rem)] md:h-full flex flex-col overflow-hidden max-w-full">
      <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-4 md:p-6 shrink-0">
        <CardTitle className="text-base sm:text-lg md:text-xl truncate">{`${car.brand} ${car.model} (${car.year})`}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <ScrollArea className="flex-grow overflow-y-auto">
        <CardContent className="p-2 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            {/* Basic Info */}
            <div className="space-y-2 sm:space-y-3 md:col-span-1">
              <h3 className="font-semibold text-sm sm:text-base">🏷️ Basic Info</h3>
              <div className="grid grid-cols-[max-content_1fr] gap-x-2 sm:gap-x-4 gap-y-1 text-xs sm:text-sm">
                <p className="font-medium text-muted-foreground">Brand:</p><p>{car.brand}</p>
                <p className="font-medium text-muted-foreground">Model:</p><p>{car.model}</p>
                <p className="font-medium text-muted-foreground">Year:</p><p>{car.year}</p>
                <p className="font-medium text-muted-foreground">Type:</p><p>{car.type}</p>
                <p className="font-medium text-muted-foreground">Transmission:</p><p>{car.transmissionType}</p>
                <p className="font-medium text-muted-foreground">Fuel:</p><p>{car.fuelType}</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="space-y-2 sm:space-y-3 md:col-span-1">
              <h3 className="font-semibold text-sm sm:text-base">💺 Capacity</h3>
              <div className="grid grid-cols-[max-content_1fr] gap-x-2 sm:gap-x-4 gap-y-1 text-xs sm:text-sm">
                <p className="font-medium text-muted-foreground">Seats:</p><p>{car.seats}</p>
                <p className="font-medium text-muted-foreground">Luggage:</p><p>{car.luggage}</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2 sm:space-y-3 md:col-span-1">
              <h3 className="font-semibold text-sm sm:text-base">💵 Pricing</h3>
              <div className="grid grid-cols-[max-content_1fr] gap-x-2 sm:gap-x-4 gap-y-1 text-xs sm:text-sm">
                <p className="font-medium text-muted-foreground">Hourly Rate:</p><p>₱{car.hourlyRate}</p>
                <p className="font-medium text-muted-foreground">Delivery:</p><p>₱{car.deliveryCharge}</p>
              </div>
              {car.extraCharges && car.extraCharges.length > 0 && (
                <div className="pt-1 sm:pt-2">
                  <h4 className="font-medium text-xs sm:text-sm text-muted-foreground">Extra Charges:</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                    {car.extraCharges.map((charge, index) => (
                      <Badge key={index} variant="secondary">{`₱${charge.amount} - ${charge.name}`}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-2 sm:space-y-3 md:col-span-3">
              <h3 className="font-semibold text-sm sm:text-base">📦 Features</h3>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {car.features.map((feature, index) => (
                  <Badge key={index}>{feature}</Badge>
                ))}
              </div>
            </div>

            {/* Rental Requirements */}
            <div className="space-y-2 sm:space-y-3 md:col-span-3">
              <h3 className="font-semibold text-sm sm:text-base">📋 Rental Requirements</h3>
              <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
                {car.rentalRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Location */}
            <div className="space-y-2 sm:space-y-3 md:col-span-3">
              <h3 className="font-semibold text-sm sm:text-base">📍 Location</h3>
              <p className="text-xs sm:text-sm">{car.location.address}</p>
              {/* Optional: Map preview can be added here */}
            </div>

            {/* Image Gallery */}
            <div className="space-y-2 sm:space-y-3 md:col-span-3">
              <h3 className="font-semibold text-sm sm:text-base">🖼️ Image Gallery</h3>
              <Carousel className="w-full">
                <CarouselContent>
                  {car.carImageGallery.map((img, index) => (
                    <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/5">
                      <div className="p-1">
                        <Image src={img} alt={`Car image ${index + 1}`} width={96} height={96} className="rounded-md object-cover w-full h-16 sm:h-24 cursor-pointer" onClick={() => setSelectedImage(img)} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-2 bg-background/50 hover:bg-background/80" />
                <CarouselNext className="-right-2 bg-background/50 hover:bg-background/80" />
              </Carousel>
            </div>

            {/* Documents */}
            <div className="space-y-2 sm:space-y-3 md:col-span-3">
              <h3 className="font-semibold text-sm sm:text-base">📄 Documents</h3>
              <Carousel className="w-full">
                <CarouselContent>
                  {[...car.crDocuments, ...car.orDocuments].map((doc, index) => (
                    <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/5">
                      <div className="p-1">
                        <Image src={doc} alt={`Document ${index + 1}`} width={96} height={96} className="rounded-md object-cover w-full h-16 sm:h-24 cursor-pointer" onClick={() => setSelectedImage(doc)} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-2 bg-background/50 hover:bg-background/80" />
                <CarouselNext className="-right-2 bg-background/50 hover:bg-background/80" />
              </Carousel>
            </div>
          </div>
        </CardContent>
      </ScrollArea>

      {selectedImage && (
        <ImageZoomModal
          imageUrl={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      <Separator />
      <div className="p-2 sm:p-4 flex justify-end gap-2 sm:gap-4 shrink-0 relative bg-background z-20 shadow-[0_-2px_4px_rgba(0,0,0,0.05)]">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="px-4 py-2 h-9">Reject</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="z-50">
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
            <Button size="sm" className="px-4 py-2 h-9">Verify</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="z-50">
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