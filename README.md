# Next.js + Docker 实时热更新测试项目

一个简单的 Next.js 项目，演示如何通过 Docker 部署并实现代码修改后实时更新。

## 项目结构

```
├── pages/
│   ├── index.js          # 主页面
│   └── api/
│       ├── hello.js      # 测试 API（GET）
│       └── items.js      # CRUD API（GET/POST/DELETE）
├── Dockerfile            # 多阶段构建（dev + prod）
├── docker-compose.yml    # Docker Compose 配置
└── package.json
```

## 快速开始

### 1. 本地开发（不用 Docker）

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

### 2. Docker 开发模式（实时热更新）

```bash
# 启动开发容器 — 修改代码后自动刷新
docker compose --profile dev up --build

# 访问 http://localhost:3000
# 修改 pages/ 下的文件，保存后页面自动更新
```

### 3. Docker 生产模式

```bash
docker compose --profile prod up --build
```

## API 接口

| 方法     | 路径            | 说明         |
| -------- | --------------- | ------------ |
| `GET`    | `/api/hello`    | 健康检查     |
| `GET`    | `/api/items`    | 获取所有项目 |
| `POST`   | `/api/items`    | 添加项目     |
| `DELETE` | `/api/items?id=1` | 删除项目   |

## Git → GitHub → Docker 工作流

```bash
# 1. 初始化并推送到 GitHub
git init
git add .
git commit -m "init: Next.js + Docker 项目"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main

# 2. 启动 Docker 开发容器
docker compose --profile dev up --build

# 3. 修改代码 → git commit → 容器内自动热更新
#    (因为 docker-compose 挂载了本地目录)

# 4. 推送更新到 GitHub
git add .
git commit -m "feat: 更新内容"
git push
```

## 热更新原理

开发模式下 `docker-compose.yml` 将本地 `pages/` 等目录挂载到容器内：
- 你在本地编辑文件 → 容器内文件同步变化 → Next.js dev server 检测到变化 → 自动重新编译 → 浏览器自动刷新
- Windows 环境通过 `WATCHPACK_POLLING=true` 确保文件监听正常工作
