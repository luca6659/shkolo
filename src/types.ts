export type PageId = 'home' | 'subjects' | 'shop' | 'leaderboard' | 'class' | 'profile'

export type Subject = {
  id: string
  name: string
  description: string
  color: string
  soft: string
  lessonIds: number[]
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
