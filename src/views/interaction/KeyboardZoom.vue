<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>KeyboardZoom - 键盘缩放交互 API</h2>
            <p class="description">
              OpenLayers KeyboardZoom 交互允许用户通过键盘的 + 和 - 键来缩放地图。
              此交互默认包含在地图中，但需要地图元素获得浏览器焦点才能使用。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_KeyboardZoom-KeyboardZoom.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? keyboardZoomApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: keyboardZoomApis.length },
    { name: 'constructor', cn: '构造函数', count: keyboardZoomApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: keyboardZoomApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: keyboardZoomApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return keyboardZoomApis
  if (currentCategory.value === 'constructor') return keyboardZoomApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return keyboardZoomApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return keyboardZoomApis.filter(a => a.type === 'event')
  return keyboardZoomApis
})

const keyboardZoomApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 KeyboardZoom 交互实例，用于通过键盘 + 和 - 键缩放地图。此交互默认包含在地图中。',
    usage: `import KeyboardZoom from 'ol/interaction/KeyboardZoom.js';

// 创建简单键盘缩放交互（默认配置）
const keyboardZoom = new KeyboardZoom();

map.addInteraction(keyboardZoom);

// 完整配置示例
const keyboardZoom = new KeyboardZoom({
  duration: 100,
  condition: (event) => {
    // 只处理 + 和 - 键
    const key = event.originalEvent.key;
    return key === '+' || key === '-' || key === '=';
  },
  delta: 1
});

// 快速缩放（每次按 2 级）
const keyboardZoomFast = new KeyboardZoom({
  duration: 50,
  delta: 2
});

// 禁用动画（即时缩放）
const keyboardZoomInstant = new KeyboardZoom({
  duration: 0
});

// 慢速平滑缩放
const keyboardZoomSmooth = new KeyboardZoom({
  duration: 300,
  delta: 1
});

// 自定义条件（例如只允许在 Ctrl 按下时）
const keyboardZoomCtrl = new KeyboardZoom({
  condition: (event) => {
    return event.originalEvent.ctrlKey;
  }
});`,
    params: [
      { name: 'duration', type: 'number', default: '100', description: '动画持续时间（毫秒），0 表示禁用动画' },
      { name: 'condition', type: 'Condition', default: undefined, description: '触发键盘缩放的条件函数' },
      { name: 'delta', type: 'number', default: '1', description: '每次按键的缩放级别变化量' }
    ],
    returns: { type: 'KeyboardZoom', description: '新的 KeyboardZoom 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'getActive',
    cn: '获取激活状态',
    type: 'method',
    category: 'methods',
    description: '返回交互是否当前处于激活状态。',
    usage: `// 检查是否激活
if (keyboardZoom.getActive()) {
  console.log('键盘缩放交互已激活');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = keyboardZoom.getActive();
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
    description: '激活或停用交互。停用后交互将不再响应键盘事件。',
    usage: `// 停用键盘缩放
keyboardZoom.setActive(false);

// 激活键盘缩放
keyboardZoom.setActive(true);

// 切换状态
keyboardZoom.setActive(!keyboardZoom.getActive());

// 典型用法：工具栏切换
toggleButton.onClick(() => {
  keyboardZoom.setActive(!keyboardZoom.getActive());
  updateButtonState();
});

// 临时禁用（如输入框聚焦时）
inputElement.on('focus', () => {
  keyboardZoom.setActive(false);
});

inputElement.on('blur', () => {
  keyboardZoom.setActive(true);
});`,
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
const map = keyboardZoom.getMap();

if (map) {
  console.log('当前地图:', map);
}`,
    params: [],
    returns: { type: 'Map|null', description: '地图对象，未关联时返回 null' }
  },

  // ========== Events (事件) ==========
  {
    name: 'change:active',
    cn: '激活状态变化事件',
    type: 'event',
    category: 'events',
    description: '当交互的激活状态改变时触发。',
    usage: `keyboardZoom.on('change:active', () => {
  const isActive = keyboardZoom.getActive();
  console.log('激活状态:', isActive);

  // 更新 UI
  updateToolbar(isActive);
});

// 典型用法：状态保存
keyboardZoom.on('change:active', () => {
  savePreference('keyboardZoomActive', keyboardZoom.getActive());
});`,
    params: []
  },

  // ========== 使用说明 ==========
  {
    name: 'usage',
    cn: '使用说明',
    type: 'info',
    category: 'info',
    description: 'KeyboardZoom 交互的使用说明和注意事项。',
    usage: `// ============================================
// 键盘缩放使用说明
// ============================================

// 【默认按键】
// + 或 = : 放大一级
// - : 缩小一级

// 【重要注意事项】
// 1. 键盘缩放需要地图元素获得浏览器焦点才能工作
// 2. 默认情况下，地图 div 需要设置 tabindex 属性
// 3. 可以通过 Map 的 keyboardEventTarget 选项改变焦点元素

// 【设置地图可聚焦】
// HTML:
// <div id="map" tabindex="0"></div>

// JavaScript:
const map = new Map({
  target: 'map',
  // ... 其他配置
  keyboardEventTarget: document.getElementById('map')
});

// 【自定义键盘事件目标】
// 例如让整个页面都能响应键盘缩放
const map = new Map({
  target: 'map',
  keyboardEventTarget: document // 整个页面
});

// 【禁用默认键盘缩放】
// 如果不想使用默认的键盘缩放
const map = new Map({
  target: 'map',
  interactions: [] // 不添加默认交互
  // 然后手动添加需要的交互
});

// 【添加自定义键盘缩放】
const map = new Map({
  target: 'map',
  interactions: defaultInteractions().extend([
    new KeyboardZoom({
      delta: 2,      // 每次缩放 2 级
      duration: 200  // 200ms 动画
    })
  ])
});

// 【辅助功能建议】
// 1. 确保地图元素可聚焦（设置 tabindex）
// 2. 添加视觉焦点指示器
// 3. 提供键盘快捷键提示
// CSS:
// #map:focus {
//   outline: 2px solid #409eff;
//   outline-offset: 2px;
// }`,
    params: []
  },

  // ========== delta 配置说明 ==========
  {
    name: 'delta',
    cn: '缩放增量',
    type: 'property',
    category: 'properties',
    description: 'delta 控制每次按键时缩放级别的变化量。正值放大，负值缩小。',
    usage: `// 精细缩放（每次 0.5 级）
const精细 Zoom = new KeyboardZoom({
  delta: 0.5
});

// 正常缩放（默认，每次 1 级）
const normalZoom = new KeyboardZoom({
  delta: 1
});

// 快速缩放（每次 2 级）
const fastZoom = new KeyboardZoom({
  delta: 2
});

// 大幅缩放（每次 3 级）
const hugeZoom = new KeyboardZoom({
  delta: 3
});

// 负数会反转按键行为（不推荐）
const reverseZoom = new KeyboardZoom({
  delta: -1  // + 缩小，- 放大
});`,
    params: []
  },

  // ========== duration 配置说明 ==========
  {
    name: 'duration',
    cn: '动画时长',
    type: 'property',
    category: 'properties',
    description: 'duration 控制缩放动画的持续时间。设置为 0 可以禁用动画，实现即时缩放。',
    usage: `// 禁用动画（即时缩放）
const instantZoom = new KeyboardZoom({
  duration: 0
});

// 快速动画（50ms）
const fastZoom = new KeyboardZoom({
  duration: 50
});

// 正常动画（默认，100ms）
const normalZoom = new KeyboardZoom({
  duration: 100
});

// 慢速平滑动画（300ms）
const smoothZoom = new KeyboardZoom({
  duration: 300
});

// 极慢动画（用于演示）
const demoZoom = new KeyboardZoom({
  duration: 1000
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
