<template>
  <b-row>
    <b-colxx xxs="12">
      <datatable-heading
        :details="true"
        :add_new_button="false"
        :add_new_title="$t('todo.add-new-custom-filed')"
        @add_new="add_newCustomField"
        :reload="true"
        :transaction_filter="false"
        :title="auctionId ? $t('forms.editAuction') : $t('forms.createAuction')"
      ></datatable-heading>
      <template v-if="isLoadAuction || _isLoadSubCategory">
        <b-card v-if="!auctionId" class="mb-4">
          <b-card-body class="wizard wizard-default">
            <form-wizard
              :with-validate="true"
              :saveBtn="saveBtn"
              :top-nav-disabled="true"
              :disableNextBtn="disableNextBtn"
              :last-step-end="true"
              nav-class="justify-content-between"
            >
              <tab
                :name="$t('wizard.step-name-1')"
                :selected="true"
                :validate="validateStep1"
              >
                <div class="wizard-basic-step">
                  <b-form>
                    <b-row>
                      <b-colxx style="display: block;padding: 0px;" sm="12">
                      <label
                        v-if="image"
                        style="display: flex;justify-content: center;"
                        class="form-group has-float-label"
                      >
                      <div class="position-absolute card-top-buttons-1">
                        <b-button variant="outline-white" class="icon-button">
                          <i @click="delete_img"
                                class="simple-icon-trash" />
                        </b-button>
                      </div>
                        <img
                          :src="imgUrl"
                          style="border-radius: 50%;"
                          alt="Image"
                          width="160"
                          height="160"
                        />
                      </label>
                      </b-colxx>
                     <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="desc">{{
                          $t("forms.auction_no")
                        }}</label>
                        <b-form-input
                          type="number"
                          :state="!$v.gridForm1.auction_number.$error"
                          v-model="$v.gridForm1.auction_number.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm1.auction_number.required"
                          >{{
                            $t("forms.auction_number_message")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="cate">{{
                          $t("forms.category")
                        }}</label>
                        <b-form-input
                        style="display: none;"
                        :state="!$v.gridForm1.category_id.$error"
                        v-model="$v.gridForm1.category_id.$model"
                      />
                        <b-form-select
                          id="cate"
                          v-model="selected_sub_category"
                          @change="get_SubCat"
                          plain
                        >
                        <b-form-select-option-group v-for="(cate,index) in categoryIdOptions"  :key="index"   :label="cate.text">
                          <b-form-select-option v-for="(sub_cate,index) in cate.value.sub_category"  :key="index" :value="sub_cate.id">{{sub_cate.slug}}</b-form-select-option>
                        </b-form-select-option-group>
                        </b-form-select>
                        <b-form-invalid-feedback
                          v-if="!$v.gridForm1.category_id.required"
                          >{{
                            $t("forms.category_type_select")
                          }}</b-form-invalid-feedback
                        >


                      </b-form-group>
                    </b-colxx>


                      <b-colxx sm="6">
                        <b-form-group
                          class="form-group-label"
                          :label="$t('forms.auction_side')"
                        >
                          <b-form-select
                            :state="!$v.gridForm1.auction_side.$error"
                            v-model="$v.gridForm1.auction_side.$model"
                            :options="auctionSideOptions"
                            plain
                          />
                          <b-form-invalid-feedback
                            v-if="!$v.gridForm1.auction_side.required"
                            >{{
                              $t("forms.auction_side_message")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
                      <b-colxx sm="6">
                        <b-form-group
                          class="form-group-label"
                          :label="$t('forms.auction_owner')"
                        >
                          <b-form-select
                            :state="!$v.gridForm1.auction_owner.$error"
                            v-model="$v.gridForm1.auction_owner.$model"
                            :options="auctionOwnerOptions"
                            plain
                          />
                          <b-form-invalid-feedback
                            v-if="!$v.gridForm1.auction_owner.required"
                            >{{
                              $t("forms.auction_owner_message")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
                      <b-colxx sm="6">
                        <b-form-group
                          class="form-group-label"
                          :label="$t('forms.start_date')"
                        >
                          <datepicker
                            style="width: 100%;"
                            type="datetime"
                            :disabled-date="disableDate"
                            value-type="YYYY-MM-DD HH:mm:ss"
                            v-model="$v.gridForm1.start_date.$model"
                            @change="selectedDate('start')"
                          ></datepicker>

                          <div
                            :class="{
                              'invalid-feedback': true,
                              'd-block':
                                $v.gridForm1.start_date.$error &&
                                !$v.gridForm1.start_date.required
                            }"
                          >
                            {{ $t("forms.start_date_req") }}
                          </div>
                        </b-form-group>
                      </b-colxx>
                      <b-colxx sm="6">
                        <b-form-group
                          class="form-group-label"
                          :label="$t('forms.end_date')"
                        >
                          <datepicker
                            style="width: 100%;"
                            type="datetime"
                            :disabled-date="disableDate"
                            value-type="YYYY-MM-DD HH:mm:ss"
                            v-model="$v.gridForm1.end_date.$model"
                            @change="selectedDate('end')"
                          >
                          </datepicker>
                          <div
                            :class="{
                              'invalid-feedback': true,
                              'd-block':
                                $v.gridForm1.end_date.$error &&
                                !$v.gridForm1.end_date.required
                            }"
                          >
                            {{ $t("forms.end_date_req") }}
                          </div>
                        </b-form-group>
                      </b-colxx>
                       <!-- <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="bro">{{
                        $t("forms.brochure")
                      }}</label>
                      <b-form-input
                        style="display: none;"
                        :state="!$v.files_form.brochure.$error"
                        v-model="$v.files_form.brochure.$model"
                      />
                      <b-input-group id="bro" class="mb-3">
                        <b-form-file
                          accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                          :placeholder="$t('input-groups.change-brochure')"
                          v-model="brochure"
                        ></b-form-file>
                      </b-input-group>

                      <b-form-invalid-feedback
                        v-if="!$v.files_form.brochure.required"
                        >{{
                          $t("forms.choose-brochure-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="cond">{{
                        $t("forms.terms_conditions")
                      }}</label>
                      <input
                        style="display: none;"
                        :state="!$v.files_form.terms_conditions.$error"
                        v-model="$v.files_form.terms_conditions.$model"
                      />
                      <b-input-group id="cond" class="mb-3">
                        <b-form-file
                          accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                          :placeholder="
                            $t('input-groups.change-terms_conditions')
                          "
                          v-model="terms_conditions"
                        ></b-form-file>

                      </b-input-group>
                      <b-form-invalid-feedback
                        v-if="!$v.files_form.terms_conditions.required"
                        >{{
                          $t("forms.choose-terms_conditions-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx> -->
                  <b-colxx class="main_image_uploader" sm="12"><b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="bro">{{
                        $t('forms.image')
                      }}</label>
                      <b-form-input
                        style="display: none;"
                        :state="!$v.files_form.image.$error"
                        v-model="$v.files_form.image.$model"
                      />
                      <b-input-group class="mb-3">
                        <b-form-file
                          accept="image/*"
                          :placeholder="$t('forms.choose-image')"
                          v-model="image"
                          @change="image_selected()"
                        ></b-form-file>
                      </b-input-group>

                      <b-form-invalid-feedback
                        v-if="!$v.files_form.image.required"
                        >{{
                           $t("forms.choose-image-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>

                  </b-colxx>
                    </b-row>
                  </b-form>
                </div>
              </tab>
              <tab
                :name="$t('forms.localzations')"
                :validate="validateStep2"
              >
                <div class="wizard-basic-step">

                        <div
                          v-for="(lang, index) in $v.lang_form.$each.$iter"
                          :key="index"
                        >
                        <b-form>
                    <b-row>
                          <b-colxx sm="12">
                            <b-form-group>
                              <label class="form-group-label" for="Name">{{
                                $t(`forms.${lang._name.$model}_title`)
                              }}</label>
                              <b-form-input
                                id="Name"
                                type="text"
                                v-model="lang.title.$model"
                                :state="!lang.title.$error"
                              />
                              <b-form-invalid-feedback
                                v-if="!lang.title.required"
                                >{{
                                  $t(`forms.${lang._name.$model}_massege`)
                                }}</b-form-invalid-feedback
                              >
                            </b-form-group>
                          </b-colxx>
                          <b-colxx sm="12">
                            <b-form-group>
                              <label class="form-group-label" for="desc">{{
                                $t(`forms.${lang._name.$model}_desc`)
                              }}</label>
                              <b-form-textarea
                                id="textarea"
                                rows="3"
                                max-rows="6"
                                v-model="lang.description.$model"
                              ></b-form-textarea>
                            </b-form-group>
                          </b-colxx>
                          <b-colxx sm="6">
                            <b-form-group>
                              <label class="form-group-label" for="bro">{{
                                $t("forms.brochure")
                              }}</label>
                              <b-input-group class="mb-3">
                                <b-form-file
                                  accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                                  :placeholder="$t('input-groups.change-brochure')"
                                   v-model="lang.brochure.$model"
                                ></b-form-file>

                              </b-input-group>


                            </b-form-group>
                          </b-colxx>
                          <b-colxx sm="6">
                            <b-form-group>
                              <label class="form-group-label" >{{
                                $t("forms.terms_conditions")
                              }}</label>

                              <b-input-group class="mb-3">
                                <b-form-file
                                  accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                                  :placeholder="
                                    $t('input-groups.change-terms_conditions')
                                  "
                                v-model="lang.terms_conditions.$model"
                                ></b-form-file>

                              </b-input-group>

                            </b-form-group>
                          </b-colxx>


                   </b-row>
                   </b-form>
                     </div>
                </div>
              </tab>
              <tab
              v-if="!is_group_auction"
              :name="$t('forms.binig-info')"
               :validate="validateStep3"
              >
                <div class="wizard-basic-step">
                  <b-form>
                    <b-row>

                      <b-colxx sm="4">
                        <b-form-group
                          class="form-group-label"
                          :label="$t('forms.minimum_price')"
                        >
                          <b-form-input
                            type="number"
                            :state="!$v.gridForm.minimum_paid.$error"
                            v-model="$v.gridForm.minimum_paid.$model"
                          />
                          <b-form-invalid-feedback
                            v-if="!$v.gridForm.minimum_paid.required"
                            >{{
                              $t("forms.min_price")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
 <b-colxx sm="4">
                    <b-form-group>
                      <label class="form-group-label" for="desc">{{
                        $t("forms.deposit")
                      }}</label>
                      <b-form-input
                        type="number"
                        :state="!$v.gridForm.deposit.$error"
                        v-model="$v.gridForm.deposit.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.deposit.required"
                        >{{
                          $t("forms.deposit_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                      <b-colxx sm="4">
                        <b-form-group
                          class="form-group-label"
                          :label="$t('forms.opening_price')"
                        >
                          <b-form-input
                            type="number"
                            :state="!$v.gridForm.opening_price.$error"
                            v-model="$v.gridForm.opening_price.$model"
                          />
                          <b-form-invalid-feedback
                            v-if="!$v.gridForm.opening_price.required"
                            >{{
                              $t("forms.open_price")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
                      </b-row>
                      </b-form>
                </div>
              </tab>
               <tab
                :name="$t('forms.location')"
                :validate="validateStep4"
              >
                <div class="wizard-basic-step">
                   <b-form>
                    <b-row>
                     <b-colxx sm="6">
                        <b-form-group
                          class="form-group-label"
                          :label="$t('forms.area')"
                          
                        >
                          <b-form-select
                            :state="!$v.locationForm.area_id.$error"
                            v-model="$v.locationForm.area_id.$model"
                            :options="areaOptions"
                            @change="get_cities()"
                            plain
                          />
                          <b-form-invalid-feedback
                            v-if="!$v.locationForm.area_id.required"
                            >{{
                              $t("forms.area-message")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
                       <b-colxx sm="6">
                        <b-form-group
                          class="form-group-label"
                          :label="$t('forms.city')"
                        >
                          <b-form-select
                            :state="!$v.locationForm.city_id.$error"
                            v-model="$v.locationForm.city_id.$model"
                            @change="default_city_select"
                            :options="cityOptions"
                            plain
                          />
                          <b-form-invalid-feedback
                            v-if="!$v.locationForm.city_id.required"
                            >{{
                              $t("forms.city-message")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
                       <b-colxx sm="12">
                        <b-form-group
                          class="form-group-label"
                          :label="$t('forms.location')"
                        >
                          <googleMaps
                            :location="location"
                            @select_location="set_location"
                          />
                          <b-form-input
                            style="display: none;"
                            :state="!$v.locationForm.latitude.$error"
                            v-model="$v.locationForm.latitude.$model"
                          />

                          <b-form-invalid-feedback
                            v-if="!$v.locationForm.latitude.required"
                            >{{
                              $t("forms.location_req")
                            }}</b-form-invalid-feedback
                          >
                        </b-form-group>
                      </b-colxx>
                       </b-row>
                      </b-form>
                </div>
              </tab>
              <tab
                :name="$t('wizard.step-name-2')"
                :validate="validateStep4"
                :submit="onGridFormSubmit"
              >
                <div v-if="is_group_auction" class="wizard-basic-step">
                <b-row class="add_container">
                  <b-colxx sm="12">
                    <b-form-group>
                        <vue-dropzone
                          ref="myVueDropzone"
                          id="dropzone"
                          :options="attachDropzoneOptions"
                          @vdropzone-files-added="attachAdded"
                          @vdropzone-removed-file="attachRemoved"
                        ></vue-dropzone>
                      </b-form-group>
                  </b-colxx>
                
                   </b-row>
                   
                </div>
                <div v-else class="wizard-basic-step">
                <b-row class="add_container">
                  <b-colxx sm="10">
                    <b-form-group  :label="$t(`forms.select-new-custom`)" class="form-group-label">
                      <b-form-select
                        v-model="selectedCustomField"
                        :options="categoryCustomFieldOptions"
                        @change="selectCustomField"
                        plain
                      />

                    </b-form-group>
                  </b-colxx>
                   <b-colxx sm="2">
                    <b-form-group style="margin: 8px;"  class="form-group-label">
                       <b-button
                        @click="add_newCustomField()"
                        type="submit"
                        variant="primary"
                        class="mt-4"
                        >+ Add</b-button
                      >
                    </b-form-group>


                  </b-colxx>
                   </b-row>
                      <div
                    style="display: flex;"
                    v-for="field in selectedFields"
                    :key="field.id"
                  >
                    <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                      <b-form-group
                        class="form-group-label"
                        :label="field.locales.en.name"
                      >
                        <b-form-input
                          @change="addCustomValue"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.value"
                        />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="field.type === 'INT'" sm="6">
                      <b-form-group
                        class="form-group-label"
                        :label="$t('forms.unit')"
                      >
                        <b-form-input type="text" v-model="field.unit" />
                      </b-form-group>
                    </b-colxx>
                  </div>

                  <add-new-custom-field
                    @create-custom-field="create_custom_field"
                    :showCreateModal="showCreateModal"
                    :hideCustomModal="hideCustomModal"
                  />
                </div>
              </tab>
              <tab type="done">
                <div class="wizard-basic-step text-center pt-3">
                  <div v-if="isProcessing">
                    <b-spinner
                      variant="primary"
                      label="Spinning"
                      class="mb-1"
                    ></b-spinner>
                  </div>
                  <div v-else>
                    <h2 class="mb-2">{{ $t("wizard.content-thanks") }}</h2>
                    <p>{{ $t("wizard.registered") }}</p>
                  </div>
                </div>
              </tab>
            </form-wizard>
          </b-card-body>
        </b-card>
        <b-card v-if="auctionId" class="mb-4 auctionDetailsContainer">
          <b-row>
            <b-colxx style="margin-top: 26px;" xxs="12">
              <b-card class="mb-4 auction_card">
                <b-form>
                  <b-row style="margin: 42px;">
                    <b-colxx style="position: absolute;top: -104px;left: 1px;padding: 0px;" sm="12">
                      <label
                        style="display: flex;justify-content: center;"
                        class="form-group has-float-label"
                      >
                      <div class="position-absolute card-top-buttons-1">
                        <b-button v-b-modal.main_image variant="outline-white" class="icon-button">
                          <i class="simple-icon-pencil" />
                        </b-button>
                      </div>
                        <img
                          :src="image ? imgUrl : $v.files_form.image.$model"
                          style="border-radius: 50%;"
                          alt="Image"
                          width="160"
                          height="160"
                        />
                      </label>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="desc">{{
                          $t("forms.auction_no")
                        }}</label>
                        <b-form-input
                          type="number"
                          :state="!$v.formStep1.auction_number.$error"
                          v-model="$v.formStep1.auction_number.$model"
                        />
                        <b-form-invalid-feedback
                          v-if="!$v.formStep1.auction_number.required"
                          >{{
                            $t("forms.auction_number_message")
                          }}</b-form-invalid-feedback
                        >
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="cate">{{
                          $t("forms.category")
                        }}</label>
                        <b-form-select
                          id="cate"
                          v-model="selected_sub_category"
                          @change="get_SubCat"
                          plain
                        >
                        <b-form-select-option-group v-for="(cate,index) in categoryIdOptions"  :key="index"   :label="cate.text">
                          <b-form-select-option v-for="(sub_cate,index) in cate.value.sub_category"  :key="index" :value="sub_cate.id">{{sub_cate.slug}}</b-form-select-option>
                          <!-- <b-form-select-option :value="{ R: '2D2' }">Another option with object value</b-form-select-option> -->
                        </b-form-select-option-group>
                        </b-form-select>
                        <b-form-invalid-feedback
                          v-if="!$v.formStep1.category_id.required"
                          >{{
                            $t("forms.category_type_select")
                          }}</b-form-invalid-feedback
                        >


                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="side">{{
                        $t("forms.auction_side")
                      }}</label>
                      <b-form-select
                        id="side"
                        :state="!$v.formStep1.auction_side.$error"
                        v-model="$v.formStep1.auction_side.$model"
                        :options="auctionSideOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep1.auction_side.required"
                        >{{
                          $t("forms.auction_side_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="owner">{{
                        $t("forms.auction_owner")
                      }}</label>
                      <b-form-select
                        id="owner"
                        :state="!$v.formStep1.auction_owner.$error"
                        v-model="$v.formStep1.auction_owner.$model"
                        :options="auctionOwnerOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep1.auction_owner.required"
                        >{{
                          $t("forms.auction_owner_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="start">{{
                          $t("forms.start_date")
                        }}</label>
                        <datepicker
                          id="start"
                          style="width: 100%;"
                          type="datetime"
                          :disabled-date="disableDate"
                          value-type="YYYY-MM-DD HH:mm:ss"
                          v-model="$v.formStep1.start_date.$model"
                          @change="selectedDate('start')"
                        >
                        </datepicker>

                        <div
                          :class="{
                            'invalid-feedback': true,
                            'd-block':
                              $v.formStep1.start_date.$error &&
                              !$v.formStep1.start_date.required
                          }"
                        >
                          {{ $t("forms.start_date_req") }}
                        </div>
                      </b-form-group>
                    </b-colxx>
                    <b-colxx sm="6">
                      <b-form-group>
                        <label class="form-group-label" for="end">{{
                          $t("forms.end_date")
                        }}</label>
                        <datepicker
                          id="id"
                          style="width: 100%;"
                          type="datetime"
                          :disabled-date="disableDate"
                          value-type="YYYY-MM-DD HH:mm:ss"
                          v-model="$v.formStep1.end_date.$model"
                          @change="selectedDate('end')"
                        >
                        </datepicker>
                        <div
                          :class="{
                            'invalid-feedback': true,
                            'd-block':
                              $v.formStep1.end_date.$error &&
                              !$v.formStep1.end_date.required
                          }"
                        >
                          {{ $t("forms.end_date_req") }}
                        </div>
                      </b-form-group>
                    </b-colxx>
                    
                  <div style="width: 100%">
<b-button
                    :disabled="disabledFormStep1"
                    type="submit"
                    @click="onForm1Submited()"
                    :variant="disabledFormStep1 ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                    <b-button
                      :disabled="disabledFormStep1"
                      type="submit"
                      style="float: right"
                      @click="openDeleteModal()"
                      :variant="disabledFormStep1 ? 'light' : 'outline-theme-6'"
                      class="mt-4"
                      >{{ $t("forms.delete") }}</b-button
                    >
                  </div>
                  </b-row>
                </b-form>
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.localzations')">
                <div
                  v-for="(lang, index) in $v.lang_form.$each.$iter"
                  :key="index"
                >
                  <div class="d-flex flex-grow-1 min-width-zero" role="tab">
                    <b-button
                      href="#"
                      class="callBtn"
                      v-b-toggle="`faq_${lang._name.$model}`"
                      variant="link"
                      >{{ $t(`forms.${lang._name.$model}_lang`) }}
                      <span>
                        </span
                      >
                    </b-button>
                  </div>
                  <b-collapse
                    :id="`faq_${lang._name.$model}`"
                    :visible="index === 0"
                    accordion="faq-accordion"
                    role="tabpanel"
                  >
                    <div class="card-body accordion-content pt-0">
                      <b-form>
                        <b-row>
                          <b-colxx sm="12">
                            <b-form-group>
                              <label class="form-group-label" for="Name">{{
                                $t(`forms.${lang._name.$model}_title`)
                              }}</label>
                              <b-form-input
                                id="Name"
                                type="text"
                                v-model="lang.title.$model"
                                :state="!lang.title.$error"
                              />
                              <b-form-invalid-feedback
                                v-if="!lang.title.required"
                                >{{
                                  $t(`forms.${lang._name.$model}_massege`)
                                }}</b-form-invalid-feedback
                              >
                            </b-form-group>
                          </b-colxx>
                          <b-colxx sm="12">
                            <b-form-group>
                              <label class="form-group-label" for="desc">{{
                                $t(`forms.${lang._name.$model}_desc`)
                              }}</label>
                              <b-form-textarea
                                id="textarea"
                                rows="3"
                                max-rows="6"
                                v-model="lang.description.$model"
                              ></b-form-textarea>
                            </b-form-group>
                          </b-colxx>
                          <b-colxx sm="6">
                            <b-form-group>
                              <label class="form-group-label">{{
                                $t("forms.brochure")
                              }}</label>
                              <b-input-group class="mb-3">
                                <b-form-file
                                  accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                                  :placeholder="$t('input-groups.change-brochure')"
                                   v-model="lang.brochure.$model"
                                ></b-form-file>
                                <b-input-group-append>
                                  <b-button
                                    @click="open(lang.brochure.$model)"
                                    variant="light default"
                                    :disabled="lang.brochure == '' || disabledAttachLangsBtn"
                                    >{{ $t("OPEN") }}</b-button
                                  >
                                  <b-button
                                    @click="deleteTermsBrochure({type: 'brochure', id: lang.id.$model})"
                                    variant="light"
                                    :disabled="!lang.brochure || disabledAttachLangsBtn"
                                    ><i style="font-size: 16px;color: red;" class="simple-icon-trash"></i></b-button
                                  >
                                </b-input-group-append>
                              </b-input-group>


                            </b-form-group>
                          </b-colxx>
                          <b-colxx sm="6">
                            <b-form-group>
                              <label class="form-group-label" >{{
                                $t("forms.terms_conditions")
                              }}</label>

                              <b-input-group class="mb-3">
                                <b-form-file
                                  accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                                  :placeholder="
                                    $t('input-groups.change-terms_conditions')
                                  "
                                v-model="lang.terms_conditions.$model"
                                ></b-form-file>
                                <b-input-group-append>
                                  <b-button
                                    @click="
                                      open(lang.terms_conditions.$model)
                                    "
                                    variant="light default"
                                    :disabled="lang.terms_conditions == '' || disabledAttachLangsBtn"
                                    >{{ $t("OPEN") }}</b-button
                                  >
                                  <b-button
                                    @click="deleteTermsBrochure({type: 'terms_conditions', id: lang.id.$model})"
                                    variant="light"
                                    :disabled="lang.terms_conditions == '' || disabledAttachLangsBtn"
                                    ><i style="font-size: 16px;color: red;" class="simple-icon-trash"></i></b-button
                                  >
                                </b-input-group-append>
                              </b-input-group>
                              <!-- <b-form-invalid-feedback
                                v-if="!$v.files_form.terms_conditions.required"
                                >{{
                                  $t("forms.choose-terms_conditions-message")
                                }}</b-form-invalid-feedback
                              > -->
                            </b-form-group>
                          </b-colxx>
                        </b-row>
                      </b-form>
                    </div>
                  </b-collapse>
                </div>
                 <b-button
                    :disabled="disabledFormStep2"
                    type="submit"
                    @click="onForm2Submited()"
                    :variant="disabledFormStep2 ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.binig-info')">
                <b-row>
                  <b-colxx sm="4">
                    <b-form-group>
                      <label class="form-group-label" for="desc">{{
                        $t("forms.deposit")
                      }}</label>
                      <b-form-input
                        type="number"
                        :state="!$v.formStep3.deposit.$error"
                        v-model="$v.formStep3.deposit.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep3.deposit.required"
                        >{{
                          $t("forms.deposit_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="4">
                    <b-form-group>
                      <label class="form-group-label" for="open">{{
                        $t("forms.opening_price")
                      }}</label>
                      <b-form-input
                        id="open"
                        type="number"
                        :state="!$v.formStep3.opening_price.$error"
                        v-model="$v.formStep3.opening_price.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep3.opening_price.required"
                        >{{ $t("forms.open_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="4">
                    <b-form-group>
                      <label class="form-group-label" for="min">{{
                        $t("forms.minimum_price")
                      }}</label>
                      <b-form-input
                        id="min"
                        type="number"
                        :state="!$v.formStep3.minimum_paid.$error"
                        v-model="$v.formStep3.minimum_paid.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep3.minimum_paid.required"
                        >{{ $t("forms.min_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                    <b-button
                    :disabled="disabledFormStep3"
                    type="submit"
                    @click="onForm3Submited()"
                    :variant="disabledFormStep3 ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                </b-row>
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.products')">
     <template>
    <b-row>
      <b-colxx xxs="12">
        <div class="product_btn">
          <b-button
            variant="primary"
            style="float: right;"
            class="top-right-button"
            @click="add_New()"
            >Add new</b-button
          >
        </div>
        <template v-if="_productsProcessing">
        
        <vuetable
            table-height="360px"
            ref="products_vuetable"
            class="table-divided order-with-arrow"
            :api-mode="false"
            :fields="products_fields"
        >
        <template slot="actions" slot-scope="props">
            <b-button
              variant="outline-theme-3"
              id="edit"
              class="icon-button-auction"
              @click="modify( props.rowData, props.rowData.id, props.rowData.auction_type_value )">
              <i  class="simple-icon-arrow-right"></i>
            </b-button>
        </template>
        </vuetable>
      </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-colxx>
    </b-row>
    </template>
    <!-- <template v-else>
        <div class="loading"></div>
    </template> -->

              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.location')">
                <b-row>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="area">{{
                        $t("forms.area")
                      }}</label>
                      <b-form-select
                        id="area"
                        :state="!$v.formStep4.area_id.$error"
                        v-model="$v.formStep4.area_id.$model"
                        :options="areaOptions"
                        @change="get_cities()"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep4.area_id.required"
                        >{{ $t("forms.area-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="city">{{
                        $t("forms.city")
                      }}</label>
                      <b-form-select
                        id="city"
                        :state="!$v.formStep4.city_id.$error"
                        v-model="$v.formStep4.city_id.$model"
                        :options="cityOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.formStep4.city_id.required"
                        >{{ $t("forms.city-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="12">
                    <b-form-group>
                      <googleMaps
                        id="maps"
                        :location="location"
                        @select_location="set_location"
                      />
                      <b-form-input
                        style="display: none;"
                        :state="!$v.formStep4.latitude.$error"
                        v-model="$v.formStep4.latitude.$model"
                      />

                      <b-form-invalid-feedback
                        v-if="!$v.formStep4.latitude.required"
                        >{{ $t("forms.location_req") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                <b-button
                    :disabled="disabledFormStep4"
                    type="submit"
                    @click="onForm4Submited()"
                    :variant="disabledFormStep4 ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                </b-row>
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.additional')">
                <template v-if="_isLoadCustomField || _isLoadAuctions">
                  <div
                    style="display: flex;"
                    v-for="(field, index) in custom_fields"
                    :key="index"
                  >
                    <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                      <b-form-group
                        :label="
                          language === 'ar'
                            ? field.locales.ar.name
                            : field.locales.en.name
                        "
                      >
                        <b-form-input
                          v-if="language === 'en'"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.values[0].locales.en.value"
                        />
                        <b-form-input
                          v-if="language === 'ar'"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.values[0].locales.ar.value"
                        />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="field.type === 'INT'" sm="6">
                      <b-form-group
                        class="form-group-label"
                        :label="$t('forms.unit')"
                      >
                        <b-form-input
                          type="text"
                          v-model="field.values[0].locales.en.unit"
                        />
                      </b-form-group>
                    </b-colxx>
                  </div>
                  <b-form>
                  <b-row class="add_container">
                  <b-colxx sm="10">
                    <b-form-group  :label="$t(`forms.select-new-custom`)" class="form-group-label">
                      <b-form-select
                        v-model="selectedCustomField"
                        :options="categoryCustomFieldOptions"
                        @change="selectCustomField"
                        plain
                      />

                    </b-form-group>


                  </b-colxx>
                   <b-colxx sm="2">
                    <b-form-group style="margin: 8px;"  class="form-group-label">
                       <b-button
                        @click="add_newCustomField()"
                        type="submit"
                        variant="primary"
                        class="mt-4"
                        >+ Add</b-button
                      >
                    </b-form-group>


                  </b-colxx>
                   </b-row>
                   </b-form>
                  <div
                    style="display: flex;"
                    v-for="field in selectedFields"
                    :key="field.id"
                  >
                    <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                      <b-form-group
                        class="form-group-label"
                        :label="field.locales.en.name"
                      >
                        <b-form-input
                          @change="addCustomValue"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.value"
                        />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="field.type === 'INT'" sm="6">
                      <b-form-group
                        class="form-group-label"
                        :label="$t('forms.unit')"
                      >
                        <b-form-input type="text" v-model="field.unit" />
                      </b-form-group>
                    </b-colxx>
                  </div>
                  <!-- <div class="btn-container">
                    <b-button
                      @click="add_newCustomField()"
                      type="submit"
                      variant="primary"
                      class="mt-4"
                      >+ Add</b-button
                    >
                  </div> -->

                  <b-button
                    :disabled="enable_custom_save_btn"
                    type="submit"
                    @click="editCustomValue('edit')"
                    :variant="enable_custom_save_btn ? 'light' : 'primary'"
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                  <add-new-custom-field
                    @create-custom-field="create_custom_field"
                    :showCreateModal="showCreateModal"
                    :modalClass="modallong"
                    :hideCustomModal="hideCustomModal"
                  />
                </template>
                <template v-else>
                  <div class="loading"></div>
                </template>
              </b-card>
              <b-card class="mb-4 auction_card" :title="$t('forms.attach')">
                  <label class="form-group has-float-label">
                    <b-colxx xxs="12" style="padding: 0px;">
                      <b-form-group >
                        <vue-dropzone
                          v-if="show_dropzone"
                          ref="myVueDropzone"
                          id="dropzone"
                          :options="dropzoneOptions"
                          @vdropzone-files-added="fileAdded"
                          @vdropzone-removed-file="fileRemoved"
                        ></vue-dropzone>
                      </b-form-group>
                    </b-colxx>
                    <b-colxx xxs="12">
                      <b-form-group >
                      
                        <GalleryDetail @showDeleteModel="showDeleteModel" :containerClass1="containerClass1" :containerClass2="containerClass2" :containerClass3="containerClass3" :items="file_lists" />
                     
                     
                      </b-form-group>
                    </b-colxx>
                    
                  </label>
                  <!-- <b-colxx xxs="12" xl="8" class="col-left">
                    <b-card class="mb-4" no-body>
                      <b-card-body>
                        <glide-component-thumbs
                          :settingsImages="{
                            bound: true,
                            rewind: false,
                            focusAt: 0,
                            startAt: 0,
                            gap: 5,
                            perView: 1,
                            data: file_lists
                          }"
                          :settingsThumbs="{
                            bbound: true,
                            rewind: false,
                            focusAt: 0,
                            startAt: 0,
                            gap: 10,
                            perView: 5,
                            data: file_lists,
                            breakpoints: {
                              576: { perView: 4 },
                              420: { perView: 3 }
                            }
                          }"
                        />
                      </b-card-body>
                    </b-card>
                  </b-colxx> -->

              </b-card>
            </b-colxx>
          </b-row>

          <!-- <b-tabs card no-fade>

            <b-tab
              title-item-class="w-25 text-center"
              :title="$t(`forms.basic_details`)"
              active
              @click="isLoadCustomField = false"
            >
              <b-form >
                <b-row>
                  <b-colxx sm="12">
                    <div
                      v-for="(lang, index) in $v.lang_form.$each.$iter"
                      :key="index"
                    >
                      <b-form-group>
                        <label class="form-group-label" for="Name">{{
                          $t(`forms.${lang._name.$model}_title`)
                        }}</label>
                        <b-form-input
                          id="Name"
                          type="text"
                          v-model="lang.title.$model"
                          :state="!lang.title.$error"
                        />
                        <b-form-invalid-feedback v-if="!lang.title.required">{{
                          $t(`forms.${lang._name.$model}_massege`)
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group>
                        <label class="form-group-label" for="desc">{{
                          $t(`forms.${lang._name.$model}_desc`)
                        }}</label>
                        <b-form-input
                          id="desc"
                          type="text"
                          v-model="lang.description.$model"
                        />
                      </b-form-group>
                    </div>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="desc">{{
                        $t("forms.deposit")
                      }}</label>
                      <b-form-input
                        type="number"
                        :state="!$v.gridForm.deposit.$error"
                        v-model="$v.gridForm.deposit.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.deposit.required"
                        >{{
                          $t("forms.deposit_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="min">{{
                        $t("forms.minimum_price")
                      }}</label>
                      <b-form-input
                        id="min"
                        type="number"
                        :state="!$v.gridForm.minimum_paid.$error"
                        v-model="$v.gridForm.minimum_paid.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.minimum_paid.required"
                        >{{ $t("forms.min_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="open">{{
                        $t("forms.opening_price")
                      }}</label>
                      <b-form-input
                        id="open"
                        type="number"
                        :state="!$v.gridForm.opening_price.$error"
                        v-model="$v.gridForm.opening_price.$model"
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.opening_price.required"
                        >{{ $t("forms.open_price") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="cate">{{
                        $t("forms.category")
                      }}</label>
                      <b-form-select
                        id="cate"
                        @change="getSubCateory"
                        :state="!$v.gridForm.category_id.$error"
                        v-model="$v.gridForm.category_id.$model"
                        :options="categoryIdOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.category_id.required"
                        >{{
                          $t("forms.category_type_select")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="sub">{{
                        $t("forms.sub-category")
                      }}</label>
                      <b-form-select
                        id="sub"
                        :state="!$v.gridForm.sub_category_id.$error"
                        v-model="$v.gridForm.sub_category_id.$model"
                        :options="subCategoryOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.sub_category_id.required"
                        >{{
                          $t("forms.category_type_select")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="3">
                    <b-form-group>
                      <label class="form-group-label" for="side">{{
                        $t("forms.auction_side")
                      }}</label>
                      <b-form-select
                        id="side"
                        :state="!$v.gridForm.auction_side.$error"
                        v-model="$v.gridForm.auction_side.$model"
                        :options="auctionSideOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.auction_side.required"
                        >{{
                          $t("forms.auction_side_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="3">
                    <b-form-group>
                      <label class="form-group-label" for="owner">{{
                        $t("forms.auction_owner")
                      }}</label>
                      <b-form-select
                        id="owner"
                        :state="!$v.gridForm.auction_owner.$error"
                        v-model="$v.gridForm.auction_owner.$model"
                        :options="auctionOwnerOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.auction_owner.required"
                        >{{
                          $t("forms.auction_owner_message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="area">{{
                        $t("forms.area")
                      }}</label>
                      <b-form-select
                        id="area"
                        :state="!$v.gridForm.area_id.$error"
                        v-model="$v.gridForm.area_id.$model"
                        :options="areaOptions"
                        @change="get_cities()"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.area_id.required"
                        >{{ $t("forms.area-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="start">{{
                        $t("forms.start_date")
                      }}</label>
                      <datepicker
                        id="start"
                        style="width: 100%;"
                        type="datetime"
                        value-type="YYYY-MM-DD HH:mm:ss"
                        v-model="$v.gridForm.start_date.$model"
                        @change="selectedDate('start')"
                      >
                      </datepicker>

                      <div
                        :class="{
                          'invalid-feedback': true,
                          'd-block':
                            $v.gridForm.start_date.$error &&
                            !$v.gridForm.start_date.required
                        }"
                      >
                        {{ $t("forms.start_date_req") }}
                      </div>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="city">{{
                        $t("forms.city")
                      }}</label>
                      <b-form-select
                        id="city"
                        :state="!$v.gridForm.city_id.$error"
                        v-model="$v.gridForm.city_id.$model"
                        :options="cityOptions"
                        plain
                      />
                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.city_id.required"
                        >{{ $t("forms.city-message") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="end">{{
                        $t("forms.end_date")
                      }}</label>
                      <datepicker
                        id="id"
                        style="width: 100%;"
                        type="datetime"
                        value-type="YYYY-MM-DD HH:mm:ss"
                        v-model="$v.gridForm.end_date.$model"
                        @change="selectedDate('end')"
                      >
                      </datepicker>
                      <div
                        :class="{
                          'invalid-feedback': true,
                          'd-block':
                            $v.gridForm.end_date.$error &&
                            !$v.gridForm.end_date.required
                        }"
                      >
                        {{ $t("forms.end_date_req") }}
                      </div>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="maps">{{
                        $t("forms.location")
                      }}</label>
                      <googleMaps
                        id="maps"
                        :location="location"
                        @select_location="set_location"
                      />
                      <b-form-input
                        style="display: none;"
                        :state="!$v.gridForm.latitude.$error"
                        v-model="$v.gridForm.latitude.$model"
                      />

                      <b-form-invalid-feedback
                        v-if="!$v.gridForm.latitude.required"
                        >{{ $t("forms.location_req") }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="img">{{
                        $t("forms.image")
                      }}</label>
                      <b-form-input
                        style="display: none;"
                        :state="!$v.files_form.image.$error"
                        v-model="$v.files_form.image.$model"
                      />
                      <b-input-group id="img" class="mb-3">
                        <b-form-file
                          accept="image/*"
                          :placeholder="image_basename"
                          v-model="image"
                        ></b-form-file>

                        <b-input-group-append>
                          <b-button
                            :disabled="!$v.files_form.image.$model"
                            @click="open($v.files_form.image.$model)"
                            variant="light default"
                            >{{ $t("input-groups.show") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                      <div class="image-review-show">
                        <img
                          v-if="$v.files_form.image.$model"
                          style="
                                  max-width: 100%;
                                  max-height: 100%;
                              "
                          :src="image ? imgUrl : $v.files_form.image.$model"
                          alt="Auction image"
                        />
                        <span
                          v-if="$v.files_form.image.$model"
                          :class="
                            language === 'ar'
                              ? 'delete-span-ar'
                              : 'delete-span-en'
                          "
                        >
                          <i @click="delete_img" class="simple-icon-trash"></i>
                        </span>
                      </div>
                      <b-form-invalid-feedback
                        v-if="!$v.files_form.image.required"
                        >{{
                          $t("forms.choose-image-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="bro">{{
                        $t("forms.brochure")
                      }}</label>
                      <b-form-input
                        style="display: none;"
                        :state="!$v.files_form.brochure.$error"
                        v-model="$v.files_form.brochure.$model"
                      />
                      <b-input-group id="bro" class="mb-3">
                        <b-form-file
                          accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                          :placeholder="$t('input-groups.change-brochure')"
                          v-model="brochure"
                        ></b-form-file>
                        <b-input-group-append>
                          <b-button
                            @click="open($v.files_form.brochure.$model)"
                            variant="light default"
                            :disabled="files_form.brochure == null"
                            >{{ $t("OPEN") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>

                      <b-form-invalid-feedback
                        v-if="!$v.files_form.brochure.required"
                        >{{
                          $t("forms.choose-brochure-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                    <b-form-group>
                      <label class="form-group-label" for="cond">{{
                        $t("forms.terms_conditions")
                      }}</label>
                      <input
                        style="display: none;"
                        :state="!$v.files_form.terms_conditions.$error"
                        v-model="$v.files_form.terms_conditions.$model"
                      />
                      <b-input-group id="cond" class="mb-3">
                        <b-form-file
                          accept="application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf"
                          :placeholder="
                            $t('input-groups.change-terms_conditions')
                          "
                          v-model="terms_conditions"
                        ></b-form-file>
                        <b-input-group-append>
                          <b-button
                            @click="open($v.files_form.terms_conditions.$model)"
                            variant="light default"
                            :disabled="files_form.terms_conditions == null"
                            >{{ $t("OPEN") }}</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                      <b-form-invalid-feedback
                        v-if="!$v.files_form.terms_conditions.required"
                        >{{
                          $t("forms.choose-terms_conditions-message")
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </b-colxx>
                </b-row>
                <b-button
                  :disabled="!disabled || auction.auction_type_value != 2"
                  type="submit"
                  :variant="
                    auction.auction_type_value != 2 ? 'light' : 'primary'
                  "
                  class="mt-4"
                  >{{ $t("forms.save") }}</b-button
                >
              </b-form>
            </b-tab>
            <b-tab
              title-item-class="w-25 text-center"
              :title="$t('forms.custom_field')"
              @click="open_custom_tab"
            >
              <div class="wizard-basic-step">
                <template v-if="_isLoadCustomField || _isLoadAuctions">
                  <div
                    style="display: flex;"
                    v-for="(field, index) in custom_fields"
                    :key="index"
                  >
                    <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
                      <b-form-group
                        :label="
                          language === 'ar'
                            ? field.locales.ar.name
                            : field.locales.en.name
                        "
                      >
                        <b-form-input
                          v-if="language === 'en'"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.values[0].locales.en.value"
                        />
                        <b-form-input
                          v-if="language === 'ar'"
                          :type="field.type === 'INT' ? 'number' : 'text'"
                          v-model="field.values[0].locales.ar.value"
                        />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx v-if="field.type === 'INT'" sm="6">
                      <b-form-group
                        class="form-group-label"
                        :label="$t('forms.unit')"
                      >
                        <b-form-input
                          type="text"
                          v-model="field.values[0].locales.en.unit"
                        />
                      </b-form-group>
                    </b-colxx>
                  </div>
                  <b-button
                    :disabled="!disabled || auction.auction_type_value != 2"
                    type="submit"
                    @click="editCustomValue('edit')"
                    :variant="
                      auction.auction_type_value != 2 ? 'light' : 'primary'
                    "
                    class="mt-4"
                    >{{ $t("forms.save") }}</b-button
                  >
                </template>
                <template v-else>
                  <div class="loading"></div>
                </template>
              </div>
            </b-tab>
            <b-tab
              title-item-class="w-25 text-center"
              :title="$t('forms.preview-requests')"
              @click="get_review_request"
            >
              <div class="wizard-basic-step">
                <template v-if="_isLoadAuctions">
                  <vuetable
                    ref="vuetable"
                    class="table-divided order-with-arrow"
                    :api-mode="false"
                    :reactive-api-url="true"
                    :fields="fields"
                    pagination-path
                  >
                    <template slot="actions" slot-scope="props">
                      <b-button
                        variant="outline-theme-3"
                        id="edit"
                        :disabled="auction.auction_type_value != 2"
                        class="icon-button"
                        @click="
                          open_modal(
                            'requestReview',
                            props.rowData.id,
                            props.rowData.notes
                          )
                        "
                      >
                        <i class="simple-icon-pencil"></i>
                        <b-tooltip
                          target="edit"
                          placement="top"
                          :title="$t('forms.edit')"
                        >
                        </b-tooltip>
                      </b-button>
                    </template>
                  </vuetable>
                </template>
                <template v-else>
                  <div class="loading"></div>
                </template>
              </div>
            </b-tab>
            <b-tab
              @click="
                getAuctionImages({ id: auctionId }), (isLoadCustomField = false)
              "
              title-item-class="w-25 text-center"
              :title="$t('forms.attach')"
            >
              <b-card class="mb-4" no-body>
                <b-tabs card no-fade>
                  <b-tab :title="$t('forms.images')" active>
                    <template v-if="isLoadAuctionImages">
                      <div style="display: grid;">
                        <b-button
                          v-b-modal.modalright
                          variant="primary"
                          style="margin: auto;margin-bottom: 17px;"
                          size="lg"
                          >{{ $t("survey.add-new") }}</b-button
                        >
                        <b-colxx lg="12" xl="12" class="mb-4">
                          <recent-orders
                            @deleteImage="deleteImage"
                            :_ImageList="_Image_List"
                          />
                        </b-colxx>
                      </div>
                      <add-new-modal
                        :enable="enable"
                        :_sccussCreateImage="_createAuctionImage"
                        @AddNewImage="createImage"
                      ></add-new-modal>
                    </template>
                    <template v-else>
                      <div class="loading"></div>
                    </template>
                  </b-tab>
                  <b-tab
                    @click="getAuctionFiles({ id: auctionId })"
                    :title="$t('forms.files')"
                  >
                    <file
                      :list="auctionFileList"
                      :isLoad="_isLoadAuctions"
                      @delete-file="delete_File"
                      @create-file="create_File"
                    />
                  </b-tab>
                </b-tabs>
              </b-card>
            </b-tab>
          </b-tabs> -->
        </b-card>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-colxx>
    <b-modal
      ref="modallg"
      id="modallg"
      size="lg"
      :title="$t('forms.customCategoryTitle')"
      :hide-backdrop="true"
      :no-close-on-backdrop="true"
    >
      <div>
        <template v-if="_isLoadCustomField">
          <div class="addCustomBtn">
            <b-button
              variant="primary"
              @click="showCreateModal = !showCreateModal"
              >{{ $t("forms.add-custom-category") }}</b-button
            >
          </div>
          <div
            style="display: flex;"
            v-for="(field, index) in customFields"
            :key="index"
          >
            <b-colxx :sm="field.type === 'STRING' ? 12 : 6">
              <b-form-group
                class="form-group-label"
                :label="field.locales.en.name"
              >
                <b-form-input
                  @change="addCustomValue"
                  :type="field.type === 'INT' ? 'number' : 'text'"
                  v-model="field.value"
                />
              </b-form-group>
            </b-colxx>
            <b-colxx v-if="field.type === 'INT'" sm="6">
              <b-form-group class="form-group-label" :label="$t('forms.unit')">
                <b-form-input type="text" v-model="field.unit" />
              </b-form-group>
            </b-colxx>
          </div>
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
        <add-new-custom-field
          @create-custom-field="create_custom_field"
          :showCreateModal="showCreateModal"
          :modalClass="modallong"
          :hideCustomModal="hideCustomModal"
        />
      </div>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          :disabled="enableModelBtn"
          @click="addNewCustomValue()"
          class="mr-1"
          >{{ $t("forms.save") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('modallg')">{{
          $t("survey.cancel")
        }}</b-button>
      </template>
    </b-modal>
    <b-modal
      id="requestReview"
      ref="requestReview"
      hide-footer
      size="lg"
      :title="$t('forms.requestReview')"
    >
      <b-card class="mb-4" no-body>
        <b-card-body>
          <div class="mb-5">
            <h5 class="card-title">{{ $t("forms.request_notes") }}</h5>
            <b-form-textarea
              id="textarea"
              v-model="request_notes"
              readonly
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </div>
        </b-card-body>
        <div style="margin: 14px; display: flex; justify-content: right;">
          <b-button
            :disabled="requestBtn"
            variant="success"
            @click="verfiy_request('ACCEPTED')"
            class="mr-1"
            >{{ $t("forms.accept") }}</b-button
          >
          <b-button
            variant="danger"
            :disabled="requestBtn"
            @click="verfiy_request('REJECTED')"
            >{{ $t("forms.reject") }}</b-button
          >
        </div>
      </b-card>
    </b-modal>
    <b-modal
      id="main_image"
      ref="main_image"
      :title="$t('todo.main_image')"
      :no-close-on-backdrop="true"
    >
      <b-form-group :label="$t('forms.image')">
        <vue-dropzone
          ref="myVueDropzone"
          id="dropzone"
          :options="imageDropzoneOptions"
          @vdropzone-files-added="imageAdded"
          @vdropzone-removed-file="imageRemoved"
        ></vue-dropzone>
      </b-form-group>
      <template slot="modal-footer">
        <b-button
          variant="primary"
          @click="updateImage()"
          class="mr-1"
          :disabled="image_added || model_button"
          >{{ $t("forms.submit") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('main_image')">{{
          $t("survey.cancel")
        }}</b-button>
      </template>
    </b-modal>
    <b-modal
      id="attachDetails"
      ref="attachDetails"
      :title="$t('todo.attachment-details')"
      :hide-backdrop="true"
      :no-close-on-backdrop="true"
    >
      <b-form
        @submit.prevent="onValitadeFormSubmit()"
        class="av-tooltip tooltip-label-right"
      >
        <div v-for="(lang, index) in $v.attach_form.$each.$iter" :key="index">
          <b-form-group
            :label="$t(`pages.${lang._name.$model}_title`)"
            class="has-float-label mb-4"
          >
            <b-form-input
              type="text"
              v-model="lang.title.$model"
              :state="!lang.title.$error"
            />
            <b-form-invalid-feedback v-if="!lang.title.required">{{
              $t("forms.title_filed")
            }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t(`pages.${lang._name.$model}_desc`)"
            class="has-float-label mb-4"
          >
            <b-form-textarea
              id="textarea"
              rows="3"
              max-rows="6"
              v-model="lang.description.$model"
              :state="!lang.description.$error"
            ></b-form-textarea>
            <b-form-invalid-feedback v-if="!lang.description.required">
              {{ $t("forms.desc_filed") }}</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
      </b-form>
      <template slot="modal-footer">
        <b-button
          variant="outline-secondary"
          @click="hideModal('attachDetails')"
          >{{ $t("survey.cancel") }}</b-button
        >
        <b-button
          :variant="enable_attach_btn ? 'light' : 'primary'"
          :disabled="enable_attach_btn"
          @click="createAttachment()"
          class="mr-1"
          >{{ $t("survey.submit") }}</b-button
        >
      </template>
    </b-modal>
    <b-modal
      id="deleteAttach"
      ref="deleteAttach"
      :title="$t('modal.modal-delete-auction-attach')"
      >{{ $t("forms.deleteAttachQuestion") }}
      <template slot="modal-footer">
        <b-button
          :disabled="enableModalBtn"
          variant="primary"
          @click="delete_attach()"
          class="mr-1"
        >
          {{ $t("button.yes") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('deleteAttach')">{{
          $t("button.no")
        }}</b-button>
      </template>
    </b-modal>
    <b-modal
      id="deleteAuction"
      ref="deleteAuction"
      :title="$t('modal.modal-active-auction-title')"
      >{{ $t("forms.deleteAuctionQuestion") }}
      <template slot="modal-footer">
        <b-button
          :disabled="enableModalBtn"
          variant="primary"
          @click="delete_auction()"
          class="mr-1"
        >
          {{ $t("button.yes") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('deleteAuction')">{{
          $t("button.no")
        }}</b-button>
      </template>
    </b-modal>
  </b-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import router from "../../../router";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import VueDropzone from "vue2-dropzone";
const { required, requiredIf } = require("vuelidate/lib/validators");
import Vuetable from "vuetable-2/src/components/Vuetable";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { adminRoot } from "../../../constants/config";
import GalleryDetail from "../../../containers/pages/GalleryDetail";
import file from "../../../components/shared/file.vue";
import AddNewModal from "../../../containers/appliaction/AddNewModal.vue";
import RecentOrders from "../../../containers/appliaction/RecentOrders.vue";
import googleMaps from "../../../components/shared/googleMaps.vue";
import addCustomField from "../../../components/shared/addCustomField.vue";
import { getCurrentLanguage } from "../../../utils";
import FormWizard from "../../../components/Form/Wizard/FormWizard";
import Tab from "../../../components/Form/Wizard/Tab";
import GlideComponentThumbs from '../../../components/Carousel/GlideComponentThumbs.vue'
import {
    detailImages,
    detailThumbs
} from "../../../data/carouselItems";

export default {
  components: {
    googleMaps : googleMaps,
        vuetable: Vuetable,
    "vue-dropzone": VueDropzone,
     "form-wizard": FormWizard,
     GalleryDetail: GalleryDetail,
       'glide-component-thumbs': GlideComponentThumbs,
        "tab": Tab,
        "add-new-custom-field": addCustomField,
    "datatable-heading": DatatableHeading,
    file: file,
    "add-new-modal": AddNewModal,
    datepicker: DatePicker,
    "recent-orders": RecentOrders
  },
  data() {
    return {
      auctionId: null,
      modallong:"modallong",
      _categoryId: null,
      password: null,
      is_group_auction: false,
      containerClass1: "attach_g_container",
      containerClass2: "gallery_attach_container",
      containerClass3: "social-image-row gallery exrta_gallery",
      detailImages,
      detailThumbs,
      isProcessing: true,
      isEdit: false,
      image: null,
      isAbleToMove: false,
      saveBtn: `next`,
      showCreateModal: false,
      date1: null,
      enableModalBtn: false,
      date2: null,
      disabledBefore: new Date(2022, 10, 2),
      disabledAfter: new Date(2022, 10, 6),
      disabledFormStep3: false,
      testArray: [],
      files: null,
      attach_form: [],
      enablevalidateForm1: false,
      show_dropzone: true,
      file: null,
      disabledFormStep4: false,
      showField: false,
      imgUrl: null,
      image_added: true,
      hideCustomModal: false,
      selected_sub_category: null,
      terms_conditions: null,
      auction_id: null,
      request_notes: null,
      mainImage: null,
      sub_cate: null,
      disabledFormStep1: false,
      disabledFormStep2: false,
      brochure: null,
      sub_categoryIdOptions: [],
      isLoadAuctionImages: false,
      model_button: false,
      disabled: true,
      imageDropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 1,
        acceptedFiles:
         "image/jpeg,image/png,image/gif",
        uploadMultiple: false,
        addRemoveLinks: true,
        removedfile: function(file) {
          var _ref;
          return (_ref = file.previewElement) != null
            ? _ref.parentNode.removeChild(file.previewElement)
            : void 0;
        },
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {}
      },
      attachDropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 10,
     
        uploadMultiple: false,
        addRemoveLinks: false,
        removedfile: function(file) {
          var _ref;
          return (_ref = file.previewElement) != null
            ? _ref.parentNode.removeChild(file.previewElement)
            : void 0;
        },
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {}
      },
       dropzoneOptions: {
        url: "https://lilacmarketingevents.com",
        thumbnailHeight: 160,
        thumbnailWidth: 150,
        parallelUploads: 3,
        maxFiles: 10,
        acceptedFiles:
          "application/pdf,.doc,.txt,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf ,image/jpeg,image/png,image/gif",
        uploadMultiple: false,
        addRemoveLinks: true,
        removedfile: function(file) {
          var _ref;
          return (_ref = file.previewElement) != null
            ? _ref.parentNode.removeChild(file.previewElement)
            : void 0;
        },
        autoProcessQueue: false,
        previewTemplate: this.dropzoneTemplate(),
        headers: {}
      },
      disableNextBtn: false,
      custom_fields: null,
      attachmentFile: null,
      enableModelBtn: false,
      endDateSelected: false,
      startDateSelected: false,
      isLoadAuction: false,
      categoryCustomFieldOptions: [],
      language: null,
      products_fields: [
         {
          name: "id",
          title: "NO.",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },

        {
          name: "locales",
          callback: value => {
            return value[this.language].title;
          },
          title: "Title",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "13%"
        },

     //    {
  //         name: "",
  //         callback: value => {

  //           return  `<span>
  //               ${new Date(value.start_date).toString().slice(new Date(value.start_date).toString().indexOf(' '),
  // new Date(value.start_date).toString().lastIndexOf(':'),)}
  //             </span>
  //             <br/>
  //             <span>
  //              ${new Date(value.end_date).toString().slice(new Date(value.end_date).toString().indexOf(' '),
  // new Date(value.end_date).toString().lastIndexOf(':'),)}

  //             </span>
  //             `;
  //         },

  //         title: "Duration",
  //         titleClass: "",
  //         dataClass: "list-item-heading duration",
  //         width: "15%"
  //       },
        {
          name: "minimum_paid",
          title: "Minimum Pid",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
          {
          name: "bids_count",
          title: "Bidds",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
           {
          name: "auction_type",
           callback: value => {

            return `<span class="badge badge-pill badge-${value.split(' ')[0]} handle mr-1">
                ${value}
              </span>`;

          },
          title: "Status",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "",
           callback: value => {
            return `<b-button class="${value.active === 1 ? `toggle_btn_on_${this.language}`: `toggle_btn_off_${this.language}`}" variant="primary">
              <span class="${value.active === 1 ? `toggle_span_on_${this.language}`: `toggle_span_off_${this.language}`}"></span>
        </b-button>`;

          },
          title: "Activate",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "10%"
        }
      ],
      enable: false,
      langs: null,
      customFields: [],
      coords: [],
      isLoadCustomField: false,
      location: [],
      country_id: 1,
      selectedFields: [],
      enable_custom_save_btn: false,
      categoryIdOptions: [],
      file_lists: [],
      auctionSideOptions: [],
      creationAttachments: [],
      auctionOwnerOptions: [],
      enable_attach_btn : false,
      selectedCustomField: null,
      subCategoryOptions: [],
      areaOptions: [],
      auctionFileList: null,
      attach_type:null,
      attach_id:null,
      requestBtn: false,
      image_basename: null,
      disabledAttachLangsBtn: false,
      cityOptions: [],
      files_form: {
        image: null,
        terms_conditions: null,
        brochure: null
      },
      is_area_selected: false,
      create_categoryId: null,
      lang_form: [],
                 formStep1: {
 auction_number: null,
  category_id: null,
  auction_side: null,
          auction_owner: null,

        sub_category_id: null,
          start_date: null,
        end_date: null,
             },
             formStep3: {
deposit: null,

        minimum_paid: null,

        opening_price: null,
             },
             formStep4: {
               city_id: null,
        area_id: null,
          latitude: null,
        longitude: null
             },
             locationForm: {
city_id: null,
      area_id: null,
       latitude: null,
        longitude: null
             },
      gridForm: {
  //       auction_side: null,
  //       auction_number: null,
  // category_id: null,
  //       sub_category_id: null,
  //         start_date: null,
  //       end_date: null,
  //       auction_owner: null,
  //
        deposit: null,

        minimum_paid: null,

        opening_price: null,

      },
        gridForm1: {
        auction_side: null,
        auction_number: null,
        category_id: null,
        sub_category_id: null,
        start_date: null,
        end_date: null,
        auction_owner: null,
      },
            fields: [
        {
          name: "name",
          title: "Name",
          sortField: "name",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "phone",
          title: "Phone number",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "date",
          title: "Date",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "status",
           callback: value => {
            return `<span class="badge badge-pill badge-${value.toLowerCase()} handle mr-1">
                ${value}
              </span>`;
          },
          title: "Status",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
        }
      ]
    };
  },
  mixins: [validationMixin],
  validations: {
    lang_form: {
      $each: {
        id: {

        },
        title: {
          required
        },
        description: {},
        _name: {},
        terms_conditions: {},
        brochure: {}
      }
    },
    attach_form: {
      $each: {
        title: {
          required
        },
        description: {},
        _name: {},

      }
    },
     formStep1: {
            auction_number: {
        required
      },
         auction_owner: {
        required
      },
        auction_side: {
        required
      },
      category_id: {
        required
      },
      sub_category_id: {

      },
           end_date: {
        required
      },
           start_date: {
        required
      },
        },

        formStep3: {
             deposit: {
        required
      },

    opening_price: {
        required
      },
           minimum_paid: {
        required
      },
        },
          formStep4: {
area_id: {},
      city_id: {
        required: requiredIf(function() {
          return this.city_req;
        })
      },
        latitude: {
        required
      },
      },
      locationForm:{
    area_id: {},
      city_id: {
        required: requiredIf(function() {
          return this.city_req;
        })
      },
            latitude: {
        required
      },
      },

    gridForm: {
      deposit: {
        required
      },
      minimum_paid: {
        required
      },
      opening_price: {
        required
      },

    },
    gridForm1: {
      auction_number: {
        required
      },
        auction_side: {
        required
      },
      category_id: {
        required
      },
      sub_category_id: {},
      end_date: {
        required
      },
      start_date: {
        required
      },
      auction_owner: {
        required
      },
    },
    files_form: {
      image: {
        required
      },
      terms_conditions: {},
      brochure: {}
    }
  },
  created() {
    this.language = getCurrentLanguage();
    this.auctionId = this.$route.query.id;
    if (this.auctionId) {
      this.getAuction({ id: this.auctionId });
      this.getAuctionProducts({parent_id: this.parantId})
      this.isEdit = true;
    } else {
      this.isLoadAuction = true;
      this.isEdit = false;
      this.location= null;

    }
    this.getCategories({
      dir: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
    this.getAreas({ country_id: this.country_id });
    this.langs = localStorage.getItem("Languages");
    this.make_collaction(this.langs, this.lang_form);
    this.make_collaction1(this.langs, this.attach_form);
    this.getAuctionSide();
    this.getAuctionOwner({
      order_dir: null,
      keyword: null,
      limit: null,
      page: null
    })
  },
  methods: {
    ...mapActions([
      "getAuction",
      "updateAuction",
      "getSubCategory",
      "getAuctionProducts",
      "deleteTermsBrochure",
      "getCategories",
      "createCustomValue",
      "updateReviewRequest",
      "getCustomFieldList",
      "createAuctionImage",
      "deleteAuctionFile",
      "deleteAuction",
      "getCategory",
      "createAuctionFile",
      "getAuctionFiles",
      "updateCustomValue",
      "getAuctionImages",
      "createAuctionGroup",
      "getAuctionOwner",
      "getSubCategories",
      "updateAuctionMainImage",
      "createCustomValue",
      "createAuction",
      "createCustomField",
      "getCities",
      "getAreas",
      "getReviewRequests",
      "deleteAuctionImage",
      "getAuctionSide"
    ]),
    make_collaction(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          id: "",
          title: "",
          description: "",
          _name: el.name,
          terms_conditions : "",
          brochure : "",
        });
      });
    },
    disableDate(date) {
    return date < new Date();
},

    make_collaction1(langs, form) {
      JSON.parse(langs).forEach(el => {
        form.push({
          title: "",
          description: "",
          _name: el.name
        });
      });
    },
    
    onForm1Submited(){
       this.$v.$touch();
      this.$v.formStep1.$touch();

      if (
        !this.$v.formStep1.$invalid
      ) {
        this.disabledFormStep1 = true;
          this.updateAuction({
            info: this.formStep1,
            terms_conditions: null,
            brochure: null,
            id: this.auctionId,
            image: null,
            langs: null,
          });

      }
    },
    delete_auction() {
      this.enableModalBtn= true;
      this.deleteAuction({ Id: this.auctionId });
    },
     onForm2Submited(){
       this.$v.$touch();
      this.$v.lang_form.$touch();
      if (
        !this.$v.lang_form.$invalid
      ) {
        this.disabledFormStep2 = true;
          this.updateAuction({
            langs: this.lang_form,
              info: null,
            terms_conditions: null,
            brochure: null,
            id: this.auctionId,
            image: null,
          });

      }
    },
    showDeleteModel(id, type){
      this.$refs['deleteAttach'].show();
      this.attach_type = type;
      this.attach_id = id;
    },
    delete_attach(){
      this.enableModalBtn = true;
      if(this.attach_type === 'File'){
        this.delete_File( this.attach_id )
      }else{
        this.deleteImage( this.attach_id )
      }
    },
    onForm3Submited(){
        this.$v.$touch();
      this.$v.formStep3.$touch();

      if (
        !this.$v.formStep3.$invalid
      ) {
        this.disabledFormStep3 = true;
          this.updateAuction({
            info: this.formStep3,
               terms_conditions: null,
            brochure: null,
            id: this.auctionId,
            image: null,
            langs: null,
          });
    }
    },
    attachAdded(file){
      this.attachmentFile = file;
      this.$refs['attachDetails'].show();
      this.saveBtn = this.$t(`forms.save`);
    },
    attachRemoved(){

    },
    createAttachmentsQueue(auction_id){
      this.creationAttachments.forEach(el => {
       if(el.file[0].type.split('/')[0] === 'image'){
        this.createAuctionImage({ info: el.info, path: el.file[0], id: auction_id });
       }else{
        this.createAuctionFile({ info: el.info, path: el.file[0], id: auction_id });
       }
      })
    },
   
     onForm4Submited(){
      this.$v.$touch();
      this.$v.formStep4.$touch()
      if (
        !this.$v.formStep4.$invalid
        ) {
        this.disabledFormStep4 = true;
          this.updateAuction({ info: this.formStep4, id: this.auctionId });
          }
    },
    onGridFormSubmit() {

        this.disabled = false;
        if (this.auctionId) {
          this.updateAuction({
            info: this.gridForm,
            image: this.image,
            terms_conditions: this.terms_conditions,
            brochure: this.brochure,
            langs: this.lang_form,
            id: this.auctionId
          });
        } else if (this.is_group_auction)  {
          this.createAuctionGroup({
            info: this.gridForm1,
            location: this.locationForm,
            // biding: this.gridForm,
            image: this.image,
            langs: this.lang_form
          });
        }else {
          this.createAuction({
            info: this.gridForm1,
            location: this.locationForm,
            biding: this.gridForm,
            image: this.image,
            langs: this.lang_form
          });
        }

    },
    get_review_request(){
      this.isLoadCustomField = false;
      this.getReviewRequests({auction_id : this.auctionId})
    },
    open_custom_tab(){
      if(this.auction.auction_type_value === 2){
this.isLoadCustomField = true
      }
    },
    create_File(info, path) {
      this.createAuctionFile({ info: info, path: path, id: this.auctionId });
    },
    getSubCateory(){
      this.subCategoryOptions = [];
      this.getSubCategories({id : this.gridForm.category_id})
    },
    delete_File(id) {
      this.deleteAuctionFile({ id: this.auctionId, fileId: id });
    },
    set_location(data) {
      this.locationForm.latitude = data.lat;
      this.locationForm.longitude = data.lng;
       this.formStep4.latitude = data.lat;
      this.formStep4.longitude = data.lng;

    },
    add_New(){
      this.$router.push({
        path: `${adminRoot}/auctions/auction-product`,
        query: { p_id: this.auctionId}
      });
    },
    modify(item, id, type){
      this.$router.push({
        path: `${adminRoot}/auctions/auction-product`,
        query: { id: id}
      });
    },
    get_cities() {
      this.is_area_selected = true;
      this.gridForm.city_id = null;
      this.formStep4.city_id = null;
      this.getCities({ area_id: this.formStep4.area_id  ? this.formStep4.area_id : this.gridForm.area_id });
    },
    selectedDate(data) {
      switch (data) {
        case "start":
          this.startDateSelected = true;
          break;
        case "end":
          this.endDateSelected = true;
          break;
        default:
          break;
      }
    },
    createImage(value) {
      this.enable = true;

    },
    review(){

    },
    imageAdded(file){
      this.mainImage = file;
      this.image_added = false;
    },

    imageRemoved(){
      this.mainImage = null;
      this.image_added = true;
    },
    selectCustomField(){
      this.saveBtn = 'save';
      this.showField = true;
      this.selectedFields.push(this.selectedCustomField)
      this.categoryCustomFieldOptions = this.getDifference2(this.categoryCustomFieldOptions,this.selectedFields);
    },
    delete_img(){
        this.image = null;
        this.files_form.image = null;
    },
      hideModal(refname) {
      this.$refs[refname].hide();

    },
    openMap(){
      this.coords = [30.434447148758963, 37.061051995669274];

    },
    deleteImage(id) {
      this.isLoadAuctionImages = false;
      this.deleteAuctionImage({ id: this.auctionId, imgId: id });
    },
    fileAdded(file) {

      this.$refs['attachDetails'].show();
      this.file = file;
    },
    addCustomValue(){
      this.saveBtn = 'save';
    },
    open(item) {
      window.open(item);
    },
    image_selected() {
      this.files_form.image = "image";

    },
    addCustomVal(){

    },
    updateImage(){
      this.model_button = true;
      this.updateAuctionMainImage({id: this.auctionId, img: this.mainImage ? this.mainImage[0] : null})
    },
    createAttachment(){
        if(this.is_group_auction){
          this.$v.$touch();
      this.$v.attach_form.$touch();

      if (!this.$v.attach_form.$invalid) {
        this.enable_attach_btn = true;
       this.creationAttachments.push(
        new Object({
          file: this.attachmentFile,
          info: this.$v.attach_form.$model,
        
        })
       )
       this.attachmentFile = null;
             this.$refs['attachDetails'].hide();
             this.attach_form.forEach(el => {
         el.title = null;
         el.description = null;
      });
             this.$v.$reset();
             this.enable_attach_btn = false;

      }

        }else{
          this.$v.$touch();
      this.$v.attach_form.$touch();

      if (!this.$v.attach_form.$invalid) {
        this.enable_attach_btn = true;
      if(this.file[0].type.split('/')[0] === 'image'){
        this.createAuctionImage({
        info: this.$v.attach_form.$model,
        path: this.file ? this.file[0] : null,
        id: this.auctionId
        });
      }else{
          this.createAuctionFile({ info: this.$v.attach_form.$model, path: this.file ? this.file[0] : null, id: this.auctionId });
      }
      }

        }
        
    },
    get_SubCat(val){
      this.getSubCategory({id : val})

    },
    add_newCustomField(){
  this.showCreateModal = !this.showCreateModal;
    },
    fileRemoved(file) {
      if(this.file[0].type.split('/')[0] === 'image'){
             this.deleteAuctionImage({ id: this.auctionId, imgId: this.file[1]});


          }else{
                    this.deleteAuctionFile({ id: this.auctionId, fileId: this.file[1] });

          }
      this.file = null;
    },
    shootMessage: async function() {
      this.$refs.myVueDropzone.processQueue();
    },
    sendMessage: async function(files, xhr, formData) {},

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
    },

        verfiy_request(val){
          this.requestBtn = true;
            this.updateReviewRequest({val: val, request_id: this.request_id})
        },
        date_check(){
           this.date1 = new Date(this.gridForm1.start_date);
        this.date2 = new Date(this.gridForm1.end_date);

        if(this.date2.getTime() < this.date1.getTime()){
          this.gridForm1.start_date = null;
          this.gridForm1.end_date = null;

                    this.$notify(
        "error",
        "Something went wrong",
        "the end date must be a date after start date.",
        { duration: 4000, permanent: false }
      );


        }else{
          this.enablevalidateForm1 = true;
        }
        },
        create_custom_field(val,type){
          this.createCustomField({info: val, type: type, categoryId: this.formStep1.category_id ?  this.formStep1.category_id : this.gridForm.category_id})
        },

         validateStep1() {
this.date_check();
             this.$v.$touch();
      this.$v.gridForm1.$touch();
            this.$v.files_form.$touch();

        if (
        !this.$v.gridForm1.$invalid &&
                !this.$v.files_form.$invalid
          && this.enablevalidateForm1
      ){
        this.$v.$reset();
              this.getCustomFieldList({id: this.gridForm1.category_id})
 return true;

      }

        },
        default_city_select(){
          if(!this.cityOptions){

      
      this.cityOptions.push(
        new Object({
          disabled: true,
          value: null,
          text: this.$t(`forms.select_area`)
        })
        );
          }
        },
        validateStep2() {

                   this.$v.$touch();
      this.$v.lang_form.$touch();

        if (
        !this.$v.lang_form.$invalid

      ){
        this.$v.$reset();
       
 return true;
      }
        },
         validateStep3() {
         
            this.$v.$touch();
      this.$v.gridForm.$touch();

        if (
        !this.$v.gridForm.$invalid

      ){
        
     
 return true;
      }
          
          
        },
         validateStep4() {
            this.$v.$touch();
      this.$v.locationForm.$touch();

        if (
        !this.$v.locationForm.$invalid

      ){
        this.$v.$reset();
        this.saveBtn = 'skip';
 return true;

      }


        },
        getDifference2(array1, array2) {
            return array1.filter(object1 => {
              return !array2.some(object2 => {
                return object1.value.id === object2.id;
              });

  });
},
      getDifference(array1, array2) {
  return array1.filter(object1 => {
    return !array2.some(object2 => {
      return object1.id === object2.id;
    });

  });
},
        open_modal(refname,id, notes){
 this.$refs[refname].show();
  this.request_id = id;
  this.request_notes = notes;
 },
        editCustomValue(){
                  this.enable_custom_save_btn= true;

          this.custom_fields.forEach(el => {
                 this.updateCustomValue({info: el, custom_id: el.id, value_id: el.values[0].id})
            });

        },
        addNewCustomValue(type){
          this.enableModelBtn= true;
            this.customFields.forEach(el => {
              if (el.value) {
                                 this.createCustomValue({auction_id: this.auctionId,info: el, id: el.id })

              }
            });
        },
        

        openDeleteModal(){
          this.$refs['deleteAuction'].show();
        }
  },
  computed: {
    ...mapGetters([
      "auction",
      "categories",
      "_Image_List",
      "_createCustomField",
      "_createAuctionImage",
      "_cities",
      "_File_List",
      "_isLoadCustomField",
      "_auctionOwner",
      "_createAuctionFile",
      "_productsProcessing",
      "_isLoadAuctions",
      "_deleteAuctionFile",
      "_auctionReviewRequests",
      "_auctionProducts",
      "_areas",
      "_auctionSide",
      "_isCustomValueCreated",
      "_updateReviewRequest",
      "_deleteAuctionterms",
      "_subCategories",
      "_customFields",
      "_isLoadPreviewRequests",
      "_getSubCategorySuccess",
      "_deleteAuctionImage",
      "_updateCustomField",
      "_updatedAuctionMainImageSuccessfuly",
      "_isLoadSubCategory",
      "_dateError",
      "_updatedAuctionSuccessfuly",
      "_createAuctionSuccessfuly"
    ]),
    city_req() {
      return this.is_area_selected; // some conditional logic here...
    }
  },
  watch: {
    _File_List(newInfo, oldOne) {
      this.auctionFileList = newInfo;
      newInfo.forEach(el => {
         if(el.original_filename.length > 16){
          this.file_lists.push(
             new Object({
            id: el.id,
            type: el.type,
            link: el.path,
            img:  "/assets/img/products/file-img.png",
            original_filename:el.original_filename.slice(0, 12)+ "..."
          })
        )
          
         }else{
          this.file_lists.push(
             new Object({
            id: el.id,
            type: el.type,

            link: el.path,
            img:  "/assets/img/products/file-img.png",
            original_filename:el.original_filename
          })
          )
         }
        
       
      })


    },
    auction(newInfo, oldOne) {
      this.isLoadAuction = true;
         this.location.push(newInfo.latitude, newInfo.longitude);
      this.lang_form.forEach(el => {
        el.id = newInfo.locales[el._name].id;
        el.title = newInfo.locales[el._name].title;
        el.description = newInfo.locales[el._name].description;
         el.brochure = newInfo.locales[el._name].brochure;
        el.terms_conditions = newInfo.locales[el._name].terms_conditions;
      });
      this.image_basename = newInfo.image_basename;
      this.formStep1.category_id = newInfo.category_id;
      this.formStep1.sub_category_id = newInfo.sub_category_id;
      this.selected_sub_category = newInfo.sub_category_id;
      this.formStep3.opening_price = newInfo.opening_price;
      this.formStep1.auction_number = newInfo.auction_number;
      this.custom_fields = newInfo.custom_fields;
      this.formStep3.minimum_paid = newInfo.minimum_paid;
      this.formStep3.deposit = newInfo.deposit;
      this.formStep1.auction_side = newInfo.auction_side.id;
      this.formStep1.auction_owner = newInfo.auction_owner.id;
      this.files_form.image = newInfo.image;
      this.formStep4.latitude = newInfo.latitude;
      this.formStep4.longitude = newInfo.longitude;
      newInfo.terms_conditions == ""
        ? (this.files_form.terms_conditions = null)
        : (this.files_form.terms_conditions = newInfo.terms_conditions);
      newInfo.brochure == ""
        ? (this.files_form.brochure = null)
        : (this.files_form.brochure = newInfo.brochure);
      this.formStep1.start_date = newInfo.start_date;
      this.formStep1.end_date = newInfo.end_date;
      this.formStep4.city_id = newInfo.city.id;
      this.formStep4.area_id = newInfo.area.id;
      this.image_basename = newInfo.image_basename;
      this.getCities({ area_id: this.formStep4.area_id });
      // this.getSubCategory({id : this.formStep1.sub_category_id})
      this.getCustomFieldList({id: this.formStep1.category_id})
      this.getAuctionImages({ id: this.auctionId })
      this.getAuctionFiles({ id: this.auctionId })
    },
    _Image_List: function(val) {
      this.enable = false;
      this.show_dropzone = true;
      this.isLoadAuctionImages = true;
       val.forEach(el => {
        this.file_lists.push(
             new Object({
            id: el.id,
            link: el.path,
            type: el.type,
            img:  el.path
          })
        )
      
      })
    },
    _customFields: function(val) {
            this.categoryCustomFieldOptions = [];

       if (this.auctionId) {
        this.customFields = this.getDifference(val, this.custom_fields);
        this.customFields.forEach(option => {
        this.categoryCustomFieldOptions.push(
          new Object({
            value: option,
            text: option.locales[this.language].name
          })
        );
      });

        }else{
          this.getDifference(val,this.selectedFields).forEach(option => {
        this.categoryCustomFieldOptions.push(
          new Object({
            value: option,
            text: option.locales[this.language].name
          })
        );
      });
        }

      },
    _auctionReviewRequests: function(val){
  this.$refs.vuetable.setData(val);
    },
    _getSubCategorySuccess:function(val){
        this.formStep1.category_id = val.parent_id;
      this.formStep1.sub_category_id = val.id;
      this.gridForm1.category_id = val.parent_id;
      this.gridForm1.sub_category_id = val.id;
      // this.selected_sub_category = val
    },
    _updateCustomField: function(val){
       this.$notify(
        "success",
        "Operation completed successfully",
        "Custom Field have been updated successfully",
        { duration: 3000, permanent: false }
      );
      this.enable_custom_save_btn= false;

    },
    _updateReviewRequest: function(val){
       this.$refs['requestReview'].hide();
       this.getReviewRequests({auction_id : this.auctionId})
       this.requestBtn = false;
       this.$notify(
        "success",
        "Operation completed successfully",
        "this request have been updated successfully",
        { duration: 4000, permanent: false }
      );
    },
    _deleteAuctionImage: function(val){
      this.$refs['deleteAttach'].hide();
      this.enableModalBtn = false;
      this.$notify(
        "success",
        "Operation completed successfully",
        "this attachment have been deleted successfully",
        { duration: 4000, permanent: false }
      );
      this.file_lists = []
       this.getAuctionImages({ id: this.auctionId })
      this.getAuctionFiles({ id: this.auctionId })
    },
    _deleteAuctionFile: function(val){
       this.$refs['deleteAttach'].hide();
       this.enableModalBtn = false;
      this.$notify(
        "success",
        "Operation completed successfully",
        "this attachment have been deleted successfully",
        { duration: 4000, permanent: false }
      );
      this.file_lists = []
       this.getAuctionImages({ id: this.auctionId })
      this.getAuctionFiles({ id: this.auctionId })
    },
    _successDeleteAuction(newVal, old) {
      this.enableModalBtn= false;
      this.$refs['deleteAuction'].hide();
      this.$notify(
        "success",
        "Operation completed successfully",
        "the auction have been deleted successfully",
        { duration: 4000, permanent: false }
      );
      router.push(`${adminRoot}/auctions`);
    },
    _dateError: function(val) {
      this.disableNextBtn = false;
      this.$notify(
        "error",
        "Something went wrong",
        "The process was not completed successfully, please try again",
        { duration: 4000, permanent: false }
      );
      this.gridForm.start_date = null;
      this.gridForm.end_date = null;
        this.formStep1.start_date = null;
      this.formStep1.end_date = null;
      this.disabled = true;
          this.disabledFormStep1 = false;


    },
    _createCustomField: function(val){
      this.hideCustomModal = !this.hideCustomModal;

      // this.getCustomFieldList({id: this.gridForm.category_id})
    },
    _cities: function(val) {
      this.gridForm.city = null;
      this.cityOptions = [];
      val.forEach(option => {
        this.cityOptions.push(
          new Object({
            value: option.id,
            text: option.locales[this.language].name
          })
        );
      });
    },
    _createAuctionFile: function(val){
      this.enable_attach_btn = false;
        this.$notify(
        "success",
        "Operation completed successfully",
        "Attachment have been created successfully",
        { duration: 4000, permanent: false }
      );
            this.$refs['attachDetails'].hide();
              this.attach_form.forEach(el => {
         el.title = null;
         el.description = null;
      })
             this.$v.$reset();
             if (this.is_group_auction){
              router.push(`${adminRoot}/auctions`);
    
               
            }   
            this.file_lists = []
            this.getAuctionImages({ id: this.auctionId })
      this.getAuctionFiles({ id: this.auctionId })

    },
    _createAuctionImage: function(val){
      this.enable_attach_btn = false;
        this.$notify(
        "success",
        "Operation completed successfully",
        "Attachment have been created successfully",
        { duration: 4000, permanent: false }
      );
            this.$refs['attachDetails'].hide();
            this.attach_form.forEach(el => {
         el.title = null;
         el.description = null;
      });
             this.$v.$reset();
             if (this.is_group_auction){
              router.push(`${adminRoot}/auctions`);
    
               
            }  
            this.file_lists = []
            this.getAuctionImages({ id: this.auctionId })
      this.getAuctionFiles({ id: this.auctionId }) 
          },
    _subCategories: function(val) {
      val.forEach(option => {
        this.subCategoryOptions.push(
          new Object({
            value: option.id,
            text: option.locales[this.language].name
          })
        );
      });
    },
    _auctionProducts: function(val){
            this.$refs.products_vuetable.setData(val);
    },


    _areas: function(val) {

      val.forEach(option => {
        this.areaOptions.push(
          new Object({
            value: option.id,
            text: option.locales[this.language].name
          })
        );
      });
    },
    _updatedAuctionSuccessfuly(newInfo, oldOne) {
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction have been updated successfully",
        { duration: 3000, permanent: false }
      );
    this.disabledFormStep1 = false;
    this.disabledFormStep2 = false;
     this.disabledFormStep3 = false;
     this.disabledFormStep4 = false;
    },
    _updatedAuctionMainImageSuccessfuly: function(val){
        this.files_form.image = val.image;
        this.model_button = false;
        this.$refs['main_image'].hide();
        this.$notify(
          "success",
          "Operation completed successfully",
          "Auction Image have been updated successfully",
          { duration: 3000, permanent: false }
        );


    },
    _createAuctionSuccessfuly(newInfo, oldOne) {
      this.disableNextBtn = false;
      this.auctn
      this.saveBtn = 'skip';
      this.auction_id = newInfo.data.data.id;
      this.isLoadCustomField = true;
      this.isAbleToMove = true;
      this.createAttachmentsQueue(newInfo.data.data.id)
      this.$notify(
        "success",
        "Operation completed successfully",
        "Auction have been created successfully",
        { duration: 3000, permanent: false }
      );
     this.selectedFields.forEach(el => {
                 this.createCustomValue({auction_id: this.auction_id,info: el, id: el.id })
            });
    },
    categories(newval, old) {
      newval.forEach(option => {
        this.categoryIdOptions.push(
          new Object({
            value: option,
            text: option.locales[this.language].name
          })

        );
           })

    },
    _deleteAuctionterms: function(val){
 this.$notify(
          "success",
          "Operation completed successfully",
          "Auction File have been deleted successfully",
          { duration: 3000, permanent: false }
        );
        this.disabledAttachLangsBtn = false;
    },
    _auctionSide(newval, old) {
      newval.forEach(option => {
        this.auctionSideOptions.push(
          new Object({
            value: option.id,
            text: option.name
          })
        );
      });
    },
    _auctionOwner(newval, old) {
      newval.forEach(option => {
        this.auctionOwnerOptions.push(
          new Object({
            value: option.id,
            text: option.name
          })
        );
      });
    },
    _isCustomValueCreated: function(val){
      this.enableModelBtn = false;
      this.$refs['modallg'].hide();
      this.$notify(
        "success",
        "Operation completed successfully",
        "Value of custom field have been created successfully",
        { duration: 2000, permanent: false }
      );
      this.enable_custom_save_btn= false;

       router.push(`${adminRoot}/auctions`);
    },
    image: function(val) {
      if (val) {
          this.imgUrl = URL.createObjectURL(val)
          this.files_form.image = URL.createObjectURL(val)
      }
    },


  }
};
</script>
