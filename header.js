var yo = require('yo-yo')
var csjs = require('csjs-inject')
var vkey = require('vkey')


var styles = csjs`.mainHeader {
  overflow: hidden;
  width: 400px;
  position: fixed;
  height: 40px;
  border-bottom: 1px rgba(0,0,0,0.1) solid;
  z-index: 2;
  background: hsla(225, 7%, 94%, .6);
}

.innerHeader {
  transform: translate3d(0px, 0px, 0px);
  backdrop-filter: blur(6px);
  width: 400px;
  height: 40px;
}

.title {
  font-family: Montserrat;
  width: 70%;
  position: absolute;
  top: 17px;
  left: 15%;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.title:hover span {
  border-bottom: 1px #aaa dashed;
  display: inline-block;
}

.input {
  height: 18px;
  width: 70%;
  font-size: 12px;
  font-family: "Helvetica Neue";
  font-weight: 200;
  outline: none;
  position: absolute;
  top: 13px;
  left: 14%;
  padding: 1px 1%;
}

.back, .forward, .reload {
  position: absolute;
  top: 16px;
  font-size: 17px;
  color: #ccc;
  cursor: default;
}

.back {
  left: 12px;
}

.forward {
  left: 35px;
}

.reload {
  top: 14px;
  right: 12px
}

.active {
  color: #444;
}

.active:hover {
  color: #000;
  font-weight: bold;
}`

var lastOptions = {}
module.exports = function Header(options, changeUrlCallback, currentTab) {
  function render(options) {
    options = Object.assign({}, lastOptions, options)
    lastOptions = options
    var { title, showUrl, url, canGoBack, canGoForward } = options

    var input = yo`<input class="${styles.input}" onkeydown=${onkeydown} value=${url || ''}></input>`
    var header = yo`<div class="${styles.mainHeader}">
      <div class="${styles.innerHeader}">
        <div onclick=${goBack} class="${styles.back} ${canGoBack ? styles.active : ''}">˂</div>
        <div onclick=${goForward} class="${styles.forward} ${canGoForward ? styles.active : ''}">˃</div>
        ${showUrl ?
          input :
          yo`<div id="pageTitle" class="${styles.title}" onclick=${showUrlInput}>
            <span>${title}</span>
          </div>`
        }
        <div onclick=${reload} class="${styles.reload} ${styles.active}">↻</div>
      </div>
    </div>`
    if (showUrl) {
      setTimeout(() => {
        input.focus()
        input.select()
      })
    }
    return header
  }


  var rendered = render(options);
  document.querySelector(options.$).appendChild(rendered)

  function goBack() {
    currentTab().goBack();
  }

  function goForward() {
    currentTab().goForward();
  }

  function reload() {
    currentTab().reload();
  }

  function showUrlInput() {
    yo.update(rendered, render({ showUrl: true }))
  }

  function onkeydown (e) {
    if (vkey[e.keyCode] === '<enter>') {
      changeUrlCallback(e.currentTarget.value)
    }

    if (vkey[e.keyCode] === '<escape>') {
      yo.update(rendered, render({ showUrl: false }))
    }
  }

  return options => yo.update(rendered, render(options))
}
