"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf } from "lucide-react"
import { api } from "../../../services/api";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/employeeLogin", {
        email,
        password,
      })

      // Se o login for bem-sucedido, redirecione para o dashboard
      if (response?.data?.user) {
        login(response.data);
        router.push("/admin/dashboard")
      } else {
        setError(response.data.message || "Falha na autenticação")
      }
    } catch (err) {
      setError("Email ou senha inválidos. Tente novamente.")
      console.error("Erro de login:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-4 left-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Leaf className="h-12 w-12 text-green-600 mb-2" />
          <h1 className="text-xl font-medium text-gray-900">Administrador</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-gray-300 rounded-md"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-gray-300 rounded-md"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Processando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/admin/register" className="text-sm text-gray-500 hover:text-green-600">
            Registrar Administrador
          </Link>
        </div>
      </div>
    </div>
  )
}
