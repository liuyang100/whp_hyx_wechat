import MyConfig from '../config'

function setUserInfoStorage (obj, type) {
	if (!obj) return fasle
	const storageKey = type && type === 'wechat' ? MyConfig.varNames.wxUserInfo : MyConfig.varNames.userInfo
	uni.setStorageSync(storageKey, JSON.stringify(obj))
	return true
}

function setUserInfoStorageByKey (key, val = null, type) {
	if (!key) return fasle
	const storageKey = type && type === 'wechat' ? MyConfig.varNames.wxUserInfo : MyConfig.varNames.userInfo
	let userInfo = getUserInfoStorage(null, type)
	if (!userInfo) userInfo = {}
	userInfo[key] = val
	uni.setStorageSync(storageKey, JSON.stringify(userInfo))
	return true
}

function getUserInfoStorage (key, type) {
	let res = null
	const storageKey = type && type === 'wechat' ? MyConfig.varNames.wxUserInfo : MyConfig.varNames.userInfo
	let info = uni.getStorageSync(storageKey)
	if (!info) return res
	try{
		info = JSON.parse(info)
	}catch(e){
		return res
	}
	if (!key) return info
	const keyType = Object.prototype.toString.call(key)
	if (keyType === '[object String]') {
		res = info[key] || null
	} else if (keyType === '[object Array]') {
		res = {}
		const kLen = key.length
		for (let i = 0; i < kLen; i++) {
			if (typeof info[key[i]] !== 'undefined') res[key[i]] = info[key[i]]
		}
	}
	return res
}

function removeUserInfoStorage (type) {
	if (type === 'system') uni.removeStorageSync(MyConfig.varNames.userInfo)
	else if (type === 'wechat') uni.removeStorageSync(MyConfig.varNames.wxUserInfo)
	else {
		uni.removeStorageSync(MyConfig.varNames.wxUserInfo)
		uni.removeStorageSync(MyConfig.varNames.userInfo)
	}
}

module.exports = {
	setUserInfoStorage,
	getUserInfoStorage,
	removeUserInfoStorage,
	setUserInfoStorageByKey
}
