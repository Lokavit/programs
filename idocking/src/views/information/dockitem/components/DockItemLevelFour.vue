<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-31 15:14:11
 * @LastEditTime: 2019-11-13 13:43:31
 -->
<template>
  <div class="dock-item-desc">
    <div class="dock-item-desc-header">
      <div class="dock-item-title">{{ $t('dockItem.detailItem') }}</div>
      <div>
        <span class="dock-item-cell dock-item-code">{{ data && data.code }}</span>
        <span class="dock-item-cell dock-item-name">{{ data && data.name }}</span>
        <span class="dock-item-type">
          &nbsp;&nbsp;&nbsp;&nbsp;{{ $t(dockDetailItemTypeMap(data.type)) }}
        </span>
        <!-- <span class="dock-item-unit" v-if="data.unit">
          &nbsp;&nbsp;&nbsp;&nbsp;{{ $t('specification.overview.addDockDetailItem.unit') }}: {{ data.unit }}
        </span> -->
      </div>
    </div>

    <div class="dock-item-desc-bodyer">
      <!-- <div class="dock-item-desc-bodyer-inner"> -->
        <el-scrollbar>
          <!-- 关键参数 -->
          <div class="dock-item-param-body" >
            <div class="info-title">
              <i class="kft-icon-volumn" style="margin-right:6px;"></i>
              <span>{{ $t('specification.overview.addDockDetailItem.keyParam') }}</span>
            </div>

            <table border="1" v-if="descData && descData.keyParam" class="dock-item-param-table">
              <tr>
                <th>{{ $t('specification.overview.addDockDetailItem.keyParamName') }}</th>
                <th>{{ $t('specification.overview.addDockDetailItem.keyParamValue') }}</th>
              </tr>
              <tr v-for="(item, index) in descData.keyParam" :key="index" class="dock-item-param">
                <td>{{ item.paramName }}</td>
                <td>{{ item.value }}</td>
              </tr>
            </table>


            <div v-else class="dock-item-description">
              {{ $t('common.nothing') }}
            </div>
          </div>

          <!-- 单位 -->
          <div class="dock-item-unit-body" >
            <div class="info-title">
              <i class="kft-icon-volumn" style="margin-right:6px;"></i>
              <span>{{ $t('specification.overview.addDockDetailItem.unit') }}</span>
            </div>

            <div v-if="data.unit">
              &nbsp;&nbsp;&nbsp;&nbsp;
              {{ $t('specification.overview.addDockDetailItem.unit') }}: {{ data.unit }}
            </div>

            <div v-else class="dock-item-description">
              {{ $t('common.nothing') }}
            </div>
          </div>

          <!-- 描述 -->
          <div class="dock-item-desc-body svg-bg-boat">
            <div class="info-title">
              <i class="kft-icon-volumn" style="margin-right:6px;"></i>
              <span>{{ $t('common.description') }}</span>
            </div>
            <div
              v-if="data"
              v-html="data.description || $t('common.nothing')"
              class="dock-item-description">
            </div>
          </div>
        </el-scrollbar>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'dock-item-level-four',
  props:{
    data: Object | Array
  },
  watch: {
    data(newVal) {
      this.descData = newVal
    }
  },
  data() {
    return {
      descData: null
    }
  }
}
</script>

<style lang="scss">
.dock-item-param-body{
  // box-shadow: 0 0 2px 1px #EAEBED;
  // border: 1px solid #EAEBED;
  padding: 20px;
}
.dock-item-param{
  height: 30px;
  line-height: 30px;
  color:#808080;
  &-table{
    width: 100%;
    border-collapse: collapse;
    th,td{
      text-align: left;
      padding: 5px;
      font-size: 13px;
    }
  }
}
.dock-item-unit-body{
  padding: 20px;
  margin-top: 20px;
}
.dock-item-desc-body{
  position:relative;
  margin-top: 20px;
  min-height: 300px;
  padding: 20px;
  // border: 1px solid #EAEBED;
  // box-shadow: 0 0 2px 1px #EAEBED;
}
.dock-item-type, .dock-item-unit{
  font-size: 14px;
}
.dock-item-desc{
  .info-title{
    padding-left: 0!important;
  }
}
</style>