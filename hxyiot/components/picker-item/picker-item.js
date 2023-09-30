/** 选择器组件 */

Component({
  props: {
    /** 选择器上的明文 */
    label: '请指定',
    /** 默认值下标 */
    vIndex: 0,
    /** 选择项列表 */
    items: [],
    /** range-key 指定 Object 中 key 的值作为选择器显示内容 */
    rkey: "",
    /** 选中项的明文 */
    text: "",
    /** value 改变时触发，event.detail = {value: value} */
    onChangePicker: () => { },
  },

  methods: {
    /** 变更选中项事件 */
    onChangePicker(event) {
      console.warn('组件中 event:', event);
      console.warn('组件中 ', this);
      this.props.onChangePicker(event.detail.value);
    }
  },
});