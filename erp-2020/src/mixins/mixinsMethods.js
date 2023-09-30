/** 全局 methods混入 
 * 
 * 组件中调用 this.getListData();
 */

export default {

    /** 创建打开页面的对应任务栏
     * @param modal 传入在该函数之前创建的窗体对象
     * @returns 创建任务项 并打开与之对应的页面
     * @use this.createTask(
          { path: `/steel/material-form/`, name: "FormSteelMaterial" },
          "create" );  // 使用{属性名:属性值}的方式，只重写需要改变的属性值，其它依旧默认
     */
    createTask(item, code = "") {
        let newTask = {
            /** 当前任务项对应页面的 路由路径
             * 根据外部使用地不同，对其属性值进行重写
             */
            path: `${item.path}${code}`,
            /** 当前任务项对应页面的 组件名
             * 根据外部使用地不同，对其属性值进行重写
             */
            name: item.name,
            /** 当前任务项对应页面的 任务项标题 默认使用当前路由元信息的title */
            title: `${item.meta.title} ${code == "create" ? "创建" : code}`,
            /** 当前任务项 默认非标星状态 */
            status: false,
            /** 当前任务项 默认已激活状态 */
            active: true,
            /** 当前任务项 传入路由参数 */
            code: code,
        };
        this.$store.dispatch("taskbar/addTask", newTask);
    },

    /** 关闭任务项之前的业务逻辑
     * 该函数用于：手动关闭任务项，及所有表单页面操作完毕后的自动关闭
     * @param path 待删除任务项的path，或者是触发本函数的表单页面的this.$route.path
     * use 任务管理器：this.beforeCloseTask(task.path);
     * use 表单页面：this.beforeCloseTask(this.$route.path);
     */
    beforeCloseTask(path) {
        /** 通过当前路由，找到组件上下文
         * 从缓存中删除组件实例，以达到关闭再开启时，重走组件生命周期
         */
        const context = this.$route.matched[2].instances.default;
        if (
            context.$vnode.parent.parent &&
            context.$vnode.parent.parent.componentInstance &&
            context.$vnode.parent.parent.componentInstance.cache
        ) {
            /** 如果 上下文的$vnode.组件选项 */
            if (context.$vnode.componentOptions) {
                /** 将里面的 cache 和keys 赋值给局部变量 */
                let cache = context.$vnode.parent.parent.componentInstance.cache;
                let keys = context.$vnode.parent.parent.componentInstance.keys;
                /** cache的对象数组有当前path */
                if (cache[path]) {
                    if (keys.length) {
                        if (keys.indexOf(path) > -1) {
                            keys.splice(keys.indexOf(path), 1);
                        }
                    }
                    delete cache[path];
                }
            }
        }
        // context.$destroy();

        /**
         * 根据传入的路径，从任务项数组中找到相同值的任务项下标
         * 因其返回的是满足条件的元素在数组中的下标值，所以该值可以指定数组中的对应元素
         * 即 this.$store.getters.taskGroup[tempTaskIndex]
         */
        let tempTaskIndex = this.$store.getters.taskGroup.findIndex(task => task.path == path);
        console.log('找到的任务项下标值:', tempTaskIndex);
        // 如果任务项下标值>0 也就是任务项数组中最少有两个元素(任务项)
        if (tempTaskIndex > 0) {
            /**
             * 调用vuex taskbar中的切换激活任务项函数，激活当前待删除任务项下标-1的任务项
             * 也就是当前删除任务项的前一个任务项置为激活状态，以免激活项失焦
             */
            this.$store.dispatch("taskbar/switchTaskActive", this.$store.getters.taskGroup[tempTaskIndex - 1]);

            // 调用关闭任务项函数，将找到的待删除任务从数组中删除
            this.$store.dispatch("taskbar/closeTask", this.$store.getters.taskGroup[tempTaskIndex]);
            // 使用路由，跳转到切换后的激活任务项对应页面
            this.$router.push({
                path: `${this.$store.getters.taskGroup[tempTaskIndex - 1].path}`
            })
        }
        // 如果下标值-1<0也就是数组中仅剩当前待删除一个任务项
        else if (tempTaskIndex - 1 < 0) {
            // 调用关闭任务项函数，将找到的待删除任务从数组中删除
            this.$store.dispatch("taskbar/closeTask", this.$store.getters.taskGroup[tempTaskIndex]);
            // 截取当前待删除任务项的path，通过正则匹配，保留其一级路径，跳转到概览页面
            this.$router.push({
                path: `/${path.match(new RegExp("/(.*?)/"))[1]}`
            });
        }
    },
}