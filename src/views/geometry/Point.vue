<template>
  <div class="api-documentation">
    <el-card class="api-card">
      <template #header>
        <div class="card-header">
          <h2>Point - 点几何</h2>
          <el-tag type="primary" size="large">ol/geom/Point</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <section class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>Point 是最基本的几何类型，表示单个坐标点。点几何常用于在地图上标记特定位置，如城市、兴趣点等。</p>

        <div class="import-section">
          <h4>导入方式</h4>
          <el-input type="textarea" :rows="2" readonly v-model="importCode" class="code-input" />
        </div>
      </section>

      <!-- 构造函数 -->
      <section class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-block">
          <code class="constructor-signature">new Point(coordinates: Coordinate, layout?: GeometryLayout)</code>
        </div>

        <el-table :data="constructorParams" border stripe class="api-table">
          <el-table-column prop="name" label="参数" width="150" />
          <el-table-column prop="type" label="类型" width="200" />
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
          <el-table-column prop="signature" label="签名" width="280" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>坐标操作</h4>
        <el-table :data="coordinateMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="280" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>变换方法</h4>
        <el-table :data="transformMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法" width="200" />
          <el-table-column prop="signature" label="签名" width="280" />
          <el-table-column prop="returns" label="返回值" width="150" />
          <el-table-column prop="description" label="描述" />
        </el-table>

        <h4>继承方法 (来自 Observable/Object/Geometry)</h4>
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
          <el-tab-pane label="坐标操作">
            <pre class="code-block"><code>{{ coordinateExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="坐标变换">
            <pre class="code-block"><code>{{ transformExample }}</code></pre>
          </el-tab-pane>
          <el-tab-pane label="几何变换">
            <pre class="code-block"><code>{{ geometryTransformExample }}</code></pre>
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
import { ref, computed } from 'vue'
import {
  Document, Setting, Tools, Notebook, Bell, Link
} from '@element-plus/icons-vue'

const importCode = ref("import Point from 'ol/geom/Point.js'")

const constructorParams = ref([
  { name: 'coordinates', type: 'Coordinate', required: '是', description: '点的坐标，格式为 [经度，纬度] 或 [x, y]' },
  { name: 'layout', type: 'GeometryLayout | undefined', required: '否', description: '坐标布局，如 XY, XYZ, XYM, XYZM' }
])

const coreMethods = ref([
  {
    name: 'getType()',
    signature: 'getType(): Type',
    returns: 'Type',
    description: '获取几何类型，Point 返回 "Point"'
  },
  {
    name: 'clone()',
    signature: 'clone(): Point',
    returns: 'Point',
    description: '创建点几何的完整副本'
  },
  {
    name: 'getExtent()',
    signature: 'getExtent(extent?: Extent): Extent',
    returns: 'Extent',
    description: '获取点的范围（边界框）'
  },
  {
    name: 'intersectsExtent()',
    signature: 'intersectsExtent(extent: Extent): boolean',
    returns: 'boolean',
    description: '测试点是否与给定的范围相交'
  }
])

const coordinateMethods = ref([
  {
    name: 'getCoordinates()',
    signature: 'getCoordinates(): Coordinate',
    returns: 'Coordinate',
    description: '返回点的坐标'
  },
  {
    name: 'setCoordinates()',
    signature: 'setCoordinates(coordinates: Coordinate, layout?: GeometryLayout): void',
    returns: 'void',
    description: '设置点的坐标'
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
    description: '创建简化版本的几何（对于 Point 返回自身）'
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

const basicExample = ref(`import Point from 'ol/geom/Point.js'

// 创建简单点
const point = new Point([0, 0])

// 带 Z 坐标的点（经度，纬度，高度）
const point3D = new Point([116.4, 39.9, 50])

// 使用特征和样式
import Feature from 'ol/Feature.js'
import { Style, Icon } from 'ol/style.js'

const feature = new Feature(point)
feature.setStyle(new Style({
  image: new Icon({
    src: './marker.png',
    scale: 0.5
  })
}))`)

const coordinateExample = ref(`import Point from 'ol/geom/Point.js'

const point = new Point([116.4, 39.9])

// 获取坐标
const coords = point.getCoordinates()
console.log(coords) // [116.4, 39.9]

// 设置新坐标
point.setCoordinates([121.4, 31.2])
console.log(point.getCoordinates()) // [121.4, 31.2]

// 克隆点
const clone = point.clone()
console.log(clone.getCoordinates()) // [121.4, 31.2]`)

const transformExample = ref(`import Point from 'ol/geom/Point.js'

// 创建 WGS84 坐标点
const point = new Point([116.4, 39.9])

// 转换为 Web Mercator (EPSG:3857)
point.transform('EPSG:4326', 'EPSG:3857')
console.log(point.getCoordinates())
// 输出：[12958438.77, 4838984.02] 近似值

// 转换回 WGS84
point.transform('EPSG:3857', 'EPSG:4326')
console.log(point.getCoordinates())
// 输出：[116.4, 39.9]`)

const geometryTransformExample = ref(`import Point from 'ol/geom/Point.js'

const point = new Point([0, 0])

// 平移
point.translate(10, 20)
console.log(point.getCoordinates()) // [10, 20]

// 旋转（绕原点逆时针 90 度）
point.rotate(Math.PI / 2, [0, 0])
console.log(point.getCoordinates())

// 缩放
point.scale(2, 2)
console.log(point.getCoordinates())

// 获取范围
const extent = point.getExtent()
console.log(extent) // [x, y, x, y]`)

const events = ref([
  { name: 'change', type: 'BaseEvent', description: '当修订计数器增加时触发' },
  { name: 'error', type: 'BaseEvent', description: '发生错误时触发' },
  { name: 'propertychange', type: 'ObjectEvent', description: '属性改变时触发' }
])

const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_geom_Point-Point.html'
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    border-bottom: 2px solid #409eff;

    .el-icon {
      color: #409eff;
    }
  }

  h4 {
    color: #606266;
    font-size: 15px;
    margin: 20px 0 12px 0;
    padding-left: 12px;
    border-left: 4px solid #409eff;
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
  border-left: 4px solid #409eff;
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
