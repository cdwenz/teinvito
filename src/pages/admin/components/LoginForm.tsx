import { useState } from 'react';
import { eventConfig } from '@/config/event';

interface LoginFormProps {
  onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Ingresá la contraseña');
      return;
    }

    setLoading(true);

    // Simulate brief auth check
    setTimeout(() => {
      if (password === eventConfig.admin.password) {
        sessionStorage.setItem('admin_authenticated', 'true');
        onLogin();
      } else {
        setError('Contraseña incorrecta');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-4">
            <i className="ri-shield-keyhole-line text-primary-600" style={{ fontSize: '28px' }}></i>
          </div>
          <h1 className="font-heading text-2xl text-foreground-900 font-light mb-1">
            Panel de Organización
          </h1>
          <p className="font-body text-foreground-500 text-sm">
            {eventConfig.birthday.firstName} · {eventConfig.birthday.welcomeMessage}
          </p>
        </div>

        {/* Login card */}
        <form onSubmit={handleSubmit} className="bg-background-100 rounded-xl p-6 md:p-8">
          <div className="mb-5">
            <label htmlFor="admin-password" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Ingresá la contraseña"
              autoFocus
              className={`w-full px-4 py-3 rounded-lg bg-background-50 border font-body text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-base ${
                error ? 'border-red-300' : 'border-background-300'
              }`}
            />
            {error && (
              <p className="mt-2 text-xs text-red-500 font-label flex items-center gap-1.5">
                <i className="ri-error-warning-line" style={{ fontSize: '14px' }}></i>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-background-50 px-6 py-3 rounded-full font-label text-sm font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-background-50/40 border-t-background-50 rounded-full animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                Ingresar
                <i className="ri-arrow-right-line" style={{ fontSize: '16px' }}></i>
              </>
            )}
          </button>
        </form>

        {/* Back to invitation */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 font-label text-xs text-secondary-500 hover:text-foreground-700 transition-colors duration-300"
          >
            <i className="ri-arrow-left-line" style={{ fontSize: '14px' }}></i>
            Volver a la invitación
          </a>
        </div>
      </div>
    </div>
  );
}