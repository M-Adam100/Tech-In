chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension Installed")
});

chrome.action.onClicked.addListener(function(tab) {
    chrome.scripting.insertCSS(
        {
          target: {tabId: tab.id},
          files: ["styles/style.css"]
        },
        () => { console.log('CSS Injected') });
    chrome.scripting.executeScript(
        {
          target: {tabId: tab.id},
          files: ['scripts/timer.js']
        },
        () => { console.log("Executed Script")});
        
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "timerData")
     chrome.tabs.create({url: chrome.runtime.getURL('result.html')}, (tab => {
         console.log("Tab Opened");
     }));
 
 });