<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>TileSource - 瓦片源 API</h2>
            <p class="description">
              TileSource 是 OpenLayers 中所有瓦片源的基类，提供了瓦片数据源的核心功能。
              它继承自 Source 类，为 XYZ、OSM、WMTS 等瓦片源提供通用接口。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_Tile-TileSource.html" target="_blank">
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
const isAllExpanded = computed(() => activeNames.value.length === tileSourceApis.length)

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = tileSourceApis.map(api => api.name)
  }
}

// 分类过滤
const categories = computed(() => {
  const cats = {
    all: { name: 'all', cn: '全部', count: tileSourceApis.length },
    overview: { name: 'overview', cn: '概述', count: 0 },
    constructor: { name: 'constructor', cn: '构造函数', count: 0 },
    methods: { name: 'methods', cn: '方法', count: 0 }
  }
  tileSourceApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })
  return Object.values(cats).filter(c => c.count > 0)
})

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = tileSourceApis.map(api => api.name)
  } else {
    activeNames.value = tileSourceApis.filter(api => api.category === category).map(api => api.name)
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
    return tileSourceApis
  }
  return tileSourceApis.filter(api => api.category === currentCategory.value)
})

// TileSource API 列表
const tileSourceApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'TileSource 概述',
    type: 'overview',
    category: 'overview',
    description: 'TileSource 是 OpenLayers 中所有瓦片源的基类。它提供了瓦片数据源的核心功能，包括瓦片网格管理、瓦片加载、投影转换等。XYZ、OSM、WMTS、TileWMS 等瓦片源都继承自 TileSource。TileSource 本身是抽象类，通常不直接使用，而是使用其子类。',
    usage: `// ============================================
// TileSource 概述
// ============================================
// TileSource 是所有瓦片源的基类，提供：
// - 瓦片网格（TileGrid）管理
// - 瓦片加载和缓存
// - 投影转换支持
// - 瓦片 URL 函数处理

// TileSource 的常见子类：
// - XYZ: 自定义 XYZ 瓦片服务
// - OSM: OpenStreetMap 瓦片源
// - WMTS: OGC WMTS 服务
// - TileWMS: WMS 瓦片服务
// - BingMaps: 必应地图瓦片
// - CartoDB: CartoDB 瓦片服务

// 使用示例（通过子类）：
import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'
import {Tile as TileLayer} from 'ol/layer'

// 创建 OSM 瓦片源（OSM 继承自 TileSource）
const osmSource = new OSM()

// 创建瓦片图层
const tileLayer = new TileLayer({
  source: osmSource
})`
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建 TileSource 实例。由于 TileSource 是抽象基类，通常通过其子类（如 XYZ、OSM 等）的构造函数间接调用。',
    usage: `// ============================================
// TileSource 构造函数
// ============================================
// 注意：TileSource 是抽象类，通常不直接实例化
// 以下展示其配置选项结构，实际使用通过子类

import TileSource from 'ol/source/Tile'

// 子类使用示例 - XYZ：
import XYZ from 'ol/source/XYZ'

const xyzSource = new XYZ({
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  projection: 'EPSG:3857',
  tileSize: [256, 256],
  maxZoom: 19,
  minZoom: 0,
  crossOrigin: 'anonymous',
  wrapX: true,
  interpolate: true
})

// 子类使用示例 - OSM：
import OSM from 'ol/source/OSM'

const osmSource = new OSM({
  maxZoom: 19,
  crossOrigin: 'anonymous',
  wrapX: true
})

// 子类使用示例 - TileWMS：
import TileWMS from 'ol/source/TileWMS'

const wmsSource = new TileWMS({
  url: 'https://geoserver.example.com/geoserver/wms',
  params: {
    'LAYERS': 'workspace:layer',
    'TILED': true
  },
  serverType: 'geoserver',
  tileSize: 256
})`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'TileSource 配置选项',
        children: [
          { name: 'attributions', type: 'AttributionLike', default: undefined, description: '版权信息' },
          { name: 'attributionsCollapsible', type: 'boolean', default: 'true', description: '版权信息是否可折叠' },
          { name: 'cacheSize', type: 'number', default: undefined, description: '已废弃，建议在图层上设置 cacheSize' },
          { name: 'tilePixelRatio', type: 'number', default: undefined, description: '瓦片像素比例' },
          { name: 'projection', type: 'ProjectionLike', default: 'EPSG:3857', description: '投影坐标系' },
          { name: 'state', type: 'State', default: undefined, description: '源状态' },
          { name: 'tileGrid', type: 'TileGrid', default: undefined, description: '瓦片网格' },
          { name: 'wrapX', type: 'boolean', default: 'false', description: '是否水平环绕世界' },
          { name: 'transition', type: 'number', default: undefined, description: '透明度过渡动画持续时间（毫秒）' },
          { name: 'key', type: 'string', default: undefined, description: '键值，用于缓存失效' },
          { name: 'zDirection', type: 'number', default: '0', description: '缩放级别方向选择' },
          { name: 'interpolate', type: 'boolean', default: 'false', description: '重采样时是否使用插值' }
        ]
      }
    ],
    returns: { type: 'TileSource', description: '新的 TileSource 实例' }
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
    name: 'clear',
    cn: '清除缓存',
    type: 'method',
    category: 'methods',
    description: '清除所有缓存的重投影瓦片。释放内存空间，用于资源管理。',
    usage: `// ============================================
// clear 方法
// ============================================
// 清除缓存的重投影瓦片

// 释放瓦片缓存
source.clear()

// 常见场景：组件卸载前清理
onUnmounted(() => {
  if (tileSource) {
    tileSource.clear()
  }
})`,
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

import OSM from 'ol/source/OSM'

const osmSource = new OSM()
const attributions = osmSource.getAttributions()

// 版权信息可能是字符串或函数
if (typeof attributions === 'function') {
  console.log('版权信息:', attributions())
} else {
  console.log('版权信息:', attributions)
}`,
    returns: { type: 'AttributionFunction|string', description: '版权信息' }
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

import XYZ from 'ol/source/XYZ'
import {get as getProjection} from 'ol/proj'

const xyzSource = new XYZ({
  projection: 'EPSG:3857'
})

const projection = xyzSource.getProjection()
console.log('投影代码:', projection.getCode()) // 'EPSG:3857'
console.log('投影单位:', projection.getUnits()) // 'm'

// 坐标转换
const coord = [12963076, 4861614] // EPSG:3857
const lonLat = transform(coord, 'EPSG:3857', 'EPSG:4326')
console.log('经纬度:', lonLat)`,
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
// - 'ready': 源已就绪，可以加载瓦片
// - 'loading': 源正在加载数据
// - 'error': 源加载出错

const state = source.getState()
console.log('当前状态:', state)

// 监听状态变化
source.on('change', () => {
  const state = source.getState()
  if (state === 'error') {
    console.error('瓦片源加载失败')
  } else if (state === 'ready') {
    console.log('瓦片源已就绪')
  }
})`,
    returns: { type: 'string', description: '源状态：ready | loading | error' }
  },

  {
    name: 'getTileGrid',
    cn: '获取瓦片网格',
    type: 'method',
    category: 'methods',
    description: '返回瓦片源的瓦片网格对象。瓦片网格定义了瓦片的分辨率、原点、大小等属性。',
    usage: `// ============================================
// getTileGrid 方法
// ============================================
// 获取瓦片网格

import XYZ from 'ol/source/XYZ'

const xyzSource = new XYZ({
  maxZoom: 19
})

const tileGrid = xyzSource.getTileGrid()
console.log('瓦片网格:', tileGrid)

// 获取瓦片网格的分辨率数组
const resolutions = tileGrid.getResolutions()
console.log('分辨率数组:', resolutions)

// 获取指定级别的分辨率
const zoom = 10
const resolution = tileGrid.getResolution(zoom)
console.log('级别', zoom, '的分辨率:', resolution)

// 获取瓦片大小
const tileSize = tileGrid.getTileSize()
console.log('瓦片大小:', tileSize)`,
    returns: { type: 'TileGrid', description: '瓦片网格对象' }
  },

  {
    name: 'getTileLoadFunction',
    cn: '获取瓦片加载函数',
    type: 'method',
    category: 'methods',
    description: '返回瓦片加载函数。已废弃，建议使用 ImageTile 源的 loader 选项替代。',
    usage: `// ============================================
// getTileLoadFunction 方法（已废弃）
// ============================================
// 获取当前的瓦片加载函数

// 已废弃，建议使用新的 loader 方式
const loadFn = source.getTileLoadFunction()

// 新的推荐方式：
import {Tile as TileLayer} from 'ol/layer'
import XYZ from 'ol/source/XYZ'

const layer = new TileLayer({
  source: new XYZ({
    url: 'https://example.com/{z}/{x}/{y}.png',
    // 使用 tileLoadFunction 选项（在创建时设置）
    tileLoadFunction: function(tile, src) {
      const img = tile.getImage()
      img.src = src
      // 可以添加自定义加载逻辑
    }
  })
})`,
    returns: { type: 'Function', description: '瓦片加载函数' }
  },

  {
    name: 'getTileUrlFunction',
    cn: '获取瓦片 URL 函数',
    type: 'method',
    category: 'methods',
    description: '返回瓦片 URL 函数。已废弃，建议使用 ImageTile 源的 url 选项替代。',
    usage: `// ============================================
// getTileUrlFunction 方法（已废弃）
// ============================================
// 获取当前的瓦片 URL 函数

// 已废弃，建议使用新的 url 或 tileUrlFunction 方式
const urlFn = source.getTileUrlFunction()

// 新的推荐方式：
import XYZ from 'ol/source/XYZ'

const source = new XYZ({
  url: 'https://example.com/{z}/{x}/{y}.png',
  // 或使用自定义 URL 函数
  tileUrlFunction: function(coord) {
    const z = coord[0]
    const x = coord[1]
    const y = -coord[2] - 1 // Y 轴反转
    return 'https://example.com/' + z + '/' + x + '/' + y + '.png'
  }
})`,
    returns: { type: 'Function', description: '瓦片 URL 函数' }
  },

  {
    name: 'setTileGridForProjection',
    cn: '设置投影瓦片网格',
    type: 'method',
    category: 'methods',
    description: '设置重投影时使用的瓦片网格。当源需要重投影到不同坐标系时，可以为每个投影设置专用瓦片网格。',
    usage: `// ============================================
// setTileGridForProjection 方法
// ============================================
// 设置特定投影的瓦片网格

import {TileGrid} from 'ol/tilegrid'
import {get as getProjection} from 'ol/proj'

// 创建自定义瓦片网格
const customTileGrid = new TileGrid({
  extent: [-180, -90, 180, 90],
  resolutions: [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1],
  tileSize: 256
})

// 为 EPSG:4326 投影设置自定义瓦片网格
const epsg4326 = getProjection('EPSG:4326')
source.setTileGridForProjection(epsg4326, customTileGrid)

// 应用场景：优化特定投影的瓦片加载性能
// 或使用非标准瓦片大小的服务`,
    params: [
      { name: 'projection', type: 'Projection', default: undefined, description: '投影对象' },
      { name: 'tilegrid', type: 'TileGrid', default: undefined, description: '瓦片网格对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'setTileLoadFunction',
    cn: '设置瓦片加载函数',
    type: 'method',
    category: 'methods',
    description: '设置瓦片加载函数。已废弃，建议在创建源时通过 tileLoadFunction 选项设置。',
    usage: `// ============================================
// setTileLoadFunction 方法（已废弃）
// ============================================
// 设置瓦片加载函数

// 已废弃，建议在构造函数中设置
const customLoader = function(tile, src) {
  const img = tile.getImage()
  img.src = src
  // 自定义加载逻辑
}

// 旧方式（已废弃）
source.setTileLoadFunction(customLoader)

// 新方式（推荐）：
import XYZ from 'ol/source/XYZ'

const source = new XYZ({
  url: 'https://example.com/{z}/{x}/{y}.png',
  tileLoadFunction: customLoader
})`,
    params: [
      { name: 'tileLoadFunction', type: 'Function', default: undefined, description: '瓦片加载函数' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'setTileUrlFunction',
    cn: '设置瓦片 URL 函数',
    type: 'method',
    category: 'methods',
    description: '设置瓦片 URL 函数。已废弃，建议在创建源时通过 url 或 tileUrlFunction 选项设置。',
    usage: `// ============================================
// setTileUrlFunction 方法（已废弃）
// ============================================
// 设置瓦片 URL 函数

// 已废弃，建议在构造函数中设置
const customUrlFunction = function(coord) {
  const z = coord[0]
  const x = coord[1]
  const y = coord[2]
  return 'https://example.com/' + z + '/' + x + '/' + y + '.png'
}

// 旧方式（已废弃）
source.setTileUrlFunction(customUrlFunction)

// 新方式（推荐）：
import XYZ from 'ol/source/XYZ'

const source = new XYZ({
  tileUrlFunction: customUrlFunction
})`,
    params: [
      { name: 'tileUrlFunction', type: 'Function', default: undefined, description: '瓦片 URL 函数' },
      { name: 'key', type: 'string', default: undefined, description: '可选的键值' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'on',
    cn: '监听事件',
    type: 'method',
    category: 'methods',
    description: '监听特定类型的事件。支持的事件包括 change、error、propertychange、tileloadstart、tileloadend、tileloaderror 等。',
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

// 监听瓦片加载开始
source.on('tileloadstart', (event) => {
  console.log('开始加载瓦片:', event.tile.getTileCoord())
})

// 监听瓦片加载完成
source.on('tileloadend', (event) => {
  console.log('瓦片加载完成:', event.tile.getTileCoord())
})

// 监听瓦片加载错误
source.on('tileloaderror', (event) => {
  console.error('瓦片加载失败:', event.tile.getTileCoord())
})

// 移除监听
const listenerKey = source.on('change', handleChange)
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
  if (source && listenerKey) {
    source.un('change', listenerKey)
    source.un('tileloadend', handleTileLoadEnd)
    source.un('tileloaderror', handleTileLoadError)
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

.children-params {
  padding: 10px;
  background: #fafbfc;

  .children-table {
    margin-top: 10px;
  }

  .child-param-name {
    font-family: 'Consolas', 'Monaco', monospace;
    color: #667eea;
    font-size: 12px;
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
