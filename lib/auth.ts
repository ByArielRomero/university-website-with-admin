
import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username,
                    },
                })

                if (!user) {
                    return null
                }

                // Check for lockout
                if (user.lockoutUntil && user.lockoutUntil > new Date()) {
                    const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 60000)
                    throw new Error(`Cuenta bloqueada. Intenta en ${remainingMinutes} min.`)
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)

                if (!isValid) {
                    const newAttempts = (user.failedAttempts || 0) + 1

                    if (newAttempts >= 3) {
                        const lockoutTime = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                failedAttempts: newAttempts,
                                lockoutUntil: lockoutTime
                            }
                        })
                        throw new Error("Cuenta bloqueada por 15 minutos.")
                    } else {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { failedAttempts: newAttempts }
                        })
                        // We must return null to trigger 'CredentialsSignin', preventing NextAuth from swallowing the error
                        // but we can't easily pass the count message this way with standard NextAuth
                        // To show "Intentos: x/3", we would need to customize the SignIn flow more deeply.
                        // However, for the lockout, throwing an Error DOES work if we handle it in the frontend.
                        throw new Error(`Contraseña incorrecta. Intentos: ${newAttempts}/3`)
                    }
                }

                // Reset on success
                if ((user.failedAttempts ?? 0) > 0 || user.lockoutUntil) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            failedAttempts: 0,
                            lockoutUntil: null
                        }
                    })
                }

                return {
                    id: user.id + "",
                    username: user.username,
                    name: user.username,
                }
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    username: token.username,
                },
            }
        },
        jwt: ({ token, user }) => {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    username: user.username,
                }
            }
            return token
        },
    },
}
