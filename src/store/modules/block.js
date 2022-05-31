import axios from "../../plugins/axios";
import { apiUrl } from "../../constants/config";

const state = {
  blocks: null,
  _paginations: null,
  block: null,
  blockCategories: null,
  _Error: "",
  isLoadBlock: true,
  blockImageList: null,
  successAddBlockImage: null,
  blockMetaList: null,
  updateMetaBlock: null,
  metaTypeList: null,
  blockFileList: null,
  successAddBlockFile: null,
  blockVideosList: null,
  successAddBlockVideo: null,
  blockYoutubeVideosList: null,
  successAddBlockYoutubeVideo: null,
  successDeleteBlock: null,
  category_paginate: null,
  UpdateBlockCategory: null,
  processing: false,
  Block_Categories: null,
  blockCategory: null,
  create_block_category_success: null,
  blockCategorymetadata: null,
  blockCategoryTypes: null,
  updateBlockBasicData: null,
  successUpdateBlockCategoryMeta: null,
  create_block_category_meta_success: null,
  errorAddBlockVideo: null,
  wrongYoutubeurl: null
};

const getters = {
  // general
  _blockError: state => state._Error,
  _blockPaginations: state => state._paginations,
  _blocks: state => state.blocks,
  _isBLoadAttach: state => state.processing,
  _isLoadBlockMeta: state => state.processing,
  _updateBlockBasicData: state => state.updateBlockBasicData,
  _block: state => state.block,
  _Block_Categories: state => state.Block_Categories,
  _blockCategories: state => state.blockCategories,
  _block_category_paginate: state => state.category_paginate,
  _successDeleteBlock: state => state.successDeleteBlock,
  _isLoadBlock: state => state.processing,
  _successUpdateBlockCategory: state => state.UpdateBlockCategory,
  _blockCategory: state => state.blockCategory,
  _create_block_category_success: state => state.create_block_category_success,
  _blockCategoryTypes: state => state.blockCategoryTypes,
  // images
  _blockImageList: state => state.blockImageList,
  _successAddBlockImage: state => state.successAddBlockImage,
  // meta
  _blockMetaList: state => state.blockMetaList,
  _updateMetaBlock: state => state.updateMetaBlock,
  _blockMetaTypeList: state => state.metaTypeList,
  // file
  _blockFileList: state => state.blockFileList,
  _sccussCreateBlockFile: state => state.successAddBlockFile,
  // videos
  _blockVideosList: state => state.blockVideosList,
  _successAddBlockVideo: state => state.successAddBlockVideo,
  _errorAddBlockVideo: state => state.errorAddBlockVideo,
  // youtube
  _blockYoutubeVideosList: state => state.blockYoutubeVideosList,
  _successAddBlockYoutubeVideo: state => state.successAddBlockYoutubeVideo,
  _BwrongYoutubeurl: state => state.wrongYoutubeurl,
  // block category metaData
  _blockCategoryMeta: state => state.blockCategorymetadata,
  _isLoadBlockCategoryMeta: state => state.processing,
  _updateblockCategoryMetaSuccess: state =>
    state.successUpdateBlockCategoryMeta,
  _create_block_category_meta_success: state =>
    state.create_block_category_meta_success
};

const mutations = {
  //  general
  getBlocksSuccess(state, blocks) {
    state.blocks = blocks.data;
  },
  getPaginationsSuccess(state, data) {
    state._paginations = data;
  },
  setProcessing(state, payload) {
    state.processing = payload;
  },
  updateBlockBasicData(state, payload) {
    state.updateBlockBasicData = payload;
  },
  getBlockSuccess(state, block) {
    state.block = block;
  },
  getBlockError(state, error) {
    state._Error = error;
    state.blocks = null;
    state.block = null;
  },
  get_BlockCategories(state, payload) {
    state.blockCategories = payload.data;
    state.category_paginate = payload;
  },
  // image
  getBlockImageListStarted(state, payload) {
    state.blockImageList = null;
  },
  getBlockImageList(state, payload) {
    state.blockImageList = payload.data;
  },
  successAddBlockImage(state, payload) {
    state.successAddBlockImage = payload;
  },
  deleteBlock(state, payload) {
    state.successDeleteBlock = payload;
  },

  // metaData
  getBlockMetaList(state, payload) {
    state.blockMetaList = payload.data;
  },
  updateMetaBlockSuccess(state, payload) {
    state.updateMetaBlock = payload.data;
  },
  getMetaTypeList(state, payload) {
    state.metaTypeList = payload.data;
  },

  // files
  getBlockFileListStarted(state, payload) {
    state.blockFileList = null;
  },
  getBlockFileList(state, payload) {
    state.blockFileList = payload.data;
  },
  successAddBlockFile(state, payload) {
    state.successAddBlockFile = payload;
  },
  /* videos */
  getBlockVideosListStarted(state, payload) {
    state.blockVideosList = null;
  },
  getBlockVideosList(state, payload) {
    state.blockVideosList = payload.data;
  },
  successAddBlockVideo(state, payload) {
    state.successAddBlockVideo = payload;
  },
  errorAddBlockVideo(state, payload) {
    state.errorAddBlockVideo = payload;
  },
  /* youtube */
  getBlockYoutubeVideosListStarted(state, payload) {
    state.blockYoutubeVideosList = null;
  },
  getBlockYoutubeVideosList(state, payload) {
    state.blockYoutubeVideosList = payload.data;
  },
  successAddBlockYoutubeVideo(state, payload) {
    state.successAddBlockYoutubeVideo = payload;
  },
  successUpdateBlockCategory(state, payload) {
    state.UpdateBlockCategory = payload;
  },
  getBlockCategory(state, payload) {
    state.blockCategory = payload;
  },
  create_block_category_success(state, payload) {
    state.create_block_category_success = payload;
  },
  getBlockCategoryTypes(state, payload) {
    state.blockCategoryTypes = payload;
  },
  wrongYoutubeurl(state, payload) {
    state.wrongYoutubeurl = payload;
  },
  // category metaData
  updateblockCategoryMetaSuccess(state, payload) {
    state.successUpdateBlockCategoryMeta = payload;
  },
  getBlockCategorymetadata(state, payload) {
    state.blockCategorymetadata = payload;
  },
  create_block_category_meta_success(state, payload) {
    state.create_block_category_meta_success = payload;
  },
  delete_block_category_meta_success(state, payload) {
    state.delete_block_category_meta_success = payload;
  },
  get_Block_Categories(state, data) {
    state.Block_Categories = data.data;
  }
};

const actions = {
  // -------------------- general block ---------------------
  getBlocksList: async ({ commit }, payload) => {
    commit("setProcessing", payload.sorting ? payload.sorting : false);
    await axios
      .get(`${apiUrl}/blocks`, {
        params: {
          order_dir: payload.dir,
          keyword: payload.search,
          order_by: payload.order_by,
          limit: payload.limit,
          block_category_id: payload.block_category_id,
          page: payload.page
        }
      })
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getBlocksSuccess", res.data);
          commit("getPaginationsSuccess", res.data);
        }
      })
      .catch(error => {
        console.log("hi from catch", error);
        commit("getBlockError", error);
      });
  },

  getBlock({ commit }, payload) {
    const blockId = payload.id;
    axios
      .get(`${apiUrl}/blocks/${blockId}/slug`)
      .then(res => res.data)
      .then(res => {
        if (res.status) {
          commit("getBlockSuccess", res.data);
        }
      })
      .catch(error => {
        console.log("hi from catch", error);
        commit("getBlockError", error);
      });
  },
  updateBlockData({ commit, dispatch }, payload) {
    console.log(payload.data.post_date);
    const id = payload.id;

    const formData = new FormData();
    formData.append("block_category_id", payload.data.block_category_id.id);
    formData.append("url", payload.data.url);
    formData.append("post_date", payload.post_date);
    formData.append("visible", payload.data.visible);

    if (payload.data.locales.ar) {
      formData.append("ar[name]", payload.data.locales.ar.name);
      formData.append("ar[description]", payload.data.locales.ar.description);
    }
    if (payload.data.locales.en) {
      formData.append("en[name]", payload.data.locales.en.name);
      formData.append("en[description]", payload.data.locales.en.description);
    }
    if (payload.file !== null) {
      formData.append("file", payload.file);
    }
    if (payload.image !== null) {
      formData.append("image", payload.image);
    }
    formData.append("_method", "PUT");
    axios.post(`${apiUrl}/blocks/${id}`, formData, {}).then(res => {
      if (res.status === 200) {
        dispatch("getBlock", { id });
        commit("updateBlockBasicData", res);
      }
    });
  },
  deleteBlock({ commit, dispatch }, payload) {
    const id = payload.blockId;
    axios.delete(`${apiUrl}/blocks/${id}`).then(res => {
      if (res.status === 200) {
        commit("deleteBlock", res);
      }
    });
  },
  // -------------------- general block ---------------------

  // -------------------------- block images ------------------------------
  getBlockImageList({ commit }, payload) {
    commit("getBlockImageListStarted");
    const id = payload.id;
    axios.get(`${apiUrl}/blocks/images/${id}`).then(res => {
      commit("getBlockImageList", res.data);
    });
  },
  createBlockImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    if (payload.image) {
      formData.append("path", payload.image);
    }
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      formData.append(`${el.name}[description]`, el.description);
    });
    axios.post(`${apiUrl}/blocks/images/${id}`, formData, {}).then(res => {
      if (res.status === 201) {
        commit("successAddBlockImage", res.data.data);
        dispatch("getBlockImageList", { id });
      }
    });
  },
  deleteBlockImage({ commit, dispatch }, payload) {
    const id = payload.id;
    const attachment_id = payload.attachment_id;
    axios.delete(`${apiUrl}/blocks/images/${id}/${attachment_id}`).then(res => {
      if (res.status === 200) {
        dispatch("getBlockImageList", { id });
      }
    });
  },
  // -------------------------- block images ------------------------------

  // --------------------files---------------------------
  getBlockFileList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    axios
      .get(`${apiUrl}/blocks/files/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockFileList", res.data);
      });
  },
  createBlockFile({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    if (payload.file) {
      formData.append("path", payload.file);
    }
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      formData.append(`${el.name}[description]`, el.description);
    });
    axios.post(`${apiUrl}/blocks/files/${id}`, formData, {}).then(res => {
      if (res.status === 201) {
        commit("successAddBlockFile", res.data.data);
        dispatch("getBlockFileList", { id });
      }
    });
  },
  deleteBlockFile({ commit, dispatch }, payload) {
    const id = payload.blockId;
    const attachment_id = payload.file_id;
    axios.delete(`${apiUrl}/blocks/files/${id}/${attachment_id}`).then(res => {
      if (res.status === 200) {
        dispatch("getBlockFileList", { id });
      }
    });
  },
  // --------------------files---------------------------

  // ------------------------- meta data --------------------
  getBlockMetaList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    axios
      .get(`${apiUrl}/blocks/metadata/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockMetaList", res.data);
      });
  },

  createBlockMeta({ commit, dispatch }, payload) {
    const id = payload.blockId;
    axios
      .post(
        `${apiUrl}/blocks/metadata/${id}`,
        {
          en: { meta_content: payload.en_content },
          ar: { meta_content: payload.ar_content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          dispatch("getBlockMetaList", { id });
          commit("updateMetaBlockSuccess", res);
        }
      });
  },
  updateBlockMeta({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.blockId;
    const formData = new FormData();
    axios
      .put(
        `${apiUrl}/blocks/metadata/${id}/${metadata_id}`,
        {
          en: { meta_content: payload.en_content },
          ar: { meta_content: payload.ar_content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch("getBlockMetaList", { id });
          commit("updateMetaBlockSuccess", res);
        }
      });
  },
  deleteBlockMeta({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.blockId;
    axios.delete(`${apiUrl}/blocks/metadata/${id}/${metadata_id}`).then(res => {
      dispatch("getBlockMetaList", { id });
    });
  },
  getMetaTypeList({ commit }, payload) {
    axios.get(`${apiUrl}/metadata/meta-type`).then(res => {
      commit("getMetaTypeList", res.data);
    });
  },
  // ------------------------- meta data --------------------

  // ********************* blocks videos ***************************
  getBlockVideosList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    axios
      .get(`${apiUrl}/blocks/videos/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockVideosList", res.data);
      });
  },
  createBlockVideo({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    if (payload.video) {
      formData.append("path", payload.video);
    }
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      formData.append(`${el.name}[description]`, el.description);
    });
    axios
      .post(`${apiUrl}/blocks/videos/${id}`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("successAddBlockVideo", res.data.data);
          dispatch("getBlockVideosList", { id });
        }
      })
      .catch(err => {
        commit("errorAddBlockVideo", err);
      });
  },
  deleteBlockVideo({ commit, dispatch }, payload) {
    const id = payload.blockId;
    const attachment_id = payload.file_id;
    axios.delete(`${apiUrl}/blocks/videos/${id}/${attachment_id}`).then(res => {
      if (res.status === 200) {
        console.log();
        dispatch("getBlockVideosList", { id });
      }
    });
  },

  // ********************* block videos ***************************
  // ############### youtube ##################
  getBlockYoutubeVideoList({ commit }, payload) {
    commit("setProcessing", false);

    const id = payload.id;
    axios
      .get(`${apiUrl}/blocks/youtube-videos/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockYoutubeVideosList", res.data);
      });
  },
  createBlockYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.id;
    const formData = new FormData();
    payload.info.forEach(el => {
      formData.append(`${el.name}[title]`, el.title);
      formData.append(`${el.name}[description]`, el.description);
    });
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      formData.append(key, value);
    });
    axios
      .post(`${apiUrl}/blocks/youtube-videos/${id}`, formData, {})
      .then(res => {
        if (res.status === 201) {
          commit("successAddBlockYoutubeVideo", res.data.data);
          dispatch("getBlockYoutubeVideoList", { id });
        }
      })
      .catch(err => {
        console.log("this is catch");
        commit("wrongYoutubeurl", err);
      });
  },
  updateBlockYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.id;
    const attachment_id = payload.attachment_id;
    const formData = new FormData();

    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      formData.append(key, value);
    });
    axios
      .put(
        `${apiUrl}/blocks/youtube-videos/${id}/${attachment_id}`,
        payload.info,
        {}
      )
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          commit("successAddBlockYoutubeVideo", res.data.data);
          dispatch("getBlockYoutubeVideoList", { id });
        }
      });
  },
  deleteBlockYoutubeVideo({ commit, dispatch }, payload) {
    const id = payload.blockId;
    const attachment_id = payload.youtube_id;
    axios
      .delete(`${apiUrl}/blocks/youtube-videos/${id}/${attachment_id}`)
      .then(res => {
        if (res.status === 200) {
          console.log();
          dispatch("getBlockYoutubeVideoList", { id });
        }
      });
  },
  // ++++++++++++++++++++ Block Categories Managment +++++++++++++++++++++++
  getBlockCategories: async ({ commit }, payload) => {
    commit("setProcessing", payload.sorting ? payload.sorting : false);
    await axios
      .get(`${apiUrl}/blocks/categories`, {
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
        console.log("hi from categories", res);
        commit("get_BlockCategories", res.data);
      });
  },
  getBlock_Categories: async ({ commit }, payload) => {
    commit("setProcessing", payload.sorting ? payload.sorting : false);
    await axios
      .get(`${apiUrl}/blocks/categories`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        console.log("hi from categories", res);
        commit("get_Block_Categories", res.data);
      });
  },
  getBlockCategory: async ({ commit }, payload) => {
    const id = payload.id;
    commit("setProcessing", false);

    await axios
      .get(`${apiUrl}/blocks/categories/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockCategory", res.data.data);
      });
  },
  createBlockCategory: async ({ commit }, payload) => {
    const formData = new FormData();
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      formData.append(key, value);
    });
    if (payload.image !== null) {
      formData.append("image", payload.image);
    }
    await axios.post(`${apiUrl}/blocks/categories`, formData, {}).then(res => {
      commit("create_block_category_success", res.data.data);
    });
  },
  updateBlockCategory: async ({ commit }, payload) => {
    const id = payload.id;
    const formData = new FormData();
    Object.entries(payload.info).forEach(entry => {
      const [key, value] = entry;
      formData.append(key, value);
    });
    formData.append("_method", "PUT");
    if (payload.image !== null) {
      formData.append("image", payload.image);
    }
    await axios
      .post(`${apiUrl}/blocks/categories/${id}`, formData, {})
      .then(res => {
        commit("successUpdateBlockCategory", res.data.data);
      });
  },
  getBlockCategoryTypes: async ({ commit }, payload) => {
    commit("setProcessing", false);

    await axios
      .get(`${apiUrl}/blocks/categories/types`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        if (res.status === 200) {
          commit("getBlockCategoryTypes", res.data.data);
        }
      });
  },
  // $$$$$$$$$$$$ category metadata $$$$$$$$$$
  getBlockCategoryMetadata: async ({ commit }, payload) => {
    const id = payload.id;
    commit("setProcessing", false);

    await axios
      .get(`${apiUrl}/blocks/categories/metadata/${id}`)
      .then(res => {
        commit("setProcessing", true);
        return res;
      })
      .then(res => {
        commit("getBlockCategorymetadata", res.data.data);
      });
  },
  createBlockCategoryMetadata({ commit, dispatch }, payload) {
    const id = payload.id;
    axios
      .post(
        `${apiUrl}/blocks/categories/metadata/${id}`,
        {
          en: { meta_content: payload.en_content },
          ar: { meta_content: payload.ar_content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          dispatch("getBlockCategoryMetadata", { id });
          commit("create_block_category_meta_success", res);
        }
      });
  },
  updateBlockCategoryMeta({ commit, dispatch }, payload) {
    const metadata_id = payload.metadata_id;
    const id = payload.id;
    axios
      .put(
        `${apiUrl}/blocks/categories/metadata/${id}/${metadata_id}`,
        {
          en: { meta_content: payload.en_content },
          ar: { meta_content: payload.ar_content },
          meta_type_id: payload.meta_type_id
        },
        {}
      )
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          dispatch("getBlockCategoryMetadata", { id });
          commit("updateblockCategoryMetaSuccess", res);
        }
      });
  },
  deleteBlockCategoryMetadata: async ({ commit, dispatch }, payload) => {
    const id = payload.id;
    const metadata_id = payload.metadata_id;

    await axios
      .delete(`${apiUrl}/blocks/categories/metadata/${id}/${metadata_id}`)
      .then(res => {
        dispatch("getBlockCategoryMetadata", { id });
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
