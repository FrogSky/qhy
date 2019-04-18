export default {
  state: {
    // 初始化状态
    name: '...'
  },
  actions: {
    /*
     * Action 类似于 mutation，不同在于：
     *
     * Action 提交的是 mutation，而不是直接变更状态。
     * Action 可以包含任意异步操作。
     *
     * 例子见：https://vuex.vuejs.org/zh/guide/actions.html
     *
     */
    getInfo (context) {
      // 模拟异步请求数据
      setTimeout(() => {
        context.commit('setInfo', { name: '莫导师' });
      }, 1000);
    }
  },
  mutations: {
    /*
     * Mutation 接受 state 作为第一个参数，要注意：
     *
     * Mutation 是更改 Vuex 的 store 中的状态的唯一方法。
     * Mutation 必须是同步函数。
     *
     * 详情见：https://vuex.vuejs.org/zh/guide/mutations.html
     *
     */
    setInfo (state, { name }) {
      state.name = name;
    }
  }
};