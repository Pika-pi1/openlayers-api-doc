<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>TileLayer - 瓦片图层</h2>
            <p class="description">
              TileLayer 用于创建预渲染的瓦片图像图层，按缩放级别组织。适合展示卫星影像、地形图、街道地图等瓦片数据源。
              支持瓦片预加载、缓存管理、错误时 interim 瓦片回退等功能。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_layer_Tile-TileLayer.html" target="_blank">
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
                <div v-if="api.description" class="api-description">{{ api.description }}</div>
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
                                <el-tag
                                  v-if="hasRoute(child.row.type)"
                                  size="small"
                                  type="primary"
                                  effect="plain"
                                  class="clickable-type"
                                  @click.stop="navigateToRoute(getRoute(child.row.type))"
                                >
                                  {{ child.row.type }}
                                </el-tag>
                                <el-tag v-else size="small" type="info">
                                  {{ child.row.type }}
                                </el-tag>
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
                        <el-tag
                          v-if="hasRoute(scope.row.type)"
                          size="small"
                          type="primary"
                          effect="plain"
                          class="clickable-type"
                          @click.stop="navigateToRoute(getRoute(scope.row.type))"
                        >
                          {{ scope.row.type }}
                        </el-tag>
                        <el-tag v-else size="small" type="info">
                          {{ scope.row.type }}
                        </el-tag>
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
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Folder, FolderOpened, Operation, CircleCheck, Link, Document } from '@element-plus/icons-vue'
import { getRoute, hasRoute } from '@/utils/apiRoutes'

const router = useRouter()

const activeNames = ref([])
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? apiData.map(api => api.name) : []
}

const currentCategory = ref('all')
const categories = reactive([
  { name: 'all', cn: '全部', count: 0 },
  { name: 'constructor', cn: '构造函数', count: 0 },
  { name: 'method', cn: '方法', count: 0 },
  { name: 'property', cn: '属性', count: 0 }
])

const filterByCategory = (category) => {
  currentCategory.value = category
}

const apiData = [
  {
    name: 'TileLayer',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的瓦片图层，用于展示预渲染的瓦片图像。',
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '配置选项对象',
        children: [
          { name: 'className', type: 'string', default: "'ol-layer'", description: 'CSS 类名' },
          { name: 'opacity', type: 'number', default: '1', description: '图层透明度（0-1）' },
          { name: 'visible', type: 'boolean', default: 'true', description: '是否可见' },
          { name: 'extent', type: 'Extent', default: undefined, description: '图层渲染的边界范围' },
          { name: 'zIndex', type: 'number', default: undefined, description: '图层渲染的 Z 索引' },
          { name: 'minResolution', type: 'number', default: undefined, description: '最小分辨率（包含）' },
          { name: 'maxResolution', type: 'number', default: undefined, description: '最大分辨率（不包含）' },
          { name: 'minZoom', type: 'number', default: undefined, description: '最小缩放级别（不包含）' },
          { name: 'maxZoom', type: 'number', default: undefined, description: '最大缩放级别（包含）' },
          { name: 'preload', type: 'number', default: '0', description: '预加载瓦片的级别' },
          { name: 'source', type: 'TileSource', default: undefined, description: '瓦片数据源' },
          { name: 'map', type: 'Map', default: undefined, description: '将图层设置为地图覆盖层' },
          { name: 'background', type: 'string|Object', default: undefined, description: '图层背景色' },
          { name: 'useInterimTilesOnError', type: 'boolean', default: 'true', description: '错误时使用 interim 瓦片（已废弃）' },
          { name: 'properties', type: 'Object', default: undefined, description: '任意可观察属性' },
          { name: 'cacheSize', type: 'number', default: '512', description: '内部瓦片缓存大小' }
        ]
      }
    ],
    usage: `// ============================================
// TileLayer 构造函数使用示例
// ============================================

import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'

// 【示例 1】基础 OSM 瓦片图层
const osmLayer = new TileLayer({
  source: new OSM()
})

// 【示例 2】XYZ 瓦片图层（如高德地图）
const xyzLayer = new TileLayer({
  source: new XYZ({
    url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=2&x={x}&y={y}&z={z}',
    subdomains: ['1', '2', '3', '4'],
    maxZoom: 18
  })
})

// 【示例 3】带预加载的瓦片图层
const preloadLayer = new TileLayer({
  source: new OSM(),
  preload: 2,  // 预加载 2 个级别的瓦片
  opacity: 0.8
})

// 【示例 4】限制缩放范围的瓦片图层
const limitedLayer = new TileLayer({
  source: new OSM(),
  minZoom: 5,
  maxZoom: 15,
  minResolution: 100,
  maxResolution: 5000
})

// 【示例 5】多数据源瓦片图层
const multiSourceLayer = new TileLayer({
  sources: [
    new OSM(),
    new XYZ({
      url: 'https://example.com/tiles/{z}/{x}/{y}.png'
    })
  ]
})`
  },
  {
    name: 'getSource',
    cn: '获取数据源',
    type: 'method',
    category: 'method',
    description: '获取图层的瓦片数据源。',
    returns: { type: 'TileSource|null', description: '瓦片数据源，如果未设置则返回 null' },
    usage: `// 【示例】获取数据源
const source = tileLayer.getSource()
console.log('当前数据源:', source)`
  },
  {
    name: 'setSource',
    cn: '设置数据源',
    type: 'method',
    category: 'method',
    description: '设置图层的瓦片数据源。',
    params: [
      { name: 'source', type: 'TileSource', default: undefined, description: '瓦片数据源' }
    ],
    usage: `// 【示例】切换数据源
const newSource = new OSM()
tileLayer.setSource(newSource)`
  },
  {
    name: 'getOpacity',
    cn: '获取透明度',
    type: 'method',
    category: 'method',
    description: '获取图层的透明度值。',
    returns: { type: 'number', description: '透明度值（0-1）' },
    usage: `// 【示例】获取透明度
const opacity = tileLayer.getOpacity()
console.log('当前透明度:', opacity)`
  },
  {
    name: 'setOpacity',
    cn: '设置透明度',
    type: 'method',
    category: 'method',
    description: '设置图层的透明度。',
    params: [
      { name: 'opacity', type: 'number', default: undefined, description: '透明度值（0-1）' }
    ],
    usage: `// 【示例】设置透明度
tileLayer.setOpacity(0.5)  // 半透明`
  },
  {
    name: 'getVisible',
    cn: '获取可见性',
    type: 'method',
    category: 'method',
    description: '获取图层的可见性状态。',
    returns: { type: 'boolean', description: '是否可见' },
    usage: `// 【示例】获取可见性
const visible = tileLayer.getVisible()
console.log('图层是否可见:', visible)`
  },
  {
    name: 'setVisible',
    cn: '设置可见性',
    type: 'method',
    category: 'method',
    description: '设置图层的可见性。',
    params: [
      { name: 'visible', type: 'boolean', default: undefined, description: '是否可见' }
    ],
    usage: `// 【示例】设置可见性
tileLayer.setVisible(false)  // 隐藏图层
tileLayer.setVisible(true)   // 显示图层`
  },
  {
    name: 'getZIndex',
    cn: '获取 Z 索引',
    type: 'method',
    category: 'method',
    description: '获取图层的渲染 Z 索引。',
    returns: { type: 'number|undefined', description: 'Z 索引值' },
    usage: `// 【示例】获取 Z 索引
const zIndex = tileLayer.getZIndex()
console.log('当前 Z 索引:', zIndex)`
  },
  {
    name: 'setZIndex',
    cn: '设置 Z 索引',
    type: 'method',
    category: 'method',
    description: '设置图层的渲染 Z 索引，用于控制图层渲染顺序。',
    params: [
      { name: 'zindex', type: 'number', default: undefined, description: 'Z 索引值' }
    ],
    usage: `// 【示例】设置 Z 索引
tileLayer.setZIndex(10)  // 设置较高的 Z 索引，使图层在其他图层之上`
  },
  {
    name: 'getExtent',
    cn: '获取范围',
    type: 'method',
    category: 'method',
    description: '获取图层的渲染范围。',
    returns: { type: 'Extent|undefined', description: '范围数组 [minX, minY, maxX, maxY]' },
    usage: `// 【示例】获取范围
const extent = tileLayer.getExtent()
console.log('当前范围:', extent)`
  },
  {
    name: 'setExtent',
    cn: '设置范围',
    type: 'method',
    category: 'method',
    description: '设置图层的渲染范围，图层不会在此范围外渲染。',
    params: [
      { name: 'extent', type: 'Extent', default: undefined, description: '范围数组 [minX, minY, maxX, maxY]' }
    ],
    usage: `// 【示例】设置范围
tileLayer.setExtent([100, 30, 120, 45])  // [minX, minY, maxX, maxY]`
  },
  {
    name: 'getMinZoom',
    cn: '获取最小缩放级别',
    type: 'method',
    category: 'method',
    description: '获取图层的最小缩放级别。',
    returns: { type: 'number', description: '最小缩放级别' },
    usage: `// 【示例】获取最小缩放级别
const minZoom = tileLayer.getMinZoom()
console.log('最小缩放级别:', minZoom)`
  },
  {
    name: 'setMinZoom',
    cn: '设置最小缩放级别',
    type: 'method',
    category: 'method',
    description: '设置图层的最小缩放级别（包含）。',
    params: [
      { name: 'minZoom', type: 'number', default: undefined, description: '最小缩放级别' }
    ],
    usage: `// 【示例】设置最小缩放级别
tileLayer.setMinZoom(5)  // 缩放级别 5 及以上可见`
  },
  {
    name: 'getMaxZoom',
    cn: '获取最大缩放级别',
    type: 'method',
    category: 'method',
    description: '获取图层的最大缩放级别。',
    returns: { type: 'number', description: '最大缩放级别' },
    usage: `// 【示例】获取最大缩放级别
const maxZoom = tileLayer.getMaxZoom()
console.log('最大缩放级别:', maxZoom)`
  },
  {
    name: 'setMaxZoom',
    cn: '设置最大缩放级别',
    type: 'method',
    category: 'method',
    description: '设置图层的最大缩放级别（包含）。',
    params: [
      { name: 'maxZoom', type: 'number', default: undefined, description: '最大缩放级别' }
    ],
    usage: `// 【示例】设置最大缩放级别
tileLayer.setMaxZoom(18)  // 缩放级别 18 及以下可见`
  },
  {
    name: 'getMinResolution',
    cn: '获取最小分辨率',
    type: 'method',
    category: 'method',
    description: '获取图层的最小分辨率。',
    returns: { type: 'number', description: '最小分辨率' },
    usage: `// 【示例】获取最小分辨率
const minResolution = tileLayer.getMinResolution()
console.log('最小分辨率:', minResolution)`
  },
  {
    name: 'setMinResolution',
    cn: '设置最小分辨率',
    type: 'method',
    category: 'method',
    description: '设置图层的最小分辨率（包含）。',
    params: [
      { name: 'minResolution', type: 'number', default: undefined, description: '最小分辨率' }
    ],
    usage: `// 【示例】设置最小分辨率
tileLayer.setMinResolution(100)  // 分辨率 100 及以上可见`
  },
  {
    name: 'getMaxResolution',
    cn: '获取最大分辨率',
    type: 'method',
    category: 'method',
    description: '获取图层的最大分辨率。',
    returns: { type: 'number', description: '最大分辨率' },
    usage: `// 【示例】获取最大分辨率
const maxResolution = tileLayer.getMaxResolution()
console.log('最大分辨率:', maxResolution)`
  },
  {
    name: 'setMaxResolution',
    cn: '设置最大分辨率',
    type: 'method',
    category: 'method',
    description: '设置图层的最大分辨率（不包含）。',
    params: [
      { name: 'maxResolution', type: 'number', default: undefined, description: '最大分辨率' }
    ],
    usage: `// 【示例】设置最大分辨率
tileLayer.setMaxResolution(5000)  // 分辨率 5000 以下可见`
  },
  {
    name: 'getPreload',
    cn: '获取预加载级别',
    type: 'method',
    category: 'method',
    description: '获取预加载瓦片的级别。',
    returns: { type: 'number', description: '预加载级别' },
    usage: `// 【示例】获取预加载级别
const preload = tileLayer.getPreload()
console.log('预加载级别:', preload)`
  },
  {
    name: 'setPreload',
    cn: '设置预加载级别',
    type: 'method',
    category: 'method',
    description: '设置预加载瓦片的级别。',
    params: [
      { name: 'preload', type: 'number', default: undefined, description: '预加载级别' }
    ],
    usage: `// 【示例】设置预加载级别
tileLayer.setPreload(2)  // 预加载 2 个级别的瓦片，减少加载等待`
  },
  {
    name: 'getData',
    cn: '获取像素数据',
    type: 'method',
    category: 'method',
    description: '获取指定像素位置的数据。返回 Uint8ClampedArray、Uint8Array、Float32Array 或 null。',
    params: [
      { name: 'pixel', type: 'Pixel', default: undefined, description: '像素坐标 [x, y]' }
    ],
    returns: { type: 'Uint8ClampedArray|Uint8Array|Float32Array|null', description: '像素数据' },
    usage: `// 【示例】获取像素数据
map.on('click', (e) => {
  const pixel = e.pixel
  const data = tileLayer.getData(pixel)
  console.log('像素数据:', data)
})`
  },
  {
    name: 'isVisible',
    cn: '检查是否可见',
    type: 'method',
    category: 'method',
    description: '检查图层在给定视图下是否可见。',
    params: [
      { name: 'view', type: 'View', default: undefined, description: '视图对象' }
    ],
    returns: { type: 'boolean', description: '图层在视图下是否可见' },
    usage: `// 【示例】检查图层是否可见
const isVisible = tileLayer.isVisible(map.getView())
console.log('图层在当前视图下是否可见:', isVisible)`
  },
  {
    name: 'getAttributions',
    cn: '获取归属信息',
    type: 'method',
    category: 'method',
    description: '获取图层的归属信息。',
    params: [
      { name: 'view', type: 'View', default: undefined, description: '视图对象' }
    ],
    returns: { type: 'Array<string>', description: '归属信息数组' },
    usage: `// 【示例】获取归属信息
const attributions = tileLayer.getAttributions(map.getView())
console.log('归属信息:', attributions)`
  },
  {
    name: 'opacity',
    cn: '透明度属性',
    type: 'property',
    category: 'property',
    description: '图层透明度，取值范围 0-1。默认值为 1（完全不透明）。',
    usage: `// 【示例】通过属性设置透明度
tileLayer.set('opacity', 0.6)`
  },
  {
    name: 'visible',
    cn: '可见性属性',
    type: 'property',
    category: 'property',
    description: '图层可见性。默认值为 true。',
    usage: `// 【示例】通过属性设置可见性
tileLayer.set('visible', false)`
  },
  {
    name: 'zIndex',
    cn: 'Z 索引属性',
    type: 'property',
    category: 'property',
    description: '图层渲染的 Z 索引，用于控制图层顺序。数值越大越靠上。',
    usage: `// 【示例】通过属性设置 Z 索引
tileLayer.set('zIndex', 10)`
  },
  {
    name: 'extent',
    cn: '范围属性',
    type: 'property',
    category: 'property',
    description: '图层渲染的边界范围。图层不会在此范围外渲染。',
    usage: `// 【示例】通过属性设置范围
tileLayer.set('extent', [100, 30, 120, 45])`
  },
  {
    name: 'preload',
    cn: '预加载属性',
    type: 'property',
    category: 'property',
    description: '预加载瓦片的级别。0 表示不预加载。值越大预加载越多，但会增加带宽消耗。',
    usage: `// 【示例】通过属性设置预加载
tileLayer.set('preload', 2)`
  }
]

categories.forEach(cat => {
  if (cat.name === 'all') {
    cat.count = apiData.length
  } else {
    cat.count = apiData.filter(api => api.category === cat.name).length
  }
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') {
    return apiData
  }
  return apiData.filter(api => api.category === currentCategory.value)
})

const getTagType = (type) => {
  const typeMap = {
    constructor: 'danger',
    method: 'primary',
    property: 'success',
    event: 'warning'
  }
  return typeMap[type] || 'info'
}

const highlightCode = (code) => {
  return code
    .replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>')
    .replace(/\b(import|from|const|let|var|function|return|if|else|for|while|new|async|await)\b/g, '<span class="code-keyword">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="code-literal">$1</span>')
    .replace(/'[^']*'/g, '<span class="code-string">$&</span>')
    .replace(/"[^"]*"/g, '<span class="code-string">$&</span>')
}

const navigateToRoute = (route) => {
  if (route) {
    router.push(route)
  }
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

// 可点击的类型标签
.clickable-type {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #409eff;
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  }
}
</style>
