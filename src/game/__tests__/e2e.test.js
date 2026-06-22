import { describe, it, expect } from 'vitest'
import { BattleEngine } from '../engine.js'
import { CALC } from '../data/constants.js'
import { WEAPONS } from '../data/weapons.js'
import { SKILLS, getSkillById } from '../data/skills.js'
import { NPC_ENEMIES, NPC_SKILLS } from '../data/pets.js'

describe('端到端: 模拟真实战斗', () => {
  function simulateBattle(playerSkills, weaponId, enemyIndex) {
    const weapon = weaponId ? WEAPONS.find(w => w.id === weaponId) : null
    const enemy = { ...NPC_ENEMIES[enemyIndex] }
    const player = {
      name: '测试企鹅',
      level: 30,
      strength: 80,
      agility: 40,
      speed: 50,
      maxHealth: 500,
      health: 500,
      streakStatus: 'normal',
    }

    const skills = playerSkills.map(id => ({ id, level: 3 }))
    const engine = new BattleEngine(player, enemy, skills, weapon)
    engine.start()

    const allLogs = []
    let roundCount = 0

    for (let round = 1; round <= 50; round++) {
      if (engine.isOver) break
      roundCount++

      const skillId = engine.autoSelectSkill()
      engine.playerTurn(skillId)

      engine.log.slice(-3).forEach(l => allLogs.push(l.message))

      if (Number.isNaN(engine.enemy.health) || Number.isNaN(engine.player.health)) {
        return { won: false, error: 'NaN detected after playerTurn', round, logs: allLogs }
      }

      if (engine.isOver) break

      engine.enemyTurn()

      engine.log.slice(-3).forEach(l => allLogs.push(l.message))

      if (Number.isNaN(engine.enemy.health) || Number.isNaN(engine.player.health)) {
        return { won: false, error: 'NaN detected after enemyTurn', round, logs: allLogs }
      }

      engine.startNextTurn()
    }

    return {
      won: engine.winner === 'player',
      round: roundCount,
      playerHp: engine.player.health,
      enemyHp: engine.enemy.health,
      logs: allLogs.slice(-10),
    }
  }

  it('Lv30玩家 vs 企鹅新手(0号)', () => {
    const result = simulateBattle(
      ['atk_thunder', 'atk_kick', 'ctrl_glue', 'spc_heal', 'spc_drain', 'spc_dead'],
      'w_brick',
      0
    )
    expect(result.error).toBeUndefined()
    expect(result.playerHp).toBeGreaterThanOrEqual(0)
    expect(result.enemyHp).toBeGreaterThanOrEqual(0)
    expect(result.won).toBe(true)
  })

  it('Lv30玩家 vs 冰原巡逻兵(1号)', () => {
    const result = simulateBattle(
      ['atk_thunder', 'atk_kick', 'ctrl_glue', 'spc_heal', 'spc_drain'],
      'w_brick',
      1
    )
    expect(result.error).toBeUndefined()
    expect(result.playerHp).toBeGreaterThanOrEqual(0)
    expect(result.enemyHp).toBeGreaterThanOrEqual(0)
  })

  it('Lv30玩家 vs 北极熊王(6号) - 强敌', () => {
    const result = simulateBattle(
      ['atk_thunder', 'atk_kick', 'atk_tornado', 'atk_angel', 'ctrl_glue', 'ctrl_roar', 'spc_heal', 'spc_drain', 'spc_dead', 'def_rebound', 'def_thick', 'def_block', 'spc_shadow', 'talent_str', 'talent_agi'],
      'w_hammer',
      6
    )
    expect(result.error).toBeUndefined()
    expect(result.playerHp).toBeGreaterThanOrEqual(0)
    expect(result.enemyHp).toBeGreaterThanOrEqual(0)
  })

  it('Lv30玩家 vs 冰龙长老(7号) - 最强敌人', () => {
    const result = simulateBattle(
      ['atk_thunder', 'atk_kick', 'atk_tornado', 'atk_angel', 'ctrl_glue', 'ctrl_roar', 'spc_heal', 'spc_drain', 'spc_dead', 'def_rebound', 'def_thick', 'def_block', 'spc_shadow', 'talent_str', 'talent_agi', 'talent_spd', 'talent_hp'],
      'w_spear',
      7
    )
    expect(result.error).toBeUndefined()
    expect(result.playerHp).toBeGreaterThanOrEqual(0)
    expect(result.enemyHp).toBeGreaterThanOrEqual(0)
  })

  it('空手玩家 vs 企鹅新手', () => {
    const result = simulateBattle(
      ['atk_thunder', 'atk_kick'],
      null,
      0
    )
    expect(result.error).toBeUndefined()
    expect(result.playerHp).toBeGreaterThanOrEqual(0)
    expect(result.enemyHp).toBeGreaterThanOrEqual(0)
  })

  it('100次战斗模拟无NaN', () => {
    const allSkills = ['atk_thunder', 'atk_kick', 'atk_tornado', 'atk_angel', 'ctrl_glue', 'ctrl_roar', 'spc_heal', 'spc_drain', 'spc_dead', 'def_rebound', 'spc_shadow']
    const weaponIds = ['w_brick', 'w_hammer', 'w_spear', 'w_sickle', null]

    for (let i = 0; i < 100; i++) {
      const enemyIdx = Math.floor(Math.random() * NPC_ENEMIES.length)
      const weaponIdx = Math.floor(Math.random() * weaponIds.length)
      const result = simulateBattle(allSkills, weaponIds[weaponIdx], enemyIdx)
      expect(result.error).toBeUndefined()
      expect(Number.isFinite(result.playerHp)).toBe(true)
      expect(Number.isFinite(result.enemyHp)).toBe(true)
    }
  })
})

describe('端到端: 存档数据加载兼容性', () => {
  it('处理旧存档中可能的NaN数据', () => {
    const corruptedPlayer = {
      name: '测试',
      level: 30,
      strength: NaN,
      agility: 40,
      speed: NaN,
      maxHealth: 580,
      health: NaN,
      streakStatus: 'normal',
    }
    const enemy = { ...NPC_ENEMIES[0] }
    const engine = new BattleEngine(corruptedPlayer, enemy, [], null)
    engine.start()

    for (let i = 0; i < 10; i++) {
      if (engine.isOver) break
      engine.executeAttack(null)
      expect(Number.isFinite(engine.enemy.health)).toBe(true)
      if (!engine.isOver) {
        engine.enemyTurn()
        expect(Number.isFinite(engine.player.health)).toBe(true)
      }
    }
  })
})
