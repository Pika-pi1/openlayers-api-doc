<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>TopoJSON - 格式转换 API</h2>
            <p class="description">
              TopoJSON 是 GeoJSON 的扩展，通过编码拓扑结构（共享弧）来减少数据量。
              OpenLayers 的 TopoJSON 格式类用于读取 TopoJSON 格式的数据，支持从拓扑结构中提取几何和要素。
              TopoJSON 通常比 GeoJSON 小 80% 以上，适合网络传输。
            </p>
            <div class="official-links">
              <el-link
                type="primary"
                href="https://openlayers.org/en/latest/apidoc/module-ol_format_TopoJSON-TopoJSON.html"
                target="_blank"
              >
                <el-icon><Link /></el-icon>
                官方文档
              </el-link>
            </div>
          </div>
          <div class="control-section">
            <el-button
              @click="toggleExpand"
              size="default"
              :type="isAllExpanded ? 'success' : 'primary'"
            >
              <el-icon><component :is="isAllExpanded ? Folder : FolderOpened" /></el-icon>
              {{ isAllExpanded ? '全部收起' : '全部展开' }}
            </el-button>
          </div>
        </div>

        <!-- API 分类标签 -->
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

        <!-- API 列表 -->
        <div class="api-list">
          <el-collapse v-model="activeNames">
            <!-- 构造函数 -->
            <el-collapse-item name="constructor">
              <template #title>
                <div class="api-title">
                  <el-tag type="warning" size="small">Constructor</el-tag>
                  <span class="api-name">new TopoJSON(options)</span>
                  <span class="api-cn">构造函数</span>
                </div>
              </template>
              <div class="api-content">
                <div class="api-section params-section">
                  <div class="section-header">
                    <el-icon class="section-icon params-icon"><Operation /></el-icon>
                    <h4>参数说明</h4>
                  </div>
                  <el-table :data="constructorParams" style="width: 100%" size="small" border class="api-table" row-key="name">
                    <el-table-column prop="name" label="参数名" width="200">
                      <template #default="scope">
                        <code class="param-name">{{ scope.row.name }}</code>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="180">
                      <template #default="scope">
                        <el-tag size="small" type="info">{{ scope.row.type }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="default" label="默认值" width="150">
                      <template #default="scope">
                        <span v-if="scope.row.default" class="default-value">{{ scope.row.default }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                </div>
                <div class="api-section usage-section">
                  <div class="section-header">
                    <el-icon class="section-icon usage-icon"><Document /></el-icon>
                    <h4>使用示例</h4>
                  </div>
                  <pre class="code-block"><code>{{ constructorExample }}</code></pre>
                </div>
              </div>
            </el-collapse-item>

            <!-- 读取方法 -->
            <el-collapse-item name="read-methods">
              <template #title>
                <div class="api-title">
                  <el-tag type="success" size="small">Methods</el-tag>
                  <span class="api-name">读取方法 (Read Methods)</span>
                  <span class="api-cn">4 个方法</span>
                </div>
              </template>
              <div class="api-content">
                <!-- readFeature -->
                <div class="method-block">
                  <h4 class="method-name">readFeature(source, options)</h4>
                  <p class="method-desc">读取单个 TopoJSON 要素。</p>
                  <el-table :data="readFeatureParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                  <div class="returns-block">
                    <el-tag size="small" type="success">返回：Feature</el-tag>
                    <span>解析后的要素对象</span>
                  </div>
                </div>

                <!-- readFeatures -->
                <div class="method-block">
                  <h4 class="method-name">readFeatures(source, options)</h4>
                  <p class="method-desc">读取 TopoJSON 格式的所有要素。支持单个要素和要素集合。</p>
                  <el-table :data="readFeaturesParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                  <div class="returns-block">
                    <el-tag size="small" type="success">返回：Array&lt;Feature&gt;</el-tag>
                    <span>解析后的要素数组</span>
                  </div>
                </div>

                <!-- readGeometry -->
                <div class="method-block">
                  <h4 class="method-name">readGeometry(source, options)</h4>
                  <p class="method-desc">读取单个 TopoJSON 几何对象。</p>
                  <el-table :data="readGeometryParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                  <div class="returns-block">
                    <el-tag size="small" type="success">返回：Geometry</el-tag>
                    <span>解析后的几何对象</span>
                  </div>
                </div>

                <!-- readProjection -->
                <div class="method-block">
                  <h4 class="method-name">readProjection(source)</h4>
                  <p class="method-desc">从 TopoJSON 源中读取坐标系信息。</p>
                  <el-table :data="readProjectionParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                  <div class="returns-block">
                    <el-tag size="small" type="success">返回：Projection</el-tag>
                    <span>解析的坐标系对象</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <!-- 写入方法 -->
            <el-collapse-item name="write-methods">
              <template #title>
                <div class="api-title">
                  <el-tag type="success" size="small">Methods</el-tag>
                  <span class="api-name">写入方法 (Write Methods)</span>
                  <span class="api-cn">3 个方法</span>
                </div>
              </template>
              <div class="api-content">
                <!-- writeFeature -->
                <div class="method-block">
                  <h4 class="method-name">writeFeature(feature, options)</h4>
                  <p class="method-desc">将单个要素编码为 TopoJSON 格式的字符串。</p>
                  <el-table :data="writeFeatureParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                  <div class="returns-block">
                    <el-tag size="small" type="success">返回：string</el-tag>
                    <span>TopoJSON 格式的字符串</span>
                  </div>
                </div>

                <!-- writeFeatures -->
                <div class="method-block">
                  <h4 class="method-name">writeFeatures(features, options)</h4>
                  <p class="method-desc">将要素数组编码为 TopoJSON 格式的字符串。</p>
                  <el-table :data="writeFeaturesParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                  <div class="returns-block">
                    <el-tag size="small" type="success">返回：string</el-tag>
                    <span>TopoJSON 格式的字符串</span>
                  </div>
                </div>

                <!-- writeGeometry -->
                <div class="method-block">
                  <h4 class="method-name">writeGeometry(geometry, options)</h4>
                  <p class="method-desc">将几何对象编码为 TopoJSON 格式的字符串。</p>
                  <el-table :data="writeGeometryParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                  <div class="returns-block">
                    <el-tag size="small" type="success">返回：string</el-tag>
                    <span>TopoJSON 格式的字符串</span>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <!-- 使用示例 -->
            <el-collapse-item name="examples">
              <template #title>
                <div class="api-title">
                  <el-tag type="warning" size="small">Examples</el-tag>
                  <span class="api-name">完整使用示例</span>
                </div>
              </template>
              <div class="api-content">
                <div class="api-section usage-section">
                  <pre class="code-block"><code>{{ fullExamples }}</code></pre>
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
  activeNames.value = isAllExpanded.value
    ? ['constructor', 'read-methods', 'write-methods', 'examples']
    : []
}

const categories = [
  { name: 'all', cn: '全部', count: 8 },
  { name: 'constructor', cn: '构造函数', count: 1 },
  { name: 'read', cn: '读取方法', count: 4 },
  { name: 'write', cn: '写入方法', count: 3 },
  { name: 'example', cn: '示例', count: 1 }
]

const filterByCategory = (category) => {
  currentCategory.value = category
}

// 构造函数参数
const constructorParams = ref([
  { name: 'dataProjection', type: 'ProjectionLike', default: "'EPSG:4326'", description: '默认数据坐标系' },
  { name: 'layerName', type: 'string', default: '-', description: '将 TopoJSON 拓扑对象的子代名称设置为具有指定名称的要素属性' },
  { name: 'layers', type: 'Array<string>', default: '-', description: '要读取要素的 TopoJSON 拓扑对象的子代名称列表' }
])

const constructorExample = `import TopoJSON from 'ol/format/TopoJSON.js';

// 基础用法
const topojsonFormat = new TopoJSON();

// 指定数据坐标系
const topojsonWithProjection = new TopoJSON({
  dataProjection: 'EPSG:4326'
});

// 指定要读取的图层
const topojsonWithLayers = new TopoJSON({
  layers: ['states', 'counties']
});

// 设置图层名称属性
const topojsonWithLayerName = new TopoJSON({
  layerName: 'topojsonLayer'  // 拓扑对象名称将存储在 'topojsonLayer' 属性中
});`

// 读取方法参数
const readFeatureParams = ref([
  { name: 'source', type: 'Object | string', description: 'TopoJSON 数据源（对象或字符串）' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.extent', type: 'Extent', description: '图块的地图单位范围（用于图块像素几何单位）' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readFeaturesParams = ref([
  { name: 'source', type: 'Object | string', description: 'TopoJSON 数据源（支持单个要素和要素集合）' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.extent', type: 'Extent', description: '图块的地图单位范围' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readGeometryParams = ref([
  { name: 'source', type: 'Object | string', description: 'TopoJSON 几何数据源' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的几何图形的坐标系' }
])

const readProjectionParams = ref([
  { name: 'source', type: 'Object | string', description: 'TopoJSON 数据源' }
])

// 写入方法参数
const writeFeatureParams = ref([
  { name: 'feature', type: 'Feature', description: '要编码的要素对象' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeFeaturesParams = ref([
  { name: 'features', type: 'Array<Feature>', description: '要编码的要素数组' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeGeometryParams = ref([
  { name: 'geometry', type: 'Geometry', description: '要编码的几何对象' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的几何图形的坐标系' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const fullExamples = `// ============================================
// 示例 1：读取 TopoJSON 数据
// ============================================
import TopoJSON from 'ol/format/TopoJSON.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';

const topojsonFormat = new TopoJSON({
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});

// 从 URL 加载 TopoJSON
const vectorSource = new VectorSource({
  url: 'data/topojson/us-states.json',
  format: topojsonFormat
});

const vectorLayer = new VectorLayer({
  source: vectorSource
});

// ============================================
// 示例 2：从对象读取 TopoJSON
// ============================================
const topojsonObject = {
  "type": "Topology",
  "transform": {
    "scale": [0.0001, 0.0001],
    "translate": [-180, -90]
  },
  "objects": {
    "states": {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Polygon",
          "arcs": [[0]],
          "properties": {
            "name": "State Name",
            "id": 1
          }
        }
      ]
    }
  },
  "arcs": [[[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]]]
};

const features = topojsonFormat.readFeatures(topojsonObject, {
  featureProjection: 'EPSG:3857'
});

// ============================================
// 示例 3：从字符串读取 TopoJSON
// ============================================
const topojsonString = JSON.stringify(topojsonObject);
const featuresFromString = topojsonFormat.readFeatures(topojsonString, {
  featureProjection: 'EPSG:3857'
});

// ============================================
// 示例 4：指定要读取的图层
// ============================================
const topojsonWithLayers = new TopoJSON({
  layers: ['states', 'counties']
});

const specificFeatures = topojsonWithLayers.readFeatures(topojsonObject, {
  featureProjection: 'EPSG:3857'
});

// ============================================
// 示例 5：读取单个几何
// ============================================
const geometryCollection = topojsonObject.objects.states;
const geometry = topojsonFormat.readGeometry(geometryCollection, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});

// ============================================
// 示例 6：完整的 TopoJSON 加载示例
// ============================================
async function loadTopoJSON(url, featureProjection = 'EPSG:3857') {
  const response = await fetch(url);
  const topojsonData = await response.json();

  const topojsonFormat = new TopoJSON({
    dataProjection: 'EPSG:4326',
    featureProjection: featureProjection
  });

  const features = topojsonFormat.readFeatures(topojsonData);

  return {
    data: topojsonData,
    features: features
  };
}

// 使用示例
loadTopoJSON('data/topojson/world-countries.json').then(result => {
  console.log('要素数量:', result.features.length);
  result.features.forEach(feature => {
    console.log('国家:', feature.get('name'));
  });
});

// ============================================
// 示例 7：TopoJSON 与 GeoJSON 对比
// ============================================
import GeoJSON from 'ol/format/GeoJSON.js';

const geojsonFormat = new GeoJSON();
const topojsonFormat = new TopoJSON();

// 假设有一个包含多个共享边界的行政区数据
const geojsonSize = JSON.stringify(geojsonObject).length;
const topojsonSize = JSON.stringify(topojsonObject).length;

console.log('GeoJSON 大小:', geojsonSize, '字节');
console.log('TopoJSON 大小:', topojsonSize, '字节');
console.log('压缩率:', ((1 - topojsonSize / geojsonSize) * 100).toFixed(2) + '%');
// 通常 TopoJSON 比 GeoJSON 小 80% 以上

// ============================================
// 示例 8：使用 layerName 属性
// ============================================
const topojsonWithLayerName = new TopoJSON({
  layerName: 'sourceLayer'
});

const featuresWithLayerName = topojsonWithLayerName.readFeatures(topojsonObject);
featuresWithLayerName.forEach(feature => {
  console.log('来源图层:', feature.get('sourceLayer'));
});`
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
  max-width: 1600px;
  margin: 0 auto;
}

.doc-content {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.title-section h2 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 24px;
}

.description {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

.official-links {
  display: flex;
  gap: 10px;
}

.control-section {
  display: flex;
  gap: 10px;
}

.api-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-tag {
  cursor: pointer;
  padding: 6px 12px;
  font-size: 13px;
  transition: all 0.3s;
}

.category-tag:hover {
  transform: translateY(-2px);
}

.api-list {
  :deep(.el-collapse-item__header) {
    font-size: 14px;
    font-weight: 600;
    padding: 12px 16px;
    background-color: #fafafa;
    border-radius: 4px;
    margin-bottom: 8px;

    &:hover {
      background-color: #f0f9ff;
    }
  }
}

.api-title {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  .api-name {
    font-family: 'Consolas', 'Monaco', monospace;
    color: #409eff;
    font-size: 14px;
    font-weight: 600;
  }

  .api-cn {
    color: #909399;
    font-size: 13px;
    font-weight: normal;
  }
}

.api-content {
  padding: 16px;

  .method-block {
    margin-bottom: 24px;
    padding: 16px;
    background-color: #fafafa;
    border-radius: 6px;
    border-left: 4px solid #409eff;

    &:last-child {
      margin-bottom: 0;
    }

    .method-name {
      margin: 0 0 8px 0;
      color: #303133;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 15px;
      font-weight: 600;
    }

    .method-desc {
      margin: 0 0 12px 0;
      color: #606266;
      font-size: 13px;
      line-height: 1.5;
    }
  }

  .returns-block {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    padding: 8px 12px;
    background-color: #f0f9ff;
    border-radius: 4px;

    span {
      color: #606266;
      font-size: 13px;
    }
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  h4 {
    margin: 0;
    color: #303133;
    font-size: 14px;
    font-weight: 600;
  }

  .section-icon {
    font-size: 16px;
    color: #409eff;

    &.params-icon {
      color: #e6a23c;
    }

    &.usage-icon {
      color: #67c23a;
    }
  }
}

.api-table {
  :deep(.el-table__row) {
    &:hover {
      background-color: #f5f7fa;
    }
  }

  :deep(.param-name) {
    font-family: 'Consolas', 'Monaco', monospace;
    color: #409eff;
    font-size: 13px;
  }
}

.code-block {
  margin: 0;
  padding: 16px;
  background-color: #282c34;
  border-radius: 6px;
  overflow-x: auto;

  code {
    color: #abb2bf;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.6;
    white-space: pre;
  }
}

.default-value {
  color: #67c23a;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}
</style>
