import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BattleEngine } from '../engine.js'
import { SKILLS, getSkillById } from '../data/skills.js'
import { WEAPONS } from '../data/weapons.js'

const makePlayer = (overrides = {}) => ({
  name: '测试企鹅', level: 30, strength: 80, agility: 40, speed: 50,
  maxHealth: 500, health: 500, streakStatus: 'normal',
  ...overrides,
})

const makeEnemy = (overrides = {}) => ({
  name: '测试敌人', level: 30, strength: 60, agility: 30, speed: 40,
  health: 400, maxHealth: 400, skills: ['basic_attack'], rewards: { exp: 100, spirit: 5 },
  ...overrides,
})

const makeWeapon = (id) => {
  const w = WEAPONS.find(w => w.id === id)
  return w ? { ...w, enhanceLevel: 0 } : null
}

const makeSkillArray = (ids) => ids.map(id => ({ id, level: 1 }))

describe('势如暴雨 (multiAttack)', () => {
  it('投掷武器造成总伤害', () => {
    const weapons = [makeWeapon('w_brick'), makeWeapon('w_needle'), makeWeapon('w_dagger')]
    const engine = new BattleEngine(makePlayer(), makeEnemy(), makeSkillArray(['spc_storm']), weapons[0], weapons)
    engine.start()
    const hpBefore = engine.enemy.health
    engine.playerTurn('spc_storm')
    expect(engine.enemy.health).toBeLessThan(hpBefore)
  })

  it('没有武器时降级为普通攻击', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy(), makeSkillArray(['spc_storm']), null, [])
    engine.start()
    const hpBefore = engine.enemy.health
    engine.playerTurn('spc_storm')
    expect(engine.enemy.health).toBeLessThanOrEqual(hpBefore)
  })
})

describe('如来神掌 (hpPercent)', () => {
  it('打掉敌人一半生命', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy({ health: 400, maxHealth: 400 }), makeSkillArray(['atk_palm']), null, [])
    engine.start()
    engine.playerTurn('atk_palm')
    expect(engine.enemy.health).toBe(200)
  })

  it('敌人半血时使用效果翻倍', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy({ health: 200, maxHealth: 400 }), makeSkillArray(['atk_palm']), null, [])
    engine.start()
    engine.enemy.health = 200
    engine.playerTurn('atk_palm')
    expect(engine.enemy.health).toBe(100)
  })
})

describe('神来一击 (instakill)', () => {
  it('5%几率将敌人降至1血', () => {
    let triggered = false
    for (let i = 0; i < 300; i++) {
      const engine = new BattleEngine(makePlayer(), makeEnemy({ health: 1000, maxHealth: 1000 }), makeSkillArray(['spc_instakill']), null, [])
      engine.start()
      engine.playerTurn('spc_instakill')
      if (engine.enemy.health === 1) { triggered = true; break }
    }
    expect(triggered).toBe(true)
  })
})

describe('普通攻击', () => {
  it('有武器时使用武器伤害', () => {
    const weapon = makeWeapon('w_brick')
    const engine = new BattleEngine(makePlayer(), makeEnemy(), [], weapon, [weapon])
    engine.start()
    engine.playerTurn(null)
    expect(engine.enemy.health).toBeLessThan(400)
  })

  it('无武器时空手攻击', () => {
    let hit = false
    for (let i = 0; i < 10; i++) {
      const engine = new BattleEngine(makePlayer({ agility: 1 }), makeEnemy({ agility: 1, speed: 1 }), [], null, [])
      engine.start()
      engine.playerTurn(null)
      if (engine.enemy.health < 400) { hit = true; break }
    }
    expect(hit).toBe(true)
  })

  it('暴击伤害更高', () => {
    const weapon = makeWeapon('w_brick')
    let normalDmg = 0, critDmg = 0
    for (let i = 0; i < 50; i++) {
      const e1 = new BattleEngine(makePlayer({ agility: 1 }), makeEnemy({ health: 9999, maxHealth: 9999 }), [], weapon, [weapon])
      e1.start(); e1.playerTurn(null); normalDmg += 9999 - e1.enemy.health
      const e2 = new BattleEngine(makePlayer({ agility: 200 }), makeEnemy({ health: 9999, maxHealth: 9999 }), [], weapon, [weapon])
      e2.start(); e2.playerTurn(null); critDmg += 9999 - e2.enemy.health
    }
    expect(critDmg).toBeGreaterThan(normalDmg)
  })
})

describe('控制技能', () => {
  it('胶水眩晕敌人', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy(), makeSkillArray(['ctrl_glue']), null, [])
    engine.start()
    engine.playerTurn('ctrl_glue')
    expect(engine.enemy.isStunned).toBe(true)
    expect(engine.enemy.stunTurns).toBe(3)
  })

  it('企鹅吼忽略敌人', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy(), makeSkillArray(['ctrl_roar']), null, [])
    engine.start()
    engine.playerTurn('ctrl_roar')
    expect(engine.enemy.isIgnored).toBe(true)
    expect(engine.enemy.ignoreTurns).toBe(1)
  })

  it('缴械夺取敌人武器', () => {
    const enemy = makeEnemy({ weapon: makeWeapon('w_brick') })
    const engine = new BattleEngine(makePlayer(), enemy, makeSkillArray(['ctrl_disarm']), null, [])
    engine.start()
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.1)
    engine.playerTurn('ctrl_disarm')
    expect(engine.enemy.weapon).toBeNull()
    spy.mockRestore()
  })
})

describe('增益技能', () => {
  it('残影增加速度', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy(), makeSkillArray(['spc_shadow']), null, [])
    engine.start()
    engine.playerTurn('spc_shadow')
    expect(engine.player.buffs.length).toBe(1)
    expect(engine.player.buffs[0].type).toBe('haste')
  })

  it('嗜血触发吸血', () => {
    const weapon = makeWeapon('w_brick')
    let healed = false
    for (let i = 0; i < 30; i++) {
      const e = new BattleEngine(makePlayer({ health: 100, maxHealth: 500 }), makeEnemy({ health: 9999, maxHealth: 9999 }), makeSkillArray(['spc_drain']), weapon, [weapon])
      e.start()
      e.player.health = 100
      e.playerTurn(null)
      if (e.player.health > 100) { healed = true; break }
    }
    expect(healed).toBe(true)
  })
})

describe('治疗技能', () => {
  it('矿泉水恢复生命', () => {
    const engine = new BattleEngine(makePlayer({ health: 100 }), makeEnemy(), makeSkillArray(['spc_heal']), null, [])
    engine.start()
    engine.player.health = 100
    engine.playerTurn('spc_heal')
    expect(engine.player.health).toBeGreaterThan(100)
  })
})

describe('武器系统', () => {
  it('每把武器伤害不同', () => {
    const results = {}
    WEAPONS.slice(0, 5).forEach(w => {
      let totalDmg = 0
      for (let i = 0; i < 20; i++) {
        const weapon = { ...w, enhanceLevel: 0 }
        const engine = new BattleEngine(makePlayer(), makeEnemy({ health: 99999, maxHealth: 99999 }), [], weapon, [weapon])
        engine.start()
        engine.playerTurn(null)
        totalDmg += 99999 - engine.enemy.health
      }
      results[w.name] = totalDmg / 20
    })
    const vals = Object.values(results)
    expect(Math.max(...vals)).toBeGreaterThan(Math.min(...vals))
  })

  it('强化提升伤害', () => {
    let dmg0 = 0, dmg3 = 0
    for (let i = 0; i < 30; i++) {
      const w0 = makeWeapon('w_brick')
      const e0 = new BattleEngine(makePlayer(), makeEnemy({ health: 99999, maxHealth: 99999 }), [], w0, [w0])
      e0.start(); e0.playerTurn(null); dmg0 += 99999 - e0.enemy.health
      const w3 = { ...makeWeapon('w_brick'), enhanceLevel: 3 }
      const e3 = new BattleEngine(makePlayer(), makeEnemy({ health: 99999, maxHealth: 99999 }), [], w3, [w3])
      e3.start(); e3.playerTurn(null); dmg3 += 99999 - e3.enemy.health
    }
    expect(dmg3).toBeGreaterThan(dmg0)
  })
})

describe('能量系统', () => {
  it('普攻增加能量', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy({ health: 99999, maxHealth: 99999 }), [], null, [])
    engine.start()
    engine.player.energy = 0
    engine.playerTurn(null)
    expect(engine.player.energy).toBe(10)
  })

  it('受击增加能量', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy(), [], null, [])
    engine.start()
    engine.player.energy = 0
    engine.enemyTurn()
    expect(engine.player.energy).toBeGreaterThan(0)
  })
})

describe('PRD伪随机', () => {
  it('暴击率随敏捷增加', () => {
    let lowCrits = 0, highCrits = 0
    for (let i = 0; i < 200; i++) {
      const e1 = new BattleEngine(makePlayer({ agility: 5 }), makeEnemy({ health: 99999, maxHealth: 99999 }), [], makeWeapon('w_brick'), [makeWeapon('w_brick')])
      e1.start(); e1.executeAttack(null); if (e1.player.stats.crits > 0) lowCrits++
      const e2 = new BattleEngine(makePlayer({ agility: 100 }), makeEnemy({ health: 99999, maxHealth: 99999 }), [], makeWeapon('w_brick'), [makeWeapon('w_brick')])
      e2.start(); e2.executeAttack(null); if (e2.player.stats.crits > 0) highCrits++
    }
    expect(highCrits).toBeGreaterThan(lowCrits)
  })
})

describe('硬终止', () => {
  it('50回合后判胜负', () => {
    const engine = new BattleEngine(makePlayer(), makeEnemy({ health: 99999, maxHealth: 99999 }), [], null, [])
    engine.start()
    for (let i = 0; i < 50; i++) {
      if (engine.isOver) break
      engine.playerTurn(null)
      engine.enemyTurn()
      engine.startNextTurn()
    }
    expect(engine.isOver).toBe(true)
  })
})
