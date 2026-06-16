import { useEffect, useRef, useState } from 'react';
import type { Event } from '@/types/event';

interface WelcomeSectionProps {
  guestName: string | null;
  event: Event;
}

export default function WelcomeSection({
  guestName,
  event,
}: WelcomeSectionProps) {
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
      className="relative py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-background-100"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Personalized greeting */}
        {guestName && (
          <div
            className={`mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-primary-100 text-primary-700 font-label text-sm tracking-wide">
              ¡Nos encantaría contar con la presencia de {guestName}!
            </span>
          </div>
        )}

        {/* Quote */}
        <div
          className={`transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground-800 font-light italic leading-relaxed">
            &ldquo;{event.welcomePhrase}&rdquo;
          </p>
        </div>

        {/* Decorative divider */}
        <div
          className={`mt-10 flex items-center justify-center gap-3 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="block w-12 h-px bg-accent-300" />
          <span className="font-heading text-accent-500 text-lg italic">&</span>
          <span className="block w-12 h-px bg-accent-300" />
        </div>
      </div>
    </section>
  );
}