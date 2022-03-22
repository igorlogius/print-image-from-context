const manifest = browser.runtime.getManifest();
const extname = manifest.name;

browser.menus.create({
    id: extname,
    title: "Print Image",
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["image"],
    onclick: async (info,tab) => {
        browser.tabs.executeScript({
            code:`
                (function (){
                    const bodyHTML = document.body.innerHTML;
                    let i, styleSheet, styleSheets, styleSheetsNo;
                    styleSheets = document.styleSheets;
                    styleSheetsNo = styleSheets.length;

                    for (i=0; i < styleSheetsNo; i++) {
                        styleSheet = styleSheets[i];
                        styleSheet.disabled = true;
                    }
                    document.body.innerHTML = '<img id="printimg" />';
                    let img = document.getElementById('printimg');

                    img.onerror = function() {
                        document.body.innerHTML = bodyHTML;

                        styleSheets = document.styleSheets;
                        styleSheetsNo = styleSheets.length;

                        for (i=0; i < styleSheetsNo; i++) {
                            styleSheet = styleSheets[i];
                            styleSheet.disabled = false;
                        }

                        alert('Error Loading Image');
                    }
                    img.onload = function(){
                        window.print();

                        document.body.innerHTML = bodyHTML;

                        styleSheets = document.styleSheets;
                        styleSheetsNo = styleSheets.length;

                        for (i=0; i < styleSheetsNo; i++) {
                            styleSheet = styleSheets[i];
                            styleSheet.disabled = false;
                        }
                    }
                    // set src
                    img.src = "${info.srcUrl}";


                }());
            `
        });
    }
});
