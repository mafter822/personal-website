<template>
  <div>
    <!-- Category Filter -->
    <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
      <button
        v-for="(label, key) in categories"
        :key="key"
        @click="activeCategory = key"
        class="px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap"
        :class="activeCategory === key
          ? 'bg-black text-white'
          : 'bg-bg-card text-text-secondary hover:text-primary'"
      >
        {{ label }}
      </button>
    </div>

    <p class="text-sm text-text-secondary mb-4">
      技能图鉴（共 {{ filteredSkills.length }} 种）· 当前精魄: {{ state.player.spirit }} · Lv.{{ state.player.level }}
    </p>

    <!-- Skills Grid -->
    <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="skill in filteredSkills"
        :key="skill.id"
        class="card p-4"
        :class="!isUnlocked(skill) ? 'opacity-40' : ''"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ skill.icon }}</span>
            <span class="font-semibold">{{ skill.name }}</span>
            <span class="text-xs px-2 py-0.5 rounded" :class="tierClass(skill.tier)">
              {{ skill.tier }}
            </span>
            <span class="text-xs px-2 py-0.5 rounded" :class="categoryClass(skill.category)">
              {{ categories[skill.category] }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="ownedSkill" class="text-xs text-green-600">✓</span>
            <span class="text-xs px-2 py-0.5 rounded font-medium"
              :class="ownedSkill && ownedSkill.level > 0 ? 'bg-accent text-white' : 'bg-primary/10 text-primary'">
              Lv.{{ ownedSkill ? ownedSkill.level : 0 }}/{{ skill.maxLevel }}
            </span>
          </div>
        </div>

        <!-- Level Progress -->
        <div class="h-2 bg-bg-card rounded-full overflow-hidden mb-3">
          <div
            class="h-full bg-primary rounded-full transition-all"
            :style="{ width: ((ownedSkill ? ownedSkill.level : 0) / skill.maxLevel * 100) + '%' }"
          ></div>
        </div>

        <!-- Description -->
        <p class="text-sm text-text-secondary mb-2">{{ skill.desc }}</p>

        <!-- Level Unlock Info -->
        <div class="flex items-center justify-between text-xs">
          <span class="text-text-muted">
            {{ isUnlocked(skill) ? '已解锁' : `Lv.${skill.unlockLevel}+ 解锁` }}
          </span>
          <span class="text-text-muted">
            升级: 💎{{ skill.spiritCost }} 精魄
          </span>
        </div>

        <!-- Upgrade Button -->
        <div class="mt-3" v-if="ownedSkill">
          <button
            v-if="ownedSkill.level < skill.maxLevel && state.player.spirit >= upgradeCost(skill)"
            @click="handleUpgrade(skill)"
            class="w-full px-3 py-1.5 text-xs rounded bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            升级至 Lv.{{ ownedSkill.level + 1 }} (💎{{ upgradeCost(skill) }})
          </button>
          <span v-else-if="ownedSkill.level >= skill.maxLevel" class="text-xs text-green-600">已满级</span>
          <span v-else class="text-xs text-text-muted">精魄不足</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { SKILLS, getSkillsByCategory, getLevelRange, LEVEL_RANGES } from '../../game/data/skills.js'

const { state, upgradeSkill, learnSkill } = gameStore

const activeCategory = ref('all')
const categories = {
  all: '全部',
  stat: '属性',
  buff: '增幅',
  attack: '攻击',
  control: '控制',
  defense: '防御',
  special: '特殊',
}

const filteredSkills = computed(() => getSkillsByCategory(activeCategory.value))

function getOwnedSkill(skillId) {
  return state.skills.find(s => s.id === skillId)
}

const ownedSkill = computed(() => null)

function isUnlocked(skill) {
  return state.player.level >= skill.unlockLevel
}

function upgradeCost(skill) {
  const owned = getOwnedSkill(skill.id)
  if (!owned) return skill.spiritCost
  return skill.spiritCost * owned.level
}

function categoryClass(cat) {
  const map = {
    stat: 'bg-blue-100 text-blue-700',
    buff: 'bg-green-100 text-green-700',
    attack: 'bg-red-100 text-red-700',
    control: 'bg-purple-100 text-purple-700',
    defense: 'bg-yellow-100 text-yellow-700',
    special: 'bg-pink-100 text-pink-700',
  }
  return map[cat] || 'bg-gray-100 text-gray-700'
}

function tierClass(tier) {
  const map = {
    T0: 'bg-red-100 text-red-700',
    T1: 'bg-orange-100 text-orange-700',
    T2: 'bg-yellow-100 text-yellow-700',
    T3: 'bg-green-100 text-green-700',
  }
  return map[tier] || 'bg-gray-100 text-gray-700'
}

function handleUpgrade(skill) {
  const owned = getOwnedSkill(skill.id)
  if (!owned) {
    learnSkill(skill)
    return
  }
  const cost = upgradeCost(skill)
  upgradeSkill(skill.id, cost)
}
</script>
