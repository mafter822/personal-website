<template>
  <div class="space-y-4">
    <div class="card p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-1">🏅 成就系统</h3>
          <p class="text-sm text-text-secondary">达成条件获得奖励</p>
        </div>
        <div class="text-right">
          <div class="text-sm text-text-secondary">已达成</div>
          <div class="text-xl font-bold text-primary">{{ unlockedCount }}/{{ totalCount }}</div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="card p-4">
      <div class="h-3 bg-bg-card rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="text-xs text-text-muted mt-2 text-right">{{ progressPercent.toFixed(1) }}%</div>
    </div>

    <!-- Achievement List -->
    <div class="space-y-3">
      <div
        v-for="ach in ACHIEVEMENTS"
        :key="ach.id"
        class="card p-4 flex items-center gap-4"
        :class="isUnlocked(ach.id) ? 'border-primary/30' : 'opacity-60'"
      >
        <div class="text-3xl">{{ ach.icon }}</div>
        <div class="flex-1">
          <div class="font-medium">{{ ach.name }}</div>
          <div class="text-xs text-text-secondary">{{ ach.description }}</div>
        </div>
        <div class="text-right">
          <div v-if="isUnlocked(ach.id)" class="text-xs text-primary font-medium">✓ 已达成</div>
          <div v-else class="text-xs text-text-muted">
            <span v-if="ach.reward.exp">⭐{{ ach.reward.exp }}</span>
            <span v-if="ach.reward.spirit" class="ml-1">💎{{ ach.reward.spirit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { ACHIEVEMENTS } from '../../game/data/achievements.js'

const { state } = gameStore

const totalCount = computed(() => ACHIEVEMENTS.length)
const unlockedCount = computed(() => (state.achievements || []).length)
const progressPercent = computed(() => (unlockedCount.value / totalCount.value) * 100)

function isUnlocked(id) {
  return (state.achievements || []).includes(id)
}
</script>
