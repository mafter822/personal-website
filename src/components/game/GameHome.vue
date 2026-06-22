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
              <span>{{ state.player.stamina }}/{{ maxStamina }}</span>
            </div>
            <div class="h-3 bg-bg-card rounded-full overflow-hidden">
              <div class="h-full bg-amber-500 rounded-full transition-all" :style="{ width: staminaPercent + '%' }"></div>
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

    <!-- Skills -->
    <div class="card p-4">
      <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
        <span>✨</span> 已学技能
        <span class="text-xs text-text-muted">({{ state.skills.length }}/32)</span>
      </h3>
      <div v-if="state.skills.length > 0" class="flex flex-wrap gap-2">
        <div
          v-for="skill in state.skills"
          :key="skill.id"
          class="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all hover:scale-105"
          :class="getSkillStyle(skill)"
        >
          <span>{{ getSkillIcon(skill.id) }}</span>
          <span class="font-medium">{{ getSkillName(skill.id) }}</span>
          <span class="text-xs opacity-70">Lv.{{ skill.level }}</span>
        </div>
      </div>
      <div v-else class="text-center text-text-muted text-sm py-4">
        暂未学习技能
      </div>
    </div>

    <!-- Weapons -->
    <div class="card p-4">
      <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
        <span>🗡️</span> 武器库
        <span class="text-xs text-text-muted">({{ state.weapons.length }})</span>
      </h3>
      <div v-if="state.weapons.length > 0" class="flex flex-wrap gap-2">
        <div
          v-for="weapon in state.weapons"
          :key="weapon.id"
          class="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-all hover:scale-105"
          :class="getWeaponStyle(weapon)"
        >
          <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: getWeaponColor(weapon.quality) }"></span>
          <span class="font-medium">{{ weapon.name }}</span>
          <span v-if="weapon.enhanceLevel > 0" class="text-xs opacity-70">+{{ weapon.enhanceLevel }}</span>
        </div>
      </div>
      <div v-else class="text-center text-text-muted text-sm py-4">
        暂无武器
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { EXP_PER_LEVEL } from '../../game/data/constants.js'
import { getSkillById } from '../../game/data/skills.js'
import { WEAPON_QUALITY } from '../../game/data/weapons.js'

const { state, getCombatStats, getEquippedWeapon } = gameStore

const combatStats = computed(() => getCombatStats())
const maxHealth = computed(() => combatStats.value.maxHealth)
const maxStamina = computed(() => 100 + (state.player.level - 1) * 5)
const healthPercent = computed(() => (state.player.health / maxHealth.value) * 100)
const staminaPercent = computed(() => (state.player.stamina / maxStamina.value) * 100)
const expForLevel = computed(() => EXP_PER_LEVEL(state.player.level))
const expPercent = computed(() => (state.player.exp / expForLevel.value) * 100)

const combatPower = computed(() => {
  const s = combatStats.value
  return Math.floor(s.strength * 2 + s.agility * 1.5 + s.speed * 1.5 + s.maxHealth * 0.5)
})

const equippedWeapon = computed(() => getEquippedWeapon())

function getSkillName(id) {
  const skill = getSkillById(id)
  return skill ? skill.name : id
}

function getSkillIcon(id) {
  const skill = getSkillById(id)
  return skill ? skill.icon : '❓'
}

function getSkillStyle(skill) {
  const skillData = getSkillById(skill.id)
  if (!skillData) return 'bg-bg-card text-text-secondary'
  
  const tierStyles = {
    T0: 'bg-red-500/20 text-red-400 border border-red-500/30',
    T1: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    T2: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    T3: 'bg-green-500/20 text-green-400 border border-green-500/30',
  }
  return tierStyles[skillData.tier] || 'bg-bg-card text-text-secondary'
}

function getWeaponColor(quality) {
  return WEAPON_QUALITY[quality]?.color || '#9ca3af'
}

function getWeaponStyle(weapon) {
  const color = getWeaponColor(weapon.quality)
  return `bg-opacity-20 border border-opacity-30`
}
</script>
