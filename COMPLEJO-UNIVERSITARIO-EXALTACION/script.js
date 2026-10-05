
// Mock Data (from lib/data.ts)
const carreras = [
    {
        id: 7,
        nombre: "Diplomatura en Desarrollo de Software (UTN)",
        facultad: "UTN",
        duracion: "2 cuatrimestres",
        modalidad: "Híbrida",
        descripcion: "El/la egresado/a de la Diplomatura en Desarrollo de Software estará capacitado/a para desarrollar, mantener y optimizar aplicaciones y sistemas informáticos, aplicando estructuras de datos, algoritmos y principios de programación orientada a objetos. Contará con conocimientos en lenguajes de programación, arquitectura de computadoras, sistemas operativos y bases de datos, pudiendo diseñar y gestionar información de manera segura y eficiente. Se destacará por el uso de buenas prácticas de programación, el trabajo colaborativo en equipos de desarrollo, la resolución de problemas y la adaptación a nuevas tecnologías.\n\nInicio de cursada: mayo\nHorario: miércoles de 18:30 a 21:30 y sábados de 9 a 15hs\nInscripción: 15/04 al 29/04",
        imagen: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        imagenes: [
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
        ],
        tipo: "Curso"
    },
    {
        id: 1,
        nombre: "Ingeniería en Sistemas",
        facultad: "Facultad de Ingeniería",
        duracion: "5 años",
        modalidad: "Presencial",
        descripcion: "Forma profesionales capaces de diseñar, desarrollar e implementar sistemas de información y software de alta calidad. Contamos con laboratorios equipados con tecnología de última generación y convenios con empresas líderes del sector.",
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
];

const novedades = [
    {
        id: 7,
        titulo: "CARRERAS 2026 | ÚLTIMOS DÍAS DE INSCRIPCIONES",
        categoria: "Convocatoria",
        fecha: "2026-02-09",
        contenido: "Son los últimos días para la inscripción a las carreras que se dictarán en el Complejo Universitario Municipal y el ISFT N° 184.\n\n🏫 Tecnicatura Universitaria en Administración y Gestión - C. Universitario\n\n- Requisitos: Fotocopia de DNI, Fotocopia del título secundario o constancia de título en trámite, 2 fotos 4x4, Formulario de preinscripción online impreso.\n- Entrega de documentación: Hasta el 13 de febrero.\n- Casa de la Cultura: de 9 a 14 hs.\n- Complejo Universitario: de 17 a 20 hs.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
        color: "#fbbf24",
        destacada: true,
        imagenes: [
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80"
        ]
    },
    {
        id: 1,
        titulo: "Inscripciones Abiertas 2026",
        categoria: "Convocatoria",
        fecha: "2026-01-15",
        contenido: "Ya están abiertas las inscripciones para el período académico 2026. Aprovecha los descuentos por pronto pago y asegura tu cupo en la carrera de tu preferencia.\n\nFechas importantes:\n- Inscripción anticipada: hasta el 28 de febrero\n- Inscripción regular: hasta el 15 de marzo\n- Inicio de clases: 1 de abril",
        imagen: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        color: "#fbbf24", // amber
        destacada: true,
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
        contenido: "Participa en nuestra conferencia internacional con expertos de renombre mundial que compartirán las últimas tendencias en innovación y tecnología.\n\nEste año contaremos con la presencia de líderes de empresas tecnológicas y académicos destacados de universidades de todo el mundo.",
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
        contenido: "Inauguramos nuestro nuevo laboratorio de IA equipado con la tecnología más avanzada para la investigación y el aprendizaje de nuestros estudiantes.\n\nEl laboratorio cuenta con estaciones de trabajo de alto rendimiento, GPUs de última generación y software especializado para machine learning y deep learning.",
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
        contenido: "Postula a nuestras becas de excelencia académica que cubren hasta el 100% de tu matrícula. Requisito: promedio mínimo de 8.5.\n\nLas becas son renovables anualmente manteniendo el promedio requerido. ¡No pierdas esta oportunidad!",
        imagen: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
    },
    {
        id: 5,
        titulo: "Semana de la Ciencia 2026",
        categoria: "Evento",
        fecha: "2026-03-15",
        contenido: "Del 15 al 22 de marzo celebramos la Semana de la Ciencia con talleres, exposiciones y charlas para toda la comunidad universitaria.\n\nActividades destacadas:\n- Feria de proyectos estudiantiles\n- Charlas con investigadores\n- Talleres de robótica y programación\n- Exposición de ciencia interactiva",
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
        contenido: "Nuestra universidad ha obtenido la acreditación internacional AACSB, reconocimiento que solo posee el 5% de las escuelas de negocios a nivel mundial.\n\nEste logro refleja el compromiso de nuestra institución con la excelencia académica y la mejora continua de nuestros programas educativos.",
        imagen: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80",
    }
];

// Helper Functions
const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
};

const getCategoryStyle = (categoria) => {
    const styles = {
        Evento: "bg-purple-100 text-purple-700 border-purple-200",
        Noticia: "bg-blue-100 text-blue-700 border-blue-200",
        Convocatoria: "bg-amber-100 text-amber-700 border-amber-200",
        Académico: "bg-emerald-100 text-emerald-700 border-emerald-200",
    }
    return styles[categoria] || "bg-gray-100 text-gray-700 border-gray-200"
};

const getCategoryIcon = (cat) => {
    if (cat === "Evento") return 'calendar';
    if (cat === "Noticia") return 'newspaper';
    if (cat === "Convocatoria") return 'filter';
    return 'star'; // fallback
};

// Initial State
let carreraFilter = 'Todas';
let novedadFilter = 'Todas';

// DOM Elements
const carreraGrid = document.getElementById('carreras-grid');
const carreraEmpty = document.getElementById('carreras-empty');
const novedadGrid = document.getElementById('novedades-grid');
const novedadEmpty = document.getElementById('novedades-empty');

// Render Functions
function renderCarreras() {
    carreraGrid.innerHTML = '';
    const filtered = carreras.filter(c => carreraFilter === 'Todas' || (c.tipo || 'Carrera') === carreraFilter); // Mocking tipo logic if missing

    // Force mock tipo for filtering demo if data.js doesn't have it explicitly
    // Since data.ts didn't explicitly have 'tipo' for these, we'll assume they are all 'Carrera' or use logic.
    // Let's patch filter logic: "Carrera" is default if undefined.

    if (filtered.length === 0) {
        carreraEmpty.classList.remove('hidden');
    } else {
        carreraEmpty.classList.add('hidden');
        filtered.forEach(c => {
            const isVid = c.imagen && (c.imagen.endsWith('.mp4') || c.imagen.endsWith('.webm') || c.imagen.includes('youtube.com') || c.imagen.includes('youtu.be'));
            const imageHtml = isVid
                ? `<div class="w-full h-full flex items-center justify-center bg-gray-900 group-hover:scale-105 transition-transform duration-700"><img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80" class="absolute inset-0 w-full h-full object-cover opacity-30" /><i data-lucide="play-circle" class="w-12 h-12 text-white relative z-10"></i></div>`
                : `<img src="${c.imagen}" alt="${c.nombre}" class="w-full h-full object-cover transition-all duration-700">`;

            const el = document.createElement('div');
            el.className = "group bg-white rounded-[2rem] overflow-hidden shadow-md transition-all duration-300 flex flex-col h-full border border-gray-100 cursor-pointer hover:-translate-y-1 hover:shadow-lg";
            el.onclick = () => openModal(c, 'carrera');
            el.innerHTML = `
                <div class="h-48 relative overflow-hidden bg-gray-100">
                    ${imageHtml}
                    <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute top-4 left-4">
                        <span class="px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest shadow-sm bg-blue-600 text-white">
                            ${c.tipo || 'Carrera'}
                        </span>
                    </div>
                    <div class="absolute bottom-4 left-4">
                        <span class="px-4 py-1.5 rounded-lg bg-blue-600/90 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                            ${c.modalidad}
                        </span>
                    </div>
                </div>
                <div class="p-10 flex flex-col flex-grow">
                    <h3 class="text-xl md:text-2xl font-black mb-4 leading-tight uppercase tracking-tight transition-colors group-hover:text-[#004d91]">${c.nombre}</h3>
                    <p class="text-gray-400 text-sm line-clamp-3 mb-8 flex-grow font-medium leading-relaxed">${c.descripcion}</p>
                    <div class="pt-6 border-t border-gray-50 flex items-center justify-between text-[#004d91] font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                        Más información <i data-lucide="chevron-right" class="w-5 h-5"></i>
                    </div>
                </div>
            `;
            carreraGrid.appendChild(el);
        });
    }
    lucide.createIcons();
}

function renderNovedades() {
    novedadGrid.innerHTML = '';
    const filtered = novedades.filter(n => novedadFilter === 'Todas' || n.categoria === novedadFilter);

    if (filtered.length === 0) {
        novedadEmpty.classList.remove('hidden');
    } else {
        novedadEmpty.classList.add('hidden');
        filtered.forEach(n => {
            const article = document.createElement('article');
            article.className = `group relative flex flex-col h-full cursor-pointer transition-transform duration-300 ${n.destacada ? 'scale-[1.02]' : 'hover:-translate-y-1'}`;
            article.onclick = () => openModal(n, 'novedad');

            const shadowStyle = n.destacada && n.color ? `box-shadow: 0 10px 40px -10px ${n.color}50` : '';
            const borderClass = n.destacada ? 'border-0' : 'border border-gray-50';

            let shimmerHtml = '';
            if (n.destacada && n.color) {
                shimmerHtml = `
                    <div class="h-1.5 w-full relative overflow-hidden" style="background-color: ${n.color}">
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]"></div>
                    </div>
                `;
            }

            let destacadoBadge = '';
            if (n.destacada) {
                destacadoBadge = `
                     <div class="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md border border-white/20"
                          style="background-color: ${n.color || '#fbbf24'}">
                          <i data-lucide="star" class="w-3 h-3 fill-white"></i> DESTACADO
                     </div>
                `;
            }

            const iconName = getCategoryIcon(n.categoria);

            const isVid = n.imagen && (n.imagen.endsWith('.mp4') || n.imagen.endsWith('.webm') || n.imagen.includes('youtube.com') || n.imagen.includes('youtu.be'));
            const imageHtml = isVid
                ? `<div class="w-full h-full flex items-center justify-center bg-gray-900 group-hover:scale-105 transition-transform duration-700"><img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80" class="absolute inset-0 w-full h-full object-cover opacity-30" /><i data-lucide="play-circle" class="w-12 h-12 text-white relative z-10"></i></div>`
                : `<img src="${n.imagen}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="${n.titulo}" />`;

            article.innerHTML = `
                <div class="relative flex flex-col h-full bg-white rounded-[2rem] overflow-hidden shadow-sm ${borderClass}" style="${shadowStyle}">
                    ${shimmerHtml}
                    <div class="h-60 relative overflow-hidden">
                        ${imageHtml}
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        ${destacadoBadge}
                    </div>
                    <div class="p-8 flex flex-col flex-grow">
                        <div class="flex items-center gap-2 mb-3">
                            <i data-lucide="${iconName}" class="w-5 h-5 text-[#004d91]"></i>
                            <span class="text-[10px] font-black text-[#004d91] uppercase tracking-[0.2em]">${n.categoria}</span>
                        </div>
                        <span class="text-[10px] font-black text-[#004d91] uppercase tracking-[0.2em] mb-4 block">${formatDate(n.fecha)}</span>
                        <h3 class="text-xl md:text-2xl font-black leading-tight mb-4 group-hover:text-[#004d91] line-clamp-2 uppercase tracking-tight transition-colors">${n.titulo}</h3>
                        <p class="text-gray-400 text-sm line-clamp-3 mb-8 flex-grow font-medium text-pretty">${n.contenido}</p>
                        <div class="text-[10px] font-black text-[#004d91] uppercase tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                             LEER MÁS <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </div>
                    </div>
                </div>
            `;
            novedadGrid.appendChild(article);
        });
    }
    lucide.createIcons();
}

// Modal Logic
const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.getElementById('modal-close-btn');

let currentModalImageIndex = 0;
let modalMediaCount = 0;

function scrollModalSlider(dir, e) {
    if (e) e.stopPropagation();
    const container = document.getElementById('modal-slider-container');
    if (!container) return;
    
    currentModalImageIndex += dir;
    if (currentModalImageIndex < 0) currentModalImageIndex = modalMediaCount - 1;
    if (currentModalImageIndex >= modalMediaCount) currentModalImageIndex = 0;
    
    container.scrollTo({ left: container.clientWidth * currentModalImageIndex, behavior: 'smooth' });
    updateModalDots();
}

function updateModalDots() {
    for (let i = 0; i < modalMediaCount; i++) {
        const dot = document.getElementById(`modal-dot-${i}`);
        if (dot) {
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${i === currentModalImageIndex ? 'bg-white w-4' : 'bg-white/50'}`;
        }
    }
}

window.handleModalScroll = () => {
    const container = document.getElementById('modal-slider-container');
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;
    const newIndex = Math.round(scrollLeft / clientWidth);
    if (newIndex !== currentModalImageIndex) {
        currentModalImageIndex = newIndex;
        updateModalDots();
    }
};

function generateModalHeaderHtml(item) {
    const medias = item.imagenes && item.imagenes.length > 0 ? item.imagenes : [item.imagen];
    modalMediaCount = medias.length;
    currentModalImageIndex = 0;
    
    let sliderHtml = `<div id="modal-slider-container" class="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth relative no-scrollbar" onscroll="handleModalScroll()">`;
    
    medias.forEach((mediaUrl, idx) => {
        const isVid = mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm'));
        const isYt = mediaUrl && (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be'));
        
        sliderHtml += `<div class="min-w-full h-full snap-center flex items-center justify-center relative bg-gray-900">`;
        
        if (isYt) {
            let videoId = '';
            if (mediaUrl.includes('youtu.be')) {
                videoId = mediaUrl.split('/').pop().split('?')[0];
            } else if (mediaUrl.includes('youtube.com')) {
                videoId = new URL(mediaUrl).searchParams.get('v');
            }
            sliderHtml += `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full max-w-5xl border-0"></iframe>`;
        } else if (isVid) {
            sliderHtml += `<video controls src="${mediaUrl}" class="w-full h-full object-contain"></video>`;
        } else {
            sliderHtml += `<img src="${mediaUrl}" class="w-full h-full object-contain cursor-zoom-in" onclick="openLightbox(${idx})" alt="Media" />`;
        }
        sliderHtml += `</div>`;
    });
    sliderHtml += `</div>`;
    
    if (medias.length > 1) {
        sliderHtml += `
            <button onclick="scrollModalSlider(-1, event)" class="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white hover:bg-black/70 rounded-full transition-all z-20 backdrop-blur-sm group/btn"><i data-lucide="chevron-left" class="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform"></i></button>
            <button onclick="scrollModalSlider(1, event)" class="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white hover:bg-black/70 rounded-full transition-all z-20 backdrop-blur-sm group/btn"><i data-lucide="chevron-right" class="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform"></i></button>
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                ${medias.map((_, i) => `<div class="w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-white w-4' : 'bg-white/50'}" id="modal-dot-${i}"></div>`).join('')}
            </div>
        `;
    }

    return `
        <div class="h-[300px] md:h-[450px] w-full overflow-hidden bg-gray-900 flex items-center justify-center relative group">
            ${sliderHtml}
        </div>
    `;
}

function openModal(item, type) {
    let contentHtml = '';
    currentModalItem = item;
    currentImageIndex = 0;

    const headerHtml = generateModalHeaderHtml(item);

    if (type === 'carrera') {
        contentHtml = `
            <div class="flex flex-col">
                ${headerHtml}
                <div class="p-8 md:p-10">
                    <div class="flex items-center gap-3 mb-6">
                        <span class="px-4 py-1.5 rounded-lg bg-blue-50 text-[#004d91] text-[9px] font-black uppercase tracking-widest">${item.modalidad}</span>
                    </div>
                    <h2 class="text-2xl md:text-3xl font-black mb-8 leading-tight uppercase tracking-tight">${item.nombre}</h2>
                    <div class="grid grid-cols-2 gap-4 mb-8">
                        <div class="bg-gray-50 p-6 rounded-xl"><p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Duración</p><p class="font-black text-base text-[#004d91]">${item.duracion}</p></div>
                        <div class="bg-gray-50 p-6 rounded-xl"><p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Inscripciones</p><p class="font-black text-base text-green-600">Abiertas 2026</p></div>
                    </div>
                    <div class="prose prose-sm max-w-none text-gray-500 font-medium mb-10 whitespace-pre-wrap">${item.descripcion}</div>
                    <a href="/admin" class="block w-full py-4 rounded-xl bg-[#004d91] text-white text-center font-black uppercase text-xs tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-[0.98]">Pre-inscripción Online</a>
                </div>
            </div>
        `;
    } else if (type === 'novedad') {
        const catStyle = getCategoryStyle(item.categoria);
        contentHtml = `
            <div class="flex flex-col">
                ${headerHtml}
                <div class="p-8 md:p-10">
                    <div class="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                        <span class="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${catStyle}">${item.categoria}</span>
                        <p class="text-gray-300 text-[9px] font-black uppercase tracking-widest">${formatDate(item.fecha)}</p>
                    </div>
                    <h2 class="text-xl md:text-2xl font-black mb-8 uppercase leading-tight tracking-tight">${item.titulo}</h2>
                    <div class="prose prose-sm max-w-none text-gray-500 font-medium mb-8 whitespace-pre-wrap">${item.contenido}</div>
                    
                    <button onclick="closeModal()" class="px-8 py-3 rounded-lg border border-gray-200 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all text-gray-400">Regresar</button>
                </div>
            </div>
        `;
    }

    modalContent.innerHTML = contentHtml;
    modalContainer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeModal() {
    modalContainer.classList.add('hidden');
    document.body.style.overflow = '';
    
    const modalContentEl = document.getElementById('modal-content');
    modalContentEl.querySelectorAll('video').forEach(v => v.pause());
    modalContentEl.querySelectorAll('iframe').forEach(f => {
        const src = f.src;
        f.src = '';
        f.src = src;
    });
}

modalCloseBtn.onclick = closeModal;
document.getElementById('modal-backdrop').onclick = closeModal;


// Lightbox Logic
const lightboxContainer = document.getElementById('lightbox-container');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCounter = document.getElementById('lightbox-counter');
let currentModalItem = null;
let currentImageIndex = 0;

function openLightbox(idx = 0) {
    if (!currentModalItem) return;
    currentImageIndex = idx;
    updateLightboxImage();
    lightboxContainer.classList.remove('hidden');
}

function updateLightboxImage() {
    const images = currentModalItem.imagenes || [currentModalItem.imagen];
    const mediaUrl = images[currentImageIndex];

    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxVid = document.getElementById('lightbox-video');
    const lightboxIframe = document.getElementById('lightbox-iframe');

    lightboxImg.classList.add('hidden');
    lightboxVid.classList.add('hidden');
    lightboxIframe.classList.add('hidden');
    lightboxVid.pause();
    lightboxIframe.src = '';

    if (!mediaUrl) return;

    const isYoutube = mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be');
    const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm');

    if (isYoutube) {
        let videoId = '';
        if (mediaUrl.includes('youtu.be')) {
            videoId = mediaUrl.split('/').pop().split('?')[0];
        } else if (mediaUrl.includes('youtube.com')) {
            videoId = new URL(mediaUrl).searchParams.get('v');
        }
        lightboxIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        lightboxIframe.classList.remove('hidden');
    } else if (isVideo) {
        lightboxVid.src = mediaUrl;
        lightboxVid.classList.remove('hidden');
        lightboxVid.play().catch(e => console.log("Autoplay prevented", e));
    } else {
        lightboxImg.src = mediaUrl;
        lightboxImg.classList.remove('hidden');
    }

    // Counter
    if (images.length > 1) {
        lightboxCounter.innerText = `${currentImageIndex + 1} / ${images.length}`;
        document.getElementById('lightbox-prev-btn').classList.remove('hidden');
        document.getElementById('lightbox-next-btn').classList.remove('hidden');
    } else {
        lightboxCounter.innerText = '';
        document.getElementById('lightbox-prev-btn').classList.add('hidden');
        document.getElementById('lightbox-next-btn').classList.add('hidden');
    }
}

document.getElementById('lightbox-close-btn').onclick = () => {
    lightboxContainer.classList.add('hidden');
    document.getElementById('lightbox-video').pause();
    document.getElementById('lightbox-iframe').src = '';
};

document.getElementById('lightbox-prev-btn').onclick = (e) => {
    e.stopPropagation();
    const images = currentModalItem.imagenes || [];
    if (images.length <= 1) return;
    currentImageIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    updateLightboxImage();
};

document.getElementById('lightbox-next-btn').onclick = (e) => {
    e.stopPropagation();
    const images = currentModalItem.imagenes || [];
    if (images.length <= 1) return;
    currentImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    updateLightboxImage();
};


// Filters Logic
document.querySelectorAll('.filter-btn-carrera').forEach(btn => {
    btn.onclick = () => {
        carreraFilter = btn.dataset.filter;
        renderCarreras();

        // Update styles
        document.querySelectorAll('.filter-btn-carrera').forEach(b => {
            if (b.dataset.filter === carreraFilter) {
                b.className = "filter-btn-carrera px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-[#004d91] text-white shadow-lg scale-105";
            } else {
                b.className = "filter-btn-carrera px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-white text-gray-400 hover:bg-gray-100 border border-gray-100";
            }
        });
    }
});

document.querySelectorAll('.filter-btn-novedad').forEach(btn => {
    btn.onclick = () => {
        novedadFilter = btn.dataset.filter;
        renderNovedades();

        // Update styles
        document.querySelectorAll('.filter-btn-novedad').forEach(b => {
            const isActive = b.dataset.filter === novedadFilter;
            if (isActive) {
                // Active styles
                b.classList.remove('bg-gray-50', 'text-gray-400', 'hover:bg-gray-100', 'hover:text-gray-600', 'hover:shadow-sm');
                b.classList.add('bg-[#004d91]', 'text-white', 'shadow-lg', 'shadow-blue-900/20', 'scale-105');
                const icon = b.querySelector('i'); // Lucide icon replacement replaces <i> with <svg>, handling that:
                if (icon) {
                    // If still <i> (before load) or SVG
                    // Simpler to rely on re-rendering icons or CSS changes
                }
            } else {
                b.classList.remove('bg-[#004d91]', 'text-white', 'shadow-lg', 'shadow-blue-900/20', 'scale-105');
                b.classList.add('bg-gray-50', 'text-gray-400', 'hover:bg-gray-100', 'hover:text-gray-600', 'hover:shadow-sm');
            }
        });

        // Re-render icons to fix colors if needed (simplified approach here is mostly CSS, but Lucide replaces elements, so CSS classes on parent are safer)
    }
});


// Initialization
window.addEventListener('DOMContentLoaded', () => {
    renderCarreras();
    renderNovedades();

    // Inscripciones Badge Check (Simulated)
    document.getElementById('hero-inscription-badge').classList.remove('hidden');
    document.getElementById('hero-inscription-badge').classList.add('inline-flex');

    lucide.createIcons();
    reveal();
});

// Scroll Effects
const navbar = document.getElementById('navbar');
const navLogoMun = document.getElementById('nav-logo-mun');
const navLogoPuentes = document.getElementById('nav-logo-puentes');
const navDivider = document.getElementById('nav-divider');
const navTitle = document.getElementById('nav-text-title');
const navSubtitle = document.getElementById('nav-text-subtitle');
const navLinks = document.querySelectorAll('.nav-link');
const btnInscribirse = document.getElementById('btn-inscribirse');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');


window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 20;

    if (scrolled) {
        navbar.classList.add('nav-glass', 'py-3');
        navbar.classList.remove('bg-transparent', 'py-6');

        // Logos color fix (The original used brightness-0 invert for white, removed for color)
        navLogoMun.classList.remove('brightness-0', 'invert');
        navLogoPuentes.classList.remove('brightness-0', 'invert');

        navDivider.classList.replace('bg-white/30', 'bg-gray-200');

        navTitle.classList.replace('text-white', 'text-[#004d91]');
        navSubtitle.classList.replace('text-white/60', 'text-gray-400');

        navLinks.forEach(link => {
            link.classList.remove('text-white/80', 'hover:text-white');
            link.classList.add('text-gray-600', 'hover:text-[#004d91]');
        });

        btnInscribirse.classList.remove('bg-white', 'text-[#004d91]');
        btnInscribirse.classList.add('bg-gradient-to-r', 'from-[#004d91]', 'to-blue-600', 'text-white');

        mobileMenuBtn.classList.remove('bg-white/10', 'text-white');
        mobileMenuBtn.classList.add('bg-blue-50', 'text-[#004d91]');

    } else {
        navbar.classList.remove('nav-glass', 'py-3');
        navbar.classList.add('bg-transparent', 'py-6');

        navLogoMun.classList.add('brightness-0', 'invert');
        navLogoPuentes.classList.add('brightness-0', 'invert');

        navDivider.classList.replace('bg-gray-200', 'bg-white/30');

        navTitle.classList.replace('text-[#004d91]', 'text-white');
        navSubtitle.classList.replace('text-gray-400', 'text-white/60');

        navLinks.forEach(link => {
            link.classList.add('text-white/80', 'hover:text-white');
            link.classList.remove('text-gray-600', 'hover:text-[#004d91]');
        });

        btnInscribirse.classList.add('bg-white', 'text-[#004d91]');
        btnInscribirse.classList.remove('bg-gradient-to-r', 'from-[#004d91]', 'to-blue-600', 'text-white');

        mobileMenuBtn.classList.add('bg-white/10', 'text-white');
        mobileMenuBtn.classList.remove('bg-blue-50', 'text-[#004d91]');
    }

    reveal();
});

function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) el.classList.add("active");
    });
}

// Mobile Menu
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuContent = document.getElementById('mobile-menu-content');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobileMenu() {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenu.classList.add('opacity-100');
    setTimeout(() => {
        mobileMenuContent.classList.remove('-translate-y-full');
        mobileMenuContent.classList.add('translate-y-0');
    }, 10);
}

function closeMobileMenu() {
    mobileMenuContent.classList.remove('translate-y-0');
    mobileMenuContent.classList.add('-translate-y-full');
    setTimeout(() => {
        mobileMenu.classList.remove('opacity-100');
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    }, 300);
}

mobileMenuBtn.onclick = openMobileMenu;
closeMenuBtn.onclick = closeMobileMenu;
document.getElementById('mobile-menu-backdrop').onclick = closeMobileMenu;
mobileLinks.forEach(link => link.onclick = closeMobileMenu);
