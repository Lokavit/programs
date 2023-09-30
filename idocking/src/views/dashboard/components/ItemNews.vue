<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-16 12:36:35
 * @LastEditTime: 2019-12-17 15:33:49
 -->
<template>
  <div class="item-news">
    <item-wrap :title="$t('dashboard.main.titleNews')" iconName="workbench-message" height="250px" @moreEvents="handleMore">
      <ul slot="body" class="tasks" v-if="newsList.length">
        <li class="item-wrap-row cursor" v-for="(item, index) in newsList" :key="index" @click="handleViewNews(item.id)">
          <div class="text" >{{ index + 1 }}. {{ item.name }}</div>
          <div class="value">{{ item.createdTime | timeFormat('YYYY-MM-DD HH:mm') }}</div>
        </li>
      </ul>
      <div v-else slot="body" class="holder-section">{{ $t('common.nothing') }}</div>
    </item-wrap>


    <id-dialog
      v-model="noticeInfoVisible"
      ref="noticeInfoDialog"
      @close="getData"
      :title="$t('dashboard.notices.infoModal.title')" 
      width="45%" 
      :box-padding=false>
      <notice-info-modal v-if="noticeInfoVisible" :noticeId="noticeId" ref="noticeInfoModal" @reload="getData"></notice-info-modal>

      <template v-slot:footer>
        <el-button
          type="primary"
          size="mini" 
          @click="handleOk"> 
          <span>{{ $t('common.ok') }}</span> 
        </el-button>
        <el-button
          type="warning"
          size="mini" 
          @click="handleAsUnRead"> 
          <span>{{ $t('dashboard.notices.infoModal.btnUnRead') }}</span> 
        </el-button>
      </template>
    </id-dialog>
  </div>
</template>

<script>
import ItemWrap from './ItemWrap'
import { getNotices } from '@/api/dashboard'
import NoticeInfoModal from '../notices/modals/NoticeInfo'

export default {
  components: { ItemWrap, NoticeInfoModal },
  data() {
    return {
      newsList: [],
      noticeInfoVisible: false,
      noticeid:null,
      params: {
        page: 0,
        size: 5,
        readStatus: false
      }
    }
  },
  methods: {
    getData() {
      getNotices(this.params).then(res => {
        this.newsList = res.data.content

        this.$store.commit('dashboard/SET_COUNT_NEWS', res.data.totalElements)
        this.tableLoading = false
      })
    },

    handleMore(){
      this.$router.push('/dashboard/notices')
    },

    handleViewNews(noticeId) {
      this.noticeId = noticeId
      this.noticeInfoVisible = true
    },

    handleOk() {
      this.$refs['noticeInfoDialog'].close()
      this.getData()
    },
    
    handleAsUnRead() {
      this.$refs['noticeInfoModal'].markNoticeAsUnRead()
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss">

</style>