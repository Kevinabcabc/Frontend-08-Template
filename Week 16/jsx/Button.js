import {Component, STATE, ATTRIBUTE} from './framworks';
import {createElement} from './framworks';
import {enableGesture} from './gesture';
export {STATE, ATTRIBUTE} from './framworks';

export class Button extends Component {
  constructor(type) {
    super();
  }
  render() {
    this.childContainer = (<span />);
    this.root = (<div >{this.childContainer}</div>).render();
    return this.root;
  }
  appendChild(child) {
    if (!this.childContainer) {
      this.render();
    }
    this.childContainer.appendChild(child);
  }
}