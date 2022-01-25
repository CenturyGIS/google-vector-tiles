'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/*
 *  Created by Jes�s Barrio on 04/2021
 *  Updated by Anne Canoune on 08/27/2021
 */
var _require = require('vector-tile'),
    VectorTile = _require.VectorTile;

var Pbf = require('pbf');

var mercator = require('../lib/mercator/Mercator');

var MVTLayer = require('./MVTLayer');

var MVTSource = /*#__PURE__*/function () {
  function MVTSource(map, options) {
    _classCallCheck(this, MVTSource);

    var self = this;
    this.map = map;
    this._url = options.url || ''; // Url TO Vector Tile Source,

    this._sourceMaxZoom = options.sourceMaxZoom || false; // Source maxzoom to enable overzoom

    this._debug = options.debug || false; // Draw tiles lines and ids

    this.getIDForLayerFeature = options.getIDForLayerFeature || function (feature) {
      return feature.properties.id || feature.properties.Id || feature.properties.ID;
    };

    this._visibleLayers = options.visibleLayers || false; // List of visible layers

    this._xhrHeaders = options.xhrHeaders || {}; // Headers added to every url request

    this._clickableLayers = options.clickableLayers || false; // List of layers that are clickable

    this._filter = options.filter || false; // Filter features

    this._cache = options.cache || false; // Load tiles in cache to avoid duplicated requests

    this._tileSize = options.tileSize || 256; // Default tile size

    this.tileSize = new google.maps.Size(this._tileSize, this._tileSize);

    this.style = options.style || function (feature) {
      var style = {};

      switch (feature.type) {
        case 1:
          // 'Point'
          style.fillStyle = 'rgba(49,79,79,1)';
          style.radius = 5;
          style.selected = {
            fillStyle: 'rgba(255,255,0,0.5)',
            radius: 6
          };
          break;

        case 2:
          // 'LineString'
          style.strokeStyle = 'rgba(136, 86, 167, 1)';
          style.lineWidth = 3;
          style.selected = {
            strokeStyle: 'rgba(255,25,0,0.5)',
            lineWidth: 4
          };
          break;

        case 3:
          // 'Polygon'
          style.fillStyle = 'rgba(188, 189, 220, 0.5)';
          style.strokeStyle = 'rgba(136, 86, 167, 1)';
          style.lineWidth = 1;
          style.selected = {
            fillStyle: 'rgba(255,140,0,0.3)',
            strokeStyle: 'rgba(255,140,0,1)',
            lineWidth: 2
          };
          break;
        // no default
      }

      return style;
    };

    this.mVTLayers = []; // Keep a list of the layers contained in the PBFs

    this._tilesDrawn = []; //  List of tiles drawn  (when cache enabled)

    this._visibleTiles = []; // tiles currently in the viewport

    this._selectedFeatures = []; // list of selected features

    if (options.selectedFeatures) {
      this.setSelectedFeatures(options.selectedFeatures);
    }

    this.map.addListener('zoom_changed', function () {
      self._zoomChanged();
    });
  }

  _createClass(MVTSource, [{
    key: "getTile",
    value: function getTile(coord, zoom, ownerDocument) {
      var tileContext = this.drawTile(coord, zoom, ownerDocument);

      this._setVisibleTile(tileContext);

      return tileContext.canvas;
    } // eslint-disable-next-line no-unused-vars

  }, {
    key: "releaseTile",
    value: function releaseTile(canvas) {// this._deleteVisibleTile(canvas.id);
    }
  }, {
    key: "_zoomChanged",
    value: function _zoomChanged() {
      this._resetVisibleTiles();

      if (!this._cache) {
        this._resetMVTLayers();
      }
    }
  }, {
    key: "_resetMVTLayers",
    value: function _resetMVTLayers() {
      this.mVTLayers = [];
    }
  }, {
    key: "_deleteVisibleTile",
    value: function _deleteVisibleTile(id) {
      delete this._visibleTiles[id];
    }
  }, {
    key: "_resetVisibleTiles",
    value: function _resetVisibleTiles() {
      this._visibleTiles = [];
    }
  }, {
    key: "_setVisibleTile",
    value: function _setVisibleTile(tileContext) {
      this._visibleTiles[tileContext.id] = tileContext;
    }
  }, {
    key: "drawTile",
    value: function drawTile(coord, zoom, ownerDocument) {
      var id = this.getTileId(zoom, coord.x, coord.y);
      var tileContext = this._tilesDrawn[id];

      if (tileContext) {
        return tileContext;
      }

      tileContext = this._createTileContext(coord, zoom, ownerDocument);

      this._xhrRequest(tileContext);

      return tileContext;
    }
  }, {
    key: "_createTileContext",
    value: function _createTileContext(coord, zoom, ownerDocument) {
      var id = this.getTileId(zoom, coord.x, coord.y);

      var canvas = this._createCanvas(ownerDocument, id);

      var parentId = this._getParentId(id);

      return {
        id: id,
        canvas: canvas,
        zoom: zoom,
        tileSize: this._tileSize,
        parentId: parentId
      };
    }
  }, {
    key: "_getParentId",
    value: function _getParentId(id) {
      var parentId = false;

      if (this._sourceMaxZoom) {
        var tile = this.getTileObject(id);

        if (tile.zoom > this._sourceMaxZoom) {
          var zoomDistance = tile.zoom - this._sourceMaxZoom;
          var zoom = tile.zoom - zoomDistance;
          var x = tile.x > zoomDistance;
          var y = tile.y > zoomDistance;
          parentId = this.getTileId(zoom, x, y);
        }
      }

      return parentId;
    }
  }, {
    key: "_createCanvas",
    value: function _createCanvas(ownerDocument, id) {
      var canvas = ownerDocument.createElement('canvas');
      canvas.width = this._tileSize;
      canvas.height = this._tileSize;
      canvas.id = id;
      return canvas;
    }
  }, {
    key: "getTileId",
    value: function getTileId(zoom, x, y) {
      return [zoom, x, y].join(':');
    }
  }, {
    key: "getTileObject",
    value: function getTileObject(id) {
      var values = id.split(':');
      return {
        zoom: values[0],
        x: values[1],
        y: values[2]
      };
    }
  }, {
    key: "_xhrRequest",
    value: function _xhrRequest(tileContext) {
      var self = this;
      var id = tileContext.parentId || tileContext.id;
      var tile = this.getTileObject(id);

      var src = this._url.replace('{z}', tile.zoom).replace('{x}', tile.x).replace('{y}', tile.y);

      var xmlHttpRequest = new XMLHttpRequest();

      xmlHttpRequest.onload = function () {
        if (xmlHttpRequest.status === '200' && xmlHttpRequest.response) {
          return self._xhrResponseOk(tileContext, xmlHttpRequest.response);
        }

        self._drawDebugInfo(tileContext);
      };

      xmlHttpRequest.open('GET', src, true);

      for (var header in this._xhrHeaders) {
        xmlHttpRequest.setRequestHeader(header, this._xhrHeaders[header]);
      }

      xmlHttpRequest.responseType = 'arraybuffer';
      xmlHttpRequest.send();
    }
  }, {
    key: "_xhrResponseOk",
    value: function _xhrResponseOk(tileContext, response) {
      if (this.map.getZoom() !== tileContext.zoom) {
        return;
      }

      var uint8Array = new Uint8Array(response);
      var pbf = new Pbf(uint8Array);
      var vectorTile = new VectorTile(pbf);

      this._drawVectorTile(vectorTile, tileContext);
    }
  }, {
    key: "_setTileDrawn",
    value: function _setTileDrawn(tileContext) {
      if (!this._cache) return;
      this._tilesDrawn[tileContext.id] = tileContext;
    }
  }, {
    key: "deleteTileDrawn",
    value: function deleteTileDrawn(id) {
      delete this._tilesDrawn[id];
    }
  }, {
    key: "_resetTileDrawn",
    value: function _resetTileDrawn() {
      this._tilesDrawn = [];
    }
  }, {
    key: "_drawVectorTile",
    value: function _drawVectorTile(vectorTile, tileContext) {
      if (this._visibleLayers) {
        for (var i = 0, length = this._visibleLayers.length; i < length; i++) {
          var key = this._visibleLayers[i];

          if (vectorTile.layers[key]) {
            var vectorTileLayer = vectorTile.layers[key];

            this._drawVectorTileLayer(vectorTileLayer, key, tileContext);
          }
        }
      } else {
        for (var key in vectorTile.layers) {
          var vectorTileLayer = vectorTile.layers[key];

          this._drawVectorTileLayer(vectorTileLayer, key, tileContext);
        }
      }

      tileContext.vectorTile = vectorTile;

      this._drawDebugInfo(tileContext);

      this._setTileDrawn(tileContext);
    }
  }, {
    key: "_drawVectorTileLayer",
    value: function _drawVectorTileLayer(vectorTileLayer, key, tileContext) {
      if (!this.mVTLayers[key]) {
        this.mVTLayers[key] = this._createMVTLayer(key);
      }

      var mVTLayer = this.mVTLayers[key];
      mVTLayer.parseVectorTileFeatures(this, vectorTileLayer.parsedFeatures, tileContext);
    }
  }, {
    key: "_createMVTLayer",
    value: function _createMVTLayer(key) {
      var options = {
        getIDForLayerFeature: this.getIDForLayerFeature,
        filter: this._filter,
        style: this.style,
        name: key
      };
      return new MVTLayer(options);
    }
  }, {
    key: "_drawDebugInfo",
    value: function _drawDebugInfo(tileContext) {
      if (!this._debug) return;
      var tile = this.getTileObject(tileContext.id);
      var width = this._tileSize;
      var height = this._tileSize;
      var context2d = tileContext.canvas.getContext('2d');
      context2d.strokeStyle = '#000000';
      context2d.fillStyle = '#FFFF00';
      context2d.strokeRect(0, 0, width, height);
      context2d.font = '12px Arial';
      context2d.fillRect(0, 0, 5, 5);
      context2d.fillRect(0, height - 5, 5, 5);
      context2d.fillRect(width - 5, 0, 5, 5);
      context2d.fillRect(width - 5, height - 5, 5, 5);
      context2d.fillRect(width / 2 - 5, height / 2 - 5, 10, 10);
      context2d.strokeText("".concat(tileContext.zoom, " ").concat(tile.x, " ").concat(tile.y), width / 2 - 30, height / 2 - 10);
    }
  }, {
    key: "onClick",
    value: function onClick(event, callbackFunction, options) {
      this._multipleSelection = options && options.multipleSelection || false;
      options = this._getMouseOptions(options, false);

      this._mouseEvent(event, callbackFunction, options);
    }
  }, {
    key: "onMouseHover",
    value: function onMouseHover(event, callbackFunction, options) {
      this._multipleSelection = false;
      options = this._getMouseOptions(options, true);

      this._mouseEvent(event, callbackFunction, options);
    }
  }, {
    key: "_getMouseOptions",
    value: function _getMouseOptions(options, mouseHover) {
      return {
        mouseHover: mouseHover,
        setSelected: options.setSelected || false,
        toggleSelection: options.toggleSelection === undefined || options.toggleSelection
      };
    }
  }, {
    key: "_mouseEvent",
    value: function _mouseEvent(event, callbackFunction, options) {
      if (!event.pixel || !event.latLng) return;

      callbackFunction = callbackFunction || function () {};

      var zoom = this.map.getZoom();
      var tile = mercator.getTileAtLatLng(event.latLng, zoom);
      var id = this.getTileId(tile.z, tile.x, tile.y);
      var tileContext = this._visibleTiles[id];

      if (!tileContext) {
        return;
      }

      event.tileContext = tileContext;
      event.tilePoint = mercator.fromLatLngToTilePoint(this.map, event);
      var clickableLayers = this._clickableLayers || Object.keys(this.mVTLayers) || [];

      for (var i = 0, length = clickableLayers.length; i < length; i++) {
        var key = clickableLayers[i];
        var layer = this.mVTLayers[key];

        if (layer) {
          var event = layer.handleClickEvent(event);

          this._mouseSelectedFeature(event, callbackFunction, options);
        }
      }
    }
  }, {
    key: "_mouseSelectedFeature",
    value: function _mouseSelectedFeature(event, callbackFunction, options) {
      if (options.setSelected) {
        var feature = event.feature;

        if (feature) {
          if (options.mouseHover) {
            if (!feature.selected) {
              feature.select();
            }
          } else if (options.toggleSelection) {
            feature.toggle();
          } else if (!feature.selected) {
            feature.select();
          }
        } else if (options.mouseHover) {
          this.deselectAllFeatures();
        }
      }

      callbackFunction(event);
    }
  }, {
    key: "deselectAllFeatures",
    value: function deselectAllFeatures() {
      var zoom = this.map.getZoom();
      var tilesToRedraw = [];

      for (var featureId in this._selectedFeatures) {
        var mVTFeature = this._selectedFeatures[featureId];
        if (!mVTFeature) continue;
        mVTFeature.setSelected(false);
        var tiles = mVTFeature.getTiles();

        for (var id in tiles) {
          this.deleteTileDrawn(id);
          var idObject = this.getTileObject(id);

          if (idObject.zoom == zoom) {
            tilesToRedraw[id] = true;
          }
        }
      }

      this.redrawTiles(tilesToRedraw);
      this._selectedFeatures = [];
    }
  }, {
    key: "featureSelected",
    value: function featureSelected(mVTFeature) {
      if (!this._multipleSelection) {
        this.deselectAllFeatures();
      }

      this._selectedFeatures[mVTFeature.featureId] = mVTFeature;
    }
  }, {
    key: "featureDeselected",
    value: function featureDeselected(mvtFeature) {
      delete this._selectedFeatures[mvtFeature.featureId];
    }
  }, {
    key: "setSelectedFeatures",
    value: function setSelectedFeatures(featuresIds) {
      if (featuresIds.length > 1) {
        this._multipleSelection = true;
      }

      this.deselectAllFeatures();

      for (var i = 0, length = featuresIds.length; i < length; i++) {
        var featureId = featuresIds[i];
        this._selectedFeatures[featureId] = false;

        for (var key in this.mVTLayers) {
          this.mVTLayers[key].setSelected(featureId);
        }
      }
    }
  }, {
    key: "isFeatureSelected",
    value: function isFeatureSelected(featureId) {
      return this._selectedFeatures[featureId] != undefined;
    }
  }, {
    key: "getSelectedFeatures",
    value: function getSelectedFeatures() {
      var selectedFeatures = [];

      for (var featureId in this._selectedFeatures) {
        selectedFeatures.push(this._selectedFeatures[featureId]);
      }

      return selectedFeatures;
    }
  }, {
    key: "setFilter",
    value: function setFilter(filter, redrawTiles) {
      redrawTiles = redrawTiles === undefined || redrawTiles;
      this._filter = filter;

      for (var key in this.mVTLayers) {
        this.mVTLayers[key].setFilter(filter);
      }

      if (redrawTiles) {
        this.redrawAllTiles();
      }
    }
  }, {
    key: "setStyle",
    value: function setStyle(style, redrawTiles) {
      redrawTiles = redrawTiles === undefined || redrawTiles;
      this.style = style;

      for (var key in this.mVTLayers) {
        this.mVTLayers[key].setStyle(style);
      }

      if (redrawTiles) {
        this.redrawAllTiles();
      }
    }
  }, {
    key: "setVisibleLayers",
    value: function setVisibleLayers(visibleLayers, redrawTiles) {
      redrawTiles = redrawTiles === undefined || redrawTiles;
      this._visibleLayers = visibleLayers;

      if (redrawTiles) {
        this.redrawAllTiles();
      }
    }
  }, {
    key: "getVisibleLayers",
    value: function getVisibleLayers() {
      return this._visibleLayers;
    }
  }, {
    key: "setClickableLayers",
    value: function setClickableLayers(clickableLayers) {
      this._clickableLayers = clickableLayers;
    }
  }, {
    key: "redrawAllTiles",
    value: function redrawAllTiles() {
      this._resetTileDrawn();

      this.redrawTiles(this._visibleTiles);
    }
  }, {
    key: "redrawTiles",
    value: function redrawTiles(tiles) {
      for (var id in tiles) {
        this.redrawTile(id);
      }
    }
  }, {
    key: "redrawTile",
    value: function redrawTile(id) {
      this.deleteTileDrawn(id);
      var tileContext = this._visibleTiles[id];
      if (!tileContext || !tileContext.vectorTile) return;
      this.clearTile(tileContext.canvas);

      this._drawVectorTile(tileContext.vectorTile, tileContext);
    }
  }, {
    key: "clearTile",
    value: function clearTile(canvas) {
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, {
    key: "setUrl",
    value: function setUrl(url, redrawTiles) {
      redrawTiles = redrawTiles === undefined || redrawTiles;
      this._url = url;

      this._resetMVTLayers();

      if (redrawTiles) {
        this.redrawAllTiles();
      }
    }
  }]);

  return MVTSource;
}();

module.exports = MVTSource;
