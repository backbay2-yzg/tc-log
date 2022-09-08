<template>
	<view class="container">
		<u--form labelPosition="left" :model="form" ref="wForm" class="form">
			<u-form-item label="项目名称" prop="projectName" borderBottom labelWidth="70" @click="showProjectPicker = true"
				ref="uProjectPicker">
				<u--input v-model="form.projectName" border="none" disabled disabledColor="#ffffff"
					placeholder="请选择项目名称">
				</u--input>
				<u-picker :show="showProjectPicker" :columns="[this.projectNames]" keyName="name"
					@cancel="projectPickerCancel" @confirm="projectPickerConfirm"></u-picker>
			</u-form-item>
			<u-form-item label="职位类型" prop="taskName" borderBottom labelWidth="70" @click="showTaskPicker = true"
				ref="uTaskPicker">
				<u--input v-model="form.taskName" border="none" disabled disabledColor="#ffffff" placeholder="请选择职位类型">
				</u--input>
				<u-picker :show="showTaskPicker" :columns="[dailyTaskTypes]" keyName="name" @cancel="taskPickerCancel"
					@confirm="taskPickerConfirm"></u-picker>
			</u-form-item>
			<u-form-item label="日期" prop="dailyDate" borderBottom @click="
					showDate = true;
					hideKeyboard();
				" ref="dateForm">
				<u--input v-model="form.dailyDate" disabled disabledColor="#ffffff" placeholder="请选择日期" border="none">
				</u--input>
				<u-icon slot="right" name="arrow-right"></u-icon>
			</u-form-item>
			<u-form-item label="工作量(小时)" prop="workTime" borderBottom labelWidth="120" class="form-item">
				<u-number-box v-if="isWorkTimeInput" :min="0" :max="24" v-model="form.workTime" @change="workTimeChange"
					step="0.1" decimal-length="1" class="tc-flex-1"></u-number-box>
				<u--input v-else placeholder="请输入工作量(小时)" border="surround" v-model="form.workTime" class="tc-flex-1">
				</u--input>
				<u-switch v-model="isWorkTimeInput" @change="swWorkTimeChange" class="switch"></u-switch>
			</u-form-item>

			<u-form-item label="加班时间(小时)" prop="overTime" borderBottom labelWidth="120" class="form-item">
				<u-number-box v-if="isOverTimeInput" :min="0" :max="24" v-model="form.overTime" @change="overTimeChange"
					step="0.1" decimal-length="1" class="tc-flex-1"></u-number-box>
				<u--input v-else placeholder="请输入加班时间(小时)" border="surround" v-model="form.overTime" class="tc-flex-1">
				</u--input>
				<u-switch v-model="isOverTimeInput" @change="swOverTimeChange" class="switch"></u-switch>
			</u-form-item>
			<u-form-item label="工作内容" prop="content" borderBottom labelWidth="70">
				<u--textarea v-model="form.content" placeholder="请输入工作内容" count autoHeight :maxlength="255"
					confirmType="return"></u--textarea>

			</u-form-item>

			<u-form-item label="发送给" borderBottom labelWidth="70" @click="clickDailyReceive">

				<u--textarea v-model="dailyReceiveDisplayName" placeholder="请选择接收方" disabled disabledColor="#ffffff"
					autoHeight confirmType="done" adjustPosition></u--textarea>


				<view @click.stop="cleanReciver">
					<!-- <u-button slot="right" text="清空" type="success" size="mini" :disabled="cleanDisabled">清空</u-button> -->
					<u-button text="清空" size="mini" class="clean-btn" type="error" click="cleanReciver">
					</u-button>
				</view>
			</u-form-item>





		</u--form>

		<view class="log-box">
			<u-popup :show="showReceive" @close="showReceive = false" @open="openReceivePop" :round="10" closeable
				closeIconPos="top-right" closeOnClickOverlay>
				<view class="popupBox">
					<u-search v-model="searchValue" :show-action="false" @change="searchChange" clearabled
						placeholder="请输入关键字或者字母"></u-search>
					<scroll-view scroll-y="true" style="height: 500rpx;margin-top: 5px;" scroll-with-animation="true">
						<u-checkbox-group size="27" borderBottom iconSize="18" iconPlacement="right" placement="column"
							@change="cbChange">
							<u-checkbox :customStyle="{ marginBottom: '16px' }" v-for="(item, index) in searchList"
								:key="item.id" :label="item.name" :name="item.id" :checked="item.checked"
								shape="circle"></u-checkbox>
						</u-checkbox-group>
					</scroll-view>
				</view>
				<!-- 	<view class="cbview">
					<u-button type="primary" color="#0ab99c" text="确定" @click="checkboxConfirm" styles="margin-right">
					</u-button>
					<view class="tempView"></view>
					<u-button type="primary" color="#909399" text="清空" @click="checkboxDataClear"></u-button>
				</view> -->
			</u-popup>

			<u-datetime-picker :show="showDate" :value="form.dailyDate" mode="date" closeOnClickOverlay
				@confirm="datePickerConfirm" @cancel="datePickerClose" @close="datePickerClose"></u-datetime-picker>

			<u-button @click="submit" type="primary" color="#0ab99c" class="submitBtn" text="提交"></u-button>
		</view>
	</view>
</template>

<script>
	import {
		getProjectNames,
		getDailyTaskTypes,
		getDailyReceives,
		submitDailyLog
	} from '@/api/writelog.js';
	import {
		PROJECT_NAME_LIST,
		DAILY_TASK_TYPE_LIST,
		DAILY_RECEIVE_LIST,
		LOG_FORM_DATA
	} from '@/common/constants.js';
	export default {
		data() {
			return {
				cleanDisabled: false,
				searchValue: '',
				searchPopShow: false,
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
				dailyReceiveNames: '',
				dailyReceives: new Set(),
				dailyReceiveDisplayName: '',

				searchList: null,
				form: {
					//任务名称
					taskName: '',
					//项目名称
					projectName: '',

					//参数需要
					//项目id
					projectId: null,
					//任务类型 开发 测试
					taskType: null,
					//日志日期
					dailyDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
					//工作时长
					workTime: 7.5,
					//加班时长
					overTime: 0,
					//工作内容
					content: '',
					//接收人
					dailyReceiveIdList: null
				},
				rules: {
					projectName: {
						type: 'string',
						required: true,
						message: '请选择工程名',
						trigger: ['blur', 'change']
					},
					taskName: {
						type: 'string',
						required: true,
						message: '请选择任务类型',
						trigger: ['blur', 'change']
					},
					dailyDate: {
						type: 'string',
						required: true,
						message: '请选择日期',
						trigger: ['blur', 'change']
					},
					workTime: {
						type: 'number',
						min: 1,
						required: true,
						message: '请选择上班时长，最小是1小时',
						trigger: ['blur', 'change']
					},
					overTime: {
						type: 'number',
						min: 0,
						required: true,
						message: '请选择加班时间',
						trigger: ['blur', 'change']
					},
					content: {
						type: 'string',
						required: true,
						message: '请填写工作内容',
						trigger: ['blur', 'change']
					}
				}
			};
		},
		onLoad() {

			console.log('on load');
			// console.log(this.projectNames);
			// console.log(this.dailyTaskTypes);
			// console.log(this.dailyReceiveNames);
			// 进来加载数据填充Form Data
			this.loadFormDataInfo();

			// if (!!logForm) {
			// 	let tempForm = {
			// 		//项目id
			// 		projectId: logForm.projectId,
			// 		//任务类型 开发 测试
			// 		taskType: logForm.taskType,
			// 		//日志日期
			// 		dailyDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
			// 		//工作时长
			// 		workTime: logForm.workTime,
			// 		//加班时长
			// 		overTime: logForm.overTime,
			// 		//工作内容
			// 		content: '',
			// 		//接收人
			// 		dailyReceiveIdList: logForm.dailyReceiveIdList
			// 	};
			// 	this.form = tempForm;
			// console.log(
			// this.projectNames.filter(r=>{
			// 	r.id = logForm.projectId
			// })
			// )
			// }
		},
		onReady() {
			console.log('App Ready');
			// 请求token过期之后，401跳转登录之后需要进来加载数据填充Form Data
			this.loadFormDataInfo();
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.wForm.setRules(this.rules);
		},
		mounted() {
			// this.$refs.wForm.setRules(this.rules);
		},
		onShow: function() {
			//缓存被清理之后 切换页面就可以恢复数据
			this.restoreFormDataInfo();
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		watch: {
			searchValue(newValue, oldValue) {
				if (newValue) {
					this.searchPopShow = true;
				} else {
					this.searchPopShow = false;
				}
			}
		},
		computed: {},
		methods: {
			loadFormDataInfo() {
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

						let logForm = uni.getStorageSync(LOG_FORM_DATA);
						if (logForm) {
							//项目id
							this.form.projectId = logForm.projectId;
							//任务类型 开发 测试
							this.form.taskType = logForm.taskType;
							//日志日期
							this.form.dailyDate = uni.$u.timeFormat(new Date(), 'yyyy-mm-dd');
							//工作时长
							this.form.workTime = logForm.workTime;
							//加班时长
							this.form.overTime = logForm.overTime;
							//工作内容
							this.form.content = '';
							//接收人
							this.form.dailyReceiveIdList = logForm.dailyReceiveIdList;

							console.log("form " + JSON.stringify(this.form));
							//重新加载接收人
							this.loadReceiverName();
							this.loadProjectName();
							this.loadTaskType();
						}


					} else {
						console.log('remote load data');
						this.getFormDataInfo();
					}
				}
			},
			//缓存被清理之后 切换页面就可以恢复数据
			restoreFormDataInfo() {
				let projectNameList = uni.getStorageSync(PROJECT_NAME_LIST);
				let dailyTaskTypeList = uni.getStorageSync(DAILY_TASK_TYPE_LIST);
				let dailyReceiveList = uni.getStorageSync(DAILY_RECEIVE_LIST);
				let logForm = uni.getStorageSync(LOG_FORM_DATA);
				if (!(!!projectNameList && !!dailyTaskTypeList && !!dailyReceiveList)) {
					this.projectNames = null;
					this.dailyTaskTypes = null;
					this.dailyReceiveNames = null;
					this.getFormDataInfo();
				}
			},
			async getFormDataInfo() {
				await getProjectNames().then(res => {
					let arr = new Array();
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
					this.projectNames = arr;
					uni.setStorageSync(PROJECT_NAME_LIST, this.projectNames);
				});
				await getDailyTaskTypes().then(res => {
					let arr = new Array();
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
					this.dailyTaskTypes = arr;
					uni.setStorageSync(DAILY_TASK_TYPE_LIST, this.dailyTaskTypes);
				});
				await getDailyReceives().then(res => {
					let arr = new Array();
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
				this.form.projectName = e.value[0].name;
				this.form.projectId = e.value[0].id;
			},
			projectPickerCancel() {
				this.showProjectPicker = false;
			},
			taskPickerConfirm(e) {
				this.showTaskPicker = false;
				this.form.taskName = e.value[0].name;
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
			//日志收件人选中
			cbChange(e) {
				console.log('当前cbChange值为: ' + e);
				if (e) {

					this.dailyReceiveDisplayName = '';
					//根据选中id修改对应的checkbox为选中状态
					let receiveName = this.dailyReceiveNames.filter(obj => obj.id == e);
					// console.log(receiveName)
					// console.log(receiveName[0].id)
					// console.log(receiveName[0].name)
					this.dailyReceives.add(receiveName[0]);
					this.showReceive = false;

					// console.log(this.dailyReceives)
					//回显文本
					let names = [];
					let ids = new Array();
					for (let v of this.dailyReceives) {
						console.log(v.name)
						names.push(v.name)
						ids.push(v.id)
					}
					console.log(Array.from(this.dailyReceives))
					this.dailyReceiveDisplayName = names.toLocaleString();
					this.form.dailyReceiveIdList = ids;
					console.log("IdList" + this.form.dailyReceiveIdList);
				}



			},
			openReceivePop() {
				// console.log('openReceivePop' + this.dailyReceiveNames);
				this.searchValue = ''
				this.searchList = this.dailyReceiveNames;
				// this.dailyReceiveNames.forEach(item => {
				// 	item.checked = false;
				// });
				// if (this.form.dailyReceiveIdList.length > 0) {
				// 	this.form.dailyReceiveIdList.forEach(item => {
				// 		this.dailyReceiveNames.forEach(obj => {
				// 			if (obj.id == item) {
				// 				obj.checked = true;
				// 			}
				// 		});
				// 	});
				// }
			},
			// checkboxConfirm() {

			// 	console.log('当前值为: ' + this.form.dailyReceiveIdList);
			// 	this.showReceive = false;
			// 	this.loadReceiverName();
			// },
			submit() {
				this.$refs.wForm.validate().then(valid => {
					// console.log(valid)
					if (valid) {
						console.log(this.form.projectId)
						if (!this.form.projectId) {
							uni.showToast({
								title: '请选择工程名',
								icon: 'error',
								duration: 2000
							});
							return;
						}
						if (!this.form.taskType) {
							uni.showToast({
								title: '请选择任务类型',
								icon: 'error',
								duration: 2000
							});
							return;
						}
						console.log(this.dailyReceiveIdList)
						if (this.dailyReceiveIdList) {
							uni.showToast({
								title: '请选择一个接收人',
								icon: 'error',
								duration: 2000
							});
							return;
						}
						// delete this.form.projectName;
						// delete this.form.taskName;

						console.log('写日志提交:' + JSON.stringify(this.form));
						let dataFrom = [];
						let tempForm = {
							//参数需要
							//项目id
							projectId: this.form.projectId,
							//任务类型 开发 测试
							taskType: this.form.taskType,
							//日志日期
							dailyDate: this.form.dailyDate,
							//工作时长
							workTime: this.form.workTime,
							//加班时长
							overTime: this.form.overTime,
							//工作内容
							content: this.form.content,
							//接收人
							dailyReceiveIdList: this.form.dailyReceiveIdList
						}
						dataFrom.push(tempForm);
						uni.setStorageSync(LOG_FORM_DATA, this.form);
						uni.showToast({
							title: '日志提交成功',
							duration: 2000
						});
						submitDailyLog(dataFrom).then(res => {
							if (res.data.code === 200) {
								//清空内容
								this.form.content = '';
								uni.setStorageSync(LOG_FORM_DATA, this.form)
								uni.showToast({
									title: '日志提交成功',
									duration: 2000
								});
							}
						});
					}
				});
			},
			loadReceiverName() {
				let objArr = [];
				this.dailyReceiveDisplayName = '';
				// 清空checked
				// this.clearChecked();
				//根据选中id修改对应的checkbox为选中状态
				if (this.form.dailyReceiveIdList.length > 0) {
					this.form.dailyReceiveIdList.forEach(item => {
						this.dailyReceiveNames.forEach(obj => {
							if (obj.id == item) {
								objArr.push(obj.name);
							}
						});
					});
				}
				//回显文本
				this.dailyReceiveDisplayName = objArr.toLocaleString();
			},
			loadProjectName() {
				let tempArr = this.projectNames.filter(r => r.id === this.form.projectId)
				this.form.projectName = tempArr[0].name
			},
			loadTaskType() {
				let tempArr = this.dailyTaskTypes.filter(r => r.id === this.form.taskType)
				this.form.taskName = tempArr[0].name
			},
			cleanReciver() {
				// 清空checked
				console.log("cleanReciver start")
				this.dailyReceives.clear();
				this.dailyReceiveDisplayName = ''
				console.log("cleanReciver end")
			},
			// //
			// checkboxDataClear() {
			// 	this.showReceive = false;
			// 	this.form.dailyReceiveIdList = [];
			// 	this.dailyReceiveDisplayName = '';
			// 	this.clearChecked();
			// },
			clickDailyReceive() {
				this.showReceive = true;
				uni.showToast({
					title: '数据加载中，请稍后...',
					icon: 'none'
				});
			},
			getSearchData(value) {
				console.log(value);
				// console.log(this.dailyReceiveNames);
				this.searchList = this.dailyReceiveNames.filter(r => r.name.includes(value));
			},
			searchChange(e) {
				console.log(e);
				this.getSearchData(e);
			}
		}
	};
</script>

<style lang="scss" scoped>
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

	.clean-btn {
		width: 30rpx;
		height: 70rpx;
		margin: 5rpx;
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
</style>
