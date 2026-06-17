<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
    <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <a @click.prevent="scrollTo('home')" href="#/" class="text-xl font-bold tracking-tight hover:text-primary transition-colors cursor-pointer">
        <span>&lt;</span>Portfolio<span>/&gt;</span>
      </a>

      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="item in navItems"
          :key="item.section"
          @click.prevent="scrollTo(item.section)"
          class="text-sm text-text-secondary hover:text-text-primary transition-colors relative group cursor-pointer"
        >
          {{ t(item.label) }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <button
          @click="toggleLocale"
          class="text-sm px-3 py-1 rounded bg-bg-card hover:bg-bg-card-hover transition-colors"
        >
          {{ locale === 'zh' ? 'EN' : '中文' }}
        </button>
      </div>

      <button @click="mobileOpen = !mobileOpen" class="md:hidden text-text-secondary">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <transition name="slide-down">
      <div v-if="mobileOpen" class="md:hidden glass border-t border-border">
        <div class="px-6 py-4 flex flex-col gap-4">
          <a
            v-for="item in navItems"
            :key="item.section"
            @click.prevent="scrollTo(item.section); mobileOpen = false"
            class="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {{ t(item.label) }}
          </a>
          <button
            @click="toggleLocale"
            class="text-sm px-3 py-1 rounded bg-bg-card hover:bg-bg-card-hover transition-colors text-left w-fit"
          >
            {{ locale === 'zh' ? 'English' : '中文' }}
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const mobileOpen = ref(false)

const navItems = [
  { section: 'home', label: 'nav.home' },
  { section: 'about', label: 'nav.about' },
  { section: 'projects', label: 'nav.projects' },
  { section: 'blog', label: 'nav.blog' },
  { section: 'contact', label: 'nav.contact' },
]

function scrollTo(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function toggleLocale() {
  const newLocale = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(.16, 1, .3, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
