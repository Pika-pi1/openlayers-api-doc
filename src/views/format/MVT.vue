<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>MVT - 格式转换 API</h2>
            <p class="description">
              MVT（Mapbox Vector Tile）是一种用于矢量切片的标准格式，基于 Protocol Buffers。
              OpenLayers 的 MVT 格式类用于读取 Mapbox 矢量切片数据，支持按需加载指定图层的要素。
              MVT 格式广泛用于高性能地图渲染场景。
            </p>
            <div class="official-links">
              <el-link
                type="primary"
                href="https://openlayers.org/en/latest/apidoc/module-ol_format_MVT-MVT.html"
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
                  <span class="api-name">new MVT(options)</span>
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
                <!-- readFeatures -->
                <div class="method-block">
                  <h4 class="method-name">readFeatures(source, options)</h4>
                  <p class="method-desc">从 MVT 切片中读取所有要素。</p>
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
                    <el-tag size="small" type="success">返回：Array&lt;FeatureType&gt;</el-tag>
                    <span>解析后的要素数组</span>
                  </div>
                </div>

                <!-- readProjection -->
                <div class="method-block">
                  <h4 class="method-name">readProjection(source)</h4>
                  <p class="method-desc">从 MVT 源中读取坐标系信息。</p>
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

                <!-- setLayers -->
                <div class="method-block">
                  <h4 class="method-name">setLayers(layers)</h4>
                  <p class="method-desc">设置要读取要素的图层名称列表。</p>
                  <el-table :data="setLayersParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="info">返回：void</el-tag>
                    <span>无返回值</span>
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
    ? ['constructor', 'read-methods', 'examples']
    : []
}

const categories = [
  { name: 'all', cn: '全部', count: 5 },
  { name: 'constructor', cn: '构造函数', count: 1 },
  { name: 'read', cn: '读取方法', count: 3 },
  { name: 'example', cn: '示例', count: 1 }
]

const filterByCategory = (category) => {
  currentCategory.value = category
}

// 构造函数参数
const constructorParams = ref([
  { name: 'featureClass', type: 'FeatureToFeatureClass', default: 'Feature', description: 'readFeatures 返回的要素类' },
  { name: 'geometryName', type: 'string', default: "'geometry'", description: '创建要素时使用的几何属性名称' },
  { name: 'layerName', type: 'string', default: "'layer'", description: '存储图层名称的属性名' },
  { name: 'layers', type: 'Array<string>', default: '-', description: '要读取要素的图层名称列表。如不设置，将从所有图层读取' },
  { name: 'idProperty', type: 'string', default: '-', description: '可选属性名，将用作要素 ID 并从属性中移除' }
])

const constructorExample = `import MVT from 'ol/format/MVT.js';

// 基础用法
const mvtFormat = new MVT();

// 指定要读取的图层
const mvtWithLayers = new MVT({
  layers: ['buildings', 'roads', 'water']
});

// 自定义几何属性名和图层属性名
const mvtWithNames = new MVT({
  geometryName: 'geom',      // 几何属性名
  layerName: 'layerName'     // 图层属性名
});

// 使用自定义要素类
import RenderFeature from 'ol/render/Feature.js';

const mvtWithRenderFeature = new MVT({
  featureClass: RenderFeature  // 使用 RenderFeature 提高渲染性能
});

// 指定 ID 属性
const mvtWithId = new MVT({
  idProperty: 'id'  // 将 'id' 属性用作要素 ID
});`

// 读取方法参数
const readFeaturesParams = ref([
  { name: 'source', type: 'ArrayBuffer', description: 'MVT 切片的二进制数据（Protocol Buffers 格式）' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.extent', type: 'Extent', description: '正在读取的图块的地图单位范围（必需，用于将图块像素转换为地图单位）' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readProjectionParams = ref([
  { name: 'source', type: 'Document | Element | Object | string', description: 'MVT 数据源' }
])

const setLayersParams = ref([
  { name: 'layers', type: 'Array<string>', description: '要读取要素的图层名称数组' }
])

const fullExamples = `// ============================================
// 示例 1：使用 MVT 格式加载矢量切片
// ============================================
import MVT from 'ol/format/MVT.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import { createXYZ } from 'ol/tilegrid.js';

const mvtLayer = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVT({
      layers: ['buildings', 'roads', 'water']
    }),
    url: 'https://example.com/tiles/{z}/{x}/{y}.mvt',
    tileGrid: createXYZ({ maxZoom: 14 })
  })
});

// ============================================
// 示例 2：从 ArrayBuffer 读取 MVT 要素
// ============================================
async function loadMVTFeatures(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  const mvtFormat = new MVT({
    layers: ['buildings']
  });

  const features = mvtFormat.readFeatures(arrayBuffer, {
    extent: [0, 0, 4096, 4096],  // 图块范围
    featureProjection: 'EPSG:3857'
  });

  return features;
}

// 使用示例
loadMVTFeatures('https://example.com/tiles/10/500/300.mvt')
  .then(features => {
    console.log('要素数量:', features.length);
    features.forEach(feature => {
      console.log('属性:', feature.getProperties());
      console.log('几何:', feature.getGeometry());
    });
  });

// ============================================
// 示例 3：使用 RenderFeature 提高性能
// ============================================
import RenderFeature from 'ol/render/Feature.js';

const mvtFormat = new MVT({
  featureClass: RenderFeature,
  layers: ['buildings', 'roads']
});

// RenderFeature 更轻量，适合大量要素的渲染场景
const features = mvtFormat.readFeatures(arrayBuffer, {
  extent: [0, 0, 4096, 4096],
  featureProjection: 'EPSG:3857'
});

// ============================================
// 示例 4：动态切换图层
// ============================================
const mvtFormat = new MVT();

// 初始只读取建筑物图层
mvtFormat.setLayers(['buildings']);

// 动态添加道路图层
mvtFormat.setLayers(['buildings', 'roads']);

// 读取所有图层
mvtFormat.setLayers(null);  // 或 mvtFormat.setLayers([])

// ============================================
// 示例 5：完整的 MVT 切片加载示例
// ============================================
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/WebGLTile.js';
import OSM from 'ol/source/OSM.js';
import { Style, Fill, Stroke } from 'ol/style.js';

// 底图
const baseLayer = new TileLayer({
  source: new OSM()
});

// MVT 矢量切片层
const mvtLayer = new VectorTileLayer({
  style: function(feature) {
    const layerName = feature.get('layer');

    if (layerName === 'buildings') {
      return new Style({
        fill: new Fill({ color: 'rgba(140, 140, 140, 0.5)' }),
        stroke: new Stroke({ color: '#888', width: 1 })
      });
    } else if (layerName === 'roads') {
      return new Style({
        stroke: new Stroke({ color: '#fff', width: 2 })
      });
    } else if (layerName === 'water') {
      return new Style({
        fill: new Fill({ color: 'rgba(100, 150, 200, 0.5)' })
      });
    }

    return null;
  },
  source: new VectorTileSource({
    format: new MVT({
      layerName: 'layer',  // 图层名称存储在 'layer' 属性中
      layers: ['buildings', 'roads', 'water']
    }),
    url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf',
    tileGrid: createXYZ({ maxZoom: 16 })
  })
});

const map = new Map({
  target: 'map',
  layers: [baseLayer, mvtLayer],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

// ============================================
// 示例 6：处理 MVT 要素属性
// ============================================
function processMVTFeatures(arrayBuffer, extent) {
  const mvtFormat = new MVT({
    layers: ['poi'],
    idProperty: 'osm_id'  // 使用 osm_id 作为要素 ID
  });

  const features = mvtFormat.readFeatures(arrayBuffer, {
    extent: extent,
    featureProjection: 'EPSG:3857'
  });

  features.forEach(feature => {
    // 获取要素属性
    const properties = feature.getProperties();
    console.log('名称:', properties.name);
    console.log('类别:', properties.class);
    console.log('图层:', properties.layer);

    // 要素 ID 已从属性中移除并设置为 feature.id
    console.log('要素 ID:', feature.getId());
  });

  return features;
}

// ============================================
// 示例 7：Mapbox Style 与 MVT 配合使用
// ============================================
import MapboxVectorLayer from 'ol-mapbox-style';

// 使用 Mapbox 样式加载 MVT 数据
const mapboxLayer = new MapboxVectorLayer({
  styleUrl: 'https://demotiles.maplibre.org/style.json',
  source: 'openmaptiles'
});

// 或手动配置
const customMVTLayer = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVT({
      layers: ['water', 'waterway', 'building', 'road']
    }),
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.mvt'
  })
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
