// Base de datos usando localStorage
const DB_KEYS = {
  CARRERAS: "universidad_carreras",
  NOVEDADES: "universidad_novedades",
}

// Datos iniciales de ejemplo
const initialCarreras = [
  {
    id: 1,
    nombre: "Ingeniería en Sistemas",
    facultad: "Facultad de Ingeniería",
    duracion: "5 años",
    modalidad: "Presencial",
    descripcion:
      "Forma profesionales capaces de diseñar, desarrollar e implementar sistemas de información y software de alta calidad.",
    imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  },
  {
    id: 2,
    nombre: "Medicina",
    facultad: "Facultad de Ciencias de la Salud",
    duracion: "6 años",
    modalidad: "Presencial",
    descripcion: "Prepara médicos con sólida formación científica y humanística para la atención integral de la salud.",
    imagen: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
  },
  {
    id: 3,
    nombre: "Derecho",
    facultad: "Facultad de Ciencias Jurídicas",
    duracion: "5 años",
    modalidad: "Presencial",
    descripcion: "Forma abogados con conocimientos sólidos del ordenamiento jurídico y capacidad de análisis crítico.",
    imagen: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
  },
  {
    id: 4,
    nombre: "Administración de Empresas",
    facultad: "Facultad de Ciencias Económicas",
    duracion: "4 años",
    modalidad: "Semipresencial",
    descripcion: "Desarrolla competencias para la gestión estratégica de organizaciones en entornos competitivos.",
    imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    id: 5,
    nombre: "Arquitectura",
    facultad: "Facultad de Arquitectura y Diseño",
    duracion: "5 años",
    modalidad: "Presencial",
    descripcion: "Forma arquitectos creativos y responsables con el medio ambiente y las necesidades sociales.",
    imagen: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
  },
  {
    id: 6,
    nombre: "Psicología",
    facultad: "Facultad de Humanidades",
    duracion: "5 años",
    modalidad: "Presencial",
    descripcion: "Prepara profesionales para comprender y mejorar el bienestar mental y emocional de las personas.",
    imagen: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
  },
]

const initialNovedades = [
  {
    id: 1,
    titulo: "Inscripciones Abiertas 2025",
    categoria: "Convocatoria",
    fecha: "2024-12-01",
    contenido:
      "Ya están abiertas las inscripciones para el período académico 2025. Aprovecha los descuentos por pronto pago y asegura tu cupo en la carrera de tu preferencia.",
    imagen: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  },
  {
    id: 2,
    titulo: "Conferencia Internacional de Innovación",
    categoria: "Evento",
    fecha: "2024-11-15",
    contenido:
      "Participa en nuestra conferencia internacional con expertos de renombre mundial que compartirán las últimas tendencias en innovación y tecnología.",
    imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    id: 3,
    titulo: "Nuevo Laboratorio de Inteligencia Artificial",
    categoria: "Noticia",
    fecha: "2024-11-10",
    contenido:
      "Inauguramos nuestro nuevo laboratorio de IA equipado con la tecnología más avanzada para la investigación y el aprendizaje de nuestros estudiantes.",
    imagen: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  },
  {
    id: 4,
    titulo: "Becas de Excelencia Académica",
    categoria: "Convocatoria",
    fecha: "2024-11-05",
    contenido:
      "Postula a nuestras becas de excelencia académica que cubren hasta el 100% de tu matrícula. Requisito: promedio mínimo de 8.5.",
    imagen: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
  },
  {
    id: 5,
    titulo: "Semana de la Ciencia 2024",
    categoria: "Evento",
    fecha: "2024-10-28",
    contenido:
      "Del 15 al 22 de noviembre celebramos la Semana de la Ciencia con talleres, exposiciones y charlas para toda la comunidad universitaria.",
    imagen: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
  },
  {
    id: 6,
    titulo: "Acreditación Internacional Obtenida",
    categoria: "Noticia",
    fecha: "2024-10-20",
    contenido:
      "Nuestra universidad ha obtenido la acreditación internacional AACSB, reconocimiento que solo posee el 5% de las escuelas de negocios a nivel mundial.",
    imagen: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80",
  },
]

// Funciones de base de datos
function initDB() {
  if (!localStorage.getItem(DB_KEYS.CARRERAS)) {
    localStorage.setItem(DB_KEYS.CARRERAS, JSON.stringify(initialCarreras))
  }
  if (!localStorage.getItem(DB_KEYS.NOVEDADES)) {
    localStorage.setItem(DB_KEYS.NOVEDADES, JSON.stringify(initialNovedades))
  }
}

function getCarreras() {
  initDB()
  return JSON.parse(localStorage.getItem(DB_KEYS.CARRERAS) || "[]")
}

function saveCarreras(carreras) {
  localStorage.setItem(DB_KEYS.CARRERAS, JSON.stringify(carreras))
}

function getNovedades() {
  initDB()
  return JSON.parse(localStorage.getItem(DB_KEYS.NOVEDADES) || "[]")
}

function saveNovedades(novedades) {
  localStorage.setItem(DB_KEYS.NOVEDADES, JSON.stringify(novedades))
}

function generateId(items) {
  if (items.length === 0) return 1
  return Math.max(...items.map((item) => item.id)) + 1
}

// Formatear fecha
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("es-ES", options)
}
