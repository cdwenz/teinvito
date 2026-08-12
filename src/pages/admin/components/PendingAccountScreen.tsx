import { useEffect, useState } from 'react';
import { getPaymentSettings, uploadPaymentProof, type PaymentSettings, type Plan } from '@/lib/api';

type Variant = 'pending_payment' | 'rejected' | 'expired';

interface PendingAccountScreenProps {
  variant: Variant;
  plan: Plan | null;
  onSubmitted: () => void;
}

const COPY: Record<Variant, { title: string; message: string }> = {
  pending_payment: {
    title: 'Falta un paso: subí tu comprobante',
    message: 'Hacé la transferencia con los datos de abajo y subí el comprobante para activar tu cuenta.',
  },
  rejected: {
    title: 'No pudimos validar tu comprobante',
    message: 'Revisá que el comprobante sea legible y corresponda al monto correcto, y subí uno nuevo.',
  },
  expired: {
    title: 'Tu cuenta venció',
    message: 'Tu membresía anual venció. Hacé la transferencia y subí el comprobante para renovarla.',
  },
};

export default function PendingAccountScreen({ variant, plan, onSubmitted }: PendingAccountScreenProps) {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPaymentSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const formatPrice = (amount: number, currency: string) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      await uploadPaymentProof(file);
      onSubmitted();
    } catch {
      setError('No se pudo subir el comprobante. Probá de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const copy = COPY[variant];

  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-4">
            <i className="ri-time-line text-primary-600" style={{ fontSize: '24px' }}></i>
          </div>
          <h1 className="font-heading text-2xl text-foreground-900 font-light mb-2">{copy.title}</h1>
          <p className="font-body text-foreground-500 text-sm">{copy.message}</p>
        </div>

        {plan && (
          <div className="bg-background-100 rounded-xl p-6 mb-6">
            <p className="font-label text-xs tracking-widest uppercase text-secondary-500 mb-2">Tu plan: {plan.name}</p>
            <p className="font-heading text-2xl text-foreground-900 font-semibold mb-4">
              {formatPrice(plan.priceAmount, plan.priceCurrency)}
            </p>
            <div className="space-y-1.5 font-body text-sm text-foreground-700 border-t border-background-300/60 pt-4">
              {settings?.paymentAlias && (
                <p><span className="text-secondary-500">Alias:</span> {settings.paymentAlias}</p>
              )}
              {settings?.paymentCbu && (
                <p><span className="text-secondary-500">CBU:</span> {settings.paymentCbu}</p>
              )}
              {settings?.paymentHolder && (
                <p><span className="text-secondary-500">Titular:</span> {settings.paymentHolder}</p>
              )}
            </div>
          </div>
        )}

        <div className="bg-background-100 rounded-xl p-6">
          <label
            className={`w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-background-50 px-6 py-3 rounded-full font-label text-sm font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              uploading ? 'opacity-70 pointer-events-none' : ''
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
              className="hidden"
              onChange={handleFileSelected}
            />
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-background-50/40 border-t-background-50 rounded-full animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <i className="ri-upload-2-line" style={{ fontSize: '16px' }}></i>
                Subir comprobante
              </>
            )}
          </label>

          {error && (
            <p className="mt-3 text-xs text-red-500 font-label flex items-center gap-1.5 justify-center">
              <i className="ri-error-warning-line" style={{ fontSize: '14px' }}></i>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
