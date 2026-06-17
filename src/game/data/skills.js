export const SKILLS = [
  // 属性技能
  { id: 'talent_str', name: '天生大力', category: 'stat', icon: '💪', maxLevel: 10, desc: '力量+1/级（上限+10）', statBonus: { stat: 'strength', amount: 1 }, spiritCost: 8, unlockLevel: 1 },
  { id: 'talent_agi', name: '身手敏捷', category: 'stat', icon: '🏃', maxLevel: 10, desc: '敏捷+1/级（上限+10）', statBonus: { stat: 'agility', amount: 1 }, spiritCost: 4, unlockLevel: 1 },
  { id: 'talent_spd', name: '快人一步', category: 'stat', icon: '⚡', maxLevel: 10, desc: '速度+1/级（上限+10）', statBonus: { stat: 'speed', amount: 1 }, spiritCost: 10, unlockLevel: 1 },
  { id: 'talent_hp', name: '强健身躯', category: 'stat', icon: '❤️', maxLevel: 10, desc: '生命上限+5/级（上限+50）', statBonus: { stat: 'health', amount: 5 }, spiritCost: 2, unlockLevel: 1 },
  { id: 'talent_all', name: '均衡发展', category: 'stat', icon: '🌈', maxLevel: 10, desc: '全属性+1/级', statBonus: { stat: 'all', amount: 1 }, spiritCost: 2, unlockLevel: 1 },

  // 增幅技能
  { id: 'buff_unarmed', name: '肉搏好手', category: 'buff', icon: '🥊', maxLevel: 5, desc: '空手伤害+6%/级（上限+30%）', damageBonus: 0.06, spiritCost: 2, unlockLevel: 1 },
  { id: 'buff_weapon', name: '武器好手', category: 'buff', icon: '🗡️', maxLevel: 5, desc: '武器伤害+5%/级（上限+25%）', weaponDamageBonus: 0.05, spiritCost: 2, unlockLevel: 5 },

  // 攻击技能
  { id: 'atk_thunder', name: '晴天霹雳', category: 'attack', icon: '⚡', maxLevel: 5, damageMul: 1.5, desc: '伤害=(15+力量×1.5)×(1+(技能级-1)×10%)', spiritCost: 2, unlockLevel: 5 },
  { id: 'atk_angel', name: '天使之翼', category: 'attack', icon: '👼', maxLevel: 5, damageMul: 1.8, desc: '伤害=(15+敏捷×1.0)×(1+(技能级-1)×10%)，无法被反击', spiritCost: 2, unlockLevel: 15, noCounter: true },
  { id: 'atk_kick', name: '佛山无影脚', category: 'attack', icon: '🦵', maxLevel: 5, damageMul: 2.0, desc: '伤害=(30+力量×0.5)×(1+(技能级-1)×10%)', spiritCost: 2, unlockLevel: 10 },
  { id: 'atk_tornado', name: '龙卷风', category: 'attack', icon: '🌪️', maxLevel: 5, damageMul: 1.8, desc: '伤害=(20+力量×0.9)×(1+(技能级-1)×10%)', spiritCost: 2, unlockLevel: 15 },
  { id: 'atk_tickle', name: '企鹅挠痒', category: 'attack', icon: '🐧', maxLevel: 5, damageMul: 0.5, dot: true, dotTurns: 6, desc: '每回合5+敏捷×0.2伤害，持续6回合', spiritCost: 2, unlockLevel: 20 },
  { id: 'atk_palm', name: '如来神掌', category: 'attack', icon: '✋', maxLevel: 1, damageMul: 0.5, hpPercent: true, desc: '打掉对手当前一半生命', spiritCost: 2, unlockLevel: 30 },

  // 控制技能
  { id: 'ctrl_disarm', name: '缴械', category: 'control', icon: '🔒', maxLevel: 1, effect: 'disarm', chance: 0.5, desc: '50%几率夺取对方武器', spiritCost: 2, unlockLevel: 1 },
  { id: 'ctrl_glue', name: '胶水', category: 'control', icon: '💧', maxLevel: 1, effect: 'stun', turns: 3, desc: '100%命中，黏住对方3回合无法行动', spiritCost: 2, unlockLevel: 10 },
  { id: 'ctrl_roar', name: '企鹅吼', category: 'control', icon: '📢', maxLevel: 5, effect: 'ignore', turns: 1, desc: '忽略对方1回合+基础15伤害', spiritCost: 2, unlockLevel: 10 },
  { id: 'ctrl_true_roar', name: '真·企鹅吼', category: 'control', icon: '📣', maxLevel: 1, effect: 'ignore', turns: 2, fixedDamage: 35, desc: '忽略对方2回合+35点伤害', spiritCost: 2, unlockLevel: 30 },

  // 防御技能
  { id: 'def_thick', name: '皮糙肉厚', category: 'defense', icon: '🛡️', maxLevel: 5, damageReduce: 0.02, desc: '所受伤害-2%/级（上限-10%）', spiritCost: 2, unlockLevel: 10 },
  { id: 'def_block', name: '霸气护体', category: 'defense', icon: '🏰', maxLevel: 5, blockChance: 0.2, blockReduce: 0.5, desc: '格挡率20%+2%/级，格挡减伤50%', spiritCost: 2, unlockLevel: 10 },
  { id: 'def_dodge', name: '凌波微步', category: 'defense', icon: '💨', maxLevel: 1, dodgeBonus: 0.07, desc: '闪避率固定+7%', spiritCost: 2, unlockLevel: 10 },
  { id: 'def_counter', name: '第六感', category: 'defense', icon: '👁️', maxLevel: 5, counterChance: 0.3, counterDamage: 0.8, desc: '反击率30%+(等级-1)×3%，反击伤害80%', spiritCost: 4, unlockLevel: 10 },
  { id: 'def_rebound', name: '大海无量', category: 'defense', icon: '🌊', maxLevel: 5, reboundChance: 0.3, reboundDamage: 1.0, desc: '反弹率30%+(等级-1)×3%，反弹100%伤害', spiritCost: 2, unlockLevel: 15 },

  // 特殊技能
  { id: 'spc_shadow', name: '残影', category: 'special', icon: '👤', maxLevel: 1, effect: 'haste', turns: 2, speedBonus: 0.5, damageBonus: 0.1, desc: '速度+50%，伤害+10%，持续2回合', spiritCost: 2, unlockLevel: 15 },
  { id: 'spc_dead', name: '装死', category: 'special', icon: '💀', maxLevel: 1, effect: 'undying', desc: '生命降为0时免死一次，回复到1点（每场1次）', spiritCost: 2, unlockLevel: 10 },
  { id: 'spc_drain', name: '嗜血', category: 'special', icon: '🩸', maxLevel: 1, lifesteal: 0.35, desc: '35%几率吸取造成伤害的100%为生命', spiritCost: 2, unlockLevel: 30 },
  { id: 'spc_instakill', name: '神来一击', category: 'special', icon: '✨', maxLevel: 1, instakillChance: 0.05, desc: '5%几率将对手生命降至1点', spiritCost: 2, unlockLevel: 20 },
  { id: 'spc_heal', name: '矿泉水', category: 'special', icon: '🧴', maxLevel: 5, healPercent: 0.25, fixedDamage: 15, desc: '恢复25%生命（至少25点），立即攻击造成15点', spiritCost: 2, unlockLevel: 5 },
  { id: 'spc_storm', name: '势如暴雨', category: 'special', icon: '⛈️', maxLevel: 1, effect: 'multiAttack', maxWeapons: 3, desc: '连续投掷最多3种武器，按武器伤害累加', spiritCost: 2, unlockLevel: 15 },
]

export function getSkillById(id) {
  return SKILLS.find(s => s.id === id)
}

export function getSkillsByCategory(category) {
  if (category === 'all') return SKILLS
  return SKILLS.filter(s => s.category === category)
}

export function calculateSkillDamage(skill, attackerStats, skillLevel) {
  if (!skill.damageMul) return 0
  const base = 15 + attackerStats.strength * skill.damageMul
  const levelBonus = 1 + (skillLevel - 1) * 0.1
  return Math.floor(base * levelBonus)
}
