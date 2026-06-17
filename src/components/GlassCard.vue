<template>
  <div
    class="glass-card p-6 transition-all duration-300"
    :class="[
      hoverScale && 'hover:scale-[1.02]',
      hoverGlow && 'hover:shadow-[0_0_40px_rgba(0,212,255,0.15)]',
      className
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  hoverScale: {
    type: Boolean,
    default: true
  },
  hoverGlow: {
    type: Boolean,
    default: true
  },
  className: {
    type: String,
    default: ''
  }
})
</script>
