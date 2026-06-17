<template>
  <section class="max-w-6xl mx-auto px-6 py-20">
    <h1 class="text-4xl font-bold mb-12">{{ t('projects.title') }}</h1>

    <div class="grid md:grid-cols-2 gap-8">
      <div
        v-for="project in profile.projects"
        :key="project.title"
        class="group p-6 bg-surface-light rounded-xl border border-white/5 hover:border-primary/30 transition-all"
      >
        <div class="h-48 bg-surface rounded-lg mb-6 flex items-center justify-center overflow-hidden">
          <span class="text-4xl">{{ project.icon }}</span>
        </div>
        <h3 class="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {{ project.title }}
        </h3>
        <p class="text-text-secondary mb-4">{{ getLocalizedText(project.description, locale) }}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
          >
            {{ tag }}
          </span>
        </div>
        <div class="flex gap-4">
          <a :href="project.url" target="_blank" class="text-sm text-primary hover:underline">
            {{ t('projects.viewProject') }}
          </a>
          <a :href="project.code" target="_blank" class="text-sm text-text-secondary hover:text-primary hover:underline">
            {{ t('projects.viewCode') }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getProfile, getLocalizedText } from '../utils/profile.js'

const { t, locale } = useI18n()
const profile = ref(getProfile())

onMounted(() => {
  window.addEventListener('storage', () => {
    profile.value = getProfile()
  })
})
</script>
