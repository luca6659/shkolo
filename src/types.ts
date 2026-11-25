export type PageId = 'home' | 'subjects' | 'shop' | 'leaderboard' | 'class' | 'profile'

export type Subject = {
  id: string
  name: string
  description: string
  color: string
  soft: string
  progress: number
  lessons: number
  topics: string[]
}

export type ShopItem = {
  id: string
  name: string
  description: string
  price: number
  currency: 'coins' | 'gems'
  category: 'avatar' | 'theme' | 'sticker' | 'boost'
  art: string
}

export type Assignment = {
  id: number
  title: string
  subject: string
  deadline: string
  done: number
  total: number
}
