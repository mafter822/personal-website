<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 pointer-events-none z-0"
    style="opacity: 0.6"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useParticles } from '../composables/useParticles.js'

const canvasRef = ref(null)

useParticles(canvasRef, {
  particleCount: 150,
  speed: 0.3,
  maxSize: 2,
  colors: ['#ffffff', '#00d4ff', '#a855f7', '#fbbf24']
})
</script>
