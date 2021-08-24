import { useCallback, useEffect, useState } from "react";

export default Options = () => {
    const [urlList, setUrlList] = useState({});
    
    useEffect(() => {
        chrome.storage.sync.get('urlList', ({ urlList }) => {
            setUrlList(urlList);
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
            Object.keys(urlList).map(fromUrl => {
                const toUrl = urlList[fromUrl];
                return <div key={fromUrl}>
                    <button class="select-item" onClick={() => selectItem(fromUrl)} />
                    <input type="text" value={fromUrl} onChange={(event) => fromUrlChanged(event.target.value, fromUrl, toUrl)} />
                    <input type="text" value={toUrl} onChange={(event) => toUrlChanged(event.target.value, fromUrl)} />
                    <button class="remove-item" onClick={() => removeItem(fromUrl)} />
                <div/>;
            })
        }
        <button onClick={addNewItem}>Add new URLs</button>
    </>;
};