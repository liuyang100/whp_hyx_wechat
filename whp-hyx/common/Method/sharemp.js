/* *
 保存图片到相册  sharemp(image) 传入一个图片数组集合
 */

import MyConfig from '@/common/config'

let images = null;

function sharemp(image) {
	images = image;
	uni.authorize({
		scope: 'scope.writePhotosAlbum',
		success: () => {
			saveImageToPhotosAlbum();
		},
		fail: (err) => {
			if (err.errMsg.indexOf('authorize:fail') < 0) {
				MyConfig.comFuncs.showToast(err.errMsg)
				return
			}
			uni.showModal({
				title: '系统提示',
				content: '保存海报到相册需要您的授权才能完成，确定授权？',
				confirmColor: '#DC3F35',
				success: (res) => {
					res.confirm && openSetting()
				}
			})
		}
	})
}

function openSetting() {
	uni.openSetting({
		success: (settings) => {
			if (settings.authSetting && settings.authSetting['scope.writePhotosAlbum']) {
				saveImageToPhotosAlbum();
			}
		}
	})
}

function saveImage(img) {
	return new Promise((resolve, reject) => {
		uni.saveImageToPhotosAlbum({
			filePath: img,
			success: () => {
				resolve(true);
			},
			fail: () => {
				reject(false);
			}
		})
	})
}

function saveImageToPhotosAlbum() { //保存到相册
	var downloadTasks = [];
	for (let i in images) {
		downloadTasks.push(saveImage(images[i]));
	}
	Promise.all(downloadTasks).then(res => {
		for(let i in res){
			if(!res){
				MyConfig.comFuncs.showToast('保存失败')
				return
			}
		}
		MyConfig.comFuncs.showToast('保存成功')
	});
}


module.exports = {
	sharemp,
}
