Page({
  data: {
    "maia":"../../img/duigou.png",
    "maib":"",
  },
  onLoad(query) {
    this.setData({
      total_money:query.total_money

    })
  },

 
  
  maiBearTapa(event){
    console.log(event.currentTarget.dataset.fear)
    this.setData({
      "maia":"../../img/duigou.png",
      "maib":"",
    })
    my.setStorageSync({key: 'bear',data: event.currentTarget.dataset.fear});
    my.navigateTo({
      url: '../qishu/qishu?total_money='+this.data.total_money
    })
  },
  maiBearTapb(event){
    console.log(event.currentTarget.dataset.fear)
    this.setData({
      "maia":"",
      "maib":"../../img/duigou.png",
    })
    my.setStorageSync({key: 'bear',data: event.currentTarget.dataset.fear});
    my.navigateTo({
      url: '../qishu/qishu?total_money='+this.data.total_money
    })
  },
});
