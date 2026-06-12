export interface SubmissionRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  attend: 'yes' | 'no';
  attendType: string;
  quantity: number;
  familyName: string;
  comments: string;
  guestParam: string;
  createdAt: string;
}

export interface AdminStats {
  total: number;
  confirmed: number;
  rejected: number;
  pending: number;
  totalAttendees: number;
}

export interface FilterState {
  search: string;
  filter: 'all' | 'confirmed' | 'rejected';
}