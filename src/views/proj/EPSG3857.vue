<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>EPSG:3857 - Web Mercator 投影</h2>
            <p class="description">
              EPSG:3857 是 Web Mercator 投影的代码，也称为 Google Web Mercator 或 Spherical Mercator。
              这是 Google Maps、OpenStreetMap、Bing Maps 等主流在线地图服务使用的投影。
              OpenLayers 内部默认使用此投影。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_proj_epsg3857.html" target="_blank">
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

const activeNames = ref(['fromEPSG4326'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? epsg3857Apis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'function': 'primary',
    'constant': 'warning'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: epsg3857Apis.length },
    { name: 'functions', cn: '函数', count: epsg3857Apis.filter(a => a.type === 'function').length },
    { name: 'constants', cn: '常量', count: epsg3857Apis.filter(a => a.type === 'constant').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return epsg3857Apis
  if (currentCategory.value === 'functions') return epsg3857Apis.filter(a => a.type === 'function')
  if (currentCategory.value === 'constants') return epsg3857Apis.filter(a => a.type === 'constant')
  return epsg3857Apis
})

const epsg3857Apis = [
  {
    name: 'fromEPSG4326',
    cn: '从 EPSG:4326 转换',
    type: 'function',
    category: 'functions',
    description: '将 WGS84 经纬度坐标 (EPSG:4326) 转换为 Web Mercator 投影坐标 (EPSG:3857)。这是墨卡托投影的正向变换函数。',
    usage: `import { fromEPSG4326 } from 'ol/proj/epsg3857.js';

// 将北京经纬度转换为 Web Mercator
const beijingLonLat = [116.4, 39.9];
const webMercator = fromEPSG4326(beijingLonLat);
console.log(webMercator); // [12958396.72, 4865942.28]

// 批量转换
const points = [
  [116.4, 39.9],  // 北京
  [121.4, 31.2],  // 上海
  [113.2, 23.1]   // 广州
];
const transformed = points.map(p => fromEPSG4326(p));

// 在 View 中使用
import View from 'ol/View.js';
const view = new View({
  center: fromEPSG4326([116.4, 39.9]),
  zoom: 10
});`,
    params: [
      { name: 'input', type: 'Array<number>', default: '', description: '输入坐标数组 [经度，纬度]' },
      { name: 'output', type: 'Array<number>', default: 'undefined', description: '输出坐标数组（可选）' },
      { name: 'dimension', type: 'number', default: '2', description: '维度（默认 2）' },
      { name: 'stride', type: 'number', default: 'dimension', description: '步长（默认等于 dimension）' }
    ],
    returns: { type: 'Array<number>', description: 'Web Mercator 投影坐标 [x, y]' }
  },
  {
    name: 'toEPSG4326',
    cn: '转回 EPSG:4326',
    type: 'function',
    category: 'functions',
    description: '将 Web Mercator 投影坐标 (EPSG:3857) 转换回 WGS84 经纬度坐标 (EPSG:4326)。这是墨卡托投影的逆变换函数。',
    usage: `import { toEPSG4326 } from 'ol/proj/epsg3857.js';

// 将 Web Mercator 转换为经纬度
const webMercator = [12958396.72, 4865942.28];
const lonLat = toEPSG4326(webMercator);
console.log(lonLat); // [116.4, 39.9]

// 获取点击位置的经纬度
map.on('click', (event) => {
  const lonLat = toEPSG4326(event.coordinate);
  console.log('点击位置经纬度:', lonLat);
});

// 批量转换
const webPoints = [
  [12958396.72, 4865942.28],
  [13513066.33, 3658696.53]
];
const lonLatPoints = webPoints.map(p => toEPSG4326(p));`,
    params: [
      { name: 'input', type: 'Array<number>', default: '', description: '输入坐标数组 [x, y]' },
      { name: 'output', type: 'Array<number>', default: 'undefined', description: '输出坐标数组（可选）' },
      { name: 'dimension', type: 'number', default: '2', description: '维度（默认 2）' },
      { name: 'stride', type: 'number', default: 'dimension', description: '步长（默认等于 dimension）' }
    ],
    returns: { type: 'Array<number>', description: 'WGS84 经纬度坐标 [经度，纬度]' }
  },
  {
    name: 'RADIUS',
    cn: '地球半径',
    type: 'constant',
    category: 'constants',
    description: 'WGS84 椭球体的半长轴半径，单位为米。用于 Web Mercator 投影计算。',
    usage: `import { RADIUS } from 'ol/proj/epsg3857.js';

console.log('WGS84 半径:', RADIUS); // 6378137 米

// 用于计算周长
const circumference = 2 * Math.PI * RADIUS;
console.log('地球赤道周长:', circumference); // 约 40075016.68 米

// 在自定义投影计算中使用
const customScale = RADIUS / 1000; // 转换为公里`,
    params: [],
    returns: { type: 'number', description: 'WGS84 半径值（6378137 米）' }
  },
  {
    name: 'HALF_SIZE',
    cn: '半宽',
    type: 'constant',
    category: 'constants',
    description: 'Web Mercator 投影世界范围的半边长。等于 π * RADIUS，表示从原点到世界范围边界的距离。',
    usage: `import { HALF_SIZE } from 'ol/proj/epsg3857.js';

console.log('半边长:', HALF_SIZE); // 约 20037508.34 米

// 计算世界范围宽度
const worldWidth = HALF_SIZE * 2;
console.log('世界范围宽度:', worldWidth);

// 检查坐标是否在世界范围内
function isValidWebMercator(x, y) {
  return Math.abs(x) <= HALF_SIZE && Math.abs(y) <= HALF_SIZE;
}`,
    params: [],
    returns: { type: 'number', description: '半边长值（约 20037508.34 米）' }
  },
  {
    name: 'EXTENT',
    cn: '投影范围',
    type: 'constant',
    category: 'constants',
    description: 'EPSG:3857 投影的有效范围。这是 Web Mercator 投影能够表示的坐标范围。',
    usage: `import { EXTENT } from 'ol/proj/epsg3857.js';

console.log('投影范围:', EXTENT);
// [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]

// 检查坐标是否在范围内
function isInExtent(x, y) {
  return x >= EXTENT[0] && x <= EXTENT[2] &&
         y >= EXTENT[1] && y <= EXTENT[3];
}

// 用于设置视图范围
import { fit } from 'ol/extent.js';
view.fit(EXTENT);`,
    params: [],
    returns: { type: 'Array<number>', description: '范围数组 [minX, minY, maxX, maxY]' }
  },
  {
    name: 'WORLD_EXTENT',
    cn: '世界范围',
    type: 'constant',
    category: 'constants',
    description: 'Web Mercator 投影的世界范围。与 EXTENT 类似，表示整个世界的投影范围。',
    usage: `import { WORLD_EXTENT } from 'ol/proj/epsg3857.js';

console.log('世界范围:', WORLD_EXTENT);
// [-20037508.342789244, -20048966.1040146, 20037508.342789244, 20048966.1040146]

// 注意：Y 方向范围略大于 X 方向，因为墨卡托投影在极点处趋向无穷

// 用于初始化地图
const view = new View({
  extent: WORLD_EXTENT,
  center: [0, 0],
  zoom: 2
});`,
    params: [],
    returns: { type: 'Array<number>', description: '世界范围数组 [minX, minY, maxX, maxY]' }
  },
  {
    name: 'MAX_SAFE_Y',
    cn: '最大安全 Y 值',
    type: 'constant',
    category: 'constants',
    description: 'Y 方向的最大安全值。由于墨卡托投影在极点处趋向无穷，此值限制了有效的 Y 坐标范围。',
    usage: `import { MAX_SAFE_Y } from 'ol/proj/epsg3857.js';

console.log('最大安全 Y 值:', MAX_SAFE_Y); // 约 20048966.10 米

// 检查 Y 坐标是否安全
function isValidY(y) {
  return Math.abs(y) <= MAX_SAFE_Y;
}

// 限制坐标范围
function clampCoordinate(x, y) {
  return [
    Math.max(-HALF_SIZE, Math.min(HALF_SIZE, x)),
    Math.max(-MAX_SAFE_Y, Math.min(MAX_SAFE_Y, y))
  ];
}`,
    params: [],
    returns: { type: 'number', description: '最大安全 Y 值（约 20048966.10 米）' }
  },
  {
    name: 'PROJECTIONS',
    cn: '投影数组',
    type: 'constant',
    category: 'constants',
    description: '等于 EPSG:3857 的投影对象数组。包含所有与 EPSG:3857 等价的投影引用。',
    usage: `import { PROJECTIONS } from 'ol/proj/epsg3857.js';

console.log('EPSG:3857 投影数组:', PROJECTIONS);

// 获取第一个投影
const proj = PROJECTIONS[0];
console.log(proj.getCode()); // 'EPSG:3857'

// 检查投影是否已注册
const isRegistered = PROJECTIONS.length > 0;
console.log('EPSG:3857 已注册:', isRegistered);`,
    params: [],
    returns: { type: 'Array<Projection>', description: 'EPSG:3857 投影对象数组' }
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
