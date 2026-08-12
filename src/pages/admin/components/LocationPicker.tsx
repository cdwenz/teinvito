import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet's default marker icon paths break with bundlers — point them at the bundled assets.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationPickerProps {
  address: string;
  initialMapsEmbedUrl?: string;
  onChange: (venue: { address: string; mapsEmbedUrl: string; mapsDirectionUrl: string }) => void;
}

function parsePosition(mapsEmbedUrl?: string): [number, number] | null {
  const match = mapsEmbedUrl?.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (!match) return null;
  return [parseFloat(match[1]), parseFloat(match[2])];
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

const DEFAULT_CENTER: [number, number] = [-34.6037, -58.3816]; // Buenos Aires

function buildUrls(lat: number, lng: number) {
  return {
    mapsEmbedUrl: `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`,
    mapsDirectionUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  };
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterOnChange({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position[0], position[1]]);

  return null;
}

export default function LocationPicker({ address, initialMapsEmbedUrl, onChange }: LocationPickerProps) {
  const [query, setQuery] = useState(address);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(() => parsePosition(initialMapsEmbedUrl));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim() || query === address) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`,
        );
        const data: SearchResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const selectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setPosition([lat, lng]);
    setQuery(result.display_name);
    setResults([]);
    onChange({ address: result.display_name, ...buildUrls(lat, lng) });
  };

  const handleMapPick = async (lat: number, lng: number) => {
    setPosition([lat, lng]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      const resolvedAddress = data.display_name || query;
      setQuery(resolvedAddress);
      onChange({ address: resolvedAddress, ...buildUrls(lat, lng) });
    } catch {
      onChange({ address: query, ...buildUrls(lat, lng) });
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-background-50 border border-background-300 font-body text-sm text-foreground-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300';

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          className={inputClass}
          placeholder="Buscá una dirección..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {searching && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        )}

        {results.length > 0 && (
          <div className="absolute z-[1000] w-full mt-1 bg-background-50 border border-background-300 rounded-lg shadow-lg overflow-hidden">
            {results.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectResult(r)}
                className="w-full text-left px-4 py-2.5 text-sm font-body text-foreground-700 hover:bg-background-100 transition-colors border-b border-background-200/60 last:border-b-0"
              >
                {r.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-secondary-500 font-body">
        O tocá el mapa para marcar el punto exacto.
      </p>

      <div className="rounded-lg overflow-hidden border border-background-300" style={{ height: 280 }}>
        <MapContainer
          center={position ?? DEFAULT_CENTER}
          zoom={position ? 15 : 4}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={handleMapPick} />
          {position && <Marker position={position} />}
          {position && <RecenterOnChange position={position} />}
        </MapContainer>
      </div>
    </div>
  );
}
