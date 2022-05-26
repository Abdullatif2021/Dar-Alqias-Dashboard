import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import router from "../../router";
import { adminRoot } from "../../constants/config";

const state = {
  paginations: null,
  categories: null,
  updated_Successfuly: null,
  Error: "",
  category: null,
  successDeleteCategory: null,
  successActiveCategory: null,
  processing: false,
  create_category_success: null,
  successUpdateCategory: null,
  Categorymetadata: null,
  successUpdateCategoryMeta: null,
  create_category_meta_success: null
};

const getters = {
  _isLoadCategories: state => state.processing,
  cateError: state => state.Error,
  cate_paginations: state => state.paginations,
  categories: state => state.categories,
  _category: state => state.category,
  _create_category_success: state => state.create_category_success,
  _updatedCategorySuccessfuly: state => state.updated_Successfuly,
  _successDeleteCategory: state => state.successDeleteCategory,
  _successActiveCategory: state => state.successActiveCategory,
  _successUpdateCategory: state => state.successUpdateCategory,
  // block category metaData
  _CategoryMeta: state => state.Categorymetadata,
  _isLoadCategoryMeta: state => state.processing,
  _updateCategoryMetaSuccess: state => state.successUpdateCategoryMeta,
  _create_category_meta_success: state => state.create_category_meta_success
};

const mutations = {
  getCategoriesSuccess(state, categories) {
    state.categories = categories.data;
    state.paginations = categories;
  },
  setProcessing(state, payload) {
    state.processing = payload;
  },
  getCategorySuccess(state, data) {
    state.category = data.data;
  },
  updatedCategorySuccessfuly(state, data) {
    state.updated_Successfuly = data;
  },
  getCategoriesError(state, error) {
    state.Error = error;
    state.categories = null;
  },
  deleteCategory(state, payload) {
    state.successDeleteCategory = payload;
  },
  activeCategory(state, payload) {
    state.successActiveCategory = payload;
  },
  create_category_success(state, payload) {
    state.create_category_success = payload;
  },
  successUpdateCategory(state, payload) {
    state.successUpdateCategory = payload;
  },
  // category metaData
  updateCategoryMetaSuccess(state, payload) {
    state.successUpdateCategoryMeta = payload;
  },
  getCategorymetadata(state, payload) {
    state.Categorymetadata = payload;
  },
  create_category_meta_success(state, payload) {
    state.create_category_meta_success = payload;
  },
  delete__category_meta_success(state, payload) {
    state.delete_category_meta_success = payload;
  }
};

const actions = {
  getCategories: async ({ commit }, payload) => {
    commit("setProcessing", false);

    await axios
      .get(`${apiUrl}/categories`, {
        params: {
          order_dir: payload.dir,
          keyword: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          page: payload.page
        }
      })
      .then(res => {
        console.log("here");
        commit("setProcessing", true);
        return res;
      })

      .then(res => {
        if (res.status === 200) {
          commit("getCategoriesSuccess", res.data);
        }
      });
  },
  getCategory({ commit, dispatch }, payload) {
    const id = payload.id;
    axios.get(`${apiUrl}/categories/${id}`).then(res => {
      commit("getCategorySuccess", res.data);
    });
  },
  createCategory({ commit, dispatch }, payload) {
    console.log(payload);
    const formData = new FormData();

    formData.append("ar[name]", payload.info.ar_name);
    formData.append("ar[description]", payload.info.ar_description);
    formData.append("en[name]", payload.info.en_name);
    formData.append("en[description]", payload.info.en_description);

    if (payload.img !== null) {
      formData.append("image", payload.img);
    }
    axios.post(`${apiUrl}/categories`, formData, {}).then(res => {
      if (res.status === 201) {
        commit("create_category_success", res);
      }
    });
  },
  updateCategory({ commit, dispatch }, payload) {
    const id = payload.id;
    console.log(payload);
    const formData = new FormData();

    formData.append("ar[name]", payload.info.ar_name);
    formData.append("ar[description]", payload.info.ar_description);
    formData.append("en[name]", payload.info.en_name);
    formData.append("en[description]", payload.info.en_description);

    if (payload.img !== null) {
      formData.append("image", payload.img);
    }
    axios.put(`${apiUrl}/categories/${id}`, formData, {}).then(res => {
      if (res.status === 200) {
        commit("successUpdateCategory", res.data.data);
      }
    });
  },

  deleteCategory({ commit, dispatch }, payload) {
    const id = payload.id;
    axios.delete(`${apiUrl}/categories/${id}`).then(res => {
      if (res.status === 200) {
        commit("deleteCategory", res);
      }
    });
  },
  categoryActivate({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();

    formData.append("active", payload.active);
    axios
      .put(
        `${apiUrl}/categories/${id}`,
        {
          active: payload.active
        },
        {}
      )
      .then(res => {
        if (res.status === 200) {
          commit("activeCategory", res);
        }
      });
  },
  // $$$$$$$$$$$$ category metadata $$$$$$$$$$
  getCategoryMetadata: async ({ commit }, payload) => {
    const id = payload.id;
    commit("setProcessing", false);

    await axios
      .get(`${apiUrl}/categories/metadata/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getCategorymetadata", res.data.data);
      });
  },
  createCategoryMetadata({ commit, dispatch }, payload) {
    const id = payload.id;
    axios
      .post(
        `${apiUrl}/categories/metadata/${id}`,
        {
          en: { meta_content: payload.en_content },
          ar: { meta_content: payload.ar_content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          dispatch("getCategoryMetadata", { id });
          commit("create_category_meta_success", res);
        }
      });
  },
  updateCategoryMeta({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.id;
    axios
      .put(
        `${apiUrl}/categories/metadata/${id}/${metadata_id}`,
        {
          en: { meta_content: payload.en_content },
          ar: { meta_content: payload.ar_content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch("getCategoryMetadata", { id });
          commit("updateCategoryMetaSuccess", res);
        }
      });
  },
  deleteCategoryMetadata: async ({ commit, dispatch }, payload) => {
    await axios.delete(`${apiUrl}/categories/metadata/${id}`).then(res => {
      dispatch("getCategoryMetadata", { id });
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
