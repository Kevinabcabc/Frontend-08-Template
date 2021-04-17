export function createElement(type, attributes, ...children) {
  let element;

  if (typeof type === 'string')
    element = new ElementWrapper(type);
  else
    element = new type;

  for (const name in attributes) {
    if (Object.hasOwnProperty.call(attributes, name)) {
      element.setAttribute(name, attributes[name]);
    }
  }

  for (const child of children) {
    if (typeof child === 'string') {
      child = new TextWrapper(child);
    }
    element.appendChild(child);
  }

  return element;
}

export class Component {
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    child.mountTo(this.root);
  }
  mountTo(element) {
    element.appendChild(this.root);
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super(type);
    this.render(type);
  }
  render(type) {
    return document.createElement(type);
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super(content);
    this.render(content);
  }
  render(content) {
    return document.createTextNode(content);
  }
}
