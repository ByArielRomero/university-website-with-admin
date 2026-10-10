import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { deleteFileFromUrl } from "@/lib/files"

export const dynamic = "force-dynamic"

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }
        
        const params = await props.params
        const id = parseInt(params.id)
        const data = await req.json()

        const oldNovedad = await prisma.novedad.findUnique({ where: { id } })
        
        const novedad = await prisma.novedad.update({
            where: { id },
            data: {
                titulo: data.titulo,
                categoria: data.categoria,
                fecha: new Date(data.fecha),
                contenido: data.contenido,
                imagen: data.imagen,
                imagenes: data.imagenes,
                destacada: data.destacada,
                video: data.video,
                videos: data.videos,
                color: data.color,
            },
        })

        // File cleanup logic
        if (oldNovedad) {
            const newImagenes: string[] = data.imagenes || []
            const newImagen = data.imagen
            const newVideos: string[] = data.videos || []
            const newVideo = data.video

            // Check old single image
            if (oldNovedad.imagen && oldNovedad.imagen !== newImagen && !newImagenes.includes(oldNovedad.imagen)) {
                await deleteFileFromUrl(oldNovedad.imagen)
            }
            
            // Check old multiple images
            if (oldNovedad.imagenes && Array.isArray(oldNovedad.imagenes)) {
                for (const oldImg of oldNovedad.imagenes as string[]) {
                    if (oldImg !== newImagen && !newImagenes.includes(oldImg)) {
                        await deleteFileFromUrl(oldImg)
                    }
                }
            }

            // Check old single video
            if (oldNovedad.video && oldNovedad.video !== newVideo && !newVideos.includes(oldNovedad.video)) {
                await deleteFileFromUrl(oldNovedad.video)
            }

            // Check old multiple videos
            if (oldNovedad.videos && Array.isArray(oldNovedad.videos)) {
                for (const oldVid of oldNovedad.videos as string[]) {
                    if (oldVid !== newVideo && !newVideos.includes(oldVid)) {
                        await deleteFileFromUrl(oldVid)
                    }
                }
            }
        }

        return NextResponse.json(novedad)
    } catch (error) {
        console.error("Error updating novedad:", error)
        return NextResponse.json({ error: "Error al actualizar novedad", details: String(error) }, { status: 500 })
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }
        
        const params = await props.params
        const id = parseInt(params.id)
        
        const oldNovedad = await prisma.novedad.findUnique({ where: { id } })
        await prisma.novedad.delete({ where: { id } })
        
        if (oldNovedad) {
            if (oldNovedad.imagen) {
                await deleteFileFromUrl(oldNovedad.imagen)
            }
            if (oldNovedad.imagenes && Array.isArray(oldNovedad.imagenes)) {
                for (const oldImg of oldNovedad.imagenes as string[]) {
                    await deleteFileFromUrl(oldImg)
                }
            }
            if (oldNovedad.video) {
                await deleteFileFromUrl(oldNovedad.video)
            }
            if (oldNovedad.videos && Array.isArray(oldNovedad.videos)) {
                for (const oldVid of oldNovedad.videos as string[]) {
                    await deleteFileFromUrl(oldVid)
                }
            }
        }
        
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar novedad" }, { status: 500 })
    }
}
