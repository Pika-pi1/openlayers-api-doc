<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>LinearRing - 线性环 API</h2>
            <p class="description">
              LinearRing 是闭合的 LineString，用于定义 Polygon 的外环和内环（洞）。
              第一个顶点和最后一个顶点必须相同，形成闭合环。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_geom_LinearRing-LinearRing.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? linearRingApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: linearRingApis.length },
    { name: 'constructor', cn: '构造函数', count: linearRingApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: linearRingApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return linearRingApis
  if (currentCategory.value === 'constructor') return linearRingApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return linearRingApis.filter(a => a.type === 'method')
  return linearRingApis
})

const linearRingApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的线性环。线性环是闭合的多段线，用于定义多边形的边界。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

// 创建线性环（第一个和最后一个坐标必须相同）
const ring = new LinearRing([
  [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
]);

// 外环必须是逆时针方向（在 EPSG:3857/4326 中）
const outerRing = new LinearRing([
  [0, 0], [100, 0], [100, 100], [0, 100], [0, 0]
]);

// 内环（洞）必须是顺时针方向
const innerRing = new LinearRing([
  [20, 20], [20, 40], [40, 40], [40, 20], [20, 20]
]);`,
    params: [
      { name: 'coordinates', type: 'Array<Array<number>>', default: '[]', description: '坐标数组，第一个和最后一个坐标必须相同' }
    ],
    returns: { type: 'LinearRing', description: '新的线性环实例' }
  },
  {
    name: 'getCoordinates',
    cn: '获取坐标',
    type: 'method',
    category: 'methods',
    description: '获取线性环的坐标数组。返回的数组中第一个和最后一个坐标相同。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing([
  [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
]);

const coords = ring.getCoordinates();
console.log(coords);
// [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]

// 验证是否闭合
const first = coords[0];
const last = coords[coords.length - 1];
console.log(first[0] === last[0] && first[1] === last[1]); // true`,
    params: [],
    returns: { type: 'Array<Array<number>>', description: '坐标数组' }
  },
  {
    name: 'setCoordinates',
    cn: '设置坐标',
    type: 'method',
    category: 'methods',
    description: '设置线性环的坐标。确保第一个和最后一个坐标相同以保持闭合。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing();

// 设置新坐标
ring.setCoordinates([
  [0, 0], [20, 0], [20, 20], [0, 20], [0, 0]
]);

console.log(ring.getCoordinates());`,
    params: [
      { name: 'coordinates', type: 'Array<Array<number>>', default: '', description: '新坐标数组' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'clone',
    cn: '克隆环',
    type: 'method',
    category: 'methods',
    description: '创建线性环的深拷贝。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing([
  [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
]);

const cloned = ring.clone();

// 修改克隆环不影响原环
cloned.setCoordinates([
  [0, 0], [20, 0], [20, 20], [0, 20], [0, 0]
]);

console.log(ring.getExtent()); // [0, 0, 10, 10]
console.log(cloned.getExtent()); // [0, 0, 20, 20]`,
    params: [],
    returns: { type: 'LinearRing', description: '克隆的线性环' }
  },
  {
    name: 'getExtent',
    cn: '获取范围',
    type: 'method',
    category: 'methods',
    description: '获取线性环的最小包围盒。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing([
  [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
]);

const extent = ring.getExtent();
console.log(extent); // [0, 0, 10, 10]`,
    params: [],
    returns: { type: 'Array<number>', description: '范围数组 [minX, minY, maxX, maxY]' }
  },
  {
    name: 'getType',
    cn: '获取类型',
    type: 'method',
    category: 'methods',
    description: '获取几何类型，LinearRing 返回 "LinearRing"。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing();
console.log(ring.getType()); // 'LinearRing'`,
    params: [],
    returns: { type: 'string', description: '几何类型' }
  },
  {
    name: 'getArea',
    cn: '获取面积',
    type: 'method',
    category: 'methods',
    description: '使用鞋带公式（Shoelace formula）计算线性环包围的面积。外环返回正值，内环返回负值。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

// 外环（逆时针）
const outerRing = new LinearRing([
  [0, 0], [100, 0], [100, 100], [0, 100], [0, 0]
]);
console.log(outerRing.getArea()); // 10000（正值）

// 内环（顺时针）
const innerRing = new LinearRing([
  [20, 20], [20, 40], [40, 40], [40, 20], [20, 20]
]);
console.log(innerRing.getArea()); // -400（负值）

// 计算多边形面积（外环 + 内环）
const polygonArea = Math.abs(outerRing.getArea()) - Math.abs(innerRing.getArea());
console.log(polygonArea); // 9600`,
    params: [],
    returns: { type: 'number', description: '环的面积，外环为正，内环为负' }
  },
  {
    name: 'getFlatCoordinates',
    cn: '获取扁平坐标',
    type: 'method',
    category: 'methods',
    description: '获取扁平化的坐标数组。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing([
  [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
]);

const flatCoords = ring.getFlatCoordinates();
console.log(flatCoords); // [0, 0, 10, 0, 10, 10, 0, 10, 0, 0]

const stride = ring.getStride(); // 2
console.log('顶点数:', flatCoords.length / stride); // 5`,
    params: [],
    returns: { type: 'Array<number>', description: '扁平坐标数组' }
  },
  {
    name: 'getStride',
    cn: '获取跨距',
    type: 'method',
    category: 'methods',
    description: '获取每个顶点的坐标数量。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring2D = new LinearRing([[0, 0], [10, 0], [10, 10], [0, 0]]);
console.log(ring2D.getStride()); // 2

const ring3D = new LinearRing([[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 0, 0]]);
console.log(ring3D.getStride()); // 3`,
    params: [],
    returns: { type: 'number', description: '跨距（2=XY, 3=XYZ 或 XYM, 4=XYZM）' }
  },
  {
    name: 'rotate',
    cn: '旋转环',
    type: 'method',
    category: 'methods',
    description: '绕指定点旋转线性环。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing([
  [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
]);

// 绕原点旋转 45 度
ring.rotate(Math.PI / 4, [0, 0]);
console.log(ring.getCoordinates());`,
    params: [
      { name: 'angle', type: 'number', default: '', description: '旋转角度（弧度）' },
      { name: 'anchor', type: 'Array<number>', default: '', description: '旋转中心' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'scale',
    cn: '缩放环',
    type: 'method',
    category: 'methods',
    description: '缩放线性环。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing([
  [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
]);

// 放大 2 倍
ring.scale(2, 2, [0, 0]);
console.log(ring.getExtent()); // [0, 0, 20, 20]`,
    params: [
      { name: 'sx', type: 'number', default: '', description: 'X 方向缩放比例' },
      { name: 'sy', type: 'number', default: 'undefined', description: 'Y 方向缩放比例' },
      { name: 'anchor', type: 'Array<number>', default: '[0, 0]', description: '缩放中心' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'translate',
    cn: '平移环',
    type: 'method',
    category: 'methods',
    description: '平移线性环。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing([
  [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
]);

// 向右平移 5，向上平移 5
ring.translate(5, 5);
console.log(ring.getExtent()); // [5, 5, 15, 15]`,
    params: [
      { name: 'dx', type: 'number', default: '', description: 'X 方向平移距离' },
      { name: 'dy', type: 'number', default: '', description: 'Y 方向平移距离' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'transform',
    cn: '转换投影',
    type: 'method',
    category: 'methods',
    description: '将线性环从一种投影转换到另一种。',
    usage: `import LinearRing from 'ol/geom/LinearRing.js';

const ring = new LinearRing([
  [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
]);

// 设置源投影
ring.set('proj', 'EPSG:4326');

// 转换到 Web Mercator
ring.transform('EPSG:4326', 'EPSG:3857');
console.log(ring.getCoordinates());`,
    params: [
      { name: 'source', type: 'string|Projection', default: '', description: '源投影' },
      { name: 'destination', type: 'string|Projection', default: '', description: '目标投影' }
    ],
    returns: { type: 'void', description: '无返回值' }
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
