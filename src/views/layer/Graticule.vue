<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Graticule - 经纬网图层</h2>
            <p class="description">
              Graticule 图层用于渲染坐标系统的网格线（目前仅支持 EPSG:4326 经纬度坐标系）。
              可显示经线和纬线，支持自定义标签格式、样式、间隔等。适合制作标准地图时添加经纬度参考网格。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_layer_Graticule-Graticule.html" target="_blank">
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
    name: 'Graticule',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的经纬网图层，用于渲染坐标系统的网格线（经线和纬线）。',
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
          { name: 'maxLines', type: 'number', default: '100', description: '从地图中心开始绘制的最大经线和纬线数量' },
          { name: 'strokeStyle', type: 'Stroke', default: undefined, description: '绘制经纬网的线样式' },
          { name: 'targetSize', type: 'number', default: '100', description: '经纬网单元格的目标大小（像素）' },
          { name: 'showLabels', type: 'boolean', default: 'false', description: '是否显示经纬度标签' },
          { name: 'lonLabelFormatter', type: 'Function', default: undefined, description: '经度标签格式化函数' },
          { name: 'latLabelFormatter', type: 'Function', default: undefined, description: '纬度标签格式化函数' },
          { name: 'lonLabelPosition', type: 'number', default: '0', description: '经度标签位置（0-1 的范围）' },
          { name: 'latLabelPosition', type: 'number', default: '1', description: '纬度标签位置（0-1 的范围）' },
          { name: 'lonLabelStyle', type: 'Text', default: undefined, description: '经度标签文本样式' },
          { name: 'latLabelStyle', type: 'Text', default: undefined, description: '纬度标签文本样式' },
          { name: 'intervals', type: 'Array<number>', default: undefined, description: '经纬网间隔数组（度）' },
          { name: 'wrapX', type: 'boolean', default: 'true', description: '是否在水平方向重复显示' },
          { name: 'properties', type: 'Object', default: undefined, description: '任意可观察属性' }
        ]
      }
    ],
    usage: `// ============================================
// Graticule 构造函数使用示例
// ============================================

import Graticule from 'ol/layer/Graticule'
import Stroke from 'ol/style/Stroke'
import { getCenter } from 'ol/extent'

// 【示例 1】基础经纬网图层
const graticule = new Graticule({
  strokeStyle: new Stroke({
    color: 'rgba(255,120,0,0.9)',
    width: 2,
    lineDash: [0.5, 4]
  }),
  showLabels: true
})

// 【示例 2】自定义样式的经纬网
const graticule = new Graticule({
  strokeStyle: new Stroke({
    color: 'rgba(0,0,255,0.5)',
    width: 1.5
  }),
  maxLines: 200,
  targetSize: 50
})

// 【示例 3】带自定义标签格式的经纬网
const graticule = new Graticule({
  strokeStyle: new Stroke({
    color: 'rgba(255,120,0,0.9)',
    width: 2
  }),
  showLabels: true,
  lonLabelFormatter: (lon) => {
    const direction = lon >= 0 ? 'E' : 'W'
    return Math.abs(lon).toFixed(1) + '°' + direction
  },
  latLabelFormatter: (lat) => {
    const direction = lat >= 0 ? 'N' : 'S'
    return Math.abs(lat).toFixed(1) + '°' + direction
  }
})

// 【示例 4】带自定义标签位置的经纬网
const graticule = new Graticule({
  strokeStyle: new Stroke({
    color: 'rgba(255,120,0,0.9)',
    width: 2
  }),
  showLabels: true,
  lonLabelPosition: 0.5,  // 经度标签在视图中间
  latLabelPosition: 0.5,  // 纬度标签在视图中间
  lonLabelStyle: new Text({
    fill: new Fill({ color: '#000' }),
    stroke: new Stroke({ color: '#fff', width: 2 }),
    font: '12px Calibri,sans-serif'
  })
})

// 【示例 5】自定义间隔的经纬网
const graticule = new Graticule({
  strokeStyle: new Stroke({
    color: 'rgba(255,120,0,0.9)',
    width: 2
  }),
  intervals: [90, 45, 30, 20, 10, 5, 2, 1],  // 自定义间隔
  showLabels: true,
  wrapX: true
})

// 【示例 6】限制显示范围的经纬网
const graticule = new Graticule({
  strokeStyle: new Stroke({
    color: 'rgba(255,120,0,0.9)',
    width: 2
  }),
  extent: [100, 20, 130, 50],  // 仅在此范围内显示
  showLabels: true
})`
  },
  {
    name: 'getMeridians',
    cn: '获取经线',
    type: 'method',
    category: 'method',
    description: '获取所有经线（子午线）的数组。经线是连接南北极的等经度线。',
    returns: { type: 'Array<LineString>', description: '经线几何数组' },
    usage: `// 【示例】获取经线
const meridians = graticule.getMeridians()
console.log('经线数量:', meridians.length)
meridians.forEach(meridian => {
  console.log('经线坐标:', meridian.getCoordinates())
})`
  },
  {
    name: 'getParallels',
    cn: '获取纬线',
    type: 'method',
    category: 'method',
    description: '获取所有纬线（平行圈）的数组。纬线是与赤道平行的等纬度线。',
    returns: { type: 'Array<LineString>', description: '纬线几何数组' },
    usage: `// 【示例】获取纬线
const parallels = graticule.getParallels()
console.log('纬线数量:', parallels.length)
parallels.forEach(parallel => {
  console.log('纬线坐标:', parallel.getCoordinates())
})`
  },
  {
    name: 'getSource',
    cn: '获取数据源',
    type: 'method',
    category: 'method',
    description: '获取图层的矢量数据源。',
    returns: { type: 'VectorSource|null', description: '矢量数据源' },
    usage: `// 【示例】获取数据源
const source = graticule.getSource()
console.log('数据源:', source)`
  },
  {
    name: 'setSource',
    cn: '设置数据源',
    type: 'method',
    category: 'method',
    description: '设置图层的矢量数据源。',
    params: [
      { name: 'source', type: 'VectorSource', default: undefined, description: '矢量数据源' }
    ],
    usage: `// 【示例】设置数据源
graticule.setSource(vectorSource)`
  },
  {
    name: 'getOpacity',
    cn: '获取透明度',
    type: 'method',
    category: 'method',
    description: '获取图层的透明度值。',
    returns: { type: 'number', description: '透明度值（0-1）' },
    usage: `// 【示例】获取透明度
const opacity = graticule.getOpacity()
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
graticule.setOpacity(0.5)`
  },
  {
    name: 'getVisible',
    cn: '获取可见性',
    type: 'method',
    category: 'method',
    description: '获取图层的可见性状态。',
    returns: { type: 'boolean', description: '是否可见' },
    usage: `// 【示例】获取可见性
const visible = graticule.getVisible()
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
graticule.setVisible(false)  // 隐藏
graticule.setVisible(true)   // 显示`
  },
  {
    name: 'getZIndex',
    cn: '获取 Z 索引',
    type: 'method',
    category: 'method',
    description: '获取图层的渲染 Z 索引。',
    returns: { type: 'number|undefined', description: 'Z 索引值' },
    usage: `// 【示例】获取 Z 索引
const zIndex = graticule.getZIndex()
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
graticule.setZIndex(100)  // 设置较高的 Z 索引，使经纬网在最上层`
  },
  {
    name: 'getExtent',
    cn: '获取范围',
    type: 'method',
    category: 'method',
    description: '获取图层的渲染范围。',
    returns: { type: 'Extent|undefined', description: '范围数组 [minX, minY, maxX, maxY]' },
    usage: `// 【示例】获取范围
const extent = graticule.getExtent()
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
graticule.setExtent([100, 20, 130, 50])`
  },
  {
    name: 'getMinZoom',
    cn: '获取最小缩放级别',
    type: 'method',
    category: 'method',
    description: '获取图层的最小缩放级别。',
    returns: { type: 'number', description: '最小缩放级别' },
    usage: `// 【示例】获取最小缩放级别
const minZoom = graticule.getMinZoom()
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
graticule.setMinZoom(5)`
  },
  {
    name: 'getMaxZoom',
    cn: '获取最大缩放级别',
    type: 'method',
    category: 'method',
    description: '获取图层的最大缩放级别。',
    returns: { type: 'number', description: '最大缩放级别' },
    usage: `// 【示例】获取最大缩放级别
const maxZoom = graticule.getMaxZoom()
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
graticule.setMaxZoom(18)`
  },
  {
    name: 'getMinResolution',
    cn: '获取最小分辨率',
    type: 'method',
    category: 'method',
    description: '获取图层的最小分辨率。',
    returns: { type: 'number', description: '最小分辨率' },
    usage: `// 【示例】获取最小分辨率
const minResolution = graticule.getMinResolution()
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
graticule.setMinResolution(100)`
  },
  {
    name: 'getMaxResolution',
    cn: '获取最大分辨率',
    type: 'method',
    category: 'method',
    description: '获取图层的最大分辨率。',
    returns: { type: 'number', description: '最大分辨率' },
    usage: `// 【示例】获取最大分辨率
const maxResolution = graticule.getMaxResolution()
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
graticule.setMaxResolution(5000)`
  },
  {
    name: 'getStyle',
    cn: '获取样式',
    type: 'method',
    category: 'method',
    description: '获取要素的样式。',
    returns: { type: 'Style|Array<Style>|StyleFunction', description: '样式对象、数组或函数' },
    usage: `// 【示例】获取样式
const style = graticule.getStyle()
console.log('当前样式:', style)`
  },
  {
    name: 'setStyle',
    cn: '设置样式',
    type: 'method',
    category: 'method',
    description: '设置要素的样式。',
    params: [
      { name: 'style', type: 'Style|Array<Style>|StyleFunction', default: undefined, description: '样式对象、数组或函数' }
    ],
    usage: `// 【示例】设置样式
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'

graticule.setStyle(new Style({
  stroke: new Stroke({
    color: 'rgba(255,0,0,0.8)',
    width: 2
  })
}))`
  },
  {
    name: 'getStyleFunction',
    cn: '获取样式函数',
    type: 'method',
    category: 'method',
    description: '获取样式函数。',
    returns: { type: 'StyleFunction|undefined', description: '样式函数' },
    usage: `// 【示例】获取样式函数
const styleFn = graticule.getStyleFunction()
console.log('样式函数:', styleFn)`
  },
  {
    name: 'getFeatures',
    cn: '获取要素',
    type: 'method',
    category: 'method',
    description: '获取与给定像素相交的最顶层要素。',
    params: [
      { name: 'pixel', type: 'Pixel', default: undefined, description: '像素坐标 [x, y]' }
    ],
    returns: { type: 'Promise<Array<Feature>>', description: '要素数组的 Promise' },
    usage: `// 【示例】获取像素处的要素
map.on('click', (e) => {
  graticule.getFeatures(e.pixel).then((features) => {
    console.log('点击的要素:', features)
  })
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
const isVisible = graticule.isVisible(map.getView())
console.log('图层在当前视图下是否可见:', isVisible)`
  },
  {
    name: 'getAttributions',
    cn: '获取归属信息',
    type: 'method',
    category: 'method',
    description: '获取图层数据源的归属信息。',
    params: [
      { name: 'view', type: 'View', default: undefined, description: '视图对象' }
    ],
    returns: { type: 'Array<string>', description: '归属信息数组' },
    usage: `// 【示例】获取归属信息
const attributions = graticule.getAttributions(map.getView())
console.log('归属信息:', attributions)`
  },
  {
    name: 'setDeclutter',
    cn: '设置去除 clutter',
    type: 'method',
    category: 'method',
    description: '设置是否去除图像和文本的 clutter（拥挤）。',
    params: [
      { name: 'declutter', type: 'boolean|string|number', default: undefined, description: 'declutter 设置' }
    ],
    usage: `// 【示例】设置去除 clutter
graticule.setDeclutter(true)`
  },
  {
    name: 'get',
    cn: '获取属性值',
    type: 'method',
    category: 'method',
    description: '获取指定名称的属性值。',
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性名称' }
    ],
    returns: { type: '*', description: '属性值' },
    usage: `// 【示例】获取属性值
const opacity = graticule.get('opacity')`
  },
  {
    name: 'set',
    cn: '设置属性值',
    type: 'method',
    category: 'method',
    description: '设置属性值。',
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性名称' },
      { name: 'value', type: '*', default: undefined, description: '属性值' },
      { name: 'silent', type: 'boolean', default: 'false', description: '是否静默' }
    ],
    usage: `// 【示例】设置属性值
graticule.set('customProp', 'value')`
  },
  {
    name: 'getProperties',
    cn: '获取所有属性',
    type: 'method',
    category: 'method',
    description: '获取所有属性名称和值的对象。',
    returns: { type: 'Object', description: '属性对象' },
    usage: `// 【示例】获取所有属性
const props = graticule.getProperties()`
  },
  {
    name: 'setProperties',
    cn: '设置多个属性',
    type: 'method',
    category: 'method',
    description: '批量设置多个属性值。',
    params: [
      { name: 'values', type: 'Object', default: undefined, description: '属性值对象' },
      { name: 'silent', type: 'boolean', default: 'false', description: '是否静默' }
    ],
    usage: `// 【示例】设置多个属性
graticule.setProperties({ opacity: 0.8, visible: true })`
  },
  {
    name: 'unset',
    cn: '移除属性',
    type: 'method',
    category: 'method',
    description: '移除指定属性。',
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性名称' },
      { name: 'silent', type: 'boolean', default: 'false', description: '是否静默' }
    ],
    usage: `// 【示例】移除属性
graticule.unset('customProperty')`
  },
  {
    name: 'getKeys',
    cn: '获取属性名称列表',
    type: 'method',
    category: 'method',
    description: '获取所有属性名称的列表。',
    returns: { type: 'Array<string>', description: '属性名称数组' },
    usage: `// 【示例】获取属性名称列表
const keys = graticule.getKeys()`
  },
  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'method',
    description: '获取对象的版本号。',
    returns: { type: 'number', description: '版本号' },
    usage: `// 【示例】获取版本号
const revision = graticule.getRevision()`
  },
  {
    name: 'changed',
    cn: '触发变更事件',
    type: 'method',
    category: 'method',
    description: '增加版本号并触发 change 事件。',
    usage: `// 【示例】触发变更事件
graticule.changed()`
  },
  {
    name: 'on',
    cn: '监听事件',
    type: 'method',
    category: 'method',
    description: '监听指定类型的事件。',
    params: [
      { name: 'type', type: 'string|Array', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '事件处理函数' }
    ],
    returns: { type: 'EventsKey|Array<EventsKey>', description: '事件键' },
    usage: `// 【示例】监听事件
graticule.on('change:visible', () => {
  console.log('可见性变更')
})`
  },
  {
    name: 'once',
    cn: '监听一次事件',
    type: 'method',
    category: 'method',
    description: '监听一次事件，触发后自动取消。',
    params: [
      { name: 'type', type: 'string|Array', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '事件处理函数' }
    ],
    returns: { type: 'EventsKey|Array<EventsKey>', description: '事件键' },
    usage: `// 【示例】监听一次事件
graticule.once('change', () => {
  console.log('图层发生了一次变更')
})`
  },
  {
    name: 'un',
    cn: '取消监听事件',
    type: 'method',
    category: 'method',
    description: '取消指定类型的事件监听。',
    params: [
      { name: 'type', type: 'string|Array', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '事件处理函数' }
    ],
    usage: `// 【示例】取消监听
graticule.un('change:visible', listenerFunction)`
  },
  {
    name: 'dispatchEvent',
    cn: '触发事件',
    type: 'method',
    category: 'method',
    description: '手动触发指定类型的事件。',
    params: [
      { name: 'event', type: 'string|BaseEvent', default: undefined, description: '事件对象或类型字符串' }
    ],
    returns: { type: 'boolean|undefined', description: '事件是否被阻止' },
    usage: `// 【示例】触发事件
graticule.dispatchEvent('customEvent')`
  },
  {
    name: 'opacity',
    cn: '透明度属性',
    type: 'property',
    category: 'property',
    description: '图层透明度，取值范围 0-1。默认值为 1。',
    usage: `// 【示例】通过属性设置透明度
graticule.set('opacity', 0.6)`
  },
  {
    name: 'visible',
    cn: '可见性属性',
    type: 'property',
    category: 'property',
    description: '图层可见性。默认值为 true。',
    usage: `// 【示例】通过属性设置可见性
graticule.set('visible', false)`
  },
  {
    name: 'zIndex',
    cn: 'Z 索引属性',
    type: 'property',
    category: 'property',
    description: '图层渲染的 Z 索引，用于控制图层顺序。',
    usage: `// 【示例】通过属性设置 Z 索引
graticule.set('zIndex', 100)`
  },
  {
    name: 'extent',
    cn: '范围属性',
    type: 'property',
    category: 'property',
    description: '图层渲染的边界范围。',
    usage: `// 【示例】通过属性设置范围
graticule.set('extent', [100, 20, 130, 50])`
  },
  {
    name: 'maxLines',
    cn: '最大线条数属性',
    type: 'property',
    category: 'property',
    description: '从地图中心开始绘制的最大经线和纬线数量。默认值为 100。',
    usage: `// 【示例】通过属性设置最大线条数
graticule.set('maxLines', 200)`
  },
  {
    name: 'showLabels',
    cn: '显示标签属性',
    type: 'property',
    category: 'property',
    description: '是否显示经纬度标签。默认值为 false。',
    usage: `// 【示例】通过属性设置显示标签
graticule.set('showLabels', true)`
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
