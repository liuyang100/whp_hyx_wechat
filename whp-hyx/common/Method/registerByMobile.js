/* *
 手机验证码登陆
 接收 mobile 手机号
	 code 六位数验证码
 */

import {MyRequest} from '@/common/libs/MyRequest.js'
import httpUrl from '@/common/httpUrl'
import MyConfig from '@/common/config'
import {setUserInfoStorage} from '@/common/libs/UserInfo.js'

function registerByMobile(mobile, code) {
	return new Promise((resolve, reject) => {
		if (!mobile || mobile.length < 11) {
			MyConfig.comFuncs.showToast('请正确填写手机号')
			return resolve(false)
		} else if (!code || code.length < 6) {
			MyConfig.comFuncs.showToast('请正确填写验证码')
			return resolve(false)
		}
		MyRequest({ //手机验证码登陆
			url: httpUrl.registerByMobile,
			data: {
				mobile: mobile,
				captcha: code
			},
			success: (res) => {
				if (res && res.token) {
					setUserInfoStorage(res)
					resolve(true)
				}
			},
			fail: (err) => {
				resolve(false)
				MyConfig.comFuncs.showToast(err.message)
			}
		})
	})
}

module.exports = {
	registerByMobile,
}