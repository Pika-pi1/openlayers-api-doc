<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>WFS - Web Feature Service 格式 API</h2>
            <p class="description">
              WFS（Web Feature Service）格式用于读取和写入 WFS 协议数据。
              WFS 是 OGC 标准，用于通过网络请求和传输地理要素数据。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_format_WFS-WFS.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? wfsApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: wfsApis.length },
    { name: 'constructor', cn: '构造函数', count: wfsApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: wfsApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return wfsApis
  if (currentCategory.value === 'constructor') return wfsApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return wfsApis.filter(a => a.type === 'method')
  return wfsApis
})

const wfsApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 WFS 格式实例。WFS 格式用于读取和写入 Web Feature Service 协议数据，支持 WFS 1.0.0、1.1.0 和 2.0.0 版本。',
    usage: `import WFS from 'ol/format/WFS.js';

// 创建 WFS 格式实例
const wfsFormat = new WFS({
  version: '2.0.0',
  namespaceURI: 'http://example.com/features',
  featureType: 'buildings',
  featureNS: 'http://example.com/features'
});

// 读取 WFS GetFeature 响应
fetch('https://example.com/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=buildings')
  .then(response => response.text())
  .then(xml => {
    const features = wfsFormat.readFeatures(xml);
    console.log(features);
  });`,
    params: [
      { name: 'version', type: 'string', default: '2.0.0', description: 'WFS 协议版本，支持 1.0.0、1.1.0、2.0.0' },
      { name: 'namespaceURI', type: 'string', default: '', description: 'XML 命名空间 URI' },
      { name: 'featureType', type: 'string', default: '', description: '要素类型名称' },
      { name: 'featureNS', type: 'string', default: '', description: '要素命名空间' }
    ],
    returns: { type: 'WFS', description: '新的 WFS 格式实例' }
  },
  {
    name: 'readFeatures',
    cn: '读取多个要素',
    type: 'method',
    category: 'methods',
    description: '从 WFS GetFeature 响应中读取多个地理要素。解析 WFS XML 并转换为 OpenLayers 要素数组。',
    usage: `import WFS from 'ol/format/WFS.js';

const format = new WFS({
  version: '2.0.0',
  featureType: 'buildings',
  featureNS: 'http://example.com/features'
});

// 从 WFS GetFeature 响应读取
fetch('https://example.com/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=buildings')
  .then(response => response.text())
  .then(xml => {
    const features = format.readFeatures(xml);
    vectorSource.addFeatures(features);
  });

// 带投影转换
const features = format.readFeatures(xml, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'WFS GetFeature 响应 XML 文档或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项' }
    ],
    returns: { type: 'Array<Feature>', description: '读取的要素数组' }
  },
  {
    name: 'readFeature',
    cn: '读取单个要素',
    type: 'method',
    category: 'methods',
    description: '从 WFS 响应中读取单个地理要素。',
    usage: `import WFS from 'ol/format/WFS.js';

const format = new WFS({
  featureType: 'buildings',
  featureNS: 'http://example.com/features'
});

// 读取单个要素
const feature = format.readFeature(wfsResponseXml);`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'WFS 响应 XML 文档或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项' }
    ],
    returns: { type: 'Feature', description: '读取的要素对象' }
  },
  {
    name: 'writeGetFeature',
    cn: '写入 GetFeature 请求',
    type: 'method',
    category: 'methods',
    description: '写入 WFS GetFeature 请求 XML。用于构建 WFS 查询请求。',
    usage: `import WFS from 'ol/format/WFS.js';
import { bbox } from 'ol/loadingstrategy.js';

const format = new WFS({
  version: '2.0.0',
  featureType: 'buildings',
  featureNS: 'http://example.com/features'
});

// 创建 GetFeature 请求
const getFeatureXml = format.writeGetFeature({
  count: 100,
  startIndex: 0,
  outputFormat: 'application/gml+xml',
  bbox: [116.0, 39.0, 117.0, 40.0, 'EPSG:4326']
});

// 发送到 WFS 服务器
fetch('https://example.com/wfs', {
  method: 'POST',
  headers: { 'Content-Type': 'text/xml' },
  body: getFeatureXml
});`,
    params: [
      { name: 'options', type: 'Object', default: '', description: 'GetFeature 选项' }
    ],
    returns: { type: 'string', description: 'WFS GetFeature 请求 XML 字符串' }
  },
  {
    name: 'writeTransaction',
    cn: '写入事务请求',
    type: 'method',
    category: 'methods',
    description: '写入 WFS Transaction 请求 XML。用于执行 WFS 事务操作（插入、更新、删除要素）。',
    usage: `import WFS from 'ol/format/WFS.js';

const format = new WFS({
  version: '2.0.0',
  featureNS: 'http://example.com/features',
  featureType: 'buildings',
  srsName: 'EPSG:4326'
});

// 创建事务请求（插入新要素）
const transactionXml = format.writeTransaction(
  [newFeature],  // 插入的要素
  [updateFeature],  // 更新的要素
  [deleteFeature],  // 删除的要素
  {
    nativeElements: [{
      value: '<Native nativeType="featureId" nativeAction="GENERATE">'
    }]
  }
);

// 发送事务请求
fetch('https://example.com/wfs', {
  method: 'POST',
  headers: { 'Content-Type': 'text/xml' },
  body: transactionXml
});`,
    params: [
      { name: 'inserts', type: 'Array<Feature>', default: '[]', description: '要插入的要素数组' },
      { name: 'updates', type: 'Array<Feature>', default: '[]', description: '要更新的要素数组' },
      { name: 'deletes', type: 'Array<Feature>', default: '[]', description: '要删除的要素数组' },
      { name: 'options', type: 'Object', default: 'undefined', description: '事务选项' }
    ],
    returns: { type: 'string', description: 'WFS Transaction 请求 XML 字符串' }
  },
  {
    name: 'readProjection',
    cn: '读取投影信息',
    type: 'method',
    category: 'methods',
    description: '从 WFS 响应中读取投影信息。',
    usage: `import WFS from 'ol/format/WFS.js';

const format = new WFS();

// 读取 WFS 响应中的投影
const projection = format.readProjection(wfsResponseXml);
console.log(projection.getCode());`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'WFS 响应 XML 文档或字符串' }
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
