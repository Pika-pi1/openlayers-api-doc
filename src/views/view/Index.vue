<template>
  <div class="api-page-container">
    <!-- 页面标题和控制栏 -->
    <div class="page-header">
      <div class="title-section">
        <h2>View - 视图控制 API</h2>
        <p class="description">
          OpenLayers View 用于控制地图的显示状态，包括中心点、缩放级别、旋转角度等。
          View 是地图的核心组件之一，负责管理地图的可视区域。
        </p>
        <div class="official-links">
          <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_View-View.html" target="_blank">
            <el-icon><Link /></el-icon>
            官方文档
          </el-link>
        </div>
      </div>
      <div class="control-section">
        <el-button @click="expandAll" size="default">
          <el-icon><FolderOpened /></el-icon>
          全部展开
        </el-button>
        <el-button @click="collapseAll" size="default">
          <el-icon><Folder /></el-icon>
          全部收起
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
        <el-collapse-item
          v-for="(api, index) in filteredApis"
          :key="api.name"
          :name="api.name"
        >
          <template #title>
            <div class="api-title">
              <el-tag :type="getTagType(api.type)" size="small">{{ api.type }}</el-tag>
              <span class="api-name">{{ api.name }}</span>
              <span class="api-cn">{{ api.cn }}</span>
            </div>
          </template>

          <div class="api-content">
            <!-- 参数说明 -->
            <div v-if="api.params && api.params.length" class="api-section params-section">
              <div class="section-header">
                <el-icon class="section-icon params-icon"><Operation /></el-icon>
                <h4>参数说明</h4>
              </div>
              <el-table :data="api.params" style="width: 100%" size="small" border class="api-table">
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
                    <span v-if="scope.row.default" class="default-value">{{ scope.row.default }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="说明" />
              </el-table>
            </div>

            <!-- 功能说明 -->
            <div class="api-section description-section">
              <div class="section-header">
                <el-icon class="section-icon description-icon"><Reading /></el-icon>
                <h4>功能说明</h4>
              </div>
              <p class="description-text">{{ api.description }}</p>
            </div>

            <!-- 使用示例 -->
            <div class="api-section usage-section">
              <div class="section-header">
                <el-icon class="section-icon usage-icon"><Console /></el-icon>
                <h4>使用示例</h4>
              </div>
              <pre class="code-block"><code>{{ api.usage }}</code></pre>
            </div>

            <!-- 返回值 -->
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
</template>

<script setup>
import { ref, computed } from 'vue'

// 默认展开第一个
const activeNames = ref(['constructor'])
const currentCategory = ref('all')

const categories = ref([])

const viewApis = [
  // ========== Members (属性) ==========
  {
    name: 'padding',
    cn: '内边距',
    type: 'property',
    category: 'members',
    description: '视图的内边距设置，用于定义视图中心的偏移。格式为 [top, right, bottom, left]，单位为像素。常用于侧边栏覆盖部分地图时的中心调整。',
    usage: `// 获取内边距
const padding = view.getPadding();
console.log('内边距:', padding);

// 设置内边距（左侧有 300px 侧边栏）
view.setPadding([0, 0, 0, 300]);

// 重置内边距
view.setPadding([0, 0, 0, 0]);

// 四边内边距
view.setPadding([50, 50, 50, 50]);`,
    returns: { type: 'Array<number>', description: '内边距数组 [top, right, bottom, left]，默认为 [0, 0, 0, 0]' }
  },

  // ========== Methods (方法) ==========
  {
    name: 'adjustCenter',
    cn: '调整中心点',
    type: 'method',
    category: 'methods',
    description: '以指定的增量调整视图中心点坐标。正值向东北方向移动，负值向西南方向移动。',
    usage: `// 向东北方向移动 1000 米
view.adjustCenter([1000, 1000]);

// 向西南方向移动 500 米
view.adjustCenter([-500, -500]);

// 只向东移动
view.adjustCenter([1000, 0]);`,
    params: [
      { name: 'delta', type: 'Array<number>', default: undefined, description: '中心点增量 [dx, dy]，单位为米' }
    ]
  },
  {
    name: 'adjustResolution',
    cn: '调整分辨率',
    type: 'method',
    category: 'methods',
    description: '以指定的增量调整视图分辨率。正值降低分辨率（缩小），负值提高分辨率（放大）。',
    usage: `// 降低分辨率（缩小）
view.adjustResolution(100);

// 提高分辨率（放大）
view.adjustResolution(-50);

// 当前分辨率减半（放大一倍）
const currentRes = view.getResolution();
view.adjustResolution(-currentRes / 2);`,
    params: [
      { name: 'delta', type: 'number', default: undefined, description: '分辨率增量（米/像素）' }
    ]
  },
  {
    name: 'adjustRotation',
    cn: '调整旋转角度',
    type: 'method',
    category: 'methods',
    description: '以指定的增量调整视图旋转角度。正值顺时针旋转，负值逆时针旋转。',
    usage: `// 顺时针旋转 45 度
view.adjustRotation(Math.PI / 4);

// 逆时针旋转 90 度
view.adjustRotation(-Math.PI / 2);

// 旋转 180 度
view.adjustRotation(Math.PI);`,
    params: [
      { name: 'delta', type: 'number', default: undefined, description: '旋转角度增量（弧度）' }
    ]
  },
  {
    name: 'adjustZoom',
    cn: '调整缩放级别',
    type: 'method',
    category: 'methods',
    description: '以指定的增量调整缩放级别。正值放大，负值缩小。',
    usage: `// 放大一级
view.adjustZoom(1);

// 缩小两级
view.adjustZoom(-2);

// 放大 0.5 级（平滑缩放）
view.adjustZoom(0.5);

// 带动画调整（使用 animate 更灵活）
view.animate({
  zoom: view.getZoom() + 1,
  duration: 300
});`,
    params: [
      { name: 'delta', type: 'number', default: undefined, description: '缩放增量（正数放大，负数缩小）' }
    ]
  },
  {
    name: 'animate',
    cn: '视图动画',
    type: 'method',
    category: 'methods',
    description: '执行视图动画，可以组合多个动画效果（平移、缩放、旋转等）。支持链式调用和回调函数。',
    usage: `// 简单平移动画
view.animate({
  center: [12963076, 4861614],
  duration: 2000
});

// 组合动画（平移 + 缩放）
view.animate({
  center: [12963076, 4861614],
  zoom: 12,
  duration: 2000
});

// 连续动画（依次执行）
view.animate(
  {zoom: 12, duration: 1000},
  {center: newCenter, duration: 1000},
  {rotation: Math.PI / 4, duration: 1000}
);

// 带动画回调
view.animate({
  center: targetCenter,
  duration: 1000
}, function(complete) {
  if(complete) {
    console.log('动画完成');
  }
});`,
    params: [
      { name: 'var_args', type: '...(Object|Function)', default: undefined, description: '动画选项对象，或 (选项，回调) 序列' }
    ],
    returns: { type: 'Promise<boolean>', description: '动画完成的 Promise' }
  },
  {
    name: 'beginInteraction',
    cn: '开始交互',
    type: 'method',
    category: 'methods',
    description: '开始用户交互状态。内部使用，通常由 Interaction 类调用。',
    usage: `// 内部方法，通常不需要直接调用
// 当用户开始拖拽地图时，Interaction 会调用此方法
view.beginInteraction();

// 交互结束后需要调用 endInteraction()
view.endInteraction();`,
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'calculateExtent',
    cn: '计算视图范围',
    type: 'method',
    category: 'methods',
    description: '计算当前视图的可见范围（边界框）。可选传入画布大小，如果不传则使用当前地图大小。',
    usage: `// 计算当前视图范围
const extent = view.calculateExtent();
console.log('视图范围:', extent); // [minX, minY, maxX, maxY]

// 传入画布大小
const size = map.getSize();
const extent = view.calculateExtent(size);

// 转换为经纬度范围
import {toLonLat} from 'ol/proj';
const bottomLeft = toLonLat([extent[0], extent[1]]);
const topRight = toLonLat([extent[2], extent[3]]);
console.log('经纬度范围:', [bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]]);`,
    params: [
      { name: 'opt_size', type: 'Array<number>', default: '使用地图当前大小', description: '可选的画布大小 [width, height]' }
    ],
    returns: { type: 'Array<number>', description: '边界框 [minX, minY, maxX, maxY]' }
  },
  {
    name: 'cancelAnimations',
    cn: '取消动画',
    type: 'method',
    category: 'methods',
    description: '取消所有正在进行的视图动画，视图将停留在当前状态。在组件卸载或需要立即停止动画时使用。',
    usage: `// 取消所有动画
view.cancelAnimations();

// 在 Vue 组件卸载时取消动画
import {onUnmounted} from 'vue';
onUnmounted(() => {
  if (view) {
    view.cancelAnimations();
  }
});

// 在 React 组件清理时
useEffect(() => {
  return () => {
    view.cancelAnimations();
  };
}, []);`,
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'centerOn',
    cn: '中心点对齐',
    type: 'method',
    category: 'methods',
    description: '将地图上的特定点对齐到视口的指定位置。常用于将兴趣点对准视口中心或特定位置。',
    usage: `// 将坐标点对齐到视口中心
const coordinate = [12963076, 4861614];
const viewCenter = [map.getSize()[0] / 2, map.getSize()[1] / 2];
view.centerOn(coordinate, map.getSize(), viewCenter);

// 将坐标点对齐到视口左上角
view.centerOn(coordinate, map.getSize(), [0, 0]);

// 将坐标点对齐到视口右下角
const size = map.getSize();
view.centerOn(coordinate, size, [size[0], size[1]]);`,
    params: [
      { name: 'coordinate', type: 'Array<number>', default: undefined, description: '地图坐标 [x, y]' },
      { name: 'size', type: 'Array<number>', default: undefined, description: '视口大小 [width, height]' },
      { name: 'viewCenter', type: 'Array<number>', default: undefined, description: '视口中的目标位置 [x, y]' }
    ]
  },
  {
    name: 'changed',
    cn: '触发变更',
    type: 'method',
    category: 'methods',
    description: '触发视图变更事件。继承自 Observable，内部使用。',
    usage: `// 内部方法，通常不需要直接调用
// 当视图状态改变时，会自动触发 changed()
view.changed();`,
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'dispatchEvent',
    cn: '分发事件',
    type: 'method',
    category: 'methods',
    description: '分发事件。继承自 Observable，用于触发自定义事件。',
    usage: `// 触发自定义事件
view.dispatchEvent('myCustomEvent');

// 带事件对象
view.dispatchEvent({
  type: 'myCustomEvent',
  data: { key: 'value' }
});`,
    params: [
      { name: 'event', type: 'string|Object', default: undefined, description: '事件类型或事件对象' }
    ],
    returns: { type: '*', description: '事件处理结果' }
  },
  {
    name: 'endInteraction',
    cn: '结束交互',
    type: 'method',
    category: 'methods',
    description: '结束用户交互状态。内部使用，通常由 Interaction 类调用。',
    usage: `// 内部方法，通常不需要直接调用
// 当用户结束拖拽地图时，Interaction 会调用此方法
view.endInteraction();`,
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'fit',
    cn: '适配视图范围',
    type: 'method',
    category: 'methods',
    description: '自动调整视图以适配给定的几何图形或边界框，使目标内容完整显示在视图中。这是最常用的方法之一，用于定位到特定区域。',
    usage: `import {fromLonLat} from 'ol/proj';

// 适配边界框（Web Mercator 坐标）
const bounds = [minX, minY, maxX, maxY];
view.fit(bounds);

// 带 padding 和动画
view.fit(bounds, {
  padding: [50, 50, 50, 50], // 四周留白 50 像素
  duration: 1000,
  maxZoom: 15
});

// 适配 GeoJSON 几何
import GeoJSON from 'ol/format/GeoJSON';
const format = new GeoJSON();
const feature = format.readFeature(geojson);
view.fit(feature.getGeometry(), {
  padding: [100, 100, 100, 100],
  duration: 1500,
  minZoom: 5,
  maxZoom: 17
});

// 适配多个要素的边界
const features = vectorSource.getFeatures();
const extent = ol.extent.createEmpty();
features.forEach(feature => {
  ol.extent.extend(extent, feature.getGeometry().getExtent());
});
view.fit(extent, { padding: [50, 50, 50, 50] });`,
    params: [
      { name: 'geometryOrExtent', type: 'Geometry|Extent', default: undefined, description: '几何对象或边界框 [minX, minY, maxX, maxY]' },
      { name: 'options', type: 'Object', default: '{}', description: '可选配置项' }
    ],
    returns: { type: 'number|undefined', description: '缩放级别，如果无法计算则返回 undefined' }
  },
  {
    name: 'get',
    cn: '获取属性',
    type: 'method',
    category: 'methods',
    description: '获取视图的自定义属性。继承自 BaseObject，支持键值对存储。',
    usage: `// 获取自定义属性
const value = view.get('myKey');

// 检查属性是否存在
if (view.get('myKey') !== undefined) {
  console.log('属性存在:', view.get('myKey'));
}`,
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性键名' }
    ],
    returns: { type: '*', description: '属性值' }
  },
  {
    name: 'getAnimating',
    cn: '检查是否正在动画',
    type: 'method',
    category: 'methods',
    description: '检查视图当前是否正在进行动画。',
    usage: `// 检查是否正在动画
if (view.getAnimating()) {
  console.log('视图正在动画中...');
}

// 等待动画完成
function waitForAnimation() {
  return new Promise(resolve => {
    if (!view.getAnimating()) {
      resolve();
    } else {
      view.once('change', () => {
        waitForAnimation().then(resolve);
      });
    }
  });
}`,
    returns: { type: 'boolean', description: '是否正在动画' }
  },
  {
    name: 'getCenter',
    cn: '获取中心点坐标',
    type: 'method',
    category: 'methods',
    description: '获取当前视图的中心点坐标。返回的是投影坐标（对于默认投影 EPSG:3857，单位为米）。',
    usage: `// 获取中心点坐标（投影坐标）
const center = view.getCenter();
console.log('中心点:', center);

// 转换为经纬度显示
import {toLonLat} from 'ol/proj';
const lonLat = toLonLat(center);
console.log('经纬度:', lonLat);

// 监听中心点变化
view.on('change:center', () => {
  const newCenter = view.getCenter();
  console.log('中心点已改变:', newCenter);
});`,
    returns: { type: 'Array<number>|undefined', description: '中心点坐标数组 [x, y]，如果未设置则返回 undefined' }
  },
  {
    name: 'getInteracting',
    cn: '检查是否正在交互',
    type: 'method',
    category: 'methods',
    description: '检查用户当前是否正在与视图交互（如拖拽、缩放等）。',
    usage: `// 检查是否正在交互
if (view.getInteracting()) {
  console.log('用户正在操作地图...');
}

// 监听交互状态变化
view.on('change:interacting', () => {
  if (view.getInteracting()) {
    console.log('交互开始');
  } else {
    console.log('交互结束');
  }
});`,
    returns: { type: 'boolean', description: '是否正在交互' }
  },
  {
    name: 'getKeys',
    cn: '获取属性键',
    type: 'method',
    category: 'methods',
    description: '获取所有自定义属性的键名数组。继承自 BaseObject。',
    usage: `// 获取所有属性键
const keys = view.getKeys();
console.log('属性键:', keys);

// 遍历所有属性
keys.forEach(key => {
  console.log(key, '=', view.get(key));
});`,
    returns: { type: 'Array<string>', description: '属性键名数组' }
  },
  {
    name: 'getMaxResolution',
    cn: '获取最大分辨率',
    type: 'method',
    category: 'methods',
    description: '获取视图允许的最大分辨率（最缩小状态）。基于 minZoom 计算。',
    usage: `// 获取最大分辨率
const maxResolution = view.getMaxResolution();
console.log('最大分辨率:', maxResolution, '米/像素');

// 与 minZoom 的关系
// maxResolution 对应 minZoom 状态`,
    returns: { type: 'number', description: '最大分辨率（米/像素）' }
  },
  {
    name: 'getMaxZoom',
    cn: '获取最大缩放级别',
    type: 'method',
    category: 'methods',
    description: '获取视图允许的最大缩放级别。超过此级别后无法继续放大。',
    usage: `// 获取最大缩放级别
const maxZoom = view.getMaxZoom();
console.log('最大缩放:', maxZoom);

// 检查当前是否已达到最大缩放
if (view.getZoom() >= view.getMaxZoom()) {
  console.log('已达到最大缩放级别');
}`,
    returns: { type: 'number', description: '最大缩放级别' }
  },
  {
    name: 'getMinResolution',
    cn: '获取最小分辨率',
    type: 'method',
    category: 'methods',
    description: '获取视图允许的最小分辨率（最放大状态）。基于 maxZoom 计算。',
    usage: `// 获取最小分辨率
const minResolution = view.getMinResolution();
console.log('最小分辨率:', minResolution, '米/像素');

// 与 maxZoom 的关系
// minResolution 对应 maxZoom 状态`,
    returns: { type: 'number', description: '最小分辨率（米/像素）' }
  },
  {
    name: 'getMinZoom',
    cn: '获取最小缩放级别',
    type: 'method',
    category: 'methods',
    description: '获取视图允许的最小缩放级别。低于此级别后无法继续缩小。',
    usage: `// 获取最小缩放级别
const minZoom = view.getMinZoom();
console.log('最小缩放:', minZoom);

// 检查当前是否已达到最小缩放
if (view.getZoom() <= view.getMinZoom()) {
  console.log('已达到最小缩放级别');
}`,
    returns: { type: 'number', description: '最小缩放级别' }
  },
  {
    name: 'getProjection',
    cn: '获取投影对象',
    type: 'method',
    category: 'methods',
    description: '获取视图使用的投影对象。默认为 EPSG:3857（Web Mercator 投影）。',
    usage: `// 获取投影对象
const projection = view.getProjection();
console.log('投影代码:', projection.getCode());

// 获取投影单位
const units = projection.getUnits();
console.log('单位:', units); // 通常为 'm'（米）

// 获取投影范围
const extent = projection.getExtent();
console.log('投影范围:', extent);`,
    returns: { type: 'Projection', description: '投影对象' }
  },
  {
    name: 'getProperties',
    cn: '获取所有属性',
    type: 'method',
    category: 'methods',
    description: '获取所有自定义属性的对象。继承自 BaseObject。',
    usage: `// 获取所有属性
const props = view.getProperties();
console.log('所有属性:', props);

// 设置多个属性后获取
view.setProperties({ key1: 'value1', key2: 'value2' });
console.log(view.getProperties());`,
    returns: { type: 'Object', description: '属性对象' }
  },
  {
    name: 'getResolution',
    cn: '获取分辨率',
    type: 'method',
    category: 'methods',
    description: '获取当前视图的分辨率，即每个像素代表的地图单位数（对于 EPSG:3857 投影，单位为米）。分辨率越小，地图显示越详细。',
    usage: `// 获取当前分辨率
const resolution = view.getResolution();
console.log('分辨率:', resolution, '米/像素');

// 分辨率与缩放级别的关系
// 缩放级别每增加 1，分辨率减半（更详细）

// 监听分辨率变化
view.on('change:resolution', () => {
  console.log('分辨率:', view.getResolution());
});`,
    returns: { type: 'number|undefined', description: '当前分辨率（米/像素）' }
  },
  {
    name: 'getResolutionForExtent',
    cn: '根据范围获取分辨率',
    type: 'method',
    category: 'methods',
    description: '计算适配给定范围所需的分辨率。',
    usage: `// 计算适配范围的分辨率
const extent = [minX, minY, maxX, maxY];
const resolution = view.getResolutionForExtent(extent);
console.log('适配范围的分辨率:', resolution);

// 设置该分辨率
view.setResolution(resolution);`,
    params: [
      { name: 'extent', type: 'Array<number>', default: undefined, description: '范围 [minX, minY, maxX, maxY]' },
      { name: 'size', type: 'Array<number>', default: '视口大小', description: '可选的视口大小 [width, height]' }
    ],
    returns: { type: 'number', description: '适配范围的分辨率' }
  },
  {
    name: 'getResolutionForZoom',
    cn: '根据缩放获取分辨率',
    type: 'method',
    category: 'methods',
    description: '获取指定缩放级别对应的分辨率。',
    usage: `// 获取缩放级别对应的分辨率
const zoom = 10;
const resolution = view.getResolutionForZoom(zoom);
console.log('缩放', zoom, '对应的分辨率:', resolution);`,
    params: [
      { name: 'zoom', type: 'number', default: undefined, description: '缩放级别' }
    ],
    returns: { type: 'number', description: '分辨率' }
  },
  {
    name: 'getResolutions',
    cn: '获取分辨率数组',
    type: 'method',
    category: 'methods',
    description: '获取视图的分辨率数组。当 constrainResolution 为 true 时，只能使用这些分辨率。',
    usage: `// 获取分辨率数组
const resolutions = view.getResolutions();
console.log('可用分辨率:', resolutions);

// 遍历所有分辨率
resolutions.forEach((res, index) => {
  console.log('级别', index, ':', res, '米/像素');
});`,
    returns: { type: 'Array<number>|undefined', description: '分辨率数组' }
  },
  {
    name: 'getRevision',
    cn: '获取修订版本',
    type: 'method',
    category: 'methods',
    description: '获取视图对象的修订版本号。每次视图状态改变时，版本号会递增。继承自 Observable。',
    usage: `// 获取修订版本
const revision = view.getRevision();
console.log('当前版本:', revision);

// 监听版本变化
view.on('propertychange', () => {
  console.log('版本已更新:', view.getRevision());
});`,
    returns: { type: 'number', description: '修订版本号' }
  },
  {
    name: 'getRotation',
    cn: '获取旋转角度',
    type: 'method',
    category: 'methods',
    description: '获取视图的旋转角度，以弧度为单位。0 表示正北方向向上，正值表示顺时针旋转。',
    usage: `// 获取旋转角度（弧度）
const rotation = view.getRotation();
console.log('旋转角度:', rotation, '弧度');

// 转换为角度
const degrees = rotation * 180 / Math.PI;
console.log('旋转角度:', degrees, '度');

// 监听旋转变化
view.on('change:rotation', () => {
  console.log('旋转角度:', view.getRotation());
});`,
    returns: { type: 'number', description: '旋转角度（弧度，顺时针为正，默认为 0）' }
  },
  {
    name: 'getZoom',
    cn: '获取缩放级别',
    type: 'method',
    category: 'methods',
    description: '获取当前视图的缩放级别。缩放级别是一个浮点数值，值越大表示地图显示越详细。',
    usage: `// 获取当前缩放级别
const zoom = view.getZoom();
console.log('缩放级别:', zoom);

// 获取整数缩放级别
const zoomLevel = Math.round(view.getZoom());

// 监听缩放变化
view.on('change:resolution', () => {
  console.log('当前缩放:', view.getZoom());
});

// 获取相关值
const resolution = view.getResolution(); // 分辨率（米/像素）
const visibleResolution = view.getVisibleResolution(); // 可见分辨率`,
    returns: { type: 'number|undefined', description: '当前缩放级别，如果未设置则返回 undefined' }
  },
  {
    name: 'getZoomForResolution',
    cn: '根据分辨率获取缩放',
    type: 'method',
    category: 'methods',
    description: '获取指定分辨率对应的缩放级别。',
    usage: `// 获取分辨率对应的缩放级别
const resolution = 100;
const zoom = view.getZoomForResolution(resolution);
console.log('分辨率', resolution, '对应的缩放:', zoom);`,
    params: [
      { name: 'resolution', type: 'number', default: undefined, description: '分辨率' }
    ],
    returns: { type: 'number', description: '缩放级别' }
  },
  {
    name: 'on',
    cn: '监听事件',
    type: 'method',
    category: 'methods',
    description: '监听视图事件。View 继承自 Observable，支持事件监听机制。',
    usage: `// 监听中心点变化
view.on('change:center', (event) => {
  console.log('中心点变化:', view.getCenter());
});

// 监听分辨率/缩放变化
view.on('change:resolution', () => {
  console.log('缩放级别变化:', view.getZoom());
});

// 监听旋转变化
view.on('change:rotation', () => {
  console.log('旋转角度变化:', view.getRotation());
});

// 监听视图范围变化
view.on('change:extent', () => {
  console.log('视图范围变化');
});

// 移除监听
const key = view.on('change:center', callback);
view.un(key);`,
    params: [
      { name: 'type', type: 'string', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '回调函数' }
    ],
    returns: { type: 'EventsKey|Array<EventsKey>', description: '事件键，用于取消监听' }
  },
  {
    name: 'once',
    cn: '监听一次事件',
    type: 'method',
    category: 'methods',
    description: '监听事件一次，触发后自动移除。继承自 Observable。',
    usage: `// 只监听一次中心点变化
view.once('change:center', (event) => {
  console.log('中心点变化了一次');
  // 自动移除监听
});

// 等待动画完成
view.once('change:resolution', () => {
  console.log('缩放级别改变了一次');
});`,
    params: [
      { name: 'type', type: 'string', default: undefined, description: '事件类型' },
      { name: 'listener', type: 'Function', default: undefined, description: '回调函数' }
    ],
    returns: { type: 'EventsKey|Array<EventsKey>', description: '事件键' }
  },
  {
    name: 'set',
    cn: '设置属性',
    type: 'method',
    category: 'methods',
    description: '设置视图的自定义属性。继承自 BaseObject。',
    usage: `// 设置自定义属性
view.set('myKey', 'myValue');

// 获取属性
const value = view.get('myKey');
console.log('属性值:', value);

// 删除属性
view.unset('myKey');`,
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性键名' },
      { name: 'value', type: '*', default: undefined, description: '属性值' }
    ]
  },
  {
    name: 'setCenter',
    cn: '设置中心点坐标',
    type: 'method',
    category: 'methods',
    description: '设置视图的中心点坐标。坐标应为地图投影单位的坐标。对于默认投影（EPSG:3857），单位为米。',
    usage: `import {fromLonLat} from 'ol/proj';

// 直接设置中心点（北京，Web Mercator 投影）
const beijing = fromLonLat([116.4, 39.9]);
view.setCenter(beijing);

// 带动画过渡
view.animate({
  center: beijing,
  duration: 1000 // 1 秒动画
});

// 从 GeoJSON 获取中心点并设置
const feature = geojsonFormat.readFeature(geojsonObject);
view.setCenter(feature.getGeometry().getCoordinates());`,
    params: [
      { name: 'center', type: 'Array<number>|undefined', default: undefined, description: '中心点坐标 [x, y] 或 undefined' }
    ]
  },
  {
    name: 'setConstrainResolution',
    cn: '设置约束分辨率',
    type: 'method',
    category: 'methods',
    description: '设置是否限制为整数缩放级别。当为 true 时，缩放会被约束到预定义的分辨率级别。',
    usage: `// 启用约束分辨率（只能整数缩放）
view.setConstrainResolution(true);

// 禁用约束分辨率（可以小数缩放）
view.setConstrainResolution(false);`,
    params: [
      { name: 'constrainResolution', type: 'boolean', default: undefined, description: '是否约束分辨率' }
    ]
  },
  {
    name: 'setMaxZoom',
    cn: '设置最大缩放级别',
    type: 'method',
    category: 'methods',
    description: '设置视图允许的最大缩放级别。',
    usage: `// 设置最大缩放级别为 18
view.setMaxZoom(18);

// 获取当前最大缩放
console.log('最大缩放:', view.getMaxZoom());`,
    params: [
      { name: 'maxZoom', type: 'number', default: undefined, description: '最大缩放级别' }
    ]
  },
  {
    name: 'setMinZoom',
    cn: '设置最小缩放级别',
    type: 'method',
    category: 'methods',
    description: '设置视图允许的最小缩放级别。',
    usage: `// 设置最小缩放级别为 3
view.setMinZoom(3);

// 获取当前最小缩放
console.log('最小缩放:', view.getMinZoom());`,
    params: [
      { name: 'minZoom', type: 'number', default: undefined, description: '最小缩放级别' }
    ]
  },
  {
    name: 'setProperties',
    cn: '设置多个属性',
    type: 'method',
    category: 'methods',
    description: '批量设置多个自定义属性。继承自 BaseObject。',
    usage: `// 设置多个属性
view.setProperties({
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
});

// 获取所有属性
console.log(view.getProperties());`,
    params: [
      { name: 'properties', type: 'Object', default: undefined, description: '属性对象' }
    ]
  },
  {
    name: 'setResolution',
    cn: '设置分辨率',
    type: 'method',
    category: 'methods',
    description: '设置视图的分辨率。分辨率决定了地图显示的详细程度，分辨率越小表示地图越详细。',
    usage: `// 设置分辨率为 100 米/像素
view.setResolution(100);

// 获取当前分辨率并减半（放大一倍）
const currentRes = view.getResolution();
view.setResolution(currentRes / 2);

// 带动画
view.animate({
  resolution: 50,
  duration: 500
});`,
    params: [
      { name: 'resolution', type: 'number|undefined', default: undefined, description: '分辨率值（米/像素）' }
    ]
  },
  {
    name: 'setRotation',
    cn: '设置旋转角度',
    type: 'method',
    category: 'methods',
    description: '设置视图的旋转角度。正值表示顺时针旋转，负值表示逆时针旋转。常用于实现地图旋转功能。',
    usage: `// 旋转 90 度（顺时针）
view.setRotation(Math.PI / 2);

// 旋转 180 度
view.setRotation(Math.PI);

// 重置为北方朝上
view.setRotation(0);

// 带动画旋转
view.animate({
  rotation: Math.PI / 4,
  duration: 1000
});

// 实现罗盘功能
function rotateMap(angle) {
  view.animate({
    rotation: angle,
    duration: 300
  });
}`,
    params: [
      { name: 'rotation', type: 'number', default: undefined, description: '旋转角度（弧度）' }
    ]
  },
  {
    name: 'setZoom',
    cn: '设置缩放级别',
    type: 'method',
    category: 'methods',
    description: '设置视图的缩放级别。缩放级别决定了地图显示的详细程度。',
    usage: `// 直接设置缩放级别
view.setZoom(10);

// 带动画过渡
view.animate({
  zoom: 12,
  duration: 500
});

// 缩放到特定区域（自动计算缩放级别）
const bounds = [minX, minY, maxX, maxY];
view.fit(bounds, {
  padding: [50, 50, 50, 50],
  duration: 1000
});

// 缩放到几何图形
view.fit(geometry, {
  padding: [100, 100, 100, 100],
  maxZoom: 17
});`,
    params: [
      { name: 'zoom', type: 'number|undefined', default: undefined, description: '缩放级别（通常为 0-28 之间）' }
    ]
  },
  {
    name: 'un',
    cn: '取消监听',
    type: 'method',
    category: 'methods',
    description: '取消事件监听。继承自 Observable。',
    usage: `// 添加监听
const key = view.on('change:center', callback);

// 取消监听
view.un(key);

// 取消所有某种类型的监听
view.un('change:center', callback);`,
    params: [
      { name: 'key', type: 'EventsKey|Array<EventsKey>', default: undefined, description: '事件键' }
    ]
  },
  {
    name: 'unset',
    cn: '删除属性',
    type: 'method',
    category: 'methods',
    description: '删除视图的自定义属性。继承自 BaseObject。',
    usage: `// 删除属性
view.unset('myKey');

// 检查属性是否已被删除
if (view.get('myKey') === undefined) {
  console.log('属性已删除');
}`,
    params: [
      { name: 'key', type: 'string', default: undefined, description: '属性键名' }
    ]
  },

  // ========== Events (事件) ==========
  {
    name: 'change',
    cn: '变更事件',
    type: 'event',
    category: 'events',
    description: '当视图任何属性改变时触发。这是通用的变更事件。',
    usage: `// 监听任何变更
view.on('change', () => {
  console.log('视图已变更');
  console.log('中心点:', view.getCenter());
  console.log('缩放:', view.getZoom());
});

// 监听特定属性变更（推荐）
view.on('change:center', () => {
  console.log('中心点变更');
});`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'change:center',
    cn: '中心点变更事件',
    type: 'event',
    category: 'events',
    description: '当视图中心点改变时触发。',
    usage: `// 监听中心点变化
view.on('change:center', () => {
  const center = view.getCenter();
  console.log('新中心点:', center);

  // 转换为经纬度
  import {toLonLat} from 'ol/proj';
  const lonLat = toLonLat(center);
  console.log('经纬度:', lonLat);
});`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'change:resolution',
    cn: '分辨率变更事件',
    type: 'event',
    category: 'events',
    description: '当视图分辨率（缩放级别）改变时触发。',
    usage: `// 监听分辨率变化
view.on('change:resolution', () => {
  console.log('新分辨率:', view.getResolution());
  console.log('新缩放:', view.getZoom());
});

// 更新 UI 中的缩放级别显示
view.on('change:resolution', () => {
  zoomDisplay.textContent = view.getZoom().toFixed(1);
});`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'change:rotation',
    cn: '旋转变更事件',
    type: 'event',
    category: 'events',
    description: '当视图旋转角度改变时触发。',
    usage: `// 监听旋转变化
view.on('change:rotation', () => {
  const rotation = view.getRotation();
  console.log('新旋转角度:', rotation, '弧度');
  console.log('新旋转角度:', rotation * 180 / Math.PI, '度');
});

// 更新罗盘显示
view.on('change:rotation', () => {
  compass.style.transform = \`rotate(\${-view.getRotation()}rad)\`;
});`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'error',
    cn: '错误事件',
    type: 'event',
    category: 'events',
    description: '当视图发生错误时触发。',
    usage: `// 监听错误
view.on('error', (event) => {
  console.error('视图错误:', event);
});

// 记录错误日志
view.on('error', (event) => {
  errorLog.push({
    time: new Date(),
    error: event
  });
});`,
    returns: { type: 'BaseEvent', description: '事件对象' }
  },
  {
    name: 'propertychange',
    cn: '属性变更事件',
    type: 'event',
    category: 'events',
    description: '当视图的自定义属性改变时触发。继承自 BaseObject。',
    usage: `// 监听自定义属性变化
view.on('propertychange', (event) => {
  console.log('属性变更:', event.key, '=', view.get(event.key));
});

// 设置属性触发事件
view.set('myKey', 'myValue'); // 触发 propertychange 事件`,
    returns: { type: 'ObjectEvent', description: '包含 key 和 value 的事件对象' }
  }
]

// 初始化分类统计
const updateCategories = () => {
  const cats = {
    all: { name: 'all', cn: '全部', count: viewApis.length },
    members: { name: 'members', cn: 'Members', count: 0 },
    methods: { name: 'methods', cn: 'Methods', count: 0 },
    events: { name: 'events', cn: 'Events', count: 0 }
  }

  viewApis.forEach(api => {
    if (cats[api.category]) {
      cats[api.category].count++
    }
  })

  categories.value = Object.values(cats)
}

updateCategories()

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') {
    return viewApis
  }
  return viewApis.filter(api => api.category === currentCategory.value)
})

const getTagType = (type) => {
  const typeMap = {
    'method': 'primary',
    'property': 'success',
    'event': 'warning',
    'class': 'danger'
  }
  return typeMap[type] || 'info'
}

const filterByCategory = (category) => {
  currentCategory.value = category
  // 切换到新分类时展开第一个
  if (filteredApis.value.length > 0) {
    activeNames.value = [filteredApis.value[0].name]
  }
}

const expandAll = () => {
  activeNames.value = filteredApis.value.map(api => api.name)
}

const collapseAll = () => {
  activeNames.value = []
}
</script>

<style lang="scss" scoped>
.api-page-container {
  padding: 20px;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .title-section {
    flex: 1;

    h2 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 26px;
      font-weight: 600;
    }

    .description {
      margin: 0 0 16px 0;
      color: #606266;
      font-size: 14px;
      line-height: 1.8;
    }

    .official-links {
      display: flex;
      gap: 12px;
    }
  }

  .control-section {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  }
}

.api-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .category-tag {
    cursor: pointer;
    padding: 6px 16px;
    font-size: 14px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
    }
  }
}

.api-list {
  :deep(.el-collapse) {
    border-top: none;
    border-bottom: none;
    background: transparent;
  }

  :deep(.el-collapse-item__header) {
    padding: 16px 20px;
    font-size: 15px;
    color: #303133;
    background: white;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s;
    border: none;

    &:hover {
      background: #f5f7fa;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.is-active {
      background: #ecf5ff;
      box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
    }
  }

  :deep(.el-collapse-item__content) {
    padding-top: 0;
  }
}

.api-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  .api-name {
    font-weight: 600;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    color: #409eff;
    font-size: 16px;
  }

  .api-cn {
    color: #606266;
    font-weight: 400;
    font-size: 14px;
  }
}

.api-content {
  padding: 20px;
  background: #fafafa;
  border-radius: 0 0 8px 8px;
}

// API 区块通用样式
.api-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

// 区块标题样式
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .section-icon {
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h4 {
    margin: 0;
    color: #303133;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
}

// 参数说明区块 - 蓝色系
.params-section {
  .section-icon {
    color: #409eff;
  }

  h4 {
    color: #409eff;
  }

  .api-table {
    margin-top: 8px;
    background: white;
    border-radius: 4px;
    overflow: hidden;
  }
}

// 功能说明区块 - 绿色系
.description-section {
  .section-icon {
    color: #67c23a;
  }

  h4 {
    color: #67c23a;
  }

  .description-text {
    color: #606266;
    font-size: 14px;
    line-height: 1.8;
    margin: 0;
    padding: 12px 16px;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #67c23a;
  }
}

// 使用示例区块 - 橙色系
.usage-section {
  .section-icon {
    color: #e6a23c;
  }

  h4 {
    color: #e6a23c;
  }

  .code-block {
    margin: 0;
    background: #282c34;
    border-radius: 8px;
    padding: 20px;
    overflow-x: auto;
    border: 1px solid #e4e7ed;

    code {
      color: #abb2bf;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre;
    }
  }
}

// 返回值区块 - 成功绿色系
.returns-section {
  .section-icon {
    color: #67c23a;
  }

  h4 {
    color: #67c23a;
  }

  .returns-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #67c23a;

    .return-type-tag {
      font-family: 'Consolas', 'Monaco', monospace;
      font-weight: 600;
    }

    .returns-desc {
      color: #606266;
      font-size: 14px;
      line-height: 1.6;
    }
  }
}

.param-name {
  background: #f0f9ff;
  color: #0284c7;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}

.default-value {
  color: #67c23a;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}
</style>
