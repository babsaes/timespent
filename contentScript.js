function init() {

chrome.runtime.sendMessage({ type: "setTrackedWebsiteStatus", value: true });

window.addEventListener("beforeunload", () => {
  chrome.runtime.sendMessage({ type: "setTrackedWebsiteStatus", value: false });
});

function createTimeDisplayElement() {
  const timeDisplayElement = document.createElement("div");
  timeDisplayElement.id = "time-display";
  timeDisplayElement.style.position = "fixed";
  // timeDisplayElement.style.left = "10px";
  timeDisplayElement.style.top = "10%";
    timeDisplayElement.style.left = "50%";
    // timeDisplayElement.style.transform = "translate(-50%, -50%)";
  timeDisplayElement.style.fontFamily = "'Arial', sans-serif";  // Add this line

timeDisplayElement.style.textAlign = "center";

    timeDisplayElement.style.textContent = "center";
   timeDisplayElement.style.fontWeight = "normal";

  timeDisplayElement.style.padding = "12px 20px";
  timeDisplayElement.style.backgroundColor = "rgba(30,30,30,0.7)";
  timeDisplayElement.style.backdropFilter = "blur(33px)";

 timeDisplayElement.style.width = "230px";  
  timeDisplayElement.style.minHeight = "24px";  
 timeDisplayElement.style.lineHeight = "1.5";  

  timeDisplayElement.style.color = "#f8f8f8";
  timeDisplayElement.style.minWidth = "260px";
timeDisplayElement.style.boxShadow = "0 10px 15px rgb(0 0 0 / 20%)";
  timeDisplayElement.style.zIndex = "9999";
  timeDisplayElement.style.fontSize = "20px";
  timeDisplayElement.style.border = "0px solid #1e1e1e";
  timeDisplayElement.style.borderRadius = "8px";
  timeDisplayElement.style.overflow = "hidden";  // Add scroll bars if necessary

  return timeDisplayElement;
}

function makeDraggable(element) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener("mousedown", (event) => {
    isDragging = true;
    offsetX = event.clientX - element.offsetLeft;
    offsetY = event.clientY - element.offsetTop;
    element.style.transform = ""; // remove the transform
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    let newLeft = event.clientX - offsetX;
    let newTop = event.clientY - offsetY;

    // Check boundaries
    newLeft = Math.min(Math.max(newLeft, 0), window.innerWidth - element.offsetWidth);
    newTop = Math.min(Math.max(newTop, 0), window.innerHeight - element.offsetHeight);
    
    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mouseleave", () => {
    isDragging = false;
  });
}


function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const timeDisplayElement = createTimeDisplayElement();
document.body.appendChild(timeDisplayElement);
makeDraggable(timeDisplayElement);


setTimeout(() => {
  const rect = timeDisplayElement.getBoundingClientRect();
  timeDisplayElement.style.left = `${window.innerWidth / 2 - rect.width / 2}px`;
  // timeDisplayElement.style.top = `${window.innerHeight / 2 - rect.height / 2}px`;
}, 0);


setInterval(() => {
  chrome.runtime.sendMessage({ type: "updateTime", time: 1000 }, (response) => {
    timeDisplayElement.textContent = `⏳
 Time spent: ${formatTime(response.timeSpent)}`;
  });
}, 1000);


}

const hostname = window.location.hostname;

chrome.storage.local.get(["trackedUrls"], function(result) {
  const trackedUrls = result.trackedUrls || [];
  const hostname = window.location.hostname;
  if (trackedUrls.find(url => hostname.includes(url))) {
    init();
  }
});