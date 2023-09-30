<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-24 13:21:50
 * @LastEditTime: 2019-12-09 14:18:55
 -->
<template>
  <div class="table-view tree-building">
    <div class="table-warpper">
      <el-table
        v-loading="tableLoading"
        :header-cell-style="{
          padding:'8px 0',
          color:'rgba(0,0,0,.7)',
          fontWeight:'900',
          borderBottom:'2px solid rgba(44, 62, 80,.3)'
        }"
        :cell-style="{padding:'4px 0',color:'#2e2f2f'}"
        :data="treeList"
        style="width: 100%"
        row-key="uniqueId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          :show-overflow-tooltip="true"
          :label="$t('quote.overview.tree.number')"
          align="left"
          prop="code"
          width="150">
        </el-table-column>

        <el-table-column
          align="left"
          :show-overflow-tooltip="true"
          :label="$t('quote.overview.tree.name')"
          prop="name">
          <template slot-scope="{ row }">
            <a @click.prevent="rowClickForEdit(row)">
              {{row.name}}
            </a>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="unit"
          :label="$t('quote.overview.tree.unit')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="unitPriceBeforeDiscountF"
          :label="$t('quote.overview.tree.unitPriceBeforeDiscount')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="quantity"
          :label="$t('quote.overview.tree.quantity')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="totalBeforeDiscountF"
          :label="$t('quote.overview.tree.totalBeforeDiscount')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="discountRateF"
          :label="$t('quote.overview.tree.discount')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="subtotalAfterDiscountF"
          :label="$t('quote.overview.tree.disAmount')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="quotationPartyRemark"
          :label="$t('quote.overview.tree.remark')"
        >
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>

<script>
import { getQuotationTree } from '@/api/quote'

export default {
  props:{
    specId: String | Number,
    quotationTree: Object | Array
  },
  watch:{
    quotationTree(newValue) {
      this.transformData(newValue)
      this.treeList = Object.freeze(newValue)
    }
  },
  data() {
    return {
      tableLoading: false,
      treeList: []
    }
  },
  methods: {
    guid() {
      function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    transformData(allTreeData) {
      allTreeData.forEach(firstLevel => {
        firstLevel.children = firstLevel.data
        firstLevel.subtotalAfterDiscount = firstLevel.subtotalAfterDiscountF = 0
        firstLevel.totalBeforeDiscount = firstLevel.totalBeforeDiscountF = 0

        firstLevel.data.forEach(threeLevel => {
          threeLevel.children = threeLevel.detailedItems
          threeLevel.subtotalAfterDiscount = threeLevel.subtotalAfterDiscountF = 0
          threeLevel.totalBeforeDiscount = threeLevel.totalBeforeDiscountF = 0
          threeLevel.discountRate = threeLevel.discountRateF = 0

          // 货币科学计数法
          threeLevel.children.forEach(item => {
            item.uniqueId = item.code + '-' + this.guid()
            // 折后小计 【level 4】
            item.subtotalAfterDiscountF = this.currencyFormat(item.subtotalAfterDiscount, 2)
            // 折前小计 【level 4】
            item.totalBeforeDiscount = item.subtotalAfterDiscount / (1 - item.discount)
            item.totalBeforeDiscountF = this.currencyFormat(item.totalBeforeDiscount, 2)
            // 折前单价 【level 4】
            item.unitPriceBeforeDiscount = item.totalBeforeDiscount / (item.quantity || 1)
            item.unitPriceBeforeDiscountF = this.currencyFormat(item.unitPriceBeforeDiscount, 2)
            // 折扣率   【level 4】
            item.discountRateF = this.discountFormat(item.discount)

            // 累计第三级
            // 折后小计 【level 3】
            threeLevel.subtotalAfterDiscount += parseFloat(item.subtotalAfterDiscount)
            threeLevel.subtotalAfterDiscountF = this.currencyFormat(threeLevel.subtotalAfterDiscount, 2)
            // 折前小计 【level 3】
            threeLevel.totalBeforeDiscount += parseFloat(item.totalBeforeDiscount)
            threeLevel.totalBeforeDiscountF = this.currencyFormat(threeLevel.totalBeforeDiscount, 2)

          })
          threeLevel.uniqueId = threeLevel.code + '-' + this.guid()
          // 折扣率   【level 3】
          threeLevel.discountRate = 1 - threeLevel.subtotalAfterDiscount / threeLevel.totalBeforeDiscount
          threeLevel.discountRateF = this.discountFormat(threeLevel.discountRate)

          // 累计第一级
          // 折后小计 【level 1】
          firstLevel.subtotalAfterDiscount += parseFloat(threeLevel.subtotalAfterDiscount)
          firstLevel.subtotalAfterDiscountF = this.currencyFormat(firstLevel.subtotalAfterDiscount, 2)
          // 折前小计 【level 1】
          firstLevel.totalBeforeDiscount += parseFloat(threeLevel.totalBeforeDiscount)
          firstLevel.totalBeforeDiscountF = this.currencyFormat(firstLevel.totalBeforeDiscount, 2)

          delete threeLevel.detailedItems
        })
        firstLevel.uniqueId = firstLevel.code + '-' + this.guid()
        // 折扣率   【level 1】
        firstLevel.discountRate = 1 - firstLevel.subtotalAfterDiscount / firstLevel.totalBeforeDiscount
        firstLevel.discountRateF = this.discountFormat(firstLevel.discountRate)
        delete firstLevel.data
      })
      
      let res = {
        totalAfterDiscount: 0,
        totalBeforeDiscount: 0
      }
      allTreeData.forEach(item => {
        res.totalAfterDiscount += item.subtotalAfterDiscount
        res.totalBeforeDiscount += item.totalBeforeDiscount
      })

      this.$emit('dataCalcOk', res)
    }
  }
}
</script>

<style lang="scss">

</style>