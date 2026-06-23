export const SPECIAL_ENCOUNTERS = [
  {
    streak: 3,
    name: '精英企鹅',
    title: '精英',
    color: '#f97316',
    levelBonus: 5,
    statsMultiplier: 1.3,
    rewardMultiplier: 2,
    desc: '连胜3场，遭遇精英对手！',
  },
  {
    streak: 5,
    name: '传说企鹅',
    title: '传说',
    color: '#a855f7',
    levelBonus: 10,
    statsMultiplier: 1.6,
    rewardMultiplier: 3,
    desc: '连胜5场，传说级对手出现！',
  },
  {
    streak: 7,
    name: '神话企鹅',
    title: '神话',
    color: '#ec4899',
    levelBonus: 15,
    statsMultiplier: 2.0,
    rewardMultiplier: 5,
    desc: '连胜7场，神话级对手降临！',
  },
  {
    streak: 10,
    name: '远古企鹅',
    title: '远古',
    color: '#eab308',
    levelBonus: 20,
    statsMultiplier: 2.5,
    rewardMultiplier: 8,
    desc: '连胜10场，远古级对手现身！',
  },
]

export const STREAK_REWARDS = {
  3: { expBonus: 0.5, spiritBonus: 1 },
  5: { expBonus: 1.0, spiritBonus: 2 },
  7: { expBonus: 2.0, spiritBonus: 3 },
  10: { expBonus: 3.0, spiritBonus: 5 },
}

export function getStreakBonus(streak) {
  let bonus = { expBonus: 0, spiritBonus: 0 }
  for (const [threshold, reward] of Object.entries(STREAK_REWARDS)) {
    if (streak >= parseInt(threshold)) {
      bonus = reward
    }
  }
  return bonus
}

export function getSpecialEncounter(streak) {
  for (let i = SPECIAL_ENCOUNTERS.length - 1; i >= 0; i--) {
    if (streak >= SPECIAL_ENCOUNTERS[i].streak) {
      return SPECIAL_ENCOUNTERS[i]
    }
  }
  return null
}
