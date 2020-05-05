<template>
  <div class="login-wrap">
    <el-form class="login-form" ref="loginFormRef" label-position="left" label-width="0px" :model="formData"
      :rules="loginFormRules">
      <h2 class="login-title">会议室预定管理系统</h2>
      <el-form-item>
        <el-input prefix-icon="el-icon-user" v-model="formData.username" placeholder="用户名/手机/邮箱"></el-input>
      </el-form-item>
      <el-form-item prop='password'>
        <el-input prefix-icon="el-icon-lock" v-model="formData.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin" class="login-button" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  import {
    request
  } from '@/plugins/http'
  export default {
    name: "Login",
    data() {
      return {
        formData: {
          username: 'admin',
          password: '123'
        },
        loginFormRules: {
          password: [{
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 16,
              message: "长度在2到16个字符",
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleLogin() {
        this.$refs.loginFormRef.validate(valid => {
          if (!valid) return;
          request({
              method: "post",
              url: '/auth/login/',
              data: this.formData
            })
            .then(res => {
              const {
                message,
                status,
                token
              } = res.data;
              if (status === 200) {
                this.handlerNotic(message, 'success')
                sessionStorage.setItem('token', token)
                this.$router.push({
                  'name': 'home'
                })
              } else {
                this.handlerNotic(message, 'error')
              }

            })

        })
      },
      handlerNotic(message, type) {
        this.$message({
          message: message,
          type: type,
          center: true
        });
      }
    }
  }

</script>
<style scoped>
  .login-wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .login-wrap .login-title {
    margin: 0 0 20px 0;
    text-align: center;

  }

  .login-wrap .login-form {
    width: 300px;
    background-color: #fff;
    padding: 30px;
    border: 1px solid;
    border-radius: 5px;
  }

  .login-wrap .login-button {
    width: 100%;
  }

</style>
