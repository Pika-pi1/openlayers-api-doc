<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>TextPlacement - 文本放置置 API</h2>
            <p class="description">
              TextPlacement 是一个枚举类型，用于定义文本标签相对于几何要素的放置位置。
              主要用于线状要素的文本标注，决定文本是沿着线放置还是在线的中心点放置。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_style_Text.html" target="_blank">
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
                    <h4>说明</h4>
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
import { Folder, FolderOpened, Reading, Document, Link } from '@element-plus/icons-vue'

const activeNames = ref(['point', 'line'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? textPlacementApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'enum': 'primary'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: textPlacementApis.length }
  ]
  return cats
})

const filteredApis = computed(() => {
  return textPlacementApis
})

const textPlacementApis = [
  {
    name: 'point',
    cn: '点放置',
    type: 'enum',
    category: 'all',
    description: '"point" - 将文本放置在几何的中心点。这是默认值，适用于点要素和多边形的中心标注。对于线要素，文本会放置在线的中心点，不随线的方向旋转。',
    usage: `import Text from 'ol/style/Text';
import TextPlacement from 'ol/style/TextPlacement';

// 点放置 - 文本固定在中心点
const textStyle = new Text({
  text: '北京市',
  placement: 'point',  // 或 TextPlacement.POINT
  font: '14px SimSun, sans-serif',
  fill: new Fill({ color: '#000' }),
  stroke: new Stroke({ color: '#fff', width: 2 })
});

// 适用于：
// - 点要素（城市标记）
// - 多边形中心（区域名称）
// - 不需要沿曲线显示的文本`
  },
  {
    name: 'line',
    cn: '线放置',
    type: 'enum',
    category: 'all',
    description: '"line" - 将文本沿着线几何放置。文本会跟随线的走向弯曲（如果线足够长），适用于道路、河流等线状要素的标注。文本会尝试保持水平，但会在线的走向上分布。',
    usage: `import Text from 'ol/style/Text';
import TextPlacement from 'ol/style/TextPlacement';

// 线放置 - 文本沿曲线分布
const textStyle = new Text({
  text: '长江',
  placement: 'line',  // 或 TextPlacement.LINE
  font: '14px SimHei, sans-serif',
  fill: new Fill({ color: '#0066cc' }),
  stroke: new Stroke({ color: '#fff', width: 2 })
});

// 适用于：
// - 道路名称标注
// - 河流名称标注
// - 铁路线标注
// - 其他线状要素

// 注意：线放置需要线足够长才能显示文本
// 如果线太短，文本可能不会显示`
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

        &.description-icon { color: #67c23a; }
        &.usage-icon { color: #409eff; }
      }
    }

    &.description-section {
      .description-text {
        color: #606266;
        line-height: 1.8;
        margin: 0;
        background: #f8f9fa;
        padding: 12px 16px;
        border-left: 4px solid #67c23a;
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
  }
}

// 枚举值说明卡片
.enum-card {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;

  .enum-name {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 16px;
    font-weight: 600;
    color: #409eff;
    margin-bottom: 8px;
  }

  .enum-desc {
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
  }
}
</style>
