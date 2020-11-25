/**
 * 将unll转为undefind
 */
const nullToUndefind = function(s) {
	if (Object.prototype.toString.call(s) === '[object Null]') {
		return undefined
	} else {
		return true
	}
};

/**
 * 检测是否为unll undefind ""
 * 满足条件返回true   反之false
 * */
const isbank = function(val) {
	var type = typeof val;
	if (type === 'string') {
		return !val.trim();
	} else if (type === 'undefined') {
		return !val;
	} else if (type === 'object') {
		return !nullToUndefind(val)
	} else {
		return false;
	}
};

// 验证是否为对象 ，返回值为布尔值
function isObject(obj) {
	return valueType(obj) == 'Object'
};

// 验证是否为数组， 返回值为布尔值
function isArray(obj) {
	return valueType(obj) == 'Array'
};

// 公共判断数据类型的方法
function valueType(param) {
	return Object.prototype.toString.call(param).match(/\s+(\w+)/)[1] //正则匹配
};

const isEmptyArarry = function(arr) {
	if (Array.isArray(arr)) {
		return !arr.length
	}
};

const deepClone = function(obj) {
	let result;
	if (typeof obj === 'object') {
		result = isArray(obj) ? [] : {}
		for (let i in obj) {
			result[i] = isObject(obj[i]) ? deepClone(obj[i]) : obj[i]
		}
	} else {
		result = obj;
	}
	return result
};
const flatten = function(arr) {
	return arr.reduce((result, item) => {
		return result.concat(Array.isArray(item) ? flatten(item) : item);
	}, []);
};


module.exports = {
	nullToUndefind,
	isbank,
	isEmptyArarry,
	deepClone,
	flatten
}
