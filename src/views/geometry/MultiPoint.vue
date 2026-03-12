<template>
  <div class="api-documentation">
    <el-card class="api-card">
      <template #header>
        <div class="card-header">
          <h2>MultiPoint - 多点几何</h2>
          <el-tag type="info" size="large">ol/geom/MultiPoint</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <section class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>MultiPoint 表示多个点的集合，用于描述离散的点状地理要素群组，如多个城市位置、POI 兴趣点集合、测量站点等。每个点都是独立的，没有连接关系。</p>

        <div class="import-section">
          <h4>导入方式</h4>
          <el-input type="textarea" :rows="2" readonly v-model="importCode" class="code-input" />
        </div>
      </section>

      <!-- 构造函数 -->
      <section class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-block">
          <code class="constructor-signature">new MultiPoint(coordinates: Array&lt;Coordinate&gt;, layout?: GeometryLayout)</code>
        </div>

        <el-table :data="constructorParams" border stripe class="api-table">
          <el-table-column prop="name" label="参数" width="150" />
          <el-table-column prop="type" label="类型" width="220" />
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
          <el-table-column prop="signature" label="签名" width="300" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>坐标操作</h4>
        <el-table :data="coordinateMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="300" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>点集合操作</h4>
        <el-table :data="pointMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="300" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>变换方法</h4>
        <el-table :data="transformMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="300" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>继承方法 (来自 SimpleGeometry/Geometry/Object/Observable)</h4>
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
          <el-tab-pane label="点操作">
            <pre class="code-block"><code>{{ pointExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="坐标变换">
            <pre class="code-block"><code>{{ transformExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="应用场景">
            <pre class="code-block"><code>{{ scenarioExample }}</code></pre>
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

const importCode = ref("import MultiPoint from 'ol/geom/MultiPoint.js'")

const constructorParams = ref([
  { name: 'coordinates', type: 'Array<Coordinate> | Array<number>', required: '是', description: '点坐标数组，格式为 [[x1,y1], [x2,y2], ...] 或扁平化坐标' },
  { name: 'layout', type: 'GeometryLayout | undefined', required: '否', description: '坐标布局，如 XY, XYZ, XYM, XYZM' }
])

const coreMethods = ref([
  {
    name: 'getType()',
    signature: 'getType(): Type',
    returns: 'Type',
    description: '获取几何类型，MultiPoint 返回 "MultiPoint"'
  },
  {
    name: 'clone()',
    signature: 'clone(): MultiPoint',
    returns: 'MultiPoint',
    description: '创建多点几何的完整副本'
  },
  {
    name: 'getExtent()',
    signature: 'getExtent(extent?: Extent): Extent',
    returns: 'Extent',
    description: '获取多点集合的范围（边界框）'
  },
  {
    name: 'intersectsExtent()',
    signature: 'intersectsExtent(extent: Extent): boolean',
    returns: 'boolean',
    description: '测试多点集合是否与给定的范围相交'
  }
])

const coordinateMethods = ref([
  {
    name: 'getCoordinates()',
    signature: 'getCoordinates(): Array<Coordinate>',
    returns: 'Array<Coordinate>',
    description: '返回所有点的坐标数组'
  },
  {
    name: 'setCoordinates()',
    signature: 'setCoordinates(coordinates: Array<Coordinate>, layout?: GeometryLayout): void',
    returns: 'void',
    description: '设置多点集合的坐标'
  }
])

const pointMethods = ref([
  {
    name: 'getPoint()',
    signature: 'getPoint(index: number): Point',
    returns: 'Point',
    description: '返回指定索引的点几何'
  },
  {
    name: 'getPoints()',
    signature: 'getPoints(): Array<Point>',
    returns: 'Array<Point>',
    description: '返回所有点几何的数组'
  },
  {
    name: 'appendPoint()',
    signature: 'appendPoint(point: Point): void',
    returns: 'void',
    description: '添加一个点到多点集合'
  }
])

const transformMethods = ref([
  {
    name: 'applyTransform()',
    signature: 'applyTransform(transformFn: TransformFunction): void',
    returns: 'void',
    description: '对坐标应用变换函数（原地修改）'
  },
  {
    name: 'transform()',
    signature: 'transform(source: ProjectionLike, destination: ProjectionLike): this',
    returns: 'this',
    description: '将坐标从一个坐标系变换到另一个坐标系'
  },
  {
    name: 'translate()',
    signature: 'translate(deltaX: number, deltaY: number): void',
    returns: 'void',
    description: '平移几何（原地修改）'
  },
  {
    name: 'rotate()',
    signature: 'rotate(angle: number, anchor: Coordinate): void',
    returns: 'void',
    description: '绕给定坐标旋转几何（原地修改），角度为逆时针弧度'
  },
  {
    name: 'scale()',
    signature: 'scale(sx: number, sy?: number, anchor?: Coordinate): void',
    returns: 'void',
    description: '缩放几何（原地修改），可选原点和 Y 方向缩放因子'
  },
  {
    name: 'simplify()',
    signature: 'simplify(tolerance: number): Geometry',
    returns: 'Geometry',
    description: '创建简化版本的几何（对于 MultiPoint 返回自身）'
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
  { name: 'getClosestPoint()', returns: 'Coordinate', description: '获取几何上最接近给定点的坐标' },
  { name: 'getFirstCoordinate()', returns: 'Coordinate', description: '返回第一个坐标' },
  { name: 'getLastCoordinate()', returns: 'Coordinate', description: '返回最后一个坐标' },
  { name: 'getLayout()', returns: 'GeometryLayout', description: '返回几何布局' },
  { name: 'intersectsCoordinate()', returns: 'boolean', description: '测试是否包含给定坐标' }
])

const basicExample = ref(`import MultiPoint from 'ol/geom/MultiPoint.js'

// 创建多点几何
const multiPoint = new MultiPoint([
  [0, 0],
  [10, 10],
  [20, 20]
])

// 创建 3D 多点
const multiPoint3D = new MultiPoint([
  [116.4, 39.9, 50],   // 北京
  [121.4, 31.2, 100],  // 上海
  [113.3, 23.1, 75]    // 广州
])

// 使用特征和样式
import Feature from 'ol/Feature.js'
import { Style, Circle as CircleStyle, Fill } from 'ol/style.js'

const feature = new Feature(multiPoint)
feature.setStyle(new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: '#3399CC'
    })
  })
}))`)

const pointExample = ref(`import MultiPoint from 'ol/geom/MultiPoint.js'
import Point from 'ol/geom/Point.js'

const multiPoint = new MultiPoint([
  [0, 0],
  [10, 10],
  [20, 20]
])

// 获取所有坐标
const coords = multiPoint.getCoordinates()
console.log(coords)
// [[0, 0], [10, 10], [20, 20]]

// 获取指定索引的点
const firstPoint = multiPoint.getPoint(0)
console.log(firstPoint.getCoordinates()) // [0, 0]

// 获取所有点几何
const points = multiPoint.getPoints()
points.forEach((point, index) => {
  console.log('Point', index, ':', point.getCoordinates())
})

// 添加新点
const newPoint = new Point([30, 30])
multiPoint.appendPoint(newPoint)
console.log(multiPoint.getCoordinates())
// [[0, 0], [10, 10], [20, 20], [30, 30]]

// 设置新坐标
multiPoint.setCoordinates([
  [100, 100],
  [200, 200]
])`)

const transformExample = ref(`import MultiPoint from 'ol/geom/MultiPoint.js'

const cities = new MultiPoint([
  [116.4, 39.9],  // 北京
  [121.4, 31.2],  // 上海
  [113.3, 23.1]   // 广州
])

// 坐标变换：WGS84 -> Web Mercator
cities.transform('EPSG:4326', 'EPSG:3857')
console.log(cities.getCoordinates())

// 变换回 WGS84
cities.transform('EPSG:3857', 'EPSG:4326')

// 平移
cities.translate(1, 1)

// 获取范围
const extent = cities.getExtent()
console.log('范围:', extent)`)

const scenarioExample = ref(`import MultiPoint from 'ol/geom/MultiPoint.js'
import Feature from 'ol/Feature.js'

// 场景 1: 气象站监测点
const weatherStations = new MultiPoint([
  [116.4, 39.9],  // 北京站
  [121.4, 31.2],  // 上海站
  [113.3, 23.1],  // 广州站
  [104.1, 30.7]   // 成都站
])

// 场景 2: 配送路线的多个取货点
const pickupPoints = new MultiPoint([
  [120.1, 30.2],
  [120.2, 30.3],
  [120.3, 30.4],
  [120.4, 30.5]
])

// 场景 3: 地震震中分布
const earthquakeCenters = new MultiPoint([
  [103.8, 30.5],
  [104.5, 31.2],
  [105.2, 30.8]
])

// 为每个点添加属性数据
const feature = new Feature(weatherStations)
feature.setProperties({
  stations: [
    { name: '北京', temp: 25 },
    { name: '上海', temp: 28 },
    { name: '广州', temp: 32 },
    { name: '成都', temp: 22 }
  ]
})`)

const events = ref([
  { name: 'change', type: 'BaseEvent', description: '当修订计数器增加时触发' },
  { name: 'error', type: 'BaseEvent', description: '发生错误时触发' },
  { name: 'propertychange', type: 'ObjectEvent', description: '属性改变时触发' }
])

const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_geom_MultiPoint-MultiPoint.html'
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
