import { useState, useEffect, useCallback } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  eventDate: string;
}

function calculateTimeLeft(
  eventDate: string,
): TimeLeft {
  const target =
    new Date(eventDate).getTime();

  const now = new Date().getTime();

  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(
      difference /
        (1000 * 60 * 60 * 24),
    ),
    hours: Math.floor(
      (difference /
        (1000 * 60 * 60)) %
        24,
    ),
    minutes: Math.floor(
      (difference / (1000 * 60)) %
        60,
    ),
    seconds: Math.floor(
      (difference / 1000) % 60,
    ),
  };
}

export default function CountdownTimer({
  eventDate,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] =
    useState<TimeLeft>(
      calculateTimeLeft(eventDate),
    );

  const [isLoaded, setIsLoaded] =
    useState(false);

  const tick = useCallback(() => {
    setTimeLeft(
      calculateTimeLeft(eventDate),
    );
  }, [eventDate]);

  useEffect(() => {
    setIsLoaded(true);

    const timer = setInterval(
      tick,
      1000,
    );

    return () =>
      clearInterval(timer);
  }, [tick]);

  const pad = (n: number) =>
    String(n).padStart(2, '0');

  return (
    <div
      className={`flex items-center justify-center gap-3 md:gap-5 transition-all duration-1000 ${
        isLoaded
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
    >
      {[
        {
          value: timeLeft.days,
          label: 'Días',
        },
        {
          value: timeLeft.hours,
          label: 'Hs',
        },
        {
          value: timeLeft.minutes,
          label: 'Min',
        },
        {
          value: timeLeft.seconds,
          label: 'Seg',
        },
      ].map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-background-50/15 backdrop-blur-sm border border-background-50/30 flex items-center justify-center">
            <span className="text-xl md:text-2xl font-label font-light text-background-50 tabular-nums">
              {pad(item.value)}
            </span>
          </div>

          <span className="text-[10px] md:text-xs font-label text-background-50/70 mt-1.5 uppercase tracking-widest">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}