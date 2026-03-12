<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Url - URL 工具函数 API</h2>
            <p class="description">
              Url 模块提供用于处理瓦片 URL 的实用函数。
              包括 URL 模板解析、坐标替换、多 URL 轮询等功能，常用于自定义瓦片源。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_tileurlfunction.html" target="_blank">
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

const activeNames = ref(['createFromTemplates'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? urlApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'function': 'primary',
    'method': 'success'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: urlApis.length },
    { name: 'functions', cn: '函数', count: urlApis.filter(a => a.type === 'function').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return urlApis
  if (currentCategory.value === 'functions') return urlApis.filter(a => a.type === 'function')
  return urlApis
})

const urlApis = [
  {
    name: 'createFromTemplates',
    cn: '从模板创建',
    type: 'function',
    category: 'functions',
    description: '从 URL 模板创建瓦片 URL 函数。支持 {z}, {x}, {y} 等占位符替换。',
    usage: `import { createFromTemplates } from 'ol/tileurlfunction.js';

// 创建 URL 模板函数
const tileUrlFunction = createFromTemplates(
  'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
);

// 使用函数获取瓦片 URL
const url = tileUrlFunction([0, 0, 0], 1);
console.log(url); // 'https://a.tile.openstreetmap.org/0/0/0.png'

// 用于 XYZ 源
import XYZ from 'ol/source/XYZ.js';

const xyzSource = new XYZ({
  tileUrlFunction: tileUrlFunction
});`,
    params: [
      { name: 'template', type: 'string', default: 'undefined', description: 'URL 模板，支持 {z}, {x}, {y} 和 {a-c} 子域名' },
      { name: 'tileGrid', type: 'TileGrid', default: 'undefined', description: '可选的瓦片网格对象' }
    ],
    returns: { type: 'TileUrlFunctionType', description: '瓦片 URL 函数' }
  },
  {
    name: 'createFromTileUrlFunctions',
    cn: '从函数数组创建',
    type: 'function',
    category: 'functions',
    description: '从多个瓦片 URL 函数创建组合函数。按顺序调用各函数，返回第一个非 null 的结果。',
    usage: `import { createFromTileUrlFunctions, createFromTemplates } from 'ol/tileurlfunction.js';

// 创建多个 URL 函数（用于备用服务器）
const urlFn1 = createFromTemplates('https://server1.example.com/{z}/{x}/{y}.png');
const urlFn2 = createFromTemplates('https://server2.example.com/{z}/{x}/{y}.png');
const urlFn3 = createFromTemplates('https://server3.example.com/{z}/{x}/{y}.png');

// 组合函数（按顺序尝试）
const combinedUrlFn = createFromTileUrlFunctions([urlFn1, urlFn2, urlFn3]);

// 使用组合函数
const url = combinedUrlFn([0, 0, 0], 1);`,
    params: [
      { name: 'functions', type: 'Array<TileUrlFunctionType>', default: '[]', description: '瓦片 URL 函数数组' }
    ],
    returns: { type: 'TileUrlFunctionType', description: '组合的瓦片 URL 函数' }
  },
  {
    name: 'expandUrl',
    cn: '扩展 URL',
    type: 'function',
    category: 'functions',
    description: '扩展包含子域名占位符的 URL 模板。将 {a-c} 展开为多个实际 URL。',
    usage: `import { expandUrl } from 'ol/tileurlfunction.js';

// 扩展单个 URL 模板
const urls = expandUrl('https://{a-c}.tile.example.com/{z}/{x}/{y}.png');
console.log(urls);
// ['https://a.tile.example.com/{z}/{x}/{y}.png',
//  'https://b.tile.example.com/{z}/{x}/{y}.png',
//  'https://c.tile.example.com/{z}/{x}/{y}.png']

// 用于多服务器负载均衡
const source = new XYZ({
  urls: urls
});`,
    params: [
      { name: 'url', type: 'string', default: 'undefined', description: 'URL 模板，可包含 {a-c} 占位符' }
    ],
    returns: { type: 'Array<string>', description: '扩展后的 URL 数组' }
  },
  {
    name: 'nullTileUrlFunction',
    cn: '空 URL 函数',
    type: 'function',
    category: 'functions',
    description: '返回 null 的瓦片 URL 函数。用于占位或禁用瓦片加载。',
    usage: `import { nullTileUrlFunction } from 'ol/tileurlfunction.js';

// 创建始终返回 null 的源
const source = new TileSource({
  tileUrlFunction: nullTileUrlFunction
});

// 用于动态控制瓦片加载
let enabled = false;

source.setTileUrlFunction((coord, pixelRatio, projection) => {
  if (enabled) {
    return 'https://example.com/{z}/{x}/{y}.png';
  }
  return nullTileUrlFunction(coord, pixelRatio, projection);
});`,
    params: [
      { name: 'coord', type: 'Array<number>', default: '', description: '瓦片坐标 [z, x, y]' },
      { name: 'pixelRatio', type: 'number', default: '', description: '像素比' },
      { name: 'projection', type: 'Projection', default: '', description: '投影对象' }
    ],
    returns: { type: 'null', description: '始终返回 null' }
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
