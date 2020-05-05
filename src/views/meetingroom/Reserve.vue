<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预定管理</el-breadcrumb-item>
      <el-breadcrumb-item>预定列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索区域 -->
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>


      <el-table :data="meetingRoomLists">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="'http://127.0.0.1:8000' + scope.row.image"
              :preview-src-list="['http://127.0.0.1:8000' + scope.row.image]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="位置" prop="site"></el-table-column>
        <el-table-column label="人数" prop="nums"></el-table-column>
        <el-table-column label="设备" prop="equipment_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" icon="el-icon-s-order"
              @click="showReserveCalendarDialog(scope.row.id)">预定</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <el-dialog title="会议室申请记录" :visible.sync="reserveCalendarDialog" size="30%">
      <el-calendar>
        <template slot="dateCell" slot-scope="{date, data}">
          <p :class="reserveDate.indexOf(data.day) !== -1 ? 'is-selected' : ''" @click='testCalendar(date)'>
            {{ data.day.split('-').slice(2).join('-') }}
            <span v-if="reserveDate.indexOf(data.day) !== -1">
              ✔️
            </span>
          </p>
        </template>
      </el-calendar>
    </el-dialog>

    <el-drawer title="我是标题" :visible.sync="drawerVisible" :with-header="false">
      <span>会议室预定记录表</span>
      <el-table :data="reserveInfos">
        <el-table-column prop="room_name" label="会议室" width="150"></el-table-column>
        <el-table-column prop="begin_datetime" label="开始时间"></el-table-column>
        <el-table-column prop="over_datetime" label="结束时间"></el-table-column>
        <el-table-column prop="meeting_chair" label="主持人"></el-table-column>
      </el-table>
    </el-drawer>

  </div>
</template>

<script>
  import {
    request
  } from '@/plugins/http'
  export default {
    name: "Reserve",
    data() {
      return {
        meetingRoomLists: [],
        addDialogVisible: false,
        reserveCalendarDialog: false,
        drawerVisible: false,
        reserveDate: [],
        reserveInfos: []
      }
    },
    created() {
      this.getMeetingRoomLists()
    },
    methods: {
      // 获取所有的会议室
      getMeetingRoomLists() {
        request({
          method: "get",
          url: '/meeting/'
        }).then(res => {
          const {
            status,
            message,
            data
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          this.meetingRoomLists = data
        })
      },
      // 显示预定会议室的日历视图
      showReserveCalendarDialog(roomid) {
        this.reserveCalendarDialog = true
        request({
          method: "get",
          url: "/reserve/" + "?roomid=" + roomid
        }).then(res => {
          const {
            data,
            message,
            status
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          this.reserveDate = data.date
          this.reserveInfos = data.infos

        })

      },
      testCalendar(day) {
        this.drawerVisible = true
        console.log(day);

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

  .el-calendar-day p {
    margin: 0;
    padding: 20% 0 30% 0;
  }

  .el-calendar-day .is-selected {
    font-size: 22px;
    color: #1989FA;
    padding: 20% 0 24% 0;
  }

</style>
