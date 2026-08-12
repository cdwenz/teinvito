interface PendingReviewScreenProps {
  onRefresh: () => void;
  onLogout: () => void;
}

export default function PendingReviewScreen({ onRefresh, onLogout }: PendingReviewScreenProps) {
  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-accent-100 flex items-center justify-center mb-4">
          <i className="ri-hourglass-line text-accent-700" style={{ fontSize: '24px' }}></i>
        </div>
        <h1 className="font-heading text-2xl text-foreground-900 font-light mb-2">
          Tu comprobante está en revisión
        </h1>
        <p className="font-body text-foreground-500 text-sm mb-8">
          Te vamos a avisar por mail apenas lo validemos. Podés volver a esta pantalla más tarde para ver si ya fue aprobado.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-background-50 px-5 py-2.5 rounded-full font-label text-xs font-medium tracking-wider uppercase transition-all duration-300"
          >
            <i className="ri-refresh-line" style={{ fontSize: '14px' }}></i>
            Actualizar estado
          </button>
          <button
            onClick={onLogout}
            className="font-label text-xs text-secondary-500 hover:text-red-600 transition-colors duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
