<template>
<view>
	<home v-if="PageCur=='home'"/>
	<my v-if="PageCur=='my'"/>
	<pos ref="pos" v-if="PageCur=='scan'"/>
	<tabbar
		@NavChange="navChange"
		@NavScanCodeChange="navScanCodeChange"
	/>
</view>
</template>

<script>
	import tabbar from '@/components/tabbar.vue'
	import home from '@/pages/home/index.vue'
	import my from '@/pages/my/index.vue'
	import pos from '@/pages/pos/index.vue'
	export default {
		components: { 
			tabbar,
			home,
			my,
			pos,
		},
		data() {
			return {
				PageCur:'home',
				barCode:'',
			}
		},
		onLoad() {
			this.init()
		},
		onReady() {
		},
		methods: {
			init() {
				if (!uni.getStorageSync('token')) {
					this.$store.dispatch('user/login').then(res=>{
						if (res.valid) {
							if(res.socialiteUser.users.length===1){
								uni.setStorageSync('token', res.socialiteUser.users[0].token)
								this.userInfo()
							}else{
								// 活用户是进入选择登陆页面
								console.log(123,res)
							}
						}else{
							// 返回信息成功但未找到绑定用户需要注册
							this.$u.route("/pages/register/index");
						}
					})
				}else{
					this.userInfo()
				}
			},
			userInfo(){
				this.$store.dispatch('user/getInfo').catch(err => {
					uni.removeStorageSync('token'); // 删除token 重新获取
					this.init()
				})
			},
			navChange(PageCur){
				this.PageCur = PageCur
				if (this.PageCur == 'scan' && this.$refs.pos){
					this.$refs.pos.show = true
				}
			},
			navScanCodeChange(code){
				console.log(code);
			},
		},
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
