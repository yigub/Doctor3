<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <!-- 这里使用了一个滑动组件，让每一个item左滑的时候，能展示出删除按钮 -->
      <van-swipe-cell v-for="(patient, index) in familyList" :key="index">
        <div class="patient-item">
          <div class="info">
            <span class="name">{{ patient.name }}</span>
            <span class="id">{{
              patient.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2')
            }}</span>
            <span>{{ patient.genderValue }}</span>
            <span>{{ patient.age }}岁</span>
          </div>
          <div class="icon" @click="changePopup(patient)">
            <cp-icon name="user-edit-default" />
          </div>
          <div class="tag" v-show="patient.defaultFlag == 1">默认</div>
        </div>
        <!-- 左滑之后展示的内容 -->
        <template #right>
          <van-button
            square
            text="删除"
            type="danger"
            class="delete-button"
            style="height: 100%; margin-left: 0.5px"
            @click="delPatient(patient.id)"
          />
        </template>
      </van-swipe-cell>

      <div class="patient-add" @click="changePopup()">
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
          :title="isEdit ? '修改患者' : '添加患者'"
          right-text="帮助"
          :close-pop="closePop"
        ></cp-nav-bar>

        <!-- popup4.1: 添加表单 -->
        <van-form ref="form" @submit="addOrEdit" v-if="!isEdit">
          <van-cell-group inset>
            <van-field
              name="idCard"
              label="身份证号"
              placeholder="请输入身份证号"
              v-model="addPatient.idCard"
              :rules="idCardRules"
            />
            <van-field
              name="userName"
              label="姓名"
              placeholder="请输入姓名"
              v-model="addPatient.name"
              :rules="nameRules"
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
              >添加
            </van-button>
          </div>
        </van-form>

        <!-- popup4.2: 编辑表单 -->
        <van-form @submit="addOrEdit(editPatient)" v-if="isEdit">
          <van-cell-group inset>
            <van-field
              name="idCard"
              label="身份证号"
              placeholder="请输入身份证号"
              v-model="editPatient.idCard"
              :rules="idCardRules"
            />
            <van-field
              name="userName"
              label="姓名"
              placeholder="请输入姓名"
              v-model="editPatient.name"
              :rules="nameRules"
            />
            <!-- popup5: 用CpRadioBar复选框来设定男女 -->
            <van-field label="性别">
              <template #input>
                <cp-radio-btn
                  :option-list="optionList"
                  v-model:model-value="editPatient.gender"
                ></cp-radio-btn>
              </template>
            </van-field>
            <!-- popoup6: 是否将当前患者设为默认就诊人 -->
            <van-field label="默认就诊人">
              <template #input>
                <van-checkbox icon-size="16px" v-model="editDefaultFlag" />
              </template>
            </van-field>
          </van-cell-group>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit"
              >修改
            </van-button>
          </div>
        </van-form>
      </template>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import {
  getFamilyList,
  editPatientInfo,
  addSinglePatient,
  deletePatientByid
} from '@/services/user'
import type { familyType, Patient, singlePatient, typeEdit } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
import { idCardRules, nameRules } from '@/utils/rules'
import { showConfirmDialog, showToast, type FormInstance } from 'vant'
// 1.定义家庭患者列表，以便在模板里进行遍历
const familyList = ref<familyType>()
// 1.1 把请求家庭档案的代码封装成方法，以便于后续其他地方使用。例如删除患者后，请求一次，修改患者后请求一次，这样就可以避免手动点击刷新按钮
const getFamilyListValue = async () => {
  const res = await getFamilyList()
  familyList.value = res.data
}
onMounted( () => {
  getFamilyListValue()
})

// 2.1 设置响应式变量，控制popup弹出层展示与否
let showPopup = ref(false)
// 2.2 设置一个变量，判断是添加患者还是编辑患者;如果是添加则为false，如果是编辑则为true
const isEdit = ref(false)
// 2.3 这里设置一个编辑患者对象，类型是根据接口所需类型定义的
const editPatient = ref<typeEdit>({
  name: '',
  idCard: '',
  defaultFlag: 0,
  gender: 0,
  id: ''
})
// 2.4 修改响应式变量，控制弹出层展示与否，同时根据传参的不同，判断要弹出层要展示的是添加患者还是编辑患者
const changePopup = (item?: singlePatient) => {
  // 2.5 如果点击的是编辑按钮，则解构出编辑患者接口所需要的患者信息
  if (item) {
    const { id, gender, name, idCard, defaultFlag } = item
    editPatient.value = { id, gender, name, idCard, defaultFlag }
    isEdit.value = true
  }
  showPopup.value = true
}

// 4.弹出层里的应用了cpradiobtn，这是单选框，此处用来选择患者性别
const optionList = [
  { title: '男', value: 1 },
  { title: '女', value: 0 }
]
// 5. 默认值需要转换
//5.1 转换添加患者时的默认值
const defaultFlag = computed({
  get() {
    return addPatient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    addPatient.value.defaultFlag = value ? 1 : 0
  }
})
// 5.2 转换编辑患者时的默认值
const editDefaultFlag = computed({
  get() {
    return editPatient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    editPatient.value.defaultFlag = value ? 1 : 0
  }
})
// 6.获取表单实例，为10里的表单整体验证做准备
const form = ref<FormInstance>()

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
  isEdit.value = false
  // 9.当关闭弹出层时，令其收集的表单数据清空。这里必须要解构initPatient，要不然是同一个对象。
  addPatient.value = { ...initPatient }
}
// 10.添加患者|编辑患者 ：使用同一个弹出层，合并了。添加时对表单整体做验证，验证通过之后则发请求添加患者，验证不通过则抛出错误
const addOrEdit = async (editPatient?: typeEdit) => {
  // 11.如果有传进来的待编辑患者，就进入编辑;否则就添加患者.这里之所以用id，是因为editPatient是一个对象即它为一直真，所以选择其中的某个属性来判断真假
  if (editPatient?.id) {
    await editPatientInfo(editPatient)
    showToast('修改成功')
    getFamilyListValue() //添加成功后发起一次请求，令家庭档案数据更新
    closePop() //添加成功后，自动关闭弹出层
  } else {
    await form.value?.validate()
    await addSinglePatient(addPatient.value)
    showToast('添加成功')
    getFamilyListValue() //添加成功后发起一次请求，令家庭档案数据更新
    closePop() //添加成功后，自动关闭弹出层
  }
}
// 11.根据id删除患者
const delPatient = async (id: string) => {
  await showConfirmDialog({
    title:'温馨提示',
    message:'您确定要删除该患者吗？'
  })
  await deletePatientByid(id)
  showToast('删除成功')
  getFamilyListValue()

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
