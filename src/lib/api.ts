import { Rsvp, RsvpStats } from "@/types/dashboard";
import { Event } from "@/types/event";

const API_URL = import.meta.env.VITE_API_URL;

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

export async function getRsvps(
  eventId: string,
): Promise<Rsvp[]> {
  const response = await fetch(
    `${API_URL}/rsvps/event/${eventId}`,
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
  const response = await fetch(
    `${API_URL}/rsvps/event/${eventId}/stats`,
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