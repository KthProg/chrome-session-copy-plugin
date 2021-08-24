chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('urlList', ({ urlList = [] }) => {
    if(!Array.isArray(urlList)){
      chrome.storage.sync.set({
          urlList: [],
      });
      return;
    }
    chrome.storage.sync.set({
        urlList,
    });
  });
});