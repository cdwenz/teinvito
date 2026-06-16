import { useEffect, useRef, useState } from 'react';
import type { Event } from '@/types/event';

interface LocationSectionProps {
  event: Event;
}

export default function LocationSection({
  event,
}: LocationSectionProps) {
  const venue = event.venue;

  if (!venue) {
    return null;
  }
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="location"
      className="relative py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-background-50"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-label tracking-[0.3em] uppercase text-secondary-500">
            · Dónde ·
          </span>
        </div>

        {/* Title */}
        <h2
          className={`font-heading text-3xl md:text-5xl text-center text-foreground-900 font-light mb-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          La ubicación
        </h2>
        <p
          className={`text-center text-foreground-500 font-body text-lg md:text-xl mb-12 md:mb-16 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {venue.name} · {venue.address}
        </p>

        {/* Map container */}
        <div
          className={`rounded-xl overflow-hidden border border-background-200/70 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
            <iframe
              src={venue.mapsEmbedUrl ?? ''}
              title={`Mapa de ${venue.name}`}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* CTA buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          <a
            href={venue.mapsDirectionUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-primary-500 hover:bg-primary-600 text-background-50 px-7 py-3.5 rounded-full font-label text-sm font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer"
          >
            <span className="w-9 h-9 rounded-full bg-background-50/20 flex items-center justify-center">
              <i className="ri-navigation-line" style={{ fontSize: '18px' }}></i>
            </span>
            Cómo llegar
          </a>
          {venue.mapsDirectionUrl && (
            <a
              href={venue.mapsDirectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-background-100 hover:bg-background-200 text-foreground-700 px-7 py-3.5 rounded-full font-label text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer border border-background-200/70"
          >
              <span className="w-9 h-9 rounded-full bg-background-200/70 flex items-center justify-center">
                <i className="ri-map-pin-2-line" style={{ fontSize: '18px' }}></i>
              </span>
              Abrir en Google Maps
            </a>
          )}
        </div>
      </div>
    </section >
  );
}