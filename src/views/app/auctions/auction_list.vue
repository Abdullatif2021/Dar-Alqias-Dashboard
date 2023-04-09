<template>
  <div>
    <datatable-heading
      :title="$t('menu.auctions-table')"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :transaction_filter="false"
      :sortTitle="$t(`todo.orderbyState`)"
      :add_new_button="true"
      :add_new_title="$t('todo.add-new')"
      :sortOptions="sortOptions"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :from="from"
      @add_new="add_New"
      :reload="true"
      :changeOrderBy="changeOrderBy"
      :sort="sort"
      :to="to"
      :Filtered="true"
      :total="total"
      :perPage="perPage"
    ></datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="_isLoadAuctions">
          <vuetable
            ref="vuetable"
            class="table-divided order-with-arrow"
            :api-mode="false"
            :data-total="dataCount"
            :per-page="perPage"
            :data-manager="dataManager"
            :reactive-api-url="true"
            :fields="fields"
            pagination-path
            :row-class="onRowClass"
            @vuetable:pagination-data="onPaginationData"
            @vuetable:row-clicked="rowClicked"
            @vuetable:cell-rightclicked="rightClicked"
          >
            <template slot="actions" slot-scope="props">
              <!-- <b-button
                v-if="
                  props.rowData.auction_type_value !== 1 &&
                    props.rowData.auction_type_value !== 3
                "
                id="activate"
                :variant="
                  props.rowData.active === 1
                    ? 'outline-theme-6'
                    : 'outline-theme-7'
                "
                class="icon-button"
                @click="
                  open_model(
                    'activeAuction',
                    props.rowData.id,
                    props.rowData.active
                  )
                "
              >
                <i
                  :class="
                    props.rowData.active === 1
                      ? 'iconsminds-close'
                      : 'iconsminds-yes'
                  "
                ></i>
                <b-tooltip
                  target="activate"
                  placement="left"
                  :title="$t('forms.active_auction')"
                >
                </b-tooltip>
              </b-button> -->

              <b-button
                variant="outline-theme-3"
                id="edit"
                class="icon-button-auction"
                @click="
                  modify(
                    props.rowData,
                    props.rowData.id,
                    props.rowData.auction_type_value
                  )
                "
              >
                <i class="simple-icon-arrow-right"></i>
                <!-- <b-tooltip
                  target="edit"
                  placement="top"
                  :title="$t('forms.edit')"
                >
                </b-tooltip> -->
              </b-button>
              <!-- <b-button
                v-if="props.rowData.auction_type_value !== 1"
                variant="outline-theme-6"
                id="delete"
                class="icon-button"
                @click="open_model('deleteAuction', props.rowData.id)"
              >
                <i class="simple-icon-trash"></i>
                <b-tooltip
                  target="delete"
                  placement="bottom"
                  :title="$t('forms.delete')"
                >
                </b-tooltip>
              </b-button> -->
            </template>
          </vuetable>
          <vuetable-pagination-bootstrap
            class="mt-4"
            ref="pagination"
            @vuetable-pagination:change-page="onChangePage"
          />
        </template>
        <template v-else>
          <div class="loading"></div>
        </template>
      </b-colxx>
    </b-row>

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="onContextMenuAction('copy')">
        <i class="simple-icon-docs" />
        <span>Copy</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="onContextMenuAction('move-to-archive')">
        <i class="simple-icon-drawer" />
        <span>Move to archive</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="onContextMenuAction('delete')">
        <i class="simple-icon-trash" />
        <span>Delete</span>
      </v-contextmenu-item>
    </v-contextmenu>

    <b-modal
      id="activeAuction"
      ref="activeAuction"
      :title="$t('modal.modal-active-auction-title')"
    >
      {{
        active === 0
          ? $t("forms.activeAuctionQuestion")
          : $t("forms.inactiveAuctionQuestion")
      }}
      <template slot="modal-footer">
        <b-button
          :disabled="enableModalBtn"
          variant="primary"
          @click="active_auction()"
          class="mr-1"
        >
          {{ $t("button.yes") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('activeAuction')">{{
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
    <b-modal
      id="auction_details"
      ref="auction_details"
      modal-class="modal-right"
      :title="$t('modal.modal-auction-details')"
      hide-footer
    >
      <template v-if="_isLoadCategories">
        <div v-if="enable_details">
          <div v-for="(lang, index) in langs" :key="index">
            <b-button
              class="callBtn"
              v-b-toggle="`collapse-${index}`"
              variant="link"
              >{{ $t(`forms.${lang.name}_lang`) }}
              <i
                style="position: absolute;margin: 4px;"
                class="simple-icon-plus"
              ></i
            ></b-button>
            <b-collapse :id="`collapse-${index}`" accordion="my-accordion">
              <div class="p-4">
                <b-form-group>
                  <label class="form-group-label" for="open">{{
                    $t("forms.title")
                  }}</label>
                  <b-form-input
                    v-model="lang.value.title"
                    type="text"
                    readonly
                  />
                </b-form-group>
                <b-form-group>
                  <label class="form-group-label" for="open">{{
                    $t("forms.description")
                  }}</label>
                  <b-form-input
                    v-model="lang.value.description"
                    type="text"
                    readonly
                  />
                </b-form-group>
              </div>
            </b-collapse>
          </div>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.opening_price")
            }}</label>
            <b-form-input
              v-model="auction.opening_price"
              type="text"
              readonly
            />
          </b-form-group>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.deposit")
            }}</label>
            <b-form-input v-model="auction.deposit" type="text" readonly />
          </b-form-group>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.category")
            }}</label>
            <b-form-input v-model="categoryName" type="text" readonly />
          </b-form-group>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.sub-category")
            }}</label>
            <b-form-input v-model="subCategoryName" type="text" readonly />
          </b-form-group>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.auction_side")
            }}</label>
            <b-form-input
              v-model="auction.auction_side.name"
              type="text"
              readonly
            />
          </b-form-group>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.auction_owner")
            }}</label>
            <b-form-input
              v-model="auction.auction_owner.name"
              type="text"
              readonly
            />
          </b-form-group>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.area")
            }}</label>
            <b-form-input
              v-if="language === 'en'"
              v-model="auction.area.locales.en.name"
              type="text"
              readonly
            />
            <b-form-input
              v-if="language === 'ar'"
              v-model="auction.area.locales.ar.name"
              type="text"
              readonly
            />
          </b-form-group>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.city")
            }}</label>
            <b-form-input
              v-if="language === 'en'"
              v-model="auction.city.locales.en.name"
              type="text"
              readonly
            />
            <b-form-input
              v-if="language === 'ar'"
              v-model="auction.city.locales.ar.name"
              type="text"
              readonly
            />
          </b-form-group>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.image")
            }}</label>
            <div class="image-review-show-1">
              <img
                style="max-width: 100%; max-height: 100%;"
                :src="auction.image"
                alt="Auction image"
              />
            </div>
          </b-form-group>
          <b-form-group>
            <label class="form-group-label" for="open">{{
              $t("forms.location")
            }}</label>
            <googleMaps
              id="maps"
              :location="location"
              @select_location="set_location"
            />
          </b-form-group>
          <b-form-group>
            <div style="display: grid;">
              <label class="form-group-label" for="open">{{
                $t("forms.brochure")
              }}</label>
              <b-button
                :variant="auction.brochure == '' ? 'light' : 'primary'"
                :disabled="auction.brochure == '' ? true : false"
                @click="open_link(auction.brochure)"
                >show</b-button
              >
            </div>
          </b-form-group>
          <b-form-group>
            <div style="display: grid;">
              <label class="form-group-label" for="open">{{
                $t("forms.terms_conditions")
              }}</label>
              <b-button
                :variant="auction.terms_conditions == '' ? 'light' : 'primary'"
                :disabled="auction.terms_conditions == '' ? true : false"
                @click="open_link(auction.terms_conditions)"
                >show</b-button
              >
            </div>
          </b-form-group>
        </div>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-modal>
  </div>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import deleteModal from "../../../components/shared/deleteModal.vue";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { mapGetters, mapActions } from "vuex";
import { getCurrentLanguage, getCurrentUser } from "../../../utils";
import * as moment from "moment";
import Switches from "vue-switches";
import googleMaps from "../../../components/shared/googleMaps.vue";
import router from "../../../router";
import { adminRoot } from "../../../constants/config";
export default {
  components: {
    googleMaps: googleMaps,
    vuetable: Vuetable,
    deleteModal: deleteModal,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading,
    switches: Switches
  },
  data() {
    return {
      dir: null,
      order_by: null,
      auctionType_id: null,
      categoryName: null,

      search: null,
      langs: [],
      enable_details: false,
      modalName: null,
      hideModel: false,
      active_test: false,
      subCategoryName: null,
      auctionId: null,
      location: [],

      isLoad: false,
      apiBase: "/cakes/fordatatable",
      sort: {
        column: null,
        label: "All"
      },
      page: 1,
      language: null,
      enableModalBtn: false,
      limit: null,
      sortOptions: [
        {
          column: null,
          label: "All"
        },
        {
          column: 1,
          label: "inProgress"
        },
        {
          column: 2,
          label: "upComing"
        },
        {},
        {
          column: 2,
          label: "pending"
        },
        {
          column: 3,
          label: "ended"
        }
      ],
      auction_id: null,
      perPage: 8,
      auction: null,
      active: null,
      from: 0,
      to: 0,
      total: 0,
      dataCount: 0,
      lastPage: 0,
      items: [],
      selectedItems: [],

      fields: [
        {
          name: "id",
          title: "NO.",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "2%"
        },

        {
          name: "locales",
          callback: value => {
            return value[this.language].title;
          },
          title: "Title",
          titleClass: "",
          dataClass: "list-item-heading"
        },

        {
          name: "",
          callback: value => {
            return `<span>
                ${new Date(value.start_date)
                  .toString()
                  .slice(
                    new Date(value.start_date).toString().indexOf(" "),
                    new Date(value.start_date).toString().lastIndexOf(":")
                  )}
              </span>
              <br/>
              <span>
               ${new Date(value.end_date)
                 .toString()
                 .slice(
                   new Date(value.end_date).toString().indexOf(" "),
                   new Date(value.end_date).toString().lastIndexOf(":")
                 )}

              </span>
              `;
          },

          sortField: "start_date",
          title: "Duration",
          titleClass: "",
          dataClass: "list-item-heading duration",
          width: "15%"
        },
        {
          name: "minimum_paid",
          sortField: "minimum_paid",
          title: "Minimum Pid",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "10%"
        },
        {
          name: "bids_count",
          title: "Bidds",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "5%"
        },
        {
          name: "auction_type",
          callback: value => {
            return `<span class="badge badge-pill badge-${
              value.split(" ")[0]
            } handle mr-1">
                ${value}
              </span>`;
          },
          title: "Status",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "15%"
        },
        {
          name: "",
          callback: value => {
            return `<b-button class="${
              value.active === 1
                ? `toggle_btn_on_${this.language}`
                : `toggle_btn_off_${this.language}`
            }" variant="primary">
              <span class="${
                value.active === 1
                  ? `toggle_span_on_${this.language}`
                  : `toggle_span_off_${this.language}`
              }"></span>
        </b-button>`;
          },
          title: "Activate",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "8%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "10%"
        }
      ]
    };
  },
  created() {
    this.language = getCurrentLanguage();
    // const role = getCurrentUser();
    // this.userRole = role.role[0];
    // if (userRole = 'owner'){
    //   console.log('owner is here ');
    // }
    this.getAuctions({
      dir: null,
      auction_owner: this.$route.query.owner_id,
      auctionType: null,
      search: null,
      order_by: null,
      limit: null,
      page: null
    });
  },
  methods: {
    ...mapActions([
      "getAuctions",
      "deleteAuction",
      "updateAuctionStatus",
      "getCategory",
      "getSubCategory"
    ]),

    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },

    modify(auction, id, type) {
      if (type === 2) {
        this.$router.push({
          path: `${adminRoot}/auctions/auction`,
          query: { id: id }
        });
      } else {
        this.$router.push({
          path: `${adminRoot}/auctions/auction-review`,
          query: { id: id }
        });
        // this.getCategory({ id: auction.category_id })
        // this.getSubCategory({ id: auction.sub_category_id })
        // this.langs = [];
        // this.enable_details = true;
        // this.auction = auction;
        // this.location.push(auction.latitude, auction.longitude);
        // Object.keys(auction.locales).forEach(key => {
        //    this.langs.push(
        //   new Object({
        //     name: key,
        //     value: auction.locales[key]
        //   })
        // );
        // });
        // this.$refs['auction_details'].show();
      }
    },

    rowClicked(dataItem, field, event) {
      if (
        field.srcElement.localName === "span" ||
        field.srcElement.localName === "b-button"
      ) {
        if (field.srcElement.classList[0] !== "badge") {
          if (dataItem.auction_type_value === 2) {
            this.open_model("activeAuction", dataItem.id, dataItem.active);
          } else {
            this.$notify(
              "error",
              "Operation failed",
              "You can't update status for auction anymore",
              { duration: 3000, permanent: false }
            );
          }
        }
      }
    },
    open_model(refname, id, active) {
      this.enableModalBtn = false;

      this.$refs[refname].show();
      this.auctionId = id;
      if (active != null) {
        this.active = active;
      }
    },
    rightClicked(dataItem, field, event) {
      event.preventDefault();
      if (!this.selectedItems.includes(dataItem.id)) {
        this.selectedItems = [dataItem.id];
      }
      this.$refs.contextmenu.show({ top: event.pageY, left: event.pageX });
    },

    onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    formatDate(d) {
      return moment(d).format("MMM Do YYYY");
    },
    dataManager(sortOrder, pagination) {
      if (sortOrder.length > 0) {
        if (sortOrder[0].direction == "asc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          this.getAuctions({
            dir: this.dir,
            auction_owner: this.$route.query.owner_id,
            sorting: true,
            auctionType: this.auctionType_id,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
        if (sortOrder[0].direction == "desc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "DESC";
          this.getAuctions({
            dir: this.dir,
            sorting: true,
            auction_owner: this.$route.query.owner_id,
            search: this.search,
            auctionType: this.auctionType_id,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
      }
    },
    set_location(data) {},
    delete_auction() {
      this.enableModalBtn = true;
      this.deleteAuction({ Id: this.auctionId });
    },
    active_auction() {
      this.enableModalBtn = true;
      this.updateAuctionStatus({
        active: this.active === 1 ? 0 : 1,
        id: this.auctionId
      });
    },
    open_link(link) {
      window.open(link);
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    onChangePage(page) {
      if (page == "next" || page == "prev") {
      } else {
        this.page = page;
        this.getAuctions({
          dir: this.dir,
          auction_owner: this.$route.query.owner_id,
          search: this.search,
          auctionType: this.auctionType_id,
          order_by: this.order_by,
          limit: this.limit,
          page: this.page
        });
      }
    },

    changePageSize(perPage) {
      this.limit = perPage;
      this.getAuctions({
        dir: this.dir,
        auction_owner: this.$route.query.owner_id,
        auctionType: this.auctionType_id,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },

    searchChange(val) {
      this.search = val;
      this.getAuctions({
        dir: null,
        search: val,
        auction_owner: this.$route.query.owner_id,
        auctionType: this.auctionType_id,
        order_by: null,
        limit: null,
        page: null
      });
    },

    changeOrderBy(sort) {
      this.sort = sort;
      this.auctionType_id = sort.column;
      this.getAuctions({
        dir: null,
        auction_owner: this.$route.query.owner_id,
        auctionType: sort.column,
        search: null,
        order_by: null,
        limit: null,
        page: null
      });
    },
    selectAll(isToggle) {
      if (this.selectedItems.length >= this.items.length) {
        if (isToggle) this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map(x => x.id);
      }
    },
    keymap(event) {
      switch (event.srcKey) {
        case "select":
          this.selectAll(false);
          break;
        case "undo":
          this.selectedItems = [];
          break;
      }
    },
    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    },

    onContextMenuAction(action) {},
    add_New() {
      this.$router.push({
        path: `${adminRoot}/auctions/auction`
      });
    },
    toDateFormat(value) {
      return value.toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
  },
  computed: {
    ...mapGetters([
      "auctions",
      "auction_paginations",
      "_successDeleteAuction",
      "_isLoadCategories",
      "_updatedAuctionUnSuccessfuly",
      "_getSubCategorySuccess",
      "_category",
      "_isLoadAuctions",
      "_updatedAuctionSuccessfuly",
      "_deleteAuctionError"
    ]),
    // toDateFormat(value){
    //  return value.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    // },
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    isAnyItemSelected() {
      return (
        this.selectedItems.length > 0 &&
        this.selectedItems.length < this.items.length
      );
    }
  },
  watch: {
    active_test: function(val) {},
    searchChange(newQuestion, oldQuestion) {
      if (newQuestion) {
      }
    },
    _deleteAuctionError: function(val) {
      this.enableModalBtn = false;
      this.$refs["deleteAuction"].hide();
      this.$notify(
        "error",
        "Operation failed",
        "You can't delete this auction since it started",
        { duration: 5000, permanent: false }
      );
    },
    _successDeleteAuction(newVal, old) {
      this.enableModalBtn = false;
      this.hideModel = !this.hideModel;
      this.$refs["deleteAuction"].hide();
      this.$notify(
        "success",
        "Operation completed successfully",
        "the auction have been deleted successfully",
        { duration: 4000, permanent: false }
      );
      this.getAuctions({
        dir: this.dir,
        search: this.search,
        auction_owner: this.$route.query.owner_id,
        order_by: this.order_by,
        auctionType: this.auctionType_id,
        limit: this.limit,
        page: this.page
      });
    },
    _updatedAuctionUnSuccessfuly: function(val) {
      this.$refs["activeAuction"].hide();
      this.enableModalBtn = true;

      this.$notify(
        "error",
        "Operation failed",
        "You can't update status for auction anymore",
        { duration: 3000, permanent: false }
      );
    },
    auctions(newList, old) {
      this.$refs.vuetable.setData(newList);
    },
    _updatedAuctionSuccessfuly(newInfo, oldOne) {
      this.enableModalBtn = true;
      this.$refs["activeAuction"].hide();

      this.$notify(
        "success",
        "Operation completed successfully",
        "Status of auction have been changed successfully",
        { duration: 3000, permanent: false }
      );

      this.getAuctions({
        dir: this.dir,
        search: this.search,
        auction_owner: this.$route.query.owner_id,
        order_by: this.order_by,
        auctionType: this.auctionType_id,
        limit: this.limit,
        page: this.page
      });
    },
    _category: function(val) {
      this.categoryName = val.locales[this.language].name;
    },
    _getSubCategorySuccess: function(val) {
      this.subCategoryName = val.data.locales[this.language].name;
    },
    auction_paginations(newActions, old) {
      this.perPage = newActions.per_page;
      this.from = newActions.from;
      this.to = newActions.to;
      this.total = newActions.total;
      this.$refs.pagination.setPaginationData(newActions);
    }
  }
};
</script>
