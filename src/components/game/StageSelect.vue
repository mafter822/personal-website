<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">⚔️ 快速乐斗</h3>
    <p class="text-sm text-text-secondary mb-6">挑战NPC对手，获得经验和精魄</p>

    <!-- Stamina Recovery -->
    <div class="card p-4 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm font-medium">⚡ 体力: {{ playerStamina }}/100</div>
          <div class="text-xs text-text-muted mt-1">每分钟自动恢复1点，升级恢复20点，休息恢复30点</div>
        </div>
        <button
          @click="handleRest"
          class="px-4 py-2 text-sm rounded-lg border border-border hover:border-primary transition-colors"
          :disabled="playerStamina >= 100"
        >
          🛋️ 休息 (+30)
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="stage in stages"
        :key="stage.id"
        class="card p-4 transition-all cursor-pointer hover:border-primary/30"
        :class="!isAvailable(stage) ? 'opacity-60' : ''"
        @click="handleStageClick(stage)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-bg-card flex items-center justify-center text-2xl">
              {{ stageEmoji(stage.difficulty) }}
            </div>
            <div>
              <div class="font-medium">{{ stage.name }}</div>
              <div class="text-xs text-text-secondary">{{ stage.description }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium" :class="cleared(stage.id) ? 'text-green-600' : 'text-text-secondary'">
              {{ cleared(stage.id) ? '✓ 已通关' : `Lv.${stage.requiredLevel}+` }}
            </div>
            <div class="text-xs text-text-muted mt-1">
              ⚡{{ stage.staminaCost }} 体力 · 🎁 {{ stage.rewards.exp }}经验 {{ stage.rewards.spirit }}精魄
            </div>
          </div>
        </div>

        <!-- Difficulty Stars -->
        <div class="flex gap-1 mt-2">
          <span
            v-for="i in 10"
            :key="i"
            class="text-xs"
            :class="i <= stage.difficulty ? 'text-amber-500' : 'text-text-muted'"
          >★</span>
        </div>
      </div>
    </div>

    <!-- Enemy Preview -->
    <div v-if="selectedStage" class="card p-4 mt-6">
      <h4 class="font-medium mb-3">敌人信息</h4>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-text-secondary">名称:</span>
          <span class="ml-2 font-medium">{{ selectedStage.enemy.name }}</span>
        </div>
        <div>
          <span class="text-text-secondary">等级:</span>
          <span class="ml-2">Lv.{{ selectedStage.enemy.level }}</span>
        </div>
        <div>
          <span class="text-text-secondary">生命:</span>
          <span class="ml-2">❤️ {{ selectedStage.enemy.health }}</span>
        </div>
        <div>
          <span class="text-text-secondary">攻击:</span>
          <span class="ml-2">⚔️ {{ selectedStage.enemy.strength }}</span>
        </div>
        <div>
          <span class="text-text-secondary">敏捷:</span>
          <span class="ml-2">🌀 {{ selectedStage.enemy.agility }}</span>
        </div>
        <div>
          <span class="text-text-secondary">速度:</span>
          <span class="ml-2">⚡ {{ selectedStage.enemy.speed }}</span>
        </div>
      </div>
      <button
        @click="confirmBattle"
        class="btn-primary w-full mt-4"
        :disabled="!canChallenge(selectedStage)"
      >
        {{ canChallenge(selectedStage) ? '开始挑战' : getCannotReason(selectedStage) }}
      </button>
    </div>

    <!-- Insufficient Stamina Modal -->
    <div v-if="showStaminaModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showStaminaModal = false">
      <div class="card p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-3">⚡ 体力不足</h3>
        <p class="text-text-secondary mb-4">
          当前体力: {{ playerStamina }} · 需要: {{ insufficientStage?.staminaCost || 0 }}
        </p>
        <div class="flex gap-3">
          <button @click="showStaminaModal = false" class="flex-1 px-4 py-2 rounded-lg border border-border hover:border-primary transition-colors text-sm">
            关闭
          </button>
          <button @click="handleRestFromModal" class="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm">
            🛋️ 休息恢复
          </button>
        </div>
      </div>
    </div>

    <!-- Level Not Enough Modal -->
    <div v-if="showLevelModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showLevelModal = false">
      <div class="card p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold mb-3">🔒 等级不足</h3>
        <p class="text-text-secondary mb-4">
          当前等级: Lv.{{ playerLevel }} · 需要: Lv.{{ insufficientStage?.requiredLevel || 0 }}+
        </p>
        <button @click="showLevelModal = false" class="w-full px-4 py-2 rounded-lg border border-border hover:border-primary transition-colors text-sm">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { STAGES } from '../../game/data/stages.js'

const emit = defineEmits(['start-battle'])
const { state, consumeStamina, restRecover, recoverStaminaByTime } = gameStore

const selectedStage = ref(null)
const showStaminaModal = ref(false)
const showLevelModal = ref(false)
const insufficientStage = ref(null)

const stages = STAGES
const playerLevel = computed(() => state.player.level || 1)
const playerStamina = computed(() => state.player.stamina || 0)

function cleared(id) {
  return state.stagesCleared.includes(id)
}

function isAvailable(stage) {
  return playerLevel.value >= stage.requiredLevel
}

function canChallenge(stage) {
  return isAvailable(stage) && playerStamina.value >= stage.staminaCost
}

function getCannotReason(stage) {
  if (!isAvailable(stage)) return `需要 Lv.${stage.requiredLevel}+`
  if (playerStamina.value < stage.staminaCost) return '体力不足'
  return '无法挑战'
}

function stageEmoji(difficulty) {
  const emojis = ['🌱', '🌿', '🌲', '🏔️', '❄️', '⚡', '🔥', '💎', '👑', '💀']
  return emojis[Math.min(difficulty - 1, emojis.length - 1)]
}

function handleStageClick(stage) {
  recoverStaminaByTime()
  
  if (!isAvailable(stage)) {
    insufficientStage.value = stage
    showLevelModal.value = true
    return
  }
  
  if (playerStamina.value < stage.staminaCost) {
    insufficientStage.value = stage
    showStaminaModal.value = true
    return
  }
  
  selectedStage.value = { ...stage }
}

function confirmBattle() {
  if (!selectedStage.value || !canChallenge(selectedStage.value)) return
  consumeStamina(selectedStage.value.staminaCost)
  emit('start-battle', { enemy: selectedStage.value.enemy, stageId: selectedStage.value.id })
}

function handleRest() {
  const amount = restRecover()
  if (amount > 0) {
    alert(`休息恢复了 ${amount} 点体力！`)
  } else {
    alert('体力已满！')
  }
}

function handleRestFromModal() {
  const amount = restRecover()
  showStaminaModal.value = false
  if (amount > 0) {
    alert(`休息恢复了 ${amount} 点体力！`)
  }
}
</script>
