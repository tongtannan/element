import chartLine from './src/chartLine'

/* istanbul ignore next */
chartLine.install = function(Vue) {
  Vue.component(chartLine.name, chartLine)
}

export default chartLine
