<template>
  <section class="max-w-6xl mx-auto px-6 py-20">
    <h1 class="text-4xl font-bold mb-12">{{ t('gallery.title') }}</h1>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="(image, index) in profile.gallery"
        :key="index"
        class="aspect-square bg-surface-light rounded-xl overflow-hidden cursor-pointer group border border-white/5 hover:border-primary/30 transition-all"
        @click="openLightbox(index)"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
    </div>

    <teleport to="body">
      <transition name="fade">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
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
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getProfile } from '../utils/profile.js'

const { t } = useI18n()
const profile = ref(getProfile())
const lightboxOpen = ref(false)
const currentIndex = ref(0)

onMounted(() => {
  window.addEventListener('storage', () => {
    profile.value = getProfile()
  })
})

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
