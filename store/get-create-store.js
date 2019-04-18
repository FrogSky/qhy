import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function getCreateStore(modules = {}, rootStore = {}) {
  Object.keys(modules).forEach(k => {
    modules[k].namespaced = true;
  });

  return () => new Vuex.Store({
    ...rootStore,
    modules
  })
}

export function getCreatRootStore (store = {}) {
  return () => new Vuex.Store({ ...store })
}