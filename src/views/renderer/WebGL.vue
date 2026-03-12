<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>WebGL Renderer - WebGL 渲染器 API</h2>
            <p class="description">
              WebGL Layer Renderer 是 OpenLayers 中所有 WebGL 图层渲染器的基类。
              它提供了 WebGL 渲染的通用功能和属性，如 WebGL 辅助对象、后处理效果、Uniform 管理等。
              所有 WebGL 图层类型（WebGLTileLayer、WebGLVectorLayer 等）都继承自此类。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_renderer_webgl_Layer-WebGLLayerRenderer.html" target="_blank">
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
import { Folder, FolderOpened, Operation, Reading, Document, Select, Link } from '@element-plus/icons-vue'

const activeNames = ref(['helper', 'constructor'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? webglRendererApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'constructor': 'primary',
    'property': 'warning',
    'method': 'primary'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: webglRendererApis.length },
    { name: 'constructor', cn: '构造函数', count: webglRendererApis.filter(a => a.type === 'constructor').length },
    { name: 'property', cn: '属性', count: webglRendererApis.filter(a => a.type === 'property').length },
    { name: 'method', count: webglRendererApis.filter(a => a.type === 'method').length, cn: '方法' }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return webglRendererApis
  return webglRendererApis.filter(a => a.category === currentCategory.value)
})

const webglRendererApis = [
  {
    name: 'constructor',
    cn: '构造函数',
    type: 'constructor',
    category: 'constructor',
    description: '创建一个新的 WebGL 图层渲染器实例。WebGL Layer Renderer 是所有 WebGL 图层渲染器的基类。',
    usage: `import WebGLTileLayer from 'ol/layer/WebGLTile.js';

// 创建 WebGL 图层（自动使用 WebGL 渲染器）
const webglLayer = new WebGLTileLayer({
  source: yourTileSource,
  style: {
    variables: {
      brightness: 1.2,
      contrast: 1.1
    },
    color: ['array', ['*', ['var', 'brightness'], ['band', 1]], 1, 1, 1, 1]
  }
});

// 获取渲染器
const renderer = webglLayer.getRenderer();
console.log('WebGL 渲染器:', renderer);`,
    params: [
      { name: 'layer', type: 'import("../../layer/Layer.js").default', default: 'undefined', description: '要渲染的图层' },
      { name: 'options', type: 'Options', default: 'undefined', description: '配置选项（可选）' }
    ],
    returns: { type: 'WebGLLayerRenderer', description: '新的 WebGL 图层渲染器实例' }
  },
  {
    name: 'helper',
    cn: 'WebGL 辅助对象',
    type: 'property',
    category: 'property',
    description: 'WebGL 辅助对象，提供 WebGL 上下文管理、着色器编译、缓冲区管理等工具函数。',
    usage: `// 获取 WebGL 辅助对象
const renderer = layer.getRenderer();
if (renderer && renderer.helper) {
  const helper = renderer.helper;
  console.log('WebGL 辅助对象:', helper);

  // 获取 WebGL 上下文
  const gl = helper.getGL();
  console.log('WebGL 上下文:', gl);
}`,
    returns: { type: 'WebGLHelper', description: 'WebGL 辅助对象' }
  },
  {
    name: 'inversePixelTransform_',
    cn: '逆像素变换',
    type: 'property',
    category: 'property',
    description: '视口 CSS 像素到渲染像素的变换矩阵。仅在分派渲染事件前设置。',
    usage: `// 获取逆像素变换（内部属性，谨慎使用）
const renderer = layer.getRenderer();
if (renderer) {
  // 注意：这是私有属性，不建议直接访问
  // const transform = renderer.inversePixelTransform_;
}`,
    returns: { type: 'import("../../transform.js").Transform', description: '变换矩阵数组' }
  },
  {
    name: 'postProcesses_',
    cn: '后处理效果',
    type: 'property',
    category: 'property',
    description: '后处理效果定义数组。用于实现模糊、亮度、对比度等图像效果。',
    usage: `// 获取后处理效果（内部属性，谨慎使用）
const renderer = layer.getRenderer();
if (renderer) {
  // 注意：这是私有属性，不建议直接访问
  // const postProcesses = renderer.postProcesses_;
}`,
    returns: { type: 'Array<PostProcessesOptions>', description: '后处理效果数组' }
  },
  {
    name: 'uniforms_',
    cn: 'Uniform 变量',
    type: 'property',
    category: 'property',
    description: 'Uniform 变量定义对象。用于在着色器中访问的变量。',
    usage: `// 获取 Uniform 变量（内部属性，谨慎使用）
const renderer = layer.getRenderer();
if (renderer) {
  // 注意：这是私有属性，不建议直接访问
  // const uniforms = renderer.uniforms_;
}`,
    returns: { type: 'Object<string,import("../../webgl/Helper").UniformValue>', description: 'Uniform 变量对象' }
  },
  {
    name: 'reset',
    cn: '重置配置',
    type: 'method',
    category: 'method',
    description: '重置渲染器配置（仅处理 Uniform 变量）。用于更新 Uniform 定义。',
    usage: `// 重置 Uniform 配置
const renderer = layer.getRenderer();
if (renderer && typeof renderer.reset === 'function') {
  renderer.reset({
    uniforms: {
      'u_brightness': 1.2,
      'u_contrast': 1.1,
      'u_saturation': 1.0
    }
  });
}`,
    params: [
      { name: 'options', type: 'Options', default: 'undefined', description: '配置选项，包含 Uniform 定义' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'removeHelper',
    cn: '移除辅助对象',
    type: 'method',
    category: 'method',
    description: '移除 WebGL 辅助对象并清理相关资源。在渲染器销毁时调用。',
    usage: `// 移除辅助对象（通常在销毁时自动调用）
const renderer = layer.getRenderer();
if (renderer && typeof renderer.removeHelper === 'function') {
  renderer.removeHelper();
}`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'afterHelperCreated',
    cn: '辅助对象创建后',
    type: 'method',
    category: 'method',
    description: '在 WebGL 辅助对象创建后执行的回调函数。用于初始化 WebGL 资源。',
    usage: `// 辅助对象创建后的回调（通常由框架自动调用）
const renderer = layer.getRenderer();
if (renderer && typeof renderer.afterHelperCreated === 'function') {
  renderer.afterHelperCreated();
}`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'prepareFrameInternal',
    cn: '准备帧',
    type: 'method',
    category: 'method',
    description: '判断是否应该调用 renderFrame。检查图层是否准备好进行渲染。',
    usage: `// 检查图层是否准备好渲染
const renderer = layer.getRenderer();
if (renderer && typeof renderer.prepareFrameInternal === 'function') {
  const isReady = renderer.prepareFrameInternal(frameState);
  if (isReady) {
    console.log('图层准备好渲染');
  }
}`,
    params: [
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' }
    ],
    returns: { type: 'boolean', description: '图层是否准备好渲染' }
  },
  {
    name: 'clearCache',
    cn: '清除缓存',
    type: 'method',
    category: 'method',
    description: '清除渲染器缓存。用于释放内存或强制重新加载数据。',
    usage: `// 清除缓存
const renderer = layer.getRenderer();
if (renderer && typeof renderer.clearCache === 'function') {
  renderer.clearCache();
  console.log('缓存已清除');
}`,
    params: [],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'dispatchPreComposeEvent',
    cn: '分派合成前事件',
    type: 'method',
    category: 'method',
    description: '分派合成前事件（precompose）。在 WebGL 渲染前触发，可用于自定义渲染逻辑。',
    usage: `// 分派合成前事件
const renderer = layer.getRenderer();
if (renderer && typeof renderer.dispatchPreComposeEvent === 'function') {
  const gl = renderer.helper.getGL();
  renderer.dispatchPreComposeEvent(gl, frameState);
}`,
    params: [
      { name: 'context', type: 'WebGLRenderingContext', default: 'undefined', description: 'WebGL 渲染上下文' },
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'dispatchPostComposeEvent',
    cn: '分派合成后事件',
    type: 'method',
    category: 'method',
    description: '分派合成后事件（postcompose）。在 WebGL 渲染后触发，可用于后期处理或自定义效果。',
    usage: `// 分派合成后事件
const renderer = layer.getRenderer();
if (renderer && typeof renderer.dispatchPostComposeEvent === 'function') {
  const gl = renderer.helper.getGL();
  renderer.dispatchPostComposeEvent(gl, frameState);
}`,
    params: [
      { name: 'context', type: 'WebGLRenderingContext', default: 'undefined', description: 'WebGL 渲染上下文' },
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'preRender',
    cn: '渲染前',
    type: 'method',
    category: 'method',
    description: '在渲染前执行的操作。设置渲染状态并分派渲染事件。',
    usage: `// 渲染前处理
const renderer = layer.getRenderer();
if (renderer && typeof renderer.preRender === 'function') {
  const gl = renderer.helper.getGL();
  renderer.preRender(gl, frameState);
}`,
    params: [
      { name: 'context', type: 'WebGLRenderingContext', default: 'undefined', description: 'WebGL 渲染上下文' },
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'postRender',
    cn: '渲染后',
    type: 'method',
    category: 'method',
    description: '在渲染后执行的操作。清理渲染状态并分派渲染完成事件。',
    usage: `// 渲染后处理
const renderer = layer.getRenderer();
if (renderer && typeof renderer.postRender === 'function') {
  const gl = renderer.helper.getGL();
  renderer.postRender(gl, frameState);
}`,
    params: [
      { name: 'context', type: 'WebGLRenderingContext', default: 'undefined', description: 'WebGL 渲染上下文' },
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' }
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
