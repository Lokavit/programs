/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-10 19:15:34
 * @LastEditTime: 2019-10-29 19:50:54
 */

export default{
  props: {
    value: Boolean
  },
  methods: {
    close(){
      this.$emit('input',false)
    }
  }
}