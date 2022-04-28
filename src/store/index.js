import Vue from "vue";
import Vuex from "vuex";

import app from "../main";
import menu from "./modules/menu";
import block from "./modules/block";
import user from "./modules/user";
import pages from "./modules/pages";
import test from "./modules/test";
import settings from "./modules/settings";
import { setCurrentLanguage } from "../utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    changeLang(state, payload) {
      app.$i18n.locale = payload;
      setCurrentLanguage(payload);
    }
  },
  actions: {
    setLang({ commit }, payload) {
      commit("changeLang", payload);
    }
  },
  modules: {
    menu,
    user,
    block,
    test,
    settings,
    pages
  }
});
