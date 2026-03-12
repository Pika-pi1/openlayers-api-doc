<template>
  <div class="api-document">
    <el-card class="api-card">
      <template #header>
        <div class="api-header">
          <span class="api-title">
            <el-icon><Odometer /></el-icon>
            ol/style/RegularShape
          </span>
          <el-tag type="success">图像样式类</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <div class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>RegularShape 类用于定义正多边形符号样式（如三角形、正方形、五边形、星形等）。它继承自 ImageStyle 类，可以创建任意边数的正多边形，支持填充、描边、旋转等属性。Circle 类也继承自 RegularShape。</p>
        <el-alert
          title="RegularShape 使用 Canvas API 绘制，性能好且可灵活定制。通过设置 points 和 radius2 可以创建星形效果。"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 导入 -->
      <div class="api-section">
        <h3><el-icon><Connection /></el-icon> 导入</h3>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';</code></pre>
      </div>

      <!-- 构造函数 -->
      <div class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-signature">
          <code>new RegularShape(options: Object)</code>
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

        <h4>1. 基础正多边形</h4>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';

// 正三角形
const triangle = new RegularShape({
  points: 3,
  radius: 10,
  fill: new Fill({ color: 'green' })
});

// 正方形
const square = new RegularShape({
  points: 4,
  radius: 10,
  fill: new Fill({ color: 'blue' })
});

// 正五边形
const pentagon = new RegularShape({
  points: 5,
  radius: 10,
  fill: new Fill({ color: 'purple' })
});

// 正六边形
const hexagon = new RegularShape({
  points: 6,
  radius: 10,
  fill: new Fill({ color: 'orange' })
});</code></pre>

        <h4>2. 完整配置</h4>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

const shape = new RegularShape({
  // 基本形状
  points: 5,           // 5 个顶点（正五边形）
  radius: 20,          // 外半径
  radius2: 10,         // 内半径（可选，用于创建星形）
  angle: 0,            // 起始角度（弧度）

  // 填充和描边
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.5)'
  }),
  stroke: new Stroke({
    color: '#000',
    width: 2
  }),

  // 位移和缩放
  displacement: [0, 0],
  scale: 1,

  // 旋转
  rotation: 0,
  rotateWithView: false,

  // 排布模式
  declutterMode: 'declutter'
});</code></pre>

        <h4>3. 创建星形</h4>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

// 五角星（使用 radius2 设置内半径）
const fivePointedStar = new RegularShape({
  points: 5,
  radius: 20,          // 外半径
  radius2: 8,          // 内半径（小于外半径创建星形）
  fill: new Fill({ color: 'gold' }),
  stroke: new Stroke({ color: '#ff6600', width: 1 })
});

// 六角星（大卫之星）
const sixPointedStar = new RegularShape({
  points: 6,
  radius: 20,
  radius2: 10,
  fill: new Fill({ color: 'lightblue' }),
  stroke: new Stroke({ color: 'blue', width: 1 })
});

// 八角星
const eightPointedStar = new RegularShape({
  points: 8,
  radius: 25,
  radius2: 10,
  fill: new Fill({ color: 'pink' }),
  stroke: new Stroke({ color: 'purple', width: 1 })
});</code></pre>

        <h4>4. 旋转角度</h4>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';

// 默认角度（一个顶点指向右侧）
const defaultAngle = new RegularShape({
  points: 3,
  radius: 15,
  angle: 0,
  fill: new Fill({ color: 'red' })
});

// 三角形顶点向上（逆时针旋转 90 度）
const triangleUp = new RegularShape({
  points: 3,
  radius: 15,
  angle: Math.PI / 2,  // 90 度
  fill: new Fill({ color: 'green' })
});

// 正方形旋转 45 度（菱形效果）
const diamond = new RegularShape({
  points: 4,
  radius: 15,
  angle: Math.PI / 4,  // 45 度
  fill: new Fill({ color: 'blue' })
});</code></pre>

        <h4>5. 位移和缩放</h4>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';

// 位移
const offsetShape = new RegularShape({
  points: 5,
  radius: 15,
  displacement: [10, -10],  // 向右 10 像素，向上 10 像素
  fill: new Fill({ color: 'purple' })
});

// 缩放
const scaledShape = new RegularShape({
  points: 5,
  radius: 15,
  scale: 1.5,  // 放大 1.5 倍
  fill: new Fill({ color: 'orange' })
});

// 非均匀缩放
const stretchedShape = new RegularShape({
  points: 5,
  radius: 15,
  scale: [2, 1],  // X 方向拉伸 2 倍
  fill: new Fill({ color: 'cyan' })
});</code></pre>

        <h4>6. 带描边的形状</h4>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

// 仅填充
const filledOnly = new RegularShape({
  points: 6,
  radius: 15,
  fill: new Fill({ color: 'lightgreen' })
});

// 仅描边
const strokedOnly = new RegularShape({
  points: 6,
  radius: 15,
  stroke: new Stroke({ color: 'green', width: 2 })
});

// 填充 + 描边
const filledAndStroked = new RegularShape({
  points: 6,
  radius: 15,
  fill: new Fill({ color: 'rgba(144, 238, 144, 0.5)' }),
  stroke: new Stroke({ color: 'green', width: 2 })
});</code></pre>

        <h4>7. 修改形状属性</h4>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

const shape = new RegularShape({
  points: 5,
  radius: 15,
  fill: new Fill({ color: 'blue' })
});

// 获取属性
console.log(shape.getPoints());    // 5
console.log(shape.getRadius());    // 15
console.log(shape.getRadius2());   // undefined
console.log(shape.getAngle());     // 0
console.log(shape.getFill());      // Fill 对象
console.log(shape.getStroke());    // null
console.log(shape.getScale());     // 1
console.log(shape.getRotation());  // 0
console.log(shape.getSize());      // 符号尺寸

// 修改属性
shape.setPoints(6);           // 改为六边形
shape.setRadius(20);          // 增大半径
shape.setRadius2(10);         // 设置内半径（变成星形）
shape.setAngle(Math.PI / 4);  // 旋转 45 度
shape.setFill(new Fill({ color: 'red' }));
shape.setStroke(new Stroke({ color: '#000', width: 2 }));
shape.setScale(1.5);
shape.setRotation(Math.PI / 2);</code></pre>

        <h4>8. 随视图旋转</h4>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';

// 固定方向
const fixedShape = new RegularShape({
  points: 4,
  radius: 15,
  angle: Math.PI / 4,
  rotateWithView: false,  // 默认，不随视图旋转
  fill: new Fill({ color: 'blue' })
});

// 随视图旋转
const rotatingShape = new RegularShape({
  points: 4,
  radius: 15,
  angle: Math.PI / 4,
  rotateWithView: true,  // 随地图旋转而旋转
  fill: new Fill({ color: 'red' })
});</code></pre>

        <h4>9. 在 Style 中使用 RegularShape</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

// 三角形标记
const triangleStyle = new Style({
  image: new RegularShape({
    points: 3,
    radius: 15,
    angle: Math.PI / 2,  // 顶点向上
    fill: new Fill({ color: 'green' }),
    stroke: new Stroke({ color: '#006400', width: 1 })
  })
});

// 星形标记
const starStyle = new Style({
  image: new RegularShape({
    points: 5,
    radius: 20,
    radius2: 8,
    fill: new Fill({ color: 'gold' }),
    stroke: new Stroke({ color: '#ff6600', width: 1 })
  })
});

// 六边形网格标记
const hexagonStyle = new Style({
  image: new RegularShape({
    points: 6,
    radius: 12,
    fill: new Fill({ color: 'rgba(144, 238, 144, 0.6)' }),
    stroke: new Stroke({ color: 'green', width: 1 })
  })
});

// 应用到矢量图层
vectorLayer.setStyle(starStyle);</code></pre>

        <h4>10. 特殊形状示例</h4>
        <pre class="code-block"><code>import RegularShape from 'ol/style/RegularShape.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

// 十字形（使用 4 个点 + 适当的角度）
const cross = new RegularShape({
  points: 4,
  radius: 15,
  radius2: 5,
  angle: Math.PI / 4,
  fill: new Fill({ color: 'red' })
});

// 菱形
const diamond = new RegularShape({
  points: 4,
  radius: 15,
  angle: Math.PI / 4,
  fill: new Fill({ color: 'purple' }),
  stroke: new Stroke({ color: '#fff', width: 1 })
});

// 八角形
const octagon = new RegularShape({
  points: 8,
  radius: 15,
  fill: new Fill({ color: 'lightblue' }),
  stroke: new Stroke({ color: 'blue', width: 1 })
});

// 箭头形状（使用三角形）
const arrow = new RegularShape({
  points: 3,
  radius: 20,
  angle: Math.PI / 2,  // 向上
  fill: new Fill({ color: 'red' }),
  stroke: new Stroke({ color: '#fff', width: 1 })
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
const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_style-RegularShape.html'

// 构造函数参数
const constructorParams = [
  {
    name: 'points',
    type: 'number',
    default: '必须指定',
    description: '多边形顶点数（3=三角形，4=正方形，5=五边形，等等）'
  },
  {
    name: 'fill',
    type: 'Fill | undefined',
    default: 'undefined',
    description: '填充样式'
  },
  {
    name: 'radius',
    type: 'number',
    default: '必须指定',
    description: '外接圆半径（像素）'
  },
  {
    name: 'radius2',
    type: 'number | undefined',
    default: 'undefined',
    description: '内接圆半径。设置后可创建星形效果'
  },
  {
    name: 'angle',
    type: 'number',
    default: '0',
    description: '起始角度（弧度），控制第一个顶点的位置'
  },
  {
    name: 'stroke',
    type: 'Stroke | undefined',
    default: 'undefined',
    description: '描边样式'
  },
  {
    name: 'displacement',
    type: 'Array<number>',
    default: '[0, 0]',
    description: '符号中心的像素位移 [x, y]'
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
    name: 'rotateWithView',
    type: 'boolean',
    default: 'false',
    description: '是否随视图旋转而旋转'
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
  { name: 'clone()', returnType: 'RegularShape', description: '克隆形状样式对象' },
  { name: 'getAnchor()', returnType: 'Array<number>', description: '获取锚点坐标（像素）' },
  { name: 'getFill()', returnType: 'Fill | null', description: '获取填充样式' },
  { name: 'getStroke()', returnType: 'Stroke | null', description: '获取描边样式' },
  { name: 'getPoints()', returnType: 'number', description: '获取顶点数' },
  { name: 'getRadius()', returnType: 'number', description: '获取外接圆半径' },
  { name: 'getRadius2()', returnType: 'number | undefined', description: '获取内接圆半径' },
  { name: 'getAngle()', returnType: 'number', description: '获取起始角度（弧度）' },
  { name: 'getSize()', returnType: 'Array<number>', description: '获取符号尺寸（像素）' },
  { name: 'getDisplacement()', returnType: 'Array<number>', description: '获取中心位移' },
  { name: 'getOpacity()', returnType: 'number', description: '获取透明度' },
  { name: 'getRotateWithView()', returnType: 'boolean', description: '是否随视图旋转' },
  { name: 'getRotation()', returnType: 'number', description: '获取旋转角度' },
  { name: 'getScale()', returnType: 'number | Array<number>', description: '获取缩放值' },
  { name: 'getDeclutterMode()', returnType: 'string', description: '获取排布模式' },
  { name: 'getImage(pixelRatio)', returnType: 'HTMLCanvasElement', description: '获取渲染后的图像' },
  { name: 'getOrigin()', returnType: 'Array<number>', description: '获取符号原点' }
]

// Setter 方法
const setterMethods = [
  { name: 'setFill(fill)', param: 'Fill | null', description: '设置填充样式' },
  { name: 'setStroke(stroke)', param: 'Stroke | null', description: '设置描边样式' },
  { name: 'setPoints(points)', param: 'number', description: '设置顶点数' },
  { name: 'setRadius(radius)', param: 'number', description: '设置外接圆半径' },
  { name: 'setRadius2(radius2)', param: 'number | undefined', description: '设置内接圆半径' },
  { name: 'setAngle(angle)', param: 'number', description: '设置起始角度' },
  { name: 'setDisplacement(displacement)', param: 'Array<number>', description: '设置位移' },
  { name: 'setOpacity(opacity)', param: 'number', description: '设置透明度' },
  { name: 'setRotation(rotation)', param: 'number', description: '设置旋转角度' },
  { name: 'setScale(scale)', param: 'number | Array<number>', description: '设置缩放' },
  { name: 'setRotateWithView(rotate)', param: 'boolean', description: '设置随视图旋转' }
]

const relatedClasses = [
  { name: 'Style', link: '/style/style' },
  { name: 'Fill', link: '/style/fill' },
  { name: 'Stroke', link: '/style/stroke' },
  { name: 'Circle', link: '/style/circle' },
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
