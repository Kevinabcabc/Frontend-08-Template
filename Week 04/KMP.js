
const kmp = (source, pattern) => {
  // 初始table
  let table = new Array(pattern.length).fill(0);
  {
    let i = 1, j = 0;
    while(i < pattern.length) {
  
      if (pattern[i] === pattern[j]) {
        ++i, ++j;
        table[i] = j;
      } else {
        if (j > 0)
          j = table[j];
        else
          i++;
      }
    }
  }
  console.log('table: ', JSON.stringify(table));
  {
    let i = 0, j = 0;
    while(i < source.length) {
      if (pattern[j] === source[i]) {
        ++i, ++j;
      } else {
        if (j > 0)
          j = table[j];
        else
          i++;
      }
      if (j === pattern.length)
        return true;
    }
    return false;
  }
}

let a = kmp('aabbaac', 'aabc');
console.log('res:', a);
