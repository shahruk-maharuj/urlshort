function isValidURL(string) {
    var res = string.match(
      /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    );
    return res !== null;
  }
  
  function showTooltip(id) {
    document.getElementById(id).classList.remove('hidden');
    setTimeout(() => {
      document.getElementById(id).classList.add('hidden');
    }, 3000);
  }
  
  function copyToClipboard() {
    const el = document.createElement("textarea");
    el.value = document.querySelector("#result a").href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    document.getElementById("audio").play();
    showTooltip('result-tooltip');
  }
  
  function shortenURL() {
    const url = document.getElementById("url-input").value;
    if (!isValidURL(url)) {
      showTooltip('url-input-tooltip');
      return;
    }
    document.getElementById("spinner").classList.remove("hidden");
    fetch("https://api.shrtco.de/v2/shorten?url=" + url)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("result").innerHTML =
          "Shortened URL: <a href='" + data.result.full_short_link + "' target='_blank'>" + data.result.full_short_link + "</a>";
        document.getElementById("copy-button").classList.remove("hidden");
        Cookies.set("url", url, { expires: 7 });
        Cookies.set("shortenedUrl", data.result.full_short_link, { expires: 7 });
        document.getElementById("audio").play();
      })
      .catch((error) => {
        document.getElementById("spinner").classList.add("hidden");
        alert("An error occurred while shortening the URL.");
        console.error("Error:", error);
      });
  }
  
  window.onload = function () {
    const url = Cookies.get("url");
    const shortenedUrl = Cookies.get("shortenedUrl");
    if (url && shortenedUrl) {
      document.getElementById("url-input").value = url;
      document.getElementById("result").innerHTML =
        "Shortened URL: <a href='" + shortenedUrl + "' target='_blank'>" + shortenedUrl + "</a>";
      document.getElementById("copy-button").classList.remove("hidden");
    }
  };
  