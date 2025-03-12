"use client"

import { useState, useEffect } from "react"
import { Leaf, Settings, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
// import { api } from "@/services/api"
import { useAuth } from "@/context/AuthContext"

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
  const { user } = useAuth();

  useEffect(() => {
    fetchOccurrences()
  }, [])

  const fetchOccurrences = async () => {
    try {
      setLoading(true)

      const token = user?.token;

      console.log(user, token);
      // const data = await api.get("/occurrence/all", {
      //   headers: {
      //     Authorization: `Bearer ${token}` // "Bearer" seguido do token
      //   }
      // })

      // Em vez de chamar a API, vamos usar os dados mockados diretamente
      // Simulando um delay para parecer uma chamada de API real
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Dados mockados diretamente no componente
      const mockData = [
        {
          id: "1",
          title: "Denúncia A",
          description: "Árvore caída bloqueando a passagem na Rua das Flores",
          status: "PENDENTE",
          dateTime: new Date("2025-03-03T10:30:00"),
          location: { lat: -37.7749, lng: -57.5806 },
          userId: "user1",
          ImageOccurrence: [
            {
              id: "img1",
              path: "/placeholder.svg?height=200&width=200",
              occurrenceId: "1",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: "2",
          title: "Denúncia B",
          description: "Descarte irregular de lixo próximo ao parque municipal",
          status: "PENDENTE",
          dateTime: new Date("2025-03-04T14:15:00"),
          location: { lat: -37.7742, lng: -57.5812 },
          userId: "user2",
          ImageOccurrence: [
            {
              id: "img2",
              path: "/placeholder.svg?height=200&width=200",
              occurrenceId: "2",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: "3",
          title: "Denúncia C",
          description: "Poluição no córrego da Avenida Principal",
          status: "PENDENTE",
          dateTime: new Date("2025-03-05T09:45:00"),
          location: { lat: -37.7755, lng: -57.58 },
          userId: "user3",
          ImageOccurrence: [],
        },
        {
          id: "4",
          title: "Denúncia D",
          description: "Queimada em área de preservação ambiental",
          status: "EM_ANDAMENTO",
          dateTime: new Date("2025-03-02T16:20:00"),
          location: { lat: -37.776, lng: -57.579 },
          userId: "user4",
          employeeId: "emp1",
          ImageOccurrence: [
            {
              id: "img3",
              path: "/placeholder.svg?height=200&width=200",
              occurrenceId: "4",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: "5",
          title: "Denúncia E",
          description: "Vazamento de esgoto na Rua dos Ipês",
          status: "EM_ANDAMENTO",
          dateTime: new Date("2025-03-01T11:10:00"),
          location: { lat: -37.7738, lng: -57.582 },
          userId: "user5",
          employeeId: "emp2",
          ImageOccurrence: [],
        },
        {
          id: "6",
          title: "Denúncia F",
          description: "Desmatamento ilegal na área de proteção ambiental",
          status: "CONCLUIDA",
          feedback: "Área isolada e responsáveis notificados. Iniciado processo de reflorestamento.",
          dateTime: new Date("2025-02-28T13:40:00"),
          location: { lat: -37.773, lng: -57.583 },
          userId: "user6",
          employeeId: "emp3",
          ImageOccurrence: [
            {
              id: "img4",
              path: "/placeholder.svg?height=200&width=200",
              occurrenceId: "6",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: "7",
          title: "Denúncia G",
          description: "Poluição sonora de estabelecimento comercial",
          status: "CONCLUIDA",
          feedback: "Estabelecimento autuado e adequações realizadas conforme legislação municipal.",
          dateTime: new Date("2025-02-25T20:15:00"),
          location: { lat: -37.7725, lng: -57.5835 },
          userId: "user7",
          employeeId: "emp1",
          ImageOccurrence: [],
        },
      ]

      setOccurrences(mockData)
    } catch (err) {
      setError("Erro ao carregar denúncias")
      console.error(err)
      setOccurrences([])
    } finally {
      setLoading(false)
    }
  }

  // Substitua a função handleStatusUpdate por esta versão que atualiza os dados localmente
  const handleStatusUpdate = async (id: string, newStatus: string, feedback?: string) => {
    try {
      setLoading(true)

      // Simula um delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Atualiza o estado localmente
      setOccurrences((prevOccurrences) =>
        prevOccurrences.map((occurrence) =>
          occurrence.id === id
            ? {
                ...occurrence,
                status: newStatus,
                ...(feedback && { feedback }),
              }
            : occurrence,
        ),
      )

      setFeedbackText((prev) => ({
        ...prev,
        [id]: "", // Limpa o feedback após salvar
      }))
    } catch (err) {
      setError("Erro ao atualizar status")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-red-200"
      case "EM_ANDAMENTO":
        return "bg-yellow-200"
      case "CONCLUIDA":
        return "bg-green-200"
      default:
        return "bg-gray-200"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-red-500 text-white"
      case "EM_ANDAMENTO":
        return "bg-blue-500 text-white"
      case "CONCLUIDA":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const renderOccurrenceContent = (occurrence: IGetOccurrence) => {
    const formattedDate = format(new Date(occurrence.dateTime), "dd/MM/yyyy")
    const statusText =
      {
        PENDENTE: "Aberta",
        EM_ANDAMENTO: "Em Andamento",
        CONCLUIDA: "Fechada",
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
                  <img
                    key={image.id}
                    src={image.path || "/placeholder.svg"}
                    alt="Imagem da ocorrência"
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {occurrence.status === "PENDENTE" && (
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => handleStatusUpdate(occurrence.id, "EM_ANDAMENTO")}
            >
              Iniciar
            </Button>
          )}

          {occurrence.status === "EM_ANDAMENTO" && (
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
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleStatusUpdate(occurrence.id, "CONCLUIDA", feedbackText[occurrence.id])}
              >
                Fechar Denúncia
              </Button>
            </div>
          )}

          {occurrence.status === "CONCLUIDA" && occurrence.feedback && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
              <p className="text-sm bg-gray-50 p-3 rounded mt-1">{occurrence.feedback}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-2xl font-semibold text-gray-900">Todas as denúncias</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-end space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
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
                  <AccordionContent>{renderOccurrenceContent(occurrence)}</AccordionContent>
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

