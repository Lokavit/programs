/** 全局 watch */

export default {
    /** 监听表单页面 表单数据变化，数据一旦发生改变，为其对应任务项标星 */
    formData: {
        deep: true,
        handler(val, oldVal) {
            console.warn('全局 watch formData:', val);
            if (this.inited) {
                // console.warn('全局 watch 表单数据是否发生过变化:', this.inited);
                // 如果表单数据初始化过， 又发生更改，则对当前对应任务项进行标星操作
                let tempTask = this.$store.getters.taskGroup.find(
                    t => t.code == this.$route.params.code
                );
                // console.log(this.$route.params.code)
                this.$store.dispatch("taskbar/switchTaskStatus", tempTask);
            }
        },
        // immediate: ($route.params.code == "create") ? true : false,
    },
}