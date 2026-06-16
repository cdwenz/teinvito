import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvent } from '@/lib/api';
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

export default function Home() {
  const [searchParams] = useSearchParams();

  const guestName = searchParams.get('guest');
  const slug =
    searchParams.get('slug') ||
    'antonella-16';

  console.log('Guest name from URL:', guestName);
  console.log('Slug from URL:', slug);
  const [event, setEvent] =
    useState<Event | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getEvent(slug);

        setEvent(data);

        document.title =
          data.seo?.title ||
          data.title;
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, [slug]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando evento...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background-50">
      <HeroSection event={event} />
      <WelcomeSection guestName={guestName} event={event} />
      <EventInfoSection event={event} />
      {/* <TimelineSection /> */}
      <LocationSection event={event} />
      <GallerySection event={event} />
      <SongRequestSection event={event} />
      <GiftSection event={event} />
      <RSVPSection event={event} />
      <WhatsAppButton />

      {/* Footer with admin link */}
      <footer className=" text-center bg-background-50 border-t border-background-300/50">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 font-label text-xs text-secondary-400 hover:text-secondary-600 transition-colors duration-300 py-10 px-6"
        >
          <i className="ri-shield-keyhole-line" style={{ fontSize: '14px' }}></i>
          Panel de organización
        </Link>
      </footer>
    </main>
  );
}