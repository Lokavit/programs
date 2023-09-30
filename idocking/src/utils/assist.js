/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-11 15:56:48
 * @LastEditTime: 2019-10-21 13:58:32
 */

function typeOf(obj) {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
  };
  return map[toString.call(obj)];
}

// deepCopy
function deepCopy(data) {
  const t = typeOf(data);
  let o;

  if (t === 'array') {
    o = [];
  } else if ( t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if ( t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i]);
    }
  }
  return o;
}

function filterData(conditions, data) {
  return data.filter( item => {
    return Object.keys( conditions ).every( key => {
      return String( item[ key ] ).toLowerCase().includes( 
        String( conditions[ key ] ).trim().toLowerCase())
      })
  })
}

function debounce (fn, delay) {
  return args => {
    clearTimeout(fn.id)

    fn.id = setTimeout(() => {
      fn.call(this, args)
    }, delay)
  }
}
export { deepCopy, typeOf, debounce, filterData }