<template>
  <div class="api-document">
    <el-card class="api-card">
      <template #header>
        <div class="api-header">
          <span class="api-title">
            <el-icon><MagicStick /></el-icon>
            ol/style/Fill
          </span>
          <el-tag type="success">基础样式类</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <div class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>Fill 类用于定义矢量要素的填充样式。它通常与 Style 类一起使用，为多边形等面状要素提供内部填充效果。</p>
        <el-alert
          title="颜色值可以是 CSS 颜色字符串、渐变色或图案。默认值为 null，此时将使用 Canvas 渲染器的默认黑色。"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 导入 -->
      <div class="api-section">
        <h3><el-icon><Connection /></el-icon> 导入</h3>
        <pre class="code-block"><code>import Fill from 'ol/style/Fill.js';</code></pre>
      </div>

      <!-- 构造函数 -->
      <div class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-signature">
          <code>new Fill(options: Object)</code>
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
          <el-table-column prop="name" label="方法名" width="200" />
          <el-table-column prop="returnType" label="返回类型" width="200" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </div>

      <div class="api-section">
        <h3><el-icon><Tools /></el-icon> Setter 方法</h3>
        <el-table :data="setterMethods" border stripe class="api-table">
          <el-table-column prop="name" label="方法名" width="200" />
          <el-table-column prop="param" label="参数" width="180" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </div>

      <!-- 使用示例 -->
      <div class="api-section">
        <h3><el-icon><Finished /></el-icon> 使用示例</h3>

        <h4>1. 基础填充样式</h4>
        <pre class="code-block"><code>import Fill from 'ol/style/Fill.js';

// 使用 CSS 颜色字符串
const fill = new Fill({
  color: 'rgba(255, 255, 255, 0.5)'
});</code></pre>

        <h4>2. 使用十六进制颜色</h4>
        <pre class="code-block"><code>import Fill from 'ol/style/Fill.js';

const fill = new Fill({
  color: '#3399CC'
});</code></pre>

        <h4>3. 使用 RGB/RGBA 颜色数组</h4>
        <pre class="code-block"><code>import Fill from 'ol/style/Fill.js';

// [R, G, B, A] - A 范围 0-1
const fill = new Fill({
  color: [51, 153, 204, 0.5]
});</code></pre>

        <h4>4. 使用渐变色填充</h4>
        <pre class="code-block"><code>import Fill from 'ol/style/Fill.js';

// 创建线性渐变
const gradient = new CanvasGradient(0, 0, 100, 100);
gradient.addColorStop(0, 'red');
gradient.addColorStop(1, 'blue');

const fill = new Fill({
  color: gradient
});</code></pre>

        <h4>5. 修改填充颜色</h4>
        <pre class="code-block"><code>import Fill from 'ol/style/Fill.js';

const fill = new Fill({
  color: 'blue'
});

// 获取当前颜色
const currentColor = fill.getColor();
console.log(currentColor); // 'blue'

// 设置新颜色
fill.setColor('red');
fill.setColor([255, 0, 0, 0.8]); // 使用 RGBA 数组</code></pre>

        <h4>6. 克隆填充样式</h4>
        <pre class="code-block"><code>import Fill from 'ol/style/Fill.js';

const originalFill = new Fill({
  color: 'rgba(255, 0, 0, 0.5)'
});

// 克隆样式
const clonedFill = originalFill.clone();

// 修改克隆的样式不影响原样式
clonedFill.setColor('blue');</code></pre>

        <h4>7. 在 Style 中使用 Fill</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)'
  }),
  stroke: new Stroke({
    color: '#3399CC',
    width: 2
  })
});

// 应用到矢量图层
vectorLayer.setStyle(polygonStyle);</code></pre>
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
const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_style_Fill.html'

// 构造函数参数
const constructorParams = [
  {
    name: 'color',
    type: 'string | CanvasGradient | CanvasPattern | Array<number>',
    default: 'null',
    description: '填充颜色，可以是 CSS 颜色字符串、渐变色、图案或 RGBA 数组 [R, G, B, A]'
  }
]

// Getter 方法
const getterMethods = [
  { name: 'clone()', returnType: 'Fill', description: '克隆填充样式对象，返回一个新的 Fill 实例' },
  { name: 'getColor()', returnType: 'string | CanvasGradient | CanvasPattern | Array<number> | null', description: '获取填充颜色' }
]

// Setter 方法
const setterMethods = [
  { name: 'setColor(color)', param: 'string | CanvasGradient | CanvasPattern | Array<number> | null', description: '设置填充颜色' }
]

const relatedClasses = [
  { name: 'Style', link: '/style/style' },
  { name: 'Stroke', link: '/style/stroke' },
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
