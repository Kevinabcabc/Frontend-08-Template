const end = () => {
  return end;
}


const matchX = (c) => {
  if (c === 'x') {
    return end;
  } else {
    return matchA3(c);
  }
}

const matchB3 = (c) => {
  if (c === 'b') {
    return matchX;
  } else {
    return start(c);
  }
}

function matchA3(c) {
  if (c === 'a') {
    return matchB3;
  } else {
    return start(c);
  }
}


const matchB2 = (c) => {
  if (c === 'b') {
    return matchA3;
  } else {
    return start(c);
  }
}


const matchA2 = (c) => {
  if (c === 'a') {
    return matchB2;
  } else {
    return start(c);
  }
}


const matchB1 = (c) => {
  if (c === 'b') {
    return matchA2;
  } else {
    return start(c);
  }
}


const matchA1 = (c) => {
  if (c === 'a') {
    return matchB1;
  } else {
    return start(c);
  }
}


function start(c) {
  if (c === 'a') {
    return matchA1(c);
  } else {
    return start;
  }
}

const match = (str) => {
  let status = matchA1;
  for (let letter of str) {
    status = status(letter);
  }
  return status === end;
}

console.log(match('aaabcabababx')); // true
console.log(match('abababx')); // true
console.log(match('ababababx')); // true
console.log(match('ababababcx')); // false

// abc abx