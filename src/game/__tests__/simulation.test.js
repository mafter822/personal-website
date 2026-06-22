import { describe, it } from 'vitest'
import { BattleEngine } from '../engine.js'
import { WEAPONS } from '../data/weapons.js'
import { SKILLS } from '../data/skills.js'
import { NPC_ENEMIES } from '../data/pets.js'

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function createRandomPlayer() {
  const level = 15 + Math.floor(Math.random() * 20)
  const strength = 30 + level * 2 + Math.floor(Math.random() * 20)
  const agility = 20 + level + Math.floor(Math.random() * 15)
  const speed = 20 + level + Math.floor(Math.random() * 15)
  const maxHealth = 200 + level * 10 + Math.floor(Math.random() * 50)

  const availableWeapons = WEAPONS.filter(w => w.reqLevel <= level)
  const weapon = availableWeapons.length > 0 ? randomFrom(availableWeapons) : null

  const availableSkills = SKILLS.filter(s => s.unlockLevel <= level && s.category !== 'stat')
  const skillCount = 3 + Math.floor(Math.random() * 4)
  const skills = []
  for (let i = 0; i < skillCount && i < availableSkills.length; i++) {
    const skill = availableSkills.splice(Math.floor(Math.random() * availableSkills.length), 1)[0]
    skills.push({ id: skill.id, level: 1 + Math.floor(Math.random() * 3) })
  }

  return { player: { name: `Player_${level}`, level, strength, agility, speed, maxHealth, health: maxHealth, streakStatus: 'normal', skills }, weapon }
}

function simulateBattle(player, weapon, enemy) {
  const engine = new BattleEngine(player, enemy, player.skills || [], weapon)
  engine.start()

  for (let round = 1; round <= 50; round++) {
    if (engine.isOver) break
    const skillId = engine.autoSelectSkill()
    engine.playerTurn(skillId)
    if (engine.isOver) break
    engine.enemyTurn()
    engine.startNextTurn()
  }

  return {
    won: engine.winner === 'player',
    draw: engine.winner === 'draw',
    rounds: engine.turn,
    playerDamage: engine.player.stats.totalDamage,
    enemyDamage: engine.enemy.enemyTotalDamage,
    playerHp: engine.player.health,
    enemyHp: engine.enemy.health,
  }
}

describe('Monte Carlo 模拟器', () => {
  it('1000次战斗模拟统计', () => {
    const results = { wins: 0, losses: 0, draws: 0, totalRounds: 0, totalPlayerDmg: 0 }

    for (let i = 0; i < 1000; i++) {
      const { player, weapon } = createRandomPlayer()
      const enemyIdx = Math.floor(Math.random() * Math.min(6, NPC_ENEMIES.length))
      const enemy = { ...NPC_ENEMIES[enemyIdx] }

      const result = simulateBattle(player, weapon, enemy)
      if (result.won) results.wins++
      else if (result.draw) results.draws++
      else results.losses++
      results.totalRounds += result.rounds
      results.totalPlayerDmg += result.playerDamage
    }

    const winRate = (results.wins / 1000 * 100).toFixed(1)
    const avgRounds = (results.totalRounds / 1000).toFixed(1)
    const avgDmg = Math.floor(results.totalPlayerDmg / 1000)

    console.log('\n=== Monte Carlo 模拟结果 (1000场战斗) ===')
    console.log(`胜率: ${winRate}% (${results.wins}/${1000})`)
    console.log(`平局: ${results.draws}`)
    console.log(`平均回合数: ${avgRounds}`)
    console.log(`平均总伤害: ${avgDmg}`)
    console.log(`败率: ${(results.losses / 1000 * 100).toFixed(1)}%`)
  })

  it('各武器胜率对比', () => {
    const weaponResults = {}

    for (let i = 0; i < 200; i++) {
      const { player, weapon } = createRandomPlayer()
      const enemyIdx = Math.floor(Math.random() * 5)
      const enemy = { ...NPC_ENEMIES[enemyIdx] }

      const result = simulateBattle(player, weapon, enemy)
      const wName = weapon?.name || '无武器'
      if (!weaponResults[wName]) weaponResults[wName] = { wins: 0, total: 0 }
      weaponResults[wName].total++
      if (result.won) weaponResults[wName].wins++
    }

    console.log('\n=== 各武器胜率 (200场/武器类型) ===')
    Object.entries(weaponResults)
      .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))
      .forEach(([name, data]) => {
        const rate = (data.wins / data.total * 100).toFixed(1)
        console.log(`${name}: ${rate}% (${data.wins}/${data.total})`)
      })
  })

  it('各技能使用频率', () => {
    const skillFreq = {}
    let totalRounds = 0

    for (let i = 0; i < 100; i++) {
      const { player, weapon } = createRandomPlayer()
      const enemy = { ...NPC_ENEMIES[0] }
      const engine = new BattleEngine(player, enemy, player.skills || [], weapon)
      engine.start()

      for (let round = 1; round <= 50; round++) {
        if (engine.isOver) break
        const skillId = engine.autoSelectSkill()
        if (skillId) {
          skillFreq[skillId] = (skillFreq[skillId] || 0) + 1
        }
        totalRounds++
        engine.playerTurn(skillId)
        if (engine.isOver) break
        engine.enemyTurn()
        engine.startNextTurn()
      }
    }

    console.log('\n=== 技能使用频率 (100场战斗) ===')
    Object.entries(skillFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([id, count]) => {
        const skill = SKILLS.find(s => s.id === id)
        const name = skill?.name || id
        const pct = (count / totalRounds * 100).toFixed(1)
        console.log(`${name}: ${pct}% (${count}次)`)
      })
  })
})
