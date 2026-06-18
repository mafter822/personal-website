<template>
  <div class="min-h-screen bg-bg">
    <Toast :message="toastMessage" :type="toastType" />
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold heading-italic">🐧 企鹅大乱斗</h1>
        <router-link to="/" class="text-sm text-text-secondary hover:text-primary transition-colors">
          ← 返回首页
        </router-link>
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
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
        <ClassTree v-else-if="activeTab === 'class'" />
        <FriendList v-else-if="activeTab === 'friends'" @start-battle="startBattle" />
        <RankingPanel v-else-if="activeTab === 'ranking'" />
        <RealmPanel v-else-if="activeTab === 'realm'" />
        <SkillBook v-else-if="activeTab === 'skills'" />
        <WeaponBook v-else-if="activeTab === 'weapons'" />
        <TowerScene v-else-if="activeTab === 'tower'" @start-battle="startBattle" />
        <ShopPanel v-else-if="activeTab === 'shop'" />
        <AchievementPanel v-else-if="activeTab === 'achievements'" />
        <GameMenu v-else-if="activeTab === 'menu'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { gameStore } from '../game/store.js'
import GameHome from '../components/game/GameHome.vue'
import StageSelect from '../components/game/StageSelect.vue'
import BattleScene from '../components/game/BattleScene.vue'
import SkillBook from '../components/game/SkillBook.vue'
import WeaponBook from '../components/game/WeaponBook.vue'
import Inventory from '../components/game/Inventory.vue'
import TowerScene from '../components/game/TowerScene.vue'
import ShopPanel from '../components/game/ShopPanel.vue'
import ClassTree from '../components/game/ClassTree.vue'
import FriendList from '../components/game/FriendList.vue'
import RankingPanel from '../components/game/RankingPanel.vue'
import RealmPanel from '../components/game/RealmPanel.vue'
import AchievementPanel from '../components/game/AchievementPanel.vue'
import GameMenu from '../components/game/GameMenu.vue'
import Toast from '../components/game/Toast.vue'

const { state } = gameStore

const activeTab = ref('home')
const previousTab = ref('stage')
const battleEnemy = ref(null)
const battleStageId = ref(null)
const toastMessage = ref('')
const toastType = ref('info')

function showToast(message, type = 'info') {
  toastMessage.value = ''
  setTimeout(() => {
    toastMessage.value = message
    toastType.value = type
  }, 50)
}

provide('showToast', showToast)

const allTabs = [
  { id: 'home', icon: '🏠', label: '地盘' },
  { id: 'stage', icon: '⚔️', label: '乐斗' },
  { id: 'tower', icon: '🗼', label: '斗神塔' },
  { id: 'friends', icon: '👥', label: '好友' },
  { id: 'ranking', icon: '🏆', label: '排行' },
  { id: 'realm', icon: '🔮', label: '境界' },
  { id: 'class', icon: '⚔️', label: '职业' },
  { id: 'skills', icon: '✨', label: '技能' },
  { id: 'weapons', icon: '🗡️', label: '武器' },
  { id: 'shop', icon: '🛒', label: '商城' },
  { id: 'achievements', icon: '🏅', label: '成就' },
  { id: 'menu', icon: '⚙️', label: '设置' },
]

const tabs = computed(() => {
  const visible = state.settings?.visibleTabs || {}
  return allTabs.filter(tab => visible[tab.id] !== false)
})

function startBattle({ enemy, stageId, fromTab }) {
  previousTab.value = fromTab || 'stage'
  battleEnemy.value = enemy
  battleStageId.value = stageId
  activeTab.value = 'battle'
}

function onBattleEnd() {
  battleEnemy.value = null
  battleStageId.value = null
  activeTab.value = previousTab.value
}
</script>
