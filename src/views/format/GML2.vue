<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>GML2 - 格式转换 API</h2>
            <p class="description">
              GML 2（Geography Markup Language version 2）是 OGC 制定的地理空间数据 XML 编码标准。
              OpenLayers 的 GML2 格式类用于读取和写入 GML 2.1.2 格式的数据，支持要素集合的解析和序列化。
              GML 2 是较早版本的 GML 标准，仍被一些遗留系统使用。
            </p>
            <div class="official-links">
              <el-link
                type="primary"
                href="https://openlayers.org/en/latest/apidoc/module-ol_format_GML2-GML2.html"
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
                  <span class="api-name">new GML2(options)</span>
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
                  <span class="api-cn">3 个方法</span>
                </div>
              </template>
              <div class="api-content">
                <!-- readFeature -->
                <div class="method-block">
                  <h4 class="method-name">readFeature(source, options)</h4>
                  <p class="method-desc">读取单个 GML2 要素。</p>
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
                  <p class="method-desc">从 GML2 要素集合中读取所有要素。</p>
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

                <!-- readProjection -->
                <div class="method-block">
                  <h4 class="method-name">readProjection(source)</h4>
                  <p class="method-desc">从 GML2 源中读取坐标系信息。</p>
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
                  <span class="api-cn">1 个方法</span>
                </div>
              </template>
              <div class="api-content">
                <!-- writeFeatures -->
                <div class="method-block">
                  <h4 class="method-name">writeFeatures(features, options)</h4>
                  <p class="method-desc">将要素数组编码为 GML2 格式的字符串。</p>
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
                    <span>GML2 格式的 XML 字符串</span>
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
  { name: 'all', cn: '全部', count: 5 },
  { name: 'constructor', cn: '构造函数', count: 1 },
  { name: 'read', cn: '读取方法', count: 3 },
  { name: 'write', cn: '写入方法', count: 1 },
  { name: 'example', cn: '示例', count: 1 }
]

const filterByCategory = (category) => {
  currentCategory.value = category
}

// 构造函数参数
const constructorParams = ref([
  { name: 'featureNS', type: 'Object<string, string> | string', default: '-', description: '要素命名空间映射或 URI 字符串' },
  { name: 'featureType', type: 'Array<string> | string', default: '-', description: '要解析的要素类型名称数组或单个名称' },
  { name: 'srsName', type: 'string', default: '-', description: '写入几何时使用的 SRS 名称' },
  { name: 'surface', type: 'boolean', default: 'false', description: '写入时是否使用 gml:Surface 代替 gml:Polygon' },
  { name: 'curve', type: 'boolean', default: 'false', description: '写入时是否使用 gml:Curve 代替 gml:LineString' },
  { name: 'multiCurve', type: 'boolean', default: 'true', description: '写入时是否使用 gml:MultiCurve 代替 gml:MultiLineString' },
  { name: 'multiSurface', type: 'boolean', default: 'true', description: '写入时是否使用 gml:multiSurface 代替 gml:MultiPolygon' },
  { name: 'schemaLocation', type: 'string', default: '-', description: '写入 GML 时使用的可选 schemaLocation' },
  { name: 'hasZ', type: 'boolean', default: 'false', description: '坐标是否包含 Z 值' }
])

const constructorExample = `import GML2 from 'ol/format/GML2.js';

// 基础用法
const gml2Format = new GML2();

// 指定要素命名空间和类型
const gml2WithOptions = new GML2({
  featureNS: 'http://www.opengis.net/gml',
  featureType: 'Feature'
});

// 多个要素类型
const gml2WithMultipleTypes = new GML2({
  featureType: ['Building', 'Road', 'Parcel']
});

// 使用 SRS 名称
const gml2WithSRS = new GML2({
  srsName: 'EPSG:4326'
});

// 写入时使用 Surface 和 Curve
const gml2WithSurfaceCurve = new GML2({
  surface: true,    // 使用 gml:Surface 代替 gml:Polygon
  curve: true       // 使用 gml:Curve 代替 gml:LineString
});`

// 读取方法参数
const readFeatureParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'GML2 数据源' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.extent', type: 'Extent', description: '图块的地图单位范围' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readFeaturesParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'GML2 数据源' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.extent', type: 'Extent', description: '图块的地图单位范围' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readProjectionParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'GML2 数据源' }
])

// 写入方法参数
const writeFeaturesParams = ref([
  { name: 'features', type: 'Array<Feature>', description: '要编码的要素数组' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '遵循右手定则用于线性环方向' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const fullExamples = `// ============================================
// 示例 1：读取 GML2 数据
// ============================================
import GML2 from 'ol/format/GML2.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';

const gml2Format = new GML2({
  featureNS: 'http://www.opengis.net/gml',
  featureType: 'Feature',
  srsName: 'EPSG:4326'
});

// 从 URL 加载 GML2
const vectorSource = new VectorSource({
  url: 'data/gml2/features.gml',
  format: gml2Format
});

const vectorLayer = new VectorLayer({
  source: vectorSource
});

// ============================================
// 示例 2：从字符串读取 GML2
// ============================================
const gml2String = \`<?xml version="1.0" encoding="UTF-8"?>
<gml:FeatureCollection xmlns:gml="http://www.opengis.net/gml">
  <gml:featureMember>
    <Feature>
      <geometryProperty>
        <gml:Point srsName="EPSG:4326">
          <gml:coordinates>116.4074,39.9042</gml:coordinates>
        </gml:Point>
      </geometryProperty>
      <name>北京</name>
    </Feature>
  </gml:featureMember>
  <gml:featureMember>
    <Feature>
      <geometryProperty>
        <gml:Point srsName="EPSG:4326">
          <gml:coordinates>121.4737,31.2304</gml:coordinates>
        </gml:Point>
      </geometryProperty>
      <name>上海</name>
    </Feature>
  </gml:featureMember>
</gml:FeatureCollection>\`;

const features = gml2Format.readFeatures(gml2String, {
  featureProjection: 'EPSG:3857'
});

console.log('要素数量:', features.length);
features.forEach(feature => {
  console.log('名称:', feature.get('name'));
});

// ============================================
// 示例 3：读取单个要素
// ============================================
const singleFeatureXml = \`<?xml version="1.0" encoding="UTF-8"?>
<Feature xmlns:gml="http://www.opengis.net/gml">
  <geometryProperty>
    <gml:Point srsName="EPSG:4326">
      <gml:coordinates>113.2644,23.1291</gml:coordinates>
    </gml:Point>
  </geometryProperty>
  <name>广州</name>
</Feature>\`;

const feature = gml2Format.readFeature(singleFeatureXml, {
  featureProjection: 'EPSG:3857'
});

// ============================================
// 示例 4：读取坐标系
// ============================================
const projection = gml2Format.readProjection(gml2String);
console.log('坐标系:', projection);

// ============================================
// 示例 5：写入 GML2
// ============================================
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import LineString from 'ol/geom/LineString.js';

const pointFeature = new Feature({
  geometry: new Point([12907000, 4713000]),
  name: '北京'
});

const lineFeature = new Feature({
  geometry: new LineString([
    [12907000, 4713000],
    [13000000, 4800000]
  ]),
  name: '路线'
});

const gml2Output = gml2Format.writeFeatures([pointFeature, lineFeature], {
  featureProjection: 'EPSG:3857',
  dataProjection: 'EPSG:4326',
  decimals: 6
});

console.log(gml2Output);

// ============================================
// 示例 6：使用 WFS 1.0.0（通常使用 GML2）
// ============================================
import WFS from 'ol/format/WFS.js';

const wfsFormat = new WFS({
  version: '1.0.0',
  featureNS: 'http://www.opengis.net/gml',
  featureType: 'Feature'
});

// WFS 1.0.0 使用 GML2 进行编码
const getFeatureXml = wfsFormat.writeGetFeature({
  typeName: 'Feature',
  featureNS: 'http://example.com/gml'
});

// ============================================
// 示例 7：完整的 GML2 加载示例
// ============================================
async function loadGML2(url, featureType, featureNS) {
  const gml2Format = new GML2({
    featureType: featureType,
    featureNS: featureNS,
    srsName: 'EPSG:4326'
  });

  const response = await fetch(url);
  const text = await response.text();

  const features = gml2Format.readFeatures(text, {
    featureProjection: 'EPSG:3857'
  });

  const projection = gml2Format.readProjection(text);

  return {
    features: features,
    projection: projection,
    rawData: text
  };
}

// 使用示例
loadGML2(
  'data/gml2/buildings.gml',
  'Building',
  'http://example.com/gml'
).then(result => {
  console.log('建筑物数量:', result.features.length);
  console.log('坐标系:', result.projection);
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
