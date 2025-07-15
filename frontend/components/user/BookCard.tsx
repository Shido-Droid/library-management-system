'use client'

import { useState } from 'react'

interface Book {
  id: string
  title: string
  author: string
  category: string
  status: string
  description: string
  image_url?: string
}

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const [showModal, setShowModal] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            貸出可能
          </span>
        )
      case 'borrowed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            貸出中
          </span>
        )
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            修理中
          </span>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div onClick={() => setShowModal(true)}>
          {/* 本の画像 */}
          <div className="aspect-w-3 aspect-h-4 bg-gray-200">
            {book.image_url ? (
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-colors duration-200">
                <span className="text-4xl"></span>
              </div>
            )}
          </div>

          {/* 本の情報 */}
          <div className="p-4">
            <div className="mb-2">{getStatusBadge(book.status)}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">著者: {book.author}</p>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {book.category}
              </span>
              <span className="text-sm text-green-600 font-medium group-hover:text-green-700">
                詳細を見る →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-25"
              onClick={() => setShowModal(false)}
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    X
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">著者</div>
                    <div className="text-gray-900">{book.author}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">カテゴリ</div>
                    <div className="text-gray-900">{book.category}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">貸出状況</div>
                    <div className="mt-1">{getStatusBadge(book.status)}</div>
                  </div>
                  {book.description && (
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">説明</div>
                      <div className="text-gray-900 text-sm leading-relaxed">
                        {book.description}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
