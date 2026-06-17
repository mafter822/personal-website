import { ref, onMounted, onUnmounted } from 'vue'

export function useParticles(canvasRef, options = {}) {
  const {
    particleCount = 100,
    speed = 0.5,
    maxSize = 2,
    colors = ['#ffffff', '#00d4ff', '#a855f7']
  } = options

  const particles = ref([])
  let animationId = null

  class Particle {
    constructor(canvas) {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * maxSize + 0.5
      this.speedX = (Math.random() - 0.5) * speed
      this.speedY = (Math.random() - 0.5) * speed
      this.color = colors[Math.floor(Math.random() * colors.length)]
      this.opacity = Math.random() * 0.8 + 0.2
      this.twinkleSpeed = Math.random() * 0.02 + 0.01
      this.twinkleOffset = Math.random() * Math.PI * 2
    }

    update(time) {
      this.x += this.speedX
      this.y += this.speedY
      this.opacity = 0.3 + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.3
    }

    draw(ctx) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.globalAlpha = this.opacity
      ctx.fill()
      ctx.globalAlpha = 1
    }
  }

  function init(canvas) {
    particles.value = Array.from({ length: particleCount }, () => new Particle(canvas))
  }

  function animate(canvas, ctx, time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.value.forEach(particle => {
      particle.update(time)
      particle.draw(ctx)

      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0
    })

    animationId = requestAnimationFrame((t) => animate(canvas, ctx, t))
  }

  function start() {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    init(canvas)
    animate(canvas, ctx, 0)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init(canvas)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }

  onMounted(start)
  onUnmounted(stop)

  return { particles }
}
