<template>
  <section class="max-w-4xl mx-auto px-6 py-20">
    <h1 class="text-4xl font-bold mb-12">{{ t('about.title') }}</h1>

    <div class="space-y-12">
      <div class="prose prose-invert max-w-none">
        <p class="text-text-secondary leading-relaxed text-lg">{{ getLocalizedText(profile.about.bio, locale) }}</p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold mb-6 text-primary">{{ t('about.skills') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="skill in profile.about.skills"
            :key="skill"
            class="px-4 py-3 bg-surface-light rounded-lg border border-white/5 text-center text-text-secondary hover:border-primary/30 transition-colors"
          >
            {{ skill }}
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-semibold mb-6 text-primary">{{ t('about.experience') }}</h2>
        <div class="space-y-6">
          <div
            v-for="exp in profile.about.experiences"
            :key="exp.title"
            class="p-6 bg-surface-light rounded-lg border border-white/5"
          >
            <h3 class="text-lg font-semibold">{{ exp.title }}</h3>
            <p class="text-primary text-sm mt-1">{{ exp.company }}</p>
            <p class="text-text-secondary text-sm mt-2">{{ getLocalizedText(exp.description, locale) }}</p>
          </div>
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
