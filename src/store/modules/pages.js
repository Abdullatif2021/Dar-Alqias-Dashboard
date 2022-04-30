import axios from "../../plugins/axios";
import { apiUrl, adminRoot } from "../../constants/config";
import router from "../../router";

const state = {
  isLoadPages: true,
  pagesPaginations: null,
  Pages: null,
  updatedSuccessfuly: false,
  Error: "",
  // //////////////////////////////////////////////////////////////////
  page: null,
  metaList: null
};

const getters = {
  isLoadPages: state => state.isLoadPages,
  PagesError: state => state.Error,
  pagesPaginations: state => state.paginations,
  Pages: state => state.Pages,
  //   updatedSuccessfuly: state => state.updatedSuccessfuly
  metaList: state => state.metaList,
  page: state => state.page
};

const mutations = {
  getPagesListStarted(state) {
    state.isLoadPages = true;
    state.Pages = [];
  },
  getPagesSuccess(state, payload) {
    state.isLoadPages = false;
    state.Pages = payload.data;
    state.pagesPaginations = payload;
  },
  getPageStarted(state) {
    state.page = null;
  },
  getPageSuccess(state, payload) {
    state.page = payload.data;
  },
  updatedSuccessfuly(state) {
    state.updatedSuccessfuly = true;
  },
  getPagesError(state, error) {
    state.isLoadPages = false;
    state.PagesError = error;
    state.Pages = null;
  },
  getMetaList(state, payload) {
    state.metaList = payload.data;
  }
};

const actions = {
  getPagesList({ commit }, payload) {
    commit("getPagesListStarted");

    axios
      .get(`${apiUrl}/pages`, {
        params: {
          type: payload.role,
          order_dir: payload.dir,
          name: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          page: payload.page
        }
      })
      .then(res => {
        if (res.status) {
          commit("getPagesSuccess", res.data);
        } else {
          commit("getPagesError", "error:getPages");
        }
      });
  },
  getPage({ commit }, payload) {
    commit("getPageStarted");
    const id = payload.id;
    axios.get(`${apiUrl}/pages/${id}`).then(res => {
      console.log(res);
      commit("getPageSuccess", res.data);
    });
  },
  getMetaList({ commit }, payload) {
    const id = payload.id;
    axios.get(`${apiUrl}/pages/metadata/${id}`).then(res => {
      console.log(res);
      commit("getMetaList", res.data);
    });
  },
  updatePageData({ commit }, payload) {
    console.log(payload);
    const id = payload.id;

    const formData = new FormData();

    if (payload.data.locales.ar) {
      formData.append("ar[name]", payload.data.locales.ar.name);
      formData.append("ar[description]", payload.data.locales.ar.description);
    }
    if (payload.data.locales.en) {
      formData.append("en[name]", payload.data.locales.en.name);
      formData.append("en[description]", payload.data.locales.en.description);
    }
    if (payload.file !== null) {
      formData.append("image", payload.file);
    }
    formData.append("_method", "PUT");
    axios.post(`${apiUrl}/pages/${id}`, formData, {}).then(res => {
      console.log(res);
      if (res.status === 200) {
        console.log("Successfully Done !");
      }
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
