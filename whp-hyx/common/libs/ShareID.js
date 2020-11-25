import MyConfig from '../config'

function getShareID () {
	return uni.getStorageSync(MyConfig.varNames.shareID)
}

function setShareID (id) {
	uni.setStorageSync(MyConfig.varNames.shareID, id)
}

function removeShareID () {
	uni.removeStorageSync(MyConfig.varNames.shareID)
}

module.exports = {
	getShareID,
	setShareID,
	removeShareID,
}
