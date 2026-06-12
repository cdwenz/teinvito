import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventConfig } from '@/config/event';
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

  useEffect(() => {
    document.title = eventConfig.seo.title;
  }, []);

  return (
    <main className="min-h-screen bg-background-50">
      <HeroSection />
      <WelcomeSection guestName={guestName} />
      <EventInfoSection />
      <LocationSection />
      {/* <TimelineSection /> */}
      <GallerySection />
      <SongRequestSection/>
      <GiftSection />
      <RSVPSection />
      <WhatsAppButton />

      {/* Footer with admin link */}
      <footer className="py-6 px-4 text-center bg-background-50 border-t border-background-300/50">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 font-label text-xs text-secondary-400 hover:text-secondary-600 transition-colors duration-300"
        >
          <i className="ri-shield-keyhole-line" style={{ fontSize: '14px' }}></i>
          Panel de organización
        </Link>
      </footer>
    </main>
  );
}