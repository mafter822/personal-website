import { describe, it, expect } from 'vitest'
import { CALC } from '../data/constants.js'

describe('CALC.damage', () => {
  const attacker = { strength: 100, agility: 50, speed: 50 }

  it('should return a finite number with weapon', () => {
    const weapon = { baseDamage: [10, 20], enhanceLevel: 0 }
    const result = CALC.damage(attacker, weapon, null)
    expect(Number.isFinite(result)).toBe(true)
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it('should return a finite number without weapon (bare hands)', () => {
    const result = CALC.damage(attacker, null, null)
    expect(Number.isFinite(result)).toBe(true)
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it('should return a finite number with skill that has damageMul', () => {
    const weapon = { baseDamage: [10, 20], enhanceLevel: 0 }
    const skill = { damageMul: 1.5 }
    const result = CALC.damage(attacker, weapon, skill)
    expect(Number.isFinite(result)).toBe(true)
  })

  it('should return a finite number with skill that has no damageMul', () => {
    const weapon = { baseDamage: [10, 20], enhanceLevel: 0 }
    const skill = { name: 'some skill' }
    const result = CALC.damage(attacker, weapon, skill)
    expect(Number.isFinite(result)).toBe(true)
  })

  it('should handle weapon with undefined enhanceLevel', () => {
    const weapon = { baseDamage: [10, 20] }
    const result = CALC.damage(attacker, weapon, null)
    expect(Number.isFinite(result)).toBe(true)
  })

  it('should handle weapon with NaN enhanceLevel', () => {
    const weapon = { baseDamage: [10, 20], enhanceLevel: NaN }
    const result = CALC.damage(attacker, weapon, null)
    expect(Number.isFinite(result)).toBe(true)
  })

  it('should handle attacker with NaN strength', () => {
    const badAttacker = { strength: NaN, agility: 50, speed: 50 }
    const weapon = { baseDamage: [10, 20], enhanceLevel: 0 }
    const result = CALC.damage(badAttacker, weapon, null)
    expect(Number.isFinite(result)).toBe(true)
  })

  it('should handle attacker with undefined strength (bare hands)', () => {
    const badAttacker = { agility: 50, speed: 50 }
    const result = CALC.damage(badAttacker, null, null)
    expect(Number.isFinite(result)).toBe(true)
  })

  it('damage with weapon should generally be higher than bare hands for low strength', () => {
    const weakAttacker = { strength: 20, agility: 10, speed: 10 }
    const weapon = { baseDamage: [50, 80], enhanceLevel: 0 }
    let weaponDmg = 0, bareDmg = 0
    for (let i = 0; i < 200; i++) {
      weaponDmg += CALC.damage(weakAttacker, weapon, null)
      bareDmg += CALC.damage(weakAttacker, null, null)
    }
    expect(weaponDmg).toBeGreaterThan(bareDmg)
  })

  it('skill multiplier should increase damage', () => {
    const weapon = { baseDamage: [10, 20], enhanceLevel: 0 }
    let normalDmg = 0, skillDmg = 0
    for (let i = 0; i < 100; i++) {
      normalDmg += CALC.damage(attacker, weapon, null)
      skillDmg += CALC.damage(attacker, weapon, { damageMul: 2.0 })
    }
    expect(skillDmg).toBeGreaterThan(normalDmg)
  })

  it('enhance level should increase damage', () => {
    const weapon0 = { baseDamage: [10, 20], enhanceLevel: 0 }
    const weapon3 = { baseDamage: [10, 20], enhanceLevel: 3 }
    let dmg0 = 0, dmg3 = 0
    for (let i = 0; i < 100; i++) {
      dmg0 += CALC.damage(attacker, weapon0, null)
      dmg3 += CALC.damage(attacker, weapon3, null)
    }
    expect(dmg3).toBeGreaterThan(dmg0)
  })
})

describe('CALC.critRate', () => {
  it('should return a valid rate', () => {
    const rate = CALC.critRate(50)
    expect(rate).toBeGreaterThanOrEqual(0)
    expect(rate).toBeLessThanOrEqual(0.4)
  })

  it('should increase with agility', () => {
    expect(CALC.critRate(100)).toBeGreaterThan(CALC.critRate(10))
  })
})

describe('CALC.dodgeRate', () => {
  it('should return a valid rate', () => {
    const rate = CALC.dodgeRate(50, 50)
    expect(rate).toBeGreaterThanOrEqual(0)
    expect(rate).toBeLessThanOrEqual(0.35)
  })

  it('should increase with agility and speed', () => {
    expect(CALC.dodgeRate(100, 100)).toBeGreaterThan(CALC.dodgeRate(10, 10))
  })
})

describe('CALC.blockRate', () => {
  it('should return 0.15', () => {
    expect(CALC.blockRate()).toBe(0.15)
  })
})

describe('CALC.counterRate', () => {
  it('should return a valid rate', () => {
    const rate = CALC.counterRate(50)
    expect(rate).toBeGreaterThanOrEqual(0)
    expect(rate).toBeLessThanOrEqual(0.3)
  })
})

describe('CALC.reduceDamage', () => {
  it('should reduce damage based on defense', () => {
    const reduced = CALC.reduceDamage(100, 200)
    expect(reduced).toBeLessThan(200)
    expect(reduced).toBeGreaterThan(0)
  })

  it('should not reduce damage with 0 defense', () => {
    expect(CALC.reduceDamage(0, 100)).toBe(100)
  })
})
