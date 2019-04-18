import { getCreatRootStore } from '~/store/get-create-store';

export default getCreatRootStore(
  {
    state: {
	  // 初始化状态
	  foo: 1
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
	  bar (context) {
	    context.commit('bar');
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
	  bar (state) {
  	    console.log('foo value', state.foo++);
      }
	}
  }
)