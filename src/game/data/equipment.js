export const EQUIPMENT_SLOTS = {
  weapon: { name: '武器', icon: '🗡️' },
  helmet: { name: '头盔', icon: '⛑️' },
  armor: { name: '铠甲', icon: '🛡️' },
  boots: { name: '靴子', icon: '👢' },
  accessory: { name: '饰品', icon: '💍' },
}

export const EQUIPMENT_QUALITY = {
  common: { name: '白色', color: '#9ca3af', dropRate: 0.5 },
  rare: { name: '蓝色', color: '#3b82f6', dropRate: 0.3 },
  epic: { name: '紫色', color: '#a855f7', dropRate: 0.15 },
  legendary: { name: '橙色', color: '#f97316', dropRate: 0.04 },
  mythic: { name: '粉色', color: '#ec4899', dropRate: 0.009 },
  divine: { name: '金色', color: '#eab308', dropRate: 0.001 },
}

export const EQUIPMENT_DATABASE = [
  // 头盔
  { id: 'eq_iron_helmet', name: '铁头盔', slot: 'helmet', quality: 'common', stats: { maxHealth: 20 }, reqLevel: 1 },
  { id: 'eq_steel_helmet', name: '钢盔', slot: 'helmet', quality: 'rare', stats: { maxHealth: 50, strength: 2 }, reqLevel: 10 },
  { id: 'eq_dragon_helmet', name: '龙鳞盔', slot: 'helmet', quality: 'epic', stats: { maxHealth: 100, strength: 5, agility: 3 }, reqLevel: 25 },
  { id: 'eq_phoenix_helmet', name: '凤凰冠', slot: 'helmet', quality: 'legendary', stats: { maxHealth: 150, strength: 8, agility: 5 }, reqLevel: 40 },

  // 铠甲
  { id: 'eq_leather_armor', name: '皮甲', slot: 'armor', quality: 'common', stats: { maxHealth: 30 }, reqLevel: 1 },
  { id: 'eq_chain_armor', name: '锁子甲', slot: 'armor', quality: 'rare', stats: { maxHealth: 70, agility: 2 }, reqLevel: 10 },
  { id: 'eq_plate_armor', name: '板甲', slot: 'armor', quality: 'epic', stats: { maxHealth: 150, agility: 4, speed: 2 }, reqLevel: 25 },
  { id: 'eq_dragon_armor', name: '龙鳞甲', slot: 'armor', quality: 'legendary', stats: { maxHealth: 200, agility: 6, speed: 4 }, reqLevel: 40 },

  // 靴子
  { id: 'eq_leather_boots', name: '皮靴', slot: 'boots', quality: 'common', stats: { speed: 3 }, reqLevel: 1 },
  { id: 'eq_iron_boots', name: '铁靴', slot: 'boots', quality: 'rare', stats: { speed: 8, agility: 2 }, reqLevel: 10 },
  { id: 'eq_wind_boots', name: '风行靴', slot: 'boots', quality: 'epic', stats: { speed: 15, agility: 5 }, reqLevel: 25 },
  { id: 'eq_phoenix_boots', name: '凤凰靴', slot: 'boots', quality: 'legendary', stats: { speed: 20, agility: 8 }, reqLevel: 40 },

  // 饰品
  { id: 'eq_power_ring', name: '力量戒指', slot: 'accessory', quality: 'common', stats: { strength: 3 }, reqLevel: 1 },
  { id: 'eq_speed_ring', name: '疾风戒指', slot: 'accessory', quality: 'rare', stats: { speed: 5, agility: 3 }, reqLevel: 10 },
  { id: 'eq_crit_amulet', name: '暴击护符', slot: 'accessory', quality: 'epic', stats: { agility: 8, strength: 5 }, reqLevel: 25 },
  { id: 'eq_dragon_pendant', name: '龙牙吊坠', slot: 'accessory', quality: 'legendary', stats: { strength: 10, agility: 8, speed: 6 }, reqLevel: 40 },
]

export const EQUIPMENT_SETS = [
  {
    id: 'set_dragon',
    name: '龙鳞套装',
    pieces: ['eq_dragon_helmet', 'eq_dragon_armor'],
    bonus: { maxHealth: 100, strength: 10 },
    description: '2件套: 生命+100, 力量+10',
  },
  {
    id: 'set_phoenix',
    name: '凤凰套装',
    pieces: ['eq_phoenix_helmet', 'eq_phoenix_boots'],
    bonus: { speed: 15, agility: 10 },
    description: '2件套: 速度+15, 敏捷+10',
  },
]

export function getEquipmentById(id) {
  return EQUIPMENT_DATABASE.find(e => e.id === id)
}

export function getEquipmentBySlot(slot) {
  return EQUIPMENT_DATABASE.filter(e => e.slot === slot)
}

export function getEnhanceCost(quality) {
  const map = { common: 5, rare: 10, epic: 15, legendary: 20, mythic: 25, divine: 30 }
  return map[quality] || 5
}

export function getEnhanceBonus(level) {
  return level * 0.1
}
