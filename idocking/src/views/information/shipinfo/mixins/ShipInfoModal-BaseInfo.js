/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-15 13:44:39
 */

export default {
  data () {
    return {
      baseInfoConfig: [
        {label:'shipInfo.detailModal.base.labelName', value: '', type: 'text', key: 'name',placeholder:'shipInfo.detailModal.base.holderName'},
        {label:'shipInfo.detailModal.base.labelType', value: '', type: 'select',key: 'vesselType', optionsUrl:'/vessel/type/list',placeholder:'shipInfo.detailModal.base.holderType'},
        {label:'shipInfo.detailModal.base.labelShipId', value: '', key: 'shipIdentificationNumber', type: 'text',placeholder:'shipInfo.detailModal.base.holderShipId'},
        {label:'shipInfo.detailModal.base.labelIMO', value: '', type: 'text', key: 'imo',placeholder:'shipInfo.detailModal.base.holderIMO'},
        {label:'shipInfo.detailModal.base.labelVSat', value:'', type: 'text', key: 'vsat' ,placeholder:'shipInfo.detailModal.base.holderVSat'},
        {label:'shipInfo.detailModal.base.labelVSatMiniC', value: '', type: 'text', key: 'vsatMiniC',placeholder:'shipInfo.detailModal.base.holderVSatMiniC'},
        {label:'shipInfo.detailModal.base.labelNationality', value: '', type: 'text',key: 'nationality',placeholder:'shipInfo.detailModal.base.holderNationality'},
        {label:'shipInfo.detailModal.base.labelMMSI', value: '', type: 'text', key: 'mmsi',placeholder:'shipInfo.detailModal.base.holderMMSI'},
        {label:'shipInfo.detailModal.base.labelNumber', value: '', type: 'text',  key: 'callSign',placeholder:'shipInfo.detailModal.base.holderNumber'},
        {label:'shipInfo.detailModal.base.labelSatC', value: '', type: 'text',  key: 'satC',placeholder:'shipInfo.detailModal.base.holderSatC'},
        {label:'shipInfo.detailModal.base.labelPhone', value: '', type: 'text',  key: 'telephone',placeholder:'shipInfo.detailModal.base.holderPhone'},
        {label:'shipInfo.detailModal.base.labelMail', value: '', type: 'text',  key: 'email',placeholder:'shipInfo.detailModal.base.holderMail'}
      ]
    }
  }
}