<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-16 12:36:35
 * @LastEditTime: 2019-12-17 15:12:41
 -->
<template>
  <div class="item-fleet reset-ul-li">
    <item-wrap :title="$t('dashboard.main.titleFleet')" iconName="workbench-fleet" height="250px" :tag=false>
      <div slot="body" class="quick">
        <ul class="quick-wrapper">
          <li 
            class="quick-item cursor"
            v-for="item in fleetList" 
            :key="item.icon" 
            @click="viewVesselInfo(item.vesselId)"
          >
            <div class="img">
              <img v-bind:src="require(`@/assets/vessel/${item.url}`)" alt=""/>
            </div>
            <p class="vessel-name">{{ $t(item.name) }}</p>
          </li>

          <li class="quick-item other-ship-type" @click="gotoVesselList">
            <a class="text cursor">{{ $t('dashboard.main.otherVessel') }}</a>
            <span class="num cursor">{{ otherVesselNum }}</span>
          </li>
        </ul>
      </div>
    </item-wrap>

    <id-dialog v-model="shipInfoVisible" width="75%" center :footer="false">
      <ship-info-modal v-if="shipInfoVisible" :vesselId="vesselId"></ship-info-modal>

      <template v-slot:title>
        <div class="shipinfo-modal-header">
          <div class="modal-title">
            <svg-icon name="background-boat" width="20" height="20"></svg-icon>
            {{ $t('shipInfo.detailModal.title') }}
          </div>
          <!-- <id-button text="shipInfo.detailModal.btnAssign" icon="s-custom" @click="staffAllotVisible=true"  class="btn-personAssign"></id-button> -->
        </div>
      </template>
    </id-dialog> 
  </div>
</template>

<script>
import ItemWrap from './ItemWrap'
import { getVesselPageList } from '@/api/baseInfo'
import VESSEL_TYPE_MAP from './VesselTypeMap'
import ShipInfoModal from '../../information/shipinfo/modal/ShipInfoModal'

export default {
  components: { ItemWrap, ShipInfoModal },
  data() {
    return {
      shipInfoVisible: false,
      vesselId: null,
      fleetList: [],
      otherVesselNum: 0,
      params: {
        page: 0,
        size: 10
      }
    }
  },
  methods: {
    viewVesselInfo(vesselId) {
      this.vesselId = vesselId
      this.shipInfoVisible = true
    },

    gotoVesselList() {
      this.$router.push('/management/information/shipInfo')
    },

    getData() {
      getVesselPageList().then(res => {

        //其他船舶数量
        let size = res.data.content.length
        if(size >= 5) {
          this.otherVesselNum = size - 5
        } else {
          this.otherVesselNum = 0
        }

        this.$store.commit('dashboard/SET_COUNT_VESSEL', size)
        this._transformData(res.data.content)
      })
    },
    _transformData(rawData) {
      let RES = []

      rawData.forEach(rowItem => {
        VESSEL_TYPE_MAP.forEach(vessel => {
          if (rowItem.type.id == vessel.id) {
            RES.push({
              name: rowItem.name,
              url: vessel.url,
              vesselId: rowItem.id
            })
          }
        })
      })

      this.fleetList = RES.slice(0, 5)
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
    margin-bottom: 10px;
    min-width: 65px;
    max-width: 33%;
    text-align: center;
    p{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: #7D7D7D;
    }
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
