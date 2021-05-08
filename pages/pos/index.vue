<template>
<view>
	<view v-if="state!=='close'" class="u-text-center u-padding-20 state">
		<view>
			<u-icon v-if="order.method==='alipay'" name="zhifubao" size="80" color="#409EFF"></u-icon>
			<u-icon v-if="order.method==='wechat'" name="weixin-fill" size="80" color="#67C23A"></u-icon>
		</view>
		<u-icon v-if="state=='wait'" name="more-dot-fill" size="120" color="#E6A23C"></u-icon>
		<u-icon v-if="state=='success'" name="checkbox-mark" size="120" color="#67C23A"></u-icon>
		<u-icon v-if="state=='error'" name="close" size="120" color="#F56C6C"></u-icon>
		<view v-if="order.totalAmount>0">¥ {{(order.totalAmount/100).toFixed(2)}} 元</view>
	</view>
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
				<text>{{Number(totalAmount)}}</text>
				<text class="u-font-20 u-padding-left-10">元</text>
				<view class="u-padding-10 close" data-flag="false" @tap="showPop(false)">
					<u-icon name="close" color="#333333" size="28"></u-icon>
				</view>
			</view>
			<view class="u-text-center u-padding-top-10 u-padding-bottom-20 tips">收款键盘</view>
		</view>
	</u-keyboard>
	<u-top-tips ref="uTips"></u-top-tips>
</view>
</template>

<script>
	import {  mapGetters } from 'vuex'
	import { parseTime }  from '@/utils'
	import utilsPay from '@/utils/pay'
	export default {
		components: { 
		},
		data() {
			return {
				totalAmount:'',
				show:true,
				query:true,
				order:{
					totalAmount:0
				},
				state: 'close'
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
		},
		methods: {
			onChange(val){
				if (Number(this.totalAmount + val)<100000) {
					this.totalAmount += val;
					this.totalAmount = this.totalAmount.match(/^\d+(?:\.\d{0,2})?/)[0]
				}else{
					this.$refs.uTips.show({
						duration: 5000,
						title: "不允许大于10万元",
						type: 'warning'
					});
				}
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
				if (Number(this.totalAmount)>0) {
					uni.scanCode({
						scanType: ['qrCode'],
						onlyFromCamera: true,
						success:(res) =>{
							this.aopF2F(res.result, this.totalAmount * 100)
							this.showPop(false)
						}
					});
				}else{
					this.$refs.uTips.show({
						duration: 5000,
						title: "请输入收款金额",
						type: 'warning'
					});
				}
			},
			async aopF2F(code, totalAmount){
				let method = null
				const regAlipay = /^(?:2[5-9]|30)\d{14,18}$/
				if (regAlipay.test(code)) { // 支付宝支付
					method = 'alipay'
				}
				const regWechat = /^1[0-5]\d{16}$/
				if (regWechat.test(code)) { // 微信支付
					method = 'wechat'
				}
				if (method) {
					this.order = {
						authCode: code,
						method: method,
						operatorId: "",
						orderNo: parseTime(new Date,'{y}{m}{d}{h}{i}{s}{n}'),
						storeName: this.username,
						terminalId: "",
						title: this.name,
						totalAmount: totalAmount,
					}
					uni.showLoading({
						title:'支付中'
					})
					await this.$u.api.PaysAopF2F(this.order)
					this.handerPayQuery()
				}else{
					this.$refs.uTips.show({
						duration: 5000,
						title: "不支持此付款方式",
						type: 'error'
					});
				}
			},
			handerPayQuery() {
				this.state = 'wait'
				if(this.query){
					uni.showLoading({
						title:'查询中'
					})
					this.$u.api.PaysQuery(this.order).then(response => {
						utilsPay.hander(response, this.order.method)
						if (utilsPay.valid) {
							this.state = 'success'
							uni.showToast({
								icon:'success',
								title:'支付成功'
							})
						} else {
							if (utilsPay.error.code === 'USERPAYING') {
								uni.showLoading({
									title:'等待用户付款中'
								})
								setTimeout(() => {
									this.handerPayQuery()
								}, 5 * 1000)// 等待10秒
							} else {
								this.$refs.uTips.show({
									duration: 60*1000,
									title: utilsPay.error.detail,
									type: 'error'
								});
								this.state = 'error'
							}
						}

					}).catch(error => {
						if (error.message.indexOf('timeout of') !== -1) {
							uni.showLoading({
								title:'支付查询超时..'
							})
						} else {
							const detail = error.response.data.detail
							this.$refs.uTips.show({
								duration: 5000,
								title: "查询失败"+detail,
								type: 'error'
							});
						}
						setTimeout(() => {
							this.handerPayQuery()
						}, 5 * 1000)// 等待 5 秒再次查询
					})
				}
			},
		},
		destroyed() {
			this.query = false
			uni.hideLoading()
		}
	}
</script>

<style lang="scss" >
	.state{
		margin-top: 15vh;
		font-size: 80rpx;
		color: $u-type-warning;
		position: relative;
	}

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