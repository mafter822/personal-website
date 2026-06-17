<template>
  <div class="text-center py-20 text-text-secondary">
    <p class="text-lg">BattleScene - 战斗场景</p>
    <p class="text-sm mt-2">Task 6 将实现此组件</p>
  </div>
</template>

<script setup>
defineProps({
  enemy: Object,
  stageId: String,
})

defineEmits(['battle-end'])
</script>
