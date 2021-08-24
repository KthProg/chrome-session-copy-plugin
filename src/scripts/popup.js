const copySessionButton = document.getElementById('copySession');

copySessionButton.addEventListener('click', async () => {
  chrome.storage.sync.get(['urlList', 'selectedFromUrl'], async ({ urlList, selectedFromUrl }) => {
    const item = urlList.find(l => l.key === selectedFromUrl);
    const { fromUrl, toUrl } = item;

    const [tabFrom] = await chrome.tabs.query({ url: fromUrl });
    const [tabTo] = await chrome.tabs.query({ url: toUrl });

    const copySessionPromise = new Promise((resolve) => {
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

const copySession = () => {
  const storageCopy = {};
  Object.keys(sessionStorage).forEach(key => {
    storageCopy[key] = sessionStorage.getItem(key);
  });
  return storageCopy;
};

const setSession = (data) => {
  Object.keys(data).forEach(key => {
    sessionStorage.setItem(key, data[key]);
  });
};