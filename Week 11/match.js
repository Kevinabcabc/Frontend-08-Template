/*
JS获取DOM元素的方法（8种）
  通过ID获取（getElementById）
  通过name属性（getElementsByName）
  通过标签名（getElementsByTagName）
  通过类名（getElementsByClassName）
  通过选择器获取一个元素（querySelector）
  通过选择器获取一组元素（querySelectorAll）
  获取html的方法（document.documentElement）
  document.documentElement是专门获取html这个标签的
  获取body的方法（document.body）
  document.body是专门获取body这个标签的。
*/
//  此方法仅实现getElementById


const match = (selector, element) => {
  let childNodes = element.parentNode.childNodes;
  for(let node of childNodes){
      let tagName = node.localName;
      let id = node.id;
      let className = node.className;
      if(selector === tagName+' #'+id+'.'+className)
          return true;
  }
  return false;
}

// match('div #id', document.getElementById('id'));

//let pattern = /([a-zA-Z]+)|(\#[a-zA-Z]+)|(\.[a-zA-Z]+)/g
