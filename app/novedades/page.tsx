"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Filter,
    Newspaper,
    BookMarked,
    FileText,
    PartyPopper,
    GraduationCap,
    Calendar,
    X,
    MessageCircle,
    Home
} from "lucide-react"
import { helperFormatDate } from "@/lib/data"

// Extended types
interface NovedadExtended {
    id: number
    titulo: string
    categoria: "Evento" | "Noticia" | "Convocatoria" | "Académico"
    fecha: string
    contenido: string
    imagen: string
    imagenes?: string[]
}

export default function NovedadesPage() {
    const [novedades, setNovedades] = useState<NovedadExtended[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        limit: 9,
        total: 0
    })

    // Filtering and Sorting
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")

    // Modal states
    const [selectedNovedad, setSelectedNovedad] = useState<NovedadExtended | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        fetchNovedades(pagination.page, categoriaFiltro)
    }, [pagination.page, categoriaFiltro])

    const fetchNovedades = async (page: number, category: string) => {
        setLoading(true)
        try {
            const query = new URLSearchParams()
            query.set("page", page.toString())
            query.set("limit", pagination.limit.toString())
            if (category !== "Todas") {
                query.set("category", category)
            }

            const response = await fetch(`/api/novedades?${query.toString()}`)
            const data = await response.json()

            const novedadesData = data.data || []
            const meta = data.pagination || { total: 0, pages: 1, currentPage: 1, limit: 9 }

            if (Array.isArray(novedadesData)) {
                const formatted = novedadesData.map((n: any) => ({
                    ...n,
                    fecha: new Date(n.fecha).toISOString().split('T')[0],
                    imagenes: Array.isArray(n.imagenes) ? n.imagenes : (n.imagen ? [n.imagen] : [])
                }))
                setNovedades(formatted)
                setPagination(prev => ({
                    ...prev,
                    page: meta.currentPage,
                    totalPages: meta.pages,
                    total: meta.total
                }))
            }
        } catch (error) {
            console.error("Error fetching novedades:", error)
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }))
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    // Icons por categoría
    const getCategoryIcon = (categoria: string) => {
        switch (categoria) {
            case "Evento": return <PartyPopper className="w-4 h-4" />
            case "Noticia": return <Newspaper className="w-4 h-4" />
            case "Convocatoria": return <FileText className="w-4 h-4" />
            case "Académico": return <BookMarked className="w-4 h-4" />
            default: return <Sparkles className="w-4 h-4" />
        }
    }

    const getCategoryStyle = (categoria: string) => {
        const styles: Record<string, string> = {
            Evento: "bg-purple-100 text-purple-700 border-purple-200",
            Noticia: "bg-blue-100 text-blue-700 border-blue-200",
            Convocatoria: "bg-amber-100 text-amber-700 border-amber-200",
            Académico: "bg-emerald-100 text-emerald-700 border-emerald-200",
        }
        return styles[categoria] || "bg-gray-100 text-gray-700 border-gray-200"
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

            {/* Navbar Simple */}
            <nav className="bg-[#004d91] text-white shadow-lg sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-none">Complejo Universitario</span>
                                <span className="text-xs text-white/70">Exaltación de la Cruz</span>
                            </div>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm font-medium"
                        >
                            <Home className="w-4 h-4" />
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#004d91] text-sm font-semibold mb-6">
                        <Newspaper className="w-4 h-4" />
                        Actualidad Universitaria
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Todas las Novedades</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Mantente informado sobre eventos, noticias y convocatorias de nuestra comunidad.
                    </p>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-2 mt-10">
                        {["Todas", "Noticia", "Evento", "Convocatoria", "Académico"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setCategoriaFiltro(cat)
                                    setPagination(prev => ({ ...prev, page: 1 }))
                                }}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${categoriaFiltro === cat
                                    ? "bg-[#004d91] text-white shadow-lg shadow-[#004d91]/25 scale-105"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                            >
                                {cat !== "Todas" && getCategoryIcon(cat)}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Grid Content */}
            <main className="flex-grow py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="bg-gray-200 h-96 rounded-3xl"></div>
                            ))}
                        </div>
                    ) : novedades.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {novedades.map((novedad) => (
                                    <article
                                        key={novedad.id}
                                        className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-blue-300 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full cursor-pointer"
                                        onClick={() => {
                                            setSelectedNovedad(novedad)
                                            setCurrentImageIndex(0)
                                        }}
                                    >
                                        <div className="h-56 overflow-hidden relative">
                                            <img
                                                src={novedad.imagen || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"}
                                                alt={novedad.titulo}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                            <div className="absolute top-4 left-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border shadow-sm ${getCategoryStyle(novedad.categoria)}`}>
                                                    {getCategoryIcon(novedad.categoria)}
                                                    {novedad.categoria}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-8 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                <span>{helperFormatDate(novedad.fecha)}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {novedad.titulo}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6 flex-grow">
                                                {novedad.contenido}
                                            </p>
                                            <span className="mt-auto text-[#004d91] font-semibold text-sm group-hover:text-[#003d71] flex items-center gap-1">
                                                Leer más
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-gray-600 font-medium px-4">
                                        Página {pagination.page} de {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                <Filter className="w-10 h-10" />
                            </div>
                            <p className="text-gray-500 text-xl">No se encontraron novedades en esta categoría.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer Simple */}
            <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    <p>&copy; 2026 Complejo Universitario. Todos los derechos reservados.</p>
                </div>
            </footer>

            {/* Modal Novedad */}
            {selectedNovedad && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedNovedad(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        {/* Image Gallery */}
                        {(selectedNovedad.imagenes?.length || selectedNovedad.imagen) && (
                            <div className="relative h-72 md:h-96">
                                <img
                                    src={selectedNovedad.imagenes?.[currentImageIndex] || selectedNovedad.imagen}
                                    alt={selectedNovedad.titulo}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                                <button
                                    onClick={() => setSelectedNovedad(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="absolute top-4 left-4">
                                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold ${getCategoryStyle(selectedNovedad.categoria)}`}>
                                        {getCategoryIcon(selectedNovedad.categoria)}
                                        {selectedNovedad.categoria}
                                    </span>
                                </div>

                                {selectedNovedad.imagenes && selectedNovedad.imagenes.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex(i => i === 0 ? selectedNovedad.imagenes!.length - 1 : i - 1)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex(i => i === selectedNovedad.imagenes!.length - 1 ? 0 : i + 1)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {selectedNovedad.imagenes.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentImageIndex(i)}
                                                    className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="p-8">
                            <div className="flex items-center gap-2 text-gray-500 mb-4">
                                <Calendar className="w-5 h-5 text-[#004d91]" />
                                <span>{helperFormatDate(selectedNovedad.fecha)}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedNovedad.titulo}</h2>
                            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                {selectedNovedad.contenido}
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setSelectedNovedad(null)}
                                    className="px-8 py-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
