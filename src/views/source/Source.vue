<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Source - 源基类 API</h2>
            <p class="description">
              Source 是 OpenLayers 中所有数据源的基类，提供了数据源行为的核心功能。
              所有源类（如 Tile、Image、Vector 等）都继承自此类，支持投影设置、状态管理等功能。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_Source-Source.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? sourceApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: sourceApis.length },
    { name: 'constructor', cn: '构造函数', count: sourceApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: sourceApis.filter(a => a.type === 'method').length },
    { name: 'properties', cn: '属性', count: sourceApis.filter(a => a.type === 'property').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return sourceApis
  if (currentCategory.value === 'constructor') return sourceApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return sourceApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'properties') return sourceApis.filter(a => a.type === 'property')
  return sourceApis
})

const sourceApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 Source 源实例。Source 是所有数据源的基类，通常通过子类（如 Tile、Image、Vector 等）使用。',
    usage: `import Source from 'ol/source/Source.js';
import TileSource from 'ol/source/Tile.js';
import OSM from 'ol/source/OSM.js';

// Source 通常作为基类，不直接使用
// 创建 Tile 源实例
const tileSource = new TileSource({
  projection: 'EPSG:3857',
  attributions: '© Map Provider'
});

// 更常见的是使用具体源实现
const osmSource = new OSM({
  attributions: '© OpenStreetMap contributors'
});`,
    params: [
      { name: 'projection', type: 'string|Projection', default: 'undefined', description: '源使用的投影，默认为地图投影' },
      { name: 'attributions', type: 'string|Array<string>|function', default: 'undefined', description: '版权信息' },
      { name: 'attributionsCollapsible', type: 'boolean', default: 'true', description: '版权信息是否可折叠' },
      { name: 'interpolate', type: 'boolean', default: 'true', description: '是否使用插值，适用于图像源' },
      { name: 'state', type: 'string', default: '"ready"', description: '初始状态：ready, loading, error' }
    ],
    returns: { type: 'Source', description: '新的 Source 源实例' }
  },
  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'methods',
    description: '获取源使用的投影对象。返回 Projection 对象，可用于坐标转换。',
    usage: `import OSM from 'ol/source/OSM.js';

const source = new OSM();
const projection = source.getProjection();

console.log(projection.getCode()); // 'EPSG:3857'
console.log(projection.getUnits()); // 'm'`,
    params: [],
    returns: { type: 'Projection', description: '源的投影对象' }
  },
  {
    name: 'getAttributions',
    cn: '获取版权信息',
    type: 'method',
    category: 'methods',
    description: '获取源的版权信息函数。返回一个函数，调用时返回版权信息数组。',
    usage: `import OSM from 'ol/source/OSM.js';

const source = new OSM({
  attributions: '© OpenStreetMap contributors'
});

const attributionsFn = source.getAttributions();
if (attributionsFn) {
  const attributions = attributionsFn();
  console.log(attributions); // ['© OpenStreetMap contributors']
}`,
    params: [],
    returns: { type: 'function', description: '版权信息函数，返回版权信息数组' }
  },
  {
    name: 'getAttributionsCollapsible',
    cn: '获取版权折叠状态',
    type: 'method',
    category: 'methods',
    description: '检查版权信息是否可折叠。可折叠的版权信息会在地图上以小图标形式显示。',
    usage: `import OSM from 'ol/source/OSM.js';

const source = new OSM({
  attributions: '© OpenStreetMap contributors',
  attributionsCollapsible: false
});

console.log(source.getAttributionsCollapsible()); // false`,
    params: [],
    returns: { type: 'boolean', description: '版权信息是否可折叠' }
  },
  {
    name: 'getState',
    cn: '获取状态',
    type: 'method',
    category: 'methods',
    description: '获取源的当前状态。可能值：ready（就绪）、loading（加载中）、error（错误）。',
    usage: `import OSM from 'ol/source/OSM.js';

const source = new OSM();

console.log(source.getState()); // 'ready'

// 监听状态变化
source.on('change', () => {
  console.log('源状态变更为:', source.getState());
});`,
    params: [],
    returns: { type: 'string', description: '源状态：ready, loading, error' }
  },
  {
    name: 'setAttributions',
    cn: '设置版权信息',
    type: 'method',
    category: 'methods',
    description: '动态设置源的版权信息。设置后会自动触发变更事件。',
    usage: `import OSM from 'ol/source/OSM.js';

const source = new OSM();

// 初始无版权信息
console.log(source.getAttributions()); // null

// 动态设置版权信息
source.setAttributions('© 2024 Map Provider');

// 或设置为数组
source.setAttributions(['© Provider 1', '© Provider 2']);`,
    params: [
      { name: 'attributions', type: 'string|Array<string>|function', default: '', description: '新的版权信息' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getInterpolate',
    cn: '获取插值设置',
    type: 'method',
    category: 'methods',
    description: '检查源是否使用插值。插值适用于图像源，可使图像更平滑。',
    usage: `import ImageSource from 'ol/source/Image.js';

const source = new ImageSource({
  url: 'https://example.com/image.jpg',
  interpolate: true
});

console.log(source.getInterpolate()); // true`,
    params: [],
    returns: { type: 'boolean', description: '是否使用插值' }
  },
  {
    name: 'setInterpolate',
    cn: '设置插值',
    type: 'method',
    category: 'methods',
    description: '设置源是否使用插值。适用于图像源，true 使图像平滑，false 保持像素化。',
    usage: `import ImageSource from 'ol/source/Image.js';

const source = new ImageSource({
  url: 'https://example.com/image.jpg'
});

// 启用插值（平滑）
source.setInterpolate(true);

// 禁用插值（像素化，适合像素艺术风格）
source.setInterpolate(false);`,
    params: [
      { name: 'interpolate', type: 'boolean', default: '', description: '是否使用插值' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'changed',
    cn: '触发变更事件',
    type: 'method',
    category: 'methods',
    description: '增加修订计数器并触发变更事件。当源状态改变时调用此方法通知监听器。',
    usage: `import OSM from 'ol/source/OSM.js';

const source = new OSM();

// 监听变更事件
source.on('change', () => {
  console.log('源已变更，版本:', source.getRevision());
});

// 手动触发变更
source.changed();`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'methods',
    description: '获取源的修订版本号。每次调用 changed() 方法时版本号会递增。可用于检测源状态是否发生变化。',
    usage: `import OSM from 'ol/source/OSM.js';

const source = new OSM();

console.log('初始版本:', source.getRevision());

source.changed();
console.log('变更后版本:', source.getRevision()); // +1`,
    params: [],
    returns: { type: 'number', description: '修订版本号' }
  },
  {
    name: 'refresh',
    cn: '刷新源',
    type: 'method',
    category: 'methods',
    description: '刷新源，重新加载所有数据。适用于需要强制重新加载的场景。',
    usage: `import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector.js';

// Tile/Image 源 - 重新加载所有瓦片/图像
const osmSource = new OSM();
osmSource.refresh();

// Vector 源 - 重新加载所有要素
const vectorSource = new VectorSource();
vectorSource.refresh();`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'disposed',
    cn: '已销毁',
    type: 'property',
    category: 'properties',
    description: '源是否已被销毁。销毁后的源不能再使用。',
    usage: `import OSM from 'ol/source/OSM.js';

const source = new OSM();

console.log(source.disposed); // false

// 销毁源
source.dispose();

console.log(source.disposed); // true`,
    params: [],
    returns: { type: 'boolean', description: '是否已销毁' }
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
