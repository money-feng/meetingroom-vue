<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会议室管理</el-breadcrumb-item>
      <el-breadcrumb-item>房间列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :data="meetingRoomLists"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="12">
                <el-col :span="6">
                  <span>包含设备</span>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    closable
                    :type="equipments_type[index]"
                    effect="dark"
                    v-for="(item, index) in scope.row.equipment_name"
                    :key="index"
                    @close="handleClose(scope.row, index)"
                  >
                    {{item}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="addEquipmentVisible"
                    v-model="addEquipmentValue"
                    ref="addEquipmentRef"
                    size="small"
                    @keyup.enter.native="handleAddEquipmentInputConfirm(scope)"
                    @blur.native.capture="handleAddEquipmentInputConfirm(scope)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="addEquipment"
                  >添加设备</el-button>
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
        <el-table-column
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="会议室名称"
        ></el-table-column>
        <el-table-column
          prop="site"
          label="会议室位置"
        ></el-table-column>
        <el-table-column
          prop="nums"
          label="容纳人数"
        ></el-table-column>
        <el-table-column
          prop="room_status"
          label="会议室状态"
        ></el-table-column>
        <el-table-column
          prop="add_time"
          label="添加时间"
          :formatter="dateFormat"
        ></el-table-column>
        <el-table-column
          prop="manager"
          label="录入者"
        ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  request
} from '@/plugins/http'
export default {
  name: "RoomMgr",
  data () {
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
      addEquipmentVisible: false,
      addEquipmentValue: ''
    }
  },
  created () {
    this.getMeetingRoomLists()
  },
  methods: {
    getMeetingRoomLists () {
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
      }).catch(err => {
        this.handlerNotic("连接服务器异常", 'error')
      })
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
    // 删除会议室设备的函数
    handleClose (infos, index) {
      // 使用切片将需要删除到设备清理掉
      infos.needDel = index

      // 提交数据到后台
      request({
        method: "put",
        url: "/meeting/" + infos.id,
        data: infos
      }).then(res => {
        console.log(res);
        // infos.equipment_name.splice(index, 1)
      })
    },

    addEquipment () {
      this.addEquipmentVisible = true;
      this.$nextTick(_ => {
        this.$refs.addEquipmentRef.$refs.input.focus();
      });
    },
    //   添加会议室设备的函数
    handleAddEquipmentInputConfirm (infos) {
      let inputValue = this.addEquipmentValue;
      if (inputValue) {
        this.meetingRoomLists[infos.$index].equipment_name.push(inputValue);
      }
      this.addEquipmentVisible = false;
      this.addEquipmentValue = '';
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
</style>
