<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>ImageWMS - WMS 图像源 API</h2>
            <p class="description">
              ImageWMS 源用于从 OGC Web Map Service (WMS) 获取地图图像。
              它支持 WMS 1.3.0 和 1.1.1 版本，可动态请求地图图像并显示在地图上。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_ImageWMS-ImageWMS.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? imageWmsApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: imageWmsApis.length },
    { name: 'constructor', cn: '构造函数', count: imageWmsApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: imageWmsApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return imageWmsApis
  if (currentCategory.value === 'constructor') return imageWmsApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return imageWmsApis.filter(a => a.type === 'method')
  return imageWmsApis
})

const imageWmsApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 ImageWMS 源实例。ImageWMS 用于从 WMS 服务动态请求地图图像。',
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';
import ImageLayer from 'ol/layer/Image.js';

// 创建 ImageWMS 源
const wmsSource = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms',
  params: {
    'LAYERS': 'topp:states',
    'TILED': true
  },
  ratio: 1,
  serverType: 'geoserver'
});

// 添加到地图
const wmsLayer = new ImageLayer({
  source: wmsSource
});

map.addLayer(wmsLayer);`,
    params: [
      { name: 'url', type: 'string', default: 'undefined', description: 'WMS 服务端 URL' },
      { name: 'params', type: 'Object', default: '{}', description: 'WMS 参数，如 LAYERS, STYLES, FORMAT 等' },
      { name: 'ratio', type: 'number', default: '1.5', description: '图像请求范围与视口比例，>1 可减少重绘' },
      { name: 'serverType', type: 'string', default: 'undefined', description: '服务器类型：geoserver, geowebcache, mapserver, qgis 等' },
      { name: 'projection', type: 'string|Projection', default: 'undefined', description: '源投影，默认与地图相同' },
      { name: 'attributions', type: 'string|Array<string>', default: 'undefined', description: '版权信息' },
      { name: 'crossOrigin', type: 'string', default: 'undefined', description: 'CORS 设置，如 anonymous' },
      { name: 'hidpi', type: 'boolean', default: 'true', description: '是否使用高分辨率设备像素比' }
    ],
    returns: { type: 'ImageWMS', description: '新的 ImageWMS 源实例' }
  },
  {
    name: 'getUrl',
    cn: '获取 URL',
    type: 'method',
    category: 'methods',
    description: '获取 WMS 服务的 URL 地址。',
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';

const source = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms'
});

console.log(source.getUrl()); // 'https://ahocevar.com/geoserver/wms'`,
    params: [],
    returns: { type: 'string', description: 'WMS 服务 URL' }
  },
  {
    name: 'setUrl',
    cn: '设置 URL',
    type: 'method',
    category: 'methods',
    description: '设置 WMS 服务的 URL 地址。设置后会自动刷新图像。',
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';

const source = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms'
});

// 更改 WMS 服务端
source.setUrl('https://another-server.com/geoserver/wms');

// 图像会自动重新加载`,
    params: [
      { name: 'url', type: 'string', default: '', description: '新的 WMS 服务 URL' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getParams',
    cn: '获取参数',
    type: 'method',
    category: 'methods',
    description: '获取当前设置的 WMS 参数对象。',
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';

const source = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms',
  params: {
    'LAYERS': 'topp:states',
    'STYLES': ''
  }
});

const params = source.getParams();
console.log(params.LAYERS); // 'topp:states'`,
    params: [],
    returns: { type: 'Object', description: 'WMS 参数对象' }
  },
  {
    name: 'updateParams',
    cn: '更新参数',
    type: 'method',
    category: 'methods',
    description: '更新 WMS 参数。会合并新参数到现有参数，并自动刷新图像。',
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';

const source = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms',
  params: {
    'LAYERS': 'topp:states'
  }
});

// 更新图层
source.updateParams({
  'LAYERS': 'topp:roads',
  'STYLES': 'default'
});

// 切换可见性
source.updateParams({
  'LAYERS': 'topp:states,topp:roads'
});

// 更改样式
source.updateParams({
  'STYLES': 'population'
});`,
    params: [
      { name: 'params', type: 'Object', default: '', description: '要更新的 WMS 参数' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getImageLoadFunction',
    cn: '获取加载函数',
    type: 'method',
    category: 'methods',
    description: '获取当前使用的图像加载函数。',
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';

const source = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms'
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
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';

const source = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms'
});

// 设置自定义加载函数
source.setImageLoadFunction((image, src) => {
  const img = image.getImage();

  img.onload = () => {
    console.log('WMS 图像加载成功');
  };

  img.onerror = () => {
    console.error('WMS 图像加载失败:', src);
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
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';

const source = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms',
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
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';

const source = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms',
  ratio: 1.5
});

// 增加比例（请求更大范围的图像）
source.setRatio(2);

// 减少比例（请求更小范围的图像）
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
    usage: `import ImageWMS from 'ol/source/ImageWMS.js';

const source = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms'
});

// 强制重新加载图像
source.refresh();

// 可用于在参数更改后强制刷新`,
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
