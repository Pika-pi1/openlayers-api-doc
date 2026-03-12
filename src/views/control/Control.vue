<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Control - 控件基类 API</h2>
            <p class="description">
              Control 是 OpenLayers 中所有地图控件的基类，提供了控件行为的核心功能。
              所有控件（如 Zoom、Rotate、Attribution 等）都继承自此类，支持渲染、目标元素设置等功能。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_control_Control-Control.html" target="_blank">
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

const activeNames = ref(['overview'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? controlApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'overview': 'danger',
    'method': 'success',
    'property': 'warning'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: controlApis.length },
    { name: 'overview', cn: '概述', count: controlApis.filter(a => a.type === 'overview').length },
    { name: 'methods', cn: '方法', count: controlApis.filter(a => a.type === 'method').length },
    { name: 'properties', cn: '属性', count: controlApis.filter(a => a.type === 'property').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return controlApis
  if (currentCategory.value === 'overview') return controlApis.filter(a => a.type === 'overview')
  if (currentCategory.value === 'methods') return controlApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'properties') return controlApis.filter(a => a.type === 'property')
  return controlApis
})

const controlApis = [
  {
    name: 'overview',
    cn: 'Control 概述',
    type: 'overview',
    category: 'overview',
    description: 'Control 类是 OpenLayers 中所有地图控件的基类。它提供了控件行为的核心框架，包括：地图关联、渲染控制、目标元素设置等。通常不直接使用此类，而是通过其子类（如 Zoom、Rotate、Attribution、FullScreen 等）来实现具体的控件功能。',
    usage: `// Control 通常作为基类使用
import Control from 'ol/control/Control.js';

// 更常见的是使用具体的控件子类
import Zoom from 'ol/control/Zoom.js';
import Rotate from 'ol/control/Rotate.js';
import Attribution from 'ol/control/Attribution.js';

// 创建控件
const zoom = new Zoom();
const rotate = new Rotate();

// 添加到地图
map.addControl(zoom);
map.addControl(rotate);

// 移除控件
map.removeControl(zoom);`
  },
  {
    name: 'getMap',
    cn: '获取关联的地图',
    type: 'method',
    category: 'methods',
    description: '获取与此控件关联的地图对象。当控件被添加到地图时，此方法返回该地图；否则返回 null。',
    usage: `import Zoom from 'ol/control/Zoom.js';

const zoom = new Zoom();

// 添加到地图前
console.log(zoom.getMap()); // null

// 添加到地图
map.addControl(zoom);
console.log(zoom.getMap() === map); // true

// 从地图移除
map.removeControl(zoom);
console.log(zoom.getMap()); // null`
  },
  {
    name: 'setMap',
    cn: '设置关联的地图',
    type: 'method',
    category: 'methods',
    description: '设置与此控件关联的地图。子类可以重写此方法以处理自定义的地图关联逻辑。通常使用 map.addControl() 和 map.removeControl() 而不是直接调用此方法。',
    usage: `import Zoom from 'ol/control/Zoom.js';

const zoom = new Zoom();

// 直接设置地图（不推荐，通常使用 map.addControl）
zoom.setMap(map);

// 移除关联
zoom.setMap(null);

// 推荐的方式
map.addControl(zoom);
map.removeControl(zoom);`
  },
  {
    name: 'getTarget',
    cn: '获取目标元素',
    type: 'method',
    category: 'methods',
    description: '获取控件的目标元素。控件将渲染在该元素中，而不是地图视口内。如果未设置目标元素，返回 undefined。',
    usage: `import Zoom from 'ol/control/Zoom.js';

const zoom = new Zoom();
map.addControl(zoom);

// 获取目标元素（默认在地图视口内）
console.log(zoom.getTarget()); // undefined

// 设置外部目标
zoom.setTarget('my-controls-container');
console.log(zoom.getTarget()); // 'my-controls-container'`
  },
  {
    name: 'setTarget',
    cn: '设置目标元素',
    type: 'method',
    category: 'methods',
    description: '设置控件的目标元素。控件将渲染在该元素中，而不是地图视口内。可以是元素 ID 字符串、DOM 元素或 undefined（渲染回地图视口）。',
    usage: `import Zoom from 'ol/control/Zoom.js';

const zoom = new Zoom();
map.addControl(zoom);

// 设置目标元素（通过 ID 字符串）
zoom.setTarget('controls-container');

// 设置目标元素（通过 DOM 元素）
const container = document.getElementById('controls-container');
zoom.setTarget(container);

// 清除目标元素（渲染回地图视口）
zoom.setTarget(undefined);`
  },
  {
    name: 'render',
    cn: '渲染控件',
    type: 'method',
    category: 'methods',
    description: '渲染控件。在 mapEvent 参数提供的时机重新渲染控件。子类可以重写此方法以实现自定义渲染逻辑。',
    usage: `import Control from 'ol/control/Control.js';

// 子类重写示例
class CustomControl extends Control {
  render(mapEvent) {
    const frameState = mapEvent.frameState;
    if (!frameState) {
      return false;
    }
    // 根据帧状态更新控件显示
    this.updateDisplay(frameState.viewState);
    return true;
  }
}`
  },
  {
    name: 'changed',
    cn: '触发变更事件',
    type: 'method',
    category: 'methods',
    description: '增加修订计数器并触发变更事件。当控件状态改变时调用此方法通知监听器。',
    usage: `import Zoom from 'ol/control/Zoom.js';

const zoom = new Zoom();

// 监听变更事件
zoom.on('change', () => {
  console.log('控件状态已变更，版本:', zoom.getRevision());
});

// 触发变更
zoom.changed();`
  },
  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'methods',
    description: '获取控件的修订版本号。每次调用 changed() 方法时版本号会递增。可用于检测控件状态是否发生变化。',
    usage: `import Zoom from 'ol/control/Zoom.js';

const zoom = new Zoom();

console.log('初始版本:', zoom.getRevision());

zoom.changed();
console.log('变更后版本:', zoom.getRevision()); // +1`
  },
  {
    name: 'element',
    cn: '控件元素',
    type: 'property',
    category: 'properties',
    description: '控件的 DOM 元素。在创建控件时通过 options.element 指定。这是控件在页面上显示的 HTML 元素。',
    usage: `import Control from 'ol/control/Control.js';

// 创建自定义控件
const button = document.createElement('button');
button.textContent = '我的控件';

const myControl = new Control({
  element: button
});

map.addControl(myControl);

// 访问控件元素
console.log(myControl.element); // <button>我的控件</button>`
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

        &.description-icon { color: #67c23a; }
        &.usage-icon { color: #409eff; }
        &.returns-icon { color: #909399; }
      }
    }

    &.description-section {
      .description-text {
        color: #606266;
        line-height: 1.8;
        margin: 0;
        padding: 16px;
        background-color: #f5f7fa;
        border-radius: 4px;
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
