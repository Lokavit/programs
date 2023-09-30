<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 12:54:59
 * @LastEditTime: 2019-11-12 14:10:23
 -->
<template>
  <div class="spec-overview box-shadow">
    <form-mod
      :form-config="baseInfoConfig"
      :form-data="baseFormData"
      class="form-mod-padding"
      :column=3
      :type=1
      :toolbar=false
      :title="$t('common.baseTitle')">
    </form-mod>
    <div class="separation-line box-shadow"></div>

    <div class="padding">
      <tree-table></tree-table>
    </div>
    
  </div>
</template>

<script>
import FormMod from '@/components/FormMod'
import BaseInfoMixin from './mixins/Edit3rd-BaseInfo'
import LevelListMixin from '@/mixins/LevelListMixin'
import TreeTable from './components/TreeTable'
import { 
  getSpecificationInfo, 
  getStandardTreeAll 
} from '@/api/specification'
import { getProjectInfo } from '@/api/project'

export default {
  components: {
    FormMod,
    TreeTable
  },
  mixins: [BaseInfoMixin, LevelListMixin],
  data() {
    return {
      specId: null,
      baseFormData:{},
      versionId:null     // 标准体系版本ID
    }
  },
  created() {
    this.specId = this.$route.query.id
    this.getData()
  },
  methods: {
    getData() {
      if(this.specId) {
        getSpecificationInfo(this.specId).then(res => {
          const data = res.data
          const versionId = data.standardTreeVersion.id
          const formData = {
            vesselName: data.vessel.name,
            vesselType: data.vessel.type.name,
            createdAt: data.createdAt,
            startAt: data.dockingProject.startAt,
            endAt: data.dockingProject.endAt,
            currencyType: data.currencyType.name,
            versionId: data.standardTreeVersion.name
          }
          this.baseFormData = formData
          this.$store.commit('specification/SET_CURRENCYTYPE', formData.currencyType)

          // 获取标准分类体系树
          if(versionId) {
            if(window.STANDARDTREEALL) return;

            getStandardTreeAll(versionId).then(res => {
              res.data.forEach(item => {
                item.value = item.code
              })
              window.STANDARDTREEALL = res.data
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/variables.scss';

.spec-overview{

}
</style>