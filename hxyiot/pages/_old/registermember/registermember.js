var app = getApp();
import md5 from '/utils/md5.js';
Page({
  data: {
    phone:'请输入手机号码',
    phonevalue:'请输入手机号码',
    changecss:'',
    hiddenshow:0,
    show:0,
    show1:1,
    kaitong:'../../img/register/kaitonghuiyuan-1.png',
    gb_css:'gb',
  },
  onLoad(query) {
    //  console.log(query.jine)
    var device_id = my.getStorageSync({ key: 'device_id' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;
     
    var pay_action = my.getStorageSync({ key: 'pay_action' }).data;
    var store_id = my.getStorageSync({ key: 'store_id' }).data;    
    var merchant_id = my.getStorageSync({ key: 'login_merchant_id' }).data;    
    var config_id = my.getStorageSync({ key: 'config_id' }).data;
    

    

    this.setData({
      Request:Request,
      device_id:device_id,
     
      pay_action:pay_action,
      store_id:store_id,
      merchant_id:merchant_id,
      config_id:config_id,
      buyerId:query.buyerId,
      // 付款金额
      jine:query.jine,           
    }) 
    
  },
  
  onHide() {
    my.ix.offKeyEventChange();
  }, 
// 点击手机输入框时
  phone_css(){  
    if(this.data.phone == '请输入手机号码'){  
        this.setData({
        gb_css:'gbcss',  
        phone:'请输入手机号码',  
        show:1,
        show1:0
        })
    }
  },

//   onfocus(){
//       my.hideKeyboard()
//   },
//   onblur(){
//        my.hideKeyboard()
//   },
//   oninput(){
//       my.hideKeyboard()
//   },
  nameTap(e){
    this.setData({
      name:e.detail.value,
    })
  },

  touch(e){  
    var phone = this.data.phone
    var phonevalue = this.data.phonevalue
    console.log(phone)
    // console.log(phonevalue)
    var one = e.currentTarget.dataset.phone
    console.log(one)
    this.setData({
      show:0,
      show1:1
    })

    if (one == 'submit') {
      console.log(phone)
      if(this.data.kaitong == '../../img/register/kaitonghuiyuan-2.png'){
        my.request({
          url: this.data.Request+'/api/member/member_info_save',
          data: {
            store_id: this.data.store_id,
            merchant_id: this.data.merchant_id,
            open_id:this.data.buyerId,
            mb_name:this.data.name,
            mb_phone:this.data.phonevalue,
            ways_source:'alipay',
          },
          success:res=>{
            console.log(res.data)
            if (res.data.status == 1) {
               my.redirectTo({
                    url: '/pages/hyyue/hyyue?mb_phone='+res.data.data.mb_phone+'&mb_name='+res.data.data.mb_name+'&jine='+this.data.jine+'&buyerId='+this.data.buyerId+'&mb_id='+res.data.data.mb_id+'&mb_money='+res.data.data.mb_money
                })
            }
          }
        })
      }
      
    } else if (one == 'del') {
      if (phone.length == 1) {
        phone = '请输入手机号码'
        phonevalue = '请输入手机号码'
        this.setData({ changecss:'',kaitong:'../../img/register/kaitonghuiyuan-1.png' })
        this.setData({
          gb_css:'gb',
          phone:'请输入手机号码',
        })
      } else {
        if (this.data.phone == '请输入手机号码') {
          phone = '请输入手机号码';
          phonevalue = '请输入手机号码';
        } else {
          phone = phone.substring(0, phone.length - 1)
          phonevalue = phonevalue.substring(0, phonevalue.length - 1)
        }
      }
      this.setData({ phone,phonevalue ,kaitong:'../../img/register/kaitonghuiyuan-1.png'})

    } else {
      // 显示的手机号
      if (phone == '请输入手机号码') {
        this.setData({
          phone: one.toString(),
          phonevalue: one.toString()
        })
      } else {
        var phone        
        phone = phone.toString() + one.toString()
        var a = phone.substring(0, 11)
        console.log(a)
        if(a.length=='11'){
          this.setData({
            kaitong:'../../img/register/kaitonghuiyuan-2.png'
          })
        }else{
          this.setData({
            kaitong:'../../img/register/kaitonghuiyuan-1.png'
          })
        }       
          
        this.setData({
          phone: a
        })        
      }   
      
      // *****   
      this.setData({
        changecss:'phoneColor'
      })
      // ********


      // 保存的手机号
      if (phonevalue == '请输入手机号码') {
        this.setData({
          phonevalue: one.toString()
        })
      } else {
        var phonevaluea = phonevalue.toString() + one.toString()
        var b = phonevaluea.substring(0, 11)
        console.log(b)
        this.setData({
          phonevalue: b
        })
      }
      
    }
  },
  onfocus(){
      this.setData({
          show:0,
          show1:0
      })
  },
onblur(){
    this.setData({
          show:0,
          show1:1
    })
}
});
