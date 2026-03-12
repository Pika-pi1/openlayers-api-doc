<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>TileWMS - WMS 瓦片源 API</h2>
            <p class="description">
              TileWMS 源用于加载 WMS（Web Map Service）瓦片地图服务。
              它将 WMS 服务以瓦片形式加载，支持多个图层、样式和 WMS 参数配置。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_TileWMS-TileWMS.html" target="_blank">
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
import { Folder, FolderOpened, Link, Operation, Reading, Document, Select } from '@element-plus/icons-vue'

// 默认展开第一个
const activeNames = ref(['overview'])
const currentCategory = ref('all')

// 展开/收起控制
const isAllExpanded = computed(() => activeNames.value.length === tileWmsApis.length)

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = tileWmsApis.map(api => api.name)
  }
}

// 分类过滤
const categories = computed(() => {
  const cats = {
    all: { name: 'all', cn: '全部', count: tileWmsApis.length },
    overview: { name: 'overview', cn: '概述', count: 0 },
    constructor: { name: 'constructor', cn: '构造函数', count: 0 },
    methods: { name: 'methods', cn: '方法', count: 0 }
  }
  tileWmsApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })
  return Object.values(cats).filter(c => c.count > 0)
})

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = tileWmsApis.map(api => api.name)
  } else {
    activeNames.value = tileWmsApis.filter(api => api.category === category).map(api => api.name)
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
    return tileWmsApis
  }
  return tileWmsApis.filter(api => api.category === currentCategory.value)
})

// TileWMS API 列表
const tileWmsApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'TileWMS 概述',
    type: 'overview',
    category: 'overview',
    description: 'TileWMS 源用于加载 WMS（Web Map Service）瓦片地图服务。WMS 是 OGC 标准的网络地图服务规范，TileWMS 将 WMS 服务以瓦片形式加载，支持 TILED=true 参数。与 ImageWMS 不同，TileWMS 将地图分割成多个瓦片并行加载，性能更好，适合大范围地图显示。',
    usage: `// ============================================
// TileWMS 概述
// ============================================
// TileWMS 用于加载 WMS 瓦片服务
// 特点：
// - 支持 TILED=true 参数
// - 瓦片形式并行加载
// - 支持多个图层和样式
// - 可配置 WMS 请求参数

// TileWMS 继承关系：
// TileWMS -> TileImage -> TileSource -> Source

// 与 ImageWMS 的区别：
// - TileWMS: 瓦片形式加载，适合大范围
// - ImageWMS: 单张图像加载，适合小范围

// 使用示例：
import TileWMS from 'ol/source/TileWMS'
import {Tile as TileLayer} from 'ol/layer'

const wmsLayer = new TileLayer({
  source: new TileWMS({
    url: 'https://geoserver.example.com/geoserver/wms',
    params: {
      'LAYERS': 'workspace:layer',
      'TILED': true,
      'FORMAT': 'image/png'
    },
    serverType: 'geoserver',
    projection: 'EPSG:3857'
  })
})`
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建 TileWMS 瓦片源实例。通过配置选项设置 WMS 服务 URL、图层参数、服务器类型等。',
    usage: `// ============================================
// TileWMS 构造函数
// ============================================
import TileWMS from 'ol/source/TileWMS'
import {Tile as TileLayer} from 'ol/layer'

// 基础用法
const wmsSource = new TileWMS({
  url: 'https://geoserver.example.com/geoserver/wms',
  params: {
    'LAYERS': 'workspace:layer',
    'TILED': true
  }
})

// 完整配置
const wmsSource = new TileWMS({
  url: 'https://geoserver.example.com/geoserver/wms',

  // WMS 请求参数（必需至少设置 LAYERS）
  params: {
    'LAYERS': 'workspace:layer',      // 图层名称（必需）
    'TILED': true,                     // 启用瓦片
    'FORMAT': 'image/png',             // 输出格式
    'TRANSPARENT': true,               // 背景透明
    'VERSION': '1.3.0',                // WMS 版本
    'STYLES': '',                      // 样式名称
    'TIME': '2024-01-01'               // 时间维度（如有）
  },

  // 服务器类型（用于优化请求）
  serverType: 'geoserver',             // 'geoserver' | 'mapserver' | 'qgis' | 'carmentaserver'

  // 投影设置
  projection: 'EPSG:3857',

  // 瓦片网格（可选，通常自动配置）
  tileGrid: customTileGrid,

  // 跨域设置
  crossOrigin: 'anonymous',

  // 瓦片大小
  tileSize: 256,

  // 是否使用 hidpi（高分辨率）
  hidpi: true,

  // 瓦片周围留白（像素）
  gutter: 0,

  // 版权信息
  attributions: '© GeoServer Example',

  // 过渡动画（毫秒）
  transition: 250,

  // 是否环绕世界
  wrapX: true,

  // 自定义瓦片类
  tileClass: undefined,

  // 自定义加载函数
  tileLoadFunction: undefined
})

// 使用多个 URLs（负载均衡）
const wmsSource = new TileWMS({
  urls: [
    'https://server1.example.com/geoserver/wms',
    'https://server2.example.com/geoserver/wms'
  ],
  params: {
    'LAYERS': 'workspace:layer',
    'TILED': true
  }
})

// 创建图层
const wmsLayer = new TileLayer({
  source: wmsSource,
  opacity: 0.8
})`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'TileWMS 配置选项',
        children: [
          { name: 'url', type: 'string', default: undefined, description: 'WMS 服务 URL' },
          { name: 'urls', type: 'Array<string>', default: undefined, description: 'WMS 服务 URLs 数组' },
          { name: 'params', type: 'Object', default: undefined, description: 'WMS 请求参数，至少包含 LAYERS' },
          { name: 'serverType', type: 'string', default: undefined, description: "服务器类型：'geoserver' | 'mapserver' | 'qgis' | 'carmentaserver'" },
          { name: 'hidpi', type: 'boolean', default: 'true', description: '是否使用 hidpi（高分辨率）' },
          { name: 'crossOrigin', type: 'string', default: undefined, description: '跨域属性' },
          { name: 'projection', type: 'ProjectionLike', default: undefined, description: '投影坐标系' },
          { name: 'tileGrid', type: 'TileGrid', default: undefined, description: '瓦片网格' },
          { name: 'tileSize', type: 'number|Array<number>', default: '[256, 256]', description: '瓦片大小' },
          { name: 'gutter', type: 'number', default: '0', description: '瓦片周围留白（像素）' },
          { name: 'tileClass', type: 'Class', default: undefined, description: '瓦片类' },
          { name: 'tileLoadFunction', type: 'Function', default: undefined, description: '自定义瓦片加载函数' },
          { name: 'wrapX', type: 'boolean', default: 'true', description: '是否水平环绕世界' },
          { name: 'transition', type: 'number', default: '250', description: '透明度过渡动画持续时间' },
          { name: 'attributions', type: 'AttributionLike', default: undefined, description: '版权信息' },
          { name: 'attributionsCollapsible', type: 'boolean', default: 'true', description: '版权信息是否可折叠' },
          { name: 'cacheSize', type: 'number', default: undefined, description: '已废弃，建议在图层上设置' },
          { name: 'interpolate', type: 'boolean', default: 'true', description: '重采样时是否使用插值' },
          { name: 'reprojectionErrorThreshold', type: 'number', default: '0.5', description: '最大重投影误差（像素）' },
          { name: 'zDirection', type: 'number', default: '0', description: '缩放级别方向选择' }
        ]
      }
    ],
    returns: { type: 'TileWMS', description: '新的 TileWMS 实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'updateParams',
    cn: '更新参数',
    type: 'method',
    category: 'methods',
    description: '更新 WMS 请求参数。用于动态切换图层、样式或修改其他 WMS 参数，无需重新创建源。',
    usage: `// ============================================
// updateParams 方法
// ============================================
// 更新 WMS 请求参数

import TileWMS from 'ol/source/TileWMS'

const wmsSource = new TileWMS({
  url: 'https://geoserver.example.com/geoserver/wms',
  params: {
    'LAYERS': 'workspace:layer1',
    'TILED': true
  }
})

// 切换图层
wmsSource.updateParams({
  'LAYERS': 'workspace:layer2'
})

// 切换样式
wmsSource.updateParams({
  'STYLES': 'population'
})

// 修改透明度（WMS 层面的透明度）
wmsSource.updateParams({
  'TRANSPARENT': true
})

// 同时更新多个参数
wmsSource.updateParams({
  'LAYERS': 'workspace:layer1,workspace:layer2',
  'STYLES': 'default,population',
  'TIME': '2024-01-01'
})

// 应用场景：图层控制器
function toggleLayer(layerName, visible) {
  const currentLayers = wmsSource.getParams().LAYERS.split(',')
  let newLayers

  if (visible) {
    if (!currentLayers.includes(layerName)) {
      newLayers = [...currentLayers, layerName].join(',')
    }
  } else {
    newLayers = currentLayers.filter(l => l !== layerName).join(',')
  }

  wmsSource.updateParams({
    'LAYERS': newLayers
  })
}`,
    params: [
      { name: 'params', type: 'Object', default: undefined, description: '要更新的 WMS 参数对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'getUrl',
    cn: '获取 URL',
    type: 'method',
    category: 'methods',
    description: '返回当前配置的 WMS 服务 URL。',
    usage: `// ============================================
// getUrl 方法
// ============================================
const url = wmsSource.getUrl()
console.log('WMS URL:', url)`,
    returns: { type: 'string|undefined', description: 'WMS 服务 URL' }
  },

  {
    name: 'setUrl',
    cn: '设置 URL',
    type: 'method',
    category: 'methods',
    description: '设置 WMS 服务的 URL。用于动态切换 WMS 服务地址。',
    usage: `// ============================================
// setUrl 方法
// ============================================
// 设置新的 WMS URL

wmsSource.setUrl('https://backup-server.example.com/geoserver/wms')

// 应用场景：故障切换
function switchToBackup() {
  wmsSource.setUrl('https://backup.example.com/geoserver/wms')
}`,
    params: [
      { name: 'url', type: 'string', default: undefined, description: '新的 WMS URL' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'getParams',
    cn: '获取参数',
    type: 'method',
    category: 'methods',
    description: '返回当前配置的 WMS 请求参数对象。',
    usage: `// ============================================
// getParams 方法
// ============================================
const params = wmsSource.getParams()
console.log('当前参数:', params)

// 获取特定参数值
const layers = params.LAYERS
const styles = params.STYLES
console.log('图层:', layers)
console.log('样式:', styles)`,
    returns: { type: 'Object', description: 'WMS 参数对象' }
  },

  {
    name: 'getTileLoadFunction',
    cn: '获取瓦片加载函数',
    type: 'method',
    category: 'methods',
    description: '返回瓦片加载函数。继承自 TileImage 类。',
    usage: `// ============================================
// getTileLoadFunction 方法
// ============================================
const loadFn = wmsSource.getTileLoadFunction()
console.log('加载函数:', loadFn)`,
    returns: { type: 'Function', description: '瓦片加载函数' }
  },

  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'methods',
    description: '获取 TileWMS 源的投影坐标系。继承自 TileSource 类。',
    usage: `// ============================================
// getProjection 方法
// ============================================
const projection = wmsSource.getProjection()
console.log('投影代码:', projection.getCode())`,
    returns: { type: 'Projection', description: '投影对象' }
  },

  {
    name: 'getTileGrid',
    cn: '获取瓦片网格',
    type: 'method',
    category: 'methods',
    description: '返回 TileWMS 源的瓦片网格对象。继承自 TileSource 类。',
    usage: `// ============================================
// getTileGrid 方法
// ============================================
const tileGrid = wmsSource.getTileGrid()
console.log('瓦片网格:', tileGrid)`,
    returns: { type: 'TileGrid', description: '瓦片网格对象' }
  },

  {
    name: 'getState',
    cn: '获取状态',
    type: 'method',
    category: 'methods',
    description: '获取 TileWMS 源的当前状态。继承自 TileSource 类。',
    usage: `// ============================================
// getState 方法
// ============================================
const state = wmsSource.getState()
// 状态值：'ready' | 'loading' | 'error'`,
    returns: { type: 'string', description: '源状态：ready | loading | error' }
  },

  {
    name: 'getAttributions',
    cn: '获取版权信息',
    type: 'method',
    category: 'methods',
    description: '获取 TileWMS 源的版权信息函数。继承自 TileSource 类。',
    usage: `// ============================================
// getAttributions 方法
// ============================================
const attributions = wmsSource.getAttributions()
console.log('版权信息:', attributions)`,
    returns: { type: 'AttributionFunction|string', description: '版权信息' }
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
wmsSource.on('tileloadend', () => {
  console.log('瓦片加载完成')
})

// 监听瓦片加载错误
wmsSource.on('tileloaderror', () => {
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
const listenerKey = wmsSource.on('change', handleChange)
wmsSource.un('change', listenerKey)`,
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
wmsSource.on('change', () => {
  console.log('源已变更')
})`,
    returns: { type: 'void', description: '无返回值' }
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
const revision = wmsSource.getRevision()
console.log('当前版本:', revision)`,
    returns: { type: 'number', description: '版本号' }
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
