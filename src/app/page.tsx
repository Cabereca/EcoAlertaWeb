import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-evenly p-8 bg-[#f8fff8]">
        <div className="w-full max-w-5xl flex flex-col items-center justify-between">
          <div className="flex flex-col md:flex-row w-full justify-around items-center">
            <div className="logo mb-4 md:mb-0">
              <Image src="/logo.svg" alt="Logo" width={200} height={200} />
            </div>

            <div className="flex flex-col items-center gap-4">
              <h2 className="text-5xl font-medium">Bem-vindo(a)</h2>
              <Link
                href="/login"
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded text-2xl transition-colors"
              >
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="m-auto text-sm text-gray-600">Powered by Cabereca</footer>
    </div>
  )
}