export interface Event {
  id: string;
  userId: string;

  slug: string;
  title: string;

  eventType: string;

  celebratedPersonName: string;
  celebratedPersonShortName: string;

  welcomeMessage: string;
  welcomePhrase: string;

  dressCode?: string;
  additionalInfo?: string;

  eventDate: string;

  isPublished: boolean;

  createdAt: string;
  updatedAt: string;

  venue?: Venue | null;
  giftInfo?: GiftInfo | null;
  musicSection?: MusicSection | null;

  seo?: SeoConfig | null;
  theme?: Theme | null;

  gallery: GalleryImage[];
  timeline: TimelineItem[];
}

export interface Venue {
  name: string;
  address: string;

  mapsEmbedUrl?: string;
  mapsDirectionUrl?: string;
}

export interface GalleryImage {
  id: string;

  imageUrl: string;
  alt?: string;

  position: number;
}

export interface TimelineItem {
  id: string;

  time: string;
  title: string;

  description?: string;

  position: number;
}

export interface GiftInfo {
  thankYouMessage?: string;

  alias?: string;
  cbu?: string;
  holder?: string;
}

export interface MusicSection {
  title: string;
  subtitle: string;
  spotifyPlaylistUrl: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
}

export interface Theme {
  primaryColor: string;
  accentColor: string;
  fontFamily?: string;
}