<template>
	<view>
		<view class="mask" @touchmove.stop.prevent="moveHandle" :class="mask == 'true' || mask == true ? 'mask-show' : ''" v-if="show">
			<view class="position-fixed-0">
				<view   :class="show?'spinner':''">
					<view class="spinner-container container1">
						<view class="container-item circle1"></view>
						<view class="container-item circle2"></view>
						<view class="container-item circle3"></view>
						<view class="container-item circle4"></view>
					</view>
					<view class="spinner-container container2">
						<view class="container-item circle1"></view>
						<view class="container-item circle2"></view>
						<view class="container-item circle3"></view>
						<view class="container-item circle4"></view>
					</view>
					<view class="spinner-container container3">
						<view class="container-item circle1"></view>
						<view class="container-item circle2"></view>
						<view class="container-item circle3"></view>
						<view class="container-item circle4"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	name: 'animate-loading',
	props: {
		mask: Boolean | String,
		isShow: Boolean
	},
	data() {
		return {
			show: false
		};
	},
	watch: {
		isShow: {
			handler: function(val) {
				this.show = val;
			},
			immediate: true
		}
	},

	methods: {
		moveHandle(){
			return
		},
		open() {
			this.show = true;
		},
		close() {
			this.show = false;
		}
	}
};
</script>
<style lang="scss" scoped>
.mask {
	/* pointer-events: none; */
	position: absolute;
	z-index: 99999;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
}
.mask.mask-show {
	background: rgba(240, 240, 240, .3);
}
.title {
	color: #fff;
	font-size: 28upx;
}

.spinner {
	
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	width: 30px;
	height: 30px;
}

.spinner .container-item {
	width: 8px;
	height: 8px;
	background-color: rgb(235, 194, 12);
	border-radius: 100%;
	position: absolute;
	-webkit-animation: bouncedelay 1.2s infinite ease-in-out;
	animation: bouncedelay 1.2s infinite ease-in-out;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}

.spinner .spinner-container {
	position: absolute;
	width: 100%;
	height: 100%;
}

.container2 {
	-webkit-transform: rotateZ(45deg);
	transform: rotateZ(45deg);
}

.container3 {
	-webkit-transform: rotateZ(90deg);
	transform: rotateZ(90deg);
}

.circle1 {
	top: 0;
	left: 0;
}
.circle2 {
	top: 0;
	right: 0;
}
.circle3 {
	right: 0;
	bottom: 0;
}
.circle4 {
	left: 0;
	bottom: 0;
}

.container2 .circle1 {
	-webkit-animation-delay: -1.1s;
	animation-delay: -1.1s;
}

.container3 .circle1 {
	-webkit-animation-delay: -1s;
	animation-delay: -1s;
}

.container1 .circle2 {
	-webkit-animation-delay: -0.9s;
	animation-delay: -0.9s;
}

.container2 .circle2 {
	-webkit-animation-delay: -0.8s;
	animation-delay: -0.8s;
}

.container3 .circle2 {
	-webkit-animation-delay: -0.7s;
	animation-delay: -0.7s;
}

.container1 .circle3 {
	-webkit-animation-delay: -0.6s;
	animation-delay: -0.6s;
}

.container2 .circle3 {
	-webkit-animation-delay: -0.5s;
	animation-delay: -0.5s;
}

.container3 .circle3 {
	-webkit-animation-delay: -0.4s;
	animation-delay: -0.4s;
}

.container1 .circle4 {
	-webkit-animation-delay: -0.3s;
	animation-delay: -0.3s;
}

.container2 .circle4 {
	-webkit-animation-delay: -0.2s;
	animation-delay: -0.2s;
}

.container3 .circle4 {
	-webkit-animation-delay: -0.1s;
	animation-delay: -0.1s;
}

@-webkit-keyframes bouncedelay {
	0%,
	80%,
	100% {
		-webkit-transform: scale(0);
	}
	40% {
		-webkit-transform: scale(1);
	}
}

@keyframes bouncedelay {
	0%,
	80%,
	100% {
		transform: scale(0);
		-webkit-transform: scale(0);
	}
	40% {
		transform: scale(1);
		-webkit-transform: scale(1);
	}
}
</style>
