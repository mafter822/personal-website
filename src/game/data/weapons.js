import { LEVEL_RANGES, getLevelRange } from './constants.js'

export const WEAPONS = [
  // Lv1-4 开放
  { id: 'w_brick', name: '板砖', type: 'small', quality: 'common', baseDamage: [10, 20], reqLevel: 1, special: { type: 'throwable' }, desc: '新手村神器，街头斗殴必备',
    weights: [28.6, 17.8, 8.0, 4.2, 2.7, 2.1, 1.9, 1.8],
    evolutions: [
      { count: 3, name: '回旋板砖', baseDamage: [15, 28], special: { type: 'combo', chance: 0.25 }, desc: '投掷后飞回，25%连击' },
      { count: 6, name: '超级板砖', baseDamage: [25, 40], special: { type: 'combo', chance: 0.4 }, desc: '回旋+40%连击，传说之砖' },
    ] },
  { id: 'w_needle', name: '绣花针', type: 'small', quality: 'common', baseDamage: [5, 15], reqLevel: 1, special: { type: 'combo', chance: 0.2 }, desc: '最危险的东西往往最小',
    weights: [25.4, 15.8, 7.1, 3.8, 2.4, 1.9, 1.7, 1.6],
    evolutions: [
      { count: 3, name: '暴雨梨花针', baseDamage: [8, 22], special: { type: 'combo', chance: 0.35 }, desc: '针如雨下，35%连击' },
    ] },
  { id: 'w_dagger', name: '短剑', type: 'small', quality: 'common', baseDamage: [3, 8], reqLevel: 1, special: { type: 'combo', chance: 0.2 }, desc: '一寸短一寸险',
    weights: [23.8, 14.9, 6.6, 3.5, 2.3, 1.7, 1.6, 1.5] },
  { id: 'w_relay', name: '接力棒', type: 'small', quality: 'common', baseDamage: [6, 10], reqLevel: 1, special: { type: 'combo', chance: 0.15 }, desc: '运动会用的那种',
    weights: [22.2, 13.9, 6.2, 3.3, 2.1, 1.6, 1.5, 1.4] },

  // Lv5-9 开放
  { id: 'w_hammer', name: '充气锤子', type: 'medium', quality: 'uncommon', baseDamage: [20, 35], reqLevel: 5, special: { type: 'stun', chance: 0.1 }, desc: 'Q宠乐园最受欢迎的玩具',
    weights: [0, 9.9, 11.5, 6.1, 3.9, 3.0, 2.7, 2.6],
    evolutions: [
      { count: 3, name: '超级充气锤', baseDamage: [28, 45], special: { type: 'stun', chance: 0.2 }, desc: '更大更Q弹，20%眩晕' },
    ] },
  { id: 'w_frying_pan', name: '平底锅', type: 'medium', quality: 'uncommon', baseDamage: [18, 22], reqLevel: 5, special: { type: 'dodgeCounter', chance: 0.05 }, desc: '厨房神器，更是防身利器',
    weights: [0, 9.9, 11.5, 6.1, 3.9, 3.0, 2.7, 2.6] },
  { id: 'w_wooden_sword', name: '木剑', type: 'medium', quality: 'uncommon', baseDamage: [10, 25], reqLevel: 5, special: { type: 'ignoreUndying' }, desc: '虽然是木头的',
    weights: [0, 7.9, 9.9, 5.3, 3.4, 2.6, 2.3, 2.3] },
  { id: 'w_pen', name: '判官笔', type: 'small', quality: 'uncommon', baseDamage: [5, 8], reqLevel: 5, special: { type: 'sureHit', throwable: true }, desc: '点穴利器，无处可逃',
    weights: [0, 7.9, 8.9, 4.7, 3.0, 2.3, 2.1, 2.0] },
  { id: 'w_blowgun', name: '小李飞刀', type: 'hidden', quality: 'rare', baseDamage: [15, 30], reqLevel: 5, special: { type: 'sureHit', instakill: 0.1 }, desc: '例不虚发，江湖上最快的刀',
    weights: [0, 2.0, 2.7, 1.4, 0.9, 0.7, 0.6, 0.6] },

  // Lv10-14 开放
  { id: 'w_bat', name: '棒球棒', type: 'medium', quality: 'common', baseDamage: [20, 28], reqLevel: 10, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '全垒打的快感',
    weights: [0, 0, 8.9, 12.2, 7.8, 6.0, 5.4, 5.3],
    evolutions: [
      { count: 3, name: '烈焰棒球棒', baseDamage: [28, 38], special: { type: 'combo', chance: 0.2 }, desc: '燃烧的全垒打，20%连击' },
    ] },
  { id: 'w_broad_sword', name: '宽刃剑', type: 'large', quality: 'common', baseDamage: [18, 28], reqLevel: 10, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '剑身宽阔，势大力沉',
    weights: [0, 0, 7.1, 9.4, 6.0, 4.6, 4.2, 4.0] },
  { id: 'w_shovel', name: '铲子', type: 'large', quality: 'uncommon', baseDamage: [15, 36], reqLevel: 10, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '挖坑埋人两不误',
    weights: [0, 0, 5.3, 7.3, 4.7, 3.6, 3.2, 3.2],
    evolutions: [
      { count: 3, name: '黄金铲子', baseDamage: [22, 45], special: { type: 'combo', chance: 0.2 }, desc: '黄金打造，挖出财富，20%连击' },
    ] },
  { id: 'w_dragon_halberd', name: '青龙戟', type: 'large', quality: 'uncommon', baseDamage: [20, 36], reqLevel: 10, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '青龙偃月，威震华夏',
    weights: [0, 0, 3.5, 7.5, 4.8, 3.7, 3.3, 3.2] },
  { id: 'w_folding_stool', name: '折凳', type: 'hidden', quality: 'rare', baseDamage: [20, 30], reqLevel: 10, special: { type: 'stun', turns: 2 }, desc: '七大武器之首',
    weights: [0, 0, 2.8, 5.3, 3.4, 2.6, 2.3, 2.3] },

  // Lv15-19 开放
  { id: 'w_sickle', name: '狂魔镰', type: 'large', quality: 'uncommon', baseDamage: [20, 36], reqLevel: 15, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '死神同款，收割生命的利刃',
    weights: [0, 0, 0, 5.6, 9.4, 7.2, 6.5, 6.3] },
  { id: 'w_ring_knife', name: '环扣刀', type: 'large', quality: 'uncommon', baseDamage: [20, 36], reqLevel: 15, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '刀身带环，挥动时叮当作响',
    weights: [0, 0, 0, 5.6, 9.4, 7.2, 6.5, 6.3] },
  { id: 'w_sickle_moon', name: '偃月刀', type: 'large', quality: 'uncommon', baseDamage: [20, 36], reqLevel: 15, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '关二爷同款，重达八十二斤',
    weights: [0, 0, 0, 5.6, 9.4, 7.2, 6.5, 6.3] },
  { id: 'w_spear', name: '红缨枪', type: 'large', quality: 'rare', baseDamage: [26, 52], reqLevel: 15, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '枪挑一条线，红缨夺命魂',
    weights: [0, 0, 0, 3.0, 6.8, 5.2, 4.7, 4.5] },

  // Lv20-24 开放
  { id: 'w_iron_hammer', name: '铁锤', type: 'large', quality: 'uncommon', baseDamage: [20, 38], reqLevel: 20, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '铁匠铺里最大的那把',
    weights: [0, 0, 0, 0, 7.2, 14.5, 13.0, 12.6] },
  { id: 'w_rubber_hammer', name: '橡皮锤', type: 'large', quality: 'rare', baseDamage: [33, 60], reqLevel: 20, special: { type: 'combo', chance: 0.1, throwable: true }, desc: '看起来软软的，砸起来硬硬的',
    weights: [0, 0, 0, 0, 3.9, 7.4, 6.6, 6.5] },
  { id: 'w_true_hammer', name: '真·充气锤子', type: 'medium', quality: 'epic', baseDamage: [28, 43], reqLevel: 20, special: { type: 'stun', chance: 0.3, penetrate: true }, desc: '充气锤子的强化版',
    weights: [0, 0, 0, 0, 2.4, 4.1, 3.7, 3.6] },

  // Lv25-29 开放
  { id: 'w_trident', name: '三叉戟', type: 'large', quality: 'epic', baseDamage: [25, 50], reqLevel: 25, special: { type: 'rest', turns: 1 }, desc: '海神波塞冬的武器，使用后需要休息一回合',
    weights: [0, 0, 0, 0, 0, 4.5, 10.6, 10.4] },
  { id: 'w_axe', name: '开山斧', type: 'large', quality: 'epic', baseDamage: [40, 70], reqLevel: 25, special: { type: 'crit', chance: 0.3, multiplier: 1.5 }, desc: '一斧开山，二斧断江',
    weights: [0, 0, 0, 0, 0, 3.0, 6.6, 6.5] },

  // Lv35+ 开放
  { id: 'w_true_trident', name: '真·三叉戟', type: 'large', quality: 'legendary', baseDamage: [35, 65], reqLevel: 35, special: { type: 'noRest' }, desc: '完全掌控海神之力，无需休息的终极版本',
    weights: [0, 0, 0, 0, 0, 0, 0, 2.6] },
]

export const WEAPON_TOTAL_WEIGHTS = [315, 253, 282, 266, 207, 135, 75, 39]

export function getAvailableWeaponsForLevel(level) {
  const rangeIndex = getLevelRange(level)
  return WEAPONS.filter(w => w.weights[rangeIndex] > 0)
}

export function rollWeapon(level, ownedWeaponIds) {
  const rangeIndex = getLevelRange(level)
  const available = getAvailableWeaponsForLevel(level)

  const weighted = available
    .filter(w => !ownedWeaponIds.includes(w.id))
    .map(w => ({ weapon: w, weight: w.weights[rangeIndex] }))

  if (weighted.length === 0) return null

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0)
  let roll = Math.random() * totalWeight

  for (const { weapon, weight } of weighted) {
    roll -= weight
    if (roll <= 0) return weapon
  }

  return weighted[weighted.length - 1].weapon
}

export function getWeaponById(id) {
  return WEAPONS.find(w => w.id === id)
}

export function getWeaponsByType(type) {
  if (type === 'all') return WEAPONS
  return WEAPONS.filter(w => w.type === type)
}

export function getDamageRange(weapon, enhanceLevel = 0) {
  const bonus = enhanceLevel * 0.1
  return [
    Math.floor(weapon.baseDamage[0] * (1 + bonus)),
    Math.floor(weapon.baseDamage[1] * (1 + bonus)),
  ]
}

export function getWeaponEnhanceCost(quality) {
  const map = { common: 5, uncommon: 5, rare: 10, epic: 10, legendary: 15 }
  return map[quality] || 5
}
