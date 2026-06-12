import { useEffect, useRef, useState } from 'react';
import { eventConfig } from '@/config/event';

const infoItems = [
  {
    icon: 'ri-calendar-line',
    label: 'Fecha',
    value: eventConfig.displayDate,
  },
  {
    icon: 'ri-time-line',
    label: 'Hora',
    value: eventConfig.displayTime,
  },
  {
    icon: 'ri-building-line',
    label: 'Lugar',
    value: eventConfig.venue.name,
  },
  {
    icon: 'ri-map-pin-line',
    label: 'Dirección',
    value: eventConfig.venue.address,
  },
  {
    icon: 'ri-t-shirt-line',
    label: 'Vestimenta',
    value: eventConfig.dressCode,
  },
];

export default function EventInfoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="info"
      className="relative py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-background-50"
    >
      {/* Decorative top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background-100/50 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-label tracking-[0.3em] uppercase text-secondary-500">
            · Save the Date ·
          </span>
        </div>

        {/* Title */}
        <h2
          className={`font-heading text-3xl md:text-5xl text-center text-foreground-900 font-light mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          El gran día
        </h2>
        <p
          className={`text-center text-foreground-500 font-body text-lg md:text-xl mb-14 md:mb-20 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Cada detalle pensado para una noche inolvidable
        </p>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {infoItems.map((item, i) => (
            <div
              key={item.label}
              className={`group bg-background-100 rounded-lg p-6 md:p-7 transition-all duration-500 hover:bg-background-200/70 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors duration-300">
                <i className={`${item.icon} text-primary-600`} style={{ fontSize: '18px' }}></i>
              </div>
              <h3 className="font-label text-xs tracking-widest uppercase text-secondary-500 mb-2">
                {item.label}
              </h3>
              <p className="font-body text-foreground-800 text-base md:text-lg leading-relaxed">
                {item.value}
              </p>
            </div>
          ))}

          {/* Additional info card (full width on mobile) */}
          <div
            className={`sm:col-span-2 lg:col-span-3 bg-background-100 rounded-lg p-6 md:p-7 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${200 + infoItems.length * 80}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-information-line text-accent-700" style={{ fontSize: '18px' }}></i>
              </div>
              <div>
                <h3 className="font-label text-xs tracking-widest uppercase text-secondary-500 mb-2">
                  Información adicional
                </h3>
                <p className="font-body text-foreground-700 text-base md:text-lg leading-relaxed">
                  {eventConfig.additionalInfo}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}