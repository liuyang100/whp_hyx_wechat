<template>
	<view class="currt-page">
		<evan-form class="evan-form-show" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="formData">
			<view class="">
				<evan-form-item :label-style="labelStyle" label="活动状态" class="evan-form-item ">
					<input
						type="text"
						disabled
						class="form-input"
						style="color: #FDC100;"
						:value="formData.activityStatues == 'N' ? '计划中' : formData.activityStatues == 'Y' ? '已执行' : ''"
					/>
				</evan-form-item>

				<evan-form-item :label-style="labelStyle" label="活动时间" class="evan-form-item " show_jiantou>
					<view class="value" v-if="eshowTime">{{ formData.estimatedBeginDate | sliceTimeStr }} 至 {{ formData.estimatedEndDate | sliceTimeStr }}</view>
					<view style="color: #CCCCCC;font-size: 26rpx;text-align: right;" v-else>请选择活动时间</view>
				</evan-form-item>
				<evan-form-item :label-style="labelStyle" label="预计费用" class="evan-form-item ">
					<input
						type="digit"
						disabled
						confirm-type="确定"
						class="form-input"
						:value="formData.estimatedPromotion"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						placeholder="请填写"
					/>
				</evan-form-item>
				<view class="bg-white m-form-item">
					<view class="m-label">联合品牌品类</view>
					<view class="m-value">
						<text v-if="brandClassName">{{ brandClassName }}</text>
						<text class="placeholder-style" v-else>请选择</text>
					</view>
					<view class="flex-shrink iconfont">&#xe601;</view>
				</view>
				<evan-form-item label="预计销额" :label-style="labelStyle" class="evan-form-item "></evan-form-item>
				<view class="m-sub-form">
					<view class=" m-sub-form-item" v-if="bx_exist">
						<view class="m-sub-label">冰箱</view>
						<input disabled type="digit" confirm-type="确定" class="sub-form-input" :value="formData.bxestimatedSales" />
					</view>
				</view>
				<view class="m-sub-form">
					<view class=" m-sub-form-item" v-if="xyj_exist">
						<view class="m-sub-label">洗衣机</view>
						<input disabled type="digit" confirm-type="确定" class="sub-form-input" :value="formData.xyjestimatedSales" />
					</view>
				</view>
				<evan-form-item label="预计销量" :label-style="labelStyle" class="evan-form-item "></evan-form-item>
				<view class="m-sub-form">
					<view class=" m-sub-form-item" v-if="bx_exist">
						<view class="m-sub-label">冰箱</view>
						<input disabled type="number" confirm-type="确定" class="sub-form-input" :value="formData.bxestimatedSalesQuantity" />
					</view>
					<view class=" m-sub-form-item" v-if="xyj_exist">
						<view class="m-sub-label">洗衣机</view>
						<input disabled type="number" confirm-type="确定" class="sub-form-input" :value="formData.xyjestimatedSalesQuantity" />
					</view>
				</view>

				<template v-if="formData.activityStatues == 'N'">
					<evan-form-item label="促销类型" :label-style="labelStyle" class="evan-form-item " show_jiantou>
						<picker disabled mode="selector" style="width: 100%;height: 100%;" :value="formData.activityType" :range="activityTypeArr" range-key="name">
							<view style="color: #333;font-size: 26rpx;text-align: right;">{{ activityTypeArr[formData.activityType].name }}</view>
						</picker>
					</evan-form-item>
					<evan-form-item label="促销时机" :label-style="labelStyle" class="evan-form-item " show_jiantou>
						<picker disabled mode="selector" style="width: 100%;height: 100%;" :value="formData.opportunityType" :range="promOpportunity" range-key="name">
							<view style="color: #333;font-size: 26rpx;text-align: right;">{{ promOpportunity[formData.opportunityType].name }}</view>
						</picker>
					</evan-form-item>
					<evan-form-item label="促销内容" :label-style="labelStyle" class="evan-form-item " show_jiantou>
						<picker disabled mode="selector" style="width: 100%;height: 100%;" :value="formData.contentType" :range="promContent" range-key="name">
							<view style="color: #333;font-size: 26rpx;text-align: right;">{{ promContent[formData.contentType].name }}</view>
						</picker>
					</evan-form-item>
					<evan-form-item label="是否到店活动" :label-style="labelStyle" prop="isToStore" class="evan-form-item">
						<view class="value pr-2">{{ formData.isToStore === 0 ? '否' : formData.isToStore === 1 ? '是' : '' }}</view>
					</evan-form-item>
					<view class="bctj-btn"><button class=" button" size="mini" @click="submit">执行上报</button></view>
				</template>
			</view>
			<view v-if="formData.activityStatues == 'Y'">
				<view class="" style="width: 100%;height: 30rpx;background-color: #EEEEEE;"></view>
				<evan-form-item :label-style="labelStyle" label="实际活动时间" class="evan-form-item " show_jiantou>
					<view class="value" v-if="ashowTime">{{ formData.actualBeginDate | sliceTimeStr }} 至 {{ formData.actualEndDate | sliceTimeStr }}</view>
					<view style="color: #CCCCCC;font-size: 26rpx;text-align: right;" v-else>请选择活动时间</view>
				</evan-form-item>
				<evan-form-item :label-style="labelStyle" label="实际费用" class="evan-form-item ">
					<input
						disabled
						type="digit"
						confirm-type="确定"
						class="form-input"
						:value="formData.actualPromotion"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						placeholder="请填写"
					/>
				</evan-form-item>
				<view class=" m-form-item">
					<view class="m-label">联合品牌品类</view>
					<view class="m-value">
						<text v-if="brandClassName">{{ brandClassName }}</text>
						<text class="placeholder-style" v-else>请选择</text>
					</view>
					<view class="flex-shrink iconfont">&#xe601;</view>
				</view>
				<evan-form-item label="实际销额" :label-style="labelStyle" class="evan-form-item "></evan-form-item>
				<view class="m-sub-form">
					<view class=" m-sub-form-item" v-if="bx_exist">
						<view class="m-sub-label">冰箱</view>
						<input disabled type="digit" confirm-type="确定" class="sub-form-input" :value="formData.bxactualSales" />
					</view>
					<view class=" m-sub-form-item" v-if="xyj_exist">
						<view class="m-sub-label">洗衣机</view>
						<input disabled type="digit" confirm-type="确定" class="sub-form-input" :value="formData.xyjactualSales" />
					</view>
				</view>
				<evan-form-item label="实际销量" :label-style="labelStyle" class="evan-form-item "></evan-form-item>
				<view class="m-sub-form">
					<view class=" m-sub-form-item" v-if="bx_exist">
						<view class="m-sub-label">冰箱</view>
						<input disabled type="number" confirm-type="确定" class="sub-form-input" :value="formData.bxactualSalesQuantity" />
					</view>
					<view class=" m-sub-form-item" v-if="xyj_exist">
						<view class="m-sub-label">洗衣机</view>
						<input disabled type="number" confirm-type="确定" class="sub-form-input" :value="formData.xyjactualSalesQuantity" />
					</view>
				</view>
				<evan-form-item label="促销类型" :label-style="labelStyle" class="evan-form-item " show_jiantou>
					<picker disabled mode="selector" style="width: 100%;height: 100%;" :value="formData.activityType" :range="activityTypeArr" range-key="name">
						<view style="color: #333;font-size: 26rpx;text-align: right;">{{ activityTypeArr[formData.activityType].name }}</view>
					</picker>
				</evan-form-item>
				<evan-form-item label="促销时机" :label-style="labelStyle" class="evan-form-item " show_jiantou>
					<picker disabled mode="selector" style="width: 100%;height: 100%;" :value="formData.opportunityType" :range="promOpportunity" range-key="name">
						<view style="color: #333;font-size: 26rpx;text-align: right;">{{ promOpportunity[formData.opportunityType].name }}</view>
					</picker>
				</evan-form-item>
				<evan-form-item label="促销内容" :label-style="labelStyle" class="evan-form-item " show_jiantou>
					<picker disabled mode="selector" style="width: 100%;height: 100%;" :value="formData.contentType" :range="promContent" range-key="name">
						<view style="color: #333;font-size: 26rpx;text-align: right;">{{ promContent[formData.contentType].name }}</view>
					</picker>
				</evan-form-item>
				<evan-form-item label="是否到店活动" :label-style="labelStyle" prop="isToStore" class="evan-form-item">
					<view class="value pr-2">{{ formData.isToStore === 0 ? '否' : formData.isToStore === 1 ? '是' : '' }}</view>
				</evan-form-item>

				<view class="bg-white m-form-item">
					<view class="m-label">
						活动照片
						<text style="color: #ccc;font-size: 26rpx;font-weight: 400;">(最少6张)</text>
					</view>
				</view>
				<view class="upimg d-flex flex-wrap">
					<view class="d-flex upload_item flex-column a-center">
						<view class="m-1 upload_item_content">
							<image v-if="formData.picture1" :src="formData.picture1" class="upload_item_content_image"></image>
							<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
						</view>
					</view>
					<view class="d-flex upload_item flex-column a-center">
						<view class="m-1 upload_item_content">
							<image v-if="formData.picture2" :src="formData.picture2" class="upload_item_content_image"></image>
							<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
						</view>
					</view>
					<view class="d-flex upload_item flex-column a-center">
						<view class="m-1 upload_item_content">
							<image v-if="formData.picture3" :src="formData.picture3" class="upload_item_content_image"></image>
							<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
						</view>
					</view>
					<view class="d-flex upload_item flex-column a-center">
						<view class="m-1 upload_item_content">
							<image v-if="formData.picture4" :src="formData.picture4" class="upload_item_content_image"></image>
							<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
						</view>
					</view>
					<view class="d-flex upload_item flex-column a-center">
						<view class="m-1 upload_item_content">
							<image v-if="formData.picture5" :src="formData.picture5" class="upload_item_content_image"></image>
							<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
						</view>
					</view>
					<view class="d-flex upload_item flex-column a-center">
						<view class="m-1 upload_item_content">
							<image v-if="formData.picture6" :src="formData.picture6" class="upload_item_content_image"></image>
							<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
						</view>
					</view>
				</view>
			</view>
		</evan-form>
		<!-- 时间选择 -->
		<time-range ref="select-time" @confirm="clickpop" />
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
			brandClassName: '',
			isloading: false,
			hideRequiredAsterisk: true,
			activityTypeArr,
			promOpportunity,
			promContent,
			brandList: [],
			formData: {
				bxestimatedSales: '', //冰箱预计销额
				bxestimatedSalesQuantity: '', //冰箱预计销量
				xyjestimatedSales: '', //洗衣机预计销额
				xyjestimatedSalesQuantity: '', //洗衣机预计销量

				bxactualSales: '', //冰箱实际销额
				bxactualSalesQuantity: '', //冰箱实际销量
				xyjactualSales: '', //洗衣机实际销额
				xyjactualSalesQuantity: '', //洗衣机实际销量

				customer_name: '',
				customer_id: null,
				activity_id: null,
				activityType: 0, // 活动类型
				opportunityType: 0, // 促销时机
				contentType: 0, //促销内容
				isToStore: null,
				activityStatues: 'Y', // 活动状态
				estimatedBeginDate: '', // 预计活动开始时间
				estimatedEndDate: '', // 预计活动结束时间
				estimatedPromotion: '', //预计活动费用
				actualBeginDate: '', // 活动实际开始时间
				actualEndDate: '', // 活动实际结束时间
				actualPromotion: '', //活动实际费用
				picture1: '',
				picture2: '',
				picture3: '',
				picture4: '',
				picture5: '',
				picture6: ''
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
		}
	},

	computed: {
		labelStyle() {
			return {
				width: '260rpx',
				'font-weight': 'bold'
			};
		},

		eshowTime() {
			if (this.formData.estimatedBeginDate && this.formData.estimatedEndDate) {
				return true;
			} else {
				return false;
			}
		},
		ashowTime() {
			if (this.formData.actualBeginDate && this.formData.actualEndDate) {
				return true;
			} else {
				return false;
			}
		}
	},
	onLoad(option) {
		try {
			option = this.$formateOption(option);
			this.formData.activity_id = option.activity_id;
			this.formData.activityStatues = option.activityStatues;
			this.initRequest();
		} catch (e) {
			//TODO handle the exception
			console.log(e);
		}
	},

	methods: {
		/* 初始化 */
		async initRequest() {
			try {
				const detailDatas = await this.getDetailData({ activity_id: this.formData.activity_id });
				this.renderData(detailDatas);
			} catch (e) {
				//TODO handle the exception
			}
		},
		timeFun(a) {
			return timeFormat(a, 'yyyy-mm-dd hh:MM:ss');
		},

		renderData(data) {
			try {
				data = data.datas[0];
				console.log(JSON.stringify(data, null, 4));
				const estimatedBeginDate = data.estimatedBeginDate ? this.timeFun(data.estimatedBeginDate) : '';
				const estimatedEndDate = data.estimatedEndDate ? this.timeFun(data.estimatedEndDate) : '';
				const actualBeginDate = data.actualBeginDate ? this.timeFun(data.actualBeginDate) : '';
				const actualEndDate = data.actualEndDate ? this.timeFun(data.actualEndDate) : '';
				this.brandClassName = data.brandProductCategory || '';
				if (data.bxestimatedSales && data.bxestimatedSalesQuantity !== '') {
					this.bx_exist = true;
				}
				if (data.xyjestimatedSales && data.xyjestimatedSalesQuantity !== '') {
					this.xyj_exist = true;
				}
				const form = {
					bxestimatedSales: data.bxestimatedSales, //冰箱预计销额
					bxestimatedSalesQuantity: data.bxestimatedSalesQuantity, //冰箱预计销量
					xyjestimatedSales: data.xyjestimatedSales, //洗衣机预计销额
					xyjestimatedSalesQuantity: data.xyjestimatedSalesQuantity, //洗衣机预计销量

					bxactualSales: data.bxactualSales, //冰箱实际销额
					bxactualSalesQuantity: data.bxactualSalesQuantity, //冰箱实际销量
					xyjactualSales: data.xyjactualSales, //洗衣机实际销额
					xyjactualSalesQuantity: data.xyjactualSalesQuantity, //洗衣机实际销量

					activityType: data.activityType || 0, // 活动实际类型
					opportunityType: data.activityTime || 0, // 促销时机
					contentType: data.activityContent || 0, //促销内容
					activity_id: data.activity_id,
					customer_name: data.customer_name || '',
					customer_id: data.customer_id || null,
					activityStatues: data.activityStatues || '', // 预计活动状态
					estimatedBeginDate: estimatedBeginDate, // 预计活动开始时间
					estimatedEndDate: estimatedEndDate, // 预计活动结束时间
					estimatedPromotion: data.estimatedPromotion || '', //预计活动费用
					actualBeginDate: actualBeginDate, // 活动实际开始时间
					actualEndDate: actualEndDate, // 活动实际结束时间
					actualPromotion: data.actualPromotion || '', //活动实际费用
					isToStore: data.isToStore,
					picture1: data.picture1 || '',
					picture2: data.picture2 || '',
					picture3: data.picture3 || '',
					picture4: data.picture4 || '',
					picture5: data.picture5 || '',
					picture6: data.picture6 || ''
				};
				this.formData = form;
				const busList = data.businessCategorys;
			} catch (e) {
				//TODO handle the exception
				console.log(e);
				uni.showToast({
					title: '加载失败',
					icon: 'none',
					duration: 2000
				});
			}
		},

		/* 执行上报获取详情 */
		getDetailData(params = {}) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.index_sales_promotion_list,
					data: params,
					success: res => {
						resolve(res);
					},
					fail: err => {
						reject(err);
					}
				});
			});
		},

		submit() {
			this.$myNavigateTo('/pages/index-sales-activity/perform-report/perform-report', { activityStatues: 'Y', activity_id: this.formData.activity_id, back_pages: 3 });
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
			border-bottom: 1rpx solid #cccccc;
			display: flex;
			align-items: center;
			color: #333333;
			.m-sub-label {
				width: 220rpx;
				flex-shrink: 0;
				font-size: 30rpx;
				color: #808080;
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
.upimg {
	background-color: #ffffff;
	.upload_item {
		&_content {
			width: 160rpx;
			height: 160rpx;
			border-radius: 10rpx;
			border: 1rpx dashed #666666;
			background-color: #fefefe;
			display: flex;
			align-items: center;
			justify-content: center;
			&_image {
				width: 130rpx;
				height: 130rpx;
				border-radius: 4px;
			}
			&_haost {
				font-size: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #666666;
			}
		}
		&_bottom_text {
			display: inline-block;
			position: relative;
			i {
				color: #ff0000;
				font-size: 28upx;
				display: inline-block;
				width: 10upx;
				height: 10upx;
				margin-right: 5upx;
			}
		}
	}
}
</style>
