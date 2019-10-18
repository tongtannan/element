import ElAutoScroll from './src/autoScroll'

/* istanbul ignore next */
ElAutoScroll.install = function(Vue) {
  Vue.component(ElAutoScroll.name, ElAutoScroll)
}

export default ElAutoScroll
