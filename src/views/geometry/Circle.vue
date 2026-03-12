<template>
  <div class="api-documentation">
    <el-card class="api-card">
      <template #header>
        <div class="card-header">
          <h2>Circle - 圆形几何</h2>
          <el-tag type="danger" size="large">ol/geom/Circle</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <section class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>Circle 表示一个完美的圆形几何，由圆心和半径定义。与多边形近似的圆不同，Circle 始终保持精确的圆形，常用于表示影响范围、覆盖区域、缓冲区分析等场景。</p>

        <div class="import-section">
          <h4>导入方式</h4>
          <el-input type="textarea" :rows="2" readonly v-model="importCode" class="code-input" />
        </div>
      </section>

      <!-- 构造函数 -->
      <section class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-block">
          <code class="constructor-signature">new Circle(center: Coordinate, radius: number, layout?: GeometryLayout)</code>
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
          <el-table-column prop="signature" label="签名" width="320" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>圆心操作</h4>
        <el-table :data="centerMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="320" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>半径操作</h4>
        <el-table :data="radiusMethods" border stripe class="api-table">
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
          <el-tab-pane label="覆盖范围">
            <pre class="code-block"><code>{{ coverageExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="缓冲区分析">
            <pre class="code-block"><code>{{ bufferExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="动画效果">
            <pre class="code-block"><code>{{ animationExample }}</code></pre>
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

const importCode = ref("import Circle from 'ol/geom/Circle.js'")

const constructorParams = ref([
  { name: 'center', type: 'Coordinate', required: '是', description: '圆心坐标，格式为 [x, y] 或 [经度，纬度]' },
  { name: 'radius', type: 'number', required: '是', description: '圆的半径（与坐标单位相同）' },
  { name: 'layout', type: 'GeometryLayout | undefined', required: '否', description: '坐标布局，如 XY, XYZ, XYM, XYZM' }
])

const coreMethods = ref([
  {
    name: 'getType()',
    signature: 'getType(): Type',
    returns: 'Type',
    description: '获取几何类型，Circle 返回 "Circle"'
  },
  {
    name: 'clone()',
    signature: 'clone(): Circle',
    returns: 'Circle',
    description: '创建圆形的完整副本'
  },
  {
    name: 'getExtent()',
    signature: 'getExtent(extent?: Extent): Extent',
    returns: 'Extent',
    description: '获取圆形的范围（边界框）'
  },
  {
    name: 'intersectsExtent()',
    signature: 'intersectsExtent(extent: Extent): boolean',
    returns: 'boolean',
    description: '测试圆形是否与给定的范围相交'
  },
  {
    name: 'getClosestPoint()',
    signature: 'getClosestPoint(point: Coordinate, closestPoint?: Coordinate): Coordinate',
    returns: 'Coordinate',
    description: '返回圆上最接近给定点的坐标'
  }
])

const centerMethods = ref([
  {
    name: 'getCenter()',
    signature: 'getCenter(): Coordinate',
    returns: 'Coordinate',
    description: '返回圆心坐标'
  },
  {
    name: 'setCenter()',
    signature: 'setCenter(center: Coordinate): void',
    returns: 'void',
    description: '设置圆心坐标'
  },
  {
    name: 'setCenterAndRadius()',
    signature: 'setCenterAndRadius(center: Coordinate, radius: number, layout?: GeometryLayout): void',
    returns: 'void',
    description: '同时设置圆心和半径'
  }
])

const radiusMethods = ref([
  {
    name: 'getRadius()',
    signature: 'getRadius(): number',
    returns: 'number',
    description: '返回圆的半径'
  },
  {
    name: 'setRadius()',
    signature: 'setRadius(radius: number): void',
    returns: 'void',
    description: '设置圆的半径'
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
    description: '绕给定坐标旋转几何（圆形绕任意点旋转后仍为自身）'
  },
  {
    name: 'scale()',
    signature: 'scale(sx: number, sy?: number, anchor?: Coordinate): void',
    returns: 'void',
    description: '缩放几何（原地修改），会改变圆形的形状为椭圆'
  },
  {
    name: 'simplify()',
    signature: 'simplify(tolerance: number): Geometry',
    returns: 'Geometry',
    description: '创建简化版本的几何（对于 Circle 返回自身）'
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
  { name: 'getFirstCoordinate()', returns: 'Coordinate', description: '返回第一个坐标' },
  { name: 'getLastCoordinate()', returns: 'Coordinate', description: '返回最后一个坐标' },
  { name: 'getLayout()', returns: 'GeometryLayout', description: '返回几何布局' },
  { name: 'intersectsCoordinate()', returns: 'boolean', description: '测试是否包含给定坐标' }
])

const basicExample = ref(`import Circle from 'ol/geom/Circle.js'

// 创建简单圆形
const circle = new Circle([0, 0], 100)

// 创建带 Z 坐标的圆形
const circle3D = new Circle([116.4, 39.9, 50], 1000)

// 使用特征和样式
import Feature from 'ol/Feature.js'
import { Style, Fill, Stroke } from 'ol/style.js'

const feature = new Feature(circle)
feature.setStyle(new Style({
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.3)'
  }),
  stroke: new Stroke({
    color: '#FF0000',
    width: 2,
    lineDash: [10, 5]
  })
}))

// 获取圆心和半径
console.log('圆心:', circle.getCenter())  // [0, 0]
console.log('半径:', circle.getRadius())  // 100`)

const coverageExample = ref(`import Circle from 'ol/geom/Circle.js'
import Feature from 'ol/Feature.js'

// 场景 1: 基站信号覆盖范围
const baseStation = new Circle(
  [116.4, 39.9],  // 北京某位置
  5000            // 5km 覆盖半径
)

const stationFeature = new Feature(baseStation)
stationFeature.setProperties({
  name: '北京朝阳基站',
  coverage: '5km',
  type: '4G'
})

// 场景 2: 门店配送范围
const deliveryRange = new Circle(
  [121.4, 31.2],  // 上海某门店
  3000            // 3km 配送范围
)

// 场景 3: 地震影响范围
const earthquakeImpact = new Circle(
  [103.8, 30.5],  // 震中
  50000           // 50km 影响半径
)

// 获取范围边界
const extent = earthquakeImpact.getExtent()
console.log('影响范围边界:', extent)`)

const bufferExample = ref(`import Circle from 'ol/geom/Circle.js'
import Polygon, { fromCircle } from 'ol/geom/Polygon.js'

// 创建圆形缓冲区
const centerPoint = [116.4, 39.9]
const bufferRadius = 1000  // 1km 缓冲区

const buffer = new Circle(centerPoint, bufferRadius)

// 将圆形转换为多边形（用于空间分析）
const bufferPolygon = fromCircle(buffer, 64)  // 64 边形近似

// 创建多个缓冲区（同心圆）
const buffers = [
  new Circle(centerPoint, 500),    // 500m 内圈
  new Circle(centerPoint, 1000),   // 1km 中圈
  new Circle(centerPoint, 2000)    // 2km 外圈
]

// 检查点是否在缓冲区内
function isPointInCircle(circle, point) {
  const center = circle.getCenter()
  const radius = circle.getRadius()
  const dx = point[0] - center[0]
  const dy = point[1] - center[1]
  return Math.sqrt(dx * dx + dy * dy) <= radius
}

const testPoint = [116.41, 39.91]
console.log('点在缓冲区内:', isPointInCircle(buffer, testPoint))`)

const animationExample = ref(`import Circle from 'ol/geom/Circle.js'
import Feature from 'ol/Feature.js'

// 创建动画圆形（如雷达扫描效果）
const radarCenter = [0, 0]
const radar = new Circle(radarCenter, 100)

const radarFeature = new Feature(radar)

// 脉冲动画效果
let radius = 100
let growing = true

function animateRadar() {
  if (growing) {
    radius += 5
    if (radius >= 500) growing = false
  } else {
    radius -= 5
    if (radius <= 100) growing = true
  }

  radar.setRadius(radius)

  // 触发重绘
  radar.changed()

  requestAnimationFrame(animateRadar)
}

// 启动动画
animateRadar()

// 移动圆心
radar.setCenter([100, 100])

// 同时设置圆心和半径
radar.setCenterAndRadius([200, 200], 300)

// 克隆圆形
const clone = radar.clone()
console.log('克隆圆半径:', clone.getRadius())`)

const events = ref([
  { name: 'change', type: 'BaseEvent', description: '当修订计数器增加时触发' },
  { name: 'error', type: 'BaseEvent', description: '发生错误时触发' },
  { name: 'propertychange', type: 'ObjectEvent', description: '属性改变时触发' }
])

const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_geom_Circle-Circle.html'
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
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
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
    border-bottom: 2px solid #f56c6c;

    .el-icon {
      color: #f56c6c;
    }
  }

  h4 {
    color: #606266;
    font-size: 15px;
    margin: 20px 0 12px 0;
    padding-left: 12px;
    border-left: 4px solid #f56c6c;
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
  border-left: 4px solid #f56c6c;
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
