import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const items: { id: number; orden: number }[] = await req.json()

        // Update all orders in parallel
        await Promise.all(
            items.map(({ id, orden }) =>
                prisma.carrera.update({
                    where: { id },
                    data: { orden },
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error reordering:", error)
        return NextResponse.json({ error: "Error al reordenar carreras" }, { status: 500 })
    }
}
