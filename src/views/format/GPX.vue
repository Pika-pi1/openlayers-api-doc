<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>GPX - 格式转换 API</h2>
            <p class="description">
              GPX（GPS Exchange Format）是一种用于存储 GPS 数据的 XML 格式。
              OpenLayers 的 GPX 格式类用于读取和写入 GPX 格式的数据，支持航点（waypoints）、
              路线（routes）和轨迹（tracks）。读取时，路线转换为 LineString，轨迹转换为 MultiLineString。
            </p>
            <div class="official-links">
              <el-link
                type="primary"
                href="https://openlayers.org/en/latest/apidoc/module-ol_format_GPX-GPX.html"
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
                  <span class="api-name">new GPX(options)</span>
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
                  <p class="method-desc">读取单个 GPX 要素（只返回第一个要素）。</p>
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
                  <p class="method-desc">读取 GPX 文档中的所有要素。</p>
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

                <!-- readMetadata -->
                <div class="method-block">
                  <h4 class="method-name">readMetadata(source)</h4>
                  <p class="method-desc">读取 GPX 文档的元数据信息（metadata 元素）。</p>
                  <el-table :data="readMetadataParams" style="width: 100%" size="small" border class="api-table" row-key="name">
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
                    <el-tag size="small" type="success">返回：GPXMetadata</el-tag>
                    <span>包含名称、描述、作者、链接、时间等信息的元数据对象</span>
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
                  <p class="method-desc">将要素数组编码为 GPX 格式的字符串。</p>
                  <p class="method-desc" style="margin-top: 8px;">
                    <strong>转换规则：</strong>LineString 几何转换为路线（&lt;rte&gt;），MultiLineString 转换为轨迹（&lt;trk&gt;）。
                  </p>
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
                    <span>GPX 格式的 XML 字符串</span>
                  </div>
                </div>

                <!-- writeFeaturesNode -->
                <div class="method-block">
                  <h4 class="method-name">writeFeaturesNode(features, options)</h4>
                  <p class="method-desc">将要素数组编码为 GPX 格式的 XML 节点。</p>
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
                    <span>GPX 格式的 XML 节点</span>
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
  { name: 'read', cn: '读取方法', count: 3 },
  { name: 'write', cn: '写入方法', count: 2 },
  { name: 'example', cn: '示例', count: 1 }
]

const filterByCategory = (category) => {
  currentCategory.value = category
}

// 构造函数参数
const constructorParams = ref([
  { name: 'readExtensions', type: 'Function', default: '-', description: '回调函数，用于处理 extensions 节点。注意：只能处理 wpt、rte 和 trk 中的 extensions 节点，函数不应存储引用以避免内存泄漏' }
])

const constructorExample = `import GPX from 'ol/format/GPX.js';

// 基础用法
const gpxFormat = new GPX();

// 自定义扩展节点处理函数
const gpxWithExtensions = new GPX({
  readExtensions: function(extensions, feature) {
    // 处理 GPX 扩展数据
    if (extensions) {
      const powerData = extensions.querySelector('power');
      if (powerData) {
        feature.set('power', powerData.textContent);
      }
      const heartRate = extensions.querySelector('heartRate');
      if (heartRate) {
        feature.set('heartRate', heartRate.textContent);
      }
    }
  }
});`

// 读取方法参数
const readFeatureParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'GPX 数据源' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系（默认从 GPX 数据中推导）' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readFeaturesParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'GPX 数据源' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readMetadataParams = ref([
  { name: 'source', type: 'Document | Element | string', description: 'GPX 数据源' }
])

// 写入方法参数
const writeFeaturesParams = ref([
  { name: 'features', type: 'Array<Feature>', description: '要编码的要素数组' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeFeaturesNodeParams = ref([
  { name: 'features', type: 'Array<Feature>', description: '要编码的要素数组' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' }
])

const fullExamples = `// ============================================
// 示例 1：读取 GPX 文件
// ============================================
import GPX from 'ol/format/GPX.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';

const gpxFormat = new GPX();

// 从 URL 加载 GPX
const vectorSource = new VectorSource({
  url: 'data/gpx/track.gpx',
  format: gpxFormat
});

const vectorLayer = new VectorLayer({
  source: vectorSource
});

// ============================================
// 示例 2：从字符串读取 GPX
// ============================================
const gpxString = \`<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="OpenLayers">
  <metadata>
    <name>我的轨迹</name>
    <desc>GPS 轨迹记录</desc>
    <time>2024-01-01T08:00:00Z</time>
  </metadata>
  <wpt lat="39.9042" lon="116.4074">
    <name>北京</name>
    <ele>50</ele>
  </wpt>
  <rte>
    <name>路线 1</name>
    <rtept lat="39.9" lon="116.4"></rtept>
    <rtept lat="39.91" lon="116.41"></rtept>
  </rte>
  <trk>
    <name>轨迹 1</name>
    <trkseg>
      <trkpt lat="39.9" lon="116.4">
        <ele>50</ele>
        <time>2024-01-01T08:00:00Z</time>
      </trkpt>
      <trkpt lat="39.91" lon="116.41">
        <ele>55</ele>
        <time>2024-01-01T08:01:00Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>\`;

const features = gpxFormat.readFeatures(gpxString, {
  featureProjection: 'EPSG:3857'
});

// 读取元数据
const metadata = gpxFormat.readMetadata(gpxString);
console.log('名称:', metadata.name);
console.log('描述:', metadata.desc);
console.log('时间:', metadata.time);

// ============================================
// 示例 3：处理扩展数据
// ============================================
const gpxWithExtensions = new GPX({
  readExtensions: function(extensions, feature) {
    if (extensions) {
      // 读取功率数据
      const power = extensions.querySelector('power');
      if (power) {
        feature.set('power', parseFloat(power.textContent));
      }
      // 读取心率数据
      const hr = extensions.querySelector('heartRate');
      if (hr) {
        feature.set('heartRate', parseInt(hr.textContent));
      }
      // 读取速度数据
      const speed = extensions.querySelector('speed');
      if (speed) {
        feature.set('speed', parseFloat(speed.textContent));
      }
    }
  }
});

const featuresWithExt = gpxWithExtensions.readFeatures(gpxString);
featuresWithExt.forEach(feature => {
  console.log('功率:', feature.get('power'));
  console.log('心率:', feature.get('heartRate'));
});

// ============================================
// 示例 4：写入 GPX
// ============================================
import Feature from 'ol/Feature.js';
import LineString from 'ol/geom/LineString.js';
import MultiLineString from 'ol/geom/MultiLineString.js';
import Point from 'ol/geom/Point.js';

// 创建航点要素
const waypoint = new Feature({
  geometry: new Point([12907000, 4713000])
});
waypoint.set('name', '我的位置');
waypoint.set('ele', 50);

// 创建路线要素（LineString 会被写为 <rte>）
const route = new Feature({
  geometry: new LineString([
    [12907000, 4713000],
    [12908000, 4714000],
    [12909000, 4715000]
  ])
});
route.set('name', '我的路线');

// 创建轨迹要素（MultiLineString 会被写为 <trk>）
const track = new Feature({
  geometry: new MultiLineString([
    [[12907000, 4713000], [12908000, 4714000]],
    [[12909000, 4715000], [12910000, 4716000]]
  ])
});
track.set('name', '我的轨迹');

// 写入 GPX 字符串
const gpxOutput = gpxFormat.writeFeatures([waypoint, route, track], {
  featureProjection: 'EPSG:3857',
  dataProjection: 'EPSG:4326',
  decimals: 6
});

// 写入为 XML 节点
const gpxNode = gpxFormat.writeFeaturesNode([waypoint, route, track]);

// ============================================
// 示例 5：完整的 GPX 加载示例
// ============================================
function loadGPX(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.text())
      .then(text => {
        const gpxFormat = new GPX({
          readExtensions: function(extensions, feature) {
            if (extensions) {
              const ele = extensions.querySelector('ele');
              if (ele) {
                feature.set('ele', parseFloat(ele.textContent));
              }
            }
          }
        });

        const features = gpxFormat.readFeatures(text, {
          featureProjection: 'EPSG:3857'
        });

        const metadata = gpxFormat.readMetadata(text);

        resolve({
          metadata,
          features
        });
      })
      .catch(reject);
  });
}

// 使用示例
loadGPX('data/gpx/hiking.gpx').then(data => {
  console.log('轨迹名称:', data.metadata.name);
  console.log('要素数量:', data.features.length);
  data.features.forEach((feature, index) => {
    console.log('要素 ' + index + ':', feature.getProperties());
  });
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
