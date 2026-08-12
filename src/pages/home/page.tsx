import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvent } from '@/lib/api';
import { getThemeStyle } from '@/lib/applyTheme';
import type { Event } from '@/types/event';
import HeroSection from './components/HeroSection';
import WelcomeSection from './components/WelcomeSection';
import EventInfoSection from './components/EventInfoSection';
import LocationSection from './components/LocationSection';
import GiftSection from './components/GiftSection';
import TimelineSection from './components/TimelineSection';
import GallerySection from './components/GallerySection';
import RSVPSection from './components/RSVPSection';
import WhatsAppButton from './components/WhatsAppButton';
import SongRequestSection from './components/SongRequestSection';

interface HomeProps {
  slugOverride?: string;
}

export default function Home({ slugOverride }: HomeProps) {
  const [searchParams] = useSearchParams();

  const guestName = searchParams.get('guest');
  const slug = slugOverride || searchParams.get('slug');

  const [event, setEvent] =
    useState<Event | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    async function load() {
      try {
        const data =
          await getEvent(slug as string);

        setEvent(data);

        document.title =
          data.seo?.title ||
          data.title;
      } catch (error) {
        console.error(error);
        setNotFound(true);
      }
    }

    load();
  }, [slug]);

  if (!slug || notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-center px-4">
        <p className="font-heading text-xl text-foreground-800">Evento no encontrado</p>
        <p className="font-body text-sm text-foreground-500">
          Verificá que el link de la invitación sea correcto.
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando evento...
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-background-50"
      style={getThemeStyle(event.theme?.primaryColor, event.theme?.accentColor)}
    >
      <HeroSection event={event} />
      <WelcomeSection guestName={guestName} event={event} />
      <EventInfoSection event={event} />
      <TimelineSection event={event} />
      <LocationSection event={event} />
      <GallerySection event={event} />
      <SongRequestSection event={event} />
      <GiftSection event={event} />
      <RSVPSection event={event} />
      <WhatsAppButton event={event} />

      {/* Footer with admin link (only when not served from a subdomain) */}
      {!slugOverride && (
        <footer className=" text-center bg-background-50 border-t border-background-300/50">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 font-label text-xs text-secondary-400 hover:text-secondary-600 transition-colors duration-300 py-10 px-6"
          >
            <i className="ri-shield-keyhole-line" style={{ fontSize: '14px' }}></i>
            Panel de organización
          </Link>
        </footer>
      )}
    </main>
  );
}