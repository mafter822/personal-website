<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h3 class="text-lg font-semibold mb-2">🏆 排行榜</h3>
      <p class="text-sm text-text-secondary">本地模拟排行数据</p>
    </div>

    <!-- Tab Switch -->
    <div class="flex gap-2 mb-4">
      <button
        v-for="tab in rankTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 rounded-lg text-sm transition-all"
        :class="activeTab === tab.id ? 'bg-primary text-white' : 'bg-bg-card text-text-secondary'"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- Level Ranking -->
    <div v-if="activeTab === 'level'" class="space-y-3">
      <div
        v-for="(entry, i) in levelRanking"
        :key="i"
        class="card p-4 flex items-center justify-between"
        :class="entry.isPlayer ? 'border-primary/50' : ''"
      >
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold" :class="i < 3 ? 'text-amber-500' : 'text-text-muted'">
            {{ i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}` }}
          </span>
          <div>
            <div class="font-medium">{{ entry.name }}</div>
            <div class="text-xs text-text-secondary">Lv.{{ entry.level }} · {{ entry.title }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-primary">{{ entry.power }}</div>
          <div class="text-xs text-text-muted">战力</div>
        </div>
      </div>
    </div>

    <!-- Power Ranking -->
    <div v-if="activeTab === 'power'" class="space-y-3">
      <div
        v-for="(entry, i) in powerRanking"
        :key="i"
        class="card p-4 flex items-center justify-between"
        :class="entry.isPlayer ? 'border-primary/50' : ''"
      >
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold" :class="i < 3 ? 'text-amber-500' : 'text-text-muted'">
            {{ i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}` }}
          </span>
          <div>
            <div class="font-medium">{{ entry.name }}</div>
            <div class="text-xs text-text-secondary">Lv.{{ entry.level }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-primary">{{ entry.power }}</div>
          <div class="text-xs text-text-muted">战力</div>
        </div>
      </div>
    </div>

    <!-- Win Streak Ranking -->
    <div v-if="activeTab === 'streak'" class="space-y-3">
      <div
        v-for="(entry, i) in streakRanking"
        :key="i"
        class="card p-4 flex items-center justify-between"
        :class="entry.isPlayer ? 'border-primary/50' : ''"
      >
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold" :class="i < 3 ? 'text-amber-500' : 'text-text-muted'">
            {{ i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}` }}
          </span>
          <div>
            <div class="font-medium">{{ entry.name }}</div>
            <div class="text-xs text-text-secondary">Lv.{{ entry.level }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-accent">{{ entry.streak }}</div>
          <div class="text-xs text-text-muted">连胜</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { NPC_FRIENDS } from '../../game/data/friends.js'

const { state, getCombatStats } = gameStore

const activeTab = ref('level')
const rankTabs = [
  { id: 'level', icon: '📊', label: '等级' },
  { id: 'power', icon: '⚔️', label: '战力' },
  { id: 'streak', icon: '🔥', label: '连胜' },
]

const playerPower = computed(() => {
  const s = getCombatStats()
  return Math.floor(s.strength * 2 + s.agility * 1.5 + s.speed * 1.5 + s.maxHealth * 0.5)
})

const allEntries = computed(() => {
  const npcStreaks = [15, 12, 8, 10, 5, 3, 7, 2]
  const entries = NPC_FRIENDS.map((f, i) => ({
    name: f.name,
    level: f.level,
    power: Math.floor(f.strength * 2 + f.agility * 1.5 + f.speed * 1.5 + f.health * 0.5),
    streak: npcStreaks[i] || 0,
    isPlayer: false,
  }))

  entries.push({
    name: state.player.name,
    level: state.player.level,
    power: playerPower.value,
    streak: state.stats.maxStreak,
    isPlayer: true,
  })

  return entries
})

const levelRanking = computed(() => {
  return [...allEntries.value].sort((a, b) => b.level - a.level)
})

const powerRanking = computed(() => {
  return [...allEntries.value].sort((a, b) => b.power - a.power)
})

const streakRanking = computed(() => {
  return [...allEntries.value].sort((a, b) => b.streak - a.streak)
})
</script>
