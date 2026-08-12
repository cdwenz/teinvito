import { useEffect, useState } from 'react';
import {
  approveUser,
  createPlan,
  deactivatePlan,
  getAllPlans,
  getPaymentSettings,
  getPendingUsers,
  rejectUser,
  updatePaymentSettings,
  updatePlan,
  type PendingUser,
  type Plan,
} from '@/lib/api';

interface SuperadminPanelProps {
  onBack: () => void;
}

const emptyPlanForm = {
  name: '',
  slug: '',
  priceAmount: '',
  priceCurrency: 'ARS',
  durationDays: '',
  maxEvents: '1',
  maxGalleryImages: '10',
  maxTimelineItems: '10',
  position: '0',
};

type PlanForm = typeof emptyPlanForm;

function planToForm(plan: Plan): PlanForm {
  return {
    name: plan.name,
    slug: plan.slug,
    priceAmount: String(plan.priceAmount),
    priceCurrency: plan.priceCurrency,
    durationDays: plan.durationDays === null ? '' : String(plan.durationDays),
    maxEvents: String(plan.maxEvents),
    maxGalleryImages: String(plan.maxGalleryImages),
    maxTimelineItems: String(plan.maxTimelineItems),
    position: String(plan.position),
  };
}

export default function SuperadminPanel({ onBack }: SuperadminPanelProps) {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [actingOnId, setActingOnId] = useState<string | null>(null);

  const [settingsForm, setSettingsForm] = useState({
    paymentAlias: '',
    paymentCbu: '',
    paymentHolder: '',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [planForms, setPlanForms] = useState<Record<string, PlanForm>>({});
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [newPlanForm, setNewPlanForm] = useState<PlanForm | null>(null);
  const [creatingPlan, setCreatingPlan] = useState(false);

  const loadPending = () => {
    setLoadingPending(true);
    getPendingUsers()
      .then(setPending)
      .catch(() => setPending([]))
      .finally(() => setLoadingPending(false));
  };

  const loadPlans = () => {
    getAllPlans()
      .then((data) => {
        setPlans(data);
        setPlanForms(Object.fromEntries(data.map((p) => [p.id, planToForm(p)])));
      })
      .catch(() => setPlans([]));
  };

  useEffect(() => {
    loadPending();
    loadPlans();

    getPaymentSettings().then((s) => {
      setSettingsForm({
        paymentAlias: s.paymentAlias || '',
        paymentCbu: s.paymentCbu || '',
        paymentHolder: s.paymentHolder || '',
      });
    });
  }, []);

  const handleSavePlan = async (id: string) => {
    const form = planForms[id];
    setSavingPlanId(id);

    try {
      await updatePlan(id, {
        name: form.name,
        slug: form.slug,
        priceAmount: Number(form.priceAmount) || 0,
        priceCurrency: form.priceCurrency || 'ARS',
        durationDays: form.durationDays.trim() ? Number(form.durationDays) : null,
        maxEvents: Number(form.maxEvents) || 0,
        maxGalleryImages: Number(form.maxGalleryImages) || 0,
        maxTimelineItems: Number(form.maxTimelineItems) || 0,
      });
      loadPlans();
    } finally {
      setSavingPlanId(null);
    }
  };

  const handleTogglePlanActive = async (plan: Plan) => {
    setSavingPlanId(plan.id);
    try {
      if (plan.isActive) {
        await deactivatePlan(plan.id);
      } else {
        await updatePlan(plan.id, { isActive: true });
      }
      loadPlans();
    } finally {
      setSavingPlanId(null);
    }
  };

  const handleCreatePlan = async () => {
    if (!newPlanForm) return;
    setCreatingPlan(true);

    try {
      await createPlan({
        name: newPlanForm.name,
        slug: newPlanForm.slug,
        priceAmount: Number(newPlanForm.priceAmount) || 0,
        priceCurrency: newPlanForm.priceCurrency || 'ARS',
        durationDays: newPlanForm.durationDays.trim() ? Number(newPlanForm.durationDays) : null,
        maxEvents: Number(newPlanForm.maxEvents) || 0,
        maxGalleryImages: Number(newPlanForm.maxGalleryImages) || 0,
        maxTimelineItems: Number(newPlanForm.maxTimelineItems) || 0,
        position: Number(newPlanForm.position) || 0,
      });
      setNewPlanForm(null);
      loadPlans();
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActingOnId(id);
    try {
      await approveUser(id);
      setPending((p) => p.filter((u) => u.id !== id));
    } finally {
      setActingOnId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActingOnId(id);
    try {
      await rejectUser(id);
      setPending((p) => p.filter((u) => u.id !== id));
    } finally {
      setActingOnId(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaved(false);

    try {
      await updatePaymentSettings({
        paymentAlias: settingsForm.paymentAlias || undefined,
        paymentCbu: settingsForm.paymentCbu || undefined,
        paymentHolder: settingsForm.paymentHolder || undefined,
      });
      setSettingsSaved(true);
    } finally {
      setSavingSettings(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-background-50 border border-background-300 font-body text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300';
  const labelClass = 'block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2';

  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-background-100 border-b border-background-300/50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="font-label text-sm font-semibold text-foreground-900">Panel de Superadmin</h1>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-label text-xs text-secondary-600 hover:text-foreground-700 transition-colors"
          >
            <i className="ri-arrow-left-line" style={{ fontSize: '14px' }}></i>
            Volver
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Pending reviews */}
        <section>
          <h2 className="font-heading text-xl text-foreground-900 font-light mb-4">
            Solicitudes pendientes
          </h2>

          {loadingPending ? (
            <p className="font-body text-sm text-secondary-500">Cargando...</p>
          ) : pending.length === 0 ? (
            <div className="bg-background-100 rounded-xl p-8 text-center">
              <p className="font-body text-sm text-secondary-500">No hay solicitudes pendientes.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((u) => (
                <div key={u.id} className="bg-background-100 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                  <a href={u.paymentProofUrl} target="_blank" rel="noreferrer" className="shrink-0">
                    <img
                      src={u.paymentProofUrl}
                      alt="Comprobante"
                      className="w-20 h-20 rounded-lg object-cover border border-background-300"
                    />
                  </a>

                  <div className="flex-1">
                    <p className="font-label text-sm font-medium text-foreground-800">{u.name}</p>
                    <p className="font-body text-xs text-secondary-500">{u.email}</p>
                    <p className="font-body text-xs text-secondary-400 mt-0.5">
                      {new Date(u.createdAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(u.id)}
                      disabled={actingOnId === u.id}
                      className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 px-4 py-2 rounded-full font-label text-xs font-medium tracking-wide uppercase transition-colors"
                    >
                      <i className="ri-check-line" style={{ fontSize: '14px' }}></i>
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(u.id)}
                      disabled={actingOnId === u.id}
                      className="flex items-center gap-1.5 bg-background-50 hover:bg-red-50 disabled:opacity-60 text-red-600 border border-red-200 px-4 py-2 rounded-full font-label text-xs font-medium tracking-wide uppercase transition-colors"
                    >
                      <i className="ri-close-line" style={{ fontSize: '14px' }}></i>
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Plans */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl text-foreground-900 font-light">Planes</h2>
            {!newPlanForm && (
              <button
                onClick={() => setNewPlanForm({ ...emptyPlanForm, position: String(plans.length) })}
                className="flex items-center gap-1.5 font-label text-xs text-primary-600 hover:text-primary-700"
              >
                <i className="ri-add-line" style={{ fontSize: '14px' }}></i>
                Nuevo plan
              </button>
            )}
          </div>

          <div className="space-y-3">
            {plans.map((plan) => {
              const form = planForms[plan.id];
              if (!form) return null;

              return (
                <div key={plan.id} className={`bg-background-100 rounded-xl p-4 md:p-5 ${!plan.isActive ? 'opacity-60' : ''}`}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className={labelClass}>Nombre</label>
                      <input className={inputClass} value={form.name} onChange={(e) => setPlanForms((f) => ({ ...f, [plan.id]: { ...f[plan.id], name: e.target.value } }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Slug</label>
                      <input className={inputClass} value={form.slug} onChange={(e) => setPlanForms((f) => ({ ...f, [plan.id]: { ...f[plan.id], slug: e.target.value } }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Precio</label>
                      <input type="number" min="0" className={inputClass} value={form.priceAmount} onChange={(e) => setPlanForms((f) => ({ ...f, [plan.id]: { ...f[plan.id], priceAmount: e.target.value } }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Moneda</label>
                      <input className={inputClass} value={form.priceCurrency} onChange={(e) => setPlanForms((f) => ({ ...f, [plan.id]: { ...f[plan.id], priceCurrency: e.target.value } }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Duración (días)</label>
                      <input type="number" min="1" placeholder="vacío = de por vida" className={inputClass} value={form.durationDays} onChange={(e) => setPlanForms((f) => ({ ...f, [plan.id]: { ...f[plan.id], durationDays: e.target.value } }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Máx. eventos</label>
                      <input type="number" min="0" className={inputClass} value={form.maxEvents} onChange={(e) => setPlanForms((f) => ({ ...f, [plan.id]: { ...f[plan.id], maxEvents: e.target.value } }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Máx. fotos</label>
                      <input type="number" min="0" className={inputClass} value={form.maxGalleryImages} onChange={(e) => setPlanForms((f) => ({ ...f, [plan.id]: { ...f[plan.id], maxGalleryImages: e.target.value } }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Máx. cronograma</label>
                      <input type="number" min="0" className={inputClass} value={form.maxTimelineItems} onChange={(e) => setPlanForms((f) => ({ ...f, [plan.id]: { ...f[plan.id], maxTimelineItems: e.target.value } }))} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSavePlan(plan.id)}
                      disabled={savingPlanId === plan.id}
                      className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 px-4 py-2 rounded-full font-label text-xs font-medium tracking-wide uppercase transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => handleTogglePlanActive(plan)}
                      disabled={savingPlanId === plan.id}
                      className="flex items-center gap-1.5 bg-background-50 border border-background-300 disabled:opacity-60 text-foreground-700 px-4 py-2 rounded-full font-label text-xs font-medium tracking-wide uppercase transition-colors"
                    >
                      {plan.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              );
            })}

            {newPlanForm && (
              <div className="bg-background-100 rounded-xl p-4 md:p-5 border border-primary-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className={labelClass}>Nombre</label>
                    <input className={inputClass} value={newPlanForm.name} onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Slug</label>
                    <input className={inputClass} value={newPlanForm.slug} onChange={(e) => setNewPlanForm({ ...newPlanForm, slug: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Precio</label>
                    <input type="number" min="0" className={inputClass} value={newPlanForm.priceAmount} onChange={(e) => setNewPlanForm({ ...newPlanForm, priceAmount: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Moneda</label>
                    <input className={inputClass} value={newPlanForm.priceCurrency} onChange={(e) => setNewPlanForm({ ...newPlanForm, priceCurrency: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Duración (días)</label>
                    <input type="number" min="1" placeholder="vacío = de por vida" className={inputClass} value={newPlanForm.durationDays} onChange={(e) => setNewPlanForm({ ...newPlanForm, durationDays: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Máx. eventos</label>
                    <input type="number" min="0" className={inputClass} value={newPlanForm.maxEvents} onChange={(e) => setNewPlanForm({ ...newPlanForm, maxEvents: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Máx. fotos</label>
                    <input type="number" min="0" className={inputClass} value={newPlanForm.maxGalleryImages} onChange={(e) => setNewPlanForm({ ...newPlanForm, maxGalleryImages: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Máx. cronograma</label>
                    <input type="number" min="0" className={inputClass} value={newPlanForm.maxTimelineItems} onChange={(e) => setNewPlanForm({ ...newPlanForm, maxTimelineItems: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCreatePlan}
                    disabled={creatingPlan}
                    className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 px-4 py-2 rounded-full font-label text-xs font-medium tracking-wide uppercase transition-colors"
                  >
                    Crear
                  </button>
                  <button
                    onClick={() => setNewPlanForm(null)}
                    className="font-label text-xs text-secondary-500 hover:text-foreground-700"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Payment settings */}
        <section>
          <h2 className="font-heading text-xl text-foreground-900 font-light mb-4">
            Datos bancarios
          </h2>

          <form onSubmit={handleSaveSettings} className="bg-background-100 rounded-xl p-5 md:p-6 space-y-4">
            <div>
              <label className={labelClass}>Alias</label>
              <input
                className={inputClass}
                value={settingsForm.paymentAlias}
                onChange={(e) => setSettingsForm((f) => ({ ...f, paymentAlias: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>CBU</label>
              <input
                className={inputClass}
                value={settingsForm.paymentCbu}
                onChange={(e) => setSettingsForm((f) => ({ ...f, paymentCbu: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Titular</label>
              <input
                className={inputClass}
                value={settingsForm.paymentHolder}
                onChange={(e) => setSettingsForm((f) => ({ ...f, paymentHolder: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-background-50 px-6 py-2.5 rounded-full font-label text-sm font-medium tracking-wider uppercase transition-colors"
              >
                {savingSettings ? 'Guardando...' : 'Guardar'}
              </button>
              {settingsSaved && (
                <span className="font-label text-xs text-primary-600 flex items-center gap-1">
                  <i className="ri-check-line" style={{ fontSize: '14px' }}></i>
                  Guardado
                </span>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
