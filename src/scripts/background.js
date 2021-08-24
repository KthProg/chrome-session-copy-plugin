chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('urlList', ({ urlList = {} }) => {
    chrome.storage.sync.set({
        urlList,
    });
  });
});