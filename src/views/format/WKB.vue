<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>WKB - 格式转换 API</h2>
            <p class="description">
              WKB（Well-Known Binary）是一种用于表示几何对象的二进制格式。
              OpenLayers 的 WKB 格式类用于读取和写入 WKB 格式的几何对象和要素，支持 EWKB（Extended WKB）格式。
              WKB 比 WKT 更紧凑，适合在网络上传输和存储。
            </p>
            <div class="official-links">
              <el-link
                type="primary"
                href="https://openlayers.org/en/latest/apidoc/module-ol_format_WKB-WKB.html"
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
                  <span class="api-name">new WKB(options)</span>
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
                  <p class="method-desc">读取单个 WKB 要素。</p>
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
                  <p class="method-desc">读取 WKB 格式的所有要素。</p>
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
                  <p class="method-desc">读取单个 WKB 几何对象。</p>
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
                  <p class="method-desc">从 WKB 源中读取坐标系信息。</p>
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
                    <el-tag size="small" type="success">返回：Projection | undefined</el-tag>
                    <span>解析的坐标系对象，如果不存在则返回 undefined</span>
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
                  <p class="method-desc">将单个要素编码为 WKB 格式。</p>
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
                    <el-tag size="small" type="success">返回：string | ArrayBuffer</el-tag>
                    <span>WKB 格式的十六进制字符串或 ArrayBuffer</span>
                  </div>
                </div>

                <!-- writeFeatures -->
                <div class="method-block">
                  <h4 class="method-name">writeFeatures(features, options)</h4>
                  <p class="method-desc">将要素数组编码为 WKB 格式。</p>
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
                    <el-tag size="small" type="success">返回：string | ArrayBuffer</el-tag>
                    <span>WKB 格式的十六进制字符串或 ArrayBuffer</span>
                  </div>
                </div>

                <!-- writeGeometry -->
                <div class="method-block">
                  <h4 class="method-name">writeGeometry(geometry, options)</h4>
                  <p class="method-desc">将几何对象编码为 WKB 格式。</p>
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
                    <el-tag size="small" type="success">返回：string | ArrayBuffer</el-tag>
                    <span>WKB 格式的十六进制字符串或 ArrayBuffer</span>
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
  { name: 'splitCollection', type: 'boolean', default: 'false', description: '读取时是否将 GeometryCollection 拆分为多个要素' },
  { name: 'hex', type: 'boolean', default: 'true', description: '输出时是否返回十六进制字符串而不是 ArrayBuffer' },
  { name: 'littleEndian', type: 'boolean', default: 'true', description: '输出时使用小端字节序' },
  { name: 'ewkb', type: 'boolean', default: 'true', description: '输出时使用 EWKB（Extended WKB）格式' },
  { name: 'geometryLayout', type: 'GeometryLayout', default: 'null', description: '输出时使用特定的坐标布局（null 表示自动检测）' },
  { name: 'nodataZ', type: 'number', default: '0', description: '如果 geometryLayout 与要输出的几何不匹配，用于填充 Z 坐标缺失值' },
  { name: 'nodataM', type: 'number', default: '0', description: '如果 geometryLayout 与要输出的几何不匹配，用于填充 M 坐标缺失值' },
  { name: 'srid', type: 'number | boolean', default: 'true', description: '输出的 SRID。设置整数值强制作为 SRID，true 从投影中提取，false 抑制输出（需要 ewkb 为 true）' }
])

const constructorExample = `import WKB from 'ol/format/WKB.js';

// 基础用法
const wkbFormat = new WKB();

// 拆分 GeometryCollection 为多个要素
const wkbWithSplit = new WKB({
  splitCollection: true
});

// 输出为 ArrayBuffer 而不是十六进制字符串
const wkbWithBuffer = new WKB({
  hex: false
});

// 使用大端字节序
const wkbBigEndian = new WKB({
  littleEndian: false
});

// 禁用 EWKB 格式（使用标准 WKB）
const wkbStandard = new WKB({
  ewkb: false
});

// 设置特定坐标布局和 SRID
const wkbWithOptions = new WKB({
  geometryLayout: 'XYZ',
  srid: 4326,
  nodataZ: -9999,
  nodataM: -9999
});`

// 读取方法参数
const readFeatureParams = ref([
  { name: 'source', type: 'ArrayBuffer | string', description: 'WKB 格式的数据源（十六进制字符串或 ArrayBuffer）' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.extent', type: 'Extent', description: '正在读取的图块的地图单位范围' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readFeaturesParams = ref([
  { name: 'source', type: 'ArrayBuffer | string', description: 'WKB 格式的数据源' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.extent', type: 'Extent', description: '图块的地图单位范围' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的要素几何图形的坐标系' }
])

const readGeometryParams = ref([
  { name: 'source', type: 'ArrayBuffer | string', description: 'WKB 格式的字符串或 ArrayBuffer' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '创建的几何图形的坐标系' }
])

const readProjectionParams = ref([
  { name: 'source', type: 'ArrayBuffer | string', description: 'WKB 格式的数据源' }
])

// 写入方法参数
const writeFeatureParams = ref([
  { name: 'feature', type: 'Feature', description: '要编码的要素对象' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '遵循右手定则用于线性环方向' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeFeaturesParams = ref([
  { name: 'features', type: 'Array<Feature>', description: '要编码的要素数组' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的要素几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '遵循右手定则' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const writeGeometryParams = ref([
  { name: 'geometry', type: 'Geometry', description: '要编码的几何对象' },
  { name: 'options.dataProjection', type: 'ProjectionLike', description: '写入数据的坐标系' },
  { name: 'options.featureProjection', type: 'ProjectionLike', description: '要序列化的几何图形的坐标系' },
  { name: 'options.rightHanded', type: 'boolean', description: '遵循右手定则' },
  { name: 'options.decimals', type: 'number', description: '坐标的最大小数位数' }
])

const fullExamples = `// ============================================
// 示例 1：读取 WKB 几何对象
// ============================================
import WKB from 'ol/format/WKB.js';

const wkbFormat = new WKB();

// 从十六进制字符串读取点
const pointHex = '010100000000000000000024400000000000003440';
const point = wkbFormat.readGeometry(pointHex, {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857'
});

// 从 ArrayBuffer 读取
function hexToArrayBuffer(hex) {
  const typedArray = new Uint8Array(
    hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
  );
  return typedArray.buffer;
}

const arrayBuffer = hexToArrayBuffer(pointHex);
const pointFromBuffer = wkbFormat.readGeometry(arrayBuffer);

// ============================================
// 示例 2：拆分 GeometryCollection
// ============================================
const wkbWithSplit = new WKB({
  splitCollection: true
});

// 假设有一个 GeometryCollection 的 WKB
const collectionWKB = '010700000002000000...' // 简化的示例
const features = wkbWithSplit.readFeatures(collectionWKB);
console.log('要素数量:', features.length);

// ============================================
// 示例 3：写入 WKB 几何对象
// ============================================
import Point from 'ol/geom/Point.js';
import LineString from 'ol/geom/LineString.js';
import Polygon from 'ol/geom/Polygon.js';

const point = new Point([10, 20]);

// 写入为十六进制字符串（默认）
const pointHex = wkbFormat.writeGeometry(point, {
  featureProjection: 'EPSG:4326'
});
console.log(pointHex); // 输出：010100000000000000000024400000000000003440

// 写入为 ArrayBuffer
const wkbNoHex = new WKB({ hex: false });
const pointBuffer = wkbNoHex.writeGeometry(point, {
  featureProjection: 'EPSG:4326'
});
console.log(pointBuffer); // 输出：ArrayBuffer

// ============================================
// 示例 4：EWKB 格式（带 SRID）
// ============================================
const wkbEwkb = new WKB({
  ewkb: true,
  srid: 4326
});

const ewkbHex = wkbEwkb.writeGeometry(point, {
  featureProjection: 'EPSG:4326'
});
// EWKB 格式在开头包含 SRID 信息

// ============================================
// 示例 5：带 Z 坐标的几何
// ============================================
import WKT from 'ol/format/WKT.js';

const wktFormat = new WKT();
// 读取带 Z 坐标的点
const pointZ = wktFormat.readGeometry('POINT Z(10 20 30)');

// 写入为 EWKB 格式，使用 XYZ 布局
const wkbWithZ = new WKB({
  geometryLayout: 'XYZ',
  ewkb: true
});

const wkbZ = wkbWithZ.writeGeometry(pointZ);
console.log(wkbZ);

// ============================================
// 示例 6：完整的读写循环
// ============================================
function geometryToWKB(geometry, projection = 'EPSG:4326') {
  const wkbFormat = new WKB({
    hex: true,
    ewkb: true,
    srid: 4326
  });
  return wkbFormat.writeGeometry(geometry, {
    featureProjection: projection
  });
}

function wkbToGeometry(wkb, dataProjection = 'EPSG:4326', featureProjection = 'EPSG:3857') {
  const wkbFormat = new WKB();
  return wkbFormat.readGeometry(wkb, {
    dataProjection,
    featureProjection
  });
}

// 使用示例
import { fromLonLat } from 'ol/proj.js';

const originalPoint = new Point(fromLonLat([116.4074, 39.9042]));
const wkb = geometryToWKB(originalPoint);
console.log('WKB:', wkb);

const restoredGeometry = wkbToGeometry(wkb);
console.log('恢复的几何:', restoredGeometry.getCoordinates());

// ============================================
// 示例 7：与数据库集成（PostGIS）
// ============================================
// PostGIS 使用 EWKB 格式存储几何
async function saveToPostGIS(feature) {
  const wkbFormat = new WKB({
    ewkb: true,
    hex: true,
    srid: 4326
  });

  const wkb = wkbFormat.writeGeometry(feature.getGeometry(), {
    featureProjection: 'EPSG:4326'
  });

  // 发送到后端保存
  await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wkb: wkb,
      properties: feature.getProperties()
    })
  });
}

async function loadFromPostGIS(wkb) {
  const wkbFormat = new WKB();
  const geometry = wkbFormat.readGeometry(wkb, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
  return geometry;
}`
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
