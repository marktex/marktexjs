const escapeReplace = /[&<>"']/g;
const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];

export function escape(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

export function merge(obj) {
    let i = 1,
        target,
        key;

    for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
            }
        }
    }

    return obj;
}

export function curry(fn, ...args) {
    let length = fn.length;
    return function () {
        args = args.concat(arguments);
        // if (args.length < length) {
        //     return curry.call(this, fn, ...args);
        // } else {
        //     return fn.apply(this, args);
        // }
        return args.length < length
            ? curry.call(this, fn, ...args)
            : fn.call(this, ...args);
    };
}

// module.exports = {
//     merge,
// };
