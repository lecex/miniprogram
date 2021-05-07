<template>
<view>
	<u-keyboard 
		default=""
		ref="uKeyboard" 
		mode="number" 
		:mask="true" 
		:mask-close-able="false"
		:dot-enabled="true" 
		v-model="show"
		:safe-area-inset-bottom="true"
		:tooltip="false"
		@change="onChange"
		@confirm="onConfirm"
		@backspace="onBackspace">
		<view>
			<view class="u-text-center u-padding-20 money">
				<text>{{totalAmount}}</text>
				<text class="u-font-20 u-padding-left-10">元</text>
				<view class="u-padding-10 close" data-flag="false" @tap="showPop(false)">
					<u-icon name="close" color="#333333" size="28"></u-icon>
				</view>
			</view>
			<view class="u-text-center u-padding-top-10 u-padding-bottom-20 tips">收款键盘</view>
		</view>
	</u-keyboard>
</view>
</template>

<script>
	import {  mapGetters } from 'vuex'
	import { parseTime }  from '@/utils'
	export default {
		components: { 
		},
		data() {
			return {
				totalAmount:'',
				show:true
			}
		},
		computed: {
			...mapGetters([
			'username',
			'name',
			]),
		},
		onLoad() {
		},
		onReady() {
			console.log(parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}'),123465);
		},
		methods: {
			onChange(val){
				this.totalAmount += val;
				this.totalAmount = this.totalAmount.match(/^\d+(?:\.\d{0,2})?/)[0]
			},
			onBackspace(e){
				if(this.totalAmount.length>0){
					this.totalAmount = this.totalAmount.substring(0,this.totalAmount.length-1);
				}
			},
			showPop(flag = true){
				this.totalAmount = '';
				this.show = flag;
			},
			onConfirm(){
				uni.scanCode({
                    scanType: ['qrCode'],
					onlyFromCamera: true,
                    success:(res) =>{
						this.aopF2F(res.result )
                    }
                });
			},
			aopF2F(code){
				const regAlipay = /^(?:2[5-9]|30)\d{14,18}$/
				const method = null
				if (regAlipay.test(code)) { // 支付宝支付
					method = 'alipay'
				}
				const regWechat = /^1[0-5]\d{16}$/
				if (regWechat.test(code)) { // 微信支付
					method = 'wechat'
				}
				const totalAmount = this.totalAmount * 100
				const order = {
					authCode: code,
					method: method,
					operatorId: "",
					orderNo: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}'),
					storeName: this.username,
					terminalId: "",
					title: this.name,
					totalAmount: totalAmount,
				}
				console.log(order);
			}
		}
	}
</script>

<style lang="scss">
	.money{
		font-size: 80rpx;
		color: $u-type-warning;
		position: relative;
		
		.close{
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			line-height: 28rpx;
			font-size: 28rpx;
		}
	}
	.tips{
		color:$u-tips-color;
	}
</style>