<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">我的武器</h3>

    <div v-if="state.weapons.length === 0" class="text-center py-12 text-text-secondary">
      <p class="text-4xl mb-4">🎒</p>
      <p>背包空空如也</p>
      <p class="text-sm mt-2">通过PVE关卡获得武器</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="weapon in state.weapons"
        :key="weapon.id"
        class="card p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <span class="w-4 h-4 rounded-full" :style="{ backgroundColor: qualityColor(weapon.quality) }"></span>
          <div>
            <div class="font-medium">{{ weapon.name }}</div>
            <div class="text-xs text-text-secondary">
              {{ typeName(weapon.type) }} · {{ qualityName(weapon.quality) }}
              <span v-if="weapon.enhanceLevel > 0" class="text-primary"> +{{ weapon.enhanceLevel }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="state.equippedWeapon === weapon.id" class="text-xs bg-primary text-white px-2 py-1 rounded">
            装备中
          </span>
          <button
            v-else
            @click="equip(weapon.id)"
            class="text-xs px-3 py-1 rounded border border-border hover:border-primary transition-colors"
          >
            装备
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gameStore } from '../../game/store.js'
import { QUALITY_COLORS, QUALITY_NAMES } from '../../game/data/constants.js'

const { state, equipWeapon } = gameStore

function qualityColor(q) { return QUALITY_COLORS[q] || '#9ca3af' }
function qualityName(q) { return QUALITY_NAMES[q] || '凡器' }

const typeNames = { small: '小型', medium: '中型', large: '大型', hidden: '暗器' }
function typeName(t) { return typeNames[t] || t }

function equip(id) {
  equipWeapon(id)
}
</script>
