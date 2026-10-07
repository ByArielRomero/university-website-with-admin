"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  helperFormatDate,
  type Carrera,
  type Novedad,
} from "../lib/data"
import {
  BookOpen, Calendar, ChevronRight, Mail, MapPin, Phone,
  GraduationCap, Clock, Award, Sparkles, TrendingUp,
  MessageCircle, ArrowRight, Filter, Newspaper, PartyPopper,
  FileText, BookMarked, X, ChevronLeft, ChevronDown, Image as ImageIcon, Star, Play, Maximize2, Layers
} from "lucide-react"
import { defaultHistoriaTexto } from "./defaultHistoria"

interface CarreraExtended extends Carrera {
  activa?: boolean
  inscripcionAbierta?: boolean
  tipo?: string
  video?: string
  videos?: string[]
  linkInscripcion?: string | null
}

interface NovedadExtended extends Novedad {
  destacada?: boolean
  video?: string
  videos?: string[]
  color?: string
}

const renderMedia = (url: string | undefined, onClick?: () => void) => {
  if (!url) return null;
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');

  if (isYoutube) {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('/').pop()?.split('?')[0] || '';
    } else if (url.includes('youtube.com')) {
      videoId = new URL(url).searchParams.get('v') || '';
    }
    return <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=0`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full border-0"></iframe>;
  }
  
  if (isVideo) {
    return <video controls src={url} className="w-full h-full object-contain"></video>;
  }

  return <img src={url} className="w-full h-full object-contain cursor-zoom-in" alt="Media" onClick={onClick} />;
};

interface HistoriaConfig {
  titulo: string
  texto: string
  imagen: string
  galeria: string[]
}

export default function Home() {
  const [carreras, setCarreras] = useState<CarreraExtended[]>([])
  const [novedades, setNovedades] = useState<NovedadExtended[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("Todas")
  const [carreraFiltro, setCarreraFiltro] = useState<string>("Todas")
  const [historiaExpanded, setHistoriaExpanded] = useState(false)
  const [historia, setHistoria] = useState<HistoriaConfig>({
    titulo: "Creciendo junto a la comunidad",
    texto: defaultHistoriaTexto,
    imagen: "https://alternativaenpapel.com.ar/wp-content/uploads/2023/03/337138575_1772961839767853_985259689309933729_n.jpg",
    galeria: []
  })

  // Modal states
  const [selectedCarrera, setSelectedCarrera] = useState<CarreraExtended | null>(null)
  const [selectedNovedad, setSelectedNovedad] = useState<NovedadExtended | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [inscripcionesActive, setInscripcionesActive] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    // Load config: inscripciones + historia
    fetch('/api/config?all=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const cfg: Record<string, string> = {}
          data.forEach((item: any) => { cfg[item.key] = item.value })
          const inscConfig = data.find((i: any) => i.key === 'inscripciones_2026')
          if (inscConfig) setInscripcionesActive(inscConfig.isActive)
          setHistoria({
            titulo: cfg['historia_titulo'] || "Creciendo junto a la comunidad",
            texto: cfg['historia_texto'] || defaultHistoriaTexto,
            imagen: cfg['historia_imagen'] || "https://alternativaenpapel.com.ar/wp-content/uploads/2023/03/337138575_1772961839767853_985259689309933729_n.jpg",
            galeria: cfg['historia_galeria'] ? JSON.parse(cfg['historia_galeria']) : []
          })
        } else {
          // Fallback: old single-key response
          if (data.isActive !== undefined) setInscripcionesActive(data.isActive)
        }
      })
      .catch(console.error)

    const loadData = async () => {
      try {
        const resCarreras = await fetch("/api/carreras")
        const dataCarreras = await resCarreras.json()
        if (Array.isArray(dataCarreras)) {
          setCarreras(dataCarreras.map((c: any) => ({
            ...c,
            imagenes: Array.isArray(c.imagenes) ? c.imagenes : (c.imagen ? [c.imagen] : [])
          })))
        }

        const resNovedades = await fetch("/api/novedades")
        const data = await resNovedades.json()
        const items = data.data || data
        if (Array.isArray(items)) {
          setNovedades(items.map((n: any) => ({
            ...n,
            fecha: new Date(n.fecha).toISOString().split('T')[0],
            imagenes: Array.isArray(n.imagenes) ? n.imagenes : (n.imagen ? [n.imagen] : [])
          })))
        }
      } catch (error) {
        console.error("Error cargando datos:", error)
      }
    }
    loadData()

    const reveal = () => {
      const reveals = document.querySelectorAll(".reveal")
      reveals.forEach(el => {
        const windowHeight = window.innerHeight
        const elementTop = el.getBoundingClientRect().top
        if (elementTop < windowHeight - 80) el.classList.add("active")
      })
    }
    window.addEventListener("scroll", reveal)
    reveal()

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", reveal)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMenu = () => setMobileMenuOpen(false)

  const novedadesRegulares = novedades.filter(n => n.categoria !== "Galería")
  const novedadesFiltradas = (categoriaFiltro === "Todas" 
    ? novedadesRegulares 
    : novedadesRegulares.filter(n => n.categoria === categoriaFiltro)).slice(0, 6)

  const galeriasFiltradas = novedades.filter(n => n.categoria === "Galería")

  const getCategoryStyle = (categoria: string) => {
    const styles: Record<string, string> = {
      Evento: "bg-purple-100 text-purple-700 border-purple-200",
      Noticia: "bg-blue-100 text-blue-700 border-blue-200",
      Convocatoria: "bg-amber-100 text-amber-700 border-amber-200",
      Académico: "bg-emerald-100 text-emerald-700 border-emerald-200",
    }
    return styles[categoria] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getCategoryIcon = (cat: string) => {
    if (cat === "Evento") return <Calendar className="w-4 h-4" />
    if (cat === "Noticia") return <Newspaper className="w-4 h-4" />
    if (cat === "Convocatoria") return <Filter className="w-4 h-4" />
    return null
  }

  const carreraIcons = [BookOpen, GraduationCap, TrendingUp, Award, Sparkles, BookMarked]

  return (
    <div className="font-sans antialiased text-gray-900 bg-white text-base md:text-lg">
      {/* Navbar - Refinado */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "nav-glass py-3"
        : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link href="#inicio" className="flex items-center gap-3 group transition-transform hover:scale-[1.01] active:scale-95">
              <div className="flex items-center gap-2">
                <img src="/images/logo-municipalidad-de-exaltacion-de-la-cruz.png" alt="Municipio" className={`h-10 sm:h-12 md:h-14 lg:h-16 w-auto transition-all duration-500 ${scrolled ? "" : "brightness-0 invert"}`} />
                <div className={`h-6 w-[1px] ${scrolled ? "bg-gray-200" : "bg-white/30"}`}></div>
                <img src="/images/logo_puentes_0.svg" alt="Puentes" className={`h-8 sm:h-10 md:h-12 lg:h-14 w-auto transition-all duration-500 ${scrolled ? "" : "brightness-0 invert"}`} />
              </div>
              <div className="hidden xl:flex flex-col border-l border-transparent pl-3">
                <span className={`font-black text-xs md:text-sm leading-none tracking-tight transition-colors ${scrolled ? "text-[#004d91]" : "text-white"}`}>Complejo Universitario</span>
                <span className={`text-[8px] md:text-[10px] font-bold tracking-widest transition-colors ${scrolled ? "text-gray-400" : "text-white/60"}`}>EXALTACIÓN DE LA CRUZ</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {["Inicio", "Historia", "Carreras", "Novedades", "Contacto"].map((item) => (
                <Link key={item} href={item === "Historia" ? "/historia" : `#${item.toLowerCase()}`} className={`px-3 md:px-4 lg:px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider transition-all hover:bg-white/10 ${scrolled ? "text-gray-600 hover:text-[#004d91]" : "text-white/80 hover:text-white"}`}>
                  {item}
                </Link>
              ))}
            </div>

            <button className={`md:hidden p-2.5 rounded-xl transition-all ${scrolled ? "bg-blue-50 text-[#004d91]" : "bg-white/10 text-white backdrop-blur-md"}`} onClick={toggleMenu}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-[100] transition-all duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#001529]/80 backdrop-blur-md" onClick={closeMenu}></div>
        <div className={`absolute inset-x-0 top-0 bg-white rounded-b-[2rem] p-8 transition-all duration-500 shadow-2xl transform ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex items-center justify-between mb-8">
            <img src="/images/logo-municipalidad-de-exaltacion-de-la-cruz.png" alt="Logo" className="h-9 w-auto" />
            <button onClick={closeMenu} className="p-3 rounded-full bg-gray-50 text-gray-400"><X className="w-5 h-5" /></button>
          </div>
          <nav className="flex flex-col gap-1">
            {["Inicio", "Historia", "Carreras", "Novedades", "Contacto"].map((item) => (
              <Link key={item} href={item === "Historia" ? "/historia" : `#${item.toLowerCase()}`} className="p-4 rounded-xl text-base font-black text-gray-800 hover:bg-blue-50 transition-all flex justify-between items-center uppercase tracking-tight" onClick={closeMenu}>
                {item} <ChevronRight className="w-4 h-4 opacity-20" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero Section - 100vh con degradado de transición fluido */}
      <section id="inicio" className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-[#004d91]">
        <div className="absolute inset-0 z-0">
          <img src="/images/complejo-universitario-banner.jpg" alt="Complejo Universitario" className="w-full h-full object-cover" />
          {/* Degradado lateral de lectura */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003366] via-[#003366]/60 to-transparent"></div>
          {/* Degradado rojo central */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent pointer-events-none"></div>
          {/* Degradado inferior de transición a la siguiente sección (Blanco) */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-20">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 pt-20">
            {inscripcionesActive && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-[9px] md:text-[10px] font-black tracking-widest mb-4 md:mb-6 shadow-2xl shadow-orange-500/30 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 fill-white animate-spin-slow" /> INSCRIPCIONES 2026 ABIERTAS
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-[0.95] mb-4 md:mb-6 tracking-tighter text-balance">
              Formamos el futuro de <br />
              <span className="text-blue-200">Exaltación de la Cruz</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-10 leading-relaxed font-bold max-w-lg text-pretty">
              Educación superior pública y de calidad para acercar más oportunidades a toda la comunidad.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#carreras" className="px-8 py-3.5 rounded-xl bg-white text-[#004d91] font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-[11px] tracking-widest uppercase">
                Ver Carreras <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/historia" className="px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-[11px] tracking-widest uppercase hover:bg-white/20 transition-all">
                Historia
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-80 hover:opacity-100 transition-opacity cursor-pointer z-20 pointer-events-none">
          <span className="text-white text-xs md:text-sm uppercase tracking-[0.3em] font-black drop-shadow-lg">Scroll</span>
          <ChevronDown className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
        </div>
      </section>

      {/* Historia Teaser Section */}
      <section className="py-24 bg-white relative reveal overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group">
            {/* Fondo decorativo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex-1 relative z-10">
              <span className="text-[#004d91] font-black uppercase tracking-widest text-[10px] mb-4 block">Sobre Nosotros</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight uppercase tracking-tight text-balance">
                {historia.titulo || "Creciendo junto a la comunidad"}
              </h2>
              <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed font-medium line-clamp-4 text-pretty max-w-xl">
                {historia.texto || defaultHistoriaTexto}
              </p>
              
              <Link href="/historia" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#004d91] text-white font-black text-[11px] tracking-widest uppercase hover:bg-[#003366] transition-all hover:gap-4 shadow-lg shadow-blue-900/20">
                Conocé nuestra historia <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="w-full md:w-5/12 lg:w-1/2 relative z-10">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] ring-1 ring-black/5 group-hover:-translate-y-2 transition-transform duration-500">
                <img
                  src={historia.imagen || "https://alternativaenpapel.com.ar/wp-content/uploads/2023/03/337138575_1772961839767853_985259689309933729_n.jpg"}
                  alt="Historia del Complejo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Carreras Section - Achicado un poco */}
      <section id="carreras" className="py-20 bg-gray-50 reveal">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">Oferta Académica</h2>
            <p className="text-gray-400 font-bold text-xs md:text-sm mb-8">Propuestas universitarias de formación profesional</p>

            <div className="flex flex-wrap justify-center gap-2">
              {["Todas", "Carrera", "Curso"].map(tipo => (
                <button
                  key={tipo}
                  onClick={() => setCarreraFiltro(tipo)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${carreraFiltro === tipo ? "bg-[#004d91] text-white shadow-lg scale-105" : "bg-white text-gray-400 hover:bg-gray-100 border border-gray-100"}`}
                >
                  {tipo === "Todas" ? "Ver Todo" : (tipo === "Carrera" ? "Carreras" : "Cursos")}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {carreras.filter(c => carreraFiltro === "Todas" || (c.tipo || "Carrera") === carreraFiltro).map((carrera, index) => {
              if (carrera.activa === false) return null
              const abierta = carrera.inscripcionAbierta !== false
              return (
                <div key={carrera.id}
                  className={`group bg-white rounded-[2rem] overflow-hidden shadow-md transition-all duration-300 flex flex-col h-full border cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                    abierta ? 'border-gray-100' : 'border-gray-100 opacity-75'
                  }`}
                  onClick={() => { setSelectedCarrera(carrera); setCurrentImageIndex(0); }}>

                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    {(() => {
                      const firstMedia = carrera.imagenes?.[0] || carrera.imagen;
                      const isVid = firstMedia && (firstMedia.endsWith('.mp4') || firstMedia.endsWith('.webm') || firstMedia.includes('youtube.com') || firstMedia.includes('youtu.be'));
                      if (isVid) {
                        return (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900 group-hover:scale-105 transition-transform duration-700">
                            <div className="absolute inset-0 bg-gray-800 opacity-60" />
                            <Play className="w-12 h-12 text-white relative z-10" />
                          </div>
                        );
                      }
                      return <img src={carrera.imagen} alt={carrera.nombre} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${!abierta ? 'grayscale-[30%]' : ''}`} />;
                    })()}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest shadow-sm ${carrera.tipo === 'Curso' ? 'bg-amber-400 text-amber-900' : 'bg-blue-600 text-white'}`}>
                        {carrera.tipo || 'Carrera'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-4 py-1.5 rounded-lg bg-blue-600/90 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                        {carrera.modalidad}
                      </span>
                    </div>
                    {!abierta && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-gray-700/80 text-gray-200 backdrop-blur-sm">
                          Finalizada
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-10 flex flex-col flex-grow">
                    <h3 className="text-xl md:text-2xl font-black mb-4 leading-tight uppercase tracking-tight transition-colors group-hover:text-[#004d91]">{carrera.nombre}</h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-8 flex-grow font-medium leading-relaxed">{carrera.descripcion}</p>
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                      {abierta ? (
                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="text-green-600">Inscripciones abiertas</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                          <span className="text-gray-400">Finalizada</span>
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-[#004d91] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {carreras.filter(c => carreraFiltro === "Todas" || (c.tipo || "Carrera") === carreraFiltro).length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 mt-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2">No hay disponibles</h3>
              <p className="text-gray-400 text-sm font-medium">No se encontraron {carreraFiltro === "Todas" ? "carreras ni cursos" : (carreraFiltro === "Carrera" ? "carreras" : "cursos")} para mostrar.</p>
            </div>
          )}
        </div>
      </section>

      {/* Novedades Section - Achicado un poco */}
      < section id="novedades" className="py-20 bg-white reveal" >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[#004d91] font-black text-[9px] uppercase tracking-widest block mb-2">Prensa y Actualidad</span>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Novedades</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Todas", "Evento", "Noticia", "Convocatoria"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaFiltro(cat)}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${categoriaFiltro === cat ? "bg-[#004d91] text-white shadow-lg shadow-blue-900/20 scale-105" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 hover:shadow-sm"}`}>
                  {cat === "Todas" && <Sparkles className={`w-3.5 h-3.5 ${categoriaFiltro === cat ? "text-blue-300" : "text-gray-300 group-hover:text-gray-400"}`} />}
                  {cat === "Evento" && <Calendar className={`w-3.5 h-3.5 ${categoriaFiltro === cat ? "text-purple-300" : "text-gray-300 group-hover:text-gray-400"}`} />}
                  {cat === "Noticia" && <Newspaper className={`w-3.5 h-3.5 ${categoriaFiltro === cat ? "text-blue-300" : "text-gray-300 group-hover:text-gray-400"}`} />}
                  {cat === "Convocatoria" && <Filter className={`w-3.5 h-3.5 ${categoriaFiltro === cat ? "text-amber-300" : "text-gray-300 group-hover:text-gray-400"}`} />}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {novedadesFiltradas.length > 0 ? (
              novedadesFiltradas.map(n => (
                <article
                  key={n.id}
                  className={`group relative flex flex-col h-full cursor-pointer transition-transform duration-300 ${n.destacada ? 'scale-[1.02]' : 'hover:-translate-y-1'}`}
                  onClick={() => { setSelectedNovedad(n); setCurrentImageIndex(0); }}>

                  <div className={`relative flex flex-col h-full bg-white rounded-[2rem] overflow-hidden shadow-sm border ${n.destacada ? 'border-0' : 'border-gray-50'}`}
                    style={n.destacada && n.color ? { boxShadow: `0 10px 40px -10px ${n.color}50` } : {}}>

                    {n.destacada && n.color && (
                      <div className="h-1.5 w-full relative overflow-hidden" style={{ backgroundColor: n.color }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]"></div>
                      </div>
                    )}

                    <div className="h-60 relative overflow-hidden">
                      {(() => {
                        const firstMedia = n.imagenes?.[0] || n.imagen;
                        const isVid = firstMedia && (firstMedia.endsWith('.mp4') || firstMedia.endsWith('.webm') || firstMedia.includes('youtube.com') || firstMedia.includes('youtu.be'));
                        if (isVid) {
                          return (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900 group-hover:scale-105 transition-transform duration-700">
                              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Video cover" />
                              <Play className="w-12 h-12 text-white relative z-10" />
                            </div>
                          );
                        }
                        return <img src={n.imagen} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={n.titulo} />;
                      })()}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {n.destacada && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md border border-white/20"
                          style={{ backgroundColor: n.color || '#fbbf24' }}>
                          <Star className="w-3 h-3 fill-white" /> DESTACADO
                        </div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        {n.categoria === "Evento" && <Calendar className="w-5 h-5 text-[#004d91]" />}
                        {n.categoria === "Noticia" && <Newspaper className="w-5 h-5 text-[#004d91]" />}
                        {n.categoria === "Convocatoria" && <Filter className="w-5 h-5 text-[#004d91]" />}
                        <span className="text-[10px] font-black text-[#004d91] uppercase tracking-[0.2em]">{n.categoria}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#004d91] uppercase tracking-[0.2em] mb-4 block">{helperFormatDate(n.fecha)}</span>
                      <h3 className="text-xl md:text-2xl font-black leading-tight mb-4 group-hover:text-[#004d91] line-clamp-2 uppercase tracking-tight transition-colors">{n.titulo}</h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-8 flex-grow font-medium text-pretty">{n.contenido.replace(/<[^>]*>/g, '')}</p>
                      <div className="text-[10px] font-black text-[#004d91] uppercase tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                        LEER MÁS <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Newspaper className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2">No hay noticias</h3>
                <p className="text-gray-400 text-sm font-medium">No se encontraron novedades para mostrar en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      </section >

      {/* Galería Institucional */}
      {galeriasFiltradas.length > 0 && (
        <section id="galeria" className="py-20 bg-gray-50 reveal">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#004d91] font-black uppercase tracking-widest text-[9px] mb-2 block">Imágenes y Videos</span>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Galería Institucional</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {galeriasFiltradas.map((galeria) => {
                const totalMedias = (galeria.imagenes?.length || 0) + (galeria.videos?.length || 0);
                const hasVideo = galeria.video || (galeria.videos && galeria.videos.length > 0) || galeria.imagen?.includes('youtube') || galeria.imagenes?.some(i => i.includes('youtube') || i.endsWith('.mp4'));
                const isMultiple = totalMedias > 1 || (galeria.imagen && galeria.imagenes && galeria.imagenes.length > 1);

                return (
                  <article 
                    key={galeria.id} 
                    className="relative aspect-square group cursor-pointer overflow-hidden rounded-[2rem] md:rounded-3xl bg-gray-200 shadow-sm"
                    onClick={() => { setSelectedNovedad(galeria); setCurrentImageIndex(0); }}
                  >
                    {/* Media thumbnail */}
                    {(() => {
                        const firstMedia = galeria.imagenes?.[0] || galeria.imagen;
                        const isVid = firstMedia && (firstMedia.endsWith('.mp4') || firstMedia.endsWith('.webm') || firstMedia.includes('youtube.com') || firstMedia.includes('youtu.be'));
                        if (isVid) {
                          return (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity" alt="Video cover" />
                              <Play className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
                            </div>
                          );
                        }
                        return <img src={galeria.imagen} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={galeria.titulo} />;
                    })()}

                    {/* Icons overlay (Top Right) */}
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      {hasVideo && <Play className="w-5 h-5 text-white drop-shadow-md fill-white" />}
                      {isMultiple && !hasVideo && <Layers className="w-5 h-5 text-white drop-shadow-md" />}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6 z-10">
                      <h3 className="text-white font-black text-sm md:text-base leading-tight uppercase tracking-tight line-clamp-3">{galeria.titulo}</h3>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      < section id="contacto" className="py-24 bg-gray-50 reveal" >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#004d91] font-black uppercase tracking-widest text-[10px] mb-4 block">Estamos para ayudarte</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">Contacto</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {[
              { icon: "/images/icon-whatsapp.svg", title: "WhatsApp", info: "11 2363-5027", link: "https://wa.me/541123635027" },
              { icon: "/images/icon-gmail.svg", title: "Email", info: "educacionexaltacion@gmail.com", link: "mailto:educacionexaltacion@gmail.com" },
              { icon: "/images/icon-instagram.svg", title: "Instagram", info: "@c.universitarioexaltacion", link: "https://instagram.com/c.universitarioexaltacion" },
              { icon: "/images/icon-instagram.svg", title: "Instagram", info: "@direccioneducacion", link: "https://instagram.com/direccioneducacion" },
              { icon: "/images/icon-maps.svg", title: "Ubicación", info: "San Martín 1025, Capilla del Señor", link: "https://www.google.com/maps/search/San+Martín+1025+Capilla+del+Señor" },
            ].map((item, i) => (
              <a key={i} href={item.link} target="_blank" className="bg-white p-8 md:p-10 rounded-[2rem] text-center border border-white shadow-sm block transition-all hover:bg-white hover:shadow-xl hover:-translate-y-2 group">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <img src={item.icon} alt={item.title} className="w-8 h-8 object-contain" />
                </div>
                <h4 className="font-black text-gray-900 text-sm mb-2 uppercase tracking-wider">{item.title}</h4>
                <p className="text-gray-400 text-xs font-bold break-all leading-tight group-hover:text-[#004d91] transition-colors">{item.info}</p>
              </a>
            ))}
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="bg-[#001529] text-white py-20 border-t border-white/5" >
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-8 mb-12 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="/images/logo-municipalidad-de-exaltacion-de-la-cruz.png" alt="Municipalidad" className="h-16 md:h-20 brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" />
            <div className="w-[1px] h-12 bg-white/20"></div>
            <img src="/images/logo_puentes_0.svg" alt="Puentes" className="h-12 md:h-16 brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase leading-none mb-8">&copy; 2026 COMPLEJO UNIVERSITARIO MUNICIPAL</p>

          <a href="https://ar.linkedin.com/in/ariel-alessandro-romero" target="_blank" className="group flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20">
            <span className="text-gray-400 text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">Desarrollado por</span>
            <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest group-hover:text-blue-300 transition-colors">Ariel Romero</span>
          </a>
        </div>
      </footer >

      {/* FIX: WhatsApp Button - Usando icono local correcto icon-whatsapp.svg */}
      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/541123635027" target="_blank" className="fixed bottom-8 right-8 z-[100] group flex items-center animate-float-y">
        <div className="absolute right-full mr-6 px-6 py-3 bg-white text-[#004d91] font-black rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap text-xs tracking-widest border border-gray-100 uppercase pointer-events-none">
          Chateá con nosotros
        </div>
        <div className="bg-[#25D366] p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.6)] hover:shadow-[0_0_40px_rgba(37,211,102,0.8)] hover:scale-110 active:scale-90 transition-all duration-300">
          <img src="/images/icon-whatsapp.svg" alt="WhatsApp" className="w-10 h-10" />
        </div>
      </a>

      {/* Modal Sistema - Achicado fuentes y paddings */}
      {
        (selectedCarrera || selectedNovedad) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#001529]/80 backdrop-blur-md" onClick={() => { setSelectedCarrera(null); setSelectedNovedad(null); }}></div>
            <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedCarrera(null); setSelectedNovedad(null); }}
                className="absolute top-5 right-5 p-3 rounded-full bg-black/10 text-gray-500 z-50 hover:bg-black/20 transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>

              {selectedCarrera && (
                <div className="flex flex-col">
                  <div className="h-[250px] md:h-[400px] w-full overflow-hidden bg-gray-900 flex items-center justify-center relative group">
                    {renderMedia((selectedCarrera.imagenes && selectedCarrera.imagenes.length > 0 ? selectedCarrera.imagenes : [selectedCarrera.imagen])[currentImageIndex], () => setIsLightboxOpen(true))}
                    
                    {((selectedCarrera.imagenes?.length || 0) > 1 || (selectedCarrera.imagen && selectedCarrera.imagenes && selectedCarrera.imagenes.length > 1)) && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === 0 ? selectedCarrera.imagenes!.length - 1 : i - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white hover:bg-black/70 rounded-full transition-all z-20 backdrop-blur-sm group/btn"><ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" /></button>
                        <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === selectedCarrera.imagenes!.length - 1 ? 0 : i + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white hover:bg-black/70 rounded-full transition-all z-20 backdrop-blur-sm group/btn"><ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" /></button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                          {selectedCarrera.imagenes!.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 w-2'}`}></div>)}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-4 py-1.5 rounded-lg bg-blue-50 text-[#004d91] text-[9px] font-black uppercase tracking-widest">{selectedCarrera.modalidad}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mb-8 leading-tight uppercase tracking-tight">{selectedCarrera.nombre}</h2>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Duración</p>
                        <p className="font-black text-base text-[#004d91]">{selectedCarrera.duracion}</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Inscripciones</p>
                        <p className={`font-black text-base ${selectedCarrera.inscripcionAbierta !== false ? 'text-green-600' : 'text-gray-500'}`}>
                          {selectedCarrera.inscripcionAbierta !== false ? 'Abiertas' : 'Finalizadas'}
                        </p>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-500 font-medium mb-10 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: selectedCarrera.descripcion }}></div>
                    {selectedCarrera.inscripcionAbierta !== false && (
                      <a 
                        href={selectedCarrera.linkInscripcion || "#"} 
                        target={selectedCarrera.linkInscripcion ? "_blank" : "_self"}
                        className="block w-full py-4 rounded-xl bg-[#004d91] text-white text-center font-black uppercase text-xs tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-[0.98]"
                      >
                        Pre-inscripción Online
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedNovedad && (() => {
                const medias = [
                  ...(selectedNovedad.imagenes && selectedNovedad.imagenes.length > 0 ? selectedNovedad.imagenes : (selectedNovedad.imagen ? [selectedNovedad.imagen] : [])),
                  ...(selectedNovedad.videos && selectedNovedad.videos.length > 0 ? selectedNovedad.videos : (selectedNovedad.video ? [selectedNovedad.video] : []))
                ].filter(Boolean);

                return (
                <div className="flex flex-col">
                  <div className="h-[250px] md:h-[400px] w-full overflow-hidden bg-gray-900 flex items-center justify-center relative group">
                    {renderMedia(medias[currentImageIndex], () => setIsLightboxOpen(true))}
                    
                    {medias.length > 1 && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === 0 ? medias.length - 1 : i - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white hover:bg-black/70 rounded-full transition-all z-20 backdrop-blur-sm group/btn"><ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" /></button>
                        <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === medias.length - 1 ? 0 : i + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 text-white hover:bg-black/70 rounded-full transition-all z-20 backdrop-blur-sm group/btn"><ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" /></button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                          {medias.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 w-2'}`}></div>)}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getCategoryStyle(selectedNovedad.categoria)}`}>{selectedNovedad.categoria}</span>
                      <p className="text-gray-300 text-[9px] font-black uppercase tracking-widest">{helperFormatDate(selectedNovedad.fecha)}</p>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black mb-8 uppercase leading-tight tracking-tight">{selectedNovedad.titulo}</h2>
                    <div className="prose prose-sm max-w-none text-gray-500 font-medium mb-8 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: selectedNovedad.contenido }}></div>

                    <button onClick={() => setSelectedNovedad(null)} className="px-8 py-3 rounded-lg border border-gray-200 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all text-gray-400">Regresar</button>
                  </div>
                </div>
                )
              })()}
            </div>
          </div>
        )
      }

      {/* Lightbox / Galería System */}
      {
        isLightboxOpen && (selectedNovedad || selectedCarrera) && (() => {
          const item = selectedNovedad || selectedCarrera;
          if (!item) return null;
          const medias = [
            ...(item.imagenes && item.imagenes.length > 0 ? item.imagenes : (item.imagen ? [item.imagen] : [])),
            ...(item.videos && item.videos.length > 0 ? item.videos : (item.video ? [item.video] : []))
          ].filter(Boolean);

          return (
          <div className="fixed inset-0 z-[300] bg-black/98 flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)}>
            <button className="absolute top-6 right-6 text-white p-3"><X className="w-10 h-10" /></button>

            {medias.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx => idx === 0 ? medias.length - 1 : idx - 1); }} className="absolute left-6 text-white/50 hover:text-white p-4 transition-all"><ChevronLeft className="w-12 h-12" /></button>
                <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx => idx === medias.length - 1 ? 0 : idx + 1); }} className="absolute right-6 text-white/50 hover:text-white p-4 transition-all"><ChevronRight className="w-12 h-12" /></button>
              </>
            )}

            {renderMedia(medias[currentImageIndex], undefined)}

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">
              {currentImageIndex + 1} / {medias.length || 1}
            </div>
          </div>
          )
        })()
      }

      <style jsx global>{`
        body { scroll-behavior: smooth; overflow-x: hidden; }
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
      `}</style>
    </div >
  )
}