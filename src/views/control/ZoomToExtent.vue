<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>ZoomToExtent - 缩放到范围控制 API</h2>
            <p class="description">
              ZoomToExtent 控件提供一个按钮，点击后将地图视图缩放到指定范围。
              可以自定义目标范围，默认使用视图投影的有效范围。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_control_ZoomToExtent-ZoomToExtent.html" target="_blank">
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
    return zoomToExtentApis
  }
  return zoomToExtentApis.filter(api => {
    if (currentCategory.value === 'overview') return api.type === 'overview'
    if (currentCategory.value === 'constructor') return api.type === 'constructor'
    if (currentCategory.value === 'method') return api.type === 'method'
    if (currentCategory.value === 'property') return api.type === 'property'
    if (currentCategory.value === 'event') return api.type === 'event'
    return true
  })
})

const zoomToExtentApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'ZoomToExtent 控件概述',
    type: 'overview',
    category: 'overview',
    description: 'ZoomToExtent 控件提供一个按钮，点击后将地图视图缩放到指定范围。可以自定义目标范围（extent），默认使用视图投影的有效范围。支持配置视图适配选项，如内边距、动画时长、最大/最小缩放级别等。',
    usage: `// ============================================
// ZoomToExtent 控件概述
// ============================================
// ZoomToExtent 控件提供一键缩放到指定范围功能
// - 点击按钮缩放到预设范围
// - 可自定义目标范围
// - 支持配置适配选项

import { Map } from 'ol';
import ZoomToExtent from 'ol/control/ZoomToExtent';

// 创建带默认配置的 ZoomToExtent 控件
const zoomToExtentControl = new ZoomToExtent();
map.addControl(zoomToExtentControl);`
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 ZoomToExtent 控件实例。通过配置选项可以自定义控件的类名、目标范围、适配选项、按钮标签等。',
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '配置选项对象',
        children: [
          { name: 'className', type: 'string', default: "'ol-zoom-extent'", description: 'CSS 类名，用于自定义控件样式' },
          { name: 'target', type: 'HTMLElement | string', default: 'undefined', description: '指定控件渲染的目标元素' },
          { name: 'label', type: 'string | HTMLElement', default: "'E'", description: '按钮的文本标签或 HTML 元素' },
          { name: 'tipLabel', type: 'string', default: "'Fit to extent'", description: '按钮的提示文本（tooltip）' },
          { name: 'extent', type: 'Extent', default: 'undefined', description: '目标范围 [minX, minY, maxX, maxY]。如未指定，使用视图投影的有效范围' },
          { name: 'fitOptions', type: 'FitOptions', default: 'undefined', description: '视图适配选项，包括 padding、duration、minResolution、maxZoom 等' }
        ]
      }
    ],
    usage: `// ============================================
// 创建 ZoomToExtent 控件
// ============================================
import ZoomToExtent from 'ol/control/ZoomToExtent';

// 【示例 1】使用默认配置
const zoomToExtentControl = new ZoomToExtent();
map.addControl(zoomToExtentControl);

// 【示例 2】自定义目标范围（北京市范围）
const beijingExtent = [115.7, 39.4, 117.4, 41.6];  // [minLng, minLat, maxLng, maxLat]
const zoomToExtentControl = new ZoomToExtent({
  extent: beijingExtent
});

// 【示例 3】自定义适配选项
const zoomToExtentControl = new ZoomToExtent({
  extent: [115.7, 39.4, 117.4, 41.6],
  fitOptions: {
    padding: [50, 50, 50, 50],  // 内边距（上、右、下、左）
    duration: 1000,              // 动画时长 1 秒
    maxZoom: 14,                 // 最大缩放级别
    minResolution: 100           // 最小分辨率
  }
});

// 【示例 4】自定义按钮标签
const zoomToExtentControl = new ZoomToExtent({
  label: '<i class="icon-fit"></i>',
  tipLabel: '缩放到全图'
});

// 【示例 5】使用投影转换后的范围
import { transformExtent } from 'ol/proj';

const epsg3857Extent = transformExtent(
  [115.7, 39.4, 117.4, 41.6],  // EPSG:4326
  'EPSG:4326',
  'EPSG:3857'
);

const zoomToExtentControl = new ZoomToExtent({
  extent: epsg3857Extent
});

// 【示例 6】渲染到地图外部
const zoomToExtentControl = new ZoomToExtent({
  target: 'my-controls-container'
});`
  },

  // ========== Methods (方法) ==========
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 将控件添加到地图
zoomToExtentControl.setMap(map);

// 从地图移除控件
zoomToExtentControl.setMap(null);

// 通常使用 map.addControl() 和 map.removeControl() 更简洁
map.addControl(zoomToExtentControl);
map.removeControl(zoomToExtentControl);`
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
class CustomZoomToExtent extends ZoomToExtent {
  render(mapEvent) {
    // 自定义渲染逻辑
    const frameState = mapEvent.frameState;
    if (!frameState) {
      return false;
    }
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 监听变更事件
zoomToExtentControl.on('change', () => {
  console.log('控件状态已变更');
});

// 触发变更
zoomToExtentControl.changed();`
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 监听自定义事件
zoomToExtentControl.on('mycustomevent', (e) => {
  console.log('触发自定义事件:', e);
});

// 触发事件
const result = zoomToExtentControl.dispatchEvent('mycustomevent');`
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 设置并获取自定义属性
zoomToExtentControl.set('customProp', 'customValue');
const value = zoomToExtentControl.get('customProp');
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 设置单个属性
zoomToExtentControl.set('customProp', 'customValue');

// 静默设置（不触发事件）
zoomToExtentControl.set('anotherProp', 'value', true);

// 监听属性变更
zoomToExtentControl.on('propertychange', (e) => {
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();
zoomToExtentControl.set('prop1', 'value1');
zoomToExtentControl.set('prop2', 'value2');

// 获取所有键名
const keys = zoomToExtentControl.getKeys();
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();
map.addControl(zoomToExtentControl);

// 获取关联的地图
const associatedMap = zoomToExtentControl.getMap();
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();
zoomToExtentControl.set('prop1', 'value1');
zoomToExtentControl.set('prop2', 'value2');

// 获取所有属性
const props = zoomToExtentControl.getProperties();
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();
console.log(zoomToExtentControl.getRevision()); // 初始版本号

zoomToExtentControl.changed();
console.log(zoomToExtentControl.getRevision()); // 版本号 +1`
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 监听单个事件
const key = zoomToExtentControl.on('change', () => {
  console.log('控件已变更');
});

// 监听多个事件类型
const keys = zoomToExtentControl.on(['change', 'propertychange'], (e) => {
  console.log('事件触发:', e.type);
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 只监听一次变更事件
zoomToExtentControl.once('change', () => {
  console.log('这是第一次也是唯一一次触发');
});

zoomToExtentControl.changed(); // 触发
zoomToExtentControl.changed(); // 不会触发`
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 批量设置多个属性
zoomToExtentControl.setProperties({
  prop1: 'value1',
  prop2: 'value2',
  prop3: 'value3'
});

// 静默批量设置
zoomToExtentControl.setProperties({
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 设置目标元素（通过元素）
const container = document.getElementById('controls-container');
zoomToExtentControl.setTarget(container);

// 设置目标元素（通过 ID 字符串）
zoomToExtentControl.setTarget('controls-container');

// 清除目标元素（渲染回地图视口）
zoomToExtentControl.setTarget(undefined);`
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

// 定义监听函数
const handleChange = () => {
  console.log('控件已变更');
};

// 添加监听
zoomToExtentControl.on('change', handleChange);

// 移除监听
zoomToExtentControl.un('change', handleChange);`
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();
zoomToExtentControl.set('tempProp', 'tempValue');

// 移除属性
zoomToExtentControl.unset('tempProp');

// 静默移除
zoomToExtentControl.unset('anotherProp', true);`
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

zoomToExtentControl.on('change', () => {
  console.log('控件状态已变更，版本:', zoomToExtentControl.getRevision());
});`
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

zoomToExtentControl.on('error', (e) => {
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
import ZoomToExtent from 'ol/control/ZoomToExtent';

const zoomToExtentControl = new ZoomToExtent();

zoomToExtentControl.on('propertychange', (e) => {
  console.log('属性变更:', e.key, '=', e.value);
});

zoomToExtentControl.set('customProp', 'value'); // 触发事件`
  },

  // ========== CSS Styling (样式) ==========
  {
    name: 'css-styling',
    cn: 'CSS 样式',
    type: 'property',
    category: 'property',
    description: 'ZoomToExtent 控件支持通过 CSS 类名进行自定义样式。主要类名包括：.ol-zoom-extent（控件容器）。',
    usage: `// ============================================
// CSS 样式自定义
// ============================================
// 控件容器样式
.ol-zoom-extent {
  top: 20px;
  left: 20px;
}

// 按钮样式
.ol-zoom-extent button {
  background-color: #409eff;
  color: white;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  font-size: 16px;
}

// 按钮悬停效果
.ol-zoom-extent button:hover {
  background-color: #66b1ff;
}

// 自定义类名
const zoomToExtentControl = new ZoomToExtent({
  className: 'my-custom-zoom-extent',
  label: '<i class="icon-fit"></i>',
  tipLabel: '缩放到范围'
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
