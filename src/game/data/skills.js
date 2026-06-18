export const SKILL_RARITY = {
  T0: { name: '神技', color: '#ef4444', weight: 0 },
  T1: { name: '核心', color: '#f97316', weight: 1 },
  T2: { name: '输出', color: '#eab308', weight: 2 },
  T3: { name: '辅助', color: '#22c55e', weight: 3 },
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

export const SKILLS = [
  // T0 神技
  { id: 'spc_dead', name: '装死', category: 'special', icon: '💀', maxLevel: 1, tier: 'T0', effect: 'undying', desc: '生命降为0时免死一次，回复到1点', spiritCost: 2, unlockLevel: 10,
    weights: [0, 0, 1.9, 2.0, 2.0, 1.9, 1.6, 1.3] },
  { id: 'talent_all', name: '均衡发展', category: 'stat', icon: '🌈', maxLevel: 10, tier: 'T0', statBonus: { stat: 'all', amount: 1 }, desc: '全属性+1/级', spiritCost: 2, unlockLevel: 1,
    weights: [5.0, 3.5, 2.7, 2.4, 2.4, 2.7, 3.0, 3.4] },
  { id: 'def_rebound', name: '大海无量', category: 'defense', icon: '🌊', maxLevel: 5, tier: 'T0', reboundChance: 0.3, reboundDamage: 1.0, desc: '反弹率30%+(等级-1)×3%，反弹100%伤害', spiritCost: 2, unlockLevel: 15,
    weights: [0, 0, 0, 1.3, 1.6, 1.7, 1.5, 1.2] },
  { id: 'spc_storm', name: '势如暴雨', category: 'special', icon: '⛈️', maxLevel: 1, tier: 'T0', effect: 'multiAttack', desc: '连续投掷最多3种武器，按武器伤害累加', spiritCost: 2, unlockLevel: 15,
    weights: [0, 0, 0, 1.0, 1.2, 1.2, 1.0, 0.6] },
  { id: 'spc_instakill', name: '神来一击', category: 'special', icon: '✨', maxLevel: 1, tier: 'T0', instakillChance: 0.05, desc: '5%几率将对手生命降至1点', spiritCost: 2, unlockLevel: 20,
    weights: [0, 0, 0, 0, 1.2, 1.8, 1.9, 1.7] },
  { id: 'atk_palm', name: '如来神掌', category: 'attack', icon: '✋', maxLevel: 1, tier: 'T0', damageMul: 0.5, hpPercent: true, desc: '打掉对手当前一半生命', spiritCost: 2, unlockLevel: 30,
    weights: [0, 0, 0, 0, 0, 0, 1.5, 1.9] },
  { id: 'spc_dodge', name: '避重就轻', category: 'special', icon: '🛡️', maxLevel: 5, tier: 'T0', desc: '中小型武器伤害+15%，对大型武器闪避+20%', spiritCost: 2, unlockLevel: 30,
    weights: [0, 0, 0, 0, 0, 0, 3.0, 4.4] },

  // T1 核心属性/被动
  { id: 'talent_str', name: '天生大力', category: 'stat', icon: '💪', maxLevel: 10, tier: 'T1', statBonus: { stat: 'strength', amount: 1 }, desc: '力量+1/级（上限+10）', spiritCost: 8, unlockLevel: 1,
    weights: [30.0, 21.0, 14.7, 12.5, 11.1, 11.5, 10.8, 11.2] },
  { id: 'talent_spd', name: '快人一步', category: 'stat', icon: '⚡', maxLevel: 10, tier: 'T1', statBonus: { stat: 'speed', amount: 1 }, desc: '速度+1/级（上限+10）', spiritCost: 10, unlockLevel: 1,
    weights: [30.0, 21.0, 14.7, 12.5, 11.1, 11.5, 10.8, 11.2] },
  { id: 'talent_agi', name: '身手敏捷', category: 'stat', icon: '🏃', maxLevel: 10, tier: 'T1', statBonus: { stat: 'agility', amount: 1 }, desc: '敏捷+1/级（上限+10）', spiritCost: 4, unlockLevel: 1,
    weights: [20.0, 14.0, 10.8, 9.6, 10.9, 12.8, 14.5, 16.7] },
  { id: 'talent_hp', name: '强健身躯', category: 'stat', icon: '❤️', maxLevel: 10, tier: 'T1', statBonus: { stat: 'health', amount: 5 }, desc: '生命上限+5/级（上限+50）', spiritCost: 2, unlockLevel: 1,
    weights: [15.0, 10.5, 9.6, 9.1, 10.7, 12.7, 15.9, 19.2] },
  { id: 'buff_weapon', name: '武器好手', category: 'buff', icon: '🗡️', maxLevel: 5, tier: 'T1', weaponDamageBonus: 0.05, desc: '武器伤害+5%/级（上限+25%）', spiritCost: 2, unlockLevel: 5,
    weights: [0, 7.0, 6.0, 5.1, 4.5, 3.8, 3.0, 2.4] },
  { id: 'buff_unarmed', name: '肉搏好手', category: 'buff', icon: '🥊', maxLevel: 5, tier: 'T1', damageBonus: 0.06, desc: '空手伤害+6%/级（上限+30%）', spiritCost: 2, unlockLevel: 5,
    weights: [0, 7.0, 6.0, 5.1, 4.5, 3.8, 3.0, 2.4] },
  { id: 'spc_combo', name: '无影手', category: 'special', icon: '🤲', maxLevel: 5, tier: 'T1', comboBonus: 0.02, desc: '连击率+2%/级（上限+10%）', spiritCost: 2, unlockLevel: 5,
    weights: [0, 5.6, 4.9, 4.1, 3.2, 2.6, 2.0, 1.5] },
  { id: 'def_thick', name: '皮糙肉厚', category: 'defense', icon: '🛡️', maxLevel: 5, tier: 'T1', damageReduce: 0.02, desc: '所受伤害-2%/级（上限-10%）', spiritCost: 2, unlockLevel: 10,
    weights: [0, 0, 3.7, 4.1, 4.0, 3.5, 2.8, 2.3] },
  { id: 'def_block', name: '霸气护体', category: 'defense', icon: '🏰', maxLevel: 5, tier: 'T1', blockChance: 0.2, blockReduce: 0.5, desc: '格挡率20%+2%/级，格挡减伤50%', spiritCost: 2, unlockLevel: 10,
    weights: [0, 0, 3.1, 3.3, 3.1, 2.5, 2.0, 1.5] },
  { id: 'def_dodge', name: '凌波微步', category: 'defense', icon: '💨', maxLevel: 1, tier: 'T1', dodgeBonus: 0.07, desc: '闪避率固定+7%', spiritCost: 2, unlockLevel: 10,
    weights: [0, 0, 2.5, 2.6, 2.2, 1.8, 1.3, 1.1] },

  // T2 输出/控制
  { id: 'atk_thunder', name: '晴天霹雳', category: 'attack', icon: '⚡', maxLevel: 5, tier: 'T2', damageMul: 1.5, desc: '伤害=(15+力量×1.5)×(1+(技能级-1)×10%)', spiritCost: 2, unlockLevel: 5,
    weights: [0, 5.6, 4.9, 4.1, 3.2, 2.6, 2.0, 1.5] },
  { id: 'ctrl_roar', name: '企鹅吼', category: 'control', icon: '📢', maxLevel: 5, tier: 'T2', effect: 'ignore', turns: 1, desc: '忽略对方1回合+基础15伤害', spiritCost: 2, unlockLevel: 10,
    weights: [0, 0, 2.5, 2.6, 2.2, 1.8, 1.3, 0.7] },
  { id: 'atk_kick', name: '佛山无影脚', category: 'attack', icon: '🦵', maxLevel: 5, tier: 'T2', damageMul: 2.0, desc: '伤害=(30+力量×0.5)×(1+(技能级-1)×10%)', spiritCost: 2, unlockLevel: 10,
    weights: [0, 0, 3.1, 3.3, 2.9, 2.4, 1.9, 1.4] },
  { id: 'atk_tornado', name: '龙卷风', category: 'attack', icon: '🌪️', maxLevel: 5, tier: 'T2', damageMul: 1.8, desc: '伤害=(20+力量×0.9)×(1+(技能级-1)×10%)', spiritCost: 2, unlockLevel: 15,
    weights: [0, 0, 0, 2.0, 2.5, 2.5, 1.9, 1.4] },
  { id: 'atk_angel', name: '天使之翼', category: 'attack', icon: '👼', maxLevel: 5, tier: 'T2', damageMul: 1.8, desc: '伤害=(15+敏捷×1.0)×(1+(技能级-1)×10%)，无法被反击', spiritCost: 2, unlockLevel: 15, noCounter: true,
    weights: [0, 0, 0, 2.0, 2.5, 2.5, 1.9, 1.4] },
  { id: 'ctrl_disarm', name: '缴械', category: 'control', icon: '🔒', maxLevel: 1, tier: 'T2', effect: 'disarm', chance: 0.5, desc: '50%几率夺取对方武器', spiritCost: 2, unlockLevel: 15,
    weights: [0, 0, 0, 1.3, 1.6, 1.7, 1.5, 1.2] },
  { id: 'ctrl_true_roar', name: '真·企鹅吼', category: 'control', icon: '📣', maxLevel: 1, tier: 'T2', effect: 'ignore', turns: 2, fixedDamage: 35, desc: '忽略对方2回合+35点伤害', spiritCost: 2, unlockLevel: 30,
    weights: [0, 0, 0, 0, 0, 0, 0.6, 0.7] },

  // T3 恢复/特殊
  { id: 'spc_heal', name: '矿泉水', category: 'special', icon: '🧴', maxLevel: 5, tier: 'T3', healPercent: 0.25, fixedDamage: 15, desc: '恢复25%生命（至少25点），立即攻击造成15点', spiritCost: 2, unlockLevel: 5,
    weights: [0, 4.7, 4.0, 2.9, 1.9, 1.3, 0.7, 0.4] },
  { id: 'ctrl_glue', name: '胶水', category: 'control', icon: '💧', maxLevel: 1, tier: 'T3', effect: 'stun', turns: 3, desc: '100%命中，黏住对方3回合无法行动', spiritCost: 2, unlockLevel: 10,
    weights: [0, 0, 2.5, 2.6, 2.2, 1.8, 1.3, 0.7] },
  { id: 'def_counter', name: '第六感', category: 'defense', icon: '👁️', maxLevel: 5, tier: 'T3', counterChance: 0.3, counterDamage: 0.8, desc: '反击率30%+(等级-1)×3%，反击伤害80%', spiritCost: 4, unlockLevel: 10,
    weights: [0, 0, 2.5, 2.6, 2.5, 2.5, 2.2, 2.0] },
  { id: 'spc_drain', name: '嗜血', category: 'special', icon: '🩸', maxLevel: 1, tier: 'T3', lifesteal: 0.35, desc: '35%几率吸取造成伤害的100%为生命', spiritCost: 2, unlockLevel: 20,
    weights: [0, 0, 0, 0, 0.1, 1.0, 0.8, 0.8] },
  { id: 'atk_tickle', name: '企鹅挠痒', category: 'attack', icon: '🐧', maxLevel: 5, tier: 'T3', damageMul: 0.5, dot: true, dotTurns: 6, desc: '每回合5+敏捷×0.2伤害，持续6回合', spiritCost: 2, unlockLevel: 20,
    weights: [0, 0, 0, 0, 1.2, 1.8, 1.9, 1.7] },
  { id: 'spc_shadow', name: '残影', category: 'special', icon: '👤', maxLevel: 1, tier: 'T3', effect: 'haste', turns: 2, speedBonus: 0.5, damageBonus: 0.1, desc: '速度+50%，伤害+10%，持续2回合', spiritCost: 2, unlockLevel: 15,
    weights: [0, 0, 0, 2.0, 2.5, 2.5, 1.9, 1.4] },
  { id: 'spc_blackdragon', name: '黑龙波', category: 'special', icon: '🐉', maxLevel: 1, tier: 'T3', fixedDamage: 50, desc: '固定50点伤害，每场仅1次', spiritCost: 2, unlockLevel: 30,
    weights: [0, 0, 0, 0, 0, 0, 0.6, 0.7] },
]

export const TOTAL_WEIGHTS = [100, 214, 324, 391, 401, 366, 335, 295]

export function getLevelRange(level) {
  for (let i = 0; i < LEVEL_RANGES.length; i++) {
    if (level >= LEVEL_RANGES[i].min && level <= LEVEL_RANGES[i].max) {
      return i
    }
  }
  return LEVEL_RANGES.length - 1
}

export function getAvailableSkillsForLevel(level) {
  const rangeIndex = getLevelRange(level)
  return SKILLS.filter(s => s.weights[rangeIndex] > 0)
}

export function rollSkill(level, ownedSkillIds) {
  const rangeIndex = getLevelRange(level)
  const available = getAvailableSkillsForLevel(level)

  const weighted = available
    .filter(s => !ownedSkillIds.includes(s.id))
    .map(s => ({ skill: s, weight: s.weights[rangeIndex] }))

  if (weighted.length === 0) return null

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0)
  let roll = Math.random() * totalWeight

  for (const { skill, weight } of weighted) {
    roll -= weight
    if (roll <= 0) return skill
  }

  return weighted[weighted.length - 1].skill
}

export function getSkillById(id) {
  return SKILLS.find(s => s.id === id)
}

export function getSkillsByCategory(category) {
  if (category === 'all') return SKILLS
  return SKILLS.filter(s => s.category === category)
}
