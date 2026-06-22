import { describe, it, expect } from 'vitest'
import { BattleEngine } from '../engine.js'

const makePlayer = (overrides = {}) => ({
  name: '测试企鹅', level: 30, strength: 80, agility: 40, speed: 50,
  maxHealth: 500, health: 500, streakStatus: 'normal',
  ...overrides,
})

const makeDummy = (overrides = {}) => ({
  name: '训练木桩', level: 99, strength: 0, agility: 0, speed: 0,
  health: 10000, skills: [], rewards: { exp: 0, spirit: 0 },
  isDummy: true, dodgeRate: 0, blockRate: 0,
  ...overrides,
})

describe('木桩战斗', () => {
  it('木桩不攻击玩家', () => {
    const engine = new BattleEngine(makePlayer(), makeDummy(), [], null)
    engine.start()
    const hpBefore = engine.player.health
    engine.enemyTurn()
    expect(engine.player.health).toBe(hpBefore)
  })

  it('木桩被击杀后自动回满血', () => {
    const engine = new BattleEngine(makePlayer({ strength: 9999 }), makeDummy({ health: 1, maxHealth: 10000, dodgeRate: 0, blockRate: 0 }), [], null)
    engine.start()
    engine.playerTurn(null)
    expect(engine.enemy.health).toBe(10000)
    expect(engine.isOver).toBe(false)
    expect(engine.stats.kills).toBe(1)
  })

  it('木桩击杀后战斗不结束', () => {
    const engine = new BattleEngine(makePlayer({ strength: 9999 }), makeDummy({ health: 1, maxHealth: 10000, dodgeRate: 0, blockRate: 0 }), [], null)
    engine.start()
    engine.playerTurn(null)
    expect(engine.enemy.health).toBe(10000)
    expect(engine.isOver).toBe(false)
  })

  it('普通敌人被击杀后战斗结束', () => {
    const enemy = { name: '敌人', level: 1, strength: 10, agility: 10, speed: 10, health: 1, skills: [], rewards: { exp: 10, spirit: 1 } }
    const engine = new BattleEngine(makePlayer({ strength: 9999 }), enemy, [], null)
    engine.start()
    engine.playerTurn(null)
    expect(engine.isOver).toBe(true)
    expect(engine.winner).toBe('player')
  })

  it('stats 正确累计', () => {
    const engine = new BattleEngine(makePlayer(), makeDummy({ health: 100, dodgeRate: 0, blockRate: 0 }), [], null)
    engine.start()
    for (let i = 0; i < 10; i++) {
      engine.playerTurn(null)
    }
    const s = engine.getStats()
    expect(s.totalDamage).toBeGreaterThan(0)
    expect(s.hits).toBeGreaterThan(0)
  })

  it('木桩闪避率生效', () => {
    const engine = new BattleEngine(makePlayer(), makeDummy({ dodgeRate: 1 }), [], null)
    engine.start()
    for (let i = 0; i < 10; i++) {
      engine.playerTurn(null)
    }
    expect(engine.stats.misses).toBe(10)
    expect(engine.stats.hits).toBe(0)
  })

  it('木桩格挡率生效', () => {
    const engine = new BattleEngine(makePlayer(), makeDummy({ blockRate: 1 }), [], null)
    engine.start()
    engine.playerTurn(null)
    expect(engine.stats.misses).toBe(0)
    expect(engine.stats.hits).toBe(1)
  })

  it('100回合木桩战斗无NaN', () => {
    const engine = new BattleEngine(makePlayer(), makeDummy(), [], null)
    engine.start()
    for (let i = 0; i < 100; i++) {
      engine.playerTurn(null)
      engine.enemyTurn()
      engine.startNextTurn()
      expect(Number.isFinite(engine.player.health)).toBe(true)
      expect(Number.isFinite(engine.enemy.health)).toBe(true)
    }
  })
})
