<template>
	<view class="currt-page">
		<evan-form class="evan-form-show" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="formData">
			<evan-form-item :label-style="labelStyle" label="实际活动时间" prop="actualEndDate" class="evan-form-item " @click="open" show_jiantou>
				<view class="value" v-if="showTime">{{ formData.actualBeginDate | sliceTimeStr }} 至 {{ formData.actualEndDate | sliceTimeStr }}</view>
				<view style="color: #CCCCCC;font-size: 26rpx;text-align: right;" v-else>请选择活动时间</view>
			</evan-form-item>
			<evan-form-item :label-style="labelStyle" label="实际费用" prop="actualPromotion" class="evan-form-item ">
				<input
					type="digit"
					confirm-type="确定"
					class="form-input"
					v-model="formData.actualPromotion"
					:maxlength="formData.actualPromotion | maxlength"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					placeholder="请填写"
				/>
			</evan-form-item>
			<view class="bg-white m-form-item" @click="openJointBrand">
				<view class="m-label">联合品牌品类</view>
				<view class="m-value">
					<text v-if="brandClassName">{{ brandClassName }}</text>
					<text class="placeholder-style" v-else>请选择</text>
				</view>
				<view class="flex-shrink iconfont">&#xe601;</view>
			</view>
			<evan-form-item label="实际销额" :label-style="labelStyle" class="evan-form-item "></evan-form-item>
			<view class="m-sub-form">
				<template v-if="bx_exist">
					<view class=" m-sub-form-item">
						<view class="m-sub-label required">冰箱</view>
						<input
							type="digit"
							confirm-type="确定"
							class="sub-form-input"
							v-model="formData.bxactualSales"
							:maxlength="formData.bxactualSales | maxlength"
							placeholder-style="font-size: 28rpx;color:#ccc;"
							placeholder="请填写"
						/>
					</view>
				</template>

				<template v-if="xyj_exist">
					<view class=" m-sub-form-item">
						<view class="m-sub-label required">洗衣机</view>
						<input
							type="digit"
							confirm-type="确定"
							class="sub-form-input"
							v-model="formData.xyjactualSales"
							:maxlength="formData.xyjactualSales | maxlength"
							placeholder-style="font-size: 28rpx;color:#ccc;"
							placeholder="请填写"
						/>
					</view>
				</template>
			</view>
			<evan-form-item label="实际销量" :label-style="labelStyle" class="evan-form-item "></evan-form-item>
			<view class="m-sub-form">
				<view class=" m-sub-form-item" v-if="bx_exist">
					<view class="m-sub-label required">冰箱</view>
					<input
						type="number"
						confirm-type="确定"
						class="sub-form-input"
						:value="formData.bxactualSalesQuantity"
						@input="checkMaxalesQuantity($event, 'bxactualSalesQuantity')"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						placeholder="请填写"
					/>
				</view>
				<view class=" m-sub-form-item" v-if="xyj_exist">
					<view class="m-sub-label required">洗衣机</view>
					<input
						type="number"
						confirm-type="确定"
						class="sub-form-input"
						:value="formData.xyjactualSalesQuantity"
						@input="checkMaxalesQuantity($event, 'xyjactualSalesQuantity')"
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
								<radio :value="item.value" class="scale-radio" :checked="item.value === formData.isToStore" />
								{{ item.name }}
							</view>
						</label>
					</radio-group>
				</view>
			</evan-form-item>
			<view class="m-form-item required bg-white">
				<view class="m-label required">
					活动照片
					<text style="color: #ccc;font-size: 26rpx;font-weight: 400;">(最少6张)</text>
				</view>
			</view>
			<view class="upimg d-flex flex-wrap ">
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content" @click="chooseImage('picture1')">
						<image v-if="formData.picture1" :src="formData.picture1" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content" @click="chooseImage('picture2')">
						<image v-if="formData.picture2" :src="formData.picture2" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content" @click="chooseImage('picture3')">
						<image v-if="formData.picture3" :src="formData.picture3" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content" @click="chooseImage('picture4')">
						<image v-if="formData.picture4" :src="formData.picture4" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content" @click="chooseImage('picture5')">
						<image v-if="formData.picture5" :src="formData.picture5" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content" @click="chooseImage('picture6')">
						<image v-if="formData.picture6" :src="formData.picture6" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
				</view>
			</view>
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
			back_pages: 2,
			isloading: false,
			hideRequiredAsterisk: false,
			activityTypeArr,
			promOpportunity,
			promContent,
			brandList: [],
			selectBrandList: [], //选中品牌
			brandClassName: '',
			formData: {
				bxestimatedSales: '', //冰箱预计销额
				bxestimatedSalesQuantity: '', //冰箱预计销量
				xyjestimatedSales: '', //洗衣机预计销额
				xyjestimatedSalesQuantity: '', //洗衣机预计销量

				bxactualSales: '', //冰箱实际销额
				bxactualSalesQuantity: '', //冰箱实际销量
				xyjactualSales: '', //洗衣机实际销额
				xyjactualSalesQuantity: '', //洗衣机实际销量

				actualBeginDate: '', // 活动实际开始时间
				actualEndDate: '', // 活动实际结束时间
				actualPromotion: '', //活动实际费用
				activityType: 0, // 活动实际类型
				opportunityType: 0, // 促销时机
				contentType: 0, //促销内容
				executeStatus: 'Y', // 区分是否上报活动
				activity_id: null, // 活动id
				isToStore: null,
				activityStatues: '', // 活动状态
				picture1: '',
				picture2: '',
				picture3: '',
				picture4: '',
				picture5: '',
				picture6: ''
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
				activity_id: {
					required: true,
					message: '请选择客户'
				},
				actualBeginDate: {
					required: true,
					message: '请选择活动开始时间'
				},
				actualEndDate: {
					required: true,
					message: '请选择活动结束时间'
				},
				actualPromotion: {
					required: true,
					message: '预计费用不能为空'
				},
				// bxestimatedSales: {
				// 	validator: this.scheckBxCategory_m
				// }, //冰箱预计销额
				// xyjestimatedSales: {
				// 	validator: this.scheckXyjCategory_m
				// }, //洗衣机预计销额
				// bxestimatedSalesQuantity: {
				// 	validator: this.scheckBxCategory_l
				// }, //冰箱预计销量
				// xyjestimatedSalesQuantity: {
				// 	validator: this.scheckXyjCategory_l
				// }, //洗衣机预计销量
				bxactualSales: {
					validator: this.ycheckBxCategory_m
				}, //冰箱实际销额
				xyjactualSales: {
					validator: this.ycheckXyjCategory_m
				}, //洗衣机实际销额
				bxactualSalesQuantity: {
					validator: this.ycheckBxCategory_l
				}, //冰箱实际销量
				xyjactualSalesQuantity: {
					validator: this.ycheckXyjCategory_l
				}, //洗衣机实际销量

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
				},
				picture1: {
					required: true,
					message: '至少上传6张图片'
				},
				picture2: {
					required: true,
					message: '至少上传6张图片'
				},
				picture3: {
					required: true,
					message: '至少上传6张图片'
				},
				picture4: {
					required: true,
					message: '至少上传6张图片'
				},
				picture5: {
					required: true,
					message: '至少上传6张图片'
				},
				picture6: {
					required: true,
					message: '至少上传6张图片'
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
			this.back_pages = option.back_pages || 2;
			this.initRequest();
		} catch (e) {
			//TODO handle the exception
			console.log(e);
		}
	},
	mounted() {
		this.$refs.form.setRules(this.rules);
	},

	methods: {
		async initRequest() {
			try {
				const brandList = await this.getBrandList();
				this.brandList = brandList.datas.slice(0, 6);
				const detailData = await this.getDetailData({
					activity_id: this.formData.activity_id
				});
				this.renderData(detailData);
			} catch (e) {
				//TODO handle the exception
			}
		},
		timeFun(a) {
			return timeFormat(a, 'yyyy-mm-dd hh:MM:ss');
		},

		renderData(data) {
			data = data.datas[0];
			console.log(JSON.stringify(data, null, 4));
			// 处理消费
			const busList = data.businessCategorys;
			this.selectBrandList = busList;
			this.brandList = this.brandList.map(v => {
				let tempobj = {
					business_category_name: v.pc_name,
					business_category_id: v.pc_id,
					brand_id: v.brand_id,
					brand_name: v.brand_name,
					check: false
				};
				for (let i = 0; i < busList.length; i++) {
					if (tempobj.brand_id == busList[i].brand_id && tempobj.business_category_id == busList[i].business_category_id) {
						tempobj.check = true;
					}
				}
				return tempobj;
			});
			if (data.bxestimatedSales && data.bxestimatedSalesQuantity !== '') {
				this.bx_exist = true;
			}
			if (data.xyjestimatedSales && data.xyjestimatedSalesQuantity !== '') {
				this.xyj_exist = true;
			}

			const estimatedBeginDate = data.estimatedBeginDate ? this.timeFun(data.estimatedBeginDate) : '';
			const estimatedEndDate = data.estimatedEndDate ? this.timeFun(data.estimatedEndDate) : '';
			this.brandClassName = data.brandProductCategory || '';
			const form = {
				bxestimatedSales: data.bxestimatedSales, //冰箱预计销额
				bxestimatedSalesQuantity: data.bxestimatedSalesQuantity, //冰箱预计销量
				xyjestimatedSales: data.xyjestimatedSales, //洗衣机预计销额
				xyjestimatedSalesQuantity: data.xyjestimatedSalesQuantity, //洗衣机预计销量

				bxactualSales: data.bxactualSales, //冰箱实际销额
				bxactualSalesQuantity: data.bxactualSalesQuantity, //冰箱实际销量
				xyjactualSales: data.xyjactualSales, //洗衣机实际销额
				xyjactualSalesQuantity: data.xyjactualSalesQuantity, //洗衣机实际销量
				actualBeginDate: estimatedBeginDate, // 活动实际开始时间
				actualEndDate: estimatedEndDate, // 活动实际结束时间
				actualPromotion: data.estimatedPromotion || '', //实际活动费用
				activityType: data.activityType || 0, // 活动实际类型
				opportunityType: data.activityTime || 0, // 促销时机
				contentType: data.activityContent || 0, //促销内容
				activity_id: data.activity_id,
				customer_name: data.customer_name || '',
				customer_id: data.customer_id || null,
				activityStatues: data.activityStatues || '', // 实际活动状态
				isToStore: data.isToStore,
				executeStatus: 'Y',
				picture1: data.picture1 || '',
				picture2: data.picture2 || '',
				picture3: data.picture3 || '',
				picture4: data.picture4 || '',
				picture5: data.picture5 || '',
				picture6: data.picture6 || ''
			};
			this.formData = form;
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

		validmyRequest(reqData = {}) {
			let data = { ...this.formData };
			data.bxestimatedSales && (reqData.bxestimatedSales = Number(data.bxestimatedSales)); //冰箱预计销额
			data.bxestimatedSalesQuantity && (reqData.bxestimatedSalesQuantity = Number(data.bxestimatedSalesQuantity)); //冰箱预计销量
			data.xyjestimatedSales && (reqData.xyjestimatedSales = Number(data.xyjestimatedSales)); //洗衣机预计销额
			data.xyjestimatedSalesQuantity && (reqData.xyjestimatedSalesQuantity = Number(data.xyjestimatedSalesQuantity)); //洗衣机预计销量

			data.bxactualSales && (reqData.bxactualSales = Number(data.bxactualSales)); //冰箱实际销额
			data.bxactualSalesQuantity && (reqData.bxactualSalesQuantity = Number(data.bxactualSalesQuantity)); //冰箱实际销量
			data.xyjactualSales && (reqData.xyjactualSales = Number(data.xyjactualSales)); //洗衣机实际销额
			data.xyjactualSalesQuantity && (reqData.xyjactualSalesQuantity = Number(data.xyjactualSalesQuantity)); //洗衣机实际销量
			reqData.beginDate = data.actualBeginDate;
			reqData.endDate = data.actualEndDate;
			reqData.promotion = Number(data.actualPromotion);
			reqData.activityType = data.activityType;
			reqData.activityTime = data.opportunityType;
			reqData.activityContent = data.contentType;
			reqData.isToStore = data.isToStore;
			reqData.executeStatus = data.executeStatus;
			reqData.picture1 = data.picture1;
			reqData.picture2 = data.picture2;
			reqData.picture3 = data.picture3;
			reqData.picture4 = data.picture4;
			reqData.picture5 = data.picture5;
			reqData.picture6 = data.picture6;
			reqData.activity_id = data.activity_id;
			reqData.businessCategorys = this.selectBrandList;
			return reqData;
		},
		submit() {
			let that = this;
			let isOk = true;
			utils.validate(this.formData, this.rules, (res, errors) => {
				if (!res) {
					isOk = false;
				}
			});
			if (!isOk) return;
			// 验证通过
			try {
				let optionData = this.validmyRequest();
				if (!optionData) return;
				console.log(optionData);
				console.log(JSON.stringify(optionData, null, 4));
				uni.showLoading({
					title: '提交中...'
				});

				this.$myRequest({
					url: this.$myhttpUrl.index_sales_promotion_save,
					data: optionData,
					success(res) {
						uni.showToast({
							title: '提交成功'
						});
						setTimeout(function() {
							let pages = getCurrentPages(); // 当前页面
							let beforePage = pages[pages.length - that.back_pages]; // 前一个页面
							uni.navigateBack({
								delta: that.back_pages - 1,
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
			} catch (e) {
				console.log(e);
				//TODO handle the exception
				uni.showModal({
					title: '错误提示',
					content: err
				});
			}
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
		// scheckBxCategory_m(rule, value, callback) {
		// 	if (this.bx_exist) {
		// 		if (!value) {
		// 			callback(new Error('冰箱预计销额必填选项'));
		// 		} else {
		// 			if (Number(value) < 1000) {
		// 				callback(new Error('冰箱预计销额最少不低于1000.00元'));
		// 			} else {
		// 				callback();
		// 			}
		// 		}
		// 	} else {
		// 		callback();
		// 	}
		// },
		ycheckBxCategory_m(rule, value, callback) {
			if (this.bx_exist) {
				if (!value) {
					callback(new Error('冰箱实际销额必填选项'));
				} else {
						callback();
				}
			} else {
				callback();
			}
		},
		// 校验冰箱销量
		// scheckBxCategory_l(rule, value, callback) {
		// 	if (this.bx_exist) {
		// 		if (!value) {
		// 			callback(new Error('冰箱预计销量必填选项'));
		// 		} else {
		// 			callback();
		// 		}
		// 	} else {
		// 		callback();
		// 	}
		// },
		ycheckBxCategory_l(rule, value, callback) {
			if (this.bx_exist) {
				if (!value) {
					callback(new Error('冰箱实际销量必填选项'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		},
		// 校验洗衣机销额
		// scheckXyjCategory_m(rule, value, callback) {
		// 	if (this.xyj_exist) {
		// 		if (!value) {
		// 			callback(new Error('洗衣机预计销额必填选项'));
		// 		} else {
		// 			if (Number(value) < 1000) {
		// 				callback(new Error('洗衣机预计销额最少不低于1000.00元'));
		// 			} else {
		// 				callback();
		// 			}
		// 		}
		// 	} else {
		// 		callback();
		// 	}
		// },
		ycheckXyjCategory_m(rule, value, callback) {
			if (this.xyj_exist) {
				if (!value) {
					callback(new Error('洗衣机实际销额必填选项'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		},
		// 校验洗衣机销量
		// scheckXyjCategory_l(rule, value, callback) {
		// 	if (this.xyj_exist) {
		// 		if (!value) {
		// 			callback(new Error('洗衣机预计销量必填选项'));
		// 		} else {
		// 			callback();
		// 		}
		// 	} else {
		// 		callback();
		// 	}
		// },
		ycheckXyjCategory_l(rule, value, callback) {
			if (this.xyj_exist) {
				if (!value) {
					callback(new Error('洗衣机实际销量必填选项'));
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
			console.log(item);
			const start_time = item.start_time;
			const end_time = item.end_time;
			let stas_t = `${start_time.year}-${start_time.month}-${start_time.day}`;
			let ends_t = `${end_time.year}-${end_time.month}-${end_time.day}`;
			stas_t = stas_t.replace(/-/g, '/');
			ends_t = ends_t.replace(/-/g, '/');
			let dateone = new Date(stas_t).getTime();
			let datetow = new Date(ends_t).getTime();
			this.formData.actualBeginDate = this.timeFun(dateone);
			this.formData.actualEndDate = this.timeFun(datetow);
		},
		cancelTime() {
			this.formData.beginDate = '';
			this.formData.endDate = '';
		},
		/* 打开联合品牌 */
		openJointBrand() {
			this.$refs['joint-brand'].open();
		},
		// 上传图片
		async chooseImage(ins) {
			console.log(ins);
			let { file_info, message, type } = await this.$upImage(ins);
			if (message.type == 'success') {
				console.log(type);
				this.formData[type] = file_info.url;
			} else {
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				});
			}
		},
		// 处理销额不少于1000
		checkPriceNum(val) {
			if (val.length === 0) return false;
			let num = Number(val);
			if (isNaN(num)) return true;
			if (num < 1000) {
				return true;
			} else {
				return false;
			}
		},
		checkMaxalesQuantity(e, keyval) {
			let val = e.detail.value;
			this.formData[keyval] = val;
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
		&.required {
			padding: 20rpx 16rpx 20rpx 0rpx;
		}
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
			&.required::before {
				content: '*';
				width: 20rpx;
				height: 20rpx;
				color: #f56c6c;
				display: inline-block;
			}
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
.scale-radio {
	transform: scale(0.7);
}

</style>
