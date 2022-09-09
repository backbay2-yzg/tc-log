<template>
	<view u-page class="tc-page">
		<u-list @scrolltolower="scrolltolower">
			<u-list-item v-for="(item, index) in dataList" :key="index" class="log-item">
				<!-- <u-cell :title="`列表长度-${index + 1}`">
					<u-avatar slot="icon" shape="square" size="35" :src="item.url" customStyle="margin: -3px 5px -3px 0">
						
					</u-avatar>
				</u-cell> -->
				<view class="u-demo-block">
					<view class="log-item-title">
						<text class="u-demo-block__title ">{{ item.createUserName }}的研发日报</text>
					</view>
					<view class="u-demo-block__content">
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout ">
									<u--text text="日期:"></u--text>
								</view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout ">
									<u--text :text="item.updateTime"></u--text>
								</view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout ">
									<u--text text="项目:"></u--text>
								</view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout ">
									<u--text :text="item.projectName"></u--text>
								</view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout ">
									<u--text text="任务类型:"></u--text>
								</view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout ">
									<u--text :text="item.taskType"></u--text>
								</view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout ">
									<u--text text="工作量(小时):"></u--text>
								</view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout ">
									<u--text :text="item.workTime"></u--text>
								</view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout ">
									<u--text text="加班时间(小时):"></u--text>
								</view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout ">
									<u--text :text="item.overTime"></u--text>
								</view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout ">
									<u--text text="工作内容:"></u--text>
								</view>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="12">
								<u--textarea v-model="item.content" border="none" disabled disabledColor="#ffffff"
									autoHeight confirmType="return"></u--textarea>
							</u-col>
						</u-row>
					</view>
				</view>
			</u-list-item>
		</u-list>
		<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" />
		<u-loading-page :image="loadingPageData.image" :loadingText="loadingPageData.loadingText"
			:icon-size="loadingPageData.iconSize" :font-size="loadingPageData.fontSize"
			:bg-color="loadingPageData.bgColor" :color="loadingPageData.color"
			:loading-color="loadingPageData.loadingColor" :loading="this.status==='loading'"></u-loading-page>
	</view>
</template>

<script>
	import {
		getDetailLog
	} from '@/api/detaillog.js';
	import {
		getDailyTaskTypes
	} from '@/api/writelog.js'
	import {
		DAILY_TASK_TYPE_LIST
	} from '@/common/constants.js';
	export default {
		data() {
			return {
				// form: {
				// 	//项目id
				// 	projectId: null,
				// 	//任务类型 开发 测试
				// 	taskType: '',
				// 	//日志日期
				// 	dailyDate: null,
				// 	//工作时长
				// 	workTime: 0,
				// 	//加班时长
				// 	overTime: 0,
				// 	//工作内容
				// 	content: '',
				// 	//接收人
				// 	dailyReceiveIdList: null
				// },
				loadingPageData: {
					loadingText: '牛马加班努力中...',
					image: '../../static/logo.png',
					loadingMode: 'spinner',
					bgColor: 'rgba(0, 0, 0, 0.3)',
					loadingColor: '#ddd',
					iconSize: 80,
					fontSize: 20,
					color: '#eee'
				},
				dailyTaskTypes: null,
				dataList: [],
				pageData: {
					pageNum: 0,
					pageSize: 9,
					countTotal: null
				},
				status: 'loadmore',
				loadingText: '努力加载中',
				loadmoreText: '轻轻上拉',
				nomoreText: '实在没有了'
			};
		},
		onLoad() {

			// uni.startPullDownRefresh();
		},
		mounted() {
			//获取日志详情数据
			this.loadDetailLogPage();
		},
		// 刷新界面
		onPullDownRefresh() {
			this.pageData.pageNum = 0;
			this.dataList = [];
			//获取日志详情数据
			this.loadDetailLogPage();
			uni.stopPullDownRefresh();
			// uni.hideNavigationBarLoading();
		},
		onShow() {
			console.log("show page")
			this.pageData.pageNum = 0;
			this.dataList = [];
			this.dailyTaskTypes = uni.getStorageSync(DAILY_TASK_TYPE_LIST);
			if (!(!!this.dailyTaskTypes)) {
				console.log('task type is empty')
				this.loadDailyTaskTypes();
			}
			console.log('load detail log page')
			//获取日志详情数据
			this.loadDetailLogPage();
		},
		methods: {
			async loadDailyTaskTypes() {
				await getDailyTaskTypes().then(res => {
					let dailyTaskTypes = [];
					let dailyTaskTypeList = res.data.data;
					for (let i in dailyTaskTypeList) {
						//项目组id
						let typeId = dailyTaskTypeList[i].dictValue;
						//工程英文名
						let typeName = dailyTaskTypeList[i].dictLabel;
						let obj = {
							id: typeId,
							name: typeName
						};
						dailyTaskTypes.push(obj);
					}
					uni.setStorageSync(DAILY_TASK_TYPE_LIST, dailyTaskTypes)

				});
			},
			//获取日志详情数据
			async loadDetailLogPage() {
				uni.stopPullDownRefresh();
				if (this.pageData.countTotal === null || this.pageData.countTotal > this.pageData.pageNum * this
					.pageData.pageSize) {
					this.pageData.pageNum = ++this.pageData.pageNum;
					await getDetailLog(this.pageData).then(res => {
						this.status = 'loadmore';
						this.pageData.countTotal = res.data.total;
						if (this.pageData.pageNum === 1) {
							if (res.data.total === 0) {
								uni.showToast({
									title: '暂无数据',
									icon: 'success'
								});

								return;
							}

							// this.getData(res.data.rows);
							for (let i in res.data.rows) {
								let taskTypeName = this.dailyTaskTypes.filter(item => res.data.rows[i]
									.taskType === item.id);
								res.data.rows[i].taskType = taskTypeName[0].name;
							}

							this.dataList = res.data.rows;
						} else {
							// this.getData(res.data.rows)
							for (let i in res.data.rows) {
								let taskTypeName = this.dailyTaskTypes.filter(item => res.data.rows[i]
									.taskType === item.id);
								res.data.rows[i].taskType = taskTypeName[0].name;
							}

							this.dataList = this.dataList.concat(res.data.rows);
						}
						console.log(this.dataList);
					});
				} else {
					this.status = 'noremore';
				}
				uni.hideNavigationBarLoading();
			},
			scrolltolower() {
				console.log('scroll to lower');
				this.status = 'loading';
				this.loadDetailLogPage();
			}
		}
	};
</script>

<style>
	.tc-page {
		background-color: #99a9bf;
	}

	.log-item {
		padding: 20rpx;
		background-color: #fffefa;
		margin: 20rpx;
		border: 1rpx solid white;
		border-radius: 4px;
	}

	.log-item-title {
		font-size: 1.3rem;
		padding-bottom: 20rpx;
	}

	.demo-layout {
		display: flex;
		justify-content: center;
		height: 24px;
		/* border-radius: 4px; */
	}

	.tc-height {
		width: 100%;
		min-height: 100rpx;
	}

	.bg-purple {
		background: #ced7e1;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}
</style>
