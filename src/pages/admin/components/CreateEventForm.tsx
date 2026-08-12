import { useEffect, useState } from 'react';
import {
  checkSlugAvailable,
  createEvent,
  createGalleryImage,
  createGiftInfo,
  createMusicSection,
  createTheme,
  createTimelineItem,
  createVenue,
  deleteGalleryImage,
  deleteTimelineItem,
  updateEvent,
  uploadImage,
  type CreateEventInput,
} from '@/lib/api';
import type { Event } from '@/types/event';
import LocationPicker from './LocationPicker';
import InvitationPreview from './InvitationPreview';
import AdminTopBar from './AdminTopBar';

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

interface CreateEventFormProps {
  existingEvent?: Event;
  onCreated: () => void;
  onCancel?: () => void;
}

type Step = 'basics' | 'venue' | 'gift' | 'gallery' | 'timeline' | 'music' | 'theme' | 'review';

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: 'basics', label: 'Datos básicos', icon: 'ri-file-text-line' },
  { key: 'venue', label: 'Lugar', icon: 'ri-map-pin-line' },
  { key: 'gift', label: 'Regalo', icon: 'ri-gift-line' },
  { key: 'gallery', label: 'Galería', icon: 'ri-image-line' },
  { key: 'timeline', label: 'Cronograma', icon: 'ri-time-line' },
  { key: 'music', label: 'Música', icon: 'ri-music-2-line' },
  { key: 'theme', label: 'Tema', icon: 'ri-palette-line' },
  { key: 'review', label: 'Revisión', icon: 'ri-check-double-line' },
];

const DEFAULT_PRIMARY_COLOR = '#c4536e';
const DEFAULT_ACCENT_COLOR = '#d4a24c';

const EVENT_TYPES: { value: CreateEventInput['eventType']; label: string }[] = [
  { value: 'SWEET_15', label: 'Cumpleaños de 15' },
  { value: 'SWEET_16', label: 'Cumpleaños de 16' },
  { value: 'BIRTHDAY', label: 'Cumpleaños' },
  { value: 'WEDDING', label: 'Boda' },
  { value: 'BAPTISM', label: 'Bautismo' },
  { value: 'CORPORATE', label: 'Evento corporativo' },
];

interface GalleryRow {
  id?: string;
  imageUrl: string;
  alt: string;
}

interface TimelineRow {
  id?: string;
  time: string;
  title: string;
  description: string;
}

const emptyBasics: CreateEventInput = {
  slug: '',
  title: '',
  eventType: 'BIRTHDAY',
  celebratedPersonName: '',
  celebratedPersonShortName: '',
  welcomeMessage: '',
  welcomePhrase: '',
  dressCode: '',
  additionalInfo: '',
  eventDate: '',
  rsvpWhatsappNumber: '',
  rsvpWhatsappMessage: '',
};

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function basicsFromEvent(event: Event): CreateEventInput {
  return {
    slug: event.slug,
    title: event.title,
    eventType: event.eventType as CreateEventInput['eventType'],
    celebratedPersonName: event.celebratedPersonName,
    celebratedPersonShortName: event.celebratedPersonShortName,
    welcomeMessage: event.welcomeMessage,
    welcomePhrase: event.welcomePhrase,
    dressCode: event.dressCode || '',
    additionalInfo: event.additionalInfo || '',
    eventDate: event.eventDate ? toDatetimeLocalValue(event.eventDate) : '',
    rsvpWhatsappNumber: event.rsvpWhatsappNumber || '',
    rsvpWhatsappMessage: event.rsvpWhatsappMessage || '',
  };
}

function venueFromEvent(event: Event) {
  return {
    name: event.venue?.name || '',
    address: event.venue?.address || '',
    mapsEmbedUrl: event.venue?.mapsEmbedUrl || '',
    mapsDirectionUrl: event.venue?.mapsDirectionUrl || '',
  };
}

function giftFromEvent(event: Event) {
  return {
    thankYouMessage: event.giftInfo?.thankYouMessage || '',
    alias: event.giftInfo?.alias || '',
    cbu: event.giftInfo?.cbu || '',
    holder: event.giftInfo?.holder || '',
  };
}

function galleryFromEvent(event: Event): GalleryRow[] {
  const rows = event.gallery.map((g) => ({ id: g.id, imageUrl: g.imageUrl, alt: g.alt || '' }));
  return rows.length ? rows : [{ imageUrl: '', alt: '' }];
}

function timelineFromEvent(event: Event): TimelineRow[] {
  const rows = event.timeline.map((t) => ({ id: t.id, time: t.time, title: t.title, description: t.description || '' }));
  return rows.length ? rows : [{ time: '', title: '', description: '' }];
}

function musicFromEvent(event: Event) {
  return {
    title: event.musicSection?.title || '',
    subtitle: event.musicSection?.subtitle || '',
    spotifyPlaylistUrl: event.musicSection?.spotifyPlaylistUrl || '',
  };
}

function themeFromEvent(event: Event) {
  return {
    primaryColor: event.theme?.primaryColor || DEFAULT_PRIMARY_COLOR,
    accentColor: event.theme?.accentColor || DEFAULT_ACCENT_COLOR,
  };
}

export default function CreateEventForm({ existingEvent, onCreated, onCancel }: CreateEventFormProps) {
  const isEditing = !!existingEvent;

  const [stepIndex, setStepIndex] = useState(0);
  const [basics, setBasics] = useState<CreateEventInput>(() =>
    existingEvent ? basicsFromEvent(existingEvent) : emptyBasics,
  );
  const [venue, setVenue] = useState(() =>
    existingEvent ? venueFromEvent(existingEvent) : { name: '', address: '', mapsEmbedUrl: '', mapsDirectionUrl: '' },
  );
  const [gift, setGift] = useState(() =>
    existingEvent ? giftFromEvent(existingEvent) : { thankYouMessage: '', alias: '', cbu: '', holder: '' },
  );
  const [gallery, setGallery] = useState<GalleryRow[]>(() =>
    existingEvent ? galleryFromEvent(existingEvent) : [{ imageUrl: '', alt: '' }],
  );
  const [timeline, setTimeline] = useState<TimelineRow[]>(() =>
    existingEvent ? timelineFromEvent(existingEvent) : [{ time: '', title: '', description: '' }],
  );
  const [music, setMusic] = useState(() =>
    existingEvent ? musicFromEvent(existingEvent) : { title: '', subtitle: '', spotifyPlaylistUrl: '' },
  );
  const [theme, setTheme] = useState(() =>
    existingEvent ? themeFromEvent(existingEvent) : { primaryColor: DEFAULT_PRIMARY_COLOR, accentColor: DEFAULT_ACCENT_COLOR },
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>(
    isEditing ? 'available' : 'idle',
  );

  useEffect(() => {
    const slug = basics.slug.trim();

    if (!slug) {
      setSlugStatus('idle');
      return;
    }

    if (!SLUG_PATTERN.test(slug)) {
      setSlugStatus('invalid');
      return;
    }

    if (isEditing && slug === existingEvent!.slug) {
      setSlugStatus('available');
      return;
    }

    setSlugStatus('checking');
    const timeout = setTimeout(async () => {
      const available = await checkSlugAvailable(slug);
      setSlugStatus(available ? 'available' : 'taken');
    }, 500);

    return () => clearTimeout(timeout);
  }, [basics.slug, isEditing, existingEvent]);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    setUploadError('');
    setUploadingIndex(index);

    try {
      const { url } = await uploadImage(file);
      setGallery((g) => g.map((r, idx) => (idx === index ? { ...r, imageUrl: url } : r)));
    } catch {
      setUploadError('No se pudo subir la imagen. Probá de nuevo.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const step = STEPS[stepIndex].key;

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const canAdvanceFromBasics =
    slugStatus === 'available' &&
    basics.title.trim() &&
    basics.celebratedPersonName.trim() &&
    basics.celebratedPersonShortName.trim() &&
    basics.welcomeMessage.trim() &&
    basics.welcomePhrase.trim() &&
    basics.eventDate.trim();

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ...basics,
        eventDate: new Date(basics.eventDate).toISOString(),
        dressCode: basics.dressCode?.trim() || undefined,
        additionalInfo: basics.additionalInfo?.trim() || undefined,
        rsvpWhatsappNumber: basics.rsvpWhatsappNumber?.trim() || undefined,
        rsvpWhatsappMessage: basics.rsvpWhatsappMessage?.trim() || undefined,
      };

      let eventId: string;

      if (isEditing) {
        await updateEvent(existingEvent!.id, payload);
        eventId = existingEvent!.id;
      } else {
        const created = await createEvent(payload);
        eventId = created.id;
      }

      if (venue.name.trim() && venue.address.trim()) {
        await createVenue(eventId, {
          name: venue.name.trim(),
          address: venue.address.trim(),
          mapsEmbedUrl: venue.mapsEmbedUrl.trim() || undefined,
          mapsDirectionUrl: venue.mapsDirectionUrl.trim() || undefined,
        });
      }

      if (gift.thankYouMessage.trim() || gift.alias.trim() || gift.cbu.trim() || gift.holder.trim()) {
        await createGiftInfo(eventId, {
          thankYouMessage: gift.thankYouMessage.trim() || undefined,
          alias: gift.alias.trim() || undefined,
          cbu: gift.cbu.trim() || undefined,
          holder: gift.holder.trim() || undefined,
        });
      }

      const galleryRows = gallery.filter((row) => row.imageUrl.trim());
      const newGalleryRows = galleryRows.filter((row) => !row.id);
      const galleryPositionOffset = isEditing
        ? existingEvent!.gallery.reduce((max, g) => Math.max(max, g.position), -1) + 1
        : 0;

      for (let i = 0; i < newGalleryRows.length; i++) {
        await createGalleryImage(eventId, {
          imageUrl: newGalleryRows[i].imageUrl.trim(),
          alt: newGalleryRows[i].alt.trim() || undefined,
          position: galleryPositionOffset + i,
        });
      }

      if (isEditing) {
        const keptIds = new Set(galleryRows.map((r) => r.id).filter(Boolean));
        const removedImages = existingEvent!.gallery.filter((g) => !keptIds.has(g.id));
        for (const img of removedImages) {
          await deleteGalleryImage(eventId, img.id);
        }
      }

      const timelineRows = timeline.filter((row) => row.time.trim() && row.title.trim());
      const newTimelineRows = timelineRows.filter((row) => !row.id);
      const timelinePositionOffset = isEditing
        ? existingEvent!.timeline.reduce((max, t) => Math.max(max, t.position), -1) + 1
        : 0;

      for (let i = 0; i < newTimelineRows.length; i++) {
        await createTimelineItem(eventId, {
          time: newTimelineRows[i].time.trim(),
          title: newTimelineRows[i].title.trim(),
          description: newTimelineRows[i].description.trim() || undefined,
          position: timelinePositionOffset + i,
        });
      }

      if (isEditing) {
        const keptIds = new Set(timelineRows.map((r) => r.id).filter(Boolean));
        const removedItems = existingEvent!.timeline.filter((t) => !keptIds.has(t.id));
        for (const item of removedItems) {
          await deleteTimelineItem(eventId, item.id);
        }
      }

      if (music.title.trim() && music.subtitle.trim() && music.spotifyPlaylistUrl.trim()) {
        await createMusicSection(eventId, {
          title: music.title.trim(),
          subtitle: music.subtitle.trim(),
          spotifyPlaylistUrl: music.spotifyPlaylistUrl.trim(),
        });
      }

      await createTheme(eventId, theme);

      onCreated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el evento. Revisá los datos e intentá de nuevo.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-background-50 border border-background-300 font-body text-sm text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300';
  const labelClass = 'block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2';

  return (
    <div className="min-h-screen bg-background-50">
      <AdminTopBar
        title={isEditing ? 'Editar evento' : 'Crear nuevo evento'}
        invitationSlug={isEditing ? existingEvent!.slug : undefined}
        onBack={onCancel}
        backLabel={isEditing ? 'Volver al panel' : 'Cancelar'}
      />
      <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <p className="font-body text-foreground-500 text-sm">
            {isEditing ? 'Actualizá los datos de tu invitación' : 'Completá los datos para armar la invitación'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6 flex-wrap">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStepIndex(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-xs tracking-wide cursor-pointer transition-colors duration-200 ${
                i === stepIndex
                  ? 'bg-primary-500 text-background-50'
                  : i < stepIndex
                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  : 'bg-background-100 text-secondary-500 hover:bg-background-200'
              }`}
            >
              <i className={s.icon} style={{ fontSize: '12px' }}></i>
              {s.label}
            </button>
          ))}
        </div>

        <div className="bg-background-100 rounded-xl p-6 md:p-8">
          {step === 'basics' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Slug (URL única)</label>
                <input
                  className={inputClass}
                  placeholder="mi-boda-2026"
                  value={basics.slug}
                  onChange={(e) =>
                    setBasics((b) => ({
                      ...b,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    }))
                  }
                />
                {basics.slug.trim() && (
                  <p className="mt-1.5 text-xs font-body flex items-center gap-1.5">
                    {slugStatus === 'checking' && (
                      <span className="text-secondary-500">Chequeando disponibilidad...</span>
                    )}
                    {slugStatus === 'available' && (
                      <span className="text-primary-600 flex items-center gap-1">
                        <i className="ri-check-line" style={{ fontSize: '13px' }}></i>
                        Disponible
                        {import.meta.env.VITE_ROOT_DOMAIN && (
                          <> — tu invitación va a estar en <strong>{basics.slug}.{import.meta.env.VITE_ROOT_DOMAIN}</strong></>
                        )}
                      </span>
                    )}
                    {slugStatus === 'taken' && (
                      <span className="text-red-500">Ese slug ya está en uso, probá con otro.</span>
                    )}
                    {slugStatus === 'invalid' && (
                      <span className="text-red-500">Solo minúsculas, números y guiones, sin empezar/terminar con guion.</span>
                    )}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Título del evento</label>
                <input
                  className={inputClass}
                  placeholder="Boda de Julia y Marcos"
                  value={basics.title}
                  onChange={(e) => setBasics((b) => ({ ...b, title: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Tipo de evento</label>
                <select
                  className={inputClass}
                  value={basics.eventType}
                  onChange={(e) => setBasics((b) => ({ ...b, eventType: e.target.value as CreateEventInput['eventType'] }))}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nombre del festejado/a</label>
                  <input
                    className={inputClass}
                    value={basics.celebratedPersonName}
                    onChange={(e) => setBasics((b) => ({ ...b, celebratedPersonName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Nombre corto</label>
                  <input
                    className={inputClass}
                    value={basics.celebratedPersonShortName}
                    onChange={(e) => setBasics((b) => ({ ...b, celebratedPersonShortName: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Mensaje de bienvenida</label>
                <input
                  className={inputClass}
                  value={basics.welcomeMessage}
                  onChange={(e) => setBasics((b) => ({ ...b, welcomeMessage: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Frase de bienvenida</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={basics.welcomePhrase}
                  onChange={(e) => setBasics((b) => ({ ...b, welcomePhrase: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Fecha y hora del evento</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={basics.eventDate}
                  onChange={(e) => setBasics((b) => ({ ...b, eventDate: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Código de vestimenta</label>
                  <input
                    className={inputClass}
                    value={basics.dressCode}
                    onChange={(e) => setBasics((b) => ({ ...b, dressCode: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>Info adicional</label>
                  <input
                    className={inputClass}
                    value={basics.additionalInfo}
                    onChange={(e) => setBasics((b) => ({ ...b, additionalInfo: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>WhatsApp (número)</label>
                  <input
                    className={inputClass}
                    placeholder="5492994228623"
                    value={basics.rsvpWhatsappNumber}
                    onChange={(e) => setBasics((b) => ({ ...b, rsvpWhatsappNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp (mensaje)</label>
                  <input
                    className={inputClass}
                    value={basics.rsvpWhatsappMessage}
                    onChange={(e) => setBasics((b) => ({ ...b, rsvpWhatsappMessage: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'venue' && (
            <div className="space-y-4">
              <p className="font-body text-sm text-secondary-500 mb-2">Este paso es opcional — podés dejarlo vacío y completarlo después.</p>
              <div>
                <label className={labelClass}>Nombre del lugar</label>
                <input className={inputClass} value={venue.name} onChange={(e) => setVenue((v) => ({ ...v, name: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Ubicación</label>
                <LocationPicker
                  address={venue.address}
                  initialMapsEmbedUrl={venue.mapsEmbedUrl}
                  onChange={({ address, mapsEmbedUrl, mapsDirectionUrl }) =>
                    setVenue((v) => ({ ...v, address, mapsEmbedUrl, mapsDirectionUrl }))
                  }
                />
              </div>
            </div>
          )}

          {step === 'gift' && (
            <div className="space-y-4">
              <p className="font-body text-sm text-secondary-500 mb-2">Opcional — datos para regalos/transferencias.</p>
              <div>
                <label className={labelClass}>Mensaje de agradecimiento</label>
                <textarea className={inputClass} rows={2} value={gift.thankYouMessage} onChange={(e) => setGift((g) => ({ ...g, thankYouMessage: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Alias</label>
                  <input className={inputClass} value={gift.alias} onChange={(e) => setGift((g) => ({ ...g, alias: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>CBU</label>
                  <input className={inputClass} value={gift.cbu} onChange={(e) => setGift((g) => ({ ...g, cbu: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Titular</label>
                <input className={inputClass} value={gift.holder} onChange={(e) => setGift((g) => ({ ...g, holder: e.target.value }))} />
              </div>
            </div>
          )}

          {step === 'gallery' && (
            <div className="space-y-4">
              <p className="font-body text-sm text-secondary-500 mb-2">Subí imágenes o pegá URLs directamente (opcional).</p>
              {uploadError && (
                <p className="text-xs text-red-500 font-label flex items-center gap-1.5">
                  <i className="ri-error-warning-line" style={{ fontSize: '14px' }}></i>
                  {uploadError}
                </p>
              )}
              {gallery.map((row, i) => (
                <div key={i} className="flex gap-2 items-start">
                  {row.imageUrl ? (
                    <img
                      src={row.imageUrl}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover border border-background-300 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-background-50 border border-dashed border-background-300 flex items-center justify-center shrink-0">
                      <i className="ri-image-line text-secondary-400" style={{ fontSize: '20px' }}></i>
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        className={inputClass}
                        placeholder="https://..."
                        value={row.imageUrl}
                        onChange={(e) => setGallery((g) => g.map((r, idx) => (idx === i ? { ...r, imageUrl: e.target.value } : r)))}
                      />
                      <label
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-background-50 border border-background-300 font-label text-xs text-foreground-700 hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer ${
                          uploadingIndex === i ? 'opacity-60 pointer-events-none' : ''
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => handleFileSelected(e, i)}
                        />
                        {uploadingIndex === i ? (
                          <span className="w-3.5 h-3.5 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                        ) : (
                          <i className="ri-upload-2-line" style={{ fontSize: '14px' }}></i>
                        )}
                        Subir
                      </label>
                    </div>
                    <input
                      className={inputClass}
                      placeholder="Descripción (alt)"
                      value={row.alt}
                      onChange={(e) => setGallery((g) => g.map((r, idx) => (idx === i ? { ...r, alt: e.target.value } : r)))}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setGallery((g) => g.filter((_, idx) => idx !== i))}
                    className="mt-2 text-secondary-400 hover:text-red-500 transition-colors"
                    aria-label="Quitar imagen"
                  >
                    <i className="ri-close-line" style={{ fontSize: '18px' }}></i>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setGallery((g) => [...g, { imageUrl: '', alt: '' }])}
                className="font-label text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <i className="ri-add-line" style={{ fontSize: '14px' }}></i>
                Agregar imagen
              </button>
            </div>
          )}

          {step === 'timeline' && (
            <div className="space-y-4">
              <p className="font-body text-sm text-secondary-500 mb-2">Cronograma de la noche (opcional).</p>
              {timeline.map((row, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 grid grid-cols-[100px_1fr] gap-2">
                    <input
                      className={inputClass}
                      placeholder="21:00"
                      value={row.time}
                      onChange={(e) => setTimeline((t) => t.map((r, idx) => (idx === i ? { ...r, time: e.target.value } : r)))}
                    />
                    <input
                      className={inputClass}
                      placeholder="Título"
                      value={row.title}
                      onChange={(e) => setTimeline((t) => t.map((r, idx) => (idx === i ? { ...r, title: e.target.value } : r)))}
                    />
                    <input
                      className={`${inputClass} col-span-2`}
                      placeholder="Descripción"
                      value={row.description}
                      onChange={(e) => setTimeline((t) => t.map((r, idx) => (idx === i ? { ...r, description: e.target.value } : r)))}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setTimeline((t) => t.filter((_, idx) => idx !== i))}
                    className="mt-2 text-secondary-400 hover:text-red-500 transition-colors"
                    aria-label="Quitar ítem"
                  >
                    <i className="ri-close-line" style={{ fontSize: '18px' }}></i>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTimeline((t) => [...t, { time: '', title: '', description: '' }])}
                className="font-label text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <i className="ri-add-line" style={{ fontSize: '14px' }}></i>
                Agregar ítem
              </button>
            </div>
          )}

          {step === 'music' && (
            <div className="space-y-4">
              <p className="font-body text-sm text-secondary-500 mb-2">Opcional — playlist colaborativa de Spotify.</p>
              <div>
                <label className={labelClass}>Título</label>
                <input className={inputClass} value={music.title} onChange={(e) => setMusic((m) => ({ ...m, title: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Subtítulo</label>
                <input className={inputClass} value={music.subtitle} onChange={(e) => setMusic((m) => ({ ...m, subtitle: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>URL de playlist de Spotify</label>
                <input className={inputClass} value={music.spotifyPlaylistUrl} onChange={(e) => setMusic((m) => ({ ...m, spotifyPlaylistUrl: e.target.value }))} />
              </div>
            </div>
          )}

          {step === 'theme' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <p className="font-body text-sm text-secondary-500 mb-2">
                  Elegí los colores principales de tu invitación. El resto de la paleta se genera sola.
                </p>
                <div>
                  <label className={labelClass}>Color primario</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                      className="w-12 h-12 rounded-lg border border-background-300 cursor-pointer shrink-0"
                    />
                    <input
                      className={inputClass}
                      value={theme.primaryColor}
                      onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Color de acento</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
                      className="w-12 h-12 rounded-lg border border-background-300 cursor-pointer shrink-0"
                    />
                    <input
                      className={inputClass}
                      value={theme.accentColor}
                      onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <InvitationPreview
                basics={basics}
                coverImageUrl={gallery.find((g) => g.imageUrl.trim())?.imageUrl}
                primaryColor={theme.primaryColor}
                accentColor={theme.accentColor}
              />
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-3 font-body text-sm text-foreground-700">
              <p><span className="font-label uppercase text-xs text-secondary-500">Slug:</span> {basics.slug || '—'}</p>
              <p><span className="font-label uppercase text-xs text-secondary-500">Título:</span> {basics.title || '—'}</p>
              <p><span className="font-label uppercase text-xs text-secondary-500">Fecha:</span> {basics.eventDate || '—'}</p>
              <p><span className="font-label uppercase text-xs text-secondary-500">Lugar:</span> {venue.name || 'sin definir'}</p>
              <p><span className="font-label uppercase text-xs text-secondary-500">Imágenes en galería:</span> {gallery.filter((r) => r.imageUrl.trim()).length}</p>
              <p><span className="font-label uppercase text-xs text-secondary-500">Ítems de cronograma:</span> {timeline.filter((r) => r.time.trim() && r.title.trim()).length}</p>
              {error && (
                <p className="mt-2 text-xs text-red-500 font-label flex items-center gap-1.5">
                  <i className="ri-error-warning-line" style={{ fontSize: '14px' }}></i>
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-background-300/50">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="flex items-center gap-1.5 font-label text-xs text-secondary-500 hover:text-foreground-700 disabled:opacity-0 transition-colors"
            >
              <i className="ri-arrow-left-line" style={{ fontSize: '14px' }}></i>
              Atrás
            </button>

            {step !== 'review' ? (
              <button
                type="button"
                onClick={goNext}
                disabled={step === 'basics' && !canAdvanceFromBasics}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-background-50 px-6 py-2.5 rounded-full font-label text-sm font-medium tracking-wider uppercase transition-all duration-300"
              >
                Siguiente
                <i className="ri-arrow-right-line" style={{ fontSize: '16px' }}></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-background-50 px-6 py-2.5 rounded-full font-label text-sm font-medium tracking-wider uppercase transition-all duration-300"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-background-50/40 border-t-background-50 rounded-full animate-spin" />
                    {isEditing ? 'Guardando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    {isEditing ? 'Guardar cambios' : 'Crear evento'}
                    <i className="ri-check-line" style={{ fontSize: '16px' }}></i>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
