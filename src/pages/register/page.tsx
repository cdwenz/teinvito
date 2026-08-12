import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getPaymentSettings,
  getPlans,
  registerUser,
  type PaymentSettings,
  type Plan,
} from '@/lib/api';

export default function Register() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [settings, setSettings] = useState<PaymentSettings | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPlans()
      .then((data) => {
        setPlans(data);
        const highlighted = data.find((p) => p.position === Math.min(...data.map((x) => x.position)));
        if (highlighted) setSelectedPlanId(highlighted.id);
      })
      .catch(() => setPlans([]));

    getPaymentSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const formatPrice = (amount: number, currency: string) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedPlanId) {
      setError('Elegí un plan para continuar');
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Completá todos los campos');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(name, email, password, selectedPlanId);

      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('access_token', response.accessToken);

      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg bg-background-50 border border-background-300 font-body text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300';

  return (
    <div className="min-h-screen bg-background-50 px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl text-foreground-900 font-light mb-2">
          Creá tu invitación digital
        </h1>
        <p className="font-body text-foreground-500 text-sm">
          Elegí un plan, hacé la transferencia y subí el comprobante — activamos tu cuenta en cuanto lo validemos.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-10">
        {plans.map((plan) => {
          const selected = plan.id === selectedPlanId;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlanId(plan.id)}
              className={`text-left rounded-xl border p-5 transition-all duration-300 ${
                selected
                  ? 'border-primary-400 bg-primary-50 ring-1 ring-primary-300'
                  : 'border-background-300 bg-background-100 hover:border-primary-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-heading text-lg font-semibold text-foreground-900">{plan.name}</h3>
                {selected && (
                  <i className="ri-checkbox-circle-fill text-primary-500" style={{ fontSize: '18px' }}></i>
                )}
              </div>
              <p className="font-heading text-2xl font-bold text-foreground-900 mb-1">
                {formatPrice(plan.priceAmount, plan.priceCurrency)}
              </p>
              <p className="text-xs text-secondary-500 mb-4">
                {plan.durationDays ? `${Math.round(plan.durationDays / 30)} meses de acceso` : 'Acceso de por vida'}
              </p>
              <ul className="space-y-1.5 text-xs text-foreground-600">
                <li className="flex items-center gap-1.5">
                  <i className="ri-check-line text-primary-500" style={{ fontSize: '13px' }}></i>
                  {plan.maxEvents} evento{plan.maxEvents > 1 ? 's' : ''}
                </li>
                <li className="flex items-center gap-1.5">
                  <i className="ri-check-line text-primary-500" style={{ fontSize: '13px' }}></i>
                  Hasta {plan.maxGalleryImages} fotos
                </li>
                <li className="flex items-center gap-1.5">
                  <i className="ri-check-line text-primary-500" style={{ fontSize: '13px' }}></i>
                  Hasta {plan.maxTimelineItems} ítems de cronograma
                </li>
              </ul>
            </button>
          );
        })}
      </div>

      <div className="w-full max-w-md mx-auto">
        {settings && (settings.paymentAlias || settings.paymentCbu) && (
          <div className="bg-background-100 rounded-xl p-6 mb-6">
            <p className="font-label text-xs tracking-widest uppercase text-secondary-500 mb-3">
              Datos para la transferencia
            </p>
            <div className="space-y-1.5 font-body text-sm text-foreground-700">
              {settings.paymentAlias && (
                <p><span className="text-secondary-500">Alias:</span> {settings.paymentAlias}</p>
              )}
              {settings.paymentCbu && (
                <p><span className="text-secondary-500">CBU:</span> {settings.paymentCbu}</p>
              )}
              {settings.paymentHolder && (
                <p><span className="text-secondary-500">Titular:</span> {settings.paymentHolder}</p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-background-100 rounded-xl p-6 md:p-8 space-y-5">
          <div>
            <label htmlFor="name" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
              Nombre y apellido
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-label flex items-center gap-1.5">
              <i className="ri-error-warning-line" style={{ fontSize: '14px' }}></i>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-background-50 px-6 py-3 rounded-full font-label text-sm font-medium tracking-wider uppercase transition-all duration-300"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-background-50/40 border-t-background-50 rounded-full animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear cuenta
                <i className="ri-arrow-right-line" style={{ fontSize: '16px' }}></i>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 font-label text-xs text-secondary-500 hover:text-foreground-700 transition-colors duration-300"
          >
            ¿Ya tenés cuenta? Iniciá sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
