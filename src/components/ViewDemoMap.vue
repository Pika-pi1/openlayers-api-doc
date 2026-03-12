<template>
  <div class="view-demo-map">
    <el-card class="demo-card" :body-style="{ padding: '0' }">
      <template #header>
        <div class="demo-header">
          <span class="demo-title">
            <el-icon><MapLocation /></el-icon>
            View API 演示
          </span>
          <el-button size="small" @click="resetView" type="primary">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </template>

      <!-- 地图容器 -->
      <div ref="mapContainer" class="map-container"></div>

      <!-- 状态显示 -->
      <div class="view-state">
        <div class="state-title">
          <el-icon><Monitor /></el-icon>
          当前 View 状态
        </div>
        <div class="state-grid">
          <div class="state-item">
            <span class="state-label">中心点 (经度)</span>
            <span class="state-value">{{ state.center[0]?.toFixed(4) }}</span>
          </div>
          <div class="state-item">
            <span class="state-label">中心点 (纬度)</span>
            <span class="state-value">{{ state.center[1]?.toFixed(4) }}</span>
          </div>
          <div class="state-item">
            <span class="state-label">缩放级别</span>
            <span class="state-value">{{ state.zoom.toFixed(2) }}</span>
          </div>
          <div class="state-item">
            <span class="state-label">分辨率</span>
            <span class="state-value">{{ state.resolution.toFixed(2) }}</span>
          </div>
          <div class="state-item">
            <span class="state-label">旋转角度</span>
            <span class="state-value">{{ state.rotation.toFixed(2) }} rad</span>
          </div>
          <div class="state-item">
            <span class="state-label">旋转角度</span>
            <span class="state-value">{{ (state.rotation * 180 / Math.PI).toFixed(1) }}°</span>
          </div>
        </div>
      </div>

      <!-- 参数控制面板 -->
      <div v-if="activeDemo" class="demo-controls">
        <div class="controls-title">
          <el-icon><Setting /></el-icon>
          参数控制 - {{ activeDemo.cn }}
        </div>

        <!-- adjustCenter 控制 -->
        <div v-if="activeDemo.type === 'adjustCenter'" class="control-group">
          <el-form label-width="80px" size="small">
            <el-form-item label="东西增量">
              <el-slider v-model="demoParams.adjustCenterDeltaX" :min="-5000" :max="5000" :step="100" show-input />
            </el-form-item>
            <el-form-item label="南北增量">
              <el-slider v-model="demoParams.adjustCenterDeltaY" :min="-5000" :max="5000" :step="100" show-input />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeAdjustCenter" style="width: 100%">
                执行调整
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- adjustZoom 控制 -->
        <div v-if="activeDemo.type === 'adjustZoom'" class="control-group">
          <el-form label-width="80px" size="small">
            <el-form-item label="缩放增量">
              <el-slider v-model="demoParams.adjustZoomDelta" :min="-5" :max="5" :step="0.5" show-input />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeAdjustZoom" style="width: 100%">
                执行调整
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- adjustResolution 控制 -->
        <div v-if="activeDemo.type === 'adjustResolution'" class="control-group">
          <el-form label-width="80px" size="small">
            <el-form-item label="分辨率增量">
              <el-slider v-model="demoParams.adjustResolutionDelta" :min="-1000" :max="1000" :step="50" show-input />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeAdjustResolution" style="width: 100%">
                执行调整
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- adjustRotation 控制 -->
        <div v-if="activeDemo.type === 'adjustRotation'" class="control-group">
          <el-form label-width="80px" size="small">
            <el-form-item label="旋转增量 (弧度)">
              <el-slider v-model="demoParams.adjustRotationDelta" :min="-3.14" :max="3.14" :step="0.1" show-input />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeAdjustRotation" style="width: 100%">
                执行调整
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- setCenter 控制 -->
        <div v-if="activeDemo.type === 'setCenter'" class="control-group">
          <el-form label-width="70px" size="small">
            <el-form-item label="经度">
              <el-input-number v-model="demoParams.setCenterLon" :precision="4" :step="0.1" :min="-180" :max="180" />
            </el-form-item>
            <el-form-item label="纬度">
              <el-input-number v-model="demoParams.setCenterLat" :precision="4" :step="0.1" :min="-90" :max="90" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeSetCenter" style="width: 100%">
                设置中心点
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- setZoom 控制 -->
        <div v-if="activeDemo.type === 'setZoom'" class="control-group">
          <el-form label-width="80px" size="small">
            <el-form-item label="缩放级别">
              <el-slider v-model="demoParams.setZoomLevel" :min="0" :max="20" :step="0.5" show-input />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeSetZoom" style="width: 100%">
                设置缩放
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- setRotation 控制 -->
        <div v-if="activeDemo.type === 'setRotation'" class="control-group">
          <el-form label-width="80px" size="small">
            <el-form-item label="旋转角度">
              <el-slider v-model="demoParams.setRotation" :min="0" :max="6.28" :step="0.1" show-input />
            </el-form-item>
            <el-form-item label="角度值">
              <span class="angle-display">{{ (demoParams.setRotation * 180 / Math.PI).toFixed(1) }}°</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeSetRotation" style="width: 100%">
                设置旋转
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- rotate 控制 -->
        <div v-if="activeDemo.type === 'rotate'" class="control-group">
          <el-form label-width="80px" size="small">
            <el-form-item label="目标角度">
              <el-slider v-model="demoParams.rotateRotation" :min="0" :max="6.28" :step="0.1" show-input />
            </el-form-item>
            <el-form-item label="动画">
              <el-switch v-model="demoParams.rotateAnimation" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeRotate" style="width: 100%">
                执行旋转
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- animate 控制 -->
        <div v-if="activeDemo.type === 'animate'" class="control-group">
          <el-form label-width="70px" size="small">
            <el-form-item label="经度">
              <el-input-number v-model="demoParams.animateLon" :precision="2" :step="1" />
            </el-form-item>
            <el-form-item label="纬度">
              <el-input-number v-model="demoParams.animateLat" :precision="2" :step="1" />
            </el-form-item>
            <el-form-item label="缩放">
              <el-input-number v-model="demoParams.animateZoom" :min="0" :max="20" :step="0.5" />
            </el-form-item>
            <el-form-item label="时长 (ms)">
              <el-input-number v-model="demoParams.animateDuration" :step="500" :min="100" :max="5000" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeAnimate" style="width: 100%">
                执行动画
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- fit 控制 -->
        <div v-if="activeDemo.type === 'fit'" class="control-group">
          <el-form label-width="80px" size="small">
            <el-form-item label="选择范围">
              <el-select v-model="demoParams.fitExtent" placeholder="选择预设范围" style="width: 100%">
                <el-option label="中国范围" :value="'china'" />
                <el-option label="北京市" :value="'beijing'" />
                <el-option label="上海市" :value="'shanghai'" />
                <el-option label="广州市" :value="'guangzhou'" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeFit" style="width: 100%">
                适配范围
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- zoomToExtent 控制 -->
        <div v-if="activeDemo.type === 'zoomToExtent'" class="control-group">
          <el-form label-width="80px" size="small">
            <el-form-item label="选择范围">
              <el-select v-model="demoParams.zoomExtent" placeholder="选择预设范围" style="width: 100%">
                <el-option label="中国范围" :value="'china'" />
                <el-option label="北京市" :value="'beijing'" />
                <el-option label="上海市" :value="'shanghai'" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeZoomToExtent" style="width: 100%">
                缩放到范围
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- cancelAnimations 控制 -->
        <div v-if="activeDemo.type === 'cancelAnimations'" class="control-group">
          <el-alert
            title="点击按钮将取消当前正在执行的所有动画"
            type="warning"
            :closable="false"
            show-icon
            style="margin-bottom: 10px"
          />
          <el-button type="danger" @click="executeCancelAnimations" style="width: 100%">
            <el-icon><VideoPause /></el-icon>
            取消所有动画
          </el-button>
        </div>

        <!-- constrainResolution 控制 -->
        <div v-if="activeDemo.type === 'constrainResolution'" class="control-group">
          <el-alert
            title="开启后，缩放时会吸附到最近的整数级别"
            type="info"
            :closable="false"
            show-icon
            style="margin-bottom: 10px"
          />
          <el-form label-width="100px" size="small">
            <el-form-item label="约束分辨率">
              <el-switch v-model="demoParams.constrainResolution" @change="executeConstrainResolution" />
            </el-form-item>
          </el-form>
        </div>

        <!-- getCenter 控制 -->
        <div v-if="activeDemo.type === 'getCenter'" class="control-group">
          <div class="get-value-display">
            <div class="value-item">
              <span class="value-label">经度：</span>
              <span class="value-number">{{ state.center[0]?.toFixed(6) }}</span>
            </div>
            <div class="value-item">
              <span class="value-label">纬度：</span>
              <span class="value-number">{{ state.center[1]?.toFixed(6) }}</span>
            </div>
          </div>
        </div>

        <!-- getZoom 控制 -->
        <div v-if="activeDemo.type === 'getZoom'" class="control-group">
          <div class="get-value-display">
            <div class="value-item">
              <span class="value-label">缩放级别：</span>
              <span class="value-number">{{ state.zoom.toFixed(4) }}</span>
            </div>
            <el-alert
              title="缩放级别越小，地图显示范围越大；缩放级别越大，地图越详细"
              type="info"
              :closable="false"
              show-icon
              style="margin-top: 10px"
            />
          </div>
        </div>

        <!-- getRotation 控制 -->
        <div v-if="activeDemo.type === 'getRotation'" class="control-group">
          <div class="get-value-display">
            <div class="value-item">
              <span class="value-label">旋转角度（弧度）：</span>
              <span class="value-number">{{ state.rotation.toFixed(4) }} rad</span>
            </div>
            <div class="value-item">
              <span class="value-label">旋转角度（角度）：</span>
              <span class="value-number">{{ (state.rotation * 180 / Math.PI).toFixed(2) }}°</span>
            </div>
            <div class="value-item">
              <span class="value-label">方向说明：</span>
              <span class="value-direction">
                {{ getDirectionText(state.rotation) }}
              </span>
            </div>
          </div>
        </div>

        <!-- getResolution 控制 -->
        <div v-if="activeDemo.type === 'getResolution'" class="control-group">
          <div class="get-value-display">
            <div class="value-item">
              <span class="value-label">分辨率：</span>
              <span class="value-number">{{ state.resolution.toFixed(4) }} m/pixel</span>
            </div>
            <el-alert
              title="分辨率表示每个像素代表的实际地面距离（米）"
              type="info"
              :closable="false"
              show-icon
              style="margin-top: 10px"
            />
          </div>
        </div>

        <!-- padding 控制 -->
        <div v-if="activeDemo.type === 'padding'" class="control-group">
          <el-form label-width="70px" size="small">
            <el-form-item label="上边距">
              <el-input-number v-model="demoParams.paddingTop" :min="0" :max="500" :step="10" />
            </el-form-item>
            <el-form-item label="右边距">
              <el-input-number v-model="demoParams.paddingRight" :min="0" :max="500" :step="10" />
            </el-form-item>
            <el-form-item label="下边距">
              <el-input-number v-model="demoParams.paddingBottom" :min="0" :max="500" :step="10" />
            </el-form-item>
            <el-form-item label="左边距">
              <el-input-number v-model="demoParams.paddingLeft" :min="0" :max="500" :step="10" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="executeSetPadding" style="width: 100%">
                设置内边距
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetPadding" style="width: 100%">
                重置内边距
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 提示区域 -->
      <div class="demo-tips">
        <el-alert
          :title="activeDemo ? activeDemo.tip : '点击左侧 API 的演示按钮开始'"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Projection from 'ol/proj/Projection'
import { getPointResolution } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style, Icon, Fill, Stroke, Circle } from 'ol/style'

// 预设范围 (使用经纬度坐标 EPSG:4326)
const extents = {
  china: [73, 18, 135, 54], // [minLon, minLat, maxLon, maxLat]
  beijing: [115.5, 39.5, 117.5, 40.5],
  shanghai: [120.5, 30.5, 122.5, 32],
  guangzhou: [112.5, 22.5, 114.5, 24]
}

const mapContainer = ref(null)
const map = ref(null)
const view = ref(null)
const activeDemo = ref(null)

// 当前 View 状态
const state = reactive({
  center: [116.39, 39.91],
  zoom: 5,
  resolution: 0,
  rotation: 0
})

// 演示参数
const demoParams = reactive({
  adjustCenterDeltaX: 1000,
  adjustCenterDeltaY: 1000,
  adjustZoomDelta: 1,
  adjustResolutionDelta: 100,
  adjustRotationDelta: 0.5,
  setCenterLon: 116.39,
  setCenterLat: 39.91,
  setZoomLevel: 5,
  setRotation: 0,
  rotateRotation: 0,
  rotateAnimation: true,
  animateLon: 116.39,
  animateLat: 39.91,
  animateZoom: 10,
  animateDuration: 1000,
  fitExtent: 'beijing',
  zoomExtent: 'beijing',
  constrainResolution: false,
  // padding 参数
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0
})

// 标记点图层
let markerLayer = null

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.setTarget(null)
  }
})

// 初始化地图
const initMap = () => {
  // 创建标记点图层
  markerLayer = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: '#ff4444' }),
        stroke: new Stroke({ color: '#fff', width: 2 })
      })
    })
  })

  // 创建 EPSG:4326 投影对象
  const projection = new Projection({
    code: 'EPSG:4326',
    units: 'degrees',
    axisOrientation: 'enu',
    global: true,
    extent: [-180, -90, 180, 90]
  })

  view.value = new View({
    projection: projection,
    center: [116.39, 39.91], // 直接使用经纬度
    zoom: 5,
    rotation: 0,
    constrainResolution: false,
    extent: [-180, -90, 180, 90]
  })

  map.value = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      markerLayer
    ],
    view: view.value
  })

  // 监听 View 状态变化
  view.value.on('change:center', updateState)
  view.value.on('change:resolution', updateState)
  view.value.on('change:rotation', updateState)

  updateState()
}

// 更新状态显示
const updateState = () => {
  if (!view.value) return
  const center = view.value.getCenter()
  if (center) {
    // 直接使用经纬度，无需转换
    state.center = center
  }
  state.zoom = view.value.getZoom() || 0
  state.resolution = view.value.getResolution() || 0
  state.rotation = view.value.getRotation() || 0
}

// 添加/更新标记点
const updateMarker = (lon, lat) => {
  if (!markerLayer) return
  const source = markerLayer.getSource()
  source.clear()
  // 直接使用经纬度坐标
  const feature = new Feature(new Point([lon, lat]))
  source.addFeature(feature)
}

// 重置视图
const resetView = () => {
  if (view.value) {
    view.value.animate({
      center: [116.39, 39.91], // 直接使用经纬度
      zoom: 5,
      rotation: 0,
      duration: 1000
    })
    if (markerLayer) {
      markerLayer.getSource().clear()
    }
    ElMessage.success('视图已重置')
  }
}

// 接收外部演示请求
const executeDemo = (apiName, apiInfo) => {
  activeDemo.value = {
    type: apiName,
    cn: apiInfo.cn,
    tip: apiInfo.tip || '调整参数后点击执行按钮'
  }
  ElMessage.success(`已加载 ${apiInfo.cn} 演示`)
}

// ========== 执行各个 API 演示 ==========

// adjustCenter
const executeAdjustCenter = () => {
  if (view.value) {
    view.value.adjustCenter([demoParams.adjustCenterDeltaX, demoParams.adjustCenterDeltaY])
    ElMessage.success('中心点已调整')
  }
}

// adjustZoom
const executeAdjustZoom = () => {
  if (view.value) {
    view.value.adjustZoom(demoParams.adjustZoomDelta)
    ElMessage.success('缩放已调整')
  }
}

// adjustResolution
const executeAdjustResolution = () => {
  if (view.value) {
    view.value.adjustResolution(demoParams.adjustResolutionDelta)
    ElMessage.success('分辨率已调整')
  }
}

// adjustRotation
const executeAdjustRotation = () => {
  if (view.value) {
    view.value.adjustRotation(demoParams.adjustRotationDelta)
    ElMessage.success('旋转已调整')
  }
}

// setCenter
const executeSetCenter = () => {
  if (view.value) {
    view.value.setCenter([demoParams.setCenterLon, demoParams.setCenterLat])
    updateMarker(demoParams.setCenterLon, demoParams.setCenterLat)
    ElMessage.success('中心点已设置')
  }
}

// setZoom
const executeSetZoom = () => {
  if (view.value) {
    view.value.setZoom(demoParams.setZoomLevel)
    ElMessage.success('缩放级别已设置')
  }
}

// setRotation
const executeSetRotation = () => {
  if (view.value) {
    view.value.setRotation(demoParams.setRotation)
    ElMessage.success('旋转角度已设置')
  }
}

// rotate
const executeRotate = () => {
  if (view.value) {
    view.value.rotate(demoParams.rotateRotation, {
      duration: demoParams.rotateAnimation ? 1000 : 0
    })
    ElMessage.success('旋转已执行')
  }
}

// animate
const executeAnimate = () => {
  if (view.value) {
    view.value.animate({
      center: [demoParams.animateLon, demoParams.animateLat], // 直接使用经纬度
      zoom: demoParams.animateZoom,
      duration: demoParams.animateDuration
    })
    updateMarker(demoParams.animateLon, demoParams.animateLat)
    ElMessage.success('动画已执行')
  }
}

// fit
const executeFit = () => {
  if (view.value) {
    const extent = extents[demoParams.fitExtent]
    if (extent) {
      view.value.fit(extent, {
        duration: 1000,
        padding: [50, 50, 50, 50]
      })
      ElMessage.success(`已适配到 ${demoParams.fitExtent} 范围`)
    }
  }
}

// zoomToExtent
const executeZoomToExtent = () => {
  if (view.value) {
    const extent = extents[demoParams.zoomExtent]
    if (extent) {
      view.value.fit(extent, {
        duration: 1000,
        maxZoom: 15
      })
      ElMessage.success(`已缩放到 ${demoParams.zoomExtent} 范围`)
    }
  }
}

// cancelAnimations
const executeCancelAnimations = () => {
  if (view.value) {
    view.value.cancelAnimations()
    ElMessage.success('所有动画已取消')
  }
}

// constrainResolution
const executeConstrainResolution = () => {
  if (view.value) {
    view.value.constrainResolution(demoParams.constrainResolution)
    ElMessage.success(`约束分辨率已${demoParams.constrainResolution ? '开启' : '关闭'}`)
  }
}

// 获取方向说明文字
const getDirectionText = (rotation) => {
  const degrees = (rotation * 180 / Math.PI) % 360
  if (degrees === 0 || degrees === 360) return '正北方向'
  if (degrees === 90) return '正东方向'
  if (degrees === 180) return '正南方向'
  if (degrees === 270) return '正西方向'
  if (degrees > 0 && degrees < 90) return '东北方向'
  if (degrees > 90 && degrees < 180) return '东南方向'
  if (degrees > 180 && degrees < 270) return '西南方向'
  if (degrees > 270 && degrees < 360) return '西北方向'
  return '自定义方向'
}

// setPadding
const executeSetPadding = () => {
  if (view.value) {
    const padding = [
      demoParams.paddingTop,
      demoParams.paddingRight,
      demoParams.paddingBottom,
      demoParams.paddingLeft
    ]
    view.value.setPadding(padding)
    ElMessage.success('内边距已设置')
  }
}

// resetPadding
const resetPadding = () => {
  demoParams.paddingTop = 0
  demoParams.paddingRight = 0
  demoParams.paddingBottom = 0
  demoParams.paddingLeft = 0
  if (view.value) {
    view.value.setPadding([0, 0, 0, 0])
    ElMessage.success('内边距已重置')
  }
}

// 暴露方法给父组件
defineExpose({
  executeDemo,
  resetView
})
</script>

<style lang="scss" scoped>
.view-demo-map {
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
      background-clip: text;

      .el-icon {
        color: #667eea;
        font-size: 20px;
        -webkit-text-fill-color: #667eea;
      }
    }
  }

  .map-container {
    width: 100%;
    height: 350px;
    background: linear-gradient(135deg, #e8f4f8 0%, #f5e8f8 100%);
    border-bottom: 1px solid #e0e8f0;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #667eea, transparent);
    }
  }

  .view-state {
    padding: 18px 20px;
    background: linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%);
    border-bottom: 1px solid #e8edf5;

    .state-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 15px;
      font-size: 14px;

      .el-icon {
        color: #667eea;
      }
    }

    .state-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .state-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 10px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.25s ease;

      &:hover {
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
        transform: translateY(-2px);
      }

      .state-label {
        font-size: 11px;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
      }

      .state-value {
        font-size: 15px;
        color: #2d3748;
        font-weight: 700;
        font-family: 'Consolas', 'Monaco', monospace;
        background: linear-gradient(90deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }

  .demo-controls {
    padding: 18px 20px;
    background: #ffffff;
    border-bottom: 1px solid #e8edf5;

    .controls-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 15px;
      font-size: 14px;

      .el-icon {
        color: #667eea;
      }
    }

    .control-group {
      .angle-display {
        font-family: 'Consolas', monospace;
        color: #667eea;
        font-weight: 600;
        font-size: 14px;
      }
    }

    // 获取值显示样式
    .get-value-display {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 10px;
      border: 1px solid #e2e8f0;

      .value-item {
        display: flex;
        align-items: center;
        gap: 10px;

        .value-label {
          color: #64748b;
          font-size: 14px;
          min-width: 120px;
          font-weight: 500;
        }

        .value-number {
          font-family: 'Consolas', monospace;
          background: linear-gradient(90deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 16px;
        }

        .value-direction {
          color: #10b981;
          font-weight: 600;
          font-size: 13px;
          padding: 2px 8px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 4px;
        }
      }
    }
  }

  .demo-tips {
    padding: 16px 20px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 0 0 12px 12px;

    :deep(.el-alert__content) {
      .el-alert__title {
        font-size: 13px;
      }
    }
  }
}

// 响应式
@media (max-width: 1200px) {
  .view-demo-map {
    .demo-card {
      position: static;
      margin-top: 20px;
    }

    .map-container {
      height: 300px;
    }

    .state-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .view-demo-map {
    .map-container {
      height: 250px;
    }

    .state-grid {
      grid-template-columns: 1fr;
    }

    .state-item {
      padding: 8px;
    }
  }
}
</style>
