<template>
	<view>
		<u--form labelPosition="left" :model="form" ref="uForm" class="form">
			<u-form-item label="项目名称" prop="projectName" borderBottom labelWidth='70' @click="showProjectPicker = true"
				ref="uProjectPicker">
				<u--input v-model="form.projectName" border="none" disabled disabledColor="#ffffff"
					placeholder="请选择项目名称"></u--input>
				<u-picker :show="showProjectPicker" :columns="projectNames" keyName='name' @cancel="projectPickerCancel"
					@confirm="projectPickerConfirm"></u-picker>
			</u-form-item>
			<u-form-item label="职位类型" prop="dailyTaskName" borderBottom labelWidth='70' @click="showTaskPicker = true"
				ref="uTaskPicker">
				<u--input v-model="form.dailyTaskName" border="none" disabled disabledColor="#ffffff"
					placeholder="请选择职位类型"></u--input>
				<u-picker :show="showTaskPicker" :columns="dailyTaskTypes" keyName='name' @cancel="taskPickerCancel"
					@confirm="taskPickerConfirm"></u-picker>
			</u-form-item>
			<u-form-item label="日期" prop="dateValue" borderBottom @click="showDate = true; hideKeyboard()"
				ref="dateForm">
				<u--input v-model="form.dateValue" disabled disabledColor="#ffffff" placeholder="请选择日期" border="none">
				</u--input>
				<u-icon slot="right" name="arrow-right"></u-icon>
			</u-form-item>
		</u--form>

		<u-datetime-picker :show="form.showDate" :value="form.dateValue" mode="date" closeOnClickOverlay
			@confirm="datePickerConfirm" @cancel="datePickerClose" @close="datePickerClose"></u-datetime-picker>
	</view>
</template>

<script>
	import {
		getProjectNames,
		getDailyTaskTypes
	} from '@/api/writelog.js'
	export default {
		data() {
			return {

				//项目名称控制picker
				showProjectPicker: false,
				showTaskPicker: false,
				showDate: false,
				//项目名称集合
				projectNames: [],
				dailyTaskTypes: [],

				form: {
					//项目名称
					projectName: '',
					projectId: '',
					dailyTaskName: '',
					dailyTaskId: '',
					dateValue: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
				},
				rules: {
					'projectName': {
						type: 'string',
						required: true,
						message: '请填写工程名',
						trigger: ['blur', 'change']
					},
					dateValue: {
						type: 'string',
						required: true,
						message: '请选择日期',
						trigger: ['change']
					},
				}
			}
		},
		onLoad() {
			getProjectNames().then(res => {
				let arr = [];
				let projectsList = res.data.data;
				for (let i in projectsList) {
					//项目组id
					let projectId = projectsList[i].dailyProjectId;
					//工程英文名
					let projectName = projectsList[i].projectName;
					let obj = {
						'id': projectId,
						'name': projectName
					}
					arr.push(obj)
				}
				this.projectNames = [arr];

			})
			getDailyTaskTypes().then(res => {
				let arr = [];
				let dailyTaskTypeList = res.data.data;
				for (let i in dailyTaskTypeList) {
					//项目组id
					let typeId = dailyTaskTypeList[i].dictCode;
					//工程英文名
					let typeName = dailyTaskTypeList[i].dictLabel;
					let obj = {
						'id': typeId,
						'name': typeName
					}
					arr.push(obj)
				}
				this.dailyTaskTypes = [arr];
			})
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			hideKeyboard() {
				uni.hideKeyboard()
			},
			datePickerClose() {
				this.showDate = false
				this.$refs.uForm.validateField('form.dateValue')
			},
			datePickerConfirm(e) {
				this.showDate = false
				this.form.dateValue = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
				this.$refs.uForm.validateField('form.dateValue')
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
				this.form.dailyTaskName = e.value[0].name;
				this.form.dailyTaskId = e.value[0].id;

			},
			taskPickerCancel() {
				this.showTaskPicker = false;
			}
		}
	}
</script>

<style>
	.form {
		padding: 40upx;
	}
</style>
