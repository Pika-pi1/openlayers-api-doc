<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Raster - 栅格源 API</h2>
            <p class="description">
              Raster 源用于对多个源进行像素级操作。它允许使用着色器或自定义操作函数处理栅格数据，
              适用于遥感分析、地形计算、图像滤镜等场景。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_source_Raster-Raster.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? rasterApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'constructor': 'primary',
    'method': 'success',
    'event': 'warning'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: rasterApis.length },
    { name: 'constructor', cn: '构造函数', count: rasterApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: rasterApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: rasterApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return rasterApis
  if (currentCategory.value === 'constructor') return rasterApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return rasterApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return rasterApis.filter(a => a.type === 'event')
  return rasterApis
})

const rasterApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 Raster 源实例。Raster 源用于对多个源进行像素级操作，支持 WebGL 着色器和自定义操作函数。',
    usage: `import Raster from 'ol/source/Raster.js';
import TileSource from 'ol/source/Tile.js';
import OSM from 'ol/source/OSM.js';

// 创建 Raster 源（使用操作函数）
const rasterSource = new Raster({
  sources: [
    new OSM()
  ],
  operation: (pixels, data) => {
    // pixels[0] 是第一个源的像素数据
    const pixel = pixels[0];
    // 将图像转为灰度
    const luminance = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
    return [luminance, luminance, luminance, pixel[3]];
  }
});

// 添加到地图
const rasterLayer = new Layer({
  source: rasterSource
});`,
    params: [
      { name: 'sources', type: 'Array<Source>', default: '[]', description: '输入源数组，提供栅格数据' },
      { name: 'operation', type: 'Function', default: 'undefined', description: '操作函数，处理像素数据' },
      { name: 'operationType', type: 'string', default: '"pixel"', description: '操作类型：pixel（像素级）或 image（图像级）' },
      { name: 'lib', type: 'Object', default: 'undefined', description: '传递给操作函数的辅助函数库' },
      { name: 'threads', type: 'number', default: '1', description: '处理线程数' },
      { name: 'layerCount', type: 'number', default: '1', description: '输出图层数量' }
    ],
    returns: { type: 'Raster', description: '新的 Raster 源实例' }
  },
  {
    name: 'getSources',
    cn: '获取源',
    type: 'method',
    category: 'methods',
    description: '获取 Raster 源使用的所有输入源。返回创建时指定的源数组。',
    usage: `import Raster from 'ol/source/Raster.js';
import OSM from 'ol/source/OSM.js';

const osmSource = new OSM();
const rasterSource = new Raster({
  sources: [osmSource]
});

const sources = rasterSource.getSources();
console.log(sources.length); // 1
console.log(sources[0] === osmSource); // true`,
    params: [],
    returns: { type: 'Array<Source>', description: '输入源数组' }
  },
  {
    name: 'setSources',
    cn: '设置源',
    type: 'method',
    category: 'methods',
    description: '设置 Raster 源的输入源。更改后会自动刷新栅格数据。',
    usage: `import Raster from 'ol/source/Raster.js';
import OSM from 'ol/source/OSM.js';
import Stamen from 'ol/source/Stamen.js';

const rasterSource = new Raster({
  sources: [new OSM()]
});

// 更改输入源
rasterSource.setSources([new Stamen({ layer: 'watercolor' })]);

// 栅格数据会自动重新计算`,
    params: [
      { name: 'sources', type: 'Array<Source>', default: '', description: '新的输入源数组' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getOperation',
    cn: '获取操作函数',
    type: 'method',
    category: 'methods',
    description: '获取当前使用的操作函数。返回创建时设置的处理函数。',
    usage: `import Raster from 'ol/source/Raster.js';
import OSM from 'ol/source/OSM.js';

const operationFn = (pixels, data) => {
  const pixel = pixels[0];
  return [pixel[0] * 0.5, pixel[1] * 0.5, pixel[2] * 0.5, pixel[3]];
};

const rasterSource = new Raster({
  sources: [new OSM()],
  operation: operationFn
});

const currentOp = rasterSource.getOperation();
console.log(currentOp === operationFn); // true`,
    params: [],
    returns: { type: 'Function', description: '当前操作函数' }
  },
  {
    name: 'setOperation',
    cn: '设置操作函数',
    type: 'method',
    category: 'methods',
    description: '设置新的操作函数。设置后会自动刷新栅格数据，重新处理所有像素。',
    usage: `import Raster from 'ol/source/Raster.js';
import OSM from 'ol/source/OSM.js';

const rasterSource = new Raster({
  sources: [new OSM()],
  operation: (pixels) => pixels[0] // 初始无操作
});

// 更改为灰度操作
rasterSource.setOperation((pixels) => {
  const pixel = pixels[0];
  const luminance = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
  return [luminance, luminance, luminance, pixel[3]];
});

// 像素会自动重新处理`,
    params: [
      { name: 'operation', type: 'Function', default: '', description: '新的操作函数' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'setLib',
    cn: '设置库函数',
    type: 'method',
    category: 'methods',
    description: '设置传递给操作函数的辅助函数库。lib 中的函数可在操作函数中直接使用。',
    usage: `import Raster from 'ol/source/Raster.js';
import OSM from 'ol/source/OSM.js';

const rasterSource = new Raster({
  sources: [new OSM()],
  lib: {
    toGrayscale: function(pixel) {
      const luminance = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
      return [luminance, luminance, luminance, pixel[3]];
    }
  },
  operation: (pixels) => {
    // 可直接使用 lib 中的函数
    return toGrayscale(pixels[0]);
  }
});`,
    params: [
      { name: 'lib', type: 'Object', default: '', description: '辅助函数库对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'beforeoperations',
    cn: '操作前事件',
    type: 'event',
    category: 'events',
    description: '在栅格操作执行前触发。可用于设置操作所需的数据或状态。',
    usage: `import Raster from 'ol/source/Raster.js';
import OSM from 'ol/source/OSM.js';

const rasterSource = new Raster({
  sources: [new OSM()],
  operation: (pixels, data) => {
    // 使用 data 中的时间戳
    console.log('处理时间:', data.time);
    return pixels[0];
  }
});

// 在操作前设置数据
rasterSource.on('beforeoperations', (event) => {
  event.data.time = Date.now();
  console.log('准备执行操作');
});`,
    params: [],
    returns: { type: 'Object', description: '事件对象，包含 data 属性（可传递操作的数据）' }
  },
  {
    name: 'afteroperations',
    cn: '操作后事件',
    type: 'event',
    category: 'events',
    description: '在栅格操作执行后触发。可用于获取处理结果或清理状态。',
    usage: `import Raster from 'ol/source/Raster.js';
import OSM from 'ol/source/OSM.js';

const rasterSource = new Raster({
  sources: [new OSM()],
  operation: (pixels) => pixels[0]
});

// 监听操作完成
rasterSource.on('afteroperations', (event) => {
  console.log('操作完成');
  console.log('图像数据:', event.imageData);
});`,
    params: [],
    returns: { type: 'Object', description: '事件对象，包含 imageData 属性（处理后的图像数据）' }
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
