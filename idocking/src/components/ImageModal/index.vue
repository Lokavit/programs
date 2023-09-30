<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-10 21:14:35
 * @LastEditTime: 2020-03-09 13:25:15
 -->
<template>
  <ul v-show="false" id="img-preview">
    <li v-for="(img, index) in images" :key="index">
      <!-- <img src="https://s2.ax1x.com/2019/10/18/Ke9VXt.jpg" alt="Picture 1"> -->
      <img :src="`${$ATT}/file/display/${img.id}?compressed=true`" :alt="img.fileName">
    </li>
  </ul>
</template>

<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

export default {
  name: 'ImageModal',
  props: {
    domPrefix: {
      type: String,
      default: ''
    },
    showModal: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    imageList: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      viewer: null
    }
  },
  computed: {
    default_index() {
      return this.defaultIndex
    },
    domName() {
      return this.domPrefix + '-img-preview'
    },
    images() {
      return this.imageList.filter(item => item.fileType === 'IMG')
    }
  },
  watch: {
    images() {
      this.$nextTick(() => {
        this.viewer.update() // 更新图片查看器
      })
    }
  },
  mounted() {
    // 更改DOM节点ID，便于同时存在多个viewer实例
    var targetDom = document.getElementById('img-preview')
    targetDom.setAttribute('id', this.domPrefix + '-img-preview')

    this.viewer = new Viewer(document.getElementById(this.domName), {
      toolbar: {
        zoomIn: 4,
        zoomOut: 4,
        oneToOne: 4,
        reset: 4,
        prev: 4,
        play: {
          show: 4,
          size: 'large'
        },
        next: 4,
        rotateLeft: 4,
        rotateRight: 4,
        flipHorizontal: 4,
        flipVertical: 4
      },
      initialViewIndex: this.default_index,
      zIndex: 99999
    })
  },
  beforeDestroy() {
    this.viewer.destroy() // 销毁实例
    this.viewer = null
  },
  methods: {
    boxClose() {
      this.$emit('boxClose')
    },
    showImage() {
      this.$nextTick(() => {
        this.viewer.show()
        var arr = this.imageList.slice(0, this.default_index + 1)
        var temp = arr.filter(item => item.fileType !== 'IMG')
        this.viewer.view(this.default_index - temp.length)
      })
    }
  }
}
</script>
