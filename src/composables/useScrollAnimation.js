import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px'
  } = options

  const observedElements = ref(new Set())
  let observer = null

  function observe(el) {
    if (observer && el) {
      observer.observe(el)
      observedElements.value.add(el)
    }
  }

  function unobserve(el) {
    if (observer && el) {
      observer.unobserve(el)
      observedElements.value.delete(el)
    }
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      { threshold, rootMargin }
    )
  })

  onUnmounted(() => {
    if (observer) {
      observedElements.value.forEach(el => observer.unobserve(el))
      observer.disconnect()
    }
  })

  return { observe, unobserve }
}
