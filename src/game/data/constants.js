export const GAME_VERSION = '1.0.0'

export const SAVE_KEY = 'penguin-battle-save'

export const MAX_LEVEL = 50

export const STATS = {
  strength: { name: '力量', icon: '⚔️', desc: '影响攻击力' },
  agility: { name: '敏捷', icon: '🌀', desc: '影响闪避和暴击' },
  speed: { name: '速度', icon: '⚡', desc: '影响先手和闪避' },
  health: { name: '生命', icon: '❤️', desc: '生命上限' },
}

export const EXP_PER_LEVEL = (level) => Math.floor(100 * Math.pow(1.15, level - 1))

export const STAT_GROWTH = {
  strength: 3,
  agility: 2,
  speed: 2,
  health: 15,
}

export const STAMINA_MAX = 100
export const STAMINA_RECOVER_RATE = 1
export const STAMINA_RECOVER_INTERVAL = 60000

export const SPIRIT_PER_LEVEL = 2
export const SPIRIT_PER_WIN = 3

export const ENERGY_PER_ATTACK = 10
export const ENERGY_PER_HIT = 5
export const ENERGY_MAX = 100

export const CALC = {
  critRate: (agility) => Math.min(0.05 + agility * 0.002, 0.4),
  dodgeRate: (agility, speed) => Math.min(0.03 + agility * 0.001 + speed * 0.001, 0.35),
  blockRate: () => 0.15,
  counterRate: (agility) => Math.min(0.1 + agility * 0.001, 0.3),
  comboRate: (agility) => Math.min(0.05 + agility * 0.0015, 0.25),

  prdCheck: (baseRate, counter) => {
    const actualRate = Math.min(baseRate * (counter + 1), 1)
    if (Math.random() < actualRate) {
      return { triggered: true, counter: 0 }
    }
    return { triggered: false, counter: counter + 1 }
  },

  damage: (attacker, weapon, skill) => {
    const str = Number.isFinite(attacker.strength) ? attacker.strength : 0
    let baseDmg
    if (weapon) {
      const min = weapon.baseDamage?.[0] ?? 0
      const max = weapon.baseDamage?.[1] ?? min
      baseDmg = min + Math.random() * Math.max(0, max - min)
    } else {
      baseDmg = str
    }
    const strBonus = str * 0.3
    const skillMul = Number.isFinite(skill?.damageMul) ? skill.damageMul : 1
    const enhanceLvl = Number.isFinite(weapon?.enhanceLevel) ? weapon.enhanceLevel : 0
    const weaponBonus = enhanceLvl * 0.1
    const raw = (baseDmg + strBonus) * skillMul * (1 + weaponBonus)
    const variance = 0.9 + Math.random() * 0.2
    return Math.max(1, Math.floor(raw * variance))
  },

  reduceDamage: (defense, damage) => {
    const reduction = Math.min(defense / (defense + 100), 0.7)
    return Math.floor(damage * (1 - reduction))
  },
}

export const QUALITY_COLORS = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f97316',
}

export const QUALITY_NAMES = {
  common: '凡器',
  uncommon: '灵器',
  rare: '仙器',
  epic: '神器',
  legendary: '真·神器',
}

export const SKILL_CATEGORIES = {
  all: '全部',
  stat: '属性',
  buff: '增幅',
  attack: '攻击',
  control: '控制',
  defense: '防御',
  special: '特殊',
}

export const WEAPON_TYPES = {
  all: '全部',
  small: '小型',
  medium: '中型',
  large: '大型',
  hidden: '暗器',
}

export const WEAPON_QUALITY = {
  common: { name: '凡器', color: '#9ca3af' },
  uncommon: { name: '灵器', color: '#22c55e' },
  rare: { name: '仙器', color: '#3b82f6' },
  epic: { name: '神器', color: '#a855f7' },
  legendary: { name: '真·神器', color: '#f97316' },
}

export const LEVEL_RANGES = [
  { min: 1, max: 4, label: 'Lv1-4' },
  { min: 5, max: 9, label: 'Lv5-9' },
  { min: 10, max: 14, label: 'Lv10-14' },
  { min: 15, max: 19, label: 'Lv15-19' },
  { min: 20, max: 24, label: 'Lv20-24' },
  { min: 25, max: 29, label: 'Lv25-29' },
  { min: 30, max: 34, label: 'Lv30-34' },
  { min: 35, max: 99, label: 'Lv35+' },
]

export function getLevelRange(level) {
  for (let i = 0; i < LEVEL_RANGES.length; i++) {
    if (level >= LEVEL_RANGES[i].min && level <= LEVEL_RANGES[i].max) {
      return i
    }
  }
  return LEVEL_RANGES.length - 1
}
