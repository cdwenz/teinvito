import { useCallback, useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import EventPicker from './components/EventPicker';
import CreateEventForm from './components/CreateEventForm';
import PendingAccountScreen from './components/PendingAccountScreen';
import PendingReviewScreen from './components/PendingReviewScreen';
import SuperadminPanel from './components/SuperadminPanel';
import { getMyEvents, getMyProfile } from '@/lib/api';
import type { Event } from '@/types/event';
import type { UserProfile } from '@/lib/api';

type View = 'loading' | 'picker' | 'dashboard' | 'create' | 'edit';

function isExpired(profile: UserProfile): boolean {
  return (
    profile.status === 'ACTIVE' &&
    profile.expiresAt !== null &&
    new Date(profile.expiresAt) < new Date()
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showSuperadmin, setShowSuperadmin] = useState(false);

  const [view, setView] = useState<View>('loading');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    setAuthenticated(!!token);
    setCheckingSession(false);
  }, []);

  const loadEvents = useCallback(async () => {
    setView('loading');

    try {
      const myEvents = await getMyEvents();
      setEvents(myEvents);

      if (myEvents.length === 0) {
        setView('create');
      } else if (myEvents.length === 1) {
        setSelectedSlug(myEvents[0].slug);
        setView('dashboard');
      } else {
        setView('picker');
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const me = await getMyProfile();
      setProfile(me);

      if (me.status === 'ACTIVE' && !isExpired(me)) {
        loadEvents();
      }
    } catch (error) {
      console.error(error);
    }
  }, [loadEvents]);

  useEffect(() => {
    if (authenticated) {
      loadProfile();
    }
  }, [authenticated, loadProfile]);

  const handleLogin = useCallback(() => {
    setAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/';
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (showSuperadmin) {
    return <SuperadminPanel onBack={() => setShowSuperadmin(false)} />;
  }

  const superadminButton = profile.role === 'SUPERADMIN' && (
    <button
      onClick={() => setShowSuperadmin(true)}
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 bg-foreground-900 text-background-50 px-4 py-2 rounded-full font-label text-xs tracking-wider uppercase shadow-lg hover:bg-foreground-800 transition-colors"
    >
      <i className="ri-admin-line" style={{ fontSize: '14px' }}></i>
      Superadmin
    </button>
  );

  if (profile.status === 'PENDING_PAYMENT') {
    return (
      <>
        {superadminButton}
        <PendingAccountScreen variant="pending_payment" plan={profile.plan} onSubmitted={loadProfile} />
      </>
    );
  }

  if (profile.status === 'PENDING_REVIEW') {
    return (
      <>
        {superadminButton}
        <PendingReviewScreen onRefresh={loadProfile} onLogout={handleLogout} />
      </>
    );
  }

  if (profile.status === 'REJECTED') {
    return (
      <>
        {superadminButton}
        <PendingAccountScreen variant="rejected" plan={profile.plan} onSubmitted={loadProfile} />
      </>
    );
  }

  if (isExpired(profile)) {
    return (
      <>
        {superadminButton}
        <PendingAccountScreen variant="expired" plan={profile.plan} onSubmitted={loadProfile} />
      </>
    );
  }

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (view === 'create') {
    return (
      <>
        {superadminButton}
        <CreateEventForm
          onCreated={loadEvents}
          onCancel={
            events.length > 0
              ? () => setView(events.length > 1 ? 'picker' : 'dashboard')
              : undefined
          }
        />
      </>
    );
  }

  if (view === 'edit' && editingEvent) {
    return (
      <>
        {superadminButton}
        <CreateEventForm
          existingEvent={editingEvent}
          onCreated={() => {
            setEditingEvent(null);
            loadEvents();
          }}
          onCancel={() => {
            setEditingEvent(null);
            setView('dashboard');
          }}
        />
      </>
    );
  }

  if (view === 'picker') {
    return (
      <>
        {superadminButton}
        <EventPicker
          events={events}
          onSelect={(slug) => {
            setSelectedSlug(slug);
            setView('dashboard');
          }}
          onCreateNew={() => setView('create')}
        />
      </>
    );
  }

  return (
    <>
      {superadminButton}
      <Dashboard
        slug={selectedSlug!}
        onSwitchEvent={events.length > 1 ? () => setView('picker') : undefined}
        onEdit={(event) => {
          setEditingEvent(event);
          setView('edit');
        }}
      />
    </>
  );
}
