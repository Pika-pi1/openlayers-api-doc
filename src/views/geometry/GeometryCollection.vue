<template>
  <div class="api-documentation">
    <el-card class="api-card">
      <template #header>
        <div class="card-header">
          <h2>GeometryCollection - 几何集合</h2>
          <el-tag type="info" size="large">ol/geom/GeometryCollection</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <section class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>GeometryCollection 是多种几何类型的集合容器，可以包含任意类型的几何对象（Point、LineString、Polygon、Circle 等）。适用于描述复杂的地理要素，如一个行政区同时包含点（政府驻地）、线（边界线）、面（行政区域）等多种几何类型。</p>

        <div class="import-section">
          <h4>导入方式</h4>
          <el-input type="textarea" :rows="2" readonly v-model="importCode" class="code-input" />
        </div>
      </section>

      <!-- 构造函数 -->
      <section class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-block">
          <code class="constructor-signature">new GeometryCollection(geometries: Array&lt;Geometry&gt;)</code>
        </div>

        <el-table :data="constructorParams" border stripe class="api-table">
          <el-table-column prop="name" label="参数" width="150" />
          <el-table-column prop="type" label="类型" width="250" />
          <el-table-column prop="required" label="必填" width="80" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </section>

      <!-- 公共方法 -->
      <section class="api-section">
        <h3><el-icon><Tools /></el-icon> 公共方法</h3>

        <h4>核心方法</h4>
        <el-table :data="coreMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="320" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>几何集合操作</h4>
        <el-table :data="collectionMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="320" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>变换方法</h4>
        <el-table :data="transformMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="320" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>继承方法 (来自 Geometry/Object/Observable)</h4>
        <el-table :data="inheritedMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="180" />
          <el-table-column prop="returns" label="返回值" width="120" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </section>

      <!-- 使用示例 -->
      <section class="api-section">
        <h3><el-icon><Code /></el-icon> 使用示例</h3>

        <el-tabs type="border-card">
          <el-tab-pane label="基础用法">
            <pre class="code-block"><code>{{ basicExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="复杂要素">
            <pre class="code-block"><code>{{ complexExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="GeoJSON 转换">
            <pre class="code-block"><code>{{ geojsonExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="遍历操作">
            <pre class="code-block"><code>{{ traverseExample }}</code></pre>
          </el-tab-pane>
        </el-tabs>
      </section>

      <!-- 事件 -->
      <section class="api-section">
        <h3><el-icon><Bell /></el-icon> 事件</h3>
        <el-table :data="events" border stripe class="api-table">
          <el-table-column prop="name" label="事件名" width="150" />
          <el-table-column prop="type" label="类型" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </section>

      <!-- 官方文档链接 -->
      <section class="api-section">
        <div class="official-link-section">
          <el-link
            type="primary"
            :href="officialDocUrl"
            target="_blank"
            :underline="false"
          >
            <el-icon><Link /></el-icon>
            查看 OpenLayers 官方文档
          </el-link>
        </div>
      </section>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Document, Setting, Tools, Notebook, Bell, Link
} from '@element-plus/icons-vue'

const importCode = ref("import GeometryCollection from 'ol/geom/GeometryCollection.js'")

const constructorParams = ref([
  { name: 'geometries', type: 'Array<Geometry>', required: '是', description: '几何对象数组，可以包含任意类型的几何（Point、LineString、Polygon 等）' }
])

const coreMethods = ref([
  {
    name: 'getType()',
    signature: 'getType(): Type',
    returns: 'Type',
    description: '获取几何类型，GeometryCollection 返回 "GeometryCollection"'
  },
  {
    name: 'clone()',
    signature: 'clone(): GeometryCollection',
    returns: 'GeometryCollection',
    description: '创建几何集合的完整副本（包括所有子几何）'
  },
  {
    name: 'getExtent()',
    signature: 'getExtent(extent?: Extent): Extent',
    returns: 'Extent',
    description: '获取几何集合的范围（所有子几何的联合边界框）'
  },
  {
    name: 'intersectsExtent()',
    signature: 'intersectsExtent(extent: Extent): boolean',
    returns: 'boolean',
    description: '测试几何集合是否与给定的范围相交'
  }
])

const collectionMethods = ref([
  {
    name: 'getGeometries()',
    signature: 'getGeometries(): Array<Geometry>',
    returns: 'Array<Geometry>',
    description: '返回所有几何对象的数组'
  },
  {
    name: 'setGeometries()',
    signature: 'setGeometries(geometries: Array<Geometry>): void',
    returns: 'void',
    description: '设置几何集合的几何对象数组'
  }
])

const transformMethods = ref([
  {
    name: 'applyTransform()',
    signature: 'applyTransform(transformFn: TransformFunction): void',
    returns: 'void',
    description: '对所有子几何的坐标应用变换函数（原地修改）'
  },
  {
    name: 'transform()',
    signature: 'transform(source: ProjectionLike, destination: ProjectionLike): this',
    returns: 'this',
    description: '将所有子几何的坐标从一个坐标系变换到另一个坐标系'
  },
  {
    name: 'translate()',
    signature: 'translate(deltaX: number, deltaY: number): void',
    returns: 'void',
    description: '平移所有子几何（原地修改）'
  },
  {
    name: 'rotate()',
    signature: 'rotate(angle: number, anchor: Coordinate): void',
    returns: 'void',
    description: '绕给定坐标旋转所有子几何（原地修改）'
  },
  {
    name: 'scale()',
    signature: 'scale(sx: number, sy?: number, anchor?: Coordinate): void',
    returns: 'void',
    description: '缩放所有子几何（原地修改）'
  },
  {
    name: 'simplify()',
    signature: 'simplify(tolerance: number): Geometry',
    returns: 'Geometry',
    description: '创建简化版本的几何集合'
  }
])

const inheritedMethods = ref([
  { name: 'changed()', returns: 'void', description: '增加修订计数器并触发 change 事件' },
  { name: 'getRevision()', returns: 'number', description: '获取修订版本号' },
  { name: 'getProperties()', returns: 'Object', description: '获取所有属性键值对' },
  { name: 'setProperties()', returns: 'void', description: '设置属性集合' },
  { name: 'get()', returns: '*', description: '获取指定键的值' },
  { name: 'set()', returns: 'void', description: '设置单个属性值' },
  { name: 'unset()', returns: 'void', description: '删除属性' },
  { name: 'getKeys()', returns: 'string[]', description: '获取所有属性名列表' },
  { name: 'on()', returns: 'EventsKey', description: '监听事件' },
  { name: 'once()', returns: 'EventsKey', description: '监听一次性事件' },
  { name: 'un()', returns: 'void', description: '取消事件监听' },
  { name: 'dispatchEvent()', returns: 'boolean', description: '触发事件' },
  { name: 'getClosestPoint()', returns: 'Coordinate', description: '获取几何集合上最接近给定点的坐标' },
  { name: 'getFirstCoordinate()', returns: 'Coordinate', description: '返回第一个子几何的第一个坐标' },
  { name: 'getLastCoordinate()', returns: 'Coordinate', description: '返回最后一个子几何的最后一个坐标' },
  { name: 'intersectsCoordinate()', returns: 'boolean', description: '测试是否包含给定坐标' }
])

const basicExample = ref(`import GeometryCollection from 'ol/geom/GeometryCollection.js'
import Point from 'ol/geom/Point.js'
import LineString from 'ol/geom/LineString.js'
import Polygon from 'ol/geom/Polygon.js'

// 创建不同类型的几何
const point = new Point([0, 0])
const line = new LineString([
  [0, 0],
  [10, 10]
])
const polygon = new Polygon([[
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
  [0, 0]
]])

// 创建几何集合
const collection = new GeometryCollection([point, line, polygon])

// 获取所有几何
const geometries = collection.getGeometries()
console.log('几何数量:', geometries.length)  // 3

// 获取每个几何的类型
geometries.forEach((geom, index) => {
  console.log('几何', index, '类型:', geom.getType())
})

// 获取集合的范围
const extent = collection.getExtent()
console.log('范围:', extent)

// 设置新的几何数组
const newPoint = new Point([100, 100])
collection.setGeometries([newPoint])

// 克隆集合
const clone = collection.clone()`)

const complexExample = ref(`import GeometryCollection from 'ol/geom/GeometryCollection.js'
import Point from 'ol/geom/Point.js'
import LineString from 'ol/geom/LineString.js'
import Polygon from 'ol/geom/Polygon.js'
import Circle from 'ol/geom/Circle.js'
import Feature from 'ol/Feature.js'

// 场景：校园地图要素集合
const campusElements = new GeometryCollection([
  // 校门（点）
  new Point([116.4, 39.9]),

  // 主干道（线）
  new LineString([
    [116.4, 39.9],
    [116.41, 39.9],
    [116.42, 39.91]
  ]),

  // 教学楼（面）
  new Polygon([[
    [116.405, 39.905],
    [116.415, 39.905],
    [116.415, 39.915],
    [116.405, 39.915],
    [116.405, 39.905]
  ]]),

  // 操场（圆形）
  new Circle([116.42, 39.92], 100)
])

// 创建特征并添加属性
const feature = new Feature(campusElements)
feature.setProperties({
  name: '某某大学',
  type: 'educational',
  area: '2.5 km²',
  buildings: 20,
  students: 15000
})

// 获取范围用于地图缩放
const campusExtent = campusElements.getExtent()
console.log('校园范围:', campusExtent)`)

const geojsonExample = ref(`import GeometryCollection from 'ol/geom/GeometryCollection.js'
import Point from 'ol/geom/Point.js'
import LineString from 'ol/geom/LineString.js'
import GeoJSON from 'ol/format/GeoJSON.js'

// 创建几何集合
const collection = new GeometryCollection([
  new Point([116.4, 39.9]),
  new LineString([
    [116.4, 39.9],
    [121.4, 31.2]
  ])
])

// 转换为 GeoJSON
const geojsonFormat = new GeoJSON()
const geojson = geojsonFormat.writeGeometryObject(collection, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
})

console.log('GeoJSON:', JSON.stringify(geojson, null, 2))
/*
{
  "type": "GeometryCollection",
  "geometries": [
    {
      "type": "Point",
      "coordinates": [116.4, 39.9]
    },
    {
      "type": "LineString",
      "coordinates": [[116.4, 39.9], [121.4, 31.2]]
    }
  ]
}
*/

// 从 GeoJSON 解析
const parsedGeometry = geojsonFormat.readGeometry(geojson)
console.log('解析后的类型:', parsedGeometry.getType())`)

const traverseExample = ref(`import GeometryCollection from 'ol/geom/GeometryCollection.js'
import Point from 'ol/geom/Point.js'
import LineString from 'ol/geom/LineString.js'
import Polygon from 'ol/geom/Polygon.js'

// 创建几何集合
const collection = new GeometryCollection([
  new Point([0, 0]),
  new Point([10, 10]),
  new LineString([
    [0, 0],
    [10, 10]
  ]),
  new Polygon([[
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [0, 0]
  ]])
])

// 遍历所有几何
const geometries = collection.getGeometries()

// 按类型分类
const points = []
const lines = []
const polygons = []

geometries.forEach(geom => {
  const type = geom.getType()
  switch(type) {
    case 'Point':
      points.push(geom)
      break
    case 'LineString':
      lines.push(geom)
      break
    case 'Polygon':
      polygons.push(geom)
      break
  }
})

console.log('点数:', points.length)      // 2
console.log('线数:', lines.length)      // 1
console.log('面数:', polygons.length)   // 1

// 坐标变换（批量）
collection.transform('EPSG:4326', 'EPSG:3857')

// 平移整个集合
collection.translate(100, 100)

// 获取最近点
const closestPoint = collection.getClosestPoint([50, 50])
console.log('最近点:', closestPoint)`)

const events = ref([
  { name: 'change', type: 'BaseEvent', description: '当修订计数器增加时触发' },
  { name: 'error', type: 'BaseEvent', description: '发生错误时触发' },
  { name: 'propertychange', type: 'ObjectEvent', description: '属性改变时触发' }
])

const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_geom_GeometryCollection-GeometryCollection.html'
</script>

<style lang="scss" scoped>
.api-documentation {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.api-card {
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  :deep(.el-card__header) {
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    color: #333;
    padding: 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
}

.api-section {
  margin-bottom: 32px;

  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #303133;
    font-size: 18px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #909399;

    .el-icon {
      color: #909399;
    }
  }

  h4 {
    color: #606266;
    font-size: 15px;
    margin: 20px 0 12px 0;
    padding-left: 12px;
    border-left: 4px solid #909399;
  }

  p {
    color: #606266;
    line-height: 1.8;
    font-size: 14px;
  }
}

.import-section {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;

  h4 {
    margin-top: 0;
    border-left: none;
    padding-left: 0;
  }
}

.constructor-block {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid #909399;
}

.constructor-signature {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 15px;
  color: #d63384;
  word-break: break-all;
}

.code-input {
  :deep(.el-textarea__inner) {
    font-family: 'Consolas', 'Monaco', monospace;
    background: #282c34;
    color: #abb2bf;
    border: none;
  }
}

.api-table {
  width: 100%;
  margin-top: 12px;
  font-size: 13px;

  :deep(.el-table__header th) {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 600;
  }

  :deep(.el-table__row:hover) {
    background-color: #f5f7fa;
  }

  code {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 12px;
    color: #d63384;
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;

  code {
    font-family: 'Consolas', 'Monaco', monospace;
    white-space: pre;
  }
}

.official-link-section {
  text-align: center;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #bae8ff;

  .el-link {
    font-size: 15px;

    .el-icon {
      margin-right: 6px;
    }
  }
}
</style>
