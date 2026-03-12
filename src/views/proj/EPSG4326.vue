<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>EPSG:4326 - WGS84 投影</h2>
            <p class="description">
              EPSG:4326 是 WGS84（World Geodetic System 1984）坐标系统的代码。
              这是 GPS 全球定位系统使用的标准坐标系统，以经纬度表示位置。
              在 Web 地图中，常用于数据输入和输出，显示时通常转换为 EPSG:3857。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_proj_epsg4326.html" target="_blank">
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

const activeNames = ref(['RADIUS'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? epsg4326Apis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'constant': 'warning',
    'projection': 'success'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: epsg4326Apis.length },
    { name: 'constants', cn: '常量', count: epsg4326Apis.filter(a => a.type === 'constant').length },
    { name: 'projections', cn: '投影', count: epsg4326Apis.filter(a => a.type === 'projection').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return epsg4326Apis
  if (currentCategory.value === 'constants') return epsg4326Apis.filter(a => a.type === 'constant')
  if (currentCategory.value === 'projections') return epsg4326Apis.filter(a => a.type === 'projection')
  return epsg4326Apis
})

const epsg4326Apis = [
  {
    name: 'RADIUS',
    cn: '地球半径',
    type: 'constant',
    category: 'constants',
    description: 'WGS84 椭球体的半长轴半径，单位为米。这是地球的平均半径，用于地理计算。',
    usage: `import { RADIUS } from 'ol/proj/epsg4326.js';

console.log('WGS84 半径:', RADIUS); // 6378137 米

// 计算地球周长
const circumference = 2 * Math.PI * RADIUS;
console.log('地球赤道周长:', circumference); // 约 40075016.68 米

// 计算球面距离（大圆距离）
function getGreatCircleDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return RADIUS * c; // 返回米
}

const distance = getGreatCircleDistance(39.9, 116.4, 31.2, 121.4); // 北京到上海
console.log('距离:', distance, '米');`,
    params: [],
    returns: { type: 'number', description: 'WGS84 半径值（6378137 米）' }
  },
  {
    name: 'EXTENT',
    cn: '地理范围',
    type: 'constant',
    category: 'constants',
    description: 'EPSG:4326 投影的范围，表示整个世界的经纬度范围。',
    usage: `import { EXTENT } from 'ol/proj/epsg4326.js';

console.log('WGS84 范围:', EXTENT);
// [-180, -90, 180, 90]

// 检查经纬度是否有效
function isValidLonLat(lon, lat) {
  return lon >= EXTENT[0] && lon <= EXTENT[2] &&
         lat >= EXTENT[1] && lat <= EXTENT[3];
}

console.log(isValidLonLat(116.4, 39.9)); // true（北京）
console.log(isValidLonLat(200, 50));     // false（无效经度）

// 用于限制视图范围
import View from 'ol/View.js';
const view = new View({
  extent: EXTENT,
  projection: 'EPSG:4326'
});`,
    params: [],
    returns: { type: 'Array<number>', description: '范围数组 [minLon, minLat, maxLon, maxLat]' }
  },
  {
    name: 'METERS_PER_UNIT',
    cn: '每单位米数',
    type: 'constant',
    category: 'constants',
    description: 'WGS84 投影中一个单位（度）等于多少米。这个值在赤道处约为 111319 米/度，但会随纬度变化。',
    usage: `import { METERS_PER_UNIT } from 'ol/proj/epsg4326.js';

console.log('每单位米数:', METERS_PER_UNIT); // 约 111319.49 米/度

// 注意：这个值是近似值，实际值随纬度变化
// 在赤道：1 度 ≈ 111.32 公里
// 在纬度 60 度：1 度经度 ≈ 55.8 公里（因为经线收敛）

// 用于粗略的距离估算
function estimateDistance(lon1, lat1, lon2, lat2) {
  const dLon = (lon2 - lon1) * METERS_PER_UNIT;
  const dLat = (lat2 - lat1) * METERS_PER_UNIT;
  return Math.sqrt(dLon * dLon + dLat * dLat);
}

// 更精确的计算应使用球面三角公式`,
    params: [],
    returns: { type: 'number', description: '每单位米数（约 111319.49 米/度）' }
  },
  {
    name: 'PROJECTIONS',
    cn: '投影数组',
    type: 'projection',
    category: 'projections',
    description: '等于 EPSG:4326 的投影对象数组。包含所有与 EPSG:4326 等价的投影引用。',
    usage: `import { PROJECTIONS } from 'ol/proj/epsg4326.js';

console.log('EPSG:4326 投影数组:', PROJECTIONS);

// 获取第一个投影
const proj = PROJECTIONS[0];
console.log(proj.getCode()); // 'EPSG:4326'
console.log(proj.getUnits()); // 'degrees'
console.log(proj.getAxisOrientation()); // 'enu' (东 - 北 - 上)

// 检查投影是否已注册
const isRegistered = PROJECTIONS.length > 0;
console.log('EPSG:4326 已注册:', isRegistered);

// 在投影转换中使用
import { transform } from 'ol/proj.js';
const point = transform([116.4, 39.9], proj, 'EPSG:3857');
console.log(point); // [12958396.72, 4865942.28]`,
    params: [],
    returns: { type: 'Array<Projection>', description: 'EPSG:4326 投影对象数组' }
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
