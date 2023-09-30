<template>
  <div class="test">
    <div class="left">
      <el-tree
        :data="leftTreeData"
        class="left-tree"
        node-key="uniqueId"
        ref="leftTree"
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
    </div>
    <div class="mid">
      <button @click="add"> &nbsp;&nbsp;&nbsp;&nbsp;》&nbsp;&nbsp; </button>
      <br/><br/>
      <button @click="del"> &nbsp;&nbsp;&nbsp;&nbsp;《&nbsp;&nbsp; </button>
      <br/><br/>
      <button @click="doIt"> &nbsp;&nbsp;&nbsp;&nbsp;Do&nbsp;&nbsp; </button>
    </div>
    <div class="right">
      <el-tree
        :data="rightTreeData"
        class="right-tree"
        ref="rightTree"
        default-expand-all
        node-key="uniqueId"
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
    </div>
  </div>
</template>

<script>
import data from './data.json';
import selected from './selected.json';

export default {
  data() {
    return {
      leftTreeData: [],
      rightTreeData: [],
      selectedLineL: null,
      selectedLineR: null
    }
  },
  created() {
    this._transformToTree(data)
  },
  methods: {
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
    handleRNodeClick(data, node, comp) {
      if(node.level === 2) {
        this.selectedLineR = data
      }
    },
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
    _getGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    _transformToTree(rawData) {
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
      this.leftTreeData = result.filter(item => item.code.startsWith('G'))
    },
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
    _assmbleData() {
      const res = []
      this.rightTreeData.forEach(item => {
        item.children.forEach(it => {
          res.push(it)
        })
      })
      return res
    },
    doIt() {
      console.table(this._assmbleData())
    },
    add() {
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
    del() {
      if(this.selectedLineR) {
        this._splitRightData([this.selectedLineR])
      } else {
        let rightCheckedData = this.$refs.rightTree.getCheckedNodes(true, true)
        this._splitRightData(rightCheckedData)
      }
    }
  }
}
</script>

<style lang="less">
.test {
  display: flex;
  width: 900px;
  margin: 0 auto;
  > div.left {
    width: 300px;
  }
  > div.right{
    width:450px;
  }
  > div.mid {
    width:80px!important;
    text-align:center;
    padding-top:100px;
  }

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
      width:216px!important;
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
      width:72px;
    }
  }
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: pink !important;
  }
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-tree-node__content {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #EAEBED;
  }
  .el-tree > .el-tree-node > .el-tree-node__content {
    background-color: #F6F7FB!important;
  }
  .left-tree, .right-tree {
    border:1px solid #EEEFF0
  }
}
</style>