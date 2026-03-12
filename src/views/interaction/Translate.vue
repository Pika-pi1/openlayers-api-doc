<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>Translate - 平移交互 API</h2>
            <p class="description">
              OpenLayers Translate 交互用于平移（移动）地图上的要素。用户可以通过拖拽来移动选中的要素，
              支持单个要素移动和多个要素同时移动。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-Translate.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? translateApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: translateApis.length },
    { name: 'constructor', cn: '构造函数', count: translateApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: translateApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: translateApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return translateApis
  if (currentCategory.value === 'constructor') return translateApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return translateApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return translateApis.filter(a => a.type === 'event')
  return translateApis
})

const translateApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 Translate 交互实例，用于通过拖拽移动地图上的要素。支持单要素移动和多要素同时移动。',
    usage: `import Translate from 'ol/interaction/Translate.js';

// 创建简单平移交互
const translate = new Translate({
  layers: [vectorLayer]
});

map.addInteraction(translate);

// 完整配置示例
const translate = new Translate({
  layers: [layer1, layer2],
  features: selectedFeatures,
  condition: always,
  hitTolerance: 5,
  filter: (feature, layer) => {
    return feature.get('movable') !== false;
  }
});

// 使用要素集合（与 Select 配合）
const selectedFeatures = new Collection();
const select = new Select();
const translate = new Translate({
  features: selectedFeatures
});

select.on('select', (e) => {
  // 更新选中的要素
  selectedFeatures.clear();
  e.selected.forEach(f => selectedFeatures.push(f));
});

// 只平移特定图层
const translate = new Translate({
  layers: (layer) => {
    return layer.get('name') === 'editable';
  }
});

// 监听平移事件
translate.on('translatestart', (e) => {
  console.log('开始平移');
});

translate.on('translating', (e) => {
  console.log('正在平移');
});

translate.on('translateend', (e) => {
  console.log('平移完成');
});`,
    params: [
      { name: 'condition', type: 'Condition', default: 'always', description: '触发平移的条件函数，接收 MapBrowserEvent 返回布尔值' },
      { name: 'features', type: 'Collection<Feature>', default: undefined, description: '可被平移的要素集合' },
      { name: 'layers', type: 'Array<Layer>|Function', default: undefined, description: '可平移的图层列表或过滤函数' },
      { name: 'filter', type: 'FilterFunction', default: undefined, description: '过滤函数，决定哪些要素可被平移' },
      { name: 'hitTolerance', type: 'number', default: '0', description: '平移容差（像素），在此半径内的要素都可以被拖拽' }
    ],
    returns: { type: 'Translate', description: '新的 Translate 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'getActive',
    cn: '获取激活状态',
    type: 'method',
    category: 'methods',
    description: '返回交互是否当前处于激活状态。',
    usage: `// 检查是否激活
if (translate.getActive()) {
  console.log('平移交互已激活');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = translate.getActive();
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
    usage: `// 停用平移
translate.setActive(false);

// 激活平移
translate.setActive(true);

// 切换状态
translate.setActive(!translate.getActive());

// 典型用法：工具栏切换
toggleButton.onClick(() => {
  translate.setActive(!translate.getActive());
  updateButtonState();
});`,
    params: [
      { name: 'active', type: 'boolean', default: undefined, description: 'true 为激活，false 为停用' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'getHitTolerance',
    cn: '获取容差',
    type: 'method',
    category: 'methods',
    description: '返回当前平移交互的点击容差（像素）。',
    usage: `// 获取当前容差
const tolerance = translate.getHitTolerance();
console.log('当前容差:', tolerance, '像素');

// 典型用法：显示当前设置
function showSettings() {
  const tolerance = translate.getHitTolerance();
  tooltip.setText('平移容差：' + tolerance + 'px');
}`,
    params: [],
    returns: { type: 'number', description: '容差值（像素）' }
  },

  {
    name: 'setHitTolerance',
    cn: '设置容差',
    type: 'method',
    category: 'methods',
    description: '设置平移交互的点击容差。容差越大，越容易选中附近的要素进行拖拽。',
    usage: `// 设置容差为 10 像素
translate.setHitTolerance(10);

// 根据缩放级别动态调整
map.on('moveend', () => {
  const zoom = map.getView().getZoom();
  const tolerance = zoom > 15 ? 5 : 15;
  translate.setHitTolerance(tolerance);
});

// 典型用法：设置面板
toleranceSlider.onChange((value) => {
  translate.setHitTolerance(parseInt(value));
});`,
    params: [
      { name: 'hitTolerance', type: 'number', default: undefined, description: '容差值（像素）' }
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
const map = translate.getMap();

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
const count = translate.getPointerCount();
console.log('当前指针数量:', count);

// 典型用法：多点触控检测
if (translate.getPointerCount() > 1) {
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
class CustomTranslate extends Translate {
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
    name: 'translatestart',
    cn: '平移开始事件',
    type: 'event',
    category: 'events',
    description: '当开始平移要素时触发。可用于记录初始位置或显示编辑提示。',
    usage: `translate.on('translatestart', (event) => {
  console.log('开始平移');

  // 获取被平移的要素
  const features = event.features;

  // 保存原始位置（用于撤销）
  features.forEach(f => {
    const geometry = f.getGeometry();
    f.set('originalCoordinates', geometry.getCoordinates());
  });

  // 显示提示
  showTooltip('拖拽移动要素，松开鼠标完成');

  // 高亮被移动的要素
  features.forEach(f => highlightFeature(f));
});

// 获取事件详情
translate.on('translatestart', (e) => {
  console.log('要素数量:', e.features.getLength());
  console.log('触发事件:', e.mapBrowserEvent);
});`,
    params: [
      { name: 'features', type: 'Collection<Feature>', description: '被平移的要素集合' },
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'translating',
    cn: '平移中事件',
    type: 'event',
    category: 'events',
    description: '当要素正在平移时触发。可用于实时更新坐标显示或碰撞检测。',
    usage: `translate.on('translating', (event) => {
  // 获取被平移的要素
  const features = event.features;

  // 实时更新坐标显示
  features.forEach(f => {
    const geometry = f.getGeometry();
    const coord = geometry.getCoordinates();
    updateCoordinateDisplay(coord);
  });

  // 碰撞检测
  if (checkCollision(features)) {
    showWarning('检测到碰撞');
  }
});

// 典型用法：拖动时显示新位置
translate.on('translating', (e) => {
  const feature = e.features.item(0);
  const coord = feature.getGeometry().getCoordinates();
  coordinateLabel.setText(formatCoordinate(coord));
});`,
    params: [
      { name: 'features', type: 'Collection<Feature>', description: '被平移的要素集合' },
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'translateend',
    cn: '平移结束事件',
    type: 'event',
    category: 'events',
    description: '当平移完成时触发。这是最常用的事件，用于保存平移后的位置。',
    usage: `translate.on('translateend', (event) => {
  console.log('平移完成');

  // 获取被平移的要素
  const features = event.features;

  // 保存到服务器
  features.forEach(f => {
    const geometry = f.getGeometry();
    console.log('新位置:', geometry.getCoordinates());

    // 清除临时数据
    f.unset('originalCoordinates');

    // 发送更新
    saveFeature(f);
  });

  // 清除高亮
  features.forEach(f => unhighlightFeature(f));

  // 显示成功提示
  showTooltip('位置已更新');
});

// 典型用法：撤销功能
let undoStack = [];
translate.on('translateend', (e) => {
  undoStack.push({
    features: e.features.getArray(),
    type: 'translate'
  });
});`,
    params: [
      { name: 'features', type: 'Collection<Feature>', description: '被平移的要素集合' },
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'change:active',
    cn: '激活状态变化事件',
    type: 'event',
    category: 'events',
    description: '当交互的激活状态改变时触发。',
    usage: `translate.on('change:active', () => {
  const isActive = translate.getActive();
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
