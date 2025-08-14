"use client";

import { useEffect, useState } from 'react';
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { db } from '@/config/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { Eye, EyeOff } from 'lucide-react';

// Define the User type based on Firestore structure
export interface User {
  id: string;
  fullName: string;
  email: string;
  userRole: 'customer' | 'car_owner' | 'admin';
  phoneNumber: string;
  createdAt: { toDate: () => Date }; // Firestore timestamp
  profileComplete: boolean;
  emailVerified: boolean;
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
  password?: string;
}



export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState<string | null>(null);
  const [loadingPassword, setLoadingPassword] = useState(false);

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

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      // The user will be automatically removed from the list due to the real-time listener
    } catch (error) {
      console.error("Error deleting user:", error);
      // You might want to show a toast notification here
    }
  };

  const fetchUserPassword = async (userId: string) => {
    if (userPassword && showPassword) {
      setShowPassword(false);
      setUserPassword(null);
      return;
    }

    setLoadingPassword(true);
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserPassword(userData.password || 'No password found');
        setShowPassword(true);
      } else {
        setUserPassword('User not found');
        setShowPassword(true);
      }
    } catch (error) {
      console.error("Error fetching user password:", error);
      setUserPassword('Error fetching password');
      setShowPassword(true);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDrawerClose = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setShowPassword(false);
      setUserPassword(null);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <DataTable columns={columns} data={users} onUserSelect={handleUserSelect} onDeleteUser={handleDeleteUser} />

      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerClose}>
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
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <strong>Password:</strong>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUserPassword(selectedUser.id)}
                      disabled={loadingPassword}
                      className="flex items-center gap-2"
                    >
                      {loadingPassword ? (
                        'Loading...'
                      ) : showPassword ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Show
                        </>
                      )}
                    </Button>
                  </div>
                  {showPassword && userPassword && (
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded border font-mono text-sm break-all">
                      {userPassword}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}