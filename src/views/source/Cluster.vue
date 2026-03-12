<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Cluster - 聚类源 API</h2>
            <p class="description">
              Cluster 源用于对矢量要素进行聚类处理。当显示大量点要素时，聚类可以将附近的点合并为一个聚合点，
              提高地图性能和可读性。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_Cluster-Cluster.html" target="_blank">
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

const isAllExpanded = computed(() => activeNames.value.length === clusterApis.length)

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = clusterApis.map(api => api.name)
  }
}

const categories = computed(() => {
  const cats = {
    all: { name: 'all', cn: '全部', count: clusterApis.length },
    overview: { name: 'overview', cn: '概述', count: 0 },
    constructor: { name: 'constructor', cn: '构造函数', count: 0 },
    methods: { name: 'methods', cn: '方法', count: 0 }
  }
  clusterApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })
  return Object.values(cats).filter(c => c.count > 0)
})

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = clusterApis.map(api => api.name)
  } else {
    activeNames.value = clusterApis.filter(api => api.category === category).map(api => api.name)
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
    return clusterApis
  }
  return clusterApis.filter(api => api.category === currentCategory.value)
})

const clusterApis = [
  {
    name: 'overview',
    cn: 'Cluster 概述',
    type: 'overview',
    category: 'overview',
    description: 'Cluster 源是对另一个矢量源的包装，用于对点要素进行空间聚类。当多个点在地图上距离较近时，聚类源会将它们合并为一个聚合要素，通常显示为带有数字的圆圈，表示该位置聚合的要素数量。这可以显著提高大量点数据的渲染性能和地图可读性。',
    usage: `// ============================================
// Cluster 概述
// ============================================
// Cluster 源特点：
// - 将附近的点要素聚合为一个聚类点
// - 提高大量点数据的渲染性能
// - 改善地图可视化效果
// - 支持自定义聚类距离和样式

// 继承关系：
// Cluster -> VectorSource -> Source

// 使用示例：
import Cluster from 'ol/source/Cluster'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import {Circle, Fill, Stroke, Style, Text} from 'ol/style'

// 创建原始数据源
const points = new VectorSource({
  url: 'points.geojson',
  format: new GeoJSON()
})

// 创建聚类源
const clusterSource = new Cluster({
  distance: 40,  // 聚类距离（像素）
  source: points
})

// 创建聚类图层
const clusterLayer = new VectorLayer({
  source: clusterSource,
  style: function(feature) {
    const size = feature.get('features').length
    return new Style({
      image: new Circle({
        radius: 15,
        fill: new Fill({color: '#3399CC'}),
        stroke: new Stroke({color: '#fff', width: 2})
      }),
      text: new Text({
        text: size.toString(),
        fill: new Fill({color: '#fff'}),
        font: 'bold 12px sans-serif'
      })
    })
  }
})`
  },
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建 Cluster 聚类源实例。需要指定一个矢量源作为数据源，并配置聚类参数。',
    usage: `// ============================================
// Cluster 构造函数
// ============================================
import Cluster from 'ol/source/Cluster'
import VectorSource from 'ol/source/Vector'

// 基础用法
const clusterSource = new Cluster({
  source: vectorSource
})

// 完整配置
const clusterSource = new Cluster({
  // 必需的矢量数据源
  source: new VectorSource({
    url: 'points.geojson',
    format: new GeoJSON()
  }),

  // 聚类距离（像素），默认 20
  distance: 40,

  // 最小聚类距离（像素），默认 0
  minDistance: 0,

  // 是否环绕世界，默认 true
  wrapX: true,

  // 版权信息
  attributions: '© Data Provider',

  // 自定义几何函数（可选）
  geometryFunction: function(feature) {
    // 返回用于聚类计算的点
    return feature.getGeometry()
  },

  // 自定义聚类创建函数（可选）
  createCluster: function(clusterCenter, features) {
    // 返回自定义聚类要素
    return new Feature({
      geometry: clusterCenter,
      features: features,
      clusterSize: features.length
    })
  }
})

// 注意：Cluster 源只能用于点要素
// 线和面要素需要特殊处理`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'Cluster 配置选项',
        children: [
          { name: 'source', type: 'VectorSource', default: 'null', description: '矢量数据源（必需）' },
          { name: 'distance', type: 'number', default: '20', description: '聚类距离（像素），在此距离内的点会被聚合' },
          { name: 'minDistance', type: 'number', default: '0', description: '最小聚类距离（像素），会被限制在 distance 以内' },
          { name: 'wrapX', type: 'boolean', default: 'true', description: '是否水平环绕世界' },
          { name: 'attributions', type: 'AttributionLike', default: undefined, description: '版权信息' },
          { name: 'geometryFunction', type: 'Function', default: undefined, description: '获取聚类计算点的函数' },
          { name: 'createCluster', type: 'Function', default: undefined, description: '创建聚类要素的函数' }
        ]
      }
    ],
    returns: { type: 'Cluster', description: '新的 Cluster 实例' }
  },
  {
    name: 'getDistance',
    cn: '获取聚类距离',
    type: 'method',
    category: 'methods',
    description: '获取当前配置的聚类距离（像素）。',
    usage: `// ============================================
// getDistance 方法
// ============================================
const distance = clusterSource.getDistance()
console.log('当前聚类距离:', distance, 'px')`,
    params: [],
    returns: { type: 'number', description: '聚类距离（像素）' }
  },
  {
    name: 'setDistance',
    cn: '设置聚类距离',
    type: 'method',
    category: 'methods',
    description: '设置聚类距离。增大距离会使更多点被聚合，减小距离会使聚类更分散。',
    usage: `// ============================================
// setDistance 方法
// ============================================
// 增大聚类距离（更聚合）
clusterSource.setDistance(60)

// 减小聚类距离（更分散）
clusterSource.setDistance(20)

// 应用场景：滑块控制聚类距离
function onDistanceChange(value) {
  clusterSource.setDistance(value)
  // 聚类会自动重新计算
}`,
    params: [
      { name: 'distance', type: 'number', default: undefined, description: '聚类距离（像素）' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getSource',
    cn: '获取源',
    type: 'method',
    category: 'methods',
    description: '返回被包装的原始矢量源。',
    usage: `// ============================================
// getSource 方法
// ============================================
const source = clusterSource.getSource()

// 访问原始数据源的要素
const features = source.getFeatures()
console.log('原始要素数量:', features.length)

// 向原始源添加要素
source.addFeature(newFeature)`,
    params: [],
    returns: { type: 'VectorSource', description: '原始矢量源' }
  },
  {
    name: 'getFeatures',
    cn: '获取要素',
    type: 'method',
    category: 'methods',
    description: '获取当前视图范围内的聚类要素数组。',
    usage: `// ============================================
// getFeatures 方法
// ============================================
const features = clusterSource.getFeatures()
console.log('聚类要素数量:', features.length)

// 每个聚类要素包含一个 features 属性
// 表示该聚类包含的原始要素数组
features.forEach(feature => {
  const clusterFeatures = feature.get('features')
  console.log('此聚类包含', clusterFeatures.length, '个要素')
})`,
    params: [],
    returns: { type: 'Array<Feature>', description: '聚类要素数组' }
  },
  {
    name: 'clear',
    cn: '清除',
    type: 'method',
    category: 'methods',
    description: '清除源中的所有要素并触发变更事件。',
    usage: `// ============================================
// clear 方法
// ============================================
// 清除聚类源（实际清除的是包装的矢量源）
clusterSource.clear()

// 等价于
clusterSource.getSource().clear()`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'refresh',
    cn: '刷新',
    type: 'method',
    category: 'methods',
    description: '刷新聚类。当底层数据发生变化且聚类未自动更新时使用。',
    usage: `// ============================================
// refresh 方法
// ============================================
// 强制重新计算聚类
clusterSource.refresh()

// 应用场景：底层数据变化后
vectorSource.addFeatures(newFeatures)
clusterSource.refresh()`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getAttributions',
    cn: '获取版权信息',
    type: 'method',
    category: 'methods',
    description: '获取源的版权信息函数。',
    usage: `// ============================================
// getAttributions 方法
// ============================================
const attributions = clusterSource.getAttributions()
console.log('版权信息:', attributions)`,
    params: [],
    returns: { type: 'AttributionFunction|string', description: '版权信息' }
  },
  {
    name: 'getState',
    cn: '获取状态',
    type: 'method',
    category: 'methods',
    description: '获取源的当前状态。',
    usage: `// ============================================
// getState 方法
// ============================================
const state = clusterSource.getState()
// 状态值：'ready' | 'loading' | 'error'`,
    params: [],
    returns: { type: 'string', description: '源状态：ready | loading | error' }
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
// 监听要素变化
clusterSource.on('change', () => {
  console.log('聚类已更新')
})

// 监听要素添加
clusterSource.on('addfeature', (event) => {
  console.log('添加聚类要素:', event.feature)
})

// 监听要素移除
clusterSource.on('removefeature', (event) => {
  console.log('移除聚类要素')
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
const listenerKey = clusterSource.on('change', handleChange)
clusterSource.un('change', listenerKey)`,
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
