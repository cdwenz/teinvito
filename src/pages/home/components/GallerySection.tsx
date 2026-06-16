import { useEffect, useRef, useState, useCallback } from 'react';
import type { Event } from '@/types/event';

interface GallerySectionProps {
  event: Event;
}

export default function GallerySection({ event }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const photos = event.gallery ?? [];

  if (!photos.length) {
    return null;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToPhoto = useCallback((index: number) => {
    if (carouselRef.current) {
      const cards = carouselRef.current.querySelectorAll('[data-photo-card]');
      if (cards[index]) {
        cards[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
    setCurrentIndex(index);
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigateLightbox = useCallback(
    (dir: 'prev' | 'next') => {
      if (dir === 'prev') {
        setLightboxIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
      } else {
        setLightboxIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      }
    },
    []
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'ArrowRight') navigateLightbox('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, navigateLightbox]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-background-50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-label tracking-[0.3em] uppercase text-secondary-500">
            · Galería ·
          </span>
        </div>

        {/* Title */}
        <h2
          className={`font-heading text-3xl md:text-5xl text-center text-foreground-900 font-light mb-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          Recuerdos que brillan
        </h2>
        <p
          className={`text-center text-foreground-500 font-body text-lg md:text-xl mb-12 md:mb-16 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          Un adelanto de lo que será una noche mágica
        </p>

        {/* Carousel */}
        <div
          className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          {/* Scrollable carousel container */}
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                data-photo-card
                className="flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px] snap-center"
              >
                <button
                  onClick={() => openLightbox(i)}
                  className="group relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-background-200/70 transition-all duration-300 hover:border-accent-300/60 cursor-pointer"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading={i <= 1 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-12 h-12 rounded-full bg-background-50/90 flex items-center justify-center">
                      <i className="ri-search-line text-foreground-700" style={{ fontSize: '20px' }}></i>
                    </span>
                  </div>
                </button>
                <p className="mt-2 text-center font-label text-xs tracking-wide text-secondary-500 uppercase">
                  {photo.alt}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPhoto(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex
                    ? 'bg-primary-500 w-6'
                    : 'bg-secondary-300 hover:bg-secondary-400'
                  }`}
                aria-label={`Ir a foto ${i + 1}`}
              />
            ))}
          </div>

          {/* Nav arrows */}
          <div className="flex items-center justify-center gap-3 mt-4 md:hidden">
            <button
              onClick={() => scrollToPhoto(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-background-100 border border-background-200/70 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-background-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-left-s-line text-foreground-600" style={{ fontSize: '20px' }}></i>
            </button>
            <span className="font-label text-xs text-secondary-500 tracking-wider">
              {currentIndex + 1} / {photos.length}
            </span>
            <button
              onClick={() => scrollToPhoto(Math.min(photos.length - 1, currentIndex + 1))}
              disabled={currentIndex === photos.length - 1}
              className="w-10 h-10 rounded-full bg-background-100 border border-background-200/70 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-background-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-right-s-line text-foreground-600" style={{ fontSize: '20px' }}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 rounded-full bg-background-50/10 hover:bg-background-50/20 flex items-center justify-center transition-colors duration-300 cursor-pointer"
          >
            <i className="ri-close-line text-background-50" style={{ fontSize: '22px' }}></i>
          </button>

          {/* Counter */}
          <span className="absolute top-4 left-4 md:top-6 md:left-6 font-label text-xs text-background-50/60 tracking-wider">
            {lightboxIndex + 1} / {photos.length}
          </span>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('prev');
            }}
            className="absolute left-3 md:left-6 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-background-50/10 hover:bg-background-50/20 flex items-center justify-center transition-colors duration-300 cursor-pointer"
          >
            <i className="ri-arrow-left-line text-background-50" style={{ fontSize: '20px' }}></i>
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex].imageUrl}
              alt={photos[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('next');
            }}
            className="absolute right-3 md:right-6 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-background-50/10 hover:bg-background-50/20 flex items-center justify-center transition-colors duration-300 cursor-pointer"
          >
            <i className="ri-arrow-right-line text-background-50" style={{ fontSize: '20px' }}></i>
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === lightboxIndex
                    ? 'bg-background-50 w-5'
                    : 'bg-background-50/30 hover:bg-background-50/60'
                  }`}
                aria-label={`Ver foto ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}