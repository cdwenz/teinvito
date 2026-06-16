export interface Rsvp {
  id: string;

  name: string;
  email: string;
  phone: string;

  attend: boolean;

  quantity: number;

  familyName?: string;
  comments?: string;

  createdAt: string;
}

export interface RsvpStats {
  total: number;

  confirmed: number;

  rejected: number;

  totalAttendees: number;
}