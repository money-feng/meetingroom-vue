<template>
  <el-container class="container">
    <el-header class="header">
      <div>
        <span>会议预定系统</span>
      </div>
      <el-button type="info" @click="handlerLogout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside class="aside" :width="isCollapse ? '64px':'200px' ">
        <div class="toggle-button" @click="handleToggleCollapse">|||</div>
        <el-menu :default-active="activePath" background-color="#324152" unique-opened text-color="#fff"
          active-text-color="#0078D7" :collapse="isCollapse" :collapse-transition="false" router>
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="item.style"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key=subItem.id
              @click="handleSaveActive('/' + subItem.path)">
              <i :class="subItem.style"></i>
              <span>{{subItem.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {
    request
  } from '@/plugins/http'
  export default {
    name: "Home",
    data() {
      return {
        menuList: [],
        // aside是否缩放
        isCollapse: false,
        // 当前激活链接
        activePath: ''
      };
    },
    created() {
      // 页面加载就调用生成菜单函数
      this.getMenuList()
      this.activePath = sessionStorage.getItem('activePath')
    },
    methods: {
      // 获取菜单函数
      getMenuList() {
        request({
            method: 'get',
            url: '/auth/perms/'
          })
          .then(res => {
            const {
              data,
              status,
              message

            } = res.data
            if (status !== 200) return this.handlerNotic(message, 'error')
            this.menuList = data
          })
      },
      // 弹窗提示封装
      handlerNotic(message, type) {
        this.$message({
          message: message,
          type: type,
          center: true
        });
      },
      // 追销登录，清空token
      handlerLogout() {
        sessionStorage.clear()
        this.$router.push('/login')
      },
      // 点击按钮，菜单折叠或点开
      handleToggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      // 保存二级菜单的激活状态
      handleSaveActive(url) {
        sessionStorage.setItem('activePath', url)
        this.activePath = url
      }
    }
  }

</script>

<style scoped>
  .container {
    height: 100%;
  }

  .container .header {
    background-color: #324152;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: honeydew;
  }

  .container .main {
    background-color: #E9EEF3;
    color: #333;
    height: 100%;
  }

  .container .aside {
    background-color: #324152;
    color: #333;
  }

  .container .aside .el-menu {
    border: 0;
  }

  .container .aside .toggle-button {
    color: gainsboro;
    text-align: center;
    cursor: pointer;
    background-color: #373C41;
    font-size: 10px;
    line-height: 20px;
    letter-spacing: 0.2em;
  }

</style>
