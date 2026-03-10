<template>
  <el-container class="layout-container">
    <!-- 顶部栏 -->
    <el-header class="app-header">
      <div class="header-left">
        <el-icon class="logo-icon"><Platform /></el-icon>
        <h1>OpenLayers API 文档</h1>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span class="username">开发者</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="openOfficialDoc">官方文档</el-dropdown-item>
              <el-dropdown-item divided>GitHub</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="main-container">
      <!-- 侧边栏 -->
      <el-aside :width="sidebarWidth" class="app-aside">
        <div class="aside-header">
          <el-icon v-if="!isCollapsed" @click="toggleCollapse"><Fold /></el-icon>
          <el-icon v-else @click="toggleCollapse"><Expand /></el-icon>
          <span v-if="!isCollapsed">API 导航</span>
        </div>

        <el-menu
          :default-active="activeMenu"
          class="aside-menu"
          :collapse="isCollapsed"
          router
        >
          <!-- Map - 地图 -->
          <el-menu-item index="/map">
            <el-icon><Notebook /></el-icon>
            <span>Map - 地图</span>
          </el-menu-item>

          <!-- View - 视图 -->
          <el-menu-item index="/view">
            <el-icon><View /></el-icon>
            <span>View - 视图</span>
          </el-menu-item>

          <!-- Layer - 图层 -->
          <el-sub-menu index="layer">
            <template #title>
              <el-icon><Grid /></el-icon>
              <span>Layer - 图层</span>
            </template>
            <el-menu-item index="/layer/base">Base - 基类</el-menu-item>
            <el-menu-item index="/layer/tile">Tile - 瓦片</el-menu-item>
            <el-menu-item index="/layer/image">Image - 图像</el-menu-item>
            <el-menu-item index="/layer/vector">Vector - 矢量</el-menu-item>
            <el-menu-item index="/layer/vector-image">VectorImage - 矢量图像</el-menu-item>
            <el-menu-item index="/layer/vector-tile">VectorTile - 矢量瓦片</el-menu-item>
            <el-menu-item index="/layer/webgl-tile">WebGLTile - WebGL 瓦片</el-menu-item>
            <el-menu-item index="/layer/heatmap">Heatmap - 热力图</el-menu-item>
            <el-menu-item index="/layer/graticule">Graticule - 经纬网</el-menu-item>
          </el-sub-menu>

          <!-- Source - 数据源 -->
          <el-sub-menu index="source">
            <template #title>
              <el-icon><Connection /></el-icon>
              <span>Source - 数据源</span>
            </template>
            <el-menu-item index="/source/bingmaps">BingMaps</el-menu-item>
            <el-menu-item index="/source/cluster">Cluster - 聚合</el-menu-item>
            <el-menu-item index="/source/geojson">GeoJSON</el-menu-item>
            <el-menu-item index="/source/google">Google</el-menu-item>
            <el-menu-item index="/source/graticule">Graticule - 经纬网</el-menu-item>
            <el-menu-item index="/source/image">Image - 图像</el-menu-item>
            <el-menu-item index="/source/image-arcgis-rest">ImageArcGISRest</el-menu-item>
            <el-menu-item index="/source/image-canvas">ImageCanvas</el-menu-item>
            <el-menu-item index="/source/image-map-guide">ImageMapGuide</el-menu-item>
            <el-menu-item index="/source/image-static">ImageStatic</el-menu-item>
            <el-menu-item index="/source/image-wms">ImageWMS</el-menu-item>
            <el-menu-item index="/source/osm">OSM - 开放街道图</el-menu-item>
            <el-menu-item index="/source/raster">Raster - 栅格</el-menu-item>
            <el-menu-item index="/source/source">Source - 基类</el-menu-item>
            <el-menu-item index="/source/tile">Tile - 瓦片基类</el-menu-item>
            <el-menu-item index="/source/tile-arcgis-rest">TileArcGISRest</el-menu-item>
            <el-menu-item index="/source/tile-debug">TileDebug</el-menu-item>
            <el-menu-item index="/source/tile-image">TileImage</el-menu-item>
            <el-menu-item index="/source/tile-wms">TileWMS</el-menu-item>
            <el-menu-item index="/source/url">URL - URL 加载</el-menu-item>
            <el-menu-item index="/source/vector">Vector - 矢量</el-menu-item>
            <el-menu-item index="/source/vector-tile">VectorTile - 矢量瓦片</el-menu-item>
            <el-menu-item index="/source/wmts">WMTS</el-menu-item>
            <el-menu-item index="/source/xyz">XYZ</el-menu-item>
            <el-menu-item index="/source/zoomify">Zoomify</el-menu-item>
          </el-sub-menu>

          <!-- Geometry - 几何 -->
          <el-sub-menu index="geometry">
            <template #title>
              <el-icon><Location /></el-icon>
              <span>Geometry - 几何</span>
            </template>
            <el-menu-item index="/geometry/geometry">Geometry - 基类</el-menu-item>
            <el-menu-item index="/geometry/point">Point - 点</el-menu-item>
            <el-menu-item index="/geometry/linestring">LineString - 线</el-menu-item>
            <el-menu-item index="/geometry/linearRing">LinearRing - 线性环</el-menu-item>
            <el-menu-item index="/geometry/polygon">Polygon - 面</el-menu-item>
            <el-menu-item index="/geometry/multipoint">MultiPoint - 多点</el-menu-item>
            <el-menu-item index="/geometry/multilinestring">MultiLineString - 多线</el-menu-item>
            <el-menu-item index="/geometry/multipolygon">MultiPolygon - 多面</el-menu-item>
            <el-menu-item index="/geometry/circle">Circle - 圆</el-menu-item>
            <el-menu-item index="/geometry/geometryCollection">GeometryCollection - 几何集合</el-menu-item>
            <el-menu-item index="/geometry/simpleGeometry">SimpleGeometry - 简单几何</el-menu-item>
          </el-sub-menu>

          <!-- Feature - 要素 -->
          <el-sub-menu index="feature">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>Feature - 要素</span>
            </template>
            <el-menu-item index="/feature/feature">Feature - 要素</el-menu-item>
            <el-menu-item index="/feature/featureVector">FeatureVector - 要素集合</el-menu-item>
          </el-sub-menu>

          <!-- Style - 样式 -->
          <el-sub-menu index="style">
            <template #title>
              <el-icon><MagicStick /></el-icon>
              <span>Style - 样式</span>
            </template>
            <el-menu-item index="/style/style">Style - 样式</el-menu-item>
            <el-menu-item index="/style/icon">Icon - 图标</el-menu-item>
            <el-menu-item index="/style/iconImage">IconImage</el-menu-item>
            <el-menu-item index="/style/image">Image - 图像样式</el-menu-item>
            <el-menu-item index="/style/regularShape">RegularShape - 规则形状</el-menu-item>
            <el-menu-item index="/style/circle">Circle - 圆形样式</el-menu-item>
            <el-menu-item index="/style/fill">Fill - 填充</el-menu-item>
            <el-menu-item index="/style/stroke">Stroke - 描边</el-menu-item>
            <el-menu-item index="/style/text">Text - 文本</el-menu-item>
            <el-menu-item index="/style/textPlacement">TextPlacement</el-menu-item>
            <el-menu-item index="/style/expressions">Expressions - 表达式</el-menu-item>
          </el-sub-menu>

          <!-- Control - 控件 -->
          <el-sub-menu index="control">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>Control - 控件</span>
            </template>
            <el-menu-item index="/control/control">Control - 基类</el-menu-item>
            <el-menu-item index="/control/defaults">defaults - 默认控件</el-menu-item>
            <el-menu-item index="/control/attribution">Attribution - 版权</el-menu-item>
            <el-menu-item index="/control/full-screen">FullScreen - 全屏</el-menu-item>
            <el-menu-item index="/control/mousePosition">MousePosition - 鼠标位置</el-menu-item>
            <el-menu-item index="/control/overviewMap">OverviewMap - 鹰眼</el-menu-item>
            <el-menu-item index="/control/rotate">Rotate - 旋转</el-menu-item>
            <el-menu-item index="/control/scale-line">ScaleLine - 比例尺</el-menu-item>
            <el-menu-item index="/control/zoom">Zoom - 缩放</el-menu-item>
            <el-menu-item index="/control/zoom-slider">ZoomSlider - 缩放条</el-menu-item>
            <el-menu-item index="/control/zoom-to-extent">ZoomToExtent - 缩放到范围</el-menu-item>
          </el-sub-menu>

          <!-- Interaction - 交互 -->
          <el-sub-menu index="interaction">
            <template #title>
              <el-icon><Pointer /></el-icon>
              <span>Interaction - 交互</span>
            </template>
            <el-menu-item index="/interaction/interaction">Interaction - 基类</el-menu-item>
            <el-menu-item index="/interaction/defaults">defaults - 默认交互</el-menu-item>
            <el-menu-item index="/interaction/draw">Draw - 绘制</el-menu-item>
            <el-menu-item index="/interaction/modify">Modify - 修改</el-menu-item>
            <el-menu-item index="/interaction/select">Select - 选择</el-menu-item>
            <el-menu-item index="/interaction/snap">Snap - 吸附</el-menu-item>
            <el-menu-item index="/interaction/translate">Translate - 平移</el-menu-item>
            <el-menu-item index="/interaction/doubleClickZoom">DoubleClickZoom</el-menu-item>
            <el-menu-item index="/interaction/dragAndDrop">DragAndDrop - 拖放</el-menu-item>
            <el-menu-item index="/interaction/dragBox">DragBox - 拖拽框</el-menu-item>
            <el-menu-item index="/interaction/dragPan">DragPan - 拖拽平移</el-menu-item>
            <el-menu-item index="/interaction/dragRotate">DragRotate - 拖拽旋转</el-menu-item>
            <el-menu-item index="/interaction/dragRotateAndZoom">DragRotateAndZoom</el-menu-item>
            <el-menu-item index="/interaction/dragZoom">DragZoom - 拖拽缩放</el-menu-item>
            <el-menu-item index="/interaction/keyboardPan">KeyboardPan - 键盘平移</el-menu-item>
            <el-menu-item index="/interaction/keyboardZoom">KeyboardZoom - 键盘缩放</el-menu-item>
            <el-menu-item index="/interaction/mouseWheelZoom">MouseWheelZoom - 滚轮缩放</el-menu-item>
            <el-menu-item index="/interaction/pinchRotate">PinchRotate - 捏合旋转</el-menu-item>
            <el-menu-item index="/interaction/pinchZoom">PinchZoom - 捏合缩放</el-menu-item>
            <el-menu-item index="/interaction/pointer">Pointer - 指针</el-menu-item>
            <el-menu-item index="/interaction/link">Link - 链接</el-menu-item>
          </el-sub-menu>

          <!-- Overlay - 覆盖物 -->
          <el-menu-item index="/overlay">
            <el-icon><PushPin /></el-icon>
            <span>Overlay - 覆盖物</span>
          </el-menu-item>

          <!-- Proj - 投影 -->
          <el-sub-menu index="proj">
            <template #title>
              <el-icon><Compass /></el-icon>
              <span>Proj - 投影</span>
            </template>
            <el-menu-item index="/proj/projection">Projection - 投影</el-menu-item>
            <el-menu-item index="/proj/projections">projections - 投影集合</el-menu-item>
            <el-menu-item index="/proj/transforms">transforms - 转换</el-menu-item>
            <el-menu-item index="/proj/epsg4326">EPSG:4326</el-menu-item>
            <el-menu-item index="/proj/epsg3857">EPSG:3857</el-menu-item>
          </el-sub-menu>

          <!-- Format - 格式 -->
          <el-sub-menu index="format">
            <template #title>
              <el-icon><Files /></el-icon>
              <span>Format - 格式</span>
            </template>
            <el-menu-item index="/format/feature">Feature - 要素格式</el-menu-item>
            <el-menu-item index="/format/geojson">GeoJSON</el-menu-item>
            <el-menu-item index="/format/gml2">GML2</el-menu-item>
            <el-menu-item index="/format/gml3">GML3</el-menu-item>
            <el-menu-item index="/format/gmlBase">GML Base</el-menu-item>
            <el-menu-item index="/format/gpx">GPX</el-menu-item>
            <el-menu-item index="/format/igs">IGS</el-menu-item>
            <el-menu-item index="/format/iiif">IIIF</el-menu-item>
            <el-menu-item index="/format/jsonFeature">JSON Feature</el-menu-item>
            <el-menu-item index="/format/kml">KML</el-menu-item>
            <el-menu-item index="/format/mvt">MVT</el-menu-item>
            <el-menu-item index="/format/osmxml">OSMXML</el-menu-item>
            <el-menu-item index="/format/pbf">PBF</el-menu-item>
            <el-menu-item index="/format/polyline">Polyline</el-menu-item>
            <el-menu-item index="/format/topojson">TopoJSON</el-menu-item>
            <el-menu-item index="/format/wfs">WFS</el-menu-item>
            <el-menu-item index="/format/wkb">WKB</el-menu-item>
            <el-menu-item index="/format/wkt">WKT</el-menu-item>
            <el-menu-item index="/format/wmsCapabilities">WMS Capabilities</el-menu-item>
            <el-menu-item index="/format/wmsGetFeatureInfo">WMS GetFeatureInfo</el-menu-item>
            <el-menu-item index="/format/wmtsCapabilities">WMTS Capabilities</el-menu-item>
            <el-menu-item index="/format/xsd">XSD</el-menu-item>
          </el-sub-menu>

          <!-- Renderer - 渲染器 -->
          <el-sub-menu index="renderer">
            <template #title>
              <el-icon><Monitor /></el-icon>
              <span>Renderer - 渲染器</span>
            </template>
            <el-menu-item index="/renderer/vector">Vector - 矢量渲染器</el-menu-item>
            <el-menu-item index="/renderer/canvas">Canvas</el-menu-item>
            <el-menu-item index="/renderer/webgl">WebGL</el-menu-item>
          </el-sub-menu>

          <!-- 其他模块 -->
          <el-sub-menu index="other">
            <template #title>
              <el-icon><FolderOpened /></el-icon>
              <span>Other - 其他</span>
            </template>
            <el-menu-item index="/other/center">Center - 中心</el-menu-item>
            <el-menu-item index="/other/coordinate">Coordinate - 坐标</el-menu-item>
            <el-menu-item index="/other/extent">Extent - 范围</el-menu-item>
            <el-menu-item index="/other/size">Size - 尺寸</el-menu-item>
            <el-menu-item index="/other/pixel">Pixel - 像素</el-menu-item>
            <el-menu-item index="/other/bounding">Bounding - 边界</el-menu-item>
            <el-menu-item index="/other/array">Array - 数组</el-menu-item>
            <el-menu-item index="/other/asserts">Asserts - 断言</el-menu-item>
            <el-menu-item index="/other/collection">Collection - 集合</el-menu-item>
            <el-menu-item index="/other/color">Color - 颜色</el-menu-item>
            <el-menu-item index="/other/dom">DOM</el-menu-item>
            <el-menu-item index="/other/events">Events - 事件</el-menu-item>
            <el-menu-item index="/other/featureloader">FeatureLoader - 要素加载器</el-menu-item>
            <el-menu-item index="/other/geolocation">Geolocation - 地理位置</el-menu-item>
            <el-menu-item index="/other/has">Has - 特性检测</el-menu-item>
            <el-menu-item index="/other/layergroup">LayerGroup - 图层组</el-menu-item>
            <el-menu-item index="/object">Object - 对象</el-menu-item>
            <el-menu-item index="/other/observable">Observable - 可观察</el-menu-item>
            <el-menu-item index="/other/ol">ol - 全局</el-menu-item>
            <el-menu-item index="/other/reproj">Reproj - 重投影</el-menu-item>
            <el-menu-item index="/other/rotation">Rotation - 旋转</el-menu-item>
            <el-menu-item index="/other/string">String - 字符串</el-menu-item>
            <el-menu-item index="/other/tile">Tile - 瓦片</el-menu-item>
            <el-menu-item index="/other/tilecache">TileCache - 瓦片缓存</el-menu-item>
            <el-menu-item index="/other/tilegrid">TileGrid - 瓦片网格</el-menu-item>
            <el-menu-item index="/other/tileurlfunction">TileUrlFunction</el-menu-item>
            <el-menu-item index="/other/vecortileutills">VectorTileUtils</el-menu-item>
            <el-menu-item index="/other/xml">XML</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarWidth = ref('280px')
const isCollapsed = ref(false)

const activeMenu = computed(() => route.path)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  sidebarWidth.value = isCollapsed.value ? '64px' : '280px'
}

const openOfficialDoc = () => {
  window.open('https://openlayers.org/en/latest/apidoc/', '_blank')
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  width: 100%;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-icon {
      font-size: 28px;
      color: white;
    }

    h1 {
      color: white;
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: white;

      .username {
        font-size: 14px;
      }
    }
  }
}

.main-container {
  height: calc(100vh - 60px);
}

.app-aside {
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  transition: width 0.3s;
  overflow: hidden;

  .aside-header {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid #e4e7ed;
    font-weight: 600;
    color: #303133;
    gap: 8px;

    .el-icon {
      cursor: pointer;
      font-size: 18px;
    }
  }

  .aside-menu {
    border-right: none;
    height: calc(100vh - 110px);
    overflow-y: auto;

    :deep(.el-sub-menu__title) {
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}

.app-main {
  background-color: #f5f7fa;
  padding: 0;
  overflow: auto;
}
</style>
