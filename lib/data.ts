"use client"

// Tipos
export interface Carrera {
    id: number
    nombre: string
    facultad: string
    duracion: string
    modalidad: string
    descripcion: string
    imagen: string
    imagenes?: string[]
    linkInscripcion?: string | null
}

export interface Novedad {
    id: number
    titulo: string
    categoria: "Evento" | "Noticia" | "Convocatoria" | "Académico" | "Galería"
    fecha: string
    contenido: string
    imagen: string
    imagenes?: string[]
}

// Constantes para LocalStorage
const DB_KEYS = {
    CARRERAS: "universidad_carreras",
    NOVEDADES: "universidad_novedades",
}

// Datos iniciales
export const initialCarreras: Carrera[] = [
    {
        id: 1,
        nombre: "Ingeniería en Sistemas",
        facultad: "Facultad de Ingeniería",
        duracion: "5 años",
        modalidad: "Presencial",
        descripcion:
            "Forma profesionales capaces de diseñar, desarrollar e implementar sistemas de información y software de alta calidad. Contamos con laboratorios equipados con tecnología de última generación y convenios con empresas líderes del sector.",
        imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
        imagenes: [
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
        ]
    },
    {
        id: 2,
        nombre: "Medicina",
        facultad: "Facultad de Ciencias de la Salud",
        duracion: "6 años",
        modalidad: "Presencial",
        descripcion: "Prepara médicos con sólida formación científica y humanística para la atención integral de la salud. Realizamos prácticas en hospitales de primer nivel y contamos con simuladores de última generación.",
        imagen: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
        imagenes: [
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
        ]
    },
    {
        id: 3,
        nombre: "Derecho",
        facultad: "Facultad de Ciencias Jurídicas",
        duracion: "5 años",
        modalidad: "Presencial",
        descripcion: "Forma abogados con conocimientos sólidos del ordenamiento jurídico y capacidad de análisis crítico. Ofrecemos prácticas profesionales en estudios jurídicos y acceso a biblioteca jurídica completa.",
        imagen: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    },
    {
        id: 4,
        nombre: "Administración de Empresas",
        facultad: "Facultad de Ciencias Económicas",
        duracion: "4 años",
        modalidad: "Semipresencial",
        descripcion: "Desarrolla competencias para la gestión estratégica de organizaciones en entornos competitivos. Modalidad flexible que combina clases presenciales con contenido virtual.",
        imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        imagenes: [
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"
        ]
    },
    {
        id: 5,
        nombre: "Arquitectura",
        facultad: "Facultad de Arquitectura y Diseño",
        duracion: "5 años",
        modalidad: "Presencial",
        descripcion: "Forma arquitectos creativos y responsables con el medio ambiente y las necesidades sociales. Talleres de diseño con tecnología CAD/BIM y proyectos reales con la comunidad.",
        imagen: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
        imagenes: [
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
            "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
        ]
    },
    {
        id: 6,
        nombre: "Psicología",
        facultad: "Facultad de Humanidades",
        duracion: "5 años",
        modalidad: "Presencial",
        descripcion: "Prepara profesionales para comprender y mejorar el bienestar mental y emocional de las personas. Prácticas supervisadas en centros de salud y consultorios universitarios.",
        imagen: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    },
]

export const initialNovedades: Novedad[] = [
    {
        id: 1,
        titulo: "Inscripciones Abiertas 2026",
        categoria: "Convocatoria",
        fecha: "2026-01-15",
        contenido:
            "Ya están abiertas las inscripciones para el período académico 2026. Aprovecha los descuentos por pronto pago y asegura tu cupo en la carrera de tu preferencia.\n\nFechas importantes:\n- Inscripción anticipada: hasta el 28 de febrero\n- Inscripción regular: hasta el 15 de marzo\n- Inicio de clases: 1 de abril",
        imagen: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        imagenes: [
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
            "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
        ]
    },
    {
        id: 2,
        titulo: "Conferencia Internacional de Innovación",
        categoria: "Evento",
        fecha: "2026-02-20",
        contenido:
            "Participa en nuestra conferencia internacional con expertos de renombre mundial que compartirán las últimas tendencias en innovación y tecnología.\n\nEste año contaremos con la presencia de líderes de empresas tecnológicas y académicos destacados de universidades de todo el mundo.",
        imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        imagenes: [
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
            "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80"
        ]
    },
    {
        id: 3,
        titulo: "Nuevo Laboratorio de Inteligencia Artificial",
        categoria: "Noticia",
        fecha: "2026-01-10",
        contenido:
            "Inauguramos nuestro nuevo laboratorio de IA equipado con la tecnología más avanzada para la investigación y el aprendizaje de nuestros estudiantes.\n\nEl laboratorio cuenta con estaciones de trabajo de alto rendimiento, GPUs de última generación y software especializado para machine learning y deep learning.",
        imagen: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
        imagenes: [
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80"
        ]
    },
    {
        id: 4,
        titulo: "Becas de Excelencia Académica",
        categoria: "Convocatoria",
        fecha: "2026-01-05",
        contenido:
            "Postula a nuestras becas de excelencia académica que cubren hasta el 100% de tu matrícula. Requisito: promedio mínimo de 8.5.\n\nLas becas son renovables anualmente manteniendo el promedio requerido. ¡No pierdas esta oportunidad!",
        imagen: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
    },
    {
        id: 5,
        titulo: "Semana de la Ciencia 2026",
        categoria: "Evento",
        fecha: "2026-03-15",
        contenido:
            "Del 15 al 22 de marzo celebramos la Semana de la Ciencia con talleres, exposiciones y charlas para toda la comunidad universitaria.\n\nActividades destacadas:\n- Feria de proyectos estudiantiles\n- Charlas con investigadores\n- Talleres de robótica y programación\n- Exposición de ciencia interactiva",
        imagen: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
        imagenes: [
            "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
            "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=800&q=80"
        ]
    },
    {
        id: 6,
        titulo: "Acreditación Internacional Obtenida",
        categoria: "Noticia",
        fecha: "2025-12-20",
        contenido:
            "Nuestra universidad ha obtenido la acreditación internacional AACSB, reconocimiento que solo posee el 5% de las escuelas de negocios a nivel mundial.\n\nEste logro refleja el compromiso de nuestra institución con la excelencia académica y la mejora continua de nuestros programas educativos.",
        imagen: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80",
    },
]

// Helpers de DB
export function initDB() {
    if (typeof window === "undefined") return

    if (!localStorage.getItem(DB_KEYS.CARRERAS)) {
        localStorage.setItem(DB_KEYS.CARRERAS, JSON.stringify(initialCarreras))
    }
    if (!localStorage.getItem(DB_KEYS.NOVEDADES)) {
        localStorage.setItem(DB_KEYS.NOVEDADES, JSON.stringify(initialNovedades))
    }
}

export function getCarreras(): Carrera[] {
    if (typeof window === "undefined") return []
    initDB()
    return JSON.parse(localStorage.getItem(DB_KEYS.CARRERAS) || "[]")
}

export function saveCarreras(carreras: Carrera[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(DB_KEYS.CARRERAS, JSON.stringify(carreras))
}

export function getNovedades(): Novedad[] {
    if (typeof window === "undefined") return []
    initDB()
    return JSON.parse(localStorage.getItem(DB_KEYS.NOVEDADES) || "[]")
}

export function saveNovedades(novedades: Novedad[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(DB_KEYS.NOVEDADES, JSON.stringify(novedades))
}

export function helperFormatDate(dateString: string): string {
    if (!dateString) return ""
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
}
