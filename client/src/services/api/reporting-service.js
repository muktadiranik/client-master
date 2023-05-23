import axios from 'axios'

const RESOURCE = 'reporting'
const ReportingService = {
  createReportTemplate(reportTemplate) {
    return axios.post(`${RESOURCE}/templates/`, reportTemplate)
  },
  editReportTemplate(templateUuid, template) {
    return axios.put(`${RESOURCE}/templates/${templateUuid}/`, template)
  },
  getReportTemplateList(query) {
    let params = new URLSearchParams([['page', query.page]])
    if (query.programUuid) {
      params.append('program_uuid', query.programUuid)
    }
    if (query.all) {
      params.append('include_all', query.all)
    }
    return axios.get(`${RESOURCE}/templates/list/`, { params: params })
  },
  getReportTemplate(templateUuid) {
    return axios.get(`${RESOURCE}/templates/${templateUuid}/`)
  },
  generateReport(report) {
    return axios.post(`${RESOURCE}/generate/`, report, {
      responseType: 'arraybuffer',
    })
  },
  downloadReport(data) {
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'report.pdf')
    document.body.appendChild(link)
    link.click()
  },
}

export default ReportingService
