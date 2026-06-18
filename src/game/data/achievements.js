export const ACHIEVEMENTS = [
  // 战斗成就
  { id: 'ach_first_win', name: '初露锋芒', icon: '⚔️', description: '获得第一场胜利', condition: { type: 'wins', value: 1 }, reward: { exp: 50, spirit: 5 } },
  { id: 'ach_win_10', name: '小有名气', icon: '⚔️', description: '获得10场胜利', condition: { type: 'wins', value: 10 }, reward: { exp: 100, spirit: 10 } },
  { id: 'ach_win_50', name: '战场老手', icon: '⚔️', description: '获得50场胜利', condition: { type: 'wins', value: 50 }, reward: { exp: 500, spirit: 50 } },
  { id: 'ach_win_100', name: '百战百胜', icon: '⚔️', description: '获得100场胜利', condition: { type: 'wins', value: 100 }, reward: { exp: 1000, spirit: 100 } },
  
  // 连胜成就
  { id: 'ach_streak_3', name: '小连胜', icon: '🔥', description: '连胜3场', condition: { type: 'streak', value: 3 }, reward: { exp: 30, spirit: 3 } },
  { id: 'ach_streak_5', name: '连胜达人', icon: '🔥', description: '连胜5场', condition: { type: 'streak', value: 5 }, reward: { exp: 50, spirit: 5 } },
  { id: 'ach_streak_10', name: '连胜之王', icon: '🔥', description: '连胜10场', condition: { type: 'streak', value: 10 }, reward: { exp: 100, spirit: 10 } },
  { id: 'ach_streak_20', name: '不败传说', icon: '🔥', description: '连胜20场', condition: { type: 'streak', value: 20 }, reward: { exp: 200, spirit: 20 } },
  
  // 等级成就
  { id: 'ach_level_10', name: '初出茅庐', icon: '📊', description: '达到Lv.10', condition: { type: 'level', value: 10 }, reward: { exp: 0, spirit: 20 } },
  { id: 'ach_level_25', name: '小有所成', icon: '📊', description: '达到Lv.25', condition: { type: 'level', value: 25 }, reward: { exp: 0, spirit: 50 } },
  { id: 'ach_level_50', name: '一代宗师', icon: '📊', description: '达到Lv.50', condition: { type: 'level', value: 50 }, reward: { exp: 0, spirit: 100 } },
  { id: 'ach_level_100', name: '天下第一', icon: '📊', description: '达到Lv.100', condition: { type: 'level', value: 100 }, reward: { exp: 0, spirit: 500 } },
  
  // 收集成就
  { id: 'ach_weapon_5', name: '武器收藏家', icon: '🗡️', description: '拥有5种武器', condition: { type: 'weapons', value: 5 }, reward: { exp: 100, spirit: 10 } },
  { id: 'ach_weapon_10', name: '武器大师', icon: '🗡️', description: '拥有10种武器', condition: { type: 'weapons', value: 10 }, reward: { exp: 300, spirit: 30 } },
  { id: 'ach_skill_5', name: '技能学徒', icon: '✨', description: '拥有5种技能', condition: { type: 'skills', value: 5 }, reward: { exp: 100, spirit: 10 } },
  { id: 'ach_skill_10', name: '技能大师', icon: '✨', description: '拥有10种技能', condition: { type: 'skills', value: 10 }, reward: { exp: 300, spirit: 30 } },
  
  // 塔成就
  { id: 'ach_tower_10', name: '塔之探索者', icon: '🗼', description: '斗神塔达到10层', condition: { type: 'tower', value: 10 }, reward: { exp: 200, spirit: 20 } },
  { id: 'ach_tower_50', name: '塔之征服者', icon: '🗼', description: '斗神塔达到50层', condition: { type: 'tower', value: 50 }, reward: { exp: 500, spirit: 50 } },
  
  // 特殊成就
  { id: 'ach_first_battle', name: '初次战斗', icon: '🎯', description: '完成第一场战斗', condition: { type: 'totalBattles', value: 1 }, reward: { exp: 20, spirit: 2 } },
  { id: 'ach_battle_100', name: '身经百战', icon: '🎯', description: '完成100场战斗', condition: { type: 'totalBattles', value: 100 }, reward: { exp: 500, spirit: 50 } },
]

export function checkAchievements(stats) {
  const unlocked = []
  
  ACHIEVEMENTS.forEach(ach => {
    let value = 0
    switch (ach.condition.type) {
      case 'wins': value = stats.wins || 0; break
      case 'streak': value = stats.maxStreak || 0; break
      case 'level': value = stats.level || 0; break
      case 'weapons': value = stats.weapons || 0; break
      case 'skills': value = stats.skills || 0; break
      case 'tower': value = stats.tower || 0; break
      case 'totalBattles': value = stats.totalBattles || 0; break
    }
    
    if (value >= ach.condition.value) {
      unlocked.push(ach)
    }
  })
  
  return unlocked
}

export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id)
}
