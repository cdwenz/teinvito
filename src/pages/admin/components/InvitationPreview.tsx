import { getThemeStyle } from '@/lib/applyTheme';
import type { CreateEventInput } from '@/lib/api';

interface InvitationPreviewProps {
  basics: CreateEventInput;
  coverImageUrl?: string;
  primaryColor: string;
  accentColor: string;
}

export default function InvitationPreview({
  basics,
  coverImageUrl,
  primaryColor,
  accentColor,
}: InvitationPreviewProps) {
  const displayDate = basics.eventDate
    ? new Date(basics.eventDate).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Fecha del evento';

  return (
    <div className="sticky top-4">
      <p className="font-label text-xs tracking-widest uppercase text-secondary-500 mb-3 text-center">
        Vista previa
      </p>

      <div
        style={getThemeStyle(primaryColor, accentColor)}
        className="mx-auto w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden border border-background-300 shadow-lg relative"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-accent-400">
          {coverImageUrl && (
            <img src={coverImageUrl} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-5">
          <span className="inline-block self-start px-2.5 py-1 rounded-full border border-white/40 text-white text-[9px] font-label tracking-[0.15em] uppercase mb-3">
            {basics.title || 'Título del evento'}
          </span>

          <h3 className="font-heading text-2xl text-white font-light leading-tight mb-2">
            {basics.celebratedPersonName || 'Nombre del festejado/a'}
          </h3>

          <p className="text-white/80 text-[10px] font-label tracking-wide uppercase mb-4">
            {displayDate}
          </p>

          <span className="inline-flex items-center justify-center gap-1.5 bg-primary-500 text-background-50 px-4 py-2 rounded-full font-label text-[10px] font-medium tracking-wider uppercase w-fit">
            <i className="ri-check-line" style={{ fontSize: '12px' }}></i>
            Confirmar asistencia
          </span>
        </div>
      </div>
    </div>
  );
}
