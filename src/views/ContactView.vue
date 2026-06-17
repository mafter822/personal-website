<template>
  <section class="max-w-4xl mx-auto px-6 py-20">
    <h1 class="text-4xl font-bold mb-12">{{ t('contact.title') }}</h1>

    <form @submit.prevent="handleSubmit" class="max-w-xl space-y-6">
      <div>
        <label class="block text-sm text-text-secondary mb-2">{{ t('contact.name') }}</label>
        <input
          v-model="form.name"
          type="text"
          :placeholder="t('contact.namePlaceholder')"
          class="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
          required
        />
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-2">{{ t('contact.email') }}</label>
        <input
          v-model="form.email"
          type="email"
          :placeholder="t('contact.emailPlaceholder')"
          class="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
          required
        />
      </div>

      <div>
        <label class="block text-sm text-text-secondary mb-2">{{ t('contact.message') }}</label>
        <textarea
          v-model="form.message"
          :placeholder="t('contact.messagePlaceholder')"
          rows="5"
          class="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-primary hover:bg-primary-dark rounded-lg text-white font-medium transition-colors"
      >
        {{ t('contact.send') }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = reactive({
  name: '',
  email: '',
  message: '',
})

function handleSubmit() {
  const mailto = `mailto:your@email.com?subject=Message from ${form.name}&body=${encodeURIComponent(form.message)}%0A%0AFrom: ${form.email}`
  window.location.href = mailto
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>
