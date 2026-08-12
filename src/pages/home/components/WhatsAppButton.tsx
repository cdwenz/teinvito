import { useState } from 'react';
import type { Event } from '@/types/event';

interface WhatsAppButtonProps {
  event: Event;
}

export default function WhatsAppButton({ event }: WhatsAppButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!event.rsvpWhatsappNumber) {
    return null;
  }

  const message = event.rsvpWhatsappMessage || '¡Hola! Quería confirmar mi asistencia';
  const whatsappUrl = `https://wa.me/${event.rsvpWhatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      <div
        className={`transition-all duration-300 ${
          showTooltip ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-foreground-900 text-background-50 px-4 py-2 rounded-full font-label text-xs whitespace-nowrap shadow-lg">
          ¿Tenés dudas? ¡Escribinos!
        </div>
      </div>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba5a] shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer animate-float"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Contactar por WhatsApp"
      >
        <i className="ri-whatsapp-line text-background-50" style={{ fontSize: '28px' }}></i>
      </a>
    </div>
  );
}