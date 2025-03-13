"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/services/api"
import { format } from "date-fns"
import { Leaf, SquareArrowRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react"

interface IGetOccurrence {
  id: string
  title: string
  description: string
  status: string
  feedback?: string
  dateTime: Date
  location: {
    lat: number
    lng: number
  }
  userId: string
  employeeId?: string
  ImageOccurrence: IGetImageOccurrence[]
}

interface IGetImageOccurrence {
  id: string
  path: string
  occurrenceId: string
  createdAt: Date
  updatedAt: Date
}

export default function AdminDashboard() {
  const [occurrences, setOccurrences] = useState<IGetOccurrence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({})
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchOccurrences()
  }, [])

  const fetchOccurrences = async () => {
    try {
      setLoading(true)

      const token = user?.token;

      console.log(user, token);
      const data = await api.get("/occurrence/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      data.data?.sort((a: IGetOccurrence, b: IGetOccurrence) => {
        if(a.status == b.status) return 0;
        if(a.status == "OPEN" || (a.status === "IN_PROGRESS" && b.status != "OPEN")) return -1;
        return 1;
      });

      setOccurrences(data.data);
    } catch (err) {
      setError("Erro ao carregar denúncias")
      console.error(err)
      setOccurrences([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: string, feedback?: string) => {
    try {
      setLoading(true)

      const res = await api.patch(`/occurrence/${id}/${newStatus}`, {
        feedback: feedback ?? "",
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      console.log(res.data);

      await fetchOccurrences();
    } catch (err) {
      setError("Erro ao atualizar status")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-200"
      case "IN_PROGRESS":
        return "bg-yellow-200"
      case "CLOSED":
        return "bg-green-200"
      default:
        return "bg-gray-200"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-500 text-white"
      case "IN_PROGRESS":
        return "bg-yellow-500 text-white"
      case "CLOSED":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const renderOccurrenceContent = (occurrence: IGetOccurrence) => {
    const formattedDate = format(new Date(occurrence.dateTime), "dd/MM/yyyy")
    const statusText =
      {
        OPEN: "Aberta",
        IN_PROGRESS: "Em Andamento",
        CLOSED: "Fechada",
      }[occurrence.status.toString()] || occurrence.status

    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(occurrence.status)}`}>
              {statusText}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Descrição</h4>
            <p className="text-sm">{occurrence.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Data</h4>
            <p className="text-sm">{formattedDate}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Localização</h4>
            <p className="text-sm">{`${occurrence.location.lat}, ${occurrence.location.lng}`}</p>
          </div>

          {occurrence.ImageOccurrence && occurrence.ImageOccurrence.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Imagens</h4>
              <div className="flex gap-2 mt-2">
                {occurrence.ImageOccurrence.map((image) => (
                  <Image
                    key={image.id}
                    src={image.path || "/placeholder.svg"}
                    alt="Imagem da ocorrência"
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {occurrence.status === "OPEN" && (
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => handleStatusUpdate(occurrence.id, "IN_PROGRESS")}
            >
              Iniciar
            </Button>
          )}

          {occurrence.status === "IN_PROGRESS" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
                <Textarea
                  value={feedbackText[occurrence.id] || ""}
                  onChange={(e) =>
                    setFeedbackText({
                      ...feedbackText,
                      [occurrence.id]: e.target.value,
                    })
                  }
                  placeholder="Descreva as ações tomadas e o resultado..."
                  className="w-full mt-1"
                />
              </div>
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => handleStatusUpdate(occurrence.id, "CLOSED", feedbackText[occurrence.id])}
              >
                Fechar Denúncia
              </Button>
            </div>
          )}

          {occurrence.status === "CLOSED" && occurrence.feedback && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
              <p className="text-sm bg-gray-50 p-3 rounded mt-1">{occurrence.feedback}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    const confirm = window.confirm("Tem certeza de que deseja sair?");
    if(confirm) {
      logout();
      router.push("/admin/login");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-2xl font-semibold text-gray-900">Todas as denúncias</h1>
          </div>
          <Button onClick={() => handleLogout()} variant="ghost" size="icon" className="bg-red-500 text-black px-10 rounded hover:bg-red-600">
            Sair
            <SquareArrowRight />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-end space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-sm text-gray-600">Pendente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-sm text-gray-600">Em andamento</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-sm text-gray-600">Concluída</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <Accordion type="single" collapsible className="space-y-2">
            {Array.isArray(occurrences) && occurrences.length > 0 ? (
              occurrences.map((occurrence) => (
                <AccordionItem
                  key={occurrence.id}
                  value={occurrence.id}
                  className={`${getStatusColor(occurrence.status)} rounded-lg overflow-hidden`}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <span className="text-left font-medium">{occurrence.title}</span>
                  </AccordionTrigger>
                  <AccordionContent >{renderOccurrenceContent(occurrence)}</AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">{error ? error : "Nenhuma denúncia encontrada"}</div>
            )}
          </Accordion>
        )}
      </main>
    </div>
  )
}

