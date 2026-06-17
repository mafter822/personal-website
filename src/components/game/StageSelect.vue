<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">⚔️ 快速乐斗</h3>
    <p class="text-sm text-text-secondary mb-6">挑战NPC对手，获得经验和精魄</p>

    <div class="space-y-3">
      <div
        v-for="stage in stages"
        :key="stage.id"
        class="card p-4 transition-all"
        :class="isAvailable(stage) ? 'hover:border-primary/30 cursor-pointer' : 'opacity-50'"
        @click="isAvailable(stage) && startBattle(stage)"
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
        @click="startBattle(selectedStage)"
        class="btn-primary w-full mt-4"
        :disabled="!canChallenge(selectedStage)"
      >
        {{ canChallenge(selectedStage) ? '开始挑战' : '体力不足或等级不够' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { STAGES } from '../../game/data/stages.js'

const emit = defineEmits(['start-battle'])
const { state, consumeStamina } = gameStore

const selectedStage = ref(null)

const stages = STAGES

function cleared(id) {
  return state.stagesCleared.includes(id)
}

function isAvailable(stage) {
  return state.player.level >= stage.requiredLevel
}

function canChallenge(stage) {
  return isAvailable(stage) && state.player.stamina >= stage.staminaCost
}

function stageEmoji(difficulty) {
  const emojis = ['🌱', '🌿', '🌲', '🏔️', '❄️', '⚡', '🔥', '💎', '👑', '💀']
  return emojis[Math.min(difficulty - 1, emojis.length - 1)]
}

function startBattle(stage) {
  if (!canChallenge(stage)) return
  selectedStage.value = stage
  consumeStamina(stage.staminaCost)
  emit('start-battle', { enemy: stage.enemy, stageId: stage.id })
}
</script>
