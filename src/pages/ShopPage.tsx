import { useState } from 'react'
import { Check, Coins, Flame, Gem, Heart, MoonStar, Palette, ShieldCheck, Sparkles, Star, Sticker } from 'lucide-react'
import { shopItems } from '../data'
import { useSchool } from '../SchoolContext'
import { useApp } from '../AppContext'
import { PageHeading } from '../components/UI'

const categories = [
  { id: 'all', name: 'Все товары' }, { id: 'avatar', name: 'Аватары' },
  { id: 'theme', name: 'Темы' }, { id: 'sticker', name: 'Стикеры' }, { id: 'boost', name: 'Бустеры' },
]

function ItemArt({ art }: { art: string }) {
  if (art === 'fox') return <div className="shop-avatar-art fox-art"><span className="fox-ears" /><span className="fox-face"><i /><i /><b /></span><small>ЛО</small></div>
  if (art === 'owl') return <div className="shop-avatar-art owl-art"><img src="/mascot.svg" alt="Профессор Speak" /></div>
  if (art === 'mint') return <div className="theme-art mint-art"><Palette size={40} /><span /><span /></div>
  if (art === 'night') return <div className="theme-art night-art"><MoonStar size={42} /><span /><span /></div>
  if (art === 'star') return <div className="sticker-art star-art"><Star size={64} fill="currentColor" /><b>SLAY!</b></div>
  if (art === 'fire') return <div className="sticker-art fire-art"><Flame size={64} fill="currentColor" /><b>FIRE!</b></div>
  if (art === 'freeze') return <div className="boost-art freeze-art"><ShieldCheck size={58} /><Sparkles size={24} /></div>
  return <div className="boost-art hearts-art"><Heart size={60} fill="currentColor" /><b>+5</b></div>
}

export default function ShopPage() {
  const { owned, mutate, setAvatar } = useSchool()
  const { showToast } = useApp()
  const [buying, setBuying] = useState(false)
  async function buyItem(item: typeof shopItems[number]) {
    setBuying(true)
    try {
      if (await mutate('school_buy', { p_item: item.id })) {
        if (item.category === 'avatar') setAvatar(item.id === 'fox' ? 'ЛО' : 'СП')
        showToast('Покупка готова!', item.name)
      }
    } finally { setBuying(false) }
  }
  const [category, setCategory] = useState('all')
  const visible = category === 'all' ? shopItems : shopItems.filter((item) => item.category === category)

  return (
    <div className="page-container">
      <PageHeading title="Drop shop" text="Меняй монеты и кристаллы на стиль, стикеры и полезные бустеры" />
      <div className="shop-hero">
        <div><span className="shop-hero-label"><Sticker size={18} /> FRESH DROP</span><h2>Your English.<br />Your vibe.</h2><p>Собирай монеты за разговоры и собери свой уникальный look.</p></div>
        <img src="/mascot.svg" alt="Талисман Школо с новой коллекцией" />
      </div>
      <div className="category-tabs" role="tablist" aria-label="Категории магазина">
        {categories.map((item) => <button key={item.id} role="tab" aria-selected={category === item.id} className={category === item.id ? 'active' : ''} onClick={() => setCategory(item.id)}>{item.name}</button>)}
      </div>
      <div className="shop-grid">
        {visible.map((item) => {
          const isOwned = owned.includes(item.id)
          return <article className="shop-item" key={item.id}>
            <div className={`shop-item-art art-${item.category}`}><ItemArt art={item.art} /></div>
            <h3>{item.name}</h3><p>{item.description}</p>
            <button className={isOwned ? 'owned-button' : 'buy-button'} onClick={() => buyItem(item)} disabled={isOwned || buying}>
              {isOwned ? <><Check size={18} />Куплено</> : <>{item.currency === 'coins' ? <Coins size={18} /> : <Gem size={18} />}{item.price}</>}
            </button>
          </article>
        })}
      </div>
    </div>
  )
}
