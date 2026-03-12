<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>FeatureVector - 要素集合 API</h2>
            <p class="description">
              FeatureVector 是要素的集合，用于在矢量图层中显示。
              它提供了添加、移除、查找和遍历要素的方法。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_Feature.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? featureVectorApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: featureVectorApis.length },
    { name: 'constructor', cn: '构造函数', count: featureVectorApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: featureVectorApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: featureVectorApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return featureVectorApis
  if (currentCategory.value === 'constructor') return featureVectorApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return featureVectorApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return featureVectorApis.filter(a => a.type === 'event')
  return featureVectorApis
})

const featureVectorApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的要素集合。FeatureVector 是要素的集合，用于在矢量图层中显示和管理多个地理要素。',
    usage: `import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';

// 创建空要素集合
const features = new FeatureVector();

// 创建带要素数组的要素集合
const pointFeature = new Feature(new Point([0, 0]));
const lineFeature = new Feature(new LineString([[0, 0], [1, 1]]));

const features = new FeatureVector([pointFeature, lineFeature]);

// 添加到矢量源
const vectorSource = new VectorSource({
  features: features
});`,
    params: [
      { name: 'features', type: 'Array<Feature>', default: '[]', description: '可选的初始要素数组' }
    ],
    returns: { type: 'FeatureVector', description: '新的要素集合实例' }
  },
  {
    name: 'addFeature',
    cn: '添加要素',
    type: 'method',
    category: 'methods',
    description: '向集合中添加单个要素。如果要素已存在，则不会重复添加。',
    usage: `import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';

const features = new FeatureVector();

// 创建新要素
const feature = new Feature(new Point([116.4, 39.9]));
feature.set('name', '北京');

// 添加到集合
features.addFeature(feature);

// 监听添加事件
features.on('addfeature', (event) => {
  console.log('添加了要素:', event.element);
});`,
    params: [
      { name: 'feature', type: 'Feature', default: '', description: '要添加的要素' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'removeFeature',
    cn: '移除要素',
    type: 'method',
    category: 'methods',
    description: '从集合中移除单个要素。如果要素不存在，则不执行任何操作。',
    usage: `const features = new FeatureVector();
// ... 添加一些要素

// 移除特定要素
const featureToRemove = features.item(0);
features.removeFeature(featureToRemove);

// 监听移除事件
features.on('removefeature', (event) => {
  console.log('移除了要素:', event.element);
});`,
    params: [
      { name: 'feature', type: 'Feature', default: '', description: '要移除的要素' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getLength',
    cn: '获取数量',
    type: 'method',
    category: 'methods',
    description: '获取集合中要素的数量。',
    usage: `const features = new FeatureVector();

// 初始长度为 0
console.log(features.getLength()); // 0

// 添加要素后
features.addFeature(new Feature());
features.addFeature(new Feature());
console.log(features.getLength()); // 2`,
    params: [],
    returns: { type: 'number', description: '集合中要素的数量' }
  },
  {
    name: 'item',
    cn: '获取要素',
    type: 'method',
    category: 'methods',
    description: '根据索引获取集合中的要素。索引从 0 开始。',
    usage: `const features = new FeatureVector();
features.addFeature(new Feature());
features.addFeature(new Feature());

// 获取第一个要素
const firstFeature = features.item(0);

// 获取最后一个要素
const lastIndex = features.getLength() - 1;
const lastFeature = features.item(lastIndex);`,
    params: [
      { name: 'index', type: 'number', default: '', description: '要素的索引位置' }
    ],
    returns: { type: 'Feature', description: '指定索引的要素' }
  },
  {
    name: 'getArray',
    cn: '获取数组',
    type: 'method',
    category: 'methods',
    description: '获取集合中所有要素的数组。返回的是内部数组的引用，不是副本。',
    usage: `const features = new FeatureVector();
// ... 添加一些要素

// 获取要素数组
const featuresArray = features.getArray();

// 遍历数组
featuresArray.forEach(feature => {
  console.log(feature.getProperties());
});

// 注意：返回的是引用，修改会影响原集合`,
    params: [],
    returns: { type: 'Array<Feature>', description: '要素数组' }
  },
  {
    name: 'forEach',
    cn: '遍历要素',
    type: 'method',
    category: 'methods',
    description: '对集合中的每个要素执行回调函数。',
    usage: `const features = new FeatureVector();
// ... 添加一些要素

// 遍历所有要素
features.forEach((feature, index) => {
  console.log(\`要素 \${index}:\`, feature.getProperties());
});

// 带 thisArg 的遍历
const context = { count: 0 };
features.forEach(function(feature) {
  this.count++;
}, context);
console.log('总数:', context.count);`,
    params: [
      { name: 'callback', type: 'function', default: '', description: '对每个要素执行的回调函数' },
      { name: 'thisArg', type: 'Object', default: 'undefined', description: '回调函数的 this 上下文' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'clear',
    cn: '清空集合',
    type: 'method',
    category: 'methods',
    description: '清空集合中的所有要素。会触发 removefeature 事件。',
    usage: `const features = new FeatureVector();
// ... 添加一些要素

console.log('清空前:', features.getLength());

// 清空集合
features.clear();

console.log('清空后:', features.getLength()); // 0`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'clone',
    cn: '克隆集合',
    type: 'method',
    category: 'methods',
    description: '创建集合的浅拷贝。新集合包含对相同要素的引用。',
    usage: `const features = new FeatureVector();
// ... 添加一些要素

// 克隆集合
const clonedFeatures = features.clone();

// 两个集合长度相同
console.log(features.getLength() === clonedFeatures.getLength());

// 但引用的是相同的要素对象
console.log(features.item(0) === clonedFeatures.item(0)); // true`,
    params: [],
    returns: { type: 'FeatureVector', description: '克隆的要素集合' }
  },
  {
    name: 'contains',
    cn: '包含检查',
    type: 'method',
    category: 'methods',
    description: '检查集合是否包含指定的要素。',
    usage: `const features = new FeatureVector();
const feature = new Feature();
features.addFeature(feature);

// 检查是否包含要素
console.log(features.contains(feature)); // true

const otherFeature = new Feature();
console.log(features.contains(otherFeature)); // false`,
    params: [
      { name: 'feature', type: 'Feature', default: '', description: '要检查的要素' }
    ],
    returns: { type: 'boolean', description: '是否包含该要素' }
  },
  {
    name: 'getRange',
    cn: '获取范围',
    type: 'method',
    category: 'methods',
    description: '获取指定范围内的要素数组。',
    usage: `const features = new FeatureVector();
// ... 添加多个要素

// 获取前 5 个要素
const firstFive = features.getRange(0, 5);

// 获取从索引 10 开始的所有要素
const fromTen = features.getRange(10);`,
    params: [
      { name: 'start', type: 'number', default: '', description: '起始索引' },
      { name: 'end', type: 'number', default: 'undefined', description: '结束索引（不包含）' }
    ],
    returns: { type: 'Array<Feature>', description: '指定范围内的要素数组' }
  },
  {
    name: 'addfeature',
    cn: '添加要素事件',
    type: 'event',
    category: 'events',
    description: '当向集合中添加新要素时触发。',
    usage: `const features = new FeatureVector();

// 监听添加事件
features.on('addfeature', (event) => {
  console.log('添加了要素:', event.element);
  console.log('要素属性:', event.element.getProperties());
});

// 添加要素会触发事件
features.addFeature(new Feature());`,
    params: [],
    returns: { type: 'Object', description: '事件对象，包含 element 属性（添加的要素）' }
  },
  {
    name: 'removefeature',
    cn: '移除要素事件',
    type: 'event',
    category: 'events',
    description: '当从集合中移除要素时触发。',
    usage: `const features = new FeatureVector();

// 监听移除事件
features.on('removefeature', (event) => {
  console.log('移除了要素:', event.element);
});

// 移除要素会触发事件
const feature = features.item(0);
features.removeFeature(feature);`,
    params: [],
    returns: { type: 'Object', description: '事件对象，包含 element 属性（移除的要素）' }
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
