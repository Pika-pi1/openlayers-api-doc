<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>GMLBase - GML 基类格式 API</h2>
            <p class="description">
              GMLBase 是 GML（Geography Markup Language）格式的基类。
              提供了读取和写入 GML 要素的通用功能，支持 GML2 和 GML3 版本。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_format_GMLBase-GMLBase.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? gmlBaseApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: gmlBaseApis.length },
    { name: 'constructor', cn: '构造函数', count: gmlBaseApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: gmlBaseApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return gmlBaseApis
  if (currentCategory.value === 'constructor') return gmlBaseApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return gmlBaseApis.filter(a => a.type === 'method')
  return gmlBaseApis
})

const gmlBaseApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 GMLBase 格式实例。GMLBase 是 GML2 和 GML3 格式的基类，提供了读取和写入 GML 要素的通用功能。',
    usage: `import GML2 from 'ol/format/GML2.js';
import GML3 from 'ol/format/GML3.js';

// 创建 GML2 格式实例
const gml2Format = new GML2({
  featureType: 'feature',
  featureNS: 'http://example.com/features',
  srsName: 'EPSG:4326'
});

// 创建 GML3 格式实例
const gml3Format = new GML3({
  featureType: 'feature',
  featureNS: 'http://example.com/features',
  srsName: 'EPSG:4326',
  gmlOptions: {
    multiCurve: true,
    multiSurface: true
  }
});

// 注意：GMLBase 是基类，通常使用 GML2 或 GML3 子类`,
    params: [
      { name: 'featureType', type: 'string', default: '', description: '要素类型名称，用于 XML 中的要素标签名' },
      { name: 'featureNS', type: 'string', default: '', description: '要素命名空间 URI' },
      { name: 'srsName', type: 'string', default: 'EPSG:4326', description: '空间参考系统名称，默认 WGS84' },
      { name: 'gmlOptions', type: 'Object', default: 'undefined', description: 'GML 特定选项（GML3 支持 multiCurve、multiSurface 等）' }
    ],
    returns: { type: 'GMLBase', description: '新的 GMLBase 格式实例' }
  },
  {
    name: 'readFeatures',
    cn: '读取多个要素',
    type: 'method',
    category: 'methods',
    description: '从 GML 文档中读取多个地理要素。解析 GML XML 格式并转换为 OpenLayers 要素数组。',
    usage: `import GML3 from 'ol/format/GML3.js';

const format = new GML3({
  featureType: 'building',
  featureNS: 'http://example.com/buildings',
  srsName: 'EPSG:4326'
});

// 从 GML 字符串读取要素
const features = format.readFeatures(gmlString);

// 添加到矢量图层
const vectorSource = new VectorSource({
  features: features
});

const vectorLayer = new VectorLayer({
  source: vectorSource
});`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'GML 文档、节点或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项，可覆盖构造函数的配置' }
    ],
    returns: { type: 'Array<Feature>', description: '读取的要素数组' }
  },
  {
    name: 'readFeature',
    cn: '读取单个要素',
    type: 'method',
    category: 'methods',
    description: '从 GML 文档中读取单个地理要素。用于只获取第一个匹配要素的场景。',
    usage: `import GML3 from 'ol/format/GML3.js';

const format = new GML3({
  featureType: 'building',
  featureNS: 'http://example.com/buildings'
});

// 读取单个要素
const feature = format.readFeature(gmlString);

// 获取要素属性
console.log(feature.getProperties());`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'GML 文档、节点或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项' }
    ],
    returns: { type: 'Feature', description: '读取的要素对象' }
  },
  {
    name: 'writeFeatures',
    cn: '写入多个要素',
    type: 'method',
    category: 'methods',
    description: '将多个地理要素写入 GML 格式的 XML 字符串。用于导出或传输 GML 数据。',
    usage: `import GML3 from 'ol/format/GML3.js';

const format = new GML3({
  featureType: 'building',
  featureNS: 'http://example.com/buildings',
  srsName: 'EPSG:4326'
});

// 将要素数组写入 GML 字符串
const gmlString = format.writeFeatures(features);

// 创建 Blob 用于下载
const blob = new Blob([gmlString], { type: 'application/gml+xml' });

// 或发送到服务器
fetch('/api/save-gml', {
  method: 'POST',
  headers: { 'Content-Type': 'application/gml+xml' },
  body: gmlString
});`,
    params: [
      { name: 'features', type: 'Array<Feature>', default: '', description: '要写入的要素数组' },
      { name: 'options', type: 'Object', default: 'undefined', description: '写入选项' }
    ],
    returns: { type: 'string', description: 'GML 格式的 XML 字符串' }
  },
  {
    name: 'writeFeature',
    cn: '写入单个要素',
    type: 'method',
    category: 'methods',
    description: '将单个地理要素写入 GML 格式的 XML 字符串。',
    usage: `import GML3 from 'ol/format/GML3.js';

const format = new GML3({
  featureType: 'building',
  featureNS: 'http://example.com/buildings'
});

// 将单个要素写入 GML
const gmlString = format.writeFeature(feature);`,
    params: [
      { name: 'feature', type: 'Feature', default: '', description: '要写入的要素对象' },
      { name: 'options', type: 'Object', default: 'undefined', description: '写入选项' }
    ],
    returns: { type: 'string', description: 'GML 格式的 XML 字符串' }
  },
  {
    name: 'readGeometry',
    cn: '读取几何对象',
    type: 'method',
    category: 'methods',
    description: '从 GML 几何元素中读取几何对象。只解析几何信息，不包含属性。',
    usage: `import GML3 from 'ol/format/GML3.js';

const format = new GML3();

// 从 GML 几何元素读取
const geometry = format.readGeometry(gmlGeometryString, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'GML 几何元素、节点或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项' }
    ],
    returns: { type: 'Geometry', description: '读取的几何对象' }
  },
  {
    name: 'writeGeometry',
    cn: '写入几何对象',
    type: 'method',
    category: 'methods',
    description: '将几何对象写入 GML 格式的 XML 字符串。只导出几何信息。',
    usage: `import GML3 from 'ol/format/GML3.js';
import { Polygon } from 'ol/geom.js';

const format = new GML3();

const polygon = new Polygon([[
  [116.4, 39.9],
  [116.5, 39.9],
  [116.5, 40.0],
  [116.4, 40.0],
  [116.4, 39.9]
]]);

// 写入 GML 几何
const gmlString = format.writeGeometry(polygon);`,
    params: [
      { name: 'geometry', type: 'Geometry', default: '', description: '要写入的几何对象' },
      { name: 'options', type: 'Object', default: 'undefined', description: '写入选项' }
    ],
    returns: { type: 'string', description: 'GML 格式的 XML 字符串' }
  },
  {
    name: 'readProjection',
    cn: '读取投影信息',
    type: 'method',
    category: 'methods',
    description: '从 GML 文档中读取投影/坐标参考系统信息。',
    usage: `import GML3 from 'ol/format/GML3.js';

const format = new GML3();

// 读取 GML 中的投影信息
const projection = format.readProjection(gmlDocument);

console.log(projection.getCode()); // 例如 'EPSG:4326'`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'GML 文档、节点或字符串' }
    ],
    returns: { type: 'Projection', description: '读取的投影对象' }
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
