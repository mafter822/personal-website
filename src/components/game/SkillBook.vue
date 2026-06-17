<template>
  <div>
    <!-- Category Filter -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
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
      技能图鉴（共 {{ filteredSkills.length }} 种）· 当前精魄: {{ state.player.spirit }}
    </p>

    <!-- Skills Grid -->
    <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="skill in filteredSkills"
        :key="skill.id"
        class="card p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ skill.icon }}</span>
            <span class="font-semibold">{{ skill.name }}</span>
            <span class="text-xs px-2 py-0.5 rounded" :class="categoryClass(skill.category)">
              {{ categories[skill.category] }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="ownedSkill" class="text-xs text-green-600">✓ 已拥有</span>
            <span class="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
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
        <p class="text-sm text-text-secondary mb-3">{{ skill.desc }}</p>

        <!-- Upgrade -->
        <div class="flex items-center justify-between">
          <span class="text-xs text-text-muted">
            <template v-if="ownedSkill && ownedSkill.level >= skill.maxLevel">已满级</template>
            <template v-else-if="!ownedSkill">Lv.{{ skill.unlockLevel }}+ 升级时可能领悟</template>
            <template v-else>💎 {{ upgradeCost }} 精魄</template>
          </span>
          <button
            v-if="canUpgrade"
            @click="handleUpgrade(skill)"
            class="px-3 py-1 text-xs rounded bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            升级至 Lv.{{ (ownedSkill ? ownedSkill.level : 0) + 1 }}
          </button>
          <span v-else-if="ownedSkill && ownedSkill.level >= skill.maxLevel" class="text-xs text-green-600">
            满级
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { SKILLS, getSkillsByCategory } from '../../game/data/skills.js'

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

const ownedSkill = computed(() => {
  return null
})

const upgradeCost = computed(() => {
  return 0
})

const canUpgrade = computed(() => {
  return false
})

function handleUpgrade(skill) {
  const owned = getOwnedSkill(skill.id)
  if (!owned) {
    learnSkill(skill)
    return
  }
  const cost = skill.spiritCost * owned.level
  upgradeSkill(skill.id, cost)
}
</script>
