<template>
  <header class="header_container">
    <div class="header_left">
      <img src="../assets/img/logo.png" />
      <span>e-Building智能化协同管理平台</span>
    </div>
    <div class="header_right">
      <span>Admin，你好！欢迎回来</span>
      <img src="../assets/img/avatar.png" />
      <i class="kft-icon-message"></i>
      <i class="kft-icon-zh"></i>
      <span @dblclick.alt="showCustom">|</span>
      <i class="kft-icon-logout" @click="logout" style="font-size: 12px;"></i>
    </div>

    <template v-if="dialogShow">
      <el-dialog title="表头配置" :visible="dialogShow" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler" width="600px">
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom:20px;">
          <el-form :inline="true" :model="search" size="mini" style="padding:14px 20px 14px 0" @submit.native.prevent>
            <div class="form_row">
              <!-- 第一列 查询输入框 表格列少情况下，需在此处设置最小宽度值 -->
              <aside>
                <KftLabel :label="labels.keyword.value|FormatLabelSuffix"></KftLabel>
                <el-input size="mini" v-model="search.keyword" :placeholder="`请输入${labels.keyword.value}`" @keyup.enter.native="onSubmit" clearable @clear="onSubmit"></el-input>
              </aside>
              <!-- 第二列 查询按钮 -->
              <aside>
                <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-left:40px;">查询</el-button>
              </aside>
            </div>
          </el-form>
        </el-card>

        <div style="padding:0 2em">
          <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
            <template v-for="(item,index) in checkGroup">
              <el-checkbox :key="index" :label="item" style="width:6em">{{item.label}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </div>

        <div slot="footer">
          <el-button type="primary" @click="confirmHandler" size="mini">确 定</el-button>
          <el-button @click="cancelHandler" size="mini">取 消</el-button>
        </div>
      </el-dialog>
    </template>
  </header>
</template>

<script>
import { scheduleConfig } from "./scheduleonfig.js"; // 用于模拟请求后台的配置文件，此处暂时手动一个js
export default {
  name: "Header",
  data() {
    return {
      dialogShow: false, // 对话框隐藏
      labels: {
        keyword: { default: "关键词", custom: "", value: "关键词" }
      },
      /** 查询的from */
      search: {},
      checkGroup: [], // 返回的对应模块表头配置
      checkList: [] // 已选中
    };
  },
  computed: {},
  methods: {
    removeTitles() {
      // localStorage.removeItem("titleData"); // 登出时，移除缓存的描述
    },
    logout() {
      localStorage.removeItem("labelData"); // 登出时，移除缓存的描述
    },

    /**
     * 该提交事件含以下作用：
     * 输入框：输入内容后，请求后台对应的数据，罗列为 checkBox。用于配置。
     * 使用者选定之后，点击确定，将数据递交至后台。作为该企业私有定制
     */
    onSubmit() {
      // 获取 search 对象
      // console.log("查询条件对象:", this.search);
      if (!this.search.keyword) {
        // 查询输入框为空时，返回整个列表数据
        this.$message.info("请输入需要配置的模块");
      }
      if (this.search.keyword) {
        // console.log(`有关键词`);
        this.getDataList();
      }
    },
    /**
     * 根据使用者输入的关键词，请求对应数据集(表头)
     */
    async getDataList() {
      // console.log(`获取对应数据集(表头)`);
      // const res = await
      // this.checkGroup =res;
      this.checkGroup = scheduleConfig;
    },

    /** 隐藏功能，可呼出表头配置对话框 */
    showCustom(event) {
      // console.log(`快捷键 显示自定义`, event);
      this.dialogShow = true; // 显示表头配置对话框
    },

    handleCheckedCitiesChange(value) {
      // console.log(value);
      this.checkList = value;
    },
    /**
     * 对话框的确定事件
     */
    confirmHandler() {
      this.dialogShow = false; // 关闭表头配置对话框
      // 将已选中的 this.checkList 提交至后台
      localStorage.setItem("column", JSON.stringify(this.checkList));
      // console.log(`本地存储:${localStorage.getItem('column')}`);
    },
    /**
     * 对话框的取消事件
     */
    cancelHandler() {
      this.dialogShow = false; // 关闭表头配置对话框
    }
  }
};
</script>
