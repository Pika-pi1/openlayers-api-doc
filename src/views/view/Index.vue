<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>View - 视图控制 API</h2>
            <p class="description">
              OpenLayers View 用于控制地图的显示状态，包括中心点、缩放级别、旋转角度等。
              View 是地图的核心组件之一，负责管理地图的可视区域。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_View-View.html" target="_blank">
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
                  <el-button
                    v-if="api.type === 'method' || api.type === 'property'"
                    type="primary"
                    size="small"
                    @click.stop="showDemo(api)"
                    class="demo-btn-inline"
                  >
                    <el-icon><VideoPlay /></el-icon>
                    演示
                  </el-button>
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
                                <el-tag size="small" type="info">{{ child.row.type }}</el-tag>
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
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <code class="param-name">{{ scope.row.name }}</code>
                          <el-tag v-if="scope.row.children && scope.row.children.length" size="small" type="warning">可展开</el-tag>
                        </div>
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
                    <el-icon class="section-icon usage-icon"><Console /></el-icon>
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

      <!-- 右侧演示面板 -->
      <div class="demo-panel-wrapper">
        <ViewDemoMap ref="demoMapRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ViewDemoMap from '@/components/ViewDemoMap.vue'

// 默认展开第一个
const activeNames = ref(['constructor'])
const currentCategory = ref('all')

// 演示地图引用
const demoMapRef = ref(null)

// API 演示映射表
const apiDemoMap = {
  // Methods - 可交互演示
  'adjustCenter': { type: 'adjustCenter', tip: '使用滑块调整东西/南北方向的增量，点击执行查看效果' },
  'adjustResolution': { type: 'adjustResolution', tip: '调整分辨率增量，正值降低分辨率（缩小），负值提高分辨率（放大）' },
  'adjustRotation': { type: 'adjustRotation', tip: '调整旋转角度增量，正值顺时针旋转，负值逆时针旋转' },
  'adjustZoom': { type: 'adjustZoom', tip: '调整缩放级别增量，正值放大，负值缩小' },
  'animate': { type: 'animate', tip: '设置目标位置、缩放和时长，执行平滑动画过渡' },
  'cancelAnimations': { type: 'cancelAnimations', tip: '点击按钮将立即取消所有正在执行的动画' },
  'constrainResolution': { type: 'constrainResolution', tip: '开启后，缩放时会自动吸附到最近的整数级别' },
  'fit': { type: 'fit', tip: '选择一个预设范围，地图会自动适配到该范围' },
  'rotate': { type: 'rotate', tip: '设置目标旋转角度，可选择是否使用动画过渡' },
  'setCenter': { type: 'setCenter', tip: '输入经纬度坐标，点击设置将地图中心移动到该位置' },
  'setResolution': { type: 'setResolution', tip: '直接设置分辨率值（米/像素）' },
  'setRotation': { type: 'setRotation', tip: '直接设置旋转角度（弧度），0 表示正北方向' },
  'setZoom': { type: 'setZoom', tip: '直接设置缩放级别，数值越大地图越详细' },
  'zoomToExtent': { type: 'zoomToExtent', tip: '选择一个预设范围，地图会缩放到该范围' },
  // Methods - 获取类（显示当前值）
  'getCenter': { type: 'getCenter', tip: '显示当前视图中心点坐标（经纬度）' },
  'getZoom': { type: 'getZoom', tip: '显示当前视图缩放级别' },
  'getRotation': { type: 'getRotation', tip: '显示当前视图旋转角度（弧度和角度）' },
  'getResolution': { type: 'getResolution', tip: '显示当前视图分辨率（米/像素）' },
  // Properties
  'padding': { type: 'padding', tip: '调整内边距，用于侧边栏覆盖时的中心偏移' }
}

// 显示演示
const showDemo = (api) => {
  const demoInfo = apiDemoMap[api.name]
  if (demoInfo && demoMapRef.value) {
    demoMapRef.value.executeDemo(api.name, {
      cn: api.cn,
      tip: demoInfo.tip
    })
    // 滚动到演示区域
    setTimeout(() => {
      document.querySelector('.demo-panel-wrapper')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  } else if (demoMapRef.value) {
    demoMapRef.value.executeDemo(api.name, {
      cn: api.cn,
      tip: '该 API 的演示功能开发中...'
    })
  }
}

const categories = ref([])

const viewApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'View 概述',
    type: 'overview',
    category: 'members',
    description: 'View 对象表示地图的简单 2D 视图。这是用于更改地图中心点、分辨率和旋转角度的对象。View 有三个核心状态：center（中心点）、resolution（分辨率）和 rotation（旋转）。View 有一个 projection（投影），投影决定了中心点的坐标系，其单位决定了分辨率的单位（投影单位/像素）。默认投影是 Web Mercator (EPSG:3857)。',
    usage: `// ============================================
// View 类概述
// ============================================
// View 是 OpenLayers 地图的核心组件，用于控制地图的显示状态
// 三个核心状态：center（中心点）、resolution（分辨率）、rotation（旋转）

// 【示例 1】创建基本 View
import { View } from 'ol';
const view = new View({
  center: [0, 0],  // Web Mercator 坐标
  zoom: 2
});

// 【示例 2】View 与 Map 的关系
import { Map, View } from 'ol';
import Projection from 'ol/proj/Projection';

// 创建 EPSG:4326 投影对象（使用经纬度）
const projection = new Projection({
  code: 'EPSG:4326',
  units: 'degrees',
  axisOrientation: 'enu',
  global: true,
  extent: [-180, -90, 180, 90]
});

const map = new Map({
  target: 'map',
  view: new View({
    projection: projection,
    center: [116.4, 39.9],  // 直接使用北京经纬度
    zoom: 10
  })
});

// 【重要概念】
// 1. 投影 (Projection): 默认 Web Mercator (EPSG:3857)
// 2. 分辨率 (Resolution): 每像素代表的米数
// 3. 缩放级别 (Zoom): 从分辨率计算得出
// 4. 约束 (Constraints): 分辨率约束、旋转约束、中心点约束

// 【约束类型】
// - 分辨率约束：限制最小/最大值，可 snapped 到特定分辨率
// - 旋转约束：可 snapped 到 90 度的倍数
// - 中心点约束：由 extent 选项决定`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: 'View 配置选项对象',
        children: [
          { name: 'center', type: 'Coordinate|undefined', default: undefined, description: '初始中心点坐标 [x, y]（投影坐标）' },
          { name: 'constrainRotation', type: 'boolean|number', default: 'true', description: '旋转约束。false 表示无约束；true 或数字表示约束到该数量的值（如 4 表示约束到 90 度的倍数）' },
          { name: 'enableRotation', type: 'boolean', default: 'true', description: '是否启用旋转。如果为 false，视图不能旋转' },
          { name: 'extent', type: 'Extent|undefined', default: undefined, description: '约束视图的范围 [minX, minY, maxX, maxY]，超出此范围不可见' },
          { name: 'constrainOnlyCenter', type: 'boolean', default: 'false', description: '如果为 true，范围约束仅应用于视图中心，不应用于分辨率' },
          { name: 'smoothExtentConstraint', type: 'boolean', default: 'true', description: '如果为 true，范围约束将平滑应用，允许短暂超出范围' },
          { name: 'maxResolution', type: 'number|undefined', default: undefined, description: '最大分辨率（米/像素），用于确定分辨率约束' },
          { name: 'minResolution', type: 'number|undefined', default: undefined, description: '最小分辨率（米/像素），用于确定分辨率约束' },
          { name: 'maxZoom', type: 'number', default: '28', description: '最大缩放级别，用于确定分辨率约束' },
          { name: 'minZoom', type: 'number', default: '0', description: '最小缩放级别，用于确定分辨率约束' },
          { name: 'projection', type: 'ProjectionLike', default: 'EPSG:3857', description: '投影对象或代码。默认是 Spherical Mercator (EPSG:3857)' },
          { name: 'resolution', type: 'number|undefined', default: undefined, description: '初始分辨率（米/像素）。如果未定义，则使用 zoom 计算' },
          { name: 'zoom', type: 'number|undefined', default: undefined, description: '初始缩放级别。仅在 resolution 未定义时使用' },
          { name: 'rotation', type: 'number', default: '0', description: '初始旋转角度（弧度）。正值表示顺时针旋转，0 表示正北方向' },
          { name: 'padding', type: 'Array<number>', default: '[0, 0, 0, 0]', description: 'CSS 像素内边距 [top, right, bottom, left]，用于定义视图中心的偏移' },
          { name: 'resolutions', type: 'Array<number>', default: undefined, description: '分辨率数组，用于定义可用的缩放级别。如果指定，将覆盖 maxResolution 和 minResolution' },
          { name: 'zoomFactor', type: 'number', default: '2', description: '用于计算对应分辨率的缩放因子' },
          { name: 'multiWorld', type: 'boolean', default: 'false', description: '如果为 false，视图约束为仅显示一个世界；如果为 true，可以显示多个世界' },
          { name: 'constrainResolution', type: 'boolean', default: 'false', description: '如果为 true，视图将始终动画到最近的缩放级别；如果为 false，视图可以停在任意分辨率' },
          { name: 'smoothResolutionConstraint', type: 'boolean', default: 'true', description: '如果为 true，分辨率最小/最大值将平滑应用' },
          { name: 'showFullExtent', type: 'boolean', default: 'false', description: '允许视图缩放以显示完整配置的范围' }
        ]
      }
    ]
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'members',
    description: '创建一个新的 View 实例。通过传入配置对象来设置视图的初始状态，包括中心点、缩放级别、旋转角度、投影等。',
    usage: `import {View} from 'ol';

// 创建简单视图
const view = new View({
  center: [0, 0],
  zoom: 2
});

// 完整配置（使用 EPSG:4326 经纬度投影）
import Projection from 'ol/proj/Projection';
const projection = new Projection({
  code: 'EPSG:4326',
  units: 'degrees',
  extent: [-180, -90, 180, 90]
});

const view = new View({
  projection: projection,
  center: [116.4, 39.9], // 北京经纬度
  zoom: 10,
  minZoom: 5,
  maxZoom: 18,
  rotation: 0,
  constrainRotation: true,
  enableRotation: true,
  constrainResolution: true,
  multiWorld: false,
  showFullExtent: true
});

// 使用分辨率数组
const view = new View({
  projection: projection,
  center: [121.47, 31.23], // 上海经纬度
  resolutions: [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1],
  zoom: 5
});`,
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '视图配置选项',
        children: [
          { name: 'center', type: 'Array<number>', default: undefined, description: '初始中心点坐标 [x, y]' },
          { name: 'constrainRotation', type: 'boolean|number', default: 'true', description: '旋转约束。false 表示无约束，true 或数字表示约束到 90 度的倍数' },
          { name: 'enableRotation', type: 'boolean', default: 'true', description: '是否启用旋转' },
          { name: 'extent', type: 'Array<number>', default: undefined, description: '约束视图的范围 [minX, minY, maxX, maxY]' },
          { name: 'constrainOnlyCenter', type: 'boolean', default: 'false', description: '如果为 true，范围约束仅应用于视图中心，不应用于分辨率' },
          { name: 'smoothExtentConstraint', type: 'boolean', default: 'true', description: '如果为 true，范围约束将平滑应用' },
          { name: 'maxResolution', type: 'number', default: undefined, description: '最大分辨率（米/像素），用于确定分辨率约束' },
          { name: 'minResolution', type: 'number', default: undefined, description: '最小分辨率（米/像素），用于确定分辨率约束' },
          { name: 'maxZoom', type: 'number', default: '28', description: '最大缩放级别' },
          { name: 'minZoom', type: 'number', default: '0', description: '最小缩放级别' },
          { name: 'multiWorld', type: 'boolean', default: 'false', description: '如果为 false，视图约束为仅显示一个世界；如果为 true，可以显示多个世界' },
          { name: 'constrainResolution', type: 'boolean', default: 'false', description: '如果为 true，视图将始终动画到最近的缩放级别；如果为 false，视图可以停在任意分辨率' },
          { name: 'smoothResolutionConstraint', type: 'boolean', default: 'true', description: '如果为 true，分辨率最小/最大值将平滑应用' },
          { name: 'showFullExtent', type: 'boolean', default: 'false', description: '允许视图缩放以显示完整配置的范围' },
          { name: 'projection', type: 'ProjectionLike', default: 'EPSG:3857', description: '投影对象或代码，默认为 Web Mercator (EPSG:3857)' },
          { name: 'resolution', type: 'number', default: undefined, description: '初始分辨率（米/像素）。如果未定义，则使用 zoom 计算' },
          { name: 'resolutions', type: 'Array<number>', default: undefined, description: '分辨率数组，用于定义可用的缩放级别。如果指定，将覆盖 maxResolution 和 minResolution' },
          { name: 'rotation', type: 'number', default: '0', description: '初始旋转角度（弧度），正值表示顺时针旋转' },
          { name: 'zoom', type: 'number', default: undefined, description: '初始缩放级别。仅在 resolution 未定义时使用' },
          { name: 'zoomFactor', type: 'number', default: '2', description: '用于计算对应分辨率的缩放因子' },
          { name: 'padding', type: 'Array<number>', default: '[0, 0, 0, 0]', description: 'CSS 像素内边距 [top, right, bottom, left]' }
        ]
      }
    ],
    returns: { type: 'View', description: '新的 View 实例' }
  },

  // ========== Members (属性) ==========
  {
    name: 'padding',
    cn: '内边距',
    type: 'property',
    category: 'members',
    description: '视图的内边距设置，用于定义视图中心的偏移。格式为 [top, right, bottom, left]，单位为像素。常用于侧边栏覆盖部分地图时的中心调整。',
    usage: `// ============================================
// padding 属性使用示例
// ============================================

// 【示例 1】获取当前内边距
// getPadding() 返回一个数组 [top, right, bottom, left]
const padding = view.getPadding();
console.log('当前内边距:', padding); // 输出：[0, 0, 0, 0]

// 【示例 2】设置左侧内边距（适用于左侧有侧边栏的情况）
// 假设左侧边栏宽度为 300px，需要让地图中心向右偏移
view.setPadding([0, 0, 0, 300]);
// 参数说明：[上，右，下，左] - 单位都是像素

// 【示例 3】重置内边距（恢复默认）
view.setPadding([0, 0, 0, 0]);

// 【示例 4】设置四边内边距（适用于四周有 UI 覆盖的情况）
// 比如顶部有标题栏 50px，其他边也有覆盖
view.setPadding([50, 50, 50, 50]);

// 【示例 5】实际应用场景：侧边栏可折叠
// 当侧边栏展开时
view.setPadding([0, 0, 0, 300]);
// 当侧边栏收起时
view.setPadding([0, 0, 0, 0]);`,
    returns: { type: 'Array<number>', description: '内边距数组 [top, right, bottom, left]，默认为 [0, 0, 0, 0]' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'adjustCenter',
    cn: '调整中心点',
    type: 'method',
    category: 'methods',
    description: '以指定的增量调整视图中心点坐标。正值向东北方向移动，负值向西南方向移动。',
    usage: `// ============================================
// adjustCenter 方法使用示例
// ============================================
// 方法说明：adjustCenter([dx, dy])
// - dx: 东西方向增量（米），正值向东，负值向西
// - dy: 南北方向增量（米），正值向北，负值向南

// 【示例 1】向东北方向移动 1000 米
// 东移 1000 米 + 北移 1000 米
view.adjustCenter([1000, 1000]);

// 【示例 2】向西南方向移动 500 米
// 西移 500 米 + 南移 500 米
view.adjustCenter([-500, -500]);

// 【示例 3】只向东移动 1000 米
// dy=0 表示南北方向不移动
view.adjustCenter([1000, 0]);

// 【示例 4】只向北移动 800 米
view.adjustCenter([0, 800]);

// 【示例 5】向西北方向移动
// 西移 300 米 + 北移 600 米
view.adjustCenter([-300, 600]);

// 【对比】与 setCenter 的区别：
// adjustCenter 是在当前位置基础上移动（相对移动）
// setCenter 是直接设置到新位置（绝对位置）
// const currentCenter = view.getCenter();
// view.setCenter([currentCenter[0] + 1000, currentCenter[1] + 1000]); // 等价于 adjustCenter([1000, 1000])`,
    params: [
      { name: 'delta', type: 'Array<number>', default: undefined, description: '中心点增量 [dx, dy]，单位为米' }
    ]
  },
  {
    name: 'adjustResolution',
    cn: '调整分辨率',
    type: 'method',
    category: 'methods',
    description: '以指定的增量调整视图分辨率。正值降低分辨率（缩小），负值提高分辨率（放大）。',
    usage: `// ============================================
// adjustResolution 方法使用示例
// ============================================
// 方法说明：adjustResolution(delta)
// - delta > 0：降低分辨率（视野变大，地图缩小）
// - delta < 0：提高分辨率（视野变小，地图放大）
// 单位：米/像素

// 【示例 1】降低分辨率（缩小地图）
// 每个像素代表的实际距离增加 100 米，地图看起来更"远"了
view.adjustResolution(100);

// 【示例 2】提高分辨率（放大地图）
// 每个像素代表的实际距离减少 50 米，地图看起来更"近"了
view.adjustResolution(-50);

// 【示例 3】当前分辨率减半（放大一倍）
// 先获取当前分辨率
const currentRes = view.getResolution();
// 减去当前分辨率的一半，相当于分辨率变为原来的一半（放大一倍）
view.adjustResolution(-currentRes / 2);

// 【示例 4】分辨率变为原来的 2 倍（缩小一半）
view.adjustResolution(currentRes);

// 【注意】分辨率与缩放级别的关系：
// - 分辨率越小，地图越详细（放大）
// - 分辨率越大，地图越粗略（缩小）
// - 缩放级别每增加 1，分辨率减半`,
    params: [
      { name: 'delta', type: 'number', default: undefined, description: '分辨率增量（米/像素）' }
    ]
  },
  {
    name: 'adjustRotation',
    cn: '调整旋转角度',
    type: 'method',
    category: 'methods',
    description: '以指定的增量调整视图旋转角度。正值顺时针旋转，负值逆时针旋转。',
    usage: `// ============================================
// adjustRotation 方法使用示例
// ============================================
// 方法说明：adjustRotation(delta)
// - 参数单位：弧度（radians），不是角度！
// - 正值：顺时针旋转
// - 负值：逆时针旋转
// 角度转弧度公式：弧度 = 角度 × (π / 180)

// 【示例 1】顺时针旋转 45 度
// 45 度 = 45 × (π/180) = π/4 弧度
view.adjustRotation(Math.PI / 4);

// 【示例 2】逆时针旋转 90 度
// -90 度 = -90 × (π/180) = -π/2 弧度
view.adjustRotation(-Math.PI / 2);

// 【示例 3】旋转 180 度（倒置地图）
// 180 度 = π 弧度
view.adjustRotation(Math.PI);

// 【示例 4】顺时针旋转 30 度
view.adjustRotation(30 * Math.PI / 180);

// 【示例 5】逆时针旋转 60 度
view.adjustRotation(-60 * Math.PI / 180);

// 【常用角度对照表】
// 30 度  = π/6
// 45 度  = π/4
// 60 度  = π/3
// 90 度  = π/2
// 180 度 = π
// 270 度 = 3π/2
// 360 度 = 2π

// 【提示】如需重置旋转角度（北方朝上），使用 setRotation(0)
// view.setRotation(0);`,
    params: [
      { name: 'delta', type: 'number', default: undefined, description: '旋转角度增量（弧度）' }
    ]
  },
  {
    name: 'adjustZoom',
    cn: '调整缩放级别',
    type: 'method',
    category: 'methods',
    description: '以指定的增量调整缩放级别。正值放大，负值缩小。',
    usage: `// ============================================
// adjustZoom 方法使用示例
// ============================================
// 方法说明：adjustZoom(delta)
// - delta > 0：放大（缩放级别增加）
// - delta < 0：缩小（缩放级别减少）
// - 可以是小数，实现平滑缩放

// 【示例 1】放大一级
// 缩放级别 +1，地图细节更清晰
view.adjustZoom(1);

// 【示例 2】缩小两级
// 缩放级别 -2，看到更大范围
view.adjustZoom(-2);

// 【示例 3】放大 0.5 级（平滑缩放）
// 使用小数可以实现更细腻的缩放效果
view.adjustZoom(0.5);

// 【示例 4】缩小 0.5 级
view.adjustZoom(-0.5);

// 【示例 5】带动画调整（推荐使用 animate 方法）
// animate 方法可以实现平滑过渡动画效果
view.animate({
  zoom: view.getZoom() + 1,  // 目标缩放级别（当前级别 +1）
  duration: 300              // 动画持续时间 300 毫秒
});

// 【对比】adjustZoom vs animate:
// - adjustZoom: 立即改变缩放级别（无动画）
// - animate: 带动画过渡（用户体验更好）

// 【提示】OpenLayers 缩放级别范围通常是 0-28
// 级别 0：整个世界
// 级别 5：大区域
// 级别 10：城市
// 级别 15：街道
// 级别 20+：建筑物细节`,
    params: [
      { name: 'delta', type: 'number', default: undefined, description: '缩放增量（正数放大，负数缩小）' }
    ]
  },
  {
    name: 'animate',
    cn: '视图动画',
    type: 'method',
    category: 'methods',
    description: '执行视图动画，可以组合多个动画效果（平移、缩放、旋转等）。支持链式调用和回调函数。',
    usage: `// ============================================
// animate 方法使用示例
// ============================================
// 方法说明：animate(options, callback)
// - 可以组合多个动画效果（中心点、缩放、旋转等）
// - 支持链式调用（多个动画依次执行）
// - 支持回调函数（动画完成后执行）
// 返回：Promise<boolean>，动画完成时为 true

// ============================================
// 【基础动画】
// ============================================

// 【示例 1】简单平移动画（只改变中心点）
view.animate({
  center: [12963076, 4861614],  // 目标中心点坐标（Web Mercator 投影）
  duration: 2000                 // 动画持续时间：2000 毫秒 = 2 秒
});

// 【示例 2】组合动画（同时改变中心点和缩放）
view.animate({
  center: [12963076, 4861614],  // 目标中心点
  zoom: 12,                      // 目标缩放级别
  duration: 2000                 // 动画持续时间
});

// ============================================
// 【进阶动画】
// ============================================

// 【示例 3】连续动画（多个动画依次执行）
// 先缩放到级别 12，再移动到新中心，最后旋转 45 度
view.animate(
  {zoom: 12, duration: 1000},           // 第一步：缩放到级别 12，耗时 1 秒
  {center: newCenter, duration: 1000},  // 第二步：移动到新中心，耗时 1 秒
  {rotation: Math.PI / 4, duration: 1000} // 第三步：顺时针旋转 45 度，耗时 1 秒
);

// 【示例 4】带动画回调
// 动画完成后执行回调函数
view.animate({
  center: targetCenter,
  duration: 1000
}, function(complete) {
  // complete 参数表示动画是否完成
  if(complete) {
    console.log('动画已完成');
  } else {
    console.log('动画被中断');
  }
});

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 5】定位到城市（北京）- 使用经纬度
view.animate({
  center: [116.4, 39.9],  // 北京经纬度
  zoom: 10,
  duration: 1500
});

// 【示例 6】缩放并旋转
view.animate({
  zoom: 14,                           // 放大到街道级别
  rotation: Math.PI / 2,              // 顺时针旋转 90 度
  duration: 2000
});

// 【示例 7】使用缓动函数（动画节奏控制）
view.animate({
  center: targetCenter,
  duration: 1000,
  easing: ol.easing.easeOut  // 先快后慢（最常用）
  // easing: ol.easing.easeIn   // 先慢后快
  // easing: ol.easing.inOut    // 慢 - 快 - 慢
  // easing: ol.easing.linear   // 匀速
});

// 【示例 8】等待动画完成（async/await）
async function flyToLocation(center) {
  await view.animate({
    center: center,
    zoom: 12,
    duration: 2000
  });
  console.log('动画完成，可以继续执行其他操作');
}

// 【示例 9】取消动画
// 如果需要在动画完成前取消，调用 cancelAnimations()
// view.cancelAnimations();

// 【缓动函数说明】
// easing 参数控制动画的速度变化曲线：
// - easeIn: 开始慢，逐渐加速（用于进入效果）
// - easeOut: 开始快，逐渐减速（用于退出效果，最常用）
// - inOut: 慢 - 快 - 慢（用于平滑过渡）
// - linear: 匀速（机械感）`,
    params: [
      {
        name: 'var_args',
        type: '...(Object|Function)',
        default: undefined,
        description: '动画选项对象，或 (选项，回调) 序列',
        children: [
          { name: 'center', type: 'Array<number>', default: undefined, description: '动画结束时的中心点坐标 [x, y]' },
          { name: 'zoom', type: 'number', default: undefined, description: '动画结束时的缩放级别' },
          { name: 'resolution', type: 'number', default: undefined, description: '动画结束时的分辨率（米/像素）' },
          { name: 'rotation', type: 'number', default: undefined, description: '动画结束时的旋转角度（弧度）' },
          { name: 'anchor', type: 'Array<number>', default: undefined, description: '旋转或分辨率动画时的固定锚点坐标' },
          { name: 'duration', type: 'number', default: '1000', description: '动画持续时间（毫秒）' },
          { name: 'easing', type: 'Function', default: undefined, description: '缓动函数，如 ol.easing.easeIn, ol.easing.easeOut, ol.easing.inOut' }
        ]
      }
    ],
    returns: { type: 'Promise<boolean>', description: '动画完成的 Promise' }
  },
  {
    name: 'beginInteraction',
    cn: '开始交互',
    type: 'method',
    category: 'methods',
    description: '开始用户交互状态。内部使用，通常由 Interaction 类调用。',
    usage: `// ============================================
// beginInteraction 方法使用示例
// ============================================
// ⚠️ 注意：这是内部方法，通常不需要直接调用！
// 由 OpenLayers 的 Interaction 类自动管理

// 【了解即可】当用户开始拖拽地图时，Interaction 会调用
view.beginInteraction();

// 【了解即可】交互结束后需要调用 endInteraction()
view.endInteraction();

// 【实际应用】你只需要知道：
// 这些方法用于跟踪用户交互状态
// 可以通过 getInteracting() 检查用户是否正在操作地图
if (view.getInteracting()) {
  console.log('用户正在操作地图...');
}`,
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'calculateExtent',
    cn: '计算视图范围',
    type: 'method',
    category: 'methods',
    description: '计算当前视图的可见范围（边界框）。可选传入画布大小，如果不传则使用当前地图大小。',
    usage: `// ============================================
// calculateExtent 方法使用示例
// ============================================
// 方法说明：calculateExtent(size)
// 返回当前地图可见区域的边界框
// 返回值格式：[minX, minY, maxX, maxY]（投影坐标）

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】计算当前视图范围（最常用）
// 不传参数时，使用当前地图画布大小
const extent = view.calculateExtent();
console.log('视图范围:', extent);
// 输出示例：[12900000, 4800000, 13000000, 4900000]
// 分别代表：[西，南，东，北] 边界

// 【示例 2】传入自定义画布大小
const size = map.getSize();  // 获取地图画布大小 [width, height]
const extent = view.calculateExtent(size);

// ============================================
// 【实际应用】
// ============================================

// 【示例 3】获取经纬度范围（使用 EPSG:4326 直接返回经纬度）
const extent = view.calculateExtent();

// 直接使用 extent（已经是经纬度）
console.log('经纬度范围:');
console.log('  西边界:', extent[0]);  // 经度
console.log('  南边界:', extent[1]);  // 纬度
console.log('  东边界:', extent[2]);   // 经度
console.log('  北边界:', extent[3]);   // 纬度

// 【示例 4】获取视图范围的中心点
const extent = view.calculateExtent();
const centerX = (extent[0] + extent[2]) / 2;
const centerY = (extent[1] + extent[3]) / 2;
console.log('中心点:', [centerX, centerY]);

// 【示例 5】获取视图范围的宽高
const extent = view.calculateExtent();
const width = extent[2] - extent[0];  // 东西方向跨度
const height = extent[3] - extent[1]; // 南北方向跨度
console.log('视图范围：', width.toFixed(0), 'm ×', height.toFixed(0), 'm');

// 【示例 6】监听视图范围变化
view.on('change:resolution', () => {
  const extent = view.calculateExtent();
  console.log('视图范围已改变:', extent);
});

// 【应用场景】
// 1. 加载可见区域内的要素（WFS 查询）
// 2. 显示当前视图的地理范围
// 3. 限制某些操作在可见范围内
// 4. 计算视图覆盖的面积`,
    params: [
      { name: 'opt_size', type: 'Array<number>', default: '使用地图当前大小', description: '可选的画布大小 [width, height]' }
    ],
    returns: { type: 'Array<number>', description: '边界框 [minX, minY, maxX, maxY]' }
  },
  {
    name: 'cancelAnimations',
    cn: '取消动画',
    type: 'method',
    category: 'methods',
    description: '取消所有正在进行的视图动画，视图将停留在当前状态。在组件卸载或需要立即停止动画时使用。',
    usage: `// ============================================
// cancelAnimations 方法使用示例
// ============================================
// 方法说明：cancelAnimations()
// 作用：立即停止所有正在进行的视图动画
// 使用场景：组件卸载、用户快速操作、页面切换

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】取消所有动画
view.cancelAnimations();
// 动画立即停止，地图停留在当前位置

// ============================================
// 【Vue 项目中的实际应用】
// ============================================

// 【示例 2】在 Vue 组件卸载时取消动画（推荐）
import {onUnmounted} from 'vue';

onUnmounted(() => {
  if (view) {
    view.cancelAnimations();  // 防止内存泄漏
    view = null;
  }
});

// ============================================
// 【React 项目中的实际应用】
// ============================================

// 【示例 3】在 React 组件清理时取消动画
import {useEffect} from 'react';

useEffect(() => {
  // 组件挂载时的初始化代码
  const view = new View({...});

  // 返回的清理函数在组件卸载时执行
  return () => {
    view.cancelAnimations();
  };
}, []);

// ============================================
// 【其他使用场景】
// ============================================

// 【示例 4】用户快速点击时，取消之前的动画
let currentAnimation = null;

function flyTo(location) {
  // 如果之前有动画，先取消
  view.cancelAnimations();

  // 开始新动画
  view.animate({
    center: location.center,
    zoom: location.zoom,
    duration: 1000
  });
}

// 【示例 5】页面切换时取消动画
// 在路由切换前取消所有动画
router.beforeEach((to, from, next) => {
  if (view) {
    view.cancelAnimations();
  }
  next();
});

// 【为什么需要取消动画？】
// 1. 防止组件卸载后继续执行动画导致错误
// 2. 提升用户体验（快速响应用户操作）
// 3. 节省资源（停止不必要的计算）
// 4. 避免内存泄漏`,
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'centerOn',
    cn: '中心点对齐',
    type: 'method',
    category: 'methods',
    description: '将地图上的特定点对齐到视口的指定位置。常用于将兴趣点对准视口中心或特定位置。',
    usage: `// ============================================
// centerOn 方法使用示例
// ============================================
// 方法说明：centerOn(coordinate, size, viewCenter)
// 作用：将地图上的某个坐标点对齐到视口中的指定位置
// 应用场景：侧边栏打开时保持兴趣点在可视区域中心

// ============================================
// 【参数解析】
// ============================================
// coordinate: 地图上的目标坐标 [x, y]（投影坐标）
// size: 视口大小 [width, height]（像素）
// viewCenter: 视口中的目标位置 [x, y]（像素坐标，原点在左上角）

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】将坐标点对齐到视口中心（最常用）
const coordinate = [12963076, 4861614];  // 目标坐标（Web Mercator）
const viewCenter = [
  map.getSize()[0] / 2,  // 视口宽度的一半
  map.getSize()[1] / 2   // 视口高度的一半
];
view.centerOn(coordinate, map.getSize(), viewCenter);
// 效果：目标坐标点会移动到屏幕正中央

// 【示例 2】将坐标点对齐到视口左上角
view.centerOn(coordinate, map.getSize(), [0, 0]);
// 效果：目标坐标点会移动到屏幕左上角

// 【示例 3】将坐标点对齐到视口右下角
const size = map.getSize();
view.centerOn(coordinate, size, [size[0], size[1]]);
// 效果：目标坐标点会移动到屏幕右下角

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 4】侧边栏打开时，保持兴趣点在可视区域中心
function openSidebar(poiCoordinate) {
  const sidebarWidth = 300;  // 侧边栏宽度 300px

  // 计算新的视口中心（减去侧边栏宽度后）
  const newViewCenter = [
    (map.getSize()[0] - sidebarWidth) / 2,
    map.getSize()[1] / 2
  ];

  // 将兴趣点对齐到新的中心位置
  view.centerOn(poiCoordinate, map.getSize(), newViewCenter);
}

// 【示例 5】将兴趣点对齐到视口右侧 1/4 处
const size = map.getSize();
view.centerOn(poiCoordinate, size, [size[0] * 0.75, size[1] / 2]);

// 【示例 6】配合动画使用
// 先移动中心点，再执行 centerOn 对齐
view.setCenter(coordinate);
setTimeout(() => {
  view.centerOn(coordinate, map.getSize(), [size[0]/2, size[1]/2]);
}, 100);

// 【与 setCenter 的区别】
// - setCenter: 直接将地图中心设为某点
// - centerOn: 将某点对齐到视口的指定位置（更灵活）
//   可以让目标点不在中心，而在任意位置`,
    params: [
      { name: 'coordinate', type: 'Array<number>', default: undefined, description: '地图坐标 [x, y]' },
      { name: 'size', type: 'Array<number>', default: undefined, description: '视口大小 [width, height]' },
      { name: 'viewCenter', type: 'Array<number>', default: undefined, description: '视口中的目标位置 [x, y]' }
    ]
  },
  {
    name: 'changed',
    cn: '触发变更',
    type: 'method',
    category: 'methods',
    description: '触发视图变更事件。继承自 Observable，内部使用。',
    usage: `// ============================================
// changed 方法使用示例
// ============================================
// ⚠️ 注意：这是内部方法，通常不需要直接调用！

// 【了解即可】当视图状态改变时，OpenLayers 会自动调用
// view.changed();

// 【实际应用】你应该使用事件监听 instead
// 监听视图中心变化
view.on('change:center', () => {
  console.log('中心点变化:', view.getCenter());
});

// 监听视图分辨率变化
view.on('change:resolution', () => {
  console.log('缩放级别变化:', view.getZoom());
});

// 监听任何变化
view.on('change', () => {
  console.log('视图发生变化');
});`,
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'dispatchEvent',
    cn: '分发事件',
    type: 'method',
    category: 'methods',
    description: '分发事件。继承自 Observable，用于触发自定义事件。',
    usage: `// ============================================
// dispatchEvent 方法使用示例
// ============================================
// 方法说明：dispatchEvent(event)
// 作用：手动触发自定义事件
// 应用场景：自定义事件系统、插件开发

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】触发简单自定义事件
view.dispatchEvent('myCustomEvent');

// 【示例 2】触发带数据的自定义事件
view.dispatchEvent({
  type: 'myCustomEvent',
  data: {
    key: 'value',
    message: '这是一条自定义消息'
  }
});

// ============================================
// 【实际应用】
// ============================================

// 【示例 3】配合事件监听使用
// 第一步：监听自定义事件
view.on('myCustomEvent', (event) => {
  console.log('收到自定义事件:', event.data);
});

// 第二步：触发自定义事件
view.dispatchEvent({
  type: 'myCustomEvent',
  data: { action: 'refresh' }
});

// 【示例 4】在插件中使用
// 当地图数据更新时，通知其他组件
function updateMapData(newData) {
  // ... 更新数据逻辑 ...

  // 触发数据更新事件
  view.dispatchEvent({
    type: 'dataUpdated',
    timestamp: Date.now(),
    data: newData
  });
}

// 【示例 5】触发标准事件类型
// 可以触发 OpenLayers 内置的事件类型
view.dispatchEvent('change');  // 触发变更事件
view.dispatchEvent('error');   // 触发错误事件`,
    params: [
      { name: 'event', type: 'string|Object', default: undefined, description: '事件类型或事件对象' }
    ],
    returns: { type: '*', description: '事件处理结果' }
  },
  {
    name: 'endInteraction',
    cn: '结束交互',
    type: 'method',
    category: 'methods',
    description: '结束用户交互状态。内部使用，通常由 Interaction 类调用。',
    usage: `// ============================================
// endInteraction 方法使用示例
// ============================================
// ⚠️ 注意：这是内部方法，通常不需要直接调用！

// 【了解即可】当用户结束拖拽地图时，Interaction 会自动调用
// view.endInteraction();

// 【实际应用】你只需要知道：
// 这些方法用于跟踪用户交互状态
// 可以通过 getInteracting() 检查用户是否正在操作地图
if (view.getInteracting()) {
  console.log('用户正在操作地图');
} else {
  console.log('用户未操作地图');
}`,
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'fit',
    cn: '适配视图范围',
    type: 'method',
    category: 'methods',
    description: '自动调整视图以适配给定的几何图形或边界框，使目标内容完整显示在视图中。这是最常用的方法之一，用于定位到特定区域。',
    usage: `// ============================================
// fit 方法使用示例
// ============================================
// 方法说明：fit(geometryOrExtent, options)
// 作用：自动缩放地图，让目标区域完整显示在视口中
// 应用场景：定位到要素、搜索结果显示、数据可视化

// ============================================
// 【说明】使用 EPSG:4326 投影，无需坐标转换
// ============================================

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】适配边界框（最简单用法）
// bounds 格式：[minLon, minLat, maxLon, maxLat]（经纬度坐标）
const bounds = [116, 39, 117, 40]; // 北京区域经纬度范围
view.fit(bounds);
// 效果：地图自动缩放到能完整显示该区域的级别

// 【示例 2】适配边界框，带内边距和动画
view.fit(bounds, {
  padding: [50, 50, 50, 50],  // 四周留白 50 像素，避免内容贴着边缘
  duration: 1000,             // 动画持续时间 1 秒
  maxZoom: 15                 // 最大缩放级别（防止缩得太近）
});

// ============================================
// 【进阶用法】
// ============================================

// 【示例 3】适配 GeoJSON 几何图形
import GeoJSON from 'ol/format/GeoJSON';

// 假设有一个 GeoJSON 对象
const geojson = {
  type: 'Polygon',
  coordinates: [[[...]]]
};

// 解析 GeoJSON
const format = new GeoJSON();
const feature = format.readFeature(geojson);

// 适配到几何图形
view.fit(feature.getGeometry(), {
  padding: [100, 100, 100, 100],  // 四周留白 100 像素
  duration: 1500,                 // 动画 1.5 秒
  minZoom: 5,                     // 最小缩放级别（防止太远）
  maxZoom: 17                     // 最大缩放级别（防止太近）
});

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 4】适配多个要素的边界
const features = vectorSource.getFeatures();  // 获取所有要素

// 创建一个空的范围
const extent = ol.extent.createEmpty();

// 扩展范围以包含所有要素
features.forEach(feature => {
  // 获取每个要素的边界
  const featureExtent = feature.getGeometry().getExtent();
  // 将范围扩展到包含该要素
  ol.extent.extend(extent, featureExtent);
});

// 适配到所有要素的边界
view.fit(extent, {
  padding: [50, 50, 50, 50],
  duration: 1000
});

// 【示例 5】定位到用户输入的地理坐标范围（使用经纬度）
function locateToArea(west, south, east, north) {
  // 直接使用经纬度坐标
  const extent = [west, south, east, north];

  view.fit(extent, {
    padding: [80, 80, 80, 80],
    duration: 1000
  });
}

// 使用：定位到北京区域
locateToArea(115.4, 39.4, 117.4, 40.4);

// 【示例 6】适配单个点（使用 buffer 创建范围）
const point = [116.4, 39.9];  // 北京中心点（经纬度）
const buffer = 0.1;  // 缓冲区（经纬度单位，约 11km）

// 创建一个围绕点的范围
const pointExtent = [
  point[0] - buffer,
  point[1] - buffer,
  point[0] + buffer,
  point[1] + buffer
];

view.fit(pointExtent, {
  padding: [50, 50, 50, 50],
  duration: 1000
});

// 【示例 7】带动画回调
view.fit(bounds, {
  duration: 1000,
  callback: function(complete) {
    if (complete) {
      console.log('视图适配完成');
      // 可以在这里执行后续操作，如加载数据
    }
  }
});

// 【示例 8】使用缓动函数
view.fit(bounds, {
  duration: 1500,
  easing: ol.easing.easeOut  // 先快后慢，更自然
});

// 【options 参数详解】
// - size: 适配的目标大小（默认使用地图视口）
// - padding: 内边距 [上，右，下，左]，单位像素
// - nearest: 是否缩放到最近整数级别
// - minResolution: 最小分辨率（限制最大缩放）
// - maxZoom: 最大缩放级别（防止太近）
// - minZoom: 最小缩放级别（防止太远）
// - duration: 动画持续时间（毫秒），0 表示立即完成
// - easing: 缓动函数（控制动画节奏）
// - callback: 动画完成后的回调函数`,
    params: [
      { name: 'geometryOrExtent', type: 'Geometry|Extent', default: undefined, description: '几何对象或边界框 [minX, minY, maxX, maxY]' },
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '可选配置项',
        children: [
          { name: 'size', type: 'Array<number>', default: '地图视口大小', description: '适配的目标大小 [width, height]，默认使用地图视口' },
          { name: 'padding', type: 'Array<number>', default: '[0, 0, 0, 0]', description: '内边距 [top, right, bottom, left]，单位为像素，用于在目标区域周围留白' },
          { name: 'nearest', type: 'boolean', default: 'false', description: '是否缩放到最近的整数级别，当 constrainResolution 为 true 时有效' },
          { name: 'minResolution', type: 'number', default: '0', description: '允许的最小分辨率（米/像素），限制最大缩放' },
          { name: 'maxZoom', type: 'number', default: '视图最大缩放', description: '允许的最大缩放级别，防止缩放过近' },
          { name: 'minZoom', type: 'number', default: '视图最小缩放', description: '允许的最小缩放级别，防止缩放过远' },
          { name: 'duration', type: 'number', default: '0', description: '动画持续时间（毫秒），设为 0 立即完成' },
          { name: 'easing', type: 'Function', default: 'ol.easing.easeOut', description: '缓动函数，控制动画节奏，如 ol.easing.in, ol.easing.out, ol.easing.inOut' },
          { name: 'callback', type: 'Function', default: undefined, description: '动画完成后的回调函数，参数为布尔值表示是否完成' }
        ]
      }
    ],
    returns: { type: 'number|undefined', description: '缩放级别，如果无法计算则返回 undefined' }
  },
  {
    name: 'get',
    cn: '获取属性',
    type: 'method',
    category: 'methods',
    description: '获取视图的自定义属性。继承自 BaseObject，支持键值对存储。',
    usage: `// ============================================
// get 方法使用示例
// ============================================
// 方法说明：get(key)
// 作用：获取视图的自定义属性
// 说明：View 继承自 BaseObject，支持键值对存储

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取自定义属性
const value = view.get('myKey');
console.log('属性值:', value);

// 【示例 2】检查属性是否存在
if (view.get('myKey') !== undefined) {
  console.log('属性存在:', view.get('myKey'));
} else {
  console.log('属性不存在');
}

// ============================================
// 【实际应用】
// ============================================

// 【示例 3】存储和获取自定义数据
// 先设置属性
view.set('mapMode', 'satellite');
view.set('userLevel', 5);

// 后获取属性
const mode = view.get('mapMode');
const level = view.get('userLevel');
console.log('地图模式:', mode, '用户等级:', level);

// 【示例 4】获取内置属性
// 可以获取 View 的内置属性
const center = view.get('center');      // 中心点
const resolution = view.get('resolution'); // 分辨率
const rotation = view.get('rotation');     // 旋转角度

// 【提示】推荐使用专用方法获取这些属性
// view.getCenter() 比 view.get('center') 更常用
// view.getResolution() 比 view.get('resolution') 更常用`,
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性键名' }
    ],
    returns: { type: '*', description: '属性值' }
  },
  {
    name: 'getAnimating',
    cn: '检查是否正在动画',
    type: 'method',
    category: 'methods',
    description: '检查视图当前是否正在进行动画。',
    usage: `// ============================================
// getAnimating 方法使用示例
// ============================================
// 方法说明：getAnimating()
// 返回：true（正在动画）或 false（无动画）
// 应用：判断动画状态、等待动画完成

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】检查是否正在动画
if (view.getAnimating()) {
  console.log('视图正在动画中...');
} else {
  console.log('视图静止');
}

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】等待动画完成（Promise 方式）
function waitForAnimation() {
  return new Promise(resolve => {
    if (!view.getAnimating()) {
      // 如果当前没有动画，直接解决
      resolve();
    } else {
      // 如果有动画，监听 change 事件后递归检查
      view.once('change', () => {
        waitForAnimation().then(resolve);
      });
    }
  });
}

// 使用
await waitForAnimation();
console.log('动画已完成');

// 【示例 3】防止动画冲突
function flyTo(location) {
  // 如果正在动画，可以选择取消或等待
  if (view.getAnimating()) {
    console.log('正在执行动画，请稍等...');
    return;
  }

  // 执行新动画
  view.animate({
    center: location,
    duration: 1000
  });
}

// 【示例 4】显示加载状态
if (view.getAnimating()) {
  loadingSpinner.show();  // 显示加载动画
} else {
  loadingSpinner.hide();  // 隐藏加载动画
}`,
    returns: { type: 'boolean', description: '是否正在动画' }
  },
  {
    name: 'getCenter',
    cn: '获取中心点坐标',
    type: 'method',
    category: 'methods',
    description: '获取当前视图的中心点坐标。返回的是投影坐标（对于默认投影 EPSG:3857，单位为米）。',
    usage: `// ============================================
// getCenter 方法使用示例
// ============================================
// 方法说明：getCenter()
// 返回：中心点坐标 [x, y]（投影坐标）或 undefined
// 注意：返回的是投影坐标，不是经纬度！

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取中心点坐标（投影坐标）
const center = view.getCenter();
console.log('中心点:', center);
// 输出示例：[12963076, 4861614]（Web Mercator 坐标）

// ============================================
// 【坐标转换】
// ============================================

// 【示例 2】获取中心点经纬度（使用 EPSG:4326 直接返回经纬度）
const center = view.getCenter();
if (center) {
  // 直接就是经纬度，无需转换
  console.log('中心点经纬度:', center);
  // 输出示例：[116.4, 39.9]（北京）
  console.log('经度:', center[0]);
  console.log('纬度:', center[1]);
}

// ============================================
// 【实际应用】
// ============================================

// 【示例 3】监听中心点变化
view.on('change:center', () => {
  const newCenter = view.getCenter();
  if (newCenter) {
    console.log('中心点已改变:', newCenter);
    console.log('新位置：', newCenter[0].toFixed(4), '°E,', newCenter[1].toFixed(4), '°N');
  }
});

// 【示例 4】获取当前地图中心位置（用于保存状态）
function saveMapState() {
  const center = view.getCenter();
  const zoom = view.getZoom();

  if (center) {
    // 直接返回经纬度
    return {
      longitude: center[0],
      latitude: center[1],
      zoom: zoom
    };
  }
}

// 【示例 5】恢复地图状态
function restoreMapState(state) {
  // 直接使用经纬度
  view.setCenter([state.longitude, state.latitude]);
  view.setZoom(state.zoom);
}

// 【重要提示】
// - 使用 EPSG:4326 投影，getCenter() 直接返回经纬度
// - 无需进行坐标转换，可以直接使用`,
    returns: { type: 'Array<number>|undefined', description: '中心点坐标数组 [x, y]，如果未设置则返回 undefined' }
  },
  {
    name: 'getInteracting',
    cn: '检查是否正在交互',
    type: 'method',
    category: 'methods',
    description: '检查用户当前是否正在与视图交互（如拖拽、缩放等）。',
    usage: `// ============================================
// getInteracting 方法使用示例
// ============================================
// 方法说明：getInteracting()
// 返回：true（用户正在操作）或 false（无操作）
// 应用：检测用户交互状态、优化性能

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】检查是否正在交互
if (view.getInteracting()) {
  console.log('用户正在操作地图...');
} else {
  console.log('用户未操作地图');
}

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】监听交互状态变化
view.on('change:interacting', () => {
  if (view.getInteracting()) {
    console.log('交互开始 - 用户开始拖拽/缩放地图');
    // 可以显示提示、暂停自动刷新等
  } else {
    console.log('交互结束 - 用户停止操作');
    // 可以隐藏提示、恢复自动刷新等
  }
});

// 【示例 3】性能优化（交互时暂停复杂计算）
let isInteracting = false;

view.on('change:interacting', () => {
  isInteracting = view.getInteracting();

  if (isInteracting) {
    // 用户正在操作，暂停复杂计算（如大量要素渲染）
    pauseHeavyComputing();
  } else {
    // 用户停止操作，恢复计算
    resumeHeavyComputing();
  }
});

// 【示例 4】显示操作提示
function showInteractionHint() {
  if (view.getInteracting()) {
    hintElement.textContent = '正在移动地图...';
    hintElement.style.display = 'block';
  } else {
    hintElement.style.display = 'none';
  }
}

view.on('change:interacting', showInteractionHint);

// 【示例 5】区分用户操作和程序操作
function moveToLocation(location) {
  // 程序控制的移动，不是用户交互
  view.setCenter(location);

  // 此时 getInteracting() 返回 false
  // 因为这不是用户手动操作的
}

// 【与 getAnimating 的区别】
// - getInteracting: 用户是否正在手动操作（拖拽、缩放等）
// - getAnimating: 是否正在执行动画（可能是程序触发的）`,
    returns: { type: 'boolean', description: '是否正在交互' }
  },
  {
    name: 'getKeys',
    cn: '获取属性键',
    type: 'method',
    category: 'methods',
    description: '获取所有自定义属性的键名数组。继承自 BaseObject。',
    usage: `// ============================================
// getKeys 方法使用示例
// ============================================
// 方法说明：getKeys()
// 返回：所有自定义属性的键名数组
// 应用：遍历、检查、调试自定义属性

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取所有属性键
const keys = view.getKeys();
console.log('属性键:', keys);
// 输出示例：['mapMode', 'userLevel', 'customData']

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】遍历所有属性
const keys = view.getKeys();
keys.forEach(key => {
  const value = view.get(key);
  console.log(key, '=', value);
});

// 【示例 3】检查是否有自定义属性
if (view.getKeys().length === 0) {
  console.log('没有设置任何自定义属性');
}

// 【示例 4】复制所有属性到另一个对象
function copyProperties(source, target) {
  const keys = source.getKeys();
  keys.forEach(key => {
    target.set(key, source.get(key));
  });
}

// 【示例 5】调试用途（查看对象状态）
function debugView(view) {
  console.log('=== View 属性调试 ===');
  console.log('中心点:', view.getCenter());
  console.log('缩放级别:', view.getZoom());
  console.log('自定义属性:', view.getKeys());

  // 打印所有自定义属性的值
  view.getKeys().forEach(key => {
    console.log('  ', key, ':', view.get(key));
  });
}`,
    returns: { type: 'Array<string>', description: '属性键名数组' }
  },
  {
    name: 'getMaxResolution',
    cn: '获取最大分辨率',
    type: 'method',
    category: 'methods',
    description: '获取视图允许的最大分辨率（最缩小状态）。基于 minZoom 计算。',
    usage: `// ============================================
// getMaxResolution 方法使用示例
// ============================================
// 方法说明：getMaxResolution()
// 返回：最大分辨率值（米/像素）
// 说明：分辨率越大，地图显示范围越大（越缩小）

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取最大分辨率
const maxResolution = view.getMaxResolution();
console.log('最大分辨率:', maxResolution, '米/像素');
// 输出示例：78271.51696402048（对应 zoom 0）

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】检查当前分辨率是否达到最大值
const currentRes = view.getResolution();
const maxRes = view.getMaxResolution();

if (currentRes >= maxRes) {
  console.log('已达到最大分辨率（最缩小状态）');
}

// 【示例 3】与 minZoom 的关系
// maxResolution 对应 minZoom（最小缩放级别）
// minZoom 越小，maxResolution 越大（能看到更大范围）
console.log('minZoom:', view.getMinZoom());
console.log('maxResolution:', view.getMaxResolution());

// 【分辨率概念解释】
// - 分辨率：每个像素代表的实际距离（米/像素）
// - 分辨率越大 → 地图越缩小 → 看到范围越大
// - 分辨率越小 → 地图越放大 → 看到范围越小
// - maxResolution 是允许的最大值（最缩小状态）`,
    returns: { type: 'number', description: '最大分辨率（米/像素）' }
  },
  {
    name: 'getMaxZoom',
    cn: '获取最大缩放级别',
    type: 'method',
    category: 'methods',
    description: '获取视图允许的最大缩放级别。超过此级别后无法继续放大。',
    usage: `// ============================================
// getMaxZoom 方法使用示例
// ============================================
// 方法说明：getMaxZoom()
// 返回：最大缩放级别（数字）
// 说明：缩放级别越大，地图越详细（放大）

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取最大缩放级别
const maxZoom = view.getMaxZoom();
console.log('最大缩放:', maxZoom);
// 输出示例：18 或 20（取决于配置）

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】检查当前是否已达到最大缩放
if (view.getZoom() >= view.getMaxZoom()) {
  console.log('已达到最大缩放级别，无法继续放大');
}

// 【示例 3】设置最大缩放级别
view.setMaxZoom(20);  // 允许放大到街道级别
console.log('新的最大缩放:', view.getMaxZoom());

// 【示例 4】根据数据类型设置最大缩放
// 如果数据精度较低，限制最大缩放避免看到像素
view.setMaxZoom(15);  // 限制在 15 级

// 【缩放级别参考】
// 0-2: 全球视图
// 3-5: 大洲/国家
// 6-9: 省份/城市
// 10-12: 城区
// 13-15: 街道
// 16-18: 建筑物
// 19+: 室内/细节`,
    returns: { type: 'number', description: '最大缩放级别' }
  },
  {
    name: 'getMinResolution',
    cn: '获取最小分辨率',
    type: 'method',
    category: 'methods',
    description: '获取视图允许的最小分辨率（最放大状态）。基于 maxZoom 计算。',
    usage: `// ============================================
// getMinResolution 方法使用示例
// ============================================
// 方法说明：getMinResolution()
// 返回：最小分辨率值（米/像素）
// 说明：分辨率越小，地图越详细（越放大）

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取最小分辨率
const minResolution = view.getMinResolution();
console.log('最小分辨率:', minResolution, '米/像素');
// 输出示例：0.01（对应 zoom 20+）

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】检查当前分辨率是否达到最小值
const currentRes = view.getResolution();
const minRes = view.getMinResolution();

if (currentRes <= minRes) {
  console.log('已达到最小分辨率（最放大状态）');
}

// 【示例 3】与 maxZoom 的关系
// minResolution 对应 maxZoom（最大缩放级别）
// maxZoom 越大，minResolution 越小（能放得更大）
console.log('maxZoom:', view.getMaxZoom());
console.log('minResolution:', view.getMinResolution());

// 【分辨率概念解释】
// - 分辨率：每个像素代表的实际距离（米/像素）
// - 分辨率越小 → 地图越放大 → 细节越清晰
// - 分辨率越大 → 地图越缩小 → 范围越广
// - minResolution 是允许的最小值（最放大状态）`,
    returns: { type: 'number', description: '最小分辨率（米/像素）' }
  },
  {
    name: 'getMinZoom',
    cn: '获取最小缩放级别',
    type: 'method',
    category: 'methods',
    description: '获取视图允许的最小缩放级别。低于此级别后无法继续缩小。',
    usage: `// ============================================
// getMinZoom 方法使用示例
// ============================================
// 方法说明：getMinZoom()
// 返回：最小缩放级别（数字）
// 说明：缩放级别越小，地图范围越大（缩小）

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取最小缩放级别
const minZoom = view.getMinZoom();
console.log('最小缩放:', minZoom);
// 输出示例：0 或 3（取决于配置）

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】检查当前是否已达到最小缩放
if (view.getZoom() <= view.getMinZoom()) {
  console.log('已达到最小缩放级别，无法继续缩小');
}

// 【示例 3】设置最小缩放级别
view.setMinZoom(3);  // 限制用户不能缩得太小
console.log('新的最小缩放:', view.getMinZoom());

// 【示例 4】根据数据范围设置最小缩放
// 如果数据只覆盖某个区域，限制最小缩放避免看到无关区域
view.setMinZoom(5);  // 至少放大到省级范围

// 【缩放级别参考】
// 0: 整个世界
// 1-2: 大洲
// 3-5: 国家/省份
// 6-9: 城市
// 10+: 详细街道`,
    returns: { type: 'number', description: '最小缩放级别' }
  },
  {
    name: 'getProjection',
    cn: '获取投影对象',
    type: 'method',
    category: 'methods',
    description: '获取视图使用的投影对象。默认为 EPSG:3857（Web Mercator 投影）。',
    usage: `// ============================================
// getProjection 方法使用示例
// ============================================
// 方法说明：getProjection()
// 返回：Projection 对象
// 说明：投影决定了地图坐标系统

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取投影对象
const projection = view.getProjection();
console.log('投影代码:', projection.getCode());
// 输出示例：'EPSG:3857'（Web Mercator）

// ============================================
// 【投影信息】
// ============================================

// 【示例 2】获取投影单位
const projection = view.getProjection();
const units = projection.getUnits();
console.log('单位:', units);
// 输出示例：'m'（米）

// 【示例 3】获取投影范围
const projection = view.getProjection();
const extent = projection.getExtent();
console.log('投影范围:', extent);
// 输出示例：[-20037508, -20048966, 20037508, 20048966]

// ============================================
// 【实际应用】
// ============================================

// 【示例 4】获取投影信息
const projection = view.getProjection();
console.log('投影代码:', projection.getCode());
console.log('投影单位:', projection.getUnits());
console.log('投影范围:', projection.getExtent());

// 【示例 5】检查投影类型
const projection = view.getProjection();
if (projection.getCode() === 'EPSG:4326') {
  console.log('使用 WGS84 投影（经纬度）');
}

// 【常见投影代码】
// EPSG:4326 - WGS84（GPS、经纬度使用）本项目使用
// EPSG:3857 - Web Mercator（Google Maps、OSM 使用）
// EPSG:326xx - UTM 投影（区域投影）`,
    returns: { type: 'Projection', description: '投影对象' }
  },
  {
    name: 'getProperties',
    cn: '获取所有属性',
    type: 'method',
    category: 'methods',
    description: '获取所有自定义属性的对象。继承自 BaseObject。',
    usage: `// ============================================
// getProperties 方法使用示例
// ============================================
// 方法说明：getProperties()
// 返回：包含所有自定义属性的对象
// 应用：批量获取、保存状态、调试

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取所有属性
const props = view.getProperties();
console.log('所有属性:', props);
// 输出示例：{mapMode: 'satellite', userLevel: 5}

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】设置多个属性后获取
view.setProperties({
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
});

const props = view.getProperties();
console.log(props);
// 输出：{key1: 'value1', key2: 'value2', key3: 'value3'}

// 【示例 3】保存视图状态（包括自定义属性）
function saveViewState() {
  return {
    center: view.getCenter(),
    zoom: view.getZoom(),
    rotation: view.getRotation(),
    customProps: view.getProperties()  // 保存自定义属性
  };
}

// 【示例 4】恢复视图状态
function restoreViewState(state) {
  view.setCenter(state.center);
  view.setZoom(state.zoom);
  view.setRotation(state.rotation);

  // 恢复自定义属性
  if (state.customProps) {
    view.setProperties(state.customProps);
  }
}

// 【与 getKeys 的区别】
// - getKeys(): 返回键名数组 ['key1', 'key2']
// - getProperties(): 返回属性对象 {key1: 'v1', key2: 'v2'}`,
    returns: { type: 'Object', description: '属性对象' }
  },
  {
    name: 'getResolution',
    cn: '获取分辨率',
    type: 'method',
    category: 'methods',
    description: '获取当前视图的分辨率，即每个像素代表的地图单位数（对于 EPSG:3857 投影，单位为米）。分辨率越小，地图显示越详细。',
    usage: `// ============================================
// getResolution 方法使用示例
// ============================================
// 方法说明：getResolution()
// 返回：分辨率值（米/像素）或 undefined
// 说明：分辨率决定地图详细程度

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取当前分辨率
const resolution = view.getResolution();
console.log('分辨率:', resolution, '米/像素');
// 输出示例：100（表示 1 像素 = 100 米）

// ============================================
// 【分辨率与缩放的关系】
// ============================================

// 【示例 2】分辨率与缩放级别的关系
// 缩放级别每增加 1，分辨率减半（更详细）
const resolution = view.getResolution();
const zoom = view.getZoom();
console.log('当前缩放:', zoom);
console.log('当前分辨率:', resolution);

// 【示例 3】分辨率变化规律
// zoom 0: 约 156543 米/像素（整个世界）
// zoom 5: 约 4892 米/像素（大洲）
// zoom 10: 约 153 米/像素（城市）
// zoom 15: 约 4.8 米/像素（街道）
// zoom 18: 约 0.6 米/像素（建筑物）

// ============================================
// 【实际应用】
// ============================================

// 【示例 4】监听分辨率变化
view.on('change:resolution', () => {
  const res = view.getResolution();
  console.log('新分辨率:', res, '米/像素');

  // 根据分辨率决定显示什么级别的数据
  if (res < 10) {
    console.log('显示详细数据（建筑物级别）');
  } else if (res < 100) {
    console.log('显示中等数据（街道级别）');
  } else {
    console.log('显示概略数据（城市级别）');
  }
});

// 【示例 5】设置分辨率
view.setResolution(50);  // 设置为 50 米/像素

// 【分辨率选择指南】
// < 1 米/像素：建筑物、室内地图
// 1-10 米/像素：详细街道地图
// 10-100 米/像素：城市地图
// 100-1000 米/像素：区域地图
// > 1000 米/像素：全国/全球地图`,
    returns: { type: 'number|undefined', description: '当前分辨率（米/像素）' }
  },
  {
    name: 'getResolutionForExtent',
    cn: '根据范围获取分辨率',
    type: 'method',
    category: 'methods',
    description: '计算适配给定范围所需的分辨率。',
    usage: `// ============================================
// getResolutionForExtent 方法使用示例
// ============================================
// 方法说明：getResolutionForExtent(extent, size)
// 作用：计算能让给定范围完整显示在视口中的分辨率
// 应用：自动缩放到合适级别以显示特定区域

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】计算适配范围的分辨率
const extent = [minX, minY, maxX, maxY];
const resolution = view.getResolutionForExtent(extent);
console.log('适配范围的分辨率:', resolution, '米/像素');

// 【示例 2】设置该分辨率（让范围完整显示）
view.setResolution(resolution);

// ============================================
// 【实际应用】
// ============================================

// 【示例 3】配合中心点设置，完整显示目标区域
function fitToExtent(extent) {
  // 计算范围中心点
  const centerX = (extent[0] + extent[2]) / 2;
  const centerY = (extent[1] + extent[3]) / 2;

  // 计算适配分辨率
  const resolution = view.getResolutionForExtent(extent);

  // 设置中心点和分辨率
  view.setCenter([centerX, centerY]);
  view.setResolution(resolution);
}

// 【示例 4】传入自定义视口大小
const extent = [minX, minY, maxX, maxY];
const size = [800, 600];  // 自定义视口大小 800x600
const resolution = view.getResolutionForExtent(extent, size);
console.log('在 800x600 视口中的分辨率:', resolution);

// 【与 fit 方法的区别】
// - getResolutionForExtent: 只计算分辨率，不执行动画
// - fit: 自动计算并执行动画（更常用）
// 建议：如果需要动画效果，直接使用 fit() 方法`,
    params: [
      { name: 'extent', type: 'Array<number>', default: undefined, description: '范围 [minX, minY, maxX, maxY]' },
      { name: 'size', type: 'Array<number>', default: '视口大小', description: '可选的视口大小 [width, height]' }
    ],
    returns: { type: 'number', description: '适配范围的分辨率' }
  },
  {
    name: 'getResolutionForZoom',
    cn: '根据缩放获取分辨率',
    type: 'method',
    category: 'methods',
    description: '获取指定缩放级别对应的分辨率。',
    usage: `// ============================================
// getResolutionForZoom 方法使用示例
// ============================================
// 方法说明：getResolutionForZoom(zoom)
// 作用：获取指定缩放级别对应的分辨率值
// 应用：缩放级别与分辨率之间的转换

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取缩放级别对应的分辨率
const zoom = 10;
const resolution = view.getResolutionForZoom(zoom);
console.log('缩放级别', zoom, '对应的分辨率:', resolution, '米/像素');
// 输出示例：缩放级别 10 对应的分辨率：152.87 米/像素

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】批量获取各缩放级别的分辨率
for (let zoom = 0; zoom <= 18; zoom++) {
  const res = view.getResolutionForZoom(zoom);
  console.log('zoom', zoom, ':', res.toFixed(2), '米/像素');
}

// 【示例 3】分辨率与缩放级别对照表
// zoom 0: 约 156543 米/像素
// zoom 5: 约 4892 米/像素
// zoom 10: 约 153 米/像素
// zoom 15: 约 4.8 米/像素
// zoom 18: 约 0.6 米/像素

// 【示例 4】根据需要的精度选择合适的缩放级别
function findZoomForAccuracy(accuracyMeters) {
  for (let zoom = 0; zoom <= 20; zoom++) {
    const res = view.getResolutionForZoom(zoom);
    if (res <= accuracyMeters) {
      return zoom;
    }
  }
  return 20;
}

// 需要 10 米精度
const zoom = findZoomForAccuracy(10);
console.log('需要 10 米精度，建议使用缩放级别:', zoom);

// 【缩放级别与分辨率关系】
// 分辨率 = 初始分辨率 / (2 ^ zoom)
// 每增加 1 级，分辨率减半（精度翻倍）`,
    params: [
      { name: 'zoom', type: 'number', default: undefined, description: '缩放级别' }
    ],
    returns: { type: 'number', description: '分辨率' }
  },
  {
    name: 'getResolutions',
    cn: '获取分辨率数组',
    type: 'method',
    category: 'methods',
    description: '获取视图的分辨率数组。当 constrainResolution 为 true 时，只能使用这些分辨率。',
    usage: `// ============================================
// getResolutions 方法使用示例
// ============================================
// 方法说明：getResolutions()
// 返回：分辨率数组（如果定义了离散分辨率）
// 应用：查看可用的分辨率级别

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取分辨率数组
const resolutions = view.getResolutions();
console.log('可用分辨率:', resolutions);

// 如果有返回值，说明使用了离散的分辨率数组
// 如果返回 undefined，说明使用连续的分辨率（通过 zoomFactor 计算）

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】遍历所有分辨率
const resolutions = view.getResolutions();
if (resolutions) {
  resolutions.forEach((res, index) => {
    console.log('级别', index, ':', res.toFixed(2), '米/像素');
  });
}

// 【示例 3】检查当前分辨率在数组中的位置
const resolutions = view.getResolutions();
const currentRes = view.getResolution();
const index = resolutions.indexOf(currentRes);
console.log('当前分辨率是第', index, '级');

// 【示例 4】获取最大/最小分辨率
const resolutions = view.getResolutions();
if (resolutions) {
  const maxRes = Math.max(...resolutions);  // 最缩小
  const minRes = Math.min(...resolutions);  // 最放大
  console.log('最大分辨率:', maxRes);
  console.log('最小分辨率:', minRes);
}

// 【应用场景】
// - 当 constrainResolution: true 时，只能缩放到这些分辨率
// - 用于创建自定义的缩放级别控制
// - 用于动画中精确控制缩放过程`,
    returns: { type: 'Array<number>|undefined', description: '分辨率数组' }
  },
  {
    name: 'getRevision',
    cn: '获取修订版本',
    type: 'method',
    category: 'methods',
    description: '获取视图对象的修订版本号。每次视图状态改变时，版本号会递增。继承自 Observable。',
    usage: `// ============================================
// getRevision 方法使用示例
// ============================================
// 方法说明：getRevision()
// 返回：修订版本号（整数）
// 说明：每次视图状态改变，版本号 +1

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取修订版本
const revision = view.getRevision();
console.log('当前版本:', revision);
// 输出示例：5（表示状态改变了 5 次）

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】监听版本变化
view.on('propertychange', () => {
  console.log('版本已更新:', view.getRevision());
});

// 【示例 3】检测视图是否发生变化
const oldRevision = view.getRevision();

// ... 执行某些操作 ...

const newRevision = view.getRevision();
if (newRevision !== oldRevision) {
  console.log('视图状态发生了变化');
}

// 【示例 4】性能优化（避免重复渲染）
let lastRevision = 0;

function renderIfNeeded() {
  const currentRevision = view.getRevision();
  if (currentRevision === lastRevision) {
    return;  // 视图未变化，跳过渲染
  }
  lastRevision = currentRevision;
  render();  // 执行渲染
}

// 【应用场景】
// - 检测视图状态变化
// - 性能优化（避免不必要的重绘）
// - 调试和日志记录`,
    returns: { type: 'number', description: '修订版本号' }
  },
  {
    name: 'getRotation',
    cn: '获取旋转角度',
    type: 'method',
    category: 'methods',
    description: '获取视图的旋转角度，以弧度为单位。0 表示正北方向向上，正值表示顺时针旋转。',
    usage: `// ============================================
// getRotation 方法使用示例
// ============================================
// 方法说明：getRotation()
// 返回：旋转角度（弧度），0 表示北方朝上
// 范围：通常是 -π 到 π

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取旋转角度（弧度）
const rotation = view.getRotation();
console.log('旋转角度:', rotation, '弧度');
// 输出示例：0（北方朝上）或 1.57（顺时针 90 度）

// ============================================
// 【角度转换】
// ============================================

// 【示例 2】转换为角度（度）
const rotation = view.getRotation();
const degrees = rotation * 180 / Math.PI;
console.log('旋转角度:', degrees.toFixed(1), '度');
// 输出示例：90.0 度（顺时针 90 度）

// 【示例 3】角度转弧度
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

// 设置 45 度旋转
view.setRotation(degreesToRadians(45));

// ============================================
// 【实际应用】
// ============================================

// 【示例 4】监听旋转变化
view.on('change:rotation', () => {
  const rotation = view.getRotation();
  const degrees = rotation * 180 / Math.PI;
  console.log('当前旋转:', degrees.toFixed(1), '度');
});

// 【示例 5】检查地图是否旋转
if (view.getRotation() !== 0) {
  console.log('地图已旋转，北方不朝上');
} else {
  console.log('地图方向正常，北方朝上');
}

// 【示例 6】重置旋转（北方朝上）
view.setRotation(0);

// 【弧度与角度对照】
// 0 弧度 = 0 度（北方朝上）
// π/2 弧度 ≈ 1.57 = 90 度（顺时针 90 度，东方朝上）
// π 弧度 ≈ 3.14 = 180 度（南方朝上）
// -π/2 弧度 ≈ -1.57 = -90 度（逆时针 90 度，西方朝上）`,
    returns: { type: 'number', description: '旋转角度（弧度，顺时针为正，默认为 0）' }
  },
  {
    name: 'getZoom',
    cn: '获取缩放级别',
    type: 'method',
    category: 'methods',
    description: '获取当前视图的缩放级别。缩放级别是一个浮点数值，值越大表示地图显示越详细。',
    usage: `// ============================================
// getZoom 方法使用示例
// ============================================
// 方法说明：getZoom()
// 返回：缩放级别（浮点数）或 undefined
// 范围：通常 0-28，值越大越详细

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取当前缩放级别
const zoom = view.getZoom();
console.log('缩放级别:', zoom);
// 输出示例：10.5（可能是小数）

// 【示例 2】获取整数缩放级别
const zoomLevel = Math.round(view.getZoom());
console.log('整数缩放级别:', zoomLevel);

// ============================================
// 【实际应用】
// ============================================

// 【示例 3】监听缩放变化
view.on('change:resolution', () => {
  console.log('当前缩放:', view.getZoom());

  // 根据缩放级别显示不同提示
  const zoom = view.getZoom();
  if (zoom < 5) {
    console.log('当前视角：全球/大洲');
  } else if (zoom < 10) {
    console.log('当前视角：城市');
  } else if (zoom < 15) {
    console.log('当前视角：街道');
  } else {
    console.log('当前视角：建筑物');
  }
});

// 【示例 4】获取相关值
const resolution = view.getResolution();  // 分辨率（米/像素）
// const visibleResolution = view.getVisibleResolution(); // 可见分辨率（如果有这个方法）

// 【示例 5】检查缩放级别范围
const zoom = view.getZoom();
const minZoom = view.getMinZoom();
const maxZoom = view.getMaxZoom();

if (zoom <= minZoom) {
  console.log('已达到最小缩放（最缩小状态）');
}
if (zoom >= maxZoom) {
  console.log('已达到最大缩放（最放大状态）');
}

// 【缩放级别参考】
// 0-2: 全球视图
// 3-5: 大洲/国家
// 6-9: 省份/城市
// 10-12: 城区
// 13-15: 街道
// 16-18: 建筑物
// 19+: 室内/细节`,
    returns: { type: 'number|undefined', description: '当前缩放级别，如果未设置则返回 undefined' }
  },
  {
    name: 'getZoomForResolution',
    cn: '根据分辨率获取缩放',
    type: 'method',
    category: 'methods',
    description: '获取指定分辨率对应的缩放级别。',
    usage: `// ============================================
// getZoomForResolution 方法使用示例
// ============================================
// 方法说明：getZoomForResolution(resolution)
// 作用：将分辨率转换为缩放级别
// 应用：分辨率与缩放级别之间的转换

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】获取分辨率对应的缩放级别
const resolution = 100;  // 100 米/像素
const zoom = view.getZoomForResolution(resolution);
console.log('分辨率', resolution, '对应的缩放:', zoom.toFixed(2));
// 输出示例：分辨率 100 对应的缩放：9.23

// ============================================
// 【实际应用】
// ============================================

// 【示例 2】批量转换
const resolutions = [1000, 100, 10, 1, 0.1];
resolutions.forEach(res => {
  const zoom = view.getZoomForResolution(res);
  console.log(res + '米/像素 → zoom', zoom.toFixed(2));
});

// 【示例 3】设置分辨率后获取缩放
view.setResolution(50);
const zoom = view.getZoomForResolution(50);
console.log('50 米/像素对应的缩放级别:', zoom);

// 【示例 4】分辨率与缩放级别对照
// 约 156543 米/像素 → zoom 0
// 约 4892 米/像素 → zoom 5
// 约 153 米/像素 → zoom 10
// 约 4.8 米/像素 → zoom 15
// 约 0.6 米/像素 → zoom 18

// 【与 getResolutionForZoom 的关系】
// - getZoomForResolution: 分辨率 → 缩放级别
// - getResolutionForZoom: 缩放级别 → 分辨率
// 两者互为逆运算`,
    params: [
      { name: 'resolution', type: 'number', default: undefined, description: '分辨率' }
    ],
    returns: { type: 'number', description: '缩放级别' }
  },
  {
    name: 'on',
    cn: '监听事件',
    type: 'method',
    category: 'methods',
    description: '监听视图事件。View 继承自 Observable，支持事件监听机制。',
    usage: `// ============================================
// on 方法使用示例
// ============================================
// 方法说明：on(type, listener)
// 作用：添加事件监听器
// 应用：响应视图状态变化

// ============================================
// 【常用事件类型】
// ============================================

// 【示例 1】监听中心点变化
view.on('change:center', (event) => {
  const center = view.getCenter();
  console.log('中心点变化:', center);
});

// 【示例 2】监听分辨率/缩放变化
view.on('change:resolution', () => {
  console.log('缩放级别变化:', view.getZoom());
});

// 【示例 3】监听旋转变化
view.on('change:rotation', () => {
  console.log('旋转角度变化:', view.getRotation());
});

// 【示例 4】监听视图范围变化
view.on('change:extent', () => {
  console.log('视图范围变化');
});

// ============================================
// 【进阶用法】
// ============================================

// 【示例 5】移除监听（方式 1：使用返回的 key）
const key = view.on('change:center', callback);
view.un(key);  // 取消监听

// 【示例 6】移除监听（方式 2：直接指定事件和回调）
function myCallback() {
  console.log('中心点变化');
}
view.on('change:center', myCallback);
// ... 稍后 ...
view.un('change:center', myCallback);

// 【示例 7】监听多次（每次触发都会执行）
let clickCount = 0;
view.on('change:center', () => {
  clickCount++;
  console.log('中心点变化次数:', clickCount);
});

// 【示例 8】监听所有变化
view.on('change', () => {
  console.log('视图发生任何变化');
});

// 【常用事件列表】
// change: 任何变化
// change:center: 中心点变化
// change:resolution: 分辨率/缩放变化
// change:rotation: 旋转变化
// change:interacting: 交互状态变化
// propertychange: 属性变化`,
    params: [
      { name: 'type', type: 'string', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '回调函数' }
    ],
    returns: { type: 'EventsKey|Array<EventsKey>', description: '事件键，用于取消监听' }
  },
  {
    name: 'once',
    cn: '监听一次事件',
    type: 'method',
    category: 'methods',
    description: '监听事件一次，触发后自动移除。继承自 Observable。',
    usage: `// ============================================
// once 方法使用示例
// ============================================
// 方法说明：once(type, listener)
// 特点：只触发一次，自动移除监听
// 应用：等待特定事件发生

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】只监听一次中心点变化
view.once('change:center', (event) => {
  console.log('中心点变化了一次');
  // 监听器自动移除，下次变化不会触发
});

// 【示例 2】等待动画完成
view.once('change:resolution', () => {
  console.log('缩放级别改变了一次');
  console.log('动画可能已完成');
});

// ============================================
// 【实际应用】
// ============================================

// 【示例 3】等待用户操作完成
function waitForUserInteraction() {
  return new Promise(resolve => {
    view.once('change:interacting', () => {
      // 用户开始交互
      view.once('change:interacting', () => {
        // 用户结束交互
        resolve();
      });
    });
  });
}

// 【示例 4】一次性提示
view.once('change:center', () => {
  showToast('提示：您已移动地图');
  // 下次移动不会再提示
});

// 【示例 5】链式监听
view.once('change:center', () => {
  console.log('第一次中心点变化');

  view.once('change:center', () => {
    console.log('第二次中心点变化');

    view.once('change:center', () => {
      console.log('第三次中心点变化');
    });
  });
});

// 【on vs once】
// on: 永久监听，每次事件都触发，需要手动取消
// once: 只监听一次，触发后自动取消`,
    params: [
      { name: 'type', type: 'string', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '回调函数' }
    ],
    returns: { type: 'EventsKey|Array<EventsKey>', description: '事件键' }
  },
  {
    name: 'set',
    cn: '设置属性',
    type: 'method',
    category: 'methods',
    description: '设置视图的自定义属性。继承自 BaseObject。',
    usage: `// ============================================
// set 方法使用示例
// ============================================
// 方法说明：set(key, value)
// 作用：设置自定义属性
// 应用：存储与视图关联的数据

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】设置自定义属性
view.set('myKey', 'myValue');

// 【示例 2】获取属性
const value = view.get('myKey');
console.log('属性值:', value);

// 【示例 3】删除属性
view.unset('myKey');

// ============================================
// 【实际应用】
// ============================================

// 【示例 4】存储地图配置
view.set('mapConfig', {
  theme: 'dark',
  language: 'zh-CN',
  showLabels: true
});

// 获取配置
const config = view.get('mapConfig');
console.log('主题:', config.theme);

// 【示例 5】存储用户偏好
view.set('userPreferences', {
  defaultZoom: 10,
  showTraffic: false,
  units: 'metric'
});

// 【示例 6】标记视图状态
view.set('isInitialized', true);
view.set('lastUpdateTime', Date.now());

// 【示例 7】链式设置（需要自己实现）
view.set('key1', 'value1');
view.set('key2', 'value2');
view.set('key3', 'value3');

// 或使用 setProperties 批量设置
view.setProperties({
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
});

// 【提示】
// - set 触发 propertychange 事件
// - 可以使用 get 获取
// - 可以使用 unset 删除`,
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性键名' },
      { name: 'value', type: '*', default: undefined, description: '属性值' }
    ]
  },
  {
    name: 'setCenter',
    cn: '设置中心点坐标',
    type: 'method',
    category: 'methods',
    description: '设置视图的中心点坐标。坐标应为地图投影单位的坐标。对于默认投影（EPSG:3857），单位为米。',
    usage: `// ============================================
// setCenter 方法使用示例
// ============================================
// 方法说明：setCenter(center)
// 作用：直接设置地图中心点（无动画）
// 注意：需要传入投影坐标，不是经纬度！

// ============================================
// 【说明】使用 EPSG:4326 投影，无需坐标转换
// ============================================

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】直接设置中心点（北京，经纬度）
// 使用 EPSG:4326 投影，直接使用经纬度
view.setCenter([116.4, 39.9]);
// 效果：地图中心立即移动到北京（无动画）

// ============================================
// 【进阶用法】
// ============================================

// 【示例 2】带动画过渡（推荐使用 animate）
view.animate({
  center: [116.4, 39.9],
  duration: 1000  // 1 秒动画
});

// 【示例 3】从 GeoJSON 获取中心点并设置
const feature = geojsonFormat.readFeature(geojsonObject);
const geometry = feature.getGeometry();
const center = geometry.getCoordinates();  // 获取几何中心
view.setCenter(center);

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 4】定位到用户输入的城市（使用经纬度）
function locateCity(cityName) {
  const cities = {
    'beijing': [116.4, 39.9],
    'shanghai': [121.47, 31.23],
    'guangzhou': [113.26, 23.12],
    'shenzhen': [114.07, 22.62]
  };

  const coords = cities[cityName.toLowerCase()];
  if (coords) {
    // 直接使用经纬度
    view.setCenter(coords);
  }
}

// 使用
locateCity('beijing');

// 【示例 5】返回当前位置
const currentCenter = view.getCenter();
// ... 执行其他操作 ...
view.setCenter(currentCenter);  // 返回原位置

// 【示例 6】设置 undefined 清除中心点
view.setCenter(undefined);  // 清除中心点设置

// 【setCenter vs animate】
// setCenter: 立即移动，无动画（适合初始化）
// animate: 平滑移动，有动画（适合用户交互）`,
    params: [
      { name: 'center', type: 'Array<number>|undefined', default: undefined, description: '中心点坐标 [x, y] 或 undefined' }
    ]
  },
  {
    name: 'setConstrainResolution',
    cn: '设置约束分辨率',
    type: 'method',
    category: 'methods',
    description: '设置是否限制为整数缩放级别。当为 true 时，缩放会被约束到预定义的分辨率级别。',
    usage: `// ============================================
// setConstrainResolution 方法使用示例
// ============================================
// 方法说明：setConstrainResolution(constrain)
// 作用：控制是否只能整数缩放

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】启用约束分辨率（只能整数缩放）
view.setConstrainResolution(true);
// 效果：用户缩放时只能停在 1, 2, 3... 等级别
// 不能停在 1.5, 2.3 等小数级别

// 【示例 2】禁用约束分辨率（可以小数缩放）
view.setConstrainResolution(false);
// 效果：用户可以平滑缩放到任意级别
// 可以停在 1.5, 2.3, 10.75 等级别

// ============================================
// 【应用场景】
// ============================================

// 【示例 3】配合分辨率数组使用
// 当定义了 resolutions 数组时，constrainResolution: true
// 会让缩放只能停在数组定义的级别
const view = new View({
  resolutions: [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1],
  constrainResolution: true  // 只能使用上述分辨率
});

// 【示例 4】切换约束模式
// 默认模式（自由缩放）
view.setConstrainResolution(false);

// 切换到约束模式（整数缩放）
view.setConstrainResolution(true);

// 【约束效果】
// false: 缩放级别可以是 10.23, 10.45, 10.89...（平滑）
// true:  缩放级别只能是 10, 11, 12...（阶梯式）`,
    params: [
      { name: 'constrainResolution', type: 'boolean', default: undefined, description: '是否约束分辨率' }
    ]
  },
  {
    name: 'setMaxZoom',
    cn: '设置最大缩放级别',
    type: 'method',
    category: 'methods',
    description: '设置视图允许的最大缩放级别。',
    usage: `// ============================================
// setMaxZoom 方法使用示例
// ============================================
// 方法说明：setMaxZoom(maxZoom)
// 作用：限制用户能放大的最大程度

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】设置最大缩放级别为 18
view.setMaxZoom(18);
// 效果：用户最多放大到 18 级，无法继续放大

// 【示例 2】获取当前最大缩放
console.log('最大缩放:', view.getMaxZoom());

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】根据数据精度设置最大缩放
// 如果数据精度只到街道级别，限制在 15 级
view.setMaxZoom(15);

// 如果数据精度到建筑物级别，允许放大到 18 级
view.setMaxZoom(18);

// 如果是卫星图，可以放大到 20 级
view.setMaxZoom(20);

// 【示例 4】动态调整最大缩放
function updateMaxZoomByLayer(layerType) {
  switch(layerType) {
    case 'satellite':
      view.setMaxZoom(20);  // 卫星图可以放很大
      break;
    case 'street':
      view.setMaxZoom(18);  // 街道图适中
      break;
    case 'overview':
      view.setMaxZoom(12);  // 概略图限制放大
      break;
  }
}

// 【缩放级别参考】
// 15: 街道级别（可以看到路名）
// 17: 建筑物级别（可以看到房屋轮廓）
// 19: 细节级别（可以看到车辆、行人）
// 20+: 超细节级别`,
    params: [
      { name: 'maxZoom', type: 'number', default: undefined, description: '最大缩放级别' }
    ]
  },
  {
    name: 'setMinZoom',
    cn: '设置最小缩放级别',
    type: 'method',
    category: 'methods',
    description: '设置视图允许的最小缩放级别。',
    usage: `// ============================================
// setMinZoom 方法使用示例
// ============================================
// 方法说明：setMinZoom(minZoom)
// 作用：限制用户能缩小的最小程度

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】设置最小缩放级别为 3
view.setMinZoom(3);
// 效果：用户最少缩放到 3 级，无法继续缩小

// 【示例 2】获取当前最小缩放
console.log('最小缩放:', view.getMinZoom());

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】根据数据范围设置最小缩放
// 如果数据只覆盖中国，限制最小缩放为 3（避免看到无关区域）
view.setMinZoom(3);

// 如果数据覆盖全球，允许缩小到 0
view.setMinZoom(0);

// 【示例 4】动态调整最小缩放
function updateMinZoomByDataRange(dataExtent) {
  // 根据数据范围计算合适的最小缩放
  const minZoom = calculateMinZoom(dataExtent);
  view.setMinZoom(minZoom);
}

// 【示例 5】配合 maxZoom 使用
view.setMinZoom(3);   // 最小缩放到省级范围
view.setMaxZoom(18);  // 最大缩放到建筑物级别

// 【缩放级别参考】
// 0: 整个世界（可以看到所有大洲）
// 2: 大洲级别
// 3: 国家级别
// 5: 省份级别
// 8: 城市级别`,
    params: [
      { name: 'minZoom', type: 'number', default: undefined, description: '最小缩放级别' }
    ]
  },
  {
    name: 'setProperties',
    cn: '设置多个属性',
    type: 'method',
    category: 'methods',
    description: '批量设置多个自定义属性。继承自 BaseObject。',
    usage: `// ============================================
// setProperties 方法使用示例
// ============================================
// 方法说明：setProperties(properties)
// 作用：一次性设置多个属性
// 应用：批量配置、状态恢复

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】设置多个属性
view.setProperties({
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
});

// 【示例 2】获取所有属性
const props = view.getProperties();
console.log(props);
// 输出：{key1: 'value1', key2: 'value2', key3: 'value3'}

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】保存和恢复视图配置
// 保存
const savedConfig = {
  theme: 'dark',
  language: 'zh-CN',
  showLabels: true,
  showScale: true
};
view.setProperties(savedConfig);

// 恢复
const config = view.getProperties();
console.log('主题:', config.theme);

// 【示例 4】初始化视图配置
view.setProperties({
  isInitialized: true,
  initTime: Date.now(),
  version: '1.0.0',
  author: 'YourName'
});

// 【示例 5】批量更新配置
function updateViewConfig(updates) {
  // updates 是一个对象，包含需要更新的属性
  view.setProperties(updates);
}

updateViewConfig({
  theme: 'light',
  showTraffic: true
});

// 【setProperties vs 多次 set】
// setProperties: 一次设置多个，触发一次 propertychange
// 多次 set: 每次设置一个，触发多次 propertychange`,
    params: [
      { name: 'properties', type: 'Object', default: undefined, description: '属性对象' }
    ]
  },
  {
    name: 'setResolution',
    cn: '设置分辨率',
    type: 'method',
    category: 'methods',
    description: '设置视图的分辨率。分辨率决定了地图显示的详细程度，分辨率越小表示地图越详细。',
    usage: `// ============================================
// setResolution 方法使用示例
// ============================================
// 方法说明：setResolution(resolution)
// 作用：直接设置分辨率（无动画）
// 单位：米/像素

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】设置分辨率为 100 米/像素
view.setResolution(100);
// 效果：1 像素 = 100 米，立即生效（无动画）

// 【示例 2】获取当前分辨率并减半（放大一倍）
const currentRes = view.getResolution();
view.setResolution(currentRes / 2);

// ============================================
// 【进阶用法】
// ============================================

// 【示例 3】带动画
view.animate({
  resolution: 50,  // 目标分辨率
  duration: 500    // 动画时间 500ms
});

// 【示例 4】根据需要的精度设置分辨率
function setResolutionByAccuracy(accuracyMeters) {
  // accuracyMeters: 需要的精度（米）
  view.setResolution(accuracyMeters);
}

// 需要 10 米精度
setResolutionByAccuracy(10);

// 【示例 5】重置分辨率
view.setResolution(undefined);  // 清除分辨率设置

// 【分辨率参考】
// 1000 米/像素：全国范围
// 100 米/像素：城市范围
// 10 米/像素：街道范围
// 1 米/像素：建筑物范围
// 0.1 米/像素：室内范围`,
    params: [
      { name: 'resolution', type: 'number|undefined', default: undefined, description: '分辨率值（米/像素）' }
    ]
  },
  {
    name: 'setRotation',
    cn: '设置旋转角度',
    type: 'method',
    category: 'methods',
    description: '设置视图的旋转角度。正值表示顺时针旋转，负值表示逆时针旋转。常用于实现地图旋转功能。',
    usage: `// ============================================
// setRotation 方法使用示例
// ============================================
// 方法说明：setRotation(rotation)
// 单位：弧度（radians）
// 0: 北方朝上，正值顺时针旋转

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】旋转 90 度（顺时针）
// 90 度 = π/2 弧度
view.setRotation(Math.PI / 2);

// 【示例 2】旋转 180 度
// 180 度 = π 弧度
view.setRotation(Math.PI);

// 【示例 3】重置为北方朝上
view.setRotation(0);

// ============================================
// 【进阶用法】
// ============================================

// 【示例 4】带动画旋转
view.animate({
  rotation: Math.PI / 4,  // 顺时针 45 度
  duration: 1000          // 1 秒动画
});

// 【示例 5】实现罗盘功能
function rotateMap(angle) {
  view.animate({
    rotation: angle,
    duration: 300
  });
}

// 使用罗盘控件
rotateMap(Math.PI / 6);  // 顺时针 30 度

// ============================================
// 【实际应用】
// ============================================

// 【示例 6】角度转弧度工具函数
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

// 旋转 45 度
view.setRotation(degreesToRadians(45));

// 【示例 7】跟随设备方向（如果有方向传感器）
// deviceOrientation 是设备方向（度）
const deviceOrientation = 90;  // 设备指向东
view.setRotation(-degreesToRadians(deviceOrientation));

// 【弧度与角度对照】
// 0 = 0 度（北方朝上）
// π/6 ≈ 0.52 = 30 度
// π/4 ≈ 0.79 = 45 度
// π/2 ≈ 1.57 = 90 度（东方朝上）
// π ≈ 3.14 = 180 度（南方朝上）
// -π/2 ≈ -1.57 = -90 度（西方朝上）`,
    params: [
      { name: 'rotation', type: 'number', default: undefined, description: '旋转角度（弧度）' }
    ]
  },
  {
    name: 'setZoom',
    cn: '设置缩放级别',
    type: 'method',
    category: 'methods',
    description: '设置视图的缩放级别。缩放级别决定了地图显示的详细程度。',
    usage: `// ============================================
// setZoom 方法使用示例
// ============================================
// 方法说明：setZoom(zoom)
// 作用：直接设置缩放级别（无动画）
// 范围：通常 0-28

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】直接设置缩放级别
view.setZoom(10);
// 效果：立即缩放到 10 级（城市级别）

// ============================================
// 【进阶用法】
// ============================================

// 【示例 2】带动画过渡
view.animate({
  zoom: 12,       // 目标缩放级别
  duration: 500   // 动画时间 500ms
});

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】缩放到特定区域（自动计算缩放级别）
const bounds = [minX, minY, maxX, maxY];
view.fit(bounds, {
  padding: [50, 50, 50, 50],
  duration: 1000
});

// 【示例 4】缩放到几何图形
view.fit(geometry, {
  padding: [100, 100, 100, 100],
  maxZoom: 17
});

// 【示例 5】根据数据类型设置缩放
function setZoomByDataType(dataType) {
  switch(dataType) {
    case 'country':
      view.setZoom(5);    // 国家级别
      break;
    case 'city':
      view.setZoom(12);   // 城市级别
      break;
    case 'street':
      view.setZoom(16);   // 街道级别
      break;
    case 'building':
      view.setZoom(18);   // 建筑物级别
      break;
  }
}

// 【示例 6】恢复上次缩放
const savedZoom = localStorage.getItem('mapZoom');
if (savedZoom) {
  view.setZoom(parseFloat(savedZoom));
}

// 【缩放级别参考】
// 0-2: 全球
// 3-5: 大洲/国家
// 6-9: 省份/城市
// 10-12: 城区
// 13-15: 街道
// 16-18: 建筑物`,
    params: [
      { name: 'zoom', type: 'number|undefined', default: undefined, description: '缩放级别（通常为 0-28 之间）' }
    ]
  },
  {
    name: 'un',
    cn: '取消监听',
    type: 'method',
    category: 'methods',
    description: '取消事件监听。继承自 Observable。',
    usage: `// ============================================
// un 方法使用示例
// ============================================
// 方法说明：un(key) 或 un(type, listener)
// 作用：移除事件监听器
// 应用：清理资源、防止内存泄漏

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】添加监听
const key = view.on('change:center', callback);

// 【示例 2】取消监听（方式 1：使用 key）
view.un(key);

// 【示例 3】取消监听（方式 2：直接指定事件和回调）
function myCallback() {
  console.log('中心点变化');
}
view.on('change:center', myCallback);
// ... 稍后 ...
view.un('change:center', myCallback);

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 4】Vue 组件中清理监听
import {onUnmounted} from 'vue';

const listenerKey = view.on('change:center', handleCenterChange);

onUnmounted(() => {
  view.un(listenerKey);  // 组件卸载时清理
});

// 【示例 5】React 组件中清理监听
useEffect(() => {
  const key = view.on('change:center', handleCenterChange);
  return () => {
    view.un(key);  // 组件卸载时清理
  };
}, []);

// 【示例 6】取消所有某种类型的监听
// 如果有多个监听器绑定到同一事件
view.un('change:center');  // 取消所有 change:center 监听

// 【为什么要取消监听？】
// 1. 防止内存泄漏
// 2. 避免重复触发
// 3. 组件清理时需要`,
    params: [
      { name: 'key', type: 'EventsKey|Array<EventsKey>', default: undefined, description: '事件键' }
    ]
  },
  {
    name: 'unset',
    cn: '删除属性',
    type: 'method',
    category: 'methods',
    description: '删除视图的自定义属性。继承自 BaseObject。',
    usage: `// ============================================
// unset 方法使用示例
// ============================================
// 方法说明：unset(key)
// 作用：删除自定义属性
// 应用：清理不需要的数据

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】删除属性
view.unset('myKey');

// 【示例 2】检查属性是否已被删除
if (view.get('myKey') === undefined) {
  console.log('属性已删除');
}

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】清理临时数据
view.set('tempData', someData);
// ... 使用临时数据 ...
view.unset('tempData');  // 用完删除

// 【示例 4】重置配置
view.set('theme', 'dark');
// ... 稍后恢复默认 ...
view.unset('theme');  // 删除自定义主题，恢复默认

// 【示例 5】批量删除
const keysToDelete = ['key1', 'key2', 'key3'];
keysToDelete.forEach(key => {
  view.unset(key);
});

// 【unset vs set(undefined)】
// unset('key'): 完全删除属性
// set('key', undefined): 设置值为 undefined，属性仍存在`,
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性键名' }
    ]
  },

  // ========== Events (事件) ==========
  {
    name: 'change',
    cn: '变更事件',
    type: 'event',
    category: 'events',
    description: '当视图任何属性改变时触发。这是通用的变更事件。',
    usage: `// ============================================
// change 事件使用示例
// ============================================
// 事件说明：当视图任何属性改变时触发
// 触发时机：中心点、缩放、分辨率、旋转等任何变化
// 注意：这是通用事件，建议使用更具体的事件（如 change:center）

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】监听任何变更
view.on('change', () => {
  console.log('视图已变更');
  console.log('中心点:', view.getCenter());
  console.log('缩放:', view.getZoom());
});

// ============================================
// 【进阶用法】
// ============================================

// 【示例 2】监听特定属性变更（推荐）
// 比通用 change 事件更精确，性能更好
view.on('change:center', () => {
  console.log('中心点变更');
});

view.on('change:resolution', () => {
  console.log('分辨率/缩放变更');
});

view.on('change:rotation', () => {
  console.log('旋转角度变更');
});

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】记录视图变化历史
const viewHistory = [];
view.on('change', () => {
  viewHistory.push({
    time: Date.now(),
    center: view.getCenter(),
    zoom: view.getZoom()
  });
  // 只保留最近 100 条记录
  if (viewHistory.length > 100) {
    viewHistory.shift();
  }
});

// 【示例 4】实现撤销/重做功能
let isUndoRedoOperation = false;
view.on('change', () => {
  if (!isUndoRedoOperation) {
    // 记录当前状态到历史栈
    historyStack.push({
      center: view.getCenter(),
      zoom: view.getZoom(),
      rotation: view.getRotation()
    });
  }
  isUndoRedoOperation = false;
});

// 【示例 5】性能优化：防抖处理
let changeTimeout;
view.on('change', () => {
  clearTimeout(changeTimeout);
  changeTimeout = setTimeout(() => {
    // 视图停止变化后再执行
    console.log('视图稳定后的状态:', {
      center: view.getCenter(),
      zoom: view.getZoom()
    });
  }, 300); // 300ms 防抖
});

// 【change 事件 vs 特定事件】
// change: 任何变化都触发，可能频繁触发
// change:center: 只响应中心点变化，更精确
// change:resolution: 只响应缩放变化，更精确
// 建议：优先使用特定事件，减少不必要的触发`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'change:center',
    cn: '中心点变更事件',
    type: 'event',
    category: 'events',
    description: '当视图中心点改变时触发。',
    usage: `// ============================================
// change:center 事件使用示例
// ============================================
// 事件说明：当视图中心点改变时触发
// 触发时机：拖拽地图、setCenter、animate、fit 等操作
// 应用：更新位置显示、加载周边数据、记录轨迹

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】监听中心点变化
view.on('change:center', () => {
  const center = view.getCenter();
  console.log('新中心点:', center);
  // 输出示例：[12933516.24, 4108366.93]
});

// ============================================
// 【进阶用法】
// ============================================

// 【示例 2】获取中心点经纬度（EPSG:4326 投影）
view.on('change:center', () => {
  const center = view.getCenter();
  // 使用 EPSG:4326 投影，直接就是经纬度
  console.log('经度:', center[0].toFixed(6));
  console.log('纬度:', center[1].toFixed(6));
});

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】更新 UI 中的位置信息
view.on('change:center', () => {
  const center = view.getCenter();

  // 更新页面上的坐标显示（直接是经纬度）
  document.getElementById('longitude').textContent = center[0].toFixed(4);
  document.getElementById('latitude').textContent = center[1].toFixed(4);
});

// 【示例 4】加载当前位置的周边数据
let loadDebounce;
view.on('change:center', () => {
  clearTimeout(loadDebounce);
  loadDebounce = setTimeout(() => {
    const center = view.getCenter();
    // 加载当前位置 500 米范围内的 POI 数据
    loadNearbyPOI(center[0], center[1], 500);
  }, 500);  // 拖拽停止后加载
});

// 【示例 5】记录用户浏览轨迹
const trackLog = [];
view.on('change:center', () => {
  trackLog.push({
    timestamp: Date.now(),
    center: view.getCenter(),
    zoom: view.getZoom()
  });
  // 限制记录数量
  if (trackLog.length > 1000) {
    trackLog.splice(0, 100);
  }
});

// 【示例 6】Vue 组件中使用（EPSG:4326 投影）
import {ref, onUnmounted} from 'vue';
const currentPos = ref({lng: 0, lat: 0});

const centerListener = view.on('change:center', () => {
  const [lng, lat] = view.getCenter();  // 直接获取经纬度
  currentPos.value = {lng, lat};
});

onUnmounted(() => {
  view.un(centerListener);  // 清理监听
});

// 【示例 7】React 组件中使用
import {useEffect, useState} from 'react';

function MapComponent() {
  const [center, setCenter] = useState({lng: 0, lat: 0});

  useEffect(() => {
    const key = view.on('change:center', () => {
      const [lng, lat] = view.getCenter();  // 直接获取经纬度
      setCenter({lng, lat});
    });
    return () => view.un(key);  // 清理
  }, []);

  return <div>当前位置：{center.lng}, {center.lat}</div>;
}

// 【何时触发 change:center】
// 1. 用户拖拽地图
// 2. 调用 view.setCenter()
// 3. 调用 view.animate({center: ...})
// 4. 调用 view.fit()
// 5. 调用 view.centerOn()`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'change:resolution',
    cn: '分辨率变更事件',
    type: 'event',
    category: 'events',
    description: '当视图分辨率（缩放级别）改变时触发。',
    usage: `// ============================================
// change:resolution 事件使用示例
// ============================================
// 事件说明：当视图分辨率/缩放级别改变时触发
// 触发时机：滚轮缩放、双击缩放、setZoom、animate、fit 等操作
// 应用：更新缩放级别显示、控制图层可见性、加载不同精度数据

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】监听分辨率变化
view.on('change:resolution', () => {
  console.log('新分辨率:', view.getResolution());
  console.log('新缩放:', view.getZoom());
  // 分辨率单位：米/像素
  // 缩放级别：0-28 的数字
});

// ============================================
// 【进阶用法】
// ============================================

// 【示例 2】更新 UI 中的缩放级别显示
const zoomDisplay = document.getElementById('zoom-display');
view.on('change:resolution', () => {
  zoomDisplay.textContent = view.getZoom().toFixed(1);
});

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】根据缩放级别控制图层可见性
view.on('change:resolution', () => {
  const zoom = view.getZoom();

  // 缩放级别不同时显示不同图层
  if (zoom < 6) {
    // 全国范围：显示省界
    provinceLayer.setVisible(true);
    cityLayer.setVisible(false);
  } else if (zoom < 10) {
    // 城市范围：显示市界
    provinceLayer.setVisible(false);
    cityLayer.setVisible(true);
  } else {
    // 街道范围：显示详细道路
    cityLayer.setVisible(true);
    roadLayer.setVisible(true);
  }
});

// 【示例 4】加载不同精度的数据
let loadTimeout;
view.on('change:resolution', () => {
  clearTimeout(loadTimeout);
  loadTimeout = setTimeout(() => {
    const zoom = view.getZoom();
    if (zoom >= 15) {
      // 放大时加载建筑物数据
      loadBuildingData();
    } else if (zoom >= 10) {
      // 中等缩放加载道路数据
      loadRoadData();
    } else {
      // 小缩放加载行政区划
      loadDistrictData();
    }
  }, 300);  // 防抖 300ms
});

// 【示例 5】限制最小/最大缩放级别显示
view.on('change:resolution', () => {
  const zoom = view.getZoom();
  if (zoom < 3) {
    alert('请放大查看详细内容');
  }
  if (zoom > 18) {
    alert('已达到最大缩放级别');
  }
});

// 【示例 6】记录缩放历史
const zoomHistory = [];
view.on('change:resolution', () => {
  zoomHistory.push({
    time: Date.now(),
    zoom: view.getZoom(),
    resolution: view.getResolution()
  });
  // 只保留最近 50 条
  if (zoomHistory.length > 50) {
    zoomHistory.shift();
  }
});

// 【示例 7】Vue 组件中使用
import {ref, onUnmounted} from 'vue';
const currentZoom = ref(5);

const resolutionListener = view.on('change:resolution', () => {
  currentZoom.value = view.getZoom();
});

onUnmounted(() => {
  view.un(resolutionListener);
});

// 【示例 8】React 组件中使用
import {useEffect, useState} from 'react';

function MapComponent() {
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    const key = view.on('change:resolution', () => {
      setZoom(view.getZoom());
    });
    return () => view.un(key);
  }, []);

  return <div>当前缩放：{zoom.toFixed(1)}</div>;
}

// 【何时触发 change:resolution】
// 1. 用户滚轮缩放
// 2. 用户双击放大
// 3. 调用 view.setZoom()
// 4. 调用 view.animate({zoom: ...})
// 5. 调用 view.fit()
// 6. 调用 view.setResolution()

// 【缩放级别参考】
// 0-2: 全球视图
// 3-5: 大洲/国家
// 6-9: 省份/区域
// 10-12: 城市
// 13-15: 街道/社区
// 16-18: 建筑物/详情`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'change:rotation',
    cn: '旋转变更事件',
    type: 'event',
    category: 'events',
    description: '当视图旋转角度改变时触发。',
    usage: `// ============================================
// change:rotation 事件使用示例
// ============================================
// 事件说明：当视图旋转角度改变时触发
// 触发时机：setRotation、animate 旋转、用户旋转操作
// 单位：弧度（radians），0=北方朝上，正值顺时针
// 应用：更新罗盘显示、旋转控件同步

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】监听旋转变化
view.on('change:rotation', () => {
  const rotation = view.getRotation();
  console.log('新旋转角度:', rotation, '弧度');
  console.log('新旋转角度:', rotation * 180 / Math.PI, '度');
});

// ============================================
// 【进阶用法】
// ============================================

// 【示例 2】更新罗盘显示
const compass = document.getElementById('compass');
view.on('change:rotation', () => {
  // 罗盘反向旋转，保持指向北方
  compass.style.transform = \`rotate(\${-view.getRotation()}rad)\`;
});

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】角度/弧度双向转换工具
function degreesToRadians(deg) {
  return deg * Math.PI / 180;
}

function radiansToDegrees(rad) {
  return rad * 180 / Math.PI;
}

view.on('change:rotation', () => {
  const rotation = view.getRotation();
  const degrees = radiansToDegrees(rotation);
  console.log('旋转角度:', degrees.toFixed(1) + '°');

  // 更新罗盘刻度
  compassNeedle.style.transform = \`rotate(\${degrees}deg)\`;
});

// 【示例 4】实现旋转控制按钮
function rotateToNorth() {
  view.animate({
    rotation: 0,
    duration: 500
  });
}

function rotateToEast() {
  view.animate({
    rotation: Math.PI / 2,  // 90 度
    duration: 500
  });
}

view.on('change:rotation', () => {
  // 高亮当前朝向的按钮
  updateCompassButtons(view.getRotation());
});

// 【示例 5】设备方向跟随（需要设备方向传感器）
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (event) => {
    // event.alpha: 设备绕 Z 轴旋转角度（0-360 度）
    const alpha = event.alpha;
    if (alpha !== null) {
      // 将地图旋转至与设备方向一致
      view.setRotation(degreesToRadians(alpha));
    }
  });
}

view.on('change:rotation', () => {
  // 显示当前是否跟随设备方向
  const isFollowing = checkIfFollowingDevice();
  console.log('设备方向跟随:', isFollowing ? '开启' : '关闭');
});

// 【示例 6】限制旋转角度（如只能旋转 90 度的倍数）
view.on('change:rotation', () => {
  const rotation = view.getRotation();
  const degrees = radiansToDegrees(rotation) % 360;

  // 显示当前象限
  if (degrees >= -45 && degrees < 45) {
    console.log('朝向：北方');
  } else if (degrees >= 45 && degrees < 135) {
    console.log('朝向：东方');
  } else if (degrees >= 135 || degrees < -135) {
    console.log('朝向：南方');
  } else {
    console.log('朝向：西方');
  }
});

// 【示例 7】Vue 组件中使用
import {ref, onUnmounted} from 'vue';
const currentRotation = ref(0);

const rotationListener = view.on('change:rotation', () => {
  currentRotation.value = view.getRotation();
});

onUnmounted(() => {
  view.un(rotationListener);
});

// 【示例 8】React 组件中使用
import {useEffect, useState} from 'react';

function MapComponent() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const key = view.on('change:rotation', () => {
      setRotation(view.getRotation());
    });
    return () => view.un(key);
  }, []);

  const degrees = (rotation * 180 / Math.PI).toFixed(1);
  return <div>旋转角度：{degrees}°</div>;
}

// 【何时触发 change:rotation】
// 1. 调用 view.setRotation()
// 2. 调用 view.animate({rotation: ...})
// 3. 用户使用旋转控件
// 4. 设备方向变化（如果实现了跟随）

// 【常用旋转角度对照】
// 0          = 0°   = 北方朝上（默认）
// Math.PI/6  ≈ 30°  = 东北偏北
// Math.PI/4  = 45°  = 东北方向
// Math.PI/2  = 90°  = 东方朝上
// Math.PI    = 180° = 南方朝上
// -Math.PI/2 = -90° = 西方朝上`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'error',
    cn: '错误事件',
    type: 'event',
    category: 'events',
    description: '当视图发生错误时触发。',
    usage: `// ============================================
// error 事件使用示例
// ============================================
// 事件说明：当视图发生错误时触发
// 触发时机：渲染错误、投影转换错误、数据加载错误等
// 应用：错误监控、日志记录、用户提示

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】监听错误
view.on('error', (event) => {
  console.error('视图错误:', event);
  // event 包含错误信息
});

// ============================================
// 【进阶用法】
// ============================================

// 【示例 2】记录错误日志
const errorLog = [];
view.on('error', (event) => {
  errorLog.push({
    time: new Date(),
    error: event,
    center: view.getCenter(),
    zoom: view.getZoom()
  });
  // 只保留最近 100 条错误
  if (errorLog.length > 100) {
    errorLog.shift();
  }
});

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 3】错误上报到服务器
view.on('error', async (event) => {
  try {
    await fetch('/api/log-error', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        error: event,
        viewState: {
          center: view.getCenter(),
          zoom: view.getZoom(),
          rotation: view.getRotation()
        },
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    });
  } catch (e) {
    console.error('错误上报失败:', e);
  }
});

// 【示例 4】用户友好提示
view.on('error', (event) => {
  // 根据错误类型显示不同提示
  if (event.message?.includes('projection')) {
    alert('地图投影配置错误，请刷新页面重试');
  } else if (event.message?.includes('render')) {
    alert('地图渲染出现问题，正在尝试恢复...');
    // 尝试恢复
    view.changed();
  } else {
    console.error('未知错误:', event);
  }
});

// 【示例 5】Vue 组件中错误处理
import {ref} from 'vue';
const hasError = ref(false);
const errorMessage = ref('');

view.on('error', (event) => {
  hasError.value = true;
  errorMessage.value = event.message || '视图发生错误';

  // 3 秒后自动清除错误状态
  setTimeout(() => {
    hasError.value = false;
  }, 3000);
});

// 【示例 6】React 组件中错误处理
import {useState, useEffect} from 'react';

function MapComponent() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const key = view.on('error', (event) => {
      setError(event.message || '地图错误');
      // 5 秒后自动清除
      setTimeout(() => setError(null), 5000);
    });
    return () => view.un(key);
  }, []);

  if (error) {
    return <div className="error-banner">{error}</div>;
  }
  return <div>地图内容...</div>;
}

// 【示例 7】错误分类处理
view.on('error', (event) => {
  const errorType = event.type || 'unknown';

  switch(errorType) {
    case 'render':
      console.warn('渲染错误:', event);
      // 尝试重新渲染
      view.changed();
      break;
    case 'projection':
      console.error('投影错误:', event);
      // 投影错误通常需要重新配置
      break;
    case 'tile':
      console.warn('瓦片加载错误:', event);
      // 瓦片错误可能是网络问题，可重试
      break;
    default:
      console.error('未知错误类型:', event);
  }
});

// 【常见错误类型】
// 1. 渲染错误：WebGL 不支持、显卡驱动问题
// 2. 投影错误：坐标转换失败、投影未定义
// 3. 瓦片错误：网络问题、瓦片源不可用
// 4. 数据错误：GeoJSON 格式错误、数据解析失败`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'propertychange',
    cn: '属性变更事件',
    type: 'event',
    category: 'events',
    description: '当视图的自定义属性改变时触发。继承自 BaseObject。',
    usage: `// ============================================
// propertychange 事件使用示例
// ============================================
// 事件说明：当视图的自定义属性改变时触发
// 触发时机：调用 view.set()、view.setProperties() 时
// 注意：只响应自定义属性，不响应 center/zoom 等内置属性
// 应用：响应配置变化、数据绑定、状态同步

// ============================================
// 【基础用法】
// ============================================

// 【示例 1】监听自定义属性变化
view.on('propertychange', (event) => {
  console.log('属性变更:', event.key, '=', view.get(event.key));
  // event.key: 变化的属性名
  // event.value: 新的属性值
});

// 【示例 2】设置属性触发事件
view.set('myKey', 'myValue');  // 触发 propertychange 事件
console.log(view.get('myKey'));  // 输出：'myValue'

// ============================================
// 【进阶用法】
// ============================================

// 【示例 3】监听特定属性变化
view.on('propertychange', (event) => {
  switch(event.key) {
    case 'theme':
      console.log('主题变化:', view.get('theme'));
      applyTheme(view.get('theme'));
      break;
    case 'language':
      console.log('语言变化:', view.get('language'));
      changeLanguage(view.get('language'));
      break;
    case 'showLabels':
      console.log('标签显示:', view.get('showLabels'));
      labelLayer.setVisible(view.get('showLabels'));
      break;
  }
});

// ============================================
// 【实际应用场景】
// ============================================

// 【示例 4】Vue 组件中响应配置变化
import {ref, watch} from 'vue';

const theme = ref('light');
const listenerKey = view.on('propertychange', (event) => {
  if (event.key === 'theme') {
    theme.value = view.get('theme');
  }
});

// 或者使用 watch 监听 view 属性
watch(() => view.get('theme'), (newVal) => {
  console.log('主题变为:', newVal);
});

// 【示例 5】React 组件中响应配置变化
import {useState, useEffect} from 'react';

function MapComponent() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const key = view.on('propertychange', (event) => {
      if (event.key === 'theme') {
        setTheme(view.get('theme'));
      }
    });
    return () => view.un(key);
  }, []);

  return <div>当前主题：{theme}</div>;
}

// 【示例 6】批量设置属性（只触发一次事件）
view.on('propertychange', (event) => {
  console.log(\`属性 "\${event.key}" 变更为 "\${view.get(event.key)}"\`);
});

// setProperties 会触发一次 propertychange 事件
view.setProperties({
  theme: 'dark',
  language: 'zh-CN',
  showScale: true
});
// 注意：这里只触发一次事件，event.key 是最后一个属性

// 【示例 7】实现配置中心
const configManager = {
  init() {
    view.on('propertychange', (event) => {
      // 自动保存到 localStorage
      this.saveToStorage(event.key, view.get(event.key));
    });
  },

  saveToStorage(key, value) {
    try {
      localStorage.setItem('view_' + key, JSON.stringify(value));
    } catch (e) {
      console.error('保存失败:', e);
    }
  },

  loadFromStorage() {
    const config = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('view_')) {
        config[key.replace('view_', '')] = JSON.parse(localStorage.getItem(key));
      }
    }
    view.setProperties(config);
  }
};

configManager.init();
configManager.loadFromStorage();

// 【示例 8】属性变更验证
view.on('propertychange', (event) => {
  const value = view.get(event.key);

  // 验证属性值
  if (event.key === 'zoomLevel' && (value < 0 || value > 22)) {
    console.warn('缩放级别必须在 0-22 之间');
    // 可以这里修正值或触发恢复
  }

  if (event.key === 'theme' && !['light', 'dark', 'auto'].includes(value)) {
    console.warn('主题必须是 light/dark/auto 之一');
  }
});

// 【propertychange vs 特定事件】
// propertychange: 响应自定义属性（通过 set 设置的）
// change:center: 响应内置属性 center 变化
// change:resolution: 响应内置属性 resolution 变化
// change:rotation: 响应内置属性 rotation 变化

// 【何时触发 propertychange】
// 1. view.set('key', 'value')
// 2. view.setProperties({key: 'value'})
// 3. view.unset('key')（删除属性时也触发）

// 【不触发的情况】
// 1. view.setCenter() - 触发 change:center
// 2. view.setZoom() - 触发 change:resolution
// 3. view.setRotation() - 触发 change:rotation`,
    returns: { type: 'ObjectEvent', description: '包含 key 和 value 的事件对象' }
  }
]

// 初始化分类统计
const updateCategories = () => {
  const cats = {
    all: { name: 'all', cn: '全部', count: viewApis.length },
    members: { name: 'members', cn: 'Members', count: 0 },
    methods: { name: 'methods', cn: 'Methods', count: 0 },
    events: { name: 'events', cn: 'Events', count: 0 }
  }

  viewApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })

  categories.value = Object.values(cats)
}

updateCategories()

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') {
    return viewApis
  }
  return viewApis.filter(api => api.category === currentCategory.value)
})

const getTagType = (type) => {
  const typeMap = {
    'method': 'primary',
    'property': 'success',
    'event': 'warning',
    'class': 'danger'
  }
  return typeMap[type] || 'info'
}

const filterByCategory = (category) => {
  currentCategory.value = category
  // 切换到新分类时展开第一个
  if (filteredApis.value.length > 0) {
    activeNames.value = [filteredApis.value[0].name]
  }
}

// 计算是否全部展开
const isAllExpanded = computed(() => {
  if (filteredApis.value.length === 0) return false
  return activeNames.value.length === filteredApis.value.length
})

// 切换展开/收起状态
const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = filteredApis.value.map(api => api.name)
  }
}
</script>

<style lang="scss" scoped>
.api-page-container {
  padding: 24px;
  min-height: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

// ========== 页面头部样式优化 ==========
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 28px 32px;
  background: linear-gradient(135deg, #ffffff 0%, #fafcff 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.12);
  border: 1px solid rgba(102, 126, 234, 0.08);

  .title-section {
    flex: 1;

    h2 {
      margin: 0 0 14px 0;
      background: linear-gradient(90deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .description {
      margin: 0 0 18px 0;
      color: #64748b;
      font-size: 15px;
      line-height: 1.9;
      font-weight: 400;
    }

    .official-links {
      display: flex;
      gap: 12px;

      .el-link {
        .el-icon {
          margin-right: 4px;
        }
      }
    }
  }

  .control-section {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
    margin-left: 20px;
  }
}

// ========== API 分类标签优化 ==========
.api-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  .category-tag {
    cursor: pointer;
    padding: 8px 18px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    &.is-active {
      border-color: #667eea;
    }
  }
}

// ========== API 列表样式优化 ==========
.api-list {
  :deep(.el-collapse) {
    border-top: none;
    border-bottom: none;
    background: transparent;
  }

  :deep(.el-collapse-item__header) {
    padding: 18px 24px;
    font-size: 15px;
    color: #2d3748;
    background: linear-gradient(135deg, #ffffff 0%, #fafcff 100%);
    border-radius: 12px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid #e2e8f0;
    cursor: pointer;

    &:hover {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.12);
      border-color: #cbd5e1;
      transform: translateY(-2px);
    }

    &.is-active {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.05));
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    .el-collapse-item__arrow {
      color: #94a3b8;
      transition: transform 0.3s ease;
    }
  }

  :deep(.el-collapse-item__content) {
    padding-top: 0;
  }
}

.api-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  .api-title-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .api-name {
    font-weight: 700;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    background: linear-gradient(90deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 17px;
    letter-spacing: 0.3px;
  }

  .api-cn {
    color: #64748b;
    font-weight: 400;
    font-size: 14px;
  }

  .demo-btn-inline {
    margin-left: auto;
    padding: 5px 12px;
    font-size: 12px;
    height: 30px;
    border-radius: 6px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: white;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    transition: all 0.25s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .el-icon {
      margin-right: 4px;
    }
  }
}

.api-content {
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 0 0 12px 12px;
  border: 1px solid #e2e8f0;
  border-top: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

// API 区块通用样式
.api-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

// 区块标题样式
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .section-icon {
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h4 {
    margin: 0;
    color: #303133;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
}

// 参数说明区块 - 蓝色系
.params-section {
  .section-icon {
    color: #409eff;
  }

  h4 {
    color: #409eff;
  }

  .api-table {
    margin-top: 8px;
    background: white;
    border-radius: 4px;
    overflow: hidden;

    // 隐藏表格占位符（避免 inline-block 占位）
    :deep(.el-table__placeholder) {
      display: none !important;
    }

    // 表格单元格垂直居中
    :deep(.el-table__cell) {
      vertical-align: middle;
    }

    // 参数名列单元格内容垂直居中
    :deep(.el-table .cell) {
      display: flex;
      align-items: center;
      min-height: 40px;
    }
  }
}

// 功能说明区块 - 绿色系
.description-section {
  .section-icon {
    color: #67c23a;
  }

  h4 {
    color: #67c23a;
  }

  .description-text {
    color: #606266;
    font-size: 14px;
    line-height: 1.8;
    margin: 0;
    padding: 12px 16px;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #67c23a;
  }
}

// 使用示例区块 - 橙色系
.usage-section {
  .section-icon {
    color: #e6a23c;
  }

  h4 {
    color: #e6a23c;
  }

  .code-block {
    margin: 0;
    background: #282c34;
    border-radius: 8px;
    padding: 20px;
    overflow-x: auto;
    border: 1px solid #e4e7ed;

    code {
      color: #abb2bf;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre;
    }
  }
}

// 返回值区块 - 成功绿色系
.returns-section {
  .section-icon {
    color: #67c23a;
  }

  h4 {
    color: #67c23a;
  }

  .returns-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #67c23a;

    .return-type-tag {
      font-family: 'Consolas', 'Monaco', monospace;
      font-weight: 600;
    }

    .returns-desc {
      color: #606266;
      font-size: 14px;
      line-height: 1.6;
    }
  }
}

.param-name {
  background: #f0f9ff;
  color: #0284c7;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}

.default-value {
  color: #67c23a;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}

// 子参数展开区域样式
.children-params {
  padding: 10px 16px;
  background: #f5f7fa;
  border-radius: 4px;

  .children-table {
    background: white;
    border-radius: 4px;
    overflow: hidden;

    .child-param-name {
      background: #fdf6ec;
      color: #e6a23c;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
    }
  }
}

// 页面布局样式
.api-page-container {
  position: relative;
}

.page-layout {
  margin-right: 440px;
}

.demo-panel-wrapper {
  position: fixed;
  top: 80px;  // 避开顶部栏高度 (60px) + 20px 间距
  right: 20px;
  width: 400px;
  z-index: 100;
}

// 响应式布局
@media (max-width: 1400px) {
  .page-layout {
    margin-right: 0;
    padding-bottom: 20px;
  }

  .demo-panel-wrapper {
    position: static;
    width: 100%;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .page-layout {
    margin-right: 0;
  }

  .demo-panel-wrapper {
    width: 100%;
  }
}
</style>
