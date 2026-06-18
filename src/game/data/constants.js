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

export const CALC = {
  critRate: (agility) => Math.min(0.05 + agility * 0.002, 0.4),
  dodgeRate: (agility, speed) => Math.min(0.03 + agility * 0.001 + speed * 0.001, 0.35),
  blockRate: () => 0.15,
  counterRate: (agility) => Math.min(0.1 + agility * 0.001, 0.3),
  comboRate: (agility) => Math.min(0.05 + agility * 0.0015, 0.25),

  damage: (attacker, weapon, skill) => {
    let baseDmg
    if (weapon) {
      const min = weapon.baseDamage[0] ?? weapon.baseDamage
      const max = weapon.baseDamage[1] ?? weapon.baseDamage
      baseDmg = min + Math.random() * (max - min)
    } else {
      baseDmg = attacker.strength
    }
    const strBonus = attacker.strength * 0.5
    const skillMul = skill ? skill.damageMul || 1 : 1
    const weaponBonus = weapon ? (weapon.enhanceLevel || 0) * 0.1 : 0
    const raw = (baseDmg + strBonus) * skillMul * (1 + weaponBonus)
    const variance = 0.9 + Math.random() * 0.2
    return Math.floor(raw * variance)
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
