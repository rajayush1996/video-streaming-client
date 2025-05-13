'use client'

import React from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'

interface FeaturedBlogProps {
  id: string
  thumbnail: string
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  readTime: string
}

const FeaturedBlog = ({ id, thumbnail, title, excerpt, author, date, category, readTime }: FeaturedBlogProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden">
      {/* Left: Image */}
      <div className="relative min-h-[320px] md:min-h-[400px] h-full w-full">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      {/* Right: Purple Glass Card */}
      <div className="flex flex-col justify-center h-full bg-gradient-to-br from-[#2d0b4e]/90 via-[#4f1d8c]/80 to-[#7c3aed]/80 glass-card p-8 md:p-12 rounded-r-3xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block px-4 py-1 rounded-full bg-reel-purple-700 text-white text-xs font-semibold">
            {category}
          </span>
          <span className="text-xs text-white/70">{readTime} read</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-poppins leading-tight">
          {title}
        </h2>
        <p className="text-lg text-white/90 mb-8 line-clamp-3 font-inter">
          {excerpt}
        </p>
        <div className="flex items-center mb-8">
          <span className="text-base text-white/80">By <span className="font-semibold text-white">{author}</span> <span className="mx-2">•</span> {date}</span>
        </div>
        <Link href={`/blog/${id}`}>
          <button className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-lg bg-reel-purple-500 hover:bg-reel-purple-600 text-white shadow-lg transition-all">
            <BookOpen className="w-5 h-5" /> Read Article
          </button>
        </Link>
      </div>
    </div>
  )
}

export default FeaturedBlog
