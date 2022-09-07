<template>
	<view u-page class="tc-page">
		<u-list @scrolltolower="scrolltolower">
			<u-list-item v-for="(item, index) in dataList[0]" :key="index" class="log-item">
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
								<view class="demo-layout "><u--text text="日期:"></u--text></view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout "><u--text :text="item.createTime"></u--text></view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout "><u--text text="项目:"></u--text></view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout "><u--text :text="item.projectName"></u--text></view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout "><u--text text="任务类型:"></u--text></view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout "><u--text :text="item.taskType"></u--text></view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout "><u--text text="工作量(小时):"></u--text></view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout "><u--text :text="item.workTime"></u--text></view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout "><u--text text="加班时间(小时):"></u--text></view>
							</u-col>
							<u-col span="6">
								<view class="demo-layout "><u--text :text="item.createTime"></u--text></view>
							</u-col>
						</u-row>
						<u-row customStyle="margin-bottom: 10rpx">
							<u-col span="6">
								<view class="demo-layout "><u--text text="工作内容:"></u--text></view>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="12">
								<u--textarea v-model="item.content" border="none" disabled disabledColor="#ffffff" autoHeight confirmType="return"></u--textarea>
							</u-col>
						</u-row>
					</view>
				</view>
			</u-list-item>
		</u-list>
		<u-loadmore :status="status" />
	</view>
</template>

<script>
import { getDetailLog } from '@/api/detaillog.js';
export default {
	data() {
		return {
			form: {
				//项目id
				projectId: null,
				//任务类型 开发 测试
				taskType: '',
				//日志日期
				dailyDate: null,
				//工作时长
				workTime: 0,
				//加班时长
				overTime: 0,
				//工作内容
				content: '',
				//接收人
				dailyReceiveIdList: null
			},
			dataList: [],
			pageData: {
				pageNum: 1,
				pageSize: 9
			},
			status: 'loadmore'
		};
	},
	onLoad() {
		//获取日志详情数据
		this.loadDetailLogPage();
	},
	// 刷新界面
	onPullDownRefresh() {
		this.dataList = [];
		//获取日志详情数据
		this.loadDetailLogPage();
		uni.stopPullDownRefresh();
	},
	onReachBottom() {
		// this.status = 'loading';
		// this.page.pageNum = ++this.pageData.pageNum;
		// setTimeout(() => {
		// 	this.dataList.length;
		// 	if (this.page >= 3) this.status = 'nomore';
		// 	else this.status = 'loading';
		// }, 2000);
	},
	methods: {
		//获取日志详情数据
		async loadDetailLogPage() {
			await getDetailLog(this.pageData).then(res => {
				console.log(this.pageData);
				this.dataList.push(res.data.rows);
				// let rows = res.data.rows;
				// console.log(rows);
				// let obj = {};
				// for (let i in rows) {
				// 	obj.createTime = rows[i].createTime;
				// 	obj.projectName = rows[i].projectName;
				// 	obj.projectId = rows[i].projectId;
				// 	obj.taskType = rows[i].taskType;
				// 	obj.workTime = rows[i].workTime;
				// 	obj.overTime = rows[i].overTime;
				// 	obj.dailyDetailId = rows[i].dailyDetailId;
				// 	obj.createUserName = rows[i].createUserName;
				// 	obj.createUserNameChinese = rows[i].createUserNameChinese;
				// 	console.log(obj);
				// }
			});
		},
		scrolltolower() {
			this.pageData.pageNum++;
			this.loadDetailLogPage();
			this.$forceUpdate();
		}
	}
};
</script>

<style>
.tc-page {
	background-color: #99a9bf;
}

.log-item {
	padding: 40rpx;
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
