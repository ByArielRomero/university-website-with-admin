
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"



export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params
        const id = parseInt(params.id)
        const data = await req.json()

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
        return NextResponse.json(novedad)
    } catch (error) {
        console.error("Error updating novedad:", error)
        return NextResponse.json({ error: "Error al actualizar novedad", details: String(error) }, { status: 500 })
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params
        const id = parseInt(params.id)
        await prisma.novedad.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar novedad" }, { status: 500 })
    }
}
