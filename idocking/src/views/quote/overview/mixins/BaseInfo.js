/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-28 10:48:13
 */

export default {
  data () {
    return {
      baseInfoConfig: [
        {label:'quote.overview.base.vesselName', type: 'select', key: 'vessel',readonly:true,placeholder:'common.placeholder'},
        {label:'quote.overview.base.vesselType', type: 'text', key: 'vesselType',readonly:true, placeholder:'common.placeholder'},
        {label:'quote.overview.base.dockPlant', type: 'text',key: 'yardName', placeholder:'common.placeholder'},

        {label:'quote.overview.base.vesselNo', type: 'text', key: 'vesselNo',readonly:true,placeholder:'common.placeholder'},
        {label:'quote.overview.base.dockProject', type: 'text', key: 'dockProject',readonly:true,placeholder:'common.placeholder'},
        {label:'quote.overview.base.contact', type: 'text', key: 'liaison' ,placeholder:'common.placeholder'},

        {label:'quote.overview.base.totalNoExtraDiscount', type: 'text', key: 'totalNoExtraDiscount',readonly:true,placeholder:'common.placeholder'},
        {label:'quote.overview.base.offeredAt', type: 'text', key: 'offeredAt',readonly:true,placeholder:'common.placeholder'},
        {label:'quote.overview.base.email', type: 'text',key: 'email',placeholder:'common.placeholder'},

        {label:'quote.overview.base.extraDiscount', type: 'text', key: 'extraDiscount',readonly:true,placeholder:'common.placeholder'},
        {label:'quote.overview.base.currency', type: 'select', key: 'currencyType',readonly:true,placeholder:'common.placeholder'},
        {label:'quote.overview.base.telephone', type: 'text', key: 'telephone',placeholder:'common.placeholder'},
        
        {label:'quote.overview.base.expiryDate', type: 'text', key: 'expiryDate',readonly:true,placeholder:'common.placeholder'},
        {label:'quote.overview.base.FinalTotal', type: 'text', key: 'FinalTotal',readonly:true,placeholder:'common.placeholder'},

      ]
    }
  }
}