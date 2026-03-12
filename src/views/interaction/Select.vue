<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>Select - 选择交互 API</h2>
            <p class="description">
              OpenLayers Select 交互用于选择矢量要素。支持单击选择、多选、框选等多种选择方式，
              选中的要素会以指定样式高亮显示。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-Select.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? selectApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: selectApis.length },
    { name: 'constructor', cn: '构造函数', count: selectApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: selectApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: selectApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return selectApis
  if (currentCategory.value === 'constructor') return selectApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return selectApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return selectApis.filter(a => a.type === 'event')
  return selectApis
})

const selectApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 Select 交互实例，用于选择地图上的矢量要素。可以配置选择条件、样式、图层过滤等。',
    usage: `import Select from 'ol/interaction/Select.js';
import {click, pointerMove, shiftKeyOnly} from 'ol/events/condition.js';

// 创建简单选择交互（单击选择）
const select = new Select({
  layers: [vectorLayer]
});

map.addInteraction(select);

// 完整配置示例
const select = new Select({
  condition: click,
  addCondition: shiftKeyOnly,
  removeCondition: never,
  toggleCondition: shiftKeyOnly,
  multi: false,
  features: selectedFeatures,
  style: selectStyle,
  hitTolerance: 5,
  filter: (feature, layer) => {
    return feature.get('selectable') !== false;
  }
});

// 鼠标悬停选择
const selectHover = new Select({
  condition: pointerMove,
  hitTolerance: 10
});

// 限制选择特定图层
const select = new Select({
  layers: [layer1, layer2],
  // 或使用过滤函数
  // layers: (layer) => layer.get('selectable')
});

// 使用自定义要素集合存储选中要素
const selectedFeatures = new Collection();
const select = new Select({
  features: selectedFeatures
});

// 监听选择变化
select.on('select', (e) => {
  console.log('选中的要素:', e.selected);
  console.log('取消选择的要素:', e.deselected);
});`,
    params: [
      { name: 'addCondition', type: 'Condition', default: 'never', description: '添加要素到选择集的条件函数' },
      { name: 'condition', type: 'Condition', default: 'singleClick', description: '选择要素的主要条件函数' },
      { name: 'layers', type: 'Array<Layer>|Function', default: '所有可见图层', description: '可选择的图层列表或过滤函数' },
      { name: 'style', type: 'StyleLike|null', default: '默认编辑样式', description: '选中要素的样式，null 表示不改变样式' },
      { name: 'removeCondition', type: 'Condition', default: 'never', description: '从选择集中移除要素的条件函数' },
      { name: 'toggleCondition', type: 'Condition', default: 'shiftKeyOnly', description: '切换要素选择状态的条件函数' },
      { name: 'multi', type: 'boolean', default: 'false', description: '是否允许多选（框选时选择所有要素）' },
      { name: 'features', type: 'Collection<Feature>', default: '新集合', description: '存储选中要素的集合' },
      { name: 'filter', type: 'FilterFunction', default: undefined, description: '过滤函数，决定哪些要素可被选择' },
      { name: 'hitTolerance', type: 'number', default: '0', description: '选择容差（像素），在此半径内的要素都会被选中' }
    ],
    returns: { type: 'Select', description: '新的 Select 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'clearSelection',
    cn: '清除选择',
    type: 'method',
    category: 'methods',
    description: '清除所有选中的要素，就像用户取消选择一样。会触发 select 事件。',
    usage: `// 清除所有选择
select.clearSelection();

// 典型用法：工具栏按钮
clearButton.onClick(() => {
  select.clearSelection();
  updateSelectionInfo();
});

// 与直接清空集合的区别：
// select.getFeatures().clear() - 不会触发 select 事件
// select.clearSelection() - 会触发 select 事件`,
    params: [],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'deselectFeature',
    cn: '取消选择要素',
    type: 'method',
    category: 'methods',
    description: '取消选择指定要素，就像用户点击取消选择一样。会触发 select 事件。',
    usage: `// 获取要取消选择的要素
const feature = vectorSource.getFeatureById('feature1');

// 取消选择
const success = select.deselectFeature(feature);

if (success) {
  console.log('已成功取消选择');
}

// 典型用法：右键菜单
contextMenu.on('deselect', (e) => {
  const feature = getFeatureAt(e.coordinate);
  select.deselectFeature(feature);
});`,
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要取消选择的要素' }
    ],
    returns: { type: 'boolean', description: 'true 表示成功取消选择，false 表示要素不在选择集中' }
  },

  {
    name: 'selectFeature',
    cn: '选择要素',
    type: 'method',
    category: 'methods',
    description: '选择指定要素，就像用户点击选择一样。会触发 select 事件。',
    usage: `// 获取要选择的要素
const feature = vectorSource.getFeatureById('feature1');

// 选择要素
const success = select.selectFeature(feature);

if (success) {
  console.log('已成功选择要素');
}

// 典型用法：程序化选择
function selectById(id) {
  const feature = vectorSource.getFeatureById(id);
  if (feature) {
    select.selectFeature(feature);
  }
}

// 选择多个要素
features.forEach(f => select.selectFeature(f));`,
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要选择的要素' }
    ],
    returns: { type: 'boolean', description: 'true 表示成功选择，false 表示选择失败' }
  },

  {
    name: 'toggleFeature',
    cn: '切换要素选择',
    type: 'method',
    category: 'methods',
    description: '切换要素的选择状态。如果已选择则取消选择，如果未选择则选中。',
    usage: `// 切换要素选择状态
const feature = vectorSource.getFeatureById('feature1');
select.toggleFeature(feature);

// 典型用法：列表点击选择
featureList.on('click', (e) => {
  const feature = getFeatureById(e.data.id);
  select.toggleFeature(feature);
  updateHighlight();
});`,
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要切换选择状态的要素' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'getFeatures',
    cn: '获取选中要素',
    type: 'method',
    category: 'methods',
    description: '获取当前选中的要素集合。返回的是一个 Collection，可以遍历或监听变化。',
    usage: `// 获取选中要素集合
const features = select.getFeatures();

// 遍历选中的要素
features.forEach(f => {
  console.log('要素 ID:', f.getId());
});

// 获取选中要素数量
const count = features.getLength();
console.log('已选择', count, '个要素');

// 监听选择变化
features.on('add', (e) => {
  console.log('新增选中要素:', e.element);
});

features.on('remove', (e) => {
  console.log('移除选中要素:', e.element);
});

// 转换为数组
const featureArray = features.getArray();`,
    params: [],
    returns: { type: 'Collection<Feature>', description: '选中要素的集合' }
  },

  {
    name: 'getActive',
    cn: '获取激活状态',
    type: 'method',
    category: 'methods',
    description: '返回交互是否当前处于激活状态。',
    usage: `// 检查是否激活
if (select.getActive()) {
  console.log('选择交互已激活');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = select.getActive();
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
    description: '激活或停用交互。停用后交互将不再响应选择事件。',
    usage: `// 停用选择
select.setActive(false);

// 激活选择
select.setActive(true);

// 切换状态
select.setActive(!select.getActive());

// 典型用法：工具栏切换
toggleButton.onClick(() => {
  select.setActive(!select.getActive());
  updateButtonState();
});`,
    params: [
      { name: 'active', type: 'boolean', default: undefined, description: 'true 为激活，false 为停用' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'getHitTolerance',
    cn: '获取选择容差',
    type: 'method',
    category: 'methods',
    description: '返回当前选择交互的点击容差（像素）。',
    usage: `// 获取当前容差
const tolerance = select.getHitTolerance();
console.log('当前容差:', tolerance, '像素');

// 典型用法：显示当前设置
function showSettings() {
  const tolerance = select.getHitTolerance();
  tooltip.setText('选择容差：' + tolerance + 'px');
}`,
    params: [],
    returns: { type: 'number', description: '容差值（像素）' }
  },

  {
    name: 'setHitTolerance',
    cn: '设置选择容差',
    type: 'method',
    category: 'methods',
    description: '设置选择交互的点击容差。容差越大，越容易选中附近的要素。',
    usage: `// 设置容差为 10 像素
select.setHitTolerance(10);

// 根据缩放级别动态调整
map.on('moveend', () => {
  const zoom = map.getView().getZoom();
  const tolerance = zoom > 15 ? 5 : 15;
  select.setHitTolerance(tolerance);
});

// 典型用法：设置面板
toleranceSlider.onChange((value) => {
  select.setHitTolerance(parseInt(value));
});`,
    params: [
      { name: 'hitTolerance', type: 'number', default: undefined, description: '容差值（像素）' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'getLayer',
    cn: '获取要素所在图层',
    type: 'method',
    category: 'methods',
    description: '返回选中要素关联的矢量图层。',
    usage: `// 获取第一个选中要素的图层
const features = select.getFeatures();
if (features.getLength() > 0) {
  const feature = features.item(0);
  const layer = select.getLayer(feature);
  console.log('要素所在图层:', layer.get('name'));
}

// 典型用法：多图层选择时识别来源
select.on('select', (e) => {
  e.selected.forEach(feature => {
    const layer = select.getLayer(feature);
    console.log('选中要素来自图层:', layer.get('name'));
  });
});`,
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要查询的要素' }
    ],
    returns: { type: 'VectorLayer', description: '要素所在的矢量图层' }
  },

  {
    name: 'getMap',
    cn: '获取地图',
    type: 'method',
    category: 'methods',
    description: '获取与此交互关联的地图对象。',
    usage: `// 获取地图
const map = select.getMap();

if (map) {
  console.log('当前地图:', map);
}`,
    params: [],
    returns: { type: 'Map|null', description: '地图对象，未关联时返回 null' }
  },

  {
    name: 'setMap',
    cn: '设置地图',
    type: 'method',
    category: 'methods',
    description: '设置或移除此交互关联的地图。通常在内部调用。',
    usage: `// 添加到地图时自动调用
map.addInteraction(select);

// 从地图移除时自动调用
map.removeInteraction(select);

// 手动设置（不推荐直接使用）
// select.setMap(map);`,
    params: [
      { name: 'map', type: 'Map', default: undefined, description: '要关联的地图，null 表示移除' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  // ========== Events (事件) ==========
  {
    name: 'select',
    cn: '选择事件',
    type: 'event',
    category: 'events',
    description: '当要素被选中或取消选中时触发。这是 Select 交互最重要的事件。',
    usage: `select.on('select', (event) => {
  console.log('选择变化');

  // 获取新增选中的要素
  const selected = event.selected;
  selected.forEach(f => {
    console.log('选中:', f.getId());
  });

  // 获取取消选中的要素
  const deselected = event.deselected;
  deselected.forEach(f => {
    console.log('取消选中:', f.getId());
  });

  // 获取所有选中的要素
  const allSelected = select.getFeatures();
  console.log('当前选中数量:', allSelected.getLength());

  // 更新属性面板
  if (selected.length > 0) {
    showPropertiesPanel(selected[0]);
  }
});

// 获取事件详情
select.on('select', (e) => {
  const feature = e.selected[0];
  const layer = select.getLayer(feature);
  const originalEvent = e.mapBrowserEvent; // 原始浏览器事件
});`,
    params: [
      { name: 'selected', type: 'Array<Feature>', description: '新增选中的要素列表' },
      { name: 'deselected', type: 'Array<Feature>', description: '取消选中的要素列表' },
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'change:active',
    cn: '激活状态变化事件',
    type: 'event',
    category: 'events',
    description: '当交互的激活状态改变时触发。',
    usage: `select.on('change:active', () => {
  const isActive = select.getActive();
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
