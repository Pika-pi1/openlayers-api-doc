<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>ImageMapGuide - MapGuide 图像源 API</h2>
            <p class="description">
              ImageMapGuide 源用于从 Autodesk MapGuide 服务器获取地图图像。
              它支持 MapGuide 的 GETMAPIMAGE 操作，可动态请求地图图像。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_ImageMapGuide-ImageMapGuide.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? imageMapGuideApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: imageMapGuideApis.length },
    { name: 'constructor', cn: '构造函数', count: imageMapGuideApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: imageMapGuideApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return imageMapGuideApis
  if (currentCategory.value === 'constructor') return imageMapGuideApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return imageMapGuideApis.filter(a => a.type === 'method')
  return imageMapGuideApis
})

const imageMapGuideApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 ImageMapGuide 源实例。ImageMapGuide 用于从 Autodesk MapGuide 服务器获取地图图像。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';
import ImageLayer from 'ol/layer/Image.js';

// 创建 MapGuide 图像源
const mapGuideSource = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi',
  params: {
    'MAPDEFINITION': 'Library://Samples/Guatemala/Guatemala.MapDefinition',
    'FORMAT': 'PNG',
    'LOCALE': 'en'
  },
  ratio: 1,
  projection: 'EPSG:3857'
});

// 添加到地图
const mapGuideLayer = new ImageLayer({
  source: mapGuideSource
});

map.addLayer(mapGuideLayer);`,
    params: [
      { name: 'url', type: 'string', default: 'undefined', description: 'MapGuide 服务器 URL' },
      { name: 'params', type: 'Object', default: '{}', description: 'MapGuide 参数，如 MAPDEFINITION, FORMAT 等' },
      { name: 'ratio', type: 'number', default: '1.5', description: '图像请求范围与视口比例' },
      { name: 'projection', type: 'string|Projection', default: 'undefined', description: '源投影' },
      { name: 'attributions', type: 'string|Array<string>', default: 'undefined', description: '版权信息' },
      { name: 'crossOrigin', type: 'string', default: 'undefined', description: 'CORS 设置' },
      { name: 'imageLoadFunction', type: 'Function', default: 'undefined', description: '自定义图像加载函数' },
      { name: 'hidpi', type: 'boolean', default: 'true', description: '是否使用高分辨率设备像素比' }
    ],
    returns: { type: 'ImageMapGuide', description: '新的 ImageMapGuide 源实例' }
  },
  {
    name: 'getUrl',
    cn: '获取 URL',
    type: 'method',
    category: 'methods',
    description: '获取 MapGuide 服务的 URL 地址。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';

const source = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi'
});

console.log(source.getUrl()); // URL 地址`,
    params: [],
    returns: { type: 'string', description: 'MapGuide 服务 URL' }
  },
  {
    name: 'setUrl',
    cn: '设置 URL',
    type: 'method',
    category: 'methods',
    description: '设置 MapGuide 服务的 URL 地址。设置后会自动刷新图像。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';

const source = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi'
});

// 更改服务
source.setUrl('https://another-mapguide.example.com/mapguide/mapagent.fcgi');

// 图像会自动重新加载`,
    params: [
      { name: 'url', type: 'string', default: '', description: '新的 MapGuide 服务 URL' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getParams',
    cn: '获取参数',
    type: 'method',
    category: 'methods',
    description: '获取当前设置的 MapGuide 参数对象。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';

const source = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi',
  params: {
    'MAPDEFINITION': 'Library://Samples/Guatemala/Guatemala.MapDefinition'
  }
});

const params = source.getParams();
console.log(params.MAPDEFINITION);`,
    params: [],
    returns: { type: 'Object', description: 'MapGuide 参数对象' }
  },
  {
    name: 'updateParams',
    cn: '更新参数',
    type: 'method',
    category: 'methods',
    description: '更新 MapGuide 参数。会合并新参数到现有参数，并自动刷新图像。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';

const source = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi',
  params: {
    'MAPDEFINITION': 'Library://Samples/Guatemala/Guatemala.MapDefinition'
  }
});

// 更新地图定义
source.updateParams({
  'MAPDEFINITION': 'Library://Samples/World/World.MapDefinition'
});

// 更改格式
source.updateParams({
  'FORMAT': 'PNG32'
});`,
    params: [
      { name: 'params', type: 'Object', default: '', description: '要更新的 MapGuide 参数' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getImageLoadFunction',
    cn: '获取加载函数',
    type: 'method',
    category: 'methods',
    description: '获取当前使用的图像加载函数。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';

const source = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi'
});

const loadFn = source.getImageLoadFunction();
console.log(typeof loadFn); // 'function'`,
    params: [],
    returns: { type: 'Function', description: '图像加载函数' }
  },
  {
    name: 'setImageLoadFunction',
    cn: '设置加载函数',
    type: 'method',
    category: 'methods',
    description: '设置自定义图像加载函数。可用于实现自定义的加载逻辑或错误处理。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';

const source = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi'
});

// 设置自定义加载函数
source.setImageLoadFunction((image, src) => {
  const img = image.getImage();

  img.onload = () => {
    console.log('MapGuide 图像加载成功:', src);
  };

  img.onerror = () => {
    console.error('MapGuide 图像加载失败:', src);
  };

  img.src = src;
});`,
    params: [
      { name: 'imageLoadFunction', type: 'Function', default: '', description: '自定义图像加载函数' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getRatio',
    cn: '获取比例',
    type: 'method',
    category: 'methods',
    description: '获取图像请求范围与视口的比例。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';

const source = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi',
  ratio: 2
});

console.log(source.getRatio()); // 2`,
    params: [],
    returns: { type: 'number', description: '请求范围与视口比例' }
  },
  {
    name: 'setRatio',
    cn: '设置比例',
    type: 'method',
    category: 'methods',
    description: '设置图像请求范围与视口的比例。较大的比例可减少平移时的重绘次数。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';

const source = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi',
  ratio: 1.5
});

// 增加比例
source.setRatio(2);

// 减少比例
source.setRatio(1);`,
    params: [
      { name: 'ratio', type: 'number', default: '', description: '请求范围与视口比例' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'refresh',
    cn: '刷新源',
    type: 'method',
    category: 'methods',
    description: '刷新源，重新加载当前视图的图像。',
    usage: `import ImageMapGuide from 'ol/source/ImageMapGuide.js';

const source = new ImageMapGuide({
  url: 'https://mapguide.example.com/mapguide/mapagent/mapagent.fcgi'
});

// 强制重新加载图像
source.refresh();`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
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
