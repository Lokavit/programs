/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-11 08:29:22
 */

export default {
  data() {
    return {
      baseInfoConfig: [
        { label: 'specification.overview.base.shipName', type: 'text', key: 'vesselName', placeholder: 'common.placeholder' },
        { label: 'specification.overview.base.shipType', type: 'text', key: 'vesselType', placeholder: 'common.placeholder' },
        { label: 'specification.overview.base.buildTime', type: 'text', key: 'createdAt', placeholder: 'common.placeholder' },
        { label: 'specification.overview.base.startTime', type: 'text', key: 'startAt', placeholder: 'common.placeholder' },
        { label: 'specification.overview.base.endTime', type: 'text', key: 'endAt', placeholder: 'common.placeholder' },
        { label: 'specification.overview.base.currency', type: 'text', key: 'currencyType', placeholder: 'common.placeholder' },
        { label: 'specification.overview.base.version', type: 'text', key: 'versionId', placeholder: 'common.placeholder' },
      ]
    }
  }
}