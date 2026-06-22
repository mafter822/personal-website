import { CALC, SPIRIT_PER_WIN, ENERGY_PER_ATTACK, ENERGY_PER_HIT, ENERGY_MAX } from './data/constants.js'
import { getSkillById } from './data/skills.js'
import { CLASSES } from './data/classes.js'
import { NPC_SKILLS } from './data/pets.js'
import { Fighter } from './ecs.js'

export class BattleEngine {
  constructor(playerConfig, enemyConfig, playerSkills, equippedWeapon) {
    this.player = new Fighter({
      ...playerConfig,
      skills: playerSkills,
      weapon: equippedWeapon,
    })
    this.enemy = new Fighter({
      ...enemyConfig,
      maxHealth: enemyConfig.maxHealth || enemyConfig.health,
      skills: enemyConfig.skills || ['basic_attack'],
    })

    this.turn = 0
    this.log = []
    this.isOver = false
    this.winner = null
    this.rewards = null
  }

  get playerCombatStats() {
    let str = this.player.attributes.strength
    let agi = this.player.attributes.agility
    let spd = this.player.attributes.speed
    let hp = this.player.attributes.maxHealth

    if (this.player.classId) {
      const classBonus = this.getClassBonus()
      str += classBonus.strength || 0
      agi += classBonus.agility || 0
      spd += classBonus.speed || 0
      hp += classBonus.maxHealth || 0
    }

    const ownedSkills = this.player.actions.skills
    ownedSkills.forEach(owned => {
      const skill = getSkillById(owned.id)
      if (skill && skill.statBonus) {
        const amount = skill.statBonus.amount * owned.level
        if (skill.statBonus.stat === 'strength') str += amount
        if (skill.statBonus.stat === 'agility') agi += amount
        if (skill.statBonus.stat === 'speed') spd += amount
        if (skill.statBonus.stat === 'health') hp += amount
        if (skill.statBonus.stat === 'all') { str += amount; agi += amount; spd += amount }
      }
    })

    const hasteBuff = this.player.buffs.find(b => b.type === 'haste')
    if (hasteBuff) {
      spd = Math.floor(spd * (1 + hasteBuff.speedBonus))
    }

    if (this.player.realmBonus) {
      str += this.player.realmBonus.strength || 0
      agi += this.player.realmBonus.agility || 0
      spd += this.player.realmBonus.speed || 0
      hp += this.player.realmBonus.maxHealth || 0
    }

    if (this.player.streakStatus === 'excited') {
      str = Math.floor(str * 1.3)
    } else if (this.player.streakStatus === 'depressed') {
      str = Math.floor(str * 0.8)
    }

    return { strength: str, agility: agi, speed: spd, maxHealth: hp }
  }

  getClassBonus() {
    try {
      const cls = CLASSES.find(c => c.id === this.player.classId)
      if (!cls) return {}
      const classSkills = this.player.classSkills?.[this.player.classId]?.allocated || {}
      const bonus = { ...cls.statBonus }
      cls.skillTree.forEach(skill => {
        const level = classSkills[skill.id] || 0
        if (level > 0) {
          if (skill.effect === 'maxHealth') bonus.maxHealth = (bonus.maxHealth || 0) + skill.value * level
          if (skill.effect === 'speed') bonus.speed = (bonus.speed || 0) + skill.value * level
          if (skill.effect === 'allStats') {
            bonus.strength = (bonus.strength || 0) + skill.value * level
            bonus.agility = (bonus.agility || 0) + skill.value * level
            bonus.speed = (bonus.speed || 0) + skill.value * level
          }
        }
      })
      return bonus
    } catch { return {} }
  }

  get playerDamageReduction() {
    let reduction = 0
    this.player.skills.forEach(owned => {
      const skill = getSkillById(owned.id)
      if (skill && skill.damageReduce) {
        reduction += skill.damageReduce * owned.level
      }
    })
    return Math.min(reduction, 0.1)
  }

  start() {
    this.turn = 1
    this.player.health = this.playerCombatStats.maxHealth
    this.enemy.health = this.enemy.maxHealth
    this.addLog('battle_start', `战斗开始！vs ${this.enemy.name} Lv.${this.enemy.level}`)
  }

  autoSelectSkill() {
    const hpPercent = this.player.health / this.playerCombatStats.maxHealth
    const enemyHpPercent = this.enemy.health / this.enemy.maxHealth

    const passiveEffects = new Set(['undying', 'lifesteal', 'combo', 'dodgeBonus', 'blockChance', 'counterChance', 'reboundChance', 'damageReduce', 'statBonus', 'weaponDamageBonus', 'damageBonus'])

    const availableSkills = this.player.skills
      .map(s => getSkillById(s.id))
      .filter(s => {
        if (!s) return false
        if (s.category !== 'attack' && s.category !== 'control' && s.category !== 'special') return false
        if (s.effect && passiveEffects.has(s.effect)) return false
        if (s.effect && this.player.usedActiveSkills.has(s.effect)) return false
        return true
      })

    if (availableSkills.length === 0) return null

    if (this.player.energy >= ENERGY_MAX) {
      const ultimateSkill = availableSkills.find(s => s.energyCost && s.energyCost >= ENERGY_MAX)
      if (ultimateSkill) {
        this.player.energy = 0
        this.addLog('ultimate', `${this.player.name} 释放终结技【${ultimateSkill.name}】！`, { source: this.player.name, skillName: ultimateSkill.name })
        return ultimateSkill.id
      }
    }

    if (hpPercent < 0.3) {
      const healSkill = availableSkills.find(s => s.effect === 'heal')
      if (healSkill) return healSkill.id
    }

    if (enemyHpPercent < 0.2) {
      const controlSkill = availableSkills.find(s => s.effect === 'stun' || s.effect === 'disarm')
      if (controlSkill) return controlSkill.id
    }

    const highDamageSkills = availableSkills.filter(s => s.damageMul && s.damageMul >= 1.5)
    if (highDamageSkills.length > 0 && Math.random() < 0.6) {
      return highDamageSkills[Math.floor(Math.random() * highDamageSkills.length)].id
    }

    if (Math.random() < 0.3) {
      const controlSkill = availableSkills.find(s => s.effect === 'stun' || s.effect === 'disarm' || s.effect === 'ignore')
      if (controlSkill) return controlSkill.id
    }

    return availableSkills[Math.floor(Math.random() * availableSkills.length)].id
  }

  startNextTurn() {
    if (this.isOver) return
    this.turn++
    this.processBuffs(this.player)
    this.processDebuffs(this.player)
    this.processStun(this.player)
    this.processIgnore(this.player)
    this.processRest(this.player)
    this.processStun(this.enemy)
    this.processIgnore(this.enemy)
    this.processBuffs(this.enemy)
    this.processDebuffs(this.enemy)
  }

  processBuffs(unit) {
    const buffs = unit.status.buffs
    for (let i = buffs.length - 1; i >= 0; i--) {
      const b = buffs[i]
      if (b.onTick) b.onTick(unit, this)
      b.turns--
      if (b.turns <= 0) buffs.splice(i, 1)
    }
  }

  processDebuffs(unit) {
    const debuffs = unit.status.debuffs
    for (let i = debuffs.length - 1; i >= 0; i--) {
      const d = debuffs[i]
      if (d.onTick) d.onTick(unit, this)
      d.turns--
      if (d.turns <= 0) debuffs.splice(i, 1)
    }
  }

  processStun(unit) {
    if (unit.stunTurns > 0) {
      unit.stunTurns--
      unit.isStunned = unit.stunTurns > 0
    }
  }

  processIgnore(unit) {
    if (unit.ignoreTurns > 0) {
      unit.ignoreTurns--
      unit.isIgnored = unit.ignoreTurns > 0
    }
  }

  processRest(unit) {
    if (unit.restTurns > 0) {
      unit.restTurns--
    }
  }

  playerTurn(skillId) {
    if (this.isOver) return
    if (this.player.isStunned) {
      this.addLog('stun', '你被黏住了，无法行动！')
      return
    }
    if (this.player.restTurns > 0) {
      this.addLog('rest', '武器使用后需要休息！')
      return
    }

    const skill = skillId ? getSkillById(skillId) : null

    if (skill && skill.effect === 'heal') {
      this.executeHealSkill(skill)
      this.player.usedActiveSkills.add(skillId)
    } else if (skill && skill.effect === 'disarm') {
      this.executeDisarmSkill(skill)
      this.player.usedActiveSkills.add(skill.effect)
    } else if (skill && skill.effect === 'stun') {
      this.executeStunSkill(skill)
      this.player.usedActiveSkills.add(skill.effect)
    } else if (skill && skill.effect === 'ignore') {
      this.executeIgnoreSkill(skill)
      this.player.usedActiveSkills.add(skill.effect)
    } else if (skill && skill.effect === 'haste') {
      this.executeHasteSkill(skill)
      this.player.usedActiveSkills.add(skillId)
    } else {
      this.executeAttack(skill)
    }

    this.checkBattleEnd()
  }

  executeAttack(skill) {
    const stats = this.playerCombatStats
    const weapon = this.player.weapon
    const weaponName = weapon ? weapon.name : '拳头'

    let damage = CALC.damage(stats, weapon, skill)

    if (weapon && weapon.special && weapon.special.type === 'combo') {
      if (Math.random() < weapon.special.chance) {
        const comboDamage = CALC.damage(stats, weapon, null)
        damage += comboDamage
        this.addLog('combo', `【${weaponName}】连击！追加一击！再损失 ${comboDamage} 点！`, { source: this.player.name, target: this.enemy.name, value: comboDamage, weaponName })
      }
    }

    const critChance = CALC.critRate(stats.agility)
    const critResult = CALC.prdCheck(critChance, this.player.critCounter)
    this.player.critCounter = critResult.counter
    const isCrit = critResult.triggered
    if (isCrit) {
      damage = Math.floor(damage * 1.5)
      this.addLog('crit', `【${weaponName}】暴击！造成 ${damage} 伤害`, { source: this.player.name, target: this.enemy.name, value: damage, weaponName })
    }

    const enemyDodge = this.enemy.isDummy
      ? (this.enemy.dodgeRate || 0)
      : CALC.dodgeRate(this.enemy.agility, this.enemy.speed)
    const dodgeResult = CALC.prdCheck(enemyDodge, this.enemy.dodgeCounter)
    this.enemy.dodgeCounter = dodgeResult.counter
    if (dodgeResult.triggered) {
      this.addLog('dodge', `${this.player.name}用【${weaponName}】攻击，${this.enemy.name}闪开了！`, { source: this.player.name, target: this.enemy.name, weaponName })
      this.player.stats.misses++
      return
    }

    if (!this.player.isIgnored) {
      const blockChance = this.enemy.isDummy
        ? (this.enemy.blockRate || 0)
        : CALC.blockRate()
      if (Math.random() < blockChance) {
        damage = Math.floor(damage * 0.5)
        this.addLog('block', `${this.enemy.name} 格挡了部分伤害！`, { source: this.enemy.name, target: this.player.name })
      }
    }

    this.enemy.health = Math.max(0, this.enemy.health - (Number.isFinite(damage) ? damage : 0))

    if (Number.isFinite(damage) && damage > 0) {
      this.player.stats.totalDamage += damage
      this.player.stats.hits++
      if (damage > this.player.stats.maxHit) this.player.stats.maxHit = damage
      if (isCrit) this.player.stats.crits++
    }

    this.player.energy = Math.min(ENERGY_MAX, this.player.energy + ENERGY_PER_ATTACK)
    if (this.player.energy >= ENERGY_MAX && this.player.energy - ENERGY_PER_ATTACK < ENERGY_MAX) {
      this.addLog('energy_full', `${this.player.name} 能量蓄满！下一次攻击将释放终结技！`, { source: this.player.name })
    }

    if (skill) {
      this.addLog('attack', `${this.player.name}发动【${skill.name}】！${this.enemy.name}损失 ${damage} 点生命！`, { source: this.player.name, target: this.enemy.name, value: damage, skillName: skill.name })
      if (skill.dot && skill.dotTurns) {
        const dotDmg = 5 + Math.floor(this.playerCombatStats.agility * 0.2)
        this.enemy.debuffs.push({
          type: 'dot',
          turns: skill.dotTurns,
          damage: dotDmg,
          onTick: (unit, engine) => {
            unit.health = Math.max(0, unit.health - dotDmg)
            engine.addLog('dot', `${unit.name} 受到灼烧伤害 ${dotDmg} 点！`, { source: 'dot', target: unit.name, value: dotDmg })
          },
        })
        this.addLog('dot', `${this.enemy.name} 被施加了持续灼烧，每回合${dotDmg}点伤害，持续${skill.dotTurns}回合`, { source: this.player.name, target: this.enemy.name, value: dotDmg })
      }
    } else {
      this.addLog('attack', `${this.player.name}用【${weaponName}】攻击，${this.enemy.name}损失 ${damage} 点生命！`, { source: this.player.name, target: this.enemy.name, value: damage, weaponName })
    }

    if (skill && skill.noCounter) {
      this.addLog('special', '无法被反击！', { source: this.player.name })
    } else {
      const counterChance = CALC.counterRate(this.enemy.agility)
      if (Math.random() < counterChance) {
        const counterDmg = Math.floor((Number.isFinite(damage) ? damage : 0) * 0.5)
        this.player.health = Math.max(0, this.player.health - counterDmg)
        this.addLog('counter', `${this.enemy.name} 反击造成 ${counterDmg} 伤害！`, { source: this.enemy.name, target: this.player.name, value: counterDmg })
      }
    }

    const drainSkill = this.player.skills.find(s => {
      const sk = getSkillById(s.id)
      return sk && sk.lifesteal
    })
    if (drainSkill) {
      const sk = getSkillById(drainSkill.id)
      if (Math.random() < sk.lifesteal) {
        const healed = Math.floor((Number.isFinite(damage) ? damage : 0) * 0.5)
        this.player.health = Math.min(this.playerCombatStats.maxHealth, this.player.health + healed)
        this.addLog('heal', `嗜血触发，恢复 ${healed} 生命`, { source: this.player.name, value: healed })
      }
    }
  }

  executeHealSkill(skill) {
    const healAmount = Math.max(25, Math.floor(this.playerCombatStats.maxHealth * (skill.healPercent || 0.25)))
    this.player.health = Math.min(this.playerCombatStats.maxHealth, this.player.health + healAmount)
    this.addLog('heal', `矿泉水恢复 ${healAmount} 生命`, { source: this.player.name, value: healAmount, skillName: skill.name })

    const damage = (skill.fixedDamage || 0) + this.playerCombatStats.agility * 0.2
    this.enemy.health = Math.max(0, this.enemy.health - Math.floor(damage))
    this.addLog('attack', `造成 ${Math.floor(damage)} 伤害`, { source: this.player.name, target: this.enemy.name, value: Math.floor(damage), skillName: skill.name })
  }

  executeDisarmSkill(skill) {
    if (Math.random() < skill.chance) {
      this.enemy.weapon = null
      this.addLog('control', `${this.player.name}发动【${skill.name}】！夺取了 ${this.enemy.name}的武器`, { source: this.player.name, target: this.enemy.name, skillName: skill.name })
    } else {
      this.addLog('control', `${this.player.name}发动【${skill.name}】！但${this.enemy.name}已无武器可夺！`, { source: this.player.name, target: this.enemy.name, skillName: skill.name })
    }
  }

  executeStunSkill(skill) {
    this.enemy.stunTurns = skill.turns
    this.enemy.isStunned = true
    this.addLog('control', `${this.player.name}发动【${skill.name}】！${this.enemy.name}被黏住 ${skill.turns} 回合`, { source: this.player.name, target: this.enemy.name, value: skill.turns, skillName: skill.name })
  }

  executeIgnoreSkill(skill) {
    this.enemy.ignoreTurns = skill.turns
    this.enemy.isIgnored = true
    if (skill.fixedDamage) {
      this.enemy.health = Math.max(0, this.enemy.health - skill.fixedDamage)
      this.addLog('control', `${this.player.name}发动【${skill.name}】！忽略 ${skill.turns} 回合，造成 ${skill.fixedDamage} 伤害`, { source: this.player.name, target: this.enemy.name, value: skill.fixedDamage, skillName: skill.name })
    } else {
      this.addLog('control', `${this.player.name}发动【${skill.name}】！忽略 ${skill.turns} 回合`, { source: this.player.name, target: this.enemy.name, value: skill.turns, skillName: skill.name })
    }
  }

  executeHasteSkill(skill) {
    this.player.buffs.push({
      type: 'haste',
      turns: skill.turns,
      speedBonus: skill.speedBonus,
      damageBonus: skill.damageBonus,
    })
    this.addLog('buff', `${this.player.name}发动【${skill.name}】！速度+${Math.round(skill.speedBonus * 100)}%，持续 ${skill.turns} 回合`, { source: this.player.name, skillName: skill.name, value: skill.turns })
  }

  chooseEnemySkill() {
    try {
      if (!this.enemy.skills || this.enemy.skills.length === 0) return null
      
      const weightedSkills = []
      this.enemy.skills.forEach(skillId => {
        const skill = NPC_SKILLS[skillId]
        if (skill) {
          const weight = skill.damageMul > 2 ? 15 : skill.damageMul > 1.5 ? 25 : 40
          weightedSkills.push({ skill, weight })
        }
      })

      if (weightedSkills.length === 0) return null

      const totalWeight = weightedSkills.reduce((sum, s) => sum + s.weight, 0)
      let roll = Math.random() * totalWeight

      for (const { skill, weight } of weightedSkills) {
        roll -= weight
        if (roll <= 0) return skill
      }

      return weightedSkills[weightedSkills.length - 1].skill
    } catch { return null }
  }

  enemyTurn() {
    if (this.isOver) return

    if (this.enemy.isDummy) {
      this.addLog('stun', `${this.enemy.name} 没有反击...`)
      return
    }

    if (this.enemy.isStunned) {
      this.addLog('stun', `${this.enemy.name} 被黏住了，无法行动！`)
      return
    }
    if (this.enemy.isIgnored) {
      this.addLog('ignore', `${this.enemy.name} 被忽略了！`)
      return
    }

    const stats = this.playerCombatStats
    const enemyStats = { strength: this.enemy.strength, agility: this.enemy.agility, speed: this.enemy.speed }

    const enemySkill = this.chooseEnemySkill()
    let damage = CALC.damage(enemyStats, null, null)
    let skillName = '拳打脚踢'

    if (enemySkill) {
      const skillMul = enemySkill.damageMul || 1.0
      damage = Math.floor(damage * skillMul)
      skillName = enemySkill.name
    }

    const dodgeChance = CALC.dodgeRate(stats.agility, stats.speed) + (this.player.skills.some(s => getSkillById(s.id)?.dodgeBonus) ? 0.07 : 0)
    const playerDodgeResult = CALC.prdCheck(dodgeChance, this.player.dodgeCounter)
    this.player.dodgeCounter = playerDodgeResult.counter
    if (playerDodgeResult.triggered) {
      this.addLog('dodge', `${this.enemy.name}用【${skillName}】攻击！${this.player.name}闪开了！`, { source: this.enemy.name, target: this.player.name, skillName })
      return
    }

    const blockChance = this.player.skills.some(s => getSkillById(s.id)?.blockChance) ? 0.3 : 0.15
    if (Math.random() < blockChance) {
      damage = Math.floor(damage * 0.5)
      this.addLog('block', `${this.enemy.name}用【${skillName}】攻击！${this.player.name} 格挡了部分伤害！`, { source: this.enemy.name, target: this.player.name, skillName })
    }

    const defReduction = this.playerDamageReduction
    damage = Math.floor(damage * (1 - defReduction))

    const reboundSkill = this.player.skills.find(s => {
      const sk = getSkillById(s.id)
      return sk && sk.reboundChance
    })
    if (reboundSkill) {
      const sk = getSkillById(reboundSkill.id)
      if (Math.random() < sk.reboundChance) {
        const reboundDmg = Math.floor((Number.isFinite(damage) ? damage : 0) * (sk.reboundDamage || 0.5))
        this.enemy.health = Math.max(0, this.enemy.health - reboundDmg)
        this.addLog('rebound', `大海无量！反弹 ${reboundDmg} 伤害`, { source: this.player.name, target: this.enemy.name, value: reboundDmg })
      }
    }

    this.player.health = Math.max(0, this.player.health - (Number.isFinite(damage) ? damage : 0))
    this.addLog('enemy_attack', `${this.enemy.name}用【${skillName}】攻击！${this.player.name}损失 ${damage} 点生命！`, { source: this.enemy.name, target: this.player.name, value: damage, skillName })

    if (Number.isFinite(damage) && damage > 0) {
      this.enemy.enemyTotalDamage += damage
    }

    if (Number.isFinite(damage) && damage > 0) {
      this.player.energy = Math.min(ENERGY_MAX, this.player.energy + ENERGY_PER_HIT)
      if (this.player.energy >= ENERGY_MAX && this.player.energy - ENERGY_PER_HIT < ENERGY_MAX) {
        this.addLog('energy_full', `${this.player.name} 能量蓄满！下一次攻击将释放终结技！`, { source: this.player.name })
      }
    }

    if (this.player.health <= 0) {
      const deadSkill = this.player.skills.find(s => {
        const sk = getSkillById(s.id)
        return sk && sk.effect === 'undying'
      })
      if (deadSkill && !this.player.undyingUsed) {
        this.player.health = 1
        this.player.undyingUsed = true
        this.addLog('special', '装死触发！以1点生命存活！')
      }
    }

    this.checkBattleEnd()
  }

  checkBattleEnd() {
    if (this.enemy.health <= 0) {
      if (this.enemy.isDummy) {
        this.player.stats.kills++
        this.enemy.health = this.enemy.maxHealth
        this.addLog('heal', `${this.enemy.name} 血量回满！累计击杀 ${this.player.stats.kills} 次`)
        return
      }
      this.endBattle(true)
    } else if (this.player.health <= 0) {
      this.endBattle(false)
    } else if (this.turn >= 50) {
      this.resolveDraw()
    }
  }

  resolveDraw() {
    const playerHpPercent = this.player.health / this.playerCombatStats.maxHealth
    const enemyHpPercent = this.enemy.health / this.enemy.maxHealth
    const playerDamage = this.player.stats.totalDamage
    const enemyDamage = this.enemy.enemyTotalDamage || 0

    if (playerHpPercent > enemyHpPercent) {
      this.endBattle(true)
    } else if (enemyHpPercent > playerHpPercent) {
      this.endBattle(false)
    } else if (playerDamage > enemyDamage) {
      this.endBattle(true)
    } else if (enemyDamage > playerDamage) {
      this.endBattle(false)
    } else {
      this.isOver = true
      this.winner = 'draw'
      this.addLog('draw', '双方势均力敌，此局平手！')
    }
  }

  endBattle(won) {
    this.isOver = true
    this.winner = won ? 'player' : 'enemy'
    if (won) {
      this.rewards = this.enemy.rewards || { exp: 50, spirit: 1 }
      this.addLog('win', `战斗胜利！获得 ${this.rewards.exp} 经验, ${this.rewards.spirit} 精魄`)
    } else {
      this.addLog('lose', '战斗失败...')
    }
  }

  addLog(type, message, meta = {}) {
    this.log.push({
      turn: this.turn,
      type,
      source: meta.source || null,
      target: meta.target || null,
      value: Number.isFinite(meta.value) ? meta.value : null,
      skillName: meta.skillName || null,
      weaponName: meta.weaponName || null,
      message,
      timestamp: Date.now(),
    })
  }

  getStats() {
    return {
      totalDamage: this.player.stats.totalDamage,
      crits: this.player.stats.crits,
      maxHit: this.player.stats.maxHit,
      hits: this.player.stats.hits,
      misses: this.player.stats.misses,
      kills: this.player.stats.kills,
    }
  }
}
