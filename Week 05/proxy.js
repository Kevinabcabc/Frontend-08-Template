{
  let o = {
    a: 1,
    b: 2,
  }

  let po = new Proxy(o, {
    set(obj, prop, val) {
      console.log(obj, prop, val);
    }
  });
}

{
  let o = {
    a: 1,
    b: 2,
  }

  let echo = (o) => {
    return new Proxy(o, {
      set(obj, prop, val) {
        obj[prop] = val;
        console.log(obj, prop, val);
        return obj[prop];
      },
      get(obj, prop) {
        console.log(obj, prop);
        return obj[prop];
      }
    })
  }
  
  let eo = echo(o);
  eo.a;
  eo.b = 7;
  eo.x = 99;
}

{
  let o = {
    a: 1,
    b: 2,
  }
  let callbacks = [];
  let echo = (o) => {
    return new Proxy(o, {
      set(obj, prop, val) {
        obj[prop] = val;
        console.log(obj, prop, val);
        for (const callback of callbacks) {
          callback();
        }
        return obj[prop];
      },
      get(obj, prop) {
        console.log(obj, prop);
        return obj[prop];
      }
    })
  }

  let eo = echo(o);

  const effect = (cb) => {
    callbacks.push(cb);
  }

  effect(() => {
    console.log(1,eo.a);
  });

  effect(() => {
    console.log(2,eo.b);
  });
  eo.a = 33;
}