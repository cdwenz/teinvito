import { Rsvp, RsvpStats } from "@/types/dashboard";
import { Event } from "@/types/event";

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders(): HeadersInit {
  const token = sessionStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleUnauthorized() {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('admin_authenticated');
  window.location.href = '/admin';
}

async function fetchAuthed(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Sesión expirada');
  }

  return response;
}

export async function getEvent(
  slug: string,
): Promise<Event> {
  const res = await fetch(`${API_URL}/events/slug/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Evento no encontrado");
  }

  return res.json();
}

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/events/slug/${slug}/available`);

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return data.available;
}

export async function getMyEvents(): Promise<Event[]> {
  const response = await fetchAuthed('/events');

  if (!response.ok) {
    throw new Error('Error cargando eventos');
  }

  return response.json();
}

export async function getRsvps(
  eventId: string,
): Promise<Rsvp[]> {
  const response = await fetchAuthed(
    `/rsvps/event/${eventId}`,
  );

  if (!response.ok) {
    throw new Error(
      'Error cargando RSVPs',
    );
  }

  return response.json();
}

export async function getRsvpStats(
  eventId: string,
): Promise<RsvpStats> {
  const response = await fetchAuthed(
    `/rsvps/event/${eventId}/stats`,
  );

  if (!response.ok) {
    throw new Error(
      'Error cargando estadísticas',
    );
  }

  return response.json();
}

export async function login(
  email: string,
  password: string,
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      'Credenciales inválidas',
    );
  }

  return response.json();
}

export interface CreateEventInput {
  slug: string;
  title: string;
  eventType: 'SWEET_15' | 'SWEET_16' | 'BIRTHDAY' | 'WEDDING' | 'BAPTISM' | 'CORPORATE';
  celebratedPersonName: string;
  celebratedPersonShortName: string;
  welcomeMessage: string;
  welcomePhrase: string;
  dressCode?: string;
  additionalInfo?: string;
  eventDate: string;
  rsvpWhatsappNumber?: string;
  rsvpWhatsappMessage?: string;
}

export interface CreateVenueInput {
  name: string;
  address: string;
  mapsEmbedUrl?: string;
  mapsDirectionUrl?: string;
}

export interface CreateGiftInfoInput {
  thankYouMessage?: string;
  alias?: string;
  cbu?: string;
  holder?: string;
}

export interface CreateGalleryImageInput {
  imageUrl: string;
  alt?: string;
  position?: number;
}

export interface CreateTimelineItemInput {
  time: string;
  title: string;
  description?: string;
  position?: number;
}

export interface CreateMusicSectionInput {
  title: string;
  subtitle: string;
  spotifyPlaylistUrl: string;
}

export interface CreateThemeInput {
  primaryColor: string;
  accentColor: string;
}

async function postAuthed<T>(path: string, body: unknown): Promise<T> {
  const response = await fetchAuthed(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || 'Error al guardar los datos');
  }

  return response.json();
}

export function createEvent(dto: CreateEventInput): Promise<Event> {
  return postAuthed('/events', dto);
}

export async function updateEvent(id: string, dto: Partial<CreateEventInput>): Promise<Event> {
  const response = await fetchAuthed(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || 'No se pudo actualizar el evento');
  }

  return response.json();
}

export function createVenue(eventId: string, dto: CreateVenueInput) {
  return postAuthed(`/events/${eventId}/venue`, dto);
}

export function createGiftInfo(eventId: string, dto: CreateGiftInfoInput) {
  return postAuthed(`/events/${eventId}/gift`, dto);
}

export function createGalleryImage(eventId: string, dto: CreateGalleryImageInput) {
  return postAuthed(`/events/${eventId}/gallery`, dto);
}

export async function deleteGalleryImage(eventId: string, imageId: string): Promise<void> {
  const response = await fetchAuthed(`/events/${eventId}/gallery/${imageId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('No se pudo borrar la imagen');
  }
}

export function createTimelineItem(eventId: string, dto: CreateTimelineItemInput) {
  return postAuthed(`/events/${eventId}/timeline`, dto);
}

export async function deleteTimelineItem(eventId: string, itemId: string): Promise<void> {
  const response = await fetchAuthed(`/events/${eventId}/timeline/${itemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('No se pudo borrar el ítem');
  }
}

export function createMusicSection(eventId: string, dto: CreateMusicSectionInput) {
  return postAuthed(`/events/${eventId}/music`, dto);
}

export function createTheme(eventId: string, dto: CreateThemeInput) {
  return postAuthed(`/events/${eventId}/theme`, dto);
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetchAuthed('/uploads/image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('No se pudo subir la imagen');
  }

  return response.json();
}

export type AccountStatus = 'PENDING_PAYMENT' | 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED';

export interface Plan {
  id: string;
  name: string;
  slug: string;
  priceAmount: number;
  priceCurrency: string;
  durationDays: number | null;
  maxEvents: number;
  maxGalleryImages: number;
  maxTimelineItems: number;
  isActive: boolean;
  position: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'USER';
  status: AccountStatus;
  expiresAt: string | null;
  paymentProofUrl: string | null;
  plan: Plan | null;
}

export interface PaymentSettings {
  id: string;
  paymentAlias: string | null;
  paymentCbu: string | null;
  paymentHolder: string | null;
}

export async function registerUser(name: string, email: string, password: string, planId: string) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, planId }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || 'No se pudo completar el registro');
  }

  return response.json();
}

export async function getPlans(): Promise<Plan[]> {
  const response = await fetch(`${API_URL}/plans`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los planes');
  }

  return response.json();
}

export async function getAllPlans(): Promise<Plan[]> {
  const response = await fetchAuthed('/plans/all');

  if (!response.ok) {
    throw new Error('No se pudieron cargar los planes');
  }

  return response.json();
}

export async function createPlan(dto: Omit<Plan, 'id' | 'isActive'>): Promise<Plan> {
  return postAuthed('/plans', dto);
}

export async function updatePlan(id: string, dto: Partial<Omit<Plan, 'id'>>): Promise<Plan> {
  const response = await fetchAuthed(`/plans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar el plan');
  }

  return response.json();
}

export async function deactivatePlan(id: string): Promise<Plan> {
  const response = await fetchAuthed(`/plans/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error('No se pudo desactivar el plan');
  }

  return response.json();
}

export async function getMyProfile(): Promise<UserProfile> {
  const response = await fetchAuthed('/users/me');

  if (!response.ok) {
    throw new Error('No se pudo cargar el perfil');
  }

  return response.json();
}

export async function uploadPaymentProof(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetchAuthed('/users/me/payment-proof', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('No se pudo subir el comprobante');
  }

  return response.json();
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const response = await fetch(`${API_URL}/settings/payment`);

  if (!response.ok) {
    throw new Error('No se pudo cargar la información de pago');
  }

  return response.json();
}

export async function updatePaymentSettings(
  dto: Partial<Omit<PaymentSettings, 'id'>>,
): Promise<PaymentSettings> {
  const response = await fetchAuthed('/settings/payment', {
    method: 'PATCH',
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar la configuración');
  }

  return response.json();
}

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  paymentProofUrl: string;
  createdAt: string;
}

export async function getPendingUsers(): Promise<PendingUser[]> {
  const response = await fetchAuthed('/users/pending');

  if (!response.ok) {
    throw new Error('No se pudo cargar la lista de pendientes');
  }

  return response.json();
}

export async function approveUser(id: string) {
  const response = await fetchAuthed(`/users/${id}/approve`, { method: 'POST' });

  if (!response.ok) {
    throw new Error('No se pudo aprobar el usuario');
  }

  return response.json();
}

export async function rejectUser(id: string) {
  const response = await fetchAuthed(`/users/${id}/reject`, { method: 'POST' });

  if (!response.ok) {
    throw new Error('No se pudo rechazar el usuario');
  }

  return response.json();
}
