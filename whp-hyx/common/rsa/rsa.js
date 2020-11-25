import {
	MyRequest
} from '@/common/libs/MyRequest.js'
import httpUrl from '@/common/httpUrl'
import JSEncrypt from './jsencrypt.js'

var publicKey = null;//你的公钥
var privateKey = null;//你的私钥

//获取公钥,私钥
function gergs(){
	MyRequest({
		url: httpUrl.getRsaCode,
		success: (res) => {
			privateKey = res.data.private_key;
			publicKey = res.data.public_key;
			console.log(privateKey);
		}
	})
}

function gerprivateKey(){
	return privateKey
}

//超过117(加密)长度的原文内容分割成多个部分

// 在源码 自己 添加 
JSEncrypt.prototype.encryptLong = function(string) {
	var k = this.getKey();
	try {
		var lt = "";
		var ct = "";
		//RSA每次加密117bytes，需要辅助方法判断字符串截取位置
		//1.获取字符串截取点
		var bytes = new Array();
		bytes.push(0);
		var byteNo = 0;
		var len, c;
		len = string.length;
		var temp = 0;
		for (var i = 0; i < len; i++) {
			c = string.charCodeAt(i);
			if (c >= 0x010000 && c <= 0x10FFFF) {
				byteNo += 4;
			} else if (c >= 0x000800 && c <= 0x00FFFF) {
				byteNo += 3;
			} else if (c >= 0x000080 && c <= 0x0007FF) {
				byteNo += 2;
			} else {
				byteNo += 1;
			}
			if ((byteNo % 117) >= 114 || (byteNo % 117) == 0) {
				if (byteNo - temp >= 114) {
					bytes.push(i);
					temp = byteNo;
				}
			}
		}
		//2.截取字符串并分段加密
		if (bytes.length > 1) {
			for (var i = 0; i < bytes.length - 1; i++) {
				var str;
				if (i == 0) {
					str = string.substring(0, bytes[i + 1] + 1);
				} else {
					str = string.substring(bytes[i] + 1, bytes[i + 1] + 1);
				}
				var t1 = k.encrypt(str);
				ct += t1;
			};
			if (bytes[bytes.length - 1] != string.length - 1) {
				var lastStr = string.substring(bytes[bytes.length - 1] + 1);
				ct += k.encrypt(lastStr);
			}
			return hex2b64(ct);
		}
		var t = k.encrypt(string);
		var y = hex2b64(t);
		return y;
	} catch (ex) {
		return false;
	}
};

//使用 公钥 加密
const fnencrypt = (password) => {
	let encryptor = new JSEncrypt(); // JSEncrypt对象
	encryptor.setPublicKey(publicKey); // 公钥
	let rsaPassWord = encryptor.encrypt(password); // 密码进行加密
	return rsaPassWord;
};



// 使用 私钥 解密
const fndecrypt = (password) => {
	let decryptor = new JSEncrypt();
	decryptor.setPrivateKey(privateKey); // 私钥
	let rsaPassWord = decryptor.decrypt(password);
	return rsaPassWord;
};

module.exports = {
	gergs,//
	fnencrypt,//加密
	fndecrypt,//解密
	gerprivateKey,// 私钥
}
