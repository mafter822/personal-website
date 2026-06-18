<template>
  <div class="min-h-screen bg-bg">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold heading-italic">🐧 企鹅大乱斗</h1>
        <router-link to="/" class="text-sm text-text-secondary hover:text-primary transition-colors">
          ← 返回首页
        </router-link>
      </div>

      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
          :class="activeTab === tab.id
            ? 'bg-black text-white'
            : 'bg-bg-card text-text-secondary hover:text-primary hover:bg-bg-card-hover'"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <div>
        <GameHome v-if="activeTab === 'home'" />
        <StageSelect v-else-if="activeTab === 'stage'" @start-battle="startBattle" />
        <BattleScene
          v-else-if="activeTab === 'battle'"
          :enemy="battleEnemy"
          :stage-id="battleStageId"
          @battle-end="onBattleEnd"
        />
        <SkillBook v-else-if="activeTab === 'skills'" />
        <WeaponBook v-else-if="activeTab === 'weapons'" />
        <Inventory v-else-if="activeTab === 'inventory'" />
        <GameMenu v-else-if="activeTab === 'menu'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameHome from '../components/game/GameHome.vue'
import StageSelect from '../components/game/StageSelect.vue'
import BattleScene from '../components/game/BattleScene.vue'
import SkillBook from '../components/game/SkillBook.vue'
import WeaponBook from '../components/game/WeaponBook.vue'
import Inventory from '../components/game/Inventory.vue'
import GameMenu from '../components/game/GameMenu.vue'

const activeTab = ref('home')
const battleEnemy = ref(null)
const battleStageId = ref(null)

const tabs = [
  { id: 'home', icon: '🏠', label: '地盘' },
  { id: 'stage', icon: '⚔️', label: '乐斗' },
  { id: 'skills', icon: '✨', label: '技能' },
  { id: 'weapons', icon: '🗡️', label: '武器' },
  { id: 'inventory', icon: '🎒', label: '背包' },
  { id: 'menu', icon: '⚙️', label: '设置' },
]

function startBattle({ enemy, stageId }) {
  battleEnemy.value = enemy
  battleStageId.value = stageId
  activeTab.value = 'battle'
}

function onBattleEnd() {
  battleEnemy.value = null
  battleStageId.value = null
  activeTab.value = 'stage'
}
</script>
