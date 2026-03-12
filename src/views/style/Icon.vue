<template>
  <div class="api-document">
    <el-card class="api-card">
      <template #header>
        <div class="api-header">
          <span class="api-title">
            <el-icon><Picture /></el-icon>
            ol/style/Icon
          </span>
          <el-tag type="success">图像样式类</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <div class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>Icon 类用于在矢量要素上显示图像图标。它支持从 URL 加载图片、使用现有图片对象、设置锚点、缩放、旋转等功能，是创建自定义点符号的常用方式。</p>
        <el-alert
          title="Icon 会异步加载图片。在图片加载完成之前，要素可能不会显示。可以调用 load() 方法手动触发加载。"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 导入 -->
      <div class="api-section">
        <h3><el-icon><Connection /></el-icon> 导入</h3>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';</code></pre>
      </div>

      <!-- 构造函数 -->
      <div class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-signature">
          <code>new Icon(options: Object)</code>
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

        <h4>1. 基础图标样式</h4>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';

const icon = new Icon({
  src: 'path/to/icon.png'
});</code></pre>

        <h4>2. 完整图标配置</h4>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';

const icon = new Icon({
  // 图片源
  src: 'path/to/icon.png',

  // 锚点设置 (默认 [0.5, 0.5] 表示中心)
  anchor: [0.5, 1],  // 底部中心

  // 锚点原点
  anchorOrigin: 'top-left',

  // 锚点单位
  anchorXUnits: 'fraction',  // 'fraction' 或 'pixels'
  anchorYUnits: 'fraction',

  // 颜色和透明度
  color: 'rgba(255, 255, 255, 1)',
  opacity: 0.8,

  // 缩放和旋转
  scale: 0.5,
  rotation: 0,
  rotateWithView: false,

  // 位移
  displacement: [0, 0],

  // 精灵图设置
  offset: [0, 0],
  size: [32, 32]
});</code></pre>

        <h4>3. 使用现有图片对象</h4>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';

// 创建图片对象
const img = new Image();
img.src = 'path/to/icon.png';

const icon = new Icon({
  img: img,
  imgSize: [32, 32]  // 指定图片尺寸
});</code></pre>

        <h4>4. 锚点设置</h4>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';

// 使用分数单位（0-1 范围）
const centerAnchor = new Icon({
  src: 'icon.png',
  anchor: [0.5, 0.5],  // 中心
  anchorXUnits: 'fraction',
  anchorYUnits: 'fraction'
});

const bottomCenterAnchor = new Icon({
  src: 'icon.png',
  anchor: [0.5, 1],  // 底部中心
  anchorXUnits: 'fraction',
  anchorYUnits: 'fraction'
});

// 使用像素单位
const pixelAnchor = new Icon({
  src: 'icon.png',
  anchor: [16, 32],  // 16x32 像素位置
  anchorXUnits: 'pixels',
  anchorYUnits: 'pixels'
});

// 不同的锚点原点
const topLeftOrigin = new Icon({
  src: 'icon.png',
  anchor: [0, 0],
  anchorOrigin: 'top-left'
});

const bottomLeftOrigin = new Icon({
  src: 'icon.png',
  anchor: [0, 0],
  anchorOrigin: 'bottom-left'
});</code></pre>

        <h4>5. 缩放和旋转</h4>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';

// 缩放
const halfScale = new Icon({
  src: 'icon.png',
  scale: 0.5  // 缩小到一半
});

const doubleScale = new Icon({
  src: 'icon.png',
  scale: 2  // 放大两倍
});

// 非均匀缩放（需要 Size 数组）
const nonUniformScale = new Icon({
  src: 'icon.png',
  scale: [2, 1]  // X 方向放大 2 倍，Y 方向不变
});

// 旋转
const rotated45 = new Icon({
  src: 'icon.png',
  rotation: Math.PI / 4  // 45 度（弧度）
});

const rotated90 = new Icon({
  src: 'icon.png',
  rotation: Math.PI / 2  // 90 度
});

// 随视图旋转
const rotateWithView = new Icon({
  src: 'icon.png',
  rotation: 0,
  rotateWithView: true  // 图标会随地图旋转而旋转
});</code></pre>

        <h4>6. 颜色和透明度</h4>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';

// 设置透明度
const semiTransparent = new Icon({
  src: 'icon.png',
  opacity: 0.5  // 50% 透明
});

// 颜色色调
const redTint = new Icon({
  src: 'icon.png',
  color: 'red'
});

const blueTint = new Icon({
  src: 'icon.png',
  color: 'rgba(0, 0, 255, 0.8)'
});

// 使用 RGB 数组
const customColor = new Icon({
  src: 'icon.png',
  color: [255, 0, 0, 0.8]  // [R, G, B, A]
});</code></pre>

        <h4>7. 精灵图（Sprite Sheet）</h4>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';

// 从精灵图中提取子图标
const spriteIcon = new Icon({
  src: 'path/to/sprite.png',

  // 指定子图位置
  offset: [0, 0],      // 从 (0, 0) 开始
  offsetOrigin: 'top-left',

  // 指定子图大小
  size: [32, 32],      // 子图 32x32 像素

  // 锚点
  anchor: [0.5, 0.5],
  anchorOrigin: 'top-left'
});

// 多个图标使用同一精灵图
const icon1 = new Icon({
  src: 'sprites.png',
  offset: [0, 0],
  size: [32, 32]
});

const icon2 = new Icon({
  src: 'sprites.png',
  offset: [32, 0],  // 下一个图标
  size: [32, 32]
});

const icon3 = new Icon({
  src: 'sprites.png',
  offset: [64, 0],
  size: [32, 32]
});</code></pre>

        <h4>8. 修改图标属性</h4>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';

const icon = new Icon({
  src: 'icon.png',
  scale: 1,
  opacity: 1
});

// 获取属性
console.log(icon.getSrc());         // 'icon.png'
console.log(icon.getScale());       // 1
console.log(icon.getOpacity());     // 1
console.log(icon.getAnchor());      // [0.5, 0.5]
console.log(icon.getSize());        // 图片尺寸

// 修改属性
icon.setSrc('new-icon.png');
icon.setScale(0.5);
icon.setOpacity(0.8);
icon.setRotation(Math.PI / 4);
icon.setDisplacement([10, 10]);</code></pre>

        <h4>9. 手动加载图片</h4>
        <pre class="code-block"><code>import Icon from 'ol/style/Icon.js';

const icon = new Icon({
  src: 'path/to/icon.png'
});

// 手动触发加载（通常不需要，渲染时会自动加载）
icon.load();

// 监听加载状态
icon.getImage().onload = () => {
  console.log('图标加载完成');
};</code></pre>

        <h4>10. 在 Style 中使用 Icon</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import Icon from 'ol/style/Icon.js';

// 基础图标样式
const iconStyle = new Style({
  image: new Icon({
    src: 'path/to/marker.png',
    scale: 0.5,
    anchor: [0.5, 1]  // 底部中心
  })
});

// 带标签的图标
import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';

const labeledIconStyle = new Style({
  image: new Icon({
    src: 'path/to/marker.png',
    scale: 0.5
  }),
  text: new Text({
    text: '北京市',
    font: '12px Microsoft YaHei',
    fill: new Fill({ color: '#333' }),
    offsetY: -20
  })
});

// 应用到矢量图层
vectorLayer.setStyle(iconStyle);</code></pre>
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
const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_style_Icon.html'

// 构造函数参数
const constructorParams = [
  {
    name: 'anchor',
    type: 'Array<number>',
    default: '[0.5, 0.5]',
    description: '图标锚点位置，决定图标相对于要素位置的定位点'
  },
  {
    name: 'anchorOrigin',
    type: 'string',
    default: "'top-left'",
    description: '锚点原点：bottom-left, bottom-right, top-left, top-right'
  },
  {
    name: 'anchorXUnits',
    type: 'string',
    default: "'fraction'",
    description: '锚点 X 单位：fraction（分数）或 pixels（像素）'
  },
  {
    name: 'anchorYUnits',
    type: 'string',
    default: "'fraction'",
    description: '锚点 Y 单位：fraction（分数）或 pixels（像素）'
  },
  {
    name: 'color',
    type: 'string | Array<number>',
    default: 'undefined',
    description: '用于色调图标的颜色'
  },
  {
    name: 'crossOrigin',
    type: 'string | null',
    default: 'undefined',
    description: 'CORS 设置，用于加载图片时的跨域处理'
  },
  {
    name: 'img',
    type: 'HTMLImageElement | HTMLCanvasElement',
    default: 'undefined',
    description: '直接使用现有的图片对象'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1',
    description: '图标透明度（0-1）'
  },
  {
    name: 'scale',
    type: 'number | Array<number>',
    default: '1',
    description: '缩放因子，可以是数字或 [scaleX, scaleY] 数组'
  },
  {
    name: 'rotation',
    type: 'number',
    default: '0',
    description: '旋转角度（弧度，顺时针为正）'
  },
  {
    name: 'src',
    type: 'string',
    default: 'undefined',
    description: '图片源 URI'
  },
  {
    name: 'displacement',
    type: 'Array<number>',
    default: '[0, 0]',
    description: '图标中心的像素位移 [x, y]'
  },
  {
    name: 'declutterMode',
    type: 'string',
    default: 'undefined',
    description: '排布模式：declutter, obstacle, none'
  },
  {
    name: 'offset',
    type: 'Array<number>',
    default: 'undefined',
    description: '从精灵图中提取图标时的偏移量'
  },
  {
    name: 'offsetOrigin',
    type: 'string',
    default: "'top-left'",
    description: '偏移量的原点'
  },
  {
    name: 'size',
    type: 'Array<number>',
    default: 'undefined',
    description: '从精灵图中提取图标时的尺寸'
  },
  {
    name: 'width',
    type: 'number',
    default: 'undefined',
    description: '图标宽度（与 scale 互斥）'
  },
  {
    name: 'height',
    type: 'number',
    default: 'undefined',
    description: '图标高度（与 scale 互斥）'
  },
  {
    name: 'referrerPolicy',
    type: 'string',
    default: 'undefined',
    description: '加载图片时的 referrer 策略'
  }
]

// Getter 方法
const getterMethods = [
  { name: 'clone()', returnType: 'Icon', description: '克隆图标样式对象（不包括图片数据）' },
  { name: 'getAnchor()', returnType: 'Array<number>', description: '获取锚点坐标（像素）' },
  { name: 'getColor()', returnType: 'string | Array<number>', description: '获取色调颜色' },
  { name: 'getDeclutterMode()', returnType: 'string', description: '获取排布模式' },
  { name: 'getDisplacement()', returnType: 'Array<number>', description: '获取中心位移' },
  { name: 'getHeight()', returnType: 'number | undefined', description: '获取高度' },
  { name: 'getImage(pixelRatio)', returnType: 'HTMLImageElement | HTMLCanvasElement', description: '获取图片元素' },
  { name: 'getOpacity()', returnType: 'number', description: '获取透明度' },
  { name: 'getOrigin()', returnType: 'Array<number>', description: '获取原点' },
  { name: 'getPixelRatio(pixelRatio)', returnType: 'number', description: '获取像素比' },
  { name: 'getRotateWithView()', returnType: 'boolean', description: '是否随视图旋转' },
  { name: 'getRotation()', returnType: 'number', description: '获取旋转角度' },
  { name: 'getScale()', returnType: 'number | Array<number>', description: '获取缩放值' },
  { name: 'getSize()', returnType: 'Array<number>', description: '获取图片尺寸' },
  { name: 'getSrc()', returnType: 'string', description: '获取图片源 URI' },
  { name: 'getWidth()', returnType: 'number | undefined', description: '获取宽度' }
]

// Setter 方法
const setterMethods = [
  { name: 'setAnchor(anchor)', param: 'Array<number>', description: '设置锚点' },
  { name: 'setDisplacement(displacement)', param: 'Array<number>', description: '设置位移' },
  { name: 'setOpacity(opacity)', param: 'number', description: '设置透明度' },
  { name: 'setRotateWithView(rotate)', param: 'boolean', description: '设置随视图旋转' },
  { name: 'setRotation(rotation)', param: 'number', description: '设置旋转角度' },
  { name: 'setScale(scale)', param: 'number | Array<number>', description: '设置缩放' },
  { name: 'setSrc(src)', param: 'string', description: '设置图片源' }
]

const relatedClasses = [
  { name: 'Style', link: '/style/style' },
  { name: 'Text', link: '/style/text' },
  { name: 'Circle', link: '/style/circle' },
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
