<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索区域 -->
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="getUserLists">
            <el-button slot="append" icon="el-icon-search" @click="getUserLists"></el-button>
          </el-input>
        </el-col>
        <el-col :span="1">
          <!-- 添加按钮 -->
          <el-button type='primary' @click="addDialogVisible = true">添加</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userLists" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="部门" prop="department_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_active" active-color="#13ce66" inactive-color="#ff4949"
              @change="changeUserStatue(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="addUserForm.department"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    request
  } from "@/plugins/http";
  export default {
    name: "Users",
    data() {
      // 邮箱合法性验证
      var checkEmail = (rule, value, callBack) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.([a-zA-Z0-9_-])+/;

        if (!regEmail.test(value)) {
          callBack(new Error("邮箱地址不合法"));
        }
        return callBack();
      };
      var checkPhone = (rule, value, callBack) => {
        const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[5-7])[0-9]{8}$/;

        if (regPhone.test(value)) {
          return callBack();
        }
        callBack(new Error("手机号码不合法"));
      };
      return {
        userLists: [],
        query: "",
        addDialogVisible: false,

        // 添加用户的数据
        addUserForm: {
          name: "",
          username: "",
          email: "",
          phone: "",
          department: "",
          is_active: true
        },
        // 用户验证规则
        addUserRules: {
          name: [{
              required: true,
              message: "用户名必填",
              trigger: "blur"
            },
            {
              min: 2,
              max: 4,
              message: "姓名长度2~4个汉字"
            }
          ],
          username: [{
              required: true,
              message: "用户名必填",
              trigger: "blur"
            },
            {
              min: 4,
              max: 16,
              message: "用户名长度4~16个字符",
              trigger: "blur"
            }
          ],
          email: [{
            validator: checkEmail,
            trigger: "blur"
          }],
          phone: [{
            validator: checkPhone,
            trigger: "blur"
          }]
        }
      };
    },
    created() {
      this.getUserLists();
    },
    methods: {
      // 获取用户列表
      getUserLists() {
        request({
          method: "get",
          url: "/auth/users/" + this.query
        }).then(res => {
          const {
            status,
            message,
            data
          } = res.data;
          if (status !== 200) return this.handlerNotic(message, "error");
          this.userLists = data;
        });
      },
      //   变更用户状态
      changeUserStatue(user) {
        console.log(user.is_active);

        request({
          method: "patch",
          url: "/auth/users/" + user.id,
          data: {
            is_active: user.is_active
          }
        }).then(res => {
          const {
            status,
            message,
            data
          } = res.data;
          if (status !== 200) {
            this.handlerNotic(message, "error");
            user.is_active = !user.is_active;
          } else {
            this.handlerNotic(message, "success");
          }
        });
      },
      // close事件监听添加用户对话框关闭
      addDialogClosed() {
        this.$refs.addUserRef.resetFields();
      },
      // 提交数据，添加用户
      addUser() {
        this.$refs.addUserRef.validate(valid => {
          if (!valid) return this.handlerNotic("添加用户数据不正确", "error");
          request({
              method: "post",
              url: "/auth/users/",
              data: this.addUserForm
            })
            .then(res => {
              const {
                status,
                message,
                data
              } = res.data;
              if (status === 201) {
                this.addDialogVisible = false;
                this.handlerNotic(message, "success");
                this.getUserLists();
                return;
              }
              this.handlerNotic("添加用户失败", "error");
            })
            .catch(res => {
              console.log(res);
            });
        });
      },
      // 删除用户
      deleteUser(userid) {
        this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(res => {
            request({
                method: "delete",
                url: "/auth/users/" + userid
              })
              .then(res => {
                const {
                  data,
                  status,
                  message
                } = res.data;
                if (status !== 200) {
                  this.handlerNotic(message, "error");
                  return;
                }
                this.handlerNotic(message, "success");
                this.getUserLists();
              })
              .catch(err => {
                this.handlerNotic("网络请求失败", "error");
              });
          })
          .catch(err => {
            this.handlerNotic("已取消删除", "info");
          });
      },
      handlerNotic(message, type) {
        this.$message({
          message: message,
          type: type,
          center: true
        });
      }
    }
  };

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
