import { ref, reactive, watch } from 'vue'
import { SAVE_KEY, GAME_VERSION } from './data/constants.js'
import { rollSkill, getSkillById } from './data/skills.js'
import { rollWeapon, getWeaponById } from './data/weapons.js'
import { ACHIEVEMENTS } from './data/achievements.js'

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
      visibleTabs: {
        home: true,
        stage: true,
        tower: true,
        friends: true,
        ranking: true,
        realm: true,
        class: true,
        skills: true,
        weapons: true,
        shop: true,
        achievements: true,
        dummy: true,
        menu: true,
      },
    },
    skills: [],
    weapons: [],
    equippedWeapon: null,
    inventory: [],
    stagesCleared: [],
    towerProgress: { maxFloor: 0, dailyUsed: 0, lastResetDate: null },
    streakStatus: 'normal',
    classSkills: {},
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
    if (!saved) return
    const data = JSON.parse(saved)
    if (data.player && typeof data.player === 'object') {
      const p = data.player
      if (typeof p.level === 'number' && p.level >= 1 && p.level <= 50) Object.assign(gameState.player, p)
    }
    if (data.settings && typeof data.settings === 'object') Object.assign(gameState.settings, data.settings)
    if (data.stats && typeof data.stats === 'object') Object.assign(gameState.stats, data.stats)
    if (Array.isArray(data.skills)) gameState.skills = data.skills
    if (Array.isArray(data.weapons)) gameState.weapons = data.weapons
    if (data.equippedWeapon) gameState.equippedWeapon = data.equippedWeapon
    if (data.classSkills && typeof data.classSkills === 'object') gameState.classSkills = data.classSkills
    if (Array.isArray(data.stagesCleared)) gameState.stagesCleared = data.stagesCleared

    migrateEquipmentFromWeapons()
  } catch (e) {
    console.error('Failed to load game:', e)
  }
}

function migrateEquipmentFromWeapons() {
  const weaponsOnly = gameState.weapons.filter(item => !item.id?.startsWith('eq_'))

  if (weaponsOnly.length < gameState.weapons.length) {
    gameState.weapons = weaponsOnly
    if (!gameState.equippedWeapon && weaponsOnly.length > 0) {
      gameState.equippedWeapon = weaponsOnly[0].id
    }
    scheduleAutoSave()
  } else if (!gameState.equippedWeapon && weaponsOnly.length > 0) {
    gameState.equippedWeapon = weaponsOnly[0].id
    scheduleAutoSave()
  }
}

function resetGame() {
  const fresh = getDefaultState()
  Object.assign(gameState.player, fresh.player)
  Object.assign(gameState.settings, fresh.settings)
  Object.assign(gameState.stats, fresh.stats)
  gameState.skills = []
  gameState.weapons = []
  gameState.equippedWeapon = null
  gameState.classSkills = {}
  gameState.stagesCleared = []
  gameState.towerProgress = { maxFloor: 0, dailyUsed: 0, lastResetDate: null }
}

function addRandomAttributes(count) {
  const stats = ['strength', 'agility', 'speed']
  const bonus = { strength: 0, agility: 0, speed: 0 }
  for (let i = 0; i < count; i++) {
    const stat = stats[Math.floor(Math.random() * stats.length)]
    gameState.player[stat]++
    bonus[stat]++
  }
  return bonus
}

function addExp(amount) {
  gameState.player.exp += amount
  const newSkills = []
  const newWeapons = []
  const levelUpDetails = []

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

    const randomBonus = addRandomAttributes(2)
    levelUpDetails.push({
      level: gameState.player.level,
      randomBonus,
    })

    if (gameState.player.level % 2 === 0) {
      const roll = Math.random()
      if (roll < 0.5) {
        const ownedSkillIds = gameState.skills.map(s => s.id)
        const newSkill = rollSkill(gameState.player.level, ownedSkillIds)
        if (newSkill) {
          gameState.skills.push({ id: newSkill.id, level: 1 })
          newSkills.push(newSkill)
        }
      } else {
        const ownedWeaponIds = gameState.weapons.map(w => w.id)
        const newWeapon = rollWeapon(gameState.player.level, ownedWeaponIds)
        if (newWeapon) {
          gameState.weapons.push({ ...newWeapon, enhanceLevel: 0 })
          newWeapons.push(newWeapon)
        }
      }
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
    if (weapon.evolutions) {
      for (const evo of weapon.evolutions) {
        if (existing.count >= evo.count && !existing.evolved) {
          existing.name = evo.name
          existing.baseDamage = evo.baseDamage
          existing.special = evo.special
          existing.desc = evo.desc
          existing.evolved = evo.name
          existing.count = 0
          break
        }
      }
    }
  } else {
    gameState.weapons.push({ ...weapon, count: 1, evolved: null })
    if (!gameState.equippedWeapon) {
      gameState.equippedWeapon = weapon.id
    }
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
  gameState.stats.totalBattles = (gameState.stats.totalBattles || 0) + 1
  if (gameState.stats.streak > gameState.stats.maxStreak) {
    gameState.stats.maxStreak = gameState.stats.streak
  }
  
  if (gameState.stats.streak >= 3) {
    gameState.player.streakStatus = 'excited'
  } else {
    gameState.player.streakStatus = 'normal'
  }
  
  checkAndUnlockAchievements()
  scheduleAutoSave()
}

function addLoss() {
  gameState.stats.losses++
  gameState.stats.totalBattles = (gameState.stats.totalBattles || 0) + 1
  
  gameState.stats.consecutiveLosses = (gameState.stats.consecutiveLosses || 0) + 1
  gameState.stats.streak = 0
  
  if (gameState.stats.consecutiveLosses >= 3) {
    gameState.player.streakStatus = 'depressed'
  } else {
    gameState.player.streakStatus = 'normal'
  }
  
  checkAndUnlockAchievements()
  scheduleAutoSave()
}

function increaseFriendIntimacy(friendId, amount = 5) {
  if (!gameState.friends) gameState.friends = []
  const friend = gameState.friends.find(f => f.id === friendId)
  if (friend) {
    friend.intimacy = Math.min(9999, (friend.intimacy || 0) + amount)
  } else {
    gameState.friends.push({ id: friendId, intimacy: amount })
  }
  scheduleAutoSave()
}

function checkAndUnlockAchievements() {
  if (!gameState.achievements) gameState.achievements = []
  
  const stats = {
    wins: gameState.stats.wins,
    losses: gameState.stats.losses,
    streak: gameState.stats.streak,
    maxStreak: gameState.stats.maxStreak,
    level: gameState.player.level,
    weapons: gameState.weapons.length,
    skills: gameState.skills.length,
    tower: gameState.towerProgress?.maxFloor || 0,
    totalBattles: gameState.stats.totalBattles || 0,
  }
  
  ACHIEVEMENTS.forEach(ach => {
    if (gameState.achievements.includes(ach.id)) return
    
    let value = 0
    switch (ach.condition.type) {
      case 'wins': value = stats.wins; break
      case 'streak': value = stats.maxStreak; break
      case 'level': value = stats.level; break
      case 'weapons': value = stats.weapons; break
      case 'skills': value = stats.skills; break
      case 'tower': value = stats.tower; break
      case 'totalBattles': value = stats.totalBattles; break
    }
    
    if (value >= ach.condition.value) {
      gameState.achievements.push(ach.id)
      if (ach.reward.exp) gameState.player.exp += ach.reward.exp
      if (ach.reward.spirit) gameState.player.spirit += ach.reward.spirit
    }
  })
}

function getCombatStats() {
  const player = gameState.player
  let bonusStr = 0, bonusAgi = 0, bonusSpd = 0, bonusHp = 0

  gameState.skills.forEach(skill => {
    if (skill.statBonus) {
      const amount = (skill.statBonus.amount || 0) * (skill.level || 0)
      if (skill.statBonus.stat === 'strength') bonusStr += amount
      if (skill.statBonus.stat === 'agility') bonusAgi += amount
      if (skill.statBonus.stat === 'speed') bonusSpd += amount
      if (skill.statBonus.stat === 'health') bonusHp += amount
    }
  })

  const baseStr = Number.isFinite(player.strength) ? player.strength : 0
  const baseAgi = Number.isFinite(player.agility) ? player.agility : 0
  const baseSpd = Number.isFinite(player.speed) ? player.speed : 0
  const baseHp = Number.isFinite(player.maxHealth) ? player.maxHealth : 100

  return {
    strength: baseStr + bonusStr,
    agility: baseAgi + bonusAgi,
    speed: baseSpd + bonusSpd,
    maxHealth: baseHp + bonusHp,
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
