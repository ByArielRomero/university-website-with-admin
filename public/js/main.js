// Importaciones necesarias
import { initDB } from "./db.js"
import { getCarreras } from "./carreras.js"
import { getNovedades } from "./novedades.js"
import { formatDate } from "./utils.js"

// Inicializar la página principal
document.addEventListener("DOMContentLoaded", () => {
  initDB()
  loadCarreras()
  loadNovedades()
  initMobileMenu()
  initContactForm()
})

// Menú móvil
function initMobileMenu() {
  const menuBtn = document.getElementById("menuBtn")
  const mobileMenu = document.getElementById("mobileMenu")

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })

    // Cerrar menú al hacer click en un enlace
    const links = mobileMenu.querySelectorAll("a")
    links.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden")
      })
    })
  }
}

// Cargar carreras en la página principal
function loadCarreras() {
  const container = document.getElementById("carrerasContainer")
  if (!container) return

  const carreras = getCarreras()

  container.innerHTML = carreras
    .map(
      (carrera) => `
      <div class="glass rounded-3xl overflow-hidden card-hover group">
        <div class="h-52 overflow-hidden relative">
          <img 
            src="${carrera.imagen || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"}" 
            alt="${carrera.nombre}"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
          <span class="absolute bottom-4 left-4 text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-secondary to-accent">
            ${carrera.modalidad}
          </span>
        </div>
        <div class="p-6">
          <span class="text-xs font-medium text-accent">${carrera.facultad}</span>
          <h3 class="font-display text-xl font-bold mt-2 mb-3">${carrera.nombre}</h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2">${carrera.descripcion}</p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-secondary font-medium">${carrera.duracion}</span>
            <button class="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              Más info
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `,
    )
    .join("")
}

// Cargar novedades en la página principal
function loadNovedades() {
  const container = document.getElementById("novedadesContainer")
  if (!container) return

  const novedades = getNovedades()

  container.innerHTML = novedades
    .map(
      (novedad) => `
      <article class="glass rounded-3xl overflow-hidden card-hover group">
        <div class="h-52 overflow-hidden relative">
          <img 
            src="${novedad.imagen || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"}" 
            alt="${novedad.titulo}"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs font-medium px-3 py-1.5 rounded-full ${getCategoryStyle(novedad.categoria)}">
              ${novedad.categoria}
            </span>
            <span class="text-xs text-gray-500">${formatDate(novedad.fecha)}</span>
          </div>
          <h3 class="font-display text-xl font-bold mb-3">${novedad.titulo}</h3>
          <p class="text-gray-400 text-sm line-clamp-3">${novedad.contenido}</p>
        </div>
      </article>
    `,
    )
    .join("")
}

// Obtener estilo según categoría
function getCategoryStyle(categoria) {
  const styles = {
    Evento: "bg-blue-500/20 text-blue-400",
    Noticia: "bg-green-500/20 text-green-400",
    Convocatoria: "bg-amber-500/20 text-amber-400",
    Académico: "bg-purple-500/20 text-purple-400",
  }
  return styles[categoria] || "bg-gray-500/20 text-gray-400"
}

// Formulario de contacto
function initContactForm() {
  const form = document.getElementById("contactForm")
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("¡Gracias por tu mensaje! Te contactaremos pronto.")
      form.reset()
    })
  }
}
