<template>
  <div class="min-h-screen bg-bg">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold heading-italic">🧬 Evolve</h1>
        <router-link to="/" class="text-sm text-text-secondary hover:text-primary transition-colors">
          ← 返回首页
        </router-link>
      </div>
      <div class="rounded-lg overflow-hidden border border-border" style="height: calc(100vh - 120px);">
        <iframe
          v-if="loaded"
          :src="evolveUrl"
          class="w-full h-full border-0"
          allow="fullscreen"
          @load="loaded = true"
        ></iframe>
        <div v-else class="w-full h-full flex items-center justify-center bg-bg-card">
          <div class="text-center">
            <div class="text-4xl mb-4 animate-pulse">🧬</div>
            <p class="text-text-secondary">正在加载 Evolve...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loaded = ref(false)
const evolveUrl = 'https://mafter822.github.io/Evolve/'

onMounted(() => {
  const img = new Image()
  img.onload = () => { loaded.value = true }
  img.onerror = () => { loaded.value = true }
  img.src = evolveUrl
})
</script>
