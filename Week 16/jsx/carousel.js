import {Component} from './framworks';
import {enableGesture} from './gesture';
import {TimeLine, Animation} from './animation';
import {ease} from './ease'

export class Carousel extends Component {
  constructor(type) {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
    console.log(111, this.attributes);
  }
  render() {
    console.log(222, this.attributes);
    this.root = document.createElement('div');
    this.root.classList.add("carousel");
    for (const record of (this.attributes.src||[])) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url('${record}')`;
      this.root.appendChild(child);
    }

    let position = 0;
    let t = Date.now();
    let ax = 0;
    let children = this.root.children;

    let handler = null;

    enableGesture(this.root);
    const timeline = new TimeLine();
    timeline.start();

    this.root.addEventListener('pan', (event) => {
      let x = event.clientX - event.startX - ax;
      let current = position - ((x - x % 500) / 500);
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
      
      let current = position - ((x - x % 500) / 500);
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
      console.log('ppppp1', position);

      position = position - ((x - x % 500) / 500) - direction;
      position = (position % children.length + children.length) % children.length;
      console.log('ppppp2', position);
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

    let nextPicture = () => {
      let nextPosition = (position + 1) % children.length;
      let current = children[position];
      let next = children[nextPosition];
      t = Date.now();

      timeline.add(new Animation(current.style, "transform", - position * 500, -500 - position * 500, 500, 0, ease, v => `translateX(${v}px)`))
      timeline.add(new Animation(next.style, "transform", 500 - nextPosition * 500, - nextPosition * 500, 500, 0, ease, v => `translateX(${v}px)`))
      position = nextPosition;
    }
    handler = setInterval(nextPicture, 2000);



    /*
    this.root.addEventListener('mousedown', event => {
      console.log('mousedown');
      let startX = event.clientX;
      let children = this.root.children;

      let move = event => {
        let x = event.clientX - startX;

        let current = position - ((x - x % 500) / 500);

        for (const offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
        }
      }

      let up = event => {
        console.log('up');
        let x = event.clientX - startX;
        position = position - Math.round(x / 500);

        for (const offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;
          children[pos].style.transition = '';
          children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`;
        }

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });


    // let currentIndex = 0;

    // setInterval(() => {
    //   let children = this.root.children;
    //   let nextIndex = (currentIndex + 1) % children.length;

    //   let current = children[currentIndex];
    //   let next = children[nextIndex];

    //   next.style.transition = 'none';
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

    //   setTimeout(() => {
    //     next.style.transition = '';
    //     current.style.transform = `translateX(${-100 - nextIndex * 100}%)`;
    //     next.style.transform = `translateX(${-nextIndex * 100}%)`;

    //     currentIndex = nextIndex;
    //   }, 16);
    // }, 2000);
    */
    return this.root;
  }
  mountTo(parent) {
    // this.render();
    parent.appendChild(this.render());
  }
}
