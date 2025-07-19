"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types/user';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

interface UserDetailsProps {
  user: User;
  onClose: () => void;
  onVerification: (
    documentName: string,
    status: 'verified' | 'rejected',
    reason?: string
  ) => void;
  className?: string;
}

const commonRejectionReasons = [
  'Image is blurry or unclear',
  'Information does not match profile',
  'Document is expired',
  'Incorrect document type',
  'Other (please specify)',
];

import { ImageZoomModal } from '@/components/common/ImageZoomModal';

export function UserDetails({ user, onClose, onVerification, className }: UserDetailsProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleReject = (documentName: string) => {
    const finalReason =
      rejectionReason === 'Other (please specify)'
        ? customRejectionReason
        : rejectionReason;
    if (!finalReason) {
      toast.error('Please select or provide a reason for rejection.');
      return;
    }
    onVerification(documentName, 'rejected', finalReason);
    setRejectionReason('');
    setCustomRejectionReason('');
  };

  return (
    <div className={className}>
      <ScrollArea className="h-full">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="mr-2 md:hidden"
                onClick={onClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.fullName}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {user.organizationName}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {user.documents &&
                Object.entries(user.documents).map(
                  ([key, value]) =>
                    value && (
                      <Card key={key}>
                        <CardHeader>
                          <CardTitle className="text-base capitalize">
                            {key.replace(/_/g, ' ')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                          <div
                            onClick={() => setZoomedImage(value.url)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src={value.url}
                              alt={key}
                              width={400}
                              height={200}
                              className="object-cover w-full rounded-md h-48"
                            />
                          </div>
                          <p className="mt-2 text-sm">
                            Status:{' '}
                            <span
                              className={`font-semibold ${
                                value.status.toLowerCase() === 'verified'
                                  ? 'text-green-500'
                                  : value.status.toLowerCase() === 'rejected'
                                  ? 'text-red-500'
                                  : 'text-yellow-500'
                              }`}
                            >
                              {value.status}
                            </span>
                          </p>
                          {value.status.toLowerCase() === 'rejected' &&
                            value.rejectionReason && (
                              <p className="mt-1 text-xs text-red-500">
                                Reason: {value.rejectionReason}
                              </p>
                            )}
                          {value.status.toLowerCase() === 'pending' && (
                            <div className="flex gap-2 mt-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    Verify
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will mark the document as verified.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        onVerification(key, 'verified')
                                      }
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    Reject
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Reason for Rejection
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Please select a reason for rejecting this document.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <RadioGroup
                                      onValueChange={setRejectionReason}
                                      value={rejectionReason}
                                    >
                                      {commonRejectionReasons.map((reason) => (
                                        <div
                                          key={reason}
                                          className="flex items-center space-x-2"
                                        >
                                          <RadioGroupItem
                                            value={reason}
                                            id={reason}
                                          />
                                          <Label htmlFor={reason}>{reason}</Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                    {rejectionReason ===
                                      'Other (please specify)' && (
                                      <Textarea
                                        placeholder="Please specify the reason for rejection."
                                        value={customRejectionReason}
                                        onChange={(e) =>
                                          setCustomRejectionReason(e.target.value)
                                        }
                                      />
                                    )}
                                  </div>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleReject(key)}
                                    >
                                      Confirm Rejection
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                )}
            </div>
          </CardContent>
        </Card>
      </ScrollArea>

      <ImageZoomModal 
        imageUrl={zoomedImage || ''}
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
      />
    </div>
  );
}