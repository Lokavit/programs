<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-22 21:29:36
 * @LastEditTime: 2020-03-09 13:36:06
 -->
<template>
  <div class="editor richText tiptap">
    <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
      <div class="menubar">
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <svg-icon name="bold" :width="12" :height="12" />
          <!-- <icon name="bold" /> -->
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <!-- <icon name="italic" /> -->
          <svg-icon name="italic" :width="12" :height="12" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <svg-icon name="strike" :width="12" :height="12" />
          <!-- <icon name="strike" /> -->
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <!-- <icon name="underline" /> -->
          <svg-icon name="underline" :width="12" :height="12" />
        </button>

        <!-- <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
         <svg-icon name="code" :width="12" :height="12"></svg-icon>
        </button> -->

        <!-- <button
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
           <svg-icon name="paragraph"></svg-icon>
        </button> -->

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 4 }) }"
          @click="commands.heading({ level: 4 })"
        >
          H4
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <!-- <icon name="ul" /> -->
          <svg-icon name="ul" :width="12" :height="12" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <!-- <icon name="ol" /> -->
          <svg-icon name="ol" :width="12" :height="12" />
        </button>

        <!-- <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
         <svg-icon name="quote"></svg-icon>
        </button> -->
        <!-- <button
          class="menubar__button"
          @click="commands.horizontal_rule"
        >
          <svg-icon name="hr" :width="12" :height="12"></svg-icon>
        </button> -->

        <button
          class="menubar__button"
          @click="commands.undo"
        >
          <!-- <icon name="undo" /> -->
          <svg-icon name="undo" :width="12" :height="12" />
        </button>

        <button
          class="menubar__button"
          @click="commands.redo"
        >
          <!-- <icon name="redo" /> -->
          <svg-icon name="redo" :width="12" :height="12" />
        </button>
        <!-- <button
						class="menubar__button"
						@click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
					>
            <svg-icon name="table" :width="12" :height="12"></svg-icon>
				</button> -->

        <span v-if="isActive.table()">
          <button
            class="menubar__button"
            @click="commands.deleteTable"
          >
            <!-- <icon name="delete_table" /> -->
            <svg-icon name="delete_table" :width="12" :height="12" />
          </button>
          <button
            class="menubar__button"
            @click="commands.addColumnBefore"
          >
            <!-- <icon name="add_col_before" /> -->
            <svg-icon name="add_col_before" :width="12" :height="12" />
          </button>
          <button
            class="menubar__button"
            @click="commands.addColumnAfter"
          >
            <!-- <icon name="add_col_after" /> -->
            <svg-icon name="add_col_after" :width="12" :height="12" />
          </button>
          <button
            class="menubar__button"
            @click="commands.deleteColumn"
          >
            <!-- <icon name="delete_col" /> -->
            <svg-icon name="delete_col" :width="12" :height="12" />
          </button>
          <button
            class="menubar__button"
            @click="commands.addRowBefore"
          >
            <!-- <icon name="add_row_before" /> -->
            <svg-icon name="add_row_before" :width="12" :height="12" />
          </button>
          <button
            class="menubar__button"
            @click="commands.addRowAfter"
          >
            <!-- <icon name="add_row_after" /> -->
            <svg-icon name="add_row_after" :width="12" :height="12" />
          </button>
          <button
            class="menubar__button"
            @click="commands.deleteRow"
          >
            <!-- <icon name="delete_row" /> -->
            <svg-icon name="delete_row" :width="12" :height="12" />
          </button>
          <button
            class="menubar__button"
            @click="commands.toggleCellMerge"
          >
            <!-- <icon name="combine_cells" /> -->
            <svg-icon name="combine_cells" :width="12" :height="12" />
          </button>
        </span>
        <!-- <button
          class="menubar__button"
          @click="showImagePrompt(commands.image)">
          <svg-icon name="image" :width="12" :height="12"></svg-icon>
        </button> -->
        <el-dialog
          :visible.sync="showRichTextImage"
          width="55%"
          :append-to-body="true"
          :close-on-click-modal="false"
          custom-class="RichTextImageModal"
        >
          <template slot="title">
            <div class="modal_title">
              <svg-icon name="background-boat" /><span>插入图片</span>
            </div>
          </template>
          <!-- <rich-text-image v-if="showRichTextImage" @close="close" @confirm="confirm($event, commands.image)" :attachmentsList="attachmentsData"></rich-text-image> -->
          <rich-text-image v-if="showRichTextImage" @close="close" @confirm="confirm($event, commands.image)" />
        </el-dialog>
      </div>
    </editor-menu-bar>
    <editor-content :style="propStyle" class="editor__content edit" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import RichTextImage from '@/components/RichTextImage'

import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Link,
  Strike,
  Image,
  Underline,
  History
} from 'tiptap-extensions'
export default {
  components: {
    EditorContent,
    EditorMenuBar,
    RichTextImage
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    attachmentsList: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: String,
      default: ''
    },
    minHeight: String,
    maxHeight: String
  },
  data() {
    return {
      showRichTextImage: false,
      html: '',
      json: '',
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Image(),
          new Table({
            resizable: true
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow()
        ],
        content: this.value,
        onUpdate: ({ getJSON, getHTML }) => {
          this.json = getJSON()
          this.html = getHTML()
          // this.$emit('richTextChange', this.html)
          this.$emit('input', this.html)
        }
      })
    }
  },
  computed: {
    attachmentsData() {
      return this.attachmentsList.filter(item => item.fileType === 'IMG')
    },
    propStyle() {
      return {
        minHeight: this.minHeight,
        maxHeight: this.maxHeight
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    editorClick() {
    },
    showImagePrompt(command) {
      this.showRichTextImage = true
    },
    confirm(images, command) { // 添加上传的文件到富文本
      if (images.length > 0) {
        images.forEach(img => {
          command({ src: `${this.$ATT}/file/display/${img.id}?compressed=true` })
        })
      }
      this.showRichTextImage = false
    },
    close() {
      this.showRichTextImage = false
    }
  }
}
</script>
<style lang="scss" >
.tiptap {
  border: 1px solid rgba(217,217,217,.7);
  width:100%;
  .editor__content{
    max-height: 250px;
    min-height: 150px;
    overflow-y: auto;
    padding:10px;
    box-sizing: border-box;
    border: 1px solid rgba(217,217,217,.7);;
    text-align: left;
    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;
      margin-top:10px;
    }
    p{
      padding: 0;
      height: 100%;
    }
  }
  .menubar{
    padding: 10px;
    box-sizing: border-box;
    border:1px solid rgba(217,217,217,.7);;
    text-align: left;
  }
  .ProseMirror:focus{
    outline: none;
  }
  .ProseMirror{
    min-height: 150px!important;
    width: 100%;
    p{
      padding:3px 0;
      margin: 0;
    }
    img{
      max-width: 100%;
      // width: 120px;
      // height: 120px;
    }
  }
  .menubar__button {
    position: relative;
    font-weight: 700;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: #000;
    padding: .2rem .5rem;
    margin-right: .2rem;
    border-radius: 3px;
    cursor: pointer;
  }
  .menubar__button:hover {
    background-color: rgba(0,0,0,.05);
  }
  :focus {
    outline: none;
  }
  .menubar__button.is-active {
    background-color: rgba(0,0,0,.1);
  }

  // 富文本里面标签的样式
  /deep/ table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;
    line-height: 18px;
  }
  /deep/  ol {
    list-style-type: decimal;
    line-height: 18px;
    padding-left:15px;
  }
  /deep/  ul {
    list-style-type: disc;
    margin-block-start: 0px;
    margin-block-end: 0px;
    line-height: 18px;
    // list-style-position: inside;
    padding-left:15px
  }
  /deep/  td, th {
    min-width: 1em;
    line-height: 18px;
    border: 2px solid grey;
    padding: 3px 5px;
    min-height: 40px;
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
  /deep/ p{
    min-height: 16px;
  }
  }

  /deep/ th {
    font-weight: bold;
    text-align: left;
  }
  /deep/ p{
    padding:3px 0;
    line-height: 18px;
    margin: 0;
  }
    /deep/ img{
  // max-width: 100%;
  max-width: 100%;
  }

}

</style>
