import axios from "../../plugins/axios";
import firebase from "firebase/app";
import "firebase/auth";
import { currentUser, isAuthGuardActive } from "../../constants/config";
import router from "../../router";
import {
  setCurrentUser,
  getAccessToken,
  setTokens,
  getCurrentUser,
  getCurrentLanguage
} from "../../utils";
import { adminRoot } from "../../constants/config";
import { apiUrl, Headers, locale } from "../../constants/config";
export default {
  state: {
    currentUser: isAuthGuardActive ? getCurrentUser() : currentUser,
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    usersList: null,
    ListActions: null,
    UserInfo: null,
    resetPasswordSuccess: null
  },
  getters: {
    currentUser: state => state.currentUser,
    ListActions: state => state.ListActions,
    UserInfo: state => state.UserInfo,
    usersList: state => state.usersList,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload;
      state.processing = false;
      state.loginError = null;
    },
    setUserInfo(state, payload) {
      state.UserInfo = payload;
      state.processing = false;
    },
    setUsersList(state, payload) {
      state.usersList = payload.data;
      state.ListActions = payload;
      state.processing = false;
    },
    setLogout(state) {
      state.currentUser = null;
      state.processing = false;
      state.loginError = null;
    },
    setProcessing(state, payload) {
      state.processing = payload;
      state.loginError = null;
    },
    setError(state, payload) {
      state.loginError = payload;
      state.currentUser = null;
      state.processing = false;
    },
    setForgotMailSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.forgotMailSuccess = true;
    },
    setResetPasswordSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.resetPasswordSuccess = true;
    },
    clearError(state) {
      state.loginError = null;
    }
  },
  actions: {
    login({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      axios
        .post(`${apiUrl}/auth`, {
          email: payload.email,
          password: payload.password
        })
        .then(
          res => {
            let refreshToken = res.data.refresh_token;
            let accessToken = res.data.access_token;
            setTokens(accessToken, refreshToken);

            if (res.status) {
              axios.get(`${apiUrl}/auth/user`).then(res => {
                if (res.status) {
                  setCurrentUser(res.data.data);
                  commit("setUser", res.data.data);
                } else {
                  commit("getItemError", "error:getItem");
                }
              });
            }
          },
          err => {
            setCurrentUser(null);
            commit("setError", err.message);
            setTimeout(() => {
              commit("clearError");
            }, 3000);
          }
        );
    },
    getUsersList({ commit }, payload) {
      commit("setProcessing", true);
      axios
        .get(`${apiUrl}/users`, {
          params: {
            role: payload.role,
            order_dir: payload.dir,
            first_name: payload.search,
            order_by: payload.order_by,
            limit: payload.limit,
            page: payload.page
          }
        })
        .then(res => {
          console.log(res);
          commit("setUsersList", res.data);
        });
    },
    // changePreferLocale(locale) {
    //   console.log("time out is running");

    //   axios
    //     .put(`${apiUrl}/users/prefer_locale`, {
    //       prefer_locale: locale
    //     }).then(() => {
    //         console.log("done");
    //       },
    //       _error => {}
    //     );
    // },
    resetPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      axios
        .post(`${apiUrl}/auth/password/forgot`, {
          token: payload.token,
          email: payload.email,
          password: payload.newPassword,
          password_confirmation: payload.password_confirmation
        })
        .then(
          res => {
            console.log(res);
            commit("clearError");
            commit("setResetPasswordSuccess");
          },
          err => {
            commit("setError", err.message);
            setTimeout(() => {
              commit("clearError");
            }, 3000);
          }
        );
    },
    getUserInfo({ commit }, payload) {
      const userId = payload.id;
      commit("clearError");
      commit("setProcessing", true);
      commit("setUserInfo", null);
      axios
        .get(`${apiUrl}/users`, {
          params: {
            id: userId
          }
        })
        .then(res => {
          console.log(res.data.data[0]);
          commit("setUserInfo", res.data.data[0]);
        });
    },
    updateUserProfile({ commit }, payload) {
      console.log("from state", payload);
      const formData = new FormData();
      formData.append("first_name", payload.user.first_name);
      formData.append("last_name", payload.user.last_name);

      formData.append("phone_number", payload.user.phone_number);

      formData.append("dob", payload.user.dob);

      formData.append("email", payload.user.email);

      formData.append("gender", payload.user.gender);

      formData.append("image", payload.file);

      axios.put(`${apiUrl}/auth`, { formData }).then(res => {
        if (res.status === 200) {
          setCurrentUser(res.data.data);
          router.push(adminRoot);
        }
      });
    },
    updateUserInfo({ commit }, payload) {
      commit("clearError");
      console.log("this is payload of update user info", payload);
      const formData = new FormData();
      // formData.append("first_name", payload.info.firstname);
      // formData.append("last_name", payload.info.lastname);

      // formData.append("phone_number", payload.info.phonenumber);

      // formData.append("email", payload.info.email);

      formData.append("role", payload.info.role);
      const id = payload.id;
      axios
        .put(
          `${apiUrl}/users/${id}`,
          {
            first_name: payload.info.firstname,
            last_name: payload.info.lastname,
            phone_number: payload.info.phonenumber,
            email: payload.info.email,
            role: payload.info.role,
            active: payload.info.active
          },
          {}
        )
        .then(res => {
          console.log(res);
        });
    },
    forgotPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      axios
        .post(`${apiUrl}/auth/password/forgot`, {
          email: payload.email
        })
        .then(
          res => {
            console.log(res);
            commit("clearError");
            commit("setForgotMailSuccess");
          },
          err => {
            commit("setError", err.message);
            setTimeout(() => {
              commit("clearError");
            }, 3000);
          }
        );
    },
    signOut({ commit }) {
      axios.post(`${apiUrl}/auth/logout`).then(
        res => {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("currentUser");
          sessionStorage.removeItem("refreshToken");
          router.push("/");
          commit("setLogout");
        },
        _error => {
          console.log("i am error");
        }
      );
    },
    refreshToken() {
      axios
        .post(`${apiUrl}/auth/refresh_token`, {
          refresh_token: sessionStorage.getItem("refreshToken")
        })
        .then(
          res => {
            let refreshToken = res.data.refresh_token;
            let accessToken = res.data.access_token;
            setTokens(accessToken, refreshToken);
          },
          _error => {
            router.push("/");
            sessionStorage.clear();
          }
        );
    }
  }
};
