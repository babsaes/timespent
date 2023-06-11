function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateTimeDisplay(time) {
  const timeDisplay = document.getElementById("time-display");
  timeDisplay.textContent = formatTime(time);
}

function fetchTimeSpent() {
  chrome.runtime.sendMessage({ type: "updateTime", time: 0 }, (response) => {
    updateTimeDisplay(response.timeSpent);
  });
}

fetchTimeSpent();
setInterval(fetchTimeSpent, 1000);

document.getElementById("add-url").addEventListener("click", function() {
  const url = document.getElementById("url-input").value;
  if (url) {
    chrome.storage.local.get(["trackedUrls"], function(result) {
      const trackedUrls = result.trackedUrls || [];
      trackedUrls.push(url);
      chrome.storage.local.set({ trackedUrls }, function() {
        updateTrackedUrls();
      });
    });
  }
});

function updateTrackedUrls() {
  chrome.storage.local.get(["trackedUrls"], function(result) {
    const trackedUrls = result.trackedUrls || [];
    const trackedUrlsList = document.getElementById("tracked-urls-list");
    trackedUrlsList.innerHTML = "";
    trackedUrls.forEach((url, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = url;
      const removeButton = document.createElement("button");
removeButton.innerHTML = '&#128465;';
      removeButton.addEventListener("click", function() {
        trackedUrls.splice(index, 1);
        chrome.storage.local.set({ trackedUrls }, function() {
          updateTrackedUrls();
        });
      });
      listItem.appendChild(removeButton);
      trackedUrlsList.appendChild(listItem);
    });
  });
}

updateTrackedUrls();
