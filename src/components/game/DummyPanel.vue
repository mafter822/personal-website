<template>
  <div class="space-y-4">
    <!-- Config -->
    <div class="card p-4">
      <h3 class="text-lg font-semibold mb-4">🎯 木桩训练</h3>
      <p class="text-sm text-text-secondary mb-4">配置木桩属性，测试你的伤害输出</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <div class="text-xs text-text-muted mb-2">木桩血量</div>
          <div class="flex gap-1">
            <button v-for="hp in hpOptions" :key="hp" @click="config.hp = hp"
              class="px-3 py-1.5 text-xs rounded-lg transition-all"
              :class="config.hp === hp ? 'bg-primary text-white' : 'bg-bg-card text-text-secondary hover:text-primary'">
              {{ hp >= 10000 ? (hp / 10000) + '万' : hp.toLocaleString() }}
            </button>
          </div>
        </div>
        <div>
          <div class="text-xs text-text-muted mb-2">闪避率</div>
          <div class="flex gap-1">
            <button v-for="d in dodgeOptions" :key="d" @click="config.dodgeRate = d"
              class="px-3 py-1.5 text-xs rounded-lg transition-all"
              :class="config.dodgeRate === d ? 'bg-primary text-white' : 'bg-bg-card text-text-secondary hover:text-primary'">
              {{ Math.round(d * 100) }}%
            </button>
          </div>
        </div>
        <div>
          <div class="text-xs text-text-muted mb-2">格挡率</div>
          <div class="flex gap-1">
            <button v-for="b in blockOptions" :key="b" @click="config.blockRate = b"
              class="px-3 py-1.5 text-xs rounded-lg transition-all"
              :class="config.blockRate === b ? 'bg-primary text-white' : 'bg-bg-card text-text-secondary hover:text-primary'">
              {{ Math.round(b * 100) }}%
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <button v-if="!running" @click="startTraining" class="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium">
          ⚔️ 开始训练
        </button>
        <button v-else @click="stopTraining" class="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium">
          ⏹️ 停止
        </button>
        <button v-if="running" @click="resetConfig" class="px-4 py-2 rounded-lg border border-border hover:border-primary text-sm transition-colors">
          重置配置
        </button>
      </div>
    </div>

    <!-- Battle -->
    <div v-if="running" class="card p-4">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="font-medium">🎯 {{ dummyName }}</div>
          <div class="text-xs text-text-muted">Lv.99 · 无限血量</div>
        </div>
        <div class="text-right">
          <div class="text-xs text-text-muted">第 {{ currentRound }} 回合</div>
          <div class="text-xs text-text-muted">累计击杀 {{ stats.kills }} 次</div>
        </div>
      </div>

      <!-- Player HP -->
      <div class="mb-3">
        <div class="flex justify-between text-xs mb-1">
          <span>❤️ {{ playerName }}</span>
          <span>{{ currentHp }}/{{ maxHp }}</span>
        </div>
        <div class="h-2 bg-bg-card rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all" :style="{ width: hpPercent + '%' }"></div>
        </div>
      </div>

      <!-- Dummy HP -->
      <div class="mb-4">
        <div class="flex justify-between text-xs mb-1">
          <span>🎯 {{ dummyName }}</span>
          <span>{{ dummyHp }}/{{ dummyMaxHp }}</span>
        </div>
        <div class="h-2 bg-bg-card rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all" :style="{ width: dummyHpPercent + '%' }"></div>
        </div>
      </div>

      <!-- Log -->
      <div ref="logContainer" class="max-h-64 overflow-y-auto space-y-1 text-sm bg-bg-card rounded-lg p-3">
        <div v-for="(entry, i) in displayLogs" :key="i" :class="logClass(entry.type)">
          {{ entry.message }}
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="stats.hits > 0 || stats.kills > 0" class="card p-4">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-medium">📊 伤害统计</h4>
        <button @click="resetStats" class="text-xs text-text-muted hover:text-primary transition-colors">重置统计</button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ stats.totalDamage.toLocaleString() }}</div>
          <div class="text-xs text-text-muted">总伤害</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-amber-500">{{ currentDps }}</div>
          <div class="text-xs text-text-muted">DPS</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-500">{{ stats.maxHit.toLocaleString() }}</div>
          <div class="text-xs text-text-muted">最高伤害</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-500">{{ critRate }}%</div>
          <div class="text-xs text-text-muted">暴击率 ({{ stats.crits }}/{{ stats.hits }})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted, nextTick } from 'vue'
import { gameStore } from '../../game/store.js'
import { BattleEngine } from '../../game/engine.js'
import { getSkillById } from '../../game/data/skills.js'

const { state, getCombatStats, getEquippedWeapon } = gameStore

const hpOptions = [1000, 10000, 50000, 100000]
const dodgeOptions = [0, 0.1, 0.2, 0.3]
const blockOptions = [0, 0.15, 0.3]

const config = reactive({ hp: 10000, dodgeRate: 0, blockRate: 0 })

const running = ref(false)
const currentRound = ref(0)
const displayLogs = ref([])
const logContainer = ref(null)

const dummyName = '训练木桩'
const playerName = computed(() => state.player.name || '企鹅勇者')

const engine = ref(null)
const currentHp = ref(0)
const maxHp = ref(0)
const dummyHp = ref(0)
const dummyMaxHp = ref(0)
const stats = reactive({ totalDamage: 0, crits: 0, maxHit: 0, hits: 0, misses: 0, kills: 0 })
const startTime = ref(0)

const hpPercent = computed(() => maxHp.value > 0 ? (currentHp.value / maxHp.value) * 100 : 0)
const dummyHpPercent = computed(() => dummyMaxHp.value > 0 ? (dummyHp.value / dummyMaxHp.value) * 100 : 0)
const currentDps = computed(() => {
  if (stats.totalDamage === 0 || startTime.value === 0) return 0
  const elapsed = (Date.now() - startTime.value) / 1000
  return elapsed > 0 ? Math.floor(stats.totalDamage / elapsed) : 0
})
const critRate = computed(() => stats.hits > 0 ? Math.round(stats.crits / stats.hits * 100) : 0)

let battleTimer = null

function logClass(type) {
  const map = {
    attack: 'text-primary',
    crit: 'text-amber-500 font-bold',
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
    enemy_attack: 'text-red-500',
    ignore: 'text-purple-500',
  }
  return map[type] || 'text-text-secondary'
}

function startTraining() {
  const stats_ = getCombatStats()
  const weapon = getEquippedWeapon()
  const skills = state.skills || []

  const dummy = {
    name: dummyName,
    level: 99,
    strength: 0,
    agility: 0,
    speed: 0,
    health: config.hp,
    skills: [],
    rewards: { exp: 0, spirit: 0 },
    isDummy: true,
    dodgeRate: config.dodgeRate,
    blockRate: config.blockRate,
  }

  const eng = new BattleEngine(
    state.player,
    dummy,
    skills,
    weapon
  )
  eng.start()

  engine.value = eng
  currentHp.value = eng.playerCombatStats.maxHealth
  maxHp.value = eng.playerCombatStats.maxHealth
  dummyHp.value = config.hp
  dummyMaxHp.value = config.hp
  currentRound.value = 1
  displayLogs.value = []
  startTime.value = Date.now()
  stats.totalDamage = 0
  stats.crits = 0
  stats.maxHit = 0
  stats.hits = 0
  stats.misses = 0
  stats.kills = 0
  running.value = true

  addDisplayLogs(eng.log)
  eng.log = []

  battleTimer = setInterval(runTick, 400)
}

function runTick() {
  const eng = engine.value
  if (!eng || eng.isOver) {
    stopTraining()
    return
  }

  const skillId = eng.autoSelectSkill()
  eng.playerTurn(skillId)

  eng.enemyTurn()

  eng.startNextTurn()

  currentHp.value = Math.max(0, eng.player.health)
  dummyHp.value = Math.max(0, eng.enemy.health)
  currentRound.value = eng.turn

  const engStats = eng.getStats()
  stats.totalDamage = engStats.totalDamage
  stats.crits = engStats.crits
  stats.maxHit = engStats.maxHit
  stats.hits = engStats.hits
  stats.misses = engStats.misses
  stats.kills = engStats.kills

  addDisplayLogs(eng.log)
  eng.log = []
}

function addDisplayLogs(newLogs) {
  newLogs.forEach(l => {
    displayLogs.value.push({ type: l.type, message: l.message })
  })
  if (displayLogs.value.length > 200) {
    displayLogs.value = displayLogs.value.slice(-150)
  }
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

function stopTraining() {
  running.value = false
  if (battleTimer) {
    clearInterval(battleTimer)
    battleTimer = null
  }
}

function resetStats() {
  stats.totalDamage = 0
  stats.crits = 0
  stats.maxHit = 0
  stats.hits = 0
  stats.misses = 0
  stats.kills = 0
}

function resetConfig() {
  config.hp = 10000
  config.dodgeRate = 0
  config.blockRate = 0
}

onUnmounted(() => {
  if (battleTimer) clearInterval(battleTimer)
})
</script>
