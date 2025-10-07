'use client'

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            search
          </span>
          <input
            className="w-48 rounded bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 transition placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-600"
            placeholder="Buscar..."
            type="text"
          />
        </div>
        <button className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  )
}