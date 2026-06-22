<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h3 class="text-lg font-semibold mb-2">🔧 GM 后台</h3>
      <p class="text-sm text-text-secondary">游戏管理工具 — 修改属性、发放物品、调试战斗</p>
    </div>

    <!-- Player Stats -->
    <div class="card p-4">
      <h4 class="font-medium mb-3">👤 玩家属性</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label class="text-xs text-text-muted">等级</label>
          <input type="number" v-model.number="form.level" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label class="text-xs text-text-muted">力量</label>
          <input type="number" v-model.number="form.strength" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label class="text-xs text-text-muted">敏捷</label>
          <input type="number" v-model.number="form.agility" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label class="text-xs text-text-muted">速度</label>
          <input type="number" v-model.number="form.speed" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label class="text-xs text-text-muted">生命上限</label>
          <input type="number" v-model.number="form.maxHealth" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label class="text-xs text-text-muted">当前生命</label>
          <input type="number" v-model.number="form.health" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label class="text-xs text-text-muted">精魄</label>
          <input type="number" v-model.number="form.spirit" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label class="text-xs text-text-muted">金币</label>
          <input type="number" v-model.number="form.gold" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none" />
        </div>
      </div>
      <button @click="applyStats" class="mt-3 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm">
        应用属性
      </button>
    </div>

    <!-- Give Items -->
    <div class="card p-4">
      <h4 class="font-medium mb-3">🎁 发放物品</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="text-xs text-text-muted">发放武器</label>
          <select v-model="selectedWeapon" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none">
            <option value="">选择武器...</option>
            <option v-for="w in allWeapons" :key="w.id" :value="w.id">{{ w.name }} ({{ w.quality }})</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-text-muted">发放技能</label>
          <select v-model="selectedSkill" class="w-full mt-1 px-3 py-1.5 text-sm rounded-lg bg-bg-card border border-border focus:border-primary outline-none">
            <option value="">选择技能...</option>
            <option v-for="s in allSkills" :key="s.id" :value="s.id">{{ s.name }} ({{ s.tier }})</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2 mt-3">
        <button @click="giveWeapon" :disabled="!selectedWeapon" class="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition-colors text-sm">
          发放武器
        </button>
        <button @click="giveSkill" :disabled="!selectedSkill" class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm">
          发放技能
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card p-4">
      <h4 class="font-medium mb-3">⚡ 快捷操作</h4>
      <div class="flex flex-wrap gap-2">
        <button @click="fullHeal" class="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-sm">
          ❤️ 满血
        </button>
        <button @click="fullStamina" class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm">
          ⚡ 满体力
        </button>
        <button @click="addExp1000" class="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors text-sm">
          ⭐ +1000经验
        </button>
        <button @click="addSpirit100" class="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors text-sm">
          💎 +100精魄
        </button>
        <button @click="maxAllSkills" class="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors text-sm">
          ✨ 满级所有技能
        </button>
        <button @click="enhanceAllWeapons" class="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors text-sm">
          🗡️ 满强化所有武器
        </button>
        <button @click="unlockAllStages" class="px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors text-sm">
          🗺️ 通关所有关卡
        </button>
      </div>
    </div>

    <!-- Current State -->
    <div class="card p-4">
      <h4 class="font-medium mb-3">📊 当前状态</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <span class="text-text-muted">等级:</span>
          <span class="ml-1 font-medium">Lv.{{ state.player.level }}</span>
        </div>
        <div>
          <span class="text-text-muted">力量:</span>
          <span class="ml-1 font-medium">{{ state.player.strength }}</span>
        </div>
        <div>
          <span class="text-text-muted">敏捷:</span>
          <span class="ml-1 font-medium">{{ state.player.agility }}</span>
        </div>
        <div>
          <span class="text-text-muted">速度:</span>
          <span class="ml-1 font-medium">{{ state.player.speed }}</span>
        </div>
        <div>
          <span class="text-text-muted">生命:</span>
          <span class="ml-1 font-medium">{{ state.player.health }}/{{ state.player.maxHealth }}</span>
        </div>
        <div>
          <span class="text-text-muted">体力:</span>
          <span class="ml-1 font-medium">{{ state.player.stamina }}/100</span>
        </div>
        <div>
          <span class="text-text-muted">精魄:</span>
          <span class="ml-1 font-medium">{{ state.player.spirit }}</span>
        </div>
        <div>
          <span class="text-text-muted">武器:</span>
          <span class="ml-1 font-medium">{{ state.weapons.length }}把</span>
        </div>
        <div>
          <span class="text-text-muted">技能:</span>
          <span class="ml-1 font-medium">{{ state.skills.length }}个</span>
        </div>
        <div>
          <span class="text-text-muted">胜/负:</span>
          <span class="ml-1 font-medium">{{ state.stats.wins }}/{{ state.stats.losses }}</span>
        </div>
        <div>
          <span class="text-text-muted">连胜:</span>
          <span class="ml-1 font-medium">{{ state.stats.streak }}</span>
        </div>
        <div>
          <span class="text-text-muted">职业:</span>
          <span class="ml-1 font-medium">{{ state.player.classId || '无' }}</span>
        </div>
      </div>
    </div>

    <!-- Reset -->
    <div class="card p-4">
      <h4 class="font-medium mb-3">⚠️ 危险操作</h4>
      <div class="flex gap-2">
        <button @click="resetGame" class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm">
          🗑️ 重置游戏
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { gameStore } from '../../game/store.js'
import { WEAPONS } from '../../game/data/weapons.js'
import { SKILLS } from '../../game/data/skills.js'
import { STAGES } from '../../game/data/stages.js'

const { state, resetGame: storeReset, addExp, addSpirit, learnSkill, addWeapon, clearStage, equipWeapon } = gameStore
const showToast = inject('showToast')

const form = ref({
  level: state.player.level,
  strength: state.player.strength,
  agility: state.player.agility,
  speed: state.player.speed,
  maxHealth: state.player.maxHealth,
  health: state.player.health,
  spirit: state.player.spirit,
  gold: state.player.gold,
})

const allWeapons = WEAPONS
const allSkills = SKILLS
const selectedWeapon = ref('')
const selectedSkill = ref('')

function applyStats() {
  state.player.level = form.value.level
  state.player.strength = form.value.strength
  state.player.agility = form.value.agility
  state.player.speed = form.value.speed
  state.player.maxHealth = form.value.maxHealth
  state.player.health = form.value.health
  state.player.spirit = form.value.spirit
  state.player.gold = form.value.gold
  showToast('属性已应用', 'success')
}

function giveWeapon() {
  const weapon = WEAPONS.find(w => w.id === selectedWeapon.value)
  if (weapon) {
    addWeapon(weapon)
    showToast(`已发放 ${weapon.name}`, 'success')
    selectedWeapon.value = ''
  }
}

function giveSkill() {
  const skill = SKILLS.find(s => s.id === selectedSkill.value)
  if (skill) {
    learnSkill(skill)
    showToast(`已学会 ${skill.name}`, 'success')
    selectedSkill.value = ''
  }
}

function fullHeal() {
  state.player.health = state.player.maxHealth
  showToast('生命已回满', 'success')
}

function fullStamina() {
  state.player.stamina = 100 + (state.player.level - 1) * 5
  showToast('体力已回满', 'success')
}

function addExp1000() {
  addExp(1000)
  showToast('已获得 1000 经验', 'success')
}

function addSpirit100() {
  addSpirit(100)
  showToast('已获得 100 精魄', 'success')
}

function maxAllSkills() {
  state.skills.forEach(s => { s.level = 10 })
  showToast('所有技能已满级', 'success')
}

function enhanceAllWeapons() {
  state.weapons.forEach(w => { w.enhanceLevel = 3 })
  showToast('所有武器已满强化', 'success')
}

function unlockAllStages() {
  STAGES.forEach(s => clearStage(s.id))
  showToast('所有关卡已通关', 'success')
}

function resetGame() {
  if (confirm('确定要重置游戏吗？所有数据将丢失！')) {
    storeReset()
    window.location.reload()
  }
}
</script>
