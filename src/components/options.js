import React, { useCallback, useEffect, useState } from 'react';

export const Options = () => {
    const [urlList, setUrlList] = useState([]);
    const [selectedFromUrl, setSelectedFromUrl] = useState('');
    
    useEffect(() => {
        chrome.storage.sync.get('urlList', ({ urlList }) => {
            setUrlList(urlList);
        });
        chrome.storage.sync.get('selectedFromUrl', ({ selectedFromUrl }) => {
            setSelectedFromUrl(selectedFromUrl);
        });
    }, []);

    const fromUrlChanged = useCallback((fromUrl, key) => {
        const newList = urlList.map(l => l);
        const item = newList.find(l => l.key === key);
        item.fromUrl = fromUrl;
        chrome.storage.sync.set({
            urlList: newList,
        });
        setUrlList(newList);
    }, [urlList]);

    const toUrlChanged = useCallback((newToUrl, key) => {
        const newList = urlList.map(l => l);
        const item = newList.find(l => l.key === key);
        item.toUrl = newToUrl;
        chrome.storage.sync.set({
            urlList: newList,
        });
        setUrlList(newList);
    }, [urlList]);

    const addNewItem = useCallback(() => {
        const newList = urlList.map(l => l);
        newList.push({
            fromUrl: '',
            toUrl: '',
            key: new Date().toISOString()
        });
        chrome.storage.sync.set({
            urlList: newList,
        });
        setUrlList(newList);
    }, [urlList]);

    const removeItem = useCallback((key) => {
        const newList = urlList.filter(l => l.key !== key);
        chrome.storage.sync.set({
            urlList: newList,
        });
        setUrlList(newList);
    }, [urlList]);

    const selectItem = useCallback((key) => {
        chrome.storage.sync.set({
            selectedFromUrl: key,
        });
        setSelectedFromUrl(key);
    }, []);

    return <>
        {
            urlList.map((urls) => {
                const { fromUrl, toUrl, key } = urls;
                return <div key={key} className={selectedFromUrl === key ? 'selected' : ''}>
                    <button className="select-item" onClick={() => selectItem(key)}>Select</button>
                    <label>From URL</label>
                    <input type="text" value={fromUrl} onChange={(event) => fromUrlChanged(event.target.value, key)} />
                    <label>To URL</label>
                    <input type="text" value={toUrl} onChange={(event) => toUrlChanged(event.target.value, key)} />
                    <button className="remove-item" onClick={() => removeItem(key)}>Remove</button>
                </div>;
            })
        }
        <button onClick={addNewItem}>Add new URLs</button>
    </>;
};

export default Options;