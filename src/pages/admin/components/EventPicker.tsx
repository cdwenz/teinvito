import type { Event } from '@/types/event';
import AdminTopBar from './AdminTopBar';

interface EventPickerProps {
  events: Event[];
  onSelect: (slug: string) => void;
  onCreateNew: () => void;
}

export default function EventPicker({ events, onSelect, onCreateNew }: EventPickerProps) {
  return (
    <div className="min-h-screen bg-background-50">
      <AdminTopBar title="Tus eventos" />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <p className="font-body text-foreground-500 text-sm">Elegí uno para administrar o creá uno nuevo</p>
          </div>

          <div className="bg-background-100 rounded-xl overflow-hidden mb-4">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => onSelect(event.slug)}
                className="w-full flex items-center justify-between px-5 py-4 border-b border-background-300/50 last:border-b-0 hover:bg-background-50/60 transition-colors text-left"
              >
                <div>
                  <p className="font-label text-sm font-medium text-foreground-800">{event.title}</p>
                  <p className="font-body text-xs text-secondary-500 mt-0.5">/{event.slug}</p>
                </div>
                <i className="ri-arrow-right-s-line text-secondary-400" style={{ fontSize: '20px' }}></i>
              </button>
            ))}
          </div>

          <button
            onClick={onCreateNew}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-background-50 px-6 py-3 rounded-full font-label text-sm font-medium tracking-wider uppercase transition-all duration-300"
          >
            <i className="ri-add-line" style={{ fontSize: '16px' }}></i>
            Crear nuevo evento
          </button>
        </div>
      </div>
    </div>
  );
}
