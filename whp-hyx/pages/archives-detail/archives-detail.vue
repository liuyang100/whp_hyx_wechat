<template>
	<view class="w-100 position-relative">
		<evan-form class="evan-form-show " :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="datas">
			<evan-form-item label="审核状态" class="evan-form-item"><input disabled style="color: #fdc100;" class="form-input" :value="apply_state_name" /></evan-form-item>
			<evan-form-item label="客户分类" :labelStyle="{ color: '#fdc100' }" class="evan-form-item"></evan-form-item>
			<!-- 客户分类 -->
			<uni-section title="渠道类型" marginTop="0px" type="square" bgColor="#40CCFF"></uni-section>
			<!-- 大渠道 -->
			<evan-form-item label="大渠道" class="evan-form-item" show_jiantou prop="one_category_id">
				<picker
					mode="selector"
					:disabled="!isedit"
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
					:disabled="!isedit"
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
					:disabled="!isedit"
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
					:disabled="!isedit"
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
					disabled
					mode="selector"
					:disabled="!isedit"
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
					:disabled="!isedit"
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
			<uni-section title="客户分类" marginTop="0px" type="square" bgColor="#00EADD"></uni-section>
			<!-- 所属区域 -->
			<evan-form-item label="所属地区" class="evan-form-item" show_jiantou prop="sale_org_id" @click="getStoreData()">
				<picker mode="selector" :disabled="!isedit" class="picker" @change="bindPickerChange3" :value="index3" :range="find_store" range-key="name">
					<input disabled class="form-input" placeholder-style="font-size: 28rpx;color:#ccc;" :value="find_store[index3].name" placeholder="请选择所属地区" />
				</picker>
			</evan-form-item>
			<!-- END 所属区域 -->
			<!-- 行政划区 -->
			<evan-form-item label="行政划区" class="evan-form-item" show_jiantou prop="administrative">
				<picker mode="selector" :disabled="!isedit" class="picker" @change="bindPickerChange1" :value="index1" :range="huaQuArr" range-key="name">
					<input
						disabled
						class="form-input"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						:value="huaQuArr[index1].name || administrative_name"
						placeholder="请选择行政划区"
					/>
				</picker>
			</evan-form-item>
			<!-- end 行政划区 -->

			<!-- 网点/门店等级 -->
			<evan-form-item label="网点/门店等级" class="evan-form-item" show_jiantou prop="storeLevel">
				<picker mode="selector" :disabled="!isedit" class="picker" @change="bindPickerChange2" :value="index2" :range="sale_org" range-key="name">
					<input disabled class="form-input" placeholder-style="font-size: 28rpx;color:#ccc;" :value="sale_org[index2].name" placeholder="请选择网点/门店等级" />
				</picker>
			</evan-form-item>
			<!-- end 网点/门店等级 -->

			<!-- 上级店铺 -->
			<view>
				<view class="l-form-item" @click="gofindStores">
					<view class="l-item-label" data-info=" ">上级店铺</view>
					<view class="l-item-value" :style="{ color: stop_name_str ? '#666' : '#ccc' }">{{ stop_name_str || '请选择上级店铺' }}</view>
					<view class="iconfont l-item-arrow">&#xe770;</view>
				</view>
				<block v-for="(item, index) in shopList" :key="item.super_store_id">
					<shop-brand :item="item" :index="index" :disabled="!isedit" @stopChang="stopChang" @goarchivesScreen="goarchivesScreen" @deleteStop="deleteStop"></shop-brand>
				</block>
			</view>
			<!-- 导购信息 -->
			<uni-section title="导购信息" marginTop="0px" type="square" bgColor="#FD9D14"></uni-section>
			<view class="shop-list" v-if="guideInfos.length">
				<view class="text-title d-flex" style="font-weight: bold;color: #333333;border-bottom: 1rpx solid #666666;">
					<view class="header" :style="{ flex: business_width }">导购员联系人</view>
					<view class="header" :style="{ flex: business_width }">兼职/专职</view>
					<view class="header" :style="{ flex: business_width }">联系电话</view>
				</view>
				<view class="d-flex" v-for="item in guideInfos" :key="item.guideMobile">
					<view class="header" :style="{ flex: business_width }">{{ item.guideName }}</view>
					<view class="header" :style="{ flex: business_width }">{{item.workType}}</view>
					<view class="header" :style="{ flex: business_width }">{{ item.guideMobile }}</view>
				</view>
			</view>
			<!-- 其他的品类 -->
			<view>
				<uni-section title="其他品类(多选)" marginTop="0px" type="square" bgColor="#00EADD"></uni-section>
				<template v-if="!isedit">
					<evan-form-item label="其他品类" class="evan-form-item" v-if="systemDict_detail_name">
						<input disabled type="text" class="form-input mynowarp" v-model="systemDict_detail_name" />
					</evan-form-item>
				</template>
				<template v-else>
					<view class="shop-list">
						<checkbox-group @change="checkBoxpl" class="redio-list">
							<view class="rlabel" v-for="(c, i) in systemDict" :key="c.id">
								<checkbox color="#fdc100" :value="c.id" style="transform: scale(0.6);" :checked="c.checked" />
								<text>{{ c.value }}</text>
							</view>
						</checkbox-group>
					</view>
				</template>
			</view>

			<view class="w-100 d-flex a-center reletion-store">
				<view class="dot"></view>
				<view class="name">客户多门店关联</view>
				<view class="sub-name mx-2">(非多门店可不勾选)</view>
			</view>
			<template>
				<template v-if="isedit">
					<view class="isShopkeeper d-flex j-sb a-center">
						<text>是否为主店</text>
						<view class="d-flex a-center flex-1 j-end">
							<radio-group @change="radioChange" class="isShopkeeperpro" v-model="datas.is_main_store">
								<view class="isShopkeeperlis">
									<text>是</text>
									<checkbox color="#fdc100" :value="1" :checked="datas.is_main_store === 1" style="transform: scale(0.7);" />
								</view>
								<view class="isShopkeeperlis">
									<text>否</text>
									<checkbox color="#fdc100" :value="0" :checked="datas.is_main_store === 0" style="transform: scale(0.7);" />
								</view>
							</radio-group>
						</view>
					</view>
				</template>
				<template v-else>
					<evan-form-item label="是否为主店" class="evan-form-item" v-if="datas.is_main_store === 1 || datas.is_main_store === 0">
						<input type="text" class="form-input mynowarp" :value="datas.is_main_store === 1 ? '是' : datas.is_main_store === 0 ? '否' : ''" disabled />
					</evan-form-item>
				</template>
			</template>
			<template>
				<view class="isShopkeeper d-flex j-sb a-center" v-if="isedit">
					<text class="reqired">是否为惠分销门店</text>
					<view class="d-flex a-center flex-1 j-end">
						<radio-group @change="isWhetherSmallbRadio" class="isShopkeeperpro">
							<view class="isShopkeeperlis">
								<text>是</text>
								<checkbox color="#fdc100" :value="1" :checked="datas.whetherSmallb === 1" style="transform: scale(0.7);" />
							</view>
							<view class="isShopkeeperlis">
								<text>否</text>
								<checkbox color="#fdc100" :value="0" :checked="datas.whetherSmallb === 0" style="transform: scale(0.7);" />
							</view>
						</radio-group>
					</view>
				</view>
				<evan-form-item label="是否为惠分销门店" class="evan-form-item" v-else>
					<input type="text" class="form-input mynowarp" :value="datas.whetherSmallb === 1 ? '是' : datas.whetherSmallb === 0 ? '否' : ''" disabled />
				</evan-form-item>
			</template>

			<!-- 基本信息 -->
			<uni-section title="基本信息" marginTop="0px" type="square" bgColor="#FFCD00"></uni-section>
			<evan-form-item label="门店名称" class="evan-form-item" prop="customer_name">
				<input
					:disabled="!isedit"
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
					:disabled="!isedit"
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
					:disabled="!isedit"
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
					:disabled="!isedit"
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
					:disabled="!isedit"
					type="number"
					confirm-type="确定"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.mobile"
					placeholder="请填写联系电话"
				/>
			</evan-form-item>

			<evan-form-item label="地址" class="evan-form-item" show_jiantou prop="area_name">
				<input disabled class="form-input mynowarp" @click="selectCity(1)" placeholder-style="font-size: 28rpx;color:#ccc;" :value="datas.area_name" placeholder="请选择" />
			</evan-form-item>

			<evan-form-item label="详细地址" class="evan-form-item" prop="address">
				<input
					:disabled="!isedit"
					type="text"
					confirm-type="确定"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.address"
					placeholder="请填写详细地址"
				/>
			</evan-form-item>

			<evan-form-item label="门店所在地邮政编码" class="evan-form-item" prop="location_code">
				<input
					:disabled="!isedit"
					type="number"
					confirm-type="确定"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.location_code"
					placeholder="请填写门店所在地邮政编码"
				/>
			</evan-form-item>
			<evan-form-item label="业务员" class="evan-form-item" show_jiantou><input type="text" disabled class="form-input mynowarp" :value="loginInfo.name" /></evan-form-item>
			<uni-section title="上传图片" marginTop="0px" type="square" bgColor="#FD9D14"></uni-section>
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
			<!-- 财务信息 -->

			<uni-section title="财务信息" marginTop="0px" type="square" bgColor="#178EF6"></uni-section>

			<!-- 三证合一 -->
			<view class="form" v-if="zsindex === 0">
				<evan-form-item label="统一社会信用代码" class="evan-form-item" prop="snified_social_credit_code">
					<input
						:disabled="!isedit"
						type="text"
						confirm-type="确定"
						class="form-input mynowarp"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						v-model="datas.snified_social_credit_code"
						placeholder="请填写18位字符统一社会信用代码"
					/>
				</evan-form-item>
				<evan-form-item label="单位名称" class="evan-form-item" prop="company_name">
					<input
						type="text"
						:disabled="!isedit"
						confirm-type="确定"
						class="form-input mynowarp"
						v-model="datas.company_name"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						placeholder="请填写单位名称"
					/>
				</evan-form-item>
				<evan-form-item label="银行账号" class="evan-form-item" prop="bank_account">
					<input
						:disabled="!isedit"
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
						:disabled="!isedit"
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
						:disabled="!isedit"
						type="text"
						confirm-type="确定"
						class="form-input mynowarp"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						v-model="datas.business_license_number"
						placeholder="请填写营业执照编码"
					/>
				</evan-form-item>
				<evan-form-item label="组织机构代码" class="evan-form-item" prop="invoice_title">
					<input
						:disabled="!isedit"
						type="text"
						confirm-type="确定"
						class="form-input mynowarp"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						v-model="datas.organization_code"
						placeholder="请填写组织机构代码"
					/>
				</evan-form-item>

				<evan-form-item label="纳税人识别号" class="evan-form-item" prop="invoice_title">
					<input
						:disabled="!isedit"
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
						:disabled="!isedit"
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
						:disabled="!isedit"
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
								<view v-if="!item.url" class="iconfont icon-hao upload_item_content_haost"></view>
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
			<uni-section title="纳税人类型" marginTop="0px" type="square" bgColor="#40CCFF"></uni-section>

			<evan-form-item label="纳税人类型" class="evan-form-item" show_jiantou prop="taxpayer_type">
				<picker mode="selector" :disabled="!isedit" class="picker" @change="ontaxpayerType" :range="taxpayer_list" range-key="name">
					<input
						disabled
						class="form-input"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						:value="taxpayerindex !== null ? taxpayer_list[taxpayerindex].name : ''"
						placeholder="请选择纳税人类型"
					/>
				</picker>
			</evan-form-item>

			<uni-section title="发票寄送地址" marginTop="0px" type="square" bgColor="#40CCFF"></uni-section>

			<evan-form-item label="联系人" class="evan-form-item" prop="consignee_name">
				<input
					:disabled="!isedit"
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
					:disabled="!isedit"
					type="number"
					confirm-type="确定"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.consignee_mobile"
					placeholder="请填写联系电话"
				/>
			</evan-form-item>

			<evan-form-item label="地址" class="evan-form-item" show_jiantou prop="consignee_area">
				<input
					disabled
					@click="selectCity(2)"
					type="text"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					:value="consignee_area_name"
					placeholder="请选择"
				/>
			</evan-form-item>

			<evan-form-item label="详细地址" class="evan-form-item" prop="consignee_address">
				<input
					:disabled="!isedit"
					type="text"
					confirm-type="确定"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.consignee_address"
					placeholder="请填写详细地址"
				/>
			</evan-form-item>
			<view class="bctj-btn" v-if="pagseType === 0">
				<button type="warn" class=" button" size="mini" @click="submit">保存</button>
				<!-- <button type="primary" class=" button" size="mini" @click="submit(1)">提交</button> -->
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
import inputtingAdress from '@/components/inputtingAdress/inputtingAdress.vue';
import uniSection from '@/components/uni/uni-section/uni-section.vue';
import shopBrand from '@/components/common/shop-brand/shop-brand.vue';
import utils from '@/components/evan-form/utils.js';
import { mapState, mapActions } from 'vuex';
import test from '@/ulits/function/test.js';
import { deepClone } from '@/ulits/Validation.js';
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
			clearnTime: null,
			isedit: false, // 是否编辑
			hideRequiredAsterisk: false, //表单验证
			zsindex: 0,
			oneIndex: null, //大渠道选择
			twoIndex: null, //小渠道选择
			threeIndex: null, //一级门店
			fourIndex: null, //二级门店
			index1: null, //行政划区
			administrative_name: '',
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
			index3: null, //获取所属区域
			stop_id_str: '', //选中店铺的id
			guideInfos: [], // 导购信息
			selete_stop: [], // 选中店铺
			shopList: [], //上级店铺下品牌品类(赋值和shoplist一样格式)
			systemDict: [],
			taxpayerindex: null, //纳税人类型
			selectCityType: 1, // 1选择基本信息地址 2财务信息地址
			popShow: false, // 是否打开地址选择模块框
			supervisor_name: '', //终端主管名称
			systemDict_detail_name: '', // 其他品牌
			consignee_area_name: '', //财务地址
			apply_state_name: '', //审核的状态
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
				three_category_id: null,
				four_category_id: null, // 门店二级类型
				business_model: null, //门店分类
				customer_type: null, // 经营的方式
				sale_org_id: null, // 所属区域
				storeLevel: null, //门店等级
				administrative: null, // 行政等级
				is_main_store: '', // 是否主店
				whetherSmallb: null,
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
				organization_code: '', //组织机构代码
				taxpayer_number: '', //纳税人识别号
				company_name: '', //发票信息-单位名称
				invoice_title: '', //发票信息-发票抬头
				taxpayer_type: null, // 纳税人类型id
				consignee_name: '', //财务联系人
				consignee_mobile: '', //财务联系电话
				consignee_area: null, //财务地址id
				consignee_address: '', //财务详细地址
				customer_apply_id: null // 获取详情的客户id
			},
			is_active: null, // 获取详情的参数 是否合作
			pagseType: null,
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
				whetherSmallb: {
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
							if (value.length !== 0) {
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
		try {
			option = this.$formateOption(option);
			console.log('页面传递的参数', option);
			this.is_active = option.is_active;
			this.pagseType = option.apply_stat;
			this.datas.customer_apply_id = option.customer_apply_id;
			if (this.pagseType === 0) {
				this.isedit = true;
			} else {
				this.isedit = false;
			}
			this.__init();
		} catch (e) {
			uni.showToast({
				title: '初始化参数失败',
				icon: 'none'
			});
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

		// 所属区域
		sale_org_id: {
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

		// 门店等级
		store_level: {
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
		// 行政等级
		administrative: {
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
		// 纳税人类型id
		taxpayer_type: {
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
			if (!this.isedit) return;
			let { file_info, message, type } = await this.$upImage(index);
			this.cust_apply_attachs[type].url = file_info.url;
			this.cust_apply_attachs[type].file_name = file_info.name;
		},
		// 上传图片
		async chooseImage(ins) {
			if (!this.isedit) return;
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
			let res1, res2, res3, resdata;
			try {
				// 渠道
				res1 = await this.getQuDaoData();
				// 所属地区
				res2 = await this.getStoreData();
				//获取其他品类
				res3 = await this.OtherClass();
				res3 = res3.map(v => {
					return {
						...v,
						checked: false
					};
				});
				this.systemDict = res3;
				// 获取详情数
				resdata = await this.getDetailData();
				if (resdata) {
					this.orgData(resdata);
				}
			} catch (error) {
				uni.showToast({
					title: '请求失败',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
		},
		// 获取详情数据
		getDetailData() {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.customerApply_select,
					data: {
						customer_apply_id: this.datas.customer_apply_id,
						is_active: 0
					},
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						reject(err.message);
					}
				});
			});
		},
		// 详情赋值

		/**
		 * 选择我的店铺事件
		 * 注意店铺在所属地区的店铺,拿到当前所属地区的id
		 * store_id  当前选中所属区域
		 */
		gofindStores() {
			if (!this.isedit) return;
			let l_store_id = this.datas.sale_org_id;
			if (!l_store_id) {
				return uni.showToast({
					title: '选择店铺之前,必须选选择所属地区',
					icon: 'none'
				});
			}
			this.$eventHub.$on('findStoredata', data => {
				let { store_id = [], valueName } = data;
				let tempShopList = this.shopList;
				let filterStoreId = [];
				let oldArr = []; // 依然存在
				tempShopList.forEach((v, p) => {
					const super_store_id = v.super_store_id;
					store_id.forEach((s, k) => {
						if (super_store_id == s) {
							store_id.splice(k, 1);
							oldArr.push(v);
						}
					});
				});
				this.shopList = oldArr;
				filterStoreId = store_id;
				// 处理已经存在的id， 没必要重复请求
				if (filterStoreId.length > 0) {
					filterStoreId = filterStoreId.join(',');
					this.getFindStoreClass(filterStoreId);
				}
				//清除监听，不清除会消耗资源
				this.$eventHub.$off('findStoredata');
			});
			this.$myNavigateTo('/pages/findStore/findStore', {
				id: l_store_id
			});
		},

		// 获取店铺的品牌品类
		getFindStoreClass(stop_id_str, val = false) {
			var data = { store_ids: stop_id_str };
			this.datas.customer_apply_id && val && (data.customer_apply_id = this.datas.customer_apply_id);
			this.$myRequest({
				url: this.$myhttpUrl.brandCategoryList,
				data: data,
				success: res => {
					let list = this.shopList;
					let datas = this.addcheckedFun(res.data, false) || [];
					// 存储店铺名称
					this.shopList = list.concat(datas);
				},
				fail: err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},

		//点击删除店铺下的品牌品类
		deleteStop(index) {
			try {
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
			} catch (e) {
				//TODO handle the exception
				console.log(e);
			}
		},
		/**
		 * 处理店铺加入checked
		 * val [ture|false] true是赋值操作   false 初始化操作
		 * */

		addcheckedFun(arr, val) {
			for (let i in arr) {
				for (let k in arr[i].business_category_list) {
					if (val) {
						if (arr[i].business_category_list[k].hasOwnProperty('seletced')) {
							arr[i].business_category_list[k]['checked'] = arr[i].business_category_list[k].seletced ? true : false;
						} else {
							// 这个做如果没有返回seleceed 默认没有选中
							arr[i].business_category_list[k]['checked'] = false;
						}
					} else {
						arr[i].business_category_list[k]['checked'] = val;
					}

					arr[i].business_category_list[k]['supervisor'] = val ? arr[i].business_category_list[k]['supervisor'] : '';
					arr[i].business_category_list[k]['supervisor_name'] = val ? arr[i].business_category_list[k]['supervisor_name'] : '';
				}
			}
			return arr;
		},

		assignCheckedFun(arr, val) {
			for (let i in arr) {
				for (let k in arr[i].business_category_list) {
					arr[i].business_category_list[k]['checked'] = val;
					arr[i].business_category_list[k]['supervisor'] = val ? arr[i].business_category_list[k]['supervisor'] : '';
					arr[i].business_category_list[k]['supervisor_name'] = val ? arr[i].business_category_list[k]['supervisor_name'] : '';
				}
			}
			return arr;
		},

		formateCurrentIndex(e, sn) {
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
		//所属区域
		bindPickerChange3(e) {
			this.sale_org_id = this.find_store[e.detail.value].store_id;
			this.shopList = [];
			this.clearBrandCatrty();
		},

		// 店铺下的品牌品类
		stopChang(index, sindex) {
			if (!this.isedit) return;
			this.shopList[index].business_category_list[sindex].checked = !this.shopList[index].business_category_list[sindex].checked;
		},
		// 其他品类
		checkBoxpl(e) {
			const values = e.detail.value.map(Number);
			this.rendersystemDict(values);
		},

		// 触发选择地址
		selectCity(int) {
			// 是否可以编辑
			if (!this.isedit) return;
			if (this.popShow) {
				return;
			}
			if (this.administrative == null) {
				return uni.showToast({
					title: '请先选择行政划区',
					icon: 'none'
				});
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
			if (!this.isedit) return;
			var _this = this;
			//选择终端主管
			let l_store_id = _this.datas.sale_org_id;
			if (!l_store_id) {
				return uni.showToast({
					title: '请先选择所属地区',
					icon: 'none'
				});
			}
			let item = this.shopList[index].business_category_list[sindex];
			this.$eventHub.$on('screenLis', function(data) {
				item.supervisor_name = data.supervisor_name;
				item.supervisor = data.supervisor_id;
				//清除监听，不清除会消耗资源
				_this.$eventHub.$off('screenLis');
			});
			this.$myNavigateTo('/pages/archives-screen/archives-screen', { id: l_store_id });
		},
		// 渲染其他品牌
		rendersystemDict(strIds) {
			/*
			 systemDict:[
				 {
					 id:1,
					 value:"惠而浦空调",
					 checked:false
				 }
			 ]
			 */
			const other_catarr = strIds;
			const systemDict = this.systemDict;
			const tempSystemDict = systemDict.map(v => {
				const isHasIncludes = other_catarr.includes(v.id);
				return {
					...v,
					checked: isHasIncludes
				};
			});
			this.systemDict = tempSystemDict;
			this.systemDict_detail_name = this.getSystemDictKeyValue(tempSystemDict, 'value', ';');
		},

		/**
		 * 数组带分割符号的的字符串转为数字数组
		 * @param {String}   strs   要处理原字符串
		 * @param {Object}  options    配置参数
		 * @param {String} options.hasSymbol  获取数据分割的符号
		 * return {Array}
		 * */
		stringToNumberArray(strs, options) {
			const { hasSymbol } = options;
			if (typeof hasSymbol === 'string' && hasSymbol) {
				let ids = [];
				const isHas = strs.includes(hasSymbol);
				if (isHas) {
					ids = strs.split(hasSymbol).filter(v => {
						if (isNaN(parseInt(v))) {
							return false;
						} else {
							return true;
						}
					});
					ids = ids.map(Number);
				}
				return ids;
			}
		},
		/**
		 * @param {Array}  listArr  原数据
		 * @param {String}   keyname   要获取过滤掉check === true ,满足条件的keyname值
		 * @param {Array}  symbol  获取数据分割的符号
		 * return {String}
		 * */
		getSystemDictKeyValue(listArr, keyname, symbol = false) {
			let vaueStr = listArr.filter(v => v.checked).map(v => v[keyname]);
			if (symbol === false) {
				return vaueStr;
			}
			return (vaueStr = vaueStr.join(symbol));
		},

		// 数据做赋值渲染
		orgData(resdata) {
			console.log(JSON.stringify(resdata, null, 4));
			try {
				this.apply_state_name = resdata.apply_state_name; // 审核状态
				// 大渠道
				resdata.one_category_id && (this.one_category_id = resdata.one_category_id);
				// 小渠道
				resdata.two_category_id && (this.two_category_id = resdata.two_category_id);
				resdata.three_category_id && (this.three_category_id = resdata.three_category_id);
				resdata.four_category_id && (this.four_category_id = resdata.four_category_id);
				resdata.customer_type && (this.customer_type = resdata.customer_type);
				resdata.business_model && (this.business_model = resdata.business_model);
				// 所属区域
				resdata.sale_org_id && (this.sale_org_id = resdata.sale_org_id);
				// 网点等级
				resdata.store_level && (this.store_level = resdata.store_level);
				// 行政区域
				resdata.administrative && (this.administrative = resdata.administrative);
				this.guideInfos = guideInfos || [];
				// 上级店铺
				if (resdata.stores && resdata.stores.length) {
					// 品牌的id
					this.stop_id_str = resdata.stores.map(v => v.super_store_id).join(',');
					// 品牌品类
					this.selete_stop = resdata.stores.map(v => {
						return {
							store_id: v.super_store_id,
							name: v.super_store_name,
							business_category_list: v.business_category_list
						};
					});
					// 获取新的店铺信息
					if (this.pagseType === 0) {
						this.stop_id_str = resdata.stores.map(v => v.super_store_id).join(',');
						this.getFindStoreClass(this.stop_id_str, true);
					} else {
						this.shopList = this.assignCheckedFun(resdata.stores, true);
					}
				}
				// 其他品类
				if (resdata.other_category_id) {
					const ids = this.stringToNumberArray(resdata.other_category_id, {
						hasSymbol: ','
					});
					this.rendersystemDict(ids);
					// 根据其他品牌的id,找出品牌name值
				}
				if (resdata.is_main_store === 0 || resdata.is_main_store === 1) {
					this.datas.is_main_store = resdata.is_main_store;
				}

				if (resdata.whetherSmallb === 0 || resdata.whetherSmallb === 1) {
					this.datas.whetherSmallb = resdata.whetherSmallb;
				}

				// 基本信息
				resdata.customer_name && (this.datas.customer_name = resdata.customer_name);
				resdata.business_name && (this.datas.business_name = resdata.business_name);
				resdata.business_store_code && (this.datas.business_store_code = resdata.business_store_code);
				resdata.contacts && (this.datas.contacts = resdata.contacts);
				resdata.mobile && (this.datas.mobile = resdata.mobile);
				resdata.area_name && (this.datas.area_name = resdata.area_name);
				resdata.area_id && (this.datas.area_id = resdata.area_id);
				resdata.address && (this.datas.address = resdata.address);
				resdata.location_code && (this.datas.location_code = resdata.location_code);
				// 主管名称
				resdata.supervisor_name && (this.supervisor_name = resdata.supervisor_name);
				// 门头照
				resdata.door_photo && (this.datas.door_photo = resdata.door_photo);
				// 整体照
				resdata.shop_photo && (this.datas.shop_photo = resdata.shop_photo);
				// 冰洗照
				resdata.ice_wash_photo && (this.datas.ice_wash_photo = resdata.ice_wash_photo);
				// 空调区照
				resdata.air_conditioning_photo && (this.datas.air_conditioning_photo = resdata.air_conditioning_photo);
				// 电视区照
				resdata.television_photo && (this.datas.television_photo = resdata.television_photo);
				// 厨电区照
				resdata.kitchen_photo && (this.datas.kitchen_photo = resdata.kitchen_photo);
				// 小区照
				resdata.small_area_photo && (this.datas.small_area_photo = resdata.small_area_photo);
				// 三证合一
				if (test.isEmpty(resdata.taxpayer_number)) {
					this.zsindex = 0;
					// 统一社会信用代码
					resdata.snified_social_credit_code && (this.datas.snified_social_credit_code = resdata.snified_social_credit_code);
					resdata.company_name && (this.datas.company_name = resdata.company_name);
				} else {
					this.zsindex = 1;
					// 营业执照编码
					resdata.business_license_number && (this.datas.business_license_number = resdata.business_license_number);
					// 组织机构代码
					resdata.organization_code && (this.datas.organization_code = resdata.organization_code);
					// 纳税人识别号
					resdata.taxpayer_number && (this.datas.taxpayer_number = resdata.taxpayer_number);
					resdata.invoice_title && (this.datas.invoice_title = resdata.invoice_title);
				}
				// 附件
				if (resdata.cust_apply_attachs && resdata.cust_apply_attachs.length) {
					for (let i = 0; i < resdata.cust_apply_attachs.length; i++) {
						this.cust_apply_attachs.forEach(v => {
							if (resdata.cust_apply_attachs[i].type == v.type && resdata.cust_apply_attachs[i].url) {
								v.url = resdata.cust_apply_attachs[i].url;
								v.file_name = resdata.cust_apply_attachs[i].attach_name;
							}
						});
					}
				}

				// 银行账号
				resdata.bank_account && (this.datas.bank_account = resdata.bank_account);
				// 开户行
				resdata.opening_bank && (this.datas.opening_bank = resdata.opening_bank);
				// 纳税人类型
				resdata.taxpayer_type && (this.taxpayer_type = +resdata.taxpayer_type);

				// 财务联系人
				resdata.consignee_name && (this.datas.consignee_name = resdata.consignee_name);
				// 财务联系电话
				resdata.consignee_mobile && (this.datas.consignee_mobile = resdata.consignee_mobile);
				// 财务地址
				resdata.consignee_area_name && (this.consignee_area_name = resdata.consignee_area_name);
				// 财务地址id
				resdata.consignee_area_id && (this.datas.consignee_area = resdata.consignee_area_id);
				// 财务详细地址
				resdata.consignee_address && (this.datas.consignee_address = resdata.consignee_address);
			} catch (e) {
				//TODO handle the exception
				console.log(e);
			}
		},

		// 提交数据校验
		validmyRequest(int, reqData = {}) {
			let data = { ...this.datas };
			reqData.customer_apply_id = data.customer_apply_id;

			// this.zsindex ： 判断用户提交使用三证合一 || 还是三证  [0 => 三证合一，   1 => 三证]
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
			data.one_category_id !== null && (reqData.one_category_id = data.one_category_id);
			data.two_category_id !== null && (reqData.two_category_id = data.two_category_id);
			data.three_category_id !== null && (reqData.three_category_id = data.three_category_id);
			data.four_category_id !== null && (reqData.four_category_id = data.four_category_id);
			data.customer_type !== null && (reqData.customer_type = data.customer_type);
			data.business_model !== null && (reqData.business_model = data.business_model);
			// 所属于地区
			data.sale_org_id !== null && (reqData.sale_org_id = data.sale_org_id);
			// 行政划区
			data.administrative !== null && (reqData.administrative = data.administrative);
			// 门店等级
			data.storeLevel !== null && (reqData.storeLevel = data.storeLevel);
			// 店铺
			if (this.shopList.length > 0) {
				reqData.business_categorys = this.formaArr1(this.shopList, { super_store_id: 'super_store' });
			}

			// 其他品类
			const tempOtherCategoryId = this.getSystemDictKeyValue(this.systemDict, 'id', ',');
			if (tempOtherCategoryId) {
				reqData.other_category_id = tempOtherCategoryId;
			}

			// 是否为主店
			if (data.is_main_store === 0 || data.is_main_store === 1) {
				reqData.is_main_store = data.is_main_store;
			} else {
				reqData.is_main_store = 0;
			}
			// 是否为惠分销门店
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
			// data.area_name && (reqData.area_name = data.area_name);
			// 区级地址id
			data.area_id !== null && (reqData.area_id = data.area_id);
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
			return reqData;
		},

		//客户分类提交
		submit(ins) {
			const that = this;
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
				let data = this.validmyRequest();

				if (data) {
					let pages = getCurrentPages();
					let beforePage = pages[pages.length - 2];
					uni.showLoading({
						title: '保存中...',
						mask: true
					});
					this.$myRequest({
						url: this.$myhttpUrl.customerApply_update,
						data: data,
						success: res => {
							setTimeout(function() {
								uni.navigateBack({
									success() {
										beforePage.onLoad();
									}
								});
							}, 1500);
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							});
						},
						fail: err => {
							uni.showToast({
								title: '保存失败',
								icon: 'none'
							});
						},
						complete: () => {
							uni.hideLoading();
						}
					});
				}
			}, 800);
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
					if (v.hasOwnProperty('seletced')) {
						delete v.seletced;
					}
					if (Array.isArray(tempobj[key]) && tempobj[key].length > 0) {
						let ass = [];
						tempobj[key].forEach(s => {
							if ('checked' in s && s.checked) {
								ass.push({
									business_category_id: s.business_category_id,
									business_category_name: s.business_category_name,
									supervisor_id: s.supervisor || ''
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
		// 切换是否未主店
		radioChange(e) {
			this.datas.is_main_store = Number(e.detail.value);
		},
		// 切换是否为惠分销分店
		isWhetherSmallbRadio(e) {
			this.datas.whetherSmallb = Number(e.detail.value);
		}
	}
};
</script>

<style lang="scss">
@import '@/common/css/jiandang.scss';
.l-form-item {
	border-bottom: 1rpx solid #eee;
	width: 750rpx;
	height: 88rpx;
	box-sizing: border-box;
	padding: 20rpx 16rpx 20rpx 36rpx;
	display: flex;
	align-items: center;
	.l-item-label {
		font-size: 30rpx;
		min-width: 130rpx;
		padding-right: 40rpx;
		flex-shrink: 0;
		color: #333333;
		&::before {
			content: attr(data-info);
			width: 18rpx;
			display: inline-block;
			text-align: center;
			vertical-align: middle;
			color: #ff0000;
		}
	}
	.l-item-value {
		flex: 1;
		color: #cccccc;
		font-size: 28rpx;
		text-align: right;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.l-item-arrow {
		width: 36rpx;
		flex-shrink: 0;
		text-align: right;
		font-size: 36rpx;
		color: #cccccc;
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
