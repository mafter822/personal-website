export const CLASSES = [
  {
    id: 'blade_master',
    name: '剑魂',
    icon: '⚔️',
   primaryStat: 'strength',
    description: '物理输出，武器伤害高',
    statBonus: { strength: 8 },
    unlockLevel: 15,
    awakenLevel: 40,
    skillTree: [
      { tier: 1, id: 'draw_sword', name: '拔刀术', type: 'passive', maxLevel: 5, effect: 'weaponDamage', value: 0.03, description: '武器伤害 +3%×Lv' },
      { tier: 1, id: 'triple_slash', name: '三段斩', type: 'active', maxLevel: 5, effect: 'damage', multiplier: 0.9, triggerRate: 0.22, description: '力量×0.9 造成伤害' },
      { tier: 2, id: 'iron_wall', name: '铁壁', type: 'passive', maxLevel: 5, effect: 'damageReduce', value: 0.02, description: '减伤 2%×Lv' },
      { tier: 2, id: 'sword_qi', name: '剑气', type: 'active', maxLevel: 5, effect: 'damage', multiplier: 1.2, description: '力量×1.2 AOE伤害' },
      { tier: 3, id: 'berserk', name: '狂暴', type: 'passive', maxLevel: 5, effect: 'critRate', value: 0.03, description: '暴击率 +3%×Lv' },
      { tier: 4, id: 'sword_array', name: '剑阵', type: 'active', maxLevel: 5, effect: 'multiHit', hits: 3, description: '多段攻击' },
      { tier: 5, id: 'sword_intent', name: '剑意', type: 'passive', maxLevel: 5, effect: 'allStats', value: 2, description: '全属性 +2×Lv' },
      { tier: 6, id: 'myriad_swords', name: '万剑归宗', type: 'active', maxLevel: 3, effect: 'damage', multiplier: 3.0, unlockLevel: 40, description: '觉醒技，超高伤害' },
      { tier: 7, id: 'sword_god', name: '剑神', type: 'passive', maxLevel: 1, effect: 'weaponDamageDouble', unlockLevel: 40, description: '觉醒被动，武器伤害翻倍' },
    ],
  },
  {
    id: 'shadow_dagger',
    name: '影刺',
    icon: '🗡️',
   primaryStat: 'agility',
    description: '暴击连击，闪避流',
    statBonus: { agility: 8 },
    unlockLevel: 15,
    awakenLevel: 40,
    skillTree: [
      { tier: 1, id: 'shadow_step', name: '影步', type: 'passive', maxLevel: 5, effect: 'dodgeRate', value: 0.03, description: '闪避率 +3%×Lv' },
      { tier: 1, id: 'backstab', name: '背刺', type: 'active', maxLevel: 5, effect: 'damage', multiplier: 1.5, critBonus: 0.2, description: '高暴击伤害' },
      { tier: 2, id: 'poison_blade', name: '毒刃', type: 'active', maxLevel: 5, effect: 'dot', damage: 5, turns: 3, description: '持续3回合中毒' },
      { tier: 2, id: 'shadow_clone', name: '影分身', type: 'passive', maxLevel: 5, effect: 'comboRate', value: 0.04, description: '连击率 +4%×Lv' },
      { tier: 3, id: 'assassinate', name: '暗杀', type: 'active', maxLevel: 5, effect: 'damage', multiplier: 2.0, lowHpBonus: true, description: '对低血量目标伤害翻倍' },
      { tier: 4, id: 'shadow_dance', name: '影舞', type: 'active', maxLevel: 5, effect: 'multiHit', hits: 4, description: '四连击' },
      { tier: 5, id: 'evasion_mastery', name: '闪避精通', type: 'passive', maxLevel: 5, effect: 'dodgeRate', value: 0.05, description: '闪避率 +5%×Lv' },
      { tier: 6, id: 'phantom_killer', name: '幻影杀手', type: 'active', maxLevel: 3, effect: 'damage', multiplier: 2.5, ignoreDefense: true, unlockLevel: 40, description: '觉醒技，无视防御' },
      { tier: 7, id: 'shadow_lord', name: '影帝', type: 'passive', maxLevel: 1, effect: 'dodgeRateDouble', unlockLevel: 40, description: '觉醒被动，闪避率翻倍' },
    ],
  },
  {
    id: 'iron_fist',
    name: '金刚',
    icon: '🛡️',
    primaryStat: 'health',
    description: '高防高血，反击坦克',
    statBonus: { maxHealth: 40 },
    unlockLevel: 15,
    awakenLevel: 40,
    skillTree: [
      { tier: 1, id: 'tough_skin', name: '铁皮', type: 'passive', maxLevel: 5, effect: 'damageReduce', value: 0.03, description: '减伤 3%×Lv' },
      { tier: 1, id: 'counter_attack', name: '反击', type: 'passive', maxLevel: 5, effect: 'counterRate', value: 0.05, description: '反击率 +5%×Lv' },
      { tier: 2, id: 'iron_body', name: '金刚体', type: 'passive', maxLevel: 5, effect: 'maxHealth', value: 20, description: '生命上限 +20×Lv' },
      { tier: 2, id: 'shield_bash', name: '盾击', type: 'active', maxLevel: 5, effect: 'damage', multiplier: 0.8, stunChance: 0.15, description: '伤害+眩晕' },
      { tier: 3, id: 'thorns', name: '荆棘', type: 'passive', maxLevel: 5, effect: 'reflectRate', value: 0.05, description: '反弹率 +5%×Lv' },
      { tier: 4, id: 'fortress', name: '堡垒', type: 'active', maxLevel: 5, effect: 'shield', amount: 50, description: '获得50点护盾' },
      { tier: 5, id: 'unbreakable', name: '不屈', type: 'passive', maxLevel: 5, effect: 'undyingChance', value: 0.05, description: '死亡时5%×Lv概率复活' },
      { tier: 6, id: 'earthquake', name: '地震', type: 'active', maxLevel: 3, effect: 'damage', multiplier: 2.0, stunChance: 0.5, unlockLevel: 40, description: '觉醒技，高伤+眩晕' },
      { tier: 7, id: 'titan', name: '泰坦', type: 'passive', maxLevel: 1, effect: 'damageReduceHalf', unlockLevel: 40, description: '觉醒被动，受到伤害减半' },
    ],
  },
  {
    id: 'wind_walker',
    name: '风行者',
    icon: '🌪️',
    primaryStat: 'speed',
    description: '速度优先，控制流',
    statBonus: { speed: 8 },
    unlockLevel: 15,
    awakenLevel: 40,
    skillTree: [
      { tier: 1, id: 'wind_walk', name: '风行', type: 'passive', maxLevel: 5, effect: 'speed', value: 3, description: '速度 +3×Lv' },
      { tier: 1, id: 'gale_strike', name: '疾风斩', type: 'active', maxLevel: 5, effect: 'damage', multiplier: 1.0, speedBonus: true, description: '速度越高伤害越高' },
      { tier: 2, id: 'wind_shield', name: '风盾', type: 'passive', maxLevel: 5, effect: 'dodgeRate', value: 0.04, description: '闪避率 +4%×Lv' },
      { tier: 2, id: 'tornado', name: '龙卷风', type: 'active', maxLevel: 5, effect: 'damage', multiplier: 1.3, description: '力量×1.3 AOE伤害' },
      { tier: 3, id: 'haste', name: '加速', type: 'passive', maxLevel: 5, effect: 'firstStrike', description: '必定先手' },
      { tier: 4, id: 'wind_prison', name: '风之牢笼', type: 'active', maxLevel: 5, effect: 'stun', turns: 2, description: '眩晕2回合' },
      { tier: 5, id: 'storm_blade', name: '风暴之刃', type: 'passive', maxLevel: 5, effect: 'damageAfterDodge', value: 0.1, description: '闪避后下次攻击+10%伤害' },
      { tier: 6, id: 'hurricane', name: '飓风', type: 'active', maxLevel: 3, effect: 'damage', multiplier: 2.2, ignoreSpeed: true, unlockLevel: 40, description: '觉醒技，无视速度' },
      { tier: 7, id: 'wind_god', name: '风神', type: 'passive', maxLevel: 1, effect: 'speedTriple', unlockLevel: 40, description: '觉醒被动，速度三倍' },
    ],
  },
]

export function getClassById(id) {
  return CLASSES.find(c => c.id === id)
}

export function getClassSkills(classId, allocatedSkills = {}) {
  const cls = getClassById(classId)
  if (!cls) return []
  return cls.skillTree.map(skill => ({
    ...skill,
    level: allocatedSkills[skill.id] || 0,
  }))
}

export function getAvailableSkills(classId, playerLevel, allocatedSkills = {}) {
  const cls = getClassById(classId)
  if (!cls) return []
  return cls.skillTree.filter(skill => {
    if (skill.unlockLevel && playerLevel < skill.unlockLevel) return false
    return true
  })
}

export function calculateClassStats(classId, allocatedSkills = {}) {
  const cls = getClassById(classId)
  if (!cls) return {}
  const stats = { ...cls.statBonus }
  cls.skillTree.forEach(skill => {
    const level = allocatedSkills[skill.id] || 0
    if (level > 0) {
      if (skill.effect === 'maxHealth') stats.maxHealth = (stats.maxHealth || 0) + skill.value * level
      if (skill.effect === 'speed') stats.speed = (stats.speed || 0) + skill.value * level
      if (skill.effect === 'allStats') {
        stats.strength = (stats.strength || 0) + skill.value * level
        stats.agility = (stats.agility || 0) + skill.value * level
        stats.speed = (stats.speed || 0) + skill.value * level
      }
    }
  })
  return stats
}
