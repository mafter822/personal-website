import { NPC_ENEMIES } from './pets.js'
import { EQUIPMENT_DATABASE } from './equipment.js'

function getStageEquipmentDrop(difficulty) {
  const possibleEquipment = EQUIPMENT_DATABASE.filter(e => {
    if (difficulty <= 3 && e.reqLevel > 10) return false
    if (difficulty <= 6 && e.reqLevel > 25) return false
    return true
  })
  
  if (possibleEquipment.length === 0) return null
  if (Math.random() > 0.3) return null
  
  return possibleEquipment[Math.floor(Math.random() * possibleEquipment.length)]
}

export const STAGES = [
  {
    id: 'stage_1',
    name: '冰雪新手村',
    description: '最简单的挑战，适合初学者',
    difficulty: 1,
    enemy: NPC_ENEMIES[0],
    staminaCost: 5,
    rewards: { exp: 20, spirit: 1 },
    requiredLevel: 1,
  },
  {
    id: 'stage_2',
    name: '冰原巡逻',
    description: '巡逻兵守卫着冰原',
    difficulty: 2,
    enemy: NPC_ENEMIES[1],
    staminaCost: 8,
    rewards: { exp: 50, spirit: 2 },
    requiredLevel: 3,
  },
  {
    id: 'stage_3',
    name: '雪山猎场',
    description: '危险的猎手出没于此',
    difficulty: 3,
    enemy: NPC_ENEMIES[2],
    staminaCost: 10,
    rewards: { exp: 100, spirit: 3 },
    requiredLevel: 8,
  },
  {
    id: 'stage_4',
    name: '极地前线',
    description: '战士们在此守卫边疆',
    difficulty: 4,
    enemy: NPC_ENEMIES[3],
    staminaCost: 12,
    rewards: { exp: 180, spirit: 4 },
    requiredLevel: 12,
  },
  {
    id: 'stage_5',
    name: '冰霜要塞',
    description: '冰霜领主的领地',
    difficulty: 5,
    enemy: NPC_ENEMIES[4],
    staminaCost: 15,
    rewards: { exp: 300, spirit: 5 },
    requiredLevel: 18,
  },
  {
    id: 'stage_6',
    name: '极光之境',
    description: '极光守护者守护的神秘之地',
    difficulty: 6,
    enemy: NPC_ENEMIES[5],
    staminaCost: 18,
    rewards: { exp: 500, spirit: 7 },
    requiredLevel: 22,
  },
  {
    id: 'stage_7',
    name: '熊王巢穴',
    description: '北极熊王的领地',
    difficulty: 7,
    enemy: NPC_ENEMIES[6],
    staminaCost: 20,
    rewards: { exp: 800, spirit: 10 },
    requiredLevel: 28,
  },
  {
    id: 'stage_8',
    name: '龙之墓地',
    description: '冰龙长老沉睡之地',
    difficulty: 8,
    enemy: NPC_ENEMIES[7],
    staminaCost: 22,
    rewards: { exp: 1200, spirit: 15 },
    requiredLevel: 32,
  },
  {
    id: 'stage_9',
    name: '霸王领地',
    description: '极地霸王的统治区域',
    difficulty: 9,
    enemy: NPC_ENEMIES[8],
    staminaCost: 25,
    rewards: { exp: 1800, spirit: 20 },
    requiredLevel: 38,
  },
  {
    id: 'stage_10',
    name: '远古冰域',
    description: '远古冰帝的最终领地',
    difficulty: 10,
    enemy: NPC_ENEMIES[9],
    staminaCost: 30,
    rewards: { exp: 3000, spirit: 30 },
    requiredLevel: 45,
  },
]

export function getStageById(id) {
  return STAGES.find(s => s.id === id)
}

export function getAvailableStages(playerLevel) {
  return STAGES.filter(s => s.requiredLevel <= playerLevel)
}
