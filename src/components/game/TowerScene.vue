<template>
  <div class="space-y-4">
    <!-- Tower Header -->
    <div class="card p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">🗼 斗神塔</h3>
          <p class="text-sm text-text-secondary">逐层挑战，越高越强</p>
        </div>
        <div class="text-right">
          <div class="text-sm text-text-secondary">今日剩余</div>
          <div class="text-lg font-bold text-primary">{{ remainingAttempts }}/{{ TOWER_CONFIG.dailyAttempts }}</div>
        </div>
      </div>
    </div>

    <!-- Tower Progress -->
    <div class="card p-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="text-sm text-text-secondary">当前层数</span>
          <span class="ml-2 text-xl font-bold">{{ currentFloor }}</span>
        </div>
        <div>
          <span class="text-sm text-text-secondary">最高通关</span>
          <span class="ml-2 text-xl font-bold text-primary">{{ state.towerProgress.maxFloor }}</span>
        </div>
      </div>
      <div class="h-4 bg-bg-card rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" :style="{ width: (currentFloor / TOWER_CONFIG.maxFloor * 100) + '%' }"></div>
      </div>
      <div class="text-xs text-text-muted mt-2 text-right">{{ currentFloor }}/{{ TOWER_CONFIG.maxFloor }} 层</div>
    </div>

    <!-- Current Floor Enemy -->
    <div class="card p-4">
      <h4 class="font-medium mb-3">当前挑战</h4>
      <div class="bg-bg-card rounded-lg p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">👹</div>
          <div>
            <div class="font-medium">{{ currentEnemy.name }}</div>
            <div class="text-xs text-text-secondary">Lv.{{ currentEnemy.level }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div><span class="text-text-secondary">❤️</span> {{ currentEnemy.health }}</div>
          <div><span class="text-text-secondary">⚔️</span> {{ currentEnemy.strength }}</div>
          <div><span class="text-text-secondary">🌀</span> {{ currentEnemy.agility }}</div>
          <div><span class="text-text-secondary">⚡</span> {{ currentEnemy.speed }}</div>
        </div>
      </div>
    </div>

    <!-- Rewards Preview -->
    <div class="card p-4">
      <h4 class="font-medium mb-3">通关奖励</h4>
      <div class="flex gap-4 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-amber-500">⭐</span>
          <span>经验 {{ currentEnemy.rewards.exp }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-purple-500">💎</span>
          <span>精魄 {{ currentEnemy.rewards.spirit }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4">
      <button
        @click="challengeFloor"
        class="flex-1 btn-primary"
        :disabled="remainingAttempts <= 0"
      >
        {{ remainingAttempts > 0 ? '挑战本层' : '今日次数已用完' }}
      </button>
      <button
        v-if="currentFloor > 1"
        @click="sweepPrevious"
        class="flex-1 btn-outline"
        :disabled="remainingAttempts <= 0 || currentFloor <= TOWER_CONFIG.sweepUnlockFloor"
      >
        扫荡
      </button>
    </div>

    <!-- Tower Log -->
    <div class="card p-4" v-if="towerLog.length > 0">
      <h4 class="font-medium mb-3">📜 挑战记录</h4>
      <div class="max-h-48 overflow-y-auto space-y-1">
        <div v-for="(entry, i) in towerLog.slice(-5)" :key="i" class="text-sm" :class="entry.won ? 'text-green-600' : 'text-red-500'">
          第{{ entry.floor }}层: {{ entry.won ? '胜利' : '失败' }} ({{ entry.exp }}经验, {{ entry.spirit }}精魄)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { TOWER_CONFIG, getFloorEnemy, getSweepRewards } from '../../game/data/tower.js'
import { BattleEngine } from '../../game/engine.js'

const emit = defineEmits(['start-battle'])

const { state, consumeStamina, addExp, addSpirit, addWin, addLoss } = gameStore

const towerLog = ref([])

const currentFloor = computed(() => state.towerProgress.maxFloor + 1)
const remainingAttempts = computed(() => TOWER_CONFIG.dailyAttempts - (state.towerProgress.dailyUsed || 0))

const currentEnemy = computed(() => getFloorEnemy(currentFloor.value))

function challengeFloor() {
  if (remainingAttempts.value <= 0) return

  state.towerProgress.dailyUsed = (state.towerProgress.dailyUsed || 0) + 1

  emit('start-battle', {
    enemy: currentEnemy.value,
    stageId: `tower_${currentFloor.value}`,
    isTower: true,
  })
}

function sweepPrevious() {
  if (remainingAttempts.value <= 0 || currentFloor.value <= TOWER_CONFIG.sweepUnlockFloor) return

  const sweepFloor = currentFloor.value - 1
  const rewards = getSweepRewards(sweepFloor, 1)

  state.towerProgress.dailyUsed = (state.towerProgress.dailyUsed || 0) + 1
  addExp(rewards.exp)
  addSpirit(rewards.spirit)

  towerLog.value.push({
    floor: sweepFloor,
    won: true,
    exp: rewards.exp,
    spirit: rewards.spirit,
  })

  alert(`扫荡第${sweepFloor}层成功！获得 ${rewards.exp} 经验, ${rewards.spirit} 精魄`)
}
</script>
