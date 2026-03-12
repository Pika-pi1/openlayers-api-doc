<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>ImageStyle - 图像样式基类 API</h2>
            <p class="description">
              ImageStyle 是一个基类，用于创建图像样式子类（如 Icon、CircleStyle、RegularShape）。
              它提供了图像符号化的通用属性和方法，如透明度、旋转、缩放、位移等。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_style_Image-ImageStyle.html" target="_blank">
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
  activeNames.value = isAllExpanded.value ? imageStyleApis.map(api => api.name) : []
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
    { name: 'all', cn: '全部', count: imageStyleApis.length },
    { name: 'getter', cn: '获取方法', count: imageStyleApis.filter(a => a.category === 'getter').length },
    { name: 'setter', cn: '设置方法', count: imageStyleApis.filter(a => a.category === 'setter').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return imageStyleApis
  return imageStyleApis.filter(a => a.category === currentCategory.value)
})

const imageStyleApis = [
  {
    name: 'getOpacity',
    cn: '获取透明度',
    type: 'method',
    category: 'getter',
    description: '获取符号的透明度值。',
    usage: `// 获取透明度
const opacity = imageStyle.getOpacity();
console.log('当前透明度:', opacity); // 0-1 之间`,
    params: [],
    returns: { type: 'number', description: '透明度值 (0-1)' }
  },
  {
    name: 'getRotateWithView',
    cn: '获取是否随视图旋转',
    type: 'method',
    category: 'getter',
    description: '判断符号是否会随地图视图旋转。',
    usage: `// 检查是否随视图旋转
const rotateWithView = imageStyle.getRotateWithView();
console.log('是否随视图旋转:', rotateWithView); // true/false`,
    params: [],
    returns: { type: 'boolean', description: '是否随视图旋转' }
  },
  {
    name: 'getRotation',
    cn: '获取旋转角度',
    type: 'method',
    category: 'getter',
    description: '获取符号的旋转角度（弧度）。',
    usage: `// 获取旋转角度
const rotation = imageStyle.getRotation();
console.log('旋转角度 (弧度):', rotation);

// 转换为角度
const degrees = rotation * 180 / Math.PI;
console.log('旋转角度 (度):', degrees);`,
    params: [],
    returns: { type: 'number', description: '旋转角度（弧度，顺时针为正）' }
  },
  {
    name: 'getScale',
    cn: '获取缩放比例',
    type: 'method',
    category: 'getter',
    description: '获取符号的缩放比例。',
    usage: `// 获取缩放比例
const scale = imageStyle.getScale();
console.log('当前缩放比例:', scale);

// 如果是 Size 类型，分别获取
if (Array.isArray(scale)) {
  console.log('X 缩放:', scale[0], 'Y 缩放:', scale[1]);
}`,
    params: [],
    returns: { type: 'number|Size', description: '缩放比例或 [scaleX, scaleY] 数组' }
  },
  {
    name: 'getDisplacement',
    cn: '获取位移',
    type: 'method',
    category: 'getter',
    description: '获取符号的位移值（像素）。',
    usage: `// 获取位移
const displacement = imageStyle.getDisplacement();
console.log('位移:', displacement); // [dx, dy]

// 获取 X 和 Y 方向的位移
const dx = displacement[0];
const dy = displacement[1];`,
    params: [],
    returns: { type: 'Array<number>', description: '位移数组 [x, y]，单位像素' }
  },
  {
    name: 'getDeclutterMode',
    cn: '获取去 clutter 模式',
    type: 'method',
    category: 'getter',
    description: '获取符号的去 clutter 模式。用于控制符号在密集区域的显示策略。',
    usage: `// 获取去 clutter 模式
const declutterMode = imageStyle.getDeclutterMode();
console.log('去 clutter 模式:', declutterMode);
// 可能的值：'declutter', 'obstacle', 'none'`,
    params: [],
    returns: { type: 'string', description: '去 clutter 模式：declutter, obstacle, none' }
  },
  {
    name: 'setOpacity',
    cn: '设置透明度',
    type: 'method',
    category: 'setter',
    description: '设置符号的透明度。',
    usage: `// 设置半透明
imageStyle.setOpacity(0.5);

// 设置完全透明
imageStyle.setOpacity(0);

// 设置不透明
imageStyle.setOpacity(1);`,
    params: [
      { name: 'opacity', type: 'number', default: 'undefined', description: '透明度值 (0-1)' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'setRotateWithView',
    cn: '设置是否随视图旋转',
    type: 'method',
    category: 'setter',
    description: '设置符号是否随地图视图旋转。',
    usage: `// 设置随视图旋转
imageStyle.setRotateWithView(true);

// 设置固定方向（不随视图旋转）
imageStyle.setRotateWithView(false);`,
    params: [
      { name: 'rotateWithView', type: 'boolean', default: 'undefined', description: '是否随视图旋转' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'setRotation',
    cn: '设置旋转角度',
    type: 'method',
    category: 'setter',
    description: '设置符号的旋转角度（弧度，顺时针为正）。',
    usage: `// 设置 90 度旋转
imageStyle.setRotation(Math.PI / 2);

// 设置 180 度旋转
imageStyle.setRotation(Math.PI);

// 设置 45 度旋转
imageStyle.setRotation(Math.PI / 4);`,
    params: [
      { name: 'rotation', type: 'number', default: 'undefined', description: '旋转角度（弧度）' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'setScale',
    cn: '设置缩放比例',
    type: 'method',
    category: 'setter',
    description: '设置符号的缩放比例。',
    usage: `// 设置统一缩放
imageStyle.setScale(2);  // 放大 2 倍

// 设置 X/Y 方向不同缩放
imageStyle.setScale([2, 1]);  // X 方向放大 2 倍，Y 方向不变

// 设置缩小
imageStyle.setScale(0.5);  // 缩小一半`,
    params: [
      { name: 'scale', type: 'number|Size', default: 'undefined', description: '缩放比例或 [scaleX, scaleY]' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'setDisplacement',
    cn: '设置位移',
    type: 'method',
    category: 'setter',
    description: '设置符号的位移（像素）。正值向右和向上移动。',
    usage: `// 向右上方移动
imageStyle.setDisplacement([10, 10]);

// 向左下方移动
imageStyle.setDisplacement([-10, -10]);

// 重置位移
imageStyle.setDisplacement([0, 0]);`,
    params: [
      { name: 'displacement', type: 'Array<number>', default: 'undefined', description: '位移数组 [x, y]，单位像素' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'clone',
    cn: '克隆',
    type: 'method',
    category: 'getter',
    description: '克隆图像样式对象。返回一个新的样式实例，具有相同的属性。',
    usage: `// 克隆样式
const clonedStyle = imageStyle.clone();

// 修改克隆的样式不影响原样式
clonedStyle.setOpacity(0.5);
console.log('原样式透明度:', imageStyle.getOpacity());
console.log('克隆样式透明度:', clonedStyle.getOpacity());`,
    params: [],
    returns: { type: 'ImageStyle', description: '克隆的图像样式对象' }
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
