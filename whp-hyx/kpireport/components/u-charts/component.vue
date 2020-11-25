<template>
	<canvas
		v-if="canvasId"
		:id="canvasId"
		:canvasId="canvasId"
		class="charts"
		@touchstart="touchStart"
		@touchmove="touchMove"
		@touchend="touchEnd"
		@error="error"
	></canvas>
</template>

<script>
import uCharts from './u-charts.js';
var canvases = {};

export default {
	props: {
		chartType: {
			required: true,
			type: String,
			default: 'column'
		},
		opts: {
			required: true,
			type: Object
		},
		canvasId: {
			type: String,
			required: true,
			default:'canvas_s'
		},
		cWidth: {
			type: Number,
			default: 375
		},
		cHeight: {
			type: Number,
			default: 275
		},
		pixelRatio: {
			type: Number,
			default: 1
		}
	},

	watch:{
		opts:{
			handler(newval){
				console.log("opts:",newval);
				this.initColumnChart(this.canvasId,newval)
			},
			deep: true,
			immediate:true
		}
	},
	methods: {
		initColumnChart(canvasId,opts) {
			canvases[canvasId] = new uCharts({
				$this: this,
				canvasId: canvasId,
				type: 'column',
				legend: true,
				fontSize: 11,
				padding: [5, 0, 5, 0],
				colors: ['#FDC100', '#F9891F', '#CECECE'],
				legend: {
					show: true,
					position: 'top',
					float: 'center',
					itemGap: 30,
					padding: 5,
					margin: 5,
					borderWidth: 1
				},
				background: '#FFFFFF',
				pixelRatio: this.pixelRatio,
				animation: true,
				categories: opts.categories,
				series: opts.series,
				enableScroll: true,
				xAxis: {
					disableGrid: true,
					type: 'grid',
					gridType: 'solid',
					itemCount: 6,
					scrollShow: true,
					scrollAlign: 'right'
				},
				yAxis: {
					disableGrid: false,
					gridType: 'solid',
					splitNumber: 4,
					min: 0,
					max: 500000,
					format: val => {
						return (val / 10000).toFixed(0) + '万元';
					} //如不写此方法，Y轴刻度默认保留两位小数
				},
				dataLabel: false,
				width: this.cWidth * this.pixelRatio,
				height: this.cHeight * this.pixelRatio,
				extra: {
					column: {
						type: 'group',
						width:14
						// width: (this.cWidth * this.pixelRatio * 0.25) / this.opts.categories.length
					}
				}
			});
		},

		// 这里仅作为示例传入两个参数，cid为canvas-id,newdata为更新的数据，需要更多参数请自行修改
		changeData(cid, newdata) {
			canvases[cid].updateData({
				series: newdata.series,
				categories: newdata.categories
			});
		},
		toJSON() {},
		touchStart(e) {
			canvases[this.canvasId].scrollStart(e);
		},
		touchMove(e) {
			canvases[this.canvasId].scroll(e);
		},
		touchEnd(e) {
			canvases[this.canvasId].scrollEnd(e);
			let mbMoney = null;
			let sjMoney = null;
			let rate = null;
			canvases[this.canvasId].showToolTip(e, {
				format: function(item, category) {
					try {
						switch (item.name) {
							case '目标金额':
								mbMoney = parseFloat(item.data);
								return item.name + ': ￥' + (parseInt(item.data)/10000).toFixed(2) +'万';
							case '完成金额':
								sjMoney = parseFloat(item.data);
								return item.name + ': ￥' + (parseInt(item.data)/10000).toFixed(2) + '万';
							case '完成进度':
								if (mbMoney !== null || sjMoney !== null) {
									if (mbMoney == 0) {
										return item.name + ': 0.00%';
									} else {
										return item.name + ': ' + ((sjMoney / mbMoney) * 100).toFixed(2) + '%';
									}
								} else {
									return item.name + ': ' + 0.00 + '%';
								}
						}
					} catch (e) {
						console.log(e);
						//TODO handle the exception
						return category + ' ' + item.name + ': ' + 0.00 + '%';
					}
				}
			});
		},
		error(e) {
			console.log(e);
		}
	}
};
</script>

<style scoped>
.charts {
	width: 690rpx;
	height: 550rpx;
	background-color: #ffffff;
}
</style>
