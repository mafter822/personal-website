<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h3 class="text-lg font-semibold mb-2">⚔️ 职业系统</h3>
      <p class="text-sm text-text-secondary">Lv.15 可选择职业，Lv.40 可觉醒</p>
    </div>

    <!-- Class Selection -->
    <div v-if="!state.player.classId" class="card p-4">
      <h4 class="font-medium mb-4">选择职业</h4>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="cls in classes"
          :key="cls.id"
          class="card p-4 cursor-pointer hover:border-primary/30 transition-all"
          :class="state.player.level < cls.unlockLevel ? 'opacity-50' : ''"
          @click="selectClass(cls)"
        >
          <div class="text-center">
            <div class="text-4xl mb-2">{{ cls.icon }}</div>
            <div class="font-bold text-lg">{{ cls.name }}</div>
            <div class="text-sm text-text-secondary mt-1">{{ cls.description }}</div>
            <div class="text-xs text-text-muted mt-2">Lv.{{ cls.unlockLevel }}+ 解锁</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Class Skill Tree -->
    <div v-else class="space-y-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-3xl">{{ currentClass.icon }}</span>
            <div>
              <div class="font-bold text-lg">{{ currentClass.name }}</div>
              <div class="text-sm text-text-secondary">{{ currentClass.description }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-text-secondary">技能点</div>
            <div class="text-xl font-bold text-primary">{{ skillPoints }}</div>
          </div>
        </div>
      </div>

      <!-- Skill Tree -->
      <div class="space-y-4">
        <div v-for="tier in 7" :key="tier" class="card p-4">
          <div class="text-xs text-text-muted mb-3">Tier {{ tier }}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="skill in getTierSkills(tier)"
              :key="skill.id"
              class="p-3 bg-bg-card rounded-lg"
              :class="isSkillLocked(skill) ? 'opacity-40' : ''"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">{{ skill.name }}</span>
                <span class="text-xs px-2 py-0.5 rounded" :class="skill.type === 'passive' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'">
                  {{ skill.type === 'passive' ? '被动' : '主动' }}
                </span>
              </div>
              <p class="text-xs text-text-secondary mb-2">{{ skill.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-text-muted">Lv.{{ getSkillLevel(skill.id) }}/{{ skill.maxLevel }}</span>
                <button
                  v-if="!isSkillLocked(skill) && skillPoints > 0 && getSkillLevel(skill.id) < skill.maxLevel"
                  @click="allocateSkill(skill)"
                  class="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark hover:scale-110 active:scale-95 transition-all shadow-sm"
                >
                  +
                </button>
                <span v-else-if="getSkillLevel(skill.id) >= skill.maxLevel" class="text-xs text-green-600 font-medium">已满级</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { gameStore } from '../../game/store.js'
import { CLASSES, getClassById } from '../../game/data/classes.js'

const { state } = gameStore
const showToast = inject('showToast')

const classes = CLASSES

const currentClass = computed(() => getClassById(state.player.classId))

const skillPoints = computed(() => {
  const classSkills = state.classSkills?.[state.player.classId] || {}
  const allocated = Object.values(classSkills.allocated || {}).reduce((sum, v) => sum + v, 0)
  return Math.max(0, state.player.level - 15 - allocated)
})

function selectClass(cls) {
  if (state.player.level < cls.unlockLevel) {
    showToast(`需要 Lv.${cls.unlockLevel}+ 才能选择此职业`, 'warning')
    return
  }
  state.player.classId = cls.id
  if (!state.classSkills) state.classSkills = {}
  state.classSkills[cls.id] = { skillPoints: 0, allocated: {} }
}

function getTierSkills(tier) {
  if (!currentClass.value) return []
  return currentClass.value.skillTree.filter(s => s.tier === tier)
}

function isSkillLocked(skill) {
  if (skill.unlockLevel && state.player.level < skill.unlockLevel) return true
  return false
}

function getSkillLevel(skillId) {
  const classSkills = state.classSkills?.[state.player.classId] || {}
  return classSkills.allocated?.[skillId] || 0
}

function allocateSkill(skill) {
  if (skillPoints.value <= 0) return
  if (getSkillLevel(skill.id) >= skill.maxLevel) return

  if (!state.classSkills) state.classSkills = {}
  if (!state.classSkills[state.player.classId]) {
    state.classSkills[state.player.classId] = { allocated: {} }
  }
  const classSkills = state.classSkills[state.player.classId]
  if (!classSkills.allocated) classSkills.allocated = {}
  classSkills.allocated[skill.id] = (classSkills.allocated[skill.id] || 0) + 1
}
</script>
