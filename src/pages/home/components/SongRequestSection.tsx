import { useEffect, useRef, useState } from 'react';
import { eventConfig } from '@/config/event';
import { mockSongRequests } from '@/mocks/songRequests';

export default function SongRequestSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);


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
          className={`font-heading text-3xl md:text-5xl text-center text-foreground-900 font-light mb-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {eventConfig.songRequests.title}
        </h2>

        {/* Subtitle */}
        <p
          className={`text-center text-foreground-500 font-body text-lg md:text-xl mb-10 md:mb-14 leading-relaxed transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          {eventConfig.songRequests.subtitle}
        </p>

        {/* Song list — already requested songs */}
        <div
          className={`mb-14 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          {/* <div className="flex items-center justify-between mb-5">
            <h3 className="font-label text-xs tracking-[0.2em] uppercase text-secondary-500 flex items-center gap-2">
              <i className="ri-play-list-2-line" style={{ fontSize: '16px' }}></i>
              Playlist de la fiesta
            </h3>
            <span className="font-label text-xs text-foreground-400">
              {mockSongRequests.length} canciones
            </span>
          </div> */}

          {/* <div className="bg-background-100 rounded-xl border border-background-200/70 overflow-hidden"> */}
          {/* {mockSongRequests.map((song, i) => (
              <div
                key={song.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors duration-200 hover:bg-background-50 ${
                  i < mockSongRequests.length - 1 ? 'border-b border-background-200/60' : ''
                }`}
              > */}
          {/* Vinyl icon */}
          {/* <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-disc-fill text-accent-600" style={{ fontSize: '18px' }}></i>
                </div> */}

          {/* <div className="flex-1 min-w-0">
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
                </div> */}

          {/* Message tooltip on desktop */}
          {/* {song.message && (
                  <div className="hidden sm:flex items-center flex-shrink-0" title={song.message}>
                    <i className="ri-chat-quote-line text-foreground-300" style={{ fontSize: '14px' }}></i>
                  </div>
                )} */}
          {/* </div>
            ))} */}
          {/* </div> */}

          {/* Add song button */}
          {/* <div className="text-center mt-6">
            <button
              onClick={scrollToForm}
              className="whitespace-nowrap inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 hover:bg-accent-600 text-background-50 font-label text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer"
            >
              <i className="ri-add-line" style={{ fontSize: '18px' }}></i>
              Pedir una canción
            </button>
          </div> */}
        </div>

        {/* Song request form */}
        <div
          id="song-form"
          className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
                    Pedí tu canción
                  </h3>
                  <p className="font-label text-xs text-foreground-400">
                    Sumate tu canción favorita a la playlist de la fiesta
                  </p>
                </div>
              </div>

              <a
                href={eventConfig.songRequests.spotifyPlaylistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap w-full py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 text-background-50 font-label text-sm font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <i className="ri-spotify-fill" style={{ fontSize: '18px' }}></i>
                Sumar a la playlist
              </a>
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