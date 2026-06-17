<template>
  <div class="space-y-6">
    <!-- Character Card -->
    <div class="card p-6">
      <div class="flex items-start gap-6">
        <div class="w-20 h-20 rounded-full bg-bg-card flex items-center justify-center text-4xl border-2 border-border">
          🐧
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-1">
            <h2 class="text-xl font-bold">{{ state.player.name }}</h2>
            <span class="text-sm text-text-secondary">Lv.{{ state.player.level }}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent">{{ state.player.title }}</span>
          </div>
          <p class="text-sm text-text-secondary mb-3">PVE战力 {{ combatPower }}</p>

          <!-- Health Bar -->
          <div class="mb-2">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-text-secondary">❤️ 生命</span>
              <span>{{ state.player.health }}/{{ maxHealth }}</span>
            </div>
            <div class="h-3 bg-bg-card rounded-full overflow-hidden">
              <div class="h-full bg-red-500 rounded-full transition-all" :style="{ width: healthPercent + '%' }"></div>
            </div>
          </div>

          <!-- Stamina Bar -->
          <div class="mb-2">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-text-secondary">⚡ 体力</span>
              <span>{{ state.player.stamina }}/100</span>
            </div>
            <div class="h-3 bg-bg-card rounded-full overflow-hidden">
              <div class="h-full bg-amber-500 rounded-full transition-all" :style="{ width: state.player.stamina + '%' }"></div>
            </div>
          </div>

          <!-- Exp Bar -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-text-secondary">📊 经验</span>
              <span>{{ state.player.exp }}/{{ expForLevel }}</span>
            </div>
            <div class="h-3 bg-bg-card rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full transition-all" :style="{ width: expPercent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card p-4 text-center">
        <div class="text-2xl mb-1">⚔️</div>
        <div class="text-2xl font-bold">{{ combatStats.strength }}</div>
        <div class="text-xs text-text-secondary">力量</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl mb-1">🌀</div>
        <div class="text-2xl font-bold">{{ combatStats.agility }}</div>
        <div class="text-xs text-text-secondary">敏捷</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl mb-1">⚡</div>
        <div class="text-2xl font-bold">{{ combatStats.speed }}</div>
        <div class="text-xs text-text-secondary">速度</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-2xl mb-1">💎</div>
        <div class="text-2xl font-bold">{{ state.player.spirit }}</div>
        <div class="text-xs text-text-secondary">精魄</div>
      </div>
    </div>

    <!-- Resources -->
    <div class="grid grid-cols-3 gap-4">
      <div class="card p-4 text-center">
        <div class="text-lg font-bold text-amber-500">{{ state.player.gold }}</div>
        <div class="text-xs text-text-secondary">💰 金币</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-lg font-bold text-green-500">{{ state.stats.wins }}</div>
        <div class="text-xs text-text-secondary">🏆 胜利</div>
      </div>
      <div class="card p-4 text-center">
        <div class="text-lg font-bold text-blue-500">{{ state.stats.maxStreak }}</div>
        <div class="text-xs text-text-secondary">🔥 最高连胜</div>
      </div>
    </div>

    <!-- Equipped Weapon -->
    <div class="card p-4" v-if="equippedWeapon">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs text-text-secondary">装备武器</span>
          <div class="font-medium" :style="{ color: qualityColor }">{{ equippedWeapon.name }}</div>
        </div>
        <span class="text-xs px-2 py-1 rounded" :style="{ backgroundColor: qualityColor + '20', color: qualityColor }">
          +{{ equippedWeapon.enhanceLevel }}
        </span>
      </div>
    </div>
    <div class="card p-4 text-center text-text-secondary text-sm" v-else>
      暂未装备武器
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { EXP_PER_LEVEL } from '../../game/data/constants.js'
import { QUALITY_COLORS } from '../../game/data/constants.js'

const { state, getCombatStats, getEquippedWeapon } = gameStore

const combatStats = computed(() => getCombatStats())
const maxHealth = computed(() => combatStats.value.maxHealth)
const healthPercent = computed(() => (state.player.health / maxHealth.value) * 100)
const expForLevel = computed(() => EXP_PER_LEVEL(state.player.level))
const expPercent = computed(() => (state.player.exp / expForLevel.value) * 100)

const combatPower = computed(() => {
  const s = combatStats.value
  return Math.floor(s.strength * 2 + s.agility * 1.5 + s.speed * 1.5 + s.maxHealth * 0.5)
})

const equippedWeapon = computed(() => getEquippedWeapon())
const qualityColor = computed(() => {
  if (!equippedWeapon.value) return '#9ca3af'
  return QUALITY_COLORS[equippedWeapon.value.quality] || '#9ca3af'
})
</script>
