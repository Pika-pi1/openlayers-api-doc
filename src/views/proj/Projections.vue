<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Projections - 投影集合 API</h2>
            <p class="description">
              Projections 模块提供了投影相关的工具函数。
              用于获取、添加、转换和管理地图投影。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_proj.html" target="_blank">
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

const activeNames = ref(['get'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? projectionsApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'function': 'primary'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: projectionsApis.length },
    { name: 'functions', cn: '函数', count: projectionsApis.filter(a => a.type === 'function').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return projectionsApis
  if (currentCategory.value === 'functions') return projectionsApis.filter(a => a.type === 'function')
  return projectionsApis
})

const projectionsApis = [
  {
    name: 'get',
    cn: '获取投影',
    type: 'function',
    category: 'functions',
    description: '根据代码获取投影对象。如果投影未注册，返回 null。',
    usage: `import { get } from 'ol/proj.js';

// 获取 Web Mercator 投影
const webMercator = get('EPSG:3857');
console.log(webMercator.getCode()); // 'EPSG:3857'

// 获取 WGS84 投影
const wgs84 = get('EPSG:4326');
console.log(wgs84.getUnits()); // 'degrees'

// 获取未注册的投影返回 null
const unknown = get('EPSG:9999');
console.log(unknown); // null`,
    params: [
      { name: 'code', type: 'string', default: '', description: '投影代码，如 EPSG:3857' }
    ],
    returns: { type: 'Projection|null', description: '投影对象，未找到返回 null' }
  },
  {
    name: 'transform',
    cn: '坐标转换',
    type: 'function',
    category: 'functions',
    description: '将坐标从一个投影转换到另一个投影。这是最常用的投影转换函数。',
    usage: `import { transform } from 'ol/proj.js';

// 将经纬度转换为 Web Mercator
const point3857 = transform(
  [116.4, 39.9],  // 北京经纬度
  'EPSG:4326',    // 源投影
  'EPSG:3857'     // 目标投影
);
console.log(point3857); // [12958396.72, 4865942.28]

// 将 Web Mercator 转换回经纬度
const point4326 = transform(
  point3857,
  'EPSG:3857',
  'EPSG:4326'
);
console.log(point4326); // [116.4, 39.9]

// 在视图创建时转换中心点
const view = new View({
  center: transform([116.4, 39.9], 'EPSG:4326', 'EPSG:3857'),
  zoom: 10
});`,
    params: [
      { name: 'coordinate', type: 'Array<number>', default: '', description: '要转换的坐标 [x, y]' },
      { name: 'from', type: 'string|Projection', default: '', description: '源投影代码或对象' },
      { name: 'to', type: 'string|Projection', default: '', description: '目标投影代码或对象' }
    ],
    returns: { type: 'Array<number>', description: '转换后的坐标' }
  },
  {
    name: 'transformExtent',
    cn: '范围转换',
    type: 'function',
    category: 'functions',
    description: '将范围从一个投影转换到另一个投影。',
    usage: `import { transformExtent } from 'ol/proj.js';

// 转换北京范围
const extent4326 = [116.0, 39.5, 117.0, 40.5];
const extent3857 = transformExtent(
  extent4326,
  'EPSG:4326',
  'EPSG:3857'
);
console.log(extent3857);

// 用于设置视图范围
view.fit(extent3857);`,
    params: [
      { name: 'extent', type: 'Array<number>', default: '', description: '要转换的范围 [minX, minY, maxX, maxY]' },
      { name: 'from', type: 'string|Projection', default: '', description: '源投影' },
      { name: 'to', type: 'string|Projection', default: '', description: '目标投影' }
    ],
    returns: { type: 'Array<number>', description: '转换后的范围' }
  },
  {
    name: 'fromLonLat',
    cn: '从经纬度转换',
    type: 'function',
    category: 'functions',
    description: '将 WGS84 经纬度坐标转换为投影坐标（默认 EPSG:3857）。这是 transform 的便捷方法。',
    usage: `import { fromLonLat } from 'ol/proj.js';

// 将经纬度转换为 Web Mercator
const point = fromLonLat([116.4, 39.9]);
console.log(point); // [12958396.72, 4865942.28]

// 指定目标投影
const pointCustom = fromLonLat([116.4, 39.9], 'EPSG:3857');

// 创建地图时使用
const map = new Map({
  view: new View({
    center: fromLonLat([116.4, 39.9]),
    zoom: 10
  })
});`,
    params: [
      { name: 'coordinate', type: 'Array<number>', default: '', description: '经纬度坐标 [lon, lat]' },
      { name: 'projection', type: 'string|Projection', default: '"EPSG:3857"', description: '目标投影' }
    ],
    returns: { type: 'Array<number>', description: '投影坐标' }
  },
  {
    name: 'toLonLat',
    cn: '转回经纬度',
    type: 'function',
    category: 'functions',
    description: '将投影坐标转换为 WGS84 经纬度坐标。这是 transform 的便捷方法。',
    usage: `import { toLonLat } from 'ol/proj.js';

// 将 Web Mercator 转换为经纬度
const lonLat = toLonLat([12958396.72, 4865942.28]);
console.log(lonLat); // [116.4, 39.9]

// 获取点击位置的经纬度
map.on('click', (event) => {
  const lonLat = toLonLat(event.coordinate);
  console.log('点击位置经纬度:', lonLat);
});`,
    params: [
      { name: 'coordinate', type: 'Array<number>', default: '', description: '投影坐标' },
      { name: 'projection', type: 'string|Projection', default: '"EPSG:3857"', description: '源投影' }
    ],
    returns: { type: 'Array<number>', description: '经纬度坐标 [lon, lat]' }
  },
  {
    name: 'addProjection',
    cn: '添加投影',
    type: 'function',
    category: 'functions',
    description: '注册一个新的投影。',
    usage: `import { addProjection, get } from 'ol/proj.js';
import Projection from 'ol/proj/Projection.js';

// 创建自定义投影
const customProj = new Projection({
  code: 'EPSG:27700',
  units: 'm',
  extent: [0, 0, 700000, 1300000]
});

// 注册投影
addProjection(customProj);

// 现在可以使用了
const proj = get('EPSG:27700');
console.log(proj); // Projection 对象`,
    params: [
      { name: 'projection', type: 'Projection', default: '', description: '要注册的投影对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'addCoordinateTransforms',
    cn: '添加坐标转换',
    type: 'function',
    category: 'functions',
    description: '在两个投影之间添加自定义坐标转换函数。',
    usage: `import { addCoordinateTransforms } from 'ol/proj.js';

// 添加自定义转换
addCoordinateTransforms(
  'EPSG:4326',
  'EPSG:3857',
  // 正向转换：4326 -> 3857
  (coord) => {
    const x = coord[0] * 20037508.34 / 180;
    const y = Math.log(Math.tan((90 + coord[1]) * Math.PI / 360)) / (Math.PI / 180);
    return [x, y * 20037508.34 / 180];
  },
  // 反向转换：3857 -> 4326
  (coord) => {
    const lon = coord[0] * 180 / 20037508.34;
    const lat = Math.atan(Math.exp(coord[1] * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
    return [lon, lat];
  }
);`,
    params: [
      { name: 'source', type: 'string|Projection', default: '', description: '源投影' },
      { name: 'destination', type: 'string|Projection', default: '', description: '目标投影' },
      { name: 'forward', type: 'function', default: '', description: '正向转换函数' },
      { name: 'inverse', type: 'function', default: '', description: '反向转换函数' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getUserProjection',
    cn: '获取用户投影',
    type: 'function',
    category: 'functions',
    description: '获取用户设置的投影。用户投影用于输入/输出坐标的转换。',
    usage: `import { getUserProjection, setUserProjection } from 'ol/proj.js';

// 设置用户投影为 WGS84
setUserProjection('EPSG:4326');

// 获取用户投影
const userProj = getUserProjection();
console.log(userProj?.getCode()); // 'EPSG:4326'`,
    params: [],
    returns: { type: 'Projection|null', description: '用户投影对象' }
  },
  {
    name: 'setUserProjection',
    cn: '设置用户投影',
    type: 'function',
    category: 'functions',
    description: '设置用户投影。设置后，所有输入/输出坐标将自动转换为此投影。',
    usage: `import { setUserProjection } from 'ol/proj.js';

// 设置用户投影为 WGS84
setUserProjection('EPSG:4326');

// 现在可以直接使用经纬度
const view = new View({
  center: [116.4, 39.9],  // 自动视为 EPSG:4326
  zoom: 10
});`,
    params: [
      { name: 'projection', type: 'string|Projection', default: '', description: '用户投影代码或对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'clearUserProjection',
    cn: '清除用户投影',
    type: 'function',
    category: 'functions',
    description: '清除用户投影设置。清除后，坐标将使用地图视图的投影。',
    usage: `import { setUserProjection, clearUserProjection } from 'ol/proj.js';

// 设置用户投影
setUserProjection('EPSG:4326');

// ... 使用用户投影

// 清除用户投影
clearUserProjection();

// 现在需要使用 fromLonLat/toLonLat 进行转换`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'useGeographic',
    cn: '使用地理坐标',
    type: 'function',
    category: 'functions',
    description: '设置用户投影为 WGS84（EPSG:4326）。这是 setUserProjection 的便捷方法。',
    usage: `import { useGeographic } from 'ol/proj.js';

// 设置使用地理坐标（经纬度）
useGeographic();

// 现在所有坐标都使用经纬度
const map = new Map({
  view: new View({
    center: [116.4, 39.9],  // 经纬度
    zoom: 10
  })
});

// 点击事件返回经纬度
map.on('click', (event) => {
  console.log('点击位置:', event.coordinate); // [lon, lat]
});`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getPointResolution',
    cn: '获取点分辨率',
    type: 'function',
    category: 'functions',
    description: '获取指定点的分辨率。用于在非等距投影中计算实际地面分辨率。',
    usage: `import { getPointResolution } from 'ol/proj.js';

// 获取 Web Mercator 中某点的分辨率
const resolution = getPointResolution(
  'EPSG:3857',
  1000,  // 标称分辨率（米）
  [116.4, 39.9]  // 点位置
);
console.log(resolution);

// 在 EPSG:3857 中，高纬度地区的实际分辨率会降低`,
    params: [
      { name: 'projection', type: 'string|Projection', default: '', description: '投影' },
      { name: 'resolution', type: 'number', default: '', description: '标称分辨率' },
      { name: 'point', type: 'Array<number>', default: '', description: '点位置' },
      { name: 'units', type: 'string', default: 'undefined', description: '单位，如 m, degrees' }
    ],
    returns: { type: 'number', description: '实际分辨率' }
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
