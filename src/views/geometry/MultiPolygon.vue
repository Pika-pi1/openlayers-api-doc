<template>
  <div class="api-documentation">
    <el-card class="api-card">
      <template #header>
        <div class="card-header">
          <h2>MultiPolygon - 多面几何</h2>
          <el-tag type="warning" size="large">ol/geom/MultiPolygon</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <section class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>MultiPolygon 表示多个 Polygon 的集合，用于描述不连续的面状地理要素群组，如群岛、分散的行政区、多个湖泊等。每个多边形都是独立的 Polygon 对象，可以包含外环和内环（洞）。</p>

        <div class="import-section">
          <h4>导入方式</h4>
          <el-input type="textarea" :rows="2" readonly v-model="importCode" class="code-input" />
        </div>
      </section>

      <!-- 构造函数 -->
      <section class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-block">
          <code class="constructor-signature">new MultiPolygon(coordinates: Array&lt;Array&lt;Array&lt;Coordinate&gt;&gt;&gt; | Array&lt;Polygon&gt;, layout?: GeometryLayout, endss?: Array&lt;Array&lt;number&gt;&gt;)</code>
        </div>

        <el-table :data="constructorParams" border stripe class="api-table">
          <el-table-column prop="name" label="参数" width="150" />
          <el-table-column prop="type" label="类型" width="300" />
          <el-table-column prop="required" label="必填" width="80" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </section>

      <!-- 静态方法 -->
      <section class="api-section">
        <h3><el-icon><Coin /></el-icon> 静态方法</h3>
        <el-table :data="staticMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="350" />
          <el-table-column prop="returns" label="返回值" width="150" />
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

        <h4>坐标操作</h4>
        <el-table :data="coordinateMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="320" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>多边形集合操作</h4>
        <el-table :data="polygonMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="320" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>多面特定方法</h4>
        <el-table :data="multiPolygonMethods" border stripe class="api-table">
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
          <el-tab-pane label="群岛应用">
            <pre class="code-block"><code>{{ islandsExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="面积计算">
            <pre class="code-block"><code>{{ areaExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="静态方法">
            <pre class="code-block"><code>{{ staticExample }}</code></pre>
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
  Document, Setting, Tools, Notebook, Bell, Link, Coin
} from '@element-plus/icons-vue'

const importCode = ref("import MultiPolygon from 'ol/geom/MultiPolygon.js'")

const constructorParams = ref([
  { name: 'coordinates', type: 'Array<Array<Array<Coordinate>>> | Array<Polygon>', required: '是', description: 'Polygon 坐标数组（三级嵌套）或 Polygon 对象数组' },
  { name: 'layout', type: 'GeometryLayout | undefined', required: '否', description: '坐标布局，如 XY, XYZ, XYM, XYZM' },
  { name: 'endss', type: 'Array<Array<number>>', required: '否', description: '内部使用，每个多边形的线性环结束索引数组' }
])

const staticMethods = ref([
  {
    name: 'fromPolygons',
    signature: 'fromPolygons(polygons: Array<Polygon>): MultiPolygon',
    returns: 'MultiPolygon',
    description: '从 Polygon 数组创建 MultiPolygon'
  }
])

const coreMethods = ref([
  {
    name: 'getType()',
    signature: 'getType(): Type',
    returns: 'Type',
    description: '获取几何类型，MultiPolygon 返回 "MultiPolygon"'
  },
  {
    name: 'clone()',
    signature: 'clone(): MultiPolygon',
    returns: 'MultiPolygon',
    description: '创建多面几何的完整副本'
  },
  {
    name: 'getExtent()',
    signature: 'getExtent(extent?: Extent): Extent',
    returns: 'Extent',
    description: '获取多面集合的范围（边界框）'
  },
  {
    name: 'intersectsExtent()',
    signature: 'intersectsExtent(extent: Extent): boolean',
    returns: 'boolean',
    description: '测试多面集合是否与给定的范围相交'
  }
])

const coordinateMethods = ref([
  {
    name: 'getCoordinates()',
    signature: 'getCoordinates(right?: boolean): Array<Array<Array<Coordinate>>>',
    returns: 'Array<Array<Array<Coordinate>>>',
    description: '返回所有多边形的坐标数组（三级嵌套），符合 GeoJSON 格式'
  },
  {
    name: 'setCoordinates()',
    signature: 'setCoordinates(coordinates: Array<Array<Array<Coordinate>>>, layout?: GeometryLayout): void',
    returns: 'void',
    description: '设置多面集合的坐标'
  }
])

const polygonMethods = ref([
  {
    name: 'getPolygon()',
    signature: 'getPolygon(index: number): Polygon',
    returns: 'Polygon',
    description: '返回指定索引的多边形'
  },
  {
    name: 'getPolygons()',
    signature: 'getPolygons(): Array<Polygon>',
    returns: 'Array<Polygon>',
    description: '返回所有多边形的数组'
  },
  {
    name: 'appendPolygon()',
    signature: 'appendPolygon(polygon: Polygon): void',
    returns: 'void',
    description: '添加一个多边形到多面集合'
  }
])

const multiPolygonMethods = ref([
  {
    name: 'getArea()',
    signature: 'getArea(): number',
    returns: 'number',
    description: '返回所有多边形的总面积'
  },
  {
    name: 'getInteriorPoints()',
    signature: 'getInteriorPoints(): MultiPoint',
    returns: 'MultiPoint',
    description: '返回每个多边形内部点组成的 MultiPoint'
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
    description: '创建简化版本的几何，使用 Douglas-Peucker 算法'
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

const basicExample = ref(`import MultiPolygon from 'ol/geom/MultiPolygon.js'

// 创建多面几何（两个独立的矩形）
const multiPolygon = new MultiPolygon([
  // 第一个多边形
  [[
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [0, 0]
  ]],
  // 第二个多边形
  [[
    [20, 20],
    [30, 20],
    [30, 30],
    [20, 30],
    [20, 20]
  ]]
])

// 使用特征和样式
import Feature from 'ol/Feature.js'
import { Style, Fill, Stroke } from 'ol/style.js'

const feature = new Feature(multiPolygon)
feature.setStyle(new Style({
  fill: new Fill({
    color: 'rgba(255, 153, 0, 0.6)'
  }),
  stroke: new Stroke({
    color: '#FF6600',
    width: 2
  })
}))`)

const islandsExample = ref(`import MultiPolygon from 'ol/geom/MultiPolygon.js'
import Feature from 'ol/Feature.js'

// 场景：群岛（如夏威夷群岛、舟山群岛）
const hawaiiIslands = new MultiPolygon([
  // 夏威夷岛（大岛）
  [[
    [-155.5, 19.5],
    [-155.0, 19.5],
    [-154.8, 19.8],
    [-155.0, 20.2],
    [-155.5, 20.0],
    [-155.5, 19.5]
  ]],
  // 茂宜岛
  [[
    [-156.5, 20.6],
    [-156.0, 20.6],
    [-156.0, 21.0],
    [-156.5, 21.0],
    [-156.5, 20.6]
  ]],
  // 欧胡岛（檀香山所在）
  [[
    [-158.2, 21.2],
    [-157.6, 21.2],
    [-157.6, 21.7],
    [-158.2, 21.7],
    [-158.2, 21.2]
  ]],
  // 考艾岛
  [[
    [-159.7, 21.9],
    [-159.3, 21.9],
    [-159.3, 22.2],
    [-159.7, 22.2],
    [-159.7, 21.9]
  ]]
])

// 创建特征并添加属性
const feature = new Feature(hawaiiIslands)
feature.setProperties({
  name: '夏威夷群岛',
  totalArea: hawaiiIslands.getArea(),
  islandCount: 4
})

// 获取每个多边形
const polygons = hawaiiIslands.getPolygons()
polygons.forEach((polygon, index) => {
  console.log('岛屿', index, '面积:', polygon.getArea())
})

// 获取所有岛屿的内部点（用于放置标签）
const interiorPoints = hawaiiIslands.getInteriorPoints()
console.log('内部点:', interiorPoints.getCoordinates())`)

const areaExample = ref(`import MultiPolygon from 'ol/geom/MultiPolygon.js'

// 创建带洞的多边形集合
const complexMultiPolygon = new MultiPolygon([
  // 第一个多边形（带洞）
  [
    // 外环
    [
      [0, 0],
      [100, 0],
      [100, 100],
      [0, 100],
      [0, 0]
    ],
    // 内环（洞）
    [
      [25, 25],
      [75, 25],
      [75, 75],
      [25, 75],
      [25, 25]
    ]
  ],
  // 第二个多边形（无洞）
  [[
    [150, 150],
    [200, 150],
    [200, 200],
    [150, 200],
    [150, 150]
  ]]
])

// 获取总面积（自动减去洞的面积）
const totalArea = complexMultiPolygon.getArea()
console.log('总面积:', totalArea)

// 获取每个多边形的面积
const polygons = complexMultiPolygon.getPolygons()
polygons.forEach((polygon, index) => {
  console.log('多边形', index, '面积:', polygon.getArea())
})

// 克隆多面
const clone = complexMultiPolygon.clone()`)

const staticExample = ref(`import MultiPolygon, { fromPolygons } from 'ol/geom/MultiPolygon.js'
import Polygon from 'ol/geom/Polygon.js'

// 创建多个独立的 Polygon
const poly1 = new Polygon([[
  [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [0, 0]
  ]])

const poly2 = new Polygon([[
  [20, 20],
  [30, 20],
  [30, 30],
  [20, 30],
  [20, 20]
]])

const poly3 = new Polygon([[
  [40, 40],
  [50, 40],
  [50, 50],
  [40, 50],
  [40, 40]
]])

// 使用 fromPolygons 静态方法创建 MultiPolygon
const multiPoly = fromPolygons([poly1, poly2, poly3])

console.log('多边形数量:', multiPoly.getPolygons().length)
console.log('总面积:', multiPoly.getArea())

// 添加新的多边形
const poly4 = new Polygon([[
  [60, 60],
  [70, 60],
  [70, 70],
  [60, 70],
  [60, 60]
]])
multiPoly.appendPolygon(poly4)`)

const events = ref([
  { name: 'change', type: 'BaseEvent', description: '当修订计数器增加时触发' },
  { name: 'error', type: 'BaseEvent', description: '发生错误时触发' },
  { name: 'propertychange', type: 'ObjectEvent', description: '属性改变时触发' }
])

const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_geom_MultiPolygon-MultiPolygon.html'
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
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
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
    border-bottom: 2px solid #e6a23c;

    .el-icon {
      color: #e6a23c;
    }
  }

  h4 {
    color: #606266;
    font-size: 15px;
    margin: 20px 0 12px 0;
    padding-left: 12px;
    border-left: 4px solid #e6a23c;
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
  border-left: 4px solid #e6a23c;
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
