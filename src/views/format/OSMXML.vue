<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>OSMXML - OpenStreetMap XML 格式 API</h2>
            <p class="description">
              OSMXML 格式用于读取 OpenStreetMap XML 数据。
              OpenStreetMap 是一个免费的、可编辑的世界地图，OSMXML 是其标准数据交换格式。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_format_OSMXML-OSMXML.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? osmxmlApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'constructor': 'primary',
    'method': 'success'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: osmxmlApis.length },
    { name: 'constructor', cn: '构造函数', count: osmxmlApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: osmxmlApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return osmxmlApis
  if (currentCategory.value === 'constructor') return osmxmlApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return osmxmlApis.filter(a => a.type === 'method')
  return osmxmlApis
})

const osmxmlApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 OSMXML 格式实例。OSMXML 格式用于读取 OpenStreetMap XML 数据，支持节点、方式和关系解析。',
    usage: `import OSMXML from 'ol/format/OSMXML.js';

// 创建 OSMXML 格式实例
const osmxmlFormat = new OSMXML();

// 从 OSM XML 读取要素
fetch('data.osm')
  .then(response => response.text())
  .then(xmlText => {
    const features = osmxmlFormat.readFeatures(xmlText);
    console.log(features);
  });`,
    params: [],
    returns: { type: 'OSMXML', description: '新的 OSMXML 格式实例' }
  },
  {
    name: 'readFeatures',
    cn: '读取多个要素',
    type: 'method',
    category: 'methods',
    description: '从 OSM XML 文档中读取多个地理要素。解析节点（Node）、方式（Way）和关系（Relation）并转换为 OpenLayers 要素。',
    usage: `import OSMXML from 'ol/format/OSMXML.js';

const format = new OSMXML();

// 从 OSM XML 字符串读取要素
const features = format.readFeatures(osmXmlString);

// 从 Overpass API 获取数据
fetch('https://overpass-api.de/api/interpreter?data=[out:xml];way["highway"](bbox);out;')
  .then(response => response.text())
  .then(xml => {
    const features = format.readFeatures(xml, {
      featureProjection: 'EPSG:3857'
    });
    vectorSource.addFeatures(features);
  });

// 添加到矢量图层
const vectorSource = new VectorSource({
  features: features
});`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'OSM XML 文档、节点或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项，包括 featureProjection' }
    ],
    returns: { type: 'Array<Feature>', description: '读取的要素数组' }
  },
  {
    name: 'readFeature',
    cn: '读取单个要素',
    type: 'method',
    category: 'methods',
    description: '从 OSM XML 文档中读取单个地理要素。',
    usage: `import OSMXML from 'ol/format/OSMXML.js';

const format = new OSMXML();

// 读取单个要素
const feature = format.readFeature(osmXmlString);

// 获取 OSM 标签
const tags = feature.getProperties();
console.log(tags);`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'OSM XML 文档、节点或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项' }
    ],
    returns: { type: 'Feature', description: '读取的要素对象' }
  },
  {
    name: 'readGeometry',
    cn: '读取几何对象',
    type: 'method',
    category: 'methods',
    description: '从 OSM XML 中读取几何对象。OSM 数据中的节点和方式会被转换为相应的几何类型。',
    usage: `import OSMXML from 'ol/format/OSMXML.js';

const format = new OSMXML();

// 读取几何
const geometry = format.readGeometry(osmXmlString, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'OSM XML 文档、节点或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项' }
    ],
    returns: { type: 'Geometry', description: '读取的几何对象' }
  },
  {
    name: 'readProjection',
    cn: '读取投影信息',
    type: 'method',
    category: 'methods',
    description: '从 OSM XML 文档中读取投影信息。OSM 数据默认使用 WGS84（EPSG:4326）。',
    usage: `import OSMXML from 'ol/format/OSMXML.js';

const format = new OSMXML();

// OSM 数据默认使用 WGS84
const projection = format.readProjection(osmXmlDocument);
console.log(projection.getCode()); // 'EPSG:4326'`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'OSM XML 文档、节点或字符串' }
    ],
    returns: { type: 'Projection', description: '读取的投影对象（EPSG:4326）' }
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
