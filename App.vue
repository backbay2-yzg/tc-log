<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let token = uni.getStorageSync('admin-token')
			if (!!token) {
				uni.redirectTo({
					url: '/pages/writelog/writelog'
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
</style>
