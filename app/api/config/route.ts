
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const all = searchParams.get('all')
        const key = searchParams.get('key')

        if (all === 'true') {
            const configs = await prisma.systemConfig.findMany()
            return NextResponse.json(configs)
        }

        if (key) {
            const config = await prisma.systemConfig.findUnique({ where: { key } })
            return NextResponse.json(config || { key, value: '', isActive: false })
        }

        // Backward compat — return inscripciones_2026
        const config = await prisma.systemConfig.findUnique({
            where: { key: "inscripciones_2026" }
        })
        return NextResponse.json(config || { key: "inscripciones_2026", isActive: true })
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener config" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json()

        // Support batch updates (array of {key, value, isActive})
        if (Array.isArray(data)) {
            const results = await Promise.all(
                data.map((item: { key: string; value?: string; isActive?: boolean }) =>
                    prisma.systemConfig.upsert({
                        where: { key: item.key },
                        update: {
                            ...(item.value !== undefined && { value: item.value }),
                            ...(item.isActive !== undefined && { isActive: item.isActive }),
                        },
                        create: {
                            key: item.key,
                            value: item.value ?? '',
                            isActive: item.isActive ?? true,
                        }
                    })
                )
            )
            return NextResponse.json(results)
        }

        // Single key update (backward compat)
        const config = await prisma.systemConfig.upsert({
            where: { key: data.key || "inscripciones_2026" },
            update: {
                ...(data.value !== undefined && { value: data.value }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
            create: {
                key: data.key || "inscripciones_2026",
                value: data.value ?? 'Inscripciones 2026',
                isActive: data.isActive ?? true,
            }
        })
        return NextResponse.json(config)
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar config" }, { status: 500 })
    }
}
