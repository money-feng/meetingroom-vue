<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会议室管理</el-breadcrumb-item>
      <el-breadcrumb-item>设备列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索添加模块 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索区域 -->
          <el-input
            placeholder="请输入内容"
            v-model="equipmentQuery"
            clearable
            @clear="getEquipmentList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getEquipmentList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="1">
          <!-- 添加按钮 -->
          <el-button
            type='primary'
            @click="addDialogVisible = true"
          >添加</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="equipmentList"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="名称"
          prop="name"
        ></el-table-column>
        <el-table-column
          label="描述"
          prop="infos"
        ></el-table-column>
        <el-table-column
          label="添加时间"
          prop="add_datetime"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="mini"
              icon="el-icon-edit"
              @click="handleEditDialogVisible(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDeleteEquipment(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加设备对话框 -->
    <el-dialog
      title="添加设备"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addEquipmentDialogClose"
    >
      <el-form
        :model="addEquipmentForm"
        label-width="100px"
        class="demo-ruleForm"
        ref="addEquipmentRef"
        :rules="addEquipmentRules"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input v-model="addEquipmentForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="infos"
        >
          <el-input v-model="addEquipmentForm.infos"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddEquipment"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑设备对话框 -->
    <el-dialog
      title="编辑设备信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editEquipmentDialogClose"
    >
      <el-form
        :model="editEquipmentForm"
        label-width="100px"
        class="demo-ruleForm"
        ref="editEquipmentRef"
        :rules="editEquipmentRules"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="editEquipmentForm.name"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="infos"
        >
          <el-input v-model="editEquipmentForm.origin_infos"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditEquipment"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import {
  request
} from '@/plugins/http'
export default {
  name: "EquipmentMgr",
  data () {
    var checkName = (rule, value, callBack) => {
      for (let index = 0; index < this.equipmentList.length; index++) {
        if (value === this.equipmentList[index].name) {
          callBack(new Error("设备名称重复"))
        }
      }
      return callBack();

    };
    return {
      equipmentList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      // 搜索设备的关键词
      equipmentQuery: '',
      // 添加设备对象
      addEquipmentForm: {
        name: '',
        infos: ''
      },
      // 编辑设备对象
      editEquipmentForm: {
        id: '',
        name: '',
        origin_infos: ''
      },
      // 验证添加设备的信息是否符合规则
      addEquipmentRules: {
        name: [{
          required: true,
          message: "设备名必填",
          trigger: 'blur'
        },
        {
          validator: checkName,
          trigger: 'blur'
        }
        ]
      },
      // 验证编辑设备的信息是否符合规则
      editEquipmentRules: {
        origin_infos: [{
          required: true,
          message: "描述信息必填",
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getEquipmentList()
  },
  methods: {
    // 获取所有的设备
    getEquipmentList () {
      request({
        method: 'get',
        url: '/equipment/' + "?name=" + this.equipmentQuery
      }).then(res => {
        const {
          data,
          message,
          status
        } = res.data
        if (status !== 200) return this.handlerNotic(message, 'error')
        this.equipmentList = data

      })
    },
    //   添加设备
    handleAddEquipment () {
      this.$refs.addEquipmentRef.validate(valid => {
        if (!valid) return this.handlerNotic("设备信息填写错误！", 'message')
        request({
          method: 'post',
          url: '/equipment/',
          data: this.addEquipmentForm
        }).then(res => {
          const {
            data,
            message,
            status
          } = res.data
          if (status !== 200) {
            this.handlerNotic(message, 'error')
          } else {
            this.addDialogVisible = false
            this.equipmentList = data
          }
        })
      })
    },
    //   添加设备对话框关闭
    addEquipmentDialogClose () {
      //   关闭的时候清空输入的内容
      this.$refs.addEquipmentRef.resetFields()
    },
    //   删除设备
    handleDeleteEquipment (equipment) {
      this.$confirm("删除此设备，是否确定？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        request({
          method: 'delete',
          url: '/equipment/',
          data: equipment
        }).then(res => {
          const {
            data,
            message,
            status
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          this.handlerNotic(message, 'success')
          this.equipmentList = data
        })
      }).catch(err => {
        this.handlerNotic("操作已取消", 'success')
      })
    },
    // 编辑按钮被点击
    handleEditDialogVisible (equipment) {
      this.editEquipmentForm.id = equipment.id
      this.editEquipmentForm.name = equipment.name
      this.editEquipmentForm.origin_infos = equipment.infos

      this.editDialogVisible = true
    },
    // 编辑设备对话框确定按钮
    handleEditEquipment () {
      this.$refs.editEquipmentRef.validate(valid => {
        if (!valid) return this.handlerNotic("设备信息填写错误！", 'message')
        request({
          method: 'put',
          url: '/equipment/' + this.editEquipmentForm.id,
          data: this.editEquipmentForm
        }).then(res => {
          const {
            data,
            message,
            status
          } = res.data
          if (status !== 200) {
            this.handlerNotic(message, 'error')
          } else {
            this.editDialogVisible = false
            this.equipmentList = data
            this.handlerNotic(message, 'success')
          }
        })

      })
    },
    // 编辑设备对话框Dialog关闭时的回调
    editEquipmentDialogClose () {
      this.$refs.editEquipmentRef.resetFields()
    },
    handlerNotic (message, type) {
      this.$message({
        message: message,
        type: type,
        center: true
      });
    },
    dateFormat (row, column, cellValue, index) {
      var datetime = cellValue.split('T')
      return datetime[0] + " " + datetime[1].split('.')[0]
    },
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
