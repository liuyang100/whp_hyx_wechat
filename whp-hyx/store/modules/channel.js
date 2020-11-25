import {
	MyRequest
} from '@/common/libs/MyRequest.js'
import HttpUrl from "@/common/httpUrl"
export default {
	state: {
		data: [], // 渠道数据
		allQuDaoData: [],
		storedata: [], // 所属区域
		systemDict: [], // 其他品牌
		huaQuArr: [{
				name: '市级',
				id: 1
			},
			{
				name: '区县级',
				id: 2
			},
			{
				name: '乡镇级',
				id: 3
			}

		],
		sale_org: [{
				name: 'A+类 洗衣机规模>3000万',
				id: 1
			},
			{
				name: 'A类 洗衣机规模>2000万',
				id: 2
			},
			{
				name: 'B类 洗衣机规模>1000万',
				id: 3
			},
			{
				name: 'C类 洗衣机规模>500万',
				id: 4
			},
			{
				name: 'D类 洗衣机规模>300万',
				id: 5
			},
			{
				name: 'E类 洗衣机规模>0万',
				id: 6
			}
		],
		taxpayer_list: [{
				name: '普通纳税人',
				id: 1
			},
			{
				name: '一般纳税人',
				id: 2
			}
		]
	},
	getters: {
		resultData(state) {
			return state.data
		},

	},
	mutations: {
		setAllQuDaoData(state, arr) {
			state.allQuDaoData = arr
		},
		setChannel(state, arr) {
			if (Object.prototype.toString.call(arr) === '[object Array]') {
				state.data = arr
			} else {
				return uni.showToast({
					title: '请求数据错误',
					icon: 'none'
				})
			}
		},
		setStore(state, arr) {
			if (Object.prototype.toString.call(arr) === '[object Array]') {
				state.storedata = arr
			} else {
				return uni.showToast({
					title: '请求数据错误',
					icon: 'none'
				})

			}
		},
		serSystemDict(state, arr) {
			if (Object.prototype.toString.call(arr) === '[object Array]') {
				state.systemDict = arr
			} else {
				return uni.showToast({
					title: '请求数据错误',
					icon: 'none'
				})
			}
		}
	},
	actions: {
		// 请求渠道数据
		getQuDaoData: async function({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {

				MyRequest({
					url: HttpUrl.custBaseData,
					data: {},
					success: res => {
						commit('setChannel', res.data.datas)
						resolve(res.data.datas);
					},
					fail: err => {
						reject(err.message)
					}
				});
			})
		},
		
		// 	调用请求所属区域数据
		getStoreData: async function({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				MyRequest({
					url: HttpUrl.findStore,
					data: {
						type: 1
					},
					success: res => {
						commit('setStore', res.data)
						resolve(res.data);
					},
					fail: err => {
						reject(err.message)
					}
				});
			})
		},
		// 其他品牌
		OtherClass: async function({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {

				MyRequest({
					url: HttpUrl.systemDict,
					success: res => {
						for (let i in res.data) {
							res.data[i]['checked'] = false;
						}
						commit('serSystemDict', res.data)
						resolve(res.data)
					},
					fail: (err => {
						reject(err.message)
					})
				});

			})

		}
	}
}
