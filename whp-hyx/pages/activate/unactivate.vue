<template>
	<view class="w-100 h-100 d-flex">
		<evan-form class="evan-form-show flex-1 d-flex" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="datas">
			<view class="w-100 h-100 d-flex flex-column">
				<view class="tabs w-100 d-flex">
					<view class=" tab-item flex-1" :id="tab.id" :data-current="index" v-for="(item, index) in tabBars" :key="item.id" @click="tapTabBar(index)">
						<view class="tab-item-title" :class="tabIndex == index ? 'tab-item-title-active' : ''">{{ item.name }}</view>
					</view>
				</view>
				<swiper :current="tabIndex" class="swiper-box" style="flex: 1;" @change="swiperChange">
					<!-- 客户分类 -->
					<swiper-item class="swiper-item d-flex w-100 ">
						<scroll-view class="scroll-v flex-1  list" enableBackToTop="true" scroll-y>
							<uni-section title="渠道类型" marginTop="0rpx" type="square" bgColor="#40CCFF"></uni-section>
							<evan-form-item label="大渠道" class="evan-form-item" show_jiantou prop="one_category_id">
								<picker
									mode="selector"
									class="picker"
									@change="formateCurrentIndex($event, 1)"
									:value="coloumOne[oneIndex].name"
									:range="coloumOne"
									range-key="name"
								>
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="oneIndex != null ? coloumOne[oneIndex].name : ''"
										placeholder="请选择大渠道"
									/>
								</picker>
							</evan-form-item>
							<evan-form-item label="小渠道" class="evan-form-item" show_jiantou prop="two_category_id">
								<picker
									mode="selector"
									class="picker"
									@change="formateCurrentIndex($event, 2)"
									:value="coloumTwo[twoIndex].name"
									:range="coloumTwo"
									range-key="name"
								>
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="twoIndex != null ? coloumTwo[twoIndex].name : ''"
										placeholder="请选择小渠道"
									/>
								</picker>
							</evan-form-item>
							<evan-form-item label="门店一级类型" class="evan-form-item" show_jiantou prop="three_category_id">
								<picker
									mode="selector"
									class="picker"
									@change="formateCurrentIndex($event, 3)"
									:value="coloumThree[threeIndex].name"
									:range="coloumThree"
									range-key="name"
								>
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="threeIndex != null ? coloumThree[threeIndex].name : ''"
										placeholder="请选择门店一级类型"
									/>
								</picker>
							</evan-form-item>
							<evan-form-item label="门店二级类型" class="evan-form-item" show_jiantou>
								<picker
									mode="selector"
									class="picker"
									@change="formateCurrentIndex($event, 4)"
									:value="coloumFour[fourIndex].name"
									:range="coloumFour"
									range-key="name"
								>
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="fourIndex != null ? coloumFour[fourIndex].name : ''"
										placeholder="请选择门店二级类型"
									/>
								</picker>
							</evan-form-item>

							<evan-form-item label="经营方式" class="evan-form-item" show_jiantou>
								<picker
									mode="selector"
									class="picker"
									@change="formateCurrentIndex($event, 5)"
									:value="businessStyle[businessStyleIndex].name"
									:range="businessStyle"
									range-key="name"
								>
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="businessStyleIndex !== null ? businessStyle[businessStyleIndex].name : ''"
										placeholder="请选择经营方式"
									/>
								</picker>
							</evan-form-item>
							<evan-form-item label="门店分类" class="evan-form-item" show_jiantou>
								<picker
									mode="selector"
									class="picker"
									@change="formateCurrentIndex($event, 6)"
									:value="storesClass[storesClassIndex].name"
									:range="storesClass"
									range-key="name"
								>
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="storesClassIndex !== null ? storesClass[storesClassIndex].name : ''"
										placeholder="请选择门店分类"
									/>
								</picker>
							</evan-form-item>

							<uni-section title="客户分类" marginTop="0rpx" type="square" bgColor="#00EADD"></uni-section>
							<!-- 所属区域 -->
							<evan-form-item label="所属地区" class="evan-form-item" show_jiantou prop="sale_org_id" @click="getStoreData()">
								<picker mode="selector" class="picker" @change="bindPickerChange3" :value="index3" :range="find_store" range-key="name">
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="find_store[index3].name"
										placeholder="请选择所属地区"
									/>
								</picker>
							</evan-form-item>
							<!-- END 所属区域 -->
							<!-- 行政划区 -->
							<evan-form-item label="行政划区" class="evan-form-item" show_jiantou prop="administrative">
								<picker mode="selector" class="picker" @change="bindPickerChange1" :value="index1" :range="huaQuArr" range-key="name">
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="huaQuArr[index1].name"
										placeholder="请选择行政划区"
									/>
								</picker>
							</evan-form-item>
							<!-- end 行政划区 -->

							<!-- 网点/门店等级 -->
							<evan-form-item label="网点/门店等级" class="evan-form-item" show_jiantou prop="storeLevel">
								<picker mode="selector" class="picker" @change="bindPickerChange2" :value="index2" :range="sale_org" range-key="name">
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="sale_org[index2].name"
										placeholder="请选择网点/门店等级"
									/>
								</picker>
							</evan-form-item>
							<!-- end 网点/门店等级 -->

							<!-- 上级店铺 -->
							<view>
								
								<view class="l-form-item" @click="gofindStores">
									<view class="l-item-label" data-info=" " >上级店铺</view>
									<view class="l-item-value" :style="{ color: stop_name_str ? '#666' : '#ccc' }" >{{ stop_name_str || '请选择上级店铺' }}</view>
									<view class="iconfont l-item-arrow">&#xe770;</view>
								</view>
								<block v-for="(item, index) in shopList" :key="item.super_store_id">
									<shop-brand :item="item" :index="index" @stopChang="stopChang" @goarchivesScreen="goarchivesScreen" @deleteStop="deleteStop"></shop-brand>
								</block>
							</view>

							<!-- 其他的品类 -->
							<view>
								<uni-section title="其他品类(多选)" marginTop="0rpx" type="square" bgColor="#00EADD"></uni-section>
								<view class="shop-list">
									<checkbox-group @change="checkBoxpl" class="redio-list">
										<view class="rlabel" v-for="(c, i) in systemDict" :key="c.id">
											<checkbox color="#fdc100" :value="c.id" style="transform: scale(0.6);" :checked="c.checked || false" />
											<text>{{ c.value }}</text>
										</view>
									</checkbox-group>
								</view>
							</view>
							<view class="w-100 d-flex a-center reletion-store">
								<view class="dot"></view>
								<view class="name">客户多门店关联</view>
								<view class="sub-name mx-2">(非多门店可不勾选)</view>
							</view>
							<view>
								<view class="isShopkeeper d-flex j-sb a-center">
									<text class="unreqired">是否为店主</text>
									<view class="d-flex a-center flex-1 j-end">
										<radio-group @change="radioChange" class="isShopkeeperpro">
											<view class="isShopkeeperlis">
												<text>是</text>
												<checkbox color="#fdc100" :value="1" :checked="false" style="transform: scale(0.7);" />
											</view>
											<view class="isShopkeeperlis">
												<text>否</text>
												<checkbox color="#fdc100" :value="0" :checked="false" style="transform: scale(0.7);" />
											</view>
										</radio-group>
									</view>
								</view>
								<view class="isShopkeeper d-flex j-sb a-center">
									<text class="reqired">是否为惠分销门店</text>
									<view class="d-flex a-center flex-1 j-end">
										<radio-group @change="isWhetherSmallbRadio" class="isShopkeeperpro">
											<view class="isShopkeeperlis">
												<text>是</text>
												<checkbox color="#fdc100" :value="1" :checked="false" style="transform: scale(0.7);" />
											</view>
											<view class="isShopkeeperlis">
												<text>否</text>
												<checkbox color="#fdc100" :value="0" :checked="false" style="transform: scale(0.7);" />
											</view>
										</radio-group>
									</view>
								</view>
							</view>
							<view class="bctj-btn">
								<button type="warn" class=" button" size="mini" @click="hold">保存</button>
								<button type="primary" class=" button" size="mini" @click="next">下一步</button>
							</view>
						</scroll-view>
					</swiper-item>
					<!-- 基本信息 -->
					<swiper-item class="swiper-item d-flex w-100  ">
						<scroll-view class="scroll-v flex-1 list" enableBackToTop="true" scroll-y>
							<uni-section title="基本信息" marginTop="0rpx" type="square" bgColor="#FFCD00"></uni-section>

							<evan-form-item label="门店名称" class="evan-form-item" prop="customer_name">
								<input
									type="text"
									confirm-type="确定"
									class="form-input mynowarp"
									placeholder-style="font-size: 28rpx;color:#ccc;"
									v-model="datas.customer_name"
									placeholder="请填写门店名称"
								/>
							</evan-form-item>

							<evan-form-item label="商业单位名称" class="evan-form-item">
								<input
									type="text"
									confirm-type="确定"
									class="form-input mynowarp"
									placeholder-style="font-size: 28rpx;color:#ccc;"
									v-model="datas.business_name"
									placeholder="请填写商业单位名称"
								/>
							</evan-form-item>

							<evan-form-item label="商业单位门店编码" class="evan-form-item">
								<input
									type="text"
									confirm-type="确定"
									class="form-input mynowarp"
									placeholder-style="font-size: 28rpx;color:#ccc;"
									v-model="datas.business_store_code"
									placeholder="请填写商业单位门店编码"
								/>
							</evan-form-item>

							<evan-form-item label="联系人" class="evan-form-item" prop="contacts">
								<input
									type="text"
									confirm-type="确定"
									class="form-input mynowarp"
									placeholder-style="font-size: 28rpx;color:#ccc;"
									v-model="datas.contacts"
									placeholder="请填写联系人"
								/>
							</evan-form-item>

							<evan-form-item label="联系电话" class="evan-form-item" prop="mobile">
								<input
									type="number"
									confirm-type="确定"
									class="form-input mynowarp"
									placeholder-style="font-size: 28rpx;color:#ccc;"
									v-model="datas.mobile"
									placeholder="请填写联系电话"
								/>
							</evan-form-item>

							<evan-form-item :label-style="labelStyle" label="地址" class="evan-form-item" show_jiantou @click="selectCity(1)" prop="area_name">
								<view class="w-100 text-right" :class="datas.area_name ? 'text-666' : 'text-ccc'">{{ datas.area_name || '请选择地区' }}</view>
							</evan-form-item>

							<evan-form-item :label-style="labelStyle" label="详细地址" class="evan-form-item" prop="address">
								<view style="width: 100%;box-sizing: border-box;">
									<textarea
										:hidden="popShow"
										class="form-input w-100"
										type="text"
										v-model="datas.address"
										placeholder="请填写详细地址"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										auto-height
									/>
								</view>
							</evan-form-item>

							<evan-form-item label="门店所在地邮政编码" class="evan-form-item" prop="location_code">
								<input
									type="number"
									confirm-type="确定"
									class="form-input mynowarp"
									placeholder-style="font-size: 28rpx;color:#ccc;"
									v-model="datas.location_code"
									placeholder="门店所在地邮政编码"
								/>
							</evan-form-item>
							<evan-form-item label="业务员" class="evan-form-item" show_jiantou>
								<input type="text" disabled class="form-input mynowarp" :value="loginInfo.name" />
							</evan-form-item>
							<uni-section marginTop="0rpx" title="上传图片" type="square" bgColor="#FD9D14"></uni-section>
							<view class="upimg d-flex flex-wrap">
								<view class="d-flex upload_item flex-column a-center">
									<view @click="chooseImage('door_photo')" class="m-1 upload_item_content">
										<image v-if="datas.door_photo" :src="datas.door_photo" class="upload_item_content_image"></image>
										<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
									</view>
									<view class="font-sm text-muted upload_item_bottom_text">
										<i>*</i>
										门头照
									</view>
								</view>
								<view class="d-flex upload_item flex-column a-center">
									<view @click="chooseImage('shop_photo')" class="m-1 upload_item_content">
										<image v-if="datas.shop_photo" :src="datas.shop_photo" class="upload_item_content_image"></image>
										<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
									</view>
									<view class="font-sm text-muted upload_item_bottom_text">
										<i>*</i>
										门店整体照片
									</view>
								</view>
								<view class="d-flex upload_item flex-column a-center">
									<view @click="chooseImage('ice_wash_photo')" class="m-1 upload_item_content">
										<image v-if="datas.ice_wash_photo" :src="datas.ice_wash_photo" class="upload_item_content_image"></image>
										<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
									</view>
									<view class="font-sm text-muted upload_item_bottom_text">
										<i>*</i>
										冰洗区照片
									</view>
								</view>
								<view class="d-flex upload_item flex-column a-center">
									<view @click="chooseImage('air_conditioning_photo')" class="m-1 upload_item_content">
										<image v-if="datas.air_conditioning_photo" :src="datas.air_conditioning_photo" class="upload_item_content_image"></image>
										<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
									</view>
									<view class="font-sm text-muted upload_item_bottom_text">空调区照片</view>
								</view>
								<view class="d-flex upload_item flex-column a-center">
									<view @click="chooseImage('television_photo')" class="m-1 upload_item_content">
										<image v-if="datas.television_photo" :src="datas.television_photo" class="upload_item_content_image"></image>
										<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
									</view>
									<view class="font-sm text-muted upload_item_bottom_text">电视区照片</view>
								</view>

								<view class="d-flex upload_item flex-column a-center">
									<view @click="chooseImage('kitchen_photo')" class="m-1 upload_item_content">
										<image v-if="datas.kitchen_photo" :src="datas.kitchen_photo" class="upload_item_content_image"></image>
										<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
									</view>
									<view class="font-sm text-muted upload_item_bottom_text">厨电区照片</view>
								</view>
								<view class="d-flex upload_item flex-column a-center">
									<view @click="chooseImage('small_area_photo')" class="m-1 upload_item_content">
										<image v-if="datas.small_area_photo" :src="datas.small_area_photo" class="upload_item_content_image"></image>
										<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
									</view>
									<view class="font-sm text-muted upload_item_bottom_text">小电区照片</view>
								</view>
							</view>
							<view class="bctj-btn">
								<button type="warn" class=" button" size="mini" @click="hold">保存</button>
								<button type="primary" class=" button" size="mini" @click="next">下一步</button>
							</view>
						</scroll-view>
					</swiper-item>
					<!-- 财务信息 -->
					<swiper-item class="swiper-item d-flex w-100  ">
						<scroll-view class="scroll-v flex-1 list" enableBackToTop="true" scroll-y>
							<uni-section title="财务信息" marginTop="0rpx" type="square" bgColor="#178EF6"></uni-section>
							<view class="d-flex a-center j-center mt-3">
								<view class="a-center-child" :class="zsindex == 0 && 'a-center-child-l'" @click="zsindex = 0">三证合一</view>
								<view class="a-center-child" :class="zsindex == 1 && 'a-center-child-l'" @click="zsindex = 1">三证</view>
							</view>
							<!-- 三证合一 -->
							<view class="form" v-if="zsindex === 0">
								<evan-form-item label="统一社会信用代码" class="evan-form-item" prop="snified_social_credit_code">
									<input
										type="text"
										confirm-type="确定"
										class="form-input mynowarp"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										v-model="datas.snified_social_credit_code"
										:maxlength="18"
										:minlength="18"
										placeholder="请填写18位字符信用代码"
									/>
								</evan-form-item>
								<evan-form-item label="单位名称" class="evan-form-item" prop="company_name">
									<input
										type="text"
										confirm-type="确定"
										class="form-input mynowarp"
										v-model="datas.company_name"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										placeholder="请填写单位名称"
									/>
								</evan-form-item>
								<evan-form-item label="银行账号" class="evan-form-item" prop="bank_account">
									<input
										type="number"
										confirm-type="确定"
										class="form-input mynowarp"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										v-model="datas.bank_account"
										placeholder="请填写银行账号"
									/>
								</evan-form-item>

								<evan-form-item label="开户行" class="evan-form-item" prop="opening_bank">
									<input
										type="text"
										confirm-type="确定"
										class="form-input mynowarp"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										v-model="datas.opening_bank"
										placeholder="请填写开户行"
									/>
								</evan-form-item>
								<view class=" px-3 py-1">上传附件</view>
								<view class="d-flex upload_item flex-column a-center">
									<view @click="upattachs(3)" class="m-1 upload_item_content">
										<image v-if="cust_apply_attachs[3].url" :src="cust_apply_attachs[3].url" class="upload_item_content_image"></image>
										<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
									</view>
									<view class="font-sm text-muted upload_item_bottom_text">
										<i>*</i>
										统一社会信用代码
									</view>
								</view>
							</view>

							<!-- 三证 -->
							<view class="form" v-if="zsindex === 1">
								<evan-form-item label="营业执照编码" class="evan-form-item" prop="business_license_number">
									<input
										type="text"
										confirm-type="确定"
										class="form-input mynowarp"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										v-model="datas.business_license_number"
										placeholder="请填写营业执照编码"
									/>
								</evan-form-item>
								<evan-form-item label="组织机构代码" class="evan-form-item" prop="organization_code">
									<input
										type="text"
										confirm-type="确定"
										class="form-input mynowarp"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										v-model="datas.organization_code"
										placeholder="请填写组织机构代码"
									/>
								</evan-form-item>

								<evan-form-item label="纳税人识别号" class="evan-form-item" prop="taxpayer_number">
									<input
										type="text"
										confirm-type="确定"
										class="form-input mynowarp"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										v-model="datas.taxpayer_number"
										placeholder="请填写纳税人识别号"
									/>
								</evan-form-item>
								<evan-form-item label="发票抬头" class="evan-form-item" prop="invoice_title">
									<input
										type="text"
										confirm-type="确定"
										class="form-input mynowarp"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										v-model="datas.invoice_title"
										placeholder="请填写发票抬头"
									/>
								</evan-form-item>
								<evan-form-item label="银行账号" class="evan-form-item" prop="bank_account">
									<input
										type="number"
										confirm-type="确定"
										class="form-input mynowarp"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										v-model="datas.bank_account"
										placeholder="请填写银行账号"
									/>
								</evan-form-item>
								<evan-form-item label="开户行" class="evan-form-item" prop="opening_bank">
									<input
										type="text"
										confirm-type="确定"
										class="form-input mynowarp"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										v-model="datas.opening_bank"
										placeholder="请填写开户行"
									/>
								</evan-form-item>
								<view class="px-3 py-1">上传附件</view>
								<view class="d-flex a-center j-center">
									<block v-for="(item, index) in cust_apply_attachs" :key="index">
										<view class="d-flex upload_item flex-column a-center" v-if="item.type !== 0">
											<view @click="upattachs(index)" class="m-1 upload_item_content">
												<view v-if="!item.url" class="iconfont  upload_item_content_haost">&#xe602;</view>
												<image v-else :src="item.url" class="upload_item_content_image"></image>
											</view>
											<view class="font-sm text-muted upload_item_bottom_text">
												<i>*</i>
												{{ item.attach_name }}
											</view>
										</view>
									</block>
								</view>
							</view>
							<uni-section title="纳税人类型" marginTop="0rpx" type="square" bgColor="#40CCFF"></uni-section>

							<evan-form-item label="纳税人类型" class="evan-form-item" show_jiantou prop="taxpayer_type">
								<picker mode="selector" class="picker" @change="ontaxpayerType" :range="taxpayer_list" range-key="name">
									<input
										disabled
										class="form-input"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										:value="taxpayerindex !== null ? taxpayer_list[taxpayerindex].name : ''"
										placeholder="请选择纳税人类型"
									/>
								</picker>
							</evan-form-item>

							<uni-section title="发票寄送地址" marginTop="0rpx" type="square" bgColor="#40CCFF"></uni-section>

							<evan-form-item label="联系人" class="evan-form-item" prop="consignee_name">
								<input
									type="text"
									confirm-type="确定"
									class="form-input mynowarp"
									placeholder-style="font-size: 28rpx;color:#ccc;"
									v-model="datas.consignee_name"
									placeholder="请填写联系人"
								/>
							</evan-form-item>

							<evan-form-item label="联系电话" class="evan-form-item" prop="consignee_mobile">
								<input
									type="number"
									confirm-type="确定"
									class="form-input mynowarp"
									placeholder-style="font-size: 28rpx;color:#ccc;"
									v-model="datas.consignee_mobile"
									placeholder="请填写联系电话"
								/>
							</evan-form-item>

							<evan-form-item :label-style="labelStyle" label="地址" class="evan-form-item" show_jiantou prop="consignee_area" @click="selectCity(2)">
								<view class="w-100 text-right" :class="consignee_area_name ? 'text-666' : 'text-ccc'">{{ consignee_area_name || '请选择地区' }}</view>
							</evan-form-item>

							<evan-form-item :label-style="labelStyle" label="详细地址" class="evan-form-item" prop="consignee_address">
								<view style="width: 100%;box-sizing: border-box;">
									<textarea
										:hidden="popShow"
										class="form-input w-100"
										type="text"
										v-model="datas.consignee_address"
										placeholder="请填写详细地址"
										placeholder-style="font-size: 28rpx;color:#ccc;"
										auto-height
									/>
								</view>
							</evan-form-item>
							<view class="bctj-btn">
								<button type="warn" class=" button" size="mini" @click="hold">保存</button>
								<button type="primary" class=" button" size="mini" @click="submit">提交</button>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</evan-form>
		<!-- 地址选择 -->
		<inputting-adress :controlTel="administrative" @maskTask="adMaskTask" ref="inputting-adress" @clickpop="clickpop"></inputting-adress>
		<!-- end 地址选择 -->
	</view>
</template>

<script>
import evanForm from '@/components/evan-form/evan-form.vue';
import evanFormItem from '@/components/evan-form/evan-form-item.vue';
import utils from '@/components/evan-form/utils.js';
import inputtingAdress from '@/components/inputtingAdress/inputtingAdress.vue';
import uniSection from '@/components/uni/uni-section/uni-section.vue';
import shopBrand from '@/components/common/shop-brand/shop-brand.vue';
// 基本信息的地址选择
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import { deepClone } from '@/ulits/Validation.js';
import test from '@/ulits/function/test.js';
export default {
	components: {
		evanForm,
		evanFormItem,
		inputtingAdress,
		uniSection,
		shopBrand
	},
	data() {
		return {
			isDetailPage: true, // 判断是新增还是激活页面(修改详情页)
			customer_apply_id: null,
			clearnTime: null,
			hideRequiredAsterisk: false, //表单验证
			tabBars: [
				{
					name: '客户分类',
					id: 'clienClass'
				},
				{
					name: '基本信息',
					id: 'baseInfo'
				},
				{
					name: '财务信息',
					id: 'financeInfo'
				}
			],
			storesClassIndex: null,
			storesClass: [
				{
					id: 1,
					name: '线上'
				},
				{
					id: 2,
					name: '线下'
				}
			],
			businessStyleIndex: null,
			businessStyle: [
				{
					id: 1,
					name: '直营'
				},
				{
					id: 2,
					name: '代理'
				}
			],

			tabIndex: 0, //tabBar显示索引
			oneIndex: null, //大渠道选择
			twoIndex: null, //小渠道选择
			threeIndex: null, //一级门店
			fourIndex: null, //二级门店
			index1: null, //行政划区
			index2: null, //网点/门店等级
			cust_apply_attachs: [
				{
					attach_name: '营业执照编码',
					url: '',
					file_name: '',
					type: 2
				},
				{
					attach_name: '组织机构代码',
					url: '',
					file_name: '',
					type: 3
				},
				{
					attach_name: '纳税人识别号',
					url: '',
					file_name: '',
					type: 4
				},
				{
					attach_name: '统一社会信用代码',
					url: '',
					file_name: '',
					type: 0
				}
			], // 附件

			index3: null, //获取所属区域
			stop_id_str: '', //选中店铺的id
			selete_stop: [], // 选中店铺
			shopList: [], //上级店铺下品牌品类(赋值和shoplist一样格式)
			systemDict: [],
			taxpayerindex: null, //纳税人类型
			selectCityType: 1, // 1选择基本信息地址 2财务信息地址
			zsindex: 0, // 三证切换
			popShow: false, // 是否打开地址选择模块框
			supervisor_name: '', //终端主管名称
			otherBrand: [], // 选中id[id1,id2,..]
			consignee_area_name: '', //财务地址
			storeKeyName: 'CREATE_BRAND_CATEGORY',
			datas: {
				door_photo: '',
				shop_photo: '',
				ice_wash_photo: '',
				air_conditioning_photo: '',
				television_photo: '',
				kitchen_photo: '',
				small_area_photo: '',
				one_category_id: null,
				two_category_id: null,
				three_category_id: null, // 门店一级类型
				four_category_id: null, // 门店二级类型
				business_model: null, //门店分类
				customer_type: null, // 经营的方式
				sale_org_id: null, // 所属区域
				storeLevel: null, //门店等级
				administrative: null, // 行政等级
				is_main_store: null, // 是否主店
				whetherSmallb: null, // 是否为惠分销分店
				customer_name: '', //门店名称
				business_name: '', //商业单位名称
				business_store_code: '', //商业单位门店编码
				contacts: '', //请填写联系人
				mobile: '', //请填写联系电话
				area_name: '', //地址
				area_id: null, // 地址id
				address: '', //详细地址
				location_code: '', //门店所在地编码
				snified_social_credit_code: '', //统一社会信用代码
				bank_account: '', //银行账号
				opening_bank: '', //开户行
				business_license_number: '', //营业执照编码
				company_name: '', //发票信息-单位名称
				invoice_title: '', //发票信息-发票抬头
				organization_code: '', //组织机构代码
				taxpayer_number: '', //纳税人识别号
				taxpayer_type: null, // 纳税人类型id
				consignee_name: '', //财务联系人
				consignee_mobile: '', //财务联系电话
				consignee_area: null, //财务地址id
				consignee_address: '', //财务详细地址
				is_active: 0 //是否合作	int	0未合作  1已合作	否
			},
			rules: {
				one_category_id: {
					required: true,
					message: '请选择大渠道'
				},
				two_category_id: {
					required: true,
					message: '请选择小渠道'
				},
				three_category_id: {
					required: true,
					message: '请选择门店一级类型'
				},
				// four_category_id: {
				// 	required: true,
				// 	message: '请选择门店二级类型'
				// },
				// customer_type: {
				// 	required: true,
				// 	message: '请选择经营方式'
				// },
				// business_model: {
				// 	required: true,
				// 	message: '请选择门店分类'
				// },
				sale_org_id: {
					required: true,
					message: '请选择所属区域'
				},
				administrative: {
					required: true,
					message: '请选择行政划区'
				},
				storeLevel: {
					required: true,
					message: '请选择门店等级'
				},
				whetherSmallb:{
					required: true,
					message: '请选择是否为惠分销门店'
				},
				
				customer_name: {
					required: true,
					message: '请填写门店名称'
				},

				contacts: {
					required: true,
					message: '请填写联系人'
				}, //请填写联系人
				mobile: [
					{
						required: true,
						message: '请输入手机号'
					},
					{
						validator: this.isMobilePhone
					}
				], //请填写联系电话
				area_name: {
					required: true,
					message: '请选择地址'
				}, //地址
				area_id: {
					required: true,
					message: '请选择地址'
				}, // 地址id
				address: {
					required: true,
					message: '请输写详细地址'
				}, //详细地址
				location_code: {
					required: true,
					message: '请输写门店所在地邮政编码'
				}, //门店所在地编码
				door_photo: {
					required: true,
					message: '请上传门头照'
				},
				shop_photo: {
					required: true,
					message: '请上传门店整体照'
				},
				ice_wash_photo: {
					required: true,
					message: '请上传冰洗区照'
				},

				snified_social_credit_code: {
					required: true,
					validator: (rule, value, callback) => {
						if (this.zsindex === 0) {
							if (value.length === 18) {
								callback();
							} else {
								callback(new Error('请填写18位字符的社会信用代码'));
							}
						} else {
							callback();
						}
					}
				},

				company_name: {
					required: true,
					validator: (rule, value, callback) => {
						if (this.zsindex === 0) {
							if (value.length != 0) {
								callback();
							} else {
								callback(new Error('请填写发票信息-单位名称'));
							}
						} else {
							callback();
						}
					}
				},

				business_license_number: {
					required: true,
					// 纳税人识别号
					validator: (rule, value, callback) => {
						if (this.zsindex === 1) {
							if (value.length !== 0) {
								callback();
							} else {
								callback(new Error('请填写营业执照编码'));
							}
						} else {
							callback();
						}
					}
				},
				organization_code: {
					required: true,
					// 纳税人识别号
					validator: (rule, value, callback) => {
						if (this.zsindex === 1) {
							if (value.length !== 0) {
								callback();
							} else {
								callback(new Error('请填写组织机构代码'));
							}
						} else {
							callback();
						}
					}
				},
				taxpayer_number: {
					required: true,
					// 纳税人识别号
					validator: (rule, value, callback) => {
						if (this.zsindex === 1) {
							if (value.length !== 0) {
								callback();
							} else {
								callback(new Error('请填写纳税人识别号'));
							}
						} else {
							callback();
						}
					}
				},
				invoice_title: {
					required: true,
					// 纳税人识别号
					validator: (rule, value, callback) => {
						if (this.zsindex === 1) {
							if (value.length !== 0) {
								callback();
							} else {
								callback(new Error('请填写发票信息-发票抬头'));
							}
						} else {
							callback();
						}
					}
				},

				bank_account: {
					required: true,
					message: '请填写银行账号'
				},
				opening_bank: {
					required: true,
					message: '请填写开户行'
				},

				taxpayer_type: {
					required: true,
					message: '请选择纳税人类型'
				}, // 纳税人类型id
				consignee_name: {
					required: true,
					message: '请输写财务联系人'
				}, //财务联系人
				consignee_mobile: [
					{
						required: true,
						message: '请输入财务-手机号'
					},
					{
						validator: this.isMobilePhone
					}
				],
				consignee_area: {
					required: true,
					message: '请输写财务地址'
				}, //财务地址id

				consignee_address: {
					required: true,
					message: '请输写财务详细地址'
				} //财务详细地址
			}
		};
	},
	onLoad(option) {
		this.clearBrandCatrty();
		try{
			option = this.$formateOption(option);
			this.is_active = option.is_active;
			this.customer_apply_id = option.customer_apply_id;
			this.__init();
		}catch(e){
			//TODO handle the exception
			console.log(e);
			uni.showToast({
				title:'参数错误',
				icon:'none'
			})
			
		}
		

	},
	mounted() {
		this.$refs.form.setRules(this.rules);
	},
	onUnload() {
		this.clearBrandCatrty();
	},
	computed: {
		...mapState({
			resultData: state => state.channel.data,
			find_store: state => state.channel.storedata,
			huaQuArr: state => state.channel.huaQuArr,
			sale_org: state => state.channel.sale_org,
			taxpayer_list: state => state.channel.taxpayer_list,
			loginInfo: state => state.user.loginInfo
		}),
		labelStyle() {
			return {
				width: '300rpx'
			};
		},

		coloumOne() {
			let list = [];
			if (this.resultData && this.resultData.length > 0) {
				list = this.resultData;
			}
			return list;
		},

		coloumTwo() {
			let list = [];
			if (this.coloumOne.length > 0 && this.oneIndex !== null) {
				if (this.coloumOne[this.oneIndex].list && this.coloumOne[this.oneIndex].list.length > 0 && this.oneIndex !== null) {
					list = this.coloumOne[this.oneIndex].list;
				}
			}
			return list;
		},

		coloumThree() {
			let list = [];
			if (this.coloumTwo.length > 0 && this.twoIndex !== null) {
				if (this.coloumTwo[this.twoIndex].list && this.coloumTwo[this.twoIndex].list.length > 0 && this.twoIndex !== null) {
					list = this.coloumTwo[this.twoIndex].list;
				}
			}
			return list;
		},
		coloumFour() {
			let list = [];
			if (this.coloumThree.length > 0 && this.threeIndex !== null) {
				if (this.coloumThree[this.threeIndex].list && this.coloumThree[this.threeIndex].list.length > 0 && this.threeIndex !== null) {
					list = this.coloumThree[this.threeIndex].list;
				}
			}
			return list;
		},
		one_category_id: {
			get: function() {
				return this.datas.one_category_id;
			},
			set: function(value) {
				let index = this.coloumOne.findIndex(v => v.id === value);
				if (index > -1) {
					this.oneIndex = index;
					this.twoIndex = null;
					this.threeIndex = null;
					this.fourIndex = null;
					this.datas.one_category_id = value;
					this.datas.two_category_id = null;
					this.datas.three_category_id = null;
					this.datas.four_category_id = null;
				}
			}
		},
		two_category_id: {
			get: function() {
				return this.datas.two_category_id;
			},
			set: function(value) {
				let index = this.coloumTwo.findIndex(v => v.id === value);
				if (index > -1) {
					this.twoIndex = index;
					this.threeIndex = null;
					this.fourIndex = null;
					this.datas.two_category_id = value;
					this.datas.three_category_id = null;
					this.datas.four_category_id = null;
				}
			}
		},
		three_category_id: {
			get: function() {
				return this.datas.three_category_id;
			},
			set: function(value) {
				let index = this.coloumThree.findIndex(v => v.id === value);
				if (index > -1) {
					this.threeIndex = index;
					this.fourIndex = null;
					this.datas.three_category_id = value;
					this.datas.four_category_id = null;
				}
			}
		},

		four_category_id: {
			get: function() {
				return this.datas.four_category_id;
			},
			set: function(value) {
				let index = this.coloumFour.findIndex(v => v.id === value);
				if (index > -1) {
					this.fourIndex = index;
					this.datas.four_category_id = value;
				}
			}
		},
		customer_type: {
			// 经营的方式
			get: function() {
				return this.datas.customer_type;
			},
			set: function(value) {
				let index = this.businessStyle.findIndex(v => v.id === value);
				if (index > -1) {
					this.businessStyleIndex = index;
					this.datas.customer_type = value;
				}
			}
		},
		business_model: {
			// 门店分类
			get: function() {
				return this.datas.business_model;
			},
			set: function(value) {
				let index = this.storesClass.findIndex(v => v.id === value);
				if (index > -1) {
					this.storesClassIndex = index;
					this.datas.business_model = value;
				}
			}
		},
		sale_org_id: {
			// 所属地区
			get: function() {
				return this.datas.sale_org_id;
			},
			set: function(value) {
				this.datas.sale_org_id = value;
				let index = this.find_store.findIndex(v => v.store_id === value);
				if (index > -1) {
					this.index3 = index;
				}
			}
		},
		store_level: {
			// 门店等级
			get: function() {
				return this.datas.storeLevel;
			},
			set: function(value) {
				this.datas.storeLevel = value;
				let index = this.sale_org.findIndex(v => v.id === value);
				if (index > -1) {
					this.index2 = index;
				}
			}
		},
		administrative: {
			// 行政区域
			get: function() {
				return this.datas.administrative;
			},
			set: function(value) {
				this.datas.administrative = value;
				let index = this.huaQuArr.findIndex(v => v.id === value);
				if (index > -1) {
					this.index1 = index;
				}
			}
		},
		taxpayer_type: {
			// 纳税人类型
			get: function() {
				return this.datas.taxpayer_type;
			},
			set: function(value) {
				this.datas.taxpayer_type = value;
				let index = this.taxpayer_list.findIndex(v => v.id === value);
				if (index > -1) {
					this.taxpayerindex = index;
				}
			}
		},
		// 店铺名称
		stop_name_str() {
			return this.shopList.map(v => v.super_store_name).join(';');
		}
	},

	methods: {
		...mapMutations(['setChannel', 'setStore']),
		...mapActions(['getQuDaoData', 'getStoreData']),
		
		// 清楚品牌品类缓存
		clearBrandCatrty() {
			uni.removeStorage({
				key: this.storeKeyName,
				success: function(res) {
					console.log('success');
				}
			});
		},
		// 其他品牌
		OtherClass() {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.systemDict,
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						reject(err.message);
					}
				});
			});
		},
		isMobilePhone(rule, value, callback) {
			if (test.mobile(value)) {
				callback();
			} else {
				callback(new Error('手机号格式不正确'));
			}
		},
		// 上传附件
		async upattachs(index) {
			let { file_info, message, type } = await this.$upImage(index);
			this.cust_apply_attachs[type].url = file_info.url;
			this.cust_apply_attachs[type].file_name = file_info.name;
		},
		// 上传图片
		async chooseImage(ins) {
			let { file_info, message, type } = await this.$upImage(ins);
			if (message.type == 'success') {
				this.datas[type] = file_info.url;
			}
		},
		async __init() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			try {
				// 渠道
				let req = await this.getQuDaoData();
				// 所属地区
				let req2 = await this.getStoreData();
				//获取其他品类
				let req3 = await this.OtherClass();
				req3 = req3.map(v => {
					return {
						...v,
						checked: false
					};
				});
				this.systemDict = req3;

				if (this.isDetailPage) {
					// 获取详情数
					let resdata = await this.getDetailData();
					if (resdata) {
						this.orgData(resdata);
					}
				}
				uni.hideLoading();
			} catch (error) {
				console.log("错误",error)
				uni.showToast({
					title:'请求失败',
					icon:'none'
				})
			}
		},

		// 详情赋值
		orgData(resdata) {
			console.log(JSON.stringify(resdata, null, 4));
			// return;
			// 大渠道
			this.one_category_id = resdata.one_category_id;
			// 小渠道
			this.two_category_id = resdata.two_category_id;
			//门店一级类型
			resdata.three_category_id && (this.three_category_id = resdata.three_category_id);
			//门店二级类型
			resdata.four_category_id && (this.four_category_id = resdata.four_category_id);
			// 经营方式
			resdata.customer_type && (this.customer_type = resdata.customer_type);
			// 门店分类
			resdata.business_model && (this.business_model = resdata.business_model);
			// 行政区域
			this.administrative = resdata.administrative;
			// 所属区域
			this.sale_org_id = resdata.sale_org_id;
			// 网点等级
			this.store_level = resdata.store_level;
			// 基本信息
			this.datas.customer_name = resdata.customer_name;
			resdata.business_name && (this.datas.business_name = resdata.business_name);
			resdata.business_store_code && (this.datas.business_store_code = resdata.business_store_code);
			this.datas.contacts = resdata.contacts;
			this.datas.mobile = resdata.mobile;
			this.datas.area_name = resdata.area_name;
			this.datas.area_id = resdata.area_id;
			this.datas.address = resdata.address;
			this.datas.location_code = resdata.location_code;
			// 门头照
			this.datas.door_photo = resdata.door_photo;
			// 整体照
			this.datas.shop_photo = resdata.shop_photo;
			// 冰洗照
			this.datas.ice_wash_photo = resdata.ice_wash_photo;
			// 空调区照
			resdata.air_conditioning_photo && (this.datas.air_conditioning_photo = resdata.air_conditioning_photo);
			// 电视区照
			resdata.television_photo && (this.datas.television_photo = resdata.television_photo);
			// 厨电区照
			resdata.kitchen_photo && (this.datas.kitchen_photo = resdata.kitchen_photo);
			// 小区照
			resdata.small_area_photo && (this.datas.small_area_photo = resdata.small_area_photo);
			if (false) {
				// 上级店铺
				if (resdata.stores && resdata.stores.length) {
					// 品牌的id
					this.stop_id_str = resdata.stores.map(v => v.super_store_id).join(',');
					// 品牌品类
					this.shopList = this.addcheckedFun(resdata.stores, true);
				}

				// 其他品牌
				if (resdata.other_category_id) {
					let other_catarr = resdata.other_category_id.split(',');
					for (let i = 0; i < other_catarr.length; i++) {
						this.systemDict.forEach(v => {
							if (v.id == +other_catarr[i]) {
								v.checked = true;
							}
						});
					}
				}

				// 是否为主店
				if (resdata.is_main_store === 0 || resdata.is_main_store === 1) {
					this.datas.is_main_store = resdata.is_main_store;
				}

				// 三证合一
				if (!test.isEmpty(resdata.taxpayer_number)) {
					this.zsindex = 1;
					// 营业执照编码
					resdata.business_license_number && (this.datas.business_license_number = resdata.business_license_number);
					// 组织机构代码
					resdata.organization_code && (this.datas.organization_code = resdata.organization_code);
					// 纳税人识别号
					resdata.taxpayer_number && (this.datas.taxpayer_number = resdata.taxpayer_number);
					resdata.invoice_title && (this.datas.invoice_title = resdata.invoice_title);
				} else {
					this.zsindex = 0;
					// 统一社会信用代码
					resdata.snified_social_credit_code && (this.datas.snified_social_credit_code = resdata.snified_social_credit_code);
					resdata.company_name && (this.datas.company_name = resdata.company_name);
				}
				// 附件
				if (resdata.cust_apply_attachs.length) {
					for (let i = 0; i < resdata.cust_apply_attachs.length; i++) {
						this.cust_apply_attachs.forEach(v => {
							if (resdata.cust_apply_attachs[i].type == v.type && resdata.cust_apply_attachs[i].url) v.url = resdata.cust_apply_attachs[i].url;
						});
					}
				}

				// 银行账号
				resdata.bank_account && (this.datas.bank_account = resdata.bank_account);
				// 开户行
				resdata.opening_bank && (this.datas.opening_bank = resdata.opening_bank);
				// 纳税人类型
				resdata.taxpayer_type && (this.taxpayer_type = resdata.taxpayer_type);

				// 财务联系人
				resdata.consignee_name && (this.datas.consignee_name = resdata.consignee_name);
				// 财务联系电话
				resdata.consignee_mobile && (this.datas.consignee_mobile = resdata.consignee_mobile);
				// 财务地址
				resdata.consignee_area_name && (this.consignee_area_name = resdata.consignee_area_name);
				// 财务地址id
				resdata.consignee_area && (this.datas.consignee_area = resdata.consignee_area);
				// 财务详细地址
				resdata.consignee_address && (this.datas.consignee_address = resdata.consignee_address);
			}
		},
		// 获取详情数据
		getDetailData() {
			if (this.customer_apply_id === null || this.datas.is_active === null) {
				return false;
			}
			return new Promise((resolve, reject) => {
				let parmas = {
					customer_apply_id: this.customer_apply_id,
					is_active: this.datas.is_active
				};
				this.$myRequest({
					url: this.$myhttpUrl.customerApply_select,
					data: parmas,
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						reject();
					}
				});
			});
		},

		/**
		 * 选择我的店铺事件
		 * 注意店铺在所属地区的店铺,拿到当前所属地区的id
		 * store_id  当前选中所属区域
		 */
		gofindStores() {
			const l_store_id = this.datas.sale_org_id;
			if (!l_store_id) {
			return	uni.showToast({
					title:'选择店铺之前,必须选选择所属地区',
					icon:'none'
				})
			}
			this.$eventHub.$on('findStoredata', data => {
				let { store_id = [], valueName } = data;
				let tempShopList = this.shopList;
				let filterStoreId =[];
				let oldArr = []; // 依然存在
				tempShopList.forEach((v,p) => {
					const super_store_id = v.super_store_id;
					store_id.forEach((s,k) => {
						if(super_store_id == s){
							store_id.splice(k,1);
							oldArr.push(v)
						}
					})
				})
				this.shopList = oldArr;
				filterStoreId = store_id;
				// 处理已经存在的id， 没必要重复请求
				if(filterStoreId.length > 0){
					filterStoreId = filterStoreId.join(',');
					this.getFindStoreClass(filterStoreId);
				}
		
				this.$eventHub.$off('findStoredata');
			});
			this.$myNavigateTo('/pages/findStore/findStore', {
				id: l_store_id
			});
		},

		// 获取店铺的品牌品类
		getFindStoreClass(stop_id_str) {
			this.$myRequest({
				url: this.$myhttpUrl.brandCategoryList,
				data: {
					store_ids: stop_id_str
				},
				success: res => {
					uni.hideLoading();
					let list = this.shopList;
					let datas = this.addcheckedFun(res.data, false)|| [];
					// 存储店铺名称
					this.shopList = list.concat(datas);
				},
				fail: err => {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
				
			});
		},

		//点击删除店铺下的品牌品类
		deleteStop(index) {
			try{
				const { super_store_id } = this.shopList[index];
				const value = uni.getStorageSync(this.storeKeyName);
				if (value) {
					let { data = [] } = JSON.parse(value);
					let templist = [];
					data.forEach(v => {
						templist = templist.concat(v.list);
					});
					const { company_id } = templist.find(v => v.store_id == super_store_id);
					const pIndex = data.findIndex(s => s.company_id == company_id);
					if (pIndex > -1) {
						let dataItem = data[pIndex];
						const cIndex = dataItem.list.findIndex(s => s.store_id == super_store_id);
						if (cIndex > -1) {
							dataItem.list[cIndex].select = false;
							let isAllSelect = true;
							let isSelectPar = false;
							dataItem.list.forEach(v => {
								if (v.select) {
									!isSelectPar && (isSelectPar = true);
								} else {
									isAllSelect && (isAllSelect = false);
								}
							});
							dataItem.allSelect = isAllSelect;
							dataItem.selectPar = isSelectPar;
						}
					}
					const screeningPersonnel = {
						data: data
					};
					uni.setStorage({
						key: this.storeKeyName,
						data: JSON.stringify(screeningPersonnel),
						success: function() {
							console.log('添加缓存成功');
						}
					});
				}
				this.shopList.splice(index, 1);
			}catch(e){
				//TODO handle the exception
				console.log(e);
			}
			
		},

		// 处理店铺加入checked
		addcheckedFun(arr, val) {
			for (let i in arr) {
				for (let k in arr[i].business_category_list) {
					arr[i].business_category_list[k]['checked'] = val;
					arr[i].business_category_list[k]['supervisor'] = '';
					arr[i].business_category_list[k]['supervisor_name'] = '';
				}
			}
			return arr;
		},
		formateCurrentIndex(e, sn) {
			console.log(e);
			let index = Number(e.detail.value);
			switch (sn) {
				case 1:
					this.one_category_id = this.coloumOne[index].id;
					break;
				case 2:
					this.two_category_id = this.coloumTwo[index].id;
					break;
				case 3:
					this.three_category_id = this.coloumThree[index].id;
					break;
				case 4:
					this.four_category_id = this.coloumFour && this.coloumFour[index] && this.coloumFour[index].id;
					break;
				case 5:
					this.customer_type = this.coloumFour && this.storesClass[index] && this.storesClass[index].id;
					break;
				case 6:
					this.business_model = this.businessStyle && this.businessStyle[index] && this.businessStyle[index].id;
					break;
			}
		},

		//所属区域
		bindPickerChange3(e) {
			this.sale_org_id = this.find_store[e.detail.value].store_id;
			this.shopList = [];
			this.clearBrandCatrty();
		},

		//行政选择
		bindPickerChange1(e) {
			this.administrative = this.huaQuArr[e.detail.value].id;
		},
		//纳税类型
		ontaxpayerType(e) {
			this.taxpayer_type = this.taxpayer_list[e.detail.value].id;
		},

		//网点/门店等级
		bindPickerChange2(e) {
			this.store_level = this.sale_org[e.detail.value].id;
		},

		// 店铺下的品牌品类
		stopChang(index, sindex) {
			this.shopList[index].business_category_list[sindex].checked = !this.shopList[index].business_category_list[sindex].checked;
		},
		// 其他品类
		checkBoxpl(e) {
			this.otherBrand = e.detail.value;
		},

		// 触发选择地址
		selectCity(int) {
			if (this.popShow) {
				return;
			}
			if (this.administrative == null) {
				uni.showToast({
					title:'请先选择行政划区',
					icon:'none'
				})
			}
			this.selectCityType = int;
			this.popShow = true;
			this.$refs['inputting-adress'].open();
		},
		adMaskTask() {
			this.popShow = false;
		},
		//地区选择
		clickpop(obj) {
			this.adMaskTask();
			if (this.selectCityType == 1) {
				this.datas.area_id = obj.area_id;
				this.datas.area_name = obj.text;
			} else {
				this.datas.consignee_area = obj.area_id;
				this.consignee_area_name = obj.text;
			}
		},

		// 选择终端主管
		goarchivesScreen(index, sindex) {
			let item = this.shopList[index].business_category_list[sindex];
			//选择终端主管
			var _this = this;
			let l_store_id = _this.datas.sale_org_id;
			if (!l_store_id) {
				return uni.showToast({
					title:'请先选择所属地区',
					icon:'none'
				})
			}
			this.$eventHub.$on('screenLis', function(data) {
				item.supervisor_name = data.supervisor_name;
				item.supervisor = data.supervisor_id;

				//清除监听，不清除会消耗资源
				_this.$eventHub.$off('screenLis');
			});
			/**
			 * 多选
			 * */
			// this.$eventHub.$on('screenLis', function(data) {
			// 	if (Array.isArray(data) && data.length > 0) {
			// 		_this.supervisor_name = data.map(v => v.children_name).join(',');
			// 		_this.datas.supervisor_id = data.map(v => v.children_id).join(',');
			// 	}
			// 	//清除监听，不清除会消耗资源
			// 	_this.$eventHub.$off('screenLis');
			// });
			this.$myNavigateTo('/pages/archives-screen/archives-screen', { id: l_store_id });
		},
		/**
		 * @param {number} int 0==>提交  1==>保存
		 * */
		validmyRequest(int, reqData = {}) {
			let data = { ...this.datas };
			// 客户的id
			reqData.customer_apply_id = this.customer_apply_id;
			if (int) {
				let err;
				// 提交建档
				if (this.zsindex === 0) {
					err = [];
					let attachHeYi = this.cust_apply_attachs.slice(-1);
					attachHeYi.forEach(v => {
						if (test.isEmpty(v.url)) {
							err.push(v);
						}
					});
					if (err.length) {
						uni.showToast({
							title: `请提交${err[0].attach_name}附件`,
							icon: 'none',
							duration: 2000
						});

						return false;
					}
					reqData.cust_apply_attachs = attachHeYi.map(v => {
						return {
							type: v.type,
							url: v.url,
							attach_name: v.file_name
						};
					});
				} else if (this.zsindex === 1) {
					err = [];
					let attachSanZhen = this.cust_apply_attachs.slice(0, this.cust_apply_attachs.length - 1);
					attachSanZhen.forEach(v => {
						if (test.isEmpty(v.url)) {
							err.push(v);
						}
					});
					if (err.length) {
						uni.showToast({
							title: `请提交${err[0].attach_name}附件`,
							icon: 'none',
							duration: 2000
						});

						return false;
					}
					reqData.cust_apply_attachs = attachSanZhen.map(v => {
						return {
							type: v.type,
							url: v.url,
							attach_name: v.file_name
						};
					});
				}

				// 附件
				if (this.zsindex === 0) {
					// 统一社会信用代码
					reqData.snified_social_credit_code = data.snified_social_credit_code;
					// 单位名称
					reqData.company_name = data.company_name;
					// 银行账号
					reqData.bank_account = data.bank_account;
					// 开户行
					reqData.opening_bank = data.opening_bank;
				} else if (this.zsindex === 1) {
					reqData.taxpayer_number = data.taxpayer_number;
					// 营业执照编号
					reqData.business_license_number = data.business_license_number;
					// 组织机构代码
					reqData.organization_code = data.organization_code;
					// 发票抬头
					reqData.invoice_title = data.invoice_title;
					// 银行账号
					reqData.bank_account = data.bank_account;
					// 开户行
					reqData.opening_bank = data.opening_bank;
				}
				// 大渠道
				reqData.one_category_id = data.one_category_id;
				reqData.two_category_id = data.two_category_id;
				reqData.three_category_id = data.three_category_id;
				data.four_category_id !== null && (reqData.four_category_id = data.four_category_id);
				data.customer_type !== null && (reqData.customer_type = data.customer_type);
				data.business_model !== null && (reqData.business_model = data.business_model);
				// 所属于地区
				reqData.sale_org_id = data.sale_org_id;
				// 行政划区
				reqData.administrative = data.administrative;
				// 门店等级
				reqData.storeLevel = data.storeLevel;
				// 店铺
				reqData.business_categorys = this.formaArr1(this.shopList, { super_store_id: 'super_store' });
				// 其他品类
				if (this.otherBrand.length > 0) {
					reqData.other_category_id = this.otherBrand.join(',');
				}
				// 是否为主店
				if (data.is_main_store === 0 || data.is_main_store === 1) {
					reqData.is_main_store = data.is_main_store;
				}else{
					reqData.is_main_store = 0;
				}

				if (data.whetherSmallb === 0 || data.whetherSmallb === 1) {
					reqData.whetherSmallb = data.whetherSmallb;
				}
				// 门店名称
				reqData.customer_name = data.customer_name;
				// 商业单位
				data.business_name && (reqData.business_name = data.business_name);
				// 商业单位编码
				data.business_store_code && (reqData.business_store_code = data.business_store_code);
				// 联系人
				reqData.contacts = data.contacts;
				// 联系电话
				reqData.mobile = data.mobile;
				// 区级地址名称
				reqData.area_name = data.area_name;
				// 区级地址id
				reqData.area_id = data.area_id;
				// 详细地址
				reqData.address = data.address;
				// 门店所在地邮政编码
				reqData.location_code = data.location_code;
				// 门头照
				reqData.door_photo = data.door_photo;
				// 整体照
				reqData.shop_photo = data.shop_photo;
				// 冰洗区照
				reqData.ice_wash_photo = data.ice_wash_photo;
				// 空调区照片
				data.air_conditioning_photo && (reqData.air_conditioning_photo = data.air_conditioning_photo);
				// 电视区照
				data.television_photo && (reqData.television_photo = data.television_photo);
				// 厨电区照片
				data.kitchen_photo && (reqData.kitchen_photo = data.kitchen_photo);
				// 小区照
				data.small_area_photo && (reqData.small_area_photo = data.small_area_photo);
				// 纳税人类型
				reqData.taxpayer_type = data.taxpayer_type;
				// 财务联系人
				reqData.consignee_name = data.consignee_name;
				// 财务联系电话
				reqData.consignee_mobile = data.consignee_mobile;
				// 财务详细地址
				reqData.consignee_address = data.consignee_address;
				// 财务地址id
				reqData.consignee_area = data.consignee_area;
				reqData.is_submit = 1;
				reqData.is_active = 1;
			} else {
				// 保存建档
				if (this.zsindex === 0) {
					// 统一社会信用代码
					data.snified_social_credit_code && (reqData.snified_social_credit_code = data.snified_social_credit_code);
					data.company_name && (reqData.company_name = data.company_name);
					// 银行账号
					data.bank_account && (reqData.bank_account = data.bank_account);
					// 开户行
					data.opening_bank && (reqData.opening_bank = data.opening_bank);
					let attachHeYi = this.cust_apply_attachs.slice(-1);
					let tempHeYi = [];
					attachHeYi.forEach(v => {
						if (!test.isEmpty(v.url)) {
							tempHeYi.push({
								type: v.type,
								url: v.url,
								attach_name: v.file_name
							});
						}
					});
					tempHeYi.length && (reqData.cust_apply_attachs = tempHeYi);
				} else if (this.zsindex === 1) {
					let cust_applyarr = deepClone(this.cust_apply_attachs);
					cust_applyarr.pop();
					data.taxpayer_number && (reqData.taxpayer_number = data.taxpayer_number);
					// 营业执照编号
					data.business_license_number && (reqData.business_license_number = data.business_license_number);
					// 组织机构代码
					data.organization_code && (reqData.organization_code = data.organization_code);

					data.invoice_title && (reqData.invoice_title = data.invoice_title);
					// 发票抬头
					data.company_name && (reqData.company_name = data.company_name);
					// 银行账号
					data.bank_account && (reqData.bank_account = data.bank_account);
					// 开户行
					data.opening_bank && (reqData.opening_bank = data.opening_bank);
					let attachSanZhen = this.cust_apply_attachs.slice(0, this.cust_apply_attachs.length - 1);
					let tempSanZhen = [];
					attachSanZhen.forEach(v => {
						if (!test.isEmpty(v.url)) {
							tempSanZhen.push({
								type: v.type,
								url: v.url,
								attach_name: v.file_name
							});
						}
					});
					tempSanZhen.length && (reqData.cust_apply_attachs = tempSanZhen);
				}
				// 大渠道
				data.one_category_id && (reqData.one_category_id = data.one_category_id);
				data.two_category_id && (reqData.two_category_id = data.two_category_id);
				data.three_category_id && (reqData.three_category_id = data.three_category_id);
				data.four_category_id !== null && (reqData.four_category_id = data.four_category_id);
				data.customer_type !== null && (reqData.customer_type = data.customer_type);
				data.business_model !== null && (reqData.business_model = data.business_model);
				// 所属于地区
				data.sale_org_id && (reqData.sale_org_id = data.sale_org_id);
				// 行政划区
				data.administrative && (reqData.administrative = data.administrative);
				// 门店等级
				data.storeLevel && (reqData.storeLevel = data.storeLevel);
				// 店铺
				reqData.business_categorys = this.formaArr1(this.shopList, { super_store_id: 'super_store' });
				// 其他品类
				if (this.otherBrand.length > 0) {
					reqData.other_category_id = this.otherBrand.join(',');
				}

				// 是否为主店
				if (data.is_main_store === 0 || data.is_main_store === 1) {
					reqData.is_main_store = data.is_main_store;
				}else{
					reqData.is_main_store = 0;
				}
				if (data.whetherSmallb === 0 || data.whetherSmallb === 1) {
					reqData.whetherSmallb = data.whetherSmallb;
				}
				// 门店名称
				data.customer_name && (reqData.customer_name = data.customer_name);
				// 商业单位
				data.business_name && (reqData.business_name = data.business_name);
				// 商业单位编码
				data.business_store_code && (reqData.business_store_code = data.business_store_code);
				// 联系人
				data.contacts && (reqData.contacts = data.contacts);
				// 联系电话
				data.mobile && (reqData.mobile = data.mobile);
				// 区级地址名称
				data.area_name && (reqData.area_name = data.area_name);
				// 区级地址id
				data.area_id && (reqData.area_id = data.area_id);
				// 详细地址
				data.address && (reqData.address = data.address);
				// 门店所在地邮政编码
				data.location_code && (reqData.location_code = data.location_code);
				// 门头照
				data.door_photo && (reqData.door_photo = data.door_photo);
				// 整体照
				data.shop_photo && (reqData.shop_photo = data.shop_photo);
				// 冰洗区照
				data.ice_wash_photo && (reqData.ice_wash_photo = data.ice_wash_photo);
				// 空调区照片
				data.air_conditioning_photo && (reqData.air_conditioning_photo = data.air_conditioning_photo);
				// 电视区照
				data.television_photo && (reqData.television_photo = data.television_photo);
				// 厨电区照片
				data.kitchen_photo && (reqData.kitchen_photo = data.kitchen_photo);
				// 小区照
				data.small_area_photo && (reqData.small_area_photo = data.small_area_photo);
				// 纳税人类型
				data.taxpayer_type && (reqData.taxpayer_type = data.taxpayer_type);
				// 财务联系人
				data.consignee_name && (reqData.consignee_name = data.consignee_name);
				// 财务联系电话
				data.consignee_mobile && (reqData.consignee_mobile = data.consignee_mobile);
				// 财务详细地址
				data.consignee_address && (reqData.consignee_address = data.consignee_address);
				// 财务地址id
				data.consignee_area && (reqData.consignee_area = data.consignee_area);
				reqData.is_submit = 0; //0不提交
				reqData.is_active = 1;
			}

			return reqData;
		},

		//客户分类保存
		hold() {
			if (this.clearnTime) {
				clearTimeout(this.clearnTime);
			}
			this.clearnTime = setTimeout(() => {
				let data = this.validmyRequest(0);
				console.log(JSON.stringify(data, null, 4));
				if (data) {
					uni.showLoading({
						title: '保存中...',
						mask: true
					});

					this.holdpost(data, () => {
						setTimeout(function() {
							uni.redirectTo({
								url: '/pages/branch/branch'
							});
						}, 1500);
						uni.showToast({
							title:'保存成功',
							icon:'success'
						})
					});
				}
			}, 800);
		},

		//客户分类提交
		submit() {
			let isOk = true;
			utils.validate(this.datas, this.rules, (res, errors) => {
				if (!res) {
					isOk = false;
				}
			});
			if (!isOk) return;
			if (this.clearnTime) {
				clearTimeout(this.clearnTime);
			}
			this.clearnTime = setTimeout(() => {
				let data = this.validmyRequest(1);
				console.log(JSON.stringify(data, null, 4));
				if (data) {
					uni.showLoading({
						title: '提交中...',
						mask: true
					});
					this.holdpost(data, () => {
						setTimeout(function() {
							uni.redirectTo({
								url: '/pages/branch/branch'
							});
						}, 1500);
						uni.showToast({
							title:'提交成功',
							icon:'success'
						})
					});
				}
			}, 800);
		},
		holdpost(data, callback = false) {
			this.$myRequest({
				url: this.$myhttpUrl.customerApply_update,
				data: data,
				success: res => {
					if (typeof callback == 'function') {
						callback();
					}
				},
				fail: err => {
					uni.showToast({
						title:'提交失败',
						icon:'none'
					})
					throw err;
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},

		formaArr1(arr, obja = {}) {
			let newarr = [];
			arr.forEach(v => {
				let tempobj = {};
				for (let key in v) {
					if (key in obja) {
						tempobj[obja[key]] = v[key];
					} else {
						tempobj[key] = v[key];
					}
					if (Array.isArray(tempobj[key]) && tempobj[key].length > 0) {
						let ass = [];
						tempobj[key].forEach(s => {
							if ('checked' in s && s.checked) {
								ass.push({
									business_category_id: s.business_category_id,
									business_category_name: s.business_category_name,
									supervisor_id: s.supervisor
								});
							}
						});
						tempobj[key] = ass;
					}
				}
				newarr.push(tempobj);
			});
			return newarr;
		},
		// 点击切换栏
		tapTabBar(index) {
			if (this.tabIndex == index) {
				return;
			}
			this.tabIndex = index;
		},
		// 滑动swiper-item
		swiperChange(e) {
			this.tabIndex = e.detail.current;
		},
		// 切换是否未主店
		radioChange(e) {
			let trimVal = e.detail.value.trim();
			if (trimVal === '') {
				return (this.datas.is_main_store = trimVal);
			}
			this.datas.is_main_store = Number(trimVal);
		},
		// 切换是否为惠分销分店
		isWhetherSmallbRadio(e) {
			this.datas.whetherSmallb = Number(e.detail.value);
		},
		// 点击下一步
		next() {
			this.tabIndex++;
		}
	}
};
</script>

<style lang="scss">
@import '@/common/css/jiandang.scss';
page {
	width: 100%;
	height: 100%;
}
.l-form-item{border-bottom: 1rpx solid #eee;width: 750rpx;height: 88rpx;box-sizing: border-box;padding: 20rpx 16rpx 20rpx 36rpx;display: flex;align-items: center;
	 .l-item-label{
		 font-size: 30rpx;min-width: 130rpx;padding-right: 40rpx; flex-shrink: 0;
		 color: #333333;
		  &::before{
			  content:attr(data-info);
			  width:18rpx;
			  display:inline-block;
			  text-align:center;
			  vertical-align: middle;
			  color: #FF0000;
		  }
		}
	 .l-item-value{
		 flex: 1; color: #CCCCCC;font-size: 28rpx;text-align: right; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;
		}
	.l-item-arrow{
			width: 36rpx;flex-shrink: 0;text-align: right;font-size: 36rpx; color: #CCCCCC;
		}
 }
.a-center-child {
	height: 66rpx;
	line-height: 66rpx;
	width: 240rpx;
	font-size: 22rpx;
	text-align: center;
	background-color: #f2f2f2;
}

.a-center-child-l {
	background-color: #fdc100;
	color: #ffffff;
}
</style>
