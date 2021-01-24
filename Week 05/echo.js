let o = {
  a: 1,
  b: {
    c: 33,
  },
}
let callbacks = new Map();
let echoReactivities = new Map();
let usedEchos = [];


let echo = (o) => {
  if (echoReactivities.has(o)) {
    return echoReactivities.get(o);
  }
  const proxy = new Proxy(o, {
    set(obj, prop, val) {
      obj[prop] = val;
      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          for (let callback of callbacks.get(obj).get(prop)) {
            callback();
          }
        }
      }
      return obj[prop];
    },
    get(obj, prop) {
      usedEchos.push([obj, prop]);
      if (typeof obj[prop] === 'object') {
        return echo(obj[prop]);
      }
      return obj[prop];
    }
  });
  echoReactivities.set(o, proxy);
  return proxy;
}

const effect = (cb) => {
  usedEchos = [];
  cb();
  for (let e of usedEchos) {
    if (!callbacks.has(e[0])) {
      callbacks.set(e[0], new Map());
    }
    if (!callbacks.get(e[0]).has(e[1])) {
      callbacks.get(e[0]).set(e[1], []);
    }
    callbacks.get(e[0]).get(e[1]).push(cb);
  }
}

let eo = echo(o);

effect(() => {
  console.log('echo a, c');
  console.log(1,eo.a);
  console.log(3,eo.c);
});

effect(() => {
  console.log('echo b');
  console.log(2,eo.b);
});

effect(() => {
  console.log('echo b.c', eo.b.c);
});

// eo.a = 33;
// eo.b = 44;
// eo.c = 77;

eo.b.c = 9;
eo.a = {o: 11}
