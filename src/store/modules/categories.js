import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";

const state = {
  isLoadCategories: true,
  paginations: null,
  categories: null,
  updatedSuccessfuly: false,
  Error: "",
  category: null,
  successDeleteCategory: null
};

const getters = {
  isLoadCategories: state => state.isLoadCategories,
  cateError: state => state.Error,
  cate_paginations: state => state.paginations,
  categories: state => state.categories,
  category: state => state.category,

  updatedCategorySuccessfuly: state => state.updatedSuccessfuly,
  _successDeleteCategory: state => state.successDeleteCategory
};

const mutations = {
  getCategoriesStarted(state) {
    state.isLoadCategories = true;
    state.categories = [];
  },
  getCategoriesSuccess(state, categories) {
    state.isLoadCategories = false;
    state.categories = categories.data;
    state.paginations = categories;
  },
  getCategorySuccess(state, data) {
    state.category = data.data;
  },
  updatedCategorySuccessfuly(state) {
    state.updated_Successfuly = true;
  },
  getCategoriesError(state, error) {
    state.isLoadCategories = false;
    state.Error = error;
    state.categories = null;
  },
  deleteCategory(state, payload) {
    state.successDeleteCategory = payload;
  }
};

const actions = {
  getCategories({ commit }, payload) {
    commit("getCategoriesStarted");

    axios
      .get(`${apiUrl}/categories`, {
        params: {
          order_dir: payload.dir,
          title: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          page: payload.page
        }
      })
      .then(res => {
        if (res.status) {
          console.log(res);
          commit("getCategoriesSuccess", res.data);
        } else {
          commit("getCategoriesError", "error:getCategories");
        }
      });
  },
  getCategory({ commit, dispatch }, payload) {
    const id = payload.id;
    axios.get(`${apiUrl}/categories/${id}`).then(res => {
      commit("getCategorySuccess", res.data);
    });
  },
  updateCategories({ commit }, payload) {
    const id = payload.id;
    axios
      .put(
        `${apiUrl}/categories/${id}`,
        {
          key: payload.key,
          value: payload.value
        },
        {}
      )
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          commit("updatedCategorySuccessfuly");
        }
      });
  },
  createCategory({ commit, dispatch }, payload) {
    console.log(payload);
    const formData = new FormData();

    formData.append("ar[title]", payload.info.ar_title);
    formData.append("ar[description]", payload.info.ar_description);
    formData.append("en[title]", payload.info.en_title);
    formData.append("en[description]", payload.info.en_description);

    if (payload.img !== null) {
      formData.append("image", payload.img);
    }
    axios.post(`${apiUrl}/categories`, formData, {}).then(res => {
      console.log(res);
    });
  },
  updateCategory({ commit, dispatch }, payload) {
    const id = payload.id;
    console.log(payload);
    const formData = new FormData();

    formData.append("ar[title]", payload.info.ar_title);
    formData.append("ar[description]", payload.info.ar_description);
    formData.append("en[title]", payload.info.en_title);
    formData.append("en[description]", payload.info.en_description);

    if (payload.img !== null) {
      formData.append("image", payload.img);
    }
    axios.put(`${apiUrl}/categories/${id}`, formData, {}).then(res => {
      console.log(res);
    });
  },

  deleteCategory({ commit, dispatch }, payload) {
    const id = payload.Id;
    axios.delete(`${apiUrl}/categories/${id}`).then(res => {
      if (res.status === 200) {
        commit("deleteCategory", res);
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
