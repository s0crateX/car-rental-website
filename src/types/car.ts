export interface Car {
  id: string;
  brand: string;
  model: string;
  year: string;
  type: string;
  transmissionType: 'Manual' | 'Automatic';
  fuelType: string;
  seats: string;
  luggage: string;
  hourlyRate: number;
  deliveryCharge: number;
  features: string[];
  rentalRequirements: string[];
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  carImageGallery: string[];
  crDocuments: string[];
  orDocuments: string[];
  carOwnerFullName: string;
  carOwnerDocumentId: string;
  availabilityStatus: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  extraCharges: Array<{
    amount: number;
    name: string;
  }>;
  createdAt: { toDate: () => Date };
  description: string;
  rating: number;
  reviewCount: number;
}