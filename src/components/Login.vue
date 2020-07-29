<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 表单 -->
      <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="LoginRules">
        <!-- user -->
        <el-form-item prop="username">
          <!-- element字体图标 -->
          <el-input prefix-icon="el-icon-s-custom" v-model="loginForm.username" placeholder="请输入用户名">
            <!-- <el-input prefix-icon="iconfont icon-user"> -->
          </el-input>
        </el-form-item>

        <!-- password -->
        <el-form-item prop="password">
          <!-- 自定义字体图标 -->
          <el-input v-model="loginForm.password" :type="isShowPwd ? '' : 'password'" placeholder="请输入密码">
            <i slot="prefix" class="iconfont icon-3702mima" @click="showPwd">
            </i>
          </el-input>
        </el-form-item>

        <!-- submit -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登陆表单数据对象
      loginForm: {
        username: '',
        password: '',
      },
      LoginRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3~10 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6~15 个字符', trigger: 'blur' },
        ],
      },
      isShowPwd: false,
    }
  },
  methods: {
    // 点击显示隐藏密码
    showPwd () {
      this.isShowPwd = !this.isShowPwd
    },

    // 重置登陆表单
    resetLoginForm () {
      const loginForm = this.$refs.loginFormRef
      // element-ui 提供的方法
      loginForm.resetFields()
    },
    // login
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // valid: true false
        if (!valid) return

        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登陆失败')
        } else {
          this.$message.success('登陆成功')
          // 1. 保存登陆之后的token到sessionStorage中
          sessionStorage.setItem('token', res.data.token)
          // 2. 编程式导航跳转到后台主页
          this.$router.replace('home')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      background-color: #fff;
      // z-index: -1;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_form {
      position: absolute;
      bottom: 10px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
