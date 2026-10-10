import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const carreras = await prisma.carrera.findMany({
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(carreras)
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener carreras" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }
        const data = await req.json()
        const carrera = await prisma.carrera.create({
            data: {
                nombre: data.nombre,
                facultad: data.facultad,
                duracion: data.duracion,
                modalidad: data.modalidad,
                descripcion: data.descripcion,
                imagen: data.imagen,
                imagenes: data.imagenes,
                tipo: data.tipo || "Carrera",
                inscripcionAbierta: data.inscripcionAbierta ?? true,
                activa: data.activa ?? true,
                linkInscripcion: data.linkInscripcion || null,
            },
        })
        return NextResponse.json(carrera)
    } catch (error) {
        return NextResponse.json({ error: "Error al crear carrera" }, { status: 500 })
    }
}
