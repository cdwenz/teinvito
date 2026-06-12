import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventConfig } from '@/config/event';

interface FormData {
  name: string;
  phone: string;
  email: string;
  attend: 'yes' | 'no' | '';
  attendType: 'solo' | 'familia' | '';
  quantity: number;
  familyName: string;
  comments: string;
}

interface SubmissionRecord {
  email: string;
  phone: string;
  timestamp: number;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  attend: '',
  attendType: '',
  quantity: 1,
  familyName: '',
  comments: '',
};

const FORM_SUBMIT_URL = 'https://readdy.ai/api/form/d8jg3k4cl43d0bibfaeg';
const STORAGE_KEY = 'rsvp_submissions_maria15';

export default function RSVPSection() {
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('guest');

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Update summary visibility when key fields change
  useEffect(() => {
    const hasBasicInfo = formData.name.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.attend !== '';
    
    if (formData.attend === 'yes') {
      setShowSummary(hasBasicInfo && formData.attendType !== '');
    } else if (formData.attend === 'no') {
      setShowSummary(hasBasicInfo);
    } else {
      setShowSummary(false);
    }
  }, [formData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getStoredSubmissions = useCallback((): SubmissionRecord[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const checkDuplicate = useCallback((email: string, phone: string): boolean => {
    const submissions = getStoredSubmissions();
    const lowerEmail = email.toLowerCase().trim();
    const cleanPhone = phone.replace(/\D/g, '');
    
    return submissions.some(
      (s) => s.email.toLowerCase().trim() === lowerEmail || s.phone.replace(/\D/g, '') === cleanPhone
    );
  }, [getStoredSubmissions]);

  const saveSubmission = useCallback((email: string, phone: string) => {
    try {
      const submissions = getStoredSubmissions();
      submissions.push({ email, phone, timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // Silent fail on storage
    }
  }, [getStoredSubmissions]);

  const updateField = (field: keyof FormData, value: string | number) => {
    const newData = { ...formData, [field]: value };

    // Reset dependent fields when parent changes
    if (field === 'attend' && value !== 'yes') {
      newData.attendType = '';
      newData.quantity = 1;
      newData.familyName = '';
    }
    if (field === 'attendType' && value === 'solo') {
      newData.quantity = 1;
      newData.familyName = '';
    }

    setFormData(newData);
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setDuplicateError('');
    setSubmitError('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ingresá tu nombre y apellido';
    }

    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Ingresá tu teléfono';
    } else if (phoneClean.length < 8) {
      newErrors.phone = 'Ingresá un teléfono válido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Ingresá tu email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresá un email válido';
    }

    if (!formData.attend) {
      newErrors.attend = 'Seleccioná si asistirás o no';
    }

    if (formData.attend === 'yes') {
      if (!formData.attendType) {
        newErrors.attendType = 'Seleccioná el tipo de asistencia';
      }
      if (formData.attendType === 'familia' && formData.quantity < 1) {
        newErrors.quantity = 'La cantidad mínima es 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setDuplicateError('');

    if (!validate()) return;

    // Check duplicates
    if (checkDuplicate(formData.email, formData.phone)) {
      setDuplicateError('Ya existe una confirmación registrada con estos datos.');
      return;
    }

    setIsSubmitting(true);

    try {
      const body = new URLSearchParams();
      body.append('name', formData.name.trim());
      body.append('phone', formData.phone.trim());
      body.append('email', formData.email.trim());
      body.append('attend', formData.attend);
      body.append('attend_type', formData.attend === 'yes' ? formData.attendType : '');
      body.append('quantity', formData.attend === 'yes' && formData.attendType === 'familia' 
        ? String(formData.quantity) 
        : (formData.attend === 'yes' ? '1' : '0'));
      body.append('family_name', formData.familyName.trim());
      body.append('comments', formData.comments.trim().slice(0, 500));
      if (guestName) {
        body.append('guest_param', guestName);
      }

      const response = await fetch(FORM_SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (response.ok) {
        saveSubmission(formData.email, formData.phone);
        setSubmitted(true);
      } else {
        setSubmitError('Hubo un error al enviar. Intentá de nuevo.');
      }
    } catch {
      setSubmitError('Error de conexión. Revisá tu internet e intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAttendees = formData.attend === 'yes' && formData.attendType === 'familia'
    ? formData.quantity
    : formData.attend === 'yes' ? 1 : 0;

  // Success state
  if (submitted) {
    return (
      <section ref={sectionRef} id="rsvp" className="py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-background-100">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-8">
            <i className="ri-check-line text-primary-600" style={{ fontSize: '36px' }}></i>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl text-foreground-900 font-light mb-4">
            {formData.attend === 'yes' ? '¡Gracias por confirmar!' : 'Gracias por avisarnos'}
          </h2>
          <p className="font-body text-foreground-600 text-lg md:text-xl leading-relaxed">
            {formData.attend === 'yes'
              ? `${formData.name}, tu asistencia quedó registrada. ¡Te esperamos para celebrar juntos!`
              : `${formData.name}, lamentamos que no puedas acompañarnos. ¡Gracias igual por responder!`}
          </p>
        </div>
      </section>
    );
  }

  // Build summary text
  let summaryText = '';
  if (showSummary) {
    if (formData.attend === 'no') {
      summaryText = `Estás confirmando que no podrás asistir.`;
    } else if (formData.attend === 'yes' && formData.attendType === 'solo') {
      summaryText = `Estás confirmando asistencia para 1 persona.`;
    } else if (formData.attend === 'yes' && formData.attendType === 'familia') {
      const familyLabel = formData.familyName.trim() ? ` (${formData.familyName.trim()})` : '';
      summaryText = `Estás confirmando asistencia para ${totalAttendees} persona${totalAttendees !== 1 ? 's' : ''}${familyLabel}.`;
    }
  }

  return (
    <section ref={sectionRef} id="rsvp" className="py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-background-100">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-label tracking-[0.3em] uppercase text-secondary-500">
            · RSVP ·
          </span>
        </div>

        <h2
          className={`font-heading text-3xl md:text-5xl text-center text-foreground-900 font-light mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Confirmar asistencia
        </h2>
        <p
          className={`text-center text-foreground-500 font-body text-lg md:text-xl mb-12 md:mb-16 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Completá tus datos y contanos si nos acompañás
        </p>

        {/* Form */}
        <form
          id="rsvp-form"
          data-readdy-form
          onSubmit={handleSubmit}
          noValidate
          className={`space-y-6 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Name */}
          <div>
            <label htmlFor="rsvp-name" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
              Nombre y apellido <span className="text-primary-500">*</span>
            </label>
            <input
              id="rsvp-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ej: María García"
              className={`w-full px-4 py-3 rounded-lg bg-background-50 border font-body text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-base ${
                errors.name ? 'border-red-300' : 'border-background-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500 font-label">{errors.name}</p>
            )}
          </div>

          {/* Phone + Email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="rsvp-phone" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
                Teléfono <span className="text-primary-500">*</span>
              </label>
              <input
                id="rsvp-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="Ej: 261 555 1234"
                className={`w-full px-4 py-3 rounded-lg bg-background-50 border font-body text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-base ${
                  errors.phone ? 'border-red-300' : 'border-background-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-500 font-label">{errors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="rsvp-email" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
                Email <span className="text-primary-500">*</span>
              </label>
              <input
                id="rsvp-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Ej: maria@gmail.com"
                className={`w-full px-4 py-3 rounded-lg bg-background-50 border font-body text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-base ${
                  errors.email ? 'border-red-300' : 'border-background-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-label">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Attend? */}
          <div>
            <span className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-3">
              ¿Asistirás? <span className="text-primary-500">*</span>
            </span>
            <div className="flex gap-3">
              {[
                { value: 'yes', label: 'Sí, voy', icon: 'ri-check-line' },
                { value: 'no', label: 'No, no puedo', icon: 'ri-close-line' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField('attend', opt.value)}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg border font-label text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                    formData.attend === opt.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-background-300 bg-background-50 text-foreground-600 hover:border-secondary-400'
                  }`}
                >
                  <i className={opt.icon} style={{ fontSize: '16px' }}></i>
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.attend && (
              <p className="mt-1.5 text-xs text-red-500 font-label">{errors.attend}</p>
            )}
          </div>

          {/* Conditional: If attending YES */}
          {formData.attend === 'yes' && (
            <div className="animate-fade-in-up bg-background-50 rounded-lg p-5 md:p-6 space-y-5">
              <div>
                <span className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-3">
                  ¿Cómo asistirás? <span className="text-primary-500">*</span>
                </span>
                <div className="flex gap-3">
                  {[
                    { value: 'solo', label: 'Solo/a', icon: 'ri-user-line' },
                    { value: 'familia', label: 'Grupo familiar', icon: 'ri-group-line' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField('attendType', opt.value)}
                      className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg border font-label text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                        formData.attendType === opt.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-background-300 bg-background-50 text-foreground-600 hover:border-secondary-400'
                      }`}
                    >
                      <i className={opt.icon} style={{ fontSize: '16px' }}></i>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.attendType && (
                  <p className="mt-1.5 text-xs text-red-500 font-label">{errors.attendType}</p>
                )}
              </div>

              {/* Conditional: If grupo familiar */}
              {formData.attendType === 'familia' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label htmlFor="rsvp-quantity" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
                      Cantidad de asistentes
                    </label>
                    <input
                      id="rsvp-quantity"
                      name="quantity"
                      type="number"
                      min="2"
                      value={formData.quantity}
                      onChange={(e) => updateField('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-full px-4 py-3 rounded-lg bg-background-50 border font-body text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-base ${
                        errors.quantity ? 'border-red-300' : 'border-background-300'
                      }`}
                    />
                    {errors.quantity && (
                      <p className="mt-1.5 text-xs text-red-500 font-label">{errors.quantity}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="rsvp-family" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
                      Nombre del grupo (opcional)
                    </label>
                    <input
                      id="rsvp-family"
                      name="family_name"
                      type="text"
                      value={formData.familyName}
                      onChange={(e) => updateField('familyName', e.target.value)}
                      placeholder="Ej: Familia Pérez"
                      className="w-full px-4 py-3 rounded-lg bg-background-50 border border-background-300 font-body text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-base"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          <div>
            <label htmlFor="rsvp-comments" className="block font-label text-xs tracking-widest uppercase text-secondary-600 mb-2">
              Comentarios adicionales
            </label>
            <textarea
              id="rsvp-comments"
              name="comments"
              rows={3}
              maxLength={500}
              value={formData.comments}
              onChange={(e) => updateField('comments', e.target.value)}
              placeholder="¿Algo que quieras contarnos? Restricciones alimenticias, canción que no puede faltar..."
              className="w-full px-4 py-3 rounded-lg bg-background-50 border border-background-300 font-body text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-base resize-none"
            />
            <p className="mt-1 text-xs text-secondary-500 text-right font-label">
              {formData.comments.length}/500
            </p>
          </div>

          {/* Dynamic summary */}
          {showSummary && (
            <div className="bg-background-50 rounded-lg p-5 border border-accent-200/70">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-information-line text-accent-700" style={{ fontSize: '16px' }}></i>
                </div>
                <p className="font-body text-foreground-700 text-base leading-relaxed pt-1">
                  {summaryText}
                </p>
              </div>
            </div>
          )}

          {/* Duplicate error */}
          {duplicateError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-error-warning-line text-red-600" style={{ fontSize: '16px' }}></i>
              </div>
              <p className="font-label text-sm text-red-700 leading-relaxed pt-0.5">{duplicateError}</p>
            </div>
          )}

          {/* Submit error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-error-warning-line text-red-600" style={{ fontSize: '16px' }}></i>
              </div>
              <p className="font-label text-sm text-red-700 leading-relaxed pt-0.5">{submitError}</p>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-background-50 px-8 py-4 rounded-full font-label text-sm font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-background-50/40 border-t-background-50 rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Confirmar asistencia
                  <i className="ri-send-plane-line" style={{ fontSize: '16px' }}></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}