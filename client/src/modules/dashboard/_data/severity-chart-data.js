import TextFilters from '@/filters/text-filters'
const priorities = ['critical', 'high', 'medium', 'low', 'info']

export const getSeverityChartData = stats => {
  let labels = []
  let dataValues = []
  for (let [key, value] of Object.entries(stats).filter(([k, v]) => priorities.includes(k) && v > 0)) {
    if (value > 0) {
      labels.push(TextFilters.titleCase(key))
      dataValues.push(value)
    }
  }

  return {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Severity Chart',
          data: dataValues,
          backgroundColor: ['#D0021B', '#FF4E17', '#ffc107', '#f8e71c', '#33B42D'],
          weight: 10,
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
    },
  }
}

export default getSeverityChartData
