
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params
        const id = parseInt(params.id)
        const data = await req.json()

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
        return NextResponse.json(carrera)
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar carrera" }, { status: 500 })
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params
        const id = parseInt(params.id)
        await prisma.carrera.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar carrera" }, { status: 500 })
    }
}
