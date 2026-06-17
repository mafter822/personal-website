<template>
  <div class="relative">
    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center justify-center relative px-6">
      <div class="text-center max-w-4xl mx-auto z-10">
        <p class="text-text-secondary text-sm mb-6 tracking-wider">
          {{ t('home.greeting') }}
        </p>
        <h1 class="text-6xl md:text-8xl font-bold mb-6 heading-italic">
          {{ getLocalizedText(p.profile.name, locale) }}
        </h1>
        <p class="text-2xl md:text-3xl text-text-secondary mb-4">
          {{ getLocalizedText(p.profile.title, locale) }}
        </p>
        <p class="text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
          {{ getLocalizedText(p.profile.description, locale) }}
        </p>
        <button
          v-if="p.sections.about"
          @click="scrollTo('about')"
          class="btn-primary inline-flex items-center gap-2"
        >
          {{ t('home.cta') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>

    <!-- About Section -->
    <section v-if="p.sections.about" id="about" class="py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold mb-12 text-center heading-italic">{{ t('about.title') }}</h2>

        <div class="card p-8 mb-8">
          <p class="text-text-secondary leading-relaxed text-lg">
            {{ getLocalizedText(p.about.bio, locale) }}
          </p>
        </div>

        <h3 class="text-2xl font-semibold mb-6">{{ t('about.skills') }}</h3>
        <div class="flex flex-wrap gap-3 mb-12">
          <span
            v-for="skill in p.about.skills"
            :key="skill"
            class="px-4 py-2 card text-sm text-text-secondary hover:text-primary transition-all cursor-default"
          >
            {{ skill }}
          </span>
        </div>

        <!-- Experiences -->
        <div v-if="p.sections.experiences && p.about.experiences && p.about.experiences.length > 0">
          <h3 class="text-2xl font-semibold mb-6">{{ t('about.experience') }}</h3>
          <div class="space-y-4">
            <div v-for="(exp, i) in p.about.experiences" :key="i" class="card p-6">
              <h4 class="text-lg font-semibold">{{ exp.title }}</h4>
              <p class="text-text-secondary text-sm mt-1">{{ exp.company }}</p>
              <p class="text-text-secondary mt-2">{{ getLocalizedText(exp.description, locale) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section v-if="p.sections.projects" id="projects" class="py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold mb-12 text-center heading-italic">{{ t('projects.title') }}</h2>

        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="(project, index) in p.projects"
            :key="project.title"
            class="card p-6 h-full group cursor-pointer"
          >
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
        </div>
      </div>
    </section>

    <!-- Game Section -->
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <router-link to="/game" class="inline-block card p-8 hover:shadow-lg transition-all group cursor-pointer">
          <div class="text-6xl mb-4 group-hover:scale-110 transition-transform">🐧</div>
          <h2 class="text-2xl font-bold mb-2 heading-italic">企鹅大乱斗</h2>
          <p class="text-text-secondary">回合制宠物对战游戏，挑战PVE关卡，收集技能和武器！</p>
          <div class="mt-4 text-primary font-medium">进入游戏 →</div>
        </router-link>
      </div>
    </section>

    <!-- Blog Section -->
    <section v-if="p.sections.blog" id="blog" class="py-20 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-4xl font-bold heading-italic">{{ t('blog.title') }}</h2>
          <router-link to="/blog" class="text-primary hover:underline">
            {{ t('blog.viewAll') }} →
          </router-link>
        </div>

        <div v-if="posts.length > 0" class="space-y-4">
          <router-link
            v-for="(post, index) in posts.slice(0, 3)"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
          >
            <div class="card p-6 group cursor-pointer mb-4">
              <time class="text-sm text-text-secondary">{{ post.date }}</time>
              <h3 class="text-lg font-semibold mt-2 group-hover:text-primary transition-colors">
                {{ post.title }}
              </h3>
              <p class="text-text-secondary text-sm mt-2">{{ post.excerpt }}</p>
            </div>
          </router-link>
        </div>

        <div v-else class="text-center text-text-secondary py-12">
          {{ t('blog.empty') }}
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section v-if="p.sections.contact" id="contact" class="py-20 px-6">
      <div class="max-w-xl mx-auto">
        <h2 class="text-4xl font-bold mb-12 text-center heading-italic">{{ t('contact.title') }}</h2>

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
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getProfile, getLocalizedText } from '../utils/profile.js'
import { fetchPosts } from '../utils/github.js'

const { t, locale } = useI18n()
const p = ref(getProfile())
const posts = ref([])

const form = ref({
  name: '',
  email: '',
  message: ''
})

onMounted(async () => {
  p.value = getProfile()

  try {
    posts.value = await fetchPosts(locale.value)
  } catch (e) {
    console.warn('Failed to load posts:', e)
  }
})

function handleSubmit() {
  const mailto = `mailto:${p.value.social.email}?subject=Message from ${form.value.name}&body=${encodeURIComponent(form.value.message)}%0A%0AFrom: ${form.value.email}`
  window.location.href = mailto
  form.value = { name: '', email: '', message: '' }
}

function scrollTo(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
