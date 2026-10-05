
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "0")
        const limit = parseInt(searchParams.get("limit") || "0")
        const category = searchParams.get("category")

        // Filter condition
        const where: any = {}
        if (category && category !== "Todas") {
            where.categoria = category
        }

        // If pagination params are present, return paginated data
        if (page > 0 || limit > 0) {
            const currentPage = page > 0 ? page : 1
            const currentLimit = limit > 0 ? limit : 10
            const skip = (currentPage - 1) * currentLimit

            const [novedades, total] = await Promise.all([
                prisma.novedad.findMany({
                    where,
                    orderBy: [{ destacada: "desc" }, { createdAt: "desc" }],
                    skip,
                    take: currentLimit,
                }),
                prisma.novedad.count({ where }),
            ])

            return NextResponse.json({
                data: novedades,
                pagination: {
                    total,
                    pages: Math.ceil(total / currentLimit),
                    currentPage,
                    limit: currentLimit,
                }
            })
        }

        // Legacy behavior: return all items if no params
        const novedades = await prisma.novedad.findMany({
            where,
            orderBy: [{ destacada: "desc" }, { createdAt: "desc" }]
        })
        return NextResponse.json(novedades)
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener novedades" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const novedad = await prisma.novedad.create({
            data: {
                titulo: data.titulo,
                categoria: data.categoria,
                fecha: new Date(data.fecha),
                contenido: data.contenido,
                imagen: data.imagen,
                imagenes: data.imagenes,
                destacada: data.destacada || false,
                video: data.video,
                videos: data.videos,
                color: data.color,
            },
        })
        return NextResponse.json(novedad)
    } catch (error) {
        return NextResponse.json({ error: "Error al crear novedad" }, { status: 500 })
    }
}
