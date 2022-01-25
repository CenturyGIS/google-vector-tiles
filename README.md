### Development Notes

- The Protobuf IIFE has been removed in favor of installing the Node modules from https://github.com/protobufjs/protobuf.js
  - If this doesn't work then we'll have to revert back to using the IIFE or perhaps pulling a more readable version of it from the repo listed above.

- Point.js is a copy of Mapbox's [@mapbox/point-geometry](https://github.com/mapbox/point-geometry) repo (minus some functions).
  - In the interest of keeping things as simple as possible I've decided to use the npm package. This will eliminate another standalone script that has to be maintained by us.

