import type { ShopItem, Subject } from './types'

export const subjects: Subject[] = [
  { id: 'speaking', name: 'Speaking', description: 'Говори без пауз и ступора', color: '#8DBD2F', soft: '#EFF9D9', lessonIds: [1,4,6,8] },
  { id: 'listening', name: 'Listening', description: 'Понимай живую речь', color: '#4F9CF9', soft: '#EAF3FF', lessonIds: [3,7] },
  { id: 'words', name: 'Vocabulary', description: 'Слова, которые реально нужны', color: '#E89534', soft: '#FFF4DE', lessonIds: [2,6] },
  { id: 'grammar', name: 'Grammar', description: 'Без скучных правил и зубрёжки', color: '#9B7BE8', soft: '#F3EEFF', lessonIds: [1,5] },
  { id: 'reading', name: 'Reading', description: 'Читай от мемов до историй', color: '#24B6A5', soft: '#E7F8F4', lessonIds: [2,5,8] },
  { id: 'pronunciation', name: 'Pronunciation', description: 'Звучи уверенно и естественно', color: '#E56B85', soft: '#FFF0F3', lessonIds: [3,7] },
]

export const shopItems: ShopItem[] = [
  { id: 'fox', name: 'Fox, но с вайбом', description: 'Аватар для твоего профиля', price: 450, currency: 'coins', category: 'avatar', art: 'fox' },
  { id: 'owl', name: 'Профессор Speak', description: 'Аватар для профиля', price: 700, currency: 'coins', category: 'avatar', art: 'owl' },
  { id: 'mint', name: 'Fresh mint', description: 'Свежая тема интерфейса', price: 18, currency: 'gems', category: 'theme', art: 'mint' },
  { id: 'night', name: 'Midnight club', description: 'Для вечерних забегов', price: 24, currency: 'gems', category: 'theme', art: 'night' },
  { id: 'star', name: 'Стикер «SLAY!»', description: 'Для побед в word battle', price: 180, currency: 'coins', category: 'sticker', art: 'star' },
  { id: 'fire', name: 'Стикер «FIRE!»', description: 'Покажи свою серию', price: 180, currency: 'coins', category: 'sticker', art: 'fire' },
  { id: 'freeze', name: 'Streak saver', description: 'Защита серии на один день', price: 350, currency: 'coins', category: 'boost', art: 'freeze' },
  { id: 'hearts', name: '+5 жизней', description: 'Продолжай без ожидания', price: 12, currency: 'gems', category: 'boost', art: 'hearts' },
]
