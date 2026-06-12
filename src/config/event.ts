// ============================================================
// CONFIGURACIÓN DEL EVENTO
// Modifica este archivo para reutilizar la plantilla en otros eventos
// ============================================================
import antoPhoto from "../assets/antoCuadrado.jpeg";
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
      src: "https://readdy.ai/api/search-image?query=Elegant%20quincea%C3%B1era%20celebration%20venue%20with%20beautiful%20decorations%2C%20soft%20warm%20lighting%2C%20romantic%20atmosphere%2C%20flower%20arrangements%2C%20candlelit%20tables%2C%20pastel%20colors%2C%20luxurious%20event%20hall%2C%20professional%20photography&width=800&height=600&seq=gallery-1-v1&orientation=landscape",
      alt: "Salón decorado",
    },
    {
      src: "https://readdy.ai/api/search-image?query=Beautiful%20fifteen%20year%20old%20girl%20posing%20elegantly%20in%20garden%2C%20wearing%20pastel%20dress%2C%20natural%20sunlight%2C%20soft%20dreamy%20portrait%20photography%2C%20flower%20garden%20background%2C%20romantic%20atmosphere%2C%20editorial%20style&width=800&height=600&seq=gallery-2-v1&orientation=landscape",
      alt: "Sesión en jardín",
    },
    {
      src: "https://readdy.ai/api/search-image?query=Close%20up%20of%20elegant%20quincea%C3%B1era%20dress%20details%2C%20delicate%20embroidery%20and%20lace%2C%20soft%20pastel%20pink%20fabric%2C%20luxurious%20textile%20texture%2C%20warm%20golden%20light%2C%20romantic%20fashion%20photography%2C%20shallow%20depth%20of%20field&width=800&height=600&seq=gallery-3-v1&orientation=landscape",
      alt: "Detalles del vestido",
    },
    {
      src: "https://readdy.ai/api/search-image?query=Beautiful%20birthday%20cake%20for%20fifteen%20year%20old%20celebration%2C%20three%20tier%20elegant%20cake%20with%20floral%20decorations%2C%20pastel%20colors%2C%20gold%20accents%2C%20soft%20lighting%2C%20professional%20food%20photography%2C%20neutral%20background&width=800&height=600&seq=gallery-4-v1&orientation=landscape",
      alt: "Torta de 15",
    },
    {
      src: "https://readdy.ai/api/search-image?query=Elegant%20table%20setting%20for%20quincea%C3%B1era%20party%2C%20gold%20silverware%2C%20crystal%20glasses%2C%20flower%20centerpiece%2C%20soft%20candlelight%2C%20luxurious%20table%20decoration%2C%20warm%20romantic%20atmosphere%2C%20professional%20event%20photography&width=800&height=600&seq=gallery-5-v1&orientation=landscape",
      alt: "Mesa principal",
    },
    {
      src: "https://readdy.ai/api/search-image?query=Dance%20floor%20at%20elegant%20quincea%C3%B1era%20celebration%2C%20colorful%20party%20lights%2C%20guests%20dancing%2C%20joyful%20atmosphere%2C%20warm%20evening%20event%2C%20professional%20event%20photography%2C%20lively%20celebration%20mood&width=800&height=600&seq=gallery-6-v1&orientation=landscape",
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