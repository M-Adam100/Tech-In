console.log("Running Script");

(async () => {
  let mediaRecorder;

  const stopAudio = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => { 
      stream.stop();
    })
  }

  const getAudio = (selector) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, {type: 'audio/wav'});
          const audioUrl = URL.createObjectURL(audioBlob);
          chrome.storage.local.set({
            [selector]: {
              audioUrl: audioUrl
            }
          })

        });
      });
  }

  var hr = 0;
  var min = 0;
  var sec = 0;
  var stoptime = true;

  let problemSolvingTime;
  let codingTime;
  let debuggingTime;

  function startTimer() {
    if (stoptime == true) {
      stoptime = false;
      timerCycle();
    }
  }
  function stopTimer() {
    if (stoptime == false) {
      stoptime = true;
    }
  }

  function timerCycle() {
    const timer = document.getElementById('stopwatch');

    if (stoptime == false) {
      sec = parseInt(sec);
      min = parseInt(min);
      hr = parseInt(hr);

      sec = sec + 1;

      if (sec == 60) {
        min = min + 1;
        sec = 0;
      }
      if (min == 60) {
        hr = hr + 1;
        min = 0;
        sec = 0;
      }

      if (sec < 10 || sec == 0) {
        sec = '0' + sec;
      }
      if (min < 10 || min == 0) {
        min = '0' + min;
      }
      if (hr < 10 || hr == 0) {
        hr = '0' + hr;
      }

      if (timer) timer.innerHTML = hr + ':' + min + ':' + sec;
    
      setTimeout(() => {
        timerCycle();
      }, 1000);
    }
  }

  function resetTimer() {
    timer.innerHTML = '00:00:00';
  }

  const addExtensionNode = () => {
    if (document.querySelector('#startProblem')) {
      return;
    }
    const stopwatch = document.createElement('div');
    stopwatch.className = 'mainDiv';
    const startProblem = document.createElement('div');
    startProblem.innerText = 'Start Practice';
    startProblem.id = 'startProblem';
    startProblem.innerHTML = `<button id="startProblem" class="start">Start Problem</button>`;
    stopwatch.innerHTML = `<div id="stopwatch">
        00:00:00
    </div>
`
    const navBar = document.querySelector('div[class^="navbar-right-container"]');
    navBar.insertBefore(stopwatch, navBar.firstChild);
    stopwatch.append(startProblem);
    document.getElementById('stopwatch').style.display = 'none';
    document.querySelector('button#startProblem').addEventListener('click', () => {
      getAudio('problemSolvingAudio');
      startProblem.innerHTML = `<div class="stepDiv"><span>Problem Solving</span><input id="problemSolving" type="checkbox"></input></div>`;
      document.querySelector('input#problemSolving').addEventListener('change', () => {
        mediaRecorder.stop();
        getAudio('codingAudio');
        startProblem.innerHTML = `<div class="stepDiv"><span>Coding</span><input id="coding" type="checkbox"></input></div>`
        problemSolvingTime = document.getElementById('stopwatch').innerText;
        document.querySelector('input#coding').addEventListener('change', () => {
          mediaRecorder.stop();
          getAudio('debuggingAudio');
          startProblem.innerHTML = `<div class="stepDiv"><span>Debugging</span><input id="debugging" type="checkbox"></input></div>`;
          codingTime = document.getElementById('stopwatch').innerText;

          document.querySelector('input#debugging').addEventListener('click', () => {
            debuggingTime = document.getElementById('stopwatch').innerText;
            mediaRecorder.stop();
            chrome.storage.local.set({
              'times': {
                problemSolvingTime,
                codingTime,
                debuggingTime
              }
            })

            stopwatch.remove();

            chrome.runtime.sendMessage({
              type: "timerData",
            });
          })
        })
      })

      startTimer();
    })


  }

  addExtensionNode();
})()