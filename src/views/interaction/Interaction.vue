<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Interaction - 交互基类 API</h2>
            <p class="description">
              Interaction 是 OpenLayers 中所有地图交互的基类，提供了交互行为的核心功能。
              所有交互（如 Draw、Modify、Select 等）都继承自此类，支持激活/停用、事件处理等功能。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_interaction_Interaction-Interaction.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? interactionApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'overview': 'danger',
    'method': 'success',
    'event': 'warning'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: interactionApis.length },
    { name: 'overview', cn: '概述', count: interactionApis.filter(a => a.type === 'overview').length },
    { name: 'methods', cn: '方法', count: interactionApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return interactionApis
  if (currentCategory.value === 'overview') return interactionApis.filter(a => a.type === 'overview')
  if (currentCategory.value === 'methods') return interactionApis.filter(a => a.type === 'method')
  return interactionApis
})

const interactionApis = [
  {
    name: 'overview',
    cn: 'Interaction 概述',
    type: 'overview',
    category: 'overview',
    description: 'Interaction 类是 OpenLayers 中所有地图交互的基类。它提供了交互行为的核心框架，包括：地图关联、激活/停用控制、事件处理等。通常不直接使用此类，而是通过其子类（如 Draw、Modify、Select、Snap 等）来实现具体的交互功能。',
    usage: `// Interaction 通常作为基类使用
import Interaction from 'ol/interaction/Interaction.js';

// 更常见的是使用具体的交互子类
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Select from 'ol/interaction/Select.js';

// 创建交互
const draw = new Draw({ source: vectorSource, type: 'Point' });
const modify = new Modify({ source: vectorSource });

// 添加到地图
map.addInteraction(draw);
map.addInteraction(modify);

// 移除交互
map.removeInteraction(draw);`
  },
  {
    name: 'getMap',
    cn: '获取关联的地图',
    type: 'method',
    category: 'methods',
    description: '获取与此交互关联的地图对象。当交互被添加到地图时，此方法返回该地图；否则返回 null。',
    usage: `import Draw from 'ol/interaction/Draw.js';

const draw = new Draw({ source: vectorSource, type: 'Point' });

// 添加到地图前
console.log(draw.getMap()); // null

// 添加到地图
map.addInteraction(draw);
console.log(draw.getMap() === map); // true

// 从地图移除
map.removeInteraction(draw);
console.log(draw.getMap()); // null`
  },
  {
    name: 'setMap',
    cn: '设置关联的地图',
    type: 'method',
    category: 'methods',
    description: '设置与此交互关联的地图。子类可以重写此方法以处理自定义的地图关联逻辑。通常使用 map.addInteraction() 和 map.removeInteraction() 而不是直接调用此方法。',
    usage: `import Draw from 'ol/interaction/Draw.js';

const draw = new Draw({ source: vectorSource, type: 'Point' });

// 直接设置地图（不推荐，通常使用 map.addInteraction）
draw.setMap(map);

// 移除关联
draw.setMap(null);

// 推荐的方式
map.addInteraction(draw);
map.removeInteraction(draw);`
  },
  {
    name: 'getActive',
    cn: '获取激活状态',
    type: 'method',
    category: 'methods',
    description: '返回交互是否当前处于激活状态。激活的交互会响应地图事件，停用的交互则不会。',
    usage: `import Draw from 'ol/interaction/Draw.js';

const draw = new Draw({ source: vectorSource, type: 'Point' });
map.addInteraction(draw);

// 检查激活状态
console.log(draw.getActive()); // true（默认激活）

// 停用
draw.setActive(false);
console.log(draw.getActive()); // false

// 切换状态
draw.setActive(!draw.getActive());`
  },
  {
    name: 'setActive',
    cn: '设置激活状态',
    type: 'method',
    category: 'methods',
    description: '激活或停用交互。停用的交互不会响应地图事件，但仍保留在地图的交互列表中。',
    usage: `import Draw from 'ol/interaction/Draw.js';

const draw = new Draw({ source: vectorSource, type: 'Point' });
map.addInteraction(draw);

// 停用交互（用户无法绘制）
draw.setActive(false);

// 激活交互
draw.setActive(true);

// 典型用法：工具栏按钮切换
function toggleDraw() {
  const isActive = draw.getActive();
  draw.setActive(!isActive);
  updateButtonState(!isActive);
}`
  },
  {
    name: 'handleEvent',
    cn: '处理事件',
    type: 'method',
    category: 'methods',
    description: '处理地图浏览器事件。所有交互都会调用此方法来处理事件。子类可以重写此方法以实现自定义的事件处理逻辑。返回 false 可以阻止事件传播给其他交互。',
    usage: `import Interaction from 'ol/interaction/Interaction.js';

// 子类重写示例
class CustomInteraction extends Interaction {
  handleEvent(event) {
    // 处理指针移动事件
    if (event.type === 'pointermove') {
      console.log('指针移动:', event.coordinate);
    }

    // 处理点击事件
    if (event.type === 'singleclick') {
      console.log('点击位置:', event.coordinate);
    }

    // 返回 true 允许事件继续传播
    return true;
  }
}

const custom = new CustomInteraction();
map.addInteraction(custom);`
  },
  {
    name: 'changed',
    cn: '触发变更事件',
    type: 'method',
    category: 'methods',
    description: '增加修订计数器并触发变更事件。当交互状态改变时调用此方法通知监听器。',
    usage: `import Draw from 'ol/interaction/Draw.js';

const draw = new Draw({ source: vectorSource, type: 'Point' });

// 监听变更事件
draw.on('change', () => {
  console.log('交互状态已变更，版本:', draw.getRevision());
});

// 触发变更
draw.changed();`
  },
  {
    name: 'getRevision',
    cn: '获取版本号',
    type: 'method',
    category: 'methods',
    description: '获取交互的修订版本号。每次调用 changed() 方法时版本号会递增。可用于检测交互状态是否发生变化。',
    usage: `import Draw from 'ol/interaction/Draw.js';

const draw = new Draw({ source: vectorSource, type: 'Point' });

console.log('初始版本:', draw.getRevision());

draw.changed();
console.log('变更后版本:', draw.getRevision()); // +1`
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
