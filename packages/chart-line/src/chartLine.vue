<template>
  <div class="el-chart-line"></div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
// 引入line
require('echarts/lib/chart/line')
let chartLine
export default {
  name: 'ElChartLine',
  props: ['item', 'map1', 'map2'],
  methods: {
    init() {
      new Promise(resolve => {
        chartLine && chartLine.clear()
        resolve()
      }).then(() => {
        chartLine = echarts.init(this.$el)
        const { item, map1, map2 } = this
        const option = {
          legend: {
            show: false
          },
          grid: {
            left: '2%',
            top: '16%',
            bottom: '2%',
            right: '5%',
            containLabel: true
          },
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          xAxis: [
            {
              type: 'category',
              axisLine: { show: true, lineStyle: { color: '#6173A3' } },
              axisLabel: {
                textStyle: {
                  color: 'rgb(167,245,254)',
                  fontSize: 12
                },
                interval: 1
              },
              axisTick: { show: false },
              data: item.time
            }
          ],
          yAxis: [
            {
              axisTick: { show: false },
              splitLine: {
                show: true,
                lineStyle: { color: 'rgb(0,246,255,0.2)' }
              },
              axisLabel: {
                textStyle: {
                  color: 'rgb(167,245,254)',
                  fontSize: 14
                }
              },
              splitNumber: 5,
              axisLine: { show: true, lineStyle: { color: '#6173A3' } }
            }
          ],
          series: [
            {
              name: map1.name,
              type: 'line',
              symbol: 'circle',
              symbolSize: 4,
              itemStyle: {
                color: '#10D7FB'
              },
              lineStyle: {
                color: '#10D7FB'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(16,215,251,0.6)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(16,215,251,0.1)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              },
              data: item[map1.key]
            },
            {
              name: map2.name,
              type: 'line',
              symbol: 'circle',
              symbolSize: 4,
              itemStyle: {
                color: '#FFA421'
              },
              lineStyle: {
                color: '#FFA421'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(255,164,33,0.6)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(255,164,33,0.1)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              },
              data: item[map2.key]
            }
          ]
        }
        chartLine.setOption(option)
      })
    }
  }
}
</script>