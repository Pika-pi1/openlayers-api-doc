<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>OSM - OpenStreetMap 瓦片源 API</h2>
            <p class="description">
              OSM 瓦片源是用于加载 OpenStreetMap 地图瓦片的专用源。它是 XYZ 源的子类，
              预配置了 OSM 的默认 URL、版权信息和最大缩放级别，使用最简单。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_OSM-OSM.html" target="_blank">
                <el-icon><Link /></el-icon>
                官方文档
              </el-link>
            </div>
          </div>
          <div class="control-section">
            <el-button @click="toggleExpand" size="default" :type="isAllExpanded ? 'success' : 'primary'">
              <el-icon><component :is="isAllExpanded ? Folder : FolderOpened" /></el-icon>
              {{ isAllExpanded ? '全部收起' : '全部展开' }}
            </el-button>
          </div>
        </div>

        <!-- API 分类标签 -->
        <div class="api-categories">
          <el-tag
            v-for="cat in categories"
            :key="cat.name"
            :type="currentCategory === cat.name ? 'primary' : 'info'"
            effect="plain"
            class="category-tag"
            @click="filterByCategory(cat.name)"
          >
            {{ cat.cn }} ({{ cat.count }})
          </el-tag>
        </div>

        <!-- API 列表 -->
        <div class="api-list">
          <el-collapse v-model="activeNames">
            <el-collapse-item
              v-for="(api, index) in filteredApis"
              :key="api.name"
              :name="api.name"
            >
              <template #title>
                <div class="api-title">
                  <div class="api-title-left">
                    <el-tag :type="getTagType(api.type)" size="small">{{ api.type }}</el-tag>
                    <span class="api-name">{{ api.name }}</span>
                    <span class="api-cn">{{ api.cn }}</span>
                  </div>
                </div>
              </template>

              <div class="api-content">
                <!-- 参数说明 -->
                <div v-if="api.params && api.params.length" class="api-section params-section">
                  <div class="section-header">
                    <el-icon class="section-icon params-icon"><Operation /></el-icon>
                    <h4>参数说明</h4>
                  </div>
                  <el-table :data="api.params" style="width: 100%" size="small" border class="api-table" row-key="name">
                    <el-table-column prop="name" label="参数名" width="180">
                      <template #default="scope">
                        <code class="param-name">{{ scope.row.name }}</code>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="150">
                      <template #default="scope">
                        <el-tag size="small" type="info">{{ scope.row.type }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="default" label="默认值" width="120">
                      <template #default="scope">
                        <span v-if="scope.row.default" class="default-value">{{ scope.row.default }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                </div>

                <!-- 功能说明 -->
                <div class="api-section description-section">
                  <div class="section-header">
                    <el-icon class="section-icon description-icon"><Reading /></el-icon>
                    <h4>功能说明</h4>
                  </div>
                  <p class="description-text">{{ api.description }}</p>
                </div>

                <!-- 使用示例 -->
                <div class="api-section usage-section">
                  <div class="section-header">
                    <el-icon class="section-icon usage-icon"><Document /></el-icon>
                    <h4>使用示例</h4>
                  </div>
                  <pre class="code-block"><code>{{ api.usage }}</code></pre>
                </div>

                <!-- 返回值 -->
                <div v-if="api.returns" class="api-section returns-section">
                  <div class="section-header">
                    <el-icon class="section-icon returns-icon"><Select /></el-icon>
                    <h4>返回值</h4>
                  </div>
                  <div class="returns-content">
                    <el-tag size="small" type="success" class="return-type-tag">{{ api.returns.type }}</el-tag>
                    <span class="returns-desc">{{ api.returns.description }}</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Folder, FolderOpened, Link, Operation, Reading, Select } from '@element-plus/icons-vue'

// 默认展开第一个
const activeNames = ref(['overview'])
const currentCategory = ref('all')

// 展开/收起控制
const isAllExpanded = computed(() => activeNames.value.length === osmApis.length)

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = osmApis.map(api => api.name)
  }
}

// 分类过滤
const categories = computed(() => {
  const cats = {
    all: { name: 'all', cn: '全部', count: osmApis.length },
    overview: { name: 'overview', cn: '概述', count: 0 },
    constructor: { name: 'constructor', cn: '构造函数', count: 0 },
    methods: { name: 'methods', cn: '方法', count: 0 },
    properties: { name: 'properties', cn: '属性', count: 0 }
  }
  osmApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })
  return Object.values(cats).filter(c => c.count > 0)
})

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = osmApis.map(api => api.name)
  } else {
    activeNames.value = osmApis.filter(api => api.category === category).map(api => api.name)
  }
}

const getTagType = (type) => {
  const typeMap = {
    'overview': 'info',
    'class': 'primary',
    'method': 'success',
    'property': 'warning'
  }
  return typeMap[type] || 'info'
}

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') {
    return osmApis
  }
  return osmApis.filter(api => api.category === currentCategory.value)
})

// OSM API 列表
const osmApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'OSM 概述',
    type: 'overview',
    category: 'overview',
    description: 'OSM 瓦片源是用于加载 OpenStreetMap 地图瓦片的专用源。它是 XYZ 源的子类，预配置了 OSM 的默认 URL（https://tile.openstreetmap.org/{z}/{x}/{y}.png）、版权信息（© OpenStreetMap contributors）和最大缩放级别（19）。使用 OSM 源可以快速加载 OpenStreetMap 地图，无需手动配置。',
    usage: `// ============================================
// OSM 瓦片源概述
// ============================================
// OSM 是 XYZ 的子类，预配置了：
// - 默认 URL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
// - 默认版权：'© OpenStreetMap contributors'
// - 最大缩放级别：19
// - 跨域设置：'anonymous'

// OSM 继承关系：
// OSM -> XYZ -> TileImage -> TileSource -> Source

// 使用示例：
import OSM from 'ol/source/OSM'
import {Tile as TileLayer} from 'ol/layer'
import Map from 'ol/Map'
import View from 'ol/View'

// 最简单的用法（全部默认配置）
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
})

// OpenStreetMap 是全球最大的众包地图项目
// 提供免费的全球地图瓦片服务
// 使用时需遵守 OpenStreetMap 使用政策`
  },

  // ========== Properties (属性) ==========
  {
    name: 'ATTRIBUTION',
    cn: '版权信息常量',
    type: 'property',
    category: 'properties',
    description: 'OSM 源的默认版权信息常量。包含指向 OpenStreetMap 版权和许可证页面的链接。',
    usage: `// ============================================
// ATTRIBUTION 属性
// ============================================
// OSM 源的默认版权信息

import OSM from 'ol/source/OSM'

console.log('OSM 版权信息:', OSM.ATTRIBUTION)
// 输出：'<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'

// 应用场景：自定义版权显示
function displayAttributions() {
  const attributionDiv = document.getElementById('attribution')
  attributionDiv.innerHTML = OSM.ATTRIBUTION
}

// 或使用常量创建自定义源
import XYZ from 'ol/source/XYZ'

const customOSM = new XYZ({
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attributions: OSM.ATTRIBUTION
})`,
    returns: { type: 'string', description: 'OSM 版权信息字符串' }
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建 OSM 瓦片源实例。继承 XYZ 的所有配置选项，但提供了合理的默认值，大多数情况下无需配置即可使用。',
    usage: `// ============================================
// OSM 构造函数
// ============================================
import OSM from 'ol/source/OSM'
import {Tile as TileLayer} from 'ol/layer'

// 最简单的用法 - 使用所有默认值
const osmSource = new OSM()

// 完整配置
const osmSource = new OSM({
  // 默认：'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

  // 默认：19
  maxZoom: 19,

  // 默认：'anonymous'
  crossOrigin: 'anonymous',

  // 默认：'origin-when-cross-origin'
  referrerPolicy: 'origin-when-cross-origin',

  // 默认：true
  interpolate: true,

  // 默认：0.5
  reprojectionErrorThreshold: 0.5,

  // 默认：250（毫秒）
  transition: 250,

  // 默认：true（环绕世界）
  wrapX: true,

  // 默认：0
  zDirection: 0,

  // 自定义版权（默认使用 OSM.ATTRIBUTION）
  attributions: '© OpenStreetMap contributors',

  // 已废弃，建议在图层上设置
  cacheSize: undefined,

  // 自定义瓦片加载函数（可选）
  tileLoadFunction: function(tile, src) {
    const img = tile.getImage()
    img.src = src
  }
})

// 创建地图图层
const osmLayer = new TileLayer({
  source: new OSM()
})

// 提示：OSM 瓦片使用 Web Mercator 投影（EPSG:3857）
// 瓦片大小为 256x256 像素`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'OSM 配置选项',
        children: [
          { name: 'url', type: 'string', default: "'https://tile.openstreetmap.org/{z}/{x}/{y}.png'", description: '瓦片 URL 模板' },
          { name: 'crossOrigin', type: 'string', default: "'anonymous'", description: '跨域属性' },
          { name: 'referrerPolicy', type: 'string', default: "'origin-when-cross-origin'", description: 'referrerPolicy 属性' },
          { name: 'interpolate', type: 'boolean', default: 'true', description: '重采样时是否使用插值' },
          { name: 'maxZoom', type: 'number', default: '19', description: '最大缩放级别' },
          { name: 'reprojectionErrorThreshold', type: 'number', default: '0.5', description: '最大重投影误差（像素）' },
          { name: 'tileLoadFunction', type: 'Function', default: undefined, description: '自定义瓦片加载函数' },
          { name: 'transition', type: 'number', default: '250', description: '透明度过渡动画持续时间' },
          { name: 'wrapX', type: 'boolean', default: 'true', description: '是否水平环绕世界' },
          { name: 'zDirection', type: 'number', default: '0', description: '缩放级别方向选择' },
          { name: 'attributions', type: 'AttributionLike', default: 'OSM.ATTRIBUTION', description: '版权信息' },
          { name: 'cacheSize', type: 'number', default: undefined, description: '已废弃，建议在图层上设置' }
        ]
      }
    ],
    returns: { type: 'OSM', description: '新的 OSM 实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'setUrl',
    cn: '设置 URL',
    type: 'method',
    category: 'methods',
    description: '设置瓦片服务的 URL。用于动态切换 OSM 瓦片源或更新 URL 配置。继承自 XYZ 类。',
    usage: `// ============================================
// setUrl 方法
// ============================================
// 设置新的瓦片 URL

import OSM from 'ol/source/OSM'

const osmSource = new OSM()

// 切换到 OSM 的其他瓦片服务器
osmSource.setUrl('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png')

// 应用场景：负载均衡或故障切换
const servers = [
  'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
  'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
]

let currentServer = 0
function switchServer() {
  currentServer = (currentServer + 1) % servers.length
  osmSource.setUrl(servers[currentServer])
}`,
    params: [
      { name: 'url', type: 'string', default: undefined, description: '新的瓦片 URL' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'getAttributions',
    cn: '获取版权信息',
    type: 'method',
    category: 'methods',
    description: '获取 OSM 源的版权信息函数。继承自 TileSource 类。',
    usage: `// ============================================
// getAttributions 方法
// ============================================
// 获取版权信息

import OSM from 'ol/source/OSM'

const osmSource = new OSM()

const attributions = osmSource.getAttributions()
console.log('版权信息:', attributions)`,
    returns: { type: 'AttributionFunction|string', description: '版权信息' }
  },

  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'methods',
    description: '获取 OSM 源的投影坐标系。OSM 默认使用 Web Mercator 投影（EPSG:3857）。继承自 TileSource 类。',
    usage: `// ============================================
// getProjection 方法
// ============================================
// 获取投影

import OSM from 'ol/source/OSM'

const osmSource = new OSM()

const projection = osmSource.getProjection()
console.log('投影代码:', projection.getCode()) // 'EPSG:3857'`,
    returns: { type: 'Projection', description: '投影对象' }
  },

  {
    name: 'getTileGrid',
    cn: '获取瓦片网格',
    type: 'method',
    category: 'methods',
    description: '返回 OSM 源的瓦片网格对象。继承自 TileSource 类。',
    usage: `// ============================================
// getTileGrid 方法
// ============================================
// 获取瓦片网格

import OSM from 'ol/source/OSM'

const osmSource = new OSM()

const tileGrid = osmSource.getTileGrid()
const resolutions = tileGrid.getResolutions()
console.log('分辨率数量:', resolutions.length)`,
    returns: { type: 'TileGrid', description: '瓦片网格对象' }
  },

  {
    name: 'getState',
    cn: '获取状态',
    type: 'method',
    category: 'methods',
    description: '获取 OSM 源的当前状态。继承自 TileSource 类。',
    usage: `// ============================================
// getState 方法
// ============================================
const state = osmSource.getState()
console.log('当前状态:', state)
// 状态值：'ready' | 'loading' | 'error'`,
    returns: { type: 'string', description: '源状态：ready | loading | error' }
  },

  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'methods',
    description: '获取对象的版本号。每次对象修改时版本号递增。继承自 TileSource 类。',
    usage: `// ============================================
// getRevision 方法
// ============================================
const revision = osmSource.getRevision()
console.log('当前版本:', revision)`,
    returns: { type: 'number', description: '版本号' }
  },

  {
    name: 'on',
    cn: '监听事件',
    type: 'method',
    category: 'methods',
    description: '监听特定类型的事件。继承自 TileSource 类。',
    usage: `// ============================================
// on 方法 - 事件监听
// ============================================
// 监听瓦片加载完成
osmSource.on('tileloadend', () => {
  console.log('瓦片加载完成')
})

// 监听瓦片加载错误
osmSource.on('tileloaderror', () => {
  console.error('瓦片加载失败')
})`,
    params: [
      { name: 'type', type: 'string', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '回调函数' }
    ],
    returns: { type: 'string', description: '监听器键值' }
  },

  {
    name: 'un',
    cn: '移除监听',
    type: 'method',
    category: 'methods',
    description: '移除特定类型的事件监听器。继承自 TileSource 类。',
    usage: `// ============================================
// un 方法 - 移除事件监听
// ============================================
const listenerKey = osmSource.on('change', handleChange)
osmSource.un('change', listenerKey)`,
    params: [
      { name: 'type', type: 'string', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function|string', default: undefined, description: '回调函数或监听器键值' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'changed',
    cn: '触发变更',
    type: 'method',
    category: 'methods',
    description: '增加版本号并触发 change 事件。继承自 TileSource 类。',
    usage: `// ============================================
// changed 方法
// ============================================
// 通常由内部调用
osmSource.on('change', () => {
  console.log('源已变更')
})`,
    returns: { type: 'void', description: '无返回值' }
  }
]
</script>

<style lang="scss" scoped>
.api-page-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-layout {
  display: flex;
  gap: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.doc-content {
  flex: 1;
  min-width: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  .title-section {
    flex: 1;

    h2 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 24px;
      font-weight: 600;
    }

    .description {
      color: #606266;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .official-links {
      display: flex;
      gap: 10px;
    }
  }

  .control-section {
    margin-left: 20px;
  }
}

.api-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .category-tag {
    cursor: pointer;
    transition: all 0.3s;
    padding: 4px 12px;

    &:hover {
      opacity: 0.8;
    }
  }
}

.api-list {
  .el-collapse {
    border: none;
    background: transparent;

    :deep(.el-collapse-item__header) {
      padding: 12px 16px;
      margin-bottom: 12px;
      border-radius: 8px;
      background: linear-gradient(135deg, #ffffff 0%, #fafcff 100%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.3s;
      border: 1px solid #e8edf5;

      &:hover {
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
        transform: translateY(-1px);
      }

      &.is-active {
        background: linear-gradient(135deg, #e8f0ff 0%, #f0e8ff 100%);
        border-color: #409eff;
      }
    }

    :deep(.el-collapse-item__content) {
      padding: 0 16px 16px 16px;
      background: #ffffff;
      border-radius: 0 0 8px 8px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
  }
}

.api-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .api-title-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .api-name {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 15px;
      color: #303133;
      font-weight: 600;
    }

    .api-cn {
      color: #909399;
      font-size: 13px;
    }
  }
}

.api-content {
  .api-section {
    margin-bottom: 20px;

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e8edf5;

      .section-icon {
        font-size: 18px;

        &.params-icon { color: #409eff; }
        &.description-icon { color: #67c23a; }
        &.usage-icon { color: #e6a23c; }
        &.returns-icon { color: #909399; }
      }

      h4 {
        margin: 0;
        color: #303133;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }

  .param-name {
    font-family: 'Consolas', 'Monaco', monospace;
    color: #409eff;
    font-size: 13px;
  }

  .default-value {
    font-family: 'Consolas', 'Monaco', monospace;
    color: #67c23a;
    font-size: 13px;
  }

  .description-text {
    color: #606266;
    line-height: 1.8;
    margin: 0;
  }

  .code-block {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .returns-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .return-type-tag {
      font-family: 'Consolas', 'Monaco', monospace;
    }

    .returns-desc {
      color: #606266;
      font-size: 14px;
    }
  }
}

.api-table {
  :deep(.el-table__header) {
    th {
      background-color: #fafbfc;
      color: #606266;
      font-weight: 600;
    }
  }

  :deep(.el-table__row) {
    &:hover {
      background-color: #f5f7fa;
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .page-layout {
    flex-direction: column;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;

    .control-section {
      margin-left: 0;
    }
  }

  .api-categories {
    justify-content: center;
  }
}
</style>
