<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>Draw - 绘制交互 API</h2>
            <p class="description">
              OpenLayers Draw 交互用于在地图上绘制几何图形。支持绘制点、线、面、圆等多种几何类型，
              并提供自由手绘、自动捕捉、追踪等高级功能。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw-Draw.html" target="_blank">
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
                        <span v-if="scope.row.default !== undefined" class="default-value">{{ scope.row.default }}</span>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 默认展开第一个
const activeNames = ref(['constructor'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

// 切换展开/收起
const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? drawApis.map(api => api.name) : []
}

// 按类别筛选
const filterByCategory = (category) => {
  currentCategory.value = category
}

// 获取标签类型
const getTagType = (type) => {
  const typeMap = {
    'class': 'danger',
    'method': 'primary',
    'event': 'warning',
    'property': 'success'
  }
  return typeMap[type] || 'info'
}

// API 类别统计
const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: drawApis.length },
    { name: 'constructor', cn: '构造函数', count: drawApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: drawApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: drawApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return drawApis
  if (currentCategory.value === 'constructor') return drawApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return drawApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return drawApis.filter(a => a.type === 'event')
  return drawApis
})

const drawApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 Draw 交互实例，用于在地图上绘制几何图形。通过配置选项可以指定绘制的几何类型、目标图层、样式等。',
    usage: `import Draw from 'ol/interaction/Draw.js';

// 创建简单绘制交互（绘制线）
const draw = new Draw({
  source: vectorSource,
  type: 'LineString'
});

map.addInteraction(draw);

// 绘制多边形
const drawPolygon = new Draw({
  source: vectorSource,
  type: 'Polygon',
  minPoints: 3
});

// 绘制点
const drawPoint = new Draw({
  source: vectorSource,
  type: 'Point'
});

// 绘制圆
const drawCircle = new Draw({
  source: vectorSource,
  type: 'Circle'
});

// 完整配置示例
const draw = new Draw({
  source: vectorSource,
  type: 'Polygon',
  clickTolerance: 6,
  dragVertexDelay: 500,
  snapTolerance: 12,
  stopClick: false,
  maxPoints: 10,
  minPoints: 3,
  style: drawStyle,
  geometryName: 'geom',
  condition: always,
  freehand: false,
  freehandCondition: shiftKeyOnly,
  trace: false,
  wrapX: false,
  geometryLayout: 'XY'
});`,
    params: [
      { name: 'type', type: 'GeometryType', default: undefined, description: '几何类型：Point、LineString、Polygon、Circle、MultiPoint、MultiLineString、MultiPolygon' },
      { name: 'clickTolerance', type: 'number', default: '6', description: '点击容差（像素），指针移动不超过此距离才视为点击' },
      { name: 'features', type: 'Collection<Feature>', default: undefined, description: '绘制要素的目标集合' },
      { name: 'source', type: 'VectorSource', default: undefined, description: '绘制要素的目标矢量源' },
      { name: 'dragVertexDelay', type: 'number', default: '500', description: '点击后顶点可拖动的延迟时间（毫秒）' },
      { name: 'snapTolerance', type: 'number', default: '12', description: '捕捉到绘制完成点的像素距离' },
      { name: 'stopClick', type: 'boolean', default: 'false', description: '是否阻止绘制期间的点击事件传播' },
      { name: 'maxPoints', type: 'number', default: undefined, description: '可绘制的最大点数，超过后自动完成' },
      { name: 'minPoints', type: 'number', default: '2 或 3', description: '完成绘制所需的最小点数（线为 2，面为 3）' },
      { name: 'finishCondition', type: 'Function', default: undefined, description: '自定义完成条件函数，返回 true 表示完成绘制' },
      { name: 'style', type: 'StyleLike', default: undefined, description: '草图要素的样式' },
      { name: 'geometryFunction', type: 'Function', default: undefined, description: '几何坐标更新时的回调函数' },
      { name: 'geometryName', type: 'string', default: undefined, description: '创建要素的几何名称' },
      { name: 'condition', type: 'Condition', default: 'always', description: '触发绘制的事件条件函数' },
      { name: 'freehand', type: 'boolean', default: 'false', description: '是否启用自由手绘模式' },
      { name: 'freehandCondition', type: 'Condition', default: undefined, description: '激活自由手绘的条件函数' },
      { name: 'trace', type: 'boolean', default: 'false', description: '是否启用追踪其他几何的部分' },
      { name: 'traceSource', type: 'VectorSource', default: undefined, description: '要追踪的要素源' },
      { name: 'wrapX', type: 'boolean', default: 'false', description: '是否在水平方向环绕世界' },
      { name: 'geometryLayout', type: 'string', default: "'XY'", description: '创建几何的布局：XY、XYZ、XYM、XYZM' }
    ],
    returns: { type: 'Draw', description: '新的 Draw 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'abortDrawing',
    cn: '中止绘制',
    type: 'method',
    category: 'methods',
    description: '中止当前绘制，不将草图要素添加到目标图层。调用后当前绘制的草图将被丢弃。',
    usage: `// 中止当前绘制
draw.abortDrawing();

// 典型用法：按 ESC 键中止绘制
map.on('keydown', (e) => {
  if (e.key === 'Escape') {
    draw.abortDrawing();
  }
});`,
    params: [],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'appendCoordinates',
    cn: '追加坐标',
    type: 'method',
    category: 'methods',
    description: '向当前正在绘制的几何末尾追加坐标数组。可用于编程方式添加点。',
    usage: `// 追加单个坐标
draw.appendCoordinates([[116.4, 39.9]]);

// 追加多个坐标（用于线或面）
draw.appendCoordinates([
  [116.4, 39.9],
  [116.5, 39.9],
  [116.5, 40.0]
]);

// 注意：坐标格式取决于几何类型
// Point: [x, y]
// LineString: [[x1, y1], [x2, y2], ...]
// Polygon: [[[x1, y1], [x2, y2], ...]]`,
    params: [
      { name: 'coordinates', type: 'Array<Coordinate>', default: undefined, description: '要追加的坐标数组' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'extend',
    cn: '扩展绘制',
    type: 'method',
    category: 'methods',
    description: '从现有几何开始绘制，用于向已有几何添加顶点。调用后会进入绘制模式，从该几何的最后一个点继续。',
    usage: `// 扩展已有的线
const feature = vectorSource.getFeatureById('line1');
draw.extend(feature);

// 扩展后，用户可以继续添加点
// 完成后调用 finishDrawing()

// 典型用法：编辑模式下添加顶点
function editFeature(feature) {
  draw.extend(feature);
  // 用户继续绘制...
}`,
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要扩展的要素' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'finishDrawing',
    cn: '完成绘制',
    type: 'method',
    category: 'methods',
    description: '停止绘制并将草图要素添加到目标图层。调用后会触发 drawend 事件。',
    usage: `// 完成当前绘制
const feature = draw.finishDrawing();

// 典型用法：按 Enter 键完成绘制
map.on('keydown', (e) => {
  if (e.key === 'Enter') {
    draw.finishDrawing();
  }
});

// 获取绘制的要素
draw.on('drawend', (e) => {
  console.log('绘制的要素:', e.feature);
});`,
    params: [],
    returns: { type: 'Feature', description: '绘制的要素' }
  },

  {
    name: 'removeLastPoint',
    cn: '删除最后一点',
    type: 'method',
    category: 'methods',
    description: '移除当前绘制要素的最后一个点。用于撤销上一步操作。',
    usage: `// 删除最后一个点
draw.removeLastPoint();

// 典型用法：按 Backspace 键撤销
map.on('keydown', (e) => {
  if (e.key === 'Backspace') {
    draw.removeLastPoint();
  }
});

// 或者右键菜单撤销
contextMenu.on('undo', () => {
  draw.removeLastPoint();
});`,
    params: [],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'setActive',
    cn: '设置激活状态',
    type: 'method',
    category: 'methods',
    description: '激活或停用交互。停用后交互将不再响应事件。',
    usage: `// 停用绘制
draw.setActive(false);

// 激活绘制
draw.setActive(true);

// 切换状态
draw.setActive(!draw.getActive());

// 典型用法：工具栏按钮切换
const toggleDraw = () => {
  const isActive = draw.getActive();
  draw.setActive(!isActive);
  updateButtonState(!isActive);
};`,
    params: [
      { name: 'active', type: 'boolean', default: undefined, description: 'true 为激活，false 为停用' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'getActive',
    cn: '获取激活状态',
    type: 'method',
    category: 'methods',
    description: '返回交互是否当前处于激活状态。',
    usage: `// 检查是否激活
if (draw.getActive()) {
  console.log('绘制交互已激活');
} else {
  console.log('绘制交互已停用');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = draw.getActive();
  button.setText(isActive ? '停止绘制' : '开始绘制');
}`,
    params: [],
    returns: { type: 'boolean', description: 'true 表示激活，false 表示停用' }
  },

  {
    name: 'setFreehand',
    cn: '设置自由手绘',
    type: 'method',
    category: 'methods',
    description: '设置是否启用自由手绘模式。自由手绘模式下，移动指针时会连续绘制。',
    usage: `// 启用自由手绘
draw.setFreehand(true);

// 停用自由手绘
draw.setFreehand(false);

// 根据条件切换
const isFreehand = someCondition;
draw.setFreehand(isFreehand);`,
    params: [
      { name: 'freehand', type: 'boolean', default: undefined, description: 'true 启用自由手绘，false 停用' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'getFreehand',
    cn: '获取自由手绘状态',
    type: 'method',
    category: 'methods',
    description: '返回当前是否处于自由手绘模式。',
    usage: `// 检查自由手绘状态
if (draw.getFreehand()) {
  console.log('当前为自由手绘模式');
}`,
    params: [],
    returns: { type: 'boolean', description: 'true 表示自由手绘模式' }
  },

  {
    name: 'getOverlay',
    cn: '获取覆盖层',
    type: 'method',
    category: 'methods',
    description: '获取绘制交互用于渲染草图要素的覆盖层。可用于自定义草图样式。',
    usage: `// 获取覆盖层
const overlay = draw.getOverlay();

// 设置草图样式
overlay.setStyle(sketchStyle);

// 获取覆盖层的源
const source = overlay.getSource();
console.log('草图要素数量:', source.getFeatures().length);`,
    params: [],
    returns: { type: 'VectorLayer', description: '草图覆盖层' }
  },

  {
    name: 'handleEvent',
    cn: '处理事件',
    type: 'method',
    category: 'methods',
    description: '处理地图浏览器事件，可能会实际绘制或完成绘制。由内部调用，通常不需要直接使用。',
    usage: `// 通常由内部调用
// 子类可能需要重写此方法

// 示例：子类扩展
class CustomDraw extends Draw {
  handleEvent(event) {
    // 自定义事件处理
    console.log('处理事件:', event.type);
    // 调用父类方法
    return super.handleEvent(event);
  }
}`,
    params: [
      { name: 'event', type: 'MapBrowserEvent', default: undefined, description: '地图浏览器事件' }
    ],
    returns: { type: 'boolean', description: 'false 阻止事件传播' }
  },

  {
    name: 'getMap',
    cn: '获取地图',
    type: 'method',
    category: 'methods',
    description: '获取与此交互关联的地图对象。',
    usage: `// 获取地图
const map = draw.getMap();

if (map) {
  console.log('当前地图:', map);
}`,
    params: [],
    returns: { type: 'Map|null', description: '地图对象，未关联时返回 null' }
  },

  // ========== Events (事件) ==========
  {
    name: 'drawstart',
    cn: '绘制开始事件',
    type: 'event',
    category: 'events',
    description: '当开始绘制新要素时触发。可用于初始化或显示提示信息。',
    usage: `draw.on('drawstart', (event) => {
  console.log('开始绘制');

  // 获取草图要素
  const sketch = event.feature;

  // 显示提示
  showTooltip('点击地图添加点，双击完成');

  // 禁用其他交互
  otherInteraction.setActive(false);
});`,
    params: [
      { name: 'feature', type: 'Feature', description: '正在绘制的草图要素' }
    ]
  },

  {
    name: 'drawend',
    cn: '绘制结束事件',
    type: 'event',
    category: 'events',
    description: '当绘制完成并添加要素到图层时触发。这是最常用的事件，用于处理绘制完成的要素。',
    usage: `draw.on('drawend', (event) => {
  console.log('绘制完成');

  // 获取绘制的要素
  const feature = event.feature;

  // 获取几何
  const geometry = feature.getGeometry();
  console.log('几何类型:', geometry.getType());

  // 添加属性
  feature.set('name', '新要素');
  feature.set('createTime', new Date());

  // 发送到服务器
  saveToServer(feature);

  // 恢复其他交互
  otherInteraction.setActive(true);
});`,
    params: [
      { name: 'feature', type: 'Feature', description: '绘制完成的要素' }
    ]
  },

  {
    name: 'drawabort',
    cn: '绘制中止事件',
    type: 'event',
    category: 'events',
    description: '当绘制被中止时触发（如用户按 ESC 键）。',
    usage: `draw.on('drawabort', (event) => {
  console.log('绘制已中止');

  // 清理状态
  clearSelection();

  // 显示提示
  showTooltip('绘制已取消');
});`,
    params: [
      { name: 'feature', type: 'Feature', description: '被中止的草图要素' }
    ]
  },

  {
    name: 'change:active',
    cn: '激活状态变化事件',
    type: 'event',
    category: 'events',
    description: '当交互的激活状态改变时触发。',
    usage: `draw.on('change:active', () => {
  const isActive = draw.getActive();
  console.log('激活状态:', isActive);

  // 更新 UI
  updateToolbar(isActive);
});`,
    params: []
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
  max-width: 1400px;
  margin: 0 auto;
}

.doc-content {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;

  .title-section {
    h2 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 28px;
    }

    .description {
      color: #606266;
      font-size: 14px;
      line-height: 1.8;
      margin: 0 0 12px 0;
    }

    .official-links {
      display: flex;
      gap: 12px;
    }
  }

  .control-section {
    display: flex;
    gap: 12px;
  }
}

.api-categories {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  .category-tag {
    cursor: pointer;
    padding: 6px 16px;
    font-size: 14px;
    transition: all 0.3s;

    &:hover {
      opacity: 0.8;
    }
  }
}

.api-list {
  :deep(.el-collapse-item__header) {
    padding: 16px 20px;
    font-size: 15px;
    color: #303133;
    transition: all 0.3s;

    &:hover {
      background-color: #f5f7fa;
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
      gap: 12px;

      .api-name {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 16px;
        color: #409eff;
        font-weight: 600;
      }

      .api-cn {
        color: #606266;
        font-size: 14px;
      }
    }
  }
}

.api-content {
  padding: 16px 20px 20px 20px;

  .api-section {
    margin-bottom: 24px;

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;

      h4 {
        margin: 0;
        color: #303133;
        font-size: 15px;
        font-weight: 600;
      }

      .section-icon {
        font-size: 18px;
        color: #409eff;

        &.params-icon { color: #e6a23c; }
        &.description-icon { color: #67c23a; }
        &.usage-icon { color: #409eff; }
        &.returns-icon { color: #909399; }
      }
    }

    &.params-section {
      .api-table {
        :deep(.el-table__header th) {
          background-color: #fafafa;
          color: #606266;
          font-weight: 600;
        }

        .param-name {
          font-family: 'Consolas', 'Monaco', monospace;
          color: #e83e8c;
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .default-value {
          font-family: 'Consolas', 'Monaco', monospace;
          color: #28a745;
        }
      }
    }

    &.description-section {
      .description-text {
        color: #606266;
        line-height: 1.8;
        margin: 0;
      }
    }

    &.usage-section {
      .code-block {
        margin: 0;
        padding: 16px;
        background: #282c34;
        border-radius: 6px;
        overflow-x: auto;

        code {
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 13px;
          color: #abb2bf;
          line-height: 1.6;
          white-space: pre;
        }
      }
    }

    &.returns-section {
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
  }
}
</style>
