const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick_handler');
const ANIMATIONS = Symbol('animation');
const START_TIME = Symbol('add_time');
const PAUSE_START = Symbol('pause_start');
const PAUSE_END = Symbol('pause_end');
const PAUSE_TIME = Symbol('pause-time');

export class TimeLine {
  constructor() {
    this.state = "init"
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }
  start() {
    if (this.state !== 'init') {
      return;
    }
    this.state = 'stated';
    let startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      let now = Date.now();
      for (const animation of this[ANIMATIONS]) {
        let t;
        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay; 
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME]  - animation.delay;
        }

        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        if (t > 0)
          animation.receive(t);
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    }
    this[TICK]();
  }
  pause() {
    if (this.state !== 'stated') {
      return;
    }
    this.state = 'paused';
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  resume() {
    if (this.state !== 'paused') {
      return;
    }
    this.state = 'stated';
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }
  reset() {
    this.pause();
    this.state = 'init';
    this[PAUSE_TIME] = 0;
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[PAUSE_START] = 0;
    this[TICK_HANDLER] = null;
  }
  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration,delay, timingFunction, template) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFunction = timingFunction || ((v) => v);
    this.template = template || ((v) => v);
  }
  receive(time) {
    console.log(1, time);
    let range = this.endValue - this.startValue;
    let progress = this.timingFunction(time / this.duration);
    this.object[this.property] = this.template(this.startValue + range * progress);
  }
}

      // 浏览器执行下一贞执行代码
      // requestAnimationFrame(this[TICK]);
      // let handler = requestAnimationFrame(tick2);
      // cancelAnimationFrame(handler);