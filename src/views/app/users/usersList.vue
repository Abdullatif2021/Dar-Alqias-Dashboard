<template>
  <div>
    <datatable-heading
      :title="$t(`menu.${_type}_table`)"
      :isAnyItemSelected="isAnyItemSelected"
      :keymap="keymap"
      :changePageSize="changePageSize"
      :searchChange="searchChange"
      :category="category"
      :cancle="cancle"
      :transaction_filter="false"
      :add_new_button="true"
      :add_new_title="$t('todo.add-new')"
      :changeOrderBy="changeOrderBy"
      :from="from"
      @add_new="add_New"
      :sort="sort"
      :to="to"
      :reload="reload"
      :Filtered="type === 'admins' ? true : false"
      :sortOptions="sortOptions"
      :total="total"
      :perPage="perPage"
    ></datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="processing">
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
          >
            <template slot="actions" slot-scope="props">
              <b-button
                variant="outline-theme-3"
                id="edit"
                class="icon-button-auction"
                @click="modify(props.rowData.id, props.rowData.first_name)"
              >
                <i class="simple-icon-arrow-right"></i>
              </b-button>
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
      id="activeModal"
      ref="activeModal"
      :title="$t('modal.modal-active-title')"
    >
      {{
        active === 1 ? $t("forms.activeQuestion") : $t("forms.inactiveQuestion")
      }}
      <template slot="modal-footer">
        <b-button variant="primary" @click="active_user()" class="mr-1">
          {{ $t("button.yes") }}</b-button
        >
        <b-button variant="secondary" @click="hideModal('activeModal')">{{
          $t("button.no")
        }}</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap.vue";
import DatatableHeading from "../../../containers/datatable/DatatableHeading.vue";
import { getCurrentLanguage } from "../../../utils";
import { mapGetters, mapActions } from "vuex";
import router from "../../../router";
import { adminRoot } from "../../../constants/config";
export default {
  props: ["title"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
      dir: null,
      role: null,
      order_by: null,
      type: null,
      reload: true,
      activate: null,
      active: null,
      search: null,
      language: null,
      actions: null,
      isLoad: false,
      apiBase: "/cakes/fordatatable",
      sort: {
        column: null,
        label: "all"
      },
      page: 1,
      category: false,
      _type: null,
      limit: null,
      perPage: 8,
      from: 0,
      to: 0,
      total: 0,
      dataCount: 0,

      lastPage: 0,
      items: [],
      selectedItems: [],
      sortOptions: [
        {
          column: null,
          label: "all"
        },
        {
          column: "admin",
          label: "admin"
        },
        {
          column: "superadmin",
          label: "superadmin"
        }
      ],
      fields: [
        {
          name: "image",
          callback: value => {
            return `<img src="${value}" style="border-radius: 34%;" alt="Image" width="50" height="50">`;
          },
          title: "Image",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "",
          callback: value => {
            return `${value.first_name} ${value.last_name}`;
          },
          sortField: "first_name",
          title: "Name",
          direction: "asc",
          titleClass: "",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "email",
          title: "Email",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },
        {
          name: "role",
          callback: value => {
            return value[0];
          },
          sortField: "role",
          title: "Role",
          titleClass: "",
          dataClass: "text-muted",
          width: "20%"
        },
        {
          name: "active",
          callback: value => {
            return value === 1 ? "active" : "unactive";
          },
          sortField: "active",
          title: "Active",
          titleClass: "",
          dataClass: "text-muted",
          width: "10%"
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
    this._type = this.$route.fullPath.split("/")[2];
    this.get_list(this.$route.fullPath.split("/")[2]);
    this.language = getCurrentLanguage();
  },
  methods: {
    ...mapActions(["getUsersList", "activateUser"]),
    get_list(type) {
      switch (type) {
        case "admins":
          this.type = ["superadmin", "admin"];
          this.getUsersList({
            type: ["superadmin", "admin"],
            role: null,
            dir: null,
            search: null,
            order_by: null,
            limit: null,
            page: null
          });
          break;
        case "accountant":
          this.type = ["accountant"];
          this.getUsersList({
            type: ["accountant"],
            role: null,
            dir: null,
            search: null,
            order_by: null,
            limit: null,
            page: null
          });
          break;
        case "users":
          this.type = ["user"];
          this.getUsersList({
            type: ["user"],
            role: null,
            dir: null,
            search: null,
            order_by: null,
            limit: null,
            page: null
          });
          break;
        default:
          break;
      }
    },

    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return "selected";
      }
      return "";
    },
    cancle() {
      this.this.getUsersList({
        type: this.type,

        role: null,
        dir: null,
        search: null,
        order_by: null,
        limit: null,
        page: null
      });
    },
    modify(id, firstName) {
      this.$router.push({
        path: `${adminRoot}/${this._type}/user`,
        query: { id: id, fN: firstName }
      });
    },
    add_New() {
      this.$router.push({
        path: `${adminRoot}/${this._type}/user`
      });
    },

    hideModal(refname) {
      this.$refs[refname].hide();
    },
    rowClicked(dataItem, field) {
      if (
        field.srcElement.localName === "span" ||
        field.srcElement.localName === "b-button"
      ) {
        if (field.srcElement.classList[0] !== "badge") {
          this.open_model("activeModal", dataItem.id, dataItem.active);
        }
      }
    },
    onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    dataManager(sortOrder, pagination) {
      if (sortOrder.length > 0) {
        if (sortOrder[0].direction == "asc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "ASC";
          this.getUsersList({
            type: this.type,
            sorting: true,

            role: this.sort.column,
            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
        if (sortOrder[0].direction == "desc") {
          this.order_by = sortOrder[0].sortField;
          this.dir = "DESC";
          this.getUsersList({
            sorting: true,

            type: this.type,

            role: this.sort.column,
            dir: this.dir,
            search: this.search,
            order_by: this.order_by,
            limit: this.limit,
            page: this.page
          });
        }
      }
    },

    onChangePage(page) {
      if (page == "next" || page == "prev") {
      } else {
        this.page = page;
        this.getUsersList({
          type: this.type,

          role: this.sort.column,
          dir: this.dir,
          search: this.search,
          order_by: this.order_by,
          limit: this.limit,
          page: this.page
        });
      }
    },
    open_model(refname, id, active) {
      this.$refs[refname].show();
      this.userId = id;
      this.active = active;
    },
    active_user() {
      this.activateUser({ id: this.userId, active: this.active === 1 ? 0 : 1 });
    },
    changePageSize(perPage) {
      this.limit = perPage;
      this.getUsersList({
        type: this.type,

        role: this.sort.column,
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },

    changeOrderBy(sort) {
      this.sort = sort;

      this.getUsersList({
        type: this.type,

        role: sort.column,
        dir: this.dir,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    searchChange(val) {
      this.search = val;
      this.getUsersList({
        type: this.type,

        role: this.sort.column,
        dir: this.dir,
        search: val,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
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

    onContextMenuAction(action) {}
  },
  computed: {
    ...mapGetters([
      "usersList",
      "ListActions",
      "_successActivateUser",
      "processing"
    ]),
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
    $route(to, from) {
      this.reload = false;
      this.get_list(this.$route.fullPath.split("/")[2]);
      this._type = this.$route.fullPath.split("/")[2];
    },
    searchChange(newQuestion, oldQuestion) {
      if (newQuestion) {
      }
    },
    _successActivateUser(newVal, old) {
      this.$refs["activeModal"].hide();
      this.activate = newVal.active === 1 ? "activated" : "deactivated";
      this.$notify(
        "success",
        "Operation completed successfully",
        `The account has been successfully ${this.activate}`,
        { duration: 3000, permanent: false }
      );
      this.getUsersList({
        role: this.sort.column,
        dir: this.dir,
        type: this.type,
        search: this.search,
        order_by: this.order_by,
        limit: this.limit,
        page: this.page
      });
    },
    usersList(newList, old) {
      this.$refs.vuetable.setData(newList);
      this.reload = true;
    },
    ListActions(newActions, old) {
      this.perPage = newActions.per_page;
      this.from = newActions.from;
      this.to = newActions.to;
      this.total = newActions.total;
      this.$refs.pagination.setPaginationData(newActions);
    },
    type(newVal, old) {}
  }
};
</script>
