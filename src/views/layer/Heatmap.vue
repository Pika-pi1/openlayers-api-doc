<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>HeatmapLayer - 热力图图层</h2>
            <p class="description">
              HeatmapLayer 用于创建热力图可视化效果。热力图使用颜色渐变显示点要素的密度分布，
              适合展示人口密度、气温分布、事件集中度等数据。支持权重设置、模糊度调整和自定义颜色渐变。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_layer_Heatmap-HeatmapLayer.html" target="_blank">
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
                    <el-table-column type="expand" width="50">
                      <template #default="scope">
                        <div v-if="scope.row.children && scope.row.children.length" class="children-params">
                          <el-table :data="scope.row.children" size="small" border class="children-table">
                            <el-table-column prop="name" label="子参数" width="200">
                              <template #default="child">
                                <code class="child-param-name">{{ child.row.name }}</code>
                              </template>
                            </el-table-column>
                            <el-table-column prop="type" label="类型" width="180">
                              <template #default="child">
                                <el-tag
                                  v-if="hasRoute(child.row.type)"
                                  size="small"
                                  type="primary"
                                  effect="plain"
                                  class="clickable-type"
                                  @click.stop="navigateToRoute(getRoute(child.row.type))"
                                >
                                  {{ child.row.type }}
                                </el-tag>
                                <el-tag v-else size="small" type="info">
                                  {{ child.row.type }}
                                </el-tag>
                              </template>
                            </el-table-column>
                            <el-table-column prop="default" label="默认值" width="140">
                              <template #default="child">
                                <span v-if="child.row.default" class="default-value">{{ child.row.default }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="description" label="说明" />
                          </el-table>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" label="参数名" width="180">
                      <template #default="scope">
                        <code class="param-name">{{ scope.row.name }}</code>
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="160">
                      <template #default="scope">
                        <el-tag
                          v-if="hasRoute(scope.row.type)"
                          size="small"
                          type="primary"
                          effect="plain"
                          class="clickable-type"
                          @click.stop="navigateToRoute(getRoute(scope.row.type))"
                        >
                          {{ scope.row.type }}
                        </el-tag>
                        <el-tag v-else size="small" type="info">
                          {{ scope.row.type }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="default" label="默认值" width="120">
                      <template #default="scope">
                        <span v-if="scope.row.default" class="default-value">{{ scope.row.default }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="description" label="说明" />
                  </el-table>
                </div>
                <div v-if="api.returns" class="api-section returns-section">
                  <div class="section-header">
                    <el-icon class="section-icon returns-icon"><CircleCheck /></el-icon>
                    <h4>返回值</h4>
                  </div>
                  <div class="return-content">
                    <el-tag size="small" type="success">{{ api.returns.type }}</el-tag>
                    <span class="return-desc">{{ api.returns.description }}</span>
                  </div>
                </div>
                <div v-if="api.usage" class="api-section usage-section">
                  <div class="section-header">
                    <el-icon class="section-icon usage-icon"><Document /></el-icon>
                    <h4>使用示例</h4>
                  </div>
                  <div class="usage-code" v-html="highlightCode(api.usage)"></div>
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Folder, FolderOpened, Operation, CircleCheck, Link, Document } from '@element-plus/icons-vue'
import { getRoute, hasRoute } from '@/utils/apiRoutes'

const router = useRouter()

const activeNames = ref([])
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? apiData.map(api => api.name) : []
}

const currentCategory = ref('all')
const categories = reactive([
  { name: 'all', cn: '全部', count: 0 },
  { name: 'constructor', cn: '构造函数', count: 0 },
  { name: 'method', cn: '方法', count: 0 },
  { name: 'property', cn: '属性', count: 0 }
])

const filterByCategory = (category) => {
  currentCategory.value = category
}

const apiData = [
  {
    name: 'HeatmapLayer',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的热力图图层。热力图使用颜色渐变显示点要素的密度分布。',
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '配置选项对象',
        children: [
          { name: 'className', type: 'string', default: "'ol-layer'", description: 'CSS 类名' },
          { name: 'opacity', type: 'number', default: '1', description: '图层透明度' },
          { name: 'visible', type: 'boolean', default: 'true', description: '是否可见' },
          { name: 'extent', type: 'Extent', default: undefined, description: '图层范围' },
          { name: 'minResolution', type: 'number', default: undefined, description: '最小分辨率' },
          { name: 'maxResolution', type: 'number', default: undefined, description: '最大分辨率' },
          { name: 'minZoom', type: 'number', default: undefined, description: '最小缩放级别' },
          { name: 'maxZoom', type: 'number', default: undefined, description: '最大缩放级别' },
          { name: 'source', type: 'VectorSource', default: undefined, description: '数据源' },
          { name: 'blur', type: 'number', default: '15', description: '模糊半径（像素）' },
          { name: 'radius', type: 'number', default: '8', description: '热力图半径（像素）' },
          { name: 'intensity', type: 'number', default: '0.05', description: '强度值' },
          { name: 'gradient', type: 'Array<string>', default: undefined, description: '颜色渐变数组' },
          { name: 'weight', type: 'string|Function', default: "'weight'", description: '权重字段名或函数' }
        ]
      }
    ],
    usage: `// ============================================
// HeatmapLayer 构造函数使用示例
// ============================================

import HeatmapLayer from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { Point } from 'ol/geom'

// 【示例 1】基础热力图
const heatmapLayer = new HeatmapLayer({
  source: vectorSource,
  blur: 15,
  radius: 8
})

// 【示例 2】自定义颜色渐变
const heatmapLayer = new HeatmapLayer({
  source: vectorSource,
  gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],
  blur: 20,
  radius: 10
})

// 【示例 3】带权重的热力图
const heatmapLayer = new HeatmapLayer({
  source: vectorSource,
  weight: 'population',  // 使用 population 字段作为权重
  blur: 15,
  radius: 12,
  intensity: 0.1
})

// 【示例 4】动态权重函数
const heatmapLayer = new HeatmapLayer({
  source: vectorSource,
  weight: (feature) => {
    return feature.get('magnitude') / 100  // 归一化权重
  },
  gradient: ['rgba(0,0,255,0)', 'rgba(0,255,0,0.5)', 'rgba(255,0,0,1)']
})

// 【示例 5】完整配置
const heatmapLayer = new HeatmapLayer({
  source: new VectorSource({
    features: cityFeatures
  }),
  blur: 25,
  radius: 15,
  intensity: 0.08,
  gradient: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
  weight: 'population',
  opacity: 0.8,
  visible: true
})`
  },
  {
    name: 'getBlur',
    cn: '获取模糊半径',
    type: 'method',
    category: 'method',
    description: '获取热力图的模糊半径（像素）。',
    returns: { type: 'number', description: '模糊半径' },
    usage: `// 【示例】获取模糊半径
const blur = heatmapLayer.getBlur()
console.log('当前模糊半径:', blur)`
  },
  {
    name: 'setBlur',
    cn: '设置模糊半径',
    type: 'method',
    category: 'method',
    description: '设置热力图的模糊半径。',
    params: [
      { name: 'blur', type: 'number', default: undefined, description: '模糊半径（像素）' }
    ],
    usage: `// 【示例】设置模糊半径
heatmapLayer.setBlur(20)
// 热力图会变得更模糊`
  },
  {
    name: 'getRadius',
    cn: '获取热力图半径',
    type: 'method',
    category: 'method',
    description: '获取热力图的半径（像素）。',
    returns: { type: 'number', description: '热力图半径' },
    usage: `// 【示例】获取热力图半径
const radius = heatmapLayer.getRadius()
console.log('当前热力图半径:', radius)`
  },
  {
    name: 'setRadius',
    cn: '设置热力图半径',
    type: 'method',
    category: 'method',
    description: '设置热力图的半径。',
    params: [
      { name: 'radius', type: 'number', default: undefined, description: '热力图半径（像素）' }
    ],
    usage: `// 【示例】设置热力图半径
heatmapLayer.setRadius(12)
// 每个点的影响范围会变大`
  },
  {
    name: 'getIntensity',
    cn: '获取强度值',
    type: 'method',
    category: 'method',
    description: '获取热力图的强度值。',
    returns: { type: 'number', description: '强度值（0-1）' },
    usage: `// 【示例】获取强度值
const intensity = heatmapLayer.getIntensity()
console.log('当前强度:', intensity)`
  },
  {
    name: 'setIntensity',
    cn: '设置强度值',
    type: 'method',
    category: 'method',
    description: '设置热力图的强度值。',
    params: [
      { name: 'intensity', type: 'number', default: undefined, description: '强度值（0-1）' }
    ],
    usage: `// 【示例】设置强度值
heatmapLayer.setIntensity(0.1)
// 热力图颜色会变得更鲜艳`
  },
  {
    name: 'getGradient',
    cn: '获取颜色渐变',
    type: 'method',
    category: 'method',
    description: '获取热力图的颜色渐变数组。',
    returns: { type: 'Array<string>', description: '颜色数组' },
    usage: `// 【示例】获取颜色渐变
const gradient = heatmapLayer.getGradient()
console.log('当前渐变:', gradient)`
  },
  {
    name: 'setGradient',
    cn: '设置颜色渐变',
    type: 'method',
    category: 'method',
    description: '设置热力图的颜色渐变。',
    params: [
      { name: 'gradient', type: 'Array<string>', default: undefined, description: '颜色数组' }
    ],
    usage: `// 【示例】设置颜色渐变
heatmapLayer.setGradient([
  'rgba(0,0,255,0)',    // 透明蓝色（低密度）
  'rgba(0,255,0,0.5)',  // 半透明绿色（中密度）
  'rgba(255,255,0,0.8)', // 黄色（较高密度）
  'rgba(255,0,0,1)'     // 红色（高密度）
])`
  },
  {
    name: 'getSource',
    cn: '获取数据源',
    type: 'method',
    category: 'method',
    description: '获取热力图的数据源。',
    returns: { type: 'VectorSource', description: '矢量数据源' },
    usage: `// 【示例】获取数据源
const source = heatmapLayer.getSource()
console.log('要素数量:', source.getFeatures().length)`
  },
  {
    name: 'setSource',
    cn: '设置数据源',
    type: 'method',
    category: 'method',
    description: '设置热力图的数据源。',
    params: [
      { name: 'source', type: 'VectorSource', default: undefined, description: '矢量数据源' }
    ],
    usage: `// 【示例】切换数据源
heatmapLayer.setSource(newVectorSource)`
  },
  {
    name: 'blur',
    cn: '模糊半径属性',
    type: 'property',
    category: 'property',
    description: '热力图的模糊半径，默认值为 15 像素。值越大，热力图越模糊。',
    usage: `// 【示例】通过属性设置
heatmapLayer.set('blur', 25)`
  },
  {
    name: 'radius',
    cn: '热力图半径属性',
    type: 'property',
    category: 'property',
    description: '热力图的半径，默认值为 8 像素。值越大，每个点的影响范围越广。',
    usage: `// 【示例】通过属性设置
heatmapLayer.set('radius', 15)`
  },
  {
    name: 'intensity',
    cn: '强度属性',
    type: 'property',
    category: 'property',
    description: '热力图的强度值，默认值为 0.05。值越大，颜色越鲜艳。',
    usage: `// 【示例】通过属性设置
heatmapLayer.set('intensity', 0.1)`
  },
  {
    name: 'gradient',
    cn: '渐变属性',
    type: 'property',
    category: 'property',
    description: '热力图的颜色渐变数组。',
    usage: `// 【示例】通过属性设置
heatmapLayer.set('gradient', ['#00f', '#0ff', '#0f0', '#ff0', '#f00'])`
  }
]

categories.forEach(cat => {
  if (cat.name === 'all') {
    cat.count = apiData.length
  } else {
    cat.count = apiData.filter(api => api.category === cat.name).length
  }
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') {
    return apiData
  }
  return apiData.filter(api => api.category === currentCategory.value)
})

const getTagType = (type) => {
  const typeMap = {
    constructor: 'danger',
    method: 'primary',
    property: 'success',
    event: 'warning'
  }
  return typeMap[type] || 'info'
}

const highlightCode = (code) => {
  return code
    .replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>')
    .replace(/\b(import|from|const|let|var|function|return|if|else|for|while|new|async|await)\b/g, '<span class="code-keyword">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span class="code-literal">$1</span>')
    .replace(/'[^']*'/g, '<span class="code-string">$&</span>')
    .replace(/"[^"]*"/g, '<span class="code-string">$&</span>')
}

const navigateToRoute = (route) => {
  if (route) {
    router.push(route)
  }
}
</script>

<style lang="scss" scoped>
.api-page-container {
  display: flex;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  gap: 20px;
}

.page-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.doc-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;

  .title-section {
    flex: 1;

    h2 {
      margin: 0 0 12px 0;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .description {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }

    .official-links {
      display: flex;
      gap: 12px;
    }
  }

  .control-section {
    margin-left: 20px;
  }
}

.api-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .category-tag {
    cursor: pointer;
    padding: 6px 16px;
    font-size: 13px;
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.api-list {
  .el-collapse {
    border: none;
    background: transparent;

    :deep(.el-collapse-item__header) {
      border: none;
      background: #f8f9fa;
      margin-bottom: 8px;
      border-radius: 8px;
      padding: 12px 16px;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: #e9ecef;
      }

      &.is-active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: #fff;
      }
    }

    :deep(.el-collapse-item__content) {
      padding: 16px;
      background: #fff;
      border-radius: 8px;
      margin-top: 4px;
    }
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
    flex: 1;

    .api-name {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }

    .api-cn {
      color: #666;
      font-size: 14px;
    }
  }
}

.api-content {
  .api-description {
    margin-bottom: 20px;
    padding: 12px 16px;
    background: #f8f9fa;
    border-left: 4px solid #667eea;
    border-radius: 4px;
    color: #333;
    line-height: 1.6;
  }

  .api-section {
    margin-top: 20px;
    padding: 16px;
    border-radius: 8px;

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .section-icon {
        font-size: 18px;

        &.params-icon {
          color: #409eff;
        }

        &.returns-icon {
          color: #67c23a;
        }

        &.usage-icon {
          color: #909399;
        }
      }

      h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #333;
      }
    }
  }

  .returns-section {
    background: #f0f9ff;
    border: 1px solid #e1f3d8;

    .return-content {
      display: flex;
      align-items: center;
      gap: 12px;

      .return-desc {
        color: #666;
        font-size: 14px;
      }
    }
  }

  .usage-section {
    background: #f5f7fa;
    border: 1px solid #e4e7ed;

    .usage-code {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;

      :deep(.code-comment) {
        color: #6a9955;
      }

      :deep(.code-keyword) {
        color: #569cd6;
      }

      :deep(.code-literal) {
        color: #569cd6;
      }

      :deep(.code-string) {
        color: #ce9178;
      }
    }
  }
}

.api-table {
  :deep(.el-table__header th) {
    background: #f5f7fa;
    font-weight: 600;
  }

  .param-name,
  .child-param-name {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    color: #409eff;
  }

  .default-value {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    color: #67c23a;
  }
}

.children-params {
  padding: 12px;
  background: #fafafa;

  .children-table {
    :deep(.el-table__header th) {
      background: #eee;
    }
  }
}

// 可点击的类型标签
.clickable-type {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #409eff;
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  }
}
</style>
