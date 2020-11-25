<template>
	
		<view class="serarbar" >
			<view :style="{ borderRadius: radius + 'px', backgroundColor: bgColor,height:height+'rpx',fontSize:size+'rpx' }" class="uni-searchbar__box" @click="searchClick">
				<slot>
					<text class="iconfont search-icon" style="font-size: 40rpx;" >&#xe643;</text>
				</slot>
				<input
					v-if="show"
					:focus="showSync"
					:placeholder="placeholder"
					@confirm="confirm"
					class="uni-searchbar__box-search-input"
					confirm-type="search"
					type="text"
					v-model="searchVal"
				/>
				<text v-else class="uni-searchbar__text-placeholder" >{{ placeholder }}</text>
				<view v-if="show && (clearButton === 'always' || (clearButton === 'auto' && searchVal !== ''))" class="uni-searchbar__box-icon-clear" @click="clear">
					<text class="iconfont" style="color:#999999;font-size: 40rpx;">&#xe61b;</text>
				</view>
			</view>
			<text @click="cancel" class="uni-searchbar__cancel" :style="{fontSize:size+'rpx'}" v-if="cancelButton === 'always' || (show && cancelButton === 'auto')">{{ cancelText }}</text>
		</view>
	
</template>

<script>

export default {
		name:'ly-search-bar',
		props: {
			placeholder: {
				type: String,
				default: "请输入搜索内容"
			},
			radius: {
				type: [Number, String],
				default: 5
			},
			clearButton: {
				type: String,
				default: "auto"
			},
			cancelButton: {
				type: String,
				default: "auto"
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			bgColor: {
				type: String,
				default: "#F8F8F8"
			},
			maxlength: {
				type: [Number, String],
				default: 100
			},
			height:{
				type:Number,
				default:70
			},
			size:{
				type:Number,
				default:28
			},
			clearKesword:{
				type:Boolean,
				default:false
			}
		},
	data() {
		return {
			show: false,
			showSync: false,
			searchVal: ''
		
		};
	},
	
	watch:{
		searchVal() {
			this.$emit("input", {
				value: this.searchVal
			})
		},
		clearKesword(){
			this.cancel()
			
		}
	},
	methods: {
		searchClick() {
			if (this.show) {
				return;
			}
			this.searchVal = '';
			this.show = true;
			this.$nextTick(() => {
				this.showSync = true;
			});
		},
		clear() {
			this.searchVal = '';
			this.$emit('clear')
		},
		cancel() {
			this.searchVal = '';
			this.$emit('cancel', {
				value: this.searchVal
			});
			this.show = false;
			this.showSync = false;
			uni.hideKeyboard();
			// this.$emit('clear')
			
		
		},
		confirm() {
			uni.hideKeyboard();
			
			
			this.$emit('confirm', {
				value: this.searchVal
			});
		}
	}
};
</script>

<style scoped>
.search-icon{
	color:#999999;font-size: 18px;
	margin-left: 4px;
}
.serarbar{
	display: flex;
}
.uni-searchbar {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	position: relative;
	padding: 16rpx;
	background-color: #ffffff;
}

.uni-searchbar__box {
	/* #ifndef APP-NVUE */
	display: flex;
	box-sizing: border-box;
	/* #endif */
	overflow: hidden;
	position: relative;
	flex: 1;
	justify-content: center;
	flex-direction: row;
	align-items: center;
	border-width: 0.5px;
	border-style: solid;
	border-color: #e5e5e5;
}

.uni-searchbar__box-icon-search {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	width: 32px;
	justify-content: center;
	align-items: center;
	color: #808080;
}

.uni-searchbar__box-search-input {
	flex: 1;
	/* font-size: 28rpx; */
	color: #333;
}

.uni-searchbar__box-icon-clear {
	display: flex;
	justify-content: center;
	align-items: center;
	padding-left: 5px;
	margin-right: 5px;
}

.uni-searchbar__text-placeholder {
	color: #808080;
	margin-left: 5px;
}

.uni-searchbar__cancel {
	padding-left: 10px;
	line-height: 70rpx;
	color: #333;
}
</style>
