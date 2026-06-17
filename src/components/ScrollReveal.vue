<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  delay: {
    type: Number,
    default: 0
  }
})
</script>
