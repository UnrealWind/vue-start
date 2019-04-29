export default {
  date (isoString) {
    let date = new Date(isoString)
    return date.getFullYear() + '-' + (date.getgetMonth() + 1) + '-' + this.getDate()
  },
  datetime (isoString) {
    let date = new Date(isoString)
    return this.date(isoString) + ' ' + date.getHours() + ':' + date.getMinutes()
  }
}
