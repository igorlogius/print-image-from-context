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
                    const bodyHTML = document.body.innerHTML;

                    function setBody(html,disabled_styles){

                        document.body.innerHTML = html;

                        let i, styleSheet;
                        const styleSheets = document.styleSheets;
                        const styleSheetsNo = styleSheets.length;

                        for (i=0; i < styleSheetsNo; i++) {
                            styleSheet = styleSheets[i];
                            styleSheet.disabled = disabled_styles;
                        }
                    }

                    setBody('<img id="printimg" />',true);

                    let img = document.getElementById('printimg');

                    img.onerror = function() {
                        setBody(bodyHTML,false);
                        alert('Error Loading Image');
                    }
                    img.onload = function(){
                        window.print();
                        setBody(bodyHTML,false);
                    }
                    img.src = "${info.srcUrl}";
                }());
            `
        });
    }
});

