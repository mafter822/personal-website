<template>
  <div class="relative">
    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center justify-center relative px-6">
      <div class="text-center max-w-4xl mx-auto z-10">
        <p class="text-text-secondary text-sm mb-6 tracking-wider">
          {{ t('home.greeting') }}
        </p>
        <h1 class="text-6xl md:text-8xl font-bold mb-6 heading-italic">
          {{ getLocalizedText(profile.profile.name, locale) }}
        </h1>
        <p class="text-2xl md:text-3xl text-text-secondary mb-4">
          {{ getLocalizedText(profile.profile.title, locale) }}
        </p>
        <p class="text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
          {{ getLocalizedText(profile.profile.description, locale) }}
        </p>
        <a
          href="#about"
          class="btn-primary inline-flex items-center gap-2"
        >
          {{ t('home.cta') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="min-h-screen py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 class="text-4xl font-bold mb-12 text-center heading-italic">{{ t('about.title') }}</h2>
        </ScrollReveal>
        
        <ScrollReveal :delay="100">
          <div class="card p-8 mb-8">
            <p class="text-text-secondary leading-relaxed text-lg">
              {{ getLocalizedText(profile.about.bio, locale) }}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal :delay="200">
          <h3 class="text-2xl font-semibold mb-6">{{ t('about.skills') }}</h3>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="skill in profile.about.skills"
              :key="skill"
              class="px-4 py-2 card text-sm text-text-secondary hover:text-primary transition-all cursor-default"
            >
              {{ skill }}
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="min-h-screen py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 class="text-4xl font-bold mb-12 text-center heading-italic">{{ t('projects.title') }}</h2>
        </ScrollReveal>
        
        <div class="grid md:grid-cols-2 gap-8">
          <ScrollReveal
            v-for="(project, index) in profile.projects"
            :key="project.title"
            :delay="index * 100"
          >
            <div class="card p-6 h-full group cursor-pointer">
              <div class="h-40 bg-bg-card rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <span class="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {{ project.icon }}
                </span>
              </div>
              <h3 class="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {{ project.title }}
              </h3>
              <p class="text-text-secondary text-sm mb-4">
                {{ getLocalizedText(project.description, locale) }}
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="text-xs px-2 py-1 bg-bg-card text-text-secondary rounded"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="flex gap-4 text-sm">
                <a :href="project.url" target="_blank" class="text-primary hover:underline">
                  {{ t('projects.viewProject') }}
                </a>
                <a :href="project.code" target="_blank" class="text-text-secondary hover:text-primary hover:underline">
                  {{ t('projects.viewCode') }}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- Blog Section -->
    <section id="blog" class="py-20 px-6">
      <div class="max-w-4xl mx-auto">
        <ScrollReveal>
          <div class="flex items-center justify-between mb-12">
            <h2 class="text-4xl font-bold heading-italic">{{ t('blog.title') }}</h2>
            <router-link to="/blog" class="text-primary hover:underline">
              {{ t('blog.viewAll') }} →
            </router-link>
          </div>
        </ScrollReveal>

        <div v-if="posts.length > 0" class="space-y-4">
          <ScrollReveal
            v-for="(post, index) in posts.slice(0, 3)"
            :key="post.slug"
            :delay="index * 100"
          >
            <router-link :to="`/blog/${post.slug}`">
              <div class="card p-6 group cursor-pointer">
                <time class="text-sm text-text-secondary">{{ post.date }}</time>
                <h3 class="text-lg font-semibold mt-2 group-hover:text-primary transition-colors">
                  {{ post.title }}
                </h3>
                <p class="text-text-secondary text-sm mt-2">{{ post.excerpt }}</p>
              </div>
            </router-link>
          </ScrollReveal>
        </div>

        <div v-else class="text-center text-text-secondary py-12">
          {{ t('blog.empty') }}
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 class="text-4xl font-bold mb-12 text-center heading-italic">{{ t('gallery.title') }}</h2>
        </ScrollReveal>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ScrollReveal
            v-for="(image, index) in profile.gallery"
            :key="index"
            :delay="index * 50"
          >
            <div
              class="aspect-square card overflow-hidden cursor-pointer group"
              @click="openLightbox(index)"
            >
              <img
                :src="image.src"
                :alt="image.alt"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 px-6">
      <div class="max-w-xl mx-auto">
        <ScrollReveal>
          <h2 class="text-4xl font-bold mb-12 text-center heading-italic">{{ t('contact.title') }}</h2>
        </ScrollReveal>
        
        <ScrollReveal :delay="100">
          <div class="card p-8">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label class="block text-sm text-text-secondary mb-2">{{ t('contact.name') }}</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-2">{{ t('contact.email') }}</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-sm text-text-secondary mb-2">{{ t('contact.message') }}</label>
                <textarea
                  v-model="form.message"
                  rows="4"
                  class="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                class="btn-primary w-full"
              >
                {{ t('contact.send') }}
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- Lightbox -->
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          @click.self="closeLightbox"
        >
          <button
            @click="closeLightbox"
            class="absolute top-6 right-6 text-white/70 hover:text-white"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            @click="prevImage"
            class="absolute left-4 text-white/70 hover:text-white"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            :src="profile.gallery[currentIndex].src"
            :alt="profile.gallery[currentIndex].alt"
            class="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
          <button
            @click="nextImage"
            class="absolute right-4 text-white/70 hover:text-white"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getProfile, getLocalizedText } from '../utils/profile.js'
import { fetchPosts } from '../utils/github.js'
import ScrollReveal from '../components/ScrollReveal.vue'

const { t, locale } = useI18n()
const profile = ref(getProfile())
const posts = ref([])
const lightboxOpen = ref(false)
const currentIndex = ref(0)

const form = ref({
  name: '',
  email: '',
  message: ''
})

onMounted(async () => {
  try {
    posts.value = await fetchPosts(locale.value)
  } catch (e) {
    console.warn('Failed to load posts:', e)
  }
  
  window.addEventListener('storage', () => {
    profile.value = getProfile()
  })
})

function handleSubmit() {
  const mailto = `mailto:${profile.value.social.email}?subject=Message from ${form.value.name}&body=${encodeURIComponent(form.value.message)}%0A%0AFrom: ${form.value.email}`
  window.location.href = mailto
  form.value = { name: '', email: '', message: '' }
}

function openLightbox(index) {
  currentIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function prevImage() {
  currentIndex.value = (currentIndex.value - 1 + profile.value.gallery.length) % profile.value.gallery.length
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % profile.value.gallery.length
}
</script>
