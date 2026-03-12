<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>ScaleLine - 比例尺控制 API</h2>
            <p class="description">
              ScaleLine 控件显示地图的比例尺。支持公制、英制、海里等单位，
              还可以渲染为刻度尺样式。默认位于地图左下角。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html" target="_blank">
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
    return scaleLineApis
  }
  return scaleLineApis.filter(api => {
    if (currentCategory.value === 'overview') return api.type === 'overview'
    if (currentCategory.value === 'constructor') return api.type === 'constructor'
    if (currentCategory.value === 'method') return api.type === 'method'
    if (currentCategory.value === 'property') return api.type === 'property'
    if (currentCategory.value === 'event') return api.type === 'event'
    return true
  })
})

const scaleLineApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'ScaleLine 控件概述',
    type: 'overview',
    category: 'overview',
    description: 'ScaleLine 控件显示地图的比例尺，用于帮助用户了解地图上的距离。它根据视图中心的分辨率计算 Y 轴方向的近似距离。支持公制（米/公里）、英制（英尺/英里）、海里、度数等多种单位。还可以渲染为刻度尺样式，显示多个刻度分段。',
    usage: `// ============================================
// ScaleLine 控件概述
// ============================================
// ScaleLine 控件显示地图当前缩放级别的比例尺
// - 默认位于地图左下角
// - 支持多种单位：metric, imperial, degrees, nautical, us
// - 可渲染为刻度尺样式（bar）

import { Map } from 'ol';
import ScaleLine from 'ol/control/ScaleLine';

// 创建带默认配置的 ScaleLine 控件
const scaleLineControl = new ScaleLine();
map.addControl(scaleLineControl);`
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 ScaleLine 控件实例。通过配置选项可以自定义单位、最小宽度、是否显示刻度尺样式等。',
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '配置选项对象',
        children: [
          { name: 'className', type: 'string', default: "'ol-scale-line'", description: 'CSS 类名。如果 bar 为 true，默认为 ol-scale-bar' },
          { name: 'minWidth', type: 'number', default: '64', description: '比例尺的最小宽度（像素），基于 OGC 默认 DPI' },
          { name: 'maxWidth', type: 'number', default: 'undefined', description: '比例尺的最大宽度（像素）' },
          { name: 'render', type: 'Function', default: 'undefined', description: '在 requestAnimationFrame 回调中重新渲染控件的函数' },
          { name: 'target', type: 'HTMLElement | string', default: 'undefined', description: '指定控件渲染的目标元素' },
          { name: 'units', type: 'Units', default: "'metric'", description: '显示单位：metric, imperial, degrees, nautical, us' },
          { name: 'bar', type: 'boolean', default: 'false', description: '是否渲染为刻度尺样式而非直线' },
          { name: 'steps', type: 'number', default: '4', description: '刻度尺的步数（bar 为 true 时使用）' },
          { name: 'text', type: 'boolean', default: 'false', description: '是否在刻度尺上方显示文本（bar 为 true 时使用）' },
          { name: 'dpi', type: 'number', default: 'undefined', description: '输出设备 DPI（bar 为 true 时使用）' }
        ]
      }
    ],
    usage: `// ============================================
// 创建 ScaleLine 控件
// ============================================
import ScaleLine from 'ol/control/ScaleLine';

// 【示例 1】使用默认配置（公制单位）
const scaleLineControl = new ScaleLine();
map.addControl(scaleLineControl);

// 【示例 2】英制单位（英尺/英里）
const scaleLineControl = new ScaleLine({
  units: 'imperial'
});

// 【示例 3】海里单位（航海用途）
const scaleLineControl = new ScaleLine({
  units: 'nautical'
});

// 【示例 4】度数单位（地理坐标系）
const scaleLineControl = new ScaleLine({
  units: 'degrees'
});

// 【示例 5】刻度尺样式
const scaleLineControl = new ScaleLine({
  bar: true,
  steps: 4,      // 4 个刻度分段
  text: true,    // 显示文本
  minWidth: 100
});

// 【示例 6】自定义宽度
const scaleLineControl = new ScaleLine({
  minWidth: 120,  // 最小宽度 120 像素
  maxWidth: 200   // 最大宽度 200 像素
});

// 【示例 7】设置打印机 DPI（用于精确输出）
const scaleLineControl = new ScaleLine({
  bar: true,
  dpi: 300  // 300 DPI 打印机
});`
  },

  // ========== Methods (方法) ==========
  {
    name: 'getUnits',
    cn: '获取单位',
    type: 'method',
    category: 'method',
    description: '返回当前使用的单位类型。',
    returns: { type: 'Units', description: '单位类型：metric, imperial, degrees, nautical, us' },
    usage: `// ============================================
// getUnits - 获取单位
// ============================================
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine({
  units: 'metric'
});

// 获取当前单位
const units = scaleLineControl.getUnits();
console.log('当前单位:', units); // 'metric'`
  },

  {
    name: 'setUnits',
    cn: '设置单位',
    type: 'method',
    category: 'method',
    description: '设置要使用的单位类型。',
    params: [
      { name: 'units', type: 'Units', default: '', description: '单位类型：metric, imperial, degrees, nautical, us' }
    ],
    usage: `// ============================================
// setUnits - 设置单位
// ============================================
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();
map.addControl(scaleLineControl);

// 切换单位
scaleLineControl.setUnits('metric');     // 公制（米/公里）
scaleLineControl.setUnits('imperial');   // 英制（英尺/英里）
scaleLineControl.setUnits('nautical');   // 海里
scaleLineControl.setUnits('degrees');    // 度数
scaleLineControl.setUnits('us');         // 美制

// 监听单位变更
scaleLineControl.on('change:units', () => {
  console.log('单位已变更为:', scaleLineControl.getUnits());
});`
  },

  {
    name: 'setDpi',
    cn: '设置 DPI',
    type: 'method',
    category: 'method',
    description: '指定输出设备的 DPI，用于精确打印输出。',
    params: [
      { name: 'dpi', type: 'number', default: '', description: 'DPI 值，如 72（屏幕）、300（打印机）' }
    ],
    usage: `// ============================================
// setDpi - 设置 DPI
// ============================================
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine({
  bar: true
});

// 设置屏幕 DPI（默认）
scaleLineControl.setDpi(72);

// 设置打印机 DPI
scaleLineControl.setDpi(300);

// 设置高分辨率输出
scaleLineControl.setDpi(600);`
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 将控件添加到地图
scaleLineControl.setMap(map);

// 从地图移除控件
scaleLineControl.setMap(null);

// 通常使用 map.addControl() 和 map.removeControl() 更简洁
map.addControl(scaleLineControl);
map.removeControl(scaleLineControl);`
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
class CustomScaleLine extends ScaleLine {
  render(mapEvent) {
    // 自定义渲染逻辑
    const frameState = mapEvent.frameState;
    if (!frameState) {
      return false;
    }
    // 根据视图状态更新比例尺
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 监听变更事件
scaleLineControl.on('change', () => {
  console.log('控件状态已变更');
});

// 触发变更
scaleLineControl.changed();`
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 监听自定义事件
scaleLineControl.on('mycustomevent', (e) => {
  console.log('触发自定义事件:', e);
});

// 触发事件
const result = scaleLineControl.dispatchEvent('mycustomevent');`
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 设置并获取自定义属性
scaleLineControl.set('customProp', 'customValue');
const value = scaleLineControl.get('customProp');
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 设置单个属性
scaleLineControl.set('customProp', 'customValue');

// 静默设置（不触发事件）
scaleLineControl.set('anotherProp', 'value', true);

// 监听属性变更
scaleLineControl.on('propertychange', (e) => {
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();
scaleLineControl.set('prop1', 'value1');
scaleLineControl.set('prop2', 'value2');

// 获取所有键名
const keys = scaleLineControl.getKeys();
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();
map.addControl(scaleLineControl);

// 获取关联的地图
const associatedMap = scaleLineControl.getMap();
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();
scaleLineControl.set('prop1', 'value1');
scaleLineControl.set('prop2', 'value2');

// 获取所有属性
const props = scaleLineControl.getProperties();
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();
console.log(scaleLineControl.getRevision()); // 初始版本号

scaleLineControl.changed();
console.log(scaleLineControl.getRevision()); // 版本号 +1`
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 监听单位变更事件
scaleLineControl.on('change:units', () => {
  console.log('单位已变更');
});

// 监听多个事件类型
const keys = scaleLineControl.on(['change', 'propertychange'], (e) => {
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 只监听一次变更事件
scaleLineControl.once('change', () => {
  console.log('这是第一次也是唯一一次触发');
});

scaleLineControl.changed(); // 触发
scaleLineControl.changed(); // 不会触发`
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 批量设置多个属性
scaleLineControl.setProperties({
  prop1: 'value1',
  prop2: 'value2',
  prop3: 'value3'
});

// 静默批量设置
scaleLineControl.setProperties({
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 设置目标元素（通过元素）
const container = document.getElementById('scale-container');
scaleLineControl.setTarget(container);

// 设置目标元素（通过 ID 字符串）
scaleLineControl.setTarget('scale-container');

// 清除目标元素（渲染回地图视口）
scaleLineControl.setTarget(undefined);`
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

// 定义监听函数
const handleChange = () => {
  console.log('控件已变更');
};

// 添加监听
scaleLineControl.on('change', handleChange);

// 移除监听
scaleLineControl.un('change', handleChange);`
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();
scaleLineControl.set('tempProp', 'tempValue');

// 移除属性
scaleLineControl.unset('tempProp');

// 静默移除
scaleLineControl.unset('anotherProp', true);`
  },

  // ========== Observable Properties (可观察属性) ==========
  {
    name: 'units',
    cn: '单位属性',
    type: 'property',
    category: 'property',
    description: '用于显示的单位类型。可以通过 setUnits() 方法修改。',
    usage: `// ============================================
// units - 单位属性
// ============================================
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine({
  units: 'metric'
});

// 监听单位变更
scaleLineControl.on('change:units', () => {
  const units = scaleLineControl.getUnits();
  console.log('单位已变更为:', units);
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

scaleLineControl.on('change', () => {
  console.log('控件状态已变更，版本:', scaleLineControl.getRevision());
});`
  },

  {
    name: 'change:units',
    cn: '单位变更事件',
    type: 'event',
    category: 'event',
    description: '当 units 属性改变时触发。',
    usage: `// ============================================
// change:units - 单位变更事件
// ============================================
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

scaleLineControl.on('change:units', () => {
  console.log('单位已变更为:', scaleLineControl.getUnits());
});

scaleLineControl.setUnits('imperial');`
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

scaleLineControl.on('error', (e) => {
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
import ScaleLine from 'ol/control/ScaleLine';

const scaleLineControl = new ScaleLine();

scaleLineControl.on('propertychange', (e) => {
  console.log('属性变更:', e.key, '=', e.value);
});

scaleLineControl.set('customProp', 'value'); // 触发事件`
  },

  // ========== CSS Styling (样式) ==========
  {
    name: 'css-styling',
    cn: 'CSS 样式',
    type: 'property',
    category: 'property',
    description: 'ScaleLine 控件支持通过 CSS 类名进行自定义样式。主要类名包括：.ol-scale-line（直线样式）、.ol-scale-bar（刻度尺样式）。',
    usage: `// ============================================
// CSS 样式自定义
// ============================================
// 直线比例尺样式
.ol-scale-line {
  bottom: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
}

.ol-scale-line-inner {
  border: 2px solid #303133;
  border-top: none;
  color: #303133;
  font-size: 10px;
  text-align: center;
}

// 刻度尺样式
.ol-scale-bar {
  position: relative;
}

.ol-scale-bar-inner {
  display: flex;
}

.ol-scale-bar-step {
  background-color: #303133;
  color: white;
  font-size: 10px;
}

// 自定义类名
const scaleLineControl = new ScaleLine({
  className: 'my-custom-scaleline',
  units: 'metric'
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
