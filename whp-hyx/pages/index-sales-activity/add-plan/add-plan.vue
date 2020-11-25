<template>
	<view class="currt-page">
		<evan-form class="evan-form-show" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="formData">
			<evan-form-item :label-style="labelStyle" label="客户名称" class="evan-form-item" prop="customer_id" show_jiantou @click="goSelectCustomer">
				<view class="value" :style="{ color: customer_name ? '#333' : '#ccc' }">{{ customer_name || '请选择客户' }}</view>
			</evan-form-item>
			<evan-form-item :label-style="labelStyle" label="活动时间" prop="endDate" class="evan-form-item " @click="open" show_jiantou>
				<view class="value" v-if="showTime">{{ formData.beginDate | sliceTimeStr }} 至 {{ formData.endDate | sliceTimeStr }}</view>
				<view class="value color-ccc" v-else>请选择活动时间</view>
			</evan-form-item>
			<evan-form-item :label-style="labelStyle" label="预计费用" prop="promotion" class="evan-form-item ">
				<input
					type="digit"
					confirm-type="确定"
					class="form-input"
					v-model="formData.promotion"
					:maxlength="formData.promotion | maxlength"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					placeholder="请填写"
				/>
			</evan-form-item>

			<view class="bg-white m-form-item " @click="openJointBrand">
				<view class="m-label">联合品牌品类</view>
				<view class="m-value">
					<text v-if="brandClassName">{{ brandClassName }}</text>
					<text class="placeholder-style" v-else>请选择</text>
				</view>
				<view class="flex-shrink iconfont main-iconfont">&#xe601;</view>
			</view>
			<evan-form-item label="预计销额" :label-style="labelStyle" class="evan-form-item "></evan-form-item>
			<view class="m-sub-form">
				
				<template v-if="bx_exist">
					<view class=" m-sub-form-item">
						<view class="m-sub-label required">冰箱</view>
						<input
							type="digit"
							confirm-type="确定"
							class="sub-form-input"
							v-model="formData.bxestimatedSales"
							:maxlength="formData.bxestimatedSales | maxlength"
							placeholder-style="font-size: 28rpx;color:#ccc;"
							placeholder="请输入"
						/>
					</view>
					<view class="check-price-max" v-if="checkPriceNum(formData.bxestimatedSales)">预计销额不小于1000元</view>
				</template>
				<template v-if="xyj_exist">
					
					<view class=" m-sub-form-item">
						<view class="m-sub-label required">洗衣机</view>
						<input
							type="digit"
							confirm-type="确定"
							class="sub-form-input"
							v-model="formData.xyjestimatedSales"
							:maxlength="formData.xyjestimatedSales | maxlength"
							placeholder-style="font-size: 28rpx;color:#ccc;"
							placeholder="请输入"
						/>
					</view>
					<view class="check-price-max" v-if="checkPriceNum(formData.xyjestimatedSales)">预计销额不小于1000元</view>
				</template>
			</view>
			<evan-form-item label="预计销量" :label-style="labelStyle" class="evan-form-item "></evan-form-item>
			<view class="m-sub-form">
				
				<view class=" m-sub-form-item required" v-if="bx_exist">
					<view class="m-sub-label required">冰箱</view>
					<input
						type="number"
						confirm-type="确定"
						class="sub-form-input"
						:value="formData.bxestimatedSalesQuantity"
						@input="checkMaxalesQuantity($event, 'bxestimatedSalesQuantity')"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						placeholder="请填写"
					/>
				</view>
				<view class=" m-sub-form-item required" v-if="xyj_exist">
					<view class="m-sub-label required">洗衣机</view>
					<input
						type="number"
						confirm-type="确定"
						class="sub-form-input"
						:value="formData.xyjestimatedSalesQuantity"
						@input="checkMaxalesQuantity($event, 'xyjestimatedSalesQuantity')"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						placeholder="请填写"
					/>
				</view>
			</view>
			<evan-form-item label="促销类型" :label-style="labelStyle" prop="activityType" class="evan-form-item " show_jiantou>
				<picker mode="selector" style="width: 100%;height: 100%;" :value="formData.activityType" :range="activityTypeArr" @change="bindChangeActivityType" range-key="name">
					<view class="value" :style="{ color: formData.activityType ? '#333' : '#ccc' }">{{ activityTypeArr[formData.activityType].name }}</view>
				</picker>
			</evan-form-item>
			<evan-form-item label="促销时机" :label-style="labelStyle" prop="opportunityType" class="evan-form-item " show_jiantou>
				<picker
					mode="selector"
					style="width: 100%;height: 100%;"
					:value="formData.opportunityType"
					:range="promOpportunity"
					@change="bindChangePromOpportunity"
					range-key="name"
				>
					<view class="value" :style="{ color: formData.opportunityType ? '#333' : '#ccc' }">{{ promOpportunity[formData.opportunityType].name }}</view>
				</picker>
			</evan-form-item>
			<evan-form-item label="促销内容" :label-style="labelStyle" prop="contentType" class="evan-form-item " show_jiantou>
				<picker mode="selector" style="width: 100%;height: 100%;" :value="formData.contentType" :range="promContent" @change="bindChangePromContent" range-key="name">
					<view class="value" :style="{ color: formData.contentType ? '#333' : '#ccc' }">{{ promContent[formData.contentType].name }}</view>
				</picker>
			</evan-form-item>
			<evan-form-item label="是否到店活动" :label-style="labelStyle" prop="isToStore" class="evan-form-item">
				<view class="value">
					<radio-group class="d-flex j-end" @change="toStoreRadioChange">
						<label v-for="(item, index) in toStoreList" :key="item.value">
							<view>
								<radio :value="item.value" class="scale-radio" />
								{{ item.name }}
							</view>
						</label>
					</radio-group>
				</view>
			</evan-form-item>
		</evan-form>
		<view class="bctj-btn"><button class=" button" size="mini" @click="submit">提交</button></view>
		<!-- 时间选择 -->
		<time-range ref="select-time" @confirm="confirmTime" @cancel="cancelTime" />
		<joint-brand ref="joint-brand" :list="brandList" @change="brandChange" @cancel="brandCancel" @confirm="brandConfirm" />
	</view>
</template>

<script>
import evanForm from '@/components/evan-form/evan-form.vue';
import evanFormItem from '@/components/evan-form/evan-form-item.vue';
import timeRange from '@/components/time-range/time-range.vue';
import jointBrand from '../joint-brand/joint-brand.vue';
import utils from '@/components/evan-form/utils.js';
import { isEmptyArarry, deepClone } from '@/ulits/Validation.js';
import { timeFormat } from '@/ulits/function/timeFormat.js';
export default {
	components: {
		evanForm,
		evanFormItem,
		timeRange,
		jointBrand
	},
	data() {
		const activityTypeArr = [
			{
				sindex: 0,
				id: 0,
				name: '请选择'
			},
			{
				sindex: 1,
				id: 1,
				name: '团购会'
			},
			{
				sindex: 2,
				id: 2,
				name: '以旧换新'
			},
			{
				sindex: 3,
				id: 3,
				name: '单品主推'
			},
			{
				sindex: 4,
				id: 4,
				name: '微信秒杀'
			},
			{
				sindex: 5,
				id: 5,
				name: '直播抢购'
			},
			{
				sindex: 6,
				id: 6,
				name: '仓储直销'
			},
			{
				sindex: 7,
				id: 7,
				name: '内购会'
			},
			{
				sindex: 8,
				id: 8,
				name: '工厂巡展'
			},
			{
				sindex: 9,
				id: 9,
				name: '拼团购'
			},
			{
				sindex: 10,
				id: 10,
				name: '异业联盟'
			},
			{
				sindex: 11,
				id: 11,
				name: '品牌联盟'
			},
			{
				sindex: 12,
				id: 12,
				name: '其他'
			}
		];
		const promOpportunity = [
			{
				sindex: 0,
				id: 0,
				name: '请选择'
			},
			{
				sindex: 1,
				id: 1,
				name: '新品上市/产品推介'
			},
			{
				sindex: 2,
				id: 2,
				name: '老品退市'
			},
			{
				sindex: 3,
				id: 3,
				name: '国家政策响应'
			},
			{
				sindex: 4,
				id: 4,
				name: '旺季启动'
			},
			{
				sindex: 5,
				id: 5,
				name: '旺季销售'
			},
			{
				sindex: 6,
				id: 6,
				name: '旺季结束'
			},

			{
				sindex: 7,
				id: 7,
				name: '销售淡季'
			},
			{
				sindex: 8,
				id: 8,
				name: '节假日'
			},
			{
				sindex: 9,
				id: 9,
				name: '开业、庆典、品牌日、自造节日'
			},
			{
				sindex: 10,
				id: 10,
				name: '团购、内购'
			},
			{
				sindex: 11,
				id: 11,
				name: '样机集中处理优惠'
			},
			{
				sindex: 12,
				id: 12,
				name: '获得殊荣'
			},
			{
				sindex: 13,
				id: 13,
				name: '其他'
			}
		];
		const promContent = [
			{
				sindex: 0,
				id: 0,
				name: '请选择'
			},
			{
				sindex: 1,
				id: 1,
				name: '特价/折扣/直降'
			},
			{
				sindex: 2,
				id: 2,
				name: '第二件半价'
			},
			{
				sindex: 3,
				id: 3,
				name: '优惠券(代金券 或折扣券)'
			},
			{
				sindex: 4,
				id: 4,
				name: '买赠'
			},
			{
				sindex: 5,
				id: 5,
				name: '抽奖/游戏'
			},
			{
				sindex: 6,
				id: 6,
				name: '以旧换新'
			},

			{
				sindex: 7,
				id: 7,
				name: '返现'
			},
			{
				sindex: 8,
				id: 8,
				name: '会员专享价'
			},
			{
				sindex: 9,
				id: 9,
				name: '套购'
			},
			{
				sindex: 10,
				id: 10,
				name: '满减'
			},
			{
				sindex: 11,
				id: 11,
				name: '前200优惠'
			},
			{
				sindex: 12,
				id: 12,
				name: '免费体验'
			},
			{
				sindex: 13,
				id: 13,
				name: '其他'
			}
		];

		return {
			bx_exist: false,
			xyj_exist: false,
			keyval: '',
			promotionMaxL: 20,
			isloading: false,
			hideRequiredAsterisk: false,
			activityTypeArr,
			promOpportunity,
			promContent,
			brandList: [],
			selectBrandList: [], //选中品牌
			brandClassName: '',
			customer_name: '',
			formData: {
				bxestimatedSales:"", //冰箱预计销额
				bxestimatedSalesQuantity:"", //冰箱预计销量 
				xyjestimatedSales:"", //洗衣机预计销额
				xyjestimatedSalesQuantity:"",//洗衣机预计销量
				
				bxactualSales:"", //冰箱实际销额
				bxactualSalesQuantity:"", //冰箱实际销量
				xyjactualSales:"",//洗衣机实际销额
				xyjactualSalesQuantity:"", //洗衣机实际销量
				
				beginDate: '', // 预计活动开始时间
				endDate: '', // 预计活动结束时间
				promotion: '', //预计活动费用
				activityType: 0, // 预计活动类型
				opportunityType: 0, // 促销时机
				contentType: 0, //促销内容
				activityStatues: '', // 预计活动状态
				executeStatus: 'N', //0上报计划  1执行计划,
				customer_id: null,
				isToStore: null
			},
			toStoreList: [
				{
					value: 1,
					name: '是'
				},
				{
					value: 0,
					name: '否'
				}
			],
			rules: {
				customer_id: {
					required: true,
					message: '请选择客户'
				},
				beginDate: {
					required: true,
					message: '请选择活动开始时间'
				},
				endDate: {
					required: true,
					message: '请选择活动结束时间'
				},
				promotion: {
					required: true,
					message: '预计费用不能为空'
				},
				
			
				bxestimatedSales: {
					validator: this.checkBxCategory_m
				}, //冰箱预计销额
				xyjestimatedSales: {
					validator: this.checkXyjCategory_m
				
				}, //洗衣机预计销额
				bxestimatedSalesQuantity: {
					validator: this.checkBxCategory_l
					
				}, //冰箱预计销量
				xyjestimatedSalesQuantity: {
					validator: this.checkXyjCategory_l
							
				}, //洗衣机预计销量
				
				activityType: [
					{
						required: true,
						message: '请选择促销类型'
					},
					{
						validator: this.activityTypeFun
					}
				],

				opportunityType: [
					{
						required: true,
						message: '请选择促销时机'
					},
					{
						validator: this.opportunityTypeFun
					}
				],
				contentType: [
					{
						required: true,
						message: '请选择促销内容'
					},
					{
						validator: this.contentTypeFun
					}
				],
				isToStore: {
					required: true,
					message: '请选择到店活动'
				}
			}
		};
	},

	filters: {
		sliceTimeStr(val) {
			val = val.split(' ');
			if (Array.isArray(val)) {
				return val[0];
			} else {
				return '';
			}
		},
		// 动态计算价格最多最多输入两位浮点数
		maxlength(val) {
			const moneyTwoFiex = /\.\d{2,}$/;
			if (moneyTwoFiex.test(val)) {
				if (typeof val == 'string') {
					return val.trim().length;
				}
				if (typeof val == 'number') {
					return val.toString().length;
				}
			} else {
				return -1;
			}
		}
	},
	computed: {
		labelStyle() {
			return {
				width: '260rpx',
				'font-weight': 'bold'
			};
		},

		showTime() {
			if (this.formData.beginDate && this.formData.endDate) {
				return true;
			} else {
				return false;
			}
		}
	},

	onLoad() {
		this.initRequest();
	},
	mounted() {
		this.$refs.form.setRules(this.rules);
	},
	methods: {
		/* 初始化 */
		async initRequest() {
			try {
				const brandList = await this.getBrandList();
				this.brandList = brandList.datas.slice(0, 6).map(v => {
					return {
						brand_name: v.brand_name,
						brand_id: v.brand_id,
						business_category_name: v.pc_name,
						business_category_id: v.pc_id,
						check: false
					};
				});
			} catch (e) {
				console.log(e);
				//TODO handle the exception
			}
		},

		validmyRequest(reqData = {}) {
			let data = { ...this.formData };
			data.bxestimatedSales && (reqData.bxestimatedSales = Number(data.bxestimatedSales)); //冰箱预计销额
			data.bxestimatedSalesQuantity && (reqData.bxestimatedSalesQuantity = Number(data.bxestimatedSalesQuantity)); //冰箱预计销量
			data.xyjestimatedSales && (reqData.xyjestimatedSales = Number(data.xyjestimatedSales)); //洗衣机预计销额
			data.xyjestimatedSalesQuantity && (reqData.xyjestimatedSalesQuantity = Number(data.xyjestimatedSalesQuantity)); //洗衣机预计销量
			reqData.businessCategorys = this.selectBrandList;
			reqData.customer_id = data.customer_id;
			reqData.beginDate = data.beginDate;
			reqData.endDate = data.endDate;
			reqData.promotion = Number(data.promotion);
			reqData.activityType = data.activityType;
			reqData.activityContent = data.opportunityType;
			reqData.activityTime = data.contentType;
			reqData.executeStatus = data.executeStatus;
			reqData.isToStore = data.isToStore;
			return reqData;
		},
		submit() {
			// 验证通过
			try {
				let isOk = true;
				utils.validate(this.formData, this.rules, (res, errors) => {
					if (!res) {
						isOk = false;
					}
				});
				if (!isOk) return;
				let optionData = this.validmyRequest();
				if (!optionData) return;
				console.log(JSON.stringify(optionData, null, 4));
				uni.showLoading({
					title: '提交中...'
				});
				this.$myRequest({
					url: this.$myhttpUrl.index_sales_promotion_save,
					data: optionData,
					success(res) {
						console.log('提交成功', res);
						uni.showToast({
							title: '提交成功'
						});
						setTimeout(function() {
							let pages = getCurrentPages(); // 当前页面
							let beforePage = pages[pages.length - 2]; // 前一个页面
							uni.navigateBack({
								success: function() {
									beforePage.onLoad(); // 执行前一个页面的onLoad方法
								}
							});
						}, 1600);
					},
					fail(err) {
						uni.hideLoading();
						console.log(err);
						throw err;
					}
				});
			} catch (err) {
				console.log(err);
				//TODO handle the exception
				uni.showModal({
					title: '错误提示',
					content: err
				});
			}
		},

		/* 选择门店名称*/
		goSelectCustomer() {
			let _this = this;
			this.$eventHub.$on('changSelect', async res => {
				console.log('选择门店信息', res);
				try {
					this.customer_name = res.customer_name;
					this.formData.customer_id = res.customer_apply_id;
				} catch (e) {
					console.log(e);
					return;
				}

				_this.$eventHub.$off('changSelect');
			});
			this.$myNavigateTo('/pages/see-customer/see-customer', {
				is_checked: 1,
				isShowAdress: false
			});
		},

		/* 判断活动类型*/
		activityTypeFun(rule, value, callback) {
			if (this.formData.activityType !== 0) {
				callback();
			} else {
				callback(new Error('请选择促销类型'));
			}
		},
		/* 促销时机 */
		opportunityTypeFun(rule, value, callback) {
			if (this.formData.opportunityType !== 0) {
				callback();
			} else {
				callback(new Error('请选择促销时机'));
			}
		},
		// 校验冰箱销额
		checkBxCategory_m(rule, value, callback) {
			if (this.bx_exist) {
				if (!value) {
					callback(new Error('冰箱预计销额必填选项'));
				} else {
					if (Number(value) < 1000) {
						callback(new Error('冰箱预计销额最少不低于1000.00元'));
					} else {
						callback();
					}
				}
			} else {
				callback();
			}
		},
		// 校验冰箱销量
		checkBxCategory_l(rule, value, callback) {
			if (this.bx_exist) {
				if (!value) {
					callback(new Error('冰箱预计销量必填选项'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		},
		// 校验洗衣机销额
		checkXyjCategory_m(rule, value, callback) {
			if (this.xyj_exist) {
				if (!value) {
					callback(new Error('洗衣机预计销额必填选项'));
				} else {
					if (Number(value) < 1000) {
						callback(new Error('洗衣机预计销额最少不低于1000.00元'));
					} else {
						callback();
					}
				}
			} else {
				callback();
			}
		},
		// 校验洗衣机销量
		checkXyjCategory_l(rule, value, callback) {
			if (this.xyj_exist) {
				if (!value) {
					callback(new Error('洗衣机预计销量必填选项'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		},

		/* 促销内容 */
		contentTypeFun(rule, value, callback) {
			if (this.formData.contentType !== 0) {
				callback();
			} else {
				callback(new Error('请选择促销内容'));
			}
		},

		/* 选中品牌改变brandList 的check */
		brandChange(index) {
			this.brandList[index].check = !this.brandList[index].check;
		},

		/* 选择取消 */
		brandCancel() {
			this.brandList = this.brandList.map(v => {
				v.check = false;
				return v;
			});
		},
		// 获取选择所有品牌品类的名称集合
		getbrandClassName(list) {
			let tempList = list.map(v => {
				return v.brand_name + v.business_category_name;
			});
			this.brandClassName = tempList.join(';');
		},
		/* 确定品牌 */
		brandConfirm() {
			const tempList = this.brandList.filter(v => {
				return v.check;
			});
			this.getbrandClassName(tempList);
			this.bx_exist = tempList.some(v => v.business_category_id === 948);
			this.xyj_exist = tempList.some(v => v.business_category_id === 944);
			this.selectBrandList = tempList.map(v => {
				return {
					business_category_id: v.business_category_id,
					business_category_name: v.business_category_name,
					brand_id: v.brand_id,
					brand_name: v.brand_name
				};
			});
		},

		getBrandList() {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.brand_pc_list,
					data: {},
					success: res => {
						if (res) {
							resolve(res);
						}
					},
					fail: err => {
						reject(err);
					}
				});
			});
		},

		/* 选择活动类型 */
		bindChangeActivityType(e) {
			this.formData.activityType = parseInt(e.detail.value);
		},
		/* 选择促销时机 */
		bindChangePromOpportunity(e) {
			this.formData.opportunityType = parseInt(e.detail.value);
		},
		/* 促销内容 */
		bindChangePromContent(e) {
			this.formData.contentType = parseInt(e.detail.value);
		},
		/* 是否到店change事件 */
		toStoreRadioChange(e) {
			this.formData.isToStore = parseInt(e.detail.value);
		},

		/* 打开时间选择器 */
		open() {
			this.$refs['select-time'].open();
		},

		/* 确定时间选择区间 */
		confirmTime(item) {
			const start_time = item.start_time;
			const end_time = item.end_time;
			let stas_t = `${start_time.year}-${start_time.month}-${start_time.day}`;
			let ends_t = `${end_time.year}-${end_time.month}-${end_time.day}`;
			stas_t = stas_t.replace(/-/g, '/');
			ends_t = ends_t.replace(/-/g, '/');
			let dateone = new Date(stas_t).getTime();
			let datetow = new Date(ends_t).getTime();
			this.formData.beginDate = timeFun(dateone);
			this.formData.endDate = timeFun(datetow);
			function timeFun(a) {
				return timeFormat(a, 'yyyy-mm-dd hh:MM:ss');
			}
		},
		cancelTime() {
			this.formData.beginDate = '';
			this.formData.endDate = '';
		},
		/* 打开联合品牌 */
		openJointBrand() {
			this.$refs['joint-brand'].open();
		},
		checkMaxalesQuantity(e, keyval) {
			let val = e.detail.value;
			if (Number(val) > 999) {
				uni.showToast({
					title: '预计销售量最多999',
					icon: 'none'
				});
				val = val.slice(0, 3);
			}
			this.formData[keyval] = val;
			return val;
		},

		// 处理销量不少于1000
		checkPriceNum(val) {
			if (val.length === 0) return false;
			let num = Number(val);
			if (isNaN(num)) return true;
			if (num < 1000) {
				return true;
			} else {
				return false;
			}
		}
	}
};
</script>
<style lang="scss">
page {
	width: 100%;
	min-height: 100%;
	background-color: #f5f5f5;
}
.currt-page {
	width: 100%;
	height: 100%;
}

.evan-form-show {
	.evan-form-item {
		/deep/ .evan-form-item-container {
			padding: 20rpx 16rpx 20rpx 16rpx;
		}
		.value {
			text-align: right;
		}
		.form-input {
			text-align: right;
			padding-right: 20rpx;
		}
	}
	.m-form-item {
		padding: 20rpx 16rpx 20rpx 36rpx;
		width: 750rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #eee;
		display: flex;
		align-items: center;
		color: #333333;
		&.required::before {
			width: 20rpx;
			content: '';
			display: inline-block;
		}
		.m-label {
			width: 260rpx;
			flex-shrink: 0;
			font-weight: bold;
			font-size: 30rpx;
		}
		.m-value {
			flex: 1;
			text-align: right;
		}
		.placeholder-style {
			font-size: 28rpx;
			color: #cccccc;
		}
	}
	.m-sub-form {
		width: 750rpx;
		padding-left: 30rpx;
		box-sizing: border-box;
		background-color: #fafafa;
		.m-sub-form-item {
			width: 100%;
			padding: 20rpx 16rpx 20rpx 20rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #eee;
			display: flex;
			align-items: center;
			color: #333333;
			.m-sub-label {
				width: 220rpx;
				flex-shrink: 0;
				font-size: 30rpx;
				color: #8a8a8a;
				&.required::before {
					content: '*';
					width: 20rpx;
					height: 20rpx;
					color: #f56c6c;
					display: inline-block;
				}
			}
			.sub-form-input {
				flex: 1;
				text-align: right;
				padding-right: 20rpx;
				color: #333333;
			}
		}
	}
}

.bctj-btn {
	display: flex;
	background-color: #eeeeee;
	margin: 200rpx 0 40rpx 0;
	& .button {
		flex: 1;
		margin: 0 20rpx;
		font-size: 32upx;
		height: 80rpx;
		line-height: 80rpx;
		color: #ffffff;
		border-radius: 5upx;
		background-color: #fdc100;
		text-align: center;
	}
}
.color-ccc {
	color: #cccccc;
}

.main-iconfont {
	font-size: 34rpx;
	line-height: 34rpx;
	color: #ccc;
}
.check-price-max {
	display: inline-block;
	color: #ff0000;
	font-size: 22rpx;
	padding: 0 20rpx;
}
.scale-radio {
	transform: scale(0.7);
}
</style>
