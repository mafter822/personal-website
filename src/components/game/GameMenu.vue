<template>
  <div class="card p-4">
    <h3 class="font-semibold mb-4">⚙️ 游戏设置</h3>

    <!-- Tab Visibility -->
    <div class="mb-6">
      <h4 class="text-sm font-medium mb-3">界面显示设置</h4>
      <p class="text-xs text-text-muted mb-3">控制主界面显示哪些Tab</p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <label
          v-for="tab in allTabs"
          :key="tab.id"
          class="flex items-center gap-2 p-2 rounded-lg bg-bg-card cursor-pointer hover:bg-bg-card-hover transition-colors"
        >
          <input
            type="checkbox"
            v-model="state.settings.visibleTabs[tab.id]"
            class="w-4 h-4 accent-primary"
          />
          <span class="text-sm">{{ tab.icon }} {{ tab.label }}</span>
        </label>
      </div>
    </div>

    <!-- Other Settings -->
    <div class="space-y-3">
      <button
        @click="handleReset"
        class="w-full px-4 py-2 text-left text-sm rounded-lg border border-border hover:border-red-400 hover:text-red-500 transition-colors"
      >
        🔄 重新开始（清除所有存档）
      </button>

      <button
        @click="handleExport"
        class="w-full px-4 py-2 text-left text-sm rounded-lg border border-border hover:border-primary transition-colors"
      >
        📥 导出存档
      </button>

      <label class="w-full px-4 py-2 text-left text-sm rounded-lg border border-border hover:border-primary transition-colors cursor-pointer block">
        📤 导入存档
        <input type="file" accept=".json" @change="handleImport" class="hidden" />
      </label>
    </div>

    <div class="mt-4 pt-4 border-t border-border text-xs text-text-muted">
      <p>游戏版本: v2.0.0</p>
      <p>存档自动保存到浏览器本地存储</p>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { gameStore } from '../../game/store.js'

const { state, resetGame } = gameStore
const showToast = inject('showToast')

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
  { id: 'equipment', icon: '🛡️', label: '装备' },
  { id: 'shop', icon: '🛒', label: '商城' },
  { id: 'achievements', icon: '🏅', label: '成就' },
]

function handleReset() {
  if (confirm('确定要清除所有游戏存档吗？此操作不可恢复！')) {
    localStorage.removeItem('penguin-battle-save')
    window.location.reload()
  }
}

function handleExport() {
  const data = JSON.stringify(state, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'penguin-battle-save.json'
  a.click()
  URL.revokeObjectURL(url)
}

function handleImport(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      Object.assign(state, data)
      gameStore.saveGame()
      showToast('存档导入成功！', 'success')
      window.location.reload()
    } catch (err) {
      showToast('存档文件格式错误', 'error')
    }
  }
  reader.readAsText(file)
}
</script>
