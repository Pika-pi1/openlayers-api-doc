<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>VectorSource - 矢量数据源</h2>
            <p class="description">
              VectorSource 用于提供矢量要素数据。它管理要素集合，支持从 URL 加载数据、自定义加载器、空间索引等功能。
              VectorSource 是 VectorLayer 的数据来源，负责存储和管理地理要素。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html" target="_blank">
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
                  <el-button
                    v-if="api.type === 'method' || api.type === 'property'"
                    type="primary"
                    size="small"
                    @click.stop="showDemo(api)"
                    class="demo-btn-inline"
                  >
                    <el-icon><VideoPlay /></el-icon>
                    演示
                  </el-button>
                </div>
              </template>

              <div class="api-content">
                <!-- 描述 -->
                <div v-if="api.description" class="api-description">
                  {{ api.description }}
                </div>

                <!-- 参数说明 -->
                <div v-if="api.params && api.params.length" class="api-section params-section">
                  <div class="section-header">
                    <el-icon class="section-icon params-icon"><Operation /></el-icon>
                    <h4>参数说明</h4>
                  </div>
                  <el-table :data="api.params" style="width: 100%" size="small" border class="api-table" row-key="name">
                    <el-table-column type="expand" width="50">
                      <template #default="scope">
                        <div v-if="scope.row.children && scope.row.children.length" class="children-params">
                          <el-table :data="scope.row.children" size="small" border class="children-table">
                            <el-table-column prop="name" label="子参数" width="200">
                              <template #default="child">
                                <code class="child-param-name">{{ child.row.name }}</code>
                              </template>
                            </el-table-column>
                            <el-table-column prop="type" label="类型" width="180">
                              <template #default="child">
                                <el-tag size="small" type="info">{{ child.row.type }}</el-tag>
                              </template>
                            </el-table-column>
                            <el-table-column prop="default" label="默认值" width="140">
                              <template #default="child">
                                <span v-if="child.row.default" class="default-value">{{ child.row.default }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="description" label="说明" />
                          </el-table>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" label="参数名" width="180">
                      <template #default="scope">
                        <code class="param-name">{{ scope.row.name }}</code>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="160">
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

                <!-- 返回值 -->
                <div v-if="api.returns" class="api-section returns-section">
                  <div class="section-header">
                    <el-icon class="section-icon returns-icon"><CircleCheck /></el-icon>
                    <h4>返回值</h4>
                  </div>
                  <div class="return-content">
                    <el-tag size="small" type="success">{{ api.returns.type }}</el-tag>
                    <span class="return-desc">{{ api.returns.description }}</span>
                  </div>
                </div>

                <!-- 使用示例 -->
                <div v-if="api.usage" class="api-section usage-section">
                  <div class="section-header">
                    <el-icon class="section-icon usage-icon"><Document /></el-icon>
                    <h4>使用示例</h4>
                  </div>
                  <div class="usage-code" v-html="highlightCode(api.usage)"></div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>

    <!-- 右侧：演示面板 -->
    <div v-if="currentDemo" class="demo-panel-wrapper">
      <ViewDemoMap ref="demoMapRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Folder, FolderOpened, VideoPlay, Operation, CircleCheck, Link, Document } from '@element-plus/icons-vue'
import ViewDemoMap from '@/components/ViewDemoMap.vue'

// 展开/收起控制
const activeNames = ref([])
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? apiData.map(api => api.name) : []
}

// 分类过滤
const currentCategory = ref('all')
const categories = reactive([
  { name: 'all', cn: '全部', count: 0 },
  { name: 'constructor', cn: '构造函数', count: 0 },
  { name: 'methods', cn: '方法', count: 0 },
  { name: 'events', cn: '事件', count: 0 }
])

const filterByCategory = (category) => {
  currentCategory.value = category
}

// API 数据
const apiData = [
  {
    name: 'VectorSource',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的矢量数据源。矢量数据源用于存储和管理矢量要素。',
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '配置选项对象',
        children: [
          { name: 'attributions', type: 'AttributionLike', default: undefined, description: '归属信息' },
          { name: 'features', type: 'Array<Feature>|Collection<Feature>', default: undefined, description: '要素集合' },
          { name: 'format', type: 'FeatureFormat', default: undefined, description: '要素格式，设置 url 时必需' },
          { name: 'loader', type: 'FeatureLoader', default: undefined, description: '加载函数' },
          { name: 'overlaps', type: 'boolean', default: 'true', description: '是否允许几何重叠' },
          { name: 'strategy', type: 'LoadingStrategy', default: 'all', description: '加载策略' },
          { name: 'url', type: 'string|FeatureUrlFunction', default: undefined, description: '数据源 URL' },
          { name: 'useSpatialIndex', type: 'boolean', default: 'true', description: '是否使用空间索引' },
          { name: 'wrapX', type: 'boolean', default: 'true', description: '是否水平环绕世界' }
        ]
      }
    ],
    usage: `// ============================================
// VectorSource 构造函数使用示例
// ============================================

import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { Point, LineString, Polygon } from 'ol/geom'

// 【示例 1】创建空数据源
const vectorSource = new VectorSource()

// 【示例 2】带要素的数据源
const feature1 = new Feature(new Point([116.4, 39.9]))
const feature2 = new Feature(new LineString([[116, 39], [117, 40]]))

const vectorSource = new VectorSource({
  features: [feature1, feature2]
})

// 【示例 3】从 URL 加载 GeoJSON
const vectorSource = new VectorSource({
  url: 'data/geojson/features.geojson',
  format: new GeoJSON()
})

// 【示例 4】自定义加载器
const vectorSource = new VectorSource({
  loader: function(extent, resolution, projection) {
    // 自定义数据加载逻辑
    const xhr = new XMLHttpRequest()
    xhr.open('GET', '/api/features')
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText)
      const features = readFeatures(data)
      vectorSource.addFeatures(features)
    }
    xhr.send()
  }
})

// 【示例 5】禁用空间索引（优化大量点数据）
const vectorSource = new VectorSource({
  useSpatialIndex: false,
  features: manyPointFeatures
})`
  },
  {
    name: 'addFeature',
    cn: '添加要素',
    type: 'method',
    category: 'methods',
    description: '添加单个要素到数据源。',
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要添加的要素' }
    ],
    usage: `// ============================================
// addFeature 方法使用示例
// ============================================

import { Feature } from 'ol'
import { Point } from 'ol/geom'

// 【示例 1】添加单个要素
const feature = new Feature(new Point([116.4, 39.9]))
vectorSource.addFeature(feature)

// 【示例 2】添加带属性的要素
const cityFeature = new Feature({
  geometry: new Point([116.4, 39.9]),
  name: '北京',
  population: 2154
})
vectorSource.addFeature(cityFeature)

// 【应用场景】
// - 动态添加标记点
// - 用户绘制图形
// - 实时数据更新`
  },
  {
    name: 'addFeatures',
    cn: '批量添加要素',
    type: 'method',
    category: 'methods',
    description: '批量添加多个要素到数据源。',
    params: [
      { name: 'features', type: 'Array<Feature>', default: undefined, description: '要添加的要素数组' }
    ],
    usage: `// ============================================
// addFeatures 方法使用示例
// ============================================

// 【示例 1】批量添加要素
const features = [
  new Feature(new Point([116, 39])),
  new Feature(new Point([121, 31])),
  new Feature(new Point([113, 23]))
]
vectorSource.addFeatures(features)

// 【示例 2】从 GeoJSON 批量添加
const geojsonData = {
  type: 'FeatureCollection',
  features: [...]
}
const format = new GeoJSON()
const features = format.readFeatures(geojsonData)
vectorSource.addFeatures(features)

// 【应用场景】
// - 批量导入数据
// - 加载文件数据`
  },
  {
    name: 'removeFeature',
    cn: '移除要素',
    type: 'method',
    category: 'methods',
    description: '从数据源移除单个要素。',
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要移除的要素' }
    ],
    usage: `// ============================================
// removeFeature 方法使用示例
// ============================================

// 【示例 1】移除指定要素
const featureToRemove = vectorSource.getFeatureById('id123')
vectorSource.removeFeature(featureToRemove)

// 【示例 2】移除点击的要素
map.on('click', async (event) => {
  const features = await vectorLayer.getFeatures(event.pixel)
  if (features.length > 0) {
    vectorSource.removeFeature(features[0])
  }
})

// 【应用场景】
// - 删除选中要素
// - 清理过期数据`
  },
  {
    name: 'removeFeatures',
    cn: '批量移除要素',
    type: 'method',
    category: 'methods',
    description: '批量移除多个要素。',
    params: [
      { name: 'features', type: 'Array<Feature>', default: undefined, description: '要移除的要素数组' }
    ],
    usage: `// 【示例】批量移除要素
const featuresToRemove = vectorSource.getFeatures()
  .filter(f => f.get('type') === 'temporary')
vectorSource.removeFeatures(featuresToRemove)`
  },
  {
    name: 'clear',
    cn: '清空数据源',
    type: 'method',
    category: 'methods',
    description: '移除所有要素。',
    params: [
      { name: 'fast', type: 'boolean', default: 'false', description: '是否快速模式（跳过事件触发）' }
    ],
    usage: `// ============================================
// clear 方法使用示例
// ============================================

// 【示例 1】清空数据源
vectorSource.clear()

// 【示例 2】快速清空（不触发事件）
vectorSource.clear(true)

// 【示例 3】重置数据源
function resetSource() {
  vectorSource.clear()
  loadNewData()
}

// 【应用场景】
// - 重置地图数据
// - 切换数据图层`
  },
  {
    name: 'getFeatures',
    cn: '获取所有要素',
    type: 'method',
    category: 'methods',
    description: '获取所有要素的快照数组。',
    returns: { type: 'Array<Feature>', description: '要素数组' },
    usage: `// ============================================
// getFeatures 方法使用示例
// ============================================

// 【示例 1】获取所有要素
const allFeatures = vectorSource.getFeatures()
console.log('要素数量:', allFeatures.length)

// 【示例 2】遍历所有要素
const features = vectorSource.getFeatures()
features.forEach(feature => {
  console.log('要素 ID:', feature.getId())
  console.log('要素属性:', feature.getProperties())
})

// 【示例 3】过滤要素
const pointFeatures = vectorSource.getFeatures()
  .filter(f => f.getGeometry().getType() === 'Point')

// 【应用场景】
// - 数据统计
// - 批量处理`
  },
  {
    name: 'getFeaturesInExtent',
    cn: '获取范围内要素',
    type: 'method',
    category: 'methods',
    description: '获取指定范围内的所有要素。',
    params: [
      { name: 'extent', type: 'Extent', default: undefined, description: '范围数组 [minX, minY, maxX, maxY]' },
      { name: 'projection', type: 'Projection', default: undefined, description: '投影对象' }
    ],
    returns: { type: 'Array<Feature>', description: '范围内的要素数组' },
    usage: `// ============================================
// getFeaturesInExtent 方法使用示例
// ============================================

// 【示例 1】获取视图范围内的要素
const viewExtent = view.calculateExtent()
const features = vectorSource.getFeaturesInExtent(viewExtent)

// 【示例 2】获取北京范围内的要素
const beijingExtent = [115.5, 39.5, 117.5, 40.5]
const beijingFeatures = vectorSource.getFeaturesInExtent(beijingExtent)

// 【应用场景】
// - 可视区域数据加载
// - 区域数据统计`
  },
  {
    name: 'getFeatureById',
    cn: '按 ID 获取要素',
    type: 'method',
    category: 'methods',
    description: '根据 ID 获取要素。',
    params: [
      { name: 'id', type: 'string|number', default: undefined, description: '要素 ID' }
    ],
    returns: { type: 'Feature|null', description: '要素对象，未找到返回 null' },
    usage: `// ============================================
// getFeatureById 方法使用示例
// ============================================

// 【示例 1】按 ID 获取要素
const feature = vectorSource.getFeatureById('city-001')
if (feature) {
  console.log('找到要素:', feature.getProperties())
}

// 【示例 2】更新要素
const feature = vectorSource.getFeatureById('marker-1')
if (feature) {
  feature.setGeometry(new Point(newCoords))
}

// 【应用场景】
// - 查找特定要素
// - 更新要素数据`
  },
  {
    name: 'getFeaturesAtCoordinate',
    cn: '获取坐标处要素',
    type: 'method',
    category: 'methods',
    description: '获取指定坐标处的所有要素。',
    params: [
      { name: 'coordinate', type: 'Coordinate', default: undefined, description: '坐标 [x, y]' }
    ],
    returns: { type: 'Array<Feature>', description: '坐标处的要素数组' },
    usage: `// ============================================
// getFeaturesAtCoordinate 方法使用示例
// ============================================

// 【示例 1】获取点击处的要素
map.on('click', (event) => {
  const features = vectorSource.getFeaturesAtCoordinate(event.coordinate)
  if (features.length > 0) {
    console.log('点击到的要素:', features)
  }
})

// 【应用场景】
// - 点击查询
// - 悬停提示`
  },
  {
    name: 'forEachFeature',
    cn: '遍历要素',
    type: 'method',
    category: 'methods',
    description: '遍历所有要素，对每个要素执行回调函数。',
    params: [
      { name: 'callback', type: 'Function', default: undefined, description: '回调函数，参数为 (feature)' }
    ],
    returns: { type: '*|undefined', description: '回调返回的第一个非 undefined 值' },
    usage: `// ============================================
// forEachFeature 方法使用示例
// ============================================

// 【示例 1】遍历所有要素
vectorSource.forEachFeature((feature) => {
  console.log('要素 ID:', feature.getId())
})

// 【示例 2】查找第一个符合条件的要素
const found = vectorSource.forEachFeature((feature) => {
  if (feature.get('type') === 'target') {
    return feature  // 找到后返回
  }
})

// 【示例 3】统计
let pointCount = 0
vectorSource.forEachFeature((feature) => {
  if (feature.getGeometry().getType() === 'Point') {
    pointCount++
  }
})

// 【应用场景】
// - 批量处理要素
// - 查找特定要素`
  },
  {
    name: 'forEachFeatureInExtent',
    cn: '遍历范围内要素',
    type: 'method',
    category: 'methods',
    description: '遍历指定范围内相交的要素。',
    params: [
      { name: 'extent', type: 'Extent', default: undefined, description: '范围数组' },
      { name: 'callback', type: 'Function', default: undefined, description: '回调函数' }
    ],
    returns: { type: '*|undefined', description: '回调返回的第一个非 undefined 值' },
    usage: `// 【示例】遍历范围内要素
const extent = [115, 39, 117, 41]
vectorSource.forEachFeatureInExtent(extent, (feature) => {
  console.log('范围内的要素:', feature)
})`
  },
  {
    name: 'forEachFeatureIntersectingExtent',
    cn: '遍历相交要素',
    type: 'method',
    category: 'methods',
    description: '遍历几何与指定范围相交的要素。',
    params: [
      { name: 'extent', type: 'Extent', default: undefined, description: '范围数组' },
      { name: 'callback', type: 'Function', default: undefined, description: '回调函数' }
    ],
    returns: { type: '*|undefined', description: '回调返回的第一个非 undefined 值' },
    usage: `// 【示例】遍历相交要素
const extent = view.calculateExtent()
vectorSource.forEachFeatureIntersectingExtent(extent, (feature) => {
  // 处理可见范围内的要素
  feature.setStyle(highlightStyle)
})`
  },
  {
    name: 'getClosestFeatureToCoordinate',
    cn: '获取最近要素',
    type: 'method',
    category: 'methods',
    description: '获取离指定坐标最近的要素。',
    params: [
      { name: 'coordinate', type: 'Coordinate', default: undefined, description: '坐标' },
      { name: 'filter', type: 'Function', default: undefined, description: '过滤函数（可选）' }
    ],
    returns: { type: 'Feature|null', description: '最近的要素，未找到返回 null' },
    usage: `// ============================================
// getClosestFeatureToCoordinate 方法使用示例
// ============================================

// 【示例 1】获取最近要素
const closest = vectorSource.getClosestFeatureToCoordinate([116.4, 39.9])
if (closest) {
  console.log('最近的要素:', closest.get('name'))
}

// 【示例 2】带过滤的最近要素
const closest = vectorSource.getClosestFeatureToCoordinate(
  mouseCoordinate,
  (feature) => feature.get('type') === 'station'  // 只查找站点
)

// 【应用场景】
// - 查找最近设施
// - 吸附功能`
  },
  {
    name: 'getExtent',
    cn: '获取范围',
    type: 'method',
    category: 'methods',
    description: '获取所有要素的边界范围。',
    params: [
      { name: 'extent', type: 'Extent', default: undefined, description: '可选的目标范围数组' }
    ],
    returns: { type: 'Extent|null', description: '范围数组 [minX, minY, maxX, maxY]' },
    usage: `// 【示例】获取要素范围
const extent = vectorSource.getExtent()
if (extent) {
  console.log('要素范围:', extent)
  // 适配视图到要素范围
  view.fit(extent)
}`
  },
  {
    name: 'hasFeature',
    cn: '检查要素',
    type: 'method',
    category: 'methods',
    description: '检查数据源是否包含指定要素。',
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要检查的要素' }
    ],
    returns: { type: 'boolean', description: 'true 表示包含，false 表示不包含' },
    usage: `// 【示例】检查要素是否存在
if (vectorSource.hasFeature(myFeature)) {
  console.log('要素存在于数据源中')
}`
  },
  {
    name: 'getFeaturesCollection',
    cn: '获取要素集合',
    type: 'method',
    category: 'methods',
    description: '获取底层要素集合（如果使用了 Collection）。',
    returns: { type: 'Collection<Feature>|null', description: '要素集合或 null' },
    usage: `// 【示例】获取要素集合
const collection = vectorSource.getFeaturesCollection()
if (collection) {
  collection.on('add', (event) => {
    console.log('要素被添加到集合')
  })
}`
  },
  {
    name: 'getUrl',
    cn: '获取 URL',
    type: 'method',
    category: 'methods',
    description: '获取数据源的 URL。',
    returns: { type: 'string|FeatureUrlFunction|undefined', description: 'URL 或 URL 函数' },
    usage: `// 【示例】获取 URL
const url = vectorSource.getUrl()
console.log('数据源 URL:', url)`
  },
  {
    name: 'setUrl',
    cn: '设置 URL',
    type: 'method',
    category: 'methods',
    description: '设置新的数据源 URL 并重新加载数据。',
    params: [
      { name: 'url', type: 'string|FeatureUrlFunction', default: undefined, description: '新的 URL' }
    ],
    usage: `// ============================================
// setUrl 方法使用示例
// ============================================

// 【示例 1】切换数据源
vectorSource.setUrl('data/new-data.geojson')

// 【示例 2】动态 URL
function loadCityData(cityName) {
  const url = \`data/cities/\${cityName}.geojson\`
  vectorSource.setUrl(url)
}

// 【应用场景】
// - 切换数据源
// - 动态加载数据`
  },
  {
    name: 'setLoader',
    cn: '设置加载器',
    type: 'method',
    category: 'methods',
    description: '设置自定义加载函数。',
    params: [
      { name: 'loader', type: 'FeatureLoader', default: undefined, description: '加载函数' }
    ],
    usage: `// ============================================
// setLoader 方法使用示例
// ============================================

// 【示例】设置自定义加载器
vectorSource.setLoader(function(extent, resolution, projection) {
  // 自定义数据加载逻辑
  fetch(\`/api/data?extent=\${extent}\`)
    .then(res => res.json())
    .then(data => {
      const features = readFeatures(data)
      vectorSource.addFeatures(features)
    })
})`
  },
  {
    name: 'getFormat',
    cn: '获取格式',
    type: 'method',
    category: 'methods',
    description: '获取数据源使用的要素格式。',
    returns: { type: 'FeatureFormat|null', description: '格式对象' },
    usage: `// 【示例】获取格式
const format = vectorSource.getFormat()
console.log('数据格式:', format?.constructor.name)`
  },
  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'methods',
    description: '获取数据源的投影。',
    returns: { type: 'Projection|null', description: '投影对象' },
    usage: `// 【示例】获取投影
const projection = vectorSource.getProjection()
console.log('投影:', projection?.getCode())`
  },
  {
    name: 'getState',
    cn: '获取状态',
    type: 'method',
    category: 'methods',
    description: '获取数据源的当前状态。',
    returns: { type: 'State', description: '状态值：ready, loading, error' },
    usage: `// 【示例】获取状态
const state = vectorSource.getState()
console.log('数据源状态:', state)`
  },
  {
    name: 'setAttributions',
    cn: '设置归属信息',
    type: 'method',
    category: 'methods',
    description: '设置数据源的归属信息。',
    params: [
      { name: 'attributions', type: 'AttributionLike', default: undefined, description: '归属信息' }
    ],
    usage: `// 【示例】设置归属信息
vectorSource.setAttributions('数据来源：© OpenStreetMap contributors')`
  },
  {
    name: 'getAttributions',
    cn: '获取归属信息',
    type: 'method',
    category: 'methods',
    description: '获取归属信息函数。',
    returns: { type: 'Attribution', description: '归属函数' },
    usage: `// 【示例】获取归属信息
const attributions = vectorSource.getAttributions()`
  },
  {
    name: 'removeLoadedExtent',
    cn: '移除已加载范围',
    type: 'method',
    category: 'methods',
    description: '移除已加载的数据范围，强制重新加载。',
    params: [
      { name: 'extent', type: 'Extent', default: undefined, description: '范围数组' }
    ],
    usage: `// 【示例】移除已加载范围
vectorSource.removeLoadedExtent(view.calculateExtent())
// 下次视图变化时会重新加载该范围`
  },
  {
    name: 'changed',
    cn: '触发变更事件',
    type: 'method',
    category: 'methods',
    description: '增加修订号并触发 change 事件。',
    usage: `// 【示例】手动触发变更
vectorSource.changed()
// 通知监听器数据已更新`
  },
  {
    name: 'get',
    cn: '获取属性',
    type: 'method',
    category: 'methods',
    description: '获取属性值。',
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性名' }
    ],
    returns: { type: '*', description: '属性值' },
    usage: `// 【示例】获取属性
const customValue = vectorSource.get('customKey')`
  },
  {
    name: 'set',
    cn: '设置属性',
    type: 'method',
    category: 'methods',
    description: '设置属性值。',
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性名' },
      { name: 'value', type: '*', default: undefined, description: '属性值' },
      { name: 'silent', type: 'boolean', default: 'false', description: '是否静默' }
    ],
    usage: `// 【示例】设置属性
vectorSource.set('lastUpdated', Date.now())`
  },
  {
    name: 'getProperties',
    cn: '获取所有属性',
    type: 'method',
    category: 'methods',
    description: '获取所有属性的对象。',
    returns: { type: 'Properties', description: '属性对象' },
    usage: `// 【示例】获取所有属性
const props = vectorSource.getProperties()
console.log('所有属性:', props)`
  },
  {
    name: 'setProperties',
    cn: '批量设置属性',
    type: 'method',
    category: 'methods',
    description: '批量设置属性。',
    params: [
      { name: 'values', type: 'Properties', default: undefined, description: '属性对象' },
      { name: 'silent', type: 'boolean', default: 'false', description: '是否静默' }
    ],
    usage: `// 【示例】批量设置属性
vectorSource.setProperties({
  dataSource: 'openstreetmap',
  lastUpdate: '2024-01-01'
})`
  },
  {
    name: 'unset',
    cn: '删除属性',
    type: 'method',
    category: 'methods',
    description: '删除属性。',
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性名' },
      { name: 'silent', type: 'boolean', default: 'false', description: '是否静默' }
    ],
    usage: `// 【示例】删除属性
vectorSource.unset('customKey')`
  },
  {
    name: 'getKeys',
    cn: '获取属性名列表',
    type: 'method',
    category: 'methods',
    description: '获取所有属性名的列表。',
    returns: { type: 'Array<string>', description: '属性名数组' },
    usage: `// 【示例】获取属性名列表
const keys = vectorSource.getKeys()
console.log('属性名:', keys)`
  },
  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'methods',
    description: '获取对象的版本号。',
    returns: { type: 'number', description: '版本号' },
    usage: `// 【示例】获取版本号
const revision = vectorSource.getRevision()
console.log('版本号:', revision)`
  },
  {
    name: 'on',
    cn: '监听事件',
    type: 'method',
    category: 'methods',
    description: '监听特定类型的事件。',
    params: [
      { name: 'type', type: 'string|Array<string>', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '回调函数' }
    ],
    returns: { type: 'EventsKey|Array<EventsKey>', description: '事件键' },
    usage: `// ============================================
// on 方法使用示例（监听事件）
// ============================================

// 【示例 1】监听要素添加
vectorSource.on('addfeature', (event) => {
  console.log('添加了要素:', event.feature)
})

// 【示例 2】监听数据加载完成
vectorSource.on('featuresloadend', () => {
  console.log('数据加载完成')
})

// 【示例 3】监听错误
vectorSource.on('error', (event) => {
  console.error('数据源错误:', event)
})`
  },
  {
    name: 'once',
    cn: '监听一次事件',
    type: 'method',
    category: 'methods',
    description: '监听特定类型的事件，只触发一次。',
    params: [
      { name: 'type', type: 'string|Array<string>', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '回调函数' }
    ],
    returns: { type: 'EventsKey|Array<EventsKey>', description: '事件键' },
    usage: `// 【示例】监听一次加载完成
vectorSource.once('featuresloadend', () => {
  console.log('首次加载完成')
})`
  },
  {
    name: 'un',
    cn: '取消监听',
    type: 'method',
    category: 'methods',
    description: '取消特定类型事件的监听。',
    params: [
      { name: 'type', type: 'string|Array<string>', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '回调函数' }
    ],
    usage: `// 【示例】取消监听
vectorSource.un('change', handler)`
  },
  {
    name: 'dispatchEvent',
    cn: '触发事件',
    type: 'method',
    category: 'methods',
    description: '触发事件并调用所有监听器。',
    params: [
      { name: 'event', type: 'BaseEvent|string', default: undefined, description: '事件对象或类型' }
    ],
    returns: { type: 'boolean|undefined', description: '是否被阻止' },
    usage: `// 【示例】触发自定义事件
vectorSource.dispatchEvent('myCustomEvent')`
  },
  {
    name: 'addfeature',
    cn: '要素添加事件',
    type: 'event',
    category: 'events',
    description: '当添加新要素时触发。',
    usage: `// 【示例】监听要素添加
vectorSource.on('addfeature', (event) => {
  console.log('新要素:', event.feature)
  console.log('要素类型:', event.feature.getGeometry().getType())
})`
  },
  {
    name: 'changefeature',
    cn: '要素变更事件',
    type: 'event',
    category: 'events',
    description: '当要素发生变化时触发。',
    usage: `// 【示例】监听要素变更
vectorSource.on('changefeature', (event) => {
  console.log('要素变更:', event.feature)
})`
  },
  {
    name: 'removefeature',
    cn: '要素移除事件',
    type: 'event',
    category: 'events',
    description: '当移除要素时触发。',
    usage: `// 【示例】监听要素移除
vectorSource.on('removefeature', (event) => {
  console.log('移除要素:', event.feature)
})`
  },
  {
    name: 'featuresloadstart',
    cn: '要素加载开始事件',
    type: 'event',
    category: 'events',
    description: '当开始加载要素时触发。',
    usage: `// 【示例】监听加载开始
vectorSource.on('featuresloadstart', () => {
  console.log('开始加载数据...')
  loadingIndicator.show()
})`
  },
  {
    name: 'featuresloadend',
    cn: '要素加载结束事件',
    type: 'event',
    category: 'events',
    description: '当要素加载完成时触发。',
    usage: `// 【示例】监听加载结束
vectorSource.on('featuresloadend', () => {
  console.log('数据加载完成')
  loadingIndicator.hide()
})`
  },
  {
    name: 'featuresloaderror',
    cn: '要素加载错误事件',
    type: 'event',
    category: 'events',
    description: '当要素加载出错时触发。',
    usage: `// 【示例】监听加载错误
vectorSource.on('featuresloaderror', (event) => {
  console.error('数据加载失败:', event)
  showError('无法加载地图数据')
})`
  },
  {
    name: 'clear',
    cn: '清空事件',
    type: 'event',
    category: 'events',
    description: '当调用 clear 方法清空数据源时触发。',
    usage: `// 【示例】监听清空
vectorSource.on('clear', () => {
  console.log('数据源已清空')
})`
  },
  {
    name: 'change',
    cn: '变更事件',
    type: 'event',
    category: 'events',
    description: '当数据源发生任何变化时触发。',
    usage: `// 【示例】监听变更
vectorSource.on('change', () => {
  console.log('数据源已变更')
  console.log('版本号:', vectorSource.getRevision())
})`
  },
  {
    name: 'propertychange',
    cn: '属性变更事件',
    type: 'event',
    category: 'events',
    description: '当属性发生变化时触发。',
    usage: `// 【示例】监听属性变更
vectorSource.on('propertychange', (event) => {
  console.log('属性变更:', event.key, '=', event.value)
})`
  },
  {
    name: 'error',
    cn: '错误事件',
    type: 'event',
    category: 'events',
    description: '当发生错误时触发。',
    usage: `// 【示例】监听错误
vectorSource.on('error', (event) => {
  console.error('数据源错误:', event)
})`
  }
]

// 计算分类数量
categories.forEach(cat => {
  if (cat.name === 'all') {
    cat.count = apiData.length
  } else {
    cat.count = apiData.filter(api => api.category === cat.name).length
  }
})

// 计算属性
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') {
    return apiData
  }
  return apiData.filter(api => api.category === currentCategory.value)
})

// 获取标签类型
const getTagType = (type) => {
  const typeMap = {
    constructor: 'danger',
    method: 'primary',
    property: 'success',
    event: 'warning'
  }
  return typeMap[type] || 'info'
}

// 代码高亮（简单版本）
const highlightCode = (code) => {
  return code
    .replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>')
    .replace(/\b(import|from|const|let|var|function|return|if|else|for|while|new|async|await)\b/g, '<span class="code-keyword">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="code-literal">$1</span>')
    .replace(/'[^']*'/g, '<span class="code-string">$&</span>')
    .replace(/"[^"]*"/g, '<span class="code-string">$&</span>')
}

// 演示相关
const currentDemo = ref(null)
const demoMapRef = ref(null)

const showDemo = (api) => {
  currentDemo.value = api
  // 滚动到演示面板
  setTimeout(() => {
    const demoPanel = document.querySelector('.demo-panel-wrapper')
    if (demoPanel) {
      demoPanel.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}
</script>

<style lang="scss" scoped>
.api-page-container {
  display: flex;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  gap: 20px;
}

.page-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.doc-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;

  .title-section {
    flex: 1;

    h2 {
      margin: 0 0 12px 0;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .description {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }

    .official-links {
      display: flex;
      gap: 12px;
    }
  }

  .control-section {
    margin-left: 20px;
  }
}

.api-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .category-tag {
    cursor: pointer;
    padding: 6px 16px;
    font-size: 13px;
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.api-list {
  .el-collapse {
    border: none;
    background: transparent;

    :deep(.el-collapse-item__header) {
      border: none;
      background: #f8f9fa;
      margin-bottom: 8px;
      border-radius: 8px;
      padding: 12px 16px;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: #e9ecef;
      }

      &.is-active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: #fff;
      }
    }

    :deep(.el-collapse-item__content) {
      padding: 16px;
      background: #fff;
      border-radius: 8px;
      margin-top: 4px;
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
    gap: 12px;
    flex: 1;

    .api-name {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }

    .api-cn {
      color: #666;
      font-size: 14px;
    }
  }

  .demo-btn-inline {
    opacity: 0;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  &:hover .demo-btn-inline {
    opacity: 1;
  }
}

.api-content {
  .api-description {
    margin-bottom: 20px;
    padding: 12px 16px;
    background: #f8f9fa;
    border-left: 4px solid #667eea;
    border-radius: 4px;
    color: #333;
    line-height: 1.6;
  }

  .api-section {
    margin-top: 20px;
    padding: 16px;
    border-radius: 8px;

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .section-icon {
        font-size: 18px;

        &.params-icon {
          color: #409eff;
        }

        &.returns-icon {
          color: #67c23a;
        }

        &.usage-icon {
          color: #909399;
        }
      }

      h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #333;
      }
    }
  }

  .returns-section {
    background: #f0f9ff;
    border: 1px solid #e1f3d8;

    .return-content {
      display: flex;
      align-items: center;
      gap: 12px;

      .return-desc {
        color: #666;
        font-size: 14px;
      }
    }
  }

  .usage-section {
    background: #f5f7fa;
    border: 1px solid #e4e7ed;

    .usage-code {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;

      :deep(.code-comment) {
        color: #6a9955;
      }

      :deep(.code-keyword) {
        color: #569cd6;
      }

      :deep(.code-literal) {
        color: #569cd6;
      }

      :deep(.code-string) {
        color: #ce9178;
      }
    }
  }
}

.api-table {
  :deep(.el-table__header th) {
    background: #f5f7fa;
    font-weight: 600;
  }

  .param-name,
  .child-param-name {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    color: #409eff;
  }

  .default-value {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    color: #67c23a;
  }
}

.children-params {
  padding: 12px;
  background: #fafafa;

  .children-table {
    :deep(.el-table__header th) {
      background: #eee;
    }
  }
}

.demo-panel-wrapper {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 400px;
  z-index: 100;
}

// 响应式
@media (max-width: 1200px) {
  .demo-panel-wrapper {
    position: static;
    width: 100%;
    margin-top: 20px;
  }
}
</style>
