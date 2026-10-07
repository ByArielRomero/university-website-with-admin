"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
    GraduationCap, BookOpen, Newspaper, Plus, Pencil, Trash2,
    LogOut, Home, Clock, Award, Image as ImageIcon, X, Save,
    ChevronLeft, ChevronRight, Upload, HelpCircle, Settings, Star, Video, CheckCircle2
} from "lucide-react"
import { defaultHistoriaTexto } from "../../defaultHistoria"

interface Carrera {
    id: number
    nombre: string
    facultad: string
    duracion: string
    modalidad: string
    descripcion: string
    imagen: string
    imagenes?: string[]
    tipo?: string
    inscripcionAbierta?: boolean
    activa?: boolean
    linkInscripcion?: string
}

interface Novedad {
    id: number
    titulo: string
    categoria: "Evento" | "Noticia" | "Convocatoria" | "Académico" | "Galería"
    fecha: string
    contenido: string
    imagen: string
    imagenes?: string[]
    destacada?: boolean
    video?: string
    videos?: string[]
    color?: string
}

const DB_KEYS = {
    CARRERAS: "universidad_carreras",
    NOVEDADES: "universidad_novedades",
}

// Helper component for labels with tooltips
const LabelWithTooltip = ({ label, tooltip, required }: { label: string, tooltip: string, required?: boolean }) => (
    <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-[#004d91] cursor-help transition-colors" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
        </div>
    </div>
)

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"carreras" | "novedades" | "config">("carreras")
    const [carreras, setCarreras] = useState<Carrera[]>([])
    const [novedades, setNovedades] = useState<Novedad[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editItem, setEditItem] = useState<Carrera | Novedad | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
    const router = useRouter()

    // Notification helper
    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000)
    }

    // Form states
    const [formData, setFormData] = useState({
        nombre: "",
        titulo: "",
        facultad: "",
        duracion: "",
        modalidad: "Presencial",
        descripcion: "",
        contenido: "",
        categoria: "Noticia" as Novedad["categoria"],
        fecha: "",
        imagenes: [] as string[],
        destacada: false,
        video: "",
        videos: [] as string[],
        color: "#3b82f6",
        tipo: "Carrera",
        inscripcionAbierta: true,
        linkInscripcion: "",
    })
    const [newImageUrl, setNewImageUrl] = useState("")
    const [newVideoUrl, setNewVideoUrl] = useState("")
    const [isUploading, setIsUploading] = useState(false)

    const uploadFile = async (file: File, type: 'image' | 'video') => {
        setIsUploading(true)
        showNotification('Subiendo archivo...', 'success')
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
            const data = await res.json();
            if (data.url) {
                if (type === 'image') {
                    setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, data.url] }));
                } else {
                    setFormData(prev => ({ ...prev, videos: [...prev.videos, data.url] }));
                }
                showNotification('Archivo subido con éxito');
            } else {
                showNotification(data.error || 'Error al subir el archivo', 'error');
            }
        } catch (e) {
            showNotification('Error en la subida', 'error');
        } finally {
            setIsUploading(false)
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';

        const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) {
            showNotification(`El archivo excede el límite de peso (${type === 'image' ? '5MB' : '50MB'})`, 'error');
            return;
        }

        if (type === 'video') {
            const url = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            video.onloadedmetadata = async () => {
                URL.revokeObjectURL(url);
                if (video.duration > 120) {
                    showNotification('El video no puede durar más de 2 minutos', 'error');
                    return;
                }
                await uploadFile(file, type);
            };
            video.src = url;
        } else {
            await uploadFile(file, type);
        }
    };

    const presetColors = [
        "#004d91", // Default Blue
        "#3b82f6", // Bright Blue
        "#8b5cf6", // Violet
        "#ec4899", // Pink
        "#ef4444", // Red
        "#f97316", // Orange
        "#eab308", // Yellow
        "#22c55e", // Green
        "#06b6d4", // Cyan
        "#14b8a6", // Teal
    ]

    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin")
        } else if (status === "authenticated") {
            setIsAuthenticated(true)
            loadData()
        }
    }, [status, router])

    const loadData = async () => {
        try {
            const resCarreras = await fetch("/api/carreras", { cache: "no-store" })
            const dataCarreras = await resCarreras.json()
            if (Array.isArray(dataCarreras)) {
                // Ensure imagenes is an array
                const carrerasSanitized = dataCarreras.map((c: any) => ({
                    ...c,
                    imagenes: Array.isArray(c.imagenes) ? c.imagenes : (c.imagen ? [c.imagen] : [])
                }))
                setCarreras(carrerasSanitized)
            }

            const resNovedades = await fetch("/api/novedades", { cache: "no-store" })
            const dataNovedades = await resNovedades.json()
            if (Array.isArray(dataNovedades)) {
                // Format dates for display and ensure imagenes is array
                const novedadesFormatted = dataNovedades.map((n: any) => ({
                    ...n,
                    fecha: new Date(n.fecha).toISOString().split('T')[0],
                    imagenes: Array.isArray(n.imagenes) ? n.imagenes : (n.imagen ? [n.imagen] : [])
                }))
                setNovedades(novedadesFormatted)
            }
        } catch (error) {
            console.error("Error loading data:", error)
        }
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/admin" })
    }

    const openAddModal = (tipo: "Carrera" | "Curso" = "Carrera") => {
        setEditItem(null)
        setFormData({
            nombre: "",
            titulo: "",
            facultad: "",
            duracion: "",
            modalidad: "Presencial",
            descripcion: "",
            contenido: "",
            categoria: "Noticia",
            fecha: new Date().toISOString().split('T')[0],
            imagenes: [],
            destacada: false,
            video: "",
            videos: [],
            color: "#3b82f6",
            tipo: tipo,
            inscripcionAbierta: true,
            linkInscripcion: "",
        })
        setNewImageUrl("")
        setNewVideoUrl("")
        setShowModal(true)
    }

    const openEditModal = (item: Carrera | Novedad) => {
        setEditItem(item)
        if ('nombre' in item) {
            // Es carrera
            setFormData({
                ...formData,
                nombre: item.nombre,
                facultad: item.facultad,
                duracion: item.duracion,
                modalidad: item.modalidad,
                descripcion: item.descripcion,
                imagenes: (item.imagenes as string[]) || (item.imagen ? [item.imagen] : []),
                tipo: item.tipo || "Carrera",
                inscripcionAbierta: item.inscripcionAbierta !== false,
                linkInscripcion: item.linkInscripcion || "",
            })
        } else {
            // Es novedad
            setFormData({
                ...formData,
                titulo: item.titulo,
                contenido: item.contenido,
                categoria: item.categoria,
                fecha: item.fecha,
                imagenes: (item.imagenes as string[]) || (item.imagen ? [item.imagen] : []),
                destacada: item.destacada ?? false,
                video: item.video || "",
                videos: (item.videos as string[]) || (item.video ? [item.video] : []),
                color: item.color || "#3b82f6",
            })
        }
        setShowModal(true)
    }

    const addImage = () => {
        if (newImageUrl.trim()) {
            setFormData({
                ...formData,
                imagenes: [...formData.imagenes, newImageUrl.trim()]
            })
            setNewImageUrl("")
        }
    }

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            imagenes: formData.imagenes.filter((_, i) => i !== index)
        })
    }

    const addVideo = () => {
        if (newVideoUrl.trim()) {
            setFormData({
                ...formData,
                videos: [...formData.videos, newVideoUrl.trim()]
            })
            setNewVideoUrl("")
        }
    }

    const removeVideo = (index: number) => {
        setFormData({
            ...formData,
            videos: formData.videos.filter((_, i) => i !== index)
        })
    }

    const handleSave = async () => {
        // Auto-add text in image input if user forgot to click +
        let finalImages = [...formData.imagenes]
        if (newImageUrl.trim() && !finalImages.includes(newImageUrl.trim())) {
            finalImages.push(newImageUrl.trim())
        }

        if (activeTab === "carreras") {
            if (!formData.nombre.trim() || !formData.facultad.trim()) {
                showNotification("El nombre y la facultad son obligatorios", "error")
                return
            }
            const carreraData = {
                nombre: formData.nombre,
                facultad: formData.facultad,
                duracion: formData.duracion,
                modalidad: formData.modalidad,
                descripcion: formData.descripcion,
                imagen: finalImages[0] || "",
                imagenes: finalImages,
                tipo: formData.tipo,
                inscripcionAbierta: formData.inscripcionAbierta,
                linkInscripcion: formData.linkInscripcion,
            }

            if (editItem) {
                await fetch(`/api/carreras/${(editItem as Carrera).id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(carreraData)
                })
            } else {
                await fetch('/api/carreras', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(carreraData)
                })
            }
        } else {
            if (!formData.titulo.trim()) {
                showNotification("El título es obligatorio", "error")
                return
            }
            const novedadData = {
                titulo: formData.titulo,
                categoria: formData.categoria,
                fecha: formData.fecha,
                contenido: formData.contenido,
                imagen: finalImages[0] || "",
                imagenes: finalImages,
                destacada: formData.destacada,
                video: formData.videos[0] || "",
                videos: formData.videos,
                color: formData.color,
            }

            if (editItem) {
                await fetch(`/api/novedades/${(editItem as Novedad).id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novedadData)
                })
            } else {
                await fetch('/api/novedades', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novedadData)
                })
            }
        }
        await loadData()
        setShowModal(false)
        showNotification("Cambios guardados correctamente")
    }

    const handleDelete = async (id: number) => {
        if (activeTab === "carreras") {
            await fetch(`/api/carreras/${id}`, { method: 'DELETE' })
        } else {
            await fetch(`/api/novedades/${id}`, { method: 'DELETE' })
        }
        await loadData()
        setDeleteConfirm(null)
        showNotification("Elemento eliminado correctamente")
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-24 right-4 z-[60] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-10 duration-300 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}`}>
                    {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <X className="w-6 h-6" />}
                    <span className="font-bold tracking-tight">{notification.message}</span>
                </div>
            )}
            {/* Header */}
            <header className="bg-[#004d91] text-white sticky top-0 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <img
                                src="/images/logo-municipalidad-de-exaltacion-de-la-cruz.png"
                                alt="Municipalidad"
                                className="h-10 w-auto brightness-0 invert opacity-90"
                            />
                            <div className="h-8 w-[1px] bg-white/20"></div>
                            <img
                                src="/images/logo_puentes_0.svg"
                                alt="Puentes"
                                className="h-8 w-auto brightness-0 invert opacity-90"
                            />
                            <div className="hidden sm:block border-l border-white/20 pl-4 ml-2">
                                <span className="font-bold text-lg block leading-tight">Panel Admin</span>
                                <span className="text-white/60 text-xs">Complejo Universitario</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm"
                            >
                                <Home className="w-4 h-4" />
                                Ver Sitio
                            </a>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab("carreras")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "carreras"
                            ? "bg-[#004d91] text-white shadow-lg shadow-[#004d91]/25"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <BookOpen className="w-5 h-5" />
                        Carreras
                    </button>
                    <button
                        onClick={() => setActiveTab("novedades")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "novedades"
                            ? "bg-[#004d91] text-white shadow-lg shadow-[#004d91]/25"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Newspaper className="w-5 h-5" />
                        Novedades
                    </button>
                    <button
                        onClick={() => setActiveTab("config")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "config"
                            ? "bg-[#004d91] text-white shadow-lg shadow-[#004d91]/25"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        Configuración
                    </button>
                </div>

                {/* Add Button */}
                {activeTab !== "config" && (
                    <div className="mb-6 flex gap-3">
                        <button
                            onClick={() => openAddModal("Carrera")}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#004d91] text-white font-medium hover:bg-[#003d71] transition-all shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar {activeTab === "carreras" ? "Carrera" : "Novedad"}
                        </button>

                        {activeTab === "carreras" && (
                            <button
                                onClick={() => openAddModal("Curso")}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-all shadow-lg"
                            >
                                <Plus className="w-5 h-5" />
                                Agregar Curso
                            </button>
                        )}
                    </div>
                )}

                {/* List or Config */}
                {activeTab === "config" ? (
                    <ConfigTab />
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {activeTab === "carreras" ? "Carreras Registradas" : "Novedades Publicadas"}
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {activeTab === "carreras" ? (
                                carreras.length > 0 ? (
                                    carreras.map((carrera) => (
                                        <div key={carrera.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                {carrera.imagen ? (
                                                    <img src={carrera.imagen} alt={carrera.nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageIcon className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-bold text-gray-900 mb-1">{carrera.nombre}</h3>
                                                <p className="text-gray-500 text-sm mb-2">{carrera.facultad}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {carrera.duracion}</span>
                                                    <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {carrera.modalidad}</span>
                                                    {carrera.imagenes && carrera.imagenes.length > 1 && (
                                                        <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> {carrera.imagenes.length} fotos</span>
                                                    )}
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                                                        carrera.inscripcionAbierta !== false
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {carrera.inscripcionAbierta !== false ? '✓ Inscripciones abiertas' : '✕ Finalizada'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(carrera)}
                                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(carrera.id)}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No hay carreras registradas</p>
                                    </div>
                                )
                            ) : (
                                novedades.length > 0 ? (
                                    novedades.map((novedad) => (
                                        <div key={novedad.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                {novedad.imagen ? (
                                                    <img src={novedad.imagen} alt={novedad.titulo} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageIcon className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${novedad.categoria === "Evento" ? "bg-purple-100 text-purple-700" :
                                                        novedad.categoria === "Noticia" ? "bg-blue-100 text-blue-700" :
                                                        novedad.categoria === "Galería" ? "bg-pink-100 text-pink-700" :
                                                            novedad.categoria === "Convocatoria" ? "bg-amber-100 text-amber-700" :
                                                                "bg-green-100 text-green-700"
                                                        }`}>
                                                        {novedad.categoria}
                                                    </span>
                                                    {novedad.destacada && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                                            <Star className="w-3 h-3 fill-yellow-700" />
                                                            Destacada
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-gray-900 mb-1">{novedad.titulo}</h3>
                                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                                    <span>{novedad.fecha}</span>
                                                    {novedad.imagenes && novedad.imagenes.length > 1 && (
                                                        <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> {novedad.imagenes.length} fotos</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(novedad)}
                                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(novedad.id)}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500">
                                        <Newspaper className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No hay novedades publicadas</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editItem ? "Editar" : "Agregar"} {activeTab === "carreras" ? (formData.tipo === "Curso" ? "Curso" : "Carrera") : "Novedad"}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <p className="text-sm text-gray-500 font-medium">Los campos marcados con <span className="text-red-500">*</span> son obligatorios.</p>
                                {activeTab === "carreras" ? (
                                    <>
                                        <div>
                                            <LabelWithTooltip label="Nombre de la Carrera" tooltip="Nombre completo oficial de la carrera." required />
                                            <input
                                                type="text"
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                placeholder="Ej: Licenciatura en Sistemas"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <LabelWithTooltip label="Facultad" tooltip="Facultad o departamento al que pertenece." required />
                                                <input
                                                    type="text"
                                                    value={formData.facultad}
                                                    onChange={(e) => setFormData({ ...formData, facultad: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                    placeholder="Ej: Ingeniería"
                                                />
                                            </div>
                                            <div>
                                                <LabelWithTooltip label="Duración" tooltip="Tiempo estimado para completar la carrera." />
                                                <input
                                                    type="text"
                                                    value={formData.duracion}
                                                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                    placeholder="Ej: 5 años"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <LabelWithTooltip label="Modalidad" tooltip="Forma de cursada (Presencial, Virtual, etc.)." />
                                                <select
                                                    value={formData.modalidad}
                                                    onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                >
                                                    <option value="Presencial">Presencial</option>
                                                    <option value="Virtual">Virtual</option>
                                                    <option value="Semipresencial">Semipresencial</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col justify-end pb-1">
                                                <LabelWithTooltip label="Inscripciones" tooltip="Indica si esta carrera tiene inscripciones abiertas actualmente." />
                                                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <div
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                            formData.inscripcionAbierta ? 'bg-green-500' : 'bg-gray-200'
                                                        }`}
                                                        onClick={() => setFormData({ ...formData, inscripcionAbierta: !formData.inscripcionAbierta })}
                                                    >
                                                        <span className={`${
                                                            formData.inscripcionAbierta ? 'translate-x-6' : 'translate-x-1'
                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`} />
                                                    </div>
                                                    <span className={`text-sm font-bold ${
                                                        formData.inscripcionAbierta ? 'text-green-600' : 'text-gray-400'
                                                    }`}>
                                                        {formData.inscripcionAbierta ? 'Abiertas' : 'Cerradas'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <LabelWithTooltip label="Link de Pre-inscripción" tooltip="URL a donde llevará el botón de pre-inscribirse (ej. Google Form, sistema externo). Dejar vacío si no hay link." />
                                            <input
                                                type="url"
                                                value={formData.linkInscripcion}
                                                onChange={(e) => setFormData({ ...formData, linkInscripcion: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                placeholder="https://docs.google.com/forms/..."
                                            />
                                        </div>
                                        <div>
                                            <LabelWithTooltip label="Descripción" tooltip="Resumen del plan de estudios y objetivos de la carrera." />
                                            <textarea
                                                value={formData.descripcion}
                                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all resize-none"
                                                placeholder="Descripción de la carrera..."
                                            />
                                        </div>

                                        {/* Videos for Carreras */}
                                        <div className="mt-4">
                                            <LabelWithTooltip label={`Videos (${formData.videos.length})`} tooltip="Enlaces a YouTube. Se mostrarán en la publicación." />
                                            <div className="flex gap-2 mb-3">
                                                <div className="relative flex-grow">
                                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="url"
                                                        value={newVideoUrl}
                                                        onChange={(e) => setNewVideoUrl(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                        placeholder="https://youtube.com/watch?v=..."
                                                    />
                                                </div>
                                                <label className="cursor-pointer px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center">
                                                    <Upload className="w-5 h-5" />
                                                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} disabled={isUploading} />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={addVideo}
                                                    className="px-4 py-3 rounded-xl bg-[#004d91] text-white hover:bg-[#003d71] transition-colors"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {formData.videos.length > 0 && (
                                                <div className="space-y-2">
                                                    {formData.videos.map((vid, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <Video className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <span className="text-sm text-gray-600 truncate max-w-[200px]">{vid}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => removeVideo(index)}
                                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Multiple Images for Carreras */}
                                        <div>
                                            <LabelWithTooltip label={`Imágenes (${formData.imagenes.length})`} tooltip="URLs de las imágenes. Recuerda que la primera será la portada." />
                                            <div className="flex gap-2 mb-3">
                                                <input
                                                    type="url"
                                                    value={newImageUrl}
                                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                                    className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                    placeholder="https://ejemplo.com/imagen.jpg"
                                                />
                                                <label className="cursor-pointer px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center">
                                                    <Upload className="w-5 h-5" />
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} disabled={isUploading} />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={addImage}
                                                    className="px-4 py-3 rounded-xl bg-[#004d91] text-white hover:bg-[#003d71] transition-colors"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-3">
                                                Nota: Si pones una URL y le das "Guardar" directamente, se agregará automáticamente.
                                            </p>
                                            {formData.imagenes.length > 0 && (
                                                <div className="grid grid-cols-3 gap-3">
                                                    {formData.imagenes.map((img, index) => (
                                                        <div key={index} className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100">
                                                            <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                                                            <button
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                            {index === 0 && (
                                                                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs">
                                                                    Principal
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <LabelWithTooltip label="Título" tooltip="Título principal de la novedad o evento." required />
                                            <input
                                                type="text"
                                                value={formData.titulo}
                                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                placeholder="Título de la novedad"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <LabelWithTooltip label="Categoría" tooltip="Tipo de publicación para clasificarla en la web." />
                                                <select
                                                    value={formData.categoria}
                                                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as Novedad["categoria"] })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                >
                                                    <option value="Noticia">Noticia</option>
                                                    <option value="Evento">Evento</option>
                                                    <option value="Convocatoria">Convocatoria</option>
                                                    <option value="Académico">Académico</option>
                                                    <option value="Galería">Galería (Fotos/Videos)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <LabelWithTooltip label="Fecha" tooltip="Fecha del evento o publicación." />
                                                <input
                                                    type="date"
                                                    value={formData.fecha}
                                                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <LabelWithTooltip label="Contenido" tooltip="Detalle completo de la novedad." />
                                            <textarea
                                                value={formData.contenido}
                                                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all resize-none"
                                                placeholder="Contenido de la novedad..."
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 ml-1">
                                            <input
                                                type="checkbox"
                                                id="destacada"
                                                checked={formData.destacada || false}
                                                onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
                                                className="w-5 h-5 rounded text-[#004d91] focus:ring-[#004d91] border-gray-300"
                                            />
                                            <label htmlFor="destacada" className="text-gray-700 font-medium cursor-pointer select-none">
                                                Destacar esta publicación
                                            </label>
                                        </div>

                                        {formData.destacada && (
                                            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 animate-in fade-in slide-in-from-top-2">
                                                <LabelWithTooltip label="Color de Destacado" tooltip="Elige un color para resaltar esta noticia." />
                                                <div className="flex flex-wrap gap-3 items-center">
                                                    {presetColors.map((color) => (
                                                        <button
                                                            key={color}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, color: color })}
                                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === color ? 'border-gray-900 scale-110 shadow-md' : 'border-transparent'}`}
                                                            style={{ backgroundColor: color }}
                                                            aria-label={`Seleccionar color ${color}`}
                                                        />
                                                    ))}
                                                    <div className="relative group ml-2">
                                                        <input
                                                            type="color"
                                                            value={formData.color || "#3b82f6"}
                                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-0 p-0 opacity-0 absolute inset-0"
                                                        />
                                                        <div className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center text-xs text-gray-500 font-bold group-hover:bg-gray-100 transition-colors pointer-events-none">
                                                            +
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500 font-mono">
                                                    Seleccionado: <span style={{ color: formData.color || '#3b82f6', fontWeight: 'bold' }}>{formData.color || '#3b82f6'}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <LabelWithTooltip label={`Videos (${formData.videos.length})`} tooltip="Enlaces a YouTube. Se mostrarán en la publicación." />
                                            <div className="flex gap-2 mb-3">
                                                <div className="relative flex-grow">
                                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="url"
                                                        value={newVideoUrl}
                                                        onChange={(e) => setNewVideoUrl(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                                        placeholder="https://youtube.com/watch?v=..."
                                                    />
                                                </div>
                                                <label className="cursor-pointer px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center">
                                                    <Upload className="w-5 h-5" />
                                                    <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} disabled={isUploading} />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={addVideo}
                                                    className="px-4 py-3 rounded-xl bg-[#004d91] text-white hover:bg-[#003d71] transition-colors"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {formData.videos.length > 0 && (
                                                <div className="space-y-2">
                                                    {formData.videos.map((vid, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <Video className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                                <span className="text-sm text-gray-600 truncate max-w-[200px]">{vid}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => removeVideo(index)}
                                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Multiple Images */}
                                <div>
                                    <LabelWithTooltip label={`Imágenes (${formData.imagenes.length})`} tooltip="URLs de las imágenes. Recuerda que la primera será la portada." />
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="url"
                                            value={newImageUrl}
                                            onChange={(e) => setNewImageUrl(e.target.value)}
                                            className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                        <label className="cursor-pointer px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center">
                                            <Upload className="w-5 h-5" />
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} disabled={isUploading} />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addImage}
                                            className="px-4 py-3 rounded-xl bg-[#004d91] text-white hover:bg-[#003d71] transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Nota: Si pones una URL y le das "Guardar" directamente, se agregará automáticamente.
                                    </p>
                                    {formData.imagenes.length > 0 && (
                                        <div className="grid grid-cols-3 gap-3">
                                            {formData.imagenes.map((img, index) => (
                                                <div key={index} className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100">
                                                    <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    {index === 0 && (
                                                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs">
                                                            Principal
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-3xl">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-3 rounded-xl bg-[#004d91] text-white font-medium hover:bg-[#003d71] transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div >
                )
            }

            {/* DELETE MODAL */}
            {
                deleteConfirm !== null && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl">
                            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar elemento?</h3>
                            <p className="text-gray-500 mb-8">Esta acción no se puede deshacer.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

function ConfigTab() {
    const [inscripcionesActive, setInscripcionesActive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [historiaSaving, setHistoriaSaving] = useState(false)
    const [historiaForm, setHistoriaForm] = useState({
        titulo: '',
        texto: '',
        imagen: '',
        galeria: [] as string[],
    })
    const [newGaleriaUrl, setNewGaleriaUrl] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [notification, setNotification] = useState<string | null>(null)

    const showNote = (msg: string) => {
        setNotification(msg)
        setTimeout(() => setNotification(null), 3000)
    }

    useEffect(() => {
        fetch('/api/config?all=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const cfg: Record<string, string> = {}
                    data.forEach((item: any) => { cfg[item.key] = item.value })
                    const inscConfig = data.find((i: any) => i.key === 'inscripciones_2026')
                    if (inscConfig) setInscripcionesActive(inscConfig.isActive)
                    setHistoriaForm({
                        titulo: cfg['historia_titulo'] || '',
                        texto: cfg['historia_texto'] || defaultHistoriaTexto,
                        imagen: cfg['historia_imagen'] || '',
                        galeria: cfg['historia_galeria'] ? JSON.parse(cfg['historia_galeria']) : [],
                    })
                } else {
                    if (data.isActive !== undefined) setInscripcionesActive(data.isActive)
                }
            })
    }, [])

    const toggleInscripciones = async () => {
        setLoading(true)
        try {
            const newState = !inscripcionesActive
            await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'inscripciones_2026', isActive: newState })
            })
            setInscripcionesActive(newState)
            showNote(newState ? 'Inscripciones activadas' : 'Inscripciones desactivadas')
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const saveHistoria = async () => {
        setHistoriaSaving(true)
        try {
            await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([
                    { key: 'historia_titulo', value: historiaForm.titulo },
                    { key: 'historia_texto', value: historiaForm.texto },
                    { key: 'historia_imagen', value: historiaForm.imagen },
                    { key: 'historia_galeria', value: JSON.stringify(historiaForm.galeria) },
                ])
            })
            showNote('Historia guardada correctamente')
        } catch (err) {
            showNote('Error al guardar')
        } finally {
            setHistoriaSaving(false)
        }
    }

    const uploadHistoriaFile = async (file: File, type: 'image' | 'video') => {
        const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) {
            showNote(`El archivo excede el límite (${type === 'image' ? '5MB' : '50MB'})`);
            return;
        }

        setIsUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData })
            const data = await res.json()
            if (data.url) {
                if (type === 'image' && !historiaForm.imagen) {
                    setHistoriaForm(prev => ({ ...prev, imagen: data.url }))
                } else {
                    setHistoriaForm(prev => ({ ...prev, galeria: [...prev.galeria, data.url] }))
                }
                showNote('Archivo subido')
            }
        } catch (e) {
            showNote('Error al subir')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-6">
            {notification && (
                <div className="fixed top-24 right-4 z-[60] px-6 py-4 rounded-xl shadow-2xl bg-green-600 text-white font-bold animate-in fade-in slide-in-from-top-10 duration-300">
                    {notification}
                </div>
            )}

            {/* Inscripciones toggle */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Configuración del Sitio</h2>
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">Modo Inscripciones 2026</h3>
                        <p className="text-gray-500 text-sm">
                            Activa o desactiva los carteles y anuncios de inscripción en la página principal.
                        </p>
                    </div>
                    <button
                        onClick={toggleInscripciones}
                        disabled={loading}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${inscripcionesActive ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        <span
                            className={`${inscripcionesActive ? 'translate-x-7' : 'translate-x-1'} inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm`}
                        />
                    </button>
                </div>
                <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-3">
                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                    <p><strong>Nota:</strong> Al desactivar esta opción, se ocultarán los banners de "Inscripciones Abiertas" automáticamente.</p>
                </div>
            </div>

            {/* Historia editable */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Sección Historia</h2>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Título de la sección</label>
                        <input
                            type="text"
                            value={historiaForm.titulo}
                            onChange={e => setHistoriaForm(prev => ({ ...prev, titulo: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                            placeholder="Ej: Creciendo junto a la comunidad"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Texto / Historia completa</label>
                        <p className="text-xs text-gray-400 mb-2">Contá la historia del Complejo: su creación, carreras que pasaron, logros, etc. El visitante podrá leer el comienzo y expandir para leer todo.</p>
                        <textarea
                            value={historiaForm.texto}
                            onChange={e => setHistoriaForm(prev => ({ ...prev, texto: e.target.value }))}
                            rows={10}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all resize-none"
                            placeholder="El Complejo Universitario Municipal nace en 2023 para brindar oportunidades reales de formación superior..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Imagen principal</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={historiaForm.imagen}
                                onChange={e => setHistoriaForm(prev => ({ ...prev, imagen: e.target.value }))}
                                className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            <label className="cursor-pointer px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadHistoriaFile(f, 'image') }} disabled={isUploading} />
                            </label>
                        </div>
                        {historiaForm.imagen && (
                            <img src={historiaForm.imagen} alt="Preview" className="mt-3 h-32 rounded-xl object-cover" />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Galería (fotos y videos)</label>
                        <p className="text-xs text-gray-400 mb-3">Se mostrarán como miniaturas debajo de la imagen principal. Podés poner fotos, links de YouTube o videos mp4.</p>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="url"
                                value={newGaleriaUrl}
                                onChange={e => setNewGaleriaUrl(e.target.value)}
                                className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004d91] focus:ring-2 focus:ring-[#004d91]/20 outline-none transition-all"
                                placeholder="URL de foto, video o YouTube"
                            />
                            <label className="cursor-pointer px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center">
                                <Upload className="w-5 h-5" />
                                <input type="file" accept="image/*,video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadHistoriaFile(f, f.type.startsWith('video') ? 'video' : 'image') }} disabled={isUploading} />
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    if (newGaleriaUrl.trim()) {
                                        setHistoriaForm(prev => ({ ...prev, galeria: [...prev.galeria, newGaleriaUrl.trim()] }))
                                        setNewGaleriaUrl('')
                                    }
                                }}
                                className="px-4 py-3 rounded-xl bg-[#004d91] text-white hover:bg-[#003d71] transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        {historiaForm.galeria.length > 0 && (
                            <div className="grid grid-cols-4 gap-3">
                                {historiaForm.galeria.map((url, i) => {
                                    const isVid = url.includes('youtube') || url.includes('youtu.be') || url.endsWith('.mp4') || url.endsWith('.webm')
                                    return (
                                        <div key={i} className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100">
                                            {isVid ? (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs p-2 text-center">
                                                    <Video className="w-5 h-5 mr-1" /> Video
                                                </div>
                                            ) : (
                                                <img src={url} alt={`Galería ${i + 1}`} className="w-full h-full object-cover" />
                                            )}
                                            <button
                                                onClick={() => setHistoriaForm(prev => ({ ...prev, galeria: prev.galeria.filter((_, j) => j !== i) }))}
                                                className="absolute top-1 right-1 p-1 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={saveHistoria}
                        disabled={historiaSaving}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#004d91] text-white font-bold hover:bg-[#003d71] transition-all shadow-lg disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {historiaSaving ? 'Guardando...' : 'Guardar Historia'}
                    </button>
                </div>
            </div>
        </div>
    )
}
