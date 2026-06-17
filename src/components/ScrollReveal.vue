<template>
  <div
    ref="el"
    class="reveal"
    :class="[animationClass, { active: isVisible }]"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  animation: {
    type: String,
    default: 'fade-up',
    validator: (v) => ['fade-up', 'fade-left', 'fade-right', 'scale'].includes(v)
  },
  delay: {
    type: Number,
    default: 0
  }
})

const el = ref(null)
const isVisible = ref(false)
let observer = null

const animationClass = {
  'fade-up': '',
  'fade-left': 'reveal-left',
  'fade-right': 'reveal-right',
  'scale': 'reveal-scale'
}[props.animation]

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  
  if (el.value) {
    observer.observe(el.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.reveal-left {
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-left.active {
  opacity: 1;
  transform: translateX(0);
}

.reveal-right {
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-right.active {
  opacity: 1;
  transform: translateX(0);
}

.reveal-scale {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-scale.active {
  opacity: 1;
  transform: scale(1);
}
</style>
