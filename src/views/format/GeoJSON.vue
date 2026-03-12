<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>GeoJSON - 格式转换 API</h2>
            <p class="description">
              GeoJSON 是一种基于 JSON 的地理空间数据交换格式。OpenLayers 的 GeoJSON 格式类
              用于读取和写入 GeoJSON 格式的数据，支持 Feature、FeatureCollection 和 Geometry 对象。
            </p>
            <div class="official-links">
              <el-link
                type="primary"
                href="https://openlayers.org/en/latest/apidoc/module-ol_format_GeoJSON-GeoJSON.html"
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
                  <span class="api-name">new GeoJSON(options)</span>
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
                  <p class="method-desc">读取单个 GeoJSON 要素。</p>
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
                  <p class="method-desc">读取 GeoJSON 要素集合。支持单个要素和要素集合。</p>
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
                  <p class="method-desc">读取单个 GeoJSON 几何对象。</p>
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
                  <p class="method-desc">读取 GeoJSON 数据的坐标系信息。</p>
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
                  <span class="api-cn">6 个方法</span>
                </div>
              </template>
              <div class="api-content">
                <!-- writeFeature -->
                <div class="method-block">
                  <h4 class="method-name">writeFeature(feature, options)</h4>
                  <p class="method-desc">将单个要素编码为 GeoJSON 字符串。</p>
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
                    <span>GeoJSON 格式的字符串</span>
                  </div>
                </div>

                <!-- writeFeatureObject -->
                <div class="method-block">
                  <h4 class="method-name">writeFeatureObject(feature, options)</h4>
                  <p class="method-desc">将单个要素编码为 GeoJSON Feature 对象。</p>
                  <el-table :data="writeFeatureObjectParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="success">返回：GeoJSONFeature</el-tag>
                    <span>GeoJSON Feature 对象</span>
                  </div>
                </div>

                <!-- writeFeatures -->
                <div class="method-block">
                  <h4 class="method-name">writeFeatures(features, options)</h4>
                  <p class="method-desc">将要素数组编码为 GeoJSON 字符串。</p>
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
                    <span>GeoJSON FeatureCollection 格式的字符串</span>
                  </div>
                </div>

                <!-- writeFeaturesObject -->
                <div class="method-block">
                  <h4 class="method-name">writeFeaturesObject(features, options)</h4>
                  <p class="method-desc">将要素数组编码为 GeoJSON FeatureCollection 对象。</p>
                  <el-table :data="writeFeaturesObjectParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="success">返回：GeoJSONFeatureCollection</el-tag>
                    <span>GeoJSON FeatureCollection 对象</span>
                  </div>
                </div>

                <!-- writeGeometry -->
                <div class="method-block">
                  <h4 class="method-name">writeGeometry(geometry, options)</h4>
                  <p class="method-desc">将几何对象编码为 GeoJSON 字符串。</p>
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
                    <span>GeoJSON Geometry 格式的字符串</span>
                  </div>
                </div>

                <!-- writeGeometryObject -->
                <div class="method-block">
                  <h4 class="method-name">writeGeometryObject(geometry, options)</h4>
                  <p class="method-desc">将几何对象编码为 GeoJSON Geometry 对象。</p>
                  <el-table :data="writeGeometryObjectParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="success">返回：GeoJSONGeometry</el-tag>
                    <span>GeoJSON Geometry 对象</span>
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
  { name: 'all', cn: '全部', count: 12 },
  { name: 'constructor', cn: '构造函数', count: 1 },
  { name: 'read', cn: '读取方法', count: 4 },
  { name: 'write', cn: '写入方法', count: 6 },
  { name: 'example', cn: '示例', count: 1 }
]

const filterByCategory = (category) => {
  currentCategory.value = category
}

// 构造函数参数
const constructorParams = ref([
  { name: 'dataProjection', type: 'ProjectionLike', default: "'EPSG:4326'", description: '默认数据坐标系' },
  { name: 'featureProjection', type: 'ProjectionLike', default: '-', description: '读取或写入要素时使用的坐标系' },
  { name: 'geometryName', type: 'string', default: '-', description: '创建要素时使用的几何属性名称' },
  { name: 'extractGeometryName', type: 'boolean', default: 'false', description: '是否从 GeoJSON 要素中提取 geometry_name 字段' },
  { name: 'featureClass', type: 'FeatureToFeatureClass', default: 'Feature', description: '读取要素时使用的要素类' }
])

const constructorExample = `import GeoJSON from 'ol/format/GeoJSON.js';

// 基础用法
const format = new GeoJSON();

// 指定数据坐标系和要素坐标系
const formatWithOptions = new GeoJSON({
  dataProjection: 'EPSG:4326',      // 数据坐标系
  featureProjection: 'EPSG:3857'    // 地图显示坐标系
});

// 指定几何属性名称
const formatWithGeometryName = new GeoJSON({
  geometryName: 'geom',             // 几何属性名
  extractGeometryName: true         // 提取 geometry_name 字段
});`

// 读取方法参数
const readFeatureParams = ref([
  { name: 'source', type: 'ArrayBuffer | Document | Element | Object | string', description: 'GeoJSON 数据源' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系（可选，默认使用构造函数中设置的值）' },
  { name: 'options.extent', type: 'Extent', description: '图块的地图单位范围（用于图块像素几何单位）' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readFeaturesParams = ref([
  { name: 'source', type: 'ArrayBuffer | Document | Element | Object | string', description: 'GeoJSON 数据源（支持单个要素或要素集合）' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.extent', type: 'Extent', description: '图块的地图单位范围' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readGeometryParams = ref([
  { name: 'source', type: 'ArrayBuffer | Document | Element | Object | string', description: 'GeoJSON 几何数据源' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的几何图形的坐标系' }
])

const readProjectionParams = ref([
  { name: 'source', type: 'ArrayBuffer | Document | Element | Object | string', description: 'GeoJSON 数据源' }
])

// 写入方法参数
const writeFeatureParams = ref([
  { name: 'feature', type: 'Feature', description: '要编码的要素对象' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '是否遵循右手定则用于线性环方向' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeFeatureObjectParams = ref([
  { name: 'feature', type: 'Feature', description: '要编码的要素对象' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '是否遵循右手定则' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeFeaturesParams = ref([
  { name: 'features', type: 'Array<Feature>', description: '要编码的要素数组' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '是否遵循右手定则' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeFeaturesObjectParams = ref([
  { name: 'features', type: 'Array<Feature>', description: '要编码的要素数组' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '是否遵循右手定则' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeGeometryParams = ref([
  { name: 'geometry', type: 'Geometry', description: '要编码的几何对象' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '是否遵循右手定则' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeGeometryObjectParams = ref([
  { name: 'geometry', type: 'Geometry', description: '要编码的几何对象' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '是否遵循右手定则' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const fullExamples = `// ============================================
// 示例 1：读取 GeoJSON 数据
// ============================================
import GeoJSON from 'ol/format/GeoJSON.js';

const geojsonFormat = new GeoJSON({
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});

// 从字符串读取要素
const features = geojsonFormat.readFeatures(geoJsonString, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});

// 从对象读取要素
const feature = geojsonFormat.readFeature(geoJsonObject);

// 读取几何对象
const geometry = geojsonFormat.readGeometry(geoJsonGeometryString);

// 读取坐标系
const projection = geojsonFormat.readProjection(geoJsonString);

// ============================================
// 示例 2：写入 GeoJSON 数据
// ============================================

// 写入单个要素为字符串
const featureString = geojsonFormat.writeFeature(feature, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
  decimals: 6
});

// 写入单个要素为对象
const featureObject = geojsonFormat.writeFeatureObject(feature);

// 写入要素数组为字符串
const featuresString = geojsonFormat.writeFeatures(features, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
  decimals: 6
});

// 写入要素数组为对象
const featuresObject = geojsonFormat.writeFeaturesObject(features);

// 写入几何对象为字符串
const geometryString = geojsonFormat.writeGeometry(geometry, {
  decimals: 6
});

// 写入几何对象为 GeoJSON Geometry 对象
const geometryObject = geojsonFormat.writeGeometryObject(geometry);

// ============================================
// 示例 3：与 VectorSource 配合使用
// ============================================
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';

const vectorSource = new VectorSource({
  url: 'data/geojson/data.geojson',
  format: new GeoJSON({
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  })
});

const vectorLayer = new VectorLayer({
  source: vectorSource
});

// ============================================
// 示例 4：右手定则（用于多边形方向）
// ============================================
const rightHandedGeoJSON = geojsonFormat.writeFeatures(features, {
  rightHanded: true  // 外环顺时针，内环逆时针
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
