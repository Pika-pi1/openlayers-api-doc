<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>VectorImageLayer - 矢量图像图层</h2>
            <p class="description">
              VectorImageLayer 将矢量数据渲染为图像。矢量数据在客户端渲染，但输出为图像格式，
              在平移和缩放时提供极佳的渲染性能，适合大数据量的矢量显示场景。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_layer_VectorImage-VectorImageLayer.html" target="_blank">
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
import { Folder, FolderOpened, Operation, Link, Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
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
  { name: 'methods', cn: '方法', count: 0 },
  { name: 'events', cn: '事件', count: 0 }
])

const filterByCategory = (category) => {
  currentCategory.value = category
}

const apiData = [
  {
    name: 'VectorImageLayer',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的矢量图像图层。矢量图像图层将矢量数据渲染为图像，提供极佳的平移和缩放性能。',
    params: [
      {
        name: 'options',
        type: 'Object',
        default: '{}',
        description: '配置选项对象',
        children: [
          { name: 'className', type: 'string', default: "'ol-layer'", description: 'CSS 类名' },
          { name: 'opacity', type: 'number', default: '1', description: '透明度 (0-1)' },
          { name: 'visible', type: 'boolean', default: 'true', description: '可见性' },
          { name: 'extent', type: 'Extent', default: undefined, description: '渲染边界范围' },
          { name: 'zIndex', type: 'number', default: undefined, description: '渲染层级' },
          { name: 'minResolution', type: 'number', default: undefined, description: '最小分辨率' },
          { name: 'maxResolution', type: 'number', default: undefined, description: '最大分辨率' },
          { name: 'minZoom', type: 'number', default: undefined, description: '最小缩放级别' },
          { name: 'maxZoom', type: 'number', default: undefined, description: '最大缩放级别' },
          { name: 'renderOrder', type: 'Function', default: undefined, description: '渲染排序函数' },
          { name: 'renderBuffer', type: 'number', default: '100', description: '渲染缓冲区大小 (像素)' },
          { name: 'source', type: 'VectorSource', default: undefined, description: '矢量数据源' },
          { name: 'map', type: 'Map', default: undefined, description: '关联地图' },
          { name: 'declutter', type: 'boolean', default: 'false', description: '是否整理图像和文本' },
          { name: 'style', type: 'StyleLike', default: undefined, description: '图层样式' },
          { name: 'background', type: 'BackgroundColor', default: undefined, description: '背景色' },
          { name: 'imageRatio', type: 'number', default: '1', description: '画布与屏幕的比率（>1 提高质量，<1 提高性能）' },
          { name: 'properties', type: 'Object', default: undefined, description: '可观察属性' }
        ]
      }
    ],
    usage: `// ============================================
// VectorImageLayer 构造函数使用示例
// ============================================

import VectorImageLayer from 'ol/layer/VectorImage'
import VectorSource from 'ol/source/Vector'

// 【示例 1】基础用法
const vectorImageLayer = new VectorImageLayer({
  source: new VectorSource()
})

// 【示例 2】完整配置
const vectorImageLayer = new VectorImageLayer({
  className: 'my-vector-image-layer',
  opacity: 0.8,
  visible: true,
  extent: [115, 39, 117, 41],
  zIndex: 10,
  minZoom: 5,
  maxZoom: 18,
  source: new VectorSource({
    url: 'data/features.geojson',
    format: new GeoJSON()
  }),
  declutter: true,
  style: myStyleFunction,
  imageRatio: 1.5  // 高质量渲染
})

// 【示例 3】性能优化配置
const vectorImageLayer = new VectorImageLayer({
  source: largeVectorSource,
  imageRatio: 0.8,  // 降低质量提高性能
  renderBuffer: 50  // 减小缓冲区
})`
  },
  {
    name: 'getFeatures',
    cn: '获取要素',
    type: 'method',
    category: 'methods',
    description: '获取与给定像素相交的最顶层要素。返回一个 Promise。',
    params: [
      { name: 'pixel', type: 'Pixel', default: undefined, description: '像素坐标 [x, y]' }
    ],
    returns: { type: 'Promise<Array<FeatureLike>>', description: 'Promise，解析为要素数组' },
    usage: `// ============================================
// getFeatures 方法使用示例
// ============================================

// 【示例 1】点击获取要素
map.on('click', async (event) => {
  const features = await vectorImageLayer.getFeatures(event.pixel)
  if (features.length > 0) {
    console.log('点击到的要素:', features[0])
  }
})

// 【示例 2】悬停效果
map.on('pointermove', async (event) => {
  const features = await vectorImageLayer.getFeatures(event.pixel)
  map.getTargetElement().style.cursor = features.length > 0 ? 'pointer' : ''
})`
  },
  {
    name: 'getSource',
    cn: '获取数据源',
    type: 'method',
    category: 'methods',
    description: '获取图层的矢量数据源。',
    returns: { type: 'VectorSource|null', description: '矢量数据源对象' },
    usage: `// 【示例】获取数据源
const source = vectorImageLayer.getSource()
source.addFeature(myFeature)`
  },
  {
    name: 'setSource',
    cn: '设置数据源',
    type: 'method',
    category: 'methods',
    description: '设置图层的矢量数据源。',
    params: [
      { name: 'source', type: 'VectorSource', default: undefined, description: '矢量数据源对象' }
    ],
    usage: `// 【示例】设置数据源
vectorImageLayer.setSource(new VectorSource({
  url: 'data/new-data.geojson',
  format: new GeoJSON()
}))`
  },
  {
    name: 'getStyle',
    cn: '获取样式',
    type: 'method',
    category: 'methods',
    description: '获取要素的样式。',
    returns: { type: 'StyleLike|null|undefined', description: '样式对象、数组或函数' },
    usage: `// 【示例】获取样式
const style = vectorImageLayer.getStyle()`
  },
  {
    name: 'setStyle',
    cn: '设置样式',
    type: 'method',
    category: 'methods',
    description: '设置要素的样式。',
    params: [
      { name: 'style', type: 'StyleLike', default: undefined, description: '样式对象、数组或函数' }
    ],
    usage: `// 【示例】设置样式
vectorImageLayer.setStyle(new Style({
  image: new Circle({
    radius: 5,
    fill: new Fill({ color: 'red' })
  })
}))`
  },
  {
    name: 'getImageRatio',
    cn: '获取图像比率',
    type: 'method',
    category: 'methods',
    description: '获取画布与屏幕的比率。',
    returns: { type: 'number', description: '图像比率值' },
    usage: `// 【示例】获取图像比率
const ratio = vectorImageLayer.getImageRatio()
console.log('图像比率:', ratio)`
  },
  {
    name: 'setImageRatio',
    cn: '设置图像比率',
    type: 'method',
    category: 'methods',
    description: '设置画布与屏幕的比率。比率 >1 提高质量，<1 提高性能。',
    params: [
      { name: 'ratio', type: 'number', default: undefined, description: '图像比率值' }
    ],
    usage: `// ============================================
// setImageRatio 方法使用示例
// ============================================

// 【示例 1】高质量模式
vectorImageLayer.setImageRatio(2)  // 2 倍分辨率

// 【示例 2】性能模式
vectorImageLayer.setImageRatio(0.5)  // 半分辨率

// 【示例 3】根据设备动态调整
const isHighDPI = window.devicePixelRatio > 1
vectorImageLayer.setImageRatio(isHighDPI ? 1.5 : 0.8)`
  },
  {
    name: 'getExtent',
    cn: '获取范围',
    type: 'method',
    category: 'methods',
    description: '返回图层的渲染范围。',
    returns: { type: 'Extent|undefined', description: '范围数组' },
    usage: `// 【示例】获取范围
const extent = vectorImageLayer.getExtent()`
  },
  {
    name: 'setExtent',
    cn: '设置范围',
    type: 'method',
    category: 'methods',
    description: '设置图层可见的范围。',
    params: [
      { name: 'extent', type: 'Extent', default: undefined, description: '范围数组' }
    ],
    usage: `// 【示例】设置范围
vectorImageLayer.setExtent([115, 39, 117, 41])`
  },
  {
    name: 'getOpacity',
    cn: '获取透明度',
    type: 'method',
    category: 'methods',
    description: '返回图层的透明度。',
    returns: { type: 'number', description: '透明度值 (0-1)' },
    usage: `// 【示例】获取透明度
const opacity = vectorImageLayer.getOpacity()`
  },
  {
    name: 'setOpacity',
    cn: '设置透明度',
    type: 'method',
    category: 'methods',
    description: '设置图层的透明度。',
    params: [
      { name: 'opacity', type: 'number', default: undefined, description: '透明度值 (0-1)' }
    ],
    usage: `// 【示例】设置透明度
vectorImageLayer.setOpacity(0.5)  // 50% 透明`
  },
  {
    name: 'getVisible',
    cn: '获取可见性',
    type: 'method',
    category: 'methods',
    description: '返回图层的可见性。',
    returns: { type: 'boolean', description: '是否可见' },
    usage: `// 【示例】获取可见性
const visible = vectorImageLayer.getVisible()`
  },
  {
    name: 'setVisible',
    cn: '设置可见性',
    type: 'method',
    category: 'methods',
    description: '设置图层的可见性。',
    params: [
      { name: 'visible', type: 'boolean', default: undefined, description: '是否可见' }
    ],
    usage: `// 【示例】设置可见性
vectorImageLayer.setVisible(false)  // 隐藏图层`
  },
  {
    name: 'getZIndex',
    cn: '获取层级',
    type: 'method',
    category: 'methods',
    description: '返回图层的 Z-index。',
    returns: { type: 'number|undefined', description: '层级值' },
    usage: `// 【示例】获取层级
const zIndex = vectorImageLayer.getZIndex()`
  },
  {
    name: 'setZIndex',
    cn: '设置层级',
    type: 'method',
    category: 'methods',
    description: '设置图层的 Z-index。',
    params: [
      { name: 'zIndex', type: 'number', default: undefined, description: '层级值' }
    ],
    usage: `// 【示例】设置层级
vectorImageLayer.setZIndex(100)  // 置顶显示`
  },
  {
    name: 'change:extent',
    cn: '范围变更事件',
    type: 'event',
    category: 'events',
    description: '当图层范围改变时触发。',
    usage: `// 【示例】监听范围变更
vectorImageLayer.on('change:extent', () => {
  console.log('图层范围已改变')
})`
  },
  {
    name: 'change:opacity',
    cn: '透明度变更事件',
    type: 'event',
    category: 'events',
    description: '当图层透明度改变时触发。',
    usage: `// 【示例】监听透明度变更
vectorImageLayer.on('change:opacity', () => {
  console.log('透明度:', vectorImageLayer.getOpacity())
})`
  },
  {
    name: 'change:source',
    cn: '数据源变更事件',
    type: 'event',
    category: 'events',
    description: '当图层数据源改变时触发。',
    usage: `// 【示例】监听数据源变更
vectorImageLayer.on('change:source', () => {
  console.log('数据源已改变')
})`
  },
  {
    name: 'change:visible',
    cn: '可见性变更事件',
    type: 'event',
    category: 'events',
    description: '当图层可见性改变时触发。',
    usage: `// 【示例】监听可见性变更
vectorImageLayer.on('change:visible', () => {
  console.log('可见性:', vectorImageLayer.getVisible())
})`
  },
  {
    name: 'prerender',
    cn: '渲染前事件',
    type: 'event',
    category: 'events',
    description: '在图层渲染前触发。',
    usage: `// 【示例】监听渲染前
vectorImageLayer.on('prerender', (event) => {
  console.log('开始渲染')
})`
  },
  {
    name: 'postrender',
    cn: '渲染后事件',
    type: 'event',
    category: 'events',
    description: '在图层渲染后触发。',
    usage: `// 【示例】监听渲染后
vectorImageLayer.on('postrender', (event) => {
  console.log('渲染完成')
})`
  },
  {
    name: 'sourceready',
    cn: '数据源就绪事件',
    type: 'event',
    category: 'events',
    description: '当数据源就绪时触发。',
    usage: `// 【示例】监听数据源就绪
vectorImageLayer.on('sourceready', () => {
  console.log('数据源已就绪')
})`
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

// 路由跳转
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
