<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>ImageStatic - 静态图像源 API</h2>
            <p class="description">
              ImageStatic 源用于在地图上显示单张静态图像。
              它允许将图像放置在指定的地理坐标范围内，适用于历史地图、航拍照片、自定义平面图等场景。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_ImageStatic-ImageStatic.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? imageStaticApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: imageStaticApis.length },
    { name: 'constructor', cn: '构造函数', count: imageStaticApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: imageStaticApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return imageStaticApis
  if (currentCategory.value === 'constructor') return imageStaticApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return imageStaticApis.filter(a => a.type === 'method')
  return imageStaticApis
})

const imageStaticApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 ImageStatic 源实例。ImageStatic 用于在地图上显示单张静态图像，图像会被放置在指定的地理范围内。',
    usage: `import ImageStatic from 'ol/source/ImageStatic.js';
import ImageLayer from 'ol/layer/Image.js';

// 创建静态图像源
const staticSource = new ImageStatic({
  url: 'https://example.com/floor-plan.png',
  imageExtent: [116.0, 39.5, 117.0, 40.5]  // [minX, minY, maxX, maxY]
});

// 添加到地图
const staticLayer = new ImageLayer({
  source: staticSource
});

map.addLayer(staticLayer);

// 使用 EPSG:3857 投影坐标
import { fromLonLat } from 'ol/proj.js';

const extent = [
  fromLonLat([116.0, 39.5]),
  fromLonLat([117.0, 40.5])
];

const source = new ImageStatic({
  url: 'https://example.com/map.png',
  imageExtent: [
    extent[0][0], extent[0][1],
    extent[1][0], extent[1][1]
  ]
});`,
    params: [
      { name: 'url', type: 'string', default: 'undefined', description: '静态图像的 URL 地址' },
      { name: 'imageExtent', type: 'Array<number>', default: 'undefined', description: '图像覆盖的地理范围 [minX, minY, maxX, maxY]' },
      { name: 'projection', type: 'string|Projection', default: '"EPSG:3857"', description: '源投影' },
      { name: 'attributions', type: 'string|Array<string>', default: 'undefined', description: '版权信息' },
      { name: 'crossOrigin', type: 'string', default: '"anonymous"', description: 'CORS 设置' },
      { name: 'imageSmoothing', type: 'boolean', default: 'true', description: '是否启用图像平滑' },
      { name: 'wrapX', type: 'boolean', default: 'false', description: '是否在 X 方向包裹世界' }
    ],
    returns: { type: 'ImageStatic', description: '新的 ImageStatic 源实例' }
  },
  {
    name: 'getImage',
    cn: '获取图像',
    type: 'method',
    category: 'methods',
    description: '获取当前加载的图像对象。返回 ImageWrapper 对象，包含图像元素和状态信息。',
    usage: `import ImageStatic from 'ol/source/ImageStatic.js';

const source = new ImageStatic({
  url: 'https://example.com/map.png',
  imageExtent: [116.0, 39.5, 117.0, 40.5]
});

const image = source.getImage();
if (image) {
  console.log('图像状态:', image.getState()); // 'idle', 'loading', 'loaded', 'error'
  console.log('图像元素:', image.getImage()); // HTMLImageElement
}`,
    params: [],
    returns: { type: 'ImageWrapper', description: '图像包装对象' }
  },
  {
    name: 'getImageExtent',
    cn: '获取图像范围',
    type: 'method',
    category: 'methods',
    description: '获取图像覆盖的地理范围。返回创建时设置的 imageExtent。',
    usage: `import ImageStatic from 'ol/source/ImageStatic.js';

const source = new ImageStatic({
  url: 'https://example.com/map.png',
  imageExtent: [116.0, 39.5, 117.0, 40.5]
});

const extent = source.getImageExtent();
console.log('图像范围:', extent); // [116.0, 39.5, 117.0, 40.5]

// 计算中心点
const centerX = (extent[0] + extent[2]) / 2;
const centerY = (extent[1] + extent[3]) / 2;
console.log('中心点:', [centerX, centerY]);`,
    params: [],
    returns: { type: 'Array<number>', description: '图像范围 [minX, minY, maxX, maxY]' }
  },
  {
    name: 'setImageExtent',
    cn: '设置图像范围',
    type: 'method',
    category: 'methods',
    description: '设置图像覆盖的地理范围。设置后会自动刷新图像。',
    usage: `import ImageStatic from 'ol/source/ImageStatic.js';

const source = new ImageStatic({
  url: 'https://example.com/map.png',
  imageExtent: [116.0, 39.5, 117.0, 40.5]
});

// 更改图像范围
source.setImageExtent([115.0, 39.0, 118.0, 41.0]);

// 图像会自动重新加载并缩放到新范围`,
    params: [
      { name: 'extent', type: 'Array<number>', default: '', description: '新的图像范围 [minX, minY, maxX, maxY]' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getUrl',
    cn: '获取 URL',
    type: 'method',
    category: 'methods',
    description: '获取静态图像的 URL 地址。',
    usage: `import ImageStatic from 'ol/source/ImageStatic.js';

const source = new ImageStatic({
  url: 'https://example.com/floor-plan.png',
  imageExtent: [116.0, 39.5, 117.0, 40.5]
});

console.log(source.getUrl()); // 'https://example.com/floor-plan.png'`,
    params: [],
    returns: { type: 'string', description: '图像 URL' }
  },
  {
    name: 'setUrl',
    cn: '设置 URL',
    type: 'method',
    category: 'methods',
    description: '设置静态图像的 URL 地址。设置后会自动加载新图像。',
    usage: `import ImageStatic from 'ol/source/ImageStatic.js';

const source = new ImageStatic({
  url: 'https://example.com/map1.png',
  imageExtent: [116.0, 39.5, 117.0, 40.5]
});

// 更改图像
source.setUrl('https://example.com/map2.png');

// 图像会自动重新加载`,
    params: [
      { name: 'url', type: 'string', default: '', description: '新的图像 URL' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getImageLoadFunction',
    cn: '获取加载函数',
    type: 'method',
    category: 'methods',
    description: '获取当前使用的图像加载函数。',
    usage: `import ImageStatic from 'ol/source/ImageStatic.js';

const source = new ImageStatic({
  url: 'https://example.com/map.png',
  imageExtent: [116.0, 39.5, 117.0, 40.5]
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
    usage: `import ImageStatic from 'ol/source/ImageStatic.js';

const source = new ImageStatic({
  url: 'https://example.com/map.png',
  imageExtent: [116.0, 39.5, 117.0, 40.5]
});

// 设置自定义加载函数
source.setImageLoadFunction((image, src) => {
  const img = image.getImage();

  img.onload = () => {
    console.log('静态图像加载成功:', src);
  };

  img.onerror = () => {
    console.error('静态图像加载失败:', src);
    // 可以设置重试逻辑或显示错误图像
  };

  img.src = src;
});`,
    params: [
      { name: 'imageLoadFunction', type: 'Function', default: '', description: '自定义图像加载函数' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'refresh',
    cn: '刷新源',
    type: 'method',
    category: 'methods',
    description: '刷新源，重新加载静态图像。',
    usage: `import ImageStatic from 'ol/source/ImageStatic.js';

const source = new ImageStatic({
  url: 'https://example.com/map.png',
  imageExtent: [116.0, 39.5, 117.0, 40.5]
});

// 强制重新加载图像
source.refresh();

// 可用于在图像更新后强制刷新`,
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
