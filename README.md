# OpenLayers API 文档

一个基于 Vue 3 + Vite + OpenLayers + Element Plus 的 OpenLayers API 中文文档项目。

## 🌐 在线预览

- **GitHub Pages**: https://pika-pi1.github.io/openlayers-api-doc/

## 📦 技术栈

- **框架**: Vue 3.5.13
- **构建工具**: Vite 6.2.0
- **地图库**: OpenLayers 10.4.0
- **UI 组件**: Element Plus 2.9.7
- **路由**: Vue Router 4.6.4
- **样式**: SCSS

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动开发服务器，访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
openlayersApi/
├── src/
│   ├── components/          # 公共组件
│   │   ├── Layout.vue       # 布局组件
│   │   └── MapComponent.vue # 地图组件
│   ├── views/               # 页面组件
│   │   ├── view/            # View API 文档
│   │   ├── map/             # Map API 文档
│   │   ├── layer/           # Layer API 文档
│   │   ├── source/          # Source API 文档
│   │   ├── control/         # Control API 文档
│   │   ├── interaction/     # Interaction API 文档
│   │   ├── geometry/        # Geometry API 文档
│   │   ├── format/          # Format API 文档
│   │   ├── proj/            # Projection API 文档
│   │   └── other/           # 其他 API 文档
│   ├── router/              # 路由配置
│   ├── assets/              # 静态资源
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── .github/
│   └── workflows/           # GitHub Actions 配置
│       └── deploy.yml       # 自动部署工作流
├── index.html               # HTML 模板
├── package.json             # 项目依赖
└── vite.config.js           # Vite 配置
```

## 📚 API 文档分类

### 核心模块

| 模块 | 说明 |
|------|------|
| View | 视图控制，包含中心点、缩放、旋转等 API |
| Map | 地图对象，OpenLayers 的核心类 |
| Layer | 图层，包括 Tile、Vector、Image 等 |
| Source | 数据源，定义图层的数据来源 |

### 交互与控制

| 模块 | 说明 |
|------|------|
| Control | 地图控件，如缩放按钮、比例尺等 |
| Interaction | 交互处理，如拖拽、缩放、绘制等 |

### 数据与格式

| 模块 | 说明 |
|------|------|
| Geometry | 几何图形，点、线、面等 |
| Format | 数据格式，GeoJSON、KML、WKT 等 |
| Proj | 投影转换，坐标系统处理 |

## 🔧 配置说明

### Vite 配置

项目使用 Vite 6.x，配置文件位于 `vite.config.js`：

- 基础路径：`/openlayers-api-doc/` (用于 GitHub Pages)
- 开发端口：3000
- CSS 预处理器：SCSS

### 路由配置

项目使用 Vue Router 的 **Hash 模式**，适用于 GitHub Pages 静态托管：

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

## 📝 功能特点

- ✅ 完整的 OpenLayers API 中文文档
- ✅ 详细的代码示例和注释
- ✅ 响应式布局，支持移动端
- ✅ 侧边栏导航，快速定位
- ✅ 自动构建和部署
- ✅ 保姆级教程，适合初学者

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [OpenLayers 官方文档](https://openlayers.org/en/latest/apidoc/)
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Element Plus 文档](https://element-plus.org/)
