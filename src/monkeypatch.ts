(function inject() {
  const dataHolder = document.createElement('div');
  dataHolder.setAttribute('id', 'myDataHolder');
  document.body.appendChild(dataHolder);

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type == 'attributes') {
        const event = mutation.target.getAttribute('mydata');
        console.log(event);
      }
    });
  });
  observer.observe(dataHolder, {
    attributes: true,
  });

  function monkeyPatch() {
    var open = window.XMLHttpRequest.prototype.open;
    var send = window.XMLHttpRequest.prototype.send;
    var onReadyStateChange;

    function openReplacement(method, url, async, user, password) {
        this._url = url;
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        if(this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;

        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {
        console.log('New state: ' + this.readyState + ' for URL: ' + this._url);
        if(this.readyState == 4) {
            console.log('Finished loading: ' + this._url);
            console.log('Response:', this.responseText);
        }
        if(this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }

    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;

    console.log({
      open: window.XMLHttpRequest.prototype.open,
      send: window.XMLHttpRequest.prototype.send,
    });

  }

  setTimeout(monkeyPatch, 4000);
})();
