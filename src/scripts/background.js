chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['urlList', 'key'], ({ urlList = [], key = '' }) => {
    if(!Array.isArray(urlList)){
      chrome.storage.sync.set({
          urlList: [],
      });
      return;
    }
    chrome.storage.sync.set({
        urlList,
        key: !key ? urlList?.[0]?.key : ''
    });
  });
});