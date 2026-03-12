<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>SimpleGeometry - 简单几何基类 API</h2>
            <p class="description">
              SimpleGeometry 是简单几何对象（Point, LineString, Polygon 等）的基类。
              它继承自 Geometry，添加了几何布局（layout）和顶点坐标的管理功能。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_geom_SimpleGeometry-SimpleGeometry.html" target="_blank">
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

const activeNames = ref(['getLayout'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? simpleGeometryApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'method': 'success'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: simpleGeometryApis.length },
    { name: 'methods', cn: '方法', count: simpleGeometryApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return simpleGeometryApis
  if (currentCategory.value === 'methods') return simpleGeometryApis.filter(a => a.type === 'method')
  return simpleGeometryApis
})

const simpleGeometryApis = [
  {
    name: 'getLayout',
    cn: '获取布局',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的布局类型。布局决定了坐标的维度。',
    usage: `import Point from 'ol/geom/Point.js';

// XY 布局（2D）
const point2D = new Point([0, 0]);
console.log(point2D.getLayout()); // 'XY'

// XYZ 布局（3D）
const point3D = new Point([0, 0, 100]);
console.log(point3D.getLayout()); // 'XYZ'

// XYM 布局（带测量值）
// 需要通过 setLayout 设置

// XYZM 布局（3D + 测量值）`,
    params: [],
    returns: { type: 'GeometryLayout', description: '布局类型：XY, XYZ, XYM, XYZM' }
  },
  {
    name: 'getFlatCoordinates',
    cn: '获取扁平坐标',
    type: 'method',
    category: 'methods',
    description: '获取扁平化的坐标数组。所有顶点坐标按顺序存储在一维数组中。',
    usage: `import LineString from 'ol/geom/LineString.js';

const line = new LineString([[0, 0], [10, 10], [20, 20]]);
const flatCoords = line.getFlatCoordinates();
console.log(flatCoords); // [0, 0, 10, 10, 20, 20]

// 用于高性能渲染和计算
const stride = line.getStride(); // 2 for XY
for (let i = 0; i < flatCoords.length; i += stride) {
  const x = flatCoords[i];
  const y = flatCoords[i + 1];
  console.log(\`顶点：[\${x}, \${y}]\`);
}`,
    params: [],
    returns: { type: 'Array<number>', description: '扁平化的坐标数组' }
  },
  {
    name: 'getStride',
    cn: '获取跨距',
    type: 'method',
    category: 'methods',
    description: '获取每个顶点的坐标数量（跨距）。XY=2, XYZ=3, XYM=3, XYZM=4。',
    usage: `import Point from 'ol/geom/Point.js';

const point2D = new Point([0, 0]);
console.log(point2D.getStride()); // 2

const point3D = new Point([0, 0, 100]);
console.log(point3D.getStride()); // 3

// 用于遍历扁平坐标数组
const flatCoords = line.getFlatCoordinates();
const stride = line.getStride();
const vertexCount = flatCoords.length / stride;`,
    params: [],
    returns: { type: 'number', description: '每个顶点的坐标数量' }
  },
  {
    name: 'getFirstCoordinate',
    cn: '获取起点',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的第一个顶点坐标。',
    usage: `import LineString from 'ol/geom/LineString.js';

const line = new LineString([[0, 0], [10, 10], [20, 20]]);
const first = line.getFirstCoordinate();
console.log(first); // [0, 0]

// 用于获取路径起点
const routeStart = routeLine.getFirstCoordinate();`,
    params: [],
    returns: { type: 'Array<number>', description: '第一个顶点的坐标' }
  },
  {
    name: 'getLastCoordinate',
    cn: '获取终点',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的最后一个顶点坐标。',
    usage: `import LineString from 'ol/geom/LineString.js';

const line = new LineString([[0, 0], [10, 10], [20, 20]]);
const last = line.getLastCoordinate();
console.log(last); // [20, 20]

// 用于获取路径终点
const routeEnd = routeLine.getLastCoordinate();`,
    params: [],
    returns: { type: 'Array<number>', description: '最后一个顶点的坐标' }
  },
  {
    name: 'getFlatMidpoint',
    cn: '获取中点',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的近似中点（基于扁平坐标的平均值）。',
    usage: `import LineString from 'ol/geom/LineString.js';

const line = new LineString([[0, 0], [10, 10]]);
const midpoint = line.getFlatMidpoint();
console.log(midpoint); // [5, 5]

// 用于标签定位
const labelCoord = line.getFlatMidpoint();`,
    params: [],
    returns: { type: 'Array<number>', description: '中点坐标' }
  },
  {
    name: 'getFlatMinX',
    cn: '获取最小 X',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的最小 X 坐标。',
    usage: `import Polygon from 'ol/geom/Polygon.js';

const polygon = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
const minX = polygon.getFlatMinX();
console.log(minX); // 0`,
    params: [],
    returns: { type: 'number', description: '最小 X 坐标' }
  },
  {
    name: 'getFlatMinY',
    cn: '获取最小 Y',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的最小 Y 坐标。',
    usage: `import Polygon from 'ol/geom/Polygon.js';

const polygon = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
const minY = polygon.getFlatMinY();
console.log(minY); // 0`,
    params: [],
    returns: { type: 'number', description: '最小 Y 坐标' }
  },
  {
    name: 'getFlatMaxX',
    cn: '获取最大 X',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的最大 X 坐标。',
    usage: `import Polygon from 'ol/geom/Polygon.js';

const polygon = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
const maxX = polygon.getFlatMaxX();
console.log(maxX); // 10`,
    params: [],
    returns: { type: 'number', description: '最大 X 坐标' }
  },
  {
    name: 'getFlatMaxY',
    cn: '获取最大 Y',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的最大 Y 坐标。',
    usage: `import Polygon from 'ol/geom/Polygon.js';

const polygon = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
const maxY = polygon.getFlatMaxY();
console.log(maxY); // 10`,
    params: [],
    returns: { type: 'number', description: '最大 Y 坐标' }
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
