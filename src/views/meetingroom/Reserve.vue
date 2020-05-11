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
      <el-calendar v-if="reserveCalendarDialog">
        <template slot="dateCell" slot-scope="{date, data}">
          <p :class="reserveDate ? (reserveDate.indexOf(data.day) !== -1 ? 'is-selected' : '') : ''"
            @click='showReserveByData(date)'>
            {{ data.day.split('-').slice(2).join('-') }}
            <span v-if="reserveDate? (reserveDate.indexOf(data.day) !== -1): false">
              ✔️
            </span>
          </p>
        </template>
      </el-calendar>
    </el-dialog>

    <el-drawer title="会议室预定记录表" :visible.sync="drawerVisible" @close="closeDrawer" @open="openDrawer"
      :with-header="false" size="40%">
      <span class="reserve-title">会议室预定记录</span>
      <el-table :data="reserveInfosCurrentDate" border stripe>
        <el-table-column prop="room_name" label="会议室" width="150"></el-table-column>
        <el-table-column prop="begin_datetime" label="开始时间"></el-table-column>
        <el-table-column prop="over_datetime" label="结束时间"></el-table-column>
        <el-table-column prop="meeting_chair" label="主持人"></el-table-column>
      </el-table>

      <!-- 新增预订的表单部分 -->

      <span class="reserve-title">创建会议室预订</span>
      <el-form ref="reserveFormRef" :model="reserveForm" :rules="reserveFormRules" label-width="80px">
        <el-form-item label="会议主题">
          <el-input v-model="reserveForm.subject"></el-input>
        </el-form-item>
        <el-form-item label="会议时间">
          <el-time-picker is-range v-model="reserveForm.time" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="与会人员">
          <el-select v-model="reserveForm.participants" filterable multiple clearable placeholder="请选择">
            <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议备注">
          <el-input type="textarea" v-model="reserveForm.remarks"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addReserve">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>

    </el-drawer>
  </div>
</template>

<script>
  import {
    request
  } from "@/plugins/http";
  export default {
    name: "Reserve",
    data() {
      // 会议时间验证：时间是否在工作时间内，是否存在冲突，是否在将来时间段，不超过2周
      var checkTime = (rule, value, callBack) => {
        console.log(value);
        callBack(new Error("会议时间不合法"))
      }
      return {
        meetingRoomLists: [],
        addDialogVisible: false,
        reserveCalendar: true,
        reserveCalendarDialog: false,
        drawerVisible: false,
        // 预订日期数组，包含每一个预订的日期
        reserveDate: [],
        // 预订日期和预订详细信息对象组成的数组
        reserveInfos: [],
        // 按照所选日期展示的预订信息
        reserveInfosCurrentDate: [],
        // 预订会议室form
        reserveForm: {
          name: '',
          subject: '',
          time: '',
          begin_datetime: '',
          over_datetime: '',
          participants: '',
          remarks: '',
          selectedDate: ''
        },
        users: [],
        // 预订信息验证
        reserveFormRules: {
          time: [{
            required: true,
            message: "会议时间必填",
            trigger: "blur"
          }, {
            validator: checkTime,
            trigger: 'blur'
          }],
          subject: [{
            required: true,
            message: "会议主题必填",
            trigger: "blur"
          }]
        }
      };
    },
    created() {
      this.getMeetingRoomLists();
    },
    methods: {
      // 获取所有的会议室
      getMeetingRoomLists() {
        request({
          method: "get",
          url: "/meeting/"
        }).then(res => {
          const {
            status,
            message,
            data
          } = res.data;
          if (status !== 200) return this.handlerNotic(message, "error");
          this.meetingRoomLists = data;
        });
      },
      // 显示预定会议室的日历视图
      showReserveCalendarDialog(roomid) {
        this.reserveCalendarDialog = true;
        request({
          method: "get",
          url: "/reserve/" + roomid
        }).then(res => {
          const {
            data,
            message,
            status
          } = res.data;
          if (status !== 200) return this.handlerNotic(message, "error");
          this.reserveDate = data.date;
          this.reserveInfos = data.infos;
          this.reserveForm.name = roomid
        });
      },
      // 显示选定日期的预订条目数据
      showReserveByData(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        if (month.length == 1) {
          month = "0" + month;
        }
        if (day.length == 1) {
          day = "0" + day;
        }
        var dateTime = year + "-" + month + "-" + day;

        this.drawerVisible = true;
        this.reserveInfosCurrentDate = this.reserveInfos ?
          this.reserveInfos[dateTime] : [];
        this.reserveForm.selectedDate = dateTime
      },
      // 提交预订到后台
      addReserve() {
        // 处理数据
        const begin_time = this.reserveForm.time[0]
        this.reserveForm.begin_datetime = this.reserveForm.selectedDate + " " + begin_time.getHours() + ":" + begin_time
          .getMinutes() + ":" + begin_time.getSeconds()
        const over_time = this.reserveForm.time[1]
        this.reserveForm.over_datetime = this.reserveForm.selectedDate + " " + over_time.getHours() + ":" + over_time
          .getMinutes() + ":" + over_time.getSeconds()
        this.reserveForm.participants = this.reserveForm.participants.join(',')
        // 校验数据
        this.$refs.reserveFormRef.validate(valid => {
          console.log(valid);
          return

        })
        return
        // 提交到后台
        request({
          method: "post",
          url: "/reserve/",
          data: this.reserveForm
        }).then(res => {
          const {
            data,
            message,
            status
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          this.showReserveCalendarDialog(this.reserveForm.name)
          this.drawerVisible = false
          this.reserveForm = {
            name: '',
            subject: '',
            time: '',
            begin_datetime: '',
            over_datetime: '',
            participants: '',
            remarks: '',
            selectedDate: ''
          }

          this.handlerNotic(message, 'success')

        }).catch(err => {
          console.log(err);

          this.handlerNotic("创建新的预订失败，请联系管理员", 'error');

        })

      },
      // 预定义打开的回调函数，获取用户信息
      openDrawer() {
        request({
          method: "get",
          url: "/auth/users/"
        }).then(res => {
          const {
            data,
            status,
            message
          } = res.data
          if (status !== 200) return this.handlerNotic(message, 'error')
          this.users = data
        }).catch(err => {
          this.handlerNotic(err, 'error')
        })
      },
      // 预订页面关闭的回调函数，清空reserveInfosCurrentDate
      closeDrawer() {
        this.reserveInfosCurrentDate = [];

      },
      handlerNotic(message, type) {
        this.$message({
          message: message,
          type: type,
          center: true
        });
      }
    },
    computed: {
      currentDate: {
        get() {
          return new Date();
        },
        set(value) {
          return value;
        }
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

  .el-calendar-day p {
    margin: 0;
    padding: 20% 0 30% 0;
  }

  .el-calendar-day .is-selected {
    font-size: 22px;
    color: #1989fa;
    padding: 20% 0 24% 0;
  }

  .reserve-title {
    display: block;
    margin: 20px auto;
    font-size: 22px;
    text-align: center;
  }

</style>
