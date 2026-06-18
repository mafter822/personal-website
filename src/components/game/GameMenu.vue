<template>
  <div class="card p-4">
    <h3 class="font-semibold mb-4">⚙️ 游戏设置</h3>

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
      <p>游戏版本: v1.0.0</p>
      <p>存档自动保存到浏览器本地存储</p>
    </div>
  </div>
</template>

<script setup>
import { gameStore } from '../../game/store.js'

const { resetGame, state } = gameStore

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
      alert('存档导入成功！')
      window.location.reload()
    } catch (err) {
      alert('存档文件格式错误')
    }
  }
  reader.readAsText(file)
}
</script>
