<template>
  <div class="space-y-4">
    <!-- Streak Display -->
    <div class="card p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">⚔️ 随机乐斗</h3>
          <p class="text-sm text-text-secondary">匹配一个与你实力相当的企鹅勇士</p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold" :class="streakColor">{{ state.stats.streak }}</div>
          <div class="text-xs text-text-muted">当前连胜</div>
        </div>
      </div>
      <div v-if="state.stats.streak >= 3" class="mt-2 text-xs text-amber-500">
        🔥 连胜 {{ state.stats.streak }} 场！经验+{{ streakBonusDisplay }}%，精魄+{{ spiritBonusDisplay }}
      </div>
      <div v-if="specialEncounter" class="mt-2 text-xs" :style="{ color: specialEncounter.color }">
        ⭐ {{ specialEncounter.desc }}
      </div>
    </div>

    <!-- Match Area -->
    <div class="card p-4">
      <div v-if="!matched" class="text-center py-8">
        <div class="text-4xl mb-4 animate-bounce">🐧</div>
        <p class="text-text-secondary mb-4">正在匹配对手...</p>
        <button @click="matchOpponent" class="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium">
          ⚔️ 开始匹配
        </button>
      </div>

      <div v-else>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="card p-4 text-center">
            <div class="text-3xl mb-2">🐧</div>
            <div class="font-bold">{{ state.player.name }}</div>
            <div class="text-sm text-text-secondary">Lv.{{ state.player.level }}</div>
            <div class="text-xs text-text-muted mt-1">{{ state.player.title }}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-3xl mb-2">🐧</div>
            <div class="font-bold" :style="{ color: opponent.color }">{{ opponent.name }}</div>
            <div class="text-sm text-text-secondary">Lv.{{ opponent.level }}</div>
            <div class="text-xs text-text-muted mt-1">{{ opponent.title }}</div>
            <div v-if="opponent.isSpecial" class="text-xs mt-1" :style="{ color: opponent.color }">
              ⭐ {{ opponent.specialTitle }}
            </div>
          </div>
        </div>

        <div class="card p-4 mb-4">
          <h4 class="font-medium mb-3">对手信息</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="text-text-muted">力量:</span> <span class="font-medium">{{ opponent.strength }}</span></div>
            <div><span class="text-text-muted">敏捷:</span> <span class="font-medium">{{ opponent.agility }}</span></div>
            <div><span class="text-text-muted">速度:</span> <span class="font-medium">{{ opponent.speed }}</span></div>
            <div><span class="text-text-muted">生命:</span> <span class="font-medium">{{ opponent.maxHealth }}</span></div>
            <div><span class="text-text-muted">武器:</span> <span class="font-medium">{{ opponent.weaponName }}</span></div>
            <div><span class="text-text-muted">技能:</span> <span class="font-medium">{{ opponent.skillCount }}个</span></div>
          </div>
          <div v-if="opponent.rewardMultiplier > 1" class="mt-2 text-xs text-amber-500">
            🎁 奖励 x{{ opponent.rewardMultiplier }}
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="startBattle" class="flex-1 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium">
            ⚔️ 开始战斗
          </button>
          <button @click="matchOpponent" class="px-4 py-3 rounded-lg border border-border hover:border-primary transition-colors text-sm">
            🔄 重新匹配
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { SKILLS } from '../../game/data/skills.js'
import { WEAPONS } from '../../game/data/weapons.js'
import { TITLE_LIST, generateNPCName } from '../../game/data/pets.js'
import { getSpecialEncounter, getStreakBonus } from '../../game/data/streak.js'

const emit = defineEmits(['start-battle'])
const { state } = gameStore

const matched = ref(false)
const opponent = ref(null)

const TITLE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getTitle(level) {
  let title = '初心者'
  for (const t of TITLE_LIST) {
    if (level >= t.minLevel) title = t.title
  }
  return title
}

const specialEncounter = computed(() => getSpecialEncounter(state.stats.streak))

const streakBonusDisplay = computed(() => {
  const bonus = getStreakBonus(state.stats.streak)
  return Math.round(bonus.expBonus * 100)
})

const spiritBonusDisplay = computed(() => {
  const bonus = getStreakBonus(state.stats.streak)
  return bonus.spiritBonus
})

const streakColor = computed(() => {
  const s = state.stats.streak
  if (s >= 10) return 'text-yellow-500'
  if (s >= 7) return 'text-pink-500'
  if (s >= 5) return 'text-purple-500'
  if (s >= 3) return 'text-orange-500'
  return 'text-text-secondary'
})

function matchOpponent() {
  const playerLevel = state.player.level
  const streak = state.stats.streak

  const special = getSpecialEncounter(streak)

  let levelRange = Math.max(1, Math.floor(playerLevel * 0.3))
  if (special) levelRange = Math.max(1, Math.floor(playerLevel * 0.2))

  let enemyLevel = Math.max(1, playerLevel + Math.floor(Math.random() * levelRange * 2) - levelRange)
  if (special) enemyLevel += special.levelBonus

  const strMult = special ? special.statsMultiplier : 1
  const agiMult = special ? special.statsMultiplier : 1
  const spdMult = special ? special.statsMultiplier : 1
  const hpMult = special ? special.statsMultiplier : 1

  const strBase = Math.floor((15 + enemyLevel * 3) * strMult)
  const agiBase = Math.floor((8 + enemyLevel * 2) * agiMult)
  const spdBase = Math.floor((10 + enemyLevel * 2) * spdMult)
  const hpBase = Math.floor((80 + enemyLevel * 15) * hpMult)

  const ownedSkillIds = []
  const ownedWeaponIds = []
  let enemyWeapon = null

  for (let lv = 2; lv <= enemyLevel; lv += 2) {
    const roll = Math.random()
    if (roll < 0.5) {
      const pool = SKILLS.filter(s => s.unlockLevel <= lv && s.category !== 'stat' && !ownedSkillIds.includes(s.id))
      if (pool.length > 0) {
        const picked = randomFrom(pool)
        ownedSkillIds.push(picked.id)
      }
    } else {
      const pool = WEAPONS.filter(w => w.reqLevel <= lv && !ownedWeaponIds.includes(w.id))
      if (pool.length > 0) {
        const picked = randomFrom(pool)
        ownedWeaponIds.push(picked.id)
        if (!enemyWeapon) enemyWeapon = { ...picked }
      }
    }
  }

  const skills = ownedSkillIds.map(id => ({ id, level: 1 + Math.floor(Math.random() * 3) }))

  const name = special ? special.name : generateNPCName()
  const title = special ? special.title : getTitle(enemyLevel)
  const color = special ? special.color : randomFrom(TITLE_COLORS)
  const rewardMult = special ? special.rewardMultiplier : 1

  const baseExp = 50 + enemyLevel * 10
  const baseSpirit = 1 + Math.floor(enemyLevel / 10)
  const streakBonus = getStreakBonus(streak)

  opponent.value = {
    name,
    level: enemyLevel,
    title,
    strength: strBase + Math.floor(Math.random() * 10),
    agility: agiBase + Math.floor(Math.random() * 8),
    speed: spdBase + Math.floor(Math.random() * 8),
    maxHealth: hpBase + Math.floor(Math.random() * 30),
    health: hpBase + Math.floor(Math.random() * 30),
    weapon: enemyWeapon,
    weaponName: enemyWeapon ? enemyWeapon.name : '拳头',
    skills,
    skillCount: skills.length,
    rewards: {
      exp: Math.floor((baseExp + streakBonus.expBonus * baseExp) * rewardMult),
      spirit: Math.floor((baseSpirit + streakBonus.spiritBonus) * rewardMult),
    },
    color,
    isSpecial: !!special,
    specialTitle: special ? special.title : '',
    rewardMultiplier: rewardMult,
  }

  matched.value = true
}

function startBattle() {
  if (!opponent.value) return
  emit('start-battle', { enemy: opponent.value, stageId: null, fromTab: 'stage' })
}
</script>
