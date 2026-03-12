<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>ImageSource - 图像源 API</h2>
            <p class="description">
              ImageSource 是 OpenLayers 中所有图像源的基类，用于加载单张图像数据。
              与瓦片源不同，图像源一次性加载整张图像，适用于 WMS、静态图等场景。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_Image-ImageSource.html" target="_blank">
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
const isAllExpanded = computed(() => activeNames.value.length === imageSourceApis.length)

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = imageSourceApis.map(api => api.name)
  }
}

// 分类过滤
const categories = computed(() => {
  const cats = {
    all: { name: 'all', cn: '全部', count: imageSourceApis.length },
    overview: { name: 'overview', cn: '概述', count: 0 },
    constructor: { name: 'constructor', cn: '构造函数', count: 0 },
    methods: { name: 'methods', cn: '方法', count: 0 }
  }
  imageSourceApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })
  return Object.values(cats).filter(c => c.count > 0)
})

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = imageSourceApis.map(api => api.name)
  } else {
    activeNames.value = imageSourceApis.filter(api => api.category === category).map(api => api.name)
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
    return imageSourceApis
  }
  return imageSourceApis.filter(api => api.category === currentCategory.value)
})

// ImageSource API 列表
const imageSourceApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'ImageSource 概述',
    type: 'overview',
    category: 'overview',
    description: 'ImageSource 是 OpenLayers 中所有图像源的基类。与 TileSource（瓦片源）不同，ImageSource 一次性加载整张图像，而不是分块加载。适用于 WMS 服务、静态图片、MapGuide 等场景。ImageSource 是抽象类，通常通过其子类（如 ImageWMS、ImageStatic、ImageArcGISRest 等）使用。',
    usage: `// ============================================
// ImageSource 概述
// ============================================
// ImageSource 是所有图像源的基类，特点：
// - 一次性加载整张图像（不是分块）
// - 适用于 WMS、静态图等服务
// - 支持图像加载事件

// ImageSource 的常见子类：
// - ImageWMS: WMS 图像服务
// - ImageStatic: 静态图片
// - ImageArcGISRest: ArcGIS REST 服务
// - ImageMapGuide: MapGuide 服务

// 使用示例（通过子类）：
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'

// 创建 WMS 图像源
const wmsSource = new ImageWMS({
  url: 'https://geoserver.example.com/geoserver/wms',
  params: {
    'LAYERS': 'workspace:layer',
    'FORMAT': 'image/png'
  }
})

// 创建图像图层
const imageLayer = new ImageLayer({
  source: wmsSource
})`
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建 ImageSource 实例。由于 ImageSource 是抽象基类，通常通过其子类的构造函数间接调用。',
    usage: `// ============================================
// ImageSource 构造函数
// ============================================
// 注意：ImageSource 是抽象类，通常不直接实例化
// 以下展示其配置选项结构，实际使用通过子类

// 子类使用示例 - ImageWMS：
import ImageWMS from 'ol/source/ImageWMS'

const wmsSource = new ImageWMS({
  url: 'https://geoserver.example.com/geoserver/wms',
  params: {
    'LAYERS': 'workspace:layer',
    'FORMAT': 'image/png'
  },
  projection: 'EPSG:3857',
  serverType: 'geoserver',
  ratio: 1.5
})

// 子类使用示例 - ImageStatic：
import ImageStatic from 'ol/source/ImageStatic'

const staticSource = new ImageStatic({
  url: 'https://example.com/map.png',
  imageExtent: [0, 0, 1024, 1024],
  projection: 'EPSG:3857'
})

// 子类使用示例 - ImageArcGISRest：
import ImageArcGISRest from 'ol/source/ImageArcGISRest'

const arcgisSource = new ImageArcGISRest({
  url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export',
  ratio: 1.5
})`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'ImageSource 配置选项',
        children: [
          { name: 'attributions', type: 'AttributionLike', default: undefined, description: '版权信息' },
          { name: 'interpolate', type: 'boolean', default: 'true', description: '重采样时是否使用插值' },
          { name: 'loader', type: 'Function', default: undefined, description: '自定义图像加载函数' },
          { name: 'projection', type: 'ProjectionLike', default: undefined, description: '投影坐标系' },
          { name: 'resolutions', type: 'Array<number>', default: undefined, description: '分辨率数组' },
          { name: 'state', type: 'State', default: undefined, description: '源状态' }
        ]
      }
    ],
    returns: { type: 'ImageSource', description: '新的 ImageSource 实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'changed',
    cn: '触发变更',
    type: 'method',
    category: 'methods',
    description: '增加版本号并触发 change 事件。当源的状态发生变化时调用，通知监听者更新。',
    usage: `// ============================================
// changed 方法
// ============================================
// 通常由内部调用，用户很少直接使用

// 当源状态变化时，会自动触发
source.on('change', () => {
  console.log('源已变更，当前状态:', source.getState())
})

// 手动触发（少见场景）
source.changed()`,
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'getAttributions',
    cn: '获取版权信息',
    type: 'method',
    category: 'methods',
    description: '获取源的版权信息函数。用于显示地图数据的来源和版权声明。',
    usage: `// ============================================
// getAttributions 方法
// ============================================
// 获取版权信息

import ImageWMS from 'ol/source/ImageWMS'

const wmsSource = new ImageWMS({
  url: 'https://geoserver.example.com/geoserver/wms',
  attributions: '© GeoServer Example'
})

const attributions = wmsSource.getAttributions()
console.log('版权信息:', attributions)`,
    returns: { type: 'AttributionFunction|string', description: '版权信息' }
  },

  {
    name: 'getImage',
    cn: '获取图像',
    type: 'method',
    category: 'methods',
    description: '获取源加载的图像对象。返回 ImageCanvas 或 HTMLImageElement，用于渲染。',
    usage: `// ============================================
// getImage 方法
// ============================================
// 获取加载的图像

// 监听图像加载完成
source.on('imageloadend', () => {
  const image = source.getImage()
  if (image) {
    console.log('图像已加载:', image)
    // 可以访问图像属性
    console.log('图像尺寸:', image.width, 'x', image.height)
  }
})

// 注意：通常在图层渲染时自动调用，无需手动获取`,
    returns: { type: 'ImageCanvas|HTMLImageElement', description: '图像对象' }
  },

  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'methods',
    description: '获取源的投影坐标系。返回投影对象，用于坐标转换和地图显示。',
    usage: `// ============================================
// getProjection 方法
// ============================================
// 获取源的投影

import ImageWMS from 'ol/source/ImageWMS'

const wmsSource = new ImageWMS({
  url: 'https://geoserver.example.com/geoserver/wms',
  projection: 'EPSG:3857'
})

const projection = wmsSource.getProjection()
console.log('投影代码:', projection.getCode()) // 'EPSG:3857'
console.log('投影单位:', projection.getUnits()) // 'm'`,
    returns: { type: 'Projection', description: '投影对象' }
  },

  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'methods',
    description: '获取对象的版本号。每次对象修改时版本号递增，用于检测变化。',
    usage: `// ============================================
// getRevision 方法
// ============================================
// 获取版本号

const initialRevision = source.getRevision()
console.log('初始版本:', initialRevision)

// 当源发生变化后
source.changed()
const newRevision = source.getRevision()
console.log('新版本:', newRevision) // 比之前大 1

// 应用场景：检测源是否需要重新渲染
if (source.getRevision() !== cachedRevision) {
  // 源已变化，需要更新
  cachedRevision = source.getRevision()
  updateMap()
}`,
    returns: { type: 'number', description: '版本号' }
  },

  {
    name: 'getState',
    cn: '获取状态',
    type: 'method',
    category: 'methods',
    description: '获取源的当前状态。状态包括：ready（就绪）、loading（加载中）、error（错误）。',
    usage: `// ============================================
// getState 方法
// ============================================
// 获取源状态

// 状态枚举值：
// - 'ready': 源已就绪，图像已加载
// - 'loading': 源正在加载图像
// - 'error': 源加载出错

const state = source.getState()
console.log('当前状态:', state)

// 监听状态变化
source.on('change', () => {
  const state = source.getState()
  if (state === 'error') {
    console.error('图像源加载失败')
  } else if (state === 'ready') {
    console.log('图像源已就绪')
  }
})`,
    returns: { type: 'string', description: '源状态：ready | loading | error' }
  },

  {
    name: 'getImageLoadFunction',
    cn: '获取图像加载函数',
    type: 'method',
    category: 'methods',
    description: '返回图像加载函数。用于自定义图像加载逻辑。',
    usage: `// ============================================
// getImageLoadFunction 方法
// ============================================
// 获取当前的图像加载函数

const loadFn = source.getImageLoadFunction()
console.log('加载函数:', loadFn)

// 通常在创建源时设置自定义加载函数
import ImageStatic from 'ol/source/ImageStatic'

const source = new ImageStatic({
  url: 'https://example.com/map.png',
  imageLoadFunction: function(image, src) {
    const img = image.getImage()
    img.src = src
    // 可以添加自定义加载逻辑，如设置 crossOrigin
    img.crossOrigin = 'anonymous'
  }
})`,
    returns: { type: 'Function', description: '图像加载函数' }
  },

  {
    name: 'setImageLoadFunction',
    cn: '设置图像加载函数',
    type: 'method',
    category: 'methods',
    description: '设置图像加载函数。用于自定义图像加载逻辑，如设置跨域属性。',
    usage: `// ============================================
// setImageLoadFunction 方法
// ============================================
// 设置图像加载函数

// 自定义加载函数
const customLoader = function(image, src) {
  const img = image.getImage()
  img.src = src
  img.crossOrigin = 'anonymous' // 设置跨域
}

// 设置加载函数
source.setImageLoadFunction(customLoader)

// 推荐方式：在创建源时直接设置
import ImageStatic from 'ol/source/ImageStatic'

const source = new ImageStatic({
  url: 'https://example.com/map.png',
  imageLoadFunction: customLoader
})`,
    params: [
      { name: 'imageLoadFunction', type: 'Function', default: undefined, description: '图像加载函数' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'on',
    cn: '监听事件',
    type: 'method',
    category: 'methods',
    description: '监听特定类型的事件。支持的事件包括 change、error、propertychange、imageloadstart、imageloadend、imageloaderror 等。',
    usage: `// ============================================
// on 方法 - 事件监听
// ============================================

// 监听变更事件
source.on('change', () => {
  console.log('源已变更')
})

// 监听错误事件
source.on('error', (event) => {
  console.error('源发生错误:', event)
})

// 监听图像加载开始
source.on('imageloadstart', () => {
  console.log('开始加载图像')
})

// 监听图像加载完成
source.on('imageloadend', () => {
  console.log('图像加载完成')
})

// 监听图像加载错误
source.on('imageloaderror', () => {
  console.error('图像加载失败')
})

// 移除监听
source.un('change', listenerKey)`,
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
    description: '移除特定类型的事件监听器。用于清理不再需要的事件监听，防止内存泄漏。',
    usage: `// ============================================
// un 方法 - 移除事件监听
// ============================================

// 添加监听
const listenerKey = source.on('change', handleChange)

// ... 稍后移除监听
source.un('change', listenerKey)

// 或在组件卸载时清理
onUnmounted(() => {
  if (source) {
    source.un('imageloadend', handleImageLoadEnd)
    source.un('imageloaderror', handleImageLoadError)
  }
})`,
    params: [
      { name: 'type', type: 'string', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function|string', default: undefined, description: '回调函数或监听器键值' }
    ],
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
