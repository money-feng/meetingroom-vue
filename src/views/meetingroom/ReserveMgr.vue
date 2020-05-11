<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会议室管理</el-breadcrumb-item>
      <el-breadcrumb-item>审核列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="reserveLists" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column sortable label="会议室名称" prop="room_name"></el-table-column>
        <el-table-column label="会议主题" prop="subject"></el-table-column>
        <el-table-column sortable label="开始时间" prop="begin_datetime" :formatter="dateFormat">
        </el-table-column>
        <el-table-column sortable label="结束时间" prop="over_datetime" :formatter="dateFormat">
        </el-table-column>
        <el-table-column label="主持人" prop="meeting_chair"></el-table-column>
        <el-table-column label="参与人" prop="meeting_participants"></el-table-column>
        <el-table-column label="备注" prop="remarks"></el-table-column>
        <el-table-column label="状态" prop="reserve_status"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="审核通过" placement="top" :enterable="false">
              <el-button size="mini" type="success" icon="el-icon-check" circle
                @click="handleCheckReserve(scope.row, 0)">
              </el-button>
            </el-tooltip>
            <el-tooltip content="拒绝申请" placement="top" :enterable="false">
              <el-button size="mini" type="danger" icon="el-icon-close" circle
                @click="handleCheckReserve(scope.row, 1)"></el-button>
            </el-tooltip>
            <el-tooltip content="会议未举行" placement="top" :enterable="false">
              <el-button size="mini" type="info" icon="el-icon-edit" circle @click="handleCheckReserve(scope.row, 4)">
              </el-button>
            </el-tooltip>
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
    name: "ReserveMgr",
    data() {
      return {
        reserveLists: []
      }
    },
    created() {
      this.getReserveLists()
    },
    methods: {
      // 获取所有状态为发起的申请条目
      getReserveLists() {
        request({
          method: "get",
          url: "/reserve/"
        }).then(res => {
          const {
            data,
            status,
            message
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          this.reserveLists = data
        }).catch(err => {
          this.handlerNotic(err, 'error')
        })
      },
      //   处理会议室申请的响应函数，在点击操作按钮时候触发
      handleCheckReserve(infos, status) {
        if (infos.status !== 2 && status !== 4) {
          return this.handlerNotic("不允许操作已经结束的申请条目！", 'error')
        }
        var res
        switch (status) {
          case 0:
            res = "通过"
            break;
          case 1:
            res = "拒绝"
            break;
          case 4:
            res = "撤销"
            break;
          default:
            break;
        }
        this.$confirm(res + "此时间段的申请，是否确定?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          request({
            method: 'patch',
            url: '/reserve/' + infos.id,
            data: {
              'status': status
            }
          }).then(res => {
            const {
              data,
              message,
              status
            } = res.data
            if (status !== 200) return this.handlerNotic(message, 'error')
            this.getReserveLists()
            this.handlerNotic(message, 'success')
          })
        }).catch(err => {
          this.handlerNotic("操作已取消", 'success')
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
