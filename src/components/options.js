import React, { useCallback, useEffect, useState } from 'react';

export const Options = () => {
    const [urlList, setUrlList] = useState({});
    const [selectedFromUrl, setSelectedFromUrl] = useState('');
    
    useEffect(() => {
        chrome.storage.sync.get('urlList', ({ urlList }) => {
            setUrlList(urlList);
        });
        chrome.storage.sync.get('selectedFromUrl', ({ selectedFromUrl }) => {
            setSelectedFromUrl(urlList);
        });
    }, []);

    const fromUrlChanged = useCallback((newFromUrl, fromUrl, toUrl) => {
        removeItem(fromUrl);
        urlList[newFromUrl] = toUrl;
        chrome.storage.sync.set({
            urlList,
        });
        setUrlList(urlList);
    }, []);

    const toUrlChanged = useCallback((newToUrl, fromUrl) => {
        urlList[fromUrl] = newToUrl;
        chrome.storage.sync.set({
            urlList,
        });
        setUrlList(urlList);
    }, []);

    const addNewItem = useCallback(() => {
        urlList[''] = '';
        chrome.storage.sync.set({
            urlList,
        });
        setUrlList(urlList);
    }, []);

    const removeItem = useCallback((fromUrl) => {
        delete urlList[fromUrl];
        chrome.storage.sync.set({
            urlList,
        });
        setUrlList(urlList);
    }, []);

    const selectItem = useCallback((fromUrl) => {
        chrome.storage.sync.set({
            selectedFromUrl: fromUrl,
        });
    }, []);

    return <>
        {
            Object.keys(urlList).map((fromUrl) => {
                const toUrl = urlList[fromUrl];
                return <div key={fromUrl} className={selectedFromUrl === fromUrl ? 'selected' : ''}>
                    <button class="select-item" onClick={() => selectItem(fromUrl)}>Select</button>
                    <label>From URL</label>
                    <input type="text" value={fromUrl} onChange={(event) => fromUrlChanged(event.target.value, fromUrl, toUrl)} />
                    <label>To URL</label>
                    <input type="text" value={toUrl} onChange={(event) => toUrlChanged(event.target.value, fromUrl)} />
                    <button class="remove-item" onClick={() => removeItem(fromUrl)}>Remove</button>
                </div>;
            })
        }
        <button onClick={addNewItem}>Add new URLs</button>
    </>;
};

export default Options;