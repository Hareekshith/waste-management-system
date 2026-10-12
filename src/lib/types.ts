export type WasteType = 'Organic' | 'Inorganic' | 'Plastic' | 'Hazardous' | 'E-Waste' | 'Medical' | 'Household' | 'Mixed';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Completed' | 'Rejected';

export interface Complaint {
  id: number;
  name: string;
  mobile: string;
  email: string;
  wastetype: string; // comma separated or single
  location: string;
  locationdescription: string;
  file: string; // image filename or base64 data URL
  date: string;
  status: ComplaintStatus;
  adminRemarks?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'citizen' | 'admin';
  status: 'verified' | 'notverified';
  code: number;
  createdAt?: string;
}

export interface ContactMessage {
  id: number;
  fname: string;
  lname: string;
  contactEmail: string;
  contactPhone: string;
  comment: string;
  createdAt: string;
}

export interface SystemStats {
  totalComplaints: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  rejectedCount: number;
  totalUsers: number;
  recentComplaints: Complaint[];
  wasteTypeCounts: Record<string, number>;
}
