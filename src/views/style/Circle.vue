<template>
  <div class="api-document">
    <el-card class="api-card">
      <template #header>
        <div class="api-header">
          <span class="api-title">
            <el-icon><Circle /></el-icon>
            ol/style/Circle
          </span>
          <el-tag type="success">图像样式类</el-tag>
        </div>
      </template>

      <!-- 概述 -->
      <div class="api-section">
        <h3><el-icon><Document /></el-icon> 概述</h3>
        <p>Circle 类（CircleStyle）用于定义圆形或椭圆形符号样式。它继承自 RegularShape 类，可以设置填充、描边、半径、旋转等属性。当使用非均匀缩放时，可以创建椭圆形。</p>
        <el-alert
          title="Circle 样式在内部使用 Canvas 绘制，性能优于使用图标图片。适合需要大量点符号的场景。"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 导入 -->
      <div class="api-section">
        <h3><el-icon><Connection /></el-icon> 导入</h3>
        <pre class="code-block"><code>import Circle from 'ol/style/Circle.js';</code></pre>
      </div>

      <!-- 构造函数 -->
      <div class="api-section">
        <h3><el-icon><Setting /></el-icon> 构造函数</h3>
        <div class="constructor-signature">
          <code>new Circle(options: Object)</code>
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

        <h4>1. 基础圆形样式</h4>
        <pre class="code-block"><code>import Circle from 'ol/style/Circle.js';

const circle = new Circle({
  radius: 10
});</code></pre>

        <h4>2. 完整圆形配置</h4>
        <pre class="code-block"><code>import Circle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

const circle = new Circle({
  // 半径
  radius: 10,

  // 填充和描边
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.5)'
  }),
  stroke: new Stroke({
    color: '#000',
    width: 2
  }),

  // 位移
  displacement: [0, 0],

  // 缩放
  scale: 1,

  // 旋转
  rotation: 0,
  rotateWithView: false,

  // 排布模式
  declutterMode: 'declutter'
});</code></pre>

        <h4>3. 带填充和描边的圆形</h4>
        <pre class="code-block"><code>import Circle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

// 实心圆
const solidCircle = new Circle({
  radius: 8,
  fill: new Fill({ color: '#3399CC' })
});

// 空心圆（仅描边）
const hollowCircle = new Circle({
  radius: 8,
  stroke: new Stroke({
    color: '#ff0000',
    width: 2
  })
});

// 填充 + 描边
const styledCircle = new Circle({
  radius: 10,
  fill: new Fill({ color: 'rgba(51, 153, 204, 0.6)' }),
  stroke: new Stroke({ color: '#fff', width: 2 })
});</code></pre>

        <h4>4. 创建椭圆形</h4>
        <pre class="code-block"><code>import Circle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';

// 使用数组形式的 scale 创建椭圆
const ellipse = new Circle({
  radius: 10,
  scale: [2, 1],  // X 方向放大 2 倍，Y 方向不变
  fill: new Fill({ color: 'blue' })
});

// 垂直椭圆
const verticalEllipse = new Circle({
  radius: 10,
  scale: [1, 2],  // Y 方向放大 2 倍
  fill: new Fill({ color: 'green' })
});</code></pre>

        <h4>5. 圆形位移</h4>
        <pre class="code-block"><code>import Circle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';

// 默认位置
const defaultCircle = new Circle({
  radius: 8,
  displacement: [0, 0],
  fill: new Fill({ color: 'blue' })
});

// 向右上方位移
const offsetCircle = new Circle({
  radius: 8,
  displacement: [10, -10],  // 右移 10 像素，上移 10 像素
  fill: new Fill({ color: 'red' })
});</code></pre>

        <h4>6. 圆形旋转</h4>
        <pre class="code-block"><code>import Circle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

// 注意：纯圆形旋转看不出效果，通常与非均匀缩放配合使用
const rotatedEllipse = new Circle({
  radius: 10,
  scale: [2, 1],  // 先创建椭圆
  rotation: Math.PI / 4,  // 旋转 45 度
  fill: new Fill({ color: 'purple' }),
  stroke: new Stroke({ color: '#000', width: 1 })
});

// 随视图旋转
const rotateWithView = new Circle({
  radius: 8,
  scale: [2, 1],
  rotateWithView: true,  // 椭圆会随地图旋转而旋转
  fill: new Fill({ color: 'orange' })
});</code></pre>

        <h4>7. 修改圆形属性</h4>
        <pre class="code-block"><code>import Circle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

const circle = new Circle({
  radius: 10,
  fill: new Fill({ color: 'blue' }),
  stroke: new Stroke({ color: '#000', width: 1 })
});

// 获取属性
console.log(circle.getRadius());    // 10
console.log(circle.getFill());      // Fill 对象
console.log(circle.getStroke());    // Stroke 对象
console.log(circle.getScale());     // 1
console.log(circle.getRotation());  // 0
console.log(circle.getAnchor());    // 锚点位置
console.log(circle.getSize());      // 符号尺寸

// 修改属性
circle.setRadius(15);
circle.setFill(new Fill({ color: 'red' }));
circle.setStroke(new Stroke({ color: '#000', width: 2 }));
circle.setScale(1.5);
circle.setRotation(Math.PI / 4);
circle.setDisplacement([5, 5]);</code></pre>

        <h4>8. 克隆圆形样式</h4>
        <pre class="code-block"><code>import Circle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';

const originalCircle = new Circle({
  radius: 10,
  fill: new Fill({ color: 'blue' })
});

// 克隆样式
const clonedCircle = originalCircle.clone();

// 修改克隆的样式不影响原样式
clonedCircle.setRadius(20);
clonedCircle.setFill(new Fill({ color: 'red' }));

console.log(originalCircle.getRadius());  // 仍为 10
console.log(originalCircle.getFill());    // 仍为蓝色</code></pre>

        <h4>9. 在 Style 中使用 Circle</h4>
        <pre class="code-block"><code>import Style from 'ol/style/Style.js';
import Circle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';

// 基础点样式
const pointStyle = new Style({
  image: new Circle({
    radius: 6,
    fill: new Fill({ color: '#3399CC' })
  })
});

// 带描边的点样式
const outlinedPointStyle = new Style({
  image: new Circle({
    radius: 8,
    fill: new Fill({ color: 'rgba(255, 255, 255, 0.5)' }),
    stroke: new Stroke({ color: '#3399CC', width: 2 })
  })
});

// 多状态点样式（使用样式数组）
const multiPointStyle = new Style([
  new Style({
    image: new Circle({
      radius: 10,
      fill: new Fill({ color: 'rgba(255, 0, 0, 0.3)' })
    })
  }),
  new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: 'red' })
    })
  })
]);

// 应用到矢量图层
vectorLayer.setStyle(pointStyle);</code></pre>

        <h4>10. 默认样式（OpenLayers 内置）</h4>
        <pre class="code-block"><code>import { Style, Circle, Fill, Stroke } from 'ol/style.js';

// OpenLayers 默认点样式
const fill = new Fill({ color: 'rgba(255,255,255,0.4)' });
const stroke = new Stroke({ color: '#3399CC', width: 1.25 });

const defaultStyle = new Style({
  image: new Circle({
    fill: fill,
    stroke: stroke,
    radius: 5
  }),
  fill: fill,
  stroke: stroke
});

// 这是 OpenLayers 在未指定样式时使用的默认样式</code></pre>
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
const officialDocUrl = 'https://openlayers.org/en/latest/apidoc/module-ol_style_Circle.html'

// 构造函数参数
const constructorParams = [
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
    description: '圆形半径（像素）'
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
    description: '圆形中心的像素位移 [x, y]'
  },
  {
    name: 'scale',
    type: 'number | Array<number>',
    default: '1',
    description: '缩放因子。使用数组 [scaleX, scaleY] 可创建椭圆'
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
  { name: 'clone()', returnType: 'Circle', description: '克隆圆形样式对象' },
  { name: 'getAnchor()', returnType: 'Array<number>', description: '获取锚点坐标（像素）' },
  { name: 'getFill()', returnType: 'Fill | null', description: '获取填充样式' },
  { name: 'getStroke()', returnType: 'Stroke | null', description: '获取描边样式' },
  { name: 'getRadius()', returnType: 'number', description: '获取圆形半径' },
  { name: 'getRadius2()', returnType: 'number | undefined', description: '获取次级半径（用于椭圆）' },
  { name: 'getSize()', returnType: 'Array<number>', description: '获取符号尺寸（像素）' },
  { name: 'getDisplacement()', returnType: 'Array<number>', description: '获取中心位移' },
  { name: 'getOpacity()', returnType: 'number', description: '获取透明度' },
  { name: 'getRotateWithView()', returnType: 'boolean', description: '是否随视图旋转' },
  { name: 'getRotation()', returnType: 'number', description: '获取旋转角度' },
  { name: 'getScale()', returnType: 'number | Array<number>', description: '获取缩放值' },
  { name: 'getDeclutterMode()', returnType: 'string', description: '获取排布模式' },
  { name: 'getImage(pixelRatio)', returnType: 'HTMLCanvasElement', description: '获取渲染后的图像' },
  { name: 'getAngle()', returnType: 'number', description: '获取形状旋转角度（继承自 RegularShape）' },
  { name: 'getOrigin()', returnType: 'Array<number>', description: '获取符号原点（继承自 RegularShape）' },
  { name: 'getPoints()', returnType: 'number', description: '获取点数（继承自 RegularShape，圆形返回 0）' }
]

// Setter 方法
const setterMethods = [
  { name: 'setFill(fill)', param: 'Fill | null', description: '设置填充样式' },
  { name: 'setStroke(stroke)', param: 'Stroke | null', description: '设置描边样式' },
  { name: 'setRadius(radius)', param: 'number', description: '设置半径' },
  { name: 'setRadius2(radius2)', param: 'number | undefined', description: '设置次级半径' },
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
  { name: 'RegularShape', link: '/style/regularshape' },
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
