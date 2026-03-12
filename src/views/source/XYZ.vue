<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>XYZ - XYZ 瓦片源 API</h2>
            <p class="description">
              XYZ 瓦片源用于加载符合 XYZ 格式的瓦片地图服务。XYZ 格式是一种通用的瓦片地图规范，
              URL 中使用 {x}、{y}、{z} 占位符表示瓦片坐标。OSM、Mapbox、Google Maps 等都支持 XYZ 格式。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_XYZ-XYZ.html" target="_blank">
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
const isAllExpanded = computed(() => activeNames.value.length === xyzApis.length)

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = xyzApis.map(api => api.name)
  }
}

// 分类过滤
const categories = computed(() => {
  const cats = {
    all: { name: 'all', cn: '全部', count: xyzApis.length },
    overview: { name: 'overview', cn: '概述', count: 0 },
    constructor: { name: 'constructor', cn: '构造函数', count: 0 },
    methods: { name: 'methods', cn: '方法', count: 0 }
  }
  xyzApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })
  return Object.values(cats).filter(c => c.count > 0)
})

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = xyzApis.map(api => api.name)
  } else {
    activeNames.value = xyzApis.filter(api => api.category === category).map(api => api.name)
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
    return xyzApis
  }
  return xyzApis.filter(api => api.category === currentCategory.value)
})

// XYZ API 列表
const xyzApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'XYZ 概述',
    type: 'overview',
    category: 'overview',
    description: 'XYZ 瓦片源用于加载符合 XYZ 格式的瓦片地图服务。XYZ 格式是一种通用的瓦片地图规范，URL 中使用 {x}、{y}、{z} 占位符表示瓦片坐标。其中 z 表示缩放级别，x 和 y 表示瓦片在网格中的位置。OSM、Mapbox、Google Maps、高德、百度等地图服务都支持 XYZ 格式。',
    usage: `// ============================================
// XYZ 瓦片源概述
// ============================================
// XYZ 格式说明：
// - {z}: 缩放级别（0-19 或更高）
// - {x}: 瓦片 X 坐标（从左到右递增）
// - {y}: 瓦片 Y 坐标（从上到下递增）
// - {-y}: 瓦片 Y 坐标（从下到上递增，TMS 格式）

// XYZ 继承关系：
// XYZ -> TileImage -> TileSource -> Source

// 常见 XYZ 服务 URL 模板：
// - OSM: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
// - Mapbox: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}'
// - Google: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
// - 高德：'https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'

// 使用示例：
import XYZ from 'ol/source/XYZ'
import {Tile as TileLayer} from 'ol/layer'

const xyzLayer = new TileLayer({
  source: new XYZ({
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attributions: '© OpenStreetMap contributors'
  })
})`
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建 XYZ 瓦片源实例。通过配置选项设置瓦片 URL、投影、缩放级别等参数。',
    usage: `// ============================================
// XYZ 构造函数
// ============================================
import XYZ from 'ol/source/XYZ'
import {Tile as TileLayer} from 'ol/layer'
import Map from 'ol/Map'

// 基础用法 - OSM 瓦片
const osmSource = new XYZ({
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 19,
  attributions: '© OpenStreetMap contributors'
})

// 完整配置
const xyzSource = new XYZ({
  url: 'https://tile.example.com/{z}/{x}/{y}.png',
  projection: 'EPSG:3857',      // 投影，默认 EPSG:3857
  tileSize: [256, 256],         // 瓦片大小，默认 [256, 256]
  maxZoom: 19,                  // 最大缩放级别
  minZoom: 0,                   // 最小缩放级别
  crossOrigin: 'anonymous',     // 跨域设置
  wrapX: true,                  // 是否水平环绕
  interpolate: true,            // 重采样插值
  transition: 250,              // 透明度过渡时间（毫秒）
  attributions: '© Example Map' // 版权信息
})

// 使用 {-y} 的 TMS 格式（Y 轴从下到上）
const tmsSource = new XYZ({
  url: 'https://example.com/{z}/{x}/{-y}.png',
  tileSize: 256
})

// 创建地图
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: xyzSource
    })
  ],
  view: {
    center: [0, 0],
    zoom: 2
  }
})`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'XYZ 配置选项',
        children: [
          { name: 'url', type: 'string', default: undefined, description: 'URL 模板，必须包含 {x}、{y}、{z} 占位符' },
          { name: 'projection', type: 'ProjectionLike', default: 'EPSG:3857', description: '投影坐标系' },
          { name: 'tileSize', type: 'number|Array<number>', default: '[256, 256]', description: '瓦片大小' },
          { name: 'crossOrigin', type: 'string', default: undefined, description: '跨域属性，如 anonymous' },
          { name: 'wrapX', type: 'boolean', default: 'true', description: '是否水平环绕世界' },
          { name: 'attributions', type: 'AttributionLike', default: undefined, description: '版权信息' },
          { name: 'attributionsCollapsible', type: 'boolean', default: 'true', description: '版权信息是否可折叠' },
          { name: 'cacheSize', type: 'number', default: undefined, description: '已废弃，建议在图层上设置' },
          { name: 'referrerPolicy', type: 'string', default: undefined, description: '图片 referrerPolicy 属性' },
          { name: 'interpolate', type: 'boolean', default: 'true', description: '重采样时是否使用插值' },
          { name: 'reprojectionErrorThreshold', type: 'number', default: '0.5', description: '最大重投影误差（像素）' },
          { name: 'maxZoom', type: 'number', default: '42', description: '最大缩放级别' },
          { name: 'minZoom', type: 'number', default: '0', description: '最小缩放级别' },
          { name: 'maxResolution', type: 'number', default: undefined, description: '最大分辨率' },
          { name: 'tileGrid', type: 'TileGrid', default: undefined, description: '自定义瓦片网格' },
          { name: 'tileLoadFunction', type: 'Function', default: undefined, description: '自定义瓦片加载函数' },
          { name: 'tilePixelRatio', type: 'number', default: '1', description: '瓦片像素比例' },
          { name: 'gutter', type: 'number', default: '0', description: '瓦片周围的留白大小（像素）' },
          { name: 'transition', type: 'number', default: '250', description: '透明度过渡动画持续时间' },
          { name: 'zDirection', type: 'number', default: '0', description: '缩放级别方向选择' },
          { name: 'urls', type: 'Array<string>', default: undefined, description: '已废弃，使用 url 数组替代' }
        ]
      }
    ],
    returns: { type: 'XYZ', description: '新的 XYZ 实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'setUrl',
    cn: '设置 URL',
    type: 'method',
    category: 'methods',
    description: '设置瓦片服务的 URL。用于动态切换瓦片源或更新 URL 配置。',
    usage: `// ============================================
// setUrl 方法
// ============================================
// 设置新的瓦片 URL

import XYZ from 'ol/source/XYZ'

const source = new XYZ({
  url: 'https://tile1.example.com/{z}/{x}/{y}.png'
})

// 动态切换 URL
source.setUrl('https://tile2.example.com/{z}/{x}/{y}.png')

// 应用场景：切换不同风格的瓦片
function switchMapStyle(style) {
  const urls = {
    standard: 'https://tile.example.com/standard/{z}/{x}/{y}.png',
    satellite: 'https://tile.example.com/satellite/{z}/{x}/{y}.png',
    terrain: 'https://tile.example.com/terrain/{z}/{x}/{y}.png'
  }
  source.setUrl(urls[style])
}`,
    params: [
      { name: 'url', type: 'string', default: undefined, description: '新的瓦片 URL' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'setUrls',
    cn: '设置 URLs',
    type: 'method',
    category: 'methods',
    description: '设置多个瓦片服务 URL。请求会在多个 URL 之间分布，实现负载均衡。已废弃，建议在创建时使用 urls 选项。',
    usage: `// ============================================
// setUrls 方法（已废弃）
// ============================================
// 设置多个瓦片 URL（负载均衡）

// 已废弃，建议在创建时设置
const urls = [
  'https://tile1.example.com/{z}/{x}/{y}.png',
  'https://tile2.example.com/{z}/{x}/{y}.png',
  'https://tile3.example.com/{z}/{x}/{y}.png'
]

// 旧方式（已废弃）
source.setUrls(urls)

// 新方式（推荐）：
import XYZ from 'ol/source/XYZ'

const source = new XYZ({
  urls: urls  // 直接在创建时设置
})

// 请求会自动在多个 URL 之间分布
// 提高加载速度和可靠性`,
    params: [
      { name: 'urls', type: 'Array<string>', default: undefined, description: '瓦片 URL 数组' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },

  {
    name: 'getUrls',
    cn: '获取 URLs',
    type: 'method',
    category: 'methods',
    description: '返回当前配置的 URLs 数组。用于获取当前使用的瓦片服务地址列表。',
    usage: `// ============================================
// getUrls 方法
// ============================================
// 获取当前配置的 URLs

import XYZ from 'ol/source/XYZ'

const source = new XYZ({
  urls: [
    'https://tile1.example.com/{z}/{x}/{y}.png',
    'https://tile2.example.com/{z}/{x}/{y}.png'
  ]
})

const urls = source.getUrls()
console.log('瓦片 URLs:', urls)
// 输出：['https://tile1.example.com/...', 'https://tile2.example.com/...']

// 应用场景：检查当前配置的瓦片服务
function checkTileServers() {
  const urls = source.getUrls()
  console.log('当前瓦片服务器数量:', urls.length)
  urls.forEach((url, index) => {
    console.log('服务器', index + 1, ':', url)
  })
}`,
    returns: { type: 'Array<string>', description: 'URL 数组' }
  },

  {
    name: 'changed',
    cn: '触发变更',
    type: 'method',
    category: 'methods',
    description: '增加版本号并触发 change 事件。当源的状态发生变化时调用。',
    usage: `// ============================================
// changed 方法
// ============================================
// 通常由内部调用，用户很少直接使用

source.on('change', () => {
  console.log('源已变更')
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

import XYZ from 'ol/source/XYZ'

const source = new XYZ({
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attributions: '© OpenStreetMap contributors'
})

const attributions = source.getAttributions()
console.log('版权信息:', attributions)`,
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

const source = new XYZ({
  projection: 'EPSG:3857'
})

const projection = source.getProjection()
console.log('投影代码:', projection.getCode()) // 'EPSG:3857'
console.log('投影单位:', projection.getUnits()) // 'm'`,
    returns: { type: 'Projection', description: '投影对象' }
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

const source = new XYZ({
  maxZoom: 19
})

const tileGrid = source.getTileGrid()
console.log('瓦片网格:', tileGrid)

// 获取分辨率数组
const resolutions = tileGrid.getResolutions()
console.log('分辨率数组:', resolutions)

// 获取指定级别的分辨率
const resolution = tileGrid.getResolution(10)
console.log('级别 10 的分辨率:', resolution)`,
    returns: { type: 'TileGrid', description: '瓦片网格对象' }
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
// - 'ready': 源已就绪
// - 'loading': 源正在加载
// - 'error': 源加载出错

const state = source.getState()
console.log('当前状态:', state)

// 监听状态变化
source.on('change', () => {
  const state = source.getState()
  if (state === 'error') {
    console.error('瓦片源加载失败')
  }
})`,
    returns: { type: 'string', description: '源状态：ready | loading | error' }
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

// 监听变更事件
source.on('change', () => {
  const state = source.getState()
  console.log('源状态变更:', state)
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
