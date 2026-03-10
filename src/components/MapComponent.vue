<template>
  <el-card class="map-card">
    <template #header>
      <div class="card-header">
        <span>OpenLayers 地图</span>
        <el-button type="primary" @click="resetView">
          <el-icon><Refresh /></el-icon>
          重置视图
        </el-button>
      </div>
    </template>

    <div ref="mapContainer" class="map-container"></div>

    <div class="map-controls">
      <el-form :inline="true" size="small">
        <el-form-item label="图层">
          <el-select v-model="currentLayer" @change="switchLayer">
            <el-option label="OSM" value="osm" />
            <el-option label="Satellite" value="satellite" />
            <el-option label="Terrain" value="terrain" />
          </el-select>
        </el-form-item>
        <el-form-item label="中心点">
          <el-input-number v-model="center[0]" :precision="2" :step="0.1" />
          <el-input-number v-model="center[1]" :precision="2" :step="0.1" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="updateCenter">更新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="map-info">
      <el-tag size="small">经度：{{ coordinate[0]?.toFixed(4) }}</el-tag>
      <el-tag size="small">纬度：{{ coordinate[1]?.toFixed(4) }}</el-tag>
      <el-tag size="small" type="info">缩放：{{ zoom?.toFixed(1) }}</el-tag>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, toLonLat } from 'ol/proj'

const mapContainer = ref(null)
const map = ref(null)
const currentLayer = ref('osm')
const center = ref([116.39, 39.91]) // 北京坐标
const coordinate = ref([116.39, 39.91])
const zoom = ref(10)

// 图层源
const layerSources = {
  osm: new OSM(),
  satellite: new XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions: 'Tiles © Esri'
  }),
  terrain: new XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attributions: 'Tiles © Esri'
  })
}

let currentTileLayer = null

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.setTarget(null)
  }
})

const initMap = () => {
  currentTileLayer = new TileLayer({
    source: layerSources.osm
  })

  map.value = new Map({
    target: mapContainer.value,
    layers: [currentTileLayer],
    view: new View({
      center: fromLonLat(center.value),
      zoom: zoom.value
    })
  })

  // 监听鼠标移动
  map.value.on('pointermove', (event) => {
    const lonLat = toLonLat(event.coordinate)
    coordinate.value = lonLat
  })

  // 监听视图变化
  map.value.getView().on('change:center', () => {
    const lonLat = toLonLat(map.value.getView().getCenter())
    coordinate.value = lonLat
    center.value = [parseFloat(lonLat[0].toFixed(2)), parseFloat(lonLat[1].toFixed(2))]
  })

  map.value.getView().on('change:resolution', () => {
    zoom.value = map.value.getView().getZoom()
  })
}

const switchLayer = () => {
  if (map.value && layerSources[currentLayer.value]) {
    map.value.removeLayer(currentTileLayer)
    currentTileLayer = new TileLayer({
      source: layerSources[currentLayer.value]
    })
    map.value.addLayer(currentTileLayer)
    ElMessage.success(`已切换到 ${currentLayer.value.toUpperCase()} 图层`)
  }
}

const resetView = () => {
  if (map.value) {
    map.value.getView().animate({
      center: fromLonLat([116.39, 39.91]),
      zoom: 10,
      duration: 1000
    })
    ElMessage.success('视图已重置')
  }
}

const updateCenter = () => {
  if (map.value) {
    map.value.getView().animate({
      center: fromLonLat(center.value),
      duration: 1000
    })
    ElMessage.success('已更新中心点')
  }
}
</script>

<style lang="scss" scoped>
.map-card {
  :deep(.el-card__header) {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.map-container {
  width: 100%;
  height: 500px;
  background-color: #e5e5e5;
}

.map-controls {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
}

.map-info {
  padding: 10px 20px;
  display: flex;
  gap: 10px;
  background-color: #f5f7fa;
}
</style>
