<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>XSD - XML Schema Definition 格式 API</h2>
            <p class="description">
              XSD（XML Schema Definition）格式用于读取 XML Schema 文档。
              在 OpenLayers 中，XSD 通常用于解析 GML 和其他基于 XML 的地理数据格式的结构信息。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_format_XSD-XSD.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? xsdApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: xsdApis.length },
    { name: 'constructor', cn: '构造函数', count: xsdApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: xsdApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return xsdApis
  if (currentCategory.value === 'constructor') return xsdApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return xsdApis.filter(a => a.type === 'method')
  return xsdApis
})

const xsdApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 XSD 格式实例。XSD 格式用于读取 XML Schema 文档，在 OpenLayers 中通常用于解析 GML 等格式的结构信息。',
    usage: `import XSD from 'ol/format/XSD.js';

// 创建 XSD 格式实例
const xsdFormat = new XSD();

// 从 XSD 文档读取结构信息
fetch('schema.xsd')
  .then(response => response.text())
  .then(xml => {
    const schemaInfo = xsdFormat.read(xml);
    console.log(schemaInfo);
  });`,
    params: [],
    returns: { type: 'XSD', description: '新的 XSD 格式实例' }
  },
  {
    name: 'read',
    cn: '读取 Schema',
    type: 'method',
    category: 'methods',
    description: '从 XSD 文档中读取 XML Schema 信息。解析 XML Schema 并提取类型定义、元素声明等结构信息。',
    usage: `import XSD from 'ol/format/XSD.js';

const format = new XSD();

// 读取 XSD Schema
fetch('schema.xsd')
  .then(response => response.text())
  .then(xml => {
    const schema = format.read(xml);

    // 访问 Schema 信息
    console.log('目标命名空间:', schema.targetNamespace);
    console.log('元素定义:', schema.elements);
    console.log('类型定义:', schema.complexTypes);
  });`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'XSD 文档、节点或字符串' }
    ],
    returns: { type: 'Object', description: 'XML Schema 信息对象' }
  },
  {
    name: 'readAttribute',
    cn: '读取属性',
    type: 'method',
    category: 'methods',
    description: '从 XSD 文档中读取属性定义。',
    usage: `import XSD from 'ol/format/XSD.js';

const format = new XSD();

// 读取属性定义
const attribute = format.readAttribute(xsdDocument, 'attributeName');

console.log(attribute);`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'XSD 文档、节点或字符串' },
      { name: 'name', type: 'string', default: '', description: '要查找的属性名称' }
    ],
    returns: { type: 'Object', description: '属性定义对象' }
  },
  {
    name: 'readComplexType',
    cn: '读取复杂类型',
    type: 'method',
    category: 'methods',
    description: '从 XSD 文档中读取复杂类型定义。',
    usage: `import XSD from 'ol/format/XSD.js';

const format = new XSD();

// 读取复杂类型定义
const complexType = format.readComplexType(xsdDocument, 'typeName');

console.log(complexType);`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'XSD 文档、节点或字符串' },
      { name: 'name', type: 'string', default: '', description: '要查找的类型名称' }
    ],
    returns: { type: 'Object', description: '复杂类型定义对象' }
  },
  {
    name: 'readElement',
    cn: '读取元素',
    type: 'method',
    category: 'methods',
    description: '从 XSD 文档中读取元素声明。',
    usage: `import XSD from 'ol/format/XSD.js';

const format = new XSD();

// 读取元素声明
const element = format.readElement(xsdDocument, 'elementName');

console.log(element);`,
    params: [
      { name: 'source', type: 'Document|Node|string', default: '', description: 'XSD 文档、节点或字符串' },
      { name: 'name', type: 'string', default: '', description: '要查找的元素名称' }
    ],
    returns: { type: 'Object', description: '元素声明对象' }
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
