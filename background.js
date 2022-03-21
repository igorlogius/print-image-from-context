const manifest = browser.runtime.getManifest();
const extname = manifest.name;

browser.menus.create({
    id: extname,
    title: "Print Image",
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["image"],
    onclick: async function (info,tab) {
            const imgtab = await browser.tabs.create({
                url: info.srcUrl,
                active: true
            });
            browser.tabs.executeScript(imgtab.id, {
                code: `(function () {
                    window.print();
                    window.close();
                }());`
            });
    }
});

