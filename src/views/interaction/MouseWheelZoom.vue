<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>MouseWheelZoom - 鼠标滚轮缩放交互 API</h2>
            <p class="description">
              OpenLayers MouseWheelZoom 交互允许用户通过滚动鼠标滚轮来缩放地图。
              支持以鼠标位置为锚点进行缩放，可配置缩放速度和动画效果。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_MouseWheelZoom-MouseWheelZoom.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? mouseWheelZoomApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: mouseWheelZoomApis.length },
    { name: 'constructor', cn: '构造函数', count: mouseWheelZoomApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: mouseWheelZoomApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: mouseWheelZoomApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return mouseWheelZoomApis
  if (currentCategory.value === 'constructor') return mouseWheelZoomApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return mouseWheelZoomApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return mouseWheelZoomApis.filter(a => a.type === 'event')
  return mouseWheelZoomApis
})

const mouseWheelZoomApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 MouseWheelZoom 交互实例，用于通过鼠标滚轮缩放地图。支持以鼠标位置为锚点进行缩放。',
    usage: `import MouseWheelZoom from 'ol/interaction/MouseWheelZoom.js';
import {always} from 'ol/events/condition.js';

// 创建简单鼠标滚轮缩放交互（默认配置）
const mouseWheelZoom = new MouseWheelZoom();

map.addInteraction(mouseWheelZoom);

// 完整配置示例
const mouseWheelZoom = new MouseWheelZoom({
  condition: always,
  onFocusOnly: false,
  maxDelta: 1,
  duration: 250,
  timeout: 80,
  useAnchor: true,
  constrainResolution: false
});

// 禁用鼠标滚轮缩放
const mouseWheelZoomDisabled = new MouseWheelZoom({
  condition: never
});

// 只允许在聚焦时缩放
const mouseWheelZoomFocus = new MouseWheelZoom({
  onFocusOnly: true
});

// 禁用锚点缩放（始终以地图中心为锚点）
const mouseWheelZoomCenter = new MouseWheelZoom({
  useAnchor: false
});

// 强制缩放到整数级别
const mouseWheelZoomSnap = new MouseWheelZoom({
  constrainResolution: true
});

// 快速缩放（每次滚动缩放更多）
const mouseWheelZoomFast = new MouseWheelZoom({
  maxDelta: 3,
  duration: 100
});

// 禁用动画（即时缩放）
const mouseWheelZoomInstant = new MouseWheelZoom({
  duration: 0
});`,
    params: [
      { name: 'condition', type: 'Condition', default: 'always', description: '触发滚轮缩放的条件函数' },
      { name: 'onFocusOnly', type: 'boolean', default: 'false', description: '是否只在地图获得焦点时响应事件' },
      { name: 'maxDelta', type: 'number', default: '1', description: '最大鼠标滚轮增量，值越大缩放越快' },
      { name: 'duration', type: 'number', default: '250', description: '动画持续时间（毫秒），0 表示禁用动画' },
      { name: 'timeout', type: 'number', default: '80', description: '鼠标滚轮超时时间（毫秒），用于防抖' },
      { name: 'useAnchor', type: 'boolean', default: 'true', description: '是否以鼠标位置为缩放锚点' },
      { name: 'constrainResolution', type: 'boolean', default: 'false', description: '是否强制缩放到最近的整数级别' }
    ],
    returns: { type: 'MouseWheelZoom', description: '新的 MouseWheelZoom 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'getActive',
    cn: '获取激活状态',
    type: 'method',
    category: 'methods',
    description: '返回交互是否当前处于激活状态。',
    usage: `// 检查是否激活
if (mouseWheelZoom.getActive()) {
  console.log('鼠标滚轮缩放交互已激活');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = mouseWheelZoom.getActive();
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
    description: '激活或停用交互。停用后交互将不再响应滚轮事件。',
    usage: `// 停用鼠标滚轮缩放
mouseWheelZoom.setActive(false);

// 激活鼠标滚轮缩放
mouseWheelZoom.setActive(true);

// 切换状态
mouseWheelZoom.setActive(!mouseWheelZoom.getActive());

// 典型用法：工具栏切换
toggleButton.onClick(() => {
  mouseWheelZoom.setActive(!mouseWheelZoom.getActive());
  updateButtonState();
});

// 临时禁用（如绘图时）
function disableZoomTemporarily() {
  const wasActive = mouseWheelZoom.getActive();
  mouseWheelZoom.setActive(false);
  // ... 执行其他操作 ...
  mouseWheelZoom.setActive(wasActive);
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
const map = mouseWheelZoom.getMap();

if (map) {
  console.log('当前地图:', map);
}`,
    params: [],
    returns: { type: 'Map|null', description: '地图对象，未关联时返回 null' }
  },

  {
    name: 'setMouseAnchor',
    cn: '设置鼠标锚点',
    type: 'method',
    category: 'methods',
    description: '启用或禁用使用鼠标位置作为缩放锚点。启用后，缩放会以鼠标指针位置为中心。',
    usage: `// 启用鼠标锚点（默认）
mouseWheelZoom.setMouseAnchor(true);

// 禁用鼠标锚点（始终以地图中心缩放）
mouseWheelZoom.setMouseAnchor(false);

// 典型用法：设置面板
anchorCheckbox.onChange((checked) => {
  mouseWheelZoom.setMouseAnchor(checked);
  savePreference('mouseAnchor', checked);
});

// 根据模式切换
function setZoomMode(mode) {
  if (mode === 'center') {
    mouseWheelZoom.setMouseAnchor(false);
  } else {
    mouseWheelZoom.setMouseAnchor(true);
  }
}`,
    params: [
      { name: 'useAnchor', type: 'boolean', default: undefined, description: 'true 使用鼠标位置为锚点，false 使用地图中心' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  // ========== Events (事件) ==========
  {
    name: 'change:active',
    cn: '激活状态变化事件',
    type: 'event',
    category: 'events',
    description: '当交互的激活状态改变时触发。',
    usage: `mouseWheelZoom.on('change:active', () => {
  const isActive = mouseWheelZoom.getActive();
  console.log('激活状态:', isActive);

  // 更新 UI
  updateToolbar(isActive);
});

// 典型用法：状态保存
mouseWheelZoom.on('change:active', () => {
  savePreference('mouseWheelZoomActive', mouseWheelZoom.getActive());
});`,
    params: []
  },

  // ========== 配置说明 ==========
  {
    name: 'maxDelta',
    cn: '最大增量',
    type: 'property',
    category: 'properties',
    description: 'maxDelta 控制每次鼠标滚轮滚动的最大缩放级别变化。值越大，缩放速度越快。',
    usage: `// 慢速缩放（精细控制）
const slowZoom = new MouseWheelZoom({
  maxDelta: 0.5  // 每次最多缩放 0.5 级
});

// 正常缩放（默认）
const normalZoom = new MouseWheelZoom({
  maxDelta: 1  // 每次最多缩放 1 级
});

// 快速缩放
const fastZoom = new MouseWheelZoom({
  maxDelta: 3  // 每次最多缩放 3 级
});

// 注意：实际缩放还受 timeout 影响
// 连续快速滚动会累积缩放效果`,
    params: []
  },

  {
    name: 'duration',
    cn: '动画时长',
    type: 'property',
    category: 'properties',
    description: 'duration 控制缩放动画的持续时间。设置为 0 可以禁用动画，实现即时缩放。',
    usage: `// 禁用动画（即时缩放）
const instantZoom = new MouseWheelZoom({
  duration: 0
});

// 快速动画
const fastZoom = new MouseWheelZoom({
  duration: 100  // 100 毫秒
});

// 正常动画（默认）
const normalZoom = new MouseWheelZoom({
  duration: 250  // 250 毫秒
});

// 慢速平滑动画
const smoothZoom = new MouseWheelZoom({
  duration: 500  // 500 毫秒
});`,
    params: []
  },

  {
    name: 'constrainResolution',
    cn: '约束分辨率',
    type: 'property',
    category: 'properties',
    description: 'constrainResolution 控制缩放后是否自动吸附到最近的整数缩放级别。',
    usage: `// 允许任意缩放级别（默认）
const freeZoom = new MouseWheelZoom({
  constrainResolution: false
});
// 结果：可以停留在 5.3、7.8 等非整数级别

// 强制整数级别
const snapZoom = new MouseWheelZoom({
  constrainResolution: true
});
// 结果：自动吸附到 5、6、7 等整数级别

// 典型用途：
// - constrainResolution: false - 适合需要精细缩放的场景
// - constrainResolution: true - 适合瓦片地图，确保加载正确的瓦片级别`,
    params: []
  },

  {
    name: 'useAnchor',
    cn: '使用锚点',
    type: 'property',
    category: 'properties',
    description: 'useAnchor 控制是否以鼠标指针位置为缩放中心。启用后，缩放时鼠标指向的位置会保持在屏幕同一位置。',
    usage: `// 以鼠标位置为中心（默认，推荐）
const anchorZoom = new MouseWheelZoom({
  useAnchor: true
});
// 效果：放大时，鼠标指向的地点会保持在屏幕中央

// 以地图中心为中心
const centerZoom = new MouseWheelZoom({
  useAnchor: false
});
// 效果：无论鼠标在哪，缩放都以地图当前中心为准

// 典型用途：
// - useAnchor: true - 适合大多数场景，用户体验更好
// - useAnchor: false - 适合需要固定中心点的特殊场景`,
    params: []
  },

  {
    name: 'timeout',
    cn: '超时时间',
    type: 'property',
    category: 'properties',
    description: 'timeout 用于防抖，控制连续滚轮事件的时间间隔。较短的超时会使缩放更灵敏。',
    usage: `// 高灵敏度（快速响应）
const sensitiveZoom = new MouseWheelZoom({
  timeout: 50  // 50 毫秒
});

// 正常灵敏度（默认）
const normalZoom = new MouseWheelZoom({
  timeout: 80  // 80 毫秒
});

// 低灵敏度（防止误触）
const insensitiveZoom = new MouseWheelZoom({
  timeout: 200  // 200 毫秒
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
