'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Book {
  id?: string
  title: string
  author: string
  isbn: string
  description: string
  category: string
  status: string
}

interface BookModalProps {
  isOpen: boolean
  onClose: () => void
  book?: Book | null
  onSuccess: () => void
}

export default function BookModal({ isOpen, onClose, book, onSuccess }: BookModalProps) {
  const [formData, setFormData] = useState<Book>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    status: 'available',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (book) {
      setFormData(book)
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        category: '',
        status: 'available',
      })
    }
  }, [book])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (book?.id) {
        // 更新
        const { error } = await supabase
          .from('books')
          .update({
            title: formData.title,
            author: formData.author,
            isbn: formData.isbn,
            description: formData.description,
            category: formData.category,
            status: formData.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', book.id)

        if (error) throw error
      } else {
        // 新規作成
        const { error } = await supabase.from('books').insert([formData])

        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving book:', error)
      alert('エラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {book ? '本の編集' : '新しい本の追加'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">著者</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">カテゴリを選択</option>
                  <option value="小説">小説</option>
                  <option value="技術書">技術書</option>
                  <option value="ビジネス">ビジネス</option>
                  <option value="歴史">歴史</option>
                  <option value="自己啓発">自己啓発</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状態</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">貸出可能</option>
                  <option value="borrowed">貸出中</option>
                  <option value="maintenance">修理中</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '保存中...' : book ? '更新' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
