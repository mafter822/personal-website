<template>
  <div class="space-y-4">
    <!-- Speed Control -->
    <div class="flex items-center justify-between">
      <button @click="$emit('battle-end')" class="text-sm text-text-secondary hover:text-primary transition-colors">
        ← 返回乐斗
      </button>
      <div class="flex items-center gap-2">
        <span class="text-xs text-text-secondary">速度:</span>
        <button
          v-for="s in [1, 2, 3]"
          :key="s"
          @click="updateSpeed(s)"
          class="px-2 py-1 text-xs rounded transition-colors"
          :class="battleSpeed === s ? 'bg-primary text-white' : 'bg-bg-card text-text-secondary'"
        >
          {{ s }}x
        </button>
      </div>
    </div>

    <!-- Battle Status -->
    <div class="card p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">🐧</div>
          <div>
            <div class="font-medium">{{ playerName }}</div>
            <div class="text-xs text-text-secondary">Lv.{{ playerLevel }}</div>
          </div>
        </div>
        <div class="text-center text-lg font-bold text-text-muted">VS</div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="font-medium">{{ enemy.name }}</div>
            <div class="text-xs text-text-secondary">Lv.{{ enemy.level }}</div>
          </div>
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">👹</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div class="text-xs text-text-secondary mb-1">❤️ {{ Math.max(0, currentHp) }}/{{ maxHp }}</div>
          <div class="h-3 bg-bg-card rounded-full overflow-hidden">
            <div class="h-full bg-green-500 rounded-full transition-all duration-300" :style="{ width: playerHpPercent + '%' }"></div>
          </div>
        </div>
        <div>
          <div class="text-xs text-text-secondary mb-1">❤️ {{ Math.max(0, enemyHp) }}/{{ enemyMaxHp }}</div>
          <div class="h-3 bg-bg-card rounded-full overflow-hidden">
            <div class="h-full bg-red-500 rounded-full transition-all duration-300" :style="{ width: enemyHpPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Battle Log -->
    <div class="card p-4" v-if="log.length > 0">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold">⚔️ 战斗详情</h3>
        <span class="text-xs text-text-muted">第 {{ currentRound }} 回合</span>
      </div>
      <div ref="logContainer" class="max-h-80 overflow-y-auto space-y-1">
        <div
          v-for="(entry, i) in log"
          :key="i"
          class="text-sm py-1"
          :class="logColor(entry.type)"
        >
          <template v-if="entry.type === 'round_start'">
            <span class="font-bold">【第{{ entry.round }}回合】</span>
          </template>
          <template v-else-if="entry.type === 'round_end'">
            <span class="text-text-muted text-xs">（血量：{{ playerName }} {{ entry.playerHp }} | {{ entry.enemyName }} {{ entry.enemyHp }}）</span>
          </template>
          <template v-else>
            {{ entry.message }}
          </template>
        </div>
      </div>
    </div>

    <!-- Battle Settlement -->
    <div v-if="battleFinished" class="card p-6">
      <div class="text-center mb-6">
        <div class="text-5xl mb-4">{{ won ? '🎉' : '😢' }}</div>
        <h3 class="text-2xl font-bold mb-2">
          {{ won ? '战斗胜利！' : '战斗失败...' }}
        </h3>
      </div>

      <!-- Rewards -->
      <div v-if="won && rewards" class="space-y-4">
        <div class="bg-bg-card rounded-lg p-4">
          <h4 class="font-semibold mb-3">📦 战斗奖励</h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-amber-500">⭐</span>
              <span>经验 +{{ rewards.exp }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-purple-500">💎</span>
              <span>精魄 +{{ rewards.spirit }}</span>
            </div>
          </div>
        </div>

        <!-- Level Up -->
        <div v-if="leveledUp" class="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <h4 class="font-semibold mb-2 text-primary">🎊 升级了！</h4>
          <div class="text-sm space-y-1">
            <div>Lv.{{ oldLevel }} → Lv.{{ state.player.level }}</div>
            <div class="text-text-secondary">力量 +{{ levelUpStats.strength }} · 敏捷 +{{ levelUpStats.agility }} · 速度 +{{ levelUpStats.speed }} · 生命 +{{ levelUpStats.health }}</div>
          </div>
        </div>

        <!-- New Skills -->
        <div v-if="newSkills.length > 0" class="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <h4 class="font-semibold mb-2 text-accent">✨ 获得新技能</h4>
          <div class="space-y-2">
            <div v-for="skill in newSkills" :key="skill.id" class="flex items-center gap-2 text-sm">
              <span class="text-lg">{{ skill.icon }}</span>
              <span class="font-medium text-accent">{{ skill.name }}</span>
              <span class="text-text-secondary">- {{ skill.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <button @click="$emit('battle-end')" class="btn-primary px-8">
          返回乐斗
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="!battleFinished && log.length === 0" class="card p-8 text-center">
      <div class="text-4xl mb-4 animate-bounce">⚔️</div>
      <p class="text-text-secondary">战斗准备中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { gameStore } from '../../game/store.js'
import { BattleEngine } from '../../game/engine.js'
import { WEAPON_QUALITY } from '../../game/data/constants.js'
import { getSkillById as getSkillData } from '../../game/data/skills.js'

const props = defineProps({
  enemy: Object,
  stageId: String,
  friendId: String,
})

const emit = defineEmits(['battle-end'])

const { state, getCombatStats, getEquippedWeapon, addExp, addSpirit, addWin, addLoss, getBattleSpeed, setBattleSpeed, increaseFriendIntimacy } = gameStore

const log = ref([])
const currentHp = ref(0)
const enemyHp = ref(0)
const maxHp = ref(0)
const enemyMaxHp = ref(0)
const playerName = ref('')
const playerLevel = ref(0)
const battleFinished = ref(false)
const won = ref(false)
const rewards = ref(null)
const battleSpeed = ref(getBattleSpeed())
const currentRound = ref(0)
const logContainer = ref(null)

const leveledUp = ref(false)
const oldLevel = ref(0)
const levelUpStats = ref({ strength: 0, agility: 0, speed: 0, health: 0 })
const newSkills = ref([])
const newWeapons = ref([])

function updateSpeed(s) {
  battleSpeed.value = s
  setBattleSpeed(s)
}

const playerHpPercent = computed(() => maxHp.value > 0 ? (currentHp.value / maxHp.value) * 100 : 0)
const enemyHpPercent = computed(() => enemyMaxHp.value > 0 ? (enemyHp.value / enemyMaxHp.value) * 100 : 0)

function getWeaponColor(quality) {
  return WEAPON_QUALITY[quality]?.color || '#9ca3af'
}

function logColor(type) {
  const map = {
    round_start: 'font-bold text-text-primary mt-2',
    round_end: 'text-text-muted text-xs',
    player_attack: 'text-primary',
    enemy_attack: 'text-red-500',
    crit: 'text-amber-500',
    combo: 'text-amber-500',
    dodge: 'text-green-500',
    block: 'text-blue-500',
    counter: 'text-purple-500',
    rebound: 'text-purple-500',
    heal: 'text-green-500',
    control: 'text-purple-500',
    buff: 'text-blue-500',
    special: 'text-pink-500',
    stun: 'text-amber-500',
    win: 'text-green-600 font-bold',
    lose: 'text-red-600 font-bold',
  }
  return map[type] || 'text-text-secondary'
}

function addLog(type, message, extra = {}) {
  log.value.push({ type, message, ...extra })
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms / battleSpeed.value))
}

async function startAutoBattle() {
  const stats = getCombatStats()
  const weapon = getEquippedWeapon()

  playerName.value = state.player.name
  playerLevel.value = state.player.level
  oldLevel.value = state.player.level
  maxHp.value = stats.maxHealth
  currentHp.value = stats.maxHealth
  enemyMaxHp.value = props.enemy.health
  enemyHp.value = props.enemy.health

  const engine = new BattleEngine(
    state.player,
    props.enemy,
    state.skills,
    weapon,
    state.weapons
  )
  engine.start()

  addLog('round_start', '', { round: 1 })
  currentRound.value = 1
  let lastLogIndex = 0

  for (let round = 1; round <= 50; round++) {
    if (engine.isOver) break

    await sleep(400)

    const playerSkill = engine.autoSelectSkill()
    engine.playerTurn(playerSkill)

    const newLogs = engine.log.slice(lastLogIndex)
    newLogs.forEach(l => {
      if (l.type !== 'round_start') {
        addLog(l.type, l.message)
      }
    })
    lastLogIndex = engine.log.length

    currentHp.value = Math.max(0, engine.player.health)
    enemyHp.value = Math.max(0, engine.enemy.health)

    if (engine.isOver) break

    await sleep(300)

    engine.enemyTurn()

    const enemyLogs = engine.log.slice(lastLogIndex)
    enemyLogs.forEach(l => {
      addLog(l.type, l.message)
    })
    lastLogIndex = engine.log.length

    currentHp.value = Math.max(0, engine.player.health)
    enemyHp.value = Math.max(0, engine.enemy.health)

    addLog('round_end', '', {
      round,
      playerName: playerName.value,
      playerHp: currentHp.value,
      enemyName: props.enemy.name,
      enemyHp: enemyHp.value
    })

    if (engine.isOver) break

    engine.startNextTurn()

    if (round < 50) {
      currentRound.value = round + 1
      addLog('round_start', '', { round: round + 1 })
    }
  }

  await sleep(300)

  if (engine.winner === 'player') {
    won.value = true
    rewards.value = engine.rewards

    const oldSkillCount = state.skills.length
    const oldWeaponCount = state.weapons.length

    const expResult = addExp(engine.rewards.exp)
    addSpirit(engine.rewards.spirit)
    addWin()

    if (props.friendId) {
      increaseFriendIntimacy(props.friendId, 5)
    }

    if (state.player.level > oldLevel.value) {
      leveledUp.value = true
      levelUpStats.value = {
        strength: (state.player.level - oldLevel.value) * 3 + 2,
        agility: (state.player.level - oldLevel.value) * 2 + 1,
        speed: (state.player.level - oldLevel.value) * 2 + 1,
        health: (state.player.level - oldLevel.value) * 15,
      }
    }

    if (state.skills.length > oldSkillCount) {
      newSkills.value = state.skills.slice(oldSkillCount).map(s => {
        const skillData = getSkillById(s.id)
        return skillData || { id: s.id, name: s.id, icon: '❓', desc: '未知技能' }
      })
    }

    if (state.weapons.length > oldWeaponCount) {
      newWeapons.value = state.weapons.slice(oldWeaponCount)
    }
  } else {
    won.value = false
    addLoss()
  }

  battleFinished.value = true
}

function getSkillById(id) {
  return getSkillData(id)
}

onMounted(() => {
  startAutoBattle()
})
</script>
