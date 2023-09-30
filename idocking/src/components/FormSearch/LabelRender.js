/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-21 21:42:43
 * @LastEditTime: 2019-11-13 08:13:44
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
      formMod: ctx.props.formMod,
      formItemConfig: ctx.props.formItemConfig
    }

    return ctx.props.render(h, params)
  }
}
