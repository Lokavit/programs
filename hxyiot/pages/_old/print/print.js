Page({
  data: {
    "maia": "../../img/duigou.png",
    "maib": "",
    switch1: true,
    switch2: true,
    show: 0,
    checked: '',
    checkeds: '',
  },
  onLoad(query) {
    var checked = my.getStorageSync({ key: 'checked' }).data;
    var checkeds = my.getStorageSync({ key: 'checkeds' }).data;
    var print = my.getStorageSync({ key: 'print' }).data;
    if (checked == true) {
      this.setData({
        checked: 'checked',
        show: 1,
      })
    } else {
      this.setData({
        checked: '',
        show: 0
      })
    }
     if (checkeds == true) {
      this.setData({
        checkeds: 'checkeds'
      })
    } else {
      this.setData({
        checkeds: ''
      })
    }
    if (print == 1) {
      this.setData({
        "maia": "",
        "maib": "../../img/duigou.png",
      })
    } else {
      this.setData({
        "maia": "../../img/duigou.png",
        "maib": "",
      })
    }
    this.setData({
      total_money: query.total_money
    })
  },



  maiBearTapa(event) {
    console.log(event.currentTarget.dataset.fear)
    this.setData({
      "maia": "../../img/duigou.png",
      "maib": "",
    })
    my.setStorageSync({ key: 'print', data: event.currentTarget.dataset.fear });
  },
  maiBearTapb(event) {
    console.log(event.currentTarget.dataset.fear)
    this.setData({
      "maia": "",
      "maib": "../../img/duigou.png",
    })
    my.setStorageSync({ key: 'print', data: event.currentTarget.dataset.fear });
  },
  printcs(event) {
    console.log(event.currentTarget.dataset.fear)
    my.setStorageSync({ key: 'print', data: event.currentTarget.dataset.fear });

    my.ix.startMonitorPrinter({
      success: (r) => {
        console.log("success");
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });
    // 查询连接的打印机的 API
    my.ix.queryPrinter({
      success: (r) => {
        console.log(r)
        my.ix.printer({
          target: r.usb[0].id,
          cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
          { 'cmd': 'addText', 'args': ['打印测试'] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addText', 'args': ['测试成功'] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          ],
          success: (r) => {
            console.log(r)
            // if(r.success==true){

            // }
          },

          fail: (r) => {
            // console.log(r)
          }
        })
      },
      fail: (r) => {
        console.log(r)
        this.setData({
          message: JSON.stringify(r)
        })
      }
    });
    my.ix.onMonitorPrinter((r) => {
      console.log("received data:" + r);
      // 查询连接的打印机的 API
      my.ix.queryPrinter({
        success: (r) => {
          console.log(r)
          my.ix.printer({
            target: r.usb[0].id,
            cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
            { 'cmd': 'addText', 'args': ['打印测试连接成功'] },

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['打印时间:' + todayData] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            ],
            success: (r) => {
              console.log(r)
              // if(r.success==true){

              // }
            },

            fail: (r) => {
              // console.log(r)
            }
          })
        },
        fail: (r) => {
          console.log(r)
          this.setData({
            message: JSON.stringify(r)
          })
        }
      });
    });
    // # 结束监听
    my.ix.offMonitorPrinter({
      success: (r) => {
        console.log("success");
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });

  },
  switch1Change(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value);
    my.setStorageSync({ key: 'checked', data: e.detail.value });
    // my.setStorageSync({ key: 'switch1', data: e.detail.value });
    this.setData({
      switch1: e.detail.value,
    });
    if (e.detail.value == true) {
      this.setData({
        show: 1,
        checked: 'checked'
      });
    } else {
      this.setData({
        show: 0,
        checked: ''
      });
    }
  },
  switch2Change(e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value);
    my.setStorageSync({ key: 'checkeds', data: e.detail.value });
    this.setData({
      switch2: e.detail.value,
    });
    if (e.detail.value == true) {
      this.setData({
        checkeds: 'checkeds'
      });
    } else {
      this.setData({
        checkeds: ''
      });
    }
  },
});
