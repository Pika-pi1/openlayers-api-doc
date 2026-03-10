import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/view',
    children: [
      // Map - 地图
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/map/Index.vue'),
        meta: { title: 'Map - 地图', category: 'map' }
      },

      // View - 视图
      {
        path: 'view',
        name: 'view',
        component: () => import('@/views/view/Index.vue'),
        meta: { title: 'View - 视图', category: 'view' }
      },

      // Layer - 图层
      { path: 'layer/base', name: 'layer-base', component: () => import('@/views/layer/Base.vue'), meta: { title: 'BaseLayer', category: 'layer' } },
      { path: 'layer/tile', name: 'layer-tile', component: () => import('@/views/layer/Tile.vue'), meta: { title: 'TileLayer', category: 'layer' } },
      { path: 'layer/image', name: 'layer-image', component: () => import('@/views/layer/Image.vue'), meta: { title: 'ImageLayer', category: 'layer' } },
      { path: 'layer/vector', name: 'layer-vector', component: () => import('@/views/layer/Vector.vue'), meta: { title: 'VectorLayer', category: 'layer' } },
      { path: 'layer/vector-image', name: 'layer-vector-image', component: () => import('@/views/layer/VectorImage.vue'), meta: { title: 'VectorImageLayer', category: 'layer' } },
      { path: 'layer/vector-tile', name: 'layer-vector-tile', component: () => import('@/views/layer/VectorTile.vue'), meta: { title: 'VectorTileLayer', category: 'layer' } },
      { path: 'layer/webgl-tile', name: 'layer-webgl-tile', component: () => import('@/views/layer/WebGLTile.vue'), meta: { title: 'WebGLTileLayer', category: 'layer' } },
      { path: 'layer/heatmap', name: 'layer-heatmap', component: () => import('@/views/layer/Heatmap.vue'), meta: { title: 'HeatmapLayer', category: 'layer' } },
      { path: 'layer/graticule', name: 'layer-graticule', component: () => import('@/views/layer/Graticule.vue'), meta: { title: 'GraticuleLayer', category: 'layer' } },

      // Source - 数据源
      { path: 'source/bingmaps', name: 'source-bingmaps', component: () => import('@/views/source/BingMaps.vue'), meta: { title: 'BingMaps', category: 'source' } },
      { path: 'source/cluster', name: 'source-cluster', component: () => import('@/views/source/Cluster.vue'), meta: { title: 'Cluster', category: 'source' } },
      { path: 'source/geojson', name: 'source-geojson', component: () => import('@/views/source/GeoJSON.vue'), meta: { title: 'GeoJSON', category: 'source' } },
      { path: 'source/google', name: 'source-google', component: () => import('@/views/source/Google.vue'), meta: { title: 'Google', category: 'source' } },
      { path: 'source/graticule', name: 'source-graticule', component: () => import('@/views/source/Graticule.vue'), meta: { title: 'Graticule', category: 'source' } },
      { path: 'source/image', name: 'source-image', component: () => import('@/views/source/Image.vue'), meta: { title: 'ImageSource', category: 'source' } },
      { path: 'source/image-arcgis-rest', name: 'source-image-arcgis-rest', component: () => import('@/views/source/ImageArcGISRest.vue'), meta: { title: 'ImageArcGISRest', category: 'source' } },
      { path: 'source/image-canvas', name: 'source-image-canvas', component: () => import('@/views/source/ImageCanvas.vue'), meta: { title: 'ImageCanvas', category: 'source' } },
      { path: 'source/image-map-guide', name: 'source-image-map-guide', component: () => import('@/views/source/ImageMapGuide.vue'), meta: { title: 'ImageMapGuide', category: 'source' } },
      { path: 'source/image-static', name: 'source-image-static', component: () => import('@/views/source/ImageStatic.vue'), meta: { title: 'ImageStatic', category: 'source' } },
      { path: 'source/image-wms', name: 'source-image-wms', component: () => import('@/views/source/ImageWMS.vue'), meta: { title: 'ImageWMS', category: 'source' } },
      { path: 'source/osm', name: 'source-osm', component: () => import('@/views/source/OSM.vue'), meta: { title: 'OSM', category: 'source' } },
      { path: 'source/raster', name: 'source-raster', component: () => import('@/views/source/Raster.vue'), meta: { title: 'Raster', category: 'source' } },
      { path: 'source/source', name: 'source-base', component: () => import('@/views/source/Source.vue'), meta: { title: 'Source', category: 'source' } },
      { path: 'source/tile', name: 'source-tile', component: () => import('@/views/source/Tile.vue'), meta: { title: 'TileSource', category: 'source' } },
      { path: 'source/tile-arcgis-rest', name: 'source-tile-arcgis-rest', component: () => import('@/views/source/TileArcGISRest.vue'), meta: { title: 'TileArcGISRest', category: 'source' } },
      { path: 'source/tile-debug', name: 'source-tile-debug', component: () => import('@/views/source/TileDebug.vue'), meta: { title: 'TileDebug', category: 'source' } },
      { path: 'source/tile-image', name: 'source-tile-image', component: () => import('@/views/source/TileImage.vue'), meta: { title: 'TileImage', category: 'source' } },
      { path: 'source/tile-wms', name: 'source-tile-wms', component: () => import('@/views/source/TileWMS.vue'), meta: { title: 'TileWMS', category: 'source' } },
      { path: 'source/url', name: 'source-url', component: () => import('@/views/source/Url.vue'), meta: { title: 'Url', category: 'source' } },
      { path: 'source/vector', name: 'source-vector', component: () => import('@/views/source/Vector.vue'), meta: { title: 'VectorSource', category: 'source' } },
      { path: 'source/vector-tile', name: 'source-vector-tile', component: () => import('@/views/source/VectorTile.vue'), meta: { title: 'VectorTileSource', category: 'source' } },
      { path: 'source/wmts', name: 'source-wmts', component: () => import('@/views/source/WMTS.vue'), meta: { title: 'WMTS', category: 'source' } },
      { path: 'source/xyz', name: 'source-xyz', component: () => import('@/views/source/XYZ.vue'), meta: { title: 'XYZ', category: 'source' } },
      { path: 'source/zoomify', name: 'source-zoomify', component: () => import('@/views/source/Zoomify.vue'), meta: { title: 'Zoomify', category: 'source' } },

      // Geometry - 几何
      { path: 'geometry/geometry', name: 'geometry-base', component: () => import('@/views/geometry/Geometry.vue'), meta: { title: 'Geometry', category: 'geometry' } },
      { path: 'geometry/point', name: 'geometry-point', component: () => import('@/views/geometry/Point.vue'), meta: { title: 'Point', category: 'geometry' } },
      { path: 'geometry/linestring', name: 'geometry-linestring', component: () => import('@/views/geometry/LineString.vue'), meta: { title: 'LineString', category: 'geometry' } },
      { path: 'geometry/linearRing', name: 'geometry-linearRing', component: () => import('@/views/geometry/LinearRing.vue'), meta: { title: 'LinearRing', category: 'geometry' } },
      { path: 'geometry/polygon', name: 'geometry-polygon', component: () => import('@/views/geometry/Polygon.vue'), meta: { title: 'Polygon', category: 'geometry' } },
      { path: 'geometry/multipoint', name: 'geometry-multipoint', component: () => import('@/views/geometry/MultiPoint.vue'), meta: { title: 'MultiPoint', category: 'geometry' } },
      { path: 'geometry/multilinestring', name: 'geometry-multilinestring', component: () => import('@/views/geometry/MultiLineString.vue'), meta: { title: 'MultiLineString', category: 'geometry' } },
      { path: 'geometry/multipolygon', name: 'geometry-multipolygon', component: () => import('@/views/geometry/MultiPolygon.vue'), meta: { title: 'MultiPolygon', category: 'geometry' } },
      { path: 'geometry/circle', name: 'geometry-circle', component: () => import('@/views/geometry/Circle.vue'), meta: { title: 'Circle', category: 'geometry' } },
      { path: 'geometry/geometryCollection', name: 'geometry-collection', component: () => import('@/views/geometry/GeometryCollection.vue'), meta: { title: 'GeometryCollection', category: 'geometry' } },
      { path: 'geometry/simpleGeometry', name: 'geometry-simple', component: () => import('@/views/geometry/SimpleGeometry.vue'), meta: { title: 'SimpleGeometry', category: 'geometry' } },

      // Feature - 要素
      { path: 'feature/feature', name: 'feature', component: () => import('@/views/feature/Feature.vue'), meta: { title: 'Feature', category: 'feature' } },
      { path: 'feature/featureVector', name: 'feature-vector', component: () => import('@/views/feature/FeatureVector.vue'), meta: { title: 'FeatureVector', category: 'feature' } },

      // Style - 样式
      { path: 'style/style', name: 'style', component: () => import('@/views/style/Style.vue'), meta: { title: 'Style', category: 'style' } },
      { path: 'style/icon', name: 'style-icon', component: () => import('@/views/style/Icon.vue'), meta: { title: 'Icon', category: 'style' } },
      { path: 'style/iconImage', name: 'style-icon-image', component: () => import('@/views/style/IconImage.vue'), meta: { title: 'IconImage', category: 'style' } },
      { path: 'style/image', name: 'style-image', component: () => import('@/views/style/Image.vue'), meta: { title: 'ImageStyle', category: 'style' } },
      { path: 'style/regularShape', name: 'style-regular-shape', component: () => import('@/views/style/RegularShape.vue'), meta: { title: 'RegularShape', category: 'style' } },
      { path: 'style/circle', name: 'style-circle', component: () => import('@/views/style/Circle.vue'), meta: { title: 'Circle', category: 'style' } },
      { path: 'style/fill', name: 'style-fill', component: () => import('@/views/style/Fill.vue'), meta: { title: 'Fill', category: 'style' } },
      { path: 'style/stroke', name: 'style-stroke', component: () => import('@/views/style/Stroke.vue'), meta: { title: 'Stroke', category: 'style' } },
      { path: 'style/text', name: 'style-text', component: () => import('@/views/style/Text.vue'), meta: { title: 'Text', category: 'style' } },
      { path: 'style/textPlacement', name: 'style-text-placement', component: () => import('@/views/style/TextPlacement.vue'), meta: { title: 'TextPlacement', category: 'style' } },
      { path: 'style/expressions', name: 'style-expressions', component: () => import('@/views/style/Expressions.vue'), meta: { title: 'Expressions', category: 'style' } },

      // Control - 控件
      { path: 'control/control', name: 'control-base', component: () => import('@/views/control/Control.vue'), meta: { title: 'Control', category: 'control' } },
      { path: 'control/defaults', name: 'control-defaults', component: () => import('@/views/control/Defaults.vue'), meta: { title: 'defaults', category: 'control' } },
      { path: 'control/attribution', name: 'control-attribution', component: () => import('@/views/control/Attribution.vue'), meta: { title: 'Attribution', category: 'control' } },
      { path: 'control/full-screen', name: 'control-fullscreen', component: () => import('@/views/control/FullScreen.vue'), meta: { title: 'FullScreen', category: 'control' } },
      { path: 'control/mousePosition', name: 'control-mouse-position', component: () => import('@/views/control/MousePosition.vue'), meta: { title: 'MousePosition', category: 'control' } },
      { path: 'control/overviewMap', name: 'control-overview-map', component: () => import('@/views/control/OverviewMap.vue'), meta: { title: 'OverviewMap', category: 'control' } },
      { path: 'control/rotate', name: 'control-rotate', component: () => import('@/views/control/Rotate.vue'), meta: { title: 'Rotate', category: 'control' } },
      { path: 'control/scale-line', name: 'control-scale-line', component: () => import('@/views/control/ScaleLine.vue'), meta: { title: 'ScaleLine', category: 'control' } },
      { path: 'control/zoom', name: 'control-zoom', component: () => import('@/views/control/Zoom.vue'), meta: { title: 'Zoom', category: 'control' } },
      { path: 'control/zoom-slider', name: 'control-zoom-slider', component: () => import('@/views/control/ZoomSlider.vue'), meta: { title: 'ZoomSlider', category: 'control' } },
      { path: 'control/zoom-to-extent', name: 'control-zoom-to-extent', component: () => import('@/views/control/ZoomToExtent.vue'), meta: { title: 'ZoomToExtent', category: 'control' } },

      // Interaction - 交互
      { path: 'interaction/interaction', name: 'interaction-base', component: () => import('@/views/interaction/Interaction.vue'), meta: { title: 'Interaction', category: 'interaction' } },
      { path: 'interaction/defaults', name: 'interaction-defaults', component: () => import('@/views/interaction/Defaults.vue'), meta: { title: 'defaults', category: 'interaction' } },
      { path: 'interaction/draw', name: 'interaction-draw', component: () => import('@/views/interaction/Draw.vue'), meta: { title: 'Draw', category: 'interaction' } },
      { path: 'interaction/modify', name: 'interaction-modify', component: () => import('@/views/interaction/Modify.vue'), meta: { title: 'Modify', category: 'interaction' } },
      { path: 'interaction/select', name: 'interaction-select', component: () => import('@/views/interaction/Select.vue'), meta: { title: 'Select', category: 'interaction' } },
      { path: 'interaction/snap', name: 'interaction-snap', component: () => import('@/views/interaction/Snap.vue'), meta: { title: 'Snap', category: 'interaction' } },
      { path: 'interaction/translate', name: 'interaction-translate', component: () => import('@/views/interaction/Translate.vue'), meta: { title: 'Translate', category: 'interaction' } },
      { path: 'interaction/doubleClickZoom', name: 'interaction-double-click-zoom', component: () => import('@/views/interaction/DoubleClickZoom.vue'), meta: { title: 'DoubleClickZoom', category: 'interaction' } },
      { path: 'interaction/dragAndDrop', name: 'interaction-drag-and-drop', component: () => import('@/views/interaction/DragAndDrop.vue'), meta: { title: 'DragAndDrop', category: 'interaction' } },
      { path: 'interaction/dragBox', name: 'interaction-drag-box', component: () => import('@/views/interaction/DragBox.vue'), meta: { title: 'DragBox', category: 'interaction' } },
      { path: 'interaction/dragPan', name: 'interaction-drag-pan', component: () => import('@/views/interaction/DragPan.vue'), meta: { title: 'DragPan', category: 'interaction' } },
      { path: 'interaction/dragRotate', name: 'interaction-drag-rotate', component: () => import('@/views/interaction/DragRotate.vue'), meta: { title: 'DragRotate', category: 'interaction' } },
      { path: 'interaction/dragRotateAndZoom', name: 'interaction-drag-rotate-zoom', component: () => import('@/views/interaction/DragRotateAndZoom.vue'), meta: { title: 'DragRotateAndZoom', category: 'interaction' } },
      { path: 'interaction/dragZoom', name: 'interaction-drag-zoom', component: () => import('@/views/interaction/DragZoom.vue'), meta: { title: 'DragZoom', category: 'interaction' } },
      { path: 'interaction/keyboardPan', name: 'interaction-keyboard-pan', component: () => import('@/views/interaction/KeyboardPan.vue'), meta: { title: 'KeyboardPan', category: 'interaction' } },
      { path: 'interaction/keyboardZoom', name: 'interaction-keyboard-zoom', component: () => import('@/views/interaction/KeyboardZoom.vue'), meta: { title: 'KeyboardZoom', category: 'interaction' } },
      { path: 'interaction/mouseWheelZoom', name: 'interaction-mouse-wheel-zoom', component: () => import('@/views/interaction/MouseWheelZoom.vue'), meta: { title: 'MouseWheelZoom', category: 'interaction' } },
      { path: 'interaction/pinchRotate', name: 'interaction-pinch-rotate', component: () => import('@/views/interaction/PinchRotate.vue'), meta: { title: 'PinchRotate', category: 'interaction' } },
      { path: 'interaction/pinchZoom', name: 'interaction-pinch-zoom', component: () => import('@/views/interaction/PinchZoom.vue'), meta: { title: 'PinchZoom', category: 'interaction' } },
      { path: 'interaction/pointer', name: 'interaction-pointer', component: () => import('@/views/interaction/Pointer.vue'), meta: { title: 'Pointer', category: 'interaction' } },
      { path: 'interaction/link', name: 'interaction-link', component: () => import('@/views/interaction/Link.vue'), meta: { title: 'Link', category: 'interaction' } },

      // Overlay - 覆盖物
      {
        path: 'overlay',
        name: 'overlay',
        component: () => import('@/views/overlay/Index.vue'),
        meta: { title: 'Overlay - 覆盖物', category: 'overlay' }
      },

      // Proj - 投影
      { path: 'proj/projection', name: 'proj-projection', component: () => import('@/views/proj/Projection.vue'), meta: { title: 'Projection', category: 'proj' } },
      { path: 'proj/projections', name: 'proj-projections', component: () => import('@/views/proj/Projections.vue'), meta: { title: 'projections', category: 'proj' } },
      { path: 'proj/transforms', name: 'proj-transforms', component: () => import('@/views/proj/Transforms.vue'), meta: { title: 'transforms', category: 'proj' } },
      { path: 'proj/epsg4326', name: 'proj-epsg4326', component: () => import('@/views/proj/EPSG4326.vue'), meta: { title: 'EPSG:4326', category: 'proj' } },
      { path: 'proj/epsg3857', name: 'proj-epsg3857', component: () => import('@/views/proj/EPDG3857.vue'), meta: { title: 'EPSG:3857', category: 'proj' } },

      // Format - 格式
      { path: 'format/feature', name: 'format-feature', component: () => import('@/views/format/Feature.vue'), meta: { title: 'FeatureFormat', category: 'format' } },
      { path: 'format/geojson', name: 'format-geojson', component: () => import('@/views/format/GeoJSON.vue'), meta: { title: 'GeoJSON', category: 'format' } },
      { path: 'format/gml2', name: 'format-gml2', component: () => import('@/views/format/GML2.vue'), meta: { title: 'GML2', category: 'format' } },
      { path: 'format/gml3', name: 'format-gml3', component: () => import('@/views/format/GML3.vue'), meta: { title: 'GML3', category: 'format' } },
      { path: 'format/gmlBase', name: 'format-gml-base', component: () => import('@/views/format/GMLBase.vue'), meta: { title: 'GMLBase', category: 'format' } },
      { path: 'format/gpx', name: 'format-gpx', component: () => import('@/views/format/GPX.vue'), meta: { title: 'GPX', category: 'format' } },
      { path: 'format/igs', name: 'format-igs', component: () => import('@/views/format/IGS.vue'), meta: { title: 'IGS', category: 'format' } },
      { path: 'format/iiif', name: 'format-iiif', component: () => import('@/views/format/IIIF.vue'), meta: { title: 'IIIF', category: 'format' } },
      { path: 'format/jsonFeature', name: 'format-json-feature', component: () => import('@/views/format/JSONFeature.vue'), meta: { title: 'JSONFeature', category: 'format' } },
      { path: 'format/kml', name: 'format-kml', component: () => import('@/views/format/KML.vue'), meta: { title: 'KML', category: 'format' } },
      { path: 'format/mvt', name: 'format-mvt', component: () => import('@/views/format/MVT.vue'), meta: { title: 'MVT', category: 'format' } },
      { path: 'format/osmxml', name: 'format-osmxml', component: () => import('@/views/format/OSMXML.vue'), meta: { title: 'OSMXML', category: 'format' } },
      { path: 'format/pbf', name: 'format-pbf', component: () => import('@/views/format/PBF.vue'), meta: { title: 'PBF', category: 'format' } },
      { path: 'format/polyline', name: 'format-polyline', component: () => import('@/views/format/Polyline.vue'), meta: { title: 'Polyline', category: 'format' } },
      { path: 'format/topojson', name: 'format-topojson', component: () => import('@/views/format/TopoJSON.vue'), meta: { title: 'TopoJSON', category: 'format' } },
      { path: 'format/wfs', name: 'format-wfs', component: () => import('@/views/format/WFS.vue'), meta: { title: 'WFS', category: 'format' } },
      { path: 'format/wkb', name: 'format-wkb', component: () => import('@/views/format/WKB.vue'), meta: { title: 'WKB', category: 'format' } },
      { path: 'format/wkt', name: 'format-wkt', component: () => import('@/views/format/WKT.vue'), meta: { title: 'WKT', category: 'format' } },
      { path: 'format/wmsCapabilities', name: 'format-wms-capabilities', component: () => import('@/views/format/WMSCapabilities.vue'), meta: { title: 'WMSCapabilities', category: 'format' } },
      { path: 'format/wmsGetFeatureInfo', name: 'format-wms-get-feature-info', component: () => import('@/views/format/WMSGetFeatureInfo.vue'), meta: { title: 'WMSGetFeatureInfo', category: 'format' } },
      { path: 'format/wmtsCapabilities', name: 'format-wmts-capabilities', component: () => import('@/views/format/WMTSCapabilities.vue'), meta: { title: 'WMTSCapabilities', category: 'format' } },
      { path: 'format/xsd', name: 'format-xsd', component: () => import('@/views/format/XSD.vue'), meta: { title: 'XSD', category: 'format' } },

      // Renderer - 渲染器
      { path: 'renderer/vector', name: 'renderer-vector', component: () => import('@/views/renderer/Vector.vue'), meta: { title: 'VectorRenderer', category: 'renderer' } },
      { path: 'renderer/canvas', name: 'renderer-canvas', component: () => import('@/views/renderer/Canvas.vue'), meta: { title: 'Canvas', category: 'renderer' } },
      { path: 'renderer/webgl', name: 'renderer-webgl', component: () => import('@/views/renderer/WebGL.vue'), meta: { title: 'WebGL', category: 'renderer' } },

      // Other - 其他
      { path: 'other/center', name: 'other-center', component: () => import('@/views/other/Center.vue'), meta: { title: 'center', category: 'other' } },
      { path: 'other/coordinate', name: 'other-coordinate', component: () => import('@/views/other/Coordinate.vue'), meta: { title: 'coordinate', category: 'other' } },
      { path: 'other/extent', name: 'other-extent', component: () => import('@/views/other/Extent.vue'), meta: { title: 'extent', category: 'other' } },
      { path: 'other/size', name: 'other-size', component: () => import('@/views/other/Size.vue'), meta: { title: 'size', category: 'other' } },
      { path: 'other/pixel', name: 'other-pixel', component: () => import('@/views/other/Pixel.vue'), meta: { title: 'pixel', category: 'other' } },
      { path: 'other/bounding', name: 'other-bounding', component: () => import('@/views/other/Bounding.vue'), meta: { title: 'bounding', category: 'other' } },
      { path: 'other/array', name: 'other-array', component: () => import('@/views/other/Array.vue'), meta: { title: 'array', category: 'other' } },
      { path: 'other/asserts', name: 'other-asserts', component: () => import('@/views/other/Asserts.vue'), meta: { title: 'asserts', category: 'other' } },
      { path: 'other/collection', name: 'other-collection', component: () => import('@/views/other/Collection.vue'), meta: { title: 'Collection', category: 'other' } },
      { path: 'other/color', name: 'other-color', component: () => import('@/views/other/Color.vue'), meta: { title: 'color', category: 'other' } },
      { path: 'other/dom', name: 'other-dom', component: () => import('@/views/other/DOM.vue'), meta: { title: 'DOM', category: 'other' } },
      { path: 'other/events', name: 'other-events', component: () => import('@/views/other/Events.vue'), meta: { title: 'events', category: 'other' } },
      { path: 'other/featureloader', name: 'other-feature-loader', component: () => import('@/views/other/FeatureLoader.vue'), meta: { title: 'featureloader', category: 'other' } },
      { path: 'other/geolocation', name: 'other-geolocation', component: () => import('@/views/other/Geolocation.vue'), meta: { title: 'Geolocation', category: 'other' } },
      { path: 'other/has', name: 'other-has', component: () => import('@/views/other/Has.vue'), meta: { title: 'has', category: 'other' } },
      { path: 'other/layergroup', name: 'other-layergroup', component: () => import('@/views/other/LayerGroup.vue'), meta: { title: 'LayerGroup', category: 'other' } },
      { path: 'object', name: 'object', component: () => import('@/views/other/Object.vue'), meta: { title: 'Object', category: 'other' } },
      { path: 'other/observable', name: 'other-observable', component: () => import('@/views/other/Observable.vue'), meta: { title: 'Observable', category: 'other' } },
      { path: 'other/ol', name: 'other-ol', component: () => import('@/views/other/Ol.vue'), meta: { title: 'ol', category: 'other' } },
      { path: 'other/reproj', name: 'other-reproj', component: () => import('@/views/other/Reproj.vue'), meta: { title: 'reproj', category: 'other' } },
      { path: 'other/rotation', name: 'other-rotation', component: () => import('@/views/other/Rotation.vue'), meta: { title: 'rotation', category: 'other' } },
      { path: 'other/string', name: 'other-string', component: () => import('@/views/other/String.vue'), meta: { title: 'string', category: 'other' } },
      { path: 'other/tile', name: 'other-tile', component: () => import('@/views/other/Tile.vue'), meta: { title: 'Tile', category: 'other' } },
      { path: 'other/tilecache', name: 'other-tilecache', component: () => import('@/views/other/TileCache.vue'), meta: { title: 'TileCache', category: 'other' } },
      { path: 'other/tilegrid', name: 'other-tilegrid', component: () => import('@/views/other/TileGrid.vue'), meta: { title: 'TileGrid', category: 'other' } },
      { path: 'other/tileurlfunction', name: 'other-tileurlfunction', component: () => import('@/views/other/TileUrlFunction.vue'), meta: { title: 'tileUrlFunction', category: 'other' } },
      { path: 'other/vecortileutills', name: 'other-vector-tile-utils', component: () => import('@/views/other/VectorTileUtils.vue'), meta: { title: 'VectorTileUtils', category: 'other' } },
      { path: 'other/xml', name: 'other-xml', component: () => import('@/views/other/XML.vue'), meta: { title: 'XML', category: 'other' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
