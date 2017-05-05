var Mexp = require('./postfix.js')
Mexp.prototype.postfixEval = function (UserDefined) {
  'use strict'
  if (typeof this.message !== 'undefined') {
    return new SyntaxError(this.message)
  }
  UserDefined = UserDefined || {}
  UserDefined.PI = Math.PI
  UserDefined.E = Math.E
  var stack = []
  var pop1, pop2, pop3
  var arr = this.postfixed
  var bool = (typeof UserDefined.n !== 'undefined')
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].type === 1) {
      stack.push({
        value: arr[i].value,
        type: 1
      })
    } else if (arr[i].type === 3) {
      stack.push({
        value: UserDefined[arr[i].value],
        type: 1
      })
    } else if (arr[i].type === 0) {
      if (typeof stack[stack.length - 1].type === 'undefined') {
        stack[stack.length - 1].value.push(arr[i])
      } else stack[stack.length - 1].value = arr[i].value(stack[stack.length - 1].value)
    } else if (arr[i].type === 7) {
      if (typeof stack[stack.length - 1].type === 'undefined') {
        stack[stack.length - 1].value.push(arr[i])
      } else stack[stack.length - 1].value = arr[i].value(stack[stack.length - 1].value)
    } else if (arr[i].type === 8) {
      pop1 = stack.pop()
      pop2 = stack.pop()
      stack.push({
        type: 1,
        value: arr[i].value(pop2.value, pop1.value)
      })
    } else if (arr[i].type === 10) {
      pop1 = stack.pop()
      pop2 = stack.pop()
      if (typeof pop2.type === 'undefined') {
        pop2.value = pop2.concat(pop1)
        pop2.value.push(arr[i])
        stack.push(pop2)
      } else if (typeof pop1.type === 'undefined') {
        pop1.unshift(pop2)
        pop1.push(arr[i])
        stack.push(pop1)
      } else {
        stack.push({
          type: 1,
          value: arr[i].value(pop2.value, pop1.value)
        })
      }
    } else if (arr[i].type === 2 || arr[i].type === 9) {
      pop1 = stack.pop()
      pop2 = stack.pop()
      if (typeof pop2.type === 'undefined') {
        pop2 = pop2.concat(pop1)
        pop2.push(arr[i])
        stack.push(pop2)
      } else if (typeof pop1.type === 'undefined') {
        pop1.unshift(pop2)
        pop1.push(arr[i])
        stack.push(pop1)
      } else {
        stack.push({
          type: 1,
          value: arr[i].value(pop2.value, pop1.value)
        })
      }
    } else if (arr[i].type === 12) {
      pop1 = stack.pop()
      if (typeof pop1.type !== 'undefined') {
        pop1 = [pop1]
      }
      pop2 = stack.pop()
      pop3 = stack.pop()
      var temp = new Mexp()
      temp.postfixed = pop1
      stack.push({
        type: 1,
        value: arr[i].value(pop3.value, pop2.value, temp)
      })
    } else if (arr[i].type === 13) {
      if (bool) {
        stack.push({
          value: UserDefined[arr[i].value],
          type: 3
        })
      } else stack.push([arr[i]])
    }
  }
  if (stack.length > 1) {
    return
  }
  this.value = stack[0].value > 1000000000000000 ? 'Infinity' : parseFloat(stack[0].value.toFixed(15))
  return this.value
}
// for back compatibility
Mexp.eval = function (str, tokens, obj) {
  if (typeof tokens === 'undefined') {
    return (new Mexp).lex(str).toPostfix().postfixEval()
  } else if (typeof obj === 'undefined') {
    if (typeof tokens.length !== 'undefined') {
      return (new Mexp).lex(str, tokens).toPostfix().postfixEval()
    } else {
      return (new Mexp).lex(str).toPostfix().postfixEval(tokens)
    }
  } else {
    return (new Mexp).lex(str, tokens).toPostfix().postfixEval(obj)
  }
}
// var t = 100000
// while (t--) {
//  Mexp.eval('2+3-40*78-34/2+100')
// }
module.exports = Mexp
