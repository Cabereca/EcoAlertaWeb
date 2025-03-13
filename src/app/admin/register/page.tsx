"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/services/api";
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function AdminRegister() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      console.log({
        name: fullName,
        email,
        registrationNumber,
        phone,
        password,
      });
      const response = await api.post("/employee", {
        name: fullName,
        email,
        registrationNumber,
        phone,
        password,
      })

      if (response?.data?.status === "ok") {
        router.push("/admin/login")
      } else {
        console.error(response?.data);
        setError("Erro ao tentar criar administrador. Tente novamente.")
      }
    } catch (err) {
      setError("Erro ao tentar criar administrador. Tente novamente.")
      console.error("Erro de registro:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")

    if (numbers.length <= 2) {
      return `(${numbers}`
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Leaf className="h-12 w-12 text-green-600 mb-2" />
          <h1 className="text-xl font-medium text-gray-900">Criar conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Nome completo*
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border-gray-300 rounded-md"
              placeholder="João Maria Oliveira"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email*
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-gray-300 rounded-md"
              placeholder="example@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="registrationNumber" className="text-sm font-medium text-gray-700">
              Número de registro*
            </label>
            <Input
              id="registrationNumber"
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
              className="w-full border-gray-300 rounded-md"
              placeholder="123456789"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Telefone*
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              required
              className="w-full border-gray-300 rounded-md"
              placeholder="(99) 9 9999-9999"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha*
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

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmar senha*
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Processando..." : "Cadastrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-500">
            Já possui conta?{" "}
            <Link href="/admin/login" className="text-green-600 hover:text-green-700">
              Faça login
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

