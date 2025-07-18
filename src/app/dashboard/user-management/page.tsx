"use client";

import { useEffect, useState } from 'react';
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

// Define the User type based on Firestore structure
export interface User {
  id: string;
  fullName: string;
  email: string;
  userRole: 'customer' | 'car_owner' | 'admin';
  phoneNumber: string;
  createdAt: { toDate: () => Date }; // Firestore timestamp
  profileComplete: boolean;
  profileImageUrl?: string;
  address?: string;
  emergencyContact?: string;
  documents?: {
    government_id?: { url: string; status: string };
    license_front?: { url: string; status: string };
    license_back?: { url: string; status: string };
    selfie_with_license?: { url: string; status: string };
  };
  lastLogin?: { toDate: () => Date };
}



export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), where("userRole", "in", ["customer", "car_owner"]));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <DataTable columns={columns} data={users} onUserSelect={handleUserSelect} />

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          {selectedUser && (
            <div className="mx-auto w-full max-w-2xl p-6">
              <DrawerHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.profileImageUrl} alt={selectedUser.fullName} />
                    <AvatarFallback>{selectedUser.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DrawerTitle className="text-2xl">{selectedUser.fullName}</DrawerTitle>
                    <DrawerDescription>{selectedUser.email}</DrawerDescription>
                  </div>
                </div>
              </DrawerHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div><strong>Role:</strong> {selectedUser.userRole}</div>
                <div><strong>Phone:</strong> {selectedUser.phoneNumber}</div>
                <div><strong>Address:</strong> {selectedUser.address}</div>
                <div><strong>Emergency Contact:</strong> {selectedUser.emergencyContact}</div>
                <div><strong>Joined:</strong> {selectedUser.createdAt.toDate().toLocaleDateString()}</div>
                <div><strong>Last Login:</strong> {selectedUser.lastLogin?.toDate().toLocaleDateString() || 'N/A'}</div>
                <div><strong>Profile Complete:</strong> {selectedUser.profileComplete ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}