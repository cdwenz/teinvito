// ============================================================
// CONFIGURACIÓN DEL EVENTO
// Modifica este archivo para reutilizar la plantilla en otros eventos
// ============================================================
import antoPhoto from "../assets/antogpt.png";
import photo1 from "../assets/photo1.png";
import photo2 from "../assets/photo2.png";
import photo3 from "../assets/photo3.png";
import photo4 from "../assets/photo4.png";
import photo5 from "../assets/photo5.png";
import photo6 from "../assets/photo6.png";

export const eventConfig = {
  // --- Datos de la cumpleañera ---
  birthday: {
    fullName: "Jimena Antonella Cortez",
    firstName: "Antonella",
    photoUrl: antoPhoto,
    welcomeMessage: "Mis 16 años",
    welcomePhrase: "Y como nadie llega a los 16 años sin llenar el camino de recuerdos, quiero compartir con vos este momento tan especial. ¡Te espero!",
  },

  // --- Fecha y hora del evento ---
  eventDate: "2026-07-11T21:00:00",
  displayDate: "11 de Julio, 2026",
  displayTime: "21:00 hs",

  // --- Lugar ---
  venue: {
    name: "Comando de brigada",
    address: "Hipólito Yrigoyen 695 Neuquén capital",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3102.9614142828846!2d-68.06282722421743!3d-38.94770987171329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x960a33c537ce8701%3A0xa6fb8204c06662ae!2sHip%C3%B3lito%20Yrigoyen%20695%2C%20Q8302%20Neuqu%C3%A9n!5e0!3m2!1ses!2sar!4v1781131986168!5m2!1ses!2sar",
    mapsDirectionUrl: "https://maps.app.goo.gl/TcBZp4SrGms9GoNE7",
  },

  // --- Código de vestimenta ---
  dressCode: "formal (no gamas en rosa)",

  // --- Información adicional ---
  additionalInfo: "Te pedimos puntualidad. ¡La fiesta comienza con vos!",

  // --- Regalos / Transferencia ---
  gift: {
    thankYouMessage: "Tu presencia es el mejor regalo. Si deseás hacernos un mimo económico, estos son nuestros datos:",
    alias: "Anto.czz",
    cbu: "0000003100000538524579",
    titular: "Jimena Antonella Cortez",
  },

  // --- Galería de fotos ---
  gallery: [
    {
      src: photo1,
      alt: "Recuerdos 1",
    },
    {
      src: photo2,
      alt: "Sesión en jardín",
    },
    {
      src: photo3,
      alt: "Detalles del vestido",
    },
    {
      src: photo4,
      alt: "Torta de 15",
    },
    {
      src: photo5,
      alt: "Mesa principal",
    },
    {
      src: photo6,
      alt: "Pista de baile",
    },
  ],

  // --- Cronograma ---
  timeline: [
    { time: "21:00", title: "Recepción", description: "Recibimiento con cocktail de bienvenida" },
    { time: "21:45", title: "Entrada de la cumpleañera", description: "El momento más esperado" },
    { time: "22:00", title: "Cena", description: "Menú especial de tres pasos" },
    { time: "23:30", title: "Apertura de pista", description: "¡Que empiece el baile!" },
    { time: "00:30", title: "Torta y brindis", description: "Momento de los deseos" },
    { time: "02:00", title: "Fin del evento", description: "Gracias por acompañarme" },
  ],

  // --- WhatsApp ---
  whatsapp: {
    number: "5492994228623",
    message: "¡Hola! Quería confirmar mi asistencia a tus 16",
  },

  // --- Pedidos de canciones ---
  songRequests: {
    title: "¿Qué canción no puede faltar?",
    subtitle: "Dejame tu tema favorito y lo sumo a la playlist de la fiesta. ¡La música la elegimos entre todos!",
    spotifyPlaylistUrl: "https://open.spotify.com/playlist/1F6BVu13z86tk0yRxgdnyC?si=NFknhHyJRTqrBjiXK-pPFw&pi=fVm2QDjgQr67x",
  },

  // --- Panel admin ---
  admin: {
    password: "Antonell@2026", // Cambia esta contraseña para proteger el panel de administración
  },

  // --- SEO ---
  seo: {
    title: "Jimena Antonella Cortez · Mis 16 Años · Invitación Digital",
    description: "Te invito a celebrar mis 16 años el 11 de Julio de 2026 en el Comando de brigada, Neuquén Capital. ¡Confirmá tu asistencia acá!",
    keywords: "16 años, invitación digital, Jimena Antonella Cortez, Neuquén, fiesta de 16",
  },

  // --- Colores del tema (usados en lugares específicos) ---
  theme: {
    primaryColor: "rose", // referencia interna
    accentColor: "gold",
  },
} as const;