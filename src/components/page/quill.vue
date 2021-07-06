<template>
  <div>
    <span v-if="uploading">{{$t('page.imgUploading')}}</span>
    <div :id="quillId" style="height: 300px"></div>
    <!-- 自定义上传图片功能 (使用element upload组件) -->
    <el-upload :action="uploadUrl || defaultUploadUrl" :headers="uploadHeaders" :show-file-list="false" :before-upload="uploadBeforeUploadHandle" :on-success="uploadSuccessHandle" style="display: none;">
      <el-button ref="uploadBtn" type="primary" size="small">{{$t('page.upload')}}</el-button>
    </el-upload>
  </div>
</template>

<script>
    import "quill/dist/quill.snow.css";
    import Quill from "quill";
   /* import { getToken } from '@/utils/auth'
    import { localRead, getQueryString } from '@/utils/tools'*/
    import Url from "@/components/page/url"
    let quillEditor;
    export default {
        name: "quill",
        props: {
            uploadUrl:false,
            quillId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                defaultUploadUrl:Url.img.upload,
                uploadHeaders:{},
                quillEditor: null,
                quillEditorToolbarOptions: [
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block", "image"],
                    [{ header: 1 }, { header: 2 }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "rtl" }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ["clean"],
                ],
                uploading: false
            };
        },
        mounted(){
            /*if (localRead('sysToken')) {
                this.uploadHeaders.Authorization = localRead('sysToken');
            }else if (window.SITE_CONFIG['routerLabel']) {
                this.uploadHeaders.Authorization =  getToken(window.SITE_CONFIG['routerLabel'])
            } else if (window.location.href.indexOf('label') != -1) {
                let labelRouter = getQueryString('label')
                this.uploadHeaders.Authorization = getToken(labelRouter)
            }*/
        },
        methods: {
            init(html) {
                this.$nextTick(() => {
                    if (this.quillEditor) {
                        this.quillEditor.deleteText(0, this.quillEditor.getLength());
                    } else {
                        this.quillEditorHandle();
                    }
                    if (html != null && html != "") this.quillEditor.root.innerHTML = html;
                });
            },
            text(html) {
                if (this.quillEditor) {
                    this.$set(this.quillEditor.root, "innerHTML", html);
                }
            },
            // 富文本编辑器
            quillEditorHandle() {
                this.quillEditor = new Quill("#" + this.quillId, {
                    modules: {
                        toolbar: {
                            container: this.quillEditorToolbarOptions,
                            /*handlers: {
                                table: function () {
                                    quillEditor.getModule('table').insertTable(2, 3)
                                },
                                'table-insert-row': function () {
                                    quillEditor.getModule('table').insertRowBelow()
                                },
                                'table-insert-column': function () {
                                    quillEditor.getModule('table').insertColumnRight()
                                },
                                'table-delete-row': function () {
                                    quillEditor.getModule('table').deleteRow()
                                },
                                'table-delete-column': function () {
                                    quillEditor.getModule('table').deleteColumn()
                                }
                            },*/
                        },
                        //table: true
                    },
                    theme: "snow",
                });
                quillEditor = this.quillEditor;
                // 自定义上传图片功能 (使用element upload组件)
                this.quillEditor.getModule("toolbar").addHandler("image", () => {
                    this.$refs.uploadBtn.$el.click();
                });

                /*this.$el.querySelector(
                    '.ql-table-insert-row'
                ).innerHTML = `<svg t="1591862376726" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6306" width="18" height="200"><path d="M500.8 604.779L267.307 371.392l-45.227 45.27 278.741 278.613L779.307 416.66l-45.248-45.248z" p-id="6307"></path></svg>`
                this.$el.querySelector(
                    '.ql-table-insert-column'
                ).innerHTML = `<svg t="1591862238963" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6509" width="18" height="200"><path d="M593.450667 512.128L360.064 278.613333l45.290667-45.226666 278.613333 278.762666L405.333333 790.613333l-45.226666-45.269333z" p-id="6510"></path></svg>`
                this.$el.querySelector(
                    '.ql-table-delete-row'
                ).innerHTML = `<svg t="1591862253524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6632" width="18" height="200"><path d="M500.8 461.909333L267.306667 695.296l-45.226667-45.269333 278.741333-278.613334L779.306667 650.026667l-45.248 45.226666z" p-id="6633"></path></svg>`
                this.$el.querySelector(
                    '.ql-table-delete-column'
                ).innerHTML = `<svg t="1591862261059" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6755" width="18" height="200"><path d="M641.28 278.613333l-45.226667-45.226666-278.634666 278.762666 278.613333 278.485334 45.248-45.269334-233.365333-233.237333z" p-id="6756"></path></svg>`
                */
                // 监听内容变化，动态赋值
                this.quillEditor.on("text-change", () => {
                    //this.textchange(this.quillEditor.root.innerHTML);
                });
            },
            getHtml() {
                if (this.quillEditor.root.innerHTML == "<p><br></p>") this.quillEditor.root.innerHTML = null;
                return this.quillEditor.root.innerHTML;
            },
            // 上传图片之前
            uploadBeforeUploadHandle(file) {
                if (
                    file.type !== "image/jpg" &&
                    file.type !== "image/jpeg" &&
                    file.type !== "image/png" &&
                    file.type !== "image/gif"
                ) {
                    this.$message.error(window.$t("page.imgLimit"));
                    return false;
                }
                this.uploading = true;
            },
            // 上传图片成功
            uploadSuccessHandle(res, file, fileList) {
                this.uploading = false;
                if (res.code != 0) {
                    return this.$message.error(res.msg);
                }
                this.quillEditor.insertEmbed(
                    this.quillEditor.getSelection().index,
                    "image",
                    res.result
                );
            }
        }
    };
</script>

<style scoped>
</style>
