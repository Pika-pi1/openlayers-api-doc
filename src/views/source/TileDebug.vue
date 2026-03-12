<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>TileDebug - 瓦片调试源 API</h2>
            <p class="description">
              TileDebug 源用于调试瓦片网格。它在每个瓦片上绘制边框和坐标信息，
              帮助开发者可视化瓦片网格结构、检查瓦片加载情况。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_TileDebug-TileDebug.html" target="_blank">
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

                <div class="api-section description-section">
                  <div class="section-header">
                    <el-icon class="section-icon description-icon"><Reading /></el-icon>
                    <h4>功能说明</h4>
                  </div>
                  <p class="description-text">{{ api.description }}</p>
                </div>

                <div class="api-section usage-section">
                  <div class="section-header">
                    <el-icon class="section-icon usage-icon"><Document /></el-icon>
                    <h4>使用示例</h4>
                  </div>
                  <pre class="code-block"><code>{{ api.usage }}</code></pre>
                </div>

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

const activeNames = ref(['constructor'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? tileDebugApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'constructor': 'primary',
    'method': 'success',
    'property': 'warning'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: tileDebugApis.length },
    { name: 'constructor', cn: '构造函数', count: tileDebugApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: tileDebugApis.filter(a => a.type === 'method').length },
    { name: 'properties', cn: '属性', count: tileDebugApis.filter(a => a.type === 'property').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return tileDebugApis
  if (currentCategory.value === 'constructor') return tileDebugApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return tileDebugApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'properties') return tileDebugApis.filter(a => a.type === 'property')
  return tileDebugApis
})

const tileDebugApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 TileDebug 源实例。TileDebug 用于调试目的，在瓦片上绘制网格信息和坐标。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';
import TileLayer from 'ol/layer/Tile.js';
import { createXYZ } from 'ol/tilegrid.js';

// 创建 TileDebug 源
const debugSource = new TileDebug({
  projection: 'EPSG:3857',
  tileGrid: createXYZ(),
  opaque: false
});

// 添加到地图作为调试层
const debugLayer = new TileLayer({
  source: debugSource,
  opacity: 0.7
});

map.addLayer(debugLayer);

// 与其他瓦片层叠加查看
const osmLayer = new TileLayer({
  source: new OSM()
});
map.addLayer(osmLayer);`,
    params: [
      { name: 'projection', type: 'string|Projection', default: '"EPSG:3857"', description: '源投影' },
      { name: 'tileGrid', type: 'TileGrid', default: 'undefined', description: '瓦片网格对象' },
      { name: 'opaque', type: 'boolean', default: 'false', description: '瓦片是否不透明' },
      { name: 'tileSize', type: 'number|Array<number>', default: '[256, 256]', description: '瓦片大小' },
      { name: 'wrapX', type: 'boolean', default: 'true', description: '是否在 X 方向包裹世界' }
    ],
    returns: { type: 'TileDebug', description: '新的 TileDebug 源实例' }
  },
  {
    name: 'getTileGrid',
    cn: '获取瓦片网格',
    type: 'method',
    category: 'methods',
    description: '获取源使用的瓦片网格对象。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug({
  tileGrid: createXYZ({ maxZoom: 10 })
});

const tileGrid = source.getTileGrid();
console.log('最小缩放级别:', tileGrid.getMinZoom()); // 0
console.log('最大缩放级别:', tileGrid.getMaxZoom()); // 10`,
    params: [],
    returns: { type: 'TileGrid', description: '瓦片网格对象' }
  },
  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'methods',
    description: '获取源使用的投影对象。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug({
  projection: 'EPSG:4326'
});

const projection = source.getProjection();
console.log(projection.getCode()); // 'EPSG:4326'`,
    params: [],
    returns: { type: 'Projection', description: '投影对象' }
  },
  {
    name: 'getTileSize',
    cn: '获取瓦片大小',
    type: 'method',
    category: 'methods',
    description: '获取瓦片的大小。返回数字或 [width, height] 数组。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug({
  tileSize: 512
});

console.log(source.getTileSize()); // 512

// 或者非正方形瓦片
const source2 = new TileDebug({
  tileSize: [256, 512]
});
console.log(source2.getTileSize()); // [256, 512]`,
    params: [],
    returns: { type: 'number|Array<number>', description: '瓦片大小' }
  },
  {
    name: 'getOpaque',
    cn: '获取不透明设置',
    type: 'method',
    category: 'methods',
    description: '检查瓦片是否被配置为不透明。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug({
  opaque: false  // 调试层通常设置为透明
});

console.log(source.getOpaque()); // false`,
    params: [],
    returns: { type: 'boolean', description: '是否不透明' }
  },
  {
    name: 'setOpaque',
    cn: '设置不透明',
    type: 'method',
    category: 'methods',
    description: '设置瓦片的不透明属性。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug();

// 设置为不透明
source.setOpaque(true);

// 设置为透明（默认）
source.setOpaque(false);`,
    params: [
      { name: 'opaque', type: 'boolean', default: '', description: '是否不透明' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getWrapX',
    cn: '获取包裹 X 设置',
    type: 'method',
    category: 'methods',
    description: '检查是否在 X 方向（经度方向）包裹世界。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug({
  wrapX: true
});

console.log(source.getWrapX()); // true`,
    params: [],
    returns: { type: 'boolean', description: '是否包裹 X 方向' }
  },
  {
    name: 'setWrapX',
    cn: '设置包裹 X',
    type: 'method',
    category: 'methods',
    description: '设置是否在 X 方向包裹世界。启用后，世界会在经度方向重复显示。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug();

// 启用包裹（显示多个世界副本）
source.setWrapX(true);

// 禁用包裹（只显示一个世界）
source.setWrapX(false);`,
    params: [
      { name: 'wrapX', type: 'boolean', default: '', description: '是否包裹 X 方向' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'refresh',
    cn: '刷新源',
    type: 'method',
    category: 'methods',
    description: '刷新源，重新绘制所有瓦片。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug();

// 刷新调试瓦片
source.refresh();

// 可用于在更改配置后强制重绘`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'changed',
    cn: '触发变更事件',
    type: 'method',
    category: 'methods',
    description: '增加修订计数器并触发变更事件。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug();

// 监听变更
source.on('change', () => {
  console.log('源已变更，版本:', source.getRevision());
});

// 触发变更
source.changed();`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'methods',
    description: '获取源的修订版本号。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug();

console.log('初始版本:', source.getRevision());

source.changed();
console.log('变更后版本:', source.getRevision()); // +1`,
    params: [],
    returns: { type: 'number', description: '修订版本号' }
  },
  {
    name: 'tileSize',
    cn: '瓦片大小属性',
    type: 'property',
    category: 'properties',
    description: '瓦片的大小。可以是数字（正方形瓦片）或 [width, height] 数组。',
    usage: `import TileDebug from 'ol/source/TileDebug.js';

const source = new TileDebug({
  tileSize: 256
});

// 访问瓦片大小
console.log(source.tileSize); // 256

// 非正方形瓦片
const source2 = new TileDebug({
  tileSize: [512, 256]
});
console.log(source2.tileSize); // [512, 256]`,
    params: [],
    returns: { type: 'number|Array<number>', description: '瓦片大小' }
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
