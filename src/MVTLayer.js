/*
 *  Created by Jes�s Barrio on 04/2021
 *  Updated by Anne Canoune on 08/27/2021
 */
const mercator = require('../lib/mercator/Mercator');
const MVTFeature = require('./MVTFeature');

class MVTLayer {
  constructor(options) {
    this._lineClickTolerance = 2;
    this._getIDForLayerFeature = options.getIDForLayerFeature;
    this.style = options.style;
    this.name = options.name;
    this._filter = options.filter || false;
    this._canvasAndFeatures = [];
    this._features = [];
  }

  parseVectorTileFeatures(mVTSource, vectorTileFeatures, tileContext) {
    this._canvasAndFeatures[tileContext.id] = {
      canvas: tileContext.canvas,
      features: []
    };
    for (let i = 0, { length } = vectorTileFeatures; i < length; i++) {
      const vectorTileFeature = vectorTileFeatures[i];
      this._parseVectorTileFeature(mVTSource, vectorTileFeature, tileContext, i);
    }
    this.drawTile(tileContext);
  }

  _parseVectorTileFeature(mVTSource, vectorTileFeature, tileContext, i) {
    if (this._filter && typeof this._filter === 'function') {
      if (this._filter(vectorTileFeature, tileContext) === false) {
        return;
      }
    }

    const style = this.getStyle(vectorTileFeature);
    const featureId = this._getIDForLayerFeature(vectorTileFeature) || i;
    let mVTFeature = this._features[featureId];
    if (!mVTFeature) {
      const selected = mVTSource.isFeatureSelected(featureId);
      const options = {
        mVTSource,
        vectorTileFeature,
        tileContext,
        style,
        selected,
        featureId
      };
      mVTFeature = new MVTFeature(options);
      this._features[featureId] = mVTFeature;
    } else {
      mVTFeature.setStyle(style);
      mVTFeature.addTileFeature(vectorTileFeature, tileContext);
    }
    this._canvasAndFeatures[tileContext.id].features.push(mVTFeature);
  }

  drawTile(tileContext) {
    const { features } = this._canvasAndFeatures[tileContext.id];
    if (!features) return;
    const selectedFeatures = [];

    for (let i = 0, { length } = features; i < length; i++) {
      const feature = features[i];
      if (feature.selected) {
        selectedFeatures.push(feature);
      } else {
        feature.draw(tileContext);
      }
    }
    for (let i = 0, { length } = selectedFeatures; i < length; i++) {
      selectedFeatures[i].draw(tileContext);
    }
  }

  getCanvas(id) {
    return this._canvasAndFeatures[id].canvas;
  }

  getStyle(feature) {
    if (typeof this.style === 'function') {
      return this.style(feature);
    }
    return this.style;
  }

  setStyle(style) {
    this.style = style;
    // eslint-disable-next-line no-restricted-syntax
    for (const featureId in this._features) {
      if (Object.prototype.hasOwnProperty.call(this._features, featureId)) {
        this._features[featureId].setStyle(style);
      }
    }
    // Original code
    // for (const featureId in this._features) {
    //   this._features[featureId].setStyle(style);
    // }
  }

  setSelected(featureId) {
    if (this._features[featureId] !== undefined) {
      this._features[featureId].select();
    }
  }

  setFilter(filter) {
    this._filter = filter;
  }

  handleClickEvent(event) {
    const canvasAndFeatures = this._canvasAndFeatures[event.tileContext.id];
    if (!canvasAndFeatures) return event;
    const { canvas } = canvasAndFeatures;
    const { features } = canvasAndFeatures;

    if (!canvas || !features) {
      return event;
    }
    // eslint-disable-next-line no-param-reassign
    event.feature = this._handleClickGetFeature(event, features);
    return event;
  }

  _getLineThickness(feature) {
    let thickness = null;
    if (this.feature.selected && feature.style.selected) {
      thickness = feature.style.selected.lineWidth;
    } else {
      thickness = feature.style.lineWidth;
    }
    return thickness;
  }

  _handleClickGetFeature(event, features) {
    let minDistance = Number.POSITIVE_INFINITY;
    let selectedFeature = null;

    for (let i = 0, length1 = features.length; i < length1; i++) {
      const feature = features[i];
      const paths = feature.getPaths(event.tileContext);
      const thickness = this._getLineThickness(feature);
      for (let j = 0, length2 = paths.length; j < length2; j++) {
        const path = paths[j];
        const distance = mercator.getDistanceFromLine(event.tilePoint, path);
        // eslint-disable-next-line default-case
        switch (feature.type) {
          case 1: // Point
            // eslint-disable-next-line max-len
            if (mercator.inCircle(path[0].x, path[0].y, feature.style.radius, event.tilePoint.x, event.tilePoint.y)) {
              selectedFeature = feature;
              minDistance = 0;
            }
            break;
          case 2: // LineString
            if (distance < thickness / 2 + this._lineClickTolerance && distance < minDistance) {
              selectedFeature = feature;
              minDistance = distance;
            }
            break;
          case 3: // Polygon
            if (mercator.isPointInPolygon(event.tilePoint, path)) {
              selectedFeature = feature;
              minDistance = 0;
            }
            break;
        }

        if (minDistance === 0) {
          return selectedFeature;
        }
      }
    }
    return selectedFeature;
  }
}

module.exports = MVTLayer;
