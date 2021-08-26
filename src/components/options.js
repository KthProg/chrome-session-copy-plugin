import React, { useCallback, useEffect, useState } from 'react';

export const Options = () => {
    const [urlList, setUrlList] = useState([]);
    const [key, setKey] = useState('');
    
    useEffect(() => {
        chrome.storage.sync.get(['urlList', 'key'], ({ urlList, key }) => {
            setUrlList(urlList);
            setKey(key);
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
        const key = new Date().toISOString();
        newList.push({
            fromUrl: '',
            toUrl: '',
            key,
        });
        chrome.storage.sync.set({
            urlList: newList,
            key: newList.length === 1 ? key : ''
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
            key,
        });
        setKey(key);
    }, []);

    return <>
        {
            urlList.map((urls) => {
                const { fromUrl, toUrl, key: thisKey } = urls;
                return <div key={thisKey} className={key === thisKey ? 'selected' : ''}>
                    <button className="select-item" onClick={() => selectItem(thisKey)}>Select</button>
                    <label>From URL</label>
                    <input type="text" value={fromUrl} onChange={(event) => fromUrlChanged(event.target.value, thisKey)} />
                    <label>To URL</label>
                    <input type="text" value={toUrl} onChange={(event) => toUrlChanged(event.target.value, thisKey)} />
                    <button className="remove-item" onClick={() => removeItem(thisKey)}>Remove</button>
                </div>;
            })
        }
        <button onClick={addNewItem}>Add new URLs</button>
    </>;
};

export default Options;