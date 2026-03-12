<template>
  <div class="api-document">
    <el-card class="api-card">
      <template #header>
        <div class="api-header">
          <span class="api-title">
            <el-icon><Edit /></el-icon>
            ol/style/Text
          </span>
          <el-tag type="success">文本样式类</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <div class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>Text 类用于定义矢量要素的文本标签样式。它可以控制字体、颜色、位置、对齐方式等文本渲染属性，支持富文本格式。</p>
        <el-alert
          title="Text 支持富文本格式，可以使用数组形式：['文本', '样式', '文本', '样式', ...] 来实现同一段文字的不同样式效果。"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 导入 -->
      <div class="api-section">
        <h3><el-icon><Connection /></el-icon> 导入</h3>
        <pre class="code-block"><code>import Text from 'ol/style/Text.js';</code></pre>
      </div>

      <!-- 构造函数 -->
      <div class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-signature">
          <code>new Text(options: Object)</code>
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
          <el-table-column prop="returnType" label="返回类型" width="180" />
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

        <h4>1. 基础文本样式</h4>
        <pre class="code-block"><code>import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';

const text = new Text({
  text: '标签文字',
  font: '12px Calibri, sans-serif',
  fill: new Fill({ color: '#000' })
});</code></pre>

        <h4>2. 完整文本配置</h4>
        <pre class="code-block"><code>import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

const text = new Text({
  // 文本内容
  text: '北京市',

  // 字体样式
  font: 'bold 14px Microsoft YaHei, sans-serif',

  // 填充和描边
  fill: new Fill({ color: '#333' }),
  stroke: new Stroke({ color: '#fff', width: 3 }),

  // 位置偏移
  offsetX: 10,
  offsetY: -10,

  // 放置模式
  placement: 'point',

  // 对齐方式
  textAlign: 'center',
  textBaseline: 'middle',

  // 旋转
  rotation: 0,
  rotateWithView: false,

  // 内边距
  padding: [5, 10, 5, 10]
});</code></pre>

        <h4>3. 富文本格式</h4>
        <pre class="code-block"><code>import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';

// 使用数组形式创建富文本
// 格式：['文本', '样式', '文本', '样式', ...]
const richText = new Text({
  text: [
    '人口：', 'normal 12px sans-serif',
    '1000 万', 'bold 12px sans-serif',
    '\n面积：', 'normal 12px sans-serif',
    '16410 km²', 'bold 12px sans-serif'
  ],
  fill: new Fill({ color: '#000' })
});

// 简化的富文本格式（内联样式）
const inlineRichText = new Text({
  text: ['foo', 'bold 10px sans-serif', ' bar', 'italic 10px sans-serif', ' baz', '']
});</code></pre>

        <h4>4. 文本对齐方式</h4>
        <pre class="code-block"><code>import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';

// 水平对齐
const leftAlign = new Text({
  text: '左对齐',
  textAlign: 'left',
  fill: new Fill({ color: '#000' })
});

const centerAlign = new Text({
  text: '居中对齐',
  textAlign: 'center',
  fill: new Fill({ color: '#000' })
});

const rightAlign = new Text({
  text: '右对齐',
  textAlign: 'right',
  fill: new Fill({ color: '#000' })
});

// start 和 end 依赖于文本方向
const startAlign = new Text({
  text: '起始对齐',
  textAlign: 'start',
  fill: new Fill({ color: '#000' })
});

const endAlign = new Text({
  text: '结束对齐',
  textAlign: 'end',
  fill: new Fill({ color: '#000' })
});</code></pre>

        <h4>5. 文本基线</h4>
        <pre class="code-block"><code>import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';

// 不同的基线设置
const topBaseline = new Text({
  text: '顶部基线',
  textBaseline: 'top',
  fill: new Fill({ color: '#000' })
});

const middleBaseline = new Text({
  text: '中间基线',
  textBaseline: 'middle',
  fill: new Fill({ color: '#000' })
});

const bottomBaseline = new Text({
  text: '底部基线',
  textBaseline: 'bottom',
  fill: new Fill({ color: '#000' })
});

const alphabeticBaseline = new Text({
  text: '字母基线',
  textBaseline: 'alphabetic',
  fill: new Fill({ color: '#000' })
});</code></pre>

        <h4>6. 线放置模式</h4>
        <pre class="code-block"><code>import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';

// 点放置（默认）
const pointPlacement = new Text({
  text: '点放置',
  placement: 'point',
  fill: new Fill({ color: '#000' })
});

// 线放置（仅适用于线状几何）
const linePlacement = new Text({
  text: '线放置 - 文字沿线显示',
  placement: 'line',
  fill: new Fill({ color: '#000' })
});

// 注意：line 放置需要 LineString、Polygon、MultiLineString 或 MultiPolygon 几何</code></pre>

        <h4>7. 修改文本属性</h4>
        <pre class="code-block"><code>import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';

const text = new Text({
  text: '初始文字',
  font: '12px sans-serif',
  fill: new Fill({ color: '#000' })
});

// 获取属性
console.log(text.getText());      // '初始文字'
console.log(text.getFont());      // '12px sans-serif'
console.log(text.getOffsetX());   // 0
console.log(text.getOffsetY());   // 0

// 修改属性
text.setText('新文字');
text.setFont('bold 14px sans-serif');
text.setOffsetX(15);
text.setOffsetY(-15);
text.setRotation(Math.PI / 4);  // 旋转 45 度</code></pre>

        <h4>8. 带背景的文字</h4>
        <pre class="code-block"><code>import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

const textWithBackground = new Text({
  text: '带背景的文字',
  font: '14px sans-serif',
  fill: new Fill({ color: '#fff' }),

  // 背景填充和描边
  backgroundFill: new Fill({ color: 'rgba(0, 0, 0, 0.7)' }),
  backgroundStroke: new Stroke({ color: '#333', width: 1 }),

  // 内边距
  padding: [5, 10, 5, 10]
});</code></pre>

        <h4>9. 在 Style 中使用 Text</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';
import Circle from 'ol/style/Circle.js';

// 带标签的点样式
const labeledPointStyle = new Style({
  image: new Circle({
    radius: 8,
    fill: new Fill({ color: '#3399CC' })
  }),
  text: new Text({
    text: '北京市',
    font: '12px Microsoft YaHei',
    fill: new Fill({ color: '#333' }),
    offsetX: 0,
    offsetY: -15
  })
});

// 多个文本标签（使用样式数组）
const multiLabelStyle = new Style({
  text: [
    new Text({
      text: '主标签',
      font: 'bold 14px sans-serif',
      fill: new Fill({ color: '#000' }),
      offsetY: -10
    }),
    new Text({
      text: '副标签',
      font: '10px sans-serif',
      fill: new Fill({ color: '#666' }),
      offsetY: 10
    })
  ]
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
const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_style_Text.html'

// 构造函数参数
const constructorParams = [
  {
    name: 'font',
    type: 'string',
    default: "'10px sans-serif'",
    description: 'CSS 字体值，如 \"bold 14px Microsoft YaHei\"'
  },
  {
    name: 'maxAngle',
    type: 'number',
    default: 'Math.PI/4',
    description: '线放置模式下，字符之间的最大角度（弧度）'
  },
  {
    name: 'offsetX',
    type: 'number',
    default: '0',
    description: '水平偏移量（像素）'
  },
  {
    name: 'offsetY',
    type: 'number',
    default: '0',
    description: '垂直偏移量（像素）'
  },
  {
    name: 'overflow',
    type: 'boolean',
    default: 'false',
    description: '允许文本超出宽度/长度限制'
  },
  {
    name: 'placement',
    type: 'string',
    default: "'point'",
    description: '文本放置模式：point（点）或 line（线）'
  },
  {
    name: 'repeat',
    type: 'number',
    default: 'undefined',
    description: '线放置模式下的重复间隔（像素）'
  },
  {
    name: 'scale',
    type: 'number | Array<number>',
    default: 'undefined',
    description: '缩放值，可以是数字或 [scaleX, scaleY] 数组'
  },
  {
    name: 'rotateWithView',
    type: 'boolean',
    default: 'false',
    description: '是否随视图旋转而旋转'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '0',
    description: '旋转角度（弧度，顺时针为正）'
  },
  {
    name: 'text',
    type: 'string | Array',
    default: 'undefined',
    description: '文本内容或富文本数组 [文本，样式，文本，样式，...]'
  },
  {
    name: 'textAlign',
    type: 'string',
    default: "'center'",
    description: '文本对齐：left, right, center, end, start'
  },
  {
    name: 'justify',
    type: 'string',
    default: 'undefined',
    description: '文本对齐：left, center, right'
  },
  {
    name: 'textBaseline',
    type: 'string',
    default: "'middle'",
    description: '文本基线：bottom, top, middle, alphabetic, hanging, ideographic'
  },
  {
    name: 'fill',
    type: 'Fill | null',
    default: 'dark fill (#333)',
    description: '填充样式'
  },
  {
    name: 'stroke',
    type: 'Stroke',
    default: 'undefined',
    description: '描边样式'
  },
  {
    name: 'backgroundFill',
    type: 'Fill | null',
    default: 'undefined',
    description: '点放置模式的背景填充'
  },
  {
    name: 'backgroundStroke',
    type: 'Stroke',
    default: 'undefined',
    description: '点放置模式的背景描边'
  },
  {
    name: 'padding',
    type: 'Array<number>',
    default: '[0, 0, 0, 0]',
    description: '内边距 [上，右，下，左]'
  },
  {
    name: 'declutterMode',
    type: 'string',
    default: 'undefined',
    description: '排布模式：declutter, obstacle, none'
  }
]

// Getter 方法
const getterMethods = [
  { name: 'clone()', returnType: 'Text', description: '克隆文本样式对象' },
  { name: 'getFont()', returnType: 'string', description: '获取字体样式' },
  { name: 'getMaxAngle()', returnType: 'number', description: '获取字符间最大角度' },
  { name: 'getOffsetX()', returnType: 'number', description: '获取水平偏移量' },
  { name: 'getOffsetY()', returnType: 'number', description: '获取垂直偏移量' },
  { name: 'getOverflow()', returnType: 'boolean', description: '获取溢出设置' },
  { name: 'getPlacement()', returnType: 'string', description: '获取放置模式 (point/line)' },
  { name: 'getRepeat()', returnType: 'number | undefined', description: '获取重复间隔' },
  { name: 'getScale()', returnType: 'number | Array<number>', description: '获取缩放值' },
  { name: 'getRotateWithView()', returnType: 'boolean', description: '是否随视图旋转' },
  { name: 'getRotation()', returnType: 'number', description: '获取旋转角度（弧度）' },
  { name: 'getText()', returnType: 'string | Array', description: '获取文本内容' },
  { name: 'getTextAlign()', returnType: 'string', description: '获取文本对齐方式' },
  { name: 'getJustify()', returnType: 'string', description: '获取文本对齐' },
  { name: 'getTextBaseline()', returnType: 'string', description: '获取文本基线' },
  { name: 'getFill()', returnType: 'Fill | null', description: '获取填充样式' },
  { name: 'getStroke()', returnType: 'Stroke | null', description: '获取描边样式' },
  { name: 'getBackgroundFill()', returnType: 'Fill | null', description: '获取背景填充' },
  { name: 'getBackgroundStroke()', returnType: 'Stroke | null', description: '获取背景描边' },
  { name: 'getPadding()', returnType: 'Array<number>', description: '获取内边距' },
  { name: 'getDeclutterMode()', returnType: 'string', description: '获取排布模式' },
  { name: 'getKeepUpright()', returnType: 'boolean', description: '是否保持文字正向' }
]

// Setter 方法
const setterMethods = [
  { name: 'setFont(font)', param: 'string', description: '设置字体样式' },
  { name: 'setMaxAngle(angle)', param: 'number', description: '设置字符间最大角度' },
  { name: 'setOffsetX(offset)', param: 'number', description: '设置水平偏移' },
  { name: 'setOffsetY(offset)', param: 'number', description: '设置垂直偏移' },
  { name: 'setOverflow(overflow)', param: 'boolean', description: '设置溢出允许' },
  { name: 'setPlacement(placement)', param: 'string', description: '设置放置模式' },
  { name: 'setRepeat(repeat)', param: 'number', description: '设置重复间隔' },
  { name: 'setScale(scale)', param: 'number | Array<number>', description: '设置缩放' },
  { name: 'setRotateWithView(rotate)', param: 'boolean', description: '设置随视图旋转' },
  { name: 'setRotation(rotation)', param: 'number', description: '设置旋转角度' },
  { name: 'setText(text)', param: 'string | Array', description: '设置文本内容' },
  { name: 'setTextAlign(align)', param: 'string', description: '设置文本对齐' },
  { name: 'setJustify(justify)', param: 'string', description: '设置文本对齐' },
  { name: 'setTextBaseline(baseline)', param: 'string', description: '设置文本基线' },
  { name: 'setFill(fill)', param: 'Fill | null', description: '设置填充样式' },
  { name: 'setStroke(stroke)', param: 'Stroke | null', description: '设置描边样式' },
  { name: 'setBackgroundFill(fill)', param: 'Fill | null', description: '设置背景填充' },
  { name: 'setBackgroundStroke(stroke)', param: 'Stroke | null', description: '设置背景描边' },
  { name: 'setPadding(padding)', param: 'Array<number>', description: '设置内边距' },
  { name: 'setKeepUpright(keep)', param: 'boolean', description: '设置保持正向' }
]

const relatedClasses = [
  { name: 'Style', link: '/style/style' },
  { name: 'Fill', link: '/style/fill' },
  { name: 'Stroke', link: '/style/stroke' },
  { name: 'Icon', link: '/style/icon' }
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
