export const WEAPONS = [
  // 小型武器
  { id: 'w_brick', name: '板砖', type: 'small', quality: 'common', baseDamage: [10, 20], reqLevel: 1, special: null, desc: '新手村神器，街头斗殴必备' },
  { id: 'w_needle', name: '绣花针', type: 'small', quality: 'common', baseDamage: [5, 15], reqLevel: 1, special: { type: 'combo', chance: 0.2 }, desc: '最危险的东西往往最小' },
  { id: 'w_dagger', name: '短剑', type: 'small', quality: 'common', baseDamage: [3, 8], reqLevel: 1, special: { type: 'combo', chance: 0.2 }, desc: '一寸短一寸险' },
  { id: 'w_shovel', name: '铲子', type: 'large', quality: 'uncommon', baseDamage: [15, 36], reqLevel: 10, special: { type: 'combo', chance: 0.1 }, desc: '挖坑埋人两不误' },
  { id: 'w_pen', name: '判官笔', type: 'small', quality: 'uncommon', baseDamage: [5, 8], reqLevel: 5, special: { type: 'sureHit' }, desc: '点穴利器，无处可逃' },
  { id: 'w_bat', name: '棒球棒', type: 'medium', quality: 'common', baseDamage: [20, 28], reqLevel: 10, special: { type: 'combo', chance: 0.1 }, desc: '全垒打的快感' },
  { id: 'w_frying_pan', name: '平底锅', type: 'medium', quality: 'uncommon', baseDamage: [18, 22], reqLevel: 5, special: { type: 'dodgeCounter', chance: 0.05 }, desc: '厨房神器，更是防身利器' },
  { id: 'w_wooden_sword', name: '木剑', type: 'medium', quality: 'uncommon', baseDamage: [10, 25], reqLevel: 5, special: { type: 'ignoreUndying' }, desc: '虽然是木头的' },
  { id: 'w_hammer', name: '充气锤子', type: 'medium', quality: 'uncommon', baseDamage: [20, 35], reqLevel: 5, special: { type: 'ignore', chance: 0.1 }, desc: 'Q宠乐园最受欢迎的玩具' },
  { id: 'w_sickle', name: '偃月刀', type: 'large', quality: 'uncommon', baseDamage: [20, 36], reqLevel: 15, special: { type: 'combo', chance: 0.1 }, desc: '关二爷同款' },
  { id: 'w_spear', name: '红缨枪', type: 'large', quality: 'rare', baseDamage: [26, 52], reqLevel: 15, special: { type: 'combo', chance: 0.1 }, desc: '枪挑一条线，红缨夺命魂' },
  { id: 'w_iron_hammer', name: '铁锤', type: 'large', quality: 'uncommon', baseDamage: [20, 38], reqLevel: 20, special: { type: 'combo', chance: 0.1 }, desc: '铁匠铺里最大的那把' },
  { id: 'w_rubber_hammer', name: '橡皮锤', type: 'large', quality: 'rare', baseDamage: [33, 60], reqLevel: 20, special: { type: 'combo', chance: 0.1 }, desc: '看起来软软的' },
  { id: 'w_trident', name: '三叉戟', type: 'large', quality: 'epic', baseDamage: [25, 50], reqLevel: 25, special: { type: 'rest', turns: 1 }, desc: '海神波塞冬的武器' },
  { id: 'w_relay', name: '接力棒', type: 'small', quality: 'common', baseDamage: [6, 10], reqLevel: 1, special: { type: 'combo', chance: 0.15 }, desc: '运动会用的那种' },
  { id: 'w_blowgun', name: '小李飞刀', type: 'hidden', quality: 'rare', baseDamage: [15, 30], reqLevel: 5, special: { type: 'sureHit', instakill: 0.1 }, desc: '例不虚发，江湖上最快的刀' },
  { id: 'w_folding_stool', name: '折凳', type: 'hidden', quality: 'rare', baseDamage: [20, 30], reqLevel: 10, special: { type: 'ignore', turns: 2 }, desc: '七大武器之首' },
  { id: 'w_dragon_halberd', name: '青龙戟', type: 'large', quality: 'uncommon', baseDamage: [20, 36], reqLevel: 10, special: { type: 'combo', chance: 0.1 }, desc: '青龙偃月，威震华夏' },
  { id: 'w_broad_sword', name: '宽刃剑', type: 'large', quality: 'common', baseDamage: [18, 28], reqLevel: 10, special: { type: 'combo', chance: 0.1 }, desc: '剑身宽阔，势大力沉' },
  { id: 'w_axe', name: '开山斧', type: 'large', quality: 'epic', baseDamage: [40, 70], reqLevel: 25, special: { type: 'crit', chance: 0.3, multiplier: 1.5 }, desc: '一斧开山，二斧断江' },
  { id: 'w_true_trident', name: '真·三叉戟', type: 'large', quality: 'legendary', baseDamage: [35, 65], reqLevel: 35, special: { type: 'noRest' }, desc: '完全掌控海神之力' },
]

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
