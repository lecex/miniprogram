<template>
	<view class="wrap">
		<view class="key-input">
			<view class="title">输入验证码</view>
			<view class="tips">验证码已发送至 {{showMobile}}</view>
			<u-message-input :focus="true" :value="value" @change="change" @finish="finish" mode="bottomLine" :maxlength="maxlength"></u-message-input>
			<text :class="{ error: error }">{{errorInfo}}</text>
			<view class="captcha">
				<text :class="{ noCaptcha: show }" @tap="noCaptcha">收不到验证码点这里</text>
				<text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
			</view>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
export default {
	data() {
		return {
            mobile:'',
            showMobile:'',
			maxlength: 6,
			value: '',
			second: 60,
			show: false,
			error: false,
			errorInfo:"",
		};
	},
	computed: {},
	onLoad(options) {
        this.mobile = options.mobile
        this.showMobile = this.mobile.slice(0,3)+'****'+this.mobile.slice(7,11)
		this.getCaptcha()
		let interval = setInterval(() => {
			this.second--;
			if (this.second <= 0) {
				this.show = true;
				// if (this.value.lenth != 4) {
				// 	this.error = true;
				// }
				clearInterval(interval);
			}
		}, 1000);
	},
	methods: {
		// 获取验证码
		getCaptcha(){
			this.$u.api.SendCaptcha({
				addressee:this.mobile,
			}).catch(err=>{
				this.show = true
				this.error = true;
				this.errorInfo = "验证码发送失败"
				let message = err.data.detail?err.data.detail:err.data
				this.$refs.uTips.show({
                    duration: 5000,
                    title: message,
                    type: 'error'
                });
			})
		},
		// 收不到验证码选择时的选择
		noCaptcha() {
			uni.showActionSheet({
				itemList: ['重新获取验证码'],
				success:(res) =>{
					this.getCaptcha()
				},
				fail:(err) =>{
					console.error(err);
				}
			});
		},
		// change事件侦听
		change(value) {
			// console.log('change', value);
		},
		// 输入完验证码最后一位执行
		finish(value) {
			this.$store.dispatch('user/register',{
				mobile: this.mobile,
				captcha: value
			}).then(res=>{
				if (res.valid) {
					this.$u.route({
						type:'redirectTo',
						url: 'pages/index/index'
					})
				}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	padding: 80rpx;
}

.box {
	margin: 30rpx 0;
	font-size: 30rpx;
	color: 555;
}

.key-input {
	padding: 30rpx 0;
	text {
		display: none;
	}
	.error {
		display: block;
		color: red;
		font-size: 30rpx;
		margin: 20rpx 0;
	}
}

.title {
	font-size: 50rpx;
	color: #333;
}

.key-input .tips {
	font-size: 30rpx;
	color: #333;
	margin-top: 20rpx;
	margin-bottom: 60rpx;
}
.captcha {
	color: $u-type-warning;
	font-size: 30rpx;
	margin-top: 40rpx;
	.noCaptcha {
		display: block;
	}
	.regain {
		display: block;
	}
}
</style>
