<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>BingMaps - 必应地图源 API</h2>
            <p class="description">
              BingMaps 源用于加载微软必应地图的瓦片服务。必应地图提供多种影像类型，
              包括道路图、航拍图、混合图等，需要 API Key 才能使用。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_BingMaps-BingMaps.html" target="_blank">
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

                <div class="api-section description-section">
                  <div class="section-header">
                    <el-icon class="section-icon description-icon"><Reading /></el-icon>
                    <h4>功能说明</h4>
                  </div>
                  <p class="description-text">{{ api.description }}</p>
                </div>

                <div class="api-section usage-section">
                  <div class="section-header">
                    <el-icon class="section-icon usage-icon"><Document /></el-icon>
                    <h4>使用示例</h4>
                  </div>
                  <pre class="code-block"><code>{{ api.usage }}</code></pre>
                </div>

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

const activeNames = ref(['overview'])
const currentCategory = ref('all')

const isAllExpanded = computed(() => activeNames.value.length === bingMapsApis.length)

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = bingMapsApis.map(api => api.name)
  }
}

const categories = computed(() => {
  const cats = {
    all: { name: 'all', cn: '全部', count: bingMapsApis.length },
    overview: { name: 'overview', cn: '概述', count: 0 },
    constructor: { name: 'constructor', cn: '构造函数', count: 0 },
    methods: { name: 'methods', cn: '方法', count: 0 }
  }
  bingMapsApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })
  return Object.values(cats).filter(c => c.count > 0)
})

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = bingMapsApis.map(api => api.name)
  } else {
    activeNames.value = bingMapsApis.filter(api => api.category === category).map(api => api.name)
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
    return bingMapsApis
  }
  return bingMapsApis.filter(api => api.category === currentCategory.value)
})

const bingMapsApis = [
  {
    name: 'overview',
    cn: 'BingMaps 概述',
    type: 'overview',
    category: 'overview',
    description: 'BingMaps 源用于加载微软必应地图的瓦片服务。必应地图提供多种影像类型（imagerySet），包括道路图（Road）、航拍图（Aerial）、混合图（AerialWithLabels）、暗色模式（CanvasDark）等。使用 BingMaps 需要申请 Microsoft Bing Maps API Key。',
    usage: `// ============================================
// BingMaps 概述
// ============================================
// BingMaps 提供多种影像类型：
// - Road: 道路图（默认）
// - Aerial: 卫星航拍图
// - AerialWithLabels: 卫星图 + 标注
// - AerialWithLabelsOnDemand: 按需卫星标注图
// - CanvasDark: 暗色模式
// - CanvasLight: 浅色模式
// - CanvasGray: 灰色模式
// - OrdnanceSurvey: 英国测量局地图

// 继承关系：
// BingMaps -> XYZ -> TileImage -> TileSource -> Source

// 需要 API Key：
// 1. 访问 https://www.bingmapsportal.com/
// 2. 注册微软账号
// 3. 创建新的 API Key

// 使用示例：
import BingMaps from 'ol/source/BingMaps'
import {Tile as TileLayer} from 'ol/layer'

const bingLayer = new TileLayer({
  source: new BingMaps({
    key: 'your-bing-maps-api-key',  // 必需
    imagerySet: 'Road',             // 影像类型
    maxZoom: 19,
    crossOrigin: 'anonymous'
  })
})`
  },
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建 BingMaps 瓦片源实例。需要提供 Bing Maps API Key 和影像类型配置。',
    usage: `// ============================================
// BingMaps 构造函数
// ============================================
import BingMaps from 'ol/source/BingMaps'
import {Tile as TileLayer} from 'ol/layer'

// 基础用法
const bingSource = new BingMaps({
  key: 'your-bing-maps-api-key',
  imagerySet: 'Road'
})

// 完整配置
const bingSource = new BingMaps({
  // 必需的 API Key
  key: 'your-bing-maps-api-key',

  // 影像类型（必需）
  imagerySet: 'Road',

  // 文化代码（语言/地区）
  culture: 'zh-CN',

  // 最大缩放级别
  maxZoom: 19,

  // 是否使用高分辨率
  hidpi: false,

  // 是否环绕世界
  wrapX: true,

  // 重采样插值
  interpolate: true,

  // 跨域设置
  crossOrigin: 'anonymous',

  // 版权信息
  attributions: '© Bing Maps',

  // 过渡动画（毫秒）
  transition: 250,

  // 自定义 URL（可选）
  url: 'https://dev.virtualearth.net/REST/v1/Imagery/Metadata/',

  // 占位符瓦片（当超出最大级别时显示）
  placeholderTiles: false
})

// 创建图层
const bingLayer = new TileLayer({
  source: bingSource,
  opacity: 1
})

// 注意：
// - API Key 是必需的，没有 Key 无法加载瓦片
// - 文化代码影响标注语言，如 'en-us'、'zh-CN'、'ja-JP'`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'BingMaps 配置选项',
        children: [
          { name: 'key', type: 'string', default: undefined, description: 'Bing Maps API Key（必需）' },
          { name: 'imagerySet', type: 'string', default: undefined, description: '影像类型：Road | Aerial | AerialWithLabels | CanvasDark 等' },
          { name: 'culture', type: 'string', default: "'en-us'", description: '文化代码（语言/地区），如 zh-CN、ja-JP' },
          { name: 'maxZoom', type: 'number', default: '21', description: '最大缩放级别' },
          { name: 'hidpi', type: 'boolean', default: 'false', description: '是否使用高分辨率瓦片' },
          { name: 'wrapX', type: 'boolean', default: 'true', description: '是否水平环绕世界' },
          { name: 'interpolate', type: 'boolean', default: 'true', description: '重采样时是否使用插值' },
          { name: 'crossOrigin', type: 'string', default: undefined, description: '跨域属性' },
          { name: 'placeholderTiles', type: 'boolean', default: undefined, description: '超出最大级别时是否显示占位符瓦片' },
          { name: 'url', type: 'string', default: "'https://dev.virtualearth.net/REST/v1/Imagery/Metadata/'", description: 'Bing Map Metadata API URL' },
          { name: 'tileLoadFunction', type: 'Function', default: undefined, description: '自定义瓦片加载函数' },
          { name: 'cacheSize', type: 'number', default: undefined, description: '已废弃，建议在图层上设置' },
          { name: 'transition', type: 'number', default: '250', description: '透明度过渡动画持续时间' },
          { name: 'zDirection', type: 'number', default: '0', description: '缩放级别方向选择' },
          { name: 'reprojectionErrorThreshold', type: 'number', default: '0.5', description: '最大重投影误差（像素）' }
        ]
      }
    ],
    returns: { type: 'BingMaps', description: '新的 BingMaps 实例' }
  },
  {
    name: 'setKey',
    cn: '设置 API Key',
    type: 'method',
    category: 'methods',
    description: '设置 Bing Maps API Key。用于动态切换 API Key。',
    usage: `// ============================================
// setKey 方法
// ============================================
// 设置新的 API Key
bingSource.setKey('new-api-key')

// 应用场景：从配置服务动态获取 Key
fetch('/api/map-config')
  .then(res => res.json())
  .then(config => {
    bingSource.setKey(config.bingMapsKey)
  })`,
    params: [
      { name: 'key', type: 'string', default: undefined, description: '新的 Bing Maps API Key' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'setImagerySet',
    cn: '设置影像类型',
    type: 'method',
    category: 'methods',
    description: '设置影像类型。用于动态切换不同的地图样式（如从道路图切换到卫星图）。',
    usage: `// ============================================
// setImagerySet 方法
// ============================================
// 切换到卫星图
bingSource.setImagerySet('Aerial')

// 切换到混合图（卫星 + 标注）
bingSource.setImagerySet('AerialWithLabels')

// 切换到暗色模式
bingSource.setImagerySet('CanvasDark')

// 应用场景：图层切换器
function switchImagerySet(type) {
  bingSource.setImagerySet(type)
  // 源会自动重新加载新类型的瓦片
}

// 影像类型列表：
// - Road: 道路图
// - Aerial: 卫星航拍图
// - AerialWithLabels: 卫星图 + 标注
// - CanvasDark: 暗色模式
// - CanvasLight: 浅色模式
// - CanvasGray: 灰色模式`,
    params: [
      { name: 'imagerySet', type: 'string', default: undefined, description: '影像类型名称' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getKey',
    cn: '获取 API Key',
    type: 'method',
    category: 'methods',
    description: '返回当前配置的 API Key。',
    usage: `// ============================================
// getKey 方法
// ============================================
const key = bingSource.getKey()
console.log('当前 API Key:', key)`,
    params: [],
    returns: { type: 'string', description: '当前的 Bing Maps API Key' }
  },
  {
    name: 'getImagerySet',
    cn: '获取影像类型',
    type: 'method',
    category: 'methods',
    description: '返回当前配置的影像类型。',
    usage: `// ============================================
// getImagerySet 方法
// ============================================
const imagerySet = bingSource.getImagerySet()
console.log('当前影像类型:', imagerySet)`,
    params: [],
    returns: { type: 'string', description: '当前影像类型' }
  },
  {
    name: 'getAttributions',
    cn: '获取版权信息',
    type: 'method',
    category: 'methods',
    description: '获取 BingMaps 源的版权信息函数。',
    usage: `// ============================================
// getAttributions 方法
// ============================================
const attributions = bingSource.getAttributions()
console.log('版权信息:', attributions)`,
    params: [],
    returns: { type: 'AttributionFunction|string', description: '版权信息' }
  },
  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'methods',
    description: '获取 BingMaps 源的投影坐标系。BingMaps 默认使用 Web Mercator 投影（EPSG:3857）。',
    usage: `// ============================================
// getProjection 方法
// ============================================
const projection = bingSource.getProjection()
console.log('投影代码:', projection.getCode()) // 'EPSG:3857'`,
    params: [],
    returns: { type: 'Projection', description: '投影对象' }
  },
  {
    name: 'getTileGrid',
    cn: '获取瓦片网格',
    type: 'method',
    category: 'methods',
    description: '返回 BingMaps 源的瓦片网格对象。',
    usage: `// ============================================
// getTileGrid 方法
// ============================================
const tileGrid = bingSource.getTileGrid()
console.log('瓦片网格:', tileGrid)`,
    params: [],
    returns: { type: 'TileGrid', description: '瓦片网格对象' }
  },
  {
    name: 'getState',
    cn: '获取状态',
    type: 'method',
    category: 'methods',
    description: '获取 BingMaps 源的当前状态。',
    usage: `// ============================================
// getState 方法
// ============================================
const state = bingSource.getState()
// 状态值：'ready' | 'loading' | 'error'`,
    params: [],
    returns: { type: 'string', description: '源状态：ready | loading | error' }
  },
  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'methods',
    description: '获取对象的版本号。',
    usage: `// ============================================
// getRevision 方法
// ============================================
const revision = bingSource.getRevision()
console.log('当前版本:', revision)`,
    params: [],
    returns: { type: 'number', description: '版本号' }
  },
  {
    name: 'on',
    cn: '监听事件',
    type: 'method',
    category: 'methods',
    description: '监听特定类型的事件。',
    usage: `// ============================================
// on 方法 - 事件监听
// ============================================
// 监听瓦片加载完成
bingSource.on('tileloadend', () => {
  console.log('瓦片加载完成')
})

// 监听瓦片加载错误
bingSource.on('tileloaderror', () => {
  console.error('瓦片加载失败')
})

// 监听变更事件
bingSource.on('change', () => {
  console.log('源已变更')
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
    description: '移除特定类型的事件监听器。',
    usage: `// ============================================
// un 方法 - 移除事件监听
// ============================================
const listenerKey = bingSource.on('change', handleChange)
bingSource.un('change', listenerKey)`,
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
    description: '增加版本号并触发 change 事件。',
    usage: `// ============================================
// changed 方法
// ============================================
// 通常由内部调用
bingSource.on('change', () => {
  console.log('源已变更')
})`,
    params: [],
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
