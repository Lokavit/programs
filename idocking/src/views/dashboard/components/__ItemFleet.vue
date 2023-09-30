<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-16 12:36:35
 * @LastEditTime: 2019-12-17 17:10:48
 -->
<template>
  <div class="item-fleet">
    <item-wrap :title="$t('dashboard.main.titleFleet')" iconName="workbench-fleet" height="250px" @moreEvents="handleMore">
      <ul slot="body" class="tasks" v-if="vesselList.length">
        <li class="item-wrap-row cursor" v-for="(item, index) in vesselList" :key="index" @click="handleViewVessel(item.id, item.name)">
          <div class="text" >{{ index+1 }}. {{ item.name }}</div>
          <div class="value">{{ item.vesselType.name }}</div>
        </li>
      </ul>
      <div v-else slot="body" class="holder-section">{{ $t('common.nothing') }}</div>
    </item-wrap>

    <!-- 船舶详情弹框 -->
    <id-dialog v-model="shipInfoVisible" width="75%" center :footer="false">
      <ship-info-modal v-if="shipInfoVisible" :vesselId="vesselId" @reload="tableReload"></ship-info-modal>

      <template v-slot:title>
        <div class="shipinfo-modal-header">
          <div class="modal-title">
            <svg-icon name="background-boat" width="20" height="20"></svg-icon>
            {{ $t('shipInfo.detailModal.title') }}
          </div>
        </div>
      </template>
    </id-dialog> 
  </div>
</template>

<script>
import ItemWrap from './ItemWrap'
import { getVesselPageList } from '@/api/baseInfo'
import ShipInfoModal from '../../../views/information/shipinfo/modal/ShipInfoModal'

export default {
  components: { ItemWrap, ShipInfoModal},
  data() {
    return {
      vesselId:null,
      vesselList:[],
      tableLoading: false,
      shipInfoVisible: false,
      params: {
        page: 0,
        size: 5
      }
    }
  },
  methods: {
    getData() {
      getVesselPageList(this.params).then(res => {
        this.$store.commit('dashboard/SET_COUNT_VESSEL', res.data.totalElements)
        this.vesselList = res.data.content;
        this.tableLoading = false;
      })
    },

    handleViewVessel(id, name) {
      this.vesselId = id
      this.shipInfoVisible = true
    },

    handleMore() {
      this.$router.push('/information/shipInfo')
    },

    tableReload() {
      
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss">
.quick-wrapper{
  display: flex;
  flex-wrap: wrap;
  padding-left: 20px;
  
  .quick-item{
    flex: 1 1 30%;
    height: 88px;
    margin-bottom: 20px;
    min-width: 65px;
    max-width: 33%;
    .img{
      width: 100px;
      height: 60px;
      margin-bottom: 3px;
      display: inline-block;
      position: relative;
      img{
        width: 100%;
        height: 100%;
      }
      span{
        padding: 2px 5px;
        border-radius:10px 10px 10px 10px ; 
        background: rgb(65,122,187);
        position: absolute;
        color:rgb(255,255,255);
        right: 0;
        bottom: 0;
      }
    }
  }
  .fast{
    .img{
      width: 60px;
    }
  } 
}
.other-ship-type{
  padding: 10px;
  box-sizing: border-box;
  .text{
    display: block;
    color: rgb(173,204,242);
    font-size: 14px;
  }
  .num{
    font-size: 40px;
    color: rgb(65,122,187)
  }
}
</style>