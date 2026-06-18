export const REALMS = [
  { id: 'realm_1', name: '练气', level: 30, bonus: { strength: 5, agility: 5, speed: 5, maxHealth: 50 }, icon: '🌱', description: '初窥修炼之道' },
  { id: 'realm_2', name: '筑基', level: 40, bonus: { strength: 10, agility: 10, speed: 10, maxHealth: 100 }, icon: '🌿', description: '奠定修炼根基' },
  { id: 'realm_3', name: '金丹', level: 50, bonus: { strength: 20, agility: 20, speed: 20, maxHealth: 200 }, icon: '🔮', description: '凝聚金丹大道' },
  { id: 'realm_4', name: '元婴', level: 60, bonus: { strength: 35, agility: 35, speed: 35, maxHealth: 350 }, icon: '✨', description: '元婴出窍' },
  { id: 'realm_5', name: '化神', level: 70, bonus: { strength: 50, agility: 50, speed: 50, maxHealth: 500 }, icon: '⭐', description: '化神入圣' },
  { id: 'realm_6', name: '渡劫', level: 80, bonus: { strength: 70, agility: 70, speed: 70, maxHealth: 700 }, icon: '🌟', description: '渡劫飞升' },
  { id: 'realm_7', name: '大乘', level: 90, bonus: { strength: 100, agility: 100, speed: 100, maxHealth: 1000 }, icon: '💫', description: '大乘圆满' },
  { id: 'realm_8', name: '飞升', level: 100, bonus: { strength: 150, agility: 150, speed: 150, maxHealth: 1500 }, icon: '👑', description: '飞升成仙' },
]

export function getCurrentRealm(level) {
  for (let i = REALMS.length - 1; i >= 0; i--) {
    if (level >= REALMS[i].level) {
      return REALMS[i]
    }
  }
  return null
}

export function getNextRealm(level) {
  for (let i = 0; i < REALMS.length; i++) {
    if (level < REALMS[i].level) {
      return REALMS[i]
    }
  }
  return null
}

export function getRealmBonus(realmId) {
  const realm = REALMS.find(r => r.id === realmId)
  return realm ? realm.bonus : {}
}
