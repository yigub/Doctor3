/*
  给components文件夹下的全局组件设置类型
  给这些全局组件设置类型了之后，以后再去其他用到这个组件为其添加属性或事件时，就会有提示了。并且不需要手动引入，
  因为不知道下载了个啥插件已经帮我们自动引入了
*/

// 1.首先导入cpnavbar,cpicon组件实例
import CpNavBar from '@/components/CpNavBar.vue'
import CpIcon from '@/components/CpIcon.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
// 2.声明vue类型模块
declare module 'vue' {
  // 3.给vue添加全局组件类型
  interface GlobalComponents {
    // 4.给cpnavbar,cpicon组件添加类型，typeof作用是获取到组件实例的类型
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    // 5.给cpradiobtn单选框组件添加类型
    CpRadioBtn: typeof CpRadioBtn
  }
}
