import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getEvent,
  getRsvps,
  getRsvpStats,
} from '@/lib/api';

import AdminTopBar from './AdminTopBar';

import type {
  Event as EventType,
} from '@/types/event';

import type {
  Rsvp,
  RsvpStats,
} from '@/types/dashboard';

import type {
  FilterState,
} from '../types';

const RSVP_POLL_INTERVAL_MS = 20_000;

interface DashboardProps {
  slug: string;
  onSwitchEvent?: () => void;
  onEdit?: (event: EventType) => void;
}

export default function Dashboard({ slug, onSwitchEvent, onEdit }: DashboardProps) {

  const [event, setEvent] =
    useState<EventType | null>(null);

  const [submissions, setSubmissions] =
    useState<Rsvp[]>([]);

  const [stats, setStats] =
    useState<RsvpStats>({
      total: 0,
      confirmed: 0,
      rejected: 0,
      totalAttendees: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState<FilterState>({
      search: '',
      filter: 'all',
    });

  const refreshRsvps = useCallback(async (eventId: string) => {
    try {
      const [rsvpsData, statsData] = await Promise.all([
        getRsvps(eventId),
        getRsvpStats(eventId),
      ]);

      setSubmissions(rsvpsData);
      setStats(statsData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    let eventId: string | null = null;

    async function load() {
      try {
        const eventData: EventType = await getEvent(slug);

        setEvent(eventData);
        eventId = eventData.id;

        await refreshRsvps(eventData.id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();

    const interval = setInterval(() => {
      if (eventId) refreshRsvps(eventId);
    }, RSVP_POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [slug, refreshRsvps]);


  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const query =
        filter.search
          .toLowerCase()
          .trim();

      if (query) {
        const matchesName =
          s.name
            .toLowerCase()
            .includes(query);

        const matchesPhone =
          s.phone.includes(query);

        const matchesEmail =
          s.email
            .toLowerCase()
            .includes(query);

        if (
          !matchesName &&
          !matchesPhone &&
          !matchesEmail
        ) {
          return false;
        }
      }

      if (
        filter.filter ===
        'confirmed' &&
        !s.attend
      ) {
        return false;
      }

      if (
        filter.filter ===
        'rejected' &&
        s.attend
      ) {
        return false;
      }

      return true;
    });
  }, [submissions, filter]);


  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Evento no encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50">
      <AdminTopBar
        title="Panel de Organización"
        subtitle={event.title}
        invitationSlug={slug}
        onSwitchEvent={onSwitchEvent}
        onEdit={onEdit ? () => onEdit(event) : undefined}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="bg-background-100 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary-100 flex items-center justify-center">
                <i className="ri-user-line text-secondary-600" style={{ fontSize: '16px' }}></i>
              </div>
              <span className="font-label text-xs tracking-widest uppercase text-secondary-500">Registros</span>
            </div>
            <p className="font-heading text-3xl md:text-4xl font-semibold text-foreground-900">{stats.total}</p>
          </div>

          <div className="bg-background-100 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                <i className="ri-check-line text-primary-600" style={{ fontSize: '16px' }}></i>
              </div>
              <span className="font-label text-xs tracking-widest uppercase text-secondary-500">Confirmados</span>
            </div>
            <p className="font-heading text-3xl md:text-4xl font-semibold text-primary-600">{stats.confirmed}</p>
          </div>

          <div className="bg-background-100 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <i className="ri-close-line text-red-500" style={{ fontSize: '16px' }}></i>
              </div>
              <span className="font-label text-xs tracking-widest uppercase text-secondary-500">No asisten</span>
            </div>
            <p className="font-heading text-3xl md:text-4xl font-semibold text-red-500">{stats.rejected}</p>
          </div>

          <div className="bg-background-100 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
                <i className="ri-group-line text-accent-700" style={{ fontSize: '16px' }}></i>
              </div>
              <span className="font-label text-xs tracking-widest uppercase text-secondary-500">Asistentes</span>
            </div>
            <p className="font-heading text-3xl md:text-4xl font-semibold text-accent-700">{stats.totalAttendees}</p>
          </div>
        </div>

        {/* Filters + Table */}
        <div className="bg-background-100 rounded-xl overflow-hidden">
          {/* Filters bar */}
          <div className="p-4 md:p-5 border-b border-background-300/50">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <i
                  className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
                  style={{ fontSize: '16px' }}
                ></i>
                <input
                  type="text"
                  value={filter.search}
                  onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
                  placeholder="Buscar por nombre, teléfono o email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background-50 border border-background-300 font-body text-sm text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300"
                />
              </div>

              {/* Filter tabs */}
              <div className="flex rounded-full bg-background-50 border border-background-300 p-1">
                {([
                  { value: 'all', label: 'Todos' },
                  { value: 'confirmed', label: 'Confirmados' },
                  { value: 'rejected', label: 'No asisten' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter((f) => ({ ...f, filter: opt.value }))}
                    className={`px-3 py-1.5 rounded-full font-label text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${filter.filter === opt.value
                      ? 'bg-primary-500 text-background-50'
                      : 'text-secondary-600 hover:text-foreground-700'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-background-300/50">
                  <th className="text-left px-4 md:px-5 py-3 font-label text-xs tracking-widest uppercase text-secondary-500 whitespace-nowrap">
                    Nombre
                  </th>
                  <th className="text-left px-4 md:px-5 py-3 font-label text-xs tracking-widest uppercase text-secondary-500 whitespace-nowrap hidden md:table-cell">
                    Teléfono
                  </th>
                  <th className="text-left px-4 md:px-5 py-3 font-label text-xs tracking-widest uppercase text-secondary-500 whitespace-nowrap hidden lg:table-cell">
                    Email
                  </th>
                  <th className="text-center px-4 md:px-5 py-3 font-label text-xs tracking-widest uppercase text-secondary-500 whitespace-nowrap">
                    Asiste
                  </th>
                  <th className="text-center px-4 md:px-5 py-3 font-label text-xs tracking-widest uppercase text-secondary-500 whitespace-nowrap">
                    Cant.
                  </th>
                  <th className="text-right px-4 md:px-5 py-3 font-label text-xs tracking-widest uppercase text-secondary-500 whitespace-nowrap hidden sm:table-cell">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-secondary-100 flex items-center justify-center mb-3">
                        <i className="ri-search-line text-secondary-400" style={{ fontSize: '20px' }}></i>
                      </div>
                      <p className="font-body text-foreground-500 text-sm">No se encontraron resultados</p>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((s) => (
                    <tr key={s.id} className="border-b border-background-200/60 hover:bg-background-50/50 transition-colors duration-150">
                      <td className="px-4 md:px-5 py-3">
                        <div>
                          <p className="font-label text-sm font-medium text-foreground-800">{s.name}</p>
                          {s.familyName && (
                            <p className="font-body text-xs text-secondary-500 mt-0.5">{s.familyName}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3 hidden md:table-cell">
                        <span className="font-body text-sm text-foreground-600">
                          <a
                            href={`https://wa.me/${s.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-600 hover:underline"
                          >
                            {s.phone}
                          </a>
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-3 hidden lg:table-cell">
                        <span className="font-body text-sm text-foreground-600">{s.email}</span>
                      </td>
                      <td className="px-4 md:px-5 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label text-xs font-medium ${s.attend
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-red-100 text-red-600'
                            }`}
                        >
                          <i className={s.attend ? 'ri-check-line' : 'ri-close-line'} style={{ fontSize: '12px' }}></i>
                          {s.attend ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-3 text-center">
                        <span className="font-heading text-sm font-semibold text-foreground-800">{s.quantity}</span>
                      </td>
                      <td className="px-4 md:px-5 py-3 text-right hidden sm:table-cell">
                        <span className="font-body text-xs text-secondary-500">{formatDate(s.createdAt)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results count */}
          <div className="px-4 md:px-5 py-3 border-t border-background-300/50">
            <p className="font-label text-xs text-secondary-500">
              Mostrando {filteredSubmissions.length} de {submissions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}