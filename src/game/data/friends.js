export const NPC_FRIENDS = [
  { id: 'friend_1', name: '企鹅大魔王', level: 10, strength: 30, agility: 20, speed: 25, health: 180, weapon: '棒球棒', intimacy: 0 },
  { id: 'friend_2', name: '冰原游侠', level: 15, strength: 45, agility: 35, speed: 40, health: 300, weapon: '狂魔镰', intimacy: 0 },
  { id: 'friend_3', name: '极地战士', level: 20, strength: 65, agility: 50, speed: 55, health: 450, weapon: '铁锤', intimacy: 0 },
  { id: 'friend_4', name: '雪山猎手', level: 25, strength: 85, agility: 65, speed: 70, health: 600, weapon: '三叉戟', intimacy: 0 },
  { id: 'friend_5', name: '冰霜领主', level: 30, strength: 110, agility: 80, speed: 85, health: 800, weapon: '真·充气锤子', intimacy: 0 },
  { id: 'friend_6', name: '极光守护者', level: 35, strength: 140, agility: 100, speed: 100, health: 1000, weapon: '真·三叉戟', intimacy: 0 },
  { id: 'friend_7', name: '北极熊王', level: 40, strength: 175, agility: 120, speed: 120, health: 1300, weapon: '真·开山斧', intimacy: 0 },
  { id: 'friend_8', name: '冰龙长老', level: 45, strength: 210, agility: 140, speed: 140, health: 1600, weapon: '真·三叉戟', intimacy: 0 },
]

export const INTIMACY_LEVELS = [
  { min: 0, max: 100, name: '陌生人', bonus: 0 },
  { min: 101, max: 300, name: '认识', bonus: 0.05 },
  { min: 301, max: 600, name: '朋友', bonus: 0.10 },
  { min: 601, max: 1000, name: '好友', bonus: 0.15 },
  { min: 1001, max: 99999, name: '挚友', bonus: 0.20 },
]

export function getIntimacyLevel(intimacy) {
  return INTIMACY_LEVELS.find(l => intimacy >= l.min && intimacy <= l.max) || INTIMACY_LEVELS[0]
}

export function getIntimacyBonus(intimacy) {
  return getIntimacyLevel(intimacy).bonus
}

export function getAvailableFriends(playerLevel) {
  return NPC_FRIENDS.filter(f => f.level <= playerLevel + 5)
}
