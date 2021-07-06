<template>
  <div>

    <VueUeditorWrap v-model="col.data" :config="editorConfig" :editor-id="col.field"  @beforeInit="addCustomDialog"></VueUeditorWrap>
    <!-- 自定义上传图片功能 (使用element upload组件) -->
    <el-dialog
      :title="$t('page.imgUploading')"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="33%"
      append-to-body>
      <el-upload :drag="true" :data="col.option"
                 :headers="uploadHeaders"
                 class="upload-demo"
                 :on-success="(response, file, fileList)=>uploadSuccessHandle(response, file, fileList, col)"
                 :action="col.action || defaultUploadUrl"
                 :show-file-list="false"
                 :auto-upload="true"
                 :before-upload="(file) => uploadBeforeUploadHandle(file,col)">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{$t('page.drag')}}<em>{{$t('page.clickUpload')}}</em></div>
        <span>{{col.loading}}</span>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
    /*import { getToken } from '@/utils/auth'
    import { localRead, getQueryString } from '@/utils/tools'*/
    import VueUeditorWrap from 'vue-ueditor-wrap'
    import Url from "@/components/page/url"
    export default {
        name: "ueditor",
        components:{
            VueUeditorWrap
        },
        props: {
            col:true,
        },
        data() {
            return {
                dialogVisible:false,
                editorConfig:{
                    UEDITOR_HOME_URL: "/UEditor/",
                    // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    //serverUrl: Url.img.upload,
                    toolbars: [[
                        'fullscreen', 'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'directionalityltr', 'directionalityrtl', 'indent', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                        /*'simpleupload', 'insertimage',*/ 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
                        'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
                        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                        'print', 'preview', 'searchreplace', 'drafts', 'help'
                    ]],
                },
                defaultUploadUrl:Url.img.upload,
                uploadHeaders:{},
                uploading: false
            };
        },
        mounted(){
           /* if (localRead('sysToken')) {
                this.uploadHeaders.Authorization = localRead('sysToken');
            }else if (window.SITE_CONFIG['routerLabel']) {
                this.uploadHeaders.Authorization =  getToken(window.SITE_CONFIG['routerLabel'])
            } else if (window.location.href.indexOf('label') != -1) {
                let labelRouter = getQueryString('label')
                this.uploadHeaders.Authorization = getToken(labelRouter)
            }*/
        },
        methods: {
            addCustomDialog(editorId) {
                window.UE.registerUI(
                    "my-uploadImg",
                    (editor, uiName) => {
                        // 参考http://ueditor.baidu.com/doc/#COMMAND.LIST
                        const btn = new window.UE.ui.Button({
                            name: "dialog-button",
                            title: "上传图片",
                            cssRules: `background-image: url('/UEditor/themes/default/images/icons.png')!important;background-position: -726px -76px;`,
                            onclick: () => {
                                // 渲染dialog
                                this.dialogVisible = true;
                                //editor.execCommand(uiName);
                            }
                        });
                        return btn;
                    },
                    200 /* 指定添加到工具栏上的那个位置，默认时追加到最后 */,
                    editorId /* 指定这个UI是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */
                );
            },
            uploadFile(url,col) {
                window.UE.getEditor(col.field).execCommand("insertimage", {
                     src: url,
                     /*width:'100',
                     height:'100'*/
                 });
            },
            uploadBeforeUploadHandle(file,col) {
                this.$set(col,"loading",window.$t('page.uploading'));
            },
            // 上传图片成功
            uploadSuccessHandle(response, file, fileList,col) {
                if (response.code == 0){
                    //this.$set(col, "data", response.result);
                    //col.data = response.result;
                    this.$set(col,"loading","");
                    this.uploadFile(response.result,col);
                    this.dialogVisible = false;
                }else{
                    this.$set(col,"loading",window.$t('page.uploadFail'));
                }
            }
        }
    };
</script>

<style scoped>
</style>
