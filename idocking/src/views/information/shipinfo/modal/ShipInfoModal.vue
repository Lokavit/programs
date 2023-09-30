<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-10-30 08:06:29
 -->
<template>
  <div class="shipinfo-modal" v-loading="shipLoading" :element-loading-text="$t('common.loadingTip')">
    <form-mod
      :form-config="baseInfoConfig" 
      :form-data="shipInfoAll"
      label-align="left"
      class="form-mod-padding"
      ref="BASE"
      :syncSave="false"
      @saveIt = "updateBlockInfo($event, 'BASE')"
      :title="$t('shipInfo.detailModal.subTitleBase')"
      :column=3
      :type=2
    >
      <div class="shipinfo-atta">
        <div class="shipinfo-atta-l">
          <annex-photo :file-list="shipPhoto"></annex-photo>
        </div>
        <div class="shipinfo-atta-r">
          <div class="shipinfo-atta-r-title">{{ $t('attachment.other') }}</div>
          <attachments :file-list="attachmentsData" :max-height="125" class="shipinfo-atta-r-con"></attachments>
        </div>
      </div>
    </form-mod>

    <div class="separation-line box-shadow" style="margin:10px 0;"></div>

    <form-mod 
      labelWidth="150px"
      :form-config="shipInfoConfig"
      :form-data="shipInfoAll"
      label-align="left"
      class="form-mod-padding"
      ref="SHIP"
      :syncSave="false"
      @saveIt = "updateBlockInfo($event, 'SHIP')"
      :title="$t('shipInfo.detailModal.subTitleShip')"
      :column=3
      :type=2>
    </form-mod>

    <div class="separation-line box-shadow" style="margin:10px 0;"></div>

    <form-mod
      labelWidth="150px"
      :form-config="paramsConfig"
      :form-data="shipInfoAll"
      label-align="left"
      class="form-mod-padding"
      ref="PARAMS"
      :syncSave="false"
      @saveIt = "updateBlockInfo($event, 'PARAMS')"
      :title="$t('shipInfo.detailModal.subTitleParams')"
      :column=3
      :type=2>
    </form-mod>
  </div>
</template>
<script>
import FormMod from '@/components/FormMod'
import AnnexPhoto from '../components/AnnexPhoto'
import Attachments from '@/components/Attachments'
import BaseInfoMixin from '../mixins/ShipInfoModal-BaseInfo'
import ShipInfoMixin from '../mixins/ShipInfoModal-ShipInfo'
import ParamsMixin from '../mixins/ShipInfoModal-Params'
import { 
  getVesselInfo ,
  shipInfoUpdata
} from '@/api/baseInfo';

export default {
  inject: ['_idialog'],
  name: 'shipInfoModal',
  components: {
    FormMod,
    AnnexPhoto,
    Attachments
  },
  mixins: [ BaseInfoMixin, ShipInfoMixin, ParamsMixin ],
  data() {
    return {
      shipLoading: false,
      shipInfoAll: [],          // 所有数据
      shipPhoto: {},            // 上传照片数据
      attachmentsData: [],      // 附件的数据
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    vesselId: {
      type: Number | String
    }
  },
  methods: {
    _closeDialog(){
      this._idialog.close()
    },

    async updateBlockInfo(blockInfo, formMod){

      let newShipInfo = Object.assign(this.shipInfoAll, blockInfo)

      try {
        await shipInfoUpdata(this.vesselId, newShipInfo);
        this.$emit('reload');
        this.$refs[formMod]._triggerSaveState()
        this.$message({showClose: true,message: this.$t('attachment.saveOk'),type: 'success'})
      } catch (err) {
        console.warn(err)
      }

    },
    getVesselInfo() { // 获取船舶信息数据
      this.shipLoading = true;
      getVesselInfo(this.vesselId).then(res => {
        this.shipInfoAll = res.data;
        this.shipPhoto = res.data.photo;
        this.attachmentsData = res.data.attachments;
        this.shipLoading = false;
      })
    }
  },
  created() {
    this._idialog.children.push(this)
    this.getVesselInfo()
  }
}
</script>
<style lang="scss" scoped>
.shipinfo-atta{
  margin-top: 15px;
  // display: flex;
  &-l{
    width: 280px;
    padding-left: 10px;
  }
  &-r{
    margin-top: 10px;
    flex:7;
    display: flex;
    &-title{
      width: 80px;
      padding-top: 10px;
    }
    &-con{
      flex:1;
    }
  }

  &-r-title{
    font-size: 13px;
    color: #7D7D7D;
    font-weight: bold;
    width: 120px;
    padding-left: 10px;
  }
}
</style>
