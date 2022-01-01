console.log("Running Script");

(async () => {

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

      timer.innerHTML = hr + ':' + min + ':' + sec;

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
    document.querySelector('button#startProblem').addEventListener('click', () => {
      startProblem.innerHTML = `<div class="stepDiv"><span>Problem Solving</span><input id="problemSolving" type="checkbox"></input></div>`;
      document.querySelector('input#problemSolving').addEventListener('change', () => {
        startProblem.innerHTML = `<div class="stepDiv"><span>Coding</span><input id="coding" type="checkbox"></input></div>`
        problemSolvingTime = document.getElementById('stopwatch').innerText;
        document.querySelector('input#coding').addEventListener('change', () => {
          startProblem.innerHTML = `<div class="stepDiv"><span>Debugging</span><input id="debugging" type="checkbox"></input></div>`;
          codingTime = document.getElementById('stopwatch').innerText;

          document.querySelector('input#debugging').addEventListener('click', () => {
            debuggingTime = document.getElementById('stopwatch').innerText;
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