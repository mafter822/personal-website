<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h3 class="text-lg font-semibold mb-2">⚔️ 随机乐斗</h3>
      <p class="text-sm text-text-secondary mb-4">匹配一个与你实力相当的企鹅勇士</p>

      <div v-if="!matched" class="text-center py-8">
        <div class="text-4xl mb-4 animate-bounce">🐧</div>
        <p class="text-text-secondary mb-4">正在匹配对手...</p>
        <button @click="matchOpponent" class="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium">
          ⚔️ 开始匹配
        </button>
      </div>

      <div v-else>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="card p-4 text-center">
            <div class="text-3xl mb-2">🐧</div>
            <div class="font-bold">{{ state.player.name }}</div>
            <div class="text-sm text-text-secondary">Lv.{{ state.player.level }}</div>
            <div class="text-xs text-text-muted mt-1">{{ state.player.title }}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-3xl mb-2">🐧</div>
            <div class="font-bold" :style="{ color: opponent.color }">{{ opponent.name }}</div>
            <div class="text-sm text-text-secondary">Lv.{{ opponent.level }}</div>
            <div class="text-xs text-text-muted mt-1">{{ opponent.title }}</div>
          </div>
        </div>

        <div class="card p-4 mb-4">
          <h4 class="font-medium mb-3">对手信息</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="text-text-muted">力量:</span> <span class="font-medium">{{ opponent.strength }}</span></div>
            <div><span class="text-text-muted">敏捷:</span> <span class="font-medium">{{ opponent.agility }}</span></div>
            <div><span class="text-text-muted">速度:</span> <span class="font-medium">{{ opponent.speed }}</span></div>
            <div><span class="text-text-muted">生命:</span> <span class="font-medium">{{ opponent.maxHealth }}</span></div>
            <div><span class="text-text-muted">武器:</span> <span class="font-medium">{{ opponent.weaponName }}</span></div>
            <div><span class="text-text-muted">技能:</span> <span class="font-medium">{{ opponent.skillCount }}个</span></div>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="startBattle" class="flex-1 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium">
            ⚔️ 开始战斗
          </button>
          <button @click="matchOpponent" class="px-4 py-3 rounded-lg border border-border hover:border-primary transition-colors text-sm">
            🔄 重新匹配
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { SKILLS, getSkillById } from '../../game/data/skills.js'
import { WEAPONS } from '../../game/data/weapons.js'
import { TITLE_LIST, generateNPCName } from '../../game/data/pets.js'

const emit = defineEmits(['start-battle'])
const { state } = gameStore

const matched = ref(false)
const opponent = ref(null)

const TITLE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getTitle(level) {
  let title = '初心者'
  for (const t of TITLE_LIST) {
    if (level >= t.minLevel) title = t.title
  }
  return title
}

function matchOpponent() {
  const playerLevel = state.player.level
  const levelRange = Math.max(1, Math.floor(playerLevel * 0.3))
  const enemyLevel = Math.max(1, playerLevel + Math.floor(Math.random() * levelRange * 2) - levelRange)

  const strBase = 15 + enemyLevel * 3
  const agiBase = 8 + enemyLevel * 2
  const spdBase = 10 + enemyLevel * 2
  const hpBase = 80 + enemyLevel * 15

  const availableWeapons = WEAPONS.filter(w => w.reqLevel <= Math.max(enemyLevel, playerLevel))
  const weapon = availableWeapons.length > 0 ? randomFrom(availableWeapons) : null

  const availableSkills = SKILLS.filter(s => s.unlockLevel <= Math.max(enemyLevel, playerLevel) && s.category !== 'stat')
  const skillCount = Math.min(4 + Math.floor(enemyLevel / 8), availableSkills.length)
  const skills = []
  const pool = [...availableSkills]
  for (let i = 0; i < skillCount && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    skills.push({ id: pool[idx].id, level: 1 + Math.floor(Math.random() * 3) })
    pool.splice(idx, 1)
  }

  const name = generateNPCName()

  opponent.value = {
    name,
    level: enemyLevel,
    title: getTitle(enemyLevel),
    strength: strBase + Math.floor(Math.random() * 10),
    agility: agiBase + Math.floor(Math.random() * 8),
    speed: spdBase + Math.floor(Math.random() * 8),
    maxHealth: hpBase + Math.floor(Math.random() * 30),
    health: hpBase + Math.floor(Math.random() * 30),
    weapon,
    weaponName: weapon ? weapon.name : '拳头',
    skills,
    skillCount: skills.length,
    rewards: { exp: 50 + enemyLevel * 10, spirit: 1 + Math.floor(enemyLevel / 10) },
    color: randomFrom(TITLE_COLORS),
  }

  matched.value = true
}

function startBattle() {
  if (!opponent.value) return
  emit('start-battle', { enemy: opponent.value, stageId: null, fromTab: 'stage' })
}
</script>
