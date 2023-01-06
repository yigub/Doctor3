<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <div
        class="patient-item"
        v-for="(patient, index) in familyList"
        :key="index"
      >
        <div class="info">
          <span class="name">{{ patient.name }}</span>
          <span class="id">{{
            patient.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2')
          }}</span>
          <span>{{ patient.genderValue }}</span>
          <span>{{ patient.age }}岁</span>
        </div>
        <div class="icon"><cp-icon name="user-edit-default" /></div>
        <div class="tag" v-show="patient.defaultFlag == 1">默认</div>
      </div>
      <div class="patient-add" @click="showPopup = true">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!--popup1: popup 弹出层 ,通过v-model:show来展示弹出层-->
    <van-popup v-model:show="showPopup" position="right">
      <!--popup2: 自定义弹出层内容 -->
      <template #default>
        <!--popup3: 给弹出层加一个导航栏 -->
        <cp-nav-bar
          title="添加患者"
          right-text="帮助"
          :close-pop="closePop"
        ></cp-nav-bar>

        <!-- popup4: 表单 -->
        <van-form ref="form">
          <van-cell-group inset>
            <van-field
              name="idCard"
              label="身份证号"
              placeholder="请输入身份证号"
              v-model="addPatient.idCard"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              name="userName"
              label="姓名"
              placeholder="请输入姓名"
              v-model="addPatient.name"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <!-- popup5: 用CpRadioBar复选框来设定男女 -->
            <van-field label="性别">
              <template #input>
                <cp-radio-btn
                  :option-list="optionList"
                  v-model:model-value="addPatient.gender"
                ></cp-radio-btn>
              </template>
            </van-field>
            <!-- popoup6: 是否将当前患者设为默认就诊人 -->
            <van-field label="默认就诊人">
              <template #input>
                <van-checkbox icon-size="16px" v-model="defaultFlag" />
              </template>
            </van-field>
          </van-cell-group>

          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit"
              >添加</van-button
            >
          </div>
        </van-form>
      </template>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { getFamilyList } from '@/services/user'
import type { familyType, Patient } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
// 1.定义家庭患者列表，以便在模板里进行遍历
const familyList = ref<familyType>()
onMounted(async () => {
  const res = await getFamilyList()
  familyList.value = res.data
})

// 2.设置响应式变量，控制popup弹出层展示与否
let showPopup = ref(false)

// 4.弹出层里的应用了cpradiobtn，这是单选框，此处用来选择患者性别
const optionList = [
  { title: '男', value: 1 },
  { title: '女', value: 0 }
]
// 5. 默认值需要转换
const defaultFlag = computed({
  get() {
    return addPatient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    addPatient.value.defaultFlag = value ? 1 : 0
  }
})

// 7.这是一个空的表单数据，用于，当关闭弹出层的时候，清空表单里的数据。令表单数据等于这个空的表单数据，即可达到关闭时清空表单数据的效果
const initPatient: Patient = {
  name: '',
  idCard: '',
  defaultFlag: 0,
  gender: 0
}
// 8.这是我们最终收集到的表单数据所存储的地方
const addPatient = ref<Patient>({ ...initPatient })

// 3.让弹出层里的导航栏的左键返回按钮，不要返回到上一个路由，而是执行关闭弹出层的功能。关闭弹窗就是控制弹窗显示与否，通过控制响应式变量即可
const closePop = () => {
  showPopup.value = false
  console.log(addPatient.value)
  // 9.当关闭弹出层时，令其收集的表单数据清空。这里必须要解构initPatient，要不然是同一个对象。
  addPatient.value = { ...initPatient }
}
</script>

<style lang="scss" scoped>
.patient-page {
  padding: 0px 0 80px;
  // 这里用深度选择器，写的弹出层的样式
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    // dispaly:flex内容不会换行，加上wrap会换行
    flex-wrap: wrap;
    flex: 1;
    font-size: 14px;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    font-size: 18px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 550;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
  font-size: 14px;
}
// 添加患者信息弹出层
:deep() {
}
</style>
