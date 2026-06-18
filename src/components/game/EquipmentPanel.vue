<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h3 class="text-lg font-semibold mb-2">🛡️ 装备面板</h3>
      <p class="text-sm text-text-secondary">穿戴装备提升属性，集齐套装获得额外加成</p>
    </div>

    <!-- Equipment Slots -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="(slot, key) in slots" :key="key" class="card p-4">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xl">{{ slot.icon }}</span>
          <span class="font-medium">{{ slot.name }}</span>
        </div>
        <div v-if="getEquipped(key)" class="bg-bg-card rounded-lg p-3">
          <div class="flex items-center justify-between">
            <span class="font-medium" :style="{ color: getQualityColor(getEquipped(key).quality) }">
              {{ getEquipped(key).name }}
            </span>
            <span class="text-xs px-2 py-0.5 rounded" :style="{ backgroundColor: getQualityColor(getEquipped(key).quality) + '20', color: getQualityColor(getEquipped(key).quality) }">
              {{ getEquipped(key).quality }}
            </span>
          </div>
          <div class="text-xs text-text-secondary mt-1">
            <span v-for="(val, stat) in getEquipped(key).stats" :key="stat" class="mr-2">
              {{ statName(stat) }} +{{ val }}
            </span>
          </div>
          <button @click="unequip(key)" class="text-xs text-red-500 mt-2 hover:underline">卸下</button>
        </div>
        <div v-else class="text-center text-text-muted text-sm py-4">
          未装备
        </div>
      </div>
    </div>

    <!-- Set Bonuses -->
    <div class="card p-4" v-if="activeSets.length > 0">
      <h4 class="font-medium mb-3">🎁 套装效果</h4>
      <div class="space-y-2">
        <div v-for="set in activeSets" :key="set.id" class="text-sm">
          <span class="text-primary font-medium">{{ set.name }}</span>
          <span class="text-text-secondary ml-2">{{ set.description }}</span>
        </div>
      </div>
    </div>

    <!-- Inventory -->
    <div class="card p-4">
      <h4 class="font-medium mb-3">🎒 已拥有装备</h4>
      <div v-if="ownedEquipment.length === 0" class="text-center text-text-muted text-sm py-4">
        暂无装备
      </div>
      <div v-else class="space-y-2">
        <div v-for="item in ownedEquipment" :key="item.id" class="flex items-center justify-between p-2 bg-bg-card rounded-lg">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: getQualityColor(item.quality) }"></span>
            <span class="text-sm">{{ item.name }}</span>
            <span class="text-xs text-text-muted">{{ slotName(item.slot) }}</span>
          </div>
          <button
            @click="equip(item)"
            class="text-xs px-3 py-1 rounded bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            装备
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { EQUIPMENT_SLOTS, EQUIPMENT_DATABASE, EQUIPMENT_SETS, getEquipmentById } from '../../game/data/equipment.js'

const { state, equipEquipment, unequipEquipment } = gameStore

const slots = EQUIPMENT_SLOTS

const ownedEquipment = computed(() => {
  return state.equipment || []
})

const activeSets = computed(() => {
  const equippedIds = Object.values(state.equippedEquipment || {}).filter(Boolean)
  return EQUIPMENT_SETS.filter(set => {
    return set.pieces.every(piece => equippedIds.includes(piece))
  })
})

function getEquipped(slot) {
  const equippedId = state.equippedEquipment?.[slot]
  if (!equippedId) return null
  return getEquipmentById(equippedId)
}

function equip(item) {
  equipEquipment(item.slot, item.id)
}

function unequip(slot) {
  unequipEquipment(slot)
}

function getQualityColor(quality) {
  const map = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f97316',
    mythic: '#ec4899',
    divine: '#eab308',
  }
  return map[quality] || '#9ca3af'
}

function slotName(slot) {
  return EQUIPMENT_SLOTS[slot]?.name || slot
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
