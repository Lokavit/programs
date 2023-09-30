<!--
 * @Descripttion: 
 * 
 *
 * 表格假分页，前端切数据
 * 【responsibleVesselIds】字段表示用户 “是否已分过船”。.length>0: 已分过船，空数组: 空闲状态
 * 示例数据：
 * [{
 *   "userId": 7,
 *   "name": "Gilbert",
 *   "avatar": "0c19b3d4-6346-42ea-87f8-83e718e25110",
 *   "password": null,
 *   "role": null,
 *   "company": {
 *     "id": 2,
 *     "name": "海皇船舶管理公司",
 *     "type": "MANAGEMENT_COMPANY"
 *   },
 *   "additionalInfo": {},
 *   "enabled": true,
 *   "responsibleVesselIds": [1]
 * }]
 *
 *
 * @Author: border-1px
 * @Date: 2019-12-12 10:58:50
 * @LastEditTime: 2019-12-13 12:39:57
 -->
<template>
  <div class="staff-allot-single">
    <form-search :form-config="formSearchConfig" :column="2" @search="search"></form-search>
    <div class="separation-line box-shadow"></div>

    <div class="table-warpper">
      <el-table
        v-loading="tableLoading"
        :header-cell-style="{
          padding:'8px 0',
          color:'rgba(0,0,0,.7)',
          fontWeight:'900',
          borderBottom:'2px solid rgba(44, 62, 80,.3)'
        }"
        :cell-style="{padding:'4px 0',color:'#2e2f2f',cursor: 'pointer'}"
        :data="pageList"
        style="width: 100%"
        @row-click="rowClick"
      >
        <el-table-column
          :show-overflow-tooltip="true"
          label="#"
          type="index"
          align="left"
          width="50">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="name"
          :label="$t('allotModal.table.name')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="company.name"
          :label="$t('allotModal.table.company')">
        </el-table-column>
    
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="responsibleVesselId"
          :label="$t('allotModal.table.status')">
          <template slot-scope="{ row }">
            <span :class="[row.status ? 'staff-allot-status-true' : 'staff-allot-status-false']">
              {{ $t(staffAllotStatusMap(row.status)) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      :pagination="pagination"
      :page="params.page+1"
      layout="prev, pager, next"
      @sizeChange="sizeChange"
      @currentChange="currentChange">
    </pagination>
  </div>
</template>

<script>
import FormSearch from '@/components/FormSearch'
import Pagination from '@/components/Pagination'
import PaginationMixin from '@/mixins/PaginationMixin'
import { getMemberListForAllot, allotVesselMember } from '@/api/vessel-member'
import { deepCopy } from '@/utils/assist'

export default {
  inject: ['_idialog'],
  components: { FormSearch, Pagination },
  mixins: [ PaginationMixin ],
  props: {
    role: Number | String,
    vesselId: Number | String
  },
  data() {
    return {
      formSearchConfig: [{
        label:'allotModal.search.name',
        key:'name',
        type:'text',
        placeholder:'common.placeholder'
      },{
        label:'allotModal.search.status',
        key:'status',
        type:'select',
        valueType:'string',
        options: [
          {name:'allotModal.table.statusYes', value: true},  // 用户已分船
          {name:'allotModal.table.statusNo', value: false},  // 用户空闲状态
        ],
        placeholder:'common.placeholders'
      }],
      inited:false,
      pageList:[],
      clonePageList: [],
      tableLoading: false
    }
  },
  methods: {
    /**
     * 此方法写得极烂，扩展性极差，需要优化
     */
    search(cond) {

      let filterData = []
      if(cond.name && (cond.status || cond.status === false)) {
        filterData = this.clonePageList.filter(item => item.name.includes(cond.name) && item.status == cond.status)
      } else if (cond.name) {
        filterData = this.clonePageList.filter(item => item.name.includes(cond.name))
      } else if (cond.status || cond.status === false) {
        filterData = this.clonePageList.filter(item => item.status ==cond.status)
      } else {
        filterData = this.clonePageList
      }

      this.pageList = filterData
      this.pagination.total = filterData.length
    },
    
    /**
     * 分配用户
     */
    rowClick(row, column, event) {
      let { userId } = row
      
      // 该用户已分过船,询问是否继续操作
      if(row.status) {
        this.$confirm(
          this.$t('allotModal.tipContent'),  
          this.$t('msgboxLang.title'),
          {
            confirmButtonText: this.$t('msgboxLang.ok'),
            cancelButtonText: this.$t('msgboxLang.cancel'),
            type: 'warning'
          }
        ).then(async () => {
          this.allotVesselMember({ userId, vesselId: this.vesselId }, row, column, event)
        })
      } else {
        // 当前用户处于 "空闲" 状态
        this.allotVesselMember({ userId, vesselId: this.vesselId }, row, column, event)
      }

    },

    allotVesselMember(data, row, column, event) {
      allotVesselMember(data).then(res => {
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})

        this.$emit('selectIt', row, column, event)
        this.$nextTick(() => {
          this._idialog.close()
        })
      })
    },

    /**
     * 存在 responsibleVesselIds 字段, 表示该用户已分过船, .length>0表示已分过船,否则空闲
     */
    _transformData(rawData) {
      rawData.forEach(item => {
        item.responsibleVesselIds.length ? item.status = true : item.status = false
      })

      return deepCopy(rawData)
    },

    // 假分页，所以需要前端自己切数据
    getCurrentPageData() {
      /**
       * this.params.page        第几页(下标0开始好计算)
       * this.pagination.size    每页几条数据
       */
      let startIndex = this.params.page * this.pagination.size
      let endIndex = startIndex + this.pagination.size

      return this.clonePageList.slice(startIndex, endIndex)
    },

    getTableData() {
      if(this.inited) {
        this.pageList = this.getCurrentPageData()
      } else {
        this.inited = true
        
        getMemberListForAllot(this.role).then(res => {
          this.clonePageList = this._transformData(res.data)
          this.pageList = this.getCurrentPageData()
          this.$set(this.pagination, 'total', res.data.length)
        })
      }
    }
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>

<style lang="scss">
.staff-allot-status-true{
  color: #F8835E;
  font-weight: bold;

}
.staff-allot-status-false{
  color: #3CB371;
  font-weight: bold;
}

</style>