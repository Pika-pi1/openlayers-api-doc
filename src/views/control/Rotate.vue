<template>
  <div class="api-page-container">
    <div class="page-layout">
      <!-- 左侧：API 文档 -->
      <div class="doc-content">
        <!-- 页面标题和控制栏 -->
        <div class="page-header">
          <div class="title-section">
            <h2>Rotate - 旋转重置控制 API</h2>
            <p class="description">
              Rotate 控件提供一个按钮用于将地图旋转角度重置为 0（正北方向）。
              当用户旋转地图后，点击该按钮可以带动画过渡效果恢复到默认方向。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_control_Rotate-Rotate.html" target="_blank">
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
    return rotateApis
  }
  return rotateApis.filter(api => {
    if (currentCategory.value === 'overview') return api.type === 'overview'
    if (currentCategory.value === 'constructor') return api.type === 'constructor'
    if (currentCategory.value === 'method') return api.type === 'method'
    if (currentCategory.value === 'property') return api.type === 'property'
    if (currentCategory.value === 'event') return api.type === 'event'
    return true
  })
})

const rotateApis = [
  // ========== Overview (概述) ==========
  {
    name: 'overview',
    cn: 'Rotate 控件概述',
    type: 'overview',
    category: 'overview',
    description: 'Rotate 控件提供一个按钮用于将地图旋转角度重置为 0（正北方向）。当用户旋转地图后，点击该按钮可以带动画过渡效果恢复到默认方向。默认情况下，当地图旋转角度为 0 时，按钮会自动隐藏。',
    usage: `// ============================================
// Rotate 控件概述
// ============================================
// Rotate 控件用于重置地图旋转角度到 0（正北方向）
// - 点击按钮后带动画过渡效果
// - 默认当地图未旋转时自动隐藏
// - 可自定义按钮标签和样式

import { Map } from 'ol';
import Rotate from 'ol/control/Rotate';

// 创建带默认配置的 Rotate 控件
const rotateControl = new Rotate();
map.addControl(rotateControl);`
  },

  // ========== Constructor (构造函数) ==========
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 Rotate 控件实例。通过配置选项可以自定义控件的类名、按钮标签、提示文本、动画时长、自动隐藏行为以及重置北方的回调函数。',
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '配置选项对象',
        children: [
          { name: 'className', type: 'string', default: "'ol-rotate'", description: 'CSS 类名，用于自定义控件样式' },
          { name: 'label', type: 'string | Text | HTMLElement', default: "'⇧'", description: '按钮的文本标签或 HTML 元素' },
          { name: 'tipLabel', type: 'string', default: "'Reset rotation'", description: '按钮的提示文本（tooltip）' },
          { name: 'compassClassName', type: 'string', default: "'ol-compass'", description: '指南针图标的 CSS 类名' },
          { name: 'duration', type: 'number', default: '250', description: '重置旋转动画的持续时间（毫秒）' },
          { name: 'autoHide', type: 'boolean', default: 'true', description: '当旋转角度为 0 时是否自动隐藏控件' },
          { name: 'resetNorth', type: 'Function', default: '内置函数', description: '点击按钮时执行的回调函数，用于自定义重置北方逻辑' },
          { name: 'render', type: 'Function', default: 'undefined', description: '控件重新渲染时调用的函数' },
          { name: 'target', type: 'HTMLElement | string', default: 'undefined', description: '指定控件渲染的目标元素，默认渲染在地图视口内' }
        ]
      }
    ],
    usage: `// ============================================
// 创建 Rotate 控件
// ============================================
import Rotate from 'ol/control/Rotate';

// 【示例 1】使用默认配置
const rotateControl = new Rotate();
map.addControl(rotateControl);

// 【示例 2】自定义按钮标签和提示
const rotateControl = new Rotate({
  label: '<i class="icon-compass"></i>',
  tipLabel: '重置方向'
});

// 【示例 3】禁用自动隐藏（始终显示）
const rotateControl = new Rotate({
  autoHide: false
});

// 【示例 4】自定义动画时长
const rotateControl = new Rotate({
  duration: 1000  // 1 秒动画
});

// 【示例 5】自定义重置北方行为
const rotateControl = new Rotate({
  resetNorth: function() {
    // 自定义重置逻辑
    const view = this.getMap().getView();
    view.animate({ rotation: 0, duration: 500 });
  }
});

// 【示例 6】渲染到地图外部
const rotateControl = new Rotate({
  target: 'my-controls-container'
});`
  },

  // ========== Methods (方法) ==========
  {
    name: 'setMap',
    cn: '设置关联的地图',
    type: 'method',
    category: 'method',
    description: '将控件从当前地图移除并附加到新的地图。子类可以重写此方法以处理自定义行为。',
    params: [
      { name: 'map', type: 'Map | null', default: '', description: '要关联的地图对象，null 表示移除关联' }
    ],
    usage: `// ============================================
// setMap - 设置关联的地图
// ============================================
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 将控件添加到地图
rotateControl.setMap(map);

// 从地图移除控件
rotateControl.setMap(null);

// 注意：通常使用 map.addControl() 和 map.removeControl() 更简洁
map.addControl(rotateControl);
map.removeControl(rotateControl);`
  },

  {
    name: 'render',
    cn: '渲染控件',
    type: 'method',
    category: 'method',
    description: '渲染控件。在 mapEvent 参数提供的时机重新渲染控件。子类可以重写此方法以实现自定义渲染逻辑。',
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
class CustomRotate extends Rotate {
  render(mapEvent) {
    // 自定义渲染逻辑
    const frameState = mapEvent.frameState;
    if (!frameState) {
      return false;
    }
    // 根据旋转角度更新控件显示
    const rotation = frameState.viewState.rotation;
    if (this.autoHide_ && rotation === 0) {
      this.element.style.display = 'none';
    } else {
      this.element.style.display = '';
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 监听变更事件
rotateControl.on('change', () => {
  console.log('控件状态已变更');
});

// 触发变更
rotateControl.changed();`
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 监听自定义事件
rotateControl.on('mycustomevent', (e) => {
  console.log('触发自定义事件:', e);
});

// 触发事件
const result = rotateControl.dispatchEvent('mycustomevent');`
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 设置并获取自定义属性
rotateControl.set('customProp', 'customValue');
const value = rotateControl.get('customProp');
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 设置单个属性
rotateControl.set('customProp', 'customValue');

// 静默设置（不触发事件）
rotateControl.set('anotherProp', 'value', true);

// 监听属性变更
rotateControl.on('propertychange', (e) => {
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();
rotateControl.set('prop1', 'value1');
rotateControl.set('prop2', 'value2');

// 获取所有键名
const keys = rotateControl.getKeys();
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();
map.addControl(rotateControl);

// 获取关联的地图
const associatedMap = rotateControl.getMap();
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();
rotateControl.set('prop1', 'value1');
rotateControl.set('prop2', 'value2');

// 获取所有属性
const props = rotateControl.getProperties();
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();
console.log(rotateControl.getRevision()); // 初始版本号

rotateControl.changed();
console.log(rotateControl.getRevision()); // 版本号 +1`
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 监听单个事件
const key = rotateControl.on('change', () => {
  console.log('控件已变更');
});

// 监听多个事件类型
const keys = rotateControl.on(['change', 'propertychange'], (e) => {
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 只监听一次变更事件
rotateControl.once('change', () => {
  console.log('这是第一次也是唯一一次触发');
});

rotateControl.changed(); // 触发
rotateControl.changed(); // 不会触发`
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 批量设置多个属性
rotateControl.setProperties({
  prop1: 'value1',
  prop2: 'value2',
  prop3: 'value3'
});

// 静默批量设置
rotateControl.setProperties({
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 设置目标元素（通过元素）
const container = document.getElementById('controls-container');
rotateControl.setTarget(container);

// 设置目标元素（通过 ID 字符串）
rotateControl.setTarget('controls-container');

// 清除目标元素（渲染回地图视口）
rotateControl.setTarget(undefined);`
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

// 定义监听函数
const handleChange = () => {
  console.log('控件已变更');
};

// 添加监听
rotateControl.on('change', handleChange);

// 移除监听
rotateControl.un('change', handleChange);`
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();
rotateControl.set('tempProp', 'tempValue');

// 移除属性
rotateControl.unset('tempProp');

// 静默移除
rotateControl.unset('anotherProp', true);`
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

rotateControl.on('change', () => {
  console.log('控件状态已变更，版本:', rotateControl.getRevision());
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

rotateControl.on('error', (e) => {
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
import Rotate from 'ol/control/Rotate';

const rotateControl = new Rotate();

rotateControl.on('propertychange', (e) => {
  console.log('属性变更:', e.key, '=', e.value);
});

rotateControl.set('customProp', 'value'); // 触发事件`
  },

  // ========== CSS Styling (样式) ==========
  {
    name: 'css-styling',
    cn: 'CSS 样式',
    type: 'property',
    category: 'property',
    description: 'Rotate 控件支持通过 CSS 类名进行自定义样式。主要类名包括：.ol-rotate（控件容器）、.ol-compass（指南针图标）、.ol-hidden（隐藏状态）。',
    usage: `// ============================================
// CSS 样式自定义
// ============================================
// 控件容器样式
.ol-rotate {
  top: 20px;
  right: 20px;
}

// 指南针图标样式
.ol-compass {
  color: #409eff;
  font-size: 24px;
  transition: transform 0.3s;
}

// 悬停旋转效果
.ol-rotate:hover .ol-compass {
  transform: rotate(180deg);
}

// 隐藏状态
.ol-hidden {
  display: none;
}

// 自定义类名
const rotateControl = new Rotate({
  className: 'my-custom-rotate',
  compassClassName: 'my-compass',
  label: '<i class="icon-direction"></i>'
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
