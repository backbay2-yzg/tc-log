<template>
	<view class="container">
		<u--form labelPosition="left" :model="form" ref="uForm" class="form">
			<u-form-item label="项目名称" prop="projectName" borderBottom labelWidth="70" @click="showProjectPicker = true" ref="uProjectPicker">
				<u--input v-model="projectName" border="none" disabled disabledColor="#ffffff" placeholder="请选择项目名称"></u--input>
				<u-picker :show="showProjectPicker" :columns="projectNames" keyName="name" @cancel="projectPickerCancel" @confirm="projectPickerConfirm"></u-picker>
			</u-form-item>
			<u-form-item label="职位类型" prop="taskName" borderBottom labelWidth="70" @click="showTaskPicker = true" ref="uTaskPicker">
				<u--input v-model="taskName" border="none" disabled disabledColor="#ffffff" placeholder="请选择职位类型"></u--input>
				<u-picker :show="showTaskPicker" :columns="dailyTaskTypes" keyName="name" @cancel="taskPickerCancel" @confirm="taskPickerConfirm"></u-picker>
			</u-form-item>
			<u-form-item
				label="日期"
				prop="dailyDate"
				borderBottom
				@click="
					showDate = true;
					hideKeyboard();
				"
				ref="dateForm"
			>
				<u--input v-model="form.dailyDate" disabled disabledColor="#ffffff" placeholder="请选择日期" border="none"></u--input>
				<u-icon slot="right" name="arrow-right"></u-icon>
			</u-form-item>
			<u-form-item label="工作量(小时)" prop="workTime" borderBottom labelWidth="120" class="form-item">
				<u-number-box
					v-if="isWorkTimeInput"
					:min="0"
					:max="24"
					v-model="form.workTime"
					@change="workTimeChange"
					step="0.1"
					decimal-length="1"
					class="tc-flex-1"
				></u-number-box>
				<u--input v-else placeholder="请输入工作量(小时)" border="surround" v-model="form.workTime" class="tc-flex-1"></u--input>
				<u-switch v-model="isWorkTimeInput" @change="swWorkTimeChange" class="switch"></u-switch>
			</u-form-item>

			<u-form-item label="加班时间(小时)" prop="workTime" borderBottom labelWidth="120" class="form-item">
				<u-number-box
					v-if="isOverTimeInput"
					:min="0"
					:max="24"
					v-model="form.overTime"
					@change="overTimeChange"
					step="0.1"
					decimal-length="1"
					class="tc-flex-1"
				></u-number-box>
				<u--input v-else placeholder="请输入加班时间(小时)" border="surround" v-model="form.overTime" class="tc-flex-1"></u--input>
				<u-switch v-model="isOverTimeInput" @change="swOverTimeChange" class="switch"></u-switch>
			</u-form-item>
			<u-form-item label="发送给" borderBottom labelWidth="70" @click="clickDailyReceive">
				<!-- <u--input v-model="dailyReceiveDisplayName" border="none" disabled disabledColor="#ffffff"
					placeholder="请选择接收方"></u--input> -->
				<u--textarea v-model="dailyReceiveDisplayName" placeholder="请选择接收方" disabled disabledColor="#ffffff" autoHeight confirmType="done"></u--textarea>
			</u-form-item>
			<u-form-item label="工作内容" prop="content" borderBottom labelWidth="70">
				<u--textarea v-model="form.content" placeholder="请输入工作内容" count autoHeight :maxlength="255" confirmType="return"></u--textarea>
			</u-form-item>
		</u--form>
		<view class="log-box">
			<u-popup :show="showReceive" @close="showReceive = false" @open="openReceivePop" :round="10" closeable closeIconPos="top-right" closeOnClickOverlay>
				<view class="popupBox">
					<scroll-view scroll-y="true" style="height: 500rpx;" scroll-with-animation="true">
						<u-checkbox-group size="27" borderBottom iconSize="18" iconPlacement="right" placement="column" @change="cbChange">
							<u-checkbox
								:customStyle="{ marginBottom: '16px' }"
								v-for="(item, index) in dailyReceiveNames"
								:key="index"
								:label="item.name"
								:name="item.id"
								:checked="item.checked"
								shape="circle"
							></u-checkbox>
						</u-checkbox-group>
					</scroll-view>
				</view>
				<view class="cbview">
					<u-button type="primary" color="#0ab99c" text="确定" @click="checkboxConfirm" styles="margin-right"></u-button>
					<view class="tempView"></view>
					<u-button type="primary" color="#909399" text="清空" @click="checkboxDataClear"></u-button>
				</view>
			</u-popup>

			<u-datetime-picker
				:show="showDate"
				:value="form.dailyDate"
				mode="date"
				closeOnClickOverlay
				@confirm="datePickerConfirm"
				@cancel="datePickerClose"
				@close="datePickerClose"
			></u-datetime-picker>

			<u-button @click="submit" type="primary" color="#0ab99c" class="submitBtn" text="提交"></u-button>
		</view>
	</view>
</template>

<script>
import { getProjectNames, getDailyTaskTypes, getDailyReceives, submitDailyLog } from '@/api/writelog.js';
import { PROJECT_NAME_LIST, DAILY_TASK_TYPE_LIST, DAILY_RECEIVE_LIST } from '@/common/constants.js';
export default {
	data() {
		return {
			//项目名称控制picker
			showProjectPicker: false,
			showTaskPicker: false,
			showDate: false,
			showReceive: false,
			// 默认步进器
			isWorkTimeInput: true,
			isOverTimeInput: true,
			//项目名称集合
			projectNames: null,
			dailyTaskTypes: null,
			dailyReceiveNames: null,
			dailyReceiveDisplayName: '',
			//任务名称
			taskName: '开发',
			//项目名称
			projectName: 'PJ_JL_PF',
			form: {
				//项目id
				projectId: 22,
				//任务类型 开发 测试
				taskType: '01',
				//日志日期
				dailyDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
				//工作时长
				workTime: 7.5,
				//加班时长
				overTime: 0,
				//工作内容
				content: '',
				//接收人
				dailyReceiveIdList: ['331'],
				dailyDateObj: new Date(uni.$u.timeFormat(new Date(), 'yyyy-mm-dd')).toISOString()
			},
			rules: {
				// projectName: {
				// 	type: 'string',
				// 	required: true,
				// 	message: '请填写工程名',
				// 	trigger: ['blur', 'change']
				// },
				dailyDate: {
					type: 'string',
					required: true,
					message: '请选择日期',
					trigger: ['change']
				}
			}
		};
	},
	onLoad() {
		console.log('on load');
		console.log(this.projectNames);
		console.log(this.dailyTaskTypes);
		console.log(this.dailyReceiveNames);
		// 进来加载数据填充Form Data
		this.loadFormDataInfo();
	},
	onReady() {
		console.log('App Ready');
		// 请求token过期之后，401跳转登录之后需要进来加载数据填充Form Data
		this.loadFormDataInfo();
		// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
		this.$refs.uForm.setRules(this.rules);
	},
	onShow: function() {
		//缓存被清理之后 切换页面就可以恢复数据
		this.restoreFormDataInfo();
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		loadFormDataInfo(){
			if (this.projectNames == null || this.dailyTaskTypes == null || this.dailyReceiveNames == null) {
				let projectNameList = uni.getStorageSync(PROJECT_NAME_LIST);
				let dailyTaskTypeList = uni.getStorageSync(DAILY_TASK_TYPE_LIST);
				let dailyReceiveList = uni.getStorageSync(DAILY_RECEIVE_LIST);
				if (!!projectNameList && !!dailyTaskTypeList && !!dailyReceiveList) {
					console.log('load data');
					this.projectNames = projectNameList;
					this.dailyTaskTypes = dailyTaskTypeList;
					this.dailyReceiveNames = dailyReceiveList;
					//加载数据之后界面加载接收人
					this.loadReceiverName();
				} else {
					console.log('remote load data');
					this.getFormDataInfo();
				}
			}
		},
		//缓存被清理之后 切换页面就可以恢复数据
		restoreFormDataInfo(){
			let projectNameList = uni.getStorageSync(PROJECT_NAME_LIST);
			let dailyTaskTypeList = uni.getStorageSync(DAILY_TASK_TYPE_LIST);
			let dailyReceiveList = uni.getStorageSync(DAILY_RECEIVE_LIST);
			if (!(!!projectNameList && !!dailyTaskTypeList && !!dailyReceiveList)) {
				this.projectNames = null;
				this.dailyTaskTypes = null;
				this.dailyReceiveNames = null;
				this.getFormDataInfo();
			}
		},
		async getFormDataInfo() {
			await getProjectNames().then(res => {
				let arr = [];
				let projectsList = res.data.data;
				for (let i in projectsList) {
					//项目组id
					let projectId = projectsList[i].dailyProjectId;
					//工程英文名
					let projectName = projectsList[i].projectName;
					let obj = {
						id: projectId,
						name: projectName
					};
					arr.push(obj);
				}
				this.projectNames = [arr];
				uni.setStorageSync(PROJECT_NAME_LIST, this.projectNames);
			});
			await getDailyTaskTypes().then(res => {
				let arr = [];
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
					arr.push(obj);
				}
				this.dailyTaskTypes = [arr];
				uni.setStorageSync(DAILY_TASK_TYPE_LIST, this.dailyTaskTypes);
			});
			await getDailyReceives().then(res => {
				let arr = [];
				let dailyReceiveList = res.data.data;
				// for (let i = 3; i < dailyReceiveList.length; i++) {
				for (let i in dailyReceiveList) {
					//用户id
					let userId = dailyReceiveList[i].userId;
					//用户名
					let fullName = dailyReceiveList[i].nickName + '(' + dailyReceiveList[i].userName + ')';
					let obj = {
						id: userId,
						name: fullName,
						checked: false
					};
					arr.push(obj);
				}
				this.dailyReceiveNames = arr;
				uni.setStorageSync(DAILY_RECEIVE_LIST, this.dailyReceiveNames);
				//加载数据之后界面加载接收人
				this.loadReceiverName();
			});
		},
		hideKeyboard() {
			uni.hideKeyboard();
		},
		datePickerClose() {
			this.showDate = false;
			this.$refs.uForm.validateField('form.dailyDate');
		},
		datePickerConfirm(e) {
			this.showDate = false;
			this.form.dailyDate = uni.$u.timeFormat(e.value, 'yyyy-mm-dd');
			this.$refs.uForm.validateField('form.dailyDate');
		},
		projectPickerConfirm(e) {
			this.showProjectPicker = false;
			this.projectName = e.value[0].name;
			this.form.projectId = e.value[0].id;
		},
		projectPickerCancel() {
			this.showProjectPicker = false;
		},
		taskPickerConfirm(e) {
			this.showTaskPicker = false;
			this.taskName = e.value[0].name;
			this.form.taskType = e.value[0].id;
			console.log('当前值为: ' + e.value[0].id);
		},
		taskPickerCancel() {
			this.showTaskPicker = false;
		},
		workTimeChange(e) {
			console.log('当前值为: ' + e.value);
			this.workTime = e.value;
		},
		swWorkTimeChange(e) {
			console.log('当前值为: ' + e);
			this.isWorkTimeInput = e;
		},
		overTimeChange(e) {
			console.log('当前值为: ' + e.value);
			this.workTime = e.value;
		},
		swOverTimeChange(e) {
			console.log('当前值为: ' + e);
			this.isOverTimeInput = e;
		},
		mutilChange(e) {
			console.log('当前值为: ' + e);
		},
		cbChange(e) {
			console.log('当前cbChange值为: ' + e);
			this.form.dailyReceiveIdList = e;
			console.log(this.form.dailyReceiveIdList);
		},
		openReceivePop() {
			console.log('openReceivePop' + this.form.dailyReceiveIdList);
			this.dailyReceiveNames.forEach(item => {
				item.checked = false;
			});
			if (this.form.dailyReceiveIdList.length > 0) {
				this.form.dailyReceiveIdList.forEach(item => {
					this.dailyReceiveNames.forEach(obj => {
						if (obj.id == item) {
							obj.checked = true;
						}
					});
				});
			}
		},
		checkboxConfirm() {
			let objArr = [];
			console.log('当前值为: ' + this.form.dailyReceiveIdList);
			this.showReceive = false;
			this.loadReceiverName();
		},

		submit() {
			console.log('写日志提交:' + JSON.stringify(this.form));
			let dataFrom = [];
			dataFrom.push(this.form);
			submitDailyLog(dataFrom).then(res => {
				if (res.data.code === 200) {
					//清空内容
					this.form.content = ''
					uni.showToast({
						title: '日志提交成功',
						duration: 2000
					});
				}
			});
		},
		loadReceiverName() {
			let objArr = [];
			this.dailyReceiveDisplayName = '';
			// 清空checked
			this.clearChecked();
			//根据选中id修改对应的checkbox为选中状态
			if (this.form.dailyReceiveIdList.length > 0) {
				this.form.dailyReceiveIdList.forEach(item => {
					this.dailyReceiveNames.forEach(obj => {
						if (obj.id == item) {
							obj.checked = true;
							objArr.push(obj.name);
						}
					});
				});
			}
			//回显文本
			this.dailyReceiveDisplayName = objArr.toString();
		},
		clearChecked() {
			// 清空checked
			this.dailyReceiveNames.forEach(item => {
				item.checked = false;
			});
		},
		//
		checkboxDataClear() {
			this.showReceive = false;
			this.form.dailyReceiveIdList = [];
			this.dailyReceiveDisplayName = '';
			this.clearChecked();
		},
		clickDailyReceive(){
			this.showReceive = true;
			uni.showToast({
				title: '数据加载中，请稍后...',
				icon: 'none'
			})
		}
	}
};
</script>

<style lang="scss">
.container {
	display: flex;
	flex-direction: column;
	// height: 100vh;
	padding: 0rpx 40rpx;
}

.log-box {
	// display: flex;
	// flex-direction: column;
	// justify-content: space-between;
	// height: 100vh;
}

.form {
	// flex: 1;
	// position: relative;
}

.form-item {
	line-height: 80rpx;
}

.tc-flex-1 {
	flex: 1;
}

.switch {
	margin-left: 20rpx;
}

.popupBox {
	padding-left: 60rpx;
	padding-right: 60rpx;
	padding-top: 80rpx;
	padding-bottom: 10rpx;
}

.submitBtn {
	// position: absolute;
	// left: 0;
	// bottom: 20rpx;
	// // margin-bottom: 20rpx;
	// height: 100rpx;
}

.cbview {
	display: flex;
	padding: 10rpx;
	padding-bottom: 15rpx;
	justify-content: center;
}

.tempView {
	padding: 5rpx;
}
</style>
