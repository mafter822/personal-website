export class Fighter {
  constructor(config = {}) {
    this.id = config.id || Math.random().toString(36).slice(2, 9)
    this.name = config.name || '未知'
    this.isDummy = config.isDummy || false
    this.classId = config.classId || null
    this.classSkills = config.classSkills || null
    this.realmBonus = config.realmBonus || null
    this.streakStatus = config.streakStatus || 'normal'
    this.level = config.level || 1
    this.dodgeRate = config.dodgeRate ?? null
    this.blockRate = config.blockRate ?? null
    this.rewards = config.rewards || { exp: 50, spirit: 1 }

    this.attributes = new AttributeComponent(config)
    this.actions = new ActionComponent(config)
    this.status = new StatusComponent()
    this.stats = new CombatStats()
    this.enemyTotalDamage = 0
  }

  get health() { return this.attributes.health }
  set health(v) { this.attributes.health = v }

  get maxHealth() { return this.attributes.maxHealth }
  set maxHealth(v) { this.attributes.maxHealth = v }

  get energy() { return this.attributes.energy }
  set energy(v) { this.attributes.energy = v }

  get strength() { return this.attributes.strength }
  get agility() { return this.attributes.agility }
  get speed() { return this.attributes.speed }

  get buffs() { return this.status.buffs }
  get debuffs() { return this.status.debuffs }

  get isStunned() { return this.status.isStunned }
  set isStunned(v) { this.status.isStunned = v }

  get stunTurns() { return this.status.stunTurns }
  set stunTurns(v) { this.status.stunTurns = v }

  get isIgnored() { return this.status.isIgnored }
  set isIgnored(v) { this.status.isIgnored = v }

  get ignoreTurns() { return this.status.ignoreTurns }
  set ignoreTurns(v) { this.status.ignoreTurns = v }

  get restTurns() { return this.status.restTurns }
  set restTurns(v) { this.status.restTurns = v }

  get undyingUsed() { return this.status.undyingUsed }
  set undyingUsed(v) { this.status.undyingUsed = v }

  get weaponDisarmed() { return this.status.weaponDisarmed }
  set weaponDisarmed(v) { this.status.weaponDisarmed = v }

  get weapon() { return this.actions.weapon }
  set weapon(v) { this.actions.weapon = v }

  get skills() { return this.actions.skills }
  set skills(v) { this.actions.skills = v }

  get usedActiveSkills() { return this.actions.usedActiveSkills }

  get critCounter() { return this.actions.critCounter }
  set critCounter(v) { this.actions.critCounter = v }

  get dodgeCounter() { return this.actions.dodgeCounter }
  set dodgeCounter(v) { this.actions.dodgeCounter = v }
}

export class AttributeComponent {
  constructor(config) {
    this.strength = Number.isFinite(config.strength) ? config.strength : 0
    this.agility = Number.isFinite(config.agility) ? config.agility : 0
    this.speed = Number.isFinite(config.speed) ? config.speed : 0
    this.maxHealth = config.maxHealth || config.health || 100
    this.health = config.health || this.maxHealth
    this.energy = 0
    this.energyMax = 100
  }

  applyBonus(bonus) {
    if (bonus.strength) this.strength += bonus.strength
    if (bonus.agility) this.agility += bonus.agility
    if (bonus.speed) this.speed += bonus.speed
    if (bonus.maxHealth) this.maxHealth += bonus.maxHealth
  }
}

export class ActionComponent {
  constructor(config) {
    this.weapon = config.weapon || null
    this.skills = config.skills || []
    this.usedActiveSkills = new Set()
    this.critCounter = 0
    this.dodgeCounter = 0
  }

  getWeaponName() {
    return this.weapon ? this.weapon.name : '拳头'
  }

  getWeaponType() {
    return this.weapon?.type || null
  }

  resetUsedSkills() {
    this.usedActiveSkills.clear()
  }

  markSkillUsed(skillIdOrEffect) {
    this.usedActiveSkills.add(skillIdOrEffect)
  }

  isSkillUsed(skillIdOrEffect) {
    return this.usedActiveSkills.has(skillIdOrEffect)
  }
}

export class StatusComponent {
  constructor() {
    this.buffs = []
    this.debuffs = []
    this.isStunned = false
    this.stunTurns = 0
    this.isIgnored = false
    this.ignoreTurns = 0
    this.weaponDisarmed = false
    this.restTurns = 0
    this.undyingUsed = false
  }

  addBuff(buff) {
    this.buffs.push(buff)
  }

  addDebuff(debuff) {
    this.debuffs.push(debuff)
  }

  processBuffs(callback) {
    this.buffs = this.buffs.filter(b => {
      if (b.onTick) b.onTick(callback)
      b.turns--
      return b.turns > 0
    })
  }

  processDebuffs(callback) {
    this.debuffs = this.debuffs.filter(d => {
      if (d.onTick) d.onTick(callback)
      d.turns--
      return d.turns > 0
    })
  }

  processStun() {
    if (this.stunTurns > 0) {
      this.stunTurns--
      this.isStunned = this.stunTurns > 0
    }
  }

  processIgnore() {
    if (this.ignoreTurns > 0) {
      this.ignoreTurns--
      this.isIgnored = this.ignoreTurns > 0
    }
  }

  processRest() {
    if (this.restTurns > 0) {
      this.restTurns--
    }
  }

  stun(turns) {
    this.stunTurns = turns
    this.isStunned = true
  }

  ignore(turns) {
    this.ignoreTurns = turns
    this.isIgnored = true
  }

  rest(turns) {
    this.restTurns = turns
  }
}

export class CombatStats {
  constructor() {
    this.totalDamage = 0
    this.crits = 0
    this.maxHit = 0
    this.hits = 0
    this.misses = 0
    this.kills = 0
  }

  recordHit(damage, isCrit) {
    this.totalDamage += damage
    this.hits++
    if (damage > this.maxHit) this.maxHit = damage
    if (isCrit) this.crits++
  }

  recordMiss() {
    this.misses++
  }

  recordKill() {
    this.kills++
  }

  get critRate() {
    return this.hits > 0 ? this.crits / this.hits : 0
  }
}
