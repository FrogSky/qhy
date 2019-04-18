export const state = () => ({
  slides: [],
})

export const mutations = {
  setSlides(state, data) {
    state.slides = data;
  },
}

export const actions = {
  async getBanner({ commit }) {
    let { data } = await this.$axios.$get('/v1/config/banner', {
      params: { type: 'ios' }
    });
    if(data) {
      commit('setSlides', data)
    }
  },
}