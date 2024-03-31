/**
 * 柯里化（currying）是一种讲多参数函数转化为一系列单函数的技术。
 * 通过固定部分参数，生成一个新的函数，该函数接受剩余的参数。
 * 这个过程可以重复进行，直到所有参数都被固定
 */

/**
 * 实现思路
 * 1.接收一个多参数函数作为输入。
 * 2.创建一个新的函数，该函数接受一部分参数。
 * 3.在新的函数内部，调用原函数，并将已经接收到的参数传递给它。
 * 4.将新的函数返回，以便继续处理剩余的参数。
 */

function currying(fn) {
    debugger
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return curried.bind(this, ...args);
        }
    }
}

const add = (a, b, c) => a + b + c;
const curriedAdd = currying(add);

console.log(curriedAdd(1)(2)(3));
console.log(curriedAdd(1, 2)(3));
console.log(curriedAdd(1, 2, 3));
