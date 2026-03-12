<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>Modify - 修改交互 API</h2>
            <p class="description">
              OpenLayers Modify 交互用于修改要素的几何形状。支持拖拽顶点、添加新顶点、删除顶点等操作，
              是编辑矢量要素的核心工具。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify-Modify.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? modifyApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: modifyApis.length },
    { name: 'constructor', cn: '构造函数', count: modifyApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: modifyApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: modifyApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return modifyApis
  if (currentCategory.value === 'constructor') return modifyApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return modifyApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return modifyApis.filter(a => a.type === 'event')
  return modifyApis
})

const modifyApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 Modify 交互实例，用于修改要素的几何形状。可以配置源图层、样式、触发条件等。',
    usage: `import Modify from 'ol/interaction/Modify.js';

// 创建简单修改交互
const modify = new Modify({
  source: vectorSource
});

map.addInteraction(modify);

// 完整配置示例
const modify = new Modify({
  source: vectorSource,
  condition: primaryAction,
  deleteCondition: altKeyOnly,
  insertVertexCondition: always,
  pixelTolerance: 10,
  style: modifyStyle,
  features: featureCollection,
  filter: (feature, layer) => {
    return feature.get('editable') === true;
  },
  wrapX: false,
  snapToPointer: true
});

// 使用要素集合
const features = new Collection();
const modify = new Modify({
  features: features
});

// 多个源的情况
const modify = new Modify({
  source: source1
});
modify.addSource(source2);`,
    params: [
      { name: 'condition', type: 'Condition', default: 'primaryAction', description: '触发修改的条件函数，接收 MapBrowserEvent 返回布尔值' },
      { name: 'deleteCondition', type: 'Condition', default: 'altKeyOnly + singleClick', description: '删除顶点的条件函数' },
      { name: 'insertVertexCondition', type: 'Condition', default: 'always', description: '插入新顶点的条件函数' },
      { name: 'pixelTolerance', type: 'number', default: '10', description: '选择顶点的像素容差' },
      { name: 'style', type: 'StyleLike|FlatStyleLike', default: undefined, description: '修改交互的样式（顶点样式）' },
      { name: 'source', type: 'VectorSource', default: undefined, description: '要修改的要素的矢量源' },
      { name: 'features', type: 'Collection<Feature>', default: undefined, description: '要修改的要素集合' },
      { name: 'filter', type: 'FilterFunction', default: undefined, description: '过滤函数，决定哪些要素可被修改' },
      { name: 'wrapX', type: 'boolean', default: 'false', description: '是否在水平方向环绕世界' },
      { name: 'snapToPointer', type: 'boolean', default: '!hitDetection', description: '是否捕捉到指针位置' }
    ],
    returns: { type: 'Modify', description: '新的 Modify 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'canInsertPoint',
    cn: '检查可插入点',
    type: 'method',
    category: 'methods',
    description: '检查是否可以在当前线或面的指针位置插入点。用于判断当前状态下是否允许添加顶点。',
    usage: `// 检查是否可以插入点
if (modify.canInsertPoint()) {
  console.log('当前可以插入新顶点');
  // 启用插入按钮
  insertButton.setEnabled(true);
} else {
  insertButton.setEnabled(false);
}

// 典型用法：根据条件动态启用/禁用插入功能
function updateInsertState() {
  const canInsert = modify.canInsertPoint();
  showInsertTip(canInsert);
}`,
    params: [],
    returns: { type: 'boolean', description: 'true 表示可以插入点，false 表示不能' }
  },

  {
    name: 'canRemovePoint',
    cn: '检查可删除点',
    type: 'method',
    category: 'methods',
    description: '检查是否可以删除当前指针位置的顶点。用于判断当前状态下是否允许删除顶点。',
    usage: `// 检查是否可以删除点
if (modify.canRemovePoint()) {
  console.log('当前可以删除顶点');
  // 启用删除按钮
  deleteButton.setEnabled(true);
} else {
  deleteButton.setEnabled(false);
}

// 典型用法：更新工具栏状态
function updateToolbar() {
  deleteBtn.setDisabled(!modify.canRemovePoint());
}`,
    params: [],
    returns: { type: 'boolean', description: 'true 表示可以删除点，false 表示不能' }
  },

  {
    name: 'insertPoint',
    cn: '插入点',
    type: 'method',
    category: 'methods',
    description: '在指定坐标处插入新顶点。需要配合 canInsertPoint 使用以确保操作有效。',
    usage: `// 获取指针位置坐标
const coordinate = getPointerCoordinate();

// 插入点
const success = modify.insertPoint(coordinate);

if (success) {
  console.log('顶点插入成功');
} else {
  console.log('无法在此位置插入顶点');
}

// 典型用法：工具栏按钮点击
insertButton.onClick(() => {
  const coord = map.getEventCoordinate(lastEvent);
  if (modify.canInsertPoint()) {
    modify.insertPoint(coord);
  }
});`,
    params: [
      { name: 'coordinate', type: 'Coordinate', default: undefined, description: '要插入的坐标 [x, y]' }
    ],
    returns: { type: 'boolean', description: 'true 表示插入成功，false 表示失败' }
  },

  {
    name: 'removePoint',
    cn: '删除点',
    type: 'method',
    category: 'methods',
    description: '删除指定坐标处的顶点。需要配合 canRemovePoint 使用以确保操作有效。',
    usage: `// 获取指针位置坐标
const coordinate = getPointerCoordinate();

// 删除点
const success = modify.removePoint(coordinate);

if (success) {
  console.log('顶点删除成功');
} else {
  console.log('无法删除此顶点');
}

// 典型用法：工具栏按钮点击
deleteButton.onClick(() => {
  const coord = map.getEventCoordinate(lastEvent);
  if (modify.canRemovePoint()) {
    modify.removePoint(coord);
  }
});`,
    params: [
      { name: 'coordinate', type: 'Coordinate', default: undefined, description: '要删除的顶点坐标 [x, y]' }
    ],
    returns: { type: 'boolean', description: 'true 表示删除成功，false 表示失败' }
  },

  {
    name: 'setActive',
    cn: '设置激活状态',
    type: 'method',
    category: 'methods',
    description: '激活或停用交互。停用后交互将不再响应事件。',
    usage: `// 停用修改
modify.setActive(false);

// 激活修改
modify.setActive(true);

// 切换状态
modify.setActive(!modify.getActive());

// 典型用法：编辑模式切换
function toggleEditMode() {
  const isEditing = modify.getActive();
  modify.setActive(!isEditing);
  updateUI(!isEditing);
}`,
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
if (modify.getActive()) {
  console.log('修改交互已激活');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = modify.getActive();
  saveButton.setEnabled(isActive);
}`,
    params: [],
    returns: { type: 'boolean', description: 'true 表示激活，false 表示停用' }
  },

  {
    name: 'getOverlay',
    cn: '获取覆盖层',
    type: 'method',
    category: 'methods',
    description: '获取修改交互用于渲染顶点的覆盖层。可用于自定义顶点样式。',
    usage: `// 获取覆盖层
const overlay = modify.getOverlay();

// 设置顶点样式
overlay.setStyle(vertexStyle);

// 获取覆盖层的源
const source = overlay.getSource();
console.log('当前顶点数量:', source.getFeatures().length);`,
    params: [],
    returns: { type: 'VectorLayer', description: '顶点覆盖层' }
  },

  {
    name: 'getMap',
    cn: '获取地图',
    type: 'method',
    category: 'methods',
    description: '获取与此交互关联的地图对象。',
    usage: `// 获取地图
const map = modify.getMap();

if (map) {
  console.log('当前地图:', map);
}`,
    params: [],
    returns: { type: 'Map|null', description: '地图对象，未关联时返回 null' }
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
class CustomModify extends Modify {
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
    name: 'modifystart',
    cn: '修改开始事件',
    type: 'event',
    category: 'events',
    description: '当开始修改要素时触发。可用于记录修改历史或显示编辑提示。',
    usage: `modify.on('modifystart', (event) => {
  console.log('开始修改');

  // 获取被修改的要素
  const features = event.features;

  // 保存原始状态（用于撤销）
  features.forEach(f => {
    f.set('originalGeometry', f.getGeometry().clone());
  });

  // 显示提示
  showTooltip('拖拽顶点修改形状，Alt+ 点击删除顶点');
});`,
    params: [
      { name: 'features', type: 'Collection<Feature>', description: '被修改的要素集合' },
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'modifyend',
    cn: '修改结束事件',
    type: 'event',
    category: 'events',
    description: '当修改完成时触发。这是最常用的事件，用于保存修改后的要素。',
    usage: `modify.on('modifyend', (event) => {
  console.log('修改完成');

  // 获取被修改的要素
  const features = event.features;

  // 保存到服务器
  features.forEach(f => {
    const geometry = f.getGeometry();
    console.log('新几何:', geometry);

    // 发送到服务器
    saveFeature(f);
  });

  // 清除编辑状态
  clearEditState();
});`,
    params: [
      { name: 'features', type: 'Collection<Feature>', description: '被修改的要素集合' },
      { name: 'mapBrowserEvent', type: 'MapBrowserEvent', description: '触发事件的地图浏览器事件' }
    ]
  },

  {
    name: 'change:active',
    cn: '激活状态变化事件',
    type: 'event',
    category: 'events',
    description: '当交互的激活状态改变时触发。',
    usage: `modify.on('change:active', () => {
  const isActive = modify.getActive();
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
