export function createElement(type, attributes, ...children) {
  let element;
  console.log('type', type);
  if (typeof type === 'string')
    element = new ElementWrapper(type);
  else
    element = new type;

  for (const name in attributes) {
    if (Object.hasOwnProperty.call(attributes, name)) {
      element.setAttribute(name, attributes[name]);
    }
  }
  let processChildren = (children) => {
    for (const child of children) {
      console.log(child);
      if (typeof child === 'object' && child instanceof Array) {
        processChildren(child);
      } else {
        if (typeof child === 'string') {
          child = new TextWrapper(child);
        }
        element.appendChild(child);
      }
    }    
  }

  processChildren(children);

  return element;
}
export const STATE = Symbol('state');
export const ATTRIBUTE = Symbol('attribute');
export class Component {
  constructor(type) {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }
  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }
  render() {
    return this.root;
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  mountTo(element) {
    if (!this.root) {
      this.render();
    }
    element.appendChild(this.root);
  }
  triggerEvent(type, args) {
    this[ATTRIBUTE][`on${type.replace(/^[\s\S]/, (s) => s.toUpperCase())}`](new CustomEvent(type, {detail: args}))
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super(type);
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super(content);
    this.root = document.createTextNode(content);
  }
}
