<template>
  <div class="api-document">
    <el-card class="api-card">
      <template #header>
        <div class="api-header">
          <span class="api-title">
            <el-icon><PieChart /></el-icon>
            ol/style/Stroke
          </span>
          <el-tag type="success">基础样式类</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <div class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>Stroke 类用于定义矢量要素的描边样式。它通常用于线状要素的渲染，或多边形要素的边界线渲染。</p>
        <el-alert
          title="get 函数返回的是实际设置的值，不会返回默认值。如果未显式设置，将返回 null。"
          type="warning"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 导入 -->
      <div class="api-section">
        <h3><el-icon><Connection /></el-icon> 导入</h3>
        <pre class="code-block"><code>import Stroke from 'ol/style/Stroke.js';</code></pre>
      </div>

      <!-- 构造函数 -->
      <div class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-signature">
          <code>new Stroke(options: Object)</code>
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

        <h4>1. 基础描边样式</h4>
        <pre class="code-block"><code>import Stroke from 'ol/style/Stroke.js';

const stroke = new Stroke({
  color: 'blue',
  width: 3
});</code></pre>

        <h4>2. 完整描边配置</h4>
        <pre class="code-block"><code>import Stroke from 'ol/style/Stroke.js';

const stroke = new Stroke({
  color: '#3399CC',
  width: 2,
  lineCap: 'round',      // 线端点样式：butt, round, square
  lineJoin: 'round',     // 线连接样式：bevel, round, miter
  lineDash: [10, 5],     // 虚线模式
  lineDashOffset: 0,     // 虚线偏移
  miterLimit: 10         // 斜接限制
});</code></pre>

        <h4>3. 虚线样式</h4>
        <pre class="code-block"><code>import Stroke from 'ol/style/Stroke.js';

// 创建虚线效果
const dashedStroke = new Stroke({
  color: 'red',
  width: 2,
  lineDash: [10, 5]  // 画 10 像素，空 5 像素
});

// 不同虚线模式
const dotDashStroke = new Stroke({
  color: 'blue',
  width: 2,
  lineDash: [1, 4]  // 点线效果
});

const dashDotStroke = new Stroke({
  color: 'green',
  width: 2,
  lineDash: [10, 5, 1, 5]  // 划 - 点效果
});</code></pre>

        <h4>4. 修改描边属性</h4>
        <pre class="code-block"><code>import Stroke from 'ol/style/Stroke.js';

const stroke = new Stroke({
  color: 'blue',
  width: 2
});

// 获取属性
console.log(stroke.getColor());      // 'blue'
console.log(stroke.getWidth());      // 2
console.log(stroke.getLineCap());    // 'round' (默认)
console.log(stroke.getLineDash());   // null (默认)

// 修改属性
stroke.setColor('red');
stroke.setWidth(5);
stroke.setLineDash([10, 5]);
stroke.setLineDashOffset(5);</code></pre>

        <h4>5. 线端点和连接样式</h4>
        <pre class="code-block"><code>import Stroke from 'ol/style/Stroke.js';

// 不同的线端点样式
const buttCap = new Stroke({
  color: 'red',
  width: 5,
  lineCap: 'butt'    // 平直末端（默认）
});

const roundCap = new Stroke({
  color: 'green',
  width: 5,
  lineCap: 'round'   // 圆形末端
});

const squareCap = new Stroke({
  color: 'blue',
  width: 5,
  lineCap: 'square'  // 方形末端
});

// 不同的线连接样式
const bevelJoin = new Stroke({
  color: 'red',
  width: 5,
  lineJoin: 'bevel'  // 斜角连接
});

const roundJoin = new Stroke({
  color: 'green',
  width: 5,
  lineJoin: 'round'  // 圆角连接
});

const miterJoin = new Stroke({
  color: 'blue',
  width: 5,
  lineJoin: 'miter'  // 尖角连接（默认）
});</code></pre>

        <h4>6. 克隆描边样式</h4>
        <pre class="code-block"><code>import Stroke from 'ol/style/Stroke.js';

const originalStroke = new Stroke({
  color: 'blue',
  width: 3,
  lineDash: [10, 5]
});

// 克隆样式
const clonedStroke = originalStroke.clone();

// 修改克隆的样式不影响原样式
clonedStroke.setColor('red');
console.log(originalStroke.getColor()); // 仍为 'blue'</code></pre>

        <h4>7. 在 Style 中使用 Stroke</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import Stroke from 'ol/style/Stroke.js';
import Fill from 'ol/style/Fill.js';

// 多边形样式（填充 + 描边）
const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.5)'
  }),
  stroke: new Stroke({
    color: '#3399CC',
    width: 2
  })
});

// 线样式（仅描边）
const lineStyle = new Style({
  stroke: new Stroke({
    color: '#ff0000',
    width: 3,
    lineDash: [10, 5]
  })
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
const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke.html'

// 构造函数参数
const constructorParams = [
  {
    name: 'color',
    type: 'string | CanvasGradient | CanvasPattern | Array<number> | null',
    default: 'null',
    description: '描边颜色，可以是 CSS 颜色字符串、渐变色、图案或 RGBA 数组'
  },
  {
    name: 'lineCap',
    type: 'string',
    default: "'round'",
    description: '线端点样式：butt（平直）、round（圆形）、square（方形）'
  },
  {
    name: 'lineJoin',
    type: 'string',
    default: "'round'",
    description: '线连接样式：bevel（斜角）、round（圆角）、miter（尖角）'
  },
  {
    name: 'lineDash',
    type: 'Array<number> | null',
    default: 'null',
    description: '虚线模式数组，如 [10, 5] 表示画 10 像素空 5 像素'
  },
  {
    name: 'lineDashOffset',
    type: 'number',
    default: '0',
    description: '虚线模式的偏移量'
  },
  {
    name: 'miterLimit',
    type: 'number',
    default: '10',
    description: '斜接限制，用于限制尖角连接的延伸长度'
  },
  {
    name: 'offset',
    type: 'number | null',
    default: 'null',
    description: '沿法线方向的线偏移（像素）'
  },
  {
    name: 'width',
    type: 'number',
    default: 'undefined',
    description: '描边宽度（像素）'
  }
]

// Getter 方法
const getterMethods = [
  { name: 'clone()', returnType: 'Stroke', description: '克隆描边样式对象，返回新的 Stroke 实例' },
  { name: 'getColor()', returnType: 'string | CanvasGradient | CanvasPattern | null', description: '获取描边颜色' },
  { name: 'getLineCap()', returnType: 'CanvasLineCap', description: '获取线端点样式 (butt/round/square)' },
  { name: 'getLineDash()', returnType: 'Array<number> | null', description: '获取虚线模式数组' },
  { name: 'getLineDashOffset()', returnType: 'number', description: '获取虚线偏移量' },
  { name: 'getLineJoin()', returnType: 'CanvasLineJoin', description: '获取线连接样式 (bevel/round/miter)' },
  { name: 'getMiterLimit()', returnType: 'number', description: '获取斜接限制值' },
  { name: 'getOffset()', returnType: 'number | null', description: '获取线偏移量' },
  { name: 'getWidth()', returnType: 'number | undefined', description: '获取描边宽度' }
]

// Setter 方法
const setterMethods = [
  { name: 'setColor(color)', param: 'string | CanvasGradient | CanvasPattern | null', description: '设置描边颜色' },
  { name: 'setLineCap(lineCap)', param: 'CanvasLineCap', description: '设置线端点样式' },
  { name: 'setLineDash(lineDash)', param: 'Array<number> | null', description: '设置虚线模式' },
  { name: 'setLineDashOffset(offset)', param: 'number', description: '设置虚线偏移量' },
  { name: 'setLineJoin(lineJoin)', param: 'CanvasLineJoin', description: '设置线连接样式' },
  { name: 'setMiterLimit(limit)', param: 'number', description: '设置斜接限制' },
  { name: 'setOffset(offset)', param: 'number | null', description: '设置线偏移量' },
  { name: 'setWidth(width)', param: 'number', description: '设置描边宽度' }
]

const relatedClasses = [
  { name: 'Style', link: '/style/style' },
  { name: 'Fill', link: '/style/fill' },
  { name: 'Text', link: '/style/text' },
  { name: 'Circle', link: '/style/circle' }
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
