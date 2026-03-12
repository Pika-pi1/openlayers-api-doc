<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>ImageCanvas - 画布图像源 API</h2>
            <p class="description">
              ImageCanvas 源用于从 HTML Canvas 元素创建图像源。
              它允许使用 Canvas API 动态生成地图内容，适用于自定义渲染、数据可视化等场景。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_ImageCanvas-ImageCanvas.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? imageCanvasApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: imageCanvasApis.length },
    { name: 'constructor', cn: '构造函数', count: imageCanvasApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: imageCanvasApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return imageCanvasApis
  if (currentCategory.value === 'constructor') return imageCanvasApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return imageCanvasApis.filter(a => a.type === 'method')
  return imageCanvasApis
})

const imageCanvasApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 ImageCanvas 源实例。ImageCanvas 用于从 HTML Canvas 元素创建图像源。',
    usage: `import ImageCanvas from 'ol/source/ImageCanvas.js';
import ImageLayer from 'ol/layer/Image.js';

// 创建 Canvas 元素
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;

const ctx = canvas.getContext('2d');

// 绘制内容
ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
ctx.fillRect(0, 0, 800, 600);

// 创建 ImageCanvas 源
const canvasSource = new ImageCanvas({
  canvas: canvas,
  imageExtent: [-180, -90, 180, 90]  // 地理范围
});

// 添加到地图
const canvasLayer = new ImageLayer({
  source: canvasSource
});

map.addLayer(canvasLayer);`,
    params: [
      { name: 'canvas', type: 'HTMLCanvasElement', default: 'undefined', description: 'HTML Canvas 元素' },
      { name: 'imageExtent', type: 'Array<number>', default: 'undefined', description: 'Canvas 覆盖的地理范围 [minX, minY, maxX, maxY]' },
      { name: 'projection', type: 'string|Projection', default: '"EPSG:3857"', description: '源投影' },
      { name: 'attributions', type: 'string|Array<string>', default: 'undefined', description: '版权信息' },
      { name: 'crossOrigin', type: 'string', default: '"anonymous"', description: 'CORS 设置' }
    ],
    returns: { type: 'ImageCanvas', description: '新的 ImageCanvas 源实例' }
  },
  {
    name: 'getCanvas',
    cn: '获取 Canvas',
    type: 'method',
    category: 'methods',
    description: '获取源使用的 Canvas 元素。',
    usage: `import ImageCanvas from 'ol/source/ImageCanvas.js';

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;

const source = new ImageCanvas({
  canvas: canvas,
  imageExtent: [-180, -90, 180, 90]
});

const canvasEl = source.getCanvas();
console.log(canvasEl === canvas); // true`,
    params: [],
    returns: { type: 'HTMLCanvasElement', description: 'Canvas 元素' }
  },
  {
    name: 'setCanvas',
    cn: '设置 Canvas',
    type: 'method',
    category: 'methods',
    description: '设置源使用的 Canvas 元素。设置后会自动刷新图像。',
    usage: `import ImageCanvas from 'ol/source/ImageCanvas.js';

const canvas1 = document.createElement('canvas');
const canvas2 = document.createElement('canvas');

const source = new ImageCanvas({
  canvas: canvas1,
  imageExtent: [-180, -90, 180, 90]
});

// 更改 Canvas
source.setCanvas(canvas2);

// 图像会自动重新加载`,
    params: [
      { name: 'canvas', type: 'HTMLCanvasElement', default: '', description: '新的 Canvas 元素' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getImageExtent',
    cn: '获取图像范围',
    type: 'method',
    category: 'methods',
    description: '获取 Canvas 覆盖的地理范围。',
    usage: `import ImageCanvas from 'ol/source/ImageCanvas.js';

const source = new ImageCanvas({
  canvas: document.createElement('canvas'),
  imageExtent: [-180, -90, 180, 90]
});

const extent = source.getImageExtent();
console.log(extent); // [-180, -90, 180, 90]`,
    params: [],
    returns: { type: 'Array<number>', description: '地理范围 [minX, minY, maxX, maxY]' }
  },
  {
    name: 'setImageExtent',
    cn: '设置图像范围',
    type: 'method',
    category: 'methods',
    description: '设置 Canvas 覆盖的地理范围。设置后会自动刷新图像。',
    usage: `import ImageCanvas from 'ol/source/ImageCanvas.js';

const source = new ImageCanvas({
  canvas: document.createElement('canvas'),
  imageExtent: [-180, -90, 180, 90]
});

// 更改范围
source.setImageExtent([-118, 33, -117, 34]);

// 图像会自动重新加载`,
    params: [
      { name: 'extent', type: 'Array<number>', default: '', description: '新的地理范围 [minX, minY, maxX, maxY]' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'methods',
    description: '获取源使用的投影对象。',
    usage: `import ImageCanvas from 'ol/source/ImageCanvas.js';

const source = new ImageCanvas({
  canvas: document.createElement('canvas'),
  imageExtent: [-180, -90, 180, 90],
  projection: 'EPSG:4326'
});

const projection = source.getProjection();
console.log(projection.getCode()); // 'EPSG:4326'`,
    params: [],
    returns: { type: 'Projection', description: '投影对象' }
  },
  {
    name: 'getImage',
    cn: '获取图像',
    type: 'method',
    category: 'methods',
    description: '获取当前加载的图像对象。返回 ImageWrapper 对象。',
    usage: `import ImageCanvas from 'ol/source/ImageCanvas.js';

const source = new ImageCanvas({
  canvas: document.createElement('canvas'),
  imageExtent: [-180, -90, 180, 90]
});

const image = source.getImage();
if (image) {
  console.log('图像状态:', image.getState());
  console.log('图像元素:', image.getImage());
}`,
    params: [],
    returns: { type: 'ImageWrapper', description: '图像包装对象' }
  },
  {
    name: 'refresh',
    cn: '刷新源',
    type: 'method',
    category: 'methods',
    description: '刷新源，重新加载 Canvas 图像。',
    usage: `import ImageCanvas from 'ol/source/ImageCanvas.js';

const source = new ImageCanvas({
  canvas: document.createElement('canvas'),
  imageExtent: [-180, -90, 180, 90]
});

// 在 Canvas 上绘制新内容后刷新
const canvas = source.getCanvas();
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);

// 刷新源以显示新内容
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
