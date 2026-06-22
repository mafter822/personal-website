import { describe, it, expect } from 'vitest'
import { BattleEngine } from '../engine.js'
import { NPC_ENEMIES } from '../data/pets.js'

const makePlayer = (overrides = {}) => ({
  name: '测试企鹅', level: 30, strength: 80, agility: 40, speed: 50,
  maxHealth: 500, health: 500, streakStatus: 'normal',
  ...overrides,
})

const makeEnemy = (overrides = {}) => ({
  ...NPC_ENEMIES[0], ...overrides,
})

describe('状态效果持续时间', () => {
  it('企鹅吼忽略1回合: 第1回合忽略, 第2回合恢复', () => {
    const engine = new BattleEngine(
      makePlayer(),
      makeEnemy(),
      [{ id: 'ctrl_roar', level: 1 }],
      null
    )
    engine.start()

    engine.playerTurn('ctrl_roar')
    expect(engine.enemy.isIgnored).toBe(true)
    expect(engine.enemy.ignoreTurns).toBe(1)

    engine.startNextTurn()

    expect(engine.enemy.ignoreTurns).toBe(0)
    expect(engine.enemy.isIgnored).toBe(false)
  })

  it('真·企鹅吼忽略2回合: 第1-2回合忽略, 第3回合恢复', () => {
    const engine = new BattleEngine(
      makePlayer(),
      makeEnemy(),
      [{ id: 'ctrl_true_roar', level: 1 }],
      null
    )
    engine.start()

    engine.playerTurn('ctrl_true_roar')
    expect(engine.enemy.isIgnored).toBe(true)
    expect(engine.enemy.ignoreTurns).toBe(2)

    engine.startNextTurn()
    expect(engine.enemy.ignoreTurns).toBe(1)
    expect(engine.enemy.isIgnored).toBe(true)

    engine.startNextTurn()
    expect(engine.enemy.ignoreTurns).toBe(0)
    expect(engine.enemy.isIgnored).toBe(false)
  })

  it('胶水眩晕3回合: 3回合后恢复', () => {
    const engine = new BattleEngine(
      makePlayer(),
      makeEnemy(),
      [{ id: 'ctrl_glue', level: 1 }],
      null
    )
    engine.start()

    engine.playerTurn('ctrl_glue')
    expect(engine.enemy.isStunned).toBe(true)
    expect(engine.enemy.stunTurns).toBe(3)

    engine.startNextTurn()
    expect(engine.enemy.stunTurns).toBe(2)
    expect(engine.enemy.isStunned).toBe(true)

    engine.startNextTurn()
    expect(engine.enemy.stunTurns).toBe(1)
    expect(engine.enemy.isStunned).toBe(true)

    engine.startNextTurn()
    expect(engine.enemy.stunTurns).toBe(0)
    expect(engine.enemy.isStunned).toBe(false)
  })

  it('残影加速2回合: 2回合后buff消失', () => {
    const engine = new BattleEngine(
      makePlayer(),
      makeEnemy(),
      [{ id: 'spc_shadow', level: 1 }],
      null
    )
    engine.start()

    engine.playerTurn('spc_shadow')
    expect(engine.player.buffs.length).toBe(1)
    expect(engine.player.buffs[0].type).toBe('haste')
    expect(engine.player.buffs[0].turns).toBe(2)

    engine.startNextTurn()
    expect(engine.player.buffs[0].turns).toBe(1)

    engine.startNextTurn()
    expect(engine.player.buffs.length).toBe(0)
  })

  it('忽略期间敌人攻击被跳过', () => {
    const engine = new BattleEngine(
      makePlayer(),
      makeEnemy(),
      [{ id: 'ctrl_roar', level: 1 }],
      null
    )
    engine.start()

    engine.playerTurn('ctrl_roar')
    const logCountBefore = engine.log.length

    engine.enemyTurn()

    const newLogs = engine.log.slice(logCountBefore)
    const hasIgnoreLog = newLogs.some(l => l.message.includes('被忽略了'))
    expect(hasIgnoreLog).toBe(true)
    expect(engine.player.health).toBe(500)
  })

  it('眩晕期间敌人攻击被跳过', () => {
    const engine = new BattleEngine(
      makePlayer(),
      makeEnemy(),
      [{ id: 'ctrl_glue', level: 1 }],
      null
    )
    engine.start()

    engine.playerTurn('ctrl_glue')
    const logCountBefore = engine.log.length

    engine.enemyTurn()

    const newLogs = engine.log.slice(logCountBefore)
    const hasStunLog = newLogs.some(l => l.message.includes('被黏住了'))
    expect(hasStunLog).toBe(true)
    expect(engine.player.health).toBe(500)
  })

  it('完整50回合战斗中状态效果正常递减', () => {
    const skills = [
      { id: 'ctrl_roar', level: 1 },
      { id: 'ctrl_glue', level: 1 },
      { id: 'spc_shadow', level: 1 },
      { id: 'atk_thunder', level: 2 },
      { id: 'spc_heal', level: 1 },
    ]
    const engine = new BattleEngine(makePlayer(), makeEnemy(), skills, null)
    engine.start()

    for (let round = 1; round <= 50; round++) {
      if (engine.isOver) break

      const skillId = engine.autoSelectSkill()
      engine.playerTurn(skillId)

      expect(Number.isFinite(engine.enemy.health)).toBe(true)
      expect(Number.isFinite(engine.player.health)).toBe(true)

      if (engine.isOver) break

      engine.enemyTurn()

      expect(Number.isFinite(engine.enemy.health)).toBe(true)
      expect(Number.isFinite(engine.player.health)).toBe(true)

      engine.startNextTurn()

      if (round > 5) {
        expect(engine.enemy.ignoreTurns).toBe(0)
        expect(engine.enemy.isIgnored).toBe(false)
      }
    }
  })
})
