const manifest = browser.runtime.getManifest();
const extname = manifest.name;

browser.menus.create({
    id: extname,
    title: "Print Image",
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["image"],
    onclick: (info,tab) => {
        browser.tabs.executeScript({
            code:`
                (function (){
                    let htmlElement = document.getElementsByTagName("html")[0];

                    const oldHTML = htmlElement.innerHTML;

                    htmlElement.innerHTML = '<head/><body><img id="printimg" /></body>';

                    let img = document.getElementById('printimg');

                    img.onerror = function() {
                        htmlElement.innerHTML = oldHTML;
                        alert('Error Loading Image');
                    }
                    img.onload = function(){
                        window.print();
                        htmlElement.innerHTML = oldHTML;
                    }
                    img.src = "${info.srcUrl}";
                }());
            `
        });
    }
});

