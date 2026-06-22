<template>
  <div class="relative z-10 min-h-screen">
    <AppHeader v-if="route.name !== 'evolve'" />
    <main :class="route.name === 'evolve' ? '' : 'pt-16'">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter v-if="route.name !== 'evolve'" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
</script>
