<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片列表 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加</el-button>
        </el-col>
      </el-row>

      <!-- 添加表格 -->
      <el-table :data="roleLists" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['row-border-bottom', i1 === 0? 'row-border-top': '', 'vcenter']"
              v-for="(item1, i1) in scope.row.role_perms" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>
                  {{item1.name}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染次级别权限 -->
              <el-col :span="19">
                <el-row :class="[i2===0? '': 'row-border-top', 'vcenter']" v-for="(item2, i2) in item1.children"
                  :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable>{{item2.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col :span="3" v-for="item3 in item2.children" :key="item3.id">
                        <el-tag type="danger" closable @close="deletePerms(scope.row.id, item3.id)">{{item3.name}}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="role_name"></el-table-column>
        <el-table-column label="角色描述" prop="role_desc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
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
    name: "Roles",
    data() {
      return {
        roleLists: []
      }

    },
    created() {
      this.getRoleLists()
    },
    methods: {
      // 获取角色列表
      getRoleLists() {
        request({
          method: "get",
          url: "/auth/roles/"
        }).then(res => {
          const {
            data,
            status,
            message
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          this.roleLists = data

        }).catch(err => {
          return this.handlerNotic("网络异常", 'error')

        })
      },
      //   删除权限
      deletePerms(roleid, permid) {
        this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            method: "delete",
            url: "/auth/roles/" + roleid,
            data: {
              permid: permid
            }
          }).then(res => {
            console.log(res);

          }).catch(() => {
            this.handlerNotic("删除失败，连接服务器异常", 'info')
          })
        }).catch(() => {
          this.handlerNotic("已取消删除", 'info')
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

</script>>

<style scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 13px;
  }

  .el-table {
    margin-top: 20px;
    font-size: 13px;
  }

  .el-tag {
    margin: 7px;
  }

  .row-border-bottom {
    border-bottom: 1px solid #eee;
  }

  .row-border-top {
    border-top: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }

</style>
