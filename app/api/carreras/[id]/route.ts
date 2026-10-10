import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { deleteFileFromUrl } from "@/lib/files"

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }
        
        const params = await props.params
        const id = parseInt(params.id)
        const data = await req.json()

        const oldCarrera = await prisma.carrera.findUnique({ where: { id } })
        
        const carrera = await prisma.carrera.update({
            where: { id },
            data: {
                nombre: data.nombre,
                facultad: data.facultad,
                duracion: data.duracion,
                modalidad: data.modalidad,
                descripcion: data.descripcion,
                imagen: data.imagen,
                imagenes: data.imagenes,
                tipo: data.tipo,
                inscripcionAbierta: data.inscripcionAbierta,
                activa: data.activa,
                linkInscripcion: data.linkInscripcion,
            },
        })

        // File cleanup logic
        if (oldCarrera) {
            const newImagenes: string[] = data.imagenes || []
            const newImagen = data.imagen

            // Check old single image
            if (oldCarrera.imagen && oldCarrera.imagen !== newImagen && !newImagenes.includes(oldCarrera.imagen)) {
                await deleteFileFromUrl(oldCarrera.imagen)
            }
            
            // Check old multiple images
            if (oldCarrera.imagenes && Array.isArray(oldCarrera.imagenes)) {
                for (const oldImg of oldCarrera.imagenes as string[]) {
                    if (oldImg !== newImagen && !newImagenes.includes(oldImg)) {
                        await deleteFileFromUrl(oldImg)
                    }
                }
            }
        }

        return NextResponse.json(carrera)
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar carrera" }, { status: 500 })
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
        
        const oldCarrera = await prisma.carrera.findUnique({ where: { id } })
        await prisma.carrera.delete({ where: { id } })
        
        if (oldCarrera) {
            if (oldCarrera.imagen) {
                await deleteFileFromUrl(oldCarrera.imagen)
            }
            if (oldCarrera.imagenes && Array.isArray(oldCarrera.imagenes)) {
                for (const oldImg of oldCarrera.imagenes as string[]) {
                    await deleteFileFromUrl(oldImg)
                }
            }
        }
        
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar carrera" }, { status: 500 })
    }
}
