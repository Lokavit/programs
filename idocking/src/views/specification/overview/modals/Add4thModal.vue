<template>
  <div class="add-spec-modal add-4th-modal">
    <div class="specadd-header1">
      <div>{{ $t('specification.overview.addDockDetailItem.code') }}</div>
      <div>{{ $t('specification.overview.addDockDetailItem.name') }}</div>
      <div>{{ $t('specification.overview.addDockDetailItem.code') }}</div>
      <div>{{ $t('specification.overview.addDockDetailItem.name') }}</div>
      <div>{{ $t('specification.overview.addDockDetailItem.budget') }}</div>
      <div>{{ $t('specification.overview.addDockDetailItem.selfSupply') }}</div>
    </div>
    <div class="specadd-header2">

      <transition name="moveout">
        <div v-if="!filterable" style="position:absolute;z-index:99;width:100%;left:0;top:0;">
          <div class="specadd-header2-inner" v-if="!filterable">
            <div>{{ treeItem3rd.code }}</div>
            <div>{{ treeItem3rd.name }}</div>
          </div>
        </div>
      </transition>

      <div v-if="filterable">
        <el-input
          v-model="query"
          size="small"
          :placeholder="$t('common.placeholder')"
          @mouseenter.native="inputHover = true"
          @mouseleave.native="inputHover = false"
          v-if="filterable">
          <i slot="prefix"
            :class="['el-input__icon', 'el-icon-' + inputIcon]"
            @click="clearQuery"
          ></i>
        </el-input>
      </div>

    </div>
    <div class="specadd-bodyer">
      <div class="left" style="max-height:350px;min-height:350px;">
        <el-scrollbar style="height:100%">
          <ul>
            <li 
              v-for="(it, index) in leftTreeDataCopy" 
              @click="handleLNodeClick(index)"
              @dblclick="handleAdd"
              :key="index" 
              :class='[
                "item-4th",
                { "is-current": index === rowLIndex }
              ]'
            >
              <div class="code">{{ it.code }}</div>
              <div class="name">{{ it.name }}</div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <div class="mid">
        <id-button icon="search" :active="btnSearchActive" @click="triggerSearch"></id-button>
        <br/><br/>
        <id-button icon="right" @click="handleAdd"></id-button>
        <br/><br/>
        <id-button icon="delete" @click="handleDel"></id-button>
      </div>
      <div class="right" style="max-height:350px;min-height:350px;">
        <el-scrollbar style="height:100%;">
          <ul>
            <li 
              v-for="(it, index) in rightTreeDataCopy" 
              @click="handleRNodeClick(index)"
              @dblclick="handleDel"
              :key="index" 
              :class='[
                "item-4th",
                "custom-tree-node-4th",
                { "is-current": index === rowRIndex }
              ]'
            >
              <el-input v-model="it.code" class="flex1"></el-input><div class="gutter"></div>
              <el-input v-model="it.name" class="flex1"></el-input><div class="gutter"></div>
              <el-input v-model="it.budget" class="flex1"><template slot="append">{{ currencyType }}</template></el-input>
              <el-checkbox v-model="it.selfSupply" class="r-check"></el-checkbox>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>

</template>

<script>
import { addDockDetailItems } from '@/api/specification'
import { debounce } from '@/utils/assist' 
import { mapState } from 'vuex'     

export default {
  inject:['_idialog'],
  props: {
    specId: null,
    treeItem3rd: Object
  },
  data() {
    return {
      query: '',
      timer: null,
      rowLIndex: -1,
      rowRIndex: -1,
      searching: false,
      filterable: false,
      inputHover: false,
      leftTreeData: [],
      rightTreeData: [],
      leftTreeDataCopy: [],
      rightTreeDataCopy: [],
      btnSearchActive: false
    }
  },
  computed: {
    ...mapState({
      currencyType: state => state.specification.currencyType,
      canEdit3rd: state => state.specification.canEdit3rd
    }),
    inputIcon () {
      return this.query.length > 0 && this.inputHover ? 'circle-close' : 'search'
    }
  },
  watch: {
    query(newValue) {
      // input搜索防抖
      debounce(this.filterNode, 500)(newValue)
    }
  },
  created() {
    this._idialog.children.push(this)

    this._transformToTree(
      window.STANDARDTREEALL,
      // 三级编码可能修改，需要用三级编码的originCode
      this.$store.state.specification.originCode3rd  
    )

    // 初始化时，不过滤节点，显示所有数据
    this.filterNode('')

    /**
     * 没有采用computed实现leftTreeDataCopy、rightTreeDataCopy是为了调用防抖函数debounce
     * 代价是，初始化(created)、添加(add)、删除(del)时，都需要手动触发this.filterNode()
     */
  },
  methods: {
    _save() {
      if(!this.rightTreeData.length) return
      const data = {
        specificationItemId: this.treeItem3rd.id,
        detailItems: this.rightTreeData.map(item => (item.standardDetailedItemId = item.id, item))
      }

      // 编码、名称不能为空
      let flag = data.detailItems.some(it => it.code && it.name)
      if(!flag){
        this.$message({showClose: true,message: this.$t('specification.addModal.tipNotNull'),type: 'warning'});
        return;
      }

      addDockDetailItems(data).then(res => {
        this.$message({showClose: true, message: this.$t('common.addOk'), type: 'success'})
        this.$nextTick(() => { this._idialog.close() })
        this.$emit('reload')
      })
    },

    filterNode (value) { // tree 筛选
      this.leftTreeDataCopy = this.leftTreeData.filter(item => item.name.indexOf(value) > -1)
      this.rightTreeDataCopy = this.rightTreeData.filter(item => item.name.indexOf(value) > -1)
    },

    triggerSearch() {
      this.filterable = !this.filterable
      this.btnSearchActive = !this.btnSearchActive
    },

    clearQuery () {
      if (this.inputIcon === 'circle-close') {
        this.query = ''
      }
    },

    _transformToTree(treeDataAll, code3rd) {
      this.leftTreeData = treeDataAll.filter(item => {
        return item.code.startsWith(code3rd) && item.code.length > 5
      })
    },

    handleLNodeClick(index) {
      this.rowLIndex = index
    },

    handleRNodeClick(index) {
      this.rowRIndex = index
    },

    handleAdd() {
      if(this.rowLIndex === -1 ) return

      this.rightTreeData.push(
        {
          ...this.leftTreeData[this.rowLIndex], 
          selfSupply: false,
          budget: 0 
        }
      )
      this.filterNode(this.query)
    },

    handleDel() {
      return;

      if(this.rowRIndex > -1) {
        this.rightTreeData.splice(this.rowRIndex, 1)
        this.rowRIndex = -1
      }
      this.filterNode(this.query)
    }
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';

// 四级项样式
.item-4th{
  display: flex;
  width:100%;
  height:35px;
  line-height:35px;
  border-bottom: 1px solid #EAEBED;
  cursor:pointer;
  &:hover{
    background-color: #F6F7FB;
  }
  &.is-current{
    background-color: $menu-text-color;
    color: #FFF;
  }
  .code {
    width:130px;
    padding-left:35px;
  }
  .name {
    flex: 1;
    width:0;
  }
}

// 增加四级项header1偏移
.add-4th-modal{
  .specadd-header1 {
    > div:nth-child(1) {  // 编码 
      left:26px;
    }
    > div:nth-child(2) {  // 名称
      left:130px;
    }
    > div:nth-child(3) {  // 编码
      left:420px;
    }
    > div:nth-child(4) {  // 名称
      left:558px;
    }
    > div:nth-child(5) {  // 预算
      left:700px;
    }
    > div:nth-child(6) {  // 自供
      right:0;
    }
  }

  .specadd-bodyer {
    > div.right{
      width:500px;        // 四级项的body要宽
      border-left:1px solid #EAEBED;
    }
    .custom-tree-node-4th {
      width:100%;
      font-size:14px;
      display: flex;
      padding-left:20px;
      .flex1{
        flex:1;
      }
      .r-check{
        width:60px;
        text-align:center;
      }
      .gutter{
        width:20px;
      }
      .el-input-group__append{
        padding: 0 6px;
      }
    }
  }
}
</style>