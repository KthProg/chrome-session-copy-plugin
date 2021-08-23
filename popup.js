// Initialize button with user's preferred color
let copySessionButton = document.getElementById("copySession");


// When the button is clicked, inject setPageBackgroundColor into current page
copySessionButton.addEventListener("click", async () => {
  chrome.storage.sync.get(['fromUrl', 'toUrl'], async ({ fromUrl, toUrl }) => {
    let [tabFrom] = await chrome.tabs.query({ url: fromUrl });
    let [tabTo] = await chrome.tabs.query({ url: toUrl });

    const copySessionPromise = new Promise((resolve, reject) => {
      chrome.scripting.executeScript({
        target: { tabId: tabFrom.id },
        function: copySession,
      }, (sessionData) => {
        resolve(sessionData);
      });
    });

    const sessionDataCopy = await copySessionPromise;

    chrome.scripting.executeScript({
      target: { tabId: tabTo.id },
      function: setSession,
      args: [sessionDataCopy[0].result]
    });
  });
});

// The body of this function will be executed as a content script inside the
// current page
function copySession() {
  const storageCopy = {};
  Object.keys(sessionStorage).forEach(key => {
    storageCopy[key] = sessionStorage.getItem(key);
  });
  return storageCopy;
}

function setSession(data) {
  Object.keys(data).forEach(key => {
    sessionStorage.setItem(key, data[key]);
  });
}