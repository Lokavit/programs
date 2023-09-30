<!--
 * @Descripttion: 
 * 
 * city三级联动后端返回的数据格式：
 * {
 *   "id":0,
 *   "name": "Weihai"
 *   "parent":{
 *     "id":0,
 *     "name": "Shandong"
 *     "parent":{
 *       "id":0,
 *       "name": "China"
 *     }
 *   }
 * }
 * 
 * @Author: border-1px
 * @Date: 2019-12-06 09:34:00
 * @LastEditTime: 2019-12-06 09:34:20
 -->
<template>
  <div class="settings-company box-shadow">
    <div class="settings-company-banner">
      <img :src="require('../../../assets/settings/banner-company.jpg')" style="width:100%">
    </div>
    <form-mod 
      ref="formMod"
      class="form-mod-padding2"
      :form-config = "companyInfoConfig"
      :form-data = "companyInfo"
      :column=2 
      :type=2
      :syncSave=false
      :title="$t('settings.company.title')"
      @cancelIt="cancel"
      @editIt="edit"
      @saveIt="save">
    </form-mod>
  </div>
</template>

<script>
import CompanyInfoMixin from './CompanyInfoMixin'
import { getCompanyInfo, updateCompanyInfo, getRegion } from '@/api/settings-company'
import { deepCopy } from '@/utils/assist'

export default {
  mixins: [ CompanyInfoMixin ],
  data() {
    return {
      companyInfo: null,
      companyId:null,
      city:null,
      inited: false,
    }
  },
  methods: {
    /**
     * 【重要】取消保存时数据回退，重新再编辑需要重新触发组件钩子，以便重新获取三级联动数据
     */
    cancel() {
      this.inited = false
      this.getData()
    },

    edit() {
      /**
       * ids是一个 “逗号分隔的字符串”, 如：“43,234,5721”
       * 需要map将string -> number
       */
      let city = this.$refs['formMod'].formModel.city
      let newIds

      if(city && Array.isArray(city)) {
        newIds = city
      } else {
        let ids = city.id
        newIds = ids.split(',').map(item => parseInt(item))
      }
      this.$refs['formMod'].formModel.city = newIds

    },

    save() {
      this.inited = false

      // 寻找formMod中的指定ref
      // console.log(this.$refs.formMod.$children[0].$children[5].$refs['cascader'].getCheckedNodes())

      // 克隆份提交数据，避免改了city影响界面显示
      let formData = deepCopy(this.$refs['formMod']._getSelfData())
      formData.id = this.companyId
      formData.city = this._transformCityDataToSubmit(formData.city)

      updateCompanyInfo(formData).then(res => {
        this.$refs['formMod']._triggerSaveState()
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})


        console.log(this.$refs['formMod'].formModel.city)
        this.$nextTick(() => {
          this.getRegion()
          this.getData()
        })
      })
    },

    getData() {
      getCompanyInfo().then(res => {
        res.data.city = this._transformCityDataToShow(res.data.city)
        this.companyId = res.data.id
        this.companyInfo = res.data
      })
    },

    /**
     * 获取三级联动数据，懒加载。获取第一级时候id传1
     * id       当前点击节点id
     * level    当前节点所处层级，用于设置叶子节点，停止递归调用
     * resolve  返回组件所需数据(必须)
     */
    getRegion(id, level, resolve) {
      getRegion(id).then(res => {
        res.data.forEach(item => {
          item.parent && delete item.parent
          item.label = item.name,
          item.value = item.id
          item.leaf =  level >= 2
        })
        resolve(res.data)
      })
    },


    /**
     * json转arr，用于驱动组件显示
     * 
     * 查看时的数据结构为：{ name: 'China,Shandong,weihai', id: '43,333,33333' }, formMod会将name字段用于显示
     * 编辑的时候，只需要用id组成的数组来驱动cascader，转换为[43,333,33333] ,数字数组格式
     */
    _transformCityDataToShow(cityDataJson) {
      if(cityDataJson) {
        let level1 = cityDataJson
        let level2 = cityDataJson.parent
        let level3 = cityDataJson.parent.parent

        let level3Id = level3.id
        let level3Name = level3.name
        let level2Id = level2.id
        let level2Name = level2.name
        let level1Id = level1.id
        let level1Name = level1.name

        return {
          name: `${level3Name},${level2Name},${level1Name}`, 
          id: `${level3Id},${level2Id},${level1Id}`
        }
      }
    },

    /**
     * arr转json，用于提交数据给后端
     * 后端定义的city格式如 this.city 所示
     */
    _transformCityDataToSubmit(cityDataArr) {
      let city = {
        id: cityDataArr[2],
        parent: {
          id: cityDataArr[1],
          parent: {
            id: cityDataArr[0]
          }
        }
      }
      return city
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss">
.settings-company{
  /deep/ div.dyform-section .info-title{
    color: #ae5c30;
    font-weight: 800;
  }
  .form-mod-padding2{
    padding: 20px;
  }

  .el-cascader-menu{
    height: 300px;
    overflow: auto;
  }
  &-banner{
    padding: 20px 20px 0 20px;
  }
}

// 通过render渲染cascader
.fix-cascader-popover{
  .el-cascader-panel{
    height: 300px!important;
  }
}
</style>