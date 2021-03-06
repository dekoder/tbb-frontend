import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const state = {
  user: null
};

const actions = {
  login({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit("authRequest");
      axios
        .post("/auth/login/", params)
        .then(response => {
          if (response.data.authenticated === true) {
            commit("authSuccess", response.data);
            resolve(response);
          } else {
            window.location.href = response.data.redirect;
          }
        })
        .catch(err => {
          commit("authError", err);
          reject(err);
        });
    });
  },
  logout({ commit }) {
    return new Promise(resolve => {
      axios.put(`/auth/logout/`).then(response => {
        commit("logout");
        resolve(response);
      });
    });
  },
  refresh({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/auth/me`)
        .then(response => {
          console.log("Session refresh success");
          commit("authSuccess", response.data);
          resolve(response);
        })
        .catch(error => {
          console.log("Session refresh fail");
          reject(error);
        });
    });
  }
};

const mutations = {
  authRequest(state) {
    state.user = null;
  },
  authSuccess(state, data) {
    state.user = data;
  },
  authError(state, error) {
    console.log(error);
    state.user = null;
  },
  logout(state) {
    state.user = null;
  }
};

const getters = {
  isAuthenticated: state => !!state.user,
  tokenSubject: state => state.user.user
};

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
});

export default store;
