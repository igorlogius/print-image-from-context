const manifest = browser.runtime.getManifest();
const extname = manifest.name;

let imgTabId;

browser.menus.create({
    id: extname,
    title: "Print Image",
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["image"],
    onclick: async (info,tab) => {
        const ntab = await browser.tabs.create({
            url: info.srcUrl,
            active: true
        });
        imgTabId = ntab.id;
    }
});

function handleUpdated(tabId, changeInfo, tabInfo){
    if(changeInfo.status === 'complete'){
        if(tabId === imgTabId) {
            imgTabId = null;
            // print & close
            browser.tabs.executeScript({
                code: `(function(){window.print();window.close();}())`
            });
        }
    }
}

const filter = {
  properties: ["status"]
}

// cleanup
function handleRemoved(tabId, removeInfo){
    if(tabId === imgTabId){
        imgTabId = null;
    }
}

browser.tabs.onUpdated.addListener(handleUpdated, filter);
browser.tabs.onRemoved.addListener(handleRemoved);
