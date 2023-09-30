<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-24 13:21:50
 * @LastEditTime: 2019-11-29 14:19:46
 -->
<template>
  <div class="table-view tree-building">
    <el-table
      v-loading="tableLoading"
      style="width: 100%"
      row-key="uniqueId"
      :data="treeData"
      :show-header="false"
      :cell-class-name="cellTinting"
      :cell-style="{padding:'4px 0', color:'#2e2f2f'}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        :show-overflow-tooltip="true"
        align="left"
        min-width="33.3%"
        prop="fullName">
      </el-table-column>

      <el-table-column
        align="right"
        min-width="22.2%"
        prop="amountF1">
      </el-table-column>

      <el-table-column
        align="right"
        min-width="22.2%"
        prop="amountF2">
      </el-table-column>

      <el-table-column
        align="right"
        min-width="22.2%"
        prop="amountF3">
      </el-table-column>

    </el-table>
    <ul class="other-info">
      <li class="label"><span class="label-inner">{{ $t('quote.contrast.labelOther') }}</span></li>
      <li :class="{'cell-tinting-empty': inYardInfos_notHited[0] == 0}"><div class="cell">{{ currencyFormat(inYardInfos_notHited[0]) || PALCEHOLDER }}</div></li>
      <li :class="{'cell-tinting-empty': inYardInfos_notHited[1] == 0}"><div class="cell">{{ currencyFormat(inYardInfos_notHited[1]) || PALCEHOLDER }}</div></li>
      <li :class="{'cell-tinting-empty': inYardInfos_notHited[2] == 0}"><div class="cell">{{ currencyFormat(inYardInfos_notHited[2]) || PALCEHOLDER }}</div></li>
    </ul>

    <!-- 
    <div class="btn-expand" @click="treeExpand">
      <span v-if="!treeExpanded">展开</span>
      <span v-else>收缩</span>
    </div> 
    -->
  </div>
</template>

<script>
import { deepCopy } from '@/utils/assist'
import { getQuotationTree } from '@/api/quote'
import { getReferSpecInfo } from '@/api/specification'

export default {
  props:{
    yardInfo1: Object | Number,
    yardInfo2: Object | Number,
    yardInfo3: Object | Number,
  },
  watch:{
    yardInfo1(newValue) {
      this.column = 1
      this.referSpecId = newValue.referSpecificationId

      // 根据第一次进入时的yardinfo创建tree，inited避免重复生成
      if(!this.inited) {
        this.init(newValue.items)
      } else {
        this.simplify(newValue.items, 1)
      }

      this.inited = true
    },
    yardInfo2(newValue) {
      let that = this

      setTimeout(function(){
        that.column = 2
        that.simplify(newValue.items, 2)
      }, 500)
    },
    yardInfo3(newValue) {
      let that = this

      setTimeout(function(){
        that.column = 3
        that.simplify(newValue.items, 3)
      }, 500)

    }
  },
  data() {
    return {
      referSpecId: null,
      column: -1,
      treeList: [],
      tableLoading: false,
      treeData: [],
      inYardInfo1: [],
      inYardInfo2: [],
      inYardInfo3: [],
      inYardInfos_notHited: [],
      inited: false,           // 是否已经初始化过tree
      treeExpanded: false,     // 展开tree
      
      // 配置
      showFourthLevel: true,  // 显示第四级【暂时不支持false】
      PALCEHOLDER:"—",        // 与最新规格书Item未匹配时的占位
      filterKeys: [           // 过滤字段，避免计算过多的getter、setter浪费性能
        'code',
        'level',
        'align',
        'amount1',
        'amount2',
        'amount3',
        'uniqueId',
        'fullName',
        'children'
      ]
    }
  },
  computed: {
    // 几家船厂对比
    COLUMN_NUM() {
      let NUM = 0
      this.yardInfo1 && NUM++
      this.yardInfo2 && NUM++
      this.yardInfo3 && NUM++

      return NUM
    } 
  },
  methods: {
    // uuid生成(tree要求每个item项具备唯一id)
    guid() {
      function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },

    treeExpand() {
      this.treeExpanded = !this.treeExpanded
      if(this.treeExpanded) {
        
      }
    },

    async init(info) {
      await this.getReferSpecInfo()
      this._buildTree()
      this.simplify(info, 1)
    },

    /**
     * 单元格着色(单色、行最小值)
     * 
     * 1. >=2家船厂启用
     * 2. 3家船厂比价,若最小值多次出现(>=2),最小值不着色
     * 3. 时间复杂度 O(row * 3 * 3)
     */
    cellTinting({row, column, rowIndex, columnIndex}) {
      // column.property       // 列名 
      // row[column.property]  // 列值

      // 与最新版规格书Item未匹配项着色
      if(row[column.property] === this.PALCEHOLDER) {
        return 'cell-tinting-empty'
      }

      // >=2家船厂时，启动着色逻辑(且只计算amount列)
      if(this.COLUMN_NUM >= 2 && columnIndex > 0) {
        let { 
          amount1 = Number.MAX_SAFE_INTEGER, 
          amount2 = Number.MAX_SAFE_INTEGER, 
          amount3 = Number.MAX_SAFE_INTEGER 
        } = row
        let amountArr = [
          amount1 ? amount1 : Number.MAX_SAFE_INTEGER, 
          amount2 ? amount2 : Number.MAX_SAFE_INTEGER,
          amount3 ? amount3 : Number.MAX_SAFE_INTEGER
        ]

        let curColumnAmount = row['amount' + columnIndex] || 0
        let min = Math.min.apply(null, amountArr)
        let acc = amountArr.reduce((a, v) => v === min ? a + 1 : a + 0, 0)

        // 行最小值着色(且最小值多次出现时(>=2),最小值不着色)
        if(min > 0 && min == curColumnAmount && acc <=1) {
          return 'cell-tinting-lowest'
        }
      }    
    },

    /**
     * 清理脏数据
     * 选择询价单会使tree对应节点生成该列的amount字段，重新选择相同列为避免数据干扰，需要进行清理
     */
    clearDirtyData(column) {
      this.treeData.forEach(firstLevel => {
        firstLevel['amount' + column] = 0
        firstLevel['amountF' + column] = this.PALCEHOLDER
        firstLevel.children.forEach(threeLevel => {
          threeLevel['amount' + column] = 0
          threeLevel['amountF' + column] = this.PALCEHOLDER
          threeLevel.children.forEach(fourLevel => {
            fourLevel['amount' + column] = 0
            fourLevel['amountF' + column] = this.PALCEHOLDER
          })
        })
      })
    },

    /**
     * 两个tree求交集，并保留origin tree数据结构，交集部分拷贝到origin tree指定层级
     * 
     * @param  columnData  当前询价单数据
     * @param  column  第几列显示
     */
    simplify(columnData, column) {
      let cloneColumnData = deepCopy(columnData)
      this.clearDirtyData(column)

      // 【data】 第三级
      // 【detailedItems】 第四级

      this.treeData.forEach((treeFirstLevel, level1Index) => {
        treeFirstLevel.children.forEach((treeThreeLevel, level3Index) => {

          let findThreeIndex = cloneColumnData[level1Index].data.findIndex(columnThreeLevel => {
            if (columnThreeLevel.referSpecificationItemId == treeThreeLevel.id &&
              columnThreeLevel.code == treeThreeLevel.code) {
              return true
            }
          })

          // 正确匹配第三级. 其实还有一些边界情况未处理,后期优化
          // 【tree】中的code、id 与 【column】中的code、（referSpecificationItemId、referSpecificationDetailedItemId）匹配
          if (findThreeIndex > -1) {
            let columnThreeLevel = cloneColumnData[level1Index].data[findThreeIndex]
            cloneColumnData[level1Index].data[findThreeIndex]['hit'] = true

            // 如果存在第四级(只有第四级有钱)，进行节点拷贝
            if(treeThreeLevel.children && treeThreeLevel.children.length) {
              treeThreeLevel.children.forEach(treeFourthLevel => {
                let findFourIndex = columnThreeLevel.detailedItems.findIndex(columnFourthLevel => {
                  if (columnFourthLevel.referSpecificationDetailedItemId == treeFourthLevel.id &&
                    columnFourthLevel.code == treeFourthLevel.code) {
                    return true
                  }
                })

                // 正确匹配第四级
                if (findFourIndex > -1) {
                  let columnFourthLevel = cloneColumnData[level1Index].data[findThreeIndex].detailedItems[findFourIndex]
                  cloneColumnData[level1Index].data[findThreeIndex].detailedItems[findFourIndex]['hit'] = true
                  treeFourthLevel['amount' + column] = columnFourthLevel.subtotalAfterDiscount || 0
                  treeFourthLevel['amountF' + column] = this.currencyFormat(columnFourthLevel.subtotalAfterDiscount, 2,this.PALCEHOLDER)
                }
              })
            } else {
              // 第三级下没有子节点，直接赋初值，以便在累计第一级节点时不会出错
              // treeFirstLevel['amount' + column] = 0
              // treeFirstLevel['amountF' + column] = this.PALCEHOLDER
              // console.log(333)
            }
          }
        })
      })

      this['inYardInfo' + column] = cloneColumnData
      this.computed()
    },

    /**
     * 为YardCard准备计算后的数据
     */
    transmitDataToParent() {
      let target = this['yardInfo' + this.column]  // 准备取出目标列中的基础数据(时间。。。)
      let subTotalHited = this.treeData.reduce((total, cur) => total + cur['amount' + this.column], 0)
      let totalNotHited = this.inYardInfos_notHited[this.column - 1]
      // 小计(subTotal) = sum(命中item) + sum(未命中)
      let subTotal = subTotalHited + totalNotHited
      let extraDiscount = target.externalGrandDiscount
      let quotationParty = target.quotationParty
      let offeredAt = target.offeredAt
      let targetMutation = `quote/SET_YARDINFO_${ this.column }`

      this.$store.commit(targetMutation, {
        offeredAt,
        quotationParty,
        extraDiscount,
        subTotal
      })
    },

    /**
     * 获取询价单对应的指定规格书数据
     */
    async getReferSpecInfo() {
      return new Promise(resolve => {
        getReferSpecInfo(this.referSpecId).then(res => {
          this.specItems = res.data.specificationItems
          resolve()
        })
      })
    },

    /**
     * 根据规格书数据生成origin tree所需数据结构
     * 我根据实际情况对数据做了相应裁剪和简单字段映射，过滤掉不需要的字段，避免生成多余的getter、setter影响性能
     */
    _buildTree() {
      this.specItems.forEach(firstLevel => {
        // 【重要】三、四级进行字段映射。JS引擎的引用计数原理，children增加了引用计数，操作origin object不会出错。
        firstLevel.children = firstLevel.data

        firstLevel.children.forEach(threeLevel =>{
          threeLevel.children = threeLevel.specificationDetailedItemDtos
          
          threeLevel.children.forEach(fourLevel => {
            fourLevel.level = 4
            fourLevel.code = fourLevel.code
            fourLevel.budget = fourLevel.budget || 0
            fourLevel.uniqueId = fourLevel.code + '-' + this.guid()
            fourLevel.fullName = fourLevel.code + '.' + fourLevel.name
            fourLevel['amount1'] = fourLevel['amount2'] = fourLevel['amount3'] = 0
            fourLevel['amountF1'] = fourLevel['amountF2'] = fourLevel['amountF3'] = this.PALCEHOLDER
          })
          threeLevel.level = 3
          threeLevel.uniqueId = threeLevel.code + '-' + this.guid()
          threeLevel.fullName = threeLevel.code + '.' + threeLevel.name
          threeLevel.budget = threeLevel.children.reduce((prev, cur) => prev + cur.budget, 0),

          delete threeLevel.specificationDetailedItemDtos
          !this.showFourthLevel && delete threeLevel.children
        })

        firstLevel.uniqueId = firstLevel.code + '-' + this.guid()
        // 如果没报过价，就不显示第一级的汇总(三、四级也不会显示，因为不存在可以计算的值)
        if(firstLevel.children.length) {
          firstLevel.budget = firstLevel.children.reduce((prev, cur) => prev + cur.budget, 0)
        }
        
        delete firstLevel.data
      })

      this.treeData = this.specItems
    },
    computed() {
      // 计算主tree数据
      this.treeData.forEach(firstLevel => {
        firstLevel.children.forEach((threeLevel, index) => {
          // 存在第四级的时候才累计第三级
          threeLevel['amount1'] = (threeLevel.children.reduce((prev, cur) => prev + (cur['amount1'] || 0), 0) || 0)
          threeLevel['amount2'] = (threeLevel.children.reduce((prev, cur) => prev + (cur['amount2'] || 0), 0) || 0)
          threeLevel['amount3'] = (threeLevel.children.reduce((prev, cur) => prev + (cur['amount3'] || 0), 0) || 0)
          // 下面三行不影响算法，只是将货币金额进行格式化
          threeLevel['amountF1'] = this.currencyFormat(threeLevel['amount1'],2, this.PALCEHOLDER)
          threeLevel['amountF2'] = this.currencyFormat(threeLevel['amount2'],2, this.PALCEHOLDER)
          threeLevel['amountF3'] = this.currencyFormat(threeLevel['amount3'],2, this.PALCEHOLDER)
        })

        // 如果没报过价，就不显示第一级的汇总(三、四级也不会显示，因为不存在可以计算的值)
        firstLevel['amount1'] = (firstLevel.children.reduce((prev, cur) => prev + (cur['amount1'] || 0), 0) || 0)
        firstLevel['amount2'] = (firstLevel.children.reduce((prev, cur) => prev + (cur['amount2'] || 0), 0) || 0)
        firstLevel['amount3'] = (firstLevel.children.reduce((prev, cur) => prev + (cur['amount3'] || 0), 0) || 0)

        // 下面三行不影响算法，只是将货币金额进行格式化
        firstLevel['amountF1'] = this.currencyFormat(firstLevel['amount1'],2, this.PALCEHOLDER)
        firstLevel['amountF2'] = this.currencyFormat(firstLevel['amount2'],2, this.PALCEHOLDER)
        firstLevel['amountF3'] = this.currencyFormat(firstLevel['amount3'],2, this.PALCEHOLDER)
      })

      // 各列未命中数据运算
      let inYardInfos_notHited = [0, 0, 0]
      for ( let i = 1; i <= 3; i++ ) {
        this['inYardInfo' + i] && 
        this['inYardInfo' + i].forEach(firstLevel => {
          firstLevel.data && firstLevel.data.forEach(threeLevel => {
            inYardInfos_notHited[i-1] += parseFloat(
              threeLevel.detailedItems && 
              threeLevel.detailedItems.reduce((prev, cur) => {
                return (!cur.hit) ? (prev + (cur.subtotalAfterDiscount || 0) ) : prev
            }, 0) || 0)
          })
        })
      }

      // 未命中的其他项数据格式化
      for(var i = 0; i < inYardInfos_notHited.length; i++) {
        inYardInfos_notHited[i] ? (inYardInfos_notHited[i] = inYardInfos_notHited[i]) : 0
      }
      this.inYardInfos_notHited = inYardInfos_notHited

      this.transmitDataToParent()
    },

    /**
     * 数据变换(递归)
     */
    deepCopy(data) {
      const t = typeOf(data);
      let o;

      if (t === 'array') {
        o = [];
      } else if ( t === 'object') {
        o = {};
      } else {
        return data;
      }

      if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
          o.push(deepCopy(data[i]));
        }
      } else if ( t === 'object') {
        for (let i in data) {
          o[i] = deepCopy(data[i]);
        }
      }
      return o;
    }
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';
.tree-building{
  position: relative;
  .other-info{
    list-style: none;
    display: flex;
    font-size: 12px;
    background-color: #FFFFFF;
    .label{
      text-align: left;
      &-inner{
        padding-left: 26px;
        color: $bg-color;
        font-weight: bold;
      }
    }
    li {
      list-style: none;
      width: 0;
      padding: 0 8px;
      height: 30px;
      line-height: 30px;
      text-align: right;
    }
    li:first-child{
      flex: 3;
    }
    li:not(:first-child){
      flex: 2;
    }
  }
}


// 最低价(深色)
.cell-tinting-lowest{
  background-color: $bg-color!important;
  color: #FFF!important;
}

// 最高价(浅色)
.cell-tinting-highest{
  background-color: $cell-tinting-highest;
  color: #7D7D7D;
}

// 中间价(白色)
.cell-tinting-normal{
  // 默认
}

// 空数据颜色
.cell-tinting-empty{
  .cell {
    color:#CCCCCC;
  }
}

</style>