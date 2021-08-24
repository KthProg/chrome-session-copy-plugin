import React, { useCallback, useEffect, useState } from 'react';

export const Options = () => {
    const [urlList, setUrlList] = useState({});
    const [selectedFromUrl, setSelectedFromUrl] = useState('');
    
    useEffect(() => {
        chrome.storage.sync.get('urlList', ({ urlList }) => {
            setUrlList(urlList);
        });
        chrome.storage.sync.get('selectedFromUrl', ({ selectedFromUrl }) => {
            setSelectedFromUrl(selectedFromUrl);
        });
    }, []);

    const fromUrlChanged = useCallback((fromUrl, urls) => {
        urls.fromUrl = fromUrl;
        chrome.storage.sync.set({
            urlList,
        });
        setUrlList(urlList);
    }, []);

    const toUrlChanged = useCallback((newToUrl, urls) => {
        urls.toUrl = newToUrl;
        chrome.storage.sync.set({
            urlList,
        });
        setUrlList(urlList);
    }, []);

    const addNewItem = useCallback(() => {
        urlList.push({
            fromUrl: '',
            toUrl: '',
            key: new Date().toISOString()
        });
        chrome.storage.sync.set({
            urlList,
        });
        setUrlList(urlList);
    }, []);

    const removeItem = useCallback((key) => {
        const newList = urlList.filter(l => l.key !== key);
        chrome.storage.sync.set({
            urlList: newList,
        });
        setUrlList(newList);
    }, []);

    const selectItem = useCallback((key) => {
        chrome.storage.sync.set({
            selectedFromUrl: key,
        });
    }, []);

    return <>
        {
            urlList.map((urls) => {
                const { fromUrl, toUrl, key } = urls;
                return <div key={key} className={selectedFromUrl === key ? 'selected' : ''}>
                    <button class="select-item" onClick={() => selectItem(key)}>Select</button>
                    <label>From URL</label>
                    <input type="text" value={fromUrl} onChange={(event) => fromUrlChanged(event.target.value, urls)} />
                    <label>To URL</label>
                    <input type="text" value={toUrl} onChange={(event) => toUrlChanged(event.target.value, urls)} />
                    <button class="remove-item" onClick={() => removeItem(key)}>Remove</button>
                </div>;
            })
        }
        <button onClick={addNewItem}>Add new URLs</button>
    </>;
};

export default Options;