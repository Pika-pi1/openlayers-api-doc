<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>MousePosition - 鼠标位置控制 API</h2>
            <p class="description">
              MousePosition 控件显示鼠标指针所在位置的坐标。
              支持自定义坐标格式和投影，在触摸设备上显示触摸位置的坐标。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_control_MousePosition-MousePosition.html" target="_blank">
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
                  <div class="api-title-left">
                    <el-tag :type="getTagType(api.type)" size="small">{{ api.type }}</el-tag>
                    <span class="api-name">{{ api.name }}</span>
                    <span class="api-cn">{{ api.cn }}</span>
                  </div>
                </div>
              </template>

              <div class="api-content">
                <!-- 参数说明 -->
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
                    <el-table-column prop="default" label="默认值" width="140">
                      <template #default="scope">
                        <span v-if="scope.row.default !== undefined" class="default-value">{{ scope.row.default }}</span>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 默认展开第一个
const activeNames = ref(['constructor'])
const currentCategory = ref('all')

const isAllExpanded = computed(() => {
  return activeNames.value.length === filteredApis.value.length
})

const toggleExpand = () => {
  if (isAllExpanded.value) {
    activeNames.value = []
  } else {
    activeNames.value = filteredApis.value.map(api => api.name)
  }
}

const filterByCategory = (category) => {
  currentCategory.value = category
  if (category === 'all') {
    activeNames.value = ['constructor']
  } else {
    activeNames.value = []
  }
}

const getTagType = (type) => {
  const typeMap = {
    'constructor': 'primary',
    'method': 'success',
    'property': 'warning',
    'event': 'info',
    'overview': 'danger'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const all = filteredApis.value
  const counts = {
    overview: all.filter(a => a.type === 'overview').length,
    constructor: all.filter(a => a.type === 'constructor').length,
    method: all.filter(a => a.type === 'method').length,
    property: all.filter(a => a.type === 'property').length,
    event: all.filter(a => a.type === 'event').length
  }
  return [
    { name: 'all', cn: '全部', count: all.length },
    { name: 'overview', cn: '概述', count: counts.overview },
    { name: 'constructor', cn: '构造函数', count: counts.constructor },
    { name: 'method', cn: '方法', count: counts.method },
    { name: 'property', cn: '属性', count: counts.property },
    { name: 'event', cn: '事件', count: counts.event }
  ]
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') {
    return mousePositionApis
  }
  return mousePositionApis.filter(api => {
    if (currentCategory.value === 'overview') return api.type === 'overview'
    if (currentCategory.value === 'constructor') return api.type === 'constructor'
    if (currentCategory.value === 'method') return api.type === 'method'
    if (currentCategory.value === 'property') return api.type === 'property'
    if (currentCategory.value === 'event') return api.type === 'event'
    return true
  })
})

const mousePositionApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'MousePosition 控件概述',
    type: 'overview',
    category: 'overview',
    description: 'MousePosition 控件显示鼠标指针所在位置的坐标。默认情况下，控件位于地图右上角。在触摸设备上，它显示当前触摸位置的坐标。支持自定义坐标格式（如经纬度、UTM 等）和投影（如 EPSG:4326、EPSG:3857 等）。',
    usage: `// ============================================
// MousePosition 控件概述
// ============================================
// MousePosition 控件实时显示鼠标/触摸位置的坐标
// - 默认位于地图右上角
// - 支持自定义坐标格式
// - 支持自定义投影
// - 触摸设备上显示触摸位置

import { Map } from 'ol';
import MousePosition from 'ol/control/MousePosition';

// 创建带默认配置的 MousePosition 控件
const mousePositionControl = new MousePosition();
map.addControl(mousePositionControl);`
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 MousePosition 控件实例。通过配置选项可以自定义坐标格式、投影、CSS 类名、占位符文本等。',
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '配置选项对象',
        children: [
          { name: 'className', type: 'string', default: "'ol-mouse-position'", description: 'CSS 类名，用于自定义控件样式' },
          { name: 'coordinateFormat', type: 'CoordinateFormat', default: 'undefined', description: '坐标格式化函数，如 toStringHDMS、toStringXY 等' },
          { name: 'projection', type: 'ProjectionLike', default: 'undefined', description: '坐标投影。默认使用地图视图的投影' },
          { name: 'render', type: 'Function', default: 'undefined', description: '控件重新渲染时调用的函数' },
          { name: 'target', type: 'HTMLElement | string', default: 'undefined', description: '指定控件渲染的目标元素' },
          { name: 'placeholder', type: 'string', default: 'undefined', description: '当鼠标位置不可用时的占位符文本' },
          { name: 'wrapX', type: 'boolean', default: 'true', description: '在投影的本初子午线处是否环绕世界' }
        ]
      }
    ],
    usage: `// ============================================
// 创建 MousePosition 控件
// ============================================
import MousePosition from 'ol/control/MousePosition';
import { toStringHDMS, toStringXY } from 'ol/coordinate.js';

// 【示例 1】使用默认配置
const mousePositionControl = new MousePosition();
map.addControl(mousePositionControl);

// 【示例 2】显示经纬度（EPSG:4326）
import { getPointResolution } from 'ol/proj';

const mousePositionControl = new MousePosition({
  projection: 'EPSG:4326',
  coordinateFormat: toStringHDMS,  // 度分秒格式
  className: 'custom-mouse-position'
});

// 【示例 3】自定义坐标格式
const mousePositionControl = new MousePosition({
  coordinateFormat: function(coordinate) {
    return 'X: ' + coordinate[0].toFixed(2) + ', Y: ' + coordinate[1].toFixed(2);
  },
  projection: 'EPSG:3857'
});

// 【示例 4】设置占位符
const mousePositionControl = new MousePosition({
  placeholder: '将鼠标移到地图上查看坐标',
  projection: 'EPSG:4326'
});

// 【示例 5】禁用环绕
const mousePositionControl = new MousePosition({
  wrapX: false,  // 不在本初子午线处环绕
  projection: 'EPSG:4326'
});`
  },

  // ========== Methods (方法) ==========
  {
    name: 'getCoordinateFormat',
    cn: '获取坐标格式',
    type: 'method',
    category: 'method',
    description: '返回用于渲染当前位置的坐标格式类型。',
    returns: { type: 'CoordinateFormat', description: '坐标格式化函数' },
    usage: `// ============================================
// getCoordinateFormat - 获取坐标格式
// ============================================
import MousePosition from 'ol/control/MousePosition';
import { toStringHDMS } from 'ol/coordinate.js';

const mousePositionControl = new MousePosition({
  coordinateFormat: toStringHDMS
});

// 获取当前坐标格式
const format = mousePositionControl.getCoordinateFormat();
console.log('当前坐标格式:', format);`
  },

  {
    name: 'getProjection',
    cn: '获取投影',
    type: 'method',
    category: 'method',
    description: '返回用于报告鼠标位置的投影对象。',
    returns: { type: 'Projection', description: '投影对象' },
    usage: `// ============================================
// getProjection - 获取投影
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition({
  projection: 'EPSG:4326'
});

// 获取当前投影
const projection = mousePositionControl.getProjection();
console.log('当前投影:', projection.getCode()); // 'EPSG:4326'`
  },

  {
    name: 'setCoordinateFormat',
    cn: '设置坐标格式',
    type: 'method',
    category: 'method',
    description: '设置用于渲染当前位置的坐标格式类型。',
    params: [
      { name: 'format', type: 'CoordinateFormat', default: '', description: '坐标格式化函数' }
    ],
    usage: `// ============================================
// setCoordinateFormat - 设置坐标格式
// ============================================
import MousePosition from 'ol/control/MousePosition';
import { toStringHDMS, toStringXY } from 'ol/coordinate.js';

const mousePositionControl = new MousePosition();
map.addControl(mousePositionControl);

// 切换坐标格式
mousePositionControl.setCoordinateFormat(toStringHDMS);  // 度分秒格式
mousePositionControl.setCoordinateFormat(toStringXY);    // XY 格式

// 自定义格式
mousePositionControl.setCoordinateFormat(function(coordinate) {
  return '经度：' + coordinate[0].toFixed(4) + '°, 纬度：' + coordinate[1].toFixed(4) + '°';
});`
  },

  {
    name: 'setProjection',
    cn: '设置投影',
    type: 'method',
    category: 'method',
    description: '设置用于报告鼠标位置的投影。',
    params: [
      { name: 'projection', type: 'ProjectionLike', default: '', description: '投影对象或投影代码（如 EPSG:4326）' }
    ],
    usage: `// ============================================
// setProjection - 设置投影
// ============================================
import MousePosition from 'ol/control/MousePosition';
import Projection from 'ol/proj/Projection.js';

const mousePositionControl = new MousePosition();
map.addControl(mousePositionControl);

// 切换到经纬度投影
mousePositionControl.setProjection('EPSG:4326');

// 使用自定义投影
const customProjection = new Projection({
  code: 'EPSG:3857',
  units: 'm'
});
mousePositionControl.setProjection(customProjection);`
  },

  {
    name: 'setMap',
    cn: '设置关联的地图',
    type: 'method',
    category: 'method',
    description: '将控件从当前地图移除并附加到新的地图。',
    params: [
      { name: 'map', type: 'Map | null', default: '', description: '要关联的地图对象，null 表示移除关联' }
    ],
    usage: `// ============================================
// setMap - 设置关联的地图
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 将控件添加到地图
mousePositionControl.setMap(map);

// 从地图移除控件
mousePositionControl.setMap(null);

// 通常使用 map.addControl() 和 map.removeControl() 更简洁
map.addControl(mousePositionControl);
map.removeControl(mousePositionControl);`
  },

  {
    name: 'render',
    cn: '渲染控件',
    type: 'method',
    category: 'method',
    description: '渲染控件。在 mapEvent 参数提供的时机重新渲染控件。',
    params: [
      { name: 'mapEvent', type: 'MapEvent', default: '', description: '地图事件对象，包含帧状态等信息' }
    ],
    returns: { type: 'boolean', description: '如果返回 false，在下一个动画帧将不会重新渲染该控件' },
    usage: `// ============================================
// render - 渲染控件
// ============================================
// 通常不需要手动调用此方法
// 控件会在地图渲染时自动调用

// 子类重写示例
class CustomMousePosition extends MousePosition {
  render(mapEvent) {
    // 自定义渲染逻辑
    const frameState = mapEvent.frameState;
    if (!frameState) {
      return false;
    }
    // 根据鼠标位置更新显示
    return true;
  }
}`
  },

  // ========== Inherited Methods (继承方法) ==========
  {
    name: 'changed',
    cn: '触发变更事件',
    type: 'method',
    category: 'method',
    description: '增加修订计数器并触发变更事件。当对象状态改变时调用此方法通知监听器。',
    usage: `// ============================================
// changed - 触发变更事件
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 监听变更事件
mousePositionControl.on('change', () => {
  console.log('控件状态已变更');
});

// 触发变更
mousePositionControl.changed();`
  },

  {
    name: 'dispatchEvent',
    cn: '触发事件',
    type: 'method',
    category: 'method',
    description: '触发事件并调用监听该事件类型的所有监听器。',
    params: [
      { name: 'event', type: 'string | Event', default: '', description: '要触发的事件类型或事件对象' }
    ],
    returns: { type: 'boolean', description: '如果事件未被阻止则返回 true' },
    usage: `// ============================================
// dispatchEvent - 触发事件
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 监听自定义事件
mousePositionControl.on('mycustomevent', (e) => {
  console.log('触发自定义事件:', e);
});

// 触发事件
const result = mousePositionControl.dispatchEvent('mycustomevent');`
  },

  {
    name: 'get',
    cn: '获取属性值',
    type: 'method',
    category: 'method',
    description: '根据键名获取属性值。',
    params: [
      { name: 'key', type: 'string', default: '', description: '属性键名' }
    ],
    returns: { type: 'any', description: '属性值' },
    usage: `// ============================================
// get - 获取属性值
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 设置并获取自定义属性
mousePositionControl.set('customProp', 'customValue');
const value = mousePositionControl.get('customProp');
console.log(value); // 'customValue'`
  },

  {
    name: 'set',
    cn: '设置属性值',
    type: 'method',
    category: 'method',
    description: '设置属性值。如果提供了键名，则设置该键的值；否则设置整个对象。',
    params: [
      { name: 'key', type: 'string', default: '', description: '属性键名' },
      { name: 'value', type: 'any', default: '', description: '属性值' },
      { name: 'silent', type: 'boolean', default: 'false', description: '如果为 true，不触发 propertychange 事件' }
    ],
    usage: `// ============================================
// set - 设置属性值
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 设置单个属性
mousePositionControl.set('customProp', 'customValue');

// 静默设置（不触发事件）
mousePositionControl.set('anotherProp', 'value', true);

// 监听属性变更
mousePositionControl.on('propertychange', (e) => {
  console.log('属性变更:', e.key, e.value);
});`
  },

  {
    name: 'getKeys',
    cn: '获取所有属性键名',
    type: 'method',
    category: 'method',
    description: '获取对象所有属性键名的列表。',
    returns: { type: 'Array<string>', description: '属性键名数组' },
    usage: `// ============================================
// getKeys - 获取所有属性键名
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();
mousePositionControl.set('prop1', 'value1');
mousePositionControl.set('prop2', 'value2');

// 获取所有键名
const keys = mousePositionControl.getKeys();
console.log(keys); // ['prop1', 'prop2']`
  },

  {
    name: 'getMap',
    cn: '获取关联的地图',
    type: 'method',
    category: 'method',
    description: '获取与此控件关联的地图对象。',
    returns: { type: 'Map | null', description: '地图对象，如果没有关联则返回 null' },
    usage: `// ============================================
// getMap - 获取关联的地图
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();
map.addControl(mousePositionControl);

// 获取关联的地图
const associatedMap = mousePositionControl.getMap();
console.log(associatedMap === map); // true`
  },

  {
    name: 'getProperties',
    cn: '获取所有属性',
    type: 'method',
    category: 'method',
    description: '获取包含所有属性键值对的对象。',
    returns: { type: 'Object', description: '属性键值对对象' },
    usage: `// ============================================
// getProperties - 获取所有属性
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();
mousePositionControl.set('prop1', 'value1');
mousePositionControl.set('prop2', 'value2');

// 获取所有属性
const props = mousePositionControl.getProperties();
console.log(props); // { prop1: 'value1', prop2: 'value2' }`
  },

  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'method',
    description: '获取对象的修订版本号。每次调用 changed() 方法时版本号会递增。',
    returns: { type: 'number', description: '修订版本号' },
    usage: `// ============================================
// getRevision - 获取版本号
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();
console.log(mousePositionControl.getRevision()); // 初始版本号

mousePositionControl.changed();
console.log(mousePositionControl.getRevision()); // 版本号 +1`
  },

  {
    name: 'on',
    cn: '监听事件',
    type: 'method',
    category: 'method',
    description: '监听特定类型的事件。',
    params: [
      { name: 'type', type: 'string', default: '', description: '事件类型' },
      { name: 'listener', type: 'Function', default: '', description: '事件监听函数' }
    ],
    returns: { type: 'EventsKey | Array<EventsKey>', description: '事件键，用于取消监听' },
    usage: `// ============================================
// on - 监听事件
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 监听坐标格式变更事件
mousePositionControl.on('change:coordinateformat', () => {
  console.log('坐标格式已变更');
});

// 监听投影变更事件
mousePositionControl.on('change:projection', () => {
  console.log('投影已变更');
});`
  },

  {
    name: 'once',
    cn: '一次性监听事件',
    type: 'method',
    category: 'method',
    description: '监听特定类型的事件，但只触发一次后自动取消监听。',
    params: [
      { name: 'type', type: 'string', default: '', description: '事件类型' },
      { name: 'listener', type: 'Function', default: '', description: '事件监听函数' }
    ],
    returns: { type: 'EventsKey | Array<EventsKey>', description: '事件键' },
    usage: `// ============================================
// once - 一次性监听事件
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 只监听一次变更事件
mousePositionControl.once('change', () => {
  console.log('这是第一次也是唯一一次触发');
});

mousePositionControl.changed(); // 触发
mousePositionControl.changed(); // 不会触发`
  },

  {
    name: 'setProperties',
    cn: '批量设置属性',
    type: 'method',
    category: 'method',
    description: '批量设置一组键值对属性。',
    params: [
      { name: 'values', type: 'Object', default: '', description: '键值对对象' },
      { name: 'silent', type: 'boolean', default: 'false', description: '如果为 true，不触发 propertychange 事件' }
    ],
    usage: `// ============================================
// setProperties - 批量设置属性
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 批量设置多个属性
mousePositionControl.setProperties({
  prop1: 'value1',
  prop2: 'value2',
  prop3: 'value3'
});

// 静默批量设置
mousePositionControl.setProperties({
  tempProp: 'tempValue'
}, true);`
  },

  {
    name: 'setTarget',
    cn: '设置目标元素',
    type: 'method',
    category: 'method',
    description: '设置控件的目标元素。控件将渲染在该元素中，而不是地图视口内。',
    params: [
      { name: 'target', type: 'HTMLElement | string | undefined', default: '', description: '目标元素或元素 ID' }
    ],
    usage: `// ============================================
// setTarget - 设置目标元素
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 设置目标元素（通过元素）
const container = document.getElementById('coordinates-container');
mousePositionControl.setTarget(container);

// 设置目标元素（通过 ID 字符串）
mousePositionControl.setTarget('coordinates-container');

// 清除目标元素（渲染回地图视口）
mousePositionControl.setTarget(undefined);`
  },

  {
    name: 'un',
    cn: '取消监听事件',
    type: 'method',
    category: 'method',
    description: '取消对特定类型事件的监听。',
    params: [
      { name: 'type', type: 'string', default: '', description: '事件类型' },
      { name: 'listener', type: 'Function', default: '', description: '要移除的监听函数' }
    ],
    usage: `// ============================================
// un - 取消监听事件
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

// 定义监听函数
const handleChange = () => {
  console.log('控件已变更');
};

// 添加监听
mousePositionControl.on('change', handleChange);

// 移除监听
mousePositionControl.un('change', handleChange);`
  },

  {
    name: 'unset',
    cn: '移除属性',
    type: 'method',
    category: 'method',
    description: '移除指定键的属性。',
    params: [
      { name: 'key', type: 'string', default: '', description: '要移除的属性键名' },
      { name: 'silent', type: 'boolean', default: 'false', description: '如果为 true，不触发 propertychange 事件' }
    ],
    usage: `// ============================================
// unset - 移除属性
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();
mousePositionControl.set('tempProp', 'tempValue');

// 移除属性
mousePositionControl.unset('tempProp');

// 静默移除
mousePositionControl.unset('anotherProp', true);`
  },

  // ========== Observable Properties (可观察属性) ==========
  {
    name: 'coordinateFormat',
    cn: '坐标格式属性',
    type: 'property',
    category: 'property',
    description: '用于渲染当前位置的坐标格式。可以通过 setCoordinateFormat() 方法修改。',
    usage: `// ============================================
// coordinateFormat - 坐标格式属性
// ============================================
import MousePosition from 'ol/control/MousePosition';
import { toStringHDMS } from 'ol/coordinate.js';

const mousePositionControl = new MousePosition({
  coordinateFormat: toStringHDMS
});

// 监听坐标格式变更
mousePositionControl.on('change:coordinateFormat', () => {
  const format = mousePositionControl.getCoordinateFormat();
  console.log('坐标格式已变更为:', format);
});`
  },

  {
    name: 'projection',
    cn: '投影属性',
    type: 'property',
    category: 'property',
    description: '用于报告鼠标位置的投影。可以通过 setProjection() 方法修改。',
    usage: `// ============================================
// projection - 投影属性
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition({
  projection: 'EPSG:4326'
});

// 监听投影变更
mousePositionControl.on('change:projection', () => {
  const projection = mousePositionControl.getProjection();
  console.log('投影已变更为:', projection.getCode());
});`
  },

  // ========== Events (事件) ==========
  {
    name: 'change',
    cn: '变更事件',
    type: 'event',
    category: 'event',
    description: '当修订计数器增加时触发的通用变更事件。',
    usage: `// ============================================
// change - 变更事件
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

mousePositionControl.on('change', () => {
  console.log('控件状态已变更，版本:', mousePositionControl.getRevision());
});`
  },

  {
    name: 'change:coordinateFormat',
    cn: '坐标格式变更事件',
    type: 'event',
    category: 'event',
    description: '当 coordinateFormat 属性改变时触发。',
    usage: `// ============================================
// change:coordinateFormat - 坐标格式变更事件
// ============================================
import MousePosition from 'ol/control/MousePosition';
import { toStringHDMS } from 'ol/coordinate.js';

const mousePositionControl = new MousePosition();

mousePositionControl.on('change:coordinateFormat', () => {
  console.log('坐标格式已变更');
});

mousePositionControl.setCoordinateFormat(toStringHDMS);`
  },

  {
    name: 'change:projection',
    cn: '投影变更事件',
    type: 'event',
    category: 'event',
    description: '当 projection 属性改变时触发。',
    usage: `// ============================================
// change:projection - 投影变更事件
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

mousePositionControl.on('change:projection', () => {
  console.log('投影已变更');
});

mousePositionControl.setProjection('EPSG:4326');`
  },

  {
    name: 'error',
    cn: '错误事件',
    type: 'event',
    category: 'event',
    description: '当发生错误时触发的通用错误事件。',
    usage: `// ============================================
// error - 错误事件
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

mousePositionControl.on('error', (e) => {
  console.error('控件发生错误:', e);
});`
  },

  {
    name: 'propertychange',
    cn: '属性变更事件',
    type: 'event',
    category: 'event',
    description: '当属性被修改时触发的事件。',
    usage: `// ============================================
// propertychange - 属性变更事件
// ============================================
import MousePosition from 'ol/control/MousePosition';

const mousePositionControl = new MousePosition();

mousePositionControl.on('propertychange', (e) => {
  console.log('属性变更:', e.key, '=', e.value);
});

mousePositionControl.set('customProp', 'value'); // 触发事件`
  },

  // ========== CSS Styling (样式) ==========
  {
    name: 'css-styling',
    cn: 'CSS 样式',
    type: 'property',
    category: 'property',
    description: 'MousePosition 控件支持通过 CSS 类名进行自定义样式。主要类名包括：.ol-mouse-position（控件容器）。',
    usage: `// ============================================
// CSS 样式自定义
// ============================================
// 控件容器样式
.ol-mouse-position {
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 12px;
  color: #303133;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

// 自定义类名
const mousePositionControl = new MousePosition({
  className: 'my-custom-mouse-position',
  projection: 'EPSG:4326'
});`
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
}

.title-section h2 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
}

.description {
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 16px 0;
}

.official-links {
  display: flex;
  gap: 12px;
}

.control-section {
  display: flex;
  gap: 12px;
}

.api-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-tag {
  cursor: pointer;
  user-select: none;
  padding: 6px 16px;
  font-size: 14px;
  transition: all 0.3s;
}

.category-tag:hover {
  opacity: 0.8;
}

.api-list {
  .el-collapse {
    border: none;
  }

  .el-collapse-item {
    margin-bottom: 12px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
  }

  .el-collapse-item__header {
    padding: 16px 20px;
    background-color: #fafafa;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .el-collapse-item__header:hover {
    background-color: #f5f7fa;
  }

  .api-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .api-title-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .api-name {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 16px;
    color: #303133;
    font-weight: 600;
  }

  .api-cn {
    color: #909399;
    font-size: 14px;
  }

  .api-content {
    padding: 20px;
    background-color: #fff;
  }

  .api-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f0f0f0;
  }

  .section-header h4 {
    margin: 0;
    color: #303133;
    font-size: 15px;
    font-weight: 600;
  }

  .section-icon {
    font-size: 18px;
    color: #409eff;
  }

  .params-icon { color: #67c23a; }
  .description-icon { color: #e6a23c; }
  .usage-icon { color: #909399; }
  .returns-icon { color: #f56c6c; }

  .api-table {
    border-radius: 4px;
    overflow: hidden;
  }

  .param-name, .child-param-name {
    font-family: 'Consolas', 'Monaco', monospace;
    color: #409eff;
    font-weight: 600;
  }

  .default-value {
    font-family: 'Consolas', 'Monaco', monospace;
    color: #67c23a;
    background-color: #f0f9ff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 13px;
  }

  .description-text {
    color: #606266;
    font-size: 14px;
    line-height: 1.8;
    margin: 0;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 4px;
  }

  .code-block {
    background-color: #282c34;
    color: #abb2bf;
    padding: 20px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.6;
    margin: 0;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  }

  .returns-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background-color: #f0f9ff;
    border-radius: 4px;
  }

  .returns-desc {
    color: #606266;
    font-size: 14px;
  }

  .children-params {
    padding: 10px;
  }

  .children-table {
    margin-top: 10px;
    background-color: #fafafa;
  }
}
</style>
