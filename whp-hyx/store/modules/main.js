//  首页 - 新网点进度
//  首页 - 巡店计划

import Myconfig from '@/common/config'
import {
	MyRequest
} from '@/common/libs/MyRequest.js'
import HttpUrl from "@/common/httpUrl"
import user from './user.js'
export default {
	state: {
		// 采购任务
		cg_tabIndex: 0,
		index_cg: [{
				type: 'mothons',
				flag: 2,
				firstLoad: true,
				data: {
					cg_task_amout: 0, // 目标金额
					cg_amount: 0, //已完成
					proportion: 0, // 完成进度
				}
			},
			{
				type: 'years',
				flag: 1,
				firstLoad: true,
				data: {
					cg_task_amout: 0, // 目标金额
					cg_amount: 0, //已完成
					proportion: 0, // 完成进度
				}
			}
		],
		ls_tabIndex: 0,
		//零售任务
		index_ls: [{
				type: 'mothons',
				flag: 2,
				firstLoad: true,
				data: {
					sale_task_amout: 0, // 目标金额
					sale_amount: 0, //已完成
					proportion: 0, // 完成进度
				}
			},
			{
				type: 'years',
				flag: 1,
				firstLoad: true,
				data: {
					sale_task_amout: 0, // 目标金额
					sale_amount: 0, //已完成
					proportion: 0, // 完成进度
				}
			}
		],
		not_tabindex: 0,
		// 新开网点
		notpress: [{
				type: 'mothons',
				flag: 2,
				firstLoad: true,
				data: {
					completed: 0,
					target_task: 0,
					proportion: 0
				}
			},
			{
				type: 'years',
				flag: 1,
				firstLoad: true,
				data: {
					completed: 0,
					target_task: 0,
					proportion: 0
				}
			}
		],
		// 巡店计划
		patrol_store: {
			not_visited: 0,
			visited: 0,
			visited_rate: 0,
			proportion: 0
		},
	},
	getters: {

	},
	mutations: {
		setIndex_cg(state, obj) {
			let item = state.index_cg[obj.index];
			item.data = obj.data;
			state.cg_tabIndex = obj.index;
			item.firstLoad = false;
		},
		setIndex_ls(state, obj) {
			let item = state.index_ls[obj.index];
			item.data = obj.data;
			state.ls_tabIndex = obj.index;
			item.firstLoad = false;
		},
		setNotpress(state, obj) {
			let item = state.notpress[obj.index];
			item.data = obj.data;
			state.not_tabindex = obj.index;
			item.firstLoad = false;
		},
		// 巡店
		setPatrol_store(state, result) {
			try {
				for (let key in result) {
					result[key] = Math.round(result[key]);
				}
				state.patrol_store = result;
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				uni.showToast({
					title: '返回巡店计划的数据格式错误',
					icon: 'none',
					duration: 2000
				});
			}
		}
	},
	actions: {
		getPatrol_storeData: async function({
			commit,
			state
		}, tempObj = {}) {
			const {
				url,
				data
			} = tempObj;
			return await new Promise((resolve, reject) => {
				MyRequest({
					url: url,
					data: data,
					success: res => {
						commit('setPatrol_store', res)
						resolve(res);
					},
					fail: err => {
						reject(err.message)
					}
				});
			})
		},
	}
}
