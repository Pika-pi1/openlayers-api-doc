<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Polyline - 编码折线格式 API</h2>
            <p class="description">
              Polyline 格式用于读取和写入 Google 编码折线格式。
              编码折线是一种用于存储和传输折线几何的压缩文本格式，常用于路线规划 API。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_format_Polyline-Polyline.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? polylineApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: polylineApis.length },
    { name: 'constructor', cn: '构造函数', count: polylineApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: polylineApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return polylineApis
  if (currentCategory.value === 'constructor') return polylineApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return polylineApis.filter(a => a.type === 'method')
  return polylineApis
})

const polylineApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 Polyline 格式实例。Polyline 格式用于读取和写入 Google 编码折线格式，这是一种用于存储折线几何的压缩文本格式。',
    usage: `import Polyline from 'ol/format/Polyline.js';

// 创建 Polyline 格式实例
const polylineFormat = new Polyline({
  factor: 1e5  // 坐标缩放因子，默认 100000
});

// 从编码折线字符串读取几何
const geometry = polylineFormat.readGeometry(encodedPolyline);

// 将几何写入编码折线
const encoded = polylineFormat.writeGeometry(geometry);`,
    params: [
      { name: 'factor', type: 'number', default: '1e5', description: '坐标缩放因子，用于编码时的精度控制，默认 100000' }
    ],
    returns: { type: 'Polyline', description: '新的 Polyline 格式实例' }
  },
  {
    name: 'readGeometry',
    cn: '读取几何对象',
    type: 'method',
    category: 'methods',
    description: '从编码折线字符串中读取几何对象。将 Google 编码折线解码为 LineString 几何。',
    usage: `import Polyline from 'ol/format/Polyline.js';

const format = new Polyline({ factor: 1e5 });

// 从编码折线读取几何
const encoded = '_p~iF~ps|U_ulLnnqC_mqNvxq' + String.fromCharCode(96) + '@';
const geometry = format.readGeometry(encoded);

console.log(geometry.getType()); // 'LineString'
console.log(geometry.getCoordinates());

// 创建要素并添加到地图
const feature = new Feature(geometry);
vectorSource.addFeature(feature);`,
    params: [
      { name: 'encodedPolyline', type: 'string', default: '', description: 'Google 编码折线字符串' },
      { name: 'options', type: 'Object', default: 'undefined', description: '读取选项，可指定 factor' }
    ],
    returns: { type: 'LineString', description: '读取的 LineString 几何对象' }
  },
  {
    name: 'writeGeometry',
    cn: '写入几何对象',
    type: 'method',
    category: 'methods',
    description: '将 LineString 几何对象写入编码折线格式。将几何编码为 Google 折线格式字符串。',
    usage: `import Polyline from 'ol/format/Polyline.js';
import { LineString } from 'ol/geom.js';

const format = new Polyline({ factor: 1e5 });

// 创建 LineString 几何
const line = new LineString([
  [116.4, 39.9],
  [116.5, 39.9],
  [116.5, 40.0],
  [116.4, 40.0]
]);

// 编码为折线字符串
const encoded = format.writeGeometry(line);
console.log(encoded);

// 用于 Google Maps API 或路线规划
const googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&path=' + encoded;`,
    params: [
      { name: 'geometry', type: 'LineString', default: '', description: '要编码的 LineString 几何对象' },
      { name: 'options', type: 'Object', default: 'undefined', description: '写入选项，可指定 factor' }
    ],
    returns: { type: 'string', description: 'Google 编码折线字符串' }
  },
  {
    name: 'decodeDeltas',
    cn: '解码差值',
    type: 'method',
    category: 'methods',
    description: '解码编码折线中的差值。这是一个静态工具方法，用于理解编码折线的内部工作原理。',
    usage: `import Polyline from 'ol/format/Polyline.js';

// 解码编码折线字符串
const encoded = '_p~iF~ps|U_ulLnnqC';
const decoded = Polyline.decodeDeltas(encoded, 5); // 5 位精度

console.log(decoded);
// 输出：[[lat1, lon1], [lat2, lon2], ...]

// 注意：这是一个静态方法，不需要实例化
const coords = Polyline.decodeDeltas(encoded, 5);`,
    params: [
      { name: 'encoded', type: 'string', default: '', description: '编码折线字符串' },
      { name: 'precision', type: 'number', default: '5', description: '坐标精度位数' }
    ],
    returns: { type: 'Array<Array<number>>', description: '解码后的坐标数组 [[lat, lon], ...]' }
  },
  {
    name: 'encodeDeltas',
    cn: '编码差值',
    type: 'method',
    category: 'methods',
    description: '将坐标差值编码为折线格式。这是一个静态工具方法，用于将坐标数组编码为 Google 折线格式。',
    usage: `import Polyline from 'ol/format/Polyline.js';

// 编码坐标数组
const coords = [
  [39.9, 116.4],
  [39.9, 116.5],
  [40.0, 116.5],
  [40.0, 116.4]
];

const encoded = Polyline.encodeDeltas(coords, 5);
console.log(encoded);

// 注意：坐标顺序为 [lat, lon]（纬度，经度）`,
    params: [
      { name: 'coords', type: 'Array<Array<number>>', default: '', description: '坐标数组 [[lat, lon], ...]' },
      { name: 'precision', type: 'number', default: '5', description: '坐标精度位数' }
    ],
    returns: { type: 'string', description: '编码后的折线字符串' }
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
