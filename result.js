console.log("Executing Result Script");

(async () => {

    const getTotalSeconds = (hms) => {
        const [hours, minutes, seconds] = hms.split(':');
        const totalSeconds = (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
        return totalSeconds;
    }
    
    const setTime = (s) => {
        const str =  new Date(s * 1000).toISOString().substr(11, 8);
       return str;
    }

    chrome.storage.local.get(['times'], CS => {
        const totalTime = document.querySelector('#totalTime');
        const problemSolvingSeconds = getTotalSeconds(CS.times.problemSolvingTime);
        const codingSeconds = getTotalSeconds(CS.times.codingTime) - problemSolvingSeconds;
        const debuggingSeconds = getTotalSeconds(CS.times.debuggingTime) - codingSeconds - problemSolvingSeconds;
        console.log({problemSolvingSeconds, codingSeconds, debuggingSeconds});
        const totalSeconds = problemSolvingSeconds + codingSeconds + debuggingSeconds;

        totalTime.innerText = setTime(totalSeconds);

        const problemSolvingTime = document.querySelector('#problemSolvingTime');
        problemSolvingTime.innerText = setTime(problemSolvingSeconds);

        const codingTime = document.querySelector('#codingTime');
        codingTime.innerText = setTime(codingSeconds);

        const debuggingTime = document.querySelector('#debuggingTime');
        debuggingTime.innerText = setTime(debuggingSeconds);

        const problemSolvingProgress = document.querySelector('#problemSolvingProgress');
        problemSolvingProgress.style.width = (problemSolvingSeconds/totalSeconds)*100 + '%';   
        
        const codingProgress = document.querySelector('#codingProgress');
        codingProgress.style.marginLeft =  problemSolvingProgress.style.width;
        codingProgress.style.width = (codingSeconds/totalSeconds)*100 + '%';    

        const debuggingProgress = document.querySelector('#debuggingProgress');
        debuggingProgress.style.marginLeft =  (problemSolvingSeconds/totalSeconds)*100 +  (codingSeconds/totalSeconds)*100 + '%';
        debuggingProgress.style.width = (debuggingSeconds/totalSeconds)*100 + '%';  

    })


})()
