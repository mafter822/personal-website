<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h3 class="text-lg font-semibold mb-2">🔮 境界系统</h3>
      <p class="text-sm text-text-secondary">突破境界获得属性加成</p>
    </div>

    <!-- Current Realm -->
    <div class="card p-6 text-center">
      <div class="text-5xl mb-4">{{ currentRealm ? currentRealm.icon : '🌱' }}</div>
      <h3 class="text-2xl font-bold mb-2">{{ currentRealm ? currentRealm.name : '未突破' }}</h3>
      <p class="text-text-secondary mb-4">{{ currentRealm ? currentRealm.description : '需要达到指定等级才能突破' }}</p>
      
      <div v-if="currentRealm" class="flex flex-wrap justify-center gap-3 text-sm">
        <span v-for="(val, stat) in currentRealm.bonus" :key="stat" class="px-3 py-1 bg-primary/10 text-primary rounded">
          {{ statName(stat) }} +{{ val }}
        </span>
      </div>
    </div>

    <!-- Next Realm -->
    <div v-if="nextRealm" class="card p-4">
      <h4 class="font-medium mb-3">下一个境界</h4>
      <div class="flex items-center gap-4">
        <div class="text-3xl">{{ nextRealm.icon }}</div>
        <div class="flex-1">
          <div class="font-medium">{{ nextRealm.name }}</div>
          <div class="text-xs text-text-secondary">需要 Lv.{{ nextRealm.level }}+</div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="(val, stat) in nextRealm.bonus" :key="stat" class="text-xs px-2 py-0.5 bg-bg-card rounded">
              {{ statName(stat) }} +{{ val }}
            </span>
          </div>
        </div>
        <button
          @click="breakthrough"
          class="px-4 py-2 rounded-lg transition-colors"
          :class="canBreakthrough ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-bg-card text-text-muted cursor-not-allowed'"
          :disabled="!canBreakthrough"
        >
          {{ canBreakthrough ? '突破' : `需要 Lv.${nextRealm.level}` }}
        </button>
      </div>
    </div>

    <div v-else class="card p-4 text-center text-text-secondary">
      🎉 已达最高境界！
    </div>

    <!-- All Realms -->
    <div class="card p-4">
      <h4 class="font-medium mb-3">境界一览</h4>
      <div class="space-y-2">
        <div
          v-for="realm in realms"
          :key="realm.id"
          class="flex items-center gap-3 p-2 rounded-lg"
          :class="currentRealm && realm.level <= currentRealm.level ? 'bg-primary/10' : 'bg-bg-card opacity-50'"
        >
          <span class="text-xl">{{ realm.icon }}</span>
          <div class="flex-1">
            <span class="font-medium">{{ realm.name }}</span>
            <span class="text-xs text-text-muted ml-2">Lv.{{ realm.level }}+</span>
          </div>
          <span v-if="currentRealm && realm.level <= currentRealm.level" class="text-xs text-primary">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { REALMS, getCurrentRealm, getNextRealm } from '../../game/data/realms.js'

const { state } = gameStore

const realms = REALMS

const currentRealm = computed(() => getCurrentRealm(state.player.level))
const nextRealm = computed(() => getNextRealm(state.player.level))

const canBreakthrough = computed(() => {
  if (!nextRealm.value) return false
  return state.player.level >= nextRealm.value.level
})

function breakthrough() {
  if (!canBreakthrough.value) return
  
  if (!state.realm) state.realm = { level: 0 }
  state.realm.level++
  
  alert(`突破成功！达到 ${nextRealm.value.name} 境界！`)
}

function statName(stat) {
  const map = {
    strength: '力量',
    agility: '敏捷',
    speed: '速度',
    maxHealth: '生命',
  }
  return map[stat] || stat
}
</script>
