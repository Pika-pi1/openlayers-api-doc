<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>VectorLayer - 矢量图层</h2>
            <p class="description">
              VectorLayer 用于显示矢量数据（点、线、面等要素）。它从 VectorSource 获取数据，并使用指定的样式渲染要素。
              矢量图层支持样式设置、要素选择、编辑等功能，是 OpenLayers 中最常用的图层类型之一。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html" target="_blank">
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
                <div class="api-description">
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
import { useRouter } from 'vue-router'
import { getRoute, hasRoute } from '@/utils/apiRoutes'

const router = useRouter()

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
  { name: 'properties', cn: '属性', count: 0 },
  { name: 'events', cn: '事件', count: 0 }
])

const filterByCategory = (category) => {
  currentCategory.value = category
}

// API 数据
const apiData = [
  {
    name: 'VectorLayer',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的矢量图层。矢量图层用于显示矢量数据（点、线、面等要素）。',
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '配置选项对象',
        children: [
          { name: 'className', type: 'string', default: "'ol-layer'", description: '设置到图层元素的 CSS 类名' },
          { name: 'opacity', type: 'number', default: '1', description: '透明度，范围 0-1' },
          { name: 'visible', type: 'boolean', default: 'true', description: '是否可见' },
          { name: 'extent', type: 'Extent', default: undefined, description: '图层渲染的边界范围' },
          { name: 'zIndex', type: 'number', default: undefined, description: '图层渲染的 z-index' },
          { name: 'minResolution', type: 'number', default: undefined, description: '图层可见的最小分辨率（包含）' },
          { name: 'maxResolution', type: 'number', default: undefined, description: '图层可见的最大分辨率（不包含）' },
          { name: 'minZoom', type: 'number', default: undefined, description: '图层可见的最小缩放级别（不包含）' },
          { name: 'maxZoom', type: 'number', default: undefined, description: '图层可见的最大缩放级别（包含）' },
          { name: 'renderOrder', type: 'Function', default: undefined, description: '渲染前对要素排序的函数' },
          { name: 'renderBuffer', type: 'number', default: '100', description: '视图范围周围的缓冲区大小（像素）' },
          { name: 'source', type: 'VectorSource', default: undefined, description: '矢量数据源' },
          { name: 'map', type: 'Map', default: undefined, description: '将图层设置为叠加在地图上' },
          { name: 'declutter', type: 'boolean', default: 'false', description: '是否整理图像和文本的显示' },
          { name: 'style', type: 'StyleLike', default: undefined, description: '要素样式' },
          { name: 'background', type: 'BackgroundColor', default: undefined, description: '图层背景色' },
          { name: 'updateWhileAnimating', type: 'boolean', default: 'false', description: '动画期间是否重新渲染要素批次' },
          { name: 'updateWhileInteracting', type: 'boolean', default: 'false', description: '交互期间是否重新渲染要素批次' },
          { name: 'properties', type: 'Object', default: undefined, description: '任意可观察属性' }
        ]
      }
    ],
    usage: `// ============================================
// VectorLayer 构造函数使用示例
// ============================================

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { Point } from 'ol/geom'

// 【示例 1】创建简单的矢量图层
const vectorLayer = new VectorLayer({
  source: new VectorSource(),
  opacity: 0.8
})

// 【示例 2】完整配置
const vectorLayer = new VectorLayer({
  className: 'my-vector-layer',
  opacity: 1,
  visible: true,
  extent: [115, 39, 117, 41],  // 北京范围
  zIndex: 10,
  minZoom: 5,
  maxZoom: 18,
  renderBuffer: 100,
  source: new VectorSource({
    // 配置数据源
  }),
  declutter: true,  // 整理标注
  style: myStyleFunction,  // 样式函数
  updateWhileAnimating: true,
  updateWhileInteracting: true
})

// 【示例 3】添加要素到图层
const source = vectorLayer.getSource()
const feature = new Feature(new Point([116.4, 39.9]))
source.addFeature(feature)`
  },
  {
    name: 'changed',
    cn: '触发变更事件',
    type: 'method',
    category: 'methods',
    description: '增加修订计数器并触发 change 事件。当图层状态发生任何变化时调用。',
    usage: `// ============================================
// changed 方法使用示例
// ============================================

// 【示例 1】手动触发变更
vectorLayer.changed()

// 【示例 2】在自定义操作后触发变更
function updateLayerStyle() {
  vectorLayer.setStyle(newStyle)
  vectorLayer.changed()  // 通知图层已更新
}

// 【应用场景】
// - 强制重新渲染图层
// - 通知监听器图层状态已改变`
  },
  {
    name: 'getExtent',
    cn: '获取范围',
    type: 'method',
    category: 'methods',
    description: '返回图层的渲染范围。',
    returns: { type: 'Extent|undefined', description: '图层范围数组 [minX, minY, maxX, maxY]，如果未设置则返回 undefined' },
    usage: `// ============================================
// getExtent 方法使用示例
// ============================================

// 【示例 1】获取图层范围
const extent = vectorLayer.getExtent()
console.log('图层范围:', extent)

// 【示例 2】检查范围是否设置
if (vectorLayer.getExtent()) {
  console.log('图层有限制范围')
} else {
  console.log('图层无范围限制')
}

// 【应用场景】
// - 获取图层显示范围
// - 检查图层配置`
  },
  {
    name: 'getFeatures',
    cn: '获取要素',
    type: 'method',
    category: 'methods',
    description: '获取与给定像素相交的最顶层要素。返回一个 Promise。',
    params: [
      { name: 'pixel', type: 'Pixel', default: undefined, description: '像素坐标 [x, y]' }
    ],
    returns: { type: 'Promise<Array<FeatureLike>>', description: 'Promise，解析为要素数组' },
    usage: `// ============================================
// getFeatures 方法使用示例
// ============================================

// 【示例 1】点击获取要素
map.on('click', async (event) => {
  const pixel = event.pixel
  const features = await vectorLayer.getFeatures(pixel)

  if (features.length > 0) {
    console.log('点击到的要素:', features[0])
  }
})

// 【示例 2】悬停获取要素
map.on('pointermove', async (event) => {
  const features = await vectorLayer.getFeatures(event.pixel)

  if (features.length > 0) {
    map.getTargetElement().style.cursor = 'pointer'
  } else {
    map.getTargetElement().style.cursor = ''
  }
})

// 【应用场景】
// - 点击查询要素信息
// - 悬停高亮效果
// - 要素选择`
  },
  {
    name: 'getMaxResolution',
    cn: '获取最大分辨率',
    type: 'method',
    category: 'methods',
    description: '返回图层的最大分辨率。',
    returns: { type: 'number', description: '最大分辨率值' },
    usage: `// 【示例】获取最大分辨率
const maxRes = vectorLayer.getMaxResolution()
console.log('最大分辨率:', maxRes)`
  },
  {
    name: 'getMaxZoom',
    cn: '获取最大缩放级别',
    type: 'method',
    category: 'methods',
    description: '返回图层的最大缩放级别。',
    returns: { type: 'number', description: '最大缩放级别' },
    usage: `// 【示例】获取最大缩放级别
const maxZoom = vectorLayer.getMaxZoom()
console.log('最大缩放级别:', maxZoom)`
  },
  {
    name: 'getMinResolution',
    cn: '获取最小分辨率',
    type: 'method',
    category: 'methods',
    description: '返回图层的最小分辨率。',
    returns: { type: 'number', description: '最小分辨率值' },
    usage: `// 【示例】获取最小分辨率
const minRes = vectorLayer.getMinResolution()
console.log('最小分辨率:', minRes)`
  },
  {
    name: 'getMinZoom',
    cn: '获取最小缩放级别',
    type: 'method',
    category: 'methods',
    description: '返回图层的最小缩放级别。',
    returns: { type: 'number', description: '最小缩放级别' },
    usage: `// 【示例】获取最小缩放级别
const minZoom = vectorLayer.getMinZoom()
console.log('最小缩放级别:', minZoom)`
  },
  {
    name: 'getOpacity',
    cn: '获取透明度',
    type: 'method',
    category: 'methods',
    description: '返回图层的透明度（0 到 1 之间）。',
    returns: { type: 'number', description: '透明度值，范围 0-1' },
    usage: `// 【示例】获取透明度
const opacity = vectorLayer.getOpacity()
console.log('当前透明度:', opacity)`
  },
  {
    name: 'getSource',
    cn: '获取数据源',
    type: 'method',
    category: 'methods',
    description: '获取图层的矢量数据源。',
    returns: { type: 'VectorSource|null', description: '矢量数据源对象' },
    usage: `// ============================================
// getSource 方法使用示例
// ============================================

// 【示例 1】获取数据源
const source = vectorLayer.getSource()

// 【示例 2】添加要素
const source = vectorLayer.getSource()
source.addFeature(myFeature)

// 【示例 3】清空数据源
vectorLayer.getSource().clear()

// 【应用场景】
// - 操作图层数据
// - 添加/删除要素
// - 加载数据`
  },
  {
    name: 'getStyle',
    cn: '获取样式',
    type: 'method',
    category: 'methods',
    description: '获取要素的样式。',
    returns: { type: 'StyleLike|null|undefined', description: '样式对象、样式数组或样式函数' },
    usage: `// 【示例】获取样式
const style = vectorLayer.getStyle()
console.log('当前样式:', style)`
  },
  {
    name: 'getStyleFunction',
    cn: '获取样式函数',
    type: 'method',
    category: 'methods',
    description: '获取样式函数。',
    returns: { type: 'Function|undefined', description: '样式函数' },
    usage: `// 【示例】获取样式函数
const styleFn = vectorLayer.getStyleFunction()
if (styleFn) {
  const style = styleFn(feature, resolution)
}`
  },
  {
    name: 'getVisible',
    cn: '获取可见性',
    type: 'method',
    category: 'methods',
    description: '返回图层的可见性。',
    returns: { type: 'boolean', description: 'true 表示可见，false 表示不可见' },
    usage: `// 【示例】获取可见性
const isVisible = vectorLayer.getVisible()
console.log('图层是否可见:', isVisible)`
  },
  {
    name: 'getZIndex',
    cn: '获取层级',
    type: 'method',
    category: 'methods',
    description: '返回图层的 Z-index（渲染层级）。',
    returns: { type: 'number|undefined', description: 'Z-index 值' },
    usage: `// 【示例】获取层级
const zIndex = vectorLayer.getZIndex()
console.log('图层层级:', zIndex)`
  },
  {
    name: 'isVisible',
    cn: '检查是否可见',
    type: 'method',
    category: 'methods',
    description: '检查图层在地图视图上是否可见。',
    params: [
      { name: 'view', type: 'View', default: undefined, description: '视图对象或视图状态' }
    ],
    returns: { type: 'boolean', description: 'true 表示可见，false 表示不可见' },
    usage: `// 【示例】检查可见性
const visible = vectorLayer.isVisible(map.getView())
console.log('图层是否可见:', visible)`
  },
  {
    name: 'setExtent',
    cn: '设置范围',
    type: 'method',
    category: 'methods',
    description: '设置图层可见的范围。',
    params: [
      { name: 'extent', type: 'Extent', default: undefined, description: '范围数组 [minX, minY, maxX, maxY]' }
    ],
    usage: `// ============================================
// setExtent 方法使用示例
// ============================================

// 【示例 1】设置范围
vectorLayer.setExtent([115, 39, 117, 41])  // 北京范围

// 【示例 2】清除范围限制
vectorLayer.setExtent(undefined)

// 【应用场景】
// - 限制图层显示区域
// - 性能优化（只渲染可见区域）`
  },
  {
    name: 'setMaxResolution',
    cn: '设置最大分辨率',
    type: 'method',
    category: 'methods',
    description: '设置图层可见的最大分辨率。',
    params: [
      { name: 'maxResolution', type: 'number', default: undefined, description: '最大分辨率值' }
    ],
    usage: `// 【示例】设置最大分辨率
vectorLayer.setMaxResolution(1000)
// 分辨率大于 1000 时图层不可见`
  },
  {
    name: 'setMaxZoom',
    cn: '设置最大缩放级别',
    type: 'method',
    category: 'methods',
    description: '设置图层可见的最大缩放级别（不包含）。',
    params: [
      { name: 'maxZoom', type: 'number', default: undefined, description: '最大缩放级别' }
    ],
    usage: `// 【示例】设置最大缩放级别
vectorLayer.setMaxZoom(18)
// 缩放级别大于 18 时图层不可见`
  },
  {
    name: 'setMinResolution',
    cn: '设置最小分辨率',
    type: 'method',
    category: 'methods',
    description: '设置图层可见的最小分辨率。',
    params: [
      { name: 'minResolution', type: 'number', default: undefined, description: '最小分辨率值' }
    ],
    usage: `// 【示例】设置最小分辨率
vectorLayer.setMinResolution(10)
// 分辨率小于 10 时图层不可见`
  },
  {
    name: 'setMinZoom',
    cn: '设置最小缩放级别',
    type: 'method',
    category: 'methods',
    description: '设置图层可见的最小缩放级别（包含）。',
    params: [
      { name: 'minZoom', type: 'number', default: undefined, description: '最小缩放级别' }
    ],
    usage: `// 【示例】设置最小缩放级别
vectorLayer.setMinZoom(5)
// 缩放级别小于 5 时图层不可见`
  },
  {
    name: 'setOpacity',
    cn: '设置透明度',
    type: 'method',
    category: 'methods',
    description: '设置图层的透明度。',
    params: [
      { name: 'opacity', type: 'number', default: undefined, description: '透明度值，范围 0-1' }
    ],
    usage: `// ============================================
// setOpacity 方法使用示例
// ============================================

// 【示例 1】设置半透明
vectorLayer.setOpacity(0.5)  // 50% 透明

// 【示例 2】完全隐藏（不推荐，用 setVisible）
vectorLayer.setOpacity(0)

// 【示例 3】完全不透明
vectorLayer.setOpacity(1)

// 【应用场景】
// - 图层淡入淡出
// - 叠加图层显示`
  },
  {
    name: 'setSource',
    cn: '设置数据源',
    type: 'method',
    category: 'methods',
    description: '设置图层的矢量数据源。',
    params: [
      { name: 'source', type: 'VectorSource', default: undefined, description: '矢量数据源对象' }
    ],
    usage: `// ============================================
// setSource 方法使用示例
// ============================================

import VectorSource from 'ol/source/Vector'

// 【示例 1】设置新数据源
const newSource = new VectorSource()
vectorLayer.setSource(newSource)

// 【示例 2】动态切换数据源
function switchDataSource(type) {
  const source = getDataSourceByType(type)
  vectorLayer.setSource(source)
}

// 【应用场景】
// - 动态加载数据
// - 切换数据源`
  },
  {
    name: 'setStyle',
    cn: '设置样式',
    type: 'method',
    category: 'methods',
    description: '设置要素的样式。',
    params: [
      { name: 'style', type: 'StyleLike', default: undefined, description: '样式对象、样式数组或样式函数' }
    ],
    usage: `// ============================================
// setStyle 方法使用示例
// ============================================

import { Style, Fill, Stroke, Circle } from 'ol/style'

// 【示例 1】设置单一样式
vectorLayer.setStyle(new Style({
  image: new Circle({
    radius: 5,
    fill: new Fill({ color: 'red' })
  })
}))

// 【示例 2】设置样式数组
vectorLayer.setStyle([style1, style2])

// 【示例 3】设置样式函数
vectorLayer.setStyle((feature) => {
  const type = feature.get('type')
  return type === 'point' ? pointStyle : lineStyle
})

// 【示例 4】清除样式（使用默认）
vectorLayer.setStyle(null)

// 【应用场景】
// - 动态样式切换
// - 根据属性设置样式
// - 主题切换`
  },
  {
    name: 'setVisible',
    cn: '设置可见性',
    type: 'method',
    category: 'methods',
    description: '设置图层的可见性。',
    params: [
      { name: 'visible', type: 'boolean', default: undefined, description: 'true 表示可见，false 表示不可见' }
    ],
    usage: `// ============================================
// setVisible 方法使用示例
// ============================================

// 【示例 1】隐藏图层
vectorLayer.setVisible(false)

// 【示例 2】显示图层
vectorLayer.setVisible(true)

// 【示例 3】切换可见性
vectorLayer.setVisible(!vectorLayer.getVisible())

// 【应用场景】
// - 图层控制面板
// - 条件显示图层`
  },
  {
    name: 'setZIndex',
    cn: '设置层级',
    type: 'method',
    category: 'methods',
    description: '设置图层的 Z-index（渲染层级）。数值越大，渲染越靠上。',
    params: [
      { name: 'zIndex', type: 'number', default: undefined, description: 'Z-index 值' }
    ],
    usage: `// ============================================
// setZIndex 方法使用示例
// ============================================

// 【示例 1】设置层级
vectorLayer.setZIndex(100)  // 高层级，显示在其他图层之上

// 【示例 2】层级管理
backgroundLayer.setZIndex(0)
dataLayer.setZIndex(10)
highlightLayer.setZIndex(100)

// 【应用场景】
// - 图层叠加顺序控制
// - 高亮层置顶`
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
    returns: { type: 'EventsKey|Array<EventsKey>', description: '事件键，用于取消监听' },
    usage: `// ============================================
// on 方法使用示例（监听事件）
// ============================================

// 【示例 1】监听变更事件
vectorLayer.on('change', () => {
  console.log('图层已变更')
})

// 【示例 2】监听渲染前事件
vectorLayer.on('prerender', (event) => {
  console.log('开始渲染')
})

// 【示例 3】监听多个事件
vectorLayer.on(['prerender', 'postrender'], (event) => {
  console.log('渲染事件:', event.type)
})

// 【示例 4】取消监听
const key = vectorLayer.on('change', handler)
vectorLayer.un(key)`
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
    usage: `// 【示例】监听一次事件
vectorLayer.once('change:source', () => {
  console.log('数据源已改变（只触发一次）')
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
vectorLayer.un('change', handler)`
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
const customValue = vectorLayer.get('customKey')`
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
      { name: 'silent', type: 'boolean', default: 'false', description: '是否静默（不触发事件）' }
    ],
    usage: `// 【示例】设置属性
vectorLayer.set('customKey', 'customValue')`
  },
  {
    name: 'getProperties',
    cn: '获取所有属性',
    type: 'method',
    category: 'methods',
    description: '获取所有属性名的对象。',
    returns: { type: 'Object', description: '属性对象' },
    usage: `// 【示例】获取所有属性
const props = vectorLayer.getProperties()
console.log('所有属性:', props)`
  },
  {
    name: 'setProperties',
    cn: '批量设置属性',
    type: 'method',
    category: 'methods',
    description: '批量设置键值对。',
    params: [
      { name: 'values', type: 'Object', default: undefined, description: '属性对象' },
      { name: 'silent', type: 'boolean', default: 'false', description: '是否静默' }
    ],
    usage: `// 【示例】批量设置属性
vectorLayer.setProperties({
  key1: 'value1',
  key2: 'value2'
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
vectorLayer.unset('customKey')`
  },
  {
    name: 'getKeys',
    cn: '获取属性名列表',
    type: 'method',
    category: 'methods',
    description: '获取所有属性名的列表。',
    returns: { type: 'Array<string>', description: '属性名数组' },
    usage: `// 【示例】获取属性名列表
const keys = vectorLayer.getKeys()
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
const revision = vectorLayer.getRevision()`
  },
  {
    name: 'getAttributions',
    cn: '获取归属信息',
    type: 'method',
    category: 'methods',
    description: '获取此图层数据源的归属信息。',
    params: [
      { name: 'view', type: 'View', default: undefined, description: '视图对象' }
    ],
    returns: { type: 'Array<string>', description: '归属信息数组' },
    usage: `// 【示例】获取归属信息
const attributions = vectorLayer.getAttributions()
console.log('归属信息:', attributions)`
  },
  {
    name: 'setDeclutter',
    cn: '设置整理选项',
    type: 'method',
    category: 'methods',
    description: '设置是否整理图像和文本的显示。',
    params: [
      { name: 'declutter', type: 'boolean|string|number', default: undefined, description: '整理选项' }
    ],
    usage: `// 【示例】设置整理
vectorLayer.setDeclutter(true)`
  },
  {
    name: 'setMap',
    cn: '设置地图',
    type: 'method',
    category: 'methods',
    description: '将图层设置为叠加在地图上。',
    params: [
      { name: 'map', type: 'Map|null', default: undefined, description: '地图对象或 null' }
    ],
    usage: `// 【示例】添加图层到地图
vectorLayer.setMap(map)

// 【示例】从地图移除图层
vectorLayer.setMap(null)`
  },
  {
    name: 'dispatchEvent',
    cn: '触发事件',
    type: 'method',
    category: 'methods',
    description: '触发事件并调用所有监听器。',
    params: [
      { name: 'event', type: 'BaseEvent|string', default: undefined, description: '事件对象或事件类型' }
    ],
    returns: { type: 'boolean|undefined', description: '是否被阻止' },
    usage: `// 【示例】触发自定义事件
vectorLayer.dispatchEvent('myCustomEvent')`
  },
  {
    name: 'change:extent',
    cn: '范围变更事件',
    type: 'event',
    category: 'events',
    description: '当图层范围改变时触发。',
    usage: `// 【示例】监听范围变更
vectorLayer.on('change:extent', () => {
  console.log('图层范围已改变')
  const newExtent = vectorLayer.getExtent()
})`
  },
  {
    name: 'change:opacity',
    cn: '透明度变更事件',
    type: 'event',
    category: 'events',
    description: '当图层透明度改变时触发。',
    usage: `// 【示例】监听透明度变更
vectorLayer.on('change:opacity', () => {
  console.log('透明度：', vectorLayer.getOpacity())
})`
  },
  {
    name: 'change:source',
    cn: '数据源变更事件',
    type: 'event',
    category: 'events',
    description: '当图层数据源改变时触发。',
    usage: `// 【示例】监听数据源变更
vectorLayer.on('change:source', () => {
  console.log('数据源已改变')
  const source = vectorLayer.getSource()
})`
  },
  {
    name: 'change:visible',
    cn: '可见性变更事件',
    type: 'event',
    category: 'events',
    description: '当图层可见性改变时触发。',
    usage: `// 【示例】监听可见性变更
vectorLayer.on('change:visible', () => {
  console.log('可见性：', vectorLayer.getVisible())
})`
  },
  {
    name: 'change:zIndex',
    cn: '层级变更事件',
    type: 'event',
    category: 'events',
    description: '当图层 Z-index 改变时触发。',
    usage: `// 【示例】监听层级变更
vectorLayer.on('change:zIndex', () => {
  console.log('层级：', vectorLayer.getZIndex())
})`
  },
  {
    name: 'prerender',
    cn: '渲染前事件',
    type: 'event',
    category: 'events',
    description: '在图层渲染前触发。',
    usage: `// 【示例】监听渲染前事件
vectorLayer.on('prerender', (event) => {
  console.log('开始渲染图层')
  // 可以在这里修改 canvas 上下文
})`
  },
  {
    name: 'postrender',
    cn: '渲染后事件',
    type: 'event',
    category: 'events',
    description: '在图层渲染后触发。',
    usage: `// 【示例】监听渲染后事件
vectorLayer.on('postrender', (event) => {
  console.log('图层渲染完成')
  // 可以在这里添加自定义渲染
})`
  },
  {
    name: 'propertychange',
    cn: '属性变更事件',
    type: 'event',
    category: 'events',
    description: '当属性改变时触发。',
    usage: `// 【示例】监听属性变更
vectorLayer.on('propertychange', (event) => {
  console.log('属性变更:', event.key, '=', event.value)
})`
  },
  {
    name: 'sourceready',
    cn: '数据源就绪事件',
    type: 'event',
    category: 'events',
    description: '当数据源就绪时触发。',
    usage: `// 【示例】监听数据源就绪
vectorLayer.on('sourceready', () => {
  console.log('数据源已就绪，可以开始使用')
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

// 路由跳转
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
