<template>
  <div class="space-y-4">
    <div class="card p-4">
      <h3 class="text-lg font-semibold mb-2">👥 好友列表</h3>
      <p class="text-sm text-text-secondary">与好友对战提升好感度，获得经验加成</p>
    </div>

    <div class="space-y-3">
      <div
        v-for="friend in friends"
        :key="friend.id"
        class="card p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-bg-card flex items-center justify-center text-2xl">
            {{ friend.level >= 40 ? '👑' : friend.level >= 25 ? '⭐' : friend.level >= 15 ? '🌟' : '🐧' }}
          </div>
          <div>
            <div class="font-medium">{{ friend.name }}</div>
            <div class="text-xs text-text-secondary">Lv.{{ friend.level }} · {{ friend.weapon }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs text-text-muted mb-1">
            {{ getIntimacyName(friend.intimacy) }} · {{ friend.intimacy }}/1000
          </div>
          <div class="h-2 w-24 bg-bg-card rounded-full overflow-hidden mb-2">
            <div class="h-full bg-primary rounded-full" :style="{ width: Math.min(friend.intimacy / 10, 100) + '%' }"></div>
          </div>
          <button
            @click="battleFriend(friend)"
            class="px-4 py-1.5 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
            :disabled="state.player.stamina < 10"
          >
            {{ state.player.stamina >= 10 ? '对战 (-10体力)' : '体力不足' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="friends.length === 0" class="text-center text-text-secondary py-12">
      <p class="text-4xl mb-4">👥</p>
      <p>暂无好友</p>
      <p class="text-sm mt-2">提升等级解锁更多好友</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameStore } from '../../game/store.js'
import { getAvailableFriends, getIntimacyLevel } from '../../game/data/friends.js'

const emit = defineEmits(['start-battle'])
const { state, consumeStamina } = gameStore

const friends = computed(() => {
  const available = getAvailableFriends(state.player.level)
  return available.map(f => {
    const saved = state.friends?.find(sf => sf.id === f.id)
    return { ...f, intimacy: saved?.intimacy || 0 }
  })
})

function getIntimacyName(intimacy) {
  return getIntimacyLevel(intimacy).name
}

function battleFriend(friend) {
  if (state.player.stamina < 10) return
  consumeStamina(10)
  emit('start-battle', {
    enemy: {
      ...friend,
      maxHealth: friend.health,
      skills: [],
      rewards: { exp: 45 + (friend.level - state.player.level) * 3, spirit: 2 },
    },
    stageId: `friend_${friend.id}`,
    isFriend: true,
    friendId: friend.id,
  })
}
</script>
