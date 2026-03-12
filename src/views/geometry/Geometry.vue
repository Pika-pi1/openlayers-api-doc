<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Geometry - 几何对象基类 API</h2>
            <p class="description">
              Geometry 是所有几何对象的基类。
              它提供了通用的几何操作方法，如投影转换、克隆、获取范围等。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_geom_Geometry-Geometry.html" target="_blank">
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

const activeNames = ref(['getType'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? geometryApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'method': 'success',
    'event': 'warning'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: geometryApis.length },
    { name: 'methods', cn: '方法', count: geometryApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: geometryApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return geometryApis
  if (currentCategory.value === 'methods') return geometryApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return geometryApis.filter(a => a.type === 'event')
  return geometryApis
})

const geometryApis = [
  {
    name: 'getType',
    cn: '获取类型',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的类型字符串。返回的值用于标识几何对象的具体类型。',
    usage: `import Point from 'ol/geom/Point.js';
import LineString from 'ol/geom/LineString.js';
import Polygon from 'ol/geom/Polygon.js';

const point = new Point([0, 0]);
console.log(point.getType()); // 'Point'

const line = new LineString([[0, 0], [1, 1]]);
console.log(line.getType()); // 'LineString'

const polygon = new Polygon([[[0, 0], [1, 0], [1, 1], [0, 0]]]);
console.log(polygon.getType()); // 'Polygon'`,
    params: [],
    returns: { type: 'string', description: '几何类型，如 Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, GeometryCollection' }
  },
  {
    name: 'clone',
    cn: '克隆几何',
    type: 'method',
    category: 'methods',
    description: '创建几何对象的深拷贝。新对象与原对象完全独立。',
    usage: `import Point from 'ol/geom/Point.js';

const point = new Point([116.4, 39.9]);
const cloned = point.clone();

// 修改克隆对象不影响原对象
cloned.setCoordinates([117.0, 40.0]);
console.log(point.getCoordinates()); // [116.4, 39.9]
console.log(cloned.getCoordinates()); // [117.0, 40.0]`,
    params: [],
    returns: { type: 'Geometry', description: '克隆的几何对象' }
  },
  {
    name: 'getExtent',
    cn: '获取范围',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的最小包围盒（extent）。返回 [minX, minY, maxX, maxY]。',
    usage: `import LineString from 'ol/geom/LineString.js';

const line = new LineString([[0, 0], [10, 10]]);
const extent = line.getExtent();
console.log(extent); // [0, 0, 10, 10]

// 用于视图适配
view.fit(extent);`,
    params: [],
    returns: { type: 'Array<number>', description: '范围数组 [minX, minY, maxX, maxY]' }
  },
  {
    name: 'rotate',
    cn: '旋转几何',
    type: 'method',
    category: 'methods',
    description: '绕指定点旋转几何对象。角度以弧度为单位，顺时针方向为正。',
    usage: `import Point from 'ol/geom/Point.js';

const point = new Point([10, 0]);

// 绕原点逆时针旋转 90 度（π/2 弧度）
point.rotate(Math.PI / 2, [0, 0]);
console.log(point.getCoordinates()); // [0, 10]

// 绕中心点旋转
const polygon = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
polygon.rotate(Math.PI / 4, [5, 5]); // 绕中心旋转 45 度`,
    params: [
      { name: 'angle', type: 'number', default: '', description: '旋转角度（弧度），顺时针为正' },
      { name: 'anchor', type: 'Array<number>', default: '', description: '旋转中心点坐标' }
    ],
    returns: { type: 'void', description: '无返回值，直接修改几何对象' }
  },
  {
    name: 'scale',
    cn: '缩放几何',
    type: 'method',
    category: 'methods',
    description: '按比例缩放几何对象。可以分别在 X 和 Y 方向上缩放。',
    usage: `import Point from 'ol/geom/Point.js';

const point = new Point([10, 10]);

// 在 X 方向放大 2 倍
point.scale(2, 1, [0, 0]);
console.log(point.getCoordinates()); // [20, 10]

// 均匀缩放
point.scale(0.5, 0.5, [0, 0]);
console.log(point.getCoordinates()); // [10, 10]`,
    params: [
      { name: 'sx', type: 'number', default: '', description: 'X 方向缩放比例' },
      { name: 'sy', type: 'number', default: 'undefined', description: 'Y 方向缩放比例，默认为 sx' },
      { name: 'anchor', type: 'Array<number>', default: '[0, 0]', description: '缩放中心点' }
    ],
    returns: { type: 'void', description: '无返回值，直接修改几何对象' }
  },
  {
    name: 'translate',
    cn: '平移几何',
    type: 'method',
    category: 'methods',
    description: '将几何对象平移指定距离。',
    usage: `import Point from 'ol/geom/Point.js';

const point = new Point([0, 0]);

// 向右平移 10，向上平移 5
point.translate(10, 5);
console.log(point.getCoordinates()); // [10, 5]

// 平移 LineString
const line = new LineString([[0, 0], [10, 10]]);
line.translate(5, 5);
console.log(line.getCoordinates()); // [[5, 5], [15, 15]]`,
    params: [
      { name: 'dx', type: 'number', default: '', description: 'X 方向平移距离' },
      { name: 'dy', type: 'number', default: '', description: 'Y 方向平移距离' }
    ],
    returns: { type: 'void', description: '无返回值，直接修改几何对象' }
  },
  {
    name: 'transform',
    cn: '转换投影',
    type: 'method',
    category: 'methods',
    description: '将几何对象从一种投影转换到另一种投影。',
    usage: `import Point from 'ol/geom/Point.js';

// 创建 WGS84 坐标的点
const point = new Point([116.4, 39.9]);
point.get('proj') = 'EPSG:4326';

// 转换为 Web Mercator
point.transform('EPSG:4326', 'EPSG:3857');
console.log(point.getCoordinates()); // [12958396.72, 4865942.28]

// 在添加要素到地图时自动转换
const feature = new Feature(point);
feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
vectorSource.addFeature(feature);`,
    params: [
      { name: 'source', type: 'string|Projection', default: '', description: '源投影' },
      { name: 'destination', type: 'string|Projection', default: '', description: '目标投影' }
    ],
    returns: { type: 'void', description: '无返回值，直接修改几何对象' }
  },
  {
    name: 'simplify',
    cn: '简化几何',
    type: 'method',
    category: 'methods',
    description: '使用 Douglas-Peucker 算法简化几何对象，减少顶点数量。',
    usage: `import LineString from 'ol/geom/LineString.js';

// 创建复杂的多段线
const complexLine = new LineString([
  [0, 0], [1, 0.1], [2, -0.1], [3, 0.05], [4, 0], [5, 0]
]);

// 简化，容差为 0.5
const simplified = complexLine.simplify(0.5);
console.log(simplified.getCoordinates().length); // 顶点数减少`,
    params: [
      { name: 'tolerance', type: 'number', default: '', description: '简化容差，值越大越简化' }
    ],
    returns: { type: 'Geometry', description: '简化后的几何对象' }
  },
  {
    name: 'getClosestPoint',
    cn: '获取最近点',
    type: 'method',
    category: 'methods',
    description: '获取几何对象上距离给定点最近的点。',
    usage: `import LineString from 'ol/geom/LineString.js';

const line = new LineString([[0, 0], [10, 10]]);

// 获取线上距离点 (5, 0) 最近的点
const closest = line.getClosestPoint([5, 0]);
console.log(closest); // [2.5, 2.5]

// 用于计算点到线的垂足
const polygon = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 0]]]);
const point = [15, 5];
const closestOnPolygon = polygon.getClosestPoint(point);
console.log(closestOnPolygon); // [10, 5]`,
    params: [
      { name: 'point', type: 'Array<number>', default: '', description: '参考点坐标' }
    ],
    returns: { type: 'Array<number>', description: '几何对象上最近的点' }
  },
  {
    name: 'intersectsExtent',
    cn: '相交检查',
    type: 'method',
    category: 'methods',
    description: '检查几何对象是否与指定范围相交。',
    usage: `import LineString from 'ol/geom/LineString.js';

const line = new LineString([[0, 0], [10, 10]]);

// 检查是否与范围相交
console.log(line.intersectsExtent([5, 5, 15, 15])); // true
console.log(line.intersectsExtent([20, 20, 30, 30])); // false

// 用于可见性判断
const extent = view.calculateExtent();
if (geometry.intersectsExtent(extent)) {
  // 几何在视图范围内
}`,
    params: [
      { name: 'extent', type: 'Array<number>', default: '', description: '要检查的范围 [minX, minY, maxX, maxY]' }
    ],
    returns: { type: 'boolean', description: '是否相交' }
  },
  {
    name: 'containsCoordinate',
    cn: '包含坐标检查',
    type: 'method',
    category: 'methods',
    description: '检查几何对象是否包含指定的坐标。',
    usage: `import Polygon from 'ol/geom/Polygon.js';

const polygon = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);

console.log(polygon.containsCoordinate([5, 5])); // true
console.log(polygon.containsCoordinate([15, 5])); // false`,
    params: [
      { name: 'coordinate', type: 'Array<number>', default: '', description: '要检查的坐标' }
    ],
    returns: { type: 'boolean', description: '是否包含该坐标' }
  },
  {
    name: 'getCoordinates',
    cn: '获取坐标',
    type: 'method',
    category: 'methods',
    description: '获取几何对象的坐标。返回格式因几何类型而异。',
    usage: `import Point from 'ol/geom/Point.js';
import LineString from 'ol/geom/LineString.js';
import Polygon from 'ol/geom/Polygon.js';

const point = new Point([116.4, 39.9]);
console.log(point.getCoordinates()); // [116.4, 39.9]

const line = new LineString([[0, 0], [10, 10]]);
console.log(line.getCoordinates()); // [[0, 0], [10, 10]]

const polygon = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 0]]]);
console.log(polygon.getCoordinates()); // [[[0, 0], [10, 0], [10, 10], [0, 0]]]`,
    params: [],
    returns: { type: 'Array<number>|Array<Array<number>>|Array<Array<Array<number>>>', description: '坐标数组' }
  },
  {
    name: 'setCoordinates',
    cn: '设置坐标',
    type: 'method',
    category: 'methods',
    description: '设置几何对象的坐标。',
    usage: `import Point from 'ol/geom/Point.js';

const point = new Point([0, 0]);

// 设置新坐标
point.setCoordinates([116.4, 39.9]);
console.log(point.getCoordinates()); // [116.4, 39.9]`,
    params: [
      { name: 'coordinates', type: 'Array', default: '', description: '新坐标数组' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'change',
    cn: '变更事件',
    type: 'event',
    category: 'events',
    description: '当几何对象发生变更时触发。',
    usage: `import Point from 'ol/geom/Point.js';

const point = new Point([0, 0]);

// 监听变更事件
point.on('change', () => {
  console.log('几何对象已变更');
  console.log('新坐标:', point.getCoordinates());
});

// 修改坐标会触发事件
point.setCoordinates([10, 10]);`,
    params: [],
    returns: { type: 'Object', description: '事件对象' }
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
