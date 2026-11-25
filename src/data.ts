import type { ShopItem, Subject } from './types'

export const subjects: Subject[] = [
  { id: 'speaking', name: 'Speaking', description: 'Говори без пауз и ступора', color: '#8DBD2F', soft: '#EFF9D9', progress: 68, lessons: 34, topics: ['Small talk', 'Daily routine', 'Friends & plans', 'Real-life talks', 'Free speaking'] },
  { id: 'listening', name: 'Listening', description: 'Понимай живую речь', color: '#4F9CF9', soft: '#EAF3FF', progress: 42, lessons: 21, topics: ['Sounds & words', 'Short dialogues', 'Street English', 'Podcasts', 'Fast speech'] },
  { id: 'words', name: 'Vocabulary', description: 'Слова, которые реально нужны', color: '#E89534', soft: '#FFF4DE', progress: 55, lessons: 28, topics: ['Everyday words', 'Phrasal verbs', 'Slang', 'Collocations', 'Word stories'] },
  { id: 'grammar', name: 'Grammar', description: 'Без скучных правил и зубрёжки', color: '#9B7BE8', soft: '#F3EEFF', progress: 24, lessons: 12, topics: ['Present Simple', 'Past & future', 'Questions', 'Modal verbs', 'Fluent grammar'] },
  { id: 'reading', name: 'Reading', description: 'Читай от мемов до историй', color: '#24B6A5', soft: '#E7F8F4', progress: 36, lessons: 18, topics: ['Short texts', 'Chats & memes', 'Stories', 'Articles', 'Book club'] },
  { id: 'pronunciation', name: 'Pronunciation', description: 'Звучи уверенно и естественно', color: '#E56B85', soft: '#FFF0F3', progress: 30, lessons: 15, topics: ['Tricky sounds', 'Word stress', 'Intonation', 'Connected speech', 'Accent lab'] },
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

export const leaders = [
  { name: 'Майя Соколова', className: 'A2 · 184 дня', xp: 1840, avatar: 'МС', color: '#F2B65C' },
  { name: 'Артём Волков', className: 'A2 · 96 дней', xp: 1695, avatar: 'АВ', color: '#7AB6EF' },
  { name: 'София Лебедева', className: 'B1 · 77 дней', xp: 1520, avatar: 'СЛ', color: '#D994C7' },
  { name: 'Ты', className: 'A2 · 12 дней', xp: 1280, avatar: 'АК', color: '#8DBD2F', me: true },
  { name: 'Даниил Орлов', className: 'A2 · 45 дней', xp: 1150, avatar: 'ДО', color: '#8D83D8' },
  { name: 'Лера Морозова', className: 'A1 · 32 дня', xp: 980, avatar: 'ЛМ', color: '#E68A79' },
  { name: 'Марк Белов', className: 'A2 · 28 дней', xp: 875, avatar: 'МБ', color: '#56B7B0' },
]

export const students = [
  { name: 'Алина Крылова', avatar: 'АК', lessons: 34, xp: 1280, progress: 86, status: 'Сегодня' },
  { name: 'Артём Волков', avatar: 'АВ', lessons: 42, xp: 1695, progress: 94, status: 'Сегодня' },
  { name: 'Вера Смирнова', avatar: 'ВС', lessons: 27, xp: 990, progress: 71, status: 'Вчера' },
  { name: 'Глеб Павлов', avatar: 'ГП', lessons: 19, xp: 720, progress: 54, status: '3 дня назад' },
  { name: 'Дарья Соколова', avatar: 'ДС', lessons: 31, xp: 1170, progress: 82, status: 'Сегодня' },
]
