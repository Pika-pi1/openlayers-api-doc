<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>DragBox - 拖拽框交互 API</h2>
            <p class="description">
              OpenLayers DragBox 交互允许用户通过点击并拖拽在地图上绘制一个矩形框。
              通常与选择、缩放等功能结合使用，支持自定义触发条件和样式。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_DragBox-DragBox.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? dragBoxApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: dragBoxApis.length },
    { name: 'constructor', cn: '构造函数', count: dragBoxApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: dragBoxApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: dragBoxApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return dragBoxApis
  if (currentCategory.value === 'constructor') return dragBoxApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return dragBoxApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return dragBoxApis.filter(a => a.type === 'event')
  return dragBoxApis
})

const dragBoxApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 DragBox 交互实例，用于在地图上绘制矩形选择框。可以通过条件函数控制触发时机。',
    usage: `import DragBox from 'ol/interaction/DragBox.js';
import {shiftKeyOnly, mouseActionButton} from 'ol/events/condition.js';

// 创建简单拖拽框交互
const dragBox = new DragBox({
  condition: shiftKeyOnly
});

map.addInteraction(dragBox);

// 完整配置示例
const dragBox = new DragBox({
  className: 'my-drag-box',
  condition: shiftKeyOnly,
  minArea: 100,
  boxEndCondition: null,
  onBoxEnd: null
});

// 自定义样式（通过 CSS）
// CSS: .my-drag-box {
//   border: 2px solid #00f;
//   background-color: rgba(0, 0, 255, 0.2);
// }

// 右键拖拽框
const dragBoxRight = new DragBox({
  condition: (event) => {
    return event.originalEvent.button === 2; // 右键
  }
});

// 监听事件
dragBox.on('boxstart', (e) => {
  console.log('开始拖拽框');
});

dragBox.on('boxdrag', (e) => {
  console.log('拖拽中');
});

dragBox.on('boxend', (e) => {
  const geometry = dragBox.getGeometry();
  console.log('拖拽结束，框选范围:', geometry);
});

dragBox.on('boxcancel', (e) => {
  console.log('拖拽已取消');
});`,
    params: [
      { name: 'className', type: 'string', default: "'ol-dragbox'", description: '拖拽框的 CSS 类名，用于自定义样式' },
      { name: 'condition', type: 'Condition', default: 'mouseActionButton', description: '触发拖拽框的条件函数' },
      { name: 'minArea', type: 'number', default: '64', description: '最小框选面积（像素），小于此值不触发 boxend' },
      { name: 'boxEndCondition', type: 'EndCondition', default: undefined, description: '自定义框选结束条件函数' },
      { name: 'onBoxEnd', type: 'Function', default: undefined, description: 'boxend 事件触发前执行的回调函数' }
    ],
    returns: { type: 'DragBox', description: '新的 DragBox 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'getActive',
    cn: '获取激活状态',
    type: 'method',
    category: 'methods',
    description: '返回交互是否当前处于激活状态。',
    usage: `// 检查是否激活
if (dragBox.getActive()) {
  console.log('拖拽框交互已激活');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = dragBox.getActive();
  toggleButton.setChecked(isActive);
}`,
    params: [],
    returns: { type: 'boolean', description: 'true 表示激活，false 表示停用' }
  },

  {
    name: 'setActive',
    cn: '设置激活状态',
    type: 'method',
    category: 'methods',
    description: '激活或停用交互。停用后交互将不再响应拖拽事件。',
    usage: `// 停用拖拽框
dragBox.setActive(false);

// 激活拖拽框
dragBox.setActive(true);

// 切换状态
dragBox.setActive(!dragBox.getActive());

// 典型用法：工具栏切换
toggleButton.onClick(() => {
  dragBox.setActive(!dragBox.getActive());
  updateButtonState();
});`,
    params: [
      { name: 'active', type: 'boolean', default: undefined, description: 'true 为激活，false 为停用' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'getGeometry',
    cn: '获取几何',
    type: 'method',
    category: 'methods',
    description: '返回最后一次绘制的拖拽框的几何形状（Polygon 类型）。',
    usage: `// 获取拖拽框几何
dragBox.on('boxend', () => {
  const geometry = dragBox.getGeometry();
  console.log('框选范围:', geometry);

  // 获取坐标
  const coordinates = geometry.getCoordinates();
  console.log('坐标:', coordinates);

  // 获取范围
  const extent = geometry.getExtent();
  console.log('范围:', extent);

  // 使用范围选择要素
  const features = vectorSource.getFeaturesInExtent(extent);
  console.log('选中的要素:', features);
});

// 典型用法：框选缩放
dragBox.on('boxend', () => {
  const geometry = dragBox.getGeometry();
  const extent = geometry.getExtent();
  map.getView().fit(extent, { duration: 300 });
});`,
    params: [],
    returns: { type: 'Polygon', description: '拖拽框的几何形状' }
  },

  {
    name: 'getMap',
    cn: '获取地图',
    type: 'method',
    category: 'methods',
    description: '获取与此交互关联的地图对象。',
    usage: `// 获取地图
const map = dragBox.getMap();

if (map) {
  console.log('当前地图:', map);
}`,
    params: [],
    returns: { type: 'Map|null', description: '地图对象，未关联时返回 null' }
  },

  {
    name: 'getPointerCount',
    cn: '获取指针数量',
    type: 'method',
    category: 'methods',
    description: '返回当前参与交互的指针数量。用于触摸设备支持。',
    usage: `// 获取指针数量
const count = dragBox.getPointerCount();
console.log('当前指针数量:', count);

// 典型用法：多点触控检测
if (dragBox.getPointerCount() > 1) {
  console.log('多点触控模式');
}`,
    params: [],
    returns: { type: 'number', description: '指针数量' }
  },

  {
    name: 'handleEvent',
    cn: '处理事件',
    type: 'method',
    category: 'methods',
    description: '处理地图浏览器事件。由内部调用，通常不需要直接使用。',
    usage: `// 通常由内部调用
// 子类可能需要重写此方法

// 示例：子类扩展
class CustomDragBox extends DragBox {
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

  // ========== Events (事件) ==========
  {
    name: 'boxstart',
    cn: '拖拽开始事件',
    type: 'event',
    category: 'events',
    description: '当开始绘制拖拽框时触发。',
    usage: `dragBox.on('boxstart', (event) => {
  console.log('开始拖拽框');

  // 获取起始坐标
  const coordinate = event.coordinate;
  console.log('起始坐标:', coordinate);

  // 显示提示
  showTooltip('拖拽绘制选择框');

  // 禁用其他交互
  otherInteraction.setActive(false);
});`,
    params: [
      { name: 'coordinate', type: 'Coordinate', description: '拖拽起始坐标' },
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'boxdrag',
    cn: '拖拽中事件',
    type: 'event',
    category: 'events',
    description: '当拖拽框正在绘制时触发（拖动过程中持续触发）。',
    usage: `dragBox.on('boxdrag', (event) => {
  // 获取当前框选范围
  const geometry = dragBox.getGeometry();
  const extent = geometry.getExtent();

  // 实时更新面积显示
  const area = calculateArea(extent);
  updateAreaDisplay(area);

  // 高亮框选区域内的要素
  const features = vectorSource.getFeaturesInExtent(extent);
  highlightFeatures(features);
});`,
    params: [
      { name: 'coordinate', type: 'Coordinate', description: '当前坐标' },
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'boxend',
    cn: '拖拽结束事件',
    type: 'event',
    category: 'events',
    description: '当拖拽框绘制完成时触发。这是最常用的事件，用于处理框选结果。',
    usage: `dragBox.on('boxend', (event) => {
  console.log('拖拽结束');

  // 获取拖拽框几何
  const geometry = dragBox.getGeometry();
  const extent = geometry.getExtent();

  // 框选要素
  const features = vectorSource.getFeaturesInExtent(extent);
  console.log('框选了', features.length, '个要素');

  // 选中要素
  selectInteraction.getFeatures().clear();
  features.forEach(f => selectInteraction.getFeatures().push(f));

  // 缩放到框选范围
  map.getView().fit(extent, { duration: 300 });

  // 恢复其他交互
  otherInteraction.setActive(true);
});

// 典型用法：批量操作
dragBox.on('boxend', (e) => {
  const extent = dragBox.getGeometry().getExtent();
  const features = vectorSource.getFeaturesInExtent(extent);

  // 执行批量操作
  features.forEach(f => {
    f.set('selected', true);
  });

  // 发送批量更新
  batchUpdate(features);
});`,
    params: [
      { name: 'coordinate', type: 'Coordinate', description: '结束坐标' },
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'boxcancel',
    cn: '拖拽取消事件',
    type: 'event',
    category: 'events',
    description: '当拖拽框被取消时触发（如框选面积小于 minArea）。',
    usage: `dragBox.on('boxcancel', (event) => {
  console.log('拖拽已取消');

  // 清理状态
  clearHighlight();

  // 显示提示
  showTooltip('框选已取消（面积过小）');
});`,
    params: [
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'change:active',
    cn: '激活状态变化事件',
    type: 'event',
    category: 'events',
    description: '当交互的激活状态改变时触发。',
    usage: `dragBox.on('change:active', () => {
  const isActive = dragBox.getActive();
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
