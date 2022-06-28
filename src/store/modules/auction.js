import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";
import router from "../../router";
import { adminRoot } from "../../constants/config";

const state = {
  isLoadAuctions: true,
  paginations: null,
  auctions: null,
  created_Successfuly: null,
  updated_Successfuly: null,
  Error: "",
  auction: null,
  successDeleteAuction: null,
  processing: false,
  cities: null,
  auctionSide: null,
  areas: null,
  File_List: null,
  create_File: null,
  delete_File: null,
  Image_List: null,
  create_Image: null,
  delete_Image: null,
  date_error: false
};

const getters = {
  isLoadAuctions: state => state.isLoadAuctions,
  auctionError: state => state.Error,
  auction_paginations: state => state.paginations,
  auctions: state => state.auctions,
  _cities: state => state.cities,
  _File_List: state => state.File_List,
  _createAuctionFile: state => state.create_File,
  _deleteAuctionFile: state => state.delete_File,
  _Image_List: state => state.Image_List,
  _createAuctionImage: state => state.create_Image,
  _deleteAuctionImage: state => state.delete_Image,
  _areas: state => state.areas,
  _auctionSide: state => state.auctionSide,
  auction: state => state.auction,
  _isLoadAuctions: state => state.processing,
  _updatedAuctionSuccessfuly: state => state.updated_Successfuly,
  _createAuctionSuccessfuly: state => state.created_Successfuly,
  _successDeleteAuction: state => state.successDeleteAuction,
  _dateError: state => state.date_error
};

const mutations = {
  getAuctionsSuccess(state, auctions) {
    state.auctions = auctions.data;
    state.paginations = auctions;
  },
  setProcessing(state, payload) {
    state.processing = payload;
  },
  getAuctionSuccess(state, data) {
    state.auction = data.data;
  },
  updatedAuctionSuccessfuly(state, data) {
    state.updated_Successfuly = data;
  },
  createAuctionSuccessfuly(state, data) {
    state.created_Successfuly = data;
  },
  getAuctionsError(state, error) {
    state.Error = error;
    state.auctions = null;
  },
  deleteAuction(state, payload) {
    state.successDeleteAuction = payload;
  },
  getCities(state, payload) {
    state.cities = payload;
  },
  getAreas(state, payload) {
    state.areas = payload;
  },

  getAuctionSide(state, payload) {
    state.auctionSide = payload;
  },
  getAuctionFileList(state, payload) {
    state.File_List = payload;
  },
  createAuctionFile(state, payload) {
    state.create_File = payload;
  },
  deleteAuctionFile(state, payload) {
    state.delete_File = payload;
  },
  getAuctionImageList(state, payload) {
    state.Image_List = payload;
  },
  createAuctionImage(state, payload) {
    state.create_Image = payload;
  },
  deleteAuctionImage(state, payload) {
    state.delete_Image = payload;
  },
  dateError(state, payload) {
    state.date_error = !state.date_error;
  }
};

const actions = {
  getAuctions: async ({ commit }, payload) => {
    commit("setProcessing", payload.sorting ? payload.sorting : false);

    await axios
      .get(`${apiUrl}/auctions`, {
        params: {
          order_dir: payload.dir,
          keyword: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          page: payload.page
        }
      })
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getAuctionsSuccess", res.data);
        } else {
          commit("getAuctionsError", "error:getAuctions");
        }
      });
  },
  getAuction({ commit, dispatch }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    axios
      .get(`${apiUrl}/auctions/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getAuctionSuccess", res.data);
      });
  },
  createAuction({ commit, dispatch }, payload) {
    const formData = new FormData();
    payload.langs.forEach(el => {
      formData.append(`${el._name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });

    if (payload.brochure != null) {
      formData.append("brochure", payload.brochure);
    }
    if (payload.image != null) {
      formData.append("image", payload.image);
    }
    if (payload.terms_conditions != null) {
      formData.append("terms_conditions", payload.terms_conditions);
    }
    axios
      .post(`${apiUrl}/auctions`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("createAuctionSuccessfuly", res);
        } else {
        }
      })
      .catch(error => {
        commit("dateError");
      });
  },
  updateAuction({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    payload.langs.forEach(el => {
      formData.append(`${el._name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el._name}[description]`, el.description);
      }
    });
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      if (value != null) {
        formData.append(key, value);
      }
    });
    if (payload.brochure != null) {
      formData.append("brochure", payload.brochure);
    }
    if (payload.image != null) {
      formData.append("image", payload.image);
    }
    if (payload.terms_conditions != null) {
      formData.append("terms_conditions", payload.terms_conditions);
    }

    formData.append("_method", "PUT");
    axios.post(`${apiUrl}/auctions/${id}`, formData, {}).then(res => {
      if (res.status === 200) {
        commit("updatedAuctionSuccessfuly", res);
      }
    });
  },
  deleteAuction({ commit, dispatch }, payload) {
    const id = payload.Id;
    axios.delete(`${apiUrl}/auctions/${id}`).then(res => {
      if (res.status === 200) {
        commit("deleteAuction", res);
      }
    });
  },
  getAuctionSide({ commit, dispatch }, payload) {
    axios.get(`${apiUrl}/auctions/sides`).then(res => {
      if (res.status === 200) {
        commit("getAuctionSide", res.data.data);
      }
    });
  },
  getCities({ commit, dispatch }, payload) {
    const country_id = payload.country_id;
    axios
      .get(`${apiUrl}/cities`, {
        params: {
          country_id: country_id
        }
      })
      .then(res => {
        if (res.status === 200) {
          commit("getCities", res.data.data);
        }
      })
      .catch(err => {});
  },
  getAreas({ commit, dispatch }, payload) {
    const city_id = payload.city_id;
    axios
      .get(`${apiUrl}/areas`, {
        params: {
          city_id: city_id
        }
      })
      .then(res => {
        if (res.status === 200) {
          commit("getAreas", res.data.data);
        }
      })
      .catch(err => {});
  },
  getAuctionFiles({ commit, dispatch }, payload) {
    commit("setProcessing", false);
    const id = payload.id;
    axios
      .get(`${apiUrl}/auctions/files/${id}`)
      .then(res => {
        commit("setProcessing", true);
        // commit("getAuctionFileList", res.data.data);
        return res;
      })
      .then(res => {
        commit("getAuctionFileList", res.data.data);
      })
      .catch(err => {});
  },
  createAuctionFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    formData.append("path", payload.path);
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    axios
      .post(`${apiUrl}/auctions/files/${id}`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("createAuctionFile", res.data.data);
          dispatch("getAuctionFiles", { id });
        }
      })
      .catch(err => {});
  },
  deleteAuctionFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const fileId = payload.fileId;
    axios
      .delete(`${apiUrl}/auctions/files/${id}/${fileId}`)
      .then(res => {
        if (res.status === 200) {
          commit("deleteAuctionFile", res.data.data);
          dispatch("getAuctionFiles", { id });
        }
      })
      .catch(err => {});
  },
  // &&&&&&&&&&&&&&&&&& IMAGES &&&&&&&&&&&&&
  getAuctionImages({ commit, dispatch }, payload) {
    commit("setProcessing", false);
    const id = payload.id;
    axios
      .get(`${apiUrl}/auctions/images/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getAuctionImageList", res.data.data);
      })
      .catch(err => {});
  },
  createAuctionImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    formData.append("path", payload.path);
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      if (el.description) {
        formData.append(`${el.name}[description]`, el.description);
      }
    });
    axios
      .post(`${apiUrl}/auctions/images/${id}`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("createAuctionImage", res.data.data);
          dispatch("getAuctionImages", { id });
        }
      })
      .catch(err => {});
  },
  deleteAuctionImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const imgId = payload.imgId;
    axios
      .delete(`${apiUrl}/auctions/images/${id}/${imgId}`)
      .then(res => {
        if (res.status === 200) {
          commit("deleteAuctionImage", res.data.data);
          dispatch("getAuctionImages", { id });
        }
      })
      .catch(err => {});
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
