<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>KML - 格式转换 API</h2>
            <p class="description">
              KML（Keyhole Markup Language）是一种基于 XML 的地理空间标记语言，
              广泛用于 Google Earth 和其他地球浏览器。OpenLayers 的 KML 格式类
              用于读取和写入 KML 格式的数据，支持 Placemark、NetworkLink、Region 等。
            </p>
            <div class="official-links">
              <el-link
                type="primary"
                href="https://openlayers.org/en/latest/apidoc/module-ol_format_KML-KML.html"
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
                  <span class="api-name">new KML(options)</span>
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
                  <span class="api-cn">5 个方法</span>
                </div>
              </template>
              <div class="api-content">
                <!-- readFeature -->
                <div class="method-block">
                  <h4 class="method-name">readFeature(source, options)</h4>
                  <p class="method-desc">读取单个 KML 要素。</p>
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
                  <p class="method-desc">从 KML 要素集合中读取所有要素。</p>
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

                <!-- readName -->
                <div class="method-block">
                  <h4 class="method-name">readName(source)</h4>
                  <p class="method-desc">读取 KML 文档的名称（Document 或 Folder 的 name 元素）。</p>
                  <el-table :data="readNameParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="success">返回：string | undefined</el-tag>
                    <span>KML 文档名称，如果不存在则返回 undefined</span>
                  </div>
                </div>

                <!-- readNetworkLinks -->
                <div class="method-block">
                  <h4 class="method-name">readNetworkLinks(source)</h4>
                  <p class="method-desc">读取 KML 文档中的 NetworkLink 元素。</p>
                  <el-table :data="readNetworkLinksParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="success">返回：Array&lt;Object&gt;</el-tag>
                    <span>NetworkLink 对象数组，包含 href、viewRefreshMode 等属性</span>
                  </div>
                </div>

                <!-- readRegion -->
                <div class="method-block">
                  <h4 class="method-name">readRegion(source)</h4>
                  <p class="method-desc">读取 KML 文档中的 Region 元素。</p>
                  <el-table :data="readRegionParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="success">返回：Array&lt;Object&gt;</el-tag>
                    <span>Region 对象数组，包含 LatLonAltBox、Lod 等属性</span>
                  </div>
                </div>

                <!-- readCamera -->
                <div class="method-block">
                  <h4 class="method-name">readCamera(source)</h4>
                  <p class="method-desc">读取 KML 文档中的 Camera 元素（观察者视角信息）。</p>
                  <el-table :data="readCameraParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="success">返回：Array&lt;KMLCamera&gt;</el-tag>
                    <span>Camera 对象数组，包含经纬度、高度、朝向等信息</span>
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
                  <span class="api-cn">2 个方法</span>
                </div>
              </template>
              <div class="api-content">
                <!-- writeFeatures -->
                <div class="method-block">
                  <h4 class="method-name">writeFeatures(features, options)</h4>
                  <p class="method-desc">将要素数组编码为 KML 格式的字符串。</p>
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
                    <span>KML 格式的 XML 字符串</span>
                  </div>
                </div>

                <!-- writeFeaturesNode -->
                <div class="method-block">
                  <h4 class="method-name">writeFeaturesNode(features, options)</h4>
                  <p class="method-desc">将要素数组编码为 KML 格式的 XML 节点。</p>
                  <el-table :data="writeFeaturesNodeParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="success">返回：Node</el-tag>
                    <span>KML 格式的 XML 节点</span>
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
  { name: 'all', cn: '全部', count: 10 },
  { name: 'constructor', cn: '构造函数', count: 1 },
  { name: 'read', cn: '读取方法', count: 6 },
  { name: 'write', cn: '写入方法', count: 2 },
  { name: 'example', cn: '示例', count: 1 }
]

const filterByCategory = (category) => {
  currentCategory.value = category
}

// 构造函数参数
const constructorParams = ref([
  { name: 'extractStyles', type: 'boolean', default: 'true', description: '是否从 KML 中提取样式信息' },
  { name: 'showPointNames', type: 'boolean', default: 'true', description: '是否将 Placemark 名称显示为点要素的标签' },
  { name: 'defaultStyle', type: 'Array<Style>', default: '-', description: '默认样式数组。如不设置，默认使用与 Google Earth 相同的样式' },
  { name: 'writeStyles', type: 'boolean', default: 'true', description: '写入 KML 时是否包含样式信息' },
  { name: 'crossOrigin', type: 'string', default: "'anonymous'", description: '加载图片时的跨域属性设置' },
  { name: 'referrerPolicy', type: 'ReferrerPolicy', default: '-', description: '加载图片时的引用策略' },
  { name: 'iconUrlFunction', type: 'IconUrlFunction', default: '-', description: '自定义函数，接收 URL 字符串并返回处理后的 URL 字符串' }
])

const constructorExample = `import KML from 'ol/format/KML.js';

// 基础用法
const kmlFormat = new KML();

// 提取样式并显示点名
const kmlWithStyles = new KML({
  extractStyles: true,        // 提取 KML 中的样式
  showPointNames: true        // 显示 Placemark 名称作为标签
});

// 自定义默认样式
import { Style, Fill, Stroke } from 'ol/style.js';

const customKML = new KML({
  defaultStyle: [
    new Style({
      fill: new Fill({ color: 'rgba(255, 100, 100, 0.5)' }),
      stroke: new Stroke({ color: 'red', width: 2 })
    })
  ],
  writeStyles: true           // 写入时包含样式
});

// 自定义图标 URL 处理函数
const kmlWithIconHandler = new KML({
  iconUrlFunction: function(url) {
    // 将相对路径转换为绝对路径
    if (!url.startsWith('http')) {
      return 'https://example.com/icons/' + url;
    }
    return url;
  }
});`

// 读取方法参数
const readFeatureParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'KML 数据源' },
  { name: 'options', type: 'Object', description: '可选配置对象' }
])

const readFeaturesParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'KML 数据源' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readNameParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'KML 数据源' }
])

const readNetworkLinksParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'KML 数据源' }
])

const readRegionParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'KML 数据源' }
])

const readCameraParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'KML 数据源' }
])

// 写入方法参数
const writeFeaturesParams = ref([
  { name: 'features', type: 'Array<Feature>', description: '要编码的要素数组' },
  { name: 'options', type: 'Object', description: '可选配置对象' }
])

const writeFeaturesNodeParams = ref([
  { name: 'features', type: 'Array<Feature>', description: '要编码的要素数组' },
  { name: 'options', type: 'Object', description: '可选配置对象' }
])

const fullExamples = `// ============================================
// 示例 1：读取 KML 文件
// ============================================
import KML from 'ol/format/KML.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';

const kmlFormat = new KML({
  extractStyles: true,
  showPointNames: true
});

// 从 URL 加载 KML
const vectorSource = new VectorSource({
  url: 'data/kml/places.kml',
  format: kmlFormat
});

const vectorLayer = new VectorLayer({
  source: vectorSource
});

// ============================================
// 示例 2：从字符串读取 KML
// ============================================
const kmlString = \`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>我的地点</name>
    <Placemark>
      <name>北京</name>
      <Point>
        <coordinates>116.4074,39.9042,0</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>\`;

const features = kmlFormat.readFeatures(kmlString, {
  featureProjection: 'EPSG:3857'
});

// 读取 KML 名称
const name = kmlFormat.readName(kmlString);
console.log('KML 名称:', name); // 输出：我的地点

// ============================================
// 示例 3：读取 NetworkLink 和 Region
// ============================================
const networkLinks = kmlFormat.readNetworkLinks(kmlString);
console.log('NetworkLinks:', networkLinks);

const regions = kmlFormat.readRegion(kmlString);
console.log('Regions:', regions);

const cameras = kmlFormat.readCamera(kmlString);
console.log('Cameras:', cameras);

// ============================================
// 示例 4：写入 KML
// ============================================
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Style, Icon } from 'ol/style.js';

const feature = new Feature({
  geometry: new Point([12907000, 4713000])
});
feature.set('name', '我的位置');

const kmlString = kmlFormat.writeFeatures([feature], {
  featureProjection: 'EPSG:3857'
});

// 写入为 XML 节点
const kmlNode = kmlFormat.writeFeaturesNode([feature]);

// ============================================
// 示例 5：完整的 KML 加载示例
// ============================================
function loadKML(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.text())
      .then(text => {
        const kmlFormat = new KML({
          extractStyles: true,
          showPointNames: true
        });
        const features = kmlFormat.readFeatures(text, {
          featureProjection: 'EPSG:3857'
        });

        // 获取 KML 元数据
        const name = kmlFormat.readName(text);
        const networkLinks = kmlFormat.readNetworkLinks(text);
        const regions = kmlFormat.readRegion(text);

        resolve({
          name,
          features,
          networkLinks,
          regions
        });
      })
      .catch(reject);
  });
}

// 使用示例
loadKML('data/kml/earthquakes.kml').then(data => {
  console.log('KML 名称:', data.name);
  console.log('要素数量:', data.features.length);
  console.log('NetworkLinks:', data.networkLinks);
  console.log('Regions:', data.regions);
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
