export const SHOP_ITEMS = [
  {
    id: 'stamina_potion_small',
    name: '体力药水(小)',
    icon: '🧪',
    description: '恢复30点体力',
    price: 100,
    dailyLimit: 5,
    effect: { type: 'stamina', amount: 30 },
  },
  {
    id: 'stamina_potion_large',
    name: '体力药水(大)',
    icon: '🧪',
    description: '恢复80点体力',
    price: 250,
    dailyLimit: 3,
    effect: { type: 'stamina', amount: 80 },
  },
  {
    id: 'spirit_potion',
    name: '精魄药水',
    icon: '💎',
    description: '获得50精魄',
    price: 200,
    dailyLimit: 3,
    effect: { type: 'spirit', amount: 50 },
  },
  {
    id: 'crit_scroll',
    name: '致命一击卷轴',
    icon: '📜',
    description: '本场暴击率+15%',
    price: 150,
    dailyLimit: 5,
    effect: { type: 'buff', stat: 'crit', amount: 0.15, duration: 1 },
  },
  {
    id: 'heal_pill',
    name: '回春丹',
    icon: '💊',
    description: '回复50%生命',
    price: 300,
    dailyLimit: 3,
    effect: { type: 'heal', percent: 0.5 },
  },
  {
    id: 'enhance_stone',
    name: '强化石',
    icon: '🔨',
    description: '装备强化材料',
    price: 500,
    dailyLimit: 2,
    effect: { type: 'material', item: 'enhance_stone' },
  },
  {
    id: 'protect_ticket',
    name: '保护券',
    icon: '🛡️',
    description: '强化失败不掉级',
    price: 800,
    dailyLimit: 1,
    effect: { type: 'material', item: 'protect_ticket' },
  },
]

export function getShopItemById(id) {
  return SHOP_ITEMS.find(item => item.id === id)
}
