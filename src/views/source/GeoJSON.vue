<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>GeoJSON - GeoJSON 格式 API</h2>
            <p class="description">
              GeoJSON 是 OpenLayers 中用于读取和写入 GeoJSON 格式数据的格式类。
              GeoJSON 是一种基于 JSON 的地理空间数据交换格式，支持点、线、面等多种几何类型。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_format_GeoJSON-GeoJSON.html" target="_blank">
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

const isAllExpanded = computed(() => activeNames.value.length === geojsonApis.length)

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = geojsonApis.map(api => api.name)
  }
}

const categories = computed(() => {
  const cats = {
    all: { name: 'all', cn: '全部', count: geojsonApis.length },
    overview: { name: 'overview', cn: '概述', count: 0 },
    constructor: { name: 'constructor', cn: '构造函数', count: 0 },
    methods: { name: 'methods', cn: '方法', count: 0 }
  }
  geojsonApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })
  return Object.values(cats).filter(c => c.count > 0)
})

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = geojsonApis.map(api => api.name)
  } else {
    activeNames.value = geojsonApis.filter(api => api.category === category).map(api => api.name)
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
    return geojsonApis
  }
  return geojsonApis.filter(api => api.category === currentCategory.value)
})

const geojsonApis = [
  {
    name: 'overview',
    cn: 'GeoJSON 概述',
    type: 'overview',
    category: 'overview',
    description: 'GeoJSON 是一种基于 JSON 的地理空间数据交换格式，用于表示点、线、面等地理要素。OpenLayers 的 GeoJSON 格式类提供了读取和写入 GeoJSON 数据的功能，支持与 Vector 源配合使用，加载和显示矢量数据。',
    usage: `// ============================================
// GeoJSON 概述
// ============================================
// GeoJSON 支持以下几何类型：
// - Point: 点
// - MultiPoint: 多点
// - LineString: 线
// - MultiLineString: 多线
// - Polygon: 面
// - MultiPolygon: 多面
// - GeometryCollection: 几何集合
// - Feature: 要素（几何体 + 属性）
// - FeatureCollection: 要素集合

// 继承关系：
// GeoJSON -> JSONFeature -> XMLFeature -> FeatureFormat

// 使用示例：
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'

// 创建 GeoJSON 格式实例
const geojsonFormat = new GeoJSON()

// 从 GeoJSON 对象读取要素
const features = geojsonFormat.readFeatures(geojsonObject, {
  featureProjection: 'EPSG:3857'
})

// 创建矢量源
const vectorSource = new VectorSource({
  features: features
})

// 创建矢量图层
const vectorLayer = new VectorLayer({
  source: vectorSource
})`
  },
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建 GeoJSON 格式实例。通过配置选项设置数据投影、要素投影等参数。',
    usage: `// ============================================
// GeoJSON 构造函数
// ============================================
import GeoJSON from 'ol/format/GeoJSON'

// 最简单的用法
const format = new GeoJSON()

// 完整配置
const format = new GeoJSON({
  // 数据源的投影
  dataProjection: 'EPSG:4326',

  // 要素投影（地图投影）
  featureProjection: 'EPSG:3857',

  // 坐标精度（小数位数）
  geometryName: 'geometry',

  // 提取要素属性
  extractAttributes: true
})

// 实际应用：加载 GeoJSON 文件
const format = new GeoJSON({
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
})

fetch('data.geojson')
  .then(response => response.json())
  .then(data => {
    const features = format.readFeatures(data)
    vectorSource.addFeatures(features)
  })`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'GeoJSON 配置选项',
        children: [
          { name: 'dataProjection', type: 'ProjectionLike', default: 'EPSG:4326', description: '数据源投影，默认 EPSG:4326（GeoJSON 标准）' },
          { name: 'featureProjection', type: 'ProjectionLike', default: undefined, description: '要素投影（地图投影）' },
          { name: 'geometryName', type: 'string', default: 'geometry', description: '几何属性名称' },
          { name: 'extractAttributes', type: 'boolean', default: 'true', description: '是否提取要素属性' }
        ]
      }
    ],
    returns: { type: 'GeoJSON', description: '新的 GeoJSON 实例' }
  },
  {
    name: 'readFeatures',
    cn: '读取要素',
    type: 'method',
    category: 'methods',
    description: '从 GeoJSON 对象或字符串读取要素。这是最常用的方法，用于将 GeoJSON 数据转换为 OpenLayers 要素。',
    usage: `// ============================================
// readFeatures 方法
// ============================================
import GeoJSON from 'ol/format/GeoJSON'

const format = new GeoJSON()

// 从对象读取
const features = format.readFeatures(geojsonObject, {
  featureProjection: 'EPSG:3857'
})

// 从字符串读取
const jsonString = '{"type":"FeatureCollection","features":[]}'
const features = format.readFeatures(jsonString, {
  featureProjection: 'EPSG:3857'
})

// 实际应用：加载本地 GeoJSON 文件
const format = new GeoJSON()
const vectorSource = new VectorSource()

fetch('data.geojson')
  .then(res => res.json())
  .then(data => {
    const features = format.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    })
    vectorSource.addFeatures(features)
  })

// 实际应用：从 URL 加载
const vectorSource = new VectorSource({
  url: 'data.geojson',
  format: new GeoJSON()
})`,
    params: [
      { name: 'source', type: 'Object|string', default: undefined, description: 'GeoJSON 对象或 JSON 字符串' },
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '读取选项',
        children: [
          { name: 'dataProjection', type: 'ProjectionLike', default: 'EPSG:4326', description: '数据源投影' },
          { name: 'featureProjection', type: 'ProjectionLike', default: undefined, description: '要素投影（地图投影）' }
        ]
      }
    ],
    returns: { type: 'Array<Feature>', description: '要素数组' }
  },
  {
    name: 'readFeature',
    cn: '读取单个要素',
    type: 'method',
    category: 'methods',
    description: '从 GeoJSON 对象或字符串读取单个要素。用于处理单个 GeoJSON 要素。',
    usage: `// ============================================
// readFeature 方法
// ============================================
import GeoJSON from 'ol/format/GeoJSON'

const format = new GeoJSON()

// 从对象读取单个要素
const featureJson = {
  "type": "Feature",
  "geometry": {"type": "Point", "coordinates": [116.4, 39.9]},
  "properties": {"name": "北京"}
}

const feature = format.readFeature(featureJson, {
  featureProjection: 'EPSG:3857'
})

console.log('要素:', feature)
console.log('属性:', feature.getProperties())`,
    params: [
      { name: 'source', type: 'Object|string', default: undefined, description: 'GeoJSON 要素对象或字符串' },
      { name: 'options', type: 'Object', default: '{}', description: '读取选项' }
    ],
    returns: { type: 'Feature', description: '单个要素' }
  },
  {
    name: 'readProjection',
    cn: '读取投影',
    type: 'method',
    category: 'methods',
    description: '从 GeoJSON 对象读取投影信息。',
    usage: `// ============================================
// readProjection 方法
// ============================================
const format = new GeoJSON()
const projection = format.readProjection(geojsonObject)
console.log('数据投影:', projection.getCode())`,
    params: [
      { name: 'source', type: 'Object|string', default: undefined, description: 'GeoJSON 对象或字符串' }
    ],
    returns: { type: 'Projection', description: '投影对象' }
  },
  {
    name: 'writeFeatures',
    cn: '写入要素',
    type: 'method',
    category: 'methods',
    description: '将要素数组写入 GeoJSON 字符串。用于导出或保存要素数据。',
    usage: `// ============================================
// writeFeatures 方法
// ============================================
import GeoJSON from 'ol/format/GeoJSON'

const format = new GeoJSON()

// 将要素数组写入 GeoJSON 字符串
const geojsonString = format.writeFeatures(features, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
})

// 下载 GeoJSON 文件
function downloadGeoJSON(features, filename) {
  const format = new GeoJSON()
  const geojsonString = format.writeFeatures(features, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  })

  const blob = new Blob([geojsonString], {type: 'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}`,
    params: [
      { name: 'features', type: 'Array<Feature>', default: undefined, description: '要素数组' },
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '写入选项',
        children: [
          { name: 'dataProjection', type: 'ProjectionLike', default: 'EPSG:4326', description: '数据源投影' },
          { name: 'featureProjection', type: 'ProjectionLike', default: undefined, description: '要素投影' },
          { name: 'decimals', type: 'number', default: '15', description: '坐标精度（小数位数）' }
        ]
      }
    ],
    returns: { type: 'string', description: 'GeoJSON 字符串' }
  },
  {
    name: 'writeFeaturesObject',
    cn: '写入要素对象',
    type: 'method',
    category: 'methods',
    description: '将要素数组写入 GeoJSON 对象（FeatureCollection）。',
    usage: `// ============================================
// writeFeaturesObject 方法
// ============================================
const format = new GeoJSON()

// 写入 GeoJSON 对象
const geojsonObject = format.writeFeaturesObject(features, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
})

console.log('GeoJSON 对象:', geojsonObject)
// 输出：{"type":"FeatureCollection","features":[...]}`,
    params: [
      { name: 'features', type: 'Array<Feature>', default: undefined, description: '要素数组' },
      { name: 'options', type: 'Object', default: '{}', description: '写入选项' }
    ],
    returns: { type: 'Object', description: 'GeoJSON 对象（FeatureCollection）' }
  },
  {
    name: 'writeFeature',
    cn: '写入单个要素',
    type: 'method',
    category: 'methods',
    description: '将单个要素写入 GeoJSON 字符串。',
    usage: `// ============================================
// writeFeature 方法
// ============================================
const format = new GeoJSON()

// 写入单个要素
const geojsonString = format.writeFeature(feature, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
})`,
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '单个要素' },
      { name: 'options', type: 'Object', default: '{}', description: '写入选项' }
    ],
    returns: { type: 'string', description: 'GeoJSON 字符串' }
  },
  {
    name: 'writeFeatureObject',
    cn: '写入要素对象',
    type: 'method',
    category: 'methods',
    description: '将单个要素写入 GeoJSON 对象。',
    usage: `// ============================================
// writeFeatureObject 方法
// ============================================
const format = new GeoJSON()

// 写入单个要素对象
const geojsonObject = format.writeFeatureObject(feature, {
  dataProjection: 'EPSG:4326'
})

console.log('要素对象:', geojsonObject)
// 输出：{"type":"Feature","geometry":{...},"properties":{...}}`,
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '单个要素' },
      { name: 'options', type: 'Object', default: '{}', description: '写入选项' }
    ],
    returns: { type: 'Object', description: 'GeoJSON 要素对象' }
  },
  {
    name: 'writeGeometry',
    cn: '写入几何',
    type: 'method',
    category: 'methods',
    description: '将几何对象写入 GeoJSON 字符串。',
    usage: `// ============================================
// writeGeometry 方法
// ============================================
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'

const format = new GeoJSON()
const point = new Point([116.4, 39.9])

// 写入几何
const geojsonString = format.writeGeometry(point, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
})

console.log('几何 JSON:', geojsonString)
// 输出：{"type":"Point","coordinates":[116.4,39.9]}`,
    params: [
      { name: 'geometry', type: 'Geometry', default: undefined, description: '几何对象' },
      { name: 'options', type: 'Object', default: '{}', description: '写入选项' }
    ],
    returns: { type: 'string', description: 'GeoJSON 几何字符串' }
  },
  {
    name: 'writeGeometryObject',
    cn: '写入几何对象',
    type: 'method',
    category: 'methods',
    description: '将几何对象写入 GeoJSON 对象。',
    usage: `// ============================================
// writeGeometryObject 方法
// ============================================
const format = new GeoJSON()
const point = new Point([116.4, 39.9])

// 写入几何对象
const geometryObject = format.writeGeometryObject(point, {
  dataProjection: 'EPSG:4326'
})

console.log('几何对象:', geometryObject)
// 输出：{"type":"Point","coordinates":[116.4,39.9]}`,
    params: [
      { name: 'geometry', type: 'Geometry', default: undefined, description: '几何对象' },
      { name: 'options', type: 'Object', default: '{}', description: '写入选项' }
    ],
    returns: { type: 'Object', description: 'GeoJSON 几何对象' }
  },
  {
    name: 'readGeometry',
    cn: '读取几何',
    type: 'method',
    category: 'methods',
    description: '从 GeoJSON 几何对象读取几何。',
    usage: `// ============================================
// readGeometry 方法
// ============================================
const format = new GeoJSON()

const geometryJson = {"type":"Point","coordinates":[116.4,39.9]}
const geometry = format.readGeometry(geometryJson, {
  featureProjection: 'EPSG:3857'
})

console.log('几何:', geometry)`,
    params: [
      { name: 'geometry', type: 'Object|string', default: undefined, description: 'GeoJSON 几何对象' },
      { name: 'options', type: 'Object', default: '{}', description: '读取选项' }
    ],
    returns: { type: 'Geometry', description: '几何对象' }
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
