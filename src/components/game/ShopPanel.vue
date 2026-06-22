<template>
  <div class="space-y-4">
    <div class="card p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">🛒 商城</h3>
        <div class="text-sm text-text-secondary">💰 经验: {{ state.player.exp }}</div>
      </div>
      <p class="text-xs text-text-muted mt-1">花费经验购买道具，每日限购</p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="item in shopItems"
        :key="item.id"
        class="card p-4"
      >
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl">{{ item.icon }}</span>
          <div class="flex-1">
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-xs text-text-secondary">{{ item.description }}</div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <span class="text-amber-500">💰 {{ item.price }}</span>
            <span class="text-text-muted ml-2">今日剩余 {{ getRemaining(item) }}/{{ item.dailyLimit }}</span>
          </div>
          <button
            @click="buyItem(item)"
            class="px-4 py-1.5 text-sm rounded-lg transition-colors"
            :class="canBuy(item)
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-bg-card text-text-muted cursor-not-allowed'"
            :disabled="!canBuy(item)"
          >
            购买
          </button>
        </div>
      </div>
    </div>

    <!-- Inventory Preview -->
    <div class="card p-4" v-if="hasItems">
      <h4 class="font-medium mb-3">🎒 我的道具</h4>
      <div class="flex flex-wrap gap-3">
        <div v-for="(count, itemId) in state.inventory" :key="itemId" class="flex items-center gap-2 text-sm">
          <span>{{ getItemIcon(itemId) }}</span>
          <span>{{ getItemName(itemId) }}</span>
          <span class="text-primary">×{{ count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { gameStore } from '../../game/store.js'
import { SHOP_ITEMS, getShopItemById } from '../../game/data/shop.js'

const { state, addExp, addSpirit } = gameStore
const showToast = inject('showToast')

const shopItems = SHOP_ITEMS

const hasItems = computed(() => {
  return Object.keys(state.inventory).length > 0
})

function getRemaining(item) {
  const purchases = state.shopDaily?.purchases || {}
  return item.dailyLimit - (purchases[item.id] || 0)
}

function canBuy(item) {
  if (state.player.exp < item.price) return false
  if (getRemaining(item) <= 0) return false
  return true
}

function buyItem(item) {
  if (!canBuy(item)) return

  state.player.exp -= item.price

  if (!state.shopDaily) {
    state.shopDaily = { lastResetDate: new Date().toDateString(), purchases: {} }
  }
  state.shopDaily.purchases[item.id] = (state.shopDaily.purchases[item.id] || 0) + 1

  applyEffect(item.effect)

  showToast(`购买成功: ${item.name}`, 'success')
}

function applyEffect(effect) {
  switch (effect.type) {
    case 'stamina':
      state.player.stamina = Math.min(getMaxStamina(), state.player.stamina + effect.amount)
      break
    case 'spirit':
      state.player.spirit += effect.amount
      break
    case 'heal':
      const maxHp = 100 + (state.player.level - 1) * 15
      state.player.health = Math.min(maxHp, state.player.health + Math.floor(maxHp * effect.percent))
      break
    case 'buff':
      if (!state.buffs) state.buffs = []
      state.buffs.push({ type: effect.stat, amount: effect.amount, duration: effect.duration })
      break
    case 'material':
      if (!state.inventory[effect.item]) state.inventory[effect.item] = 0
      state.inventory[effect.item]++
      break
  }
}

function getMaxStamina() {
  return 100 + (state.player.level - 1) * 5
}

function getItemIcon(itemId) {
  const item = getShopItemById(itemId)
  return item ? item.icon : '📦'
}

function getItemName(itemId) {
  const item = getShopItemById(itemId)
  return item ? item.name : itemId
}
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}
</style>
