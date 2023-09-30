/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-21 21:42:43
 * @LastEditTime: 2020-03-09 13:10:46
 */
export default {
  functional: true,
  props: {
    formItemConfig: Object,
    formMod: Object,
    render: Function
  },
  render: (h, ctx) => {
    const params = {
      ctx: ctx,
      formItemConfig: ctx.props.formItemConfig,
      formMod: ctx.props.formMod
    }

    return ctx.props.render(h, params)
  }
}
