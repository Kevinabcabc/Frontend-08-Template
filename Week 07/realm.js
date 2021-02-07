

const draw = (data) => {
  const graph = new G6.TreeGraph({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: 2,
      modes: {
          default: [{
              type: 'collapse-expand',
              onChange: onChange = (item, collapsed) => {
                  const data = item.get('model').data;
                  data.collapsed = collapsed;
                  return true;
              }
          }, 'drag-canvas', 'zoom-canvas']
      },
      defaultNode: {
          size: 16,
          anchorPoints: [[0, 0.5], [1, 0.5]],
          style: {
              fill: '#40a9ff',
              stroke: '#096dd9'
          }
      },
      defaultEdge: {
          shape: 'cubic-horizontal',
          style: {
              stroke: '#A3B1BF'
          }
      },
      layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: getId = (d) => {
              return d.id;
          },
          getHeight: getHeight = () => {
              return 16;
          },
          getWidth: getWidth = () => {
              return 16;
          },
          getVGap: getVGap = () => {
              return 10;
          },
          getHGap: getHGap = () => {
              return 100;
          }
      }
  });

  graph.node((node) => {
      return {
          size: 26,
          style: {
              fill: '#40a9ff',
              stroke: '#096dd9'
          },
          label: node.id,
          labelCfg: {
              position: node.children && node.children.length > 0 ? 'left' : 'right'
          }
      };
  });

  graph.data(data);
  graph.render();
  graph.fitView();
}


const setData = () => {
  const data = {
      id: 'root',
      children: [],
  };

  const map = new Map();

  const objects = [
      eval,
      isFinite,
      isNaN,
      parseFloat,
      parseInt,
      decodeURI,
      decodeURIComponent,
      encodeURI,
      encodeURIComponent,
      Array,
      Date,
      RegExp,
      Promise,
      Proxy,
      Map,
      WeakMap,
      Set,
      WeakSet,
      Function,
      Boolean,
      String,
      Number,
      Symbol,
      Object,
      Error,
      EvalError,
      RangeError,
      ReferenceError,
      SyntaxError,
      TypeError,
      URIError,
      ArrayBuffer,
      SharedArrayBuffer,
      DataView,
      Float32Array,
      Float64Array,
      Int8Array,
      Int16Array,
      Int32Array,
      Uint8Array,
      Uint16Array,
      Uint32Array,
      Uint8ClampedArray,
      Atomics,
      JSON,
      Math,
      Reflect
  ];

  objects.forEach(o => {
      const node = {
          id: o.name || String(o),
          children: [],
      };
      data.children.push(node);
      map.set(o, node.children);
  });

  for (let i = 0; i < objects.length; i++) {
      let o = objects[i];
      for (let p of Object.getOwnPropertyNames(o)) {
          let d = Object.getOwnPropertyDescriptor(o, p)
          if ((d.value !== null && typeof d.value === "object") || (typeof d.value === "function")) {
            if (!map.has(d.value)) {
                const c = d.value;
                const children = [];
                map.set(c, children), objects.push(c);
                const node = {
                    id: c.name || `${o.name}.${p}`,
                    children,
                };
                map.get(o).push(node);
            }
          }
          if (d.get) {
            if (!map.has(d.get)) {
                const c = d.get;
                const children = [];
                map.set(c);
                objects.push(c);
                const node = {
                    id: c.name || `${o.name}.${p}`,
                    children,
                };
                map.get(o).push(node);
            }
          }
          if (d.set) {
            if (!map.has(d.set)) {
                // set.add(d.set), objects.push(d.set);
                const c = d.set;
                const children = [];
                map.set(c);
                objects.push(c);
                const node = {
                    id: c.name || `${o.name}.${p}`,
                    children,
                };
                map.get(o).push(node);
            }
          }
      }
  }
  return data;
}


const data = setData();

draw(data);
