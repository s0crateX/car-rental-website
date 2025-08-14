"use client";

import { useEffect, useState } from 'react';
import { collection, query, where, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Toaster, toast } from 'sonner';
import { Preloader } from '@/components/common/preloader';
import { CarList } from './components/CarList';
import { CarDetails } from './components/CarDetails';
import { Car } from '@/types/car';

// NOTE: The "FirebaseError: Missing or insufficient permissions." error
// indicates that your Firestore security rules are not set up to allow
// the necessary read/write operations for the current user.
//
// To fix this, you need to update your Firestore rules in the Firebase console.
// Here is an example set of rules that you might use. Please adapt them
// to your specific authentication and authorization needs.
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     // Allow read/write access to the 'cars' collection for authenticated users.
//     // For a production app, you should restrict this further to only allow
//     // authorized admins to verify/reject cars.
//     match /cars/{carId} {
//       allow read, write: if request.auth != null;
//     }
//
//     // Add other rules for your collections here...
//   }
// }

export default function FleetManagementPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const carsRef = collection(db, 'Cars');
    const q = query(carsRef, where('verificationStatus', '==', 'pending'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pendingCars: Car[] = [];
      querySnapshot.forEach((doc) => {
        pendingCars.push({ id: doc.id, ...doc.data() } as Car);
      });
      setCars(pendingCars);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching pending cars:", error);
      toast.error("Failed to fetch pending cars. Check console for details.");
      setLoading(false);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
  };

  const handleVerification = async (status: 'verified' | 'rejected', reason?: string) => {
    if (!selectedCar) return;

    const carDocRef = doc(db, 'Cars', selectedCar.id);

    try {
      const updateData: { verificationStatus: 'verified' | 'rejected'; rejectionReason?: string } = {
        verificationStatus: status,
      };

      if (status === 'rejected' && reason) {
        updateData.rejectionReason = reason;
      }

      await updateDoc(carDocRef, updateData);

      // Clear selection since the car will be removed from pending list by real-time listener
      setSelectedCar(null);

      toast.success(
        status === 'verified' 
          ? 'Car verified successfully and is now listed for rent.'
          : 'Car rejected successfully.'
      );
    } catch (error) {
      console.error('Error updating car:', error);
      toast.error('Failed to update car status.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Preloader className="w-24 h-24" /></div>;
  }

  return (
    <div className="relative flex flex-col md:flex-row h-screen bg-background text-foreground">
      <Toaster />
      <div className="w-full md:w-1/3 border-r border-border">
        <CarList
          cars={cars}
          selectedCar={selectedCar}
          onCarSelect={handleCarSelect}
        />
      </div>
      <div className="hidden md:block w-full md:w-2/3 p-4">
        {selectedCar ? (
          <CarDetails
            car={selectedCar}
            onClose={() => setSelectedCar(null)}
            onVerification={handleVerification}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a car to view its details.</p>
          </div>
        )}
      </div>

      {/* Mobile/Tablet Modal for Car Details */}
      {selectedCar && (
        <div className="md:hidden fixed inset-0 bg-background z-50">
          <CarDetails
            car={selectedCar}
            onClose={() => setSelectedCar(null)}
            onVerification={handleVerification}
          />
        </div>
      )}
    </div>
  );
}