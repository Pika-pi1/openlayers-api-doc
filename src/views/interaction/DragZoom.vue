<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>DragZoom - 拖拽缩放交互 API</h2>
            <p class="description">
              OpenLayers DragZoom 交互允许用户通过拖拽矩形框来缩放地图。
              通常与 Shift 键配合使用，支持放大和缩小两种模式。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_DragZoom-DragZoom.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? dragZoomApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: dragZoomApis.length },
    { name: 'constructor', cn: '构造函数', count: dragZoomApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: dragZoomApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: dragZoomApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return dragZoomApis
  if (currentCategory.value === 'constructor') return dragZoomApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return dragZoomApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return dragZoomApis.filter(a => a.type === 'event')
  return dragZoomApis
})

const dragZoomApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 DragZoom 交互实例，用于通过拖拽矩形框来缩放地图。默认情况下需要按住 Shift 键触发。',
    usage: `import DragZoom from 'ol/interaction/DragZoom.js';
import {shiftKeyOnly, altKeyOnly} from 'ol/events/condition.js';

// 创建简单拖拽缩放交互（默认 Shift+ 拖拽）
const dragZoom = new DragZoom();

map.addInteraction(dragZoom);

// 完整配置示例
const dragZoom = new DragZoom({
  className: 'my-dragzoom',
  condition: shiftKeyOnly,
  duration: 200,
  out: false,
  minArea: 64
});

// 自定义样式（通过 CSS）
// CSS: .my-dragzoom {
//   border: 2px solid #0f0;
//   background-color: rgba(0, 255, 0, 0.2);
// }

// Alt+ 拖拽缩小
const dragZoomOut = new DragZoom({
  condition: altKeyOnly,
  out: true
});

// 同时添加放大和缩小
const dragZoomIn = new DragZoom({
  condition: shiftKeyOnly,
  out: false
});

const dragZoomOut = new DragZoom({
  condition: ctrlKeyOnly,
  out: true
});

map.addInteraction(dragZoomIn);
map.addInteraction(dragZoomOut);

// 禁用动画（即时缩放）
const dragZoomInstant = new DragZoom({
  duration: 0
});

// 监听事件
dragZoom.on('boxend', () => {
  console.log('拖拽缩放完成');
  const extent = dragZoom.getGeometry().getExtent();
  console.log('缩放范围:', extent);
});`,
    params: [
      { name: 'className', type: 'string', default: "'ol-dragzoom'", description: '拖拽框的 CSS 类名，用于自定义样式' },
      { name: 'condition', type: 'Condition', default: 'shiftKeyOnly', description: '触发拖拽缩放的条件函数' },
      { name: 'duration', type: 'number', default: '200', description: '动画持续时间（毫秒），0 表示禁用动画' },
      { name: 'out', type: 'boolean', default: 'false', description: 'true 表示缩小到框选范围，false 表示放大到框选范围' },
      { name: 'minArea', type: 'number', default: '64', description: '最小框选面积（像素），小于此值不触发缩放' }
    ],
    returns: { type: 'DragZoom', description: '新的 DragZoom 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'getActive',
    cn: '获取激活状态',
    type: 'method',
    category: 'methods',
    description: '返回交互是否当前处于激活状态。',
    usage: `// 检查是否激活
if (dragZoom.getActive()) {
  console.log('拖拽缩放交互已激活');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = dragZoom.getActive();
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
    usage: `// 停用拖拽缩放
dragZoom.setActive(false);

// 激活拖拽缩放
dragZoom.setActive(true);

// 切换状态
dragZoom.setActive(!dragZoom.getActive());

// 典型用法：工具栏切换
toggleButton.onClick(() => {
  dragZoom.setActive(!dragZoom.getActive());
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
dragZoom.on('boxend', () => {
  const geometry = dragZoom.getGeometry();
  console.log('框选范围:', geometry);

  // 获取范围
  const extent = geometry.getExtent();
  console.log('范围坐标:', extent);

  // 手动处理缩放
  // map.getView().fit(extent, { duration: 300 });
});

// 典型用法：显示框选信息
dragZoom.on('boxend', () => {
  const extent = dragZoom.getGeometry().getExtent();
  const width = extent[2] - extent[0];
  const height = extent[3] - extent[1];
  showInfo('框选范围：' + width.toFixed(2) + ' x ' + height.toFixed(2));
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
const map = dragZoom.getMap();

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
const count = dragZoom.getPointerCount();
console.log('当前指针数量:', count);`,
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
class CustomDragZoom extends DragZoom {
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
    usage: `dragZoom.on('boxstart', (event) => {
  console.log('开始拖拽缩放');

  // 显示提示
  const mode = dragZoomOut ? '缩小' : '放大';
  showTooltip('拖拽绘制' + mode + '范围');
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
    description: '当拖拽框正在绘制时触发。',
    usage: `dragZoom.on('boxdrag', (event) => {
  // 实时更新框选信息
  const geometry = dragZoom.getGeometry();
  const extent = geometry.getExtent();
  updateBoxInfo(extent);
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
    description: '当拖拽框绘制完成时触发，地图会自动缩放到框选范围。',
    usage: `dragZoom.on('boxend', (event) => {
  console.log('拖拽缩放完成');

  // 获取框选范围
  const geometry = dragZoom.getGeometry();
  const extent = geometry.getExtent();

  // 记录缩放历史
  zoomHistory.push({
    extent: extent,
    zoom: map.getView().getZoom(),
    time: Date.now()
  });

  // 显示缩放信息
  showZoomInfo(extent);
});

// 典型用法：缩放后回调
dragZoom.on('boxend', () => {
  setTimeout(() => {
    console.log('当前缩放级别:', map.getView().getZoom());
  }, 200); // 等待动画完成
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
    usage: `dragZoom.on('boxcancel', (event) => {
  console.log('拖拽已取消');

  // 显示提示
  showTooltip('框选面积过小，已取消缩放');
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
    usage: `dragZoom.on('change:active', () => {
  const isActive = dragZoom.getActive();
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
