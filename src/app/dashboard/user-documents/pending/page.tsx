"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Toaster, toast } from 'sonner';
import { Preloader } from '@/components/common/preloader';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Document {
  url: string;
  status: string;
  rejectionReason?: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profileImageUrl: string;
  documents: {
    [key: string]: Document | undefined;
  };
}

const commonRejectionReasons = [
  'Image is blurry or unclear',
  'Information does not match profile',
  'Document is expired',
  'Incorrect document type',
  'Other (please specify)',
];

export default function PendingApprovalsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customRejectionReason, setCustomRejectionReason] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('userRole', '==', 'customer'));
      const querySnapshot = await getDocs(q);
      const pendingUsers: User[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as Omit<User, 'id'>;
        const documents = userData.documents;
        if (documents) {
          const hasPending = Object.values(documents).some(
            (doc) => doc.status && doc.status.toLowerCase() === 'pending'
          );
          if (hasPending) {
            pendingUsers.push({ id: doc.id, ...userData });
          }
        }
      });
      setUsers(pendingUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleVerification = async (documentName: string, status: 'verified' | 'rejected', reason?: string) => {
    if (!selectedUser) return;

    const userDocRef = doc(db, 'users', selectedUser.id);
    const statusField = `documents.${documentName}.status`;
    const reasonField = `documents.${documentName}.rejectionReason`;

    const updateData: { [key: string]: any } = {
      [statusField]: status,
      lastDocumentUpdate: new Date(),
    };
    if (status === 'rejected' && reason) {
      updateData[reasonField] = reason;
    } else {
      updateData[reasonField] = ''; // Clear reason on verification
    }

    try {
      await updateDoc(userDocRef, updateData);

      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          const newDocuments = { ...user.documents };
          const docToUpdate = newDocuments[documentName];
          if (docToUpdate) {
            docToUpdate.status = status;
            if (status === 'rejected' && reason) {
              docToUpdate.rejectionReason = reason;
            } else {
              delete docToUpdate.rejectionReason;
            }
          }
          return { ...user, documents: newDocuments };
        }
        return user;
      });

      // After verification, filter out users with no more pending documents
      const stillPendingUsers = updatedUsers.filter(user => {
        if (!user.documents) return false;
        return Object.values(user.documents).some(doc => doc.status && doc.status.toLowerCase() === 'pending');
      });

      setUsers(stillPendingUsers);

      // If the selected user has no more pending documents, clear the selection
      const selectedUserStillHasPending = stillPendingUsers.some(user => user.id === selectedUser.id);
      if (!selectedUserStillHasPending) {
        setSelectedUser(null);
      }

      toast.success(`Document ${status} successfully.`);
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Preloader className="w-24 h-24" /></div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      <Toaster />
      <div className={`w-full md:w-1/3 border-r border-border ${selectedUser ? 'hidden md:block' : 'block'}`}>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <CardContent>
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-2 my-2 rounded-lg cursor-pointer hover:bg-accent ${selectedUser?.id === user.id ? 'bg-accent' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                <Avatar className="w-10 h-10 mr-4">
                  <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.fullName}</span>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </div>
      <div className={`w-full md:w-2/3 p-4 ${selectedUser ? 'block' : 'hidden md:block'}`}>
        {selectedUser ? (
          <ScrollArea className="h-full">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Button variant="ghost" className="mr-2 md:hidden" onClick={() => setSelectedUser(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={selectedUser.profileImageUrl} alt={selectedUser.fullName} />
                    <AvatarFallback>{selectedUser.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedUser.fullName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(selectedUser.documents).map(([key, value]) => (
                    <Card key={key}>
                      <CardHeader>
                        <CardTitle className="text-base capitalize">{key.replace(/_/g, ' ')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Zoom>
                          <img src={value.url} alt={key} className="object-cover w-full rounded-md h-40" />
                        </Zoom>
                        <p className="mt-2 text-sm">Status: <span className={`font-semibold ${value.status && value.status.toLowerCase() === 'verified' ? 'text-green-500' : value.status && value.status.toLowerCase() === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>{value.status}</span></p>
                        {value.status === 'rejected' && value.rejectionReason && (
                          <p className="mt-1 text-xs text-red-500">Reason: {value.rejectionReason}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">Verify</Button>
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
                                <AlertDialogAction onClick={() => handleVerification(key, 'verified')}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">Reject</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reason for Rejection</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Please select a reason for rejecting this document.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="grid gap-4 py-4">
                                <RadioGroup onValueChange={setRejectionReason} defaultValue={rejectionReason}>
                                  {commonRejectionReasons.map((reason) => (
                                    <div key={reason} className="flex items-center space-x-2">
                                      <RadioGroupItem value={reason} id={reason} />
                                      <Label htmlFor={reason}>{reason}</Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                                {rejectionReason === 'Other (please specify)' && (
                                  <Textarea
                                    placeholder="Please specify the reason for rejection."
                                    value={customRejectionReason}
                                    onChange={(e) => setCustomRejectionReason(e.target.value)}
                                  />
                                )}
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    const finalReason = rejectionReason === 'Other (please specify)' ? customRejectionReason : rejectionReason;
                                    if (!finalReason) {
                                      toast.error('Please select or provide a reason for rejection.');
                                      return;
                                    }
                                    handleVerification(key, 'rejected', finalReason);
                                  }}
                                >
                                  Confirm Rejection
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a user to view their details.</p>
          </div>
        )}
      </div>
    </div>
  );
}