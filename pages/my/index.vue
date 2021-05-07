<template>
	<view>
		<view v-if="PageCur=='home'">
			<u-navbar :is-back="false" title="　" :border-bottom="false">
				<!-- <view class="u-flex u-row-right" style="width: 100%;">
					<view class="camera u-flex u-row-center">
						<u-icon name="camera-fill" color="#000000" size="48"></u-icon>
					</view>
				</view> -->
			</u-navbar>
			<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
				<view class="u-m-r-10">
					<u-avatar :src="avatar" size="140"></u-avatar>
				</view>
				<view class="u-flex-1">
					<view v-if="isSetName" class="u-font-18 u-p-b-20">
						<u-form-item prop="code">
							<u-input focus placeholder="请输入昵称" v-model="setName" type="text"></u-input>
							<u-button slot="right" type="success" size="mini" @click="setNamehandler">保存</u-button>
						</u-form-item>
					</view>
					<view v-else class="u-font-18 u-p-b-20" @click="isSetName=true">{{name}}</view>
					<view class="u-font-14 u-tips-color">账号: {{username}}</view>
				</view>
				<view class="u-m-l-10 u-p-10">
					<u-icon name="scan" color="#969799" size="28"></u-icon>
				</view>
				<view class="u-m-l-10 u-p-10">
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>
			
			<!-- <view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="rmb-circle" :iconStyle="{color:'#F56C6C'}" title="收银"></u-cell-item>
				</u-cell-group>
			</view>
			
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="star" :iconStyle="{color:'#ff6f00'}" title="报表"></u-cell-item>
					<u-cell-item icon="photo" :iconStyle="{color:'#e17055'}" title="通知"></u-cell-item>
					<u-cell-item icon="coupon" :iconStyle="{color:'#0fb9b1'}" title="商品"></u-cell-item>
					<u-cell-item icon="heart" :iconStyle="{color:'#67C23A'}" title="盘点"></u-cell-item>
				</u-cell-group>
			</view>
			
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item icon="setting" :iconStyle="{color:'#455A64'}" title="设置" index="setting" @click="navChange"></u-cell-item>
				</u-cell-group>
			</view> -->
			<view class="u-m-t-20">
				<button @tap="outLogin">退出登录</button>
			</view>
		</view>
	</view>

</template>

<script>
import {  mapGetters } from 'vuex'
export default {
	components: { 
	},
	data() {
		return {
			PageCur:'home',
			isSetName:false,
			setName:''
		}
	},
	computed: {
		...mapGetters([
		'username',
		'name',
		'avatar'
		]),
	},
	onLoad() {
		
	},
	methods: {
		outLogin(){
			uni.removeStorageSync("token")
			this.$u.route({
				type:'redirectTo',
				url: 'pages/index/index'
			})
		},
		navChange(PageCur){
			this.PageCur = PageCur
		},
		setNamehandler(){
			this.$u.api.UserSelfUpdate({
				user:{
					name:this.setName,
				}
			}).then(res=>{
				if (res.valid) {
					this.isSetName = false
					this.$store.dispatch('user/getInfo')
				}
			})
		}
	}
}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
</style>
