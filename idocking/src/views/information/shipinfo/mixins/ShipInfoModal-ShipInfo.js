/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-15 14:03:50
 */

export default {
  data () {
    return {
      shipInfoConfig: [
        {label:'shipInfo.detailModal.info.labelRegId', value: '', type: 'text',  key: 'classNumber' ,placeholder:'shipInfo.detailModal.info.holderRegId'},
        {label:'shipInfo.detailModal.info.labelPlant', value: '' , type: 'text',  key: 'shipBuilder',placeholder:'shipInfo.detailModal.info.holderPlant'},
        {label:'shipInfo.detailModal.info.labelDelivery', value: '', type: 'date',  key: 'deliveryDate',placeholder:'shipInfo.detailModal.info.holderDelivery'},
        {label:'shipInfo.detailModal.info.labelArea', value: '' , type: 'text',  key: 'sailingArea',placeholder:'shipInfo.detailModal.info.holderArea'},
        {label:'shipInfo.detailModal.info.labelOwner', value: '' , type: 'select',  key: 'shipOwner', optionsUrl:'/shipOwner/list',placeholder:'shipInfo.detailModal.info.holderOwner'},
        {label:'shipInfo.detailModal.info.labelManager', value: '', type: 'select',  readonly:true,key: 'managementCompany',placeholder:'shipInfo.detailModal.info.holderManager'},
        {label:'shipInfo.detailModal.info.labelFlag', value: '' , type: 'text',  key: 'flagState',placeholder:'shipInfo.detailModal.info.holderFlag'},
        {label:'shipInfo.detailModal.info.labelSociety', value: '' , type: 'select',  key: 'classificationSociety', optionsUrl:'/classificationSociety/list',placeholder:'shipInfo.detailModal.info.holderSociety'},
        {label:'shipInfo.detailModal.info.labelPort', value: '' , type: 'text',  key: 'portOfRegistry',placeholder:'shipInfo.detailModal.info.holderPort'}
      ]
    }
  }
}