<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Pointer - 指针交互 API</h2>
            <p class="description">
              Pointer 交互是所有指针相关交互的基类，提供了处理指针事件的核心功能。
              Draw、Modify、Select 等交互都继承自 Pointer，支持指针按下、拖动、释放等事件处理。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Pointer-Pointer.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? pointerApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'constructor': 'primary',
    'method': 'success',
    'event': 'warning'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: pointerApis.length },
    { name: 'constructor', cn: '构造函数', count: pointerApis.filter(a => a.type === 'constructor').length },
    { name: 'methods', cn: '方法', count: pointerApis.filter(a => a.type === 'method').length },
    { name: 'events', cn: '事件', count: pointerApis.filter(a => a.type === 'event').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return pointerApis
  if (currentCategory.value === 'constructor') return pointerApis.filter(a => a.type === 'constructor')
  if (currentCategory.value === 'methods') return pointerApis.filter(a => a.type === 'method')
  if (currentCategory.value === 'events') return pointerApis.filter(a => a.type === 'event')
  return pointerApis
})

const pointerApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 Pointer 交互实例。Pointer 是所有指针相关交互的基类，通常不直接使用，而是通过子类（如 Draw、Modify、Select 等）来使用。',
    usage: `import Pointer from 'ol/interaction/Pointer.js';

// 创建 Pointer 交互（通常通过子类使用）
const pointer = new Pointer({
  handleDownEvent: (event) => {
    console.log('指针按下', event.coordinate);
    return true; // 阻止事件传播
  },
  handleDragEvent: (event) => {
    console.log('指针拖动', event.coordinate);
  },
  handleUpEvent: (event) => {
    console.log('指针释放', event.coordinate);
  },
  handleMoveEvent: (event) => {
    console.log('指针移动', event.coordinate);
  }
});

map.addInteraction(pointer);

// 更常见的是使用子类
import Draw from 'ol/interaction/Draw.js';
const draw = new Draw({ source: vectorSource, type: 'Point' });`,
    params: [
      { name: 'handleDownEvent', type: 'Function', default: 'undefined', description: '指针按下时的回调函数，返回 true 阻止事件传播' },
      { name: 'handleDragEvent', type: 'Function', default: 'undefined', description: '指针拖动时的回调函数' },
      { name: 'handleMoveEvent', type: 'Function', default: 'undefined', description: '指针移动时的回调函数' },
      { name: 'handleUpEvent', type: 'Function', default: 'undefined', description: '指针释放时的回调函数' },
      { name: 'stopDown', type: 'Function', type: 'boolean', default: 'true', description: '是否阻止指针按下事件传播，或自定义条件函数' }
    ],
    returns: { type: 'Pointer', description: '新的 Pointer 交互实例' }
  },
  {
    name: 'handleDownEvent',
    cn: '处理指针按下',
    type: 'method',
    category: 'methods',
    description: '处理指针按下事件。子类可以重写此方法以实现自定义的按下逻辑。默认返回 false，表示不阻止事件传播。',
    usage: `// 子类重写示例
class CustomPointer extends Pointer {
  handleDownEvent(event) {
    // 获取点击位置的要素
    const feature = map.forEachFeatureAtPixel(
      event.pixel,
      (feature) => feature
    );

    if (feature) {
      console.log('点击了要素:', feature);
      return true; // 阻止事件传播
    }
    return false;
  }
}`,
    params: [
      { name: 'event', type: 'MapBrowserPointerEvent', default: '', description: '地图指针事件对象' }
    ],
    returns: { type: 'boolean', description: '返回 true 阻止事件传播' }
  },
  {
    name: 'handleDragEvent',
    cn: '处理指针拖动',
    type: 'method',
    category: 'methods',
    description: '处理指针拖动事件。当指针按下后移动时调用。子类可以重写此方法实现拖拽功能。',
    usage: `// 子类重写示例
class CustomPointer extends Pointer {
  handleDragEvent(event) {
    // 拖动时移动要素
    if (this.draggedFeature) {
      const geometry = this.draggedFeature.getGeometry();
      const coordinates = geometry.getCoordinates();
      coordinates[0] += event.delta[0];
      coordinates[1] += event.delta[1];
      geometry.setCoordinates(coordinates);
    }
  }
}`,
    params: [
      { name: 'event', type: 'MapBrowserPointerEvent', default: '', description: '地图指针事件对象' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },
  {
    name: 'handleMoveEvent',
    cn: '处理指针移动',
    type: 'method',
    category: 'methods',
    description: '处理指针移动事件。当指针在地图上移动时调用，可用于实现悬停效果。',
    usage: `// 子类重写示例
class CustomPointer extends Pointer {
  handleMoveEvent(event) {
    // 改变鼠标样式
    const feature = map.forEachFeatureAtPixel(
      event.pixel,
      (feature) => feature
    );

    if (feature) {
      map.getTargetElement().style.cursor = 'pointer';
    } else {
      map.getTargetElement().style.cursor = '';
    }
  }
}`,
    params: [
      { name: 'event', type: 'MapBrowserPointerEvent', default: '', description: '地图指针事件对象' }
    ],
    returns: { type: 'undefined', description: '无返回值' }
  },
  {
    name: 'handleUpEvent',
    cn: '处理指针释放',
    type: 'method',
    category: 'methods',
    description: '处理指针释放事件。当指针按钮释放时调用。子类可以重写此方法实现点击后的逻辑。',
    usage: `// 子类重写示例
class CustomPointer extends Pointer {
  handleUpEvent(event) {
    // 释放时完成操作
    console.log('操作完成于:', event.coordinate);
    this.draggedFeature = null;
    return false;
  }
}`,
    params: [
      { name: 'event', type: 'MapBrowserPointerEvent', default: '', description: '地图指针事件对象' }
    ],
    returns: { type: 'boolean', description: '返回 true 阻止事件传播' }
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
