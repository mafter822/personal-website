<template>
  <span class="inline-block">
    {{ displayText }}<span class="animate-pulse">|</span>
  </span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  texts: {
    type: Array,
    required: true
  },
  speed: {
    type: Number,
    default: 100
  },
  deleteSpeed: {
    type: Number,
    default: 50
  },
  pauseDuration: {
    type: Number,
    default: 2000
  }
})

const displayText = ref('')
let currentIndex = 0
let isDeleting = false
let timeout = null

function type() {
  const currentText = props.texts[currentIndex]
  
  if (isDeleting) {
    displayText.value = currentText.substring(0, displayText.value.length - 1)
  } else {
    displayText.value = currentText.substring(0, displayText.value.length + 1)
  }

  let nextDelay = isDeleting ? props.deleteSpeed : props.speed

  if (!isDeleting && displayText.value === currentText) {
    nextDelay = props.pauseDuration
    isDeleting = true
  } else if (isDeleting && displayText.value === '') {
    isDeleting = false
    currentIndex = (currentIndex + 1) % props.texts.length
    nextDelay = props.speed
  }

  timeout = setTimeout(type, nextDelay)
}

onMounted(() => {
  type()
})

watch(() => props.texts, () => {
  if (timeout) clearTimeout(timeout)
  currentIndex = 0
  isDeleting = false
  displayText.value = ''
  type()
})
</script>
