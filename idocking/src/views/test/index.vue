<template>
  <div class="test">
    <div class="left">
      <el-tree
        :data = "leftData"
        ref="leftTree"
        show-checkbox>
      </el-tree>
    </div>
    <div class="mid">
      <button @click="add"> &nbsp;&nbsp;&nbsp;&nbsp;》&nbsp;&nbsp; </button>
    </div>
    <div class="right">
      <el-tree
        :data = "rightData"
        ref="rightTree"
        show-checkbox>
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
      leftData: [],
      rightData: []
    }
  },
  created() {
    this._transformToTree(data)
    // this._transformSelected(selected)
  },
  methods: {
    _transformToTree2(rowData) {
      const res = []
      const map = {}

      rowData.forEach(item => {
        if (item.code.startsWith('G') && item.code.length > 1 && item.code.length < 6) {
          if (item.code.length === 3) {
            map[item.code] = []
          } else {
            let start = item.code.substring(0, 3)
            if(map[start]) {
              map[start].push(item)
            } else {
              map[start] = []
            }
          }
        }
      })

      for (let item in map) {
        let top = rowData.find(it => it.code === item)

        res.push({
          code: top.code,
          label: top.name + ' — ' + top.code,
          id: top.id,
          children: []
        })

        res[res.length - 1]['children'] = this._transformKey(map[item])
      }

      this.leftData = res
    },
    _transformToTree(rowData) {
      const map = {}

      rowData.forEach(item => {
        if(item.code.lenght === 3) {
          map[item.code] = []
        } else {
          let prefix = item.code.substring(0, 3)
          if(map[prefix]) {
            map[prefix].push(item)
          } else {
            map[prefix] = []
          }
        }
      })

      console.log(rowData)
    },
    _transformKey(rowData) {
      const res = []

      rowData.forEach(item => {
        res.push({
          code: item.code,
          label: item.name + ' — ' + item.code,
          id: item.id
        })
      })

      return res
    },
    _buildRightData(rowData) {

    },
    add() {
      let leftCheckedData = this.$refs.leftTree.getCheckedNodes()
      console.log(leftCheckedData)

      // this._buildRightData(leftCheckedData)
      this.rightData = leftCheckedData
    }
  }
}
</script>

<style lang="scss">
.test {
  display: flex;
  width: 800px;
  margin: 0 auto;
  > div:not(.mid) {
    flex:1;
  }
  > div.mid {
    width:80px!important;
    text-align:center;
    padding-top:100px;
  }
}
</style>