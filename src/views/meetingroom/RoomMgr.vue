<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会议室管理</el-breadcrumb-item>
      <el-breadcrumb-item>房间列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="meetingRoomLists" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="12" class="vcenter">
                <el-col :span="6">
                  <el-tag>包含设备</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag closable :type="equipments_type[index]" effect="dark"
                    v-for="(item, index) in scope.row.equipment_name" :key="index"
                    @close="handleDeleteEquipment(scope.row, index)">
                    {{item.name}}
                  </el-tag>
                  <el-button class="button-new-tag" size="small" @click="addEquipment(scope)">添加设备
                  </el-button>
                </el-col>

              </el-col>
              <el-col :span="12">
                <el-col :span="6">
                  <span>会议室图片</span>
                </el-col>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="name" label="会议室名称"></el-table-column>
        <el-table-column prop="site" label="会议室位置"></el-table-column>
        <el-table-column prop="nums" label="容纳人数"></el-table-column>
        <el-table-column prop="room_status" label="会议室状态"></el-table-column>
        <el-table-column prop="add_time" label="添加时间" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="manager" label="录入者"></el-table-column>
      </el-table>
    </el-card>

    <el-tree :data="meetingRoomEquipment" show-checkbox node-key="id" :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]" :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>
  import {
    request
  } from '@/plugins/http'
  export default {
    name: "RoomMgr",
    data() {
      return {
        meetingRoomLists: [],
        // 设备标签样式
        equipments_type: {
          0: 'success',
          1: 'info',
          2: 'warning',
          3: 'danger',
          4: 'primary',
          5: 'default',
          6: 'info',
          7: 'danger',
          8: 'warning',
          9: 'success',
          10: 'primary',
          11: 'default',
          12: 'success',
          13: 'info',
          14: 'warning',
          15: 'danger',
          16: 'primary',
          17: 'default',
          18: 'info',
          19: 'danger',
          20: 'warning',
          21: 'success',
          22: 'primary',
          23: 'default',

        },
        // addEquipmentVisible: [],
        // addEquipmentValue: '',
        meetingRoomEquipment: [],
        defaultProps: {
          label: 'name'
        }
      }
    },
    created() {
      this.getMeetingRoomLists()
    },
    methods: {
      getMeetingRoomLists() {
        request({
          method: "get",
          url: "/meeting/"
        }).then(res => {
          const {
            data,
            message,
            status
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          this.meetingRoomLists = data
          // for (var index = 0; index < this.meetingRoomLists.length; index++) {
          //   this.addEquipmentVisible[index] = false
          // }
        }).catch(err => {
          this.handlerNotic("连接服务器异常", 'error')
        })
      },
      handlerNotic(message, type) {
        this.$message({
          message: message,
          type: type,
          center: true
        });
      },
      dateFormat(row, column, cellValue, index) {
        var datetime = cellValue.split('T')
        return datetime[0] + " " + datetime[1].split('.')[0]
      },
      // 删除会议室设备的函数
      handleDeleteEquipment(infos, index) {
        // 提交数据到后台
        let equipment = []
        for (var i = 0; i < infos.equipment_name.length; i++) {
          equipment[i] = infos.equipment_name[i]
        }
        equipment.splice(index, 1)
        // let equipmentIdList = []
        // for (var i = 0; i < equipment.length; i++) {
        //   equipmentIdList[i] = equipment[i].id
        // }
        infos.equipment = equipment


        request({
          method: "put",
          url: "/meeting/" + infos.id,
          data: infos
        }).then(res => {
          const {
            data,
            message,
            status
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          infos.equipment_name.splice(index, 1)
        })
      },

      addEquipment(index) {
        request({
          method: "get",
          url: "/equipment/"
        }).then(res => {
          const {
            data,
            message,
            status
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          this.meetingRoomEquipment = data
        })

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

  .el-tag {
    margin-left: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .el-tag--default {
    background-color: #344150;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }

</style>
