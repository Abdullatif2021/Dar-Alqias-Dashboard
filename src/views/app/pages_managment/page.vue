<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :transaction_filter="false"
        :reload="true"
        :add_new_button="false"
        :title="$t('cards.page-details')"
      ></datatable-heading>
      <b-row>
        <b-colxx xxs="12" xs="12" lg="12" class="mb-3">
          <!-- <template> -->
          <b-card class="mb-4" no-body>
            <b-tabs card no-fade>
              <b-tab
                :title="$t(`forms.basic_details`)"
                active
                title-item-class="w-30 text-center"
              >
                <template v-if="_isLoadPage">
                  <label
                    style="display: flex;justify-content: center;"
                    class="form-group has-float-label"
                  >
                    <img
                      :src="pageData.image ? pageData.image : pageData.image"
                      style="border-radius: 20%;"
                      alt="Image"
                      width="120"
                      height="120"
                    />
                  </label>
                  <div
                    v-for="(lang, index) in $v.details_form.$each.$iter"
                    :key="index"
                  >
                    <label class="form-group has-float-label">
                      <b-input
                        type="text"
                        v-model="lang.name.$model"
                        :state="!lang.name.$error"
                        class="form-control"
                      />
                      <span>{{ $t(`forms.${lang._name.$model}_name`) }}</span>

                      <b-form-invalid-feedback v-if="!lang.name.required">{{
                        $t("forms.title_filed")
                      }}</b-form-invalid-feedback>
                    </label>
                    <label class="form-group has-float-label">
                      <quill-editor
                        ref="myTextEditor"
                        v-model="lang.description.$model"
                        :options="editorOption"
                      >
                      </quill-editor>
                      <span>{{ $t(`forms.${lang._name.$model}_desc`) }}</span>
                    </label>
                  </div>
                  <label class="form-group has-float-label">
                    <input
                      type="text"
                      v-model="pageData.type"
                      class="form-control"
                    />
                    <span>{{ $t("forms.type") }}</span>
                  </label>
                  <label class="form-group has-float-label">
                    <b-colxx xxs="12" style="padding: 0px;margin-top: 20px;">
                      <vue-dropzone
                        ref="myVueDropzone"
                        id="dropzone"
                        :options="dropzoneOptions"
                        @vdropzone-files-added="fileAdded"
                        @vdropzone-removed-file="fileRemoved"
                      ></vue-dropzone>
                    </b-colxx>
                    <span>{{ $t("forms.image") }}</span>
                  </label>
                  <b-colxx
                    xxs="12"
                    style="display: flex;align-items: center;justify-content: center;"
                  >
                    <!-- <h3>{{ items.length }}</h3> -->
                    <b-button
                      @click="save()"
                      class="mb-2"
                      :disabled="enable"
                      size="lg"
                      variant="primary"
                      >{{ $t("button.save") }}
                      {{ $t("button.changes") }}</b-button
                    >
                  </b-colxx>
                </template>
                <template v-else>
                  <div class="loading"></div>
                </template>
              </b-tab>
              <b-tab
                :title="$t('forms.attach')"
                title-item-class="w-30 text-center"
              >
                <page_attachment :pageId="pageId" />
              </b-tab>
              <b-tab
                @click="meta()"
                :title="$t('forms.meta_data')"
                title-item-class="w-30 text-center"
              >
                <metaData
                  :list="_metaList"
                  :meta_type_list="_pageMetaTypeList"
                  :isLoad="is_LoadMeta"
                  :meta_success_create="_updateMetaPage"
                  @create-meta="createMeta"
                  @update-meta="updateMeta"
                  @delete-meta="deleteMeta"
                />
              </b-tab>
            </b-tabs>
          </b-card>
        </b-colxx>
      </b-row>
    </b-colxx>
  </b-row>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import page_attachment from "./page_attachment.vue";
import { quillEditor } from "vue-quill-editor";
import { mapGetters, mapActions } from "vuex";
import VueDropzone from "vue2-dropzone";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import metaData from "../../../components/shared/metaData.vue";

export default {
  components: {
    "add-new-modal": AddNewModal,
    "quill-editor": quillEditor,
    metaData: metaData,
    vuetable: Vuetable,
    "datatable-heading": DatatableHeading,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "vue-dropzone": VueDropzone,
    page_attachment
  },
  data() {
    return {
      pageId: null,
      pageData: null,
      file: null,
      enable: false,
      langs: null,
      details_form: [],

      dropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        maxFilesize: 10,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        uploadMultiple: false,
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {},
        acceptedFiles: "image/jpeg,image/png,image/gif"
      },

      // quillEditor
      content: "",
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" }
            ],
            ["link", "image"],
            ["clean"]
          ]
        }
      },
      contentBubble: "",
      editorOptionBubble: {
        theme: "bubble",
        placeholder: "",
        modules: {
          toolbar: [
            [
              "bold",
              "italic",
              "link",
              { header: 1 },
              { header: 2 },
              "blockquote"
            ]
          ]
        }
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    details_form: {
      $each: {
        name: {
          required
        },
        description: {},
        _name: {}
      }
    }
  },
  created() {
    this.pageId = this.$route.query.id;
    this.getPage({ id: this.pageId });
    this.langs = localStorage.getItem("Languages");
    this.getMetaTypeList();
    this.make_collaction(this.langs, this.details_form);
  },
  methods: {
    ...mapActions([
      "getPage",
      "getPageMeta",
      "updatePageData",
      "getMetaList",
      "deleteMetaPage",
      "updateMetaPage",
      "createMetaPage",
      "getMetaTypeList",
      "getPageImageList",
      "deletePageImage"
    ]),
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          name: "",
          description: "",
          _name: el.name
        });
      });
    },
    save() {
      this.$v.$touch();
      this.$v.details_form.$touch();
      if (!this.$v.details_form.$invalid) {
        this.enable = true;
        this.updatePageData({
          id: this.pageData.id,
          data: {
            type: this.pageData.type
          },
          info: this.$v.details_form.$model,
          file: this.file ? this.file[0] : null
        });
      }
    },
    //  ....................... meta data ................

    meta() {
      this.getMetaList({ id: this.pageId });
    },
    createMeta(select, content) {
      this.createMetaPage({
        meta_type_id: select,
        pageId: this.pageId,
        info: content
      });
    },
    updateMeta(select, content, id) {
      this.updateMetaPage({
        meta_type_id: select,
        metadata_id: id,
        pageId: this.pageId,
        info: content
      });
    },
    deleteMeta(id) {
      this.deleteMetaPage({ pageId: this.pageId, metadata_id: id });
    },
    fileAdded(file) {
      this.file = file;
    },
    fileRemoved(file) {
      this.file = null;
    },
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `;
    }
  },
  computed: {
    ...mapGetters([
      "_page",
      "_metaList",
      "_updateMetaPage",
      "_pageMetaTypeList",
      "_isLoadPage",
      "is_LoadMeta",
      "_updatePageDetailsSuccess"
    ])
  },
  watch: {
    _page(newpage, oldone) {
      this.details_form.forEach(el => {

        el.title = newpage.locales[el._name].title;
        el.description = newpage.locales[el._name].description;
      });
      this.pageData = newpage;
      this.enable = false;
    },

    _updatePageDetailsSuccess(newOne, old) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Page Details have been updated successfully",
        { duration: 3000, permanent: false }
      );
    }
  }
};
</script>
