<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图 -->
    <el-card>
      <el-table :data="permsLists" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'" type="primary">一级</el-tag>
            <el-tag v-if="scope.row.level == '1'" type="success">二级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {
    request
  } from '@/plugins/http'
  export default {
    name: "Perms",
    data() {
      return {
        permsLists: []
      }
    },
    created() {
      this.getPermsLists()
    },
    methods: {
      getPermsLists() {
        request({
          method: "get",
          url: "/auth/perms/?type=list"
        }).then(res => {
          const {
            status,
            message,
            data
          } = res.data
          if (status !== 200) return this.handlerNotic(message, "error")
          this.permsLists = data
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
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 13px;
  }

  .el-table {
    margin-top: 20px;
    font-size: 13px;
  }

</style>
