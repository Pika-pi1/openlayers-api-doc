<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Canvas Renderer - 画布渲染器 API</h2>
            <p class="description">
              Canvas Layer Renderer 是 OpenLayers 中所有 Canvas 图层渲染器的基类。
              它提供了 Canvas 渲染的通用功能和属性，如容器管理、变换矩阵、渲染上下文等。
              所有 Canvas 图层类型（VectorLayer、TileLayer、ImageLayer 等）都继承自此类。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_renderer_canvas_Layer-CanvasLayerRenderer.html" target="_blank">
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

const activeNames = ref(['container', 'pixelTransform'])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? canvasRendererApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'property': 'warning',
    'method': 'primary'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: canvasRendererApis.length },
    { name: 'property', cn: '属性', count: canvasRendererApis.filter(a => a.type === 'property').length },
    { name: 'method', cn: '方法', count: canvasRendererApis.filter(a => a.type === 'method').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return canvasRendererApis
  return canvasRendererApis.filter(a => a.category === currentCategory.value)
})

const canvasRendererApis = [
  {
    name: 'container',
    cn: '容器元素',
    type: 'property',
    category: 'property',
    description: '用于渲染图层的 HTML 容器元素。这是图层内容将被渲染到的 DOM 元素。',
    usage: `// 获取图层渲染容器
const renderer = layer.getRenderer();
if (renderer && renderer.container) {
  const container = renderer.container;
  console.log('容器元素:', container);
  console.log('容器类名:', container.className);
}`,
    returns: { type: 'HTMLElement', description: '渲染容器元素' }
  },
  {
    name: 'renderedResolution',
    cn: '渲染分辨率',
    type: 'property',
    category: 'property',
    description: '当前渲染使用的分辨率值。用于判断图层是否需要重新渲染。',
    usage: `// 获取当前渲染分辨率
const renderer = layer.getRenderer();
if (renderer && renderer.renderedResolution) {
  console.log('渲染分辨率:', renderer.renderedResolution);

  // 与视图分辨率比较
  const viewResolution = view.getResolution();
  const needsRender = Math.abs(viewResolution - renderer.renderedResolution) > 0.1;
}`,
    returns: { type: 'number', description: '渲染分辨率' }
  },
  {
    name: 'pixelTransform',
    cn: '像素变换',
    type: 'property',
    category: 'property',
    description: '渲染像素到视口 CSS 像素的变换矩阵。在渲染帧时必须设置，渲染后可被其他函数使用。',
    usage: `// 获取像素变换矩阵
const renderer = layer.getRenderer();
if (renderer && renderer.pixelTransform) {
  const transform = renderer.pixelTransform;
  console.log('像素变换:', transform);

  // 变换坐标
  const cssPixel = transform.apply([renderPixelX, renderPixelY]);
}`,
    returns: { type: 'import("../../transform.js").Transform', description: '变换矩阵数组' }
  },
  {
    name: 'inversePixelTransform',
    cn: '逆像素变换',
    type: 'property',
    category: 'property',
    description: '视口 CSS 像素到渲染像素的变换矩阵。在渲染帧时必须设置，渲染后可被其他函数使用。',
    usage: `// 获取逆像素变换矩阵
const renderer = layer.getRenderer();
if (renderer && renderer.inversePixelTransform) {
  const transform = renderer.inversePixelTransform;
  console.log('逆像素变换:', transform);

  // 将 CSS 像素转换为渲染像素
  const renderPixel = transform.apply([cssPixelX, cssPixelY]);
}`,
    returns: { type: 'import("../../transform.js").Transform', description: '变换矩阵数组' }
  },
  {
    name: 'context',
    cn: '渲染上下文',
    type: 'property',
    category: 'property',
    description: 'Canvas 渲染上下文对象，用于实际的绘图操作。可能是 CanvasRenderingContext2D 或 OffscreenCanvasRenderingContext2D。',
    usage: `// 获取 Canvas 渲染上下文
const renderer = layer.getRenderer();
if (renderer && renderer.context) {
  const ctx = renderer.context;
  console.log('渲染上下文:', ctx);

  // 使用上下文绘图
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);
}`,
    returns: { type: 'CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D', description: 'Canvas 渲染上下文' }
  },
  {
    name: 'containerReused',
    cn: '容器复用',
    type: 'property',
    category: 'property',
    description: '标记容器是否从上一个渲染器复用。如果为 true，表示容器是从之前的渲染器继承的，而不是新创建的。',
    usage: `// 检查容器是否被复用
const renderer = layer.getRenderer();
if (renderer) {
  console.log('容器复用:', renderer.containerReused);

  if (renderer.containerReused) {
    console.log('容器是从上一个渲染器复用的');
  }
}`,
    returns: { type: 'boolean', description: '容器是否被复用' }
  },
  {
    name: 'frameState',
    cn: '帧状态',
    type: 'property',
    category: 'property',
    description: '当前渲染帧的状态对象。包含地图渲染所需的所有状态信息，如视图范围、分辨率、投影等。',
    usage: `// 获取当前帧状态
const renderer = layer.getRenderer();
if (renderer && renderer.frameState) {
  const frameState = renderer.frameState;
  console.log('视图范围:', frameState.extent);
  console.log('分辨率:', frameState.viewState.resolution);
  console.log('中心点:', frameState.viewState.center);
}`,
    returns: { type: 'import("../../Map.js").FrameState|null', description: '帧状态对象或 null' }
  },
  {
    name: 'getBackground',
    cn: '获取背景色',
    type: 'method',
    category: 'method',
    description: '获取图层的背景颜色。',
    usage: `// 获取背景色
const renderer = layer.getRenderer();
if (renderer && typeof renderer.getBackground === 'function') {
  const bgColor = renderer.getBackground(frameState);
  console.log('背景色:', bgColor);
}`,
    params: [
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' }
    ],
    returns: { type: 'string', description: '背景颜色值' }
  },
  {
    name: 'useContainer',
    cn: '使用容器',
    type: 'method',
    category: 'method',
    description: '从现有目标获取渲染容器（如果兼容）。用于复用现有的 DOM 容器元素。',
    usage: `// 使用现有容器
const renderer = layer.getRenderer();
if (renderer && typeof renderer.useContainer === 'function') {
  const target = document.getElementById('my-container');
  const transform = 'matrix(1, 0, 0, 1, 0, 0)';
  const bgColor = 'rgba(255, 255, 255, 1)';

  renderer.useContainer(target, transform, bgColor);
}`,
    params: [
      { name: 'target', type: 'HTMLElement', default: 'undefined', description: '潜在的渲染目标' },
      { name: 'transform', type: 'string', default: 'undefined', description: 'CSS 变换矩阵' },
      { name: 'backgroundColor', type: 'string', default: 'undefined', description: '背景颜色（可选）' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'prepareContainer',
    cn: '准备容器',
    type: 'method',
    category: 'method',
    description: '准备渲染容器。在渲染前调用，用于设置容器的状态和样式。',
    usage: `// 准备渲染容器
const renderer = layer.getRenderer();
if (renderer && typeof renderer.prepareContainer === 'function') {
  renderer.prepareContainer(frameState, targetElement);
}`,
    params: [
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' },
      { name: 'target', type: 'HTMLElement', default: 'undefined', description: '渲染目标元素' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'clipUnrotated',
    cn: '裁剪未旋转区域',
    type: 'method',
    category: 'method',
    description: '在未旋转的 Canvas 上设置裁剪区域。用于限制渲染到指定的地理范围。',
    usage: `// 设置裁剪区域
const renderer = layer.getRenderer();
if (renderer && typeof renderer.clipUnrotated === 'function') {
  const ctx = renderer.context;
  const clipExtent = [-180, -90, 180, 90];

  renderer.clipUnrotated(ctx, frameState, clipExtent);
}`,
    params: [
      { name: 'context', type: 'CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D', default: 'undefined', description: 'Canvas 上下文' },
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' },
      { name: 'extent', type: 'import("../../extent.js").Extent', default: 'undefined', description: '裁剪范围' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'preRender',
    cn: '渲染前',
    type: 'method',
    category: 'method',
    description: '在渲染前执行的操作。通常用于设置渲染状态和清理 Canvas。',
    usage: `// 渲染前处理
const renderer = layer.getRenderer();
if (renderer && typeof renderer.preRender === 'function') {
  const ctx = renderer.context;
  renderer.preRender(ctx, frameState);
}`,
    params: [
      { name: 'context', type: 'CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D', default: 'undefined', description: 'Canvas 上下文' },
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'postRender',
    cn: '渲染后',
    type: 'method',
    category: 'method',
    description: '在渲染后执行的操作。通常用于清理渲染状态和触发渲染完成事件。',
    usage: `// 渲染后处理
const renderer = layer.getRenderer();
if (renderer && typeof renderer.postRender === 'function') {
  const ctx = renderer.context;
  renderer.postRender(ctx, frameState);
}`,
    params: [
      { name: 'context', type: 'CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D', default: 'undefined', description: 'Canvas 上下文' },
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' }
    ],
    returns: { type: 'void', description: '无返回值' }
  },
  {
    name: 'getRenderContext',
    cn: '获取渲染上下文',
    type: 'method',
    category: 'method',
    description: '获取渲染上下文代理对象。用于管理 Z 索引相关的渲染顺序。',
    usage: `// 获取渲染上下文
const renderer = layer.getRenderer();
if (renderer && typeof renderer.getRenderContext === 'function') {
  const renderContext = renderer.getRenderContext(frameState);
  console.log('渲染上下文:', renderContext);
}`,
    params: [
      { name: 'frameState', type: 'import("../../Map.js").FrameState', default: 'undefined', description: '帧状态对象' }
    ],
    returns: { type: 'import("../../render/canvas/ZIndexContext.js").ZIndexContextProxy', description: 'Z 索引上下文代理' }
  },
  {
    name: 'getRenderTransform',
    cn: '获取渲染变换',
    type: 'method',
    category: 'method',
    description: '创建用于渲染到将被旋转的元素的变换矩阵。',
    usage: `// 获取渲染变换矩阵
const renderer = layer.getRenderer();
if (renderer && typeof renderer.getRenderTransform === 'function') {
  const center = [0, 0];
  const resolution = 1000;
  const rotation = Math.PI / 4;  // 45 度
  const pixelRatio = 2;
  const width = 800;
  const height = 600;
  const offsetX = 0;

  const transform = renderer.getRenderTransform(
    center, resolution, rotation, pixelRatio, width, height, offsetX
  );
  console.log('渲染变换:', transform);
}`,
    params: [
      { name: 'center', type: 'import("../../coordinate.js").Coordinate', default: 'undefined', description: '中心坐标' },
      { name: 'resolution', type: 'number', default: 'undefined', description: '分辨率' },
      { name: 'rotation', type: 'number', default: 'undefined', description: '旋转角度（弧度）' },
      { name: 'pixelRatio', type: 'number', default: 'undefined', description: '像素比' },
      { name: 'width', type: 'number', default: 'undefined', description: '渲染元素宽度（像素）' },
      { name: 'height', type: 'number', default: 'undefined', description: '渲染元素高度（像素）' },
      { name: 'offsetX', type: 'number', default: 'undefined', description: '视图坐标 X 方向偏移' }
    ],
    returns: { type: 'import("../../transform.js").Transform', description: '渲染变换矩阵' }
  },
  {
    name: 'getImageData',
    cn: '获取图像数据',
    type: 'method',
    category: 'method',
    description: '获取图像指定位置的数据。用于读取图像像素数据。',
    usage: `// 获取图像数据
const renderer = layer.getRenderer();
if (renderer && typeof renderer.getImageData === 'function') {
  const image = canvas;  // HTMLCanvasElement 或 OffscreenCanvas
  const col = 10;
  const row = 10;

  const imageData = renderer.getImageData(image, col, row);
  if (imageData) {
    console.log('像素数据:', imageData);
  }
}`,
    params: [
      { name: 'image', type: 'import("../../DataTile.js").ImageLike', default: 'undefined', description: '图像对象' },
      { name: 'col', type: 'number', default: 'undefined', description: '列索引' },
      { name: 'row', type: 'number', default: 'undefined', description: '行索引' }
    ],
    returns: { type: 'Uint8ClampedArray|null', description: '图像数据数组或 null' }
  },
  {
    name: 'renderDeferredInternal',
    cn: '延迟渲染',
    type: 'method',
    category: 'method',
    description: '执行延迟渲染操作。用于处理需要延迟的渲染内容。',
    usage: `// 执行延迟渲染
const renderer = layer.getRenderer();
if (renderer && typeof renderer.renderDeferredInternal === 'function') {
  renderer.renderDeferredInternal(frameState);
}`,
    params: [
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
