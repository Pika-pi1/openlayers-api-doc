<template>
  <div class="api-documentation">
    <el-card class="api-card">
      <template #header>
        <div class="card-header">
          <h2>Polygon - 多边形几何</h2>
          <el-tag type="warning" size="large">ol/geom/Polygon</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <section class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>Polygon 表示封闭的多边形区域，由一个 exterior ring（外环）和零个或多个 interior rings（内环/洞）组成。多边形常用于描述行政区划、湖泊、建筑轮廓等面状地理要素。</p>

        <div class="import-section">
          <h4>导入方式</h4>
          <el-input type="textarea" :rows="2" readonly v-model="importCode" class="code-input" />
        </div>
      </section>

      <!-- 构造函数 -->
      <section class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-block">
          <code class="constructor-signature">new Polygon(coordinates: Array&lt;Array&lt;Coordinate&gt;&gt;, layout?: GeometryLayout, ends?: Array&lt;number&gt;)</code>
        </div>

        <el-table :data="constructorParams" border stripe class="api-table">
          <el-table-column prop="name" label="参数" width="150" />
          <el-table-column prop="type" label="类型" width="250" />
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

        <h4>线性环操作</h4>
        <el-table :data="ringMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="300" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>多边形特定方法</h4>
        <el-table :data="polygonMethods" border stripe class="api-table">
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
          <el-tab-pane label="带洞多边形">
            <pre class="code-block"><code>{{ holeExample }}</code></pre>
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
  Document, Setting, Tools, Notebook, Bell, Link, Money
} from '@element-plus/icons-vue'

const importCode = ref("import Polygon from 'ol/geom/Polygon.js'")

const constructorParams = ref([
  { name: 'coordinates', type: 'Array<Array<Coordinate>>', required: '是', description: '线性环坐标数组，第一个为外环，后续为内环（洞）' },
  { name: 'layout', type: 'GeometryLayout | undefined', required: '否', description: '坐标布局，如 XY, XYZ, XYM, XYZM' },
  { name: 'ends', type: 'Array<number>', required: '否', description: '内部使用，扁平坐标的结束索引数组' }
])

const staticMethods = ref([
  {
    name: 'fromExtent',
    signature: 'fromExtent(extent: Extent): Polygon',
    returns: 'Polygon',
    description: '从范围创建矩形多边形，布局为 XY'
  },
  {
    name: 'fromCircle',
    signature: 'fromCircle(circle: Circle, sides?: number, angle?: number): Polygon',
    returns: 'Polygon',
    description: '从圆形创建正多边形，默认 32 边形'
  },
  {
    name: 'circular',
    signature: 'circular(center: Coordinate, radius: number, n?: number, sphereRadius?: number): Polygon',
    returns: 'Polygon',
    description: '在球面上创建圆形的多边形近似，center 为经纬度坐标，radius 单位为米'
  }
])

const coreMethods = ref([
  {
    name: 'getType()',
    signature: 'getType(): Type',
    returns: 'Type',
    description: '获取几何类型，Polygon 返回 "Polygon"'
  },
  {
    name: 'clone()',
    signature: 'clone(): Polygon',
    returns: 'Polygon',
    description: '创建多边形的完整副本'
  },
  {
    name: 'getExtent()',
    signature: 'getExtent(extent?: Extent): Extent',
    returns: 'Extent',
    description: '获取多边形的范围（边界框）'
  },
  {
    name: 'intersectsExtent()',
    signature: 'intersectsExtent(extent: Extent): boolean',
    returns: 'boolean',
    description: '测试多边形是否与给定的范围相交'
  }
])

const coordinateMethods = ref([
  {
    name: 'getCoordinates()',
    signature: 'getCoordinates(right?: boolean): Array<Array<Coordinate>>',
    returns: 'Array<Array<Coordinate>>',
    description: '返回多边形坐标数组，符合 GeoJSON 格式'
  },
  {
    name: 'setCoordinates()',
    signature: 'setCoordinates(coordinates: Array<Array<Coordinate>>, layout?: GeometryLayout): void',
    returns: 'void',
    description: '设置多边形的坐标'
  }
])

const ringMethods = ref([
  {
    name: 'getLinearRingCount()',
    signature: 'getLinearRingCount(): number',
    returns: 'number',
    description: '返回线性环的数量（包括外环和内环）'
  },
  {
    name: 'getLinearRing()',
    signature: 'getLinearRing(index: number): LinearRing | null',
    returns: 'LinearRing | null',
    description: '返回指定索引的线性环，超出范围返回 null'
  },
  {
    name: 'getLinearRings()',
    signature: 'getLinearRings(): Array<LinearRing>',
    returns: 'Array<LinearRing>',
    description: '返回所有线性环数组'
  },
  {
    name: 'appendLinearRing()',
    signature: 'appendLinearRing(linearRing: LinearRing): void',
    returns: 'void',
    description: '添加线性环到多边形'
  }
])

const polygonMethods = ref([
  {
    name: 'getArea()',
    signature: 'getArea(): number',
    returns: 'number',
    description: '返回多边形在投影平面上的面积'
  },
  {
    name: 'getInteriorPoint()',
    signature: 'getInteriorPoint(): Point',
    returns: 'Point',
    description: '返回多边形内部的一个点（常用于标签放置）'
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

const basicExample = ref(`import Polygon from 'ol/geom/Polygon.js'

// 创建简单矩形多边形（外环）
const polygon = new Polygon([[
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
  [0, 0]  // 闭合环
]])

// 注意：外环必须闭合（首尾坐标相同）
// 坐标顺序：外环必须是逆时针方向（EPSG:3857/4326）

// 使用特征和样式
import Feature from 'ol/Feature.js'
import { Style, Fill, Stroke } from 'ol/style.js'

const feature = new Feature(polygon)
feature.setStyle(new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 0, 0.5)'
  }),
  stroke: new Stroke({
    color: '#FF9900',
    width: 2
  })
}))`)

const holeExample = ref(`import Polygon from 'ol/geom/Polygon.js'

// 创建带洞的多边形（如湖泊中的岛屿）
const polygonWithHole = new Polygon([
  // 外环（逆时针）
  [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
    [0, 0]
  ],
  // 内环/洞（顺时针）
  [
    [25, 25],
    [75, 25],
    [75, 75],
    [25, 75],
    [25, 25]
  ]
])

// 获取线性环数量
console.log(polygonWithHole.getLinearRingCount()) // 2

// 获取外环
const exteriorRing = polygonWithHole.getLinearRing(0)

// 获取内环（洞）
const interiorRing = polygonWithHole.getLinearRing(1)`)

const areaExample = ref(`import Polygon from 'ol/geom/Polygon.js'

// 创建多边形
const land = new Polygon([[
  [0, 0],
  [1000, 0],
  [1000, 500],
  [0, 500],
  [0, 0]
]])

// 获取面积
const area = land.getArea()
console.log('面积:', area)

// 获取内部点（用于放置标签）
const interiorPoint = land.getInteriorPoint()
console.log('内部点:', interiorPoint.getCoordinates())

// 克隆多边形
const clone = land.clone()`)

const staticExample = ref(`import Polygon, { fromExtent, fromCircle, circular } from 'ol/geom/Polygon.js'
import Circle from 'ol/geom/Circle.js'

// 从范围创建矩形多边形
const extent = [100, 200, 300, 400] // [minX, minY, maxX, maxY]
const rect = fromExtent(extent)
console.log(rect.getCoordinates())

// 从圆形创建正多边形
const circle = new Circle([0, 0], 100)
const hexagon = fromCircle(circle, 6) // 创建正六边形
console.log(hexagon.getLinearRingCount()) // 1

// 创建圆形多边形（在球面上）
// center 为 [经度，纬度]，radius 单位为米
const circularPoly = circular(
  [116.4, 39.9],  // 北京中心
  1000,           // 半径 1000 米
  64              // 64 个顶点（越越多越圆）
)`)

const events = ref([
  { name: 'change', type: 'BaseEvent', description: '当修订计数器增加时触发' },
  { name: 'error', type: 'BaseEvent', description: '发生错误时触发' },
  { name: 'propertychange', type: 'ObjectEvent', description: '属性改变时触发' }
])

const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_geom_Polygon-Polygon.html'
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
    color: white;
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
