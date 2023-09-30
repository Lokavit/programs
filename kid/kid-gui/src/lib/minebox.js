// import Swal from 'sweetalert2';

// /**
//  * 成功提示框
//  * @param {*} title 标题
//  * @param {*} msg 辅助文字
//  * @param {*} time 显示时长
//  * @param {*} handler 关闭后的回调函数
//  */
// var success = function (title, msg, time, handler) {
//     Swal.fire({
//         title: title,
//         type: "success",
//         html: msg,
//         timer: time ? time : 1500,
//         showConfirmButton: false,
//         heightAuto: false,
//         onClose: (modal) => {
//             if(handler) {
//                 handler();
//             }
//         }
//     })
// }
// /**
//  * 错误提示框
//  * @param {*} title 标题
//  * @param {*} msg 辅助文字
//  * @param {*} time 显示时长
//  * @param {*} handler 关闭后的回调
//  */
// var error =  function (title, msg, time, handler) {
//     Swal.fire({
//         title: title ? title : "操作异常",
//         type: "error",
//         html: msg,
//         timer: time ? time : 1500,
//         showConfirmButton: false,
//         heightAuto: false,
//         onClose: (modal) => {
//             if(handler) {
//                 handler();
//             }
//         }
//     })
// }
// /**
//  * 带input 输入框的弹出层
//  * @param {*} title 标题
//  * @param {*} defaultValue 输入框默认值
//  * @param {*} errorTip 输入值非法时的提示
//  * @param {*} handler 确定后的回调函数，回调函数会获取 包含输入值的一个对象 result, 输入值为 result.value
//  */
// var input =  function (title, defaultValue, errorTip, handler) {
//     Swal.fire({
//         title: title,
//         input: "text",
//         inputValue: defaultValue,
//         inputAttributes: {
//             autocapitalize: 'off'
//         },
//         heightAuto: false,
//         showCancelButton: true,
//         confirmButtonText: '确定',
//         cancelButtonText: "取消",
//         allowOutsideClick: false,
//         inputValidator: (value) => {
//             if (!value) {
//             return errorTip ? errorTip : '请输入内容!'
//             }
//         },

//      }).then(result => {
//         if(result.value && handler) {
//             handler(result);
//         }
//      })
// }
// /**
//  * 加载中动画
//  * @param {*} title 标题
//  * @param {*} msg 内容
//  * @param {*} time 显示时间
//  * @param {*} handler 结束后的回调函数
//  */
// var loading =  function (title, msg, time, handler) {
//     Swal.fire({
//         title: title,
//         html: msg,
//         heightAuto: false,
//         timer: time ? time : 9999,
//         onBeforeOpen: () => {
//             Swal.showLoading();
//         },
//         allowOutsideClick: false,
//         onClose: () => {
//             if(handler) {
//                 handler();
//             }
//         }
//     })
// }

// var getContent =  function() {
//     return Swal.getContent();
// }

// var confirm = function(title, msg, handler) {
//     Swal.fire({
//         title: title,
//         text: msg,
//         type: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: '确认',
//         cancelButtonText: "取消",
//     }).then((result) => {
//         if (result.value && handler) {
//             handler();
//         }
//     })
// }

// var close = function() {
//     Swal.close();
// }

// export {success, error, loading, input, getContent, confirm, close}
