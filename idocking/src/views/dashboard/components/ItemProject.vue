<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-16 12:36:35
 * @LastEditTime: 2019-12-17 17:10:55
 -->
<template>
  <div class="item-project">
    <item-wrap :title="$t('dashboard.main.titleProject')" iconName="workbench-dock-repair-list" height="250px" @moreEvents="handleMore">
      <ul slot="body" class="tasks" v-if="projectList.length">
        <li class="item-wrap-row cursor" v-for="(item, index) in projectList" :key="index" @click="handleViewProject(item.id, item.name)">
          <div class="text" >{{ index+1 }}. {{ item.name }}</div>
           <project-stage :stage="item.phase"></project-stage>
        </li>
      </ul>
      <div v-else slot="body" class="holder-section">{{ $t('common.nothing') }}</div>
    </item-wrap>
  </div>
</template>

<script>
import ItemWrap from './ItemWrap'
import { getProjectList } from '@/api/project'
import ProjectStage from '@/components/ProjectStage'

export default {
  components: { ItemWrap, ProjectStage },
  data() {
    return {
      projectList: [],
      params: {
        page: 0,
        size: 5
      }
    }
  },
  methods: {
    getData() {
      getProjectList(this.params).then(res => {
        this.$store.commit('dashboard/SET_COUNT_PROJECT', res.data.totalElements)
        this.projectList = res.data.content
        this.tableLoading = false
      })
    },

    handleViewProject(projectId, projectName) {
      this.$router.push({
        path: '/management/project/overview',
        query: {
          id: projectId,
          name: projectName
        }
      })
    },

    handleMore() {
      this.$router.push('/management/project')
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss">

</style>