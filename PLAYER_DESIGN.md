# 企鹅大乱斗 - 玩家体验拆解 & 产品需求文档

> 本文档从玩家视角出发，拆解现有游戏的体验问题和需求，
> 再从产品角度汇总为可执行的编程需求。供 AI 编码使用。

---

## 第一部分：玩家视角拆解

### 一、我打开游戏后经历了什么

1. 进入游戏，看到 13 个 Tab 页，感觉内容很丰富
2. 点「乐斗」→ 选第一个关卡 → 消耗 5 体力 → 进入战斗
3. 战斗全自动，我只能看着文字一行一行刷出来
4. 赢了，拿到 20 经验 + 1 精魄，升了一级，自动获得一个技能和一把武器
5. 再打了 3 把，体力没了（剩 85，每把 5-10 体力）
6. 等了 1 分钟恢复 1 点，发现要等很久
7. 去看技能面板，发现技能不能升级（按钮不出现）
8. 去看装备面板，发现全是空的，没有任何装备
9. 去看职业面板，选了个职业，分配了技能点，回去打怪发现没区别
10. 去看境界面板，突破了一下，回去打怪发现没区别
11. 去看成就面板，全是灰色的，怎么都解锁不了
12. 去商城买了个暴击卷轴，花了 150 经验，用了之后没感觉
13. 关掉了游戏

**核心感受**: 看起来什么都有，实际上什么都没用。

---

### 二、战斗体验问题

#### 问题 1：我没有参与感

战斗是全自动的。AI 帮我选技能，AI 帮我打。我唯一的操作是点「开始」然后看文字刷屏。

**玩家想说的话**: "这游戏跟我有什么关系？我在看一个计算器算数。"

**参考来源站的做法**: 原站也是自动战斗，但它有：
- 2D 动画战斗场景（Phaser 引擎）
- 战斗倒计时 3-2-1 营造紧张感
- 战斗日志逐行播放，不同行有不同颜色和延迟
- 战斗结束后有详细结算界面

#### 问题 2：每场战斗都一样

打 Lv.1 的企鹅新手和打 Lv.50 的远古冰帝，体验上没有区别。都是看文字刷屏，都是普攻为主。

**原因**:
- NPC 敌人的技能（冰锥、暴风雪、龙息）虽然数据定义了，但战斗引擎里敌人只会普攻
- 没有 Boss 机制（没有阶段性变化、没有特殊技能循环）
- 没有战斗中的决策点（比如 Boss 蓄力大招时你可以选择防御还是抢攻）

#### 问题 3：战斗日志看不清

每回合只显示最后 5 条日志。如果一个回合里有连击 + 暴击 + 反击 + 反弹，后面的全部被吃掉。我看不懂发生了什么。

---

### 三、成长体验问题

#### 问题 4：升级没有成就感

升级时发生了什么：
- 数字 +3 力量、+2 敏捷、+2 速度
- 随机 +2 点属性
- 自动获得一个随机技能
- 自动获得一把随机武器

**问题**: 全是自动的。我没有选择权。我不能决定「这次升级我要加力量」或者「我要学这个技能」。

**玩家想说的话**: "升级了，然后呢？感觉跟没升一样，因为怪也变强了。"

#### 问题 5：技能不能升级

技能面板打开，能看到所有技能，但升级按钮永远不会出现。精魄攒了一堆花不掉。

这是代码 bug（`ownedSkill` 硬编码返回 `null`），但从玩家角度就是「这功能坏了」。

#### 问题 6：精魄没有消费出口

精魄的唯一用途是升级技能和武器。但技能升级坏了，武器强化也基本没用（只有 +10%/+20%/+30% 三档）。

打了 20 局攒了 60 精魄，花不掉。

#### 问题 7：金币完全没用

`state.player.gold` 存在，`addGold()` 函数存在，但没有任何地方消耗金币。商城用的是经验值。金币是个死属性。

---

### 四、系统体验问题

#### 问题 8：装备系统是空壳

装备面板打开，5 个槽位全是「未装备」。16 件装备数据定义了，但：
- 没有任何途径获取装备（没有掉落、没有商店）
- 武器槽位甚至没有装备数据
- 套装效果定义了但不生效

**玩家想说的话**: "这游戏有装备系统吗？我看面板是空的。"

#### 问题 9：职业系统没有实际效果

我选了「剑魂」职业，分配了技能点到「拔刀术」（武器伤害 +5%/级）。

回去打怪，伤害跟之前一模一样。

因为战斗引擎根本不读取职业数据。

#### 问题 10：境界系统是摆设

我突破到「练气」境界，面板显示全属性 +5。但实际打起来没有任何变化。

因为境界加成从未应用到战斗计算。

#### 问题 11：成就永远不解锁

成就列表有 20 个成就，我打了 50 局赢了 42 局，成就面板还是全灰的。

因为 `checkAchievements()` 从未被调用。

#### 问题 12：商城是个陷阱

| 花费 | 买了什么 | 实际效果 |
|------|----------|----------|
| 150 经验 | 致命一击卷轴 | 没效果（buff 类型未处理） |
| 500 经验 | 强化石 | 没地方用（没有强化系统消耗它） |
| 800 经验 | 保护券 | 没地方用 |
| 100 经验 | 体力药水 | ✓ 能用 |
| 200 经验 | 精魄药水 | ✓ 能用（但精魄花不掉） |

花了 150 经验买了个寂寞。

---

### 五、内容体验问题

#### 问题 13：内容太少

10 个主线关卡 + 100 层塔。塔是纯数值递增的敌人，没有特殊机制。

打完 10 个关卡大概需要 Lv.45，但关卡设计只覆盖到 Lv.50。之后无事可做。

#### 问题 14：没有叙事

我不知道我是谁，不知道为什么要打这些企鹅，不知道最终目标是什么。

没有对话、没有剧情、没有世界观。只有数值。

#### 问题 15：好友系统是假的

8 个 NPC 好友，好感度不会增长，好友只会普攻（skills: []），打了也没什么意思。

---

### 六、玩家真正想要什么

总结上面 15 个问题，玩家的核心诉求是：

1. **战斗要好看** — 虽然是自动的，但敌人要会放技能、有变化，不能只会普攻
2. **我要有成长感** — 升级要能选择，变强要能感受到
3. **系统要能用** — 要么做好，要么别拿出来
4. **要有内容可玩** — 10 关不够，要有持续的目标
5. **要有正反馈** — 打完要有满足感，不是「哦又赢了」

**设计定位**: 这是一个「挂机观战 + 角色养成」游戏。战斗是自动的，乐趣来自于：
- 打之前：选武器、配技能、穿装备（BUILD 决策）
- 打的时候：看战况跌宕起伏（观战体验）
- 打之后：拿奖励、升级、变强（成长反馈）

---

## 第二部分：产品需求文档（供 AI 编码）

### 需求总览

基于玩家视角分析，将需求分为 4 个阶段：

| 阶段 | 目标 | 预计工时 |
|------|------|----------|
| Phase 1 | 修好现有的东西 | 3-5 天 |
| Phase 2 | 让战斗有参与感 | 5-7 天 |
| Phase 3 | 补齐成长系统 | 5-7 天 |
| Phase 4 | 扩充内容 | 5-7 天 |

---

### Phase 1：修好现有的东西（3-5 天）

**目标**: 把断掉的系统接上，让已有功能真正可用。

#### 1.1 修复技能升级

**文件**: `SkillBook.vue`

**问题**: `const ownedSkill = computed(() => null)` 硬编码返回 null

**修复方案**:
```javascript
// 替换为：
const ownedSkill = computed(() => {
  return state.skills.find(s => s.id === props.skill.id) || null
})
```

**验收标准**: 已拥有的技能显示 ✓ 标记和当前等级，升级按钮在精魄足够时可点击。

#### 1.2 修复商城道具

**文件**: `ShopPanel.vue`

**修复内容**:
- `applyEffect()` 增加 `buff` 类型处理：暴击卷轴使用后，下一场战斗暴击率 +15%
- `applyEffect()` 增加 `material` 类型处理：强化石/保护券存入背包
- 修复回春丹使用 `state.player.maxHealth` → 改用 `gameStore.getCombatStats().maxHealth`

**验收标准**: 每种道具购买后都有实际效果。

#### 1.3 接入职业系统到战斗引擎

**文件**: `engine.js` + `store.js`

**修复内容**:
- `playerCombatStats` getter 中读取职业加成（str/agi/spd/hp bonus）
- `executeAttack()` 中应用职业被动技能（weaponDamage、damageReduce、critRate、dodgeRate、counterRate）
- `enemyTurn()` 中应用职业防御被动

**需要处理的职业效果**:

| 效果 | 应用位置 | 说明 |
|------|----------|------|
| strBonus | playerCombatStats | 直接加到力量 |
| agiBonus | playerCombatStats | 直接加到敏捷 |
| weaponDamage | executeAttack | 武器伤害 ×(1 + bonus) |
| damageReduce | enemyTurn | 受到伤害 ×(1 - bonus) |
| critRate | executeAttack | 暴击率 +bonus |
| dodgeRate | enemyTurn | 闪避率 +bonus |
| counterRate | executeAttack | 反击率 +bonus |

**验收标准**: 选了职业 + 分配技能点后，战斗数据有明显变化。

#### 1.4 接入境界加成

**文件**: `store.js` 的 `getCombatStats()`

**修复内容**:
```javascript
function getCombatStats() {
  // ... 现有代码 ...
  const realmBonus = getRealmBonus(state.realm.level)
  if (realmBonus) {
    bonusStr += realmBonus.strength
    bonusAgi += realmBonus.agility
    bonusSpd += realmBonus.speed
    bonusHp += realmBonus.maxHealth
  }
  // ...
}
```

**验收标准**: 突破境界后，角色面板和战斗数据同步变化。

#### 1.5 接入成就检查

**文件**: `store.js`

**修复内容**:
- 在 `addWin()` 末尾调用 `checkAchievements(gameState.stats)`
- 在 `addExp()` 升级时调用检查
- 在 `clearStage()` 时调用检查
- 检查结果自动解锁对应成就，发放奖励

**验收标准**: 达成条件后成就自动解锁，弹出提示。

#### 1.6 修复体力上限

**文件**: `constants.js` + `store.js`

**修复内容**:
```javascript
// constants.js
export const STAMINA_MAX = (level) => 100 + (level - 1) * 5

// store.js - 所有 Math.min(100, ...) 改为 Math.min(STAMINA_MAX(level), ...)
```

**验收标准**: Lv.20 角色体力上限显示为 195。

#### 1.7 替换所有 alert()

**新增文件**: `src/components/game/GameToast.vue`

**修复内容**:
- 创建一个轻量 Toast 组件（顶部弹出，2 秒自动消失）
- 全局注册或 provide/inject
- 替换所有 `alert()` 调用

**验收标准**: 全游戏没有一个原生 alert。

#### 1.8 修复排行榜随机数

**文件**: `RankingPanel.vue`

**修复内容**: NPC 的 streak 值改为固定种子生成，不要每次 render 都随机。

```javascript
// 用 NPC id 的 hash 生成固定 streak
const fixedStreak = (id) => {
  let hash = 0
  for (const c of id) hash = ((hash << 5) - hash) + c.charCodeAt(0)
  return Math.abs(hash) % 15
}
```

**验收标准**: 排行榜数据在页面刷新后保持稳定。

#### 1.9 修复好友战经验为负

**文件**: `FriendList.vue`

**修复内容**:
```javascript
exp: Math.max(10, 45 + (friend.level - state.player.level) * 3)
```

**验收标准**: 打任何好友至少获得 10 经验。

#### 1.10 好友好感度增长

**文件**: `FriendList.vue`

**修复内容**: `battleFriend()` 结束后，增加好感度：
```javascript
if (!state.friends[friend.id]) state.friends[friend.id] = { intimacy: 0 }
state.friends[friend.id].intimacy += 5
```

**验收标准**: 打完好友后好感度 +5。

#### 1.11 删除 pets.js 中重复的 NPC_ENEMIES

**文件**: `pets.js`

**问题**: 文件中 `NPC_ENEMIES` 定义了两次（第 26 行和第 139 行），第二次覆盖第一次。且第二次引用了未定义的技能（`claw_strike`、`aurora_beam`）。

**修复**: 删除第二个定义，保留第一个（使用 NPC_SKILLS 中已定义的技能）。

---

### Phase 2：让战斗有看头（5-7 天）

**目标**: 战斗虽然是自动的，但要打得精彩、有变化、有悬念。

#### 2.1 敌人使用技能（核心）

**文件**: `engine.js`

**修复内容**: `enemyTurn()` 中根据敌人 skills 数组，随机选择使用技能而非只普攻。

```javascript
enemyTurn() {
  // 40% 概率使用技能（如果有），60% 普攻
  if (this.enemy.skills.length > 1 && Math.random() < 0.4) {
    const skillKeys = this.enemy.skills.filter(s => s !== 'basic_attack')
    const skillKey = skillKeys[Math.floor(Math.random() * skillKeys.length)]
    const skill = NPC_SKILLS[skillKey]
    this.executeEnemySkill(skill)
  } else {
    this.executeEnemyAttack()
  }
}
```

**需要新增**: `executeEnemySkill()` 方法，处理伤害类和控制类 NPC 技能。

**验收标准**: Boss 战中敌人会使用暴风雪、龙息等技能，战斗有紧张感。

#### 2.2 Boss 阶段机制

**文件**: `engine.js` + `stages.js` + `pets.js`

**设计方案**: 每个 Boss 在血量低于 50% 时进入「狂暴模式」，攻击力提升但防御降低。

```javascript
// pets.js 中增加 phase 数据
{
  id: 'npc_5',
  name: '冰霜领主',
  // ...
  phases: [
    { hpPercent: 1.0, name: '普通', atkMul: 1.0, defMul: 1.0 },
    { hpPercent: 0.5, name: '狂暴', atkMul: 1.5, defMul: 0.7 },
  ]
}
```

**验收标准**: Boss 战有阶段性变化，玩家需要调整策略。

#### 2.3 战斗日志优化

**文件**: `BattleScene.vue`

**修复内容**:
- 取消日志截断，改为自动滚动到底部
- 不同类型日志用不同颜色（攻击=红、治疗=绿、控制=紫、暴击=金）
- 增加回合分隔线

**验收标准**: 战斗日志完整显示，不会丢失信息。

#### 2.4 战斗结算强化

**文件**: `BattleScene.vue`

**修复内容**: 战斗胜利后显示详细结算面板：
- 获得经验（含加成明细）
- 获得精魄
- 经验进度条
- 升级提示（如果升级了）
- 新获得的技能/武器
- 连胜状态提示

**验收标准**: 打完一局有满足感，能清楚看到收益。

---

### Phase 3：补齐成长系统（5-7 天）

**目标**: 让玩家有目标、有选择、有积累感。

#### 3.1 技能自主选择

**问题**: 当前技能是升级时随机获得的，玩家没有选择权。

**修改方案**: 升级时弹出「技能选择」面板，从 3 个随机技能中选 1 个。

```javascript
// store.js - addExp() 中修改
const candidates = []
for (let i = 0; i < 3; i++) {
  const skill = rollSkill(level, ownedSkillIds.concat(candidates.map(c => c.id)))
  if (skill) candidates.push(skill)
}
// 返回 candidates 让 UI 展示选择
return { newSkills: candidates }  // 选 1 个
```

**文件改动**:
- `store.js`: addExp() 返回候选技能列表
- `BattleScene.vue` 或新增 `LevelUpModal.vue`: 展示 3 选 1 面板

**验收标准**: 升级时从 3 个技能中选择 1 个，增加策略性和期待感。

#### 3.2 武器自主选择

同理，升级时从 3 个随机武器中选 1 个。

**验收标准**: 升级时同时选择技能和武器。

#### 3.3 装备掉落系统

**文件**: `engine.js` + `stages.js` + `store.js`

**设计方案**: 关卡通关后有概率掉落装备。

```javascript
// stages.js - 增加掉落配置
{
  id: 'stage_5',
  // ...
  dropTable: {
    equipment: { chance: 0.3, pool: ['eq_iron_helmet', 'eq_iron_armor'] },
    material: { chance: 0.1, pool: ['enhance_stone'] }
  }
}
```

**文件改动**:
- `stages.js`: 每个关卡配置掉落表
- `engine.js` 或 `BattleScene.vue`: 战斗结算时 roll 掉落
- `store.js`: 增加 `addEquipment()` 方法
- `EquipmentPanel.vue`: 修复装备显示逻辑

**验收标准**: 通关后有概率获得装备，装备面板能显示和穿戴。

#### 3.4 装备属性生效

**文件**: `engine.js` + `store.js`

**修复内容**: `getCombatStats()` 中读取已装备的装备属性加成。

```javascript
function getCombatStats() {
  // ... 现有代码 ...
  // 读取装备加成
  const equipped = state.equipment.equipped
  for (const slot of Object.values(equipped)) {
    if (slot) {
      const eq = getEquipmentById(slot)
      if (eq?.bonus) {
        bonusStr += eq.bonus.strength || 0
        bonusAgi += eq.bonus.agility || 0
        bonusSpd += eq.bonus.speed || 0
        bonusHp += eq.bonus.maxHealth || 0
      }
    }
  }
}
```

**验收标准**: 穿戴装备后角色属性变化，战斗中生效。

#### 3.5 精魄消费出口

除了技能升级（已在 Phase 1 修复），增加更多精魄消费途径：

| 消费 | 用途 |
|------|------|
| 武器强化 | 已有，确保能用 |
| 技能升级 | 已有，确保能用 |
| 装备强化 | 新增，消耗精魄 + 强化石 |
| 重置属性点 | 新增，消耗精魄重新分配随机属性 |

#### 3.6 金币消费出口

当前金币完全没有用途。增加：

| 消费 | 用途 |
|------|------|
| 商城部分商品用金币购买 | 体力药水(小) 改为 50 金币 |
| 装备修理 | 装备耐久系统（可选） |
| 属性重置 | 100 金币重置随机属性分配 |

#### 3.7 连胜/连败状态

**文件**: `store.js` + `engine.js`

**修复内容**:
- `addWin()`: 连胜 ≥ 3 时设置状态为「亢奋」
- `addLoss()`: 连败 ≥ 3 时设置状态为「低迷」
- `engine.js`: 战斗开始时检查状态，应用加成/减益
- `GameHome.vue`: 显示当前状态

```javascript
// 亢奋：攻击力 +30%
// 低迷：攻击力 -20%
function getStatusMultiplier(status) {
  if (status === '亢奋') return 1.3
  if (status === '低迷') return 0.8
  return 1.0
}
```

**验收标准**: 连胜 3 地后状态变化，战斗中能感受到差异。

---

### Phase 4：扩充内容（5-7 天）

**目标**: 增加游戏深度和可玩时长。

#### 4.1 秘境副本系统

**新增文件**: `src/components/game/DungeonScene.vue` + `src/game/data/dungeons.js`

**设计方案**: 7 个难度等级的副本，每个副本有多层 + Boss。

| 秘境 | 最低等级 | 层数 | 每日次数 | 体力 |
|------|----------|------|----------|------|
| 青铜 | Lv.10 | 10 | 5 | 10 |
| 白银 | Lv.20 | 15 | 4 | 15 |
| 黄金 | Lv.30 | 20 | 4 | 20 |
| 铂金 | Lv.45 | 20 | 3 | 25 |
| 钻石 | Lv.60 | 25 | 3 | 30 |
| 大师 | Lv.75 | 25 | 2 | 35 |
| 传说 | Lv.90 | 30 | 2 | 40 |

**核心差异**: 秘境有 5 种难度倍率（普通/冒险/勇者/王者/深渊），影响属性和掉落品质。

**验收标准**: 玩家有持续的挑战内容，装备掉落有来源。

#### 4.2 更多主线关卡

**文件**: `stages.js` + `pets.js`

**修复内容**: 从 10 关扩展到 20 关，覆盖 Lv.1 - Lv.100。

新增 10 个关卡：

| 关卡 | 等级 | 敌人 | 特点 |
|------|------|------|------|
| 冰晶矿洞 | Lv.50 | 冰晶矿工 | 会掉落强化石 |
| 暴风雪原 | Lv.55 | 暴风雪精灵 | 有减速技能 |
| 冰封王座 | Lv.60 | 冰封骑士 | 有格挡被动 |
| 极寒深渊 | Lv.65 | 深渊守卫 | 有吸血技能 |
| 永冻冰棺 | Lv.70 | 冰棺亡灵 | 有装死技能 |
| 冰龙巢穴 | Lv.75 | 冰龙 | 多阶段 Boss |
| 极光天穹 | Lv.80 | 极光精灵 | 有治疗技能 |
| 冰霜王城 | Lv.85 | 冰霜将军 | 有指挥被动（增强小怪） |
| 远古遗迹 | Lv.90 | 远古守卫 | 有反弹技能 |
| 世界之巅 | Lv.100 | 冰帝真身 | 最终 Boss，3 阶段 |

#### 4.3 敌人多样性

**文件**: `pets.js` + `engine.js`

**修复内容**: 给敌人定义真正的技能行为模式：

```javascript
// 行为模式
{
  id: 'npc_8',
  name: '冰龙长老',
  // ...
  behavior: {
    pattern: 'rotation',  // 轮流使用技能
    sequence: ['basic_attack', 'basic_attack', 'dragon_breath', 'frost_nova'],
    enrageAt: 0.3,  // 30% 血量进入狂暴
    enrageSkills: ['blizzard', 'ice_age'],
  }
}
```

**验收标准**: 每个 Boss 有独特的战斗模式，需要不同策略应对。

#### 4.4 每日任务系统

**新增文件**: `src/components/game/DailyTasks.vue` + `src/game/data/tasks.js`

**设计方案**:

| 任务 | 条件 | 奖励 |
|------|------|------|
| 每日首胜 | 赢 1 场 | 50 经验 |
| 挑战 3 次 | 打 3 场 | 30 经验 |
| 通关任意关卡 | 通 1 关 | 100 经验 |
| 爬塔 3 层 | 打 3 层塔 | 2 精魄 |
| 使用 3 次技能 | 战斗中用 3 次技能 | 1 精魄 |

**验收标准**: 每天有 5 个小目标，完成后有额外奖励。

#### 4.5 新手引导

**新增文件**: `src/components/game/Tutorial.vue`

**设计方案**: 前 3 次游戏时弹出引导气泡：

1. 第一次进入：「欢迎来到企鹅大乱斗！点击乐斗开始你的第一场战斗！」
2. 第一次战斗：「选择你的行动！武器攻击最稳定，技能攻击更强力！」
3. 第一次升级：「恭喜升级！选择一个新技能来变强吧！」
4. 第一次看技能面板：「精魄可以用来升级技能，让它变得更强！」
5. 体力不足时：「体力不足了！去商城买体力药水，或者等它自动恢复。」

**验收标准**: 新玩家不会迷路，知道该做什么。

#### 4.6 战斗音效（可选）

**新增文件**: `src/game/audio.js`

使用 Web Audio API 生成简单音效：
- 攻击命中：短促的「咚」
- 暴击：更响的「砰」
- 闪避：「咻」
- 升级：上升音阶
- 胜利：欢快的旋律

**验收标准**: 战斗有声音反馈（可关闭）。

---

## 第三部分：文件改动清单

### Phase 1 改动清单

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `SkillBook.vue` | 修复 | ownedSkill computed 修复 |
| `ShopPanel.vue` | 修复 | applyEffect 增加 buff/material 处理 |
| `engine.js` | 修复 | 读取职业加成 |
| `store.js` | 修复 | getCombatStats 增加境界/装备加成，addWin 增加成就检查 |
| `constants.js` | 修复 | STAMINA_MAX 改为函数 |
| `RankingPanel.vue` | 修复 | NPC streak 固定化 |
| `FriendList.vue` | 修复 | 经验下限 + 好感度增长 |
| `pets.js` | 修复 | 删除重复 NPC_ENEMIES |
| `GameToast.vue` | 新增 | Toast 提示组件 |

### Phase 2 改动清单

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `engine.js` | 重构 | enemyTurn 使用技能，增加阶段机制 |
| `BattleScene.vue` | 修改 | 日志不截断 + 结算面板强化 |
| `stages.js` | 修改 | Boss 增加 phase 配置 |
| `pets.js` | 修改 | 增加 behavior 和 phase 数据 |

### Phase 3 改动清单

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `store.js` | 重构 | addExp 返回候选列表，增加 addEquipment |
| `LevelUpModal.vue` | 新增 | 升级选择面板 |
| `stages.js` | 修改 | 增加掉落表 |
| `EquipmentPanel.vue` | 修复 | 装备显示和穿戴逻辑 |
| `engine.js` | 修改 | 装备属性生效 |
| `store.js` | 修改 | 金币消费、连胜状态 |

### Phase 4 改动清单

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `DungeonScene.vue` | 新增 | 秘境副本 UI |
| `dungeons.js` | 新增 | 秘境配置数据 |
| `stages.js` | 扩充 | 10 个新关卡 |
| `pets.js` | 扩充 | 10 个新敌人 + behavior |
| `DailyTasks.vue` | 新增 | 每日任务 UI |
| `tasks.js` | 新增 | 任务配置数据 |
| `Tutorial.vue` | 新增 | 新手引导 |
| `audio.js` | 新增 | 音效系统（可选） |

---

## 第四部分：优先级排序

如果时间有限，只做以下内容也能让游戏体验大幅提升：

**最低可用版本（MVP）**:
1. ✅ 修复技能升级（Phase 1.1）— 让精魄有消费出口
2. ✅ 敌人使用技能（Phase 2.1）— 让战斗有看头
3. ✅ 技能 3 选 1（Phase 3.1）— 让升级有期待感
4. ✅ 装备掉落（Phase 3.3）— 让关卡有目标

这 4 项做完，核心循环就通了：打怪 → 拿奖励 → 选技能/装备 → 打更强的怪。
