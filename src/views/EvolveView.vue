<template>
  <div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:100;background:#000;">
    <iframe
      :src="evolveUrl"
      style="width:100%;height:100%;border:none;"
      allow="fullscreen"
    ></iframe>
  </div>
</template>

<script setup>
const evolveUrl = `${import.meta.env.BASE_URL}evolve/index.html`
</script>
