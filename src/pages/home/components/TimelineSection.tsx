import { useEffect, useRef, useState } from 'react';
import type { Event } from '@/types/event';

interface TimelineSectionProps {
  event: Event;
}

export default function TimelineSection({ event }: TimelineSectionProps) {
  const timelineItems = event.timeline;
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (timelineItems.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="relative py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-background-100"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-label tracking-[0.3em] uppercase text-secondary-500">
            · Cronograma ·
          </span>
        </div>

        {/* Title */}
        <h2
          className={`font-heading text-3xl md:text-5xl text-center text-foreground-900 font-light mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Así será la noche
        </h2>
        <p
          className={`text-center text-foreground-500 font-body text-lg md:text-xl mb-12 md:mb-16 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Cada momento pensado para que sea inolvidable
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-secondary-300 md:-translate-x-px" />

          {timelineItems.map((item, i) => {
            const isLeft = i % 2 === 0;

            return (
              <div
                key={item.id}
                className={`relative flex items-start gap-6 md:gap-0 mb-10 last:mb-0 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div
                  className={`absolute left-6 md:left-1/2 -translate-x-1/2 z-10 transition-all duration-500 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 shadow-sm ${
                      i === 0
                        ? 'bg-primary-500 border-primary-500'
                        : i === timelineItems.length - 1
                        ? 'bg-accent-500 border-accent-500'
                        : 'bg-background-50 border-secondary-400'
                    }`}
                  />
                </div>

                {/* Content card */}
                <div
                  className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  } ${isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'}`}
                  style={{ transitionDelay: `${400 + i * 100}ms` }}
                >
                  <div className="bg-background-50 rounded-lg p-5 md:p-6 border border-background-200/70 hover:border-accent-200/60 transition-colors duration-300">
                    {/* Time badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-label font-medium tracking-wider mb-3 ${
                      i === 0
                        ? 'bg-primary-100 text-primary-700'
                        : i === timelineItems.length - 1
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-secondary-100 text-secondary-700'
                    }`}>
                      {item.time} hs
                    </span>

                    <h3 className="font-heading text-lg md:text-xl text-foreground-900 font-medium mb-1.5">
                      {item.title}
                    </h3>

                    <p className="font-body text-foreground-600 text-sm md:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}