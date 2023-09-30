<template>
  <div class="add-spec-modal add-3rd-modal">
    <div class="specadd-header1">
      <div>{{ $t('specification.overview.addDockItem.code') }}</div>
      <div>{{ $t('specification.overview.addDockItem.name') }}</div>
      <div>{{ $t('specification.overview.addDockItem.code') }}</div>
      <div>{{ $t('specification.overview.addDockItem.name') }}</div>
      <div>{{ $t('specification.overview.addDockItem.selfRepair') }}</div>
    </div>
    <div class="specadd-header2">

      <transition name="moveout">
        <div v-if="!filterable" style="position:absolute;z-index:99;width:100%;left:0;top:0;">
          <div class="specadd-header2-inner" v-if="!filterable">
            <div>{{ treeItem1st.code }}</div>
            <div>{{ treeItem1st.name }}</div>
          </div>
        </div>
      </transition>

      <div v-if="filterable">
        <el-input
          v-model="query"
          size="small"
          :placeholder="placeholder"
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
          <el-tree
            :data="leftTreeData"
            class="left-tree"
            node-key="uniqueId"
            ref="leftTree"
            :filter-node-method="filterNode"
            @node-click="handleLNodeClick"
            >
            <div
              @dblclick="handleLNodeDbClick(data.code)"
              slot-scope="{ node, data }"
              :class="[
                'custom-tree-node',
                'custom-tree-node-level-' + node.level 
              ]">
              <div class="code">{{ data.code }}</div>
              <div class="name">{{ data.name }}</div>
              <div class="holder"></div>
            </div>
          </el-tree>
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
        <el-scrollbar style="height:100%">
          <el-tree
            :data="rightTreeData"
            class="right-tree"
            ref="rightTree"
            default-expand-all
            node-key="uniqueId"
            :filter-node-method="filterNode"
            @node-click="handleRNodeClick"
            >
            <div
              @dblclick="handleRNodeDbClick(data.uniqueId, $event)"
              slot-scope="{ node, data }"
              :class="[
                'custom-tree-node',
                'custom-tree-node-level-' + node.level 
              ]">
              <template v-if="node.level === 1">
                <div class="code r-h-code">{{ data.code }}</div>
                <div class="name">{{ data.name }}</div>
              </template>
              <template v-if="node.level === 2">
                <el-input v-model="data.code" class="r-code"></el-input>
                <div class="gutter"></div>
                <el-input v-model="data.name" class="r-name"></el-input>
                <el-checkbox v-model="data.selfRepair" v-if="node.level == 2" class="r-check"></el-checkbox>
              </template>
            </div>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
  </div>

</template>

<script>
import { addSpecificationItems } from '@/api/specification'

export default {
  inject:['_idialog'],
  props: {
    specId: null,
    treeItem1st: Object,
    filterMethod: Function
  },
  data() {
    return {
      query: '',
      placeholder:'请输入搜索内容',
      searching: false,
      filterable: false,
      inputHover: false,
      leftTreeData: [],
      rightTreeData: [],
      selectedLineL: null,
      selectedLineR: null,
      btnSearchActive: false
    }
  },
  computed: {
    inputIcon () {
      return this.query.length > 0 && this.inputHover
        ? 'circle-close'
        : 'search'
    }
  },
  watch: {
    query (val) {
      this.$refs.leftTree.filter(val)
      this.$refs.rightTree.filter(val)
    }
  },
  created() {
    this._idialog.children.push(this)
    this._transformToTree(window.STANDARDTREEALL, this.treeItem1st.code)
  },
  methods: {
    /**
     * 左侧TreeItem被选中
     */
    handleLNodeClick(data, node , comp) {
      if(node.level === 2) {
        this.selectedLineL = data

        // 再次点击已选中的TreeNode,则取消选择
        // if(this.selectedLineL == data) {
        //   this.$refs.leftTree.setCurrentKey(null)
        //   this.selectedLineL = null
        // } else {
        //   this.selectedLineL = data
        // }
      }

      if(node.level === 1) {
        this.$refs.leftTree.setCurrentKey(null)
        this.selectedLineL = null
      }
    },

    /**
     * 右侧TreeItem被选中
     */
    handleRNodeClick(data, node, comp) {
      return;

      if(node.level === 2) {
        this.selectedLineR = data
      }
    },

    /**
     * 左侧TreeItem双击
     */
    handleLNodeDbClick(code) {

      if(code.length === 3) return // 过滤一级节点的双击
      let res = null, breakTop = false

      for (let i of this.leftTreeData) {
        if(breakTop) break
        for (let j of i.children) {
          if (j.code === code) {
            res = j
            breakTop = true
            break
          }
        }
      }

      this._buildRightData([res])
    },

    /**
     * 右侧TreeItem双击
     */
    handleRNodeDbClick(uniqueId, $event) {
      if($event.target.tagName === 'INPUT' || $event.target.tagName === 'SPAN') return
      let res = null, breakTop = false

      for (let i of this.rightTreeData) {
        if(breakTop) break
        for (let j of i.children) {
          if (j.uniqueId === uniqueId) {
            res = j
            breakTop = true
            break
          }
        }
      }

      res && this._splitRightData([res])
    },

    /**
     * 生成GUID，由于TreeItem可以重复添加，但el-tree要求每个TreeItem有唯一的id
     */
    _getGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    /** 
     * 根据体系版本元数据、一级项Code，生成该一级项Tree结构
    */
    _transformToTree(rawData, filterChar) {
      const mapping = {}, result = []

      rawData.forEach(item => {
        if (item.code.length > 1 && item.code.length < 6) {
          let prefix = item.code.substring(0, 3)

          if(mapping[prefix]) {
            mapping[prefix].push({
              ...item, 
              level: 2,
              uniqueId: this._getGuid()
            })
          } else {
            mapping[prefix] = []
          }
        }
      })

      for (let key in mapping) {
        let rawItem = rawData.find(it => it.code === key)

        result.push({
          level: 1,
          children: [],
          id: rawItem.id,
          name: rawItem.name,
          code: rawItem.code,
          uniqueId: this._getGuid(),
        })

        result[result.length - 1]['children'] = mapping[key]
      }
      this.leftTreeData = result.filter(item => item.code.startsWith(filterChar))
    },

    /**
     * 构建右侧Tree
     */
    _buildRightData(leftCheckedData) {

      if(!this.set) {
        this.set = new Set()
        const result = []

        leftCheckedData.forEach(item => { this.set.add(item.code.substring(0, 3)) })

        for(let code_2nd of this.set) {
          let item_2nd = this.leftTreeData.find(it => it.code === code_2nd)

          result.push({ 
            id: item_2nd.id, 
            code: code_2nd, 
            name: item_2nd.name, 
            uniqueId: this._getGuid(), 
            children: []
          })

          leftCheckedData.forEach(item => {
            if(item.code.substring(0, 3) === code_2nd) {
              result[result.length - 1]['children'].push({ ...item, selfRepair: false, uniqueId: this._getGuid() })
            }
          })
        }

        this.rightTreeData = result
      } else {
        leftCheckedData.forEach(item => {
          const code_2nd = item.code.substring(0, 3)

          if(this.set.has(code_2nd)) {
            let index = this.rightTreeData.findIndex(it => it.code === code_2nd)
            this.rightTreeData[index]['children'].push({ ...item, selfRepair: false, uniqueId: this._getGuid() })
          } else {
            this.set.add(code_2nd)
            let item_2nd = this.leftTreeData.find(it => it.code === code_2nd)
            this.rightTreeData.push({
              code: code_2nd,
              id: item_2nd.id,
              name: item_2nd.name,
              uniqueId: this._getGuid(), 
              children: [{ ...item, selfRepair: false, uniqueId: this._getGuid() }] 
            })
          }
        })
      }
    },

    /**
     * 删除右侧Tree节点
     */
    _splitRightData(rightCheckedData) {
      const rightTreeData = this.rightTreeData

      rightCheckedData.forEach(item => {
        const index = rightTreeData.findIndex(it => item.code.startsWith(it.code))
        const childArr = rightTreeData[index]['children']

        for (var i = childArr.length - 1; i >= 0; i--) {
          if(childArr[i].uniqueId === item.uniqueId) {
            childArr.splice(i, 1)
          }
        }
      })
      
      for (var i = rightTreeData.length - 1; i >= 0; i--) {
        if(rightTreeData[i]['children'].length === 0) {
          this.set.delete(rightTreeData[i].code.substring(0, 3))
          rightTreeData.splice(i, 1)
        }
      }
    },

    /**
     * 往右侧Tree添加节点
     */
    handleAdd() {
      // 选中节点 > checkbox选中
      if (this.selectedLineL) {
        this._buildRightData([this.selectedLineL])
      } else {
        let leftCheckedData = this.$refs.leftTree.getCheckedNodes(true, true)
        if(leftCheckedData) {
          this._buildRightData(leftCheckedData)
          this.$refs.leftTree.setCheckedKeys([])
        }
      }
    },

    /**
     * 删除右侧Tree节点
     */
    handleDel() {
      if(this.selectedLineR) {
        this._splitRightData([this.selectedLineR])
      } else {
        let rightCheckedData = this.$refs.rightTree.getCheckedNodes(true, true)
        this._splitRightData(rightCheckedData)
      }
    },

    _save() {
      const items = []
      this.rightTreeData.forEach(item => {
        item.children.forEach(it => {
          it.standardItemId = it.id
          items.push(it)
        })
      })
      
      const data = {
        specificationId: this.specId,
        items
      }

      // 编码、名称不能为空
      let flag = items.some(it => it.code && it.name)
      if(!flag){
        this.$message({showClose: true,message: this.$t('specification.addModal.tipNotNull'),type: 'warning'});
        return;
      }

      addSpecificationItems(data).then(res => {
        this.$message({showClose: true,message: this.$t('common.addOk'),type: 'success'})
        this.$emit('reload')
        this.$nextTick(() => { this._idialog.close() })
      })
    },

    /**
     * 过滤节点，同时过滤左右Tree
     */
    filterNode (value, data) { // tree 筛选
      if (this.filterMethod) {
        return this.filterMethod(value, data)
      }
      if (!value) return true
      return data['name'].indexOf(value) !== -1
    },

    triggerSearch() {
      this.filterable = !this.filterable
      this.btnSearchActive = !this.btnSearchActive
    },

    clearQuery () {
      if (this.inputIcon === 'circle-close') {
        this.query = ''
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';

// 增加三级项，header1偏移
.add-3rd-modal {
  .specadd-header1 {
    > div:nth-child(1) {
      left:26px;
    }
    > div:nth-child(2) {
      left:130px;
    }
    > div:nth-child(3) {
      left:420px;
    }
    > div:nth-child(4) {
      left:620px;
    }
    > div:nth-child(5) {
      right:0;
    }
  }
}

// 增加三级、四级Modal公共样式
.add-spec-modal{

  // 搜索动画
  .moveout-enter, .moveout-leave-to {
    transform: translate3d(0, -50%, 0);
    opacity:0;
  }
  .moveout-leave, .moveout-enter-to {
    transform: translate3d(0, 0, 0);
    opacity:1;
  }
  .moveout-enter-active, .moveout-leave-active {
    transition: all .2s ease
  }

  // 一级标题
  .specadd-header1{
    height:30px;
    position: relative;
    > div {
      height:30px;
      line-height:30px;
      font-weight:bold;
      position:absolute;
      top:0；
    }
  }

  // 标题
  .specadd-header2 {
    height:35px;
    line-height:35px;
    position:relative;
    &-inner{
      display: flex;
      color:#FFF;
      font-weight:bold;
      background-color: $bg-color;
      > div:nth-child(1) {
        width: 130px;
        padding-left:26px;
      }
      > div:nth-child(2) {
        flex: 1;
      }
    }
    .el-input__inner{
      height:30px;
    }
  }

  // 主体
  .specadd-bodyer {
    display: flex;
    border:1px solid #EAEBED;
    > div.left {
      width: 300px;
      border-right:1px solid #EAEBED;
    }
    > div.right{
      width:450px;
      border-left:1px solid #EAEBED;
    }
    > div.mid {
      width:80px!important;
      text-align:center;
      padding-top:100px;
    }
  }

  // 自定义Node节点
  .custom-tree-node {
    width:100%;
    font-size:14px;
    display: flex;
    .code{
      text-align: left;
    }
    .name {
      flex:1;
      width:0;
      overflow:hidden;
      text-align:left;
    }
    .holder{
      width:10px;
    }
    .r-code, .r-name{
      flex:1;
    }
    .r-check{
      width:60px;
      text-align:center;
    }
    .r-h-code{
      width:198px!important;
    }
    .gutter{
      width:20px;
    }
  }
  .custom-tree-node-level-1 {
    .code {
      width:90px;
    }
  }
  .custom-tree-node-level-2 {
    .code {
      // 二级宽度在一级基础上 -18px
      width:85px;
    }
    
  }
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: $menu-text-color !important;
  }
  .el-tree-node.is-current .custom-tree-node-level-2 {
    .code, .name{
      color:#FFF;
    }
  }
  .el-tree-node.is-current 
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-tree-node__content {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #EAEBED;
    span.is-leaf:before{
      content:''
    }
  }
  .el-tree > .el-tree-node > .el-tree-node__content {
    background-color: #F6F7FB!important;
  }
  .left-tree{
    border-right: 1px solid #EAEBED;
  }
  .right-tree {
    border-left:1px solid #EAEBED;
    height:350px;
  }
}
</style>