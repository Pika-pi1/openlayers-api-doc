<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>defaults - 默认交互 API</h2>
            <p class="description">
              defaults 函数返回一组默认的地图交互，包括鼠标缩放、双击缩放、拖动平移、键盘导航等。
              创建地图时通常使用 defaults() 来快速添加标准交互。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction.html#defaults" target="_blank">
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

const activeNames = ref(['function'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? defaultsApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'function': 'primary',
    'property': 'warning'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: defaultsApis.length },
    { name: 'function', cn: '函数', count: defaultsApis.filter(a => a.type === 'function').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return defaultsApis
  if (currentCategory.value === 'function') return defaultsApis.filter(a => a.type === 'function')
  return defaultsApis
})

const defaultsApis = [
  {
    name: 'defaults',
    cn: '默认交互函数',
    type: 'function',
    category: 'function',
    description: '返回一组默认的地图交互集合。包括：MouseWheelZoom、DoubleClickZoom、DragPan、KeyboardPan、KeyboardZoom、DragZoom、PinchRotate、PinchZoom、DragRotateAndZoom 等。',
    usage: `import { defaults } from 'ol/interaction.js';
import { Map } from 'ol';

// 创建地图时使用默认交互
const map = new Map({
  target: 'map',
  interactions: defaults({
    altShiftDragRotate: true,  // Alt+Shift+ 拖动旋转
    onFocusOnly: false,        // 是否只在焦点模式响应
    mouseWheelZoom: true,      // 鼠标滚轮缩放
    pinchRotate: true,         // 捏合旋转（触摸设备）
    pinchZoom: true,           // 捏合缩放（触摸设备）
    shiftDragZoom: true        // Shift+ 拖动缩放
  })
});

// 在现有交互基础上添加默认交互
const interactions = defaults();
interactions.push(new CustomInteraction());

const map = new Map({
  target: 'map',
  interactions: interactions
});`,
    params: [
      { name: 'altShiftDragRotate', type: 'boolean', default: 'true', description: '是否启用 Alt+Shift+ 拖动旋转' },
      { name: 'onFocusOnly', type: 'boolean', default: 'false', description: '是否只在地图获得焦点时响应键盘事件' },
      { name: 'mouseWheelZoom', type: 'boolean', default: 'true', description: '是否启用鼠标滚轮缩放' },
      { name: 'pinchRotate', type: 'boolean', default: 'true', description: '是否启用手势旋转（触摸设备）' },
      { name: 'pinchZoom', type: 'boolean', default: 'true', description: '是否启用手势缩放（触摸设备）' },
      { name: 'shiftDragZoom', type: 'boolean', default: 'true', description: '是否启用 Shift+ 拖动缩放' }
    ],
    returns: { type: 'Collection<Interaction>', description: '默认交互集合' }
  },
  {
    name: '默认交互列表',
    cn: '包含的交互',
    type: 'property',
    category: 'function',
    description: 'defaults() 返回的交互集合包含以下默认交互：MouseWheelZoom（鼠标滚轮缩放）、DoubleClickZoom（双击缩放）、DragPan（拖动平移）、KeyboardPan（键盘平移）、KeyboardZoom（键盘缩放）、DragZoom（拖动缩放）、PinchRotate（捏合旋转）、PinchZoom（捏合缩放）、DragRotateAndZoom（拖动旋转缩放）。',
    usage: `import { defaults } from 'ol/interaction.js';

const interactions = defaults();

// 遍历默认交互
interactions.forEach((interaction) => {
  console.log('交互类型:', interaction.constructor.name);
});

// 获取特定交互
const mouseWheelZoom = interactions.item(0); // 通常第一个是 MouseWheelZoom

// 移除某个交互
interactions.forEach((interaction) => {
  if (interaction.constructor.name === 'KeyboardZoom') {
    interactions.remove(interaction);
  }
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
