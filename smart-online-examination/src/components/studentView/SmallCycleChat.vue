<template>
  <div class="flex justify-center items-center">
    <apexchart
      width="70"
      height="70"
      type="donut"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'DonutScoreChart',
  components: { apexchart: VueApexCharts },
  props: {
    score: {
      type: Number,
      required: true
    }
  },
  computed: {
    chartOptions() {
      const alpha = 0.3 + (this.score / 100) * 0.7
      const greenColor = `rgba(40, 199, 111, ${alpha.toFixed(2)})`
      const grayColor = '#e0e0e0'

      return {
        chart: { type: 'donut' },
        dataLabels: { enabled: false },
        stroke: { width: 0 },
        plotOptions: {
          pie: {
            donut: {
              size: '75%',
              labels: {
                show: true,
                name: { show: false },
                value: {
                  show: true,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#5E5873',
                  formatter: () => `${this.score}%`
                },
                total: {
                  show: true,
                  label: '',
                  fontSize: '10px',
                  fontWeight: 400,
                  color: '#6E6B7B',
                  formatter: () => `${this.score}%`
                }
              }
            }
          }
        },
        labels: ['Score', 'Remaining'],
        legend: { show: false },
        tooltip: { enabled: false },
        colors: [greenColor, grayColor]
      }
    },
    series() {
      return [this.score, 100 - this.score]
    }
  }
}
</script>
