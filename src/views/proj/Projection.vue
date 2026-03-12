<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Projection - 投影 API</h2>
            <p class="description">
              Projection 类用于定义和操作地图投影。
              OpenLayers 支持多种投影，包括常用的 EPSG:3857（Web Mercator）和 EPSG:4326（WGS84）。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? projectionApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: projectionApis.length },
    { name: 'constructor', cn: '构造函数', count: projectionApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: projectionApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return projectionApis
  if (currentCategory.value === 'constructor') return projectionApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return projectionApis.filter(a => a.type === 'method')
  return projectionApis
})

const projectionApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的投影对象。投影定义了地球表面如何映射到平面地图上。',
    usage: `import Projection from 'ol/proj/Projection.js';

// 创建自定义投影
const customProjection = new Projection({
  code: 'EPSG:4326',
  units: 'degrees',
  axisOrientation: 'neu',
  global: true
});

// 常用投影代码：
// - EPSG:3857: Web Mercator（Google Maps, OpenStreetMap）
// - EPSG:4326: WGS84（GPS，经纬度）
// - EPSG:3857 单位是米，EPSG:4326 单位是度`,
    params: [
      { name: 'options', type: 'Object', default: '', description: '投影配置对象' },
      { name: 'options.code', type: 'string', default: '', description: '投影代码，如 EPSG:3857' },
      { name: 'options.units', type: 'string', default: '', description: '单位，如 degrees, m' },
      { name: 'options.axisOrientation', type: 'string', default: '"enu"', description: '轴方向，如 enu（东 - 北 - 上）' },
      { name: 'options.global', type: 'boolean', default: 'false', description: '是否全球范围' },
      { name: 'options.extent', type: 'Array<number>', default: 'undefined', description: '有效范围 [minX, minY, maxX, maxY]' }
    ],
    returns: { type: 'Projection', description: '新的投影实例' }
  },
  {
    name: 'getCode',
    cn: '获取代码',
    type: 'method',
    category: 'methods',
    description: '获取投影的代码标识符。',
    usage: `import { get } from 'ol/proj.js';

const projection = get('EPSG:3857');
console.log(projection.getCode()); // 'EPSG:3857'

const wgs84 = get('EPSG:4326');
console.log(wgs84.getCode()); // 'EPSG:4326'`,
    params: [],
    returns: { type: 'string', description: '投影代码' }
  },
  {
    name: 'getUnits',
    cn: '获取单位',
    type: 'method',
    category: 'methods',
    description: '获取投影的单位。',
    usage: `import { get } from 'ol/proj.js';

const projection = get('EPSG:3857');
console.log(projection.getUnits()); // 'm'

const wgs84 = get('EPSG:4326');
console.log(wgs84.getUnits()); // 'degrees'`,
    params: [],
    returns: { type: 'string', description: '投影单位' }
  },
  {
    name: 'getExtent',
    cn: '获取范围',
    type: 'method',
    category: 'methods',
    description: '获取投影的有效范围。',
    usage: `import { get } from 'ol/proj.js';

const projection = get('EPSG:3857');
const extent = projection.getExtent();
console.log(extent); // [-20037508.342789244, -20048966.1040146, 20037508.342789244, 20048966.1040146]`,
    params: [],
    returns: { type: 'Array<number>', description: '范围数组 [minX, minY, maxX, maxY]' }
  },
  {
    name: 'getAxisOrientation',
    cn: '获取轴方向',
    type: 'method',
    category: 'methods',
    description: '获取投影的轴方向。',
    usage: `import { get } from 'ol/proj.js';

const projection = get('EPSG:4326');
console.log(projection.getAxisOrientation()); // 'enu' (东 - 北 - 上)`,
    params: [],
    returns: { type: 'string', description: '轴方向字符串，如 enu' }
  },
  {
    name: 'isGlobal',
    cn: '是否全球',
    type: 'method',
    category: 'methods',
    description: '检查投影是否适用于全球范围。',
    usage: `import { get } from 'ol/proj.js';

const projection = get('EPSG:3857');
console.log(projection.isGlobal()); // true

const wgs84 = get('EPSG:4326');
console.log(wgs84.isGlobal()); // true`,
    params: [],
    returns: { type: 'boolean', description: '是否全球范围' }
  },
  {
    name: 'getMetersPerUnit',
    cn: '获取每单位米数',
    type: 'method',
    category: 'methods',
    description: '获取投影中一个单位等于多少米。用于距离计算。',
    usage: `import { get } from 'ol/proj.js';

const projection = get('EPSG:3857');
console.log(projection.getMetersPerUnit()); // 1

const wgs84 = get('EPSG:4326');
console.log(wgs84.getMetersPerUnit()); // 约 111319.49（在赤道处）`,
    params: [],
    returns: { type: 'number', description: '每单位米数' }
  },
  {
    name: 'getWorldExtent',
    cn: '获取世界范围',
    type: 'method',
    category: 'methods',
    description: '获取投影的世界范围（以投影单位表示）。',
    usage: `import { get } from 'ol/proj.js';

const projection = get('EPSG:4326');
const extent = projection.getWorldExtent();
console.log(extent); // [-180, -90, 180, 90]`,
    params: [],
    returns: { type: 'Array<number>', description: '世界范围数组' }
  },
  {
    name: 'setGetPointResolution',
    cn: '设置分辨率函数',
    type: 'method',
    category: 'methods',
    description: '设置获取指定点分辨率的函数。用于在非等距投影中计算实际分辨率。',
    usage: `import Projection from 'ol/proj/Projection.js';

const projection = new Projection({
  code: 'EPSG:4326',
  units: 'degrees'
});

// 设置分辨率计算函数
projection.setGetPointResolution((resolution, point) => {
  // 根据纬度调整分辨率
  const lat = point[1];
  return resolution * Math.cos(lat * Math.PI / 180);
});`,
    params: [
      { name: 'func', type: 'function', default: '', description: '分辨率计算函数' }
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
