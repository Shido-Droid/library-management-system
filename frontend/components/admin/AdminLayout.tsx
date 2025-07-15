'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuItems = [
    { name: 'ダッシュボード', href: '/admin', icon: '' },
    { name: '本の管理', href: '/admin/books', icon: '' },
    { name: '貸出管理', href: '/admin/borrowings', icon: '' },
    { name: '利用者管理', href: '/admin/users', icon: '' },
    { name: '統計', href: '/admin/statistics', icon: '' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              =
            </button>
            <h1 className="text-xl font-semibold text-gray-800 ml-2">
              図書管理システム - 管理者
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            ログアウト
          </button>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out`}
        >
          <nav className="mt-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        {/* オーバーレイ (モバイル) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 lg:ml-0 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
