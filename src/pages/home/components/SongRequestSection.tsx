import { useEffect, useRef, useState } from 'react';
import { eventConfig } from '@/config/event';
import { mockSongRequests } from '@/mocks/songRequests';

export default function SongRequestSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!songName.trim() || !artist.trim()) {
      setFormError('Por favor completá el nombre de la canción y el artista');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append('songName', songName.trim());
      formData.append('artist', artist.trim());
      formData.append('guestName', guestName.trim());
      formData.append('message', message.trim());
      formData.append('submittedAt', new Date().toISOString());

      const response = await fetch(eventConfig.songRequests.formUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (response.ok) {
        setSubmitted(true);
        setSongName('');
        setArtist('');
        setGuestName('');
        setMessage('');
      } else {
        setFormError('Uy, hubo un error al enviar. ¿Probás de nuevo?');
      }
    } catch {
      setFormError('No se pudo conectar. Revisá tu internet y probá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('song-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="songs"
      className="relative py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-background-50"
    >
      {/* Decorative music note background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-[0.03]">
        <i className="ri-music-2-fill absolute text-[20rem] -top-20 -left-20 text-foreground-900" />
        <i className="ri-music-fill absolute text-[16rem] top-1/2 -right-16 text-foreground-900" />
        <i className="ri-spotify-fill absolute text-[12rem] -bottom-10 left-1/3 text-foreground-900" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Section label */}
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-label tracking-[0.3em] uppercase text-secondary-500">
            · Música ·
          </span>
        </div>

        {/* Title */}
        <h2
          className={`font-heading text-3xl md:text-5xl text-center text-foreground-900 font-light mb-3 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {eventConfig.songRequests.title}
        </h2>

        {/* Subtitle */}
        <p
          className={`text-center text-foreground-500 font-body text-lg md:text-xl mb-10 md:mb-14 leading-relaxed transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {eventConfig.songRequests.subtitle}
        </p>

        {/* Song list — already requested songs */}
        <div
          className={`mb-14 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-label text-xs tracking-[0.2em] uppercase text-secondary-500 flex items-center gap-2">
              <i className="ri-play-list-2-line" style={{ fontSize: '16px' }}></i>
              Playlist de la fiesta
            </h3>
            <span className="font-label text-xs text-foreground-400">
              {mockSongRequests.length} canciones
            </span>
          </div>

          <div className="bg-background-100 rounded-xl border border-background-200/70 overflow-hidden">
            {mockSongRequests.map((song, i) => (
              <div
                key={song.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors duration-200 hover:bg-background-50 ${
                  i < mockSongRequests.length - 1 ? 'border-b border-background-200/60' : ''
                }`}
              >
                {/* Vinyl icon */}
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-disc-fill text-accent-600" style={{ fontSize: '18px' }}></i>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body text-foreground-800 text-base font-medium truncate">
                      {song.songName}
                    </span>
                    {song.message && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-label text-[10px] tracking-wide">
                        dedicado
                      </span>
                    )}
                  </div>
                  <span className="block text-foreground-500 font-body text-sm">
                    {song.artist}
                  </span>
                  {song.guestName && (
                    <span className="block text-foreground-400 font-label text-xs mt-1">
                      Pedido por {song.guestName}
                    </span>
                  )}
                  {song.message && (
                    <p className="text-foreground-400 font-body text-xs italic mt-1 sm:hidden">
                      "{song.message}"
                    </p>
                  )}
                </div>

                {/* Message tooltip on desktop */}
                {song.message && (
                  <div className="hidden sm:flex items-center flex-shrink-0" title={song.message}>
                    <i className="ri-chat-quote-line text-foreground-300" style={{ fontSize: '14px' }}></i>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add song button */}
          <div className="text-center mt-6">
            <button
              onClick={scrollToForm}
              className="whitespace-nowrap inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 hover:bg-accent-600 text-background-50 font-label text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer"
            >
              <i className="ri-add-line" style={{ fontSize: '18px' }}></i>
              Pedir una canción
            </button>
          </div>
        </div>

        {/* Song request form */}
        <div
          id="song-form"
          className={`transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-background-100 rounded-xl border border-background-200/70 overflow-hidden">
            {/* Decorative top bar */}
            <div className="h-1.5 bg-accent-400/60" />

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <i className="ri-music-line text-primary-600" style={{ fontSize: '18px' }}></i>
                </div>
                <div>
                  <h3 className="font-heading text-xl text-foreground-900">
                    {submitted ? '¡Gracias por tu tema!' : 'Pedí tu canción'}
                  </h3>
                  <p className="font-label text-xs text-foreground-400">
                    {submitted ? 'Tu pedido ya está en la lista' : 'Completá los datos y sumalo a la playlist'}
                  </p>
                </div>
              </div>

              {submitted ? (
                /* Success state */
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <i className="ri-check-line text-primary-600" style={{ fontSize: '28px' }}></i>
                  </div>
                  <p className="font-body text-foreground-600 text-lg mb-4">
                    Tu canción fue agregada a la lista. ¡Va a sonar en la fiesta!
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="whitespace-nowrap px-6 py-2.5 rounded-full border border-background-300 text-foreground-600 font-label text-xs font-medium tracking-wide hover:bg-background-200 transition-all duration-300 cursor-pointer"
                  >
                    Pedir otra canción
                  </button>
                </div>
              ) : (
                /* Form */
                <form
                  ref={formRef}
                  data-readdy-form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  {/* Song name + Artist row */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label htmlFor="songName" className="font-label text-xs tracking-widest uppercase text-secondary-500">
                        Canción <span className="text-primary-600">*</span>
                      </label>
                      <input
                        id="songName"
                        name="songName"
                        type="text"
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                        placeholder="Ej: Perfect"
                        className="w-full px-4 py-3 rounded-lg border border-background-300 bg-background-50 text-foreground-800 font-body text-sm placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors duration-200"
                        maxLength={100}
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-1.5">
                      <label htmlFor="artist" className="font-label text-xs tracking-widest uppercase text-secondary-500">
                        Artista <span className="text-primary-600">*</span>
                      </label>
                      <input
                        id="artist"
                        name="artist"
                        type="text"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        placeholder="Ej: Ed Sheeran"
                        className="w-full px-4 py-3 rounded-lg border border-background-300 bg-background-50 text-foreground-800 font-body text-sm placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors duration-200"
                        maxLength={100}
                      />
                    </div>
                  </div>

                  {/* Guest name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="guestName" className="font-label text-xs tracking-widest uppercase text-secondary-500">
                      Tu nombre
                    </label>
                    <input
                      id="guestName"
                      name="guestName"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Ej: Prima Luli"
                      className="w-full px-4 py-3 rounded-lg border border-background-300 bg-background-50 text-foreground-800 font-body text-sm placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors duration-200"
                      maxLength={60}
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="font-label text-xs tracking-widest uppercase text-secondary-500">
                      Dedicación o mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ej: ¡Esta la bailamos todas juntas!"
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-lg border border-background-300 bg-background-50 text-foreground-800 font-body text-sm placeholder:text-foreground-300 focus:outline-none focus:border-primary-400 transition-colors duration-200 resize-none"
                    />
                    <span className="text-foreground-300 font-label text-[10px] text-right">
                      {message.length}/500
                    </span>
                  </div>

                  {/* Error message */}
                  {formError && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 font-body text-sm">
                      <i className="ri-error-warning-line flex-shrink-0" style={{ fontSize: '16px' }}></i>
                      {formError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="whitespace-nowrap w-full py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-background-50 font-label text-sm font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-background-50/30 border-t-background-50 rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="ri-spotify-fill" style={{ fontSize: '18px' }}></i>
                        Sumar a la playlist
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Decorative bottom */}
            <div className="flex justify-center pb-5">
              <span className="font-heading text-accent-500 text-base italic opacity-50">
                la música nos une
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}