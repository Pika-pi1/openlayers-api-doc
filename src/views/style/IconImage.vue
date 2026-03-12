<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>IconImage - 图标图像 API</h2>
            <p class="description">
              IconImage 用于管理图标图像的加载和状态。
              它处理图像资源的加载、缓存和状态管理，是 Icon 样式的底层图像管理组件。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_style_IconImage-IconImage.html" target="_blank">
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
                <div v-if="api.description" class="api-description">{{ api.description }}</div>

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
import { Folder, FolderOpened, Operation, Reading, Document, Select, Link } from '@element-plus/icons-vue'

const activeNames = ref([])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? iconImageApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'method': 'primary'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: iconImageApis.length },
    { name: 'getter', cn: '获取方法', count: iconImageApis.filter(a => a.category === 'getter').length },
    { name: 'setter', cn: '设置方法', count: iconImageApis.filter(a => a.category === 'setter').length },
    { name: 'state', cn: '状态方法', count: iconImageApis.filter(a => a.category === 'state').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return iconImageApis
  return iconImageApis.filter(a => a.category === currentCategory.value)
})

const iconImageApis = [
  {
    name: 'getAnchor',
    cn: '获取锚点',
    type: 'method',
    category: 'getter',
    description: '获取图标的锚点（像素）。锚点决定了图标相对于要素位置的对齐方式。',
    usage: `// 获取锚点
const anchor = iconImage.getAnchor();
console.log('锚点:', anchor); // [x, y]

// 锚点通常位于图标中心
// 例如 [16, 16] 表示 32x32 图标的中心`,
    params: [],
    returns: { type: 'Array<number>', description: '锚点坐标 [x, y]，单位像素' }
  },
  {
    name: 'getColor',
    cn: '获取颜色',
    type: 'method',
    category: 'getter',
    description: '获取用于着色图标的颜色。',
    usage: `// 获取颜色
const color = iconImage.getColor();
console.log('颜色:', color); // 可能是 null 或颜色值`,
    params: [],
    returns: { type: 'Array<number>|null', description: '颜色数组 [r, g, b, a] 或 null' }
  },
  {
    name: 'getImage',
    cn: '获取图像',
    type: 'method',
    category: 'getter',
    description: '获取加载完成的图像元素（HTMLImageElement 或 HTMLCanvasElement）。',
    usage: `// 获取图像元素
const img = iconImage.getImage();
if (img) {
  console.log('图像宽度:', img.width);
  console.log('图像高度:', img.height);
}`,
    params: [],
    returns: { type: 'HTMLImageElement|HTMLCanvasElement', description: '图像元素' }
  },
  {
    name: 'getSize',
    cn: '获取尺寸',
    type: 'method',
    category: 'getter',
    description: '获取图像的尺寸（像素）。',
    usage: `// 获取图像尺寸
const size = iconImage.getSize();
console.log('图像尺寸:', size); // [width, height]

if (size) {
  console.log('宽度:', size[0]);
  console.log('高度:', size[1]);
}`,
    params: [],
    returns: { type: 'Size|undefined', description: '图像尺寸 [width, height] 或 undefined' }
  },
  {
    name: 'getSrc',
    cn: '获取源 URL',
    type: 'method',
    category: 'getter',
    description: '获取图像源的 URL 地址。',
    usage: `// 获取图像 URL
const src = iconImage.getSrc();
console.log('图像源 URL:', src);`,
    params: [],
    returns: { type: 'string', description: '图像源 URL' }
  },
  {
    name: 'setSrc',
    cn: '设置源 URL',
    type: 'method',
    category: 'setter',
    description: '设置图像源的 URL。设置后会自动重新加载图像。',
    usage: `// 更改图像源
iconImage.setSrc('https://example.com/new-icon.png');

// 图像会自动重新加载`,
    params: [
      { name: 'src', type: 'string', default: 'undefined', description: '新的图像源 URL' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'load',
    cn: '加载图像',
    type: 'method',
    category: 'state',
    description: '加载尚未加载的图像。通常在渲染时由矢量渲染器自动调用。',
    usage: `// 手动加载图像
iconImage.load();

// 监听加载完成
iconImage.addEventListener('change', () => {
  if (iconImage.getState() === 2) {  // 2 = LOADED
    console.log('图像加载完成');
  }
});`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getState',
    cn: '获取状态',
    type: 'method',
    category: 'state',
    description: '获取图像加载状态。0=IDLE(空闲), 1=LOADING(加载中), 2=LOADED(已加载), 3=ERROR(错误)。',
    usage: `// 获取加载状态
const state = iconImage.getState();

const stateNames = ['IDLE', 'LOADING', 'LOADED', 'ERROR'];
console.log('当前状态:', stateNames[state]);

// 检查是否已加载
if (state === 2) {
  console.log('图像已加载完成');
}`,
    params: [],
    returns: { type: 'number', description: '加载状态：0=IDLE, 1=LOADING, 2=LOADED, 3=ERROR' }
  },
  {
    name: 'getOrigin',
    cn: '获取原点',
    type: 'method',
    category: 'getter',
    description: '获取精灵图中的原点坐标（当使用精灵图时）。',
    usage: `// 获取精灵图原点
const origin = iconImage.getOrigin();
console.log('精灵图原点:', origin); // [x, y] 或 null`,
    params: [],
    returns: { type: 'Array<number>|null', description: '原点坐标 [x, y] 或 null' }
  },
  {
    name: 'getSize',
    cn: '获取尺寸',
    type: 'method',
    category: 'getter',
    description: '获取图像或精灵图切片的尺寸。',
    usage: `// 获取图像尺寸
const size = iconImage.getSize();
if (size) {
  console.log('图像宽度:', size[0]);
  console.log('图像高度:', size[1]);
}`,
    params: [],
    returns: { type: 'Size|undefined', description: '尺寸 [width, height]' }
  },
  {
    name: 'listenImageChange',
    cn: '监听图像变更',
    type: 'method',
    category: 'state',
    description: '监听底层图像的变更事件。',
    usage: `// 监听图像变更
const listener = iconImage.listenImageChange(() => {
  console.log('图像发生变更');

  // 检查状态
  const state = iconImage.getState();
  if (state === 2) {
    console.log('图像加载完成');
  }
});

// 取消监听
iconImage.unlistenImageChange(listener);`,
    params: [],
    returns: { type: 'EventsKey', description: '事件键，用于取消监听' }
  },
  {
    name: 'unlistenImageChange',
    cn: '取消监听图像变更',
    type: 'method',
    category: 'state',
    description: '取消监听底层图像的变更事件。',
    usage: `// 取消监听
iconImage.unlistenImageChange(listener);`,
    params: [
      { name: 'listener', type: 'EventsKey', default: 'undefined', description: '要取消的监听键' }
    ],
    returns: { type: 'void', description: '无返回值' }
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

  .api-description {
    margin-bottom: 20px;
    padding: 12px 16px;
    background: #f8f9fa;
    border-left: 4px solid #409eff;
    border-radius: 4px;
    color: #333;
    line-height: 1.6;
  }

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
