
import {TimeLine, Animation} from './animation';
import {ease, easeIn, easeInOut, easeOut} from './ease';
console.log('animation demo');
let tl = new TimeLine();

tl.start();

tl.add(new Animation(document.querySelector('#el1').style, "transform", 0, 500, 1000, 1000, ease, (v) => `translateX(${v}px)`));
tl.add(new Animation(document.querySelector('#el2').style, "transform", 0, 500, 1000, 1000, easeIn, (v) => `translateX(${v}px)`));
tl.add(new Animation(document.querySelector('#el3').style, "transform", 0, 500, 1000, 1000, easeOut, (v) => `translateX(${v}px)`));
tl.add(new Animation(document.querySelector('#el4').style, "transform", 0, 500, 1000, 1000, easeInOut, (v) => `translateX(${v}px)`));

// window.tl = tl;
// window.animation = new Animation({ set a(v) {console.log(3, v);}}, "a", 0, 100, 1000, null);

document.querySelector('#pause-btn').addEventListener('click', () => {
  tl.pause();
});
document.querySelector('#resume-btn').addEventListener('click', () => {
  tl.resume();
});