<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Vector Renderer - 矢量渲染器 API</h2>
            <p class="description">
              Vector Renderer 模块提供了矢量要素渲染的核心工具函数。
              包括要素排序、像素容差计算、要素渲染等功能。
              这些函数主要用于 Canvas 矢量图层渲染器内部。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_renderer_vector.html" target="_blank">
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
import { Folder, FolderOpened, Operation, Reading, Document, Select, Link } from '@element-plus/icons-vue'

const activeNames = ref(['defaultOrder', 'getSquaredTolerance'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? vectorRendererApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'function': 'primary',
    'typedef': 'warning'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: vectorRendererApis.length },
    { name: 'function', cn: '函数', count: vectorRendererApis.filter(a => a.type === 'function').length },
    { name: 'typedef', cn: '类型定义', count: vectorRendererApis.filter(a => a.type === 'typedef').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return vectorRendererApis
  return vectorRendererApis.filter(a => a.category === currentCategory.value)
})

const vectorRendererApis = [
  {
    name: 'defaultOrder',
    cn: '默认排序函数',
    type: 'function',
    category: 'function',
    description: '默认的要素排序函数。用于比较两个要素的渲染顺序。返回正值表示 feature1 应该排在 feature2 之后，负值表示之前，0 表示顺序相同。',
    usage: `import { defaultOrder } from 'ol/renderer/vector.js';

// 使用默认排序函数
const feature1 = new Feature({ id: 1 });
const feature2 = new Feature({ id: 2 });

const order = defaultOrder(feature1, feature2);
console.log('排序结果:', order);

// 在自定义排序中使用
const features = [feature1, feature2, feature3];
features.sort(defaultOrder);`,
    params: [
      { name: 'feature1', type: 'import("../Feature.js").FeatureLike', default: 'undefined', description: '第一个要素' },
      { name: 'feature2', type: 'import("../Feature.js").FeatureLike', default: 'undefined', description: '第二个要素' }
    ],
    returns: { type: 'number', description: '排序比较结果' }
  },
  {
    name: 'getSquaredTolerance',
    cn: '获取平方容差',
    type: 'function',
    category: 'function',
    description: '根据分辨率和像素比计算平方像素容差。用于简化几何形状时控制简化程度，平方值用于避免开方运算提高性能。',
    usage: `import { getSquaredTolerance } from 'ol/renderer/vector.js';

// 计算平方容差
const resolution = 10;  // 地图分辨率
const pixelRatio = 2;   // 设备像素比

const squaredTolerance = getSquaredTolerance(resolution, pixelRatio);
console.log('平方容差:', squaredTolerance);

// 用于几何简化
const simplified = geometry.simplify(squaredTolerance);`,
    params: [
      { name: 'resolution', type: 'number', default: 'undefined', description: '地图分辨率' },
      { name: 'pixelRatio', type: 'number', default: 'undefined', description: '设备像素比' }
    ],
    returns: { type: 'number', description: '平方像素容差值' }
  },
  {
    name: 'getTolerance',
    cn: '获取容差',
    type: 'function',
    category: 'function',
    description: '根据分辨率和像素比计算像素容差。用于简化几何形状时控制简化程度。',
    usage: `import { getTolerance } from 'ol/renderer/vector.js';

// 计算容差
const resolution = 10;  // 地图分辨率
const pixelRatio = 2;   // 设备像素比

const tolerance = getTolerance(resolution, pixelRatio);
console.log('容差:', tolerance);

// 用于几何简化
const simplified = geometry.simplify(tolerance * tolerance);`,
    params: [
      { name: 'resolution', type: 'number', default: 'undefined', description: '地图分辨率' },
      { name: 'pixelRatio', type: 'number', default: 'undefined', description: '设备像素比' }
    ],
    returns: { type: 'number', description: '像素容差值' }
  },
  {
    name: 'renderFeature',
    cn: '渲染要素',
    type: 'function',
    category: 'function',
    description: '将要素渲染到 Canvas 构建组。这是矢量渲染的核心函数，负责将要素的几何形状和样式转换为 Canvas 绘图指令。',
    usage: `import { renderFeature } from 'ol/renderer/vector.js';
import CanvasBuilderGroup from 'ol/render/canvas/BuilderGroup.js';

// 创建构建组
const builderGroup = new CanvasBuilderGroup(
  1024,  // 过大的容差
  1,     // 分辨率
  1      // 像素比
);

// 渲染要素
const feature = new Feature(new Point([0, 0]));
const style = new Style({
  image: new Circle({
    radius: 10,
    fill: new Fill({ color: 'red' })
  })
});

const squaredTolerance = 1;
const listener = (event) => console.log('渲染事件:', event);

const isLoading = renderFeature(
  builderGroup,
  feature,
  style,
  squaredTolerance,
  listener
);

console.log('是否正在加载:', isLoading);`,
    params: [
      { name: 'replayGroup', type: 'import("../render/canvas/BuilderGroup.js").default', default: 'undefined', description: 'Canvas 构建组' },
      { name: 'feature', type: 'import("../Feature.js").FeatureLike', default: 'undefined', description: '要渲染的要素' },
      { name: 'style', type: 'import("../style/Style.js").default', default: 'undefined', description: '要素样式' },
      { name: 'squaredTolerance', type: 'number', default: 'undefined', description: '平方容差' },
      { name: 'listener', type: 'function(import("../events/Event.js").default): void', default: 'undefined', description: '事件监听函数' },
      { name: 'transform', type: 'import("../proj.js").TransformFunction', default: 'undefined', description: '从用户坐标到视图投影的变换函数' },
      { name: 'declutter', type: 'boolean', default: 'undefined', description: '是否启用去 clutter' },
      { name: 'index', type: 'number', default: 'undefined', description: '渲染顺序索引' }
    ],
    returns: { type: 'boolean', description: '如果样式正在加载则返回 true' }
  },
  {
    name: 'FeatureCallback',
    cn: '要素回调函数',
    type: 'typedef',
    category: 'typedef',
    description: '要素回调函数类型定义。用于 forEachFeatureAtPixel 等操作。回调函数接收三个参数：像素处的要素、要素所在的图层（非托管图层为 null）、要素的几何形状。',
    usage: `// FeatureCallback 类型定义
/**
 * @typedef {Function} FeatureCallback
 * @param {import("../Feature.js").FeatureLike} feature 像素处的要素
 * @param {import("../layer/Layer.js").default<import("../source/Source").default>|null} layer 要素所在图层
 * @param {import("../geom/SimpleGeometry.js").default} geometry 要素几何形状
 * @return {T} 返回值
 */

// 使用示例
const callback = (feature, layer, geometry) => {
  if (feature && layer) {
    console.log('找到要素:', feature.getId());
    console.log('所在图层:', layer.get('name'));
    console.log('几何形状:', geometry.getType());
    return feature;  // 返回找到的要素
  }
  return undefined;
};

// 在 map.forEachFeatureAtPixel 中使用
const result = map.forEachFeatureAtPixel(
  [100, 100],  // 像素坐标
  callback
);`,
    params: [
      { name: 'feature', type: 'import("../Feature.js").FeatureLike', default: 'undefined', description: '像素处的要素或渲染要素' },
      { name: 'layer', type: 'import("../layer/Layer.js").default<import("../source/Source").default>|null', default: 'undefined', description: '要素所在图层，非托管图层为 null' },
      { name: 'geometry', type: 'import("../geom/SimpleGeometry.js").default', default: 'undefined', description: '要素的简单几何形状' }
    ],
    returns: { type: 'T', description: '回调返回的泛型值' }
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
