<template>
  <div v-if="battle" class="space-y-4">
    <!-- Enemy Info -->
    <div class="card p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">👹</div>
          <div>
            <div class="font-semibold">{{ battle.enemy.name }}</div>
            <div class="text-xs text-text-secondary">Lv.{{ battle.enemy.level }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-text-secondary">❤️ {{ Math.max(0, battle.enemy.health) }}/{{ battle.enemy.maxHealth }}</div>
          <div class="h-2 w-32 bg-bg-card rounded-full overflow-hidden mt-1">
            <div class="h-full bg-red-500 rounded-full transition-all" :style="{ width: enemyHpPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Battle Field -->
    <div class="card p-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-bg-card/50 pointer-events-none"></div>

      <!-- Player -->
      <div class="flex justify-center mb-6 relative z-10">
        <div class="text-center" :class="{ 'animate-shake': playerShaking }">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl mx-auto mb-2">
            🐧
          </div>
          <div class="text-sm font-medium">{{ battle.player.name }}</div>
          <div class="text-xs text-text-secondary">Lv.{{ battle.player.level }}</div>
          <div class="h-2 w-24 bg-bg-card rounded-full overflow-hidden mt-1 mx-auto">
            <div class="h-full bg-green-500 rounded-full transition-all" :style="{ width: playerHpPercent + '%' }"></div>
          </div>
          <div class="text-xs mt-1">❤️ {{ Math.max(0, currentHp) }}/{{ maxHp }}</div>
        </div>
      </div>

      <!-- VS -->
      <div class="text-center text-2xl font-bold text-text-muted my-4 relative z-10">VS</div>

      <!-- Enemy -->
      <div class="flex justify-center relative z-10">
        <div class="text-center" :class="{ 'animate-shake': enemyShaking }">
          <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-4xl mx-auto mb-2">
            👹
          </div>
          <div class="text-sm font-medium">{{ battle.enemy.name }}</div>
          <div class="text-xs text-text-secondary">Lv.{{ battle.enemy.level }}</div>
        </div>
      </div>

      <!-- Damage Numbers -->
      <transition-group name="float" tag="div" class="absolute inset-0 pointer-events-none">
        <div
          v-for="dmg in damageNumbers"
          :key="dmg.id"
          class="absolute text-2xl font-bold animate-float"
          :class="dmg.type === 'heal' ? 'text-green-500' : 'text-red-500'"
          :style="{ left: dmg.x + 'px', top: dmg.y + 'px' }"
        >
          {{ dmg.type === 'heal' ? '+' : '-' }}{{ dmg.value }}
        </div>
      </transition-group>
    </div>

    <!-- Turn Info -->
    <div class="text-center text-sm text-text-secondary">
      第 {{ battle.turn }} 回合
      <span v-if="battle.player.isStunned" class="text-amber-500 ml-2">（被黏住）</span>
      <span v-if="battle.player.restTurns > 0" class="text-amber-500 ml-2">（休息中）</span>
    </div>

    <!-- Battle Log -->
    <div class="card p-4 max-h-48 overflow-y-auto" v-if="battle.log.length > 0">
      <div
        v-for="(entry, i) in recentLogs"
        :key="i"
        class="text-xs py-1 border-b border-border last:border-0"
        :class="logColor(entry.type)"
      >
        [{{ entry.turn }}] {{ entry.message }}
      </div>
    </div>

    <!-- Result -->
    <div v-if="battle.isOver" class="card p-6 text-center">
      <div class="text-4xl mb-4">{{ battle.winner === 'player' ? '🎉' : '😢' }}</div>
      <h3 class="text-xl font-bold mb-2">
        {{ battle.winner === 'player' ? '战斗胜利！' : '战斗失败...' }}
      </h3>
      <div v-if="battle.rewards" class="text-text-secondary mb-4">
        获得: {{ battle.rewards.exp }} 经验, {{ battle.rewards.spirit }} 精魄
      </div>
      <button @click="$emit('battle-end')" class="btn-primary">
        返回
      </button>
    </div>

    <!-- Action Panel -->
    <div v-if="!battle.isOver" class="card p-4">
      <div class="text-sm text-text-secondary mb-3">选择行动：</div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="skill in availableSkills"
          :key="skill.id"
          @click="useSkill(skill.id)"
          class="px-3 py-2 rounded-lg text-sm text-left transition-all border"
          :class="canUseSkill(skill)
            ? 'border-border hover:border-primary hover:bg-primary/5'
            : 'border-transparent bg-bg-card text-text-muted cursor-not-allowed'"
          :disabled="!canUseSkill(skill)"
        >
          <div class="font-medium">{{ skill.icon }} {{ skill.name }}</div>
          <div class="text-xs text-text-muted mt-0.5">{{ skill.desc }}</div>
        </button>
      </div>
      <button
        @click="useSkill(null)"
        class="w-full mt-3 px-4 py-2 rounded-lg text-sm border border-border hover:border-primary transition-colors"
      >
        ⚔️ 普通攻击
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gameStore } from '../../game/store.js'
import { BattleEngine } from '../../game/engine.js'
import { SKILLS } from '../../game/data/skills.js'

const props = defineProps({
  enemy: Object,
  stageId: String,
})

const emit = defineEmits(['battle-end'])

const { state, getCombatStats, getEquippedWeapon, addExp, addSpirit, addWin, addLoss, consumeStamina } = gameStore

const battle = ref(null)
const playerShaking = ref(false)
const enemyShaking = ref(false)
const damageNumbers = ref([])
let dmgId = 0

const maxHp = computed(() => getCombatStats().maxHealth)
const currentHp = computed(() => battle.value ? Math.max(0, battle.value.player.health) : 0)
const playerHpPercent = computed(() => (currentHp.value / maxHp.value) * 100)
const enemyHpPercent = computed(() => {
  if (!battle.value) return 0
  return (Math.max(0, battle.value.enemy.health) / battle.value.enemy.maxHealth) * 100
})

const recentLogs = computed(() => {
  if (!battle.value) return []
  return battle.value.log.slice(-10)
})

const availableSkills = computed(() => {
  if (!battle.value) return []
  return state.skills
    .map(s => SKILLS.find(sk => sk.id === s.id))
    .filter(s => s && (s.category === 'attack' || s.category === 'control' || s.category === 'special'))
})

function canUseSkill(skill) {
  if (!battle.value) return false
  if (battle.value.player.isStunned || battle.value.player.restTurns > 0) return false
  const owned = state.skills.find(s => s.id === skill.id)
  return owned && owned.level > 0
}

function useSkill(skillId) {
  if (!battle.value || battle.value.isOver) return

  const isEnemyTurn = battle.value.turn % 2 === 0
  battle.value.playerAttack(skillId)

  if (skillId) {
    const skill = SKILLS.find(s => s.id === skillId)
    if (skill) showDamageNumber(skill.category === 'control' || skill.category === 'special' ? 'control' : 'attack')
  } else {
    showDamageNumber('attack')
  }

  triggerShake('enemy')

  setTimeout(() => {
    if (!battle.value.isOver) {
      triggerShake('player')
      showDamageNumber('enemy_attack')
    }

    if (battle.value.isOver) {
      if (battle.value.winner === 'player') {
        addExp(battle.value.rewards.exp)
        addSpirit(battle.value.rewards.spirit)
        addWin()
      } else {
        addLoss()
      }
    }
  }, 300)
}

function showDamageNumber(type) {
  const x = 100 + Math.random() * 200
  const y = 100 + Math.random() * 100
  const value = Math.floor(Math.random() * 50) + 10
  damageNumbers.value.push({ id: dmgId++, type, x, y, value })
  setTimeout(() => {
    damageNumbers.value.shift()
  }, 1000)
}

function triggerShake(who) {
  if (who === 'player') {
    playerShaking.value = true
    setTimeout(() => playerShaking.value = false, 300)
  } else {
    enemyShaking.value = true
    setTimeout(() => enemyShaking.value = false, 300)
  }
}

function logColor(type) {
  const map = {
    attack: 'text-primary',
    enemy_attack: 'text-red-500',
    crit: 'text-amber-500',
    combo: 'text-amber-500',
    dodge: 'text-green-500',
    block: 'text-blue-500',
    counter: 'text-purple-500',
    rebound: 'text-purple-500',
    heal: 'text-green-500',
    control: 'text-purple-500',
    buff: 'text-blue-500',
    special: 'text-pink-500',
    stun: 'text-amber-500',
    ignore: 'text-amber-500',
    rest: 'text-amber-500',
    win: 'text-green-600 font-bold',
    lose: 'text-red-600 font-bold',
    battle_start: 'text-text-primary font-bold',
  }
  return map[type] || 'text-text-secondary'
}

onMounted(() => {
  const stats = getCombatStats()
  const weapon = getEquippedWeapon()
  battle.value = new BattleEngine(
    {
      ...state.player,
      maxHealth: stats.maxHealth,
      strength: stats.strength,
      agility: stats.agility,
      speed: stats.speed,
    },
    props.enemy,
    state.skills,
    weapon
  )
  battle.value.start()
})
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake { animation: shake 0.3s ease-in-out; }

@keyframes float-up {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-40px); }
}
.animate-float { animation: float-up 1s ease-out forwards; }
</style>
