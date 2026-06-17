<template>
  <section class="max-w-4xl mx-auto px-6 py-20">
    <h1 class="text-4xl font-bold mb-12">{{ t('blog.title') }}</h1>

    <div v-if="loading" class="text-center text-text-secondary py-20">
      {{ t('blog.loading') }}
    </div>

    <div v-else-if="posts.length === 0" class="text-center text-text-secondary py-20">
      {{ t('blog.empty') }}
    </div>

    <div v-else class="space-y-8">
      <router-link
        v-for="post in posts"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        class="block p-6 bg-surface-light rounded-xl border border-white/5 hover:border-primary/30 transition-all group"
      >
        <time class="text-sm text-text-secondary">{{ post.date }}</time>
        <h2 class="text-xl font-semibold mt-2 group-hover:text-primary transition-colors">
          {{ post.title }}
        </h2>
        <p class="text-text-secondary mt-2">{{ post.excerpt }}</p>
        <span class="inline-block mt-4 text-sm text-primary">{{ t('blog.readMore') }} →</span>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchPosts } from '../utils/github.js'

const { t, locale } = useI18n()
const posts = ref([])
const loading = ref(true)

async function loadPosts() {
  loading.value = true
  try {
    posts.value = await fetchPosts(locale.value)
  } catch (e) {
    console.error('Failed to load posts:', e)
    posts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadPosts)
watch(locale, loadPosts)
</script>
