import { getInvitationUrl } from '@/lib/subdomain';

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  invitationSlug?: string;
  onSwitchEvent?: () => void;
  onEdit?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

function logout() {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('admin_authenticated');
  window.location.href = '/';
}

export default function AdminTopBar({
  title,
  subtitle,
  invitationSlug,
  onSwitchEvent,
  onEdit,
  onBack,
  backLabel = 'Volver',
}: AdminTopBarProps) {
  return (
    <header className="bg-background-100 border-b border-background-300/50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <i className="ri-shield-keyhole-line text-primary-600" style={{ fontSize: '16px' }}></i>
          </div>
          <div>
            <h1 className="font-label text-sm font-semibold text-foreground-900">{title}</h1>
            {subtitle && <p className="font-label text-xs text-secondary-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="hidden sm:inline-flex items-center gap-1.5 font-label text-xs text-secondary-600 hover:text-foreground-700 transition-colors duration-200 cursor-pointer"
            >
              <i className="ri-arrow-left-line" style={{ fontSize: '14px' }}></i>
              {backLabel}
            </button>
          )}
          {onSwitchEvent && (
            <button
              onClick={onSwitchEvent}
              className="hidden sm:inline-flex items-center gap-1.5 font-label text-xs text-secondary-600 hover:text-foreground-700 transition-colors duration-200 cursor-pointer"
            >
              <i className="ri-arrow-left-right-line" style={{ fontSize: '14px' }}></i>
              Cambiar evento
            </button>
          )}
          {invitationSlug && (
            <a
              href={getInvitationUrl(invitationSlug)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 font-label text-xs text-secondary-600 hover:text-foreground-700 transition-colors duration-200"
            >
              <i className="ri-external-link-line" style={{ fontSize: '14px' }}></i>
              Ver invitación
            </a>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="hidden sm:inline-flex items-center gap-1.5 font-label text-xs text-secondary-600 hover:text-foreground-700 transition-colors duration-200 cursor-pointer"
            >
              <i className="ri-edit-line" style={{ fontSize: '14px' }}></i>
              Editar evento
            </button>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 font-label text-xs text-secondary-500 hover:text-red-600 transition-colors duration-200 cursor-pointer"
          >
            <i className="ri-logout-box-line" style={{ fontSize: '14px' }}></i>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
