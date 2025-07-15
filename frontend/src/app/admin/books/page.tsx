'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  status: string
  created_at: string
}

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      let query = supabase.from('books').select('*').order('created_at', { ascending: false })

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
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

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('この本を削除しますか？')) return

    try {
      const { error } = await supabase.from('books').delete().eq('id', bookId)

      if (error) throw error

      setBooks(books.filter((book) => book.id !== bookId))
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      borrowed: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    }
    const labels = {
      available: '貸出可能',
      borrowed: '貸出中',
      maintenance: '修理中',
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  // --- モーダルのフォーム用の状態（編集・追加用） ---
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [isbn, setIsbn] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('available')

  // 編集対象の本が変わったらフォームにセット
  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title)
      setAuthor(editingBook.author)
      setIsbn(editingBook.isbn)
      setCategory(editingBook.category)
      setStatus(editingBook.status)
    } else {
      setTitle('')
      setAuthor('')
      setIsbn('')
      setCategory('')
      setStatus('available')
    }
  }, [editingBook])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBook) {
        // 更新
        const { error } = await supabase
          .from('books')
          .update({ title, author, isbn, category, status })
          .eq('id', editingBook.id)
        if (error) throw error
      } else {
        // 新規追加
        const { error } = await supabase
          .from('books')
          .insert([{ title, author, isbn, category, status }])
        if (error) throw error
      }
      setIsModalOpen(false)
      fetchBooks()
    } catch (error) {
      console.error('Error saving book:', error)
      alert('保存中にエラーが発生しました。')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">本の管理</h2>
          <button
            onClick={() => {
              setEditingBook(null)
              setIsModalOpen(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + 新しい本を追加
          </button>
        </div>

        {/* 検索とフィルター */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="タイトルまたは著者で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべてのカテゴリ</option>
                <option value="小説">小説</option>
                <option value="技術書">技術書</option>
                <option value="ビジネス">ビジネス</option>
                <option value="歴史">歴史</option>
                <option value="自己啓発">自己啓発</option>
              </select>
            </div>
            <div>
              <button
                onClick={fetchBooks}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                検索
              </button>
            </div>
          </div>
        </div>

        {/* 本の一覧テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  本の情報
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISBN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.isbn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(book.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingBook(book)
                        setIsModalOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && (
            <div className="text-center py-8 text-gray-500">本が見つかりませんでした。</div>
          )}
        </div>

        {/* --- モーダル --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">{editingBook ? '本を編集' : '新しい本を追加'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">タイトル</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">著者</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ISBN</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">カテゴリ</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">選択してください</option>
                    <option value="小説">小説</option>
                    <option value="技術書">技術書</option>
                    <option value="ビジネス">ビジネス</option>
                    <option value="歴史">歴史</option>
                    <option value="自己啓発">自己啓発</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">状態</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="available">貸出可能</option>
                    <option value="borrowed">貸出中</option>
                    <option value="maintenance">修理中</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
