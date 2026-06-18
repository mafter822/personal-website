# 企鹅大乱斗 - V2 玩家体验拆解 & 编程需求文档

> 基于最新代码审查（2026-06-18），覆盖 26 个源文件。
> 设计定位：挂机观战 + 角色养成。战斗自动，乐趣在 BUILD 决策和成长反馈。

---

## 第一部分：玩家视角拆解

### 一、战斗体验

#### 问题 1：武器伤害全是乱的

打了 6 回合，日志里全是「【拳头】暴击！造成 XXX 伤害」。

我装备了武器，但战斗里显示的是「拳头」。而且伤害数字看起来不对 — 同样的技能「龙卷风」每回合都造成 387 点伤害，完全不变，没有随机波动。

**根因**: `CALC.damage()` 里 `weapon.baseDamage` 是数组 `[min, max]`，除以 50 得到 NaN。武器伤害计算完全失效，所有伤害回退到基础值。战斗里的伤害数字是假的。

#### 问题 2：同一个技能连续放了 3 次

第 1 回合：龙卷风 → 龙卷风 → 敌人攻击
第 2 回合：龙卷风 → 天使之翼 → 天使之翼
第 3 回合：天使之翼 → 装死 → 装死

「随机」在哪里？龙卷风连续出现 3 次，天使之翼连续出现 3 次。

**根因**: `autoSelectSkill()` 的随机逻辑有问题。它先按条件筛选（高伤害 60% 概率），再按条件筛选（控制 30% 概率），最后 fallback 到随机。但如果只有一个高伤害技能（龙卷风 damageMul=1.8），每次 60% 概率都会选中同一个。

#### 问题 3：装死被当成攻击技能使用

日志里出现「企鹅勇者发动【装死】！北极熊王损失 150 点生命！」。

装死是一个被动技能（生命降为 0 时免死一次），它不应该被主动发动，更不应该造成伤害。

**根因**: `autoSelectSkill()` 筛选 `category === 'special'`，装死的 category 是 'special'，所以被选中。但 `playerTurn()` 的 if/else 链只处理 heal/disarm/stun/ignore/haste 五种 effect，不处理 'undying'。于是走到了 `executeAttack(skill)` 分支，被当成攻击技能执行。

#### 问题 4：敌人终于会放技能了，但体验不好

北极熊王有 bear_swipe、frost_nova、dragon_breath 等技能，但日志里它一直在用「拳打脚踢」。

**根因**: `chooseEnemySkill()` 用 `require()` 导入 NPC_SKILLS（跟职业系统同一个 bug）。ESM 项目里 require 不存在，静默失败，永远返回 null。敌人退化为只会普攻。

#### 问题 5：战斗日志信息丢失

第 1 回合有 5 条日志，但 `lastLogs` 只取最后 10 条。第 2 回合日志被截断。玩家看到的日志是不完整的。

**根因**: `engine.log.slice(engine.log.length - 10)` 只取最后 10 条，但 `addLog` 是追加到 `log.value`（Vue 组件的 log），不是 engine.log。每次循环都把 engine 最后 10 条全部追加到 UI log，导致重复。

---

### 二、成长体验

#### 问题 6：刷新页面后进度丢失

打了 1 小时，升到 Lv.15，解锁了斗神塔第 10 层，好友好感度 50。
刷新页面后：等级还在，但塔进度变回 0，好友好感度变回 0，成就全没了。

**根因**: `loadGame()` 只恢复 7 个字段，其他 10+ 个字段全部丢失。

#### 问题 7：职业系统选了没用

选了「剑魂」，分配了技能点到「拔刀术」（武器伤害 +5%/级）。
回去打怪，伤害跟之前一模一样。

**根因**: `getClassBonus()` 用 require() 导入（永远失败），且只处理 3 种效果。

#### 问题 8：境界突破了没效果

突破到「练气」，面板显示全属性 +5。
但打起来没有任何变化。

**根因**: engine.js 读取 `player.realmBonus`，但 store.js 不设置这个字段。数据路径断裂。

#### 问题 9：商城暴击卷轴买了没效果

花 150 经验买了致命一击卷轴，用了之后下一场战斗暴击率没变。

**根因**: ShopPanel 把 buff 存到 `state.buffs[]`，但 BattleEngine 从不读取这个数组。

---

### 三、玩家真正感受到的

一个新玩家打开游戏后的实际体验：

1. 打了 3 局，发现战斗里武器不生效（显示拳头）
2. 发现敌人只会普攻，每场战斗都一样
3. 发现同一个技能连续放 3 次，怀疑随机性
4. 发现装死被当成攻击技能，觉得很奇怪
5. 刷新页面，发现塔进度和好友好感度没了
6. 选了职业，发现没效果
7. 买了商城道具，发现没效果
8. 关掉游戏

**核心感受**: 游戏里有 80% 的系统是「看起来能用但实际上不能用」。这比没有这些系统更让人失望。

---

## 第二部分：编程需求文档

### Phase 0：修复致命 Bug（必须最先做）

#### 0.1 修复武器伤害 NaN

**文件**: `src/game/data/constants.js`

**问题**: `CALC.damage()` 里 `weapon.baseDamage` 是数组 `[min, max]`，不是数字。

**修复**:
```javascript
damage: (attacker, weapon, skill) => {
  const weaponDamage = weapon
    ? (Array.isArray(weapon.baseDamage)
        ? weapon.baseDamage[0] + Math.random() * (weapon.baseDamage[1] - weapon.baseDamage[0])
        : weapon.baseDamage)
    : 1
  const base = attacker.strength * (weaponDamage / 50)
  const skillMul = skill ? skill.damageMul || 1 : 1
  const weaponBonus = weapon ? weapon.enhanceLevel * 0.1 : 0
  const raw = base * skillMul * (1 + weaponBonus)
  const variance = 0.9 + Math.random() * 0.2
  return Math.floor(raw * variance)
}
```

**验收**: 装备武器后，战斗日志显示武器名而非「拳头」，伤害有随机波动。

#### 0.2 修复 require() → import

**文件**: `src/game/engine.js`

**问题**: `getClassBonus()` 和 `chooseEnemySkill()` 用 `require()` 导入 ESM 模块。

**修复方案 A（推荐）**: 将数据作为构造函数参数传入，不在 engine 内部 import。

```javascript
// engine.js - 构造函数增加参数
constructor(player, enemy, playerSkills, equippedWeapon, classData, npcSkills) {
  // ...
  this.classData = classData || null  // CLASSES 数组
  this.npcSkills = npcSkills || {}    // NPC_SKILLS 对象
}

// getClassBonus() 改为
getClassBonus() {
  if (!this.classData) return {}
  const cls = this.classData.find(c => c.id === this.player.classId)
  // ... 其余逻辑不变，但用 this.classData 替代 require
}

// chooseEnemySkill() 改为
chooseEnemySkill() {
  const NPC_SKILLS = this.npcSkills
  // ... 其余逻辑不变
}
```

**调用方修改** (`BattleScene.vue`):
```javascript
import { CLASSES } from '../../game/data/classes.js'
import { NPC_SKILLS } from '../../game/data/pets.js'

const engine = new BattleEngine(
  { ...state.player, ...stats },
  props.enemy,
  state.skills,
  weapon,
  CLASSES,    // 新增
  NPC_SKILLS  // 新增
)
```

**验收**: 职业技能树加成在战斗中生效，敌人会使用冰锥/暴风雪/龙息等技能。

#### 0.3 修复存档丢失

**文件**: `src/game/store.js` - `loadGame()` 函数

**修复**: 增加所有缺失字段的加载。

```javascript
function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY)
    if (!saved) return
    const data = JSON.parse(saved)
    if (data.player) Object.assign(gameState.player, data.player)
    if (data.settings) Object.assign(gameState.settings, data.settings)
    if (data.stats) Object.assign(gameState.stats, data.stats)
    if (data.skills) gameState.skills = data.skills
    if (data.weapons) gameState.weapons = data.weapons
    if (data.equippedWeapon) gameState.equippedWeapon = data.equippedWeapon
    if (data.stagesCleared) gameState.stagesCleared = data.stagesCleared
    // 以下为新增
    if (data.towerProgress) gameState.towerProgress = data.towerProgress
    if (data.friends) gameState.friends = data.friends
    if (data.achievements) gameState.achievements = data.achievements
    if (data.inventory) gameState.inventory = data.inventory
    if (data.classSkills) gameState.classSkills = data.classSkills
    if (data.realm) gameState.realm = data.realm
    if (data.shopDaily) gameState.shopDaily = data.shopDaily
    if (data.buffs) gameState.buffs = data.buffs
    if (data.streakStatus) gameState.streakStatus = data.streakStatus
  } catch (e) {
    console.error('Failed to load game:', e)
  }
}
```

**验收**: 刷新页面后，塔进度、好友好感度、成就、职业选择全部保留。

#### 0.4 修复装死被当攻击技能

**文件**: `src/game/engine.js` - `autoSelectSkill()` 和 `playerTurn()`

**修复**: autoSelectSkill 排除被动技能，playerTurn 增加 undying 处理。

```javascript
// autoSelectSkill() - 排除被动技能
.filter(s => {
  if (!s) return false
  if (s.category !== 'attack' && s.category !== 'control' && s.category !== 'special') return false
  // 排除纯被动技能
  if (s.effect === 'undying') return false
  if (s.effect === 'multiAttack') return false  // 势如暴雨也需要专门处理
  if (s.effect === 'instakill') return false     // 神来一击也需要专门处理
  if (!s.damageMul && !s.effect) return false    // 无伤害无效果的跳过
  return true
})
```

**验收**: 装死不再出现在战斗日志里作为攻击技能。

#### 0.5 修复战斗日志重复

**文件**: `src/components/game/BattleScene.vue`

**问题**: 每次循环取 engine.log 最后 N 条，但 engine.log 是累积的，导致重复。

**修复**: 用索引追踪已读日志。

```javascript
// 在循环开始前
let lastLogIndex = 0

// 玩家回合后
const newLogs = engine.log.slice(lastLogIndex)
lastLogIndex = engine.log.length
newLogs.forEach(l => {
  if (l.type !== 'round_start') addLog(l.type, l.message)
})

// 敌人回合后同样
const newEnemyLogs = engine.log.slice(lastLogIndex)
lastLogIndex = engine.log.length
newEnemyLogs.forEach(l => addLog(l.type, l.message))
```

**验收**: 战斗日志不重复，每条只出现一次。

---

### Phase 1：修复半成品系统

#### 1.1 境界加成数据路径打通

**文件**: `src/game/store.js` + `src/components/game/RealmPanel.vue`

**问题**: engine.js 读取 `player.realmBonus`，但 store 不设置这个字段。

**修复**: breakthrough() 时设置 realmBonus。

```javascript
// RealmPanel.vue - breakthrough()
const bonus = getRealmBonus(nextRealm.id)
state.player.realmBonus = bonus  // engine 会读取这个
state.realm.level = nextRealm.level
```

**验收**: 突破境界后，战斗中伤害/生命有变化。

#### 1.2 商城 Buff 接入战斗

**文件**: `src/game/engine.js` + `src/components/game/BattleScene.vue`

**修复**: BattleScene 构造 engine 时传入 buffs，engine 在计算暴击率时应用。

```javascript
// BattleScene.vue
const engine = new BattleEngine(
  { ...state.player, ...stats, buffs: state.buffs || [] },
  // ...
)

// engine.js - executeAttack() 中
const critBonus = (this.player.buffs || [])
  .filter(b => b.type === 'crit')
  .reduce((sum, b) => sum + (b.value || 0), 0)
const critChance = CALC.critRate(stats.agility) + critBonus
```

战斗结束后清除一次性 buff：
```javascript
// BattleScene.vue - 战斗结束后
state.buffs = (state.buffs || []).filter(b => b.persistent)
```

**验收**: 使用暴击卷轴后，下一场战斗暴击率明显提升。

#### 1.3 getCombatStats() 补全所有加成

**文件**: `src/game/store.js`

**修复**: 加入境界、职业、装备加成。

```javascript
function getCombatStats() {
  const player = gameState.player
  let bonusStr = 0, bonusAgi = 0, bonusSpd = 0, bonusHp = 0

  // 技能加成
  gameState.skills.forEach(skill => {
    const skillData = getSkillById(skill.id)
    if (skillData && skillData.statBonus) {
      const amount = skillData.statBonus.amount * skill.level
      if (skillData.statBonus.stat === 'strength') bonusStr += amount
      if (skillData.statBonus.stat === 'agility') bonusAgi += amount
      if (skillData.statBonus.stat === 'speed') bonusSpd += amount
      if (skillData.statBonus.stat === 'health') bonusHp += amount
      if (skillData.statBonus.stat === 'all') {
        bonusStr += amount; bonusAgi += amount; bonusSpd += amount
      }
    }
  })

  // 境界加成
  if (player.realmBonus) {
    bonusStr += player.realmBonus.strength || 0
    bonusAgi += player.realmBonus.agility || 0
    bonusSpd += player.realmBonus.speed || 0
    bonusHp += player.realmBonus.maxHealth || 0
  }

  return {
    strength: player.strength + bonusStr,
    agility: player.agility + bonusAgi,
    speed: player.speed + bonusSpd,
    maxHealth: player.maxHealth + bonusHp,
  }
}
```

**验收**: 地盘页面显示的属性包含所有加成。

#### 1.4 斗神塔楼层进度保存

**文件**: `src/components/game/TowerScene.vue` + `src/components/game/BattleScene.vue`

**问题**: 打赢塔层后 `towerProgress.maxFloor` 不更新。

**修复**: BattleScene 战斗胜利后，如果 stageId 以 'tower_' 开头，更新塔进度。

```javascript
// BattleScene.vue - 胜利结算中
if (props.stageId?.startsWith('tower_')) {
  const floor = parseInt(props.stageId.split('_')[1])
  if (floor > state.towerProgress.maxFloor) {
    state.towerProgress.maxFloor = floor
  }
}
```

**验收**: 打赢塔第 5 层后，刷新页面，塔进度显示 5。

#### 1.5 关卡通关标记

**文件**: `src/components/game/BattleScene.vue`

**问题**: 打赢关卡后 `stagesCleared` 不更新。

**修复**:
```javascript
// BattleScene.vue - 胜利结算中
if (props.stageId && !props.stageId.startsWith('tower_')) {
  clearStage(props.stageId)
}
```

**验收**: 打赢冰雪新手村后，关卡列表显示 ✓ 已通关。

---

### Phase 2：让战斗有看头

#### 2.1 技能选择增加随机性

**文件**: `src/game/engine.js` - `autoSelectSkill()`

**问题**: 高伤害技能 60% 概率选中，如果只有一个就永远选它。

**修复**: 引入冷却机制，同一技能不能连续使用。

```javascript
autoSelectSkill() {
  // ... 现有筛选逻辑 ...

  // 排除上回合使用的技能（强制换技能）
  const lastSkill = this.player.lastUsedSkillId
  const candidates = availableSkills.filter(s => s.id !== lastSkill)
  const pool = candidates.length > 0 ? candidates : availableSkills

  // ... 后续选择逻辑使用 pool ...

  const chosen = pool[Math.floor(Math.random() * pool.length)]
  this.player.lastUsedSkillId = chosen.id
  return chosen.id
}
```

**验收**: 不会连续两回合使用同一个技能。

#### 2.2 敌人行为模式

**文件**: `src/game/data/pets.js` + `src/game/engine.js`

**修复**: 给 Boss 定义行为模式（轮换/狂暴）。

```javascript
// pets.js - Boss 增加 behavior
{
  id: 'npc_7',
  name: '北极熊王',
  // ...
  behavior: {
    pattern: 'rotation',
    sequence: ['basic_attack', 'bear_swipe', 'frost_nova', 'dragon_breath'],
    enrageAt: 0.3,
    enrageMul: 1.5,
  }
}

// engine.js - chooseEnemySkill() 增加行为模式
chooseEnemySkill() {
  const behavior = this.enemy.behavior
  if (behavior?.pattern === 'rotation') {
    // 轮换使用技能
    this.enemy.rotationIndex = ((this.enemy.rotationIndex || 0) + 1) % behavior.sequence.length
    const skillId = behavior.sequence[this.enemy.rotationIndex]
    return this.npcSkills[skillId] || null
  }
  // ... 现有随机逻辑 ...
}
```

**验收**: Boss 按固定模式使用技能，战斗有节奏感。

#### 2.3 体力上限随等级增长

**文件**: `src/game/store.js` + `src/game/data/constants.js`

**修复**:
```javascript
// constants.js
export const STAMINA_MAX = (level) => 100 + (level - 1) * 5

// store.js - 所有 Math.min(100, ...) 替换为
import { STAMINA_MAX } from './data/constants.js'
const maxStamina = STAMINA_MAX(gameState.player.level)
```

**验收**: Lv.20 角色体力上限 195。

---

### Phase 3：补齐成长系统

#### 3.1 升级时技能 3 选 1

**文件**: `src/game/store.js` + 新增 `src/components/game/LevelUpModal.vue`

**修改 addExp()**: 返回 3 个候选技能 + 3 个候选武器，让 UI 展示选择。

**验收**: 升级时弹出面板，从 3 个技能中选 1 个，从 3 个武器中选 1 个。

#### 3.2 装备掉落与穿戴

**文件**: `src/components/game/BattleScene.vue` + `src/components/game/EquipmentPanel.vue`

**修复**: 装备掉落存入 `state.equipment.inventory[]` 而非 `state.weapons[]`。

**验收**: 通关后概率获得装备，装备面板能穿戴，穿戴后属性变化。

#### 3.3 连胜/连败状态显示

**文件**: `src/components/game/GameHome.vue`

**修复**: 地盘页面显示当前状态（正常/亢奋/低迷）及其效果说明。

**验收**: 连胜 3 场后地盘显示「亢奋：攻击力 +30%」。

---

## 第三部分：改动文件清单

### Phase 0（致命 Bug）

| 文件 | 改动 |
|------|------|
| `constants.js` | CALC.damage() 修复 baseDamage 数组处理 |
| `engine.js` | require() → 构造函数参数；autoSelectSkill 排除被动技能；enemyTurn 使用 npcSkills |
| `BattleScene.vue` | 传入 CLASSES/NPC_SKILLS；日志去重；通关标记 |
| `store.js` | loadGame 补全所有字段 |

### Phase 1（半成品系统）

| 文件 | 改动 |
|------|------|
| `store.js` | getCombatStats 补全境界/职业加成 |
| `RealmPanel.vue` | breakthrough 设置 realmBonus |
| `BattleScene.vue` | Buff 传入 engine + 战斗后清除 |
| `engine.js` | executeAttack 读取 crit buff |
| `TowerScene.vue` | 打赢后更新 maxFloor |

### Phase 2（战斗体验）

| 文件 | 改动 |
|------|------|
| `engine.js` | autoSelectSkill 冷却机制；chooseEnemySkill 行为模式 |
| `pets.js` | Boss 增加 behavior 配置 |
| `constants.js` | STAMINA_MAX 改为函数 |
| `store.js` | 体力上限使用函数 |

### Phase 3（成长系统）

| 文件 | 改动 |
|------|------|
| `store.js` | addExp 返回候选列表 |
| `LevelUpModal.vue` | 新增：升级选择面板 |
| `BattleScene.vue` | 装备掉落存入正确数组 |
| `EquipmentPanel.vue` | 修复装备显示逻辑 |
| `GameHome.vue` | 显示连胜/连败状态 |

---

## 第四部分：MVP 优先级

如果只做 4 件事：

1. **Phase 0.1** — 修复武器伤害 NaN（战斗核心数值）
2. **Phase 0.2** — 修复 require() → import（敌人放技能 + 职业生效）
3. **Phase 0.3** — 修复存档丢失（玩家不丢进度）
4. **Phase 0.4** — 修复装死当攻击用（技能逻辑正确）

这 4 项做完，游戏从「80% 系统是坏的」变成「核心系统都能用」。
