import { ref, reactive, watch } from 'vue'
import { SAVE_KEY, GAME_VERSION } from './data/constants.js'
import { rollSkill, getSkillById } from './data/skills.js'
import { rollWeapon, getWeaponById } from './data/weapons.js'

function getDefaultState() {
  return {
    version: GAME_VERSION,
    player: {
      name: '企鹅勇者',
      level: 1,
      exp: 0,
      strength: 20,
      agility: 10,
      speed: 15,
      maxHealth: 100,
      health: 100,
      stamina: 100,
      spirit: 0,
      gold: 0,
      title: '初心者',
    },
    settings: {
      autoSave: true,
      battleSpeed: 2,
      lastStaminaRecover: Date.now(),
    },
    skills: [],
    weapons: [],
    equippedWeapon: null,
    inventory: [],
    stagesCleared: [],
    towerFloor: 0,
    stats: {
      wins: 0,
      losses: 0,
      streak: 0,
      maxStreak: 0,
    },
  }
}

let gameState = reactive(getDefaultState())
let saveTimeout = null

function scheduleAutoSave() {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveGame()
  }, 500)
}

function saveGame() {
  try {
    const data = JSON.parse(JSON.stringify(gameState))
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save game:', e)
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.player) {
        Object.keys(data.player).forEach(key => {
          gameState.player[key] = data.player[key]
        })
      }
      if (data.settings) {
        Object.keys(data.settings).forEach(key => {
          gameState.settings[key] = data.settings[key]
        })
      }
      if (data.stats) {
        Object.keys(data.stats).forEach(key => {
          gameState.stats[key] = data.stats[key]
        })
      }
      gameState.skills = data.skills || []
      gameState.weapons = data.weapons || []
      gameState.equippedWeapon = data.equippedWeapon || null
      gameState.inventory = data.inventory || []
      gameState.stagesCleared = data.stagesCleared || []
      gameState.towerFloor = data.towerFloor || 0
    }
  } catch (e) {
    console.error('Failed to load game:', e)
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY)
  const fresh = getDefaultState()
  Object.keys(fresh.player).forEach(key => {
    gameState.player[key] = fresh.player[key]
  })
  Object.keys(fresh.settings).forEach(key => {
    gameState.settings[key] = fresh.settings[key]
  })
  gameState.skills = []
  gameState.weapons = []
  gameState.equippedWeapon = null
  gameState.inventory = []
  gameState.stagesCleared = []
  gameState.towerFloor = 0
  gameState.stats = { wins: 0, losses: 0, streak: 0, maxStreak: 0 }
  saveGame()
}

function addExp(amount) {
  gameState.player.exp += amount
  const newSkills = []
  const newWeapons = []
  while (gameState.player.exp >= getExpForLevel(gameState.player.level) && gameState.player.level < 50) {
    gameState.player.exp -= getExpForLevel(gameState.player.level)
    gameState.player.level++
    gameState.player.strength += 3
    gameState.player.agility += 2
    gameState.player.speed += 2
    gameState.player.maxHealth += 15
    gameState.player.health = gameState.player.maxHealth
    gameState.player.stamina = Math.min(100, gameState.player.stamina + 20)
    gameState.player.spirit += 2
    updateTitle()

    const ownedSkillIds = gameState.skills.map(s => s.id)
    const newSkill = rollSkill(gameState.player.level, ownedSkillIds)
    if (newSkill) {
      gameState.skills.push({ id: newSkill.id, level: 1 })
      newSkills.push(newSkill)
    }

    const ownedWeaponIds = gameState.weapons.map(w => w.id)
    const newWeapon = rollWeapon(gameState.player.level, ownedWeaponIds)
    if (newWeapon) {
      gameState.weapons.push({ ...newWeapon, enhanceLevel: 0 })
      newWeapons.push(newWeapon)
    }
  }
  scheduleAutoSave()
  return { newSkills, newWeapons }
}

function getExpForLevel(level) {
  return Math.floor(100 * Math.pow(1.15, level - 1))
}

function updateTitle() {
  const level = gameState.player.level
  if (level >= 45) gameState.player.title = '一代宗师'
  else if (level >= 40) gameState.player.title = '武林高手'
  else if (level >= 35) gameState.player.title = '江湖大侠'
  else if (level >= 30) gameState.player.title = '武林新秀'
  else if (level >= 25) gameState.player.title = '初窥门径'
  else if (level >= 20) gameState.player.title = '小有所成'
  else if (level >= 15) gameState.player.title = '略有薄名'
  else if (level >= 10) gameState.player.title = '初出茅庐'
  else if (level >= 5) gameState.player.title = '勤学苦练'
  else gameState.player.title = '初心者'
}

function consumeStamina(amount) {
  if (gameState.player.stamina < amount) return false
  gameState.player.stamina -= amount
  scheduleAutoSave()
  return true
}

function recoverStamina() {
  if (gameState.player.stamina < 100) {
    gameState.player.stamina = Math.min(100, gameState.player.stamina + 1)
    scheduleAutoSave()
  }
}

function recoverStaminaByTime() {
  const now = Date.now()
  const lastRecover = gameState.settings.lastStaminaRecover || now
  const elapsed = now - lastRecover
  const minutesPassed = Math.floor(elapsed / 60000)
  if (minutesPassed > 0 && gameState.player.stamina < 100) {
    const recoverAmount = Math.min(minutesPassed, 100 - gameState.player.stamina)
    gameState.player.stamina = Math.min(100, gameState.player.stamina + recoverAmount)
    gameState.settings.lastStaminaRecover = now
    scheduleAutoSave()
  }
}

function restRecover() {
  const recoverAmount = Math.min(30, 100 - gameState.player.stamina)
  gameState.player.stamina = Math.min(100, gameState.player.stamina + recoverAmount)
  scheduleAutoSave()
  return recoverAmount
}

function setBattleSpeed(speed) {
  gameState.settings.battleSpeed = speed
  scheduleAutoSave()
}

function getBattleSpeed() {
  return gameState.settings.battleSpeed || 2
}

function addSpirit(amount) {
  gameState.player.spirit += amount
  scheduleAutoSave()
}

function addGold(amount) {
  gameState.player.gold += amount
  scheduleAutoSave()
}

function addWeapon(weapon) {
  const existing = gameState.weapons.find(w => w.id === weapon.id)
  if (existing) {
    existing.count = (existing.count || 1) + 1
  } else {
    gameState.weapons.push({ ...weapon, count: 1 })
  }
  scheduleAutoSave()
}

function equipWeapon(weaponId) {
  gameState.equippedWeapon = weaponId
  scheduleAutoSave()
}

function getEquippedWeapon() {
  if (!gameState.equippedWeapon) return null
  return gameState.weapons.find(w => w.id === gameState.equippedWeapon) || null
}

function enhanceWeapon(weaponId, cost) {
  if (gameState.player.spirit < cost) return false
  const weapon = gameState.weapons.find(w => w.id === weaponId)
  if (!weapon || weapon.enhanceLevel >= 3) return false
  gameState.player.spirit -= cost
  weapon.enhanceLevel++
  scheduleAutoSave()
  return true
}

function learnSkill(skill) {
  if (!gameState.skills.find(s => s.id === skill.id)) {
    gameState.skills.push({ ...skill, level: 1 })
    scheduleAutoSave()
  }
}

function upgradeSkill(skillId, cost) {
  if (gameState.player.spirit < cost) return false
  const skill = gameState.skills.find(s => s.id === skillId)
  if (!skill || skill.level >= skill.maxLevel) return false
  gameState.player.spirit -= cost
  skill.level++
  scheduleAutoSave()
  return true
}

function clearStage(stageId) {
  if (!gameState.stagesCleared.includes(stageId)) {
    gameState.stagesCleared.push(stageId)
    scheduleAutoSave()
  }
}

function addWin() {
  gameState.stats.wins++
  gameState.stats.streak++
  if (gameState.stats.streak > gameState.stats.maxStreak) {
    gameState.stats.maxStreak = gameState.stats.streak
  }
  scheduleAutoSave()
}

function addLoss() {
  gameState.stats.losses++
  gameState.stats.streak = 0
  scheduleAutoSave()
}

function getCombatStats() {
  const player = gameState.player
  let bonusStr = 0, bonusAgi = 0, bonusSpd = 0, bonusHp = 0

  gameState.skills.forEach(skill => {
    if (skill.statBonus) {
      const amount = skill.statBonus.amount * skill.level
      if (skill.statBonus.stat === 'strength') bonusStr += amount
      if (skill.statBonus.stat === 'agility') bonusAgi += amount
      if (skill.statBonus.stat === 'speed') bonusSpd += amount
      if (skill.statBonus.stat === 'health') bonusHp += amount
    }
  })

  return {
    strength: player.strength + bonusStr,
    agility: player.agility + bonusAgi,
    speed: player.speed + bonusSpd,
    maxHealth: player.maxHealth + bonusHp,
  }
}

loadGame()

export const gameStore = {
  state: gameState,
  saveGame,
  loadGame,
  resetGame,
  addExp,
  getExpForLevel,
  consumeStamina,
  recoverStamina,
  recoverStaminaByTime,
  restRecover,
  setBattleSpeed,
  getBattleSpeed,
  addSpirit,
  addGold,
  addWeapon,
  equipWeapon,
  getEquippedWeapon,
  enhanceWeapon,
  learnSkill,
  upgradeSkill,
  clearStage,
  addWin,
  addLoss,
  getCombatStats,
}
