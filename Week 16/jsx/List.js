import {Component, STATE, ATTRIBUTE} from './framworks';
import {createElement} from './framworks';
import {enableGesture} from './gesture';
export {STATE, ATTRIBUTE} from './framworks';

export class List extends Component {
  constructor(type) {
    super();
  }
  render() {
    this.children = this[ATTRIBUTE].data.map(this.template);
    this.root = (<div >{this.children}</div>).render();
    return this.root;
  }
  appendChild(child) {
    this.template = child;
  }
}