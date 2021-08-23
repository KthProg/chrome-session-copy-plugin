let page = document.getElementById("buttonDiv");

function handleFromUrlChange(event) {
  const fromUrl = event.target.value;
  chrome.storage.sync.set({
    fromUrl,
  });
}

function handleToUrlChange(event) {
  const toUrl = event.target.value;
  chrome.storage.sync.set({
    toUrl,
  });
}

function initButton(property, handler){
  chrome.storage.sync.get(property, (fromUrlData) => {
    let url = fromUrlData[property];

    let input = document.getElementById(property);
    input.value = url;

    input.addEventListener("change", handler);
  });
}

// Add a button to the page for each supplied color
function initButtons() {
  initButton('fromUrl', handleFromUrlChange);
  initButton('toUrl', handleToUrlChange);
}

// Initialize the page by constructing the color options
initButtons();