<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>DragPan - 拖拽平移交互 API</h2>
            <p class="description">
              OpenLayers DragPan 交互允许用户通过拖拽来平移地图。这是地图最基本的导航交互之一，
              默认情况下已启用。支持动力学惯性效果，使平移更加流畅自然。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_DragPan-DragPan.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? dragPanApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: dragPanApis.length },
    { name: 'constructor', cn: '构造函数', count: dragPanApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: dragPanApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: dragPanApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return dragPanApis
  if (currentCategory.value === 'constructor') return dragPanApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return dragPanApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return dragPanApis.filter(a => a.type === 'event')
  return dragPanApis
})

const dragPanApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 DragPan 交互实例，用于通过拖拽平移地图。支持动力学惯性效果和焦点控制。',
    usage: `import DragPan from 'ol/interaction/DragPan.js';
import {always, shiftKeyOnly} from 'ol/events/condition.js';

// 创建简单拖拽平移交互（默认配置）
const dragPan = new DragPan();

map.addInteraction(dragPan);

// 完整配置示例
const dragPan = new DragPan({
  condition: always,
  onFocusOnly: false,
  kinetic: new Kinetic(-0.005, 0.05, 100)
});

// 仅当 Shift 键按下时允许拖拽平移
const dragPanShift = new DragPan({
  condition: shiftKeyOnly
});

// 禁用动力学惯性（即时停止）
const dragPanNoKinetic = new DragPan({
  kinetic: null
});

// 增强惯性效果
const dragPanSmooth = new DragPan({
  kinetic: new Kinetic(-0.002, 0.1, 200)
});

// 只在地图获得焦点时响应
const dragPanFocus = new DragPan({
  onFocusOnly: true
});

// 监听事件
dragPan.on('change:active', () => {
  console.log('激活状态变化');
});`,
    params: [
      { name: 'condition', type: 'Condition', default: 'noModifierKeys + primaryAction', description: '触发拖拽平移的条件函数' },
      { name: 'onFocusOnly', type: 'boolean', default: 'false', description: '是否只在地图获得焦点时响应事件' },
      { name: 'kinetic', type: 'Kinetic', default: 'new Kinetic(-0.005, 0.05, 100)', description: '动力学惯性配置，null 表示禁用惯性' }
    ],
    returns: { type: 'DragPan', description: '新的 DragPan 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'getActive',
    cn: '获取激活状态',
    type: 'method',
    category: 'methods',
    description: '返回交互是否当前处于激活状态。',
    usage: `// 检查是否激活
if (dragPan.getActive()) {
  console.log('拖拽平移交互已激活');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = dragPan.getActive();
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
    usage: `// 停用拖拽平移
dragPan.setActive(false);

// 激活拖拽平移
dragPan.setActive(true);

// 切换状态
dragPan.setActive(!dragPan.getActive());

// 典型用法：工具栏切换
toggleButton.onClick(() => {
  dragPan.setActive(!dragPan.getActive());
  updateButtonState();
});

// 临时禁用（如绘制时）
function disablePanTemporarily() {
  const wasActive = dragPan.getActive();
  dragPan.setActive(false);
  // ... 执行其他操作 ...
  dragPan.setActive(wasActive);
}`,
    params: [
      { name: 'active', type: 'boolean', default: undefined, description: 'true 为激活，false 为停用' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'getMap',
    cn: '获取地图',
    type: 'method',
    category: 'methods',
    description: '获取与此交互关联的地图对象。',
    usage: `// 获取地图
const map = dragPan.getMap();

if (map) {
  console.log('当前地图:', map);
}

// 典型用法：检查交互是否已添加到地图
function isAddedToMap() {
  return dragPan.getMap() !== null;
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
const count = dragPan.getPointerCount();
console.log('当前指针数量:', count);

// 典型用法：多点触控检测
if (dragPan.getPointerCount() > 1) {
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
class CustomDragPan extends DragPan {
  handleEvent(event) {
    // 自定义事件处理
    console.log('处理事件:', event.type);
    // 调用父类方法
    return super.handleEvent(event);
  }
}

// 注意：返回 false 会阻止事件传播给其他交互`,
    params: [
      { name: 'event', type: 'MapBrowserEvent', default: undefined, description: '地图浏览器事件' }
    ],
    returns: { type: 'boolean', description: 'false 阻止事件传播' }
  },

  // ========== Events (事件) ==========
  {
    name: 'change:active',
    cn: '激活状态变化事件',
    type: 'event',
    category: 'events',
    description: '当交互的激活状态改变时触发。',
    usage: `dragPan.on('change:active', () => {
  const isActive = dragPan.getActive();
  console.log('激活状态:', isActive);

  // 更新 UI
  updateToolbar(isActive);
});

// 典型用法：状态保存
dragPan.on('change:active', () => {
  savePreference('dragPanActive', dragPan.getActive());
});`,
    params: []
  },

  // ========== Kinetic (动力学配置) ==========
  {
    name: 'kinetic',
    cn: '动力学惯性',
    type: 'property',
    category: 'properties',
    description: '动力学惯性用于在拖拽结束后产生平滑的滑动效果。Kinetic 对象由三个参数定义：衰减率、加速度和最小速度。',
    usage: `// Kinetic 构造函数
// new Kinetic(decay, acceleration, minVelocity)

import Kinetic from 'ol/Kinetic.js';

// 默认配置
const defaultKinetic = new Kinetic(-0.005, 0.05, 100);

// 参数说明：
// - decay: 衰减率（负数），值越小减速越快
// - acceleration: 加速度，影响拖动时的速度累积
// - minVelocity: 最小速度，低于此值停止惯性

// 长惯性效果（滑动距离更长）
const longKinetic = new Kinetic(-0.002, 0.1, 50);

// 短惯性效果（快速停止）
const shortKinetic = new Kinetic(-0.01, 0.02, 150);

// 禁用惯性（即时停止）
const dragPan = new DragPan({
  kinetic: null
});

// 创建交互时设置
const dragPan = new DragPan({
  kinetic: new Kinetic(-0.003, 0.08, 80)
});`,
    params: [
      { name: 'decay', type: 'number', default: '-0.005', description: '衰减率，负数，绝对值越大减速越快' },
      { name: 'acceleration', type: 'number', default: '0.05', description: '加速度，影响速度累积' },
      { name: 'minVelocity', type: 'number', default: '100', description: '最小速度阈值，低于此值停止' }
    ]
  },

  // ========== 条件函数示例 ==========
  {
    name: 'condition',
    cn: '条件函数',
    type: 'property',
    category: 'properties',
    description: '条件函数决定何时允许拖拽平移。OpenLayers 提供多个预定义条件函数。',
    usage: `import {
  always,           // 总是允许
  never,            // 从不允许
  singleClick,      // 单击
  doubleClick,      // 双击
  click,            // 单击或双击
  pointerMove,      // 指针移动
  altKeyOnly,       // 仅 Alt 键按下
  ctrlKeyOnly,      // 仅 Ctrl 键按下
  shiftKeyOnly,     // 仅 Shift 键按下
  metaKeyOnly,      // 仅 Meta 键（Command/Windows）按下
  noModifierKeys,   // 无修饰键按下
  primaryAction,    // 主按钮（左键）
  mouseActionButton // 鼠标动作按钮
} from 'ol/events/condition.js';

// 只允许 Shift+ 拖拽
const dragPan = new DragPan({
  condition: shiftKeyOnly
});

// 组合条件
import {and, or} from 'ol/events/condition.js';

const dragPan = new DragPan({
  condition: and(noModifierKeys, primaryAction)
});

// 自定义条件
const dragPan = new DragPan({
  condition: (event) => {
    // 只在特定区域允许拖拽
    const coordinate = event.coordinate;
    return coordinate[0] > 0; // 只在东半球
  }
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
