"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Play, X } from "lucide-react"
import { defaultHistoriaTexto } from "../defaultHistoria"

interface HistoriaConfig {
  titulo: string
  texto: string
  imagen: string
  galeria: string[]
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

  return <img src={url} className="w-full h-full object-cover cursor-zoom-in" alt="Media" onClick={onClick} />;
};

export default function HistoriaPage() {
  const [historia, setHistoria] = useState<HistoriaConfig>({
    titulo: "Creciendo junto a la comunidad",
    texto: defaultHistoriaTexto,
    imagen: "https://alternativaenpapel.com.ar/wp-content/uploads/2023/03/337138575_1772961839767853_985259689309933729_n.jpg",
    galeria: []
  })
  
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    fetch('/api/config?all=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const cfg: Record<string, string> = {}
          data.forEach((item: any) => { cfg[item.key] = item.value })
          setHistoria({
            titulo: cfg['historia_titulo'] || "Creciendo junto a la comunidad",
            texto: cfg['historia_texto'] || defaultHistoriaTexto,
            imagen: cfg['historia_imagen'] || "https://alternativaenpapel.com.ar/wp-content/uploads/2023/03/337138575_1772961839767853_985259689309933729_n.jpg",
            galeria: cfg['historia_galeria'] ? JSON.parse(cfg['historia_galeria']) : []
          })
        }
      })
      .catch(console.error)
      
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  const paragraphs = (historia.texto || '').split('\n').filter(p => p.trim() !== '');
  const gallery = historia.galeria || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#004d91] selection:text-white">
      {/* Navbar Minimalista */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[#004d91] border border-gray-200 bg-white transition-all group-hover:scale-105 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className={`font-black uppercase tracking-widest text-xs transition-colors ${scrolled ? "text-gray-900" : "text-white drop-shadow-md"}`}>Volver al inicio</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={historia.imagen} alt="Historia" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#f9fafb]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-10">
          <span className="text-blue-200 font-black uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block drop-shadow-sm">Sobre Nosotros</span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter text-balance drop-shadow-lg">
            {historia.titulo}
          </h1>
        </div>
      </div>

      {/* Storytelling Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="space-y-12 md:space-y-20">
          {paragraphs.map((paragraph, index) => {
            const imageIndex = Math.floor(index / 2);
            const showImage = index % 2 === 1 && imageIndex < gallery.length;
            const alignRight = imageIndex % 2 === 1;

            return (
              <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: `${(index % 4) * 150}ms` }}>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed md:leading-loose font-medium text-pretty">
                  {paragraph}
                </p>
                
                {showImage && (
                  <div className={`mt-12 md:mt-16 w-full md:w-11/12 ${alignRight ? 'ml-auto' : 'mr-auto'}`}>
                    <div 
                      className="relative rounded-2xl overflow-hidden aspect-video shadow-xl group cursor-pointer ring-1 ring-black/5"
                      onClick={() => setLightboxSrc(gallery[imageIndex])}
                    >
                      {gallery[imageIndex].includes('youtube') || gallery[imageIndex].endsWith('.mp4') ? (
                         <div className="absolute inset-0 bg-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                           <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                         </div>
                      ) : (
                         <img src={gallery[imageIndex]} alt={`Galería ${imageIndex + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Render remaining images if any, in a beautiful grid at the bottom */}
          {gallery.length > Math.floor(paragraphs.length / 2) && (
            <div className="pt-16 mt-16 border-t border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight text-center">Más Imágenes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.slice(Math.floor(paragraphs.length / 2)).map((media, i) => (
                  <div 
                    key={i} 
                    className="relative rounded-xl overflow-hidden aspect-square md:aspect-video shadow-md group cursor-pointer"
                    onClick={() => setLightboxSrc(media)}
                  >
                    {media.includes('youtube') || media.endsWith('.mp4') ? (
                       <div className="w-full h-full bg-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                         <Play className="w-8 h-8 text-white" />
                       </div>
                    ) : (
                       <img src={media} alt={`Galería Extra ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setLightboxSrc(null)}>
          <button className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all" onClick={() => setLightboxSrc(null)}>
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {lightboxSrc.includes('youtube.com') || lightboxSrc.includes('youtu.be') ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                {renderMedia(lightboxSrc)}
              </div>
            ) : lightboxSrc.endsWith('.mp4') || lightboxSrc.endsWith('.webm') ? (
              <video controls src={lightboxSrc} className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl" />
            ) : (
              <img src={lightboxSrc} alt="Galería" className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
