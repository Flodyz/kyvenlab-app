// Fills the version and release date from version.json. Optional: the page works without it,
// and the version parts stay hidden when the file is missing or malformed.
;(function () {
  var MONTHS = {
    'pt-BR': ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }
  var VERSION_PATTERN = /^\d+\.\d+\.\d+$/
  var DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

  function formatDate(iso, lang) {
    var match = DATE_PATTERN.exec(iso)
    if (!match) return null
    var months = MONTHS[lang] || MONTHS.en
    var month = months[Number(match[2]) - 1]
    if (!month) return null
    var day = Number(match[3])
    return lang === 'pt-BR'
      ? day + ' ' + month + ' ' + match[1]
      : month + ' ' + day + ', ' + match[1]
  }

  function show(version, date) {
    var values = { version: version, date: date }
    document.querySelectorAll('[data-version]').forEach(function (el) {
      if (version) el.textContent = version
    })
    document.querySelectorAll('[data-date]').forEach(function (el) {
      if (date) el.textContent = date
    })
    document.querySelectorAll('[data-needs]').forEach(function (el) {
      if (values[el.getAttribute('data-needs')]) el.hidden = false
    })
  }

  var url = new URL('version.json', document.currentScript.src)
  fetch(url, { cache: 'no-cache' })
    .then(function (response) {
      if (!response.ok) throw new Error('version.json ' + response.status)
      return response.json()
    })
    .then(function (data) {
      var version =
        typeof data.version === 'string' && VERSION_PATTERN.test(data.version) ? data.version : null
      var date =
        typeof data.date === 'string' ? formatDate(data.date, document.documentElement.lang) : null
      show(version, date)
    })
    .catch(function () {
      // Leave the version parts hidden.
    })
})()
