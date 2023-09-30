var app = getApp();

Page({
  data: {
     timeStr:'00:00',
     interval:null,
     id:0,
     time:''
  },
  onLoad() {
    
  },
start :function(e){
  var temp=0;
  var games = e.target.dataset.id;
  //定时器
  let that = this
    if(games == 0){ 
      that.data.intveral=setInterval(function(){
        
     var d=new Date(),t=[],t2=[];  
		if(isInit){ 
			d=new Date(new Date().getTime()-temp);
			console.log("11");
		}else{
			temp=d.getTime(); 
			isInit=true;
		}
		 
		t2[0]=d.getMinutes(),t2[1]=d.getSeconds(),t2[2]=d.getMilliseconds();
      console.log(that.data.time,'time')
      that.setData({
        // timeStr:`00:${that.data.time<10?'0'+that.data.time:that.data.time}`,
        timeStr:`${t2.map((e,i)=>  ("000"+e).slice(i<2?-2:-4) ).join(":") }`,
        id:1  
      })     
    },10); 
  }else{ 
       clearInterval(that.data.intveral);
       that.setData({
        id:0,
        intveral:null
      })   
  }
      
  } , 
  
  
}); 

