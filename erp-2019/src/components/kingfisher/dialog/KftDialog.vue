<template>
  <div v-dialogDrag class="kft-dialog">
    <el-dialog :visible="dialogVisible" :modal-append-to-body="false" :modal="false" :width="width" :close-on-click-modal="false" :show-close="false" custom-class="modal_style">
      <!-- style根据isActive的布尔值，来为当前选中窗体的header设置背景色 -->
      <div slot="title" class="dialog-header" @click="changeLevel($event)">
        <span>{{title}}</span>
        <div class="icon-btns">
          <i class="el-icon-minus" @click="minimize"></i>
          <i class="el-icon-close" @click="handleClose"></i>
        </div>
      </div>
      <!-- dialog主体 -->
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "KftDialog",
  props: {
    // dialog宽度属性 于外部使用时定义
    width: { type: String, default: "100%" },
    // 外部传入标题，通常为单个路由的[meta.title]
    title: { type: String, default: "默认标题" }
  },
  data() {
    return {
      dialogVisible: true // 默认显示，一直显示
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // this.$el 当前根元素 el-dialog之外的div
    const dialogRoot = this.$el.firstElementChild; // this.$el子级，也就是el-dialog外层容器
    const dialogChild = dialogRoot.firstElementChild; // 根据以上，获取el-dialog外层容器包裹的el-dialog
    this.$el.removeChild(dialogRoot); // 当前根元素之下的元素删除，也就是移除了el-dialog外层容器
    this.$el.appendChild(dialogChild); // 以上移除之后，再将el-dialog添加回当前根元素之下

    // console.log("当前组件的上级元素:", this.$parent.$el.firstElementChild);
    // console.log("当前组件：", this.$el);
    // console.log("当前组件子级元素:", this.$el.firstElementChild); // el-dialog包裹器

    // const dialogRoot = this.$parent.$el.firstElementChild; // 当前组件的上级元素
    // const dialogWrapper = this.$el; // 当前窗体包裹器
    // const dialogChild = dialogWrapper.firstElementChild; // 包裹器中的实际窗体
    // dialogRoot.removeChild(dialogWrapper); //由当前组件上级中移除对话框包裹器
    // dialogRoot.appendChild(dialogChild); // 将当前组件提取的窗体，添加到上级元素下

    /**
     * TODO：
     * 是否删除 el-dialog的margin属性
     * 处理el-dialog每次创建的位置
     */

    // const sty =
    //   dialogChild.currentStyle || window.getComputedStyle(dialogChild, null);
    // console.log('样式:',sty.margin);
    // console.log("获取元素样式:", (dialogChild.style.cssText = "margin:0;")); // 需使用该方式更改style样式
  },

  methods: {
    // 最小化
    minimize() {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      this.dialogVisible = false;
      this.$emit("on-zoommin");
      // this.isminimize = !this.isminimize;
    },
    // 关闭弹窗
    handleClose() {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      this.dialogVisible = false;
      this.$emit("on-close");
    },
    // 尝试切换层级
    changeLevel(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      console.log("KftDialog.vue 层级切换函数：", event);
      this.$emit("on-level");
    }
  },
  /**
   * 定义局部自定义指令
   */
  directives: {
    /** 对话框拖拽 */
    dialogDrag: {
      inserted(el) {
        // const testEL = el.querySelector(".modal_style");
        // console.log("TESTEL:", testEL);

        // // 创建左边可拖拽区域
        // const drop_left = document.createElement("div");
        // console.log("左侧区域:", drop_left);
        // drop_left.setAttribute("class", "drop_left");
        // testEL.appendChild(drop_left);

        const dialogHeaderEl = el.querySelector(".el-dialog__header"); // 获取 el-ui 中 el-dialog 的header 部分的 class
        dialogHeaderEl.style.cursor = "move"; // 鼠标样式变为移动

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = el.currentStyle || window.getComputedStyle(el, null);

        dialogHeaderEl.onmousedown = e => {
          const path = e.path || (e.composedPath && e.composedPath()); // 通过鼠标按下的事件，返回元素路径

          // 获取对话框的宽高
          // console.log('获取元素:', sty);
          // console.log(`获取对话框的宽高值:(${sty.width},${sty.height})`);
          // const mainElement = path.find(s => {
          //     if (s.className === 'layout-flex-main') {
          //         return true;
          //     }
          // });
          // console.log('找到指定标签:', mainElement);

          // const mainStyle = mainElement.currentStyle || window.getComputedStyle(mainElement, null);
          // console.log('main标签的样式', mainStyle);
          // console.log(`获取main标签的宽高值:(${mainStyle.width},${mainStyle.height})`);

          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - dialogHeaderEl.offsetLeft;
          const disY = e.clientY - dialogHeaderEl.offsetTop;

          // 获取到的值带px 正则匹配替换
          let styL, styT;

          if (sty.left.includes("%")) {
            styL =
              +document.body.clientWidth * (+sty.left.replace(/\%/g, "") / 100);
            styT =
              +document.body.clientHeight * (+sty.top.replace(/\%/g, "") / 100);
          } else {
            styL = +sty.left.replace(/\px/g, "");
            styT = +sty.top.replace(/\px/g, "");
          }

          // 缺少边缘检测
          document.onmousemove = function(e) {
            // 通过事件委托，计算移动的距离
            const l = e.clientX - disX;
            const t = e.clientY - disY;

            // 移动当前元素
            el.style.left = `${l + styL}px`;
            el.style.top = `${t + styT}px`;

            //将此时的位置传出去
            //binding.value({x:e.pageX,y:e.pageY})
          };

          document.onmouseup = function(e) {
            const offsetLeft = el.offsetLeft;
            const offsetTop = el.offsetTop;
            const left = Number(el.style.left.replace("px", ""));
            const top = Number(el.style.top.replace("px", ""));
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight - 50;
            const offsetRight = offsetLeft + el.offsetWidth - windowWidth;
            const offsetBottom = offsetTop + el.offsetHeight - windowHeight;

            /** 注释部分为边界判定，有误差，待修改 */
            if (offsetTop < 0) {
              /** 元素.top值为：20+(top-元素top偏移) 通常结果为0，避免贴顶，所以+20基数 */
              el.style.top = 20 + (top - offsetTop) + "px";
            }
            if (offsetBottom > 0) {
              el.style.top = top - offsetBottom + "px";
            }
            // if (offsetLeft < 0) {
            //   el.style.left = left - offsetLeft + "px";
            // }
            // if (offsetRight > 0) {
            //   el.style.left = left - offsetRight + "px";
            // }
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
  }
};
</script>
