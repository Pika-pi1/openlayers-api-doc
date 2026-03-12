<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>JSONFeature - JSON 要素格式 API</h2>
            <p class="description">
              JSONFeature 是读取和写入 JSON 格式地理要素的基类。
              提供了将要素序列化为 JSON 对象和从 JSON 解析要素的通用功能。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_format_JSONFeature-JSONFeature.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? jsonFeatureApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: jsonFeatureApis.length },
    { name: 'constructor', cn: '构造函数', count: jsonFeatureApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: jsonFeatureApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return jsonFeatureApis
  if (currentCategory.value === 'constructor') return jsonFeatureApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return jsonFeatureApis.filter(a => a.type === 'method')
  return jsonFeatureApis
})

const jsonFeatureApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 JSONFeature 格式实例。JSONFeature 是读取和写入 JSON 格式地理要素的基类，GeoJSON 等格式继承自此类。',
    usage: `import GeoJSON from 'ol/format/GeoJSON.js';

// JSONFeature 是基类，通常使用其子类如 GeoJSON
const format = new GeoJSON({
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});

// 读取 JSON 要素
const features = format.readFeatures(jsonData);

// 写入 JSON 要素
const jsonData = format.writeFeatures(features);`,
    params: [
      { name: 'dataProjection', type: 'string', default: 'EPSG:4326', description: '数据源使用的坐标投影，默认 WGS84' },
      { name: 'featureProjection', type: 'string', default: 'undefined', description: '要素读取后转换到的目标投影' }
    ],
    returns: { type: 'JSONFeature', description: '新的 JSONFeature 格式实例' }
  },
  {
    name: 'readFeatures',
    cn: '读取多个要素',
    type: 'method',
    category: 'methods',
    description: '从 JSON 对象中读取多个地理要素。解析 JSON 格式并转换为 OpenLayers 要素数组。',
    usage: `import GeoJSON from 'ol/format/GeoJSON.js';

const format = new GeoJSON();

// 从 JSON 对象读取要素
const features = format.readFeatures(jsonObject);

// 从 JSON 字符串读取
const features = format.readFeatures(jsonString);

// 指定投影转换
const features = format.readFeatures(jsonObject, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});`,
    params: [
      { name: 'source', type: 'Object|string', default: '', description: 'JSON 对象或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项' }
    ],
    returns: { type: 'Array<Feature>', description: '读取的要素数组' }
  },
  {
    name: 'readFeature',
    cn: '读取单个要素',
    type: 'method',
    category: 'methods',
    description: '从 JSON 对象中读取单个地理要素。',
    usage: `import GeoJSON from 'ol/format/GeoJSON.js';

const format = new GeoJSON();

// 读取单个要素
const feature = format.readFeature(jsonObject);

// 获取要素属性
console.log(feature.getProperties());

// 获取要素几何
const geometry = feature.getGeometry();`,
    params: [
      { name: 'source', type: 'Object|string', default: '', description: 'JSON 对象或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项' }
    ],
    returns: { type: 'Feature', description: '读取的要素对象' }
  },
  {
    name: 'writeFeatures',
    cn: '写入多个要素',
    type: 'method',
    category: 'methods',
    description: '将多个地理要素写入 JSON 格式。用于导出或传输要素数据。',
    usage: `import GeoJSON from 'ol/format/GeoJSON.js';

const format = new GeoJSON();

// 将要素数组写入 JSON 对象
const jsonObject = format.writeFeatures(features);

// 写入为格式化字符串
const jsonString = format.writeFeatures(features, {
  decimals: 6,  // 坐标小数位数
  rightHanded: true  // 右手坐标系
});

// .pretty() 方法（GeoJSON 特有）
const prettyJson = format.writeFeatures(features, {
  decimals: 6
});`,
    params: [
      { name: 'features', type: 'Array<Feature>', default: '', description: '要写入的要素数组' },
      { name: 'options', type: 'Object', default: 'undefined', description: '写入选项' }
    ],
    returns: { type: 'Object|string', description: 'JSON 对象或字符串' }
  },
  {
    name: 'writeFeature',
    cn: '写入单个要素',
    type: 'method',
    category: 'methods',
    description: '将单个地理要素写入 JSON 格式。',
    usage: `import GeoJSON from 'ol/format/GeoJSON.js';

const format = new GeoJSON();

// 将单个要素写入 JSON
const jsonObject = format.writeFeature(feature);

// 写入为字符串
const jsonString = format.writeFeature(feature, {
  decimals: 6
});`,
    params: [
      { name: 'feature', type: 'Feature', default: '', description: '要写入的要素对象' },
      { name: 'options', type: 'Object', default: 'undefined', description: '写入选项' }
    ],
    returns: { type: 'Object|string', description: 'JSON 对象或字符串' }
  },
  {
    name: 'readGeometry',
    cn: '读取几何对象',
    type: 'method',
    category: 'methods',
    description: '从 JSON 对象中读取几何对象。只解析几何信息，不包含属性。',
    usage: `import GeoJSON from 'ol/format/GeoJSON.js';

const format = new GeoJSON();

// 从 JSON 几何读取
const geometry = format.readGeometry(jsonGeometry, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});`,
    params: [
      { name: 'source', type: 'Object|string', default: '', description: 'JSON 几何对象或字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项' }
    ],
    returns: { type: 'Geometry', description: '读取的几何对象' }
  },
  {
    name: 'writeGeometry',
    cn: '写入几何对象',
    type: 'method',
    category: 'methods',
    description: '将几何对象写入 JSON 格式。只导出几何信息。',
    usage: `import GeoJSON from 'ol/format/GeoJSON.js';
import { Point } from 'ol/geom.js';

const format = new GeoJSON();

const point = new Point([116.4, 39.9]);

// 写入几何到 JSON
const jsonGeometry = format.writeGeometry(point);

// 写入为字符串
const jsonString = format.writeGeometry(point, {
  decimals: 6
});`,
    params: [
      { name: 'geometry', type: 'Geometry', default: '', description: '要写入的几何对象' },
      { name: 'options', type: 'Object', default: 'undefined', description: '写入选项' }
    ],
    returns: { type: 'Object|string', description: 'JSON 对象或字符串' }
  },
  {
    name: 'readProjection',
    cn: '读取投影信息',
    type: 'method',
    category: 'methods',
    description: '从 JSON 对象中读取投影信息。',
    usage: `import GeoJSON from 'ol/format/GeoJSON.js';

const format = new GeoJSON();

// 读取 JSON 中的投影信息
const projection = format.readProjection(jsonObject);

console.log(projection.getCode()); // 例如 'EPSG:4326'`,
    params: [
      { name: 'source', type: 'Object', default: '', description: 'JSON 对象' }
    ],
    returns: { type: 'Projection', description: '读取的投影对象' }
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
