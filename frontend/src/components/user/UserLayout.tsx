'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        alert('ログアウトに失敗しました。')
        return
      }
      router.push('/login')
    } catch {
      alert('ログアウト中にエラーが発生しました。')
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-800">みんなの図書館</h1>
            </div>

            {/* 検索バー */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="本のタイトルや著者で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {/* ここに検索アイコンが欲しい場合はSVG等を追加 */}
                {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div> */}
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="検索"
                >
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm hover:bg-green-700">
                    検索
                  </span>
                </button>
              </div>
            </form>

            <div className="flex items-center space-x-4">
              <Link href="/user" className="text-green-600 hover:text-green-800 font-medium">
                ホーム
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 みんなの図書館. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
