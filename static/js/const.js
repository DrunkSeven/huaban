const obj = { "ONMOUSEUP": "onmouseup", "ONMOUSEDOWN": "onmousedown", "ONMOUSEMOVE": "onmousemove", "GOPAGE": "goPage", "PREPAGE": "prePage", "NEXTPAGE": "nextPage", "CANCEL": "cancel", "SHOWSIGN": "showSign", "SHOWANSWER": "showAnswer", "FINISHANSWER": "finishAnswer", "STUDENTSIGN": "studentSign", "STUDENTANSWER": "studentAnswer", "CLEAR": "clear", "SOCKET_URL": "", 'wb': {} };
(function (obj) {
  for (let key in obj) {
    window[key] = obj[key]
  }
}(obj))
