/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-10 09:56:10
 * @LastEditTime: 2019-12-12 15:39:41
 */

import dayjs from 'dayjs'

export function status_format(status) {
  if(!status) return '';
  if(status == 'DRAFTING') {
    return '草拟';
  }else {
    return '完成';
  }
}

export function initialCapitalization(value) {
  if (!value) return ''
  var isletter = /^[a-zA-Z_]+$/.test(value);
  if(!isletter) return value;
  let arr = value.split('_');
  let strArr = arr.map(val=>{
    let tempStr = val.toLowerCase()
    return tempStr.charAt(0).toUpperCase() + tempStr.slice(1)
  });
  return strArr.join(' ');
}

export function TimeFiltering(time) {
  if(!time) return;
  let date = Moment(time).format('YYYY-MM-DD')
  if(date=='Invalid date') return time;
  return date
}

// select控件，option值为string, 用来显示用
export function strValueSelectShow(options, value) {
  var ret = ''
  options.forEach(option => {
    if(option.value == value){
      ret = option.name
    }
  })
  return ret
}

// 4折转成40%，格式化显示
export function discountFormat(discount) {
  // 规定：后端返回的discount表示折扣率(便宜了多少)
  discount = discount || 0
  if(discount == 0) {
    return '0%'
  } else {
    return (discount * 100).toFixed(2) + '%'
  }
}

// 货币金额科学计数法(千分位表示)
export function currencyFormat(s, n, d = ' ')  {
  /** 
   * s number
   * n 小数位数
   * **/

  if(s) {
    n = n > 0 && n <= 20 ? n : 2;  
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";  
    var l = s.split(".")[0].split("").reverse(),  
    r = s.split(".")[1];  
    var t = "";  
    for (var i = 0; i < l.length; i ++ ) {  
       t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
    }  
    return t.split("").reverse().join("") + "." + r;  
  } else {
    return 0
  }
}

// 船舶证书状态映射，枚举值 ——> 文本
export function shipCertStatusMap(status) {
  // 要支持国际化,返回字典映射,具体语言切换逻辑交给视图
  if(status === 'NORMAL') {
    return 'shipCert.formSearch.STATUS_NORMAL'           // 正常
  } else if (status === 'EXPIRATION_CLOSE') {
    return 'shipCert.formSearch.STATUS_EXPIRATION_CLOSE' // 临近过期
  } else if (status === 'EXPIRED') {
    return 'shipCert.formSearch.STATUS_EXPIRED'          // 已过期
  }
}

// 项目状态映射，枚举值 ——> 文本
export function projectStatusMap(status) {
  // 要支持国际化,返回字典映射,具体语言切换逻辑交给视图
  if(status === 'DRAFTING') {
    return 'project.STATUS_DRAFTING'                   // 草拟
  } else if (status === 'WAITING_FOR_APPROVAL') {
    return 'project.STATUS_WAITING_FOR_APPROVAL'        // 待审批
  } else if (status === 'APPROVED') {
    return 'project.STATUS_APPROVED'                    // 已立项
  }
}

// 规格书状态映射，枚举值 ——> 文本
export function specStatusMap(status) {
  // 要支持国际化,返回字典映射,具体语言切换逻辑交给视图
  if(status === 'CREATED') {
    return 'quote.status.CREATED'                   // 草拟
  } else if (status === 'OFFERED') {
    return 'quote.status.OFFERED'                   // 待审批
  } else if (status === 'WAITING_FOR_APPROVAL') {
    return 'quote.status.WAITING'                   // 已立项
  } else if (status === 'APPROVED') {
    return 'quote.status.APPROVED'                  // 已立项
  } else if (status === 'REJECTED') {
    return 'quote.status.REJECTED'                  // 已立项
  } else if (status === 'ACCEPTED') {
    return 'quote.status.ACCEPTED'  
  }
}

// 时间格式转换
export function timeFormat(date, format) {
  return dayjs(date).format(format)
}

// 规格书——坞修项目——是否自修
export function selfRepairMap(isSelf) {
  return isSelf 
  ? 'specification.overview.addDockItem.radioYes'
  : 'specification.overview.addDockItem.radioNo'
}

// 规格书——坞修项目——坞修细节项类型
export function dockDetailItemTypeMap(type) {
  if(type === 'SERVICE') {
    return 'specification.overview.addDockDetailItem.TYPE_SERVICE'
  } else if (type === 'MATERIAL') {
    return 'specification.overview.addDockDetailItem.TYPE_MATERIAL'
  } else if (type === 'EQUIPMENT') {
    return 'specification.overview.addDockDetailItem.TYPE_EQUIPMENT'
  }
}

// 规格书——坞修项目——坞修细节项类型
export function noticeStatusMap(status) {
  if(status) {
    return 'common.readed'
  } else {
    return 'common.unReaded'
  }
}

// 流程类型映射
export function flowTypeMap(str) {

  // PROJECT_CREATE                项目审批
  // QUOTATION_ACCEPT              询价单审批
  // SPECIFICATION_ITEM_COMPLETE   规格书坞修项审批
  // SUPER_INTENDENT_MANAGER       内部审核
  // SHIP_OWNER                    船东过目
  // SUPER_INTENDENT               机务审核
  // CHIEF_OFFICER
  // CHIEF_ENGINEER
  // SHIP_OWNER

  return `settings.flow.type.${str}`
}

// 设置——用户管理，账户状态
export function userStatusMap(status) {
  if(status) {
    return 'common.enable'
  } else {
    return 'common.disable'
  }
}

// 船舶信息——船员分配，(空闲、已分配状态)
export function staffAllotStatusMap(status) {
  if(status) {
    return 'allotModal.table.statusYes'
  } else {
    return 'allotModal.table.statusNo'
  }
}

// 船舶信息——船员分配，(空闲、已分配状态)
export function roleMap(role) {
  return role
}
