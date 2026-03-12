<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Feature - 地理要素 API</h2>
            <p class="description">
              Feature 是 OpenLayers 中的基本地理要素类，用于表示具有几何形状和属性的地理对象。
              每个要素包含一个几何对象（点、线、面等）和一组属性数据。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_Feature-Feature.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? featureApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: featureApis.length },
    { name: 'constructor', cn: '构造函数', count: featureApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: featureApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: featureApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return featureApis
  if (currentCategory.value === 'constructor') return featureApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return featureApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return featureApis.filter(a => a.type === 'event')
  return featureApis
})

const featureApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的地理要素实例。要素是 OpenLayers 中表示地理对象的基本单位，包含几何形状和属性数据。',
    usage: `import Feature from 'ol/Feature.js';
import { Point, LineString, Polygon } from 'ol/geom.js';

// 创建点要素
const pointFeature = new Feature({
  geometry: new Point([116.4, 39.9]),
  name: '北京',
  population: 21540000
});

// 创建线要素
const lineFeature = new Feature({
  geometry: new LineString([
    [116.4, 39.9],
    [121.4, 31.2]
  ]),
  name: '北京到上海'
});

// 创建面要素
const polygonFeature = new Feature({
  geometry: new Polygon([[
    [116.4, 39.9],
    [116.5, 39.9],
    [116.5, 40.0],
    [116.4, 40.0],
    [116.4, 39.9]
  ]]),
  name: '朝阳区'
});

// 添加到矢量图层
const vectorSource = new VectorSource({
  features: [pointFeature, lineFeature, polygonFeature]
});`,
    params: [
      { name: 'geometry', type: 'Geometry', default: 'undefined', description: '要素的几何对象，可以是 Point、LineString、Polygon 等' },
      { name: 'properties', type: 'Object', default: 'undefined', description: '要素的属性对象，键值对形式存储属性数据' }
    ],
    returns: { type: 'Feature', description: '新的 Feature 实例' }
  },
  {
    name: 'getGeometry',
    cn: '获取几何',
    type: 'method',
    category: 'methods',
    description: '获取要素的几何对象。返回与要素关联的几何形状。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature({
  geometry: new Point([116.4, 39.9])
});

// 获取几何
const geometry = feature.getGeometry();
console.log(geometry.getType()); // 'Point'
console.log(geometry.getCoordinates()); // [116.4, 39.9]`,
    params: [],
    returns: { type: 'Geometry', description: '要素的几何对象' }
  },
  {
    name: 'setGeometry',
    cn: '设置几何',
    type: 'method',
    category: 'methods',
    description: '设置要素的几何对象。可以更改要素的几何形状。',
    usage: `import Feature from 'ol/Feature.js';
import { Point } from 'ol/geom.js';

const feature = new Feature();

// 设置几何
feature.setGeometry(new Point([116.4, 39.9]));

// 修改几何位置
feature.setGeometry(new Point([121.4, 31.2]));`,
    params: [
      { name: 'geometry', type: 'Geometry', default: '', description: '要设置的几何对象' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },
  {
    name: 'getProperties',
    cn: '获取属性',
    type: 'method',
    category: 'methods',
    description: '获取要素的所有属性对象。返回包含所有属性的键值对对象。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature({
  geometry: new Point([116.4, 39.9]),
  name: '北京',
  population: 21540000
});

// 获取所有属性
const properties = feature.getProperties();
console.log(properties.name); // '北京'
console.log(properties.population); // 21540000`,
    params: [],
    returns: { type: 'Object', description: '包含所有属性的对象' }
  },
  {
    name: 'get',
    cn: '获取属性值',
    type: 'method',
    category: 'methods',
    description: '获取要素的单个属性值。通过属性名获取对应的值。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature({
  name: '北京',
  population: 21540000
});

// 获取单个属性
const name = feature.get('name'); // '北京'
const population = feature.get('population'); // 21540000`,
    params: [
      { name: 'key', type: 'string', default: '', description: '属性名称' }
    ],
    returns: { type: '*', description: '属性值' }
  },
  {
    name: 'set',
    cn: '设置属性',
    type: 'method',
    category: 'methods',
    description: '设置要素的单个属性值。可以添加新属性或更新现有属性。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature();

// 设置属性
feature.set('name', '北京');
feature.set('population', 21540000);

// 更新属性
feature.set('population', 22000000);`,
    params: [
      { name: 'key', type: 'string', default: '', description: '属性名称' },
      { name: 'value', type: '*', default: '', description: '属性值' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },
  {
    name: 'setProperties',
    cn: '设置多个属性',
    type: 'method',
    category: 'methods',
    description: '批量设置要素的属性。可以一次性设置多个属性。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature();

// 批量设置属性
feature.setProperties({
  name: '北京',
  population: 21540000,
  area: 16410
});`,
    params: [
      { name: 'properties', type: 'Object', default: '', description: '属性对象' },
      { name: 'opt_silent', type: 'boolean', default: 'false', description: '是否静默模式，不触发属性变更事件' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },
  {
    name: 'getStyleFunction',
    cn: '获取样式函数',
    type: 'method',
    category: 'methods',
    description: '获取要素的样式函数。样式函数用于动态计算要素的渲染样式。',
    usage: `import Feature from 'ol/Feature.js';
import { Style, Circle, Fill } from 'ol/style.js';

const feature = new Feature();

// 设置样式函数
feature.setStyle(function(resolution) {
  return new Style({
    image: new Circle({
      radius: 10,
      fill: new Fill({ color: 'red' })
    })
  });
});

// 获取样式函数
const styleFunction = feature.getStyleFunction();`,
    params: [],
    returns: { type: 'StyleFunction', description: '样式函数' }
  },
  {
    name: 'getStyle',
    cn: '获取样式',
    type: 'method',
    category: 'methods',
    description: '获取要素的样式对象或样式数组。',
    usage: `import Feature from 'ol/Feature.js';
import { Style, Circle, Fill } from 'ol/style.js';

const feature = new Feature();

// 设置样式
feature.setStyle(new Style({
  image: new Circle({
    radius: 10,
    fill: new Fill({ color: 'red' })
  })
}));

// 获取样式
const style = feature.getStyle();`,
    params: [],
    returns: { type: 'Style|Array<Style>|StyleFunction', description: '样式对象、样式数组或样式函数' }
  },
  {
    name: 'setStyle',
    cn: '设置样式',
    type: 'method',
    category: 'methods',
    description: '设置要素的样式。可以是单个样式、样式数组或样式函数。',
    usage: `import Feature from 'ol/Feature.js';
import { Style, Circle, Fill, Stroke } from 'ol/style.js';

const feature = new Feature();

// 设置单个样式
feature.setStyle(new Style({
  image: new Circle({
    radius: 10,
    fill: new Fill({ color: 'red' })
  })
}));

// 设置样式数组
feature.setStyle([
  new Style({ /* 样式 1 */ }),
  new Style({ /* 样式 2 */ })
]);

// 设置样式函数
feature.setStyle(function(resolution) {
  return new Style({
    image: new Circle({
      radius: resolution > 100 ? 5 : 10
    })
  });
});`,
    params: [
      { name: 'style', type: 'Style|Array<Style>|StyleFunction', default: '', description: '样式对象、样式数组或样式函数' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },
  {
    name: 'getId',
    cn: '获取 ID',
    type: 'method',
    category: 'methods',
    description: '获取要素的唯一标识符 ID。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature();

// 设置 ID
feature.setId('feature-1');

// 获取 ID
const id = feature.getId(); // 'feature-1'`,
    params: [],
    returns: { type: 'string|number', description: '要素 ID' }
  },
  {
    name: 'setId',
    cn: '设置 ID',
    type: 'method',
    category: 'methods',
    description: '设置要素的唯一标识符 ID。用于在矢量源中查找和引用要素。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature();

// 设置 ID
feature.setId('feature-1');
feature.setId(123);

// 在矢量源中通过 ID 获取要素
const source = new VectorSource({
  features: [feature]
});
const foundFeature = source.getFeatureById('feature-1');`,
    params: [
      { name: 'id', type: 'string|number', default: '', description: '要素唯一标识符' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },
  {
    name: 'clone',
    cn: '克隆要素',
    type: 'method',
    category: 'methods',
    description: '创建要素的克隆副本。返回一个具有相同几何和属性的新要素。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature({
  geometry: new Point([116.4, 39.9]),
  name: '北京'
});

// 克隆要素
const clonedFeature = feature.clone();

console.log(clonedFeature.get('name')); // '北京'
console.log(clonedFeature !== feature); // true`,
    params: [],
    returns: { type: 'Feature', description: '克隆的新要素' }
  },
  {
    name: 'change',
    cn: '触发变更',
    type: 'method',
    category: 'methods',
    description: '手动触发要素的变更事件。用于通知地图要素已更改需要重新渲染。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature();

// 修改几何后触发变更
feature.setGeometry(new Point([116.4, 39.9]));
feature.changed(); // 通知地图重新渲染`,
    params: [],
    returns: { type: 'undefined', description: '无返回值' }
  },
  {
    name: 'change',
    cn: '要素变更',
    type: 'event',
    category: 'events',
    description: '当要素的几何或属性发生改变时触发。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature();

// 监听变更事件
feature.on('change', function(event) {
  console.log('要素已变更');
  console.log('几何:', event.target.getGeometry());
});`,
    params: [],
    returns: { type: 'BaseEvent', description: '变更事件对象' }
  },
  {
    name: 'propertychange',
    cn: '属性变更',
    type: 'event',
    category: 'events',
    description: '当要素的属性发生更改时触发。',
    usage: `import Feature from 'ol/Feature.js';

const feature = new Feature();

// 监听属性变更事件
feature.on('propertychange', function(event) {
  console.log('属性变更:', event.key, event.oldValue, event.target.get(event.key));
});

feature.set('name', '北京');`,
    params: [],
    returns: { type: 'ObjectEvent', description: '属性变更事件对象' }
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
