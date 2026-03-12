<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>WMTS - Web Map Tile Service API</h2>
            <p class="description">
              WMTS（Web Map Tile Service）是 OGC 标准的瓦片地图服务规范。
              WMTS 源用于加载符合 OGC WMTS 标准的瓦片地图服务，支持 KVP 和 REST 两种请求编码方式。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_WMTS-WMTS.html" target="_blank">
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
const isAllExpanded = computed(() => activeNames.value.length === wmtsApis.length)

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = wmtsApis.map(api => api.name)
  }
}

// 分类过滤
const categories = computed(() => {
  const cats = {
    all: { name: 'all', cn: '全部', count: wmtsApis.length },
    overview: { name: 'overview', cn: '概述', count: 0 },
    constructor: { name: 'constructor', cn: '构造函数', count: 0 },
    methods: { name: 'methods', cn: '方法', count: 0 },
    functions: { name: 'functions', cn: '工具函数', count: 0 }
  }
  wmtsApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })
  return Object.values(cats).filter(c => c.count > 0)
})

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = wmtsApis.map(api => api.name)
  } else {
    activeNames.value = wmtsApis.filter(api => api.category === category).map(api => api.name)
  }
}

const getTagType = (type) => {
  const typeMap = {
    'overview': 'info',
    'class': 'primary',
    'method': 'success',
    'property': 'warning',
    'function': 'danger'
  }
  return typeMap[type] || 'info'
}

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') {
    return wmtsApis
  }
  return wmtsApis.filter(api => api.category === currentCategory.value)
})

// WMTS API 列表
const wmtsApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'WMTS 概述',
    type: 'overview',
    category: 'overview',
    description: 'WMTS（Web Map Tile Service）是 OGC（Open Geospatial Consortium）制定的瓦片地图服务国际标准。WMTS 源用于加载符合 OGC WMTS 标准的瓦片地图服务，支持 KVP（Key-Value Pair）和 REST 两种请求编码方式。WMTS 服务通常提供 capabilities 文档，描述可用的图层、样式、坐标系和瓦片矩阵等信息。',
    usage: `// ============================================
// WMTS 概述
// ============================================
// WMTS 是 OGC 标准的瓦片地图服务协议
// 支持两种请求方式：
// - KVP: Key-Value Pair（键值对），如 ?Service=WMTS&Request=GetTile
// - REST: RESTful 风格的 URL 路径

// WMTS 继承关系：
// WMTS -> TileImage -> TileSource -> Source

// WMTS 特点：
// 1. 标准化：遵循 OGC 标准，互操作性强
// 2. 多源支持：可从多个 URL 获取瓦片
// 3. 灵活配置：支持自定义瓦片矩阵集
// 4. 解析 capabilities: 可从 WMTS 服务自动获取配置

// 使用示例：
import WMTS from 'ol/source/WMTS'
import {Tile as TileLayer} from 'ol/layer'

const wmtsLayer = new TileLayer({
  source: new WMTS({
    url: 'https://example.com/geoserver/gwc/service/wmts',
    layer: 'workspace:layername',
    matrixSet: 'EPSG:3857',
    format: 'image/png',
    requestEncoding: 'KVP',
    projection: 'EPSG:3857',
    tileGrid: createTileGrid() // 需要自定义瓦片网格
  })
})`
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建 WMTS 瓦片源实例。通过配置选项设置 WMTS 服务 URL、图层名称、矩阵集、请求方式等参数。',
    usage: `// ============================================
// WMTS 构造函数
// ============================================
import WMTS from 'ol/source/WMTS'
import TileGrid from 'ol/tilegrid/TileGrid'
import {get as getProjection} from 'ol/proj'
import {extentFromProjection} from 'ol/proj/projections'

// 基础用法
const wmtsSource = new WMTS({
  url: 'https://example.com/geoserver/gwc/service/wmts',
  layer: 'workspace:layername',
  matrixSet: 'EPSG:3857',
  format: 'image/png',
  requestEncoding: 'KVP',
  projection: 'EPSG:3857'
})

// 完整配置
const projection = getProjection('EPSG:3857')
const projectionExtent = projection.getExtent()
const matrixIds = new Array(14)
const resolutions = new Array(14)

for (let i = 0; i < 14; i++) {
  matrixIds[i] = i.toString()
  resolutions[i] = 156543.0339 * Math.pow(2, i)
}

const tileGrid = new TileGrid({
  origin: [-20037508.34, 20037508.34],
  resolutions: resolutions,
  matrixIds: matrixIds
})

const wmtsSource = new WMTS({
  url: 'https://example.com/geoserver/gwc/service/wmts',
  layer: 'workspace:layername',
  matrixSet: 'EPSG:3857',
  format: 'image/png',
  projection: projection,
  tileGrid: tileGrid,
  style: 'default',
  requestEncoding: 'KVP',
  crossOrigin: 'anonymous',
  transition: 250,
  attributions: '© Example WMTS Service'
})

// 使用多个 URLs（负载均衡）
const wmtsSource = new WMTS({
  urls: [
    'https://server1.example.com/wmts',
    'https://server2.example.com/wmts'
  ],
  layer: 'basemap',
  matrixSet: 'EPSG:3857',
  format: 'image/png'
})`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'WMTS 配置选项',
        children: [
          { name: 'url', type: 'string', default: undefined, description: 'WMTS 服务 URL' },
          { name: 'urls', type: 'Array<string>', default: undefined, description: 'WMTS 服务 URLs 数组' },
          { name: 'layer', type: 'string', default: undefined, description: '图层名称（必需）' },
          { name: 'style', type: 'string', default: undefined, description: '样式名称' },
          { name: 'matrixSet', type: 'string', default: undefined, description: '矩阵集名称' },
          { name: 'format', type: 'string', default: "'image/jpeg'", description: '图像格式' },
          { name: 'version', type: 'string', default: "'1.0.0'", description: 'WMTS 版本' },
          { name: 'requestEncoding', type: 'string', default: "'KVP'", description: '请求编码：KVP 或 REST' },
          { name: 'projection', type: 'ProjectionLike', default: undefined, description: '投影坐标系' },
          { name: 'tileGrid', type: 'TileGrid', default: undefined, description: '瓦片网格' },
          { name: 'dimensions', type: 'Object', default: undefined, description: '额外维度参数' },
          { name: 'crossOrigin', type: 'string', default: undefined, description: '跨域属性' },
          { name: 'referrerPolicy', type: 'string', default: undefined, description: 'referrerPolicy 属性' },
          { name: 'interpolate', type: 'boolean', default: 'true', description: '重采样时是否使用插值' },
          { name: 'tilePixelRatio', type: 'number', default: '1', description: '瓦片像素比例' },
          { name: 'tileClass', type: 'Class', default: undefined, description: '瓦片类' },
          { name: 'tileLoadFunction', type: 'Function', default: undefined, description: '自定义瓦片加载函数' },
          { name: 'wrapX', type: 'boolean', default: 'true', description: '是否水平环绕世界' },
          { name: 'transition', type: 'number', default: '250', description: '透明度过渡动画持续时间' },
          { name: 'zDirection', type: 'number', default: '0', description: '缩放级别方向选择' },
          { name: 'attributions', type: 'AttributionLike', default: undefined, description: '版权信息' },
          { name: 'attributionsCollapsible', type: 'boolean', default: 'true', description: '版权信息是否可折叠' },
          { name: 'cacheSize', type: 'number', default: undefined, description: '已废弃，建议在图层上设置' },
          { name: 'reprojectionErrorThreshold', type: 'number', default: '0.5', description: '最大重投影误差（像素）' }
        ]
      }
    ],
    returns: { type: 'WMTS', description: '新的 WMTS 实例' }
  },

  // ========== Functions (工具函数) ==========
  {
    name: 'optionsFromCapabilities',
    cn: '从 Capabilities 生成配置',
    type: 'function',
    category: 'functions',
    description: '从 WMTS Capabilities 文档生成源配置选项。这是 WMTS 模块提供的工具函数，用于解析 WMTS 服务的 capabilities XML 文档，自动提取图层、样式、矩阵集等信息，简化配置过程。',
    usage: `// ============================================
// optionsFromCapabilities 函数
// ============================================
// 从 WMTS Capabilities 生成配置选项
import {optionsFromCapabilities} from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'

// 1. 获取 WMTS Capabilities XML
// 可以通过 fetch 请求获取
fetch('https://example.com/geoserver/gwc/service/wmts?service=WMTS&request=GetCapabilities')
  .then(response => response.text())
  .then(xml => {
    // 2. 解析 Capabilities
    const parser = new WMTSCapabilities()
    const capabilities = parser.read(xml)

    // 3. 生成源配置
    const options = optionsFromCapabilities(capabilities, {
      layer: 'workspace:layername',  // 必需的图层名称
      matrixSet: 'EPSG:3857',        // 可选，默认使用第一个
      style: 'default',              // 可选
      format: 'image/png'            // 可选
    })

    // 4. 创建 WMTS 源
    const wmtsSource = new WMTS(options)
  })
  .catch(error => console.error('获取 Capabilities 失败:', error))

// optionsFromCapabilities 参数：
// - wmtsCap: Capabilities 解析后的对象
// - config: 配置对象
//   - layer: 图层名称（必需）
//   - matrixSet: 矩阵集名称（可选）
//   - style: 样式名称（可选）
//   - format: 图像格式（可选）

// 返回值：WMTS 源配置对象，如果图层未找到则返回 null

// 注意：返回的配置可以直接传递给 WMTS 构造函数
// 如果需要自定义某些参数，可以合并配置：
const customOptions = {
  ...options,
  crossOrigin: 'anonymous',
  transition: 250
}`,
    params: [
      { name: 'wmtsCap', type: 'Object', default: undefined, description: 'WMTS Capabilities 解析后的对象' },
      {
        name: 'config',
        type: 'Object',
        default: undefined,
        description: '配置选项',
        children: [
          { name: 'layer', type: 'string', default: undefined, description: '图层名称（必需）' },
          { name: 'matrixSet', type: 'string', default: undefined, description: '矩阵集名称' },
          { name: 'style', type: 'string', default: undefined, description: '样式名称' },
          { name: 'format', type: 'string', default: undefined, description: '图像格式' }
        ]
      }
    ],
    returns: { type: 'Object|null', description: 'WMTS 源配置对象，图层未找到时返回 null' }
  },

  // ========== Methods (方法) ==========
  // 继承自 TileImage 和 TileSource 的方法
  {
    name: 'setUrl',
    cn: '设置 URL',
    type: 'method',
    category: 'methods',
    description: '设置 WMTS 服务的 URL。用于动态切换 WMTS 服务地址。继承自 TileImage 类。',
    usage: `// ============================================
// setUrl 方法
// ============================================
// 设置新的 WMTS URL

import WMTS from 'ol/source/WMTS'

const wmtsSource = new WMTS({
  url: 'https://server1.example.com/wmts',
  layer: 'basemap',
  matrixSet: 'EPSG:3857'
})

// 切换到备用服务器
wmtsSource.setUrl('https://server2.example.com/wmts')`,
    params: [
      { name: 'url', type: 'string', default: undefined, description: '新的 WMTS URL' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'setUrls',
    cn: '设置 URLs',
    type: 'method',
    category: 'methods',
    description: '设置多个 WMTS 服务 URL。请求会在多个 URL 之间分布，实现负载均衡。继承自 TileImage 类。',
    usage: `// ============================================
// setUrls 方法
// ============================================
// 设置多个 WMTS URLs（负载均衡）

const urls = [
  'https://server1.example.com/wmts',
  'https://server2.example.com/wmts',
  'https://server3.example.com/wmts'
]

wmtsSource.setUrls(urls)

// 请求会自动在多个 URL 之间分布`,
    params: [
      { name: 'urls', type: 'Array<string>', default: undefined, description: 'WMTS URLs 数组' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'getUrls',
    cn: '获取 URLs',
    type: 'method',
    category: 'methods',
    description: '返回当前配置的 URLs 数组。继承自 TileImage 类。',
    usage: `// ============================================
// getUrls 方法
// ============================================
const urls = wmtsSource.getUrls()
console.log('WMTS URLs:', urls)`,
    returns: { type: 'Array<string>', description: 'URL 数组' }
  },

  {
    name: 'getAttributions',
    cn: '获取版权信息',
    type: 'method',
    category: 'methods',
    description: '获取 WMTS 源的版权信息函数。继承自 TileSource 类。',
    usage: `// ============================================
// getAttributions 方法
// ============================================
const attributions = wmtsSource.getAttributions()
console.log('版权信息:', attributions)`,
    returns: { type: 'AttributionFunction|string', description: '版权信息' }
  },

  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'methods',
    description: '获取 WMTS 源的投影坐标系。继承自 TileSource 类。',
    usage: `// ============================================
// getProjection 方法
// ============================================
const projection = wmtsSource.getProjection()
console.log('投影代码:', projection.getCode())`,
    returns: { type: 'Projection', description: '投影对象' }
  },

  {
    name: 'getTileGrid',
    cn: '获取瓦片网格',
    type: 'method',
    category: 'methods',
    description: '返回 WMTS 源的瓦片网格对象。继承自 TileSource 类。',
    usage: `// ============================================
// getTileGrid 方法
// ============================================
const tileGrid = wmtsSource.getTileGrid()
console.log('瓦片网格:', tileGrid)

// 获取矩阵 ID 数组
const matrixIds = tileGrid.getMatrixIds()
console.log('矩阵 ID:', matrixIds)`,
    returns: { type: 'TileGrid', description: '瓦片网格对象' }
  },

  {
    name: 'getState',
    cn: '获取状态',
    type: 'method',
    category: 'methods',
    description: '获取 WMTS 源的当前状态。继承自 TileSource 类。',
    usage: `// ============================================
// getState 方法
// ============================================
const state = wmtsSource.getState()
console.log('当前状态:', state)
// 状态值：'ready' | 'loading' | 'error'`,
    returns: { type: 'string', description: '源状态：ready | loading | error' }
  },

  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'methods',
    description: '获取对象的版本号。继承自 TileSource 类。',
    usage: `// ============================================
// getRevision 方法
// ============================================
const revision = wmtsSource.getRevision()
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
wmtsSource.on('tileloadend', () => {
  console.log('瓦片加载完成')
})

// 监听瓦片加载错误
wmtsSource.on('tileloaderror', () => {
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
const listenerKey = wmtsSource.on('change', handleChange)
wmtsSource.un('change', listenerKey)`,
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
wmtsSource.on('change', () => {
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
