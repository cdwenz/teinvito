import { useState, useEffect } from 'react';
import type { Event } from '@/types/event';
import CountdownTimer from './CountdownTimer';

interface HeroSectionProps {
  event: Event;
}

export default function HeroSection({
  event,
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const imageCoverUrl = event.gallery?.find(img => img.position === 99)?.imageUrl || '';

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden"
    >
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <img
          src={imageCoverUrl}
          alt={event.celebratedPersonName}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </div>

      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-background-50/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
          }`}
      >
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo / Name */}
            <a
              href="#hero"
              className={`font-heading text-lg md:text-xl font-semibold italic transition-colors duration-500 ${scrolled ? 'text-foreground-900' : 'text-background-50'
                }`}
            >
              {event.celebratedPersonShortName}
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Detalles', href: '#info' },
                { label: 'Ubicación', href: '#location' },
                { label: 'Cronograma', href: '#timeline' },
                { label: 'Galería', href: '#gallery' },
                { label: 'Regalos', href: '#gifts' },
                { label: 'RSVP', href: '#rsvp' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-label tracking-wide transition-colors duration-300 hover:opacity-80 ${scrolled ? 'text-foreground-700' : 'text-background-50/90'
                    }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* RSVP CTA button */}
            <button
              onClick={scrollToRsvp}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full font-label text-xs font-medium tracking-wider uppercase transition-all duration-500 cursor-pointer ${scrolled
                ? 'bg-primary-500 text-background-50 hover:bg-primary-600'
                : 'bg-background-50/20 backdrop-blur-sm border border-background-50/30 text-background-50 hover:bg-background-50/30'
                }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav dots (right side) */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 md:hidden">
        {['#hero', '#info', '#location', '#timeline', '#gallery', '#gifts', '#rsvp'].map((href, i) => (
          <a
            key={href}
            href={href}
            className={`rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)] ${i === 0
              ? 'bg-background-50 w-3 h-3'
              : 'bg-background-50/40 hover:bg-background-50/70 w-2 h-2'
              }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-16 md:pb-20 px-4 md:px-8 lg:px-16 md:mt-16">
        <div
          className={`w-full max-w-2xl transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 rounded-full border border-background-50/40 text-background-50 text-xs font-label tracking-[0.2em] uppercase mb-4 md:mb-6">
            {event.title}
          </span>

          {/* Name */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-background-50 font-light leading-[1.05] mb-3 md:mb-4">
            {event.celebratedPersonName}
          </h1>

          {/* Date */}
          <p className="font-label text-background-50/80 text-sm md:text-base tracking-widest uppercase mb-8 md:mb-10">
            {new Date(event.eventDate).toLocaleString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>

          {/* Countdown */}
          <div className="mb-8 md:mb-10">
            <CountdownTimer eventDate={event.eventDate}/>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToRsvp}
            className="group inline-flex items-center gap-3 bg-primary-500 hover:bg-primary-600 text-background-50 px-8 py-4 rounded-full font-label text-sm font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer"
          >
            Confirmar asistencia
            <span className="w-8 h-8 rounded-full bg-background-50/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
              <i className="ri-arrow-down-line text-background-50" style={{ fontSize: '16px' }}></i>
            </span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-float">
        <i className="ri-arrow-down-s-line text-background-50/50" style={{ fontSize: '24px' }}></i>
      </div>
    </section>
  );
}