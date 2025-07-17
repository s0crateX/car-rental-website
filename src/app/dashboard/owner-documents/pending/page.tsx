"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Toaster, toast } from 'sonner';
import { Preloader } from '@/components/common/preloader';
import { UserList } from '../components/UserList';
import { UserDetails } from '../components/UserDetails';

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
  organizationName: string;
  profileImageUrl: string;
  documents: {
    [key: string]: Document | undefined;
  };
}



export default function PendingCarOwnerApprovalsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('userRole', '==', 'car_owner'));
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
      <UserList
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        className={`w-full md:w-1/3 border-r border-border ${selectedUser ? 'hidden md:block' : 'block'}`}
      />
      <div className={`w-full md:w-2/3 p-4 ${selectedUser ? 'block' : 'hidden md:block'}`}>
        {selectedUser ? (
          <UserDetails
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onVerification={handleVerification}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a car owner to view their details.</p>
          </div>
        )}
      </div>
    </div>
  );
}