<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>Snap - 捕捉交互 API</h2>
            <p class="description">
              OpenLayers Snap 交互用于在绘制或修改时捕捉到矢量要素的顶点、边或交点。
              通常与 Draw 或 Modify 交互配合使用，提高编辑精度。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Snap-Snap.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? snapApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: snapApis.length },
    { name: 'constructor', cn: '构造函数', count: snapApis.filter(a => a.type === 'class').length },
    { name: 'methods', cn: '方法', count: snapApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: snapApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

// 按类别筛选 API
const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return snapApis
  if (currentCategory.value === 'constructor') return snapApis.filter(a => a.type === 'class')
  if (currentCategory.value === 'methods') return snapApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return snapApis.filter(a => a.type === 'event')
  return snapApis
})

const snapApis = [
  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'class',
    category: 'constructor',
    description: '创建一个新的 Snap 交互实例，用于在绘制或修改时捕捉到要素的顶点、边或交点。通常与 Draw 或 Modify 交互配合使用。',
    usage: `import Snap from 'ol/interaction/Snap.js';

// 创建简单捕捉交互
const snap = new Snap({
  source: vectorSource
});

map.addInteraction(snap);

// 完整配置示例
const snap = new Snap({
  source: vectorSource,
  edge: true,
  vertex: true,
  intersection: false,
  pixelTolerance: 10
});

// 使用要素集合
const features = new Collection();
const snap = new Snap({
  features: features
});

// 只捕捉顶点
const snapVertex = new Snap({
  source: vectorSource,
  edge: false,
  vertex: true
});

// 只捕捉边
const snapEdge = new Snap({
  source: vectorSource,
  edge: true,
  vertex: false
});

// 捕捉交点
const snapIntersection = new Snap({
  source: vectorSource,
  intersection: true
});

// 与 Draw 和 Modify 配合使用
const draw = new Draw({ source: vectorSource, type: 'Polygon' });
const modify = new Modify({ source: vectorSource });
const snap = new Snap({ source: vectorSource });

map.addInteraction(draw);
map.addInteraction(modify);
map.addInteraction(snap);`,
    params: [
      { name: 'features', type: 'Collection<Feature>', default: undefined, description: '要捕捉的要素集合' },
      { name: 'source', type: 'VectorSource', default: undefined, description: '要捕捉的要素的矢量源' },
      { name: 'edge', type: 'boolean', default: 'true', description: '是否捕捉到边（线段）' },
      { name: 'vertex', type: 'boolean', default: 'true', description: '是否捕捉到顶点' },
      { name: 'intersection', type: 'boolean', default: 'false', description: '是否捕捉到线段交点' },
      { name: 'pixelTolerance', type: 'number', default: '10', description: '捕捉容差（像素），指针在此距离内会自动捕捉' },
      { name: 'segmenters', type: 'Segmenters', default: undefined, description: '按几何类型自定义分段器' }
    ],
    returns: { type: 'Snap', description: '新的 Snap 交互实例' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'addFeature',
    cn: '添加要素',
    type: 'method',
    category: 'methods',
    description: '添加单个要素到捕捉集合。当不使用 source 选项时使用此方法动态添加要素。',
    usage: `// 添加单个要素
const feature = new Feature(geometry);
snap.addFeature(feature);

// 带注册监听
snap.addFeature(feature, true);

// 典型用法：动态添加新绘制的要素
draw.on('drawend', (e) => {
  // 如果使用 source 选项，会自动添加
  // 如果使用 features 集合，需要手动添加
  snap.addFeature(e.feature);
});

// 批量添加
features.forEach(f => snap.addFeature(f));`,
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要添加的要素' },
      { name: 'register', type: 'boolean', default: 'true', description: '是否注册监听要素变化' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },

  {
    name: 'removeFeature',
    cn: '移除要素',
    type: 'method',
    category: 'methods',
    description: '从捕捉集合中移除单个要素。当要素被删除时调用此方法。',
    usage: `// 移除单个要素
const feature = vectorSource.getFeatureById('feature1');
snap.removeFeature(feature);

// 带取消监听
snap.removeFeature(feature, true);

// 典型用法：删除要素时
function deleteFeature(id) {
  const feature = vectorSource.getFeatureById(id);
  if (feature) {
    snap.removeFeature(feature);
    vectorSource.removeFeature(feature);
  }
}`,
    params: [
      { name: 'feature', type: 'Feature', default: undefined, description: '要移除的要素' },
      { name: 'unlisten', type: 'boolean', default: 'true', description: '是否取消监听要素变化' }
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
if (snap.getActive()) {
  console.log('捕捉交互已激活');
}

// 典型用法：更新 UI 状态
function updateUI() {
  const isActive = snap.getActive();
  snapButton.setChecked(isActive);
}`,
    params: [],
    returns: { type: 'boolean', description: 'true 表示激活，false 表示停用' }
  },

  {
    name: 'setActive',
    cn: '设置激活状态',
    type: 'method',
    category: 'methods',
    description: '激活或停用交互。停用后交互将不再进行捕捉。',
    usage: `// 停用捕捉
snap.setActive(false);

// 激活捕捉
snap.setActive(true);

// 切换状态
snap.setActive(!snap.getActive());

// 典型用法：工具栏切换
snapButton.onClick(() => {
  snap.setActive(!snap.getActive());
  updateButtonState();
});

// 临时禁用捕捉（如精细调整时）
function disableSnapTemporarily() {
  const wasActive = snap.getActive();
  snap.setActive(false);
  // ... 执行操作 ...
  snap.setActive(wasActive);
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
const map = snap.getMap();

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
    description: '处理地图浏览器事件。Snap 交互会修改事件的 coordinate 和 pixel 属性以实现捕捉效果。',
    usage: `// 通常由内部调用
// Snap 会修改浏览器事件的 coordinate 和 pixel 属性

// 示例：子类扩展
class CustomSnap extends Snap {
  handleEvent(event) {
    // 自定义事件处理
    console.log('处理事件:', event.type);
    // 调用父类方法
    return super.handleEvent(event);
  }
}

// 注意：Snap 修改事件坐标，其他交互会接收到捕捉后的坐标`,
    params: [
      { name: 'event', type: 'MapBrowserEvent', default: undefined, description: '地图浏览器事件' }
    ],
    returns: { type: 'boolean', description: 'false 阻止事件传播' }
  },

  {
    name: 'getPointerCount',
    cn: '获取指针数量',
    type: 'method',
    category: 'methods',
    description: '返回当前参与交互的指针数量。用于触摸设备支持。',
    usage: `// 获取指针数量
const count = snap.getPointerCount();
console.log('当前指针数量:', count);

// 典型用法：多点触控检测
if (snap.getPointerCount() > 1) {
  console.log('多点触控模式');
}`,
    params: [],
    returns: { type: 'number', description: '指针数量' }
  },

  // ========== Events (事件) ==========
  {
    name: 'snap',
    cn: '捕捉事件',
    type: 'event',
    category: 'events',
    description: '当指针捕捉到顶点或边时触发。可用于显示捕捉提示或高亮捕捉点。',
    usage: `snap.on('snap', (event) => {
  console.log('已捕捉');

  // 获取捕捉到的坐标
  const coordinate = event.coordinate;
  console.log('捕捉到坐标:', coordinate);

  // 获取捕捉到的要素
  const feature = event.feature;
  if (feature) {
    console.log('捕捉到要素:', feature.getId());
  }

  // 显示捕捉提示
  showSnapTip(coordinate);

  // 高亮捕捉点
  highlightSnapPoint(coordinate);
});

// 区分顶点和边捕捉
snap.on('snap', (e) => {
  if (e.vertex) {
    console.log('捕捉到顶点');
  } else if (e.edge) {
    console.log('捕捉到边');
  }
});`,
    params: [
      { name: 'coordinate', type: 'Coordinate', description: '捕捉到的坐标' },
      { name: 'feature', type: 'Feature', description: '捕捉到的要素（如果有）' },
      { name: 'vertex', type: 'boolean', description: '是否捕捉到顶点' },
      { name: 'edge', type: 'boolean', description: '是否捕捉到边' }
    ]
  },

  {
    name: 'unsnap',
    cn: '取消捕捉事件',
    type: 'event',
    category: 'events',
    description: '当指针不再捕捉任何要素时触发。可用于隐藏捕捉提示。',
    usage: `snap.on('unsnap', (event) => {
  console.log('取消捕捉');

  // 隐藏捕捉提示
  hideSnapTip();

  // 清除高亮
  clearSnapHighlight();
});

// 典型用法：状态指示器
snap.on('snap', () => {
  statusIcon.setText('已捕捉');
  statusIcon.setColor('green');
});

snap.on('unsnap', () => {
  statusIcon.setText('未捕捉');
  statusIcon.setColor('gray');
});`,
    params: []
  },

  {
    name: 'change:active',
    cn: '激活状态变化事件',
    type: 'event',
    category: 'events',
    description: '当交互的激活状态改变时触发。',
    usage: `snap.on('change:active', () => {
  const isActive = snap.getActive();
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
