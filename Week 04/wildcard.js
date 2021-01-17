const find = (source, pattern) => {
  let startCount = 0;
  let startArr = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '*') {
      ++startCount;
      startArr.push(i);
    }
  }
  if (startCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== '?') {
        return false;
      }
      return true;
    }
  }

  for (let i = 0; i < startArr[0]; i++) {
    if (pattern[i] !== source[i] && pattern[i] !== '?') {
      return false;
    }
  }
  let i = startArr[0];
  let lastIndex = startArr[0];

  for (let p = 0; p < startCount - 1; p++) {
    i++;
    let subPattern = '';
    while (pattern[i] !== '*') {
      subPattern += pattern[i];
      i++;
    }

    let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
    reg.lastIndex = lastIndex;
    let res = reg.exec(source)
    console.log('reg res:', res);
    if (!res) {
      return false;
    }

    lastIndex = reg.lastIndex;
  }

  for (let j = 0; j < source.length - lastIndex && pattern[pattern.length - j] !== '*'; j++) {
    if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== '?') {
      return false;
    }
  }

  return true;

}

console.log(find('123', '123'));
console.log(find('1233333342', '1*3*42'));
console.log(find('abcabcabxaac', 'a*b?*b?x*c'));