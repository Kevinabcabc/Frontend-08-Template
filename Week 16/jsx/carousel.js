import {Component, STATE, ATTRIBUTE} from './framworks';
import {enableGesture} from './gesture';
import {TimeLine, Animation} from './animation';
import {ease} from './ease';

export {STATE, ATTRIBUTE} from './framworks';

export class Carousel extends Component {
  constructor(type) {
    super();
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add("carousel");
    for (const record of (this[ATTRIBUTE].dataSource||[])) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url('${record.img}')`;
      this.root.appendChild(child);
    }

    this[STATE].position = 0;
    let t = Date.now();
    let ax = 0;
    let children = this.root.children;

    let handler = null;

    enableGesture(this.root);
    const timeline = new TimeLine();
    timeline.start();

    this.root.addEventListener('pan', (event) => {
      let x = event.clientX - event.startX - ax;
      let current = this[STATE].position - ((x - x % 500) / 500);
      for (const offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = (pos % children.length + children.length) % children.length;
        children[pos].style.transition = 'none';
        children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
      }
    });

    this.root.addEventListener('end', (event) => {
      timeline.reset();
      timeline.start();
      handler = setInterval(nextPicture, 2000);

      let x = event.clientX - event.startX - ax;
      
      let current = this[STATE].position - ((x - x % 500) / 500);
      let direction = Math.round((x % 500)/500);

      if (event.isFlick) {
        console.log('flick ', event.velocity);
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500)/500);
        } else {
          direction = Math.floor((x % 500)/500);
        }
      }

      for (const offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = (pos % children.length + children.length) % children.length;

        children[pos].style.transition = 'none';
        timeline.add(new Animation(children[pos].style, "transform",
        - pos * 500 + offset * 500 + x % 500,
        - pos * 500 + offset * 500 + direction * 500, 500, 0, ease, v => `translateX(${v}px)`))
      }

      this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;
      this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;

      this.triggerEvent('change', {position: this[STATE].position});
    });

    this.root.addEventListener('start', (event) => {
      console.log('start');
      timeline.pause();
      clearInterval(handler);
      if (Date.now() - t < 500) {
        let progress = (Date.now() - t)/500;
        ax = ease(progress) * 500 - 500;
      } else {
        ax = 0;
      }
    });

    this.root.addEventListener('tap', (event) => {
      this.triggerEvent('click', {
        position: this[STATE].position,
        src: this[ATTRIBUTE].dataSource[this[STATE].position].url,
      });
    });

    let nextPicture = () => {
      let nextPosition = (this[STATE].position + 1) % children.length;
      let current = children[this[STATE].position];
      let next = children[nextPosition];
      t = Date.now();

      timeline.add(new Animation(current.style, "transform", - this[STATE].position * 500, -500 - this[STATE].position * 500, 500, 0, ease, v => `translateX(${v}px)`))
      timeline.add(new Animation(next.style, "transform", 500 - nextPosition * 500, - nextPosition * 500, 500, 0, ease, v => `translateX(${v}px)`))
      this[STATE].position = nextPosition;
      this.triggerEvent('change', {position: this[STATE].position});
    }
    handler = setInterval(nextPicture, 2000);
    return this.root;
  }
}
