chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension Installed")
});

chrome.action.onClicked.addListener(function(tab) {
    console.log(tab);
    chrome.scripting.insertCSS(
        {
          target: {tabId: tab.id},
          css: "styles/style.css",
        },
        () => { console.log('CSS Injected') });
    chrome.scripting.executeScript(
        {
          target: {tabId: tab.id},
          files: ['scripts/timer.js']
        },
        () => { console.log("Executed Script")});
    
});