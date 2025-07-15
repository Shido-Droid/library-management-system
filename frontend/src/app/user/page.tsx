'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import UserLayout from '@/components/user/UserLayout'
import BookCard from '@/components/user/BookCard'

interface Book {
  id: string
  title: string
  author: string
  category: string
  status: string
  description: string
  image_url?: string
}

export default function UserHomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('created_at')

  const categories = ['小説', '技術書', 'ビジネス', '歴史', '自己啓発']

  useEffect(() => {
    fetchBooks()
  }, [selectedCategory, sortBy])

  const fetchBooks = async () => {
    try {
      let query = supabase.from('books').select('*')

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      // 並び替え
      switch (sortBy) {
        case 'title':
          query = query.order('title')
          break
        case 'author':
          query = query.order('author')
          break
        case 'created_at':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      const { data, error } = await query

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* ウェルカムセクション */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">図書館へようこそ!</h2>
          <p className="text-xl opacity-90">豊富なコレクションからお気に入りの一冊を見つけてください</p>
        </div>

        {/* フィルターとソート */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="created_at">新着順</option>
              <option value="title">タイトル順</option>
              <option value="author">著者順</option>
            </select>
          </div>
        </div>

        {/* 本の統計 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{books.length}</div>
              <div className="text-gray-600">総蔵書数</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {books.filter((book) => book.status === 'available').length}
              </div>
              <div className="text-gray-600">貸出可能</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {books.filter((book) => book.status === 'borrowed').length}
              </div>
              <div className="text-gray-600">貸出中</div>
            </div>
          </div>
        </div>

        {/* 本の一覧 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4"></div>
            <div className="text-xl text-gray-600 mb-2">本が見つかりませんでした</div>
            <div className="text-gray-500">別のカテゴリを試してみてください</div>
          </div>
        )}
      </div>
    </UserLayout>
  )
}
