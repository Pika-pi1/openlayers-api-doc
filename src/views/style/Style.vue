<template>
  <div class="api-document">
    <el-card class="api-card">
      <template #header>
        <div class="api-header">
          <span class="api-title">
            <el-icon><Style /></el-icon>
            ol/style/Style
          </span>
          <el-tag type="success">核心类</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <div class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>Style 类用于定义矢量要素的渲染样式。它可以包含填充 (fill)、描边 (stroke)、图像 (image)、文本 (text) 等多种样式组件。</p>
        <el-alert
          title="对样式或其子项通过 set*() 方法所做的任何更改，在使用该样式的要素或图层重新渲染之前不会生效。"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 导入 -->
      <div class="api-section">
        <h3><el-icon><Connection /></el-icon> 导入</h3>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';</code></pre>
      </div>

      <!-- 构造函数 -->
      <div class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-signature">
          <code>new Style(options: Object)</code>
        </div>

        <el-table :data="constructorParams" border stripe class="api-table">
          <el-table-column prop="name" label="参数名" width="180" />
          <el-table-column prop="type" label="类型" width="200" />
          <el-table-column prop="default" label="默认值" width="120" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </div>

      <!-- 方法 -->
      <div class="api-section">
        <h3><el-icon><Tools /></el-icon> Getter 方法</h3>
        <el-table :data="getterMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法名" width="220" />
          <el-table-column prop="returnType" label="返回类型" width="180" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </div>

      <div class="api-section">
        <h3><el-icon><Tools /></el-icon> Setter 方法</h3>
        <el-table :data="setterMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法名" width="220" />
          <el-table-column prop="param" label="参数" width="180" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </div>

      <!-- 使用示例 -->
      <div class="api-section">
        <h3><el-icon><Finished /></el-icon> 使用示例</h3>

        <h4>1. 基础样式</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.5)'
  }),
  stroke: new Stroke({
    color: '#3399CC',
    width: 2
  })
});</code></pre>

        <h4>2. 带图像的样式</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import Icon from 'ol/style/Icon.js';

const style = new Style({
  image: new Icon({
    src: 'path/to/icon.png',
    scale: 0.5,
    opacity: 0.8
  })
});</code></pre>

        <h4>3. 带文本标签的样式</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';

const style = new Style({
  text: new Text({
    text: '标签文字',
    font: '12px Calibri, sans-serif',
    fill: new Fill({ color: '#000' })
  })
});</code></pre>

        <h4>4. 多样式组合（默认样式）</h4>
        <pre class="code-block"><code>import { Style, Circle, Fill, Stroke } from 'ol/style.js';

const fill = new Fill({ color: 'rgba(255,255,255,0.4)' });
const stroke = new Stroke({ color: '#3399CC', width: 1.25 });

const styles = [
  new Style({
    image: new Circle({ fill, stroke, radius: 5 }),
    fill,
    stroke
  })
];

// 应用样式到图层
vectorLayer.setStyle(styles);</code></pre>

        <h4>5. 根据几何类型设置不同样式</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import { Fill, Circle, Stroke } from 'ol/style.js';

const styles = {};

// 多边形样式
styles['Polygon'] = [
  new Style({
    fill: new Fill({ color: 'rgba(255,255,255,0.5)' })
  })
];

// 点样式
styles['Point'] = [
  new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: '#3399CC' }),
      stroke: new Stroke({ color: '#fff', width: 1.5 })
    }),
    zIndex: Infinity
  })
];

// 线样式
styles['LineString'] = [
  new Style({
    stroke: new Stroke({ color: '#ff0000', width: 3 })
  })
];</code></pre>

        <h4>6. 自定义渲染器</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';

const customStyle = new Style({
  renderer(coordinates, state) {
    const [x, y] = coordinates;
    const ctx = state.context;

    // 自定义绘制逻辑
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff0000';
    ctx.fill();
  }
});</code></pre>
      </div>

      <!-- 相关类 -->
      <div class="api-section">
        <h3><el-icon><Link /></el-icon> 相关类</h3>
        <el-tag v-for="tag in relatedClasses" :key="tag" type="info" class="related-tag">
          <router-link :to="tag.link">{{ tag.name }}</router-link>
        </el-tag>
      </div>

      <!-- 官方文档链接 -->
      <div class="api-section">
        <el-link
          :href="officialDocUrl"
          type="primary"
          target="_blank"
          class="official-link"
        >
          <el-icon><Link /></el-icon>
          查看官方文档
        </el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_style_Style.html'

// 构造函数参数
const constructorParams = [
  {
    name: 'geometry',
    type: 'string | Geometry | Function',
    default: 'undefined',
    description: '要素属性、几何体或返回几何体的函数，用于渲染此样式'
  },
  {
    name: 'fill',
    type: 'Fill',
    default: 'undefined',
    description: '填充样式，用于多边形等面状要素'
  },
  {
    name: 'image',
    type: 'ImageStyle',
    default: 'undefined',
    description: '图像样式（如 Circle、Icon、RegularShape 等）'
  },
  {
    name: 'renderer',
    type: 'Function',
    default: 'undefined',
    description: '自定义渲染器函数。设置后，fill、stroke 和 image 将被忽略'
  },
  {
    name: 'hitDetectionRenderer',
    type: 'Function',
    default: 'undefined',
    description: '用于点击检测的自定义渲染器函数'
  },
  {
    name: 'stroke',
    type: 'Stroke',
    default: 'undefined',
    description: '描边样式，用于线状和多边形边界'
  },
  {
    name: 'text',
    type: 'Text',
    default: 'undefined',
    description: '文本样式，用于标签显示'
  },
  {
    name: 'zIndex',
    type: 'number',
    default: 'undefined',
    description: '样式的 Z 索引，用于控制样式渲染顺序'
  }
]

// Getter 方法
const getterMethods = [
  { name: 'clone()', returnType: 'Style', description: '克隆样式对象' },
  { name: 'getFill()', returnType: 'Fill | null', description: '获取填充样式' },
  { name: 'getGeometry()', returnType: 'string | Geometry | Function | null', description: '获取要渲染的几何体' },
  { name: 'getGeometryFunction()', returnType: 'Function', description: '获取用于生成渲染几何体的函数' },
  { name: 'getHitDetectionRenderer()', returnType: 'Function | null', description: '获取点击检测的自定义渲染器函数' },
  { name: 'getImage()', returnType: 'ImageStyle | null', description: '获取图像样式' },
  { name: 'getRenderer()', returnType: 'Function | null', description: '获取自定义渲染器函数' },
  { name: 'getStroke()', returnType: 'Stroke | null', description: '获取描边样式' },
  { name: 'getText()', returnType: 'Text | null', description: '获取文本样式' },
  { name: 'getZIndex()', returnType: 'number | undefined', description: '获取 Z 索引值' }
]

// Setter 方法
const setterMethods = [
  { name: 'setFill(fill)', param: 'Fill | null', description: '设置填充样式' },
  { name: 'setGeometry(geometry)', param: 'string | Geometry | Function | null', description: '设置要渲染的几何体（替代要素自身的几何体）' },
  { name: 'setHitDetectionRenderer(renderer)', param: 'Function | null', description: '设置点击检测的自定义渲染器函数' },
  { name: 'setImage(image)', param: 'ImageStyle', description: '设置图像样式' },
  { name: 'setRenderer(renderer)', param: 'Function | null', description: '设置自定义渲染器函数。设置后，fill、stroke 和 image 选项将被忽略' },
  { name: 'setStroke(stroke)', param: 'Stroke | null', description: '设置描边样式' },
  { name: 'setText(text)', param: 'Text', description: '设置文本样式' },
  { name: 'setZIndex(zIndex)', param: 'number | undefined', description: '设置 Z 索引' }
]

const relatedClasses = [
  { name: 'Fill', link: '/style/fill' },
  { name: 'Stroke', link: '/style/stroke' },
  { name: 'Text', link: '/style/text' },
  { name: 'Icon', link: '/style/icon' },
  { name: 'Circle', link: '/style/circle' },
  { name: 'RegularShape', link: '/style/regularshape' },
  { name: 'Image', link: '/style/image' }
]
</script>

<style lang="scss" scoped>
.api-document {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}

.api-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  :deep(.el-card__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 16px 20px;
    border-bottom: none;
  }
}

.api-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;

  .api-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 700;

    .el-icon {
      font-size: 22px;
    }
  }
}

.api-section {
  margin-bottom: 30px;

  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #303133;
    font-size: 16px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e8edf5;

    .el-icon {
      color: #667eea;
    }
  }

  h4 {
    color: #4a5568;
    font-size: 14px;
    margin: 20px 0 10px 0;
    padding-left: 10px;
    border-left: 3px solid #667eea;
  }

  p {
    color: #606266;
    line-height: 1.8;
    margin-bottom: 15px;
  }

  .constructor-signature {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    margin-bottom: 15px;

    code {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 14px;
      color: #475569;
    }
  }

  .code-block {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 10px 0;
    border: 1px solid #334155;

    code {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #e2e8f0;
    }
  }
}

.api-table {
  width: 100%;
  font-size: 13px;

  :deep(.el-table__header th) {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
  }

  :deep(.el-table__row:hover) {
    background-color: #f8fafc;
  }
}

.related-tag {
  margin-right: 8px;
  margin-bottom: 8px;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: #667eea;
    }
  }
}

.official-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}
</style>
