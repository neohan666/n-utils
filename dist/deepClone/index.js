/**
 * @Description: 深克隆
 * @Author: Neo
 * @Date: 2022-03-18
 * @LastEditTime: 2022-03-18
 * @LastEditors: Neo
 */
/**
 * @description: 深克隆方法
 * @param {any} target 源数据
 * @return {any} 克隆后的数据
 */
function deepClone(target) {
    function clone(target, map) {
        if (map === void 0) { map = new WeakMap(); }
        var result;
        var type = Object.prototype.toString.call(target).match(/\s(\w+)\]/)[1];
        if (typeof target !== 'object' || target === null) {
            // 基本数据类型
            result = target;
        }
        else {
            if (['Array', 'Set', 'Map', 'Object', 'Arguments'].includes(type)) {
                // 可递归遍历的类型处理
                // 循环引用处理
                if (map.get(target)) {
                    result = map.get(target);
                }
                else {
                    var Constr = target.constructor;
                    result = new Constr();
                    map.set(target, result);
                    if (type === 'Array') {
                        // Array
                        target.forEach(function (v) {
                            result.push(clone(v, map));
                        });
                    }
                    else if (type === 'Set') {
                        // Set
                        target.forEach(function (v) {
                            result.add(clone(v, map));
                        });
                    }
                    else if (type === 'Map') {
                        // Map
                        target.forEach(function (v, k) {
                            result.set(k, clone(v, map));
                        });
                    }
                    else {
                        // Object Arguments
                        Object.keys(target).forEach(function (k) {
                            result[k] = clone(target[k], map);
                        });
                    }
                }
            }
            else {
                // 不可递归遍历的类型处理
                var Constr = target.constructor;
                if (type === 'RegExp') {
                    // RegExp
                    result = new Constr(target.source, /\w*$/.exec(target));
                    result.lastIndex = target.lastIndex;
                }
                else if (type.includes('Function')) {
                    // Function AsyncFunction GeneratorFunction
                    result = target;
                }
                else if (['Date'].includes(type)) {
                    // Date
                    result = new Constr(target);
                }
                else if (type === 'Error') {
                    // Error
                    result = new Constr(target.message);
                    result.stack = target.stack;
                }
                else if (type === 'URL') {
                    // URL
                    result = new Constr(target.href);
                }
                else if (type.includes('Array')) {
                    // ArrayBuffer TypeArray BigArray ...
                    result = target.slice();
                }
                else if (type === 'DataView') {
                    // DataView
                    result = new Constr(target.buffer.slice(0), target.byteOffset, target.byteLength);
                }
                else {
                    try {
                        // 包装过的 Number String Symbol BigInt
                        var val = Constr.prototype.valueOf.call(target);
                        result = Object(val);
                    }
                    catch (err) {
                        // other
                        console.warn("Uncatched type\uFF1A".concat(type));
                        console.warn(err);
                    }
                }
            }
        }
        return result;
    }
    var res = clone(target);
    return res;
}
export default deepClone;
