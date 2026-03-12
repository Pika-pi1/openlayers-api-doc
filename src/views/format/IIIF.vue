<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>IIIF - 国际图像互操作框架格式 API</h2>
            <p class="description">
              IIIF（International Image Interoperability Framework）格式用于读取和写入 IIIF 图像服务数据。
              IIIF 是一种用于图像资源互操作性的国际标准，支持高分辨率图像的在线浏览。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_format_IIIF-IIIF.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? iiifApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: iiifApis.length },
    { name: 'constructor', cn: '构造函数', count: iiifApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: iiifApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return iiifApis
  if (currentCategory.value === 'constructor') return iiifApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return iiifApis.filter(a => a.type === 'method')
  return iiifApis
})

const iiifApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 IIIF 格式实例。IIIF 格式用于读取 IIIF 图像服务信息清单（Manifest），支持 IIIF Presentation API 和 Image API。',
    usage: `import IIIF from 'ol/format/IIIF.js';

// 创建 IIIF 格式实例
const iiifFormat = new IIIF();

// 从 IIIF 信息清单读取
fetch('https://iiif.example.org/manifest.json')
  .then(response => response.json())
  .then(manifest => {
    const iiifData = iiifFormat.readManifest(manifest);
    console.log(iiifData);
  });`,
    params: [],
    returns: { type: 'IIIF', description: '新的 IIIF 格式实例' }
  },
  {
    name: 'readManifest',
    cn: '读取信息清单',
    type: 'method',
    category: 'methods',
    description: '从 IIIF Presentation API 信息清单中读取数据。解析 IIIF Manifest JSON 并提取图像服务信息。',
    usage: `import IIIF from 'ol/format/IIIF.js';

const format = new IIIF();

// 从 IIIF Manifest 对象读取
const manifestData = format.readManifest(manifestJson);

// 获取画布（Canvases）
const canvases = manifestData.canvases;

// 获取图像服务
const imageServices = manifestData.imageServices;

// 用于创建 IIIF 源
const iiifSource = new IIIFSource({
  format: format,
  manifest: manifestData
});`,
    params: [
      { name: 'manifest', type: 'Object', default: '', description: 'IIIF Presentation API Manifest JSON 对象' }
    ],
    returns: { type: 'Object', description: '解析后的 IIIF 信息清单数据' }
  },
  {
    name: 'readImageInfo',
    cn: '读取图像信息',
    type: 'method',
    category: 'methods',
    description: '从 IIIF Image API 信息中读取图像服务数据。解析 IIIF Image Information JSON。',
    usage: `import IIIF from 'ol/format/IIIF.js';

const format = new IIIF();

// 从 IIIF Image Info 读取
fetch('https://iiif.example.org/image/info.json')
  .then(response => response.json())
  .then(infoJson => {
    const imageInfo = format.readImageInfo(infoJson);
    console.log('图像宽度:', imageInfo.width);
    console.log('图像高度:', imageInfo.height);
    console.log('支持的格式:', imageInfo.formats);
  });`,
    params: [
      { name: 'infoJson', type: 'Object', default: '', description: 'IIIF Image API Information JSON 对象' }
    ],
    returns: { type: 'Object', description: '解析后的 IIIF 图像信息' }
  },
  {
    name: 'getImageServiceUrl',
    cn: '获取图像服务 URL',
    type: 'method',
    category: 'methods',
    description: '从 IIIF 资源中提取图像服务 URL。用于构建图像请求地址。',
    usage: `import IIIF from 'ol/format/IIIF.js';

const format = new IIIF();

// 从 Manifest 获取图像服务 URL
const manifestData = format.readManifest(manifestJson);
const imageUrl = format.getImageServiceUrl(manifestData, 0);

// 构建完整的图像请求
const regionUrl = imageUrl + '/full/full/0/default.jpg';`,
    params: [
      { name: 'manifestData', type: 'Object', default: '', description: 'IIIF Manifest 数据' },
      { name: 'canvasIndex', type: 'number', default: '0', description: '画布索引，默认为第一个' }
    ],
    returns: { type: 'string', description: 'IIIF 图像服务基础 URL' }
  },
  {
    name: 'getTileInfo',
    cn: '获取瓦片信息',
    type: 'method',
    category: 'methods',
    description: '从 IIIF 图像信息中获取瓦片相关配置。用于瓦片源配置。',
    usage: `import IIIF from 'ol/format/IIIF.js';

const format = new IIIF();

// 获取瓦片信息
const imageInfo = format.readImageInfo(infoJson);
const tileInfo = format.getTileInfo(imageInfo);

console.log('瓦片大小:', tileInfo.tileSize);
console.log('支持的缩放级别:', tileInfo.zoomLevels);`,
    params: [
      { name: 'imageInfo', type: 'Object', default: '', description: 'IIIF 图像信息对象' }
    ],
    returns: { type: 'Object', description: '瓦片配置信息，包括 tileSize、zoomLevels 等' }
  },
  {
    name: 'getResolution',
    cn: '获取分辨率',
    type: 'method',
    category: 'methods',
    description: '根据缩放级别计算 IIIF 图像的分辨率。',
    usage: `import IIIF from 'ol/format/IIIF.js';

const format = new IIIF();

// 获取特定缩放级别的分辨率
const imageInfo = format.readImageInfo(infoJson);
const resolution = format.getResolution(imageInfo, zoomLevel);

console.log('分辨率:', resolution);`,
    params: [
      { name: 'imageInfo', type: 'Object', default: '', description: 'IIIF 图像信息对象' },
      { name: 'zoomLevel', type: 'number', default: '', description: '缩放级别' }
    ],
    returns: { type: 'number', description: '该缩放级别的分辨率' }
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
