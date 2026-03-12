<template>
  <div class="api-page-container">
    <div class="page-layout">
      <div class="doc-content">
        <div class="page-header">
          <div class="title-section">
            <h2>Expressions - 样式表达式 API</h2>
            <p class="description">
              OpenLayers 样式表达式是一种强大的函数式语言，用于动态计算样式值。
              表达式支持数学运算、逻辑判断、插值、类型转换等操作，可根据要素属性、缩放级别、分辨率等动态设置样式。
            </p>
            <div class="official-links">
              <el-link type="primary" href="https://openlayers.org/en/latest/apidoc/module-ol_style_expressions.html" target="_blank">
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

const activeNames = ref([])
const currentCategory = ref('all')
const isAllExpanded = ref(false)

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value
  activeNames.value = isAllExpanded.value ? expressionApis.map(api => api.name) : []
}

const filterByCategory = (category) => {
  currentCategory.value = category
}

const getTagType = (type) => {
  const typeMap = {
    'operator': 'primary'
  }
  return typeMap[type] || 'info'
}

const categories = computed(() => {
  const cats = [
    { name: 'all', cn: '全部', count: expressionApis.length },
    { name: 'reading', cn: '读取运算符', count: expressionApis.filter(a => a.category === 'reading').length },
    { name: 'math', cn: '数学运算符', count: expressionApis.filter(a => a.category === 'math').length },
    { name: 'transform', cn: '转换运算符', count: expressionApis.filter(a => a.category === 'transform').length },
    { name: 'logical', cn: '逻辑运算符', count: expressionApis.filter(a => a.category === 'logical').length },
    { name: 'conversion', cn: '转换运算符', count: expressionApis.filter(a => a.category === 'conversion').length }
  ]
  return cats.filter(c => c.count > 0 || c.name === 'all')
})

const filteredApis = computed(() => {
  if (currentCategory.value === 'all') return expressionApis
  return expressionApis.filter(a => a.category === currentCategory.value)
})

const expressionApis = [
  {
    name: 'get',
    cn: '获取属性',
    type: 'operator',
    category: 'reading',
    description: '获取要素的属性值。类似 feature.get("attributeName")。',
    usage: `// 获取要素属性
const style = new Style({
  text: new Text({
    text: ['get', 'name']  // 获取 name 属性
  })
});

// 带类型提示
['get', 'population', 'number']  // 明确指定为数字类型`,
    params: [
      { name: 'attributeName', type: 'string', default: 'undefined', description: '属性名称' },
      { name: 'typeHint', type: 'string', default: 'undefined', description: '可选的类型提示：string, number, boolean, color' }
    ],
    returns: { type: 'ExpressionValue', description: '属性值' }
  },
  {
    name: 'geometry-type',
    cn: '几何类型',
    type: 'operator',
    category: 'reading',
    description: '返回要素的几何类型字符串。如 "Point", "LineString", "Polygon" 等。',
    usage: `// 根据几何类型设置样式
const style = new Style({
  stroke: new Stroke({
    color: [
      'case',
      ['==', ['geometry-type'], 'Polygon'], 'red',
      ['==', ['geometry-type'], 'LineString'], 'blue',
      'black'  // 默认
    ]
  })
});`,
    params: [],
    returns: { type: 'string', description: '几何类型字符串' }
  },
  {
    name: 'resolution',
    cn: '分辨率',
    type: 'operator',
    category: 'reading',
    description: '返回当前地图的分辨率（米/像素）。',
    usage: `// 根据分辨率设置线宽
const style = new Style({
  stroke: new Stroke({
    width: ['*', ['resolution'], 10]  // 分辨率越大，线越宽
  })
});`,
    params: [],
    returns: { type: 'number', description: '当前分辨率' }
  },
  {
    name: 'zoom',
    cn: '缩放级别',
    type: 'operator',
    category: 'reading',
    description: '返回当前地图的缩放级别。',
    usage: `// 根据缩放级别设置样式
const style = new Style({
  text: new Text({
    scale: ['interpolate', ['linear'], ['zoom'],
      5, 0.5,
      10, 1,
      15, 2
    ]
  })
});`,
    params: [],
    returns: { type: 'number', description: '当前缩放级别' }
  },
  {
    name: 'var',
    cn: '获取变量',
    type: 'operator',
    category: 'reading',
    description: '从样式变量中获取值。用于访问通过 styleVariables 传递的变量。',
    usage: `// 使用变量
const style = new Style({
  variables: {
    themeColor: '#ff0000'
  },
  fill: new Fill({
    color: ['var', 'themeColor']
  })
});`,
    params: [
      { name: 'varName', type: 'string', default: 'undefined', description: '变量名称' }
    ],
    returns: { type: 'ExpressionValue', description: '变量值' }
  },
  {
    name: 'band',
    cn: '波段值',
    type: 'operator',
    category: 'reading',
    description: '从源数据的指定波段获取像素值。用于栅格数据。',
    usage: `// 获取波段值
['band', 1]  // 获取第 1 波段的值
['band', 1, 0, 0]  // 获取第 1 波段，带偏移`,
    params: [
      { name: 'bandIndex', type: 'number', default: 'undefined', description: '波段索引' },
      { name: 'xOffset', type: 'number', default: '0', description: 'X 方向偏移' },
      { name: 'yOffset', type: 'number', default: '0', description: 'Y 方向偏移' }
    ],
    returns: { type: 'number', description: '波段像素值' }
  },
  {
    name: 'time',
    cn: '时间',
    type: 'operator',
    category: 'reading',
    description: '返回图层创建以来的时间（秒）。',
    usage: `// 使用时间创建动画效果
const style = new Style({
  fill: new Fill({
    color: [
      'color',
      ['*', ['sin', ['time']], 127],  // 正弦波动的红色值
      100,
      200,
      255
    ]
  })
});`,
    params: [],
    returns: { type: 'number', description: '创建以来的秒数' }
  },
  {
    name: '+',
    cn: '加法',
    type: 'operator',
    category: 'math',
    description: '对多个值进行加法运算。支持数字和颜色。',
    usage: `// 数字相加
['+', 10, 20, 30]  // 60

// 与属性结合
['+', ['get', 'population'], 1000]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '第一个值' },
      { name: 'value2', type: 'number', default: 'undefined', description: '第二个值' },
      { name: '...', type: 'number', default: 'undefined', description: '更多值' }
    ],
    returns: { type: 'number', description: '求和结果' }
  },
  {
    name: '-',
    cn: '减法',
    type: 'operator',
    category: 'math',
    description: '从 value1 中减去 value2。',
    usage: `// 数字相减
['-', 100, 30]  // 70

// 计算差值
['-', ['get', 'maxValue'], ['get', 'minValue']]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '被减数' },
      { name: 'value2', type: 'number', default: 'undefined', description: '减数' }
    ],
    returns: { type: 'number', description: '差值' }
  },
  {
    name: '*',
    cn: '乘法',
    type: 'operator',
    category: 'math',
    description: '对多个值进行乘法运算。支持数字和颜色。',
    usage: `// 数字相乘
['*', 2, 3, 4]  // 24

// 缩放值
['*', ['get', 'scale'], 100]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '第一个值' },
      { name: 'value2', type: 'number', default: 'undefined', description: '第二个值' },
      { name: '...', type: 'number', default: 'undefined', description: '更多值' }
    ],
    returns: { type: 'number', description: '乘积结果' }
  },
  {
    name: '/',
    cn: '除法',
    type: 'operator',
    category: 'math',
    description: '将 value1 除以 value2。',
    usage: `// 数字相除
['/', 100, 4]  // 25

// 计算百分比
['/', ['*', ['get', 'value'], 100], ['get', 'total']]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '被除数' },
      { name: 'value2', type: 'number', default: 'undefined', description: '除数' }
    ],
    returns: { type: 'number', description: '商' }
  },
  {
    name: 'clamp',
    cn: '限制范围',
    type: 'operator',
    category: 'math',
    description: '将 value 限制在 low 和 high 之间。',
    usage: `// 限制范围
['clamp', 150, 0, 100]  // 100

// 限制透明度在 0.3-1 之间
['clamp', ['get', 'opacity'], 0.3, 1]`,
    params: [
      { name: 'value', type: 'number', default: 'undefined', description: '要限制的值' },
      { name: 'low', type: 'number', default: 'undefined', description: '下限' },
      { name: 'high', type: 'number', default: 'undefined', description: '上限' }
    ],
    returns: { type: 'number', description: '限制后的值' }
  },
  {
    name: 'abs',
    cn: '绝对值',
    type: 'operator',
    category: 'math',
    description: '返回 value1 的绝对值。',
    usage: `// 绝对值
['abs', -5]  // 5

// 获取差值的绝对值
['abs', ['-', ['get', 'value1'], ['get', 'value2']]]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '输入值' }
    ],
    returns: { type: 'number', description: '绝对值' }
  },
  {
    name: 'sin',
    cn: '正弦',
    type: 'operator',
    category: 'math',
    description: '返回 value1 的正弦值（弧度）。',
    usage: `// 正弦值
['sin', ['*', ['time'], 0.5]]  // 随时间变化

// 创建波动效果
['*', ['sin', ['get', 'angle']], 10]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '弧度值' }
    ],
    returns: { type: 'number', description: '正弦值' }
  },
  {
    name: 'cos',
    cn: '余弦',
    type: 'operator',
    category: 'math',
    description: '返回 value1 的余弦值（弧度）。',
    usage: `// 余弦值
['cos', ['get', 'angle']]

// 创建圆形运动
['*', ['cos', ['time']], 50]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '弧度值' }
    ],
    returns: { type: 'number', description: '余弦值' }
  },
  {
    name: 'sqrt',
    cn: '平方根',
    type: 'operator',
    category: 'math',
    description: '返回 value1 的平方根。',
    usage: `// 平方根
['sqrt', 16]  // 4

// 计算距离
['sqrt',
  ['+',
    ['^', ['-', ['get', 'x2'], ['get', 'x1']], 2],
    ['^', ['-', ['get', 'y2'], ['get', 'y1']], 2]
  ]
]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '输入值' }
    ],
    returns: { type: 'number', description: '平方根' }
  },
  {
    name: 'case',
    cn: '条件选择',
    type: 'operator',
    category: 'transform',
    description: '选择第一个条件为 true 的输出。类似 if-else 链。',
    usage: `// 条件样式
['case',
  ['==', ['get', 'type'], 'city'], 'red',
  ['==', ['get', 'type'], 'town'], 'orange',
  ['==', ['get', 'type'], 'village'], 'yellow',
  'gray'  // 默认
]`,
    params: [
      { name: 'condition1', type: 'boolean', default: 'undefined', description: '第一个条件' },
      { name: 'output1', type: 'ExpressionValue', default: 'undefined', description: '第一个输出' },
      { name: '...', type: 'boolean|ExpressionValue', default: 'undefined', description: '更多条件/输出对' },
      { name: 'fallback', type: 'ExpressionValue', default: 'undefined', description: '默认输出' }
    ],
    returns: { type: 'ExpressionValue', description: '选定的输出值' }
  },
  {
    name: 'match',
    cn: '匹配',
    type: 'operator',
    category: 'transform',
    description: '将输入值与多个匹配值比较，返回匹配的输出。类似 switch 语句。',
    usage: `// 匹配字符串
['match', ['get', 'type'],
  'residential', '#FF0000',
  'commercial', '#00FF00',
  'industrial', '#0000FF',
  '#808080'  // 默认
]`,
    params: [
      { name: 'input', type: 'ExpressionValue', default: 'undefined', description: '输入值' },
      { name: 'match1', type: 'ExpressionValue', default: 'undefined', description: '第一个匹配值' },
      { name: 'output1', type: 'ExpressionValue', default: 'undefined', description: '第一个输出' },
      { name: '...', type: 'ExpressionValue', default: 'undefined', description: '更多匹配/输出对' },
      { name: 'fallback', type: 'ExpressionValue', default: 'undefined', description: '默认输出' }
    ],
    returns: { type: 'ExpressionValue', description: '匹配的输出值' }
  },
  {
    name: 'interpolate',
    cn: '插值',
    type: 'operator',
    category: 'transform',
    description: '在输入和输出对之间进行插值。支持 linear、exponential 等插值方法。',
    usage: `// 线性插值
['interpolate', ['linear'], ['zoom'],
  5, 1,
  10, 2,
  15, 4
]

// 颜色插值
['interpolate', ['linear'], ['zoom'],
  5, ['color', 255, 0, 0, 0.5],
  10, ['color', 0, 255, 0, 0.5],
  15, ['color', 0, 0, 255, 0.5]
]`,
    params: [
      { name: 'interpolation', type: 'Array', default: 'undefined', description: '插值方法：["linear"] 或 ["exponential", base]' },
      { name: 'input', type: 'number', default: 'undefined', description: '输入值（如 zoom, resolution）' },
      { name: 'stop1', type: 'number', default: 'undefined', description: '第一个停止点' },
      { name: 'output1', type: 'ExpressionValue', default: 'undefined', description: '第一个输出值' },
      { name: '...', type: 'number|ExpressionValue', default: 'undefined', description: '更多停止点/输出对' }
    ],
    returns: { type: 'ExpressionValue', description: '插值结果' }
  },
  {
    name: '<',
    cn: '小于',
    type: 'operator',
    category: 'logical',
    description: '如果 value1 严格小于 value2，返回 true。',
    usage: `// 比较
['<', ['get', 'population'], 10000]  // 人口小于 10000`,
    params: [
      { name: 'value1', type: 'number|string', default: 'undefined', description: '第一个值' },
      { name: 'value2', type: 'number|string', default: 'undefined', description: '第二个值' }
    ],
    returns: { type: 'boolean', description: '比较结果' }
  },
  {
    name: '>',
    cn: '大于',
    type: 'operator',
    category: 'logical',
    description: '如果 value1 严格大于 value2，返回 true。',
    usage: `// 比较
['>', ['get', 'population'], 1000000]  // 人口大于 100 万`,
    params: [
      { name: 'value1', type: 'number|string', default: 'undefined', description: '第一个值' },
      { name: 'value2', type: 'number|string', default: 'undefined', description: '第二个值' }
    ],
    returns: { type: 'boolean', description: '比较结果' }
  },
  {
    name: '==',
    cn: '等于',
    type: 'operator',
    category: 'logical',
    description: '如果 value1 等于 value2，返回 true。',
    usage: `// 相等比较
['==', ['get', 'type'], 'Point']  // 类型为 Point
['==', ['get', 'status'], 'active']  // 状态为 active`,
    params: [
      { name: 'value1', type: 'ExpressionValue', default: 'undefined', description: '第一个值' },
      { name: 'value2', type: 'ExpressionValue', default: 'undefined', description: '第二个值' }
    ],
    returns: { type: 'boolean', description: '比较结果' }
  },
  {
    name: 'all',
    cn: '与',
    type: 'operator',
    category: 'logical',
    description: '如果所有输入都为 true，返回 true。逻辑与运算。',
    usage: `// 逻辑与
['all',
  ['>', ['get', 'population'], 10000],
  ['<', ['get', 'population'], 1000000]
]  // 人口在 1 万到 100 万之间`,
    params: [
      { name: 'value1', type: 'boolean', default: 'undefined', description: '第一个值' },
      { name: 'value2', type: 'boolean', default: 'undefined', description: '第二个值' },
      { name: '...', type: 'boolean', default: 'undefined', description: '更多值' }
    ],
    returns: { type: 'boolean', description: '逻辑与结果' }
  },
  {
    name: 'any',
    cn: '或',
    type: 'operator',
    category: 'logical',
    description: '如果任意输入为 true，返回 true。逻辑或运算。',
    usage: `// 逻辑或
['any',
  ['==', ['get', 'type'], 'city'],
  ['==', ['get', 'type'], 'town']
]  // 类型是 city 或 town`,
    params: [
      { name: 'value1', type: 'boolean', default: 'undefined', description: '第一个值' },
      { name: 'value2', type: 'boolean', default: 'undefined', description: '第二个值' },
      { name: '...', type: 'boolean', default: 'undefined', description: '更多值' }
    ],
    returns: { type: 'boolean', description: '逻辑或结果' }
  },
  {
    name: 'between',
    cn: '介于',
    type: 'operator',
    category: 'logical',
    description: '如果 value1 介于 value2 和 value3 之间，返回 true。',
    usage: `// 范围检查
['between', ['get', 'population'], 10000, 1000000]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '要检查的值' },
      { name: 'value2', type: 'number', default: 'undefined', description: '下限' },
      { name: 'value3', type: 'number', default: 'undefined', description: '上限' }
    ],
    returns: { type: 'boolean', description: '是否在范围内' }
  },
  {
    name: 'array',
    cn: '数组',
    type: 'operator',
    category: 'conversion',
    description: '从数字值创建数值数组。支持 2、3 或 4 个值。',
    usage: `// 创建 2D 数组
['array', 100, 200]  // [100, 200]

// 创建 3D 数组
['array', 100, 200, 300]`,
    params: [
      { name: 'value1', type: 'number', default: 'undefined', description: '第一个值' },
      { name: 'value2', type: 'number', default: 'undefined', description: '第二个值' },
      { name: 'value3', type: 'number', default: 'undefined', description: '第三个值（可选）' },
      { name: 'value4', type: 'number', default: 'undefined', description: '第四个值（可选）' }
    ],
    returns: { type: 'Array<number>', description: '数值数组' }
  },
  {
    name: 'color',
    cn: '颜色',
    type: 'operator',
    category: 'conversion',
    description: '从 RGBA 值创建颜色。',
    usage: `// 创建颜色
['color', 255, 0, 0, 255]  // 红色

// 使用表达式
['color',
  ['get', 'red'],
  ['get', 'green'],
  ['get', 'blue'],
  255
]`,
    params: [
      { name: 'red', type: 'number', default: 'undefined', description: '红色值 (0-255)' },
      { name: 'green', type: 'number', default: 'undefined', description: '绿色值 (0-255)' },
      { name: 'blue', type: 'number', default: 'undefined', description: '蓝色值 (0-255)' },
      { name: 'alpha', type: 'number', default: '255', description: '透明度值 (0-255)' }
    ],
    returns: { type: 'Color', description: '颜色值 [r, g, b, a]' }
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

  .api-description {
    margin-bottom: 20px;
    padding: 12px 16px;
    background: #f8f9fa;
    border-left: 4px solid #409eff;
    border-radius: 4px;
    color: #333;
    line-height: 1.6;
  }

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
