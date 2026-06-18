export const TOWER_CONFIG = {
  maxFloor: 100,
  dailyAttempts: 6,
  staminaCost: 0,
  sweepUnlockFloor: 10,
}

export function getFloorEnemy(floor) {
  return {
    name: `塔层守卫 Lv.${floor * 2}`,
    level: floor * 2,
    strength: 15 + floor * 3,
    agility: 10 + floor * 2,
    speed: 12 + Math.floor(floor * 2.5),
    health: 100 + floor * 25,
    weapon: getFloorWeapon(floor),
    skills: [],
    rewards: getFloorRewards(floor),
  }
}

function getFloorWeapon(floor) {
  const weapons = [
    { id: 'tower_brick', name: '塔砖', baseDamage: [8, 15], quality: 'common', enhanceLevel: 0 },
    { id: 'tower_sword', name: '守卫剑', baseDamage: [12, 22], quality: 'uncommon', enhanceLevel: 0 },
    { id: 'tower_spear', name: '守卫枪', baseDamage: [18, 32], quality: 'rare', enhanceLevel: 0 },
    { id: 'tower_axe', name: '守卫斧', baseDamage: [25, 45], quality: 'epic', enhanceLevel: 0 },
  ]
  const index = Math.min(Math.floor(floor / 25), weapons.length - 1)
  return weapons[index]
}

function getFloorRewards(floor) {
  let exp = 30 * floor
  let spirit = floor

  if (floor > 30) {
    exp = 120 * floor
    spirit = 5 * floor
  } else if (floor > 20) {
    exp = 80 * floor
    spirit = 3 * floor
  } else if (floor > 10) {
    exp = 50 * floor
    spirit = 2 * floor
  }

  return { exp, spirit }
}

export function getSweepRewards(floor, count) {
  const baseRewards = getFloorRewards(floor)
  return {
    exp: baseRewards.exp * count,
    spirit: baseRewards.spirit * count,
  }
}
