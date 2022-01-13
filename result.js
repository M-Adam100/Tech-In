console.log("Executing Result Script");

(async () => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const drawAudio = async (selector,blob) => {
    const buffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    draw(normalizeData(filterData(audioBuffer)), selector)
};
const filterData = audioBuffer => {
  const rawData = audioBuffer.getChannelData(0); 
  const samples = 70; 
  const blockSize = Math.floor(rawData.length / samples); 
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i; 
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]); 
    }
    filteredData.push(sum / blockSize); 
  }
  return filteredData;
};

const normalizeData = filteredData => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
}

const draw = (normalizedData, selector) => {
 
  const canvas = document.querySelector(`canvas#${selector}`);
  const dpr =  window.devicePixelRatio || 1;
  const padding = 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.translate(0, canvas.offsetHeight / 2 + padding);

  const width = canvas.offsetWidth / normalizedData.length;
  for (let i = 0; i < normalizedData.length; i++) {
    const x = width * i;
    let height = normalizedData[i] * canvas.offsetHeight - padding;
    if (height < 0) {
        height = 0;
    } else if (height > canvas.offsetHeight / 2) {
        height = height > canvas.offsetHeight / 2;
    }
    drawLineSegment(ctx, x, height, width, (i + 1) % 2);
  }
};

const drawLineSegment = (ctx, x, height, width, isEven) => {
  ctx.lineWidth = 1; 
  ctx.strokeStyle = "#3B5998"; // what color our line is
  ctx.beginPath();
  height = isEven ? height : -height;
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
  ctx.lineTo(x + width, 0);
  ctx.stroke();
};



    const getTotalSeconds = (hms) => {
        const [hours, minutes, seconds] = hms.split(':');
        const totalSeconds = (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
        return totalSeconds;
    }

    const setTime = (s) => {
        const str = new Date(s * 1000).toISOString().substr(11, 8);
        return str;
    }



    chrome.storage.local.get(['times', 'problemSolvingAudio', 'codingAudio', 'debuggingAudio'], async CS => {

        let blob = await fetch(CS.problemSolvingAudio.audioUrl).then(r => r.blob());

        drawAudio("problemSolvingAudio", blob);

        blob = await fetch(CS.codingAudio.audioUrl).then(r => r.blob());

        drawAudio("codingAudio", blob);

        blob = await fetch(CS.debuggingAudio.audioUrl).then(r => r.blob());

        drawAudio("debuggingAudio", blob);


        
        // Load the audio file from your own domain !
        const totalTime = document.querySelector('#totalTime');
        const problemSolvingSeconds = getTotalSeconds(CS.times.problemSolvingTime);
        const codingSeconds = getTotalSeconds(CS.times.codingTime) - problemSolvingSeconds;
        const debuggingSeconds = getTotalSeconds(CS.times.debuggingTime) - codingSeconds - problemSolvingSeconds;
        console.log({ problemSolvingSeconds, codingSeconds, debuggingSeconds });
        const totalSeconds = problemSolvingSeconds + codingSeconds + debuggingSeconds;


        totalTime.innerText = setTime(totalSeconds);

        const problemSolvingTime = document.querySelector('#problemSolvingTime');
        problemSolvingTime.innerText = setTime(problemSolvingSeconds);

        const codingTime = document.querySelector('#codingTime');
        codingTime.innerText = setTime(codingSeconds);

        const debuggingTime = document.querySelector('#debuggingTime');
        debuggingTime.innerText = setTime(debuggingSeconds);

        const problemSolvingProgress = document.querySelector('#problemSolvingAudio');
        problemSolvingProgress.style.width = (problemSolvingSeconds / totalSeconds) * 100 + '%';

        const codingProgress = document.querySelector('#codingAudio');
        codingProgress.style.marginLeft = problemSolvingProgress.style.width;
        codingProgress.style.width = (codingSeconds / totalSeconds) * 100 + '%';

        const debuggingProgress = document.querySelector('#debuggingAudio');
        debuggingProgress.style.marginLeft = (problemSolvingSeconds / totalSeconds) * 100 + (codingSeconds / totalSeconds) * 100 + '%';
        debuggingProgress.style.width = (debuggingSeconds / totalSeconds) * 100 + '%';

    })


})()
