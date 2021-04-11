export class Dispatcher {
  constructor(element) {
    this.element = element;
  }
  dispatch(type, properties) {
    let event = new Event(type);
    for (const name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}

export class Listener {
  constructor(element, recognizer) {
    let contexts = new Map();
    let isListeningMouse = false;
    element.addEventListener("mousedown", event => {
      let context = Object.create(null);
      context['handler'] = null;
      context['startX'] = 0;
      context['startY'] = 0;
      context['isPan'] = false;
      context['isTap'] = true;
      context['isPress'] = false;

      contexts.set('mouse' + (1 << event.button), context);
    
      recognizer.start(event, context);
    
      let mousemove = event => {
        let button = 1;
        while(button <= event.buttons) {
          if (button & event.buttons) {
            let key = button;
            if (button === 2) {
              key = 4;
            } else if (button === 4) {
              key = 2;
            }
            let context = contexts.get('mouse' + key);
            recognizer.move(event, context);
          }
          button = button << 1;
        }
      }
      let mouseup = event => {
        let context = contexts.get('mouse' + (1 << event.button));
        recognizer.end(event, context);
        contexts.delete('mouse' + (1 << event.button));
        if (event.buttons === 0) {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          isListeningMouse = false;
        }
      }
    
      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
      }
    });
    
    
    element.addEventListener("touchstart", event => {
      for (const touch of event.changedTouches) {
        let context = Object.create(null);
        context['handler'] = null;
        context['startX'] = 0;
        context['startY'] = 0;
        context['isPan'] = false;
        context['isTap'] = true;
        context['isPress'] = false;
        contexts.set(touch.identifier, context);
    
        recognizer.start(touch, context);
      }
    });
    
    element.addEventListener("touchmove", event => {
      for (const touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    });
    
    element.addEventListener("touchend", event => {
      for (const touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    });
    
    element.addEventListener("touchcancel", event => {
      for (const touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.cancel(touch, context);
        contexts.delete(touch.identifier);
      }
    });    
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  start(point, context) {
    context.startX = point.clientX, context.startY = point.clientY;
    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    }];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
  
    context.handler = setTimeout(() => {
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.handler = null;
      this.dispatcher('press', {});
    }, 500);
  }
  
  move(point, context) {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
  
    if (!context.isPan && dx**2 + dy**2 > 100) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      clearTimeout(context.handler);
      this.dispatcher('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }
  
    if (context.isPan) {
      this.dispatcher('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }
  
    context.points = context.points.filter(p => (Date.now() - p.t) < 500);
  
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    });
  }
  
  end(point, context) {
  
    context.points = context.points.filter(p => (Date.now() - p.t) < 500);
    let d,v;
    if (!context.points.length) {
      v = 0;
    } else {
      d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2) ;
      v = d / (Date.now() - context.points[0].t);
    }
  
    // px / ms
    if (v > 1.5) {
      context.isFlick = true;
      this.dispatcher('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v, // px / ms
      });
    } else {
      context.isFlick = false;
    }

    if (context.isTap) {
      this.dispatcher('tap', {});
      clearTimeout(context.handler);
    }
    if (context.isPress) {
      this.dispatcher('pressend', {});
    }
    if (context.isPan) {
      this.dispatcher('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v, // px / ms
      });
    }
  }
  
  cancel(point, context) {
    clearTimeout(context.handler);
    this.dispatcher('cancel', {});
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}