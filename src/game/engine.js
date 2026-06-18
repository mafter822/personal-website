import { CALC, SPIRIT_PER_WIN } from './data/constants.js'
import { getSkillById } from './data/skills.js'

export class BattleEngine {
  constructor(player, enemy, playerSkills, equippedWeapon) {
    this.player = {
      ...player,
      maxHealth: player.maxHealth,
      skills: playerSkills,
      weapon: equippedWeapon,
      buffs: [],
      debuffs: [],
      undyingUsed: false,
      isStunned: false,
      stunTurns: 0,
      isIgnored: false,
      ignoreTurns: 0,
      weaponDisarmed: false,
      restTurns: 0,
      usedActiveSkills: new Set(),
    }
    this.enemy = {
      ...enemy,
      maxHealth: enemy.health,
      skills: enemy.skills || ['basic_attack'],
      buffs: [],
      debuffs: [],
      undyingUsed: false,
      isStunned: false,
      stunTurns: 0,
    }
    this.turn = 0
    this.log = []
    this.isOver = false
    this.winner = null
    this.rewards = null
  }

  get playerCombatStats() {
    let str = this.player.strength
    let agi = this.player.agility
    let spd = this.player.speed
    let hp = this.player.maxHealth

    this.player.skills.forEach(owned => {
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

    return { strength: str, agility: agi, speed: spd, maxHealth: hp }
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

    const availableSkills = this.player.skills
      .map(s => getSkillById(s.id))
      .filter(s => {
        if (!s) return false
        if (s.category !== 'attack' && s.category !== 'control' && s.category !== 'special') return false
        if (s.effect === 'stun' && this.player.usedActiveSkills.has('stun')) return false
        if (s.effect === 'disarm' && this.player.usedActiveSkills.has('disarm')) return false
        if (s.effect === 'ignore' && this.player.usedActiveSkills.has('ignore')) return false
        return true
      })

    if (availableSkills.length === 0) return null

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
      const controlSkill = availableSkills.find(s => s.effect === 'control' || s.effect === 'stun')
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
  }

  processBuffs(unit) {
    unit.buffs = unit.buffs.filter(b => {
      b.turns--
      return b.turns > 0
    })
  }

  processDebuffs(unit) {
    unit.debuffs = unit.debuffs.filter(d => {
      d.turns--
      return d.turns > 0
    })
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
      this.player.usedActiveSkills.add(skillId)
    } else if (skill && skill.effect === 'stun') {
      this.executeStunSkill(skill)
      this.player.usedActiveSkills.add(skillId)
    } else if (skill && skill.effect === 'ignore') {
      this.executeIgnoreSkill(skill)
      this.player.usedActiveSkills.add(skillId)
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
        this.addLog('combo', `【${weaponName}】连击！追加一击！再损失 ${comboDamage} 点！`)
      }
    }

    const critChance = CALC.critRate(stats.agility)
    if (Math.random() < critChance) {
      damage = Math.floor(damage * 1.5)
      this.addLog('crit', `【${weaponName}】暴击！造成 ${damage} 伤害`)
    }

    const dodgeChance = CALC.dodgeRate(this.enemy.agility, this.enemy.speed)
    if (Math.random() < dodgeChance) {
      this.addLog('dodge', `${this.player.name}用【${weaponName}】攻击，${this.enemy.name}闪开了！`)
      return
    }

    if (!this.player.isIgnored) {
      const blockChance = CALC.blockRate()
      if (Math.random() < blockChance) {
        damage = Math.floor(damage * 0.5)
        this.addLog('block', `${this.enemy.name} 格挡了部分伤害！`)
      }
    }

    this.enemy.health = Math.max(0, this.enemy.health - damage)

    if (skill) {
      this.addLog('attack', `${this.player.name}发动【${skill.name}】！${this.enemy.name}损失 ${damage} 点生命！`)
    } else {
      this.addLog('attack', `${this.player.name}用【${weaponName}】攻击，${this.enemy.name}损失 ${damage} 点生命！`)
    }

    if (skill && skill.noCounter) {
      this.addLog('special', '无法被反击！')
    } else {
      const counterChance = CALC.counterRate(this.enemy.agility)
      if (Math.random() < counterChance) {
        const counterDmg = Math.floor(damage * 0.5)
        this.player.health = Math.max(0, this.player.health - counterDmg)
        this.addLog('counter', `${this.enemy.name} 反击造成 ${counterDmg} 伤害！`)
      }
    }

    const drainSkill = this.player.skills.find(s => {
      const sk = getSkillById(s.id)
      return sk && sk.lifesteal
    })
    if (drainSkill) {
      const sk = getSkillById(drainSkill.id)
      if (Math.random() < sk.lifesteal) {
        const healed = Math.floor(damage * 0.5)
        this.player.health = Math.min(this.playerCombatStats.maxHealth, this.player.health + healed)
        this.addLog('heal', `嗜血触发，恢复 ${healed} 生命`)
      }
    }
  }

  executeHealSkill(skill) {
    const healAmount = Math.max(25, Math.floor(this.playerCombatStats.maxHealth * skill.healPercent))
    this.player.health = Math.min(this.playerCombatStats.maxHealth, this.player.health + healAmount)
    this.addLog('heal', `矿泉水恢复 ${healAmount} 生命`)

    const damage = skill.fixedDamage + this.playerCombatStats.agility * 0.2
    this.enemy.health = Math.max(0, this.enemy.health - Math.floor(damage))
    this.addLog('attack', `造成 ${Math.floor(damage)} 伤害`)
  }

  executeDisarmSkill(skill) {
    if (Math.random() < skill.chance) {
      this.enemy.weapon = null
      this.addLog('control', `${this.player.name}发动【${skill.name}】！夺取了 ${this.enemy.name} 的武器`)
    } else {
      this.addLog('control', `${this.player.name}发动【${skill.name}】！但${this.enemy.name}已无武器可夺！`)
    }
  }

  executeStunSkill(skill) {
    this.enemy.stunTurns = skill.turns
    this.enemy.isStunned = true
    this.addLog('control', `${this.player.name}发动【${skill.name}】！${this.enemy.name}被黏住 ${skill.turns} 回合`)
  }

  executeIgnoreSkill(skill) {
    this.enemy.ignoreTurns = skill.turns
    this.enemy.isIgnored = true
    if (skill.fixedDamage) {
      this.enemy.health = Math.max(0, this.enemy.health - skill.fixedDamage)
      this.addLog('control', `${this.player.name}发动【${skill.name}】！忽略 ${skill.turns} 回合，造成 ${skill.fixedDamage} 伤害`)
    } else {
      this.addLog('control', `${this.player.name}发动【${skill.name}】！忽略 ${skill.turns} 回合`)
    }
  }

  executeHasteSkill(skill) {
    this.player.buffs.push({
      type: 'haste',
      turns: skill.turns,
      speedBonus: skill.speedBonus,
      damageBonus: skill.damageBonus,
    })
    this.addLog('buff', `${this.player.name}发动【${skill.name}】！速度+${Math.round(skill.speedBonus * 100)}%，持续 ${skill.turns} 回合`)
  }

  enemyTurn() {
    if (this.isOver) return

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
    const enemyWeaponName = this.enemy.weapon ? this.enemy.weapon.name : '拳打脚踢'

    let damage = CALC.damage(enemyStats, null, null)

    const dodgeChance = CALC.dodgeRate(stats.agility, stats.speed) + (this.player.skills.some(s => getSkillById(s.id)?.dodgeBonus) ? 0.07 : 0)
    if (Math.random() < dodgeChance) {
      this.addLog('dodge', `${this.enemy.name}用【${enemyWeaponName}】攻击！${this.player.name}闪开了！`)
      return
    }

    const blockChance = this.player.skills.some(s => getSkillById(s.id)?.blockChance) ? 0.3 : 0.15
    if (Math.random() < blockChance) {
      damage = Math.floor(damage * 0.5)
      this.addLog('block', `${this.enemy.name}用【${enemyWeaponName}】攻击！${this.player.name} 格挡了部分伤害！`)
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
        const reboundDmg = Math.floor(damage * sk.reboundDamage)
        this.enemy.health = Math.max(0, this.enemy.health - reboundDmg)
        this.addLog('rebound', `大海无量！反弹 ${reboundDmg} 伤害`)
      }
    }

    this.player.health = Math.max(0, this.player.health - damage)
    this.addLog('enemy_attack', `${this.enemy.name}用【${enemyWeaponName}】攻击！${this.player.name}损失 ${damage} 点生命！`)

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
      this.endBattle(true)
    } else if (this.player.health <= 0) {
      this.endBattle(false)
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

  addLog(type, message) {
    this.log.push({ turn: this.turn, type, message, timestamp: Date.now() })
  }
}
