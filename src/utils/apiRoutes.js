/**
 * OpenLayers API 路由映射
 * 用于实现 API 类型之间的点击跳转功能
 */

export const apiRouteMap = {
  // ===== Source 数据源 =====
  'VectorSource': '/source/vector',
  'VectorTileSource': '/source/vector-tile',
  'TileSource': '/source/tile',
  'TileImage': '/source/tile-image',
  'TileWMS': '/source/tile-wms',
  'TileArcGISRest': '/source/tile-arcgis-rest',
  'TileDebug': '/source/tile-debug',
  'ImageSource': '/source/image',
  'ImageArcGISRest': '/source/image-arcgis-rest',
  'ImageCanvas': '/source/image-canvas',
  'ImageMapGuide': '/source/image-map-guide',
  'ImageStatic': '/source/image-static',
  'ImageWMS': '/source/image-wms',
  'GeoJSON': '/source/geojson',
  'OSM': '/source/osm',
  'XYZ': '/source/xyz',
  'WMTS': '/source/wmts',
  'Zoomify': '/source/zoomify',
  'Cluster': '/source/cluster',
  'BingMaps': '/source/bingmaps',
  'Google': '/source/google',
  'Raster': '/source/raster',
  'Source': '/source/source',
  'Url': '/source/url',
  'Graticule': '/source/graticule',

  // ===== Layer 图层 =====
  'VectorLayer': '/layer/vector',
  'VectorImageLayer': '/layer/vector-image',
  'VectorTileLayer': '/layer/vector-tile',
  'TileLayer': '/layer/tile',
  'ImageLayer': '/layer/image',
  'HeatmapLayer': '/layer/heatmap',
  'GraticuleLayer': '/layer/graticule',
  'WebGLTileLayer': '/layer/webgl-tile',
  'BaseLayer': '/layer/base',
  'Layer': '/layer/base',

  // ===== View 视图 =====
  'View': '/view',

  // ===== Map 地图 =====
  'Map': '/map',

  // ===== Geometry 几何 =====
  'Geometry': '/geometry/geometry',
  'Point': '/geometry/point',
  'LineString': '/geometry/linestring',
  'LinearRing': '/geometry/linearRing',
  'Polygon': '/geometry/polygon',
  'MultiPoint': '/geometry/multipoint',
  'MultiLineString': '/geometry/multilinestring',
  'MultiPolygon': '/geometry/multipolygon',
  'Circle': '/geometry/circle',
  'GeometryCollection': '/geometry/geometryCollection',
  'SimpleGeometry': '/geometry/simpleGeometry',

  // ===== Feature 要素 =====
  'Feature': '/feature/feature',
  'FeatureVector': '/feature/featureVector',

  // ===== Style 样式 =====
  'Style': '/style/style',
  'Icon': '/style/icon',
  'IconImage': '/style/iconImage',
  'ImageStyle': '/style/image',
  'RegularShape': '/style/regularShape',
  'CircleStyle': '/style/circle',
  'Fill': '/style/fill',
  'Stroke': '/style/stroke',
  'Text': '/style/text',
  'TextPlacement': '/style/textPlacement',

  // ===== Control 控件 =====
  'Control': '/control/control',
  'Attribution': '/control/attribution',
  'FullScreen': '/control/full-screen',
  'MousePosition': '/control/mousePosition',
  'OverviewMap': '/control/overviewMap',
  'Rotate': '/control/rotate',
  'ScaleLine': '/control/scale-line',
  'Zoom': '/control/zoom',
  'ZoomSlider': '/control/zoom-slider',
  'ZoomToExtent': '/control/zoom-to-extent',

  // ===== Interaction 交互 =====
  'Interaction': '/interaction/interaction',
  'Draw': '/interaction/draw',
  'Modify': '/interaction/modify',
  'Select': '/interaction/select',
  'Snap': '/interaction/snap',
  'Translate': '/interaction/translate',
  'DoubleClickZoom': '/interaction/doubleClickZoom',
  'DragAndDrop': '/interaction/dragAndDrop',
  'DragBox': '/interaction/dragBox',
  'DragPan': '/interaction/dragPan',
  'DragRotate': '/interaction/dragRotate',
  'DragRotateAndZoom': '/interaction/dragRotateAndZoom',
  'DragZoom': '/interaction/dragZoom',
  'KeyboardPan': '/interaction/keyboardPan',
  'KeyboardZoom': '/interaction/keyboardZoom',
  'MouseWheelZoom': '/interaction/mouseWheelZoom',
  'PinchRotate': '/interaction/pinchRotate',
  'PinchZoom': '/interaction/pinchZoom',
  'Pointer': '/interaction/pointer',
  'Link': '/interaction/link',

  // ===== Proj 投影 =====
  'Projection': '/proj/projection',
  'Projections': '/proj/projections',
  'Transforms': '/proj/transforms',

  // ===== Format 格式 =====
  'FeatureFormat': '/format/feature',
  'GeoJSONFormat': '/format/geojson',
  'GML2': '/format/gml2',
  'GML3': '/format/gml3',
  'GMLBase': '/format/gml-base',
  'GPX': '/format/gpx',
  'IGS': '/format/igs',
  'IIIF': '/format/iiif',
  'JSONFeature': '/format/jsonFeature',
  'KML': '/format/kml',
  'MVT': '/format/mvt',
  'OSMXML': '/format/osmxml',
  'PBF': '/format/pbf',
  'Polyline': '/format/polyline',
  'TopoJSON': '/format/topojson',
  'WFS': '/format/wfs',
  'WKB': '/format/wkb',
  'WKT': '/format/wkt',
  'WMSCapabilities': '/format/wmsCapabilities',
  'WMSGetFeatureInfo': '/format/wmsGetFeatureInfo',
  'WMTSCapabilities': '/format/wmtsCapabilities',
  'XSD': '/format/xsd',

  // ===== Other 其他 =====
  'Collection': '/other/collection',
  'Events': '/other/events',
  'FeatureLoader': '/other/featureloader',
  'Geolocation': '/other/geolocation',
  'LayerGroup': '/other/layergroup',
  'Object': '/object',
  'Observable': '/other/observable',
  'Tile': '/other/tile',
  'TileCache': '/other/tilecache',
  'TileGrid': '/other/tilegrid',
  'VectorTileUtils': '/other/vecortileutills',

  // ===== Extent/Coordinate/Size 等工具类型 =====
  'Extent': { type: 'concept', description: '范围数组 [minX, minY, maxX, maxY]' },
  'Coordinate': { type: 'concept', description: '坐标数组 [x, y]' },
  'Size': { type: 'concept', description: '尺寸数组 [width, height]' },
  'Pixel': { type: 'concept', description: '像素数组 [x, y]' },
  'Color': { type: 'concept', description: '颜色数组 [r, g, b, a]' },
  'AttributionLike': { type: 'concept', description: '归属信息类型' },
  'ProjectionLike': { type: 'concept', description: '投影类型' },
  'StyleLike': { type: 'concept', description: '样式类型' },
  'LoadFunction': { type: 'concept', description: '加载函数类型' },
  'UrlFunction': { type: 'concept', description: 'URL 函数类型' },
  'FeatureUrlFunction': { type: 'concept', description: '要素 URL 函数类型' },
  'FeatureFormat': { type: 'concept', description: '要素格式类型' },
  'LoadingStrategy': { type: 'concept', description: '加载策略类型' },
  'State': { type: 'concept', description: '状态类型：ready, loading, error' },
  'EventsKey': { type: 'concept', description: '事件键类型' },
  'BaseEvent': { type: 'concept', description: '基础事件类型' },
  'Properties': { type: 'concept', description: '属性对象类型' }
}

/**
 * 检查类型是否有对应的路由
 * @param {string} typeName - 类型名称
 * @returns {boolean}
 */
export function hasRoute(typeName) {
  return apiRouteMap.hasOwnProperty(typeName)
}

/**
 * 获取类型对应的路由
 * @param {string} typeName - 类型名称
 * @returns {string|null}
 */
export function getRoute(typeName) {
  const route = apiRouteMap[typeName]
  if (typeof route === 'string') {
    return route
  }
  return null
}

/**
 * 获取类型信息
 * @param {string} typeName - 类型名称
 * @returns {{route: string|null, isConcept: boolean, description: string|null}}
 */
export function getTypeInfo(typeName) {
  const route = apiRouteMap[typeName]
  if (typeof route === 'string') {
    return { route, isConcept: false, description: null }
  } else if (typeof route === 'object' && route !== null) {
    return {
      route: null,
      isConcept: true,
      description: route.description || null
    }
  }
  return { route: null, isConcept: false, description: null }
}

export default apiRouteMap
