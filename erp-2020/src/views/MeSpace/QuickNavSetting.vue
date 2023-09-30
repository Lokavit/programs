<template>
  <section>
    QuickNavSetting 快捷导航
    <hr />根据路由组，通过checkbox-group分组列出,以checkbox多选形式。唯开放最子级为可选项。
    <div style="padding:0 2em">
      <!-- 此处需要递归，迭代，列出每一个子系统的所有最子级菜单项，并且需要按照级别区分 -->
      <template v-for="(system,index) in systems">
        <template v-if="system.path!=='/workspace'&& system.path!=='/mespace' && system.path!=='/helper'">
          <!-- 子系统名 -->
          <h3>{{system.meta.title}}</h3>
          <!-- 子系统下有子级路由组 -->
          <template v-if="system.children">
            <!-- 遍历 子系统下的子级路由组 -->
            <template v-for="(childSystem,childIndex) in system.children">
              <!-- 子系统下子级路由组 路由元信息 -->
              <template v-if="childSystem.meta">
                <!-- 子系统下子级路由组 路由元信息 标题明文 -->
                <template v-if="childSystem.meta.title">
                  <!-- 如果没有子级，就将当前级使用checkbox  -->
                  <template v-if="!childSystem.children">
                    <h4>
                      <el-checkbox v-model="checked">{{childSystem.meta.title}}</el-checkbox>
                    </h4>
                  </template>

                  <!-- 如果有子级，子级使用checkbox -->
                  <template v-else>
                    <h4>{{childSystem.meta.title}}</h4>
                    <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
                      <template v-for="(item,key) in childSystem.children">
                        <template v-if="item.meta">
                          {{item}}
                          <el-checkbox :key="key" :label="item" style="width:6em">{{item.meta.title}}</el-checkbox>
                        </template>
                      </template>
                    </el-checkbox-group>
                  </template>
                </template>
              </template>
            </template>
          </template>

          <!-- <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
            <template v-for="(item,index) in system.children">
              {{item.meta}}
              <el-checkbox :key="index" :label="item" style="width:6em">{{item}}</el-checkbox>
            </template>
          </el-checkbox-group>-->
        </template>
      </template>
    </div>
    <div>
      <el-button type="primary" @click="onSubmit" size="mini">确 定</el-button>
    </div>
  </section>
</template>

<script>
export default {
  name: "QuickNavSetting",
  data() {
    return {
      checkList: [], // 已选中
      checked: false // 是否选定
    };
  },
  computed: {
    /** 返回主路由表 */
    systems() {
      return this.$router.options.routes[1].children;
    },
    checkGroup() {
      //   let routes = this.$router.options.routes[1].children;
      console.log("获取路由表:", this.systems[2].children);
      return this.systems[2].children;
    }
  },

  mounted() {},

  methods: {
    /** 变更勾选项 */
    handleCheckedChange(value) {
      console.log(value);
      this.checkList = value;
    },

    /** 提交 */
    onSubmit() {
      console.log("将快捷方式提交至后台存储一份？", this.checkList);
    }
  }
};
</script>
