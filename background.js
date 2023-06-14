let timeSpent = 0;
let lastUpdateTime = new Date();
let isOnTrackedWebsite = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ timeSpent: 0, lastUpdateTime: new Date(), currentWebsite: '' });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "updateTime") {
    const currentTime = new Date();
    if (lastUpdateTime.getDate() !== currentTime.getDate() ||
        lastUpdateTime.getMonth() !== currentTime.getMonth() ||
        lastUpdateTime.getFullYear() !== currentTime.getFullYear()) {
      timeSpent = 0;
    }

    if (isOnTrackedWebsite) {
      timeSpent += request.time;
    }

    lastUpdateTime = currentTime;

    chrome.storage.local.set({ timeSpent, lastUpdateTime });
    sendResponse({ timeSpent });
  }
  else if (request.type === "setTrackedWebsiteStatus") {
    const url = new URL(sender.tab.url);
    chrome.storage.local.get("currentWebsite", ({ currentWebsite }) => {
      if (currentWebsite !== url.hostname) {
        timeSpent = 0;
        chrome.storage.local.set({ currentWebsite: url.hostname, timeSpent });
      }
    });

    isOnTrackedWebsite = request.value;
  }

  return true;
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const url = new URL(tab.url);
    chrome.storage.local.get(["trackedUrls"], function(result) {
      const trackedUrls = result.trackedUrls || [];
      isOnTrackedWebsite = trackedUrls.some(trackedUrl => url.hostname.includes(trackedUrl));
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const url = new URL(tab.url);
    chrome.storage.local.get(["trackedUrls"], function(result) {
      const trackedUrls = result.trackedUrls || [];
      isOnTrackedWebsite = trackedUrls.some(trackedUrl => url.hostname.includes(trackedUrl));
    });
  }
});
