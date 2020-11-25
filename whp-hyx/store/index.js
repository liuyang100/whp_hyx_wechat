import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import user from "@/store/modules/user.js"
import channel from './modules/channel.js'
import main from './modules/main.js'
import workerList from './modules/workerList.js'
const store = new Vuex.Store({
	modules: {
		channel,
		user,
		main,
		workerList
	}
})

// try {
// 	// 判断退出之前是否是退出状态
// 	store.commit('getislogin');
// 	let userInfo = uni.getStorageSync('userInfo');
// 	userInfo = JSON.parse(userInfo);
// 	console.log("---------USERINFO---------", userInfo);
// 	if (userInfo && userInfo.token && userInfo.is_auth) {
// 		store.commit('setislogin', true);
// 		store.commit('setRole', userInfo);
// 	} else {
// 		store.commit('setislogin', false)
// 	}
// } catch (e) {
// 	//TODO handle the exception
// 	store.commit('setislogin', false)
// }
// store.dispatch("login")
// 获取登录token

export default store
