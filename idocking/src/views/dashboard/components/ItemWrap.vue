<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-16 09:24:48
 * @LastEditTime: 2019-12-17 17:10:32
 -->
<template>
  <div class="item-wrapper " :style="{'width': width, 'height': height}">
    <div slot="title" class="wrapper-title"> 
      <svg-icon :name="name"></svg-icon>
      <span class="title">{{title}}</span>    
      
      <slot name="project"></slot>
      <span v-if="triangle" class="triangle" @click="moreExpand"></span>
      <span v-if="tag" class="tag cursor" @click="moreEvents">{{ $t('common.more') }}</span>
    </div>
    <slot name="body"></slot>
  </div>
</template>
<script >
export default {
  props:{
    title:{
      type:String
    },
    iconName:{
      type:String
    },
    width:{
      type: String
    },
    height:{
      type: String
    },
    tag:{
      type:Boolean,
      default:true
    },
    triangle:{
      type:Boolean,
      default:false
    },
    msg: {
      type: Boolean,
      default: ()=> {
        return false
      }
    }
  },
  computed: {
    name() {
      return this.iconName
    }
  },
  methods: {
    moreEvents() {
      this.$emit('moreEvents')
    },
    moreExpand() {
      this.$emit('moreExpand')
    },
    clickAll() {
      this.$emit('clickAll')
    },
    clickRead() {
      this.$emit('clickRead')
    },
    clickUnRead() {
      this.$emit('clickUnRead')
    }
  }
}
</script>
<style lang="scss" >
@import '../../../styles/variables.scss';

$warpper_title_size:16px;
.holder-section{
  color:#999;
  box-sizing: border-box;
  height: 85%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-wrapper{
  border: 2px solid #ECEDEF;
  background-color:rgba(255,255,255,1);
  margin-top: 16px; 
  padding:14px 15px;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  .wrapper-title{
    position:relative;
    padding:10px 0px;
    font-size: $warpper_title_size;
    font-weight: bold;
    display: flex;
    align-items: center;
    svg{
      margin-right: 10px;
      font-weight: bold;
    }
    .title{
      font-size: 16px;
      color: #2E2F2F;
      font-weight: bold;
    }
    .tag{
      display:inline-block;
      position: absolute;
      right: 0;
      top: 5px;
      width: 48px;
      height: 20px;
      line-height: 22px;
      background-color: $main-bg;
      border-radius: 15px;
      font-size:10px;
      color:rgba(255,255,255,1);
      text-align: center;
    }
    .triangle{
      border-top:8px solid rgba(251,176,152,1);
      border-right:7px solid transparent;
      border-left:7px solid transparent;
      margin-left: 10px;
    }
  }
  .wrap-main{
    width: 100%;
  }

}
.item-wrap-row{
  padding: 0 15px;
  &:hover{
    background-color: #F5F7FA;
  }
  width:100%;
  // padding: 6px 0;
  height: 36px;
  line-height: 36px;
  display:flex;
  align-items: center;
  box-sizing: border-box;
  font-size: 14px;
  .text{
    flex: 1;
    text-overflow: ellipsis;
    font-weight: bold;
    color: #7D7D7D;
    overflow: hidden;
    white-space: nowrap;
    padding-right: 30px;
    box-sizing: border-box;
    // line-height: 25px;
  }
  .value{color:#7D7D7D;}
  .time{
    min-width: 80px;
    max-width: 100px;
    color: #B0B0B0;
    display:flex;
    align-items: center;
    justify-content:space-between;
    span{
      display: inline-block;
      max-width:75px;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .icon_color_read{
    color:rgb(156, 215, 191);
  }
  .icon_color_unread{
    color:rgb(255,126,103);
  } 
}
</style>