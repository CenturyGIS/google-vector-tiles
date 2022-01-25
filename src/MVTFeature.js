/*
 *  Created by Jes�s Barrio on 04/2021
 *  Updated by Anne Canoune on 08/27/2021
 */

class MVTFeature {
  constructor(options) {
    this.mVTSource = options.mVTSource;
    this.selected = options.selected;
    this.featureId = options.featureId;
    this.tiles = [];
    this.style = options.style;
    this.type = options.vectorTileFeature.type;
    this.properties = options.vectorTileFeature.properties;
    this.addTileFeature(options.vectorTileFeature, options.tileContext);

    if (this.selected) {
      this.select();
    }
  }

  addTileFeature(vectorTileFeature, tileContext) {
    this.tiles[tileContext.id] = {
      vectorTileFeature,
      divisor: vectorTileFeature.extent / tileContext.tileSize
    };
  }

  getTiles() {
    return this.tiles;
  }

  setStyle(style) {
    this.style = style;
  }

  redrawTiles() {
    const zoom = this.mVTSource.map.getZoom();
    // eslint-disable-next-line no-unused-vars
    Object.entries(this.tiles).forEach(([id, tile]) => {
      this.mVTSource.deleteTileDrawn(id);
      const idObject = this.mVTSource.getTileObject(id);
      if (idObject.zoom === zoom) {
        this.mVTSource.redrawTile(id);
      }
    });
  }

  toggle() {
    if (this.selected) {
      this.deselect();
    } else {
      this.select();
    }
  }

  select() {
    this.selected = true;
    this.mVTSource.featureSelected(this);
    this.redrawTiles();
  }

  deselect() {
    this.selected = false;
    this.mVTSource.featureDeselected(this);
    this.redrawTiles();
  }

  setSelected(selected) {
    this.selected = selected;
  }

  draw(tileContext) {
    const tile = this.tiles[tileContext.id];
    let { style } = this;
    if (this.selected && this.style.selected) {
      style = this.style.selected;
    }
    switch (this.type) {
      case 1: // Point
        this._drawPoint(tileContext, tile, style);
        break;

      case 2: // LineString
        this._drawLineString(tileContext, tile, style);
        break;

      case 3: // Polygon
        this._drawPolygon(tileContext, tile, style);
        break;

      default:
        throw new Error(`Unmanaged type: ${tileContext}`);
    }
  }

  _drawPoint(tileContext, tile, style) {
    const context2d = this._getContext2d(tileContext.canvas, style);
    const radius = style.radius || 3;
    context2d.beginPath();
    const coordinates = tile.vectorTileFeature.coordinates[0][0];
    const point = this._getPoint(coordinates, tileContext, tile.divisor);
    context2d.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context2d.closePath();
    context2d.fill();
    context2d.stroke();
  }

  _drawLineString(tileContext, tile, style) {
    const context2d = this._getContext2d(tileContext.canvas, style);
    this._drawCoordinates(tileContext, context2d, tile);
    context2d.stroke();
  }

  _drawPolygon(tileContext, tile, style) {
    const context2d = this._getContext2d(tileContext.canvas, style);
    this._drawCoordinates(tileContext, context2d, tile);
    context2d.closePath();

    if (style.fillStyle) {
      context2d.fill();
    }
    if (style.strokeStyle) {
      context2d.stroke();
    }
  }

  _drawCoordinates(tileContext, context2d, tile) {
    context2d.beginPath();
    const { coordinates } = tile.vectorTileFeature;

    for (let i = 0, length1 = coordinates.length; i < length1; i++) {
      const coordinate = coordinates[i];
      for (let j = 0, length2 = coordinate.length; j < length2; j++) {
        const method = `${j === 0 ? 'move' : 'line'}To`;
        const point = this._getPoint(coordinate[j], tileContext, tile.divisor);
        context2d[method](point.x, point.y);
      }
    }
  }

  getPaths(tileContext) {
    const paths = [];
    const tile = this.tiles[tileContext.id];
    const { coordinates } = tile.vectorTileFeature;
    for (let i = 0, length1 = coordinates.length; i < length1; i++) {
      const path = [];
      const coordinate = coordinates[i];
      for (let j = 0, length2 = coordinate.length; j < length2; j++) {
        const point = this._getPoint(coordinate[j], tileContext, tile.divisor);
        path.push(point);
      }
      if (path.length > 0) {
        paths.push(path);
      }
    }
    return paths;
  }

  // eslint-disable-next-line class-methods-use-this
  _getContext2d(canvas, style) {
    const context2d = canvas.getContext('2d');
    Object.keys(style).forEach(([key]) => {
      if (key === 'selected') {
        context2d[key] = style[key];
      }
    });
    return context2d;
  }

  _getPoint(coords, tileContext, divisor) {
    let point = {
      x: coords.x / divisor,
      y: coords.y / divisor
    };

    if (tileContext.parentId) {
      point = this._getOverzoomedPoint(point, tileContext);
    }
    return point;
  }

  _getOverzoomedPoint(point, tileContext) {
    const parentTile = this.mVTSource.getTileObject(tileContext.parentId);
    const currentTile = this.mVTSource.getTileObject(tileContext.id);
    const zoomDistance = currentTile.zoom - parentTile.zoom;

    const scale = ((2) ** zoomDistance);

    const xScale = point.x * scale;
    const yScale = point.y * scale;

    const xtileOffset = currentTile.x % scale;
    const ytileOffset = currentTile.y % scale;

    // eslint-disable-next-line no-param-reassign
    point.x = xScale - (xtileOffset * tileContext.tileSize);
    // eslint-disable-next-line no-param-reassign
    point.y = yScale - (ytileOffset * tileContext.tileSize);

    return point;
  }
}

module.exports = MVTFeature;
