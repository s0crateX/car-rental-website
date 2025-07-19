export interface Document {
  url: string;
  status: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  organizationName?: string;
  profileImageUrl: string;
  documents?: {
    [key: string]: Document | undefined;
  };
}