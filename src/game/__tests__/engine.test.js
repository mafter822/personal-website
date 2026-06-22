import { describe, it, expect } from 'vitest'
import { BattleEngine } from '../engine.js'

const makePlayer = (overrides = {}) => ({
  name: '企鹅勇者',
  level: 30,
  strength: 80,
  agility: 40,
  speed: 50,
  maxHealth: 500,
  health: 500,
  classId: null,
  classSkills: null,
  realmBonus: null,
  streakStatus: 'normal',
  ...overrides,
})

const makeEnemy = (overrides = {}) => ({
  name: '测试敌人',
  level: 30,
  strength: 60,
  agility: 30,
  speed: 40,
  health: 400,
  skills: ['basic_attack'],
  rewards: { exp: 100, spirit: 5 },
  ...overrides,
})

const makeWeapon = (overrides = {}) => ({
  id: 'w_brick',
  name: '板砖',
  baseDamage: [10, 20],
  enhanceLevel: 0,
  special: null,
  ...overrides,
})

const defaultSkills = [
  { id: 'talent_str', level: 3 },
  { id: 'atk_thunder', level: 1 },
]

describe('BattleEngine', () => {
  describe('constructor', () => {
    it('should initialize correctly', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], null)
      expect(engine.isOver).toBe(false)
      expect(engine.winner).toBeNull()
      expect(engine.turn).toBe(0)
    })

    it('should set weapon on player', () => {
      const weapon = makeWeapon()
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], weapon)
      expect(engine.player.weapon).toBe(weapon)
    })

    it('should set weapon to null when no weapon', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], null)
      expect(engine.player.weapon).toBeNull()
    })
  })

  describe('start', () => {
    it('should set health to maxHealth', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], null)
      engine.start()
      expect(engine.player.health).toBe(engine.playerCombatStats.maxHealth)
      expect(engine.enemy.health).toBe(400)
    })

    it('should set turn to 1', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], null)
      engine.start()
      expect(engine.turn).toBe(1)
    })
  })

  describe('playerCombatStats', () => {
    it('should return valid numbers', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), defaultSkills, makeWeapon())
      const stats = engine.playerCombatStats
      expect(Number.isFinite(stats.strength)).toBe(true)
      expect(Number.isFinite(stats.agility)).toBe(true)
      expect(Number.isFinite(stats.speed)).toBe(true)
      expect(Number.isFinite(stats.maxHealth)).toBe(true)
    })

    it('should apply skill stat bonuses', () => {
      const engine = new BattleEngine(makePlayer({ strength: 50 }), makeEnemy(), [
        { id: 'talent_str', level: 5 },
      ], null)
      const stats = engine.playerCombatStats
      expect(stats.strength).toBeGreaterThanOrEqual(55)
    })

    it('should apply realm bonuses', () => {
      const engine = new BattleEngine(
        makePlayer({ realmBonus: { strength: 10, agility: 5, speed: 5 } }),
        makeEnemy(), [], null
      )
      const stats = engine.playerCombatStats
      expect(stats.strength).toBeGreaterThanOrEqual(90)
    })

    it('should apply streak status', () => {
      const excited = new BattleEngine(
        makePlayer({ streakStatus: 'excited' }), makeEnemy(), [], null
      )
      const depressed = new BattleEngine(
        makePlayer({ streakStatus: 'depressed' }), makeEnemy(), [], null
      )
      expect(excited.playerCombatStats.strength).toBeGreaterThan(
        depressed.playerCombatStats.strength
      )
    })
  })

  describe('executeAttack - no NaN', () => {
    it('should not produce NaN damage with weapon', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], makeWeapon())
      engine.start()

      for (let i = 0; i < 50; i++) {
        engine.executeAttack(null)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)
        expect(Number.isFinite(engine.player.health)).toBe(true)
      }
    })

    it('should not produce NaN damage without weapon', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], null)
      engine.start()

      for (let i = 0; i < 50; i++) {
        engine.executeAttack(null)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)
      }
    })

    it('should not produce NaN damage with skill', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), defaultSkills, makeWeapon())
      engine.start()

      for (let i = 0; i < 50; i++) {
        engine.executeAttack('atk_thunder')
        expect(Number.isFinite(engine.enemy.health)).toBe(true)
        expect(Number.isFinite(engine.player.health)).toBe(true)
      }
    })

    it('should not produce NaN with weapon with undefined enhanceLevel', () => {
      const weapon = makeWeapon({ enhanceLevel: undefined })
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], weapon)
      engine.start()

      for (let i = 0; i < 50; i++) {
        engine.executeAttack(null)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)
      }
    })

    it('should not produce NaN with weapon with NaN enhanceLevel', () => {
      const weapon = makeWeapon({ enhanceLevel: NaN })
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], weapon)
      engine.start()

      for (let i = 0; i < 50; i++) {
        engine.executeAttack(null)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)
      }
    })

    it('should not produce NaN when attacker has corrupted stats', () => {
      const player = makePlayer({ strength: NaN, agility: NaN })
      const engine = new BattleEngine(player, makeEnemy(), [], makeWeapon())
      engine.start()

      for (let i = 0; i < 20; i++) {
        engine.executeAttack(null)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)
      }
    })
  })

  describe('enemyTurn - no NaN', () => {
    it('should not produce NaN damage', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), [], null)
      engine.start()

      for (let i = 0; i < 50; i++) {
        engine.enemyTurn()
        expect(Number.isFinite(engine.player.health)).toBe(true)
      }
    })

    it('should not produce NaN with player having defensive skills', () => {
      const skills = [
        { id: 'def_rebound', level: 1 },
        { id: 'def_block', level: 1 },
        { id: 'def_dodge', level: 1 },
        { id: 'def_thick', level: 1 },
      ]
      const engine = new BattleEngine(makePlayer(), makeEnemy(), skills, null)
      engine.start()

      for (let i = 0; i < 50; i++) {
        engine.enemyTurn()
        expect(Number.isFinite(engine.player.health)).toBe(true)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)
      }
    })
  })

  describe('full battle simulation - no NaN', () => {
    it('should complete without any NaN values', () => {
      const skills = [
        { id: 'talent_str', level: 3 },
        { id: 'atk_thunder', level: 2 },
        { id: 'atk_kick', level: 1 },
        { id: 'ctrl_glue', level: 1 },
        { id: 'spc_drain', level: 1 },
        { id: 'spc_shadow', level: 1 },
        { id: 'def_rebound', level: 1 },
        { id: 'ctrl_roar', level: 1 },
      ]
      const weapon = makeWeapon({ enhanceLevel: 2 })
      const engine = new BattleEngine(makePlayer(), makeEnemy(), skills, weapon)
      engine.start()

      for (let round = 1; round <= 50; round++) {
        if (engine.isOver) break

        const skillId = engine.autoSelectSkill()
        engine.playerTurn(skillId)

        const logs = engine.log
        logs.forEach(l => {
          expect(l.message).not.toContain('NaN')
        })

        expect(Number.isFinite(engine.player.health)).toBe(true)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)

        if (engine.isOver) break

        engine.enemyTurn()

        expect(Number.isFinite(engine.player.health)).toBe(true)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)

        engine.startNextTurn()
      }
    })

    it('should complete battle with all skills', () => {
      const allSkills = [
        { id: 'talent_str', level: 3 },
        { id: 'talent_agi', level: 2 },
        { id: 'talent_spd', level: 2 },
        { id: 'talent_hp', level: 2 },
        { id: 'atk_thunder', level: 3 },
        { id: 'atk_kick', level: 2 },
        { id: 'atk_tornado', level: 1 },
        { id: 'atk_angel', level: 1 },
        { id: 'ctrl_glue', level: 1 },
        { id: 'ctrl_roar', level: 1 },
        { id: 'spc_heal', level: 1 },
        { id: 'spc_drain', level: 1 },
        { id: 'spc_shadow', level: 1 },
        { id: 'def_rebound', level: 1 },
        { id: 'def_thick', level: 1 },
        { id: 'def_block', level: 1 },
        { id: 'def_dodge', level: 1 },
        { id: 'spc_dead', level: 1 },
      ]
      const weapon = makeWeapon({ enhanceLevel: 3 })
      const engine = new BattleEngine(makePlayer(), makeEnemy(), allSkills, weapon)
      engine.start()

      for (let round = 1; round <= 50; round++) {
        if (engine.isOver) break

        const skillId = engine.autoSelectSkill()
        engine.playerTurn(skillId)

        expect(Number.isFinite(engine.player.health)).toBe(true)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)

        if (engine.isOver) break

        engine.enemyTurn()

        expect(Number.isFinite(engine.player.health)).toBe(true)
        expect(Number.isFinite(engine.enemy.health)).toBe(true)

        engine.startNextTurn()
      }

      expect(engine.isOver).toBe(true)
    })
  })

  describe('chooseEnemySkill', () => {
  it('should return a valid skill or null', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy(), [], null)
    engine.start()
    const skillId = engine.enemySelectSkill()
    if (skillId !== null) {
      expect(typeof skillId).toBe('string')
    }
  })
  })

  describe('autoSelectSkill', () => {
    it('should return null or a valid skill id', () => {
      const engine = new BattleEngine(makePlayer(), makeEnemy(), defaultSkills, null)
      engine.start()
      const skillId = engine.autoSelectSkill()
      if (skillId !== null) {
        expect(typeof skillId).toBe('string')
      }
    })

  it('should prefer heal when low health', () => {
    const skills = [{ id: 'spc_heal', level: 1 }]
    const engine = new BattleEngine(makePlayer(), makeEnemy(), skills, null)
    engine.start()
    engine.player.health = 50
    let healCount = 0
    for (let i = 0; i < 50; i++) {
      const skillId = engine.autoSelectSkill()
      if (skillId === 'spc_heal') healCount++
    }
    expect(healCount).toBeGreaterThan(10)
  })
  })
})
