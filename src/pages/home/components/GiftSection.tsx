import { useEffect, useRef, useState } from 'react';
import { eventConfig } from '@/config/event';

export default function GiftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const giftData = [
    {
      label: 'Alias',
      value: eventConfig.gift.alias,
      icon: 'ri-bank-line',
      field: 'alias',
    },
    {
      label: 'CBU',
      value: eventConfig.gift.cbu,
      icon: 'ri-file-copy-line',
      field: 'cbu',
    },
    {
      label: 'Titular',
      value: eventConfig.gift.titular,
      icon: 'ri-user-line',
      field: 'titular',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="gifts"
      className="relative py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-background-100"
    >
      <div className="max-w-2xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-label tracking-[0.3em] uppercase text-secondary-500">
            · Regalos ·
          </span>
        </div>

        {/* Title */}
        <h2
          className={`font-heading text-3xl md:text-5xl text-center text-foreground-900 font-light mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Tu presencia es el mejor regalo
        </h2>

        {/* Thank you message */}
        <p
          className={`text-center text-foreground-500 font-body text-lg md:text-xl mb-12 md:mb-16 leading-relaxed transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {eventConfig.gift.thankYouMessage}
        </p>

        {/* Gift card */}
        <div
          className={`bg-background-50 rounded-xl border border-background-200/70 overflow-hidden transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Decorative top bar */}
          <div className="h-1.5 bg-accent-400/60" />

          <div className="p-6 md:p-8">
            {giftData.map((item, i) => (
              <div
                key={item.field}
                className={`flex items-center justify-between py-4 ${
                  i < giftData.length - 1 ? 'border-b border-background-200/60' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-accent-600`} style={{ fontSize: '16px' }}></i>
                  </div>
                  <div>
                    <span className="block font-label text-xs tracking-widest uppercase text-secondary-500 mb-0.5">
                      {item.label}
                    </span>
                    <span className="font-body text-foreground-800 text-base md:text-lg">
                      {item.value}
                    </span>
                  </div>
                </div>

                {item.field !== 'titular' && (
                  <button
                    onClick={() => copyToClipboard(item.value, item.field)}
                    className="whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full bg-background-100 hover:bg-background-200 text-foreground-600 font-label text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer"
                  >
                    {copiedField === item.field ? (
                      <>
                        <i className="ri-check-line text-primary-600" style={{ fontSize: '14px' }}></i>
                        <span className="text-primary-600">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-file-copy-line" style={{ fontSize: '14px' }}></i>
                        Copiar
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Decorative bottom */}
          <div className="flex justify-center pb-6">
            <span className="font-heading text-accent-500 text-xl italic opacity-50">con amor</span>
          </div>
        </div>
      </div>
    </section>
  );
}