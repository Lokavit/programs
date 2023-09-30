/*
 * @Descripttion:
 * @Author: border-1px
 * @Date: 2019-10-08 14:07:49
 * @LastEditTime: 2019-11-25 11:04:07
 */
const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  device: state => state.app.device,
  sidebar: state => state.app.sidebar,
  langData: state => state.app.langData,
  userInfo: state => state.user.userInfo,
  noticeCount: state => state.user.noticeCount,
  permission_routes: state => state.permission.routes,
  quotationLine: state => state.quote.quotationLineInfo,
  currencyType: state => state.specification.currencyType,
  specTreeRowData: state => state.specification.treeRowData,
  yardInfo1: state => state.quote.yardInfo1,
  yardInfo2: state => state.quote.yardInfo2,
  yardInfo3: state => state.quote.yardInfo3
}
export default getters
