<template>
  <div class="vector-source-demo-map">
    <el-card class="demo-card" :body-style="{ padding: '0' }">
      <template #header>
        <div class="demo-header">
          <span class="demo-title">
            <el-icon><MapLocation /></el-icon>
            VectorSource API 演示
          </span>
          <el-button size="small" @click="resetSource" type="primary">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </template>

      <!-- 地图容器 -->
      <div ref="mapContainer" class="map-container"></div>

      <!-- 状态显示 -->
      <div class="source-state">
        <div class="state-title">
          <el-icon><Monitor /></el-icon>
          当前 VectorSource 状态
        </div>
        <div class="state-grid">
          <div class="state-item">
            <span class="state-label">要素数量</span>
            <span class="state-value">{{ state.featureCount }}</span>
          </div>
          <div class="state-item">
            <span class="state-label">版本号</span>
            <span class="state-value">{{ state.revision }}</span>
          </div>
        </div>
      </div>

      <!-- 参数控制面板 -->
      <div v-if="activeDemo" class="demo-controls">
        <div class="controls-title">
          <el-icon><Setting /></el-icon>
          参数控制 - {{ activeDemo.cn }}
        </div>

        <!-- addFeature 控制 -->
        <div v-if="activeDemo.type === 'addFeature'" class="control-group">
          <el-form label-width="70px" size="small">
            <el-form-item label="经度">
              <el-input-number v-model="demoParams.lon" :min="-180" :max="180" :step="0.1" />
            </el-form-item>
            <el-form-item label="纬度">
              <el-input-number v-model="demoParams.lat" :min="-90" :max="90" :step="0.1" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeAddFeature" style="width: 100%">
                <el-icon><Plus /></el-icon>
                添加要素
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- clear 控制 -->
        <div v-if="activeDemo.type === 'clear'" class="control-group">
          <el-alert
            title="清空所有要素"
            type="warning"
            :closable="false"
            show-icon
            style="margin-bottom: 12px"
          />
          <el-button type="danger" @click="executeClear" style="width: 100%">
            <el-icon><Delete /></el-icon>
            清空数据源
          </el-button>
        </div>

        <!-- getFeatures 控制 -->
        <div v-if="activeDemo.type === 'getFeatures'" class="control-group">
          <el-button type="primary" @click="executeGetFeatures" style="width: 100%">
            <el-icon><Document /></el-icon>
            获取所有要素
          </el-button>
        </div>

        <!-- getExtent 控制 -->
        <div v-if="activeDemo.type === 'getExtent'" class="control-group">
          <el-button type="primary" @click="executeGetExtent" style="width: 100%">
            <el-icon><Box /></el-icon>
            获取范围
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style'
import { MapLocation, Refresh, Monitor, Setting, Plus, Delete, Document, Box } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 地图引用
const mapContainer = ref(null)
const map = ref(null)
const vectorSource = ref(null)

// 当前激活的演示
const activeDemo = ref(null)

// 演示参数
const demoParams = reactive({
  lon: 116.4,
  lat: 39.9
})

// 状态
const state = reactive({
  featureCount: 0,
  revision: 0
})

// 初始化地图
onMounted(() => {
  if (mapContainer.value) {
    initMap()
  }
})

const initMap = () => {
  // 创建 VectorSource
  vectorSource.value = new VectorSource({
    wrapX: false
  })

  // 创建矢量图层
  const vectorLayer = new VectorLayer({
    source: vectorSource.value,
    style: new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({ color: '#409eff' }),
        stroke: new Stroke({ color: '#ffffff', width: 2 })
      })
    })
  })

  // 创建底图
  const tileLayer = new TileLayer({
    source: new XYZ({
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19
    })
  })

  // 创建地图
  map.value = new Map({
    target: mapContainer.value,
    layers: [tileLayer, vectorLayer],
    view: new View({
      center: [116.4, 39.9],
      zoom: 5
    })
  })

  // 监听要素变化
  vectorSource.value.on('addfeature', () => {
    updateState()
  })

  vectorSource.value.on('removefeature', () => {
    updateState()
  })

  vectorSource.value.on('clear', () => {
    updateState()
  })

  updateState()
}

// 更新状态
const updateState = () => {
  if (vectorSource.value) {
    state.featureCount = vectorSource.value.getFeatures().length
    state.revision = vectorSource.value.getRevision()
  }
}

// 重置
const resetSource = () => {
  if (vectorSource.value) {
    vectorSource.value.clear()
    activeDemo.value = null
    updateState()
    ElMessage.success('已重置数据源')
  }
}

// 执行演示
const executeDemo = (apiName, apiInfo) => {
  activeDemo.value = {
    type: apiName,
    cn: apiInfo.cn,
    tip: apiInfo.tip || '调整参数后点击执行按钮'
  }
  ElMessage.success(`已加载 ${apiInfo.cn} 演示`)
}

// 添加要素
const executeAddFeature = () => {
  if (vectorSource.value) {
    const feature = new Feature({
      geometry: new Point([demoParams.lon, demoParams.lat]),
      name: `点${Date.now()}`
    })
    vectorSource.value.addFeature(feature)
    ElMessage.success(`已添加要素：经度${demoParams.lon}, 纬度${demoParams.lat}`)
  }
}

// 清空
const executeClear = () => {
  if (vectorSource.value) {
    vectorSource.value.clear()
    ElMessage.success('已清空数据源')
  }
}

// 获取要素
const executeGetFeatures = () => {
  if (vectorSource.value) {
    const features = vectorSource.value.getFeatures()
    ElMessage.success(`当前共有 ${features.length} 个要素`)
    console.log('要素列表:', features.map(f => f.getProperties()))
  }
}

// 获取范围
const executeGetExtent = () => {
  if (vectorSource.value) {
    const extent = vectorSource.value.getExtent()
    if (extent && extent.length === 4) {
      ElMessage.success(`范围：[${extent.map(e => e.toFixed(4)).join(', ')}]`)
    } else {
      ElMessage.info('当前没有要素，范围为空')
    }
  }
}

defineExpose({
  executeDemo,
  resetSource
})
</script>

<style lang="scss" scoped>
.vector-source-demo-map {
  .demo-card {
    position: sticky;
    top: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    background: linear-gradient(135deg, #ffffff 0%, #fafcff 100%);
  }

  .demo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;

    .demo-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 16px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .map-container {
    width: 100%;
    height: 300px;
    background: #e5e5e5;
  }

  .source-state {
    padding: 16px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    border-top: 1px solid #e1e4e8;

    .state-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
      color: #333;
      margin-bottom: 12px;
    }

    .state-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .state-item {
        background: #fff;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        .state-label {
          display: block;
          font-size: 12px;
          color: #909399;
          margin-bottom: 6px;
        }

        .state-value {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #409eff;
          font-family: 'Consolas', monospace;
        }
      }
    }
  }

  .demo-controls {
    padding: 16px;
    border-top: 1px solid #e1e4e8;

    .controls-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
      color: #333;
      margin-bottom: 16px;
    }

    .control-group {
      margin-bottom: 16px;
    }
  }
}
</style>
