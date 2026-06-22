<template>
  <section class="max-w-4xl mx-auto px-6 py-20">
    <div v-if="loading" class="text-center text-text-secondary py-20">
      {{ t('blog.loading') }}
    </div>

    <article v-else-if="post" class="prose prose-invert prose-lg max-w-none">
      <router-link :to="`/blog`" class="text-primary hover:underline text-sm not-prose">
        {{ t('blog.backToList') }}
      </router-link>
      <h1 class="mt-8">{{ post.title }}</h1>
      <time class="text-text-secondary">{{ post.date }}</time>
      <div v-html="post.content" class="mt-8"></div>
    </article>

    <div v-else class="text-center text-text-secondary py-20">
      {{ t('blog.empty') }}
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { fetchPost } from '../utils/github.js'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const route = useRoute()
const { t, locale } = useI18n()
const post = ref(null)
const loading = ref(true)

async function loadPost() {
  loading.value = true
  post.value = null
  try {
    const data = await fetchPost(route.params.slug, locale.value)
    if (data) {
      post.value = {
        ...data,
        content: DOMPurify.sanitize(marked(data.content)),
      }
    }
  } catch (e) {
    console.error('Failed to load post:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadPost)
watch(() => route.params.slug, loadPost)
</script>
