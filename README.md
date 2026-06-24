# 🌐 个人作品集网站

一个基于 Vue 3 的现代化个人作品集网站，集成博客系统、管理后台和两款游戏。

## 📋 项目概览

| 模块 | 说明 |
|------|------|
| 🏠 首页 | 个人介绍、技能展示、工作经历、项目展示、联系表单 |
| 📝 博客 | GitHub API 驱动的博客系统，支持 Markdown 渲染 |
| 🔧 管理后台 | 密码保护，可视化编辑所有内容 |
| 🐧 企鹅大乱斗 | 回合制 RPG 战斗游戏 |
| 🧬 Evolve | 增量文明进化游戏 |

## 🎯 功能特性

### 首页 (HomeView)
- **Hero 区域** — 个性化问候、姓名、职位、简介
- **关于我** — 技能标签展示、工作经历时间线
- **项目展示** — 卡片式项目列表，支持图标、标签、链接
- **博客预览** — 最新 3 篇文章预览
- **联系表单** — 姓名/邮箱/留言，提交后跳转 mailto
- **区块可配置** — 通过管理后台控制各区块显示/隐藏

### 博客系统 (BlogView / BlogPostView)
- **GitHub API 驱动** — 文章存储在 GitHub 仓库中
- **Markdown 渲染** — 使用 `marked` + `dompurify` 安全渲染
- **中英文支持** — 根据语言自动加载对应文章
- **响应式设计** — 移动端友好

### 管理后台 (AdminView)
- **密码保护** — 登录验证
- **内容编辑** — 可视化编辑个人信息、技能、经历、项目
- **区块控制** — 勾选显示/隐藏首页各区块
- **数据导入/导出** — JSON 格式备份和恢复
- **实时预览** — 保存后立即生效

### 国际化 (i18n)
- **中英文双语** — vue-i18n 实现
- **内容双语** — profile.json 支持 zh/en 双语字段
- **语言切换** — 导航栏一键切换

## 🐧 企鹅大乱斗

集成在网站中的回合制 RPG 战斗游戏。

### 游戏特性

| 系统 | 内容 |
|------|------|
| 技能 | 27 个（T0-T3 四层稀有度，6 大类别） |
| 武器 | 25 把（4 种类型，5 种品质，支持进化和强化） |
| 职业 | 4 个（剑魂/影刺/金刚/风行者，各 7 层技能树） |
| 境界 | 8 个（练气→飞升） |
| 关卡 | 10 个故事关卡 |
| 挑战塔 | 100 层，每日 6 次 |
| 好友 | 8 个 NPC，亲密度系统 |
| 成就 | 10 个 |
| 商店 | 7 个物品 |
| 连胜 | 连胜 3/5/7/10 触发精英/传说/神话/远古级对手 |

### 战斗机制

- **PRD 伪随机** — 暴击/闪避使用伪随机分布，消除"脸黑"
- **能量终结技** — 普攻 +10，受击 +5，满 100 释放终结技
- **权重随机 AI** — 技能/武器选择使用加权轮盘赌
- **武器特效** — 连击/眩晕/秒杀/闪避反击/休息等 10 种特效
- **技能效果** — 控制/治疗/加速/反射/DoT/多段攻击等
- **ECS 架构** — Fighter 实体 + Attribute/Action/Status/CombatStats 组件
- **木桩训练** — 可配置血量/闪避/格挡，实时 DPS 统计
- **GM 后台** — 修改属性/发放物品/快捷操作

### 测试覆盖

86 个单元测试，覆盖：
- 伤害公式计算
- 暴击/闪避/格挡/反击
- 所有 27 个技能效果
- 武器特效和进化
- 能量系统
- PRD 伪随机分布
- 状态效果持续时间
- 50 回合硬终止
- 端到端战斗模拟
- Monte Carlo 平衡性测试（1000 场）

## 🧬 Evolve

增量文明进化游戏，通过 iframe 嵌入，从原始汤进化为星际帝国。

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.5.34 | UI 框架 |
| Vite | ^8.0.12 | 构建工具 |
| Tailwind CSS | ^4.3.1 | 样式框架 |
| Vitest | ^4.1.9 | 单元测试 |
| Vue Router | ^4.6.4 | 路由管理 |
| vue-i18n | ^9.14.5 | 国际化 |
| marked | ^18.0.5 | Markdown 渲染 |
| dompurify | ^3.4.11 | HTML 净化 |

## 📁 项目结构

```
src/
├── views/                    # 页面视图
│   ├── HomeView.vue          # 首页（介绍/项目/博客/联系）
│   ├── BlogView.vue          # 博客列表
│   ├── BlogPostView.vue      # 博客文章
│   ├── AdminView.vue         # 管理后台
│   ├── GameView.vue          # 游戏主视图（Tab 系统）
│   └── EvolveView.vue        # Evolve 游戏（iframe）
├── components/
│   ├── AppHeader.vue         # 导航栏
│   ├── AppFooter.vue         # 页脚
│   ├── GlassCard.vue         # 毛玻璃卡片组件
│   ├── TypeWriter.vue        # 打字机效果
│   └── game/                 # 18 个游戏组件
│       ├── BattleScene.vue   # 战斗场景
│       ├── RandomBattle.vue  # 随机乐斗
│       ├── GameHome.vue      # 游戏主页
│       ├── SkillBook.vue     # 技能书
│       ├── WeaponBook.vue    # 武器库
│       ├── ClassTree.vue     # 职业树
│       ├── TowerScene.vue    # 斗神塔
│       ├── FriendList.vue    # 好友列表
│       ├── DummyPanel.vue    # 木桩训练
│       ├── GMPanel.vue       # GM 后台
│       └── ...
├── game/                     # 游戏核心逻辑
│   ├── engine.js             # 战斗引擎
│   ├── store.js              # 游戏状态
│   ├── ecs.js                # ECS 实体系统
│   ├── data/                 # 游戏数据（27 技能/25 武器/4 职业等）
│   └── __tests__/            # 86 个测试
├── router/                   # 路由配置
├── i18n/                     # 国际化（中/英）
├── utils/                    # 工具函数（GitHub API/Profile）
└── data/                     # 网站数据（profile.json）
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npx vitest run

# 构建生产版本
npm run build
```

## 📝 自定义

### 修改个人信息
编辑 `src/data/profile.json` 或通过管理后台 `/admin` 可视化编辑。

### 管理后台
访问 `/admin`，输入密码登录后可编辑：
- 个人资料（姓名/职位/简介）
- 技能列表
- 工作经历
- 项目展示
- 社交链接
- 首页区块显示/隐藏

### 博客
文章存储在 GitHub 仓库中，通过 GitHub API 加载。在 `src/utils/github.js` 中配置仓库信息。

### 游戏配置
- 技能数据：`src/game/data/skills.js`
- 武器数据：`src/game/data/weapons.js`
- 职业数据：`src/game/data/classes.js`
- 平衡调整：修改 `src/game/data/constants.js` 中的公式

## 📦 部署

通过 GitHub Actions 自动部署到 GitHub Pages：

- 推送到 `main` 分支自动触发
- 构建命令：`npm run build`
- 输出目录：`dist/`
- 访问地址：`https://mafter822.github.io/personal-website/`

## 📊 游戏数据统计

| 类型 | 数量 |
|------|------|
| 技能 | 27 |
| 武器 | 25 |
| 职业 | 4（各 7 层技能树 = 36 职业技能） |
| 境界 | 8 |
| 关卡 | 10 |
| 塔层数 | 100 |
| 好友 | 8 |
| 成就 | 10 |
| 商店物品 | 7 |
| 特殊遭遇 | 4 |
| 单元测试 | 86 |

## 📝 许可证

个人项目，仅供学习交流。
