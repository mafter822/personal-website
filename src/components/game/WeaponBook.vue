<template>
  <div>
    <!-- Type Filter -->
    <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
      <button
        v-for="(label, key) in weaponTypes"
        :key="key"
        @click="activeType = key"
        class="px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap"
        :class="activeType === key
          ? 'bg-black text-white'
          : 'bg-bg-card text-text-secondary hover:text-primary'"
      >
        {{ label }}
      </button>
    </div>

    <p class="text-sm text-text-secondary mb-4">
      武器图鉴（共 {{ filteredWeapons.length }} 种）· 当前等级可掉落 {{ availableCount }} 种
    </p>

    <!-- Weapons Grid -->
    <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="weapon in filteredWeapons"
        :key="weapon.id"
        class="card p-4"
        :class="!isAvailable(weapon) ? 'opacity-40' : ''"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: qualityColor(weapon.quality) }"></span>
            <span class="font-semibold">{{ weapon.name }}</span>
            <span class="text-xs px-2 py-0.5 rounded" :style="{ backgroundColor: qualityColor(weapon.quality) + '20', color: qualityColor(weapon.quality) }">
              {{ qualityName(weapon.quality) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="ownedWeapon(weapon.id)" class="text-xs text-green-600">✓ 已拥有</span>
          </div>
        </div>

        <!-- Info -->
        <div class="text-xs text-text-secondary mb-3 space-y-1">
          <div>类型: {{ typeName(weapon.type) }} · 要求 Lv.{{ weapon.reqLevel }}</div>
          <div v-if="weapon.special" class="text-primary">
            ⚡ {{ specialDesc(weapon.special) }}
          </div>
        </div>

        <!-- Damage Table -->
        <div class="bg-bg-card rounded-lg p-3 mb-3">
          <div class="grid grid-cols-4 gap-2 text-xs text-center">
            <div class="font-medium text-text-secondary">强化</div>
            <div class="font-medium text-text-secondary">伤害</div>
            <div class="font-medium text-text-secondary">加成</div>
            <div></div>
            <template v-for="level in 4" :key="level">
              <div :class="level === 1 ? 'font-medium' : 'text-text-secondary'">
                {{ level === 1 ? '基础' : '+' + (level - 1) }}
              </div>
              <div class="font-medium">
                {{ getDamageRangeLocal(weapon, level - 1)[0] }} ~ {{ getDamageRangeLocal(weapon, level - 1)[1] }}
              </div>
              <div class="text-primary text-xs">
                {{ level === 1 ? '基础伤害' : '+' + ((level - 1) * 10) + '% 伤害' }}
              </div>
              <div>
                <span v-if="ownedWeapon(weapon.id) && ownedWeapon(weapon.id).enhanceLevel === level - 1" class="text-xs bg-primary text-white px-1 rounded">当前</span>
                <span v-else-if="ownedWeapon(weapon.id) && ownedWeapon(weapon.id).enhanceLevel === level - 2" class="text-xs bg-amber-500 text-white px-1 rounded">↑下一级</span>
              </div>
            </template>
          </div>
        </div>

        <!-- Enhance -->
        <div v-if="ownedWeapon(weapon.id)" class="flex items-center justify-between">
          <span class="text-xs text-text-muted">💎 {{ weaponEnhanceCost(weapon.quality) }} 精魄</span>
          <button
            v-if="ownedWeapon(weapon.id).enhanceLevel < 3"
            @click="handleEnhance(weapon)"
            class="px-3 py-1 text-xs rounded bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            强化至 +{{ ownedWeapon(weapon.id).enhanceLevel + 1 }}
          </button>
          <span v-else class="text-xs text-green-600">已满级</span>
        </div>

        <p class="text-xs text-text-muted mt-2 italic">"{{ weapon.desc }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { WEAPON_QUALITY, LEVEL_RANGES, getLevelRange } from '../../game/data/constants.js'
import { WEAPONS, getWeaponsByType, getDamageRange, getWeaponEnhanceCost } from '../../game/data/weapons.js'

const { state, enhanceWeapon } = gameStore

const activeType = ref('all')
const weaponTypes = {
  all: '全部',
  small: '小型',
  medium: '中型',
  large: '大型',
  hidden: '暗器',
}

const filteredWeapons = computed(() => {
  if (activeType.value === 'all') return WEAPONS
  return WEAPONS.filter(w => w.type === activeType.value)
})

const availableCount = computed(() => {
  const rangeIndex = getLevelRange(state.player.level)
  return WEAPONS.filter(w => w.weights[rangeIndex] > 0).length
})

function ownedWeapon(id) {
  return state.weapons.find(w => w.id === id)
}

function isAvailable(weapon) {
  const rangeIndex = getLevelRange(state.player.level)
  return weapon.weights[rangeIndex] > 0
}

function qualityColor(q) { return WEAPON_QUALITY[q]?.color || '#9ca3af' }
function qualityName(q) { return WEAPON_QUALITY[q]?.name || '凡器' }

const typeNames = { small: '小型', medium: '中型', large: '大型', hidden: '暗器' }
function typeName(t) { return typeNames[t] || t }

function specialDesc(s) {
  const map = {
    throwable: '可投掷',
    combo: `+${Math.round(s.chance * 100)}% 连击`,
    sureHit: '必中（无法闪避）',
    dodgeCounter: `+${Math.round(s.chance * 100)}% 闪避反击`,
    ignoreUndying: '忽略装死',
    stun: `+${Math.round(s.chance * 100)}% 眩晕${s.turns ? s.turns + '回合' : ''}`,
    rest: `使用后需休息${s.turns}回合`,
    crit: `+${Math.round(s.chance * 100)}% 暴击×${s.multiplier}`,
    noRest: '无需休息',
    instakill: `必中，${Math.round(s.instakill * 100)}% 秒杀`,
    penetrate: '穿透',
  }
  return map[s.type] || s.type
}

function weaponEnhanceCost(q) { return getWeaponEnhanceCost(q) }

function getDamageRangeLocal(weapon, enhanceLevel) {
  return getDamageRange(weapon, enhanceLevel)
}

function handleEnhance(weapon) {
  const owned = ownedWeapon(weapon.id)
  if (!owned) return
  const cost = weaponEnhanceCost(weapon.quality)
  enhanceWeapon(weapon.id, cost)
}
</script>
