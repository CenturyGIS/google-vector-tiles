(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["dist/google-vector-tiles"] = factory());
})(this, (function () { 'use strict';

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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var pointGeometry = Point;

  function Point(x, y) {
      this.x = x;
      this.y = y;
  }

  Point.prototype = {
      clone: function() { return new Point(this.x, this.y); },

      add:     function(p) { return this.clone()._add(p);     },
      sub:     function(p) { return this.clone()._sub(p);     },
      mult:    function(k) { return this.clone()._mult(k);    },
      div:     function(k) { return this.clone()._div(k);     },
      rotate:  function(a) { return this.clone()._rotate(a);  },
      matMult: function(m) { return this.clone()._matMult(m); },
      unit:    function() { return this.clone()._unit(); },
      perp:    function() { return this.clone()._perp(); },
      round:   function() { return this.clone()._round(); },

      mag: function() {
          return Math.sqrt(this.x * this.x + this.y * this.y);
      },

      equals: function(p) {
          return this.x === p.x &&
                 this.y === p.y;
      },

      dist: function(p) {
          return Math.sqrt(this.distSqr(p));
      },

      distSqr: function(p) {
          var dx = p.x - this.x,
              dy = p.y - this.y;
          return dx * dx + dy * dy;
      },

      angle: function() {
          return Math.atan2(this.y, this.x);
      },

      angleTo: function(b) {
          return Math.atan2(this.y - b.y, this.x - b.x);
      },

      angleWith: function(b) {
          return this.angleWithSep(b.x, b.y);
      },

      // Find the angle of the two vectors, solving the formula for the cross product a x b = |a||b|sin(θ) for θ.
      angleWithSep: function(x, y) {
          return Math.atan2(
              this.x * y - this.y * x,
              this.x * x + this.y * y);
      },

      _matMult: function(m) {
          var x = m[0] * this.x + m[1] * this.y,
              y = m[2] * this.x + m[3] * this.y;
          this.x = x;
          this.y = y;
          return this;
      },

      _add: function(p) {
          this.x += p.x;
          this.y += p.y;
          return this;
      },

      _sub: function(p) {
          this.x -= p.x;
          this.y -= p.y;
          return this;
      },

      _mult: function(k) {
          this.x *= k;
          this.y *= k;
          return this;
      },

      _div: function(k) {
          this.x /= k;
          this.y /= k;
          return this;
      },

      _unit: function() {
          this._div(this.mag());
          return this;
      },

      _perp: function() {
          var y = this.y;
          this.y = this.x;
          this.x = -y;
          return this;
      },

      _rotate: function(angle) {
          var cos = Math.cos(angle),
              sin = Math.sin(angle),
              x = cos * this.x - sin * this.y,
              y = sin * this.x + cos * this.y;
          this.x = x;
          this.y = y;
          return this;
      },

      _round: function() {
          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          return this;
      }
  };

  // constructs Point from an array if necessary
  Point.convert = function (a) {
      if (a instanceof Point) {
          return a;
      }
      if (Array.isArray(a)) {
          return new Point(a[0], a[1]);
      }
      return a;
  };

  var vectortilefeature = VectorTileFeature$1;

  function VectorTileFeature$1(pbf, end, extent, keys, values) {
      // Public
      this.properties = {};
      this.extent = extent;
      this.type = 0;

      // Private
      this._pbf = pbf;
      this._geometry = -1;
      this._keys = keys;
      this._values = values;

      pbf.readFields(readFeature, this, end);
  }

  function readFeature(tag, feature, pbf) {
      if (tag == 1) feature.id = pbf.readVarint();
      else if (tag == 2) readTag(pbf, feature);
      else if (tag == 3) feature.type = pbf.readVarint();
      else if (tag == 4) feature._geometry = pbf.pos;
  }

  function readTag(pbf, feature) {
      var end = pbf.readVarint() + pbf.pos;

      while (pbf.pos < end) {
          var key = feature._keys[pbf.readVarint()],
              value = feature._values[pbf.readVarint()];
          feature.properties[key] = value;
      }
  }

  VectorTileFeature$1.types = ['Unknown', 'Point', 'LineString', 'Polygon'];

  VectorTileFeature$1.prototype.loadGeometry = function() {
      var pbf = this._pbf;
      pbf.pos = this._geometry;

      var end = pbf.readVarint() + pbf.pos,
          cmd = 1,
          length = 0,
          x = 0,
          y = 0,
          lines = [],
          line;

      while (pbf.pos < end) {
          if (!length) {
              var cmdLen = pbf.readVarint();
              cmd = cmdLen & 0x7;
              length = cmdLen >> 3;
          }

          length--;

          if (cmd === 1 || cmd === 2) {
              x += pbf.readSVarint();
              y += pbf.readSVarint();

              if (cmd === 1) { // moveTo
                  if (line) lines.push(line);
                  line = [];
              }

              line.push(new pointGeometry(x, y));

          } else if (cmd === 7) {

              // Workaround for https://github.com/mapbox/mapnik-vector-tile/issues/90
              if (line) {
                  line.push(line[0].clone()); // closePolygon
              }

          } else {
              throw new Error('unknown command ' + cmd);
          }
      }

      if (line) lines.push(line);

      return lines;
  };

  VectorTileFeature$1.prototype.bbox = function() {
      var pbf = this._pbf;
      pbf.pos = this._geometry;

      var end = pbf.readVarint() + pbf.pos,
          cmd = 1,
          length = 0,
          x = 0,
          y = 0,
          x1 = Infinity,
          x2 = -Infinity,
          y1 = Infinity,
          y2 = -Infinity;

      while (pbf.pos < end) {
          if (!length) {
              var cmdLen = pbf.readVarint();
              cmd = cmdLen & 0x7;
              length = cmdLen >> 3;
          }

          length--;

          if (cmd === 1 || cmd === 2) {
              x += pbf.readSVarint();
              y += pbf.readSVarint();
              if (x < x1) x1 = x;
              if (x > x2) x2 = x;
              if (y < y1) y1 = y;
              if (y > y2) y2 = y;

          } else if (cmd !== 7) {
              throw new Error('unknown command ' + cmd);
          }
      }

      return [x1, y1, x2, y2];
  };

  VectorTileFeature$1.prototype.toGeoJSON = function(x, y, z) {
      var size = this.extent * Math.pow(2, z),
          x0 = this.extent * x,
          y0 = this.extent * y,
          coords = this.loadGeometry(),
          type = VectorTileFeature$1.types[this.type],
          i, j;

      function project(line) {
          for (var j = 0; j < line.length; j++) {
              var p = line[j], y2 = 180 - (p.y + y0) * 360 / size;
              line[j] = [
                  (p.x + x0) * 360 / size - 180,
                  360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90
              ];
          }
      }

      switch (this.type) {
      case 1:
          var points = [];
          for (i = 0; i < coords.length; i++) {
              points[i] = coords[i][0];
          }
          coords = points;
          project(coords);
          break;

      case 2:
          for (i = 0; i < coords.length; i++) {
              project(coords[i]);
          }
          break;

      case 3:
          coords = classifyRings(coords);
          for (i = 0; i < coords.length; i++) {
              for (j = 0; j < coords[i].length; j++) {
                  project(coords[i][j]);
              }
          }
          break;
      }

      if (coords.length === 1) {
          coords = coords[0];
      } else {
          type = 'Multi' + type;
      }

      var result = {
          type: "Feature",
          geometry: {
              type: type,
              coordinates: coords
          },
          properties: this.properties
      };

      if ('id' in this) {
          result.id = this.id;
      }

      return result;
  };

  // classifies an array of rings into polygons with outer rings and holes

  function classifyRings(rings) {
      var len = rings.length;

      if (len <= 1) return [rings];

      var polygons = [],
          polygon,
          ccw;

      for (var i = 0; i < len; i++) {
          var area = signedArea(rings[i]);
          if (area === 0) continue;

          if (ccw === undefined) ccw = area < 0;

          if (ccw === area < 0) {
              if (polygon) polygons.push(polygon);
              polygon = [rings[i]];

          } else {
              polygon.push(rings[i]);
          }
      }
      if (polygon) polygons.push(polygon);

      return polygons;
  }

  function signedArea(ring) {
      var sum = 0;
      for (var i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
          p1 = ring[i];
          p2 = ring[j];
          sum += (p2.x - p1.x) * (p1.y + p2.y);
      }
      return sum;
  }

  var vectortilelayer = VectorTileLayer$1;

  function VectorTileLayer$1(pbf, end) {
      // Public
      this.version = 1;
      this.name = null;
      this.extent = 4096;
      this.length = 0;

      // Private
      this._pbf = pbf;
      this._keys = [];
      this._values = [];
      this._features = [];

      pbf.readFields(readLayer, this, end);

      this.length = this._features.length;
  }

  function readLayer(tag, layer, pbf) {
      if (tag === 15) layer.version = pbf.readVarint();
      else if (tag === 1) layer.name = pbf.readString();
      else if (tag === 5) layer.extent = pbf.readVarint();
      else if (tag === 2) layer._features.push(pbf.pos);
      else if (tag === 3) layer._keys.push(pbf.readString());
      else if (tag === 4) layer._values.push(readValueMessage(pbf));
  }

  function readValueMessage(pbf) {
      var value = null,
          end = pbf.readVarint() + pbf.pos;

      while (pbf.pos < end) {
          var tag = pbf.readVarint() >> 3;

          value = tag === 1 ? pbf.readString() :
              tag === 2 ? pbf.readFloat() :
              tag === 3 ? pbf.readDouble() :
              tag === 4 ? pbf.readVarint64() :
              tag === 5 ? pbf.readVarint() :
              tag === 6 ? pbf.readSVarint() :
              tag === 7 ? pbf.readBoolean() : null;
      }

      return value;
  }

  // return feature `i` from this layer as a `VectorTileFeature`
  VectorTileLayer$1.prototype.feature = function(i) {
      if (i < 0 || i >= this._features.length) throw new Error('feature index out of bounds');

      this._pbf.pos = this._features[i];

      var end = this._pbf.readVarint() + this._pbf.pos;
      return new vectortilefeature(this._pbf, end, this.extent, this._keys, this._values);
  };

  var vectortile = VectorTile$2;

  function VectorTile$2(pbf, end) {
      this.layers = pbf.readFields(readTile, {}, end);
  }

  function readTile(tag, layers, pbf) {
      if (tag === 3) {
          var layer = new vectortilelayer(pbf, pbf.readVarint() + pbf.pos);
          if (layer.length) layers[layer.name] = layer;
      }
  }

  var VectorTile$1 = vectortile;
  var VectorTileFeature = vectortilefeature;
  var VectorTileLayer = vectortilelayer;

  var vectorTile = {
  	VectorTile: VectorTile$1,
  	VectorTileFeature: VectorTileFeature,
  	VectorTileLayer: VectorTileLayer
  };

  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  var read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = (nBytes * 8) - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? (nBytes - 1) : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];

    i += d;

    e = s & ((1 << (-nBits)) - 1);
    s >>= (-nBits);
    nBits += eLen;
    for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & ((1 << (-nBits)) - 1);
    e >>= (-nBits);
    nBits += mLen;
    for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : ((s ? -1 : 1) * Infinity)
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
  };

  var write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = (nBytes * 8) - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
    var i = isLE ? 0 : (nBytes - 1);
    var d = isLE ? 1 : -1;
    var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }

      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = ((value * c) - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = (e << mLen) | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128;
  };

  var ieee754 = {
  	read: read,
  	write: write
  };

  var pbf = Pbf;



  function Pbf(buf) {
      this.buf = ArrayBuffer.isView && ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf || 0);
      this.pos = 0;
      this.type = 0;
      this.length = this.buf.length;
  }

  Pbf.Varint  = 0; // varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
  Pbf.Fixed64 = 1; // 64-bit: double, fixed64, sfixed64
  Pbf.Bytes   = 2; // length-delimited: string, bytes, embedded messages, packed repeated fields
  Pbf.Fixed32 = 5; // 32-bit: float, fixed32, sfixed32

  var SHIFT_LEFT_32 = (1 << 16) * (1 << 16),
      SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;

  // Threshold chosen based on both benchmarking and knowledge about browser string
  // data structures (which currently switch structure types at 12 bytes or more)
  var TEXT_DECODER_MIN_LENGTH = 12;
  var utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf8');

  Pbf.prototype = {

      destroy: function() {
          this.buf = null;
      },

      // === READING =================================================================

      readFields: function(readField, result, end) {
          end = end || this.length;

          while (this.pos < end) {
              var val = this.readVarint(),
                  tag = val >> 3,
                  startPos = this.pos;

              this.type = val & 0x7;
              readField(tag, result, this);

              if (this.pos === startPos) this.skip(val);
          }
          return result;
      },

      readMessage: function(readField, result) {
          return this.readFields(readField, result, this.readVarint() + this.pos);
      },

      readFixed32: function() {
          var val = readUInt32(this.buf, this.pos);
          this.pos += 4;
          return val;
      },

      readSFixed32: function() {
          var val = readInt32(this.buf, this.pos);
          this.pos += 4;
          return val;
      },

      // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)

      readFixed64: function() {
          var val = readUInt32(this.buf, this.pos) + readUInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
          this.pos += 8;
          return val;
      },

      readSFixed64: function() {
          var val = readUInt32(this.buf, this.pos) + readInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
          this.pos += 8;
          return val;
      },

      readFloat: function() {
          var val = ieee754.read(this.buf, this.pos, true, 23, 4);
          this.pos += 4;
          return val;
      },

      readDouble: function() {
          var val = ieee754.read(this.buf, this.pos, true, 52, 8);
          this.pos += 8;
          return val;
      },

      readVarint: function(isSigned) {
          var buf = this.buf,
              val, b;

          b = buf[this.pos++]; val  =  b & 0x7f;        if (b < 0x80) return val;
          b = buf[this.pos++]; val |= (b & 0x7f) << 7;  if (b < 0x80) return val;
          b = buf[this.pos++]; val |= (b & 0x7f) << 14; if (b < 0x80) return val;
          b = buf[this.pos++]; val |= (b & 0x7f) << 21; if (b < 0x80) return val;
          b = buf[this.pos];   val |= (b & 0x0f) << 28;

          return readVarintRemainder(val, isSigned, this);
      },

      readVarint64: function() { // for compatibility with v2.0.1
          return this.readVarint(true);
      },

      readSVarint: function() {
          var num = this.readVarint();
          return num % 2 === 1 ? (num + 1) / -2 : num / 2; // zigzag encoding
      },

      readBoolean: function() {
          return Boolean(this.readVarint());
      },

      readString: function() {
          var end = this.readVarint() + this.pos;
          var pos = this.pos;
          this.pos = end;

          if (end - pos >= TEXT_DECODER_MIN_LENGTH && utf8TextDecoder) {
              // longer strings are fast with the built-in browser TextDecoder API
              return readUtf8TextDecoder(this.buf, pos, end);
          }
          // short strings are fast with our custom implementation
          return readUtf8(this.buf, pos, end);
      },

      readBytes: function() {
          var end = this.readVarint() + this.pos,
              buffer = this.buf.subarray(this.pos, end);
          this.pos = end;
          return buffer;
      },

      // verbose for performance reasons; doesn't affect gzipped size

      readPackedVarint: function(arr, isSigned) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readVarint(isSigned));
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readVarint(isSigned));
          return arr;
      },
      readPackedSVarint: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readSVarint());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readSVarint());
          return arr;
      },
      readPackedBoolean: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readBoolean());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readBoolean());
          return arr;
      },
      readPackedFloat: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readFloat());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readFloat());
          return arr;
      },
      readPackedDouble: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readDouble());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readDouble());
          return arr;
      },
      readPackedFixed32: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readFixed32());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readFixed32());
          return arr;
      },
      readPackedSFixed32: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readSFixed32());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readSFixed32());
          return arr;
      },
      readPackedFixed64: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readFixed64());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readFixed64());
          return arr;
      },
      readPackedSFixed64: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readSFixed64());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readSFixed64());
          return arr;
      },

      skip: function(val) {
          var type = val & 0x7;
          if (type === Pbf.Varint) while (this.buf[this.pos++] > 0x7f) {}
          else if (type === Pbf.Bytes) this.pos = this.readVarint() + this.pos;
          else if (type === Pbf.Fixed32) this.pos += 4;
          else if (type === Pbf.Fixed64) this.pos += 8;
          else throw new Error('Unimplemented type: ' + type);
      },

      // === WRITING =================================================================

      writeTag: function(tag, type) {
          this.writeVarint((tag << 3) | type);
      },

      realloc: function(min) {
          var length = this.length || 16;

          while (length < this.pos + min) length *= 2;

          if (length !== this.length) {
              var buf = new Uint8Array(length);
              buf.set(this.buf);
              this.buf = buf;
              this.length = length;
          }
      },

      finish: function() {
          this.length = this.pos;
          this.pos = 0;
          return this.buf.subarray(0, this.length);
      },

      writeFixed32: function(val) {
          this.realloc(4);
          writeInt32(this.buf, val, this.pos);
          this.pos += 4;
      },

      writeSFixed32: function(val) {
          this.realloc(4);
          writeInt32(this.buf, val, this.pos);
          this.pos += 4;
      },

      writeFixed64: function(val) {
          this.realloc(8);
          writeInt32(this.buf, val & -1, this.pos);
          writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
          this.pos += 8;
      },

      writeSFixed64: function(val) {
          this.realloc(8);
          writeInt32(this.buf, val & -1, this.pos);
          writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
          this.pos += 8;
      },

      writeVarint: function(val) {
          val = +val || 0;

          if (val > 0xfffffff || val < 0) {
              writeBigVarint(val, this);
              return;
          }

          this.realloc(4);

          this.buf[this.pos++] =           val & 0x7f  | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
          this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
          this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
          this.buf[this.pos++] =   (val >>> 7) & 0x7f;
      },

      writeSVarint: function(val) {
          this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
      },

      writeBoolean: function(val) {
          this.writeVarint(Boolean(val));
      },

      writeString: function(str) {
          str = String(str);
          this.realloc(str.length * 4);

          this.pos++; // reserve 1 byte for short string length

          var startPos = this.pos;
          // write the string directly to the buffer and see how much was written
          this.pos = writeUtf8(this.buf, str, this.pos);
          var len = this.pos - startPos;

          if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);

          // finally, write the message length in the reserved place and restore the position
          this.pos = startPos - 1;
          this.writeVarint(len);
          this.pos += len;
      },

      writeFloat: function(val) {
          this.realloc(4);
          ieee754.write(this.buf, val, this.pos, true, 23, 4);
          this.pos += 4;
      },

      writeDouble: function(val) {
          this.realloc(8);
          ieee754.write(this.buf, val, this.pos, true, 52, 8);
          this.pos += 8;
      },

      writeBytes: function(buffer) {
          var len = buffer.length;
          this.writeVarint(len);
          this.realloc(len);
          for (var i = 0; i < len; i++) this.buf[this.pos++] = buffer[i];
      },

      writeRawMessage: function(fn, obj) {
          this.pos++; // reserve 1 byte for short message length

          // write the message directly to the buffer and see how much was written
          var startPos = this.pos;
          fn(obj, this);
          var len = this.pos - startPos;

          if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);

          // finally, write the message length in the reserved place and restore the position
          this.pos = startPos - 1;
          this.writeVarint(len);
          this.pos += len;
      },

      writeMessage: function(tag, fn, obj) {
          this.writeTag(tag, Pbf.Bytes);
          this.writeRawMessage(fn, obj);
      },

      writePackedVarint:   function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedVarint, arr);   },
      writePackedSVarint:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedSVarint, arr);  },
      writePackedBoolean:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedBoolean, arr);  },
      writePackedFloat:    function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedFloat, arr);    },
      writePackedDouble:   function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedDouble, arr);   },
      writePackedFixed32:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedFixed32, arr);  },
      writePackedSFixed32: function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedSFixed32, arr); },
      writePackedFixed64:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedFixed64, arr);  },
      writePackedSFixed64: function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedSFixed64, arr); },

      writeBytesField: function(tag, buffer) {
          this.writeTag(tag, Pbf.Bytes);
          this.writeBytes(buffer);
      },
      writeFixed32Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed32);
          this.writeFixed32(val);
      },
      writeSFixed32Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed32);
          this.writeSFixed32(val);
      },
      writeFixed64Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed64);
          this.writeFixed64(val);
      },
      writeSFixed64Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed64);
          this.writeSFixed64(val);
      },
      writeVarintField: function(tag, val) {
          this.writeTag(tag, Pbf.Varint);
          this.writeVarint(val);
      },
      writeSVarintField: function(tag, val) {
          this.writeTag(tag, Pbf.Varint);
          this.writeSVarint(val);
      },
      writeStringField: function(tag, str) {
          this.writeTag(tag, Pbf.Bytes);
          this.writeString(str);
      },
      writeFloatField: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed32);
          this.writeFloat(val);
      },
      writeDoubleField: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed64);
          this.writeDouble(val);
      },
      writeBooleanField: function(tag, val) {
          this.writeVarintField(tag, Boolean(val));
      }
  };

  function readVarintRemainder(l, s, p) {
      var buf = p.buf,
          h, b;

      b = buf[p.pos++]; h  = (b & 0x70) >> 4;  if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x7f) << 3;  if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x7f) << 10; if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x7f) << 17; if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x7f) << 24; if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x01) << 31; if (b < 0x80) return toNum(l, h, s);

      throw new Error('Expected varint not more than 10 bytes');
  }

  function readPackedEnd(pbf) {
      return pbf.type === Pbf.Bytes ?
          pbf.readVarint() + pbf.pos : pbf.pos + 1;
  }

  function toNum(low, high, isSigned) {
      if (isSigned) {
          return high * 0x100000000 + (low >>> 0);
      }

      return ((high >>> 0) * 0x100000000) + (low >>> 0);
  }

  function writeBigVarint(val, pbf) {
      var low, high;

      if (val >= 0) {
          low  = (val % 0x100000000) | 0;
          high = (val / 0x100000000) | 0;
      } else {
          low  = ~(-val % 0x100000000);
          high = ~(-val / 0x100000000);

          if (low ^ 0xffffffff) {
              low = (low + 1) | 0;
          } else {
              low = 0;
              high = (high + 1) | 0;
          }
      }

      if (val >= 0x10000000000000000 || val < -0x10000000000000000) {
          throw new Error('Given varint doesn\'t fit into 10 bytes');
      }

      pbf.realloc(10);

      writeBigVarintLow(low, high, pbf);
      writeBigVarintHigh(high, pbf);
  }

  function writeBigVarintLow(low, high, pbf) {
      pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
      pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
      pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
      pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
      pbf.buf[pbf.pos]   = low & 0x7f;
  }

  function writeBigVarintHigh(high, pbf) {
      var lsb = (high & 0x07) << 4;

      pbf.buf[pbf.pos++] |= lsb         | ((high >>>= 3) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f;
  }

  function makeRoomForExtraLength(startPos, len, pbf) {
      var extraLen =
          len <= 0x3fff ? 1 :
          len <= 0x1fffff ? 2 :
          len <= 0xfffffff ? 3 : Math.floor(Math.log(len) / (Math.LN2 * 7));

      // if 1 byte isn't enough for encoding message length, shift the data to the right
      pbf.realloc(extraLen);
      for (var i = pbf.pos - 1; i >= startPos; i--) pbf.buf[i + extraLen] = pbf.buf[i];
  }

  function writePackedVarint(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeVarint(arr[i]);   }
  function writePackedSVarint(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeSVarint(arr[i]);  }
  function writePackedFloat(arr, pbf)    { for (var i = 0; i < arr.length; i++) pbf.writeFloat(arr[i]);    }
  function writePackedDouble(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeDouble(arr[i]);   }
  function writePackedBoolean(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeBoolean(arr[i]);  }
  function writePackedFixed32(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed32(arr[i]);  }
  function writePackedSFixed32(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed32(arr[i]); }
  function writePackedFixed64(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed64(arr[i]);  }
  function writePackedSFixed64(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed64(arr[i]); }

  // Buffer code below from https://github.com/feross/buffer, MIT-licensed

  function readUInt32(buf, pos) {
      return ((buf[pos]) |
          (buf[pos + 1] << 8) |
          (buf[pos + 2] << 16)) +
          (buf[pos + 3] * 0x1000000);
  }

  function writeInt32(buf, val, pos) {
      buf[pos] = val;
      buf[pos + 1] = (val >>> 8);
      buf[pos + 2] = (val >>> 16);
      buf[pos + 3] = (val >>> 24);
  }

  function readInt32(buf, pos) {
      return ((buf[pos]) |
          (buf[pos + 1] << 8) |
          (buf[pos + 2] << 16)) +
          (buf[pos + 3] << 24);
  }

  function readUtf8(buf, pos, end) {
      var str = '';
      var i = pos;

      while (i < end) {
          var b0 = buf[i];
          var c = null; // codepoint
          var bytesPerSequence =
              b0 > 0xEF ? 4 :
              b0 > 0xDF ? 3 :
              b0 > 0xBF ? 2 : 1;

          if (i + bytesPerSequence > end) break;

          var b1, b2, b3;

          if (bytesPerSequence === 1) {
              if (b0 < 0x80) {
                  c = b0;
              }
          } else if (bytesPerSequence === 2) {
              b1 = buf[i + 1];
              if ((b1 & 0xC0) === 0x80) {
                  c = (b0 & 0x1F) << 0x6 | (b1 & 0x3F);
                  if (c <= 0x7F) {
                      c = null;
                  }
              }
          } else if (bytesPerSequence === 3) {
              b1 = buf[i + 1];
              b2 = buf[i + 2];
              if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80) {
                  c = (b0 & 0xF) << 0xC | (b1 & 0x3F) << 0x6 | (b2 & 0x3F);
                  if (c <= 0x7FF || (c >= 0xD800 && c <= 0xDFFF)) {
                      c = null;
                  }
              }
          } else if (bytesPerSequence === 4) {
              b1 = buf[i + 1];
              b2 = buf[i + 2];
              b3 = buf[i + 3];
              if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                  c = (b0 & 0xF) << 0x12 | (b1 & 0x3F) << 0xC | (b2 & 0x3F) << 0x6 | (b3 & 0x3F);
                  if (c <= 0xFFFF || c >= 0x110000) {
                      c = null;
                  }
              }
          }

          if (c === null) {
              c = 0xFFFD;
              bytesPerSequence = 1;

          } else if (c > 0xFFFF) {
              c -= 0x10000;
              str += String.fromCharCode(c >>> 10 & 0x3FF | 0xD800);
              c = 0xDC00 | c & 0x3FF;
          }

          str += String.fromCharCode(c);
          i += bytesPerSequence;
      }

      return str;
  }

  function readUtf8TextDecoder(buf, pos, end) {
      return utf8TextDecoder.decode(buf.subarray(pos, end));
  }

  function writeUtf8(buf, str, pos) {
      for (var i = 0, c, lead; i < str.length; i++) {
          c = str.charCodeAt(i); // code point

          if (c > 0xD7FF && c < 0xE000) {
              if (lead) {
                  if (c < 0xDC00) {
                      buf[pos++] = 0xEF;
                      buf[pos++] = 0xBF;
                      buf[pos++] = 0xBD;
                      lead = c;
                      continue;
                  } else {
                      c = lead - 0xD800 << 10 | c - 0xDC00 | 0x10000;
                      lead = null;
                  }
              } else {
                  if (c > 0xDBFF || (i + 1 === str.length)) {
                      buf[pos++] = 0xEF;
                      buf[pos++] = 0xBF;
                      buf[pos++] = 0xBD;
                  } else {
                      lead = c;
                  }
                  continue;
              }
          } else if (lead) {
              buf[pos++] = 0xEF;
              buf[pos++] = 0xBF;
              buf[pos++] = 0xBD;
              lead = null;
          }

          if (c < 0x80) {
              buf[pos++] = c;
          } else {
              if (c < 0x800) {
                  buf[pos++] = c >> 0x6 | 0xC0;
              } else {
                  if (c < 0x10000) {
                      buf[pos++] = c >> 0xC | 0xE0;
                  } else {
                      buf[pos++] = c >> 0x12 | 0xF0;
                      buf[pos++] = c >> 0xC & 0x3F | 0x80;
                  }
                  buf[pos++] = c >> 0x6 & 0x3F | 0x80;
              }
              buf[pos++] = c & 0x3F | 0x80;
          }
      }
      return pos;
  }

  /* eslint-disable max-len */
  function fromLatLngToPoint(latLng) {
    var siny = Math.min(Math.max(Math.sin(latLng.lat() * (Math.PI / 180)), -0.9999), 0.9999);
    return {
      x: 128 + latLng.lng() * (256 / 360),
      y: 128 + 0.5 * Math.log((1 + siny) / (1 - siny)) * -(256 / (2 * Math.PI))
    };
  }

  function fromPointToLatLng(point) {
    return {
      lat: (2 * Math.atan(Math.exp((point.y - 128) / -(256 / (2 * Math.PI)))) - Math.PI / 2) / (Math.PI / 180),
      lng: (point.x - 128) / (256 / 360)
    };
  }

  function getTileAtLatLng(latLng, zoom) {
    var t = Math.pow(2, zoom);
    var s = 256 / t;
    var p = this.fromLatLngToPoint(latLng);
    return {
      x: Math.floor(p.x / s),
      y: Math.floor(p.y / s),
      z: zoom
    };
  }

  function getTileBounds(tile) {
    // eslint-disable-next-line no-param-reassign
    tile = this.normalizeTile(tile);
    var t = Math.pow(2, tile.z);
    var s = 256 / t;
    var sw = {
      x: tile.x * s,
      y: tile.y * s + s
    };
    var ne = {
      x: tile.x * s + s,
      y: tile.y * s
    };
    return {
      sw: this.fromPointToLatLng(sw),
      ne: this.fromPointToLatLng(ne)
    };
  }

  function normalizeTile(tile) {
    var t = Math.pow(2, tile.z); // eslint-disable-next-line no-param-reassign

    tile.x = (tile.x % t + t) % t; // eslint-disable-next-line no-param-reassign

    tile.y = (tile.y % t + t) % t;
    return tile;
  }

  function fromLatLngToPixels(map, latLng) {
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    var topRight = map.getProjection().fromLatLngToPoint(ne);
    var bottomLeft = map.getProjection().fromLatLngToPoint(sw);
    var scale = Math.pow(2, map.getZoom());
    var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
    return {
      x: (worldPoint.x - bottomLeft.x) * scale,
      y: (worldPoint.y - topRight.y) * scale
    };
  }

  function fromLatLngToTilePoint(map, evt) {
    var zoom = map.getZoom();
    var tile = this.getTileAtLatLng(evt.latLng, zoom);
    var tileBounds = this.getTileBounds(tile);
    var tileSwLatLng = new google.maps.LatLng(tileBounds.sw);
    var tileNeLatLng = new google.maps.LatLng(tileBounds.ne);
    var tileSwPixels = this.fromLatLngToPixels(map, tileSwLatLng);
    var tileNePixels = this.fromLatLngToPixels(map, tileNeLatLng);
    return {
      x: evt.pixel.x - tileSwPixels.x,
      y: evt.pixel.y - tileNePixels.y
    };
  } // todo: sometimes it does not work properly


  function isPointInPolygon(point, polygon) {
    if (polygon && polygon.length) {
      for (var _c = false, i = -1, l = polygon.length, j = l - 1; ++i < l; j = i) {
        (polygon[i].y <= point.y && point.y < polygon[j].y || polygon[j].y <= point.y && point.y < polygon[i].y) && point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x && (_c = !_c);
      }

      return c;
    }
  }

  function inCircle(centerX, centerY, radius, x, y) {
    var squareDist = Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2);
    return squareDist <= Math.pow(radius, 2);
  }

  function getDistanceFromLine(point, line) {
    var minDistance = Number.POSITIVE_INFINITY;

    if (line && line.length > 1) {
      for (var i = 0, l = line.length - 1; i < l; i++) {
        var distance = this.projectPointOnLineSegment(point, line[i], line[i + 1]);

        if (distance <= minDistance) {
          minDistance = distance;
        }
      }
    }

    return minDistance;
  }

  function projectPointOnLineSegment(point, r0, r1) {
    var x = point.x;
    var y = point.y;
    var x1 = r0.x;
    var y1 = r0.y;
    var x2 = r1.x;
    var y2 = r1.y;
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
    var dot = A * C + B * D;
    var lenSq = C * C + D * D;
    var param = -1; // in case of 0 length line

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    var xx;
    var yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  var mercator = {
    fromLatLngToPoint: fromLatLngToPoint,
    fromPointToLatLng: fromPointToLatLng,
    getTileBounds: getTileBounds,
    normalizeTile: normalizeTile,
    fromLatLngToPixels: fromLatLngToPixels,
    fromLatLngToTilePoint: fromLatLngToTilePoint,
    isPointInPolygon: isPointInPolygon,
    inCircle: inCircle,
    getDistanceFromLine: getDistanceFromLine,
    projectPointOnLineSegment: projectPointOnLineSegment,
    getTileAtLatLng: getTileAtLatLng
  };

  /*
   *  Created by Jes�s Barrio on 04/2021
   *  Updated by Anne Canoune on 08/27/2021
   */
  var MVTFeature = /*#__PURE__*/function () {
    function MVTFeature(options) {
      _classCallCheck(this, MVTFeature);

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

    _createClass(MVTFeature, [{
      key: "addTileFeature",
      value: function addTileFeature(vectorTileFeature, tileContext) {
        this.tiles[tileContext.id] = {
          vectorTileFeature: vectorTileFeature,
          divisor: vectorTileFeature.extent / tileContext.tileSize
        };
      }
    }, {
      key: "getTiles",
      value: function getTiles() {
        return this.tiles;
      }
    }, {
      key: "setStyle",
      value: function setStyle(style) {
        this.style = style;
      }
    }, {
      key: "redrawTiles",
      value: function redrawTiles() {
        var _this = this;

        var zoom = this.mVTSource.map.getZoom(); // eslint-disable-next-line no-unused-vars

        Object.entries(this.tiles).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              id = _ref2[0];
              _ref2[1];

          _this.mVTSource.deleteTileDrawn(id);

          var idObject = _this.mVTSource.getTileObject(id);

          if (idObject.zoom === zoom) {
            _this.mVTSource.redrawTile(id);
          }
        });
      }
    }, {
      key: "toggle",
      value: function toggle() {
        if (this.selected) {
          this.deselect();
        } else {
          this.select();
        }
      }
    }, {
      key: "select",
      value: function select() {
        this.selected = true;
        this.mVTSource.featureSelected(this);
        this.redrawTiles();
      }
    }, {
      key: "deselect",
      value: function deselect() {
        this.selected = false;
        this.mVTSource.featureDeselected(this);
        this.redrawTiles();
      }
    }, {
      key: "setSelected",
      value: function setSelected(selected) {
        this.selected = selected;
      }
    }, {
      key: "draw",
      value: function draw(tileContext) {
        var tile = this.tiles[tileContext.id];
        var style = this.style;

        if (this.selected && this.style.selected) {
          style = this.style.selected;
        }

        switch (this.type) {
          case 1:
            // Point
            this._drawPoint(tileContext, tile, style);

            break;

          case 2:
            // LineString
            this._drawLineString(tileContext, tile, style);

            break;

          case 3:
            // Polygon
            this._drawPolygon(tileContext, tile, style);

            break;

          default:
            throw new Error("Unmanaged type: ".concat(tileContext));
        }
      }
    }, {
      key: "_drawPoint",
      value: function _drawPoint(tileContext, tile, style) {
        var context2d = this._getContext2d(tileContext.canvas, style);

        var radius = style.radius || 3;
        context2d.beginPath();
        var coordinates = tile.vectorTileFeature.coordinates[0][0];

        var point = this._getPoint(coordinates, tileContext, tile.divisor);

        context2d.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context2d.closePath();
        context2d.fill();
        context2d.stroke();
      }
    }, {
      key: "_drawLineString",
      value: function _drawLineString(tileContext, tile, style) {
        var context2d = this._getContext2d(tileContext.canvas, style);

        this._drawCoordinates(tileContext, context2d, tile);

        context2d.stroke();
      }
    }, {
      key: "_drawPolygon",
      value: function _drawPolygon(tileContext, tile, style) {
        var context2d = this._getContext2d(tileContext.canvas, style);

        this._drawCoordinates(tileContext, context2d, tile);

        context2d.closePath();

        if (style.fillStyle) {
          context2d.fill();
        }

        if (style.strokeStyle) {
          context2d.stroke();
        }
      }
    }, {
      key: "_drawCoordinates",
      value: function _drawCoordinates(tileContext, context2d, tile) {
        context2d.beginPath();
        var coordinates = tile.vectorTileFeature.coordinates;

        for (var i = 0, length1 = coordinates.length; i < length1; i++) {
          var coordinate = coordinates[i];

          for (var j = 0, length2 = coordinate.length; j < length2; j++) {
            var method = "".concat(j === 0 ? 'move' : 'line', "To");

            var point = this._getPoint(coordinate[j], tileContext, tile.divisor);

            context2d[method](point.x, point.y);
          }
        }
      }
    }, {
      key: "getPaths",
      value: function getPaths(tileContext) {
        var paths = [];
        var tile = this.tiles[tileContext.id];
        var coordinates = tile.vectorTileFeature.coordinates;

        for (var i = 0, length1 = coordinates.length; i < length1; i++) {
          var path = [];
          var coordinate = coordinates[i];

          for (var j = 0, length2 = coordinate.length; j < length2; j++) {
            var point = this._getPoint(coordinate[j], tileContext, tile.divisor);

            path.push(point);
          }

          if (path.length > 0) {
            paths.push(path);
          }
        }

        return paths;
      } // eslint-disable-next-line class-methods-use-this

    }, {
      key: "_getContext2d",
      value: function _getContext2d(canvas, style) {
        var context2d = canvas.getContext('2d');
        Object.keys(style).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 1),
              key = _ref4[0];

          if (key === 'selected') {
            context2d[key] = style[key];
          }
        });
        return context2d;
      }
    }, {
      key: "_getPoint",
      value: function _getPoint(coords, tileContext, divisor) {
        var point = {
          x: coords.x / divisor,
          y: coords.y / divisor
        };

        if (tileContext.parentId) {
          point = this._getOverzoomedPoint(point, tileContext);
        }

        return point;
      }
    }, {
      key: "_getOverzoomedPoint",
      value: function _getOverzoomedPoint(point, tileContext) {
        var parentTile = this.mVTSource.getTileObject(tileContext.parentId);
        var currentTile = this.mVTSource.getTileObject(tileContext.id);
        var zoomDistance = currentTile.zoom - parentTile.zoom;
        var scale = Math.pow(2, zoomDistance);
        var xScale = point.x * scale;
        var yScale = point.y * scale;
        var xtileOffset = currentTile.x % scale;
        var ytileOffset = currentTile.y % scale; // eslint-disable-next-line no-param-reassign

        point.x = xScale - xtileOffset * tileContext.tileSize; // eslint-disable-next-line no-param-reassign

        point.y = yScale - ytileOffset * tileContext.tileSize;
        return point;
      }
    }]);

    return MVTFeature;
  }();

  var MVTFeature_1 = MVTFeature;

  /*
   *  Created by Jes�s Barrio on 04/2021
   *  Updated by Anne Canoune on 08/27/2021
   */

  var MVTLayer = /*#__PURE__*/function () {
    function MVTLayer(options) {
      _classCallCheck(this, MVTLayer);

      this._lineClickTolerance = 2;
      this._getIDForLayerFeature = options.getIDForLayerFeature;
      this.style = options.style;
      this.name = options.name;
      this._filter = options.filter || false;
      this._canvasAndFeatures = [];
      this._features = [];
    }

    _createClass(MVTLayer, [{
      key: "parseVectorTileFeatures",
      value: function parseVectorTileFeatures(mVTSource, vectorTileFeatures, tileContext) {
        this._canvasAndFeatures[tileContext.id] = {
          canvas: tileContext.canvas,
          features: []
        };

        for (var i = 0, length = vectorTileFeatures.length; i < length; i++) {
          var vectorTileFeature = vectorTileFeatures[i];

          this._parseVectorTileFeature(mVTSource, vectorTileFeature, tileContext, i);
        }

        this.drawTile(tileContext);
      }
    }, {
      key: "_parseVectorTileFeature",
      value: function _parseVectorTileFeature(mVTSource, vectorTileFeature, tileContext, i) {
        if (this._filter && typeof this._filter === 'function') {
          if (this._filter(vectorTileFeature, tileContext) === false) {
            return;
          }
        }

        var style = this.getStyle(vectorTileFeature);
        var featureId = this._getIDForLayerFeature(vectorTileFeature) || i;
        var mVTFeature = this._features[featureId];

        if (!mVTFeature) {
          var selected = mVTSource.isFeatureSelected(featureId);
          var options = {
            mVTSource: mVTSource,
            vectorTileFeature: vectorTileFeature,
            tileContext: tileContext,
            style: style,
            selected: selected,
            featureId: featureId
          };
          mVTFeature = new MVTFeature_1(options);
          this._features[featureId] = mVTFeature;
        } else {
          mVTFeature.setStyle(style);
          mVTFeature.addTileFeature(vectorTileFeature, tileContext);
        }

        this._canvasAndFeatures[tileContext.id].features.push(mVTFeature);
      }
    }, {
      key: "drawTile",
      value: function drawTile(tileContext) {
        var features = this._canvasAndFeatures[tileContext.id].features;
        if (!features) return;
        var selectedFeatures = [];

        for (var i = 0, length = features.length; i < length; i++) {
          var feature = features[i];

          if (feature.selected) {
            selectedFeatures.push(feature);
          } else {
            feature.draw(tileContext);
          }
        }

        for (var _i = 0, _length = selectedFeatures.length; _i < _length; _i++) {
          selectedFeatures[_i].draw(tileContext);
        }
      }
    }, {
      key: "getCanvas",
      value: function getCanvas(id) {
        return this._canvasAndFeatures[id].canvas;
      }
    }, {
      key: "getStyle",
      value: function getStyle(feature) {
        if (typeof this.style === 'function') {
          return this.style(feature);
        }

        return this.style;
      }
    }, {
      key: "setStyle",
      value: function setStyle(style) {
        this.style = style; // eslint-disable-next-line no-restricted-syntax

        for (var featureId in this._features) {
          if (Object.prototype.hasOwnProperty.call(this._features, featureId)) {
            this._features[featureId].setStyle(style);
          }
        } // Original code
        // for (const featureId in this._features) {
        //   this._features[featureId].setStyle(style);
        // }

      }
    }, {
      key: "setSelected",
      value: function setSelected(featureId) {
        if (this._features[featureId] !== undefined) {
          this._features[featureId].select();
        }
      }
    }, {
      key: "setFilter",
      value: function setFilter(filter) {
        this._filter = filter;
      }
    }, {
      key: "handleClickEvent",
      value: function handleClickEvent(event) {
        var canvasAndFeatures = this._canvasAndFeatures[event.tileContext.id];
        if (!canvasAndFeatures) return event;
        var canvas = canvasAndFeatures.canvas;
        var features = canvasAndFeatures.features;

        if (!canvas || !features) {
          return event;
        } // eslint-disable-next-line no-param-reassign


        event.feature = this._handleClickGetFeature(event, features);
        return event;
      }
    }, {
      key: "_getLineThickness",
      value: function _getLineThickness(feature) {
        var thickness = null;

        if (this.feature.selected && feature.style.selected) {
          thickness = feature.style.selected.lineWidth;
        } else {
          thickness = feature.style.lineWidth;
        }

        return thickness;
      }
    }, {
      key: "_handleClickGetFeature",
      value: function _handleClickGetFeature(event, features) {
        var minDistance = Number.POSITIVE_INFINITY;
        var selectedFeature = null;

        for (var i = 0, length1 = features.length; i < length1; i++) {
          var feature = features[i];
          var paths = feature.getPaths(event.tileContext);

          var thickness = this._getLineThickness(feature);

          for (var j = 0, length2 = paths.length; j < length2; j++) {
            var path = paths[j];
            var distance = mercator.getDistanceFromLine(event.tilePoint, path); // eslint-disable-next-line default-case

            switch (feature.type) {
              case 1:
                // Point
                // eslint-disable-next-line max-len
                if (mercator.inCircle(path[0].x, path[0].y, feature.style.radius, event.tilePoint.x, event.tilePoint.y)) {
                  selectedFeature = feature;
                  minDistance = 0;
                }

                break;

              case 2:
                // LineString
                if (distance < thickness / 2 + this._lineClickTolerance && distance < minDistance) {
                  selectedFeature = feature;
                  minDistance = distance;
                }

                break;

              case 3:
                // Polygon
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
    }]);

    return MVTLayer;
  }();

  var MVTLayer_1 = MVTLayer;

  /*
   *  Created by Jes�s Barrio on 04/2021
   *  Updated by Anne Canoune on 08/27/2021
   */

  var VectorTile = vectorTile.VectorTile;

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
        var pbf$1 = new pbf(uint8Array);
        var vectorTile = new VectorTile(pbf$1);

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
        return new MVTLayer_1(options);
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

  var MVTSource_1 = MVTSource;

  return MVTSource_1;

}));
